const redis = require('../util/redis');
const { heroes } = require('../words');

exports.startGame = async({ io, socket, round_length, numRounds }) => {
    try{
        const roomID = socket.roomID
        let roomData = JSON.parse(await redis.get(roomID))
        if(socket.id === roomData.host) {
            
            // Ensure there is more than 1 player
            const members = Object.keys(io.sockets.adapter.rooms[roomID].sockets)
            if(members.length <= 1) return

            roomData.gameStarted = true
            await redis.set(roomID, JSON.stringify(roomData))

            socket.broadcast.to(roomID).emit("game started", round_length)
            
            // Redis object
            newGame({
                roomID,
                members,
                round_length,
                numRounds,
                socket
            })
            
            turn({
                io,
                socketID: socket.id,
                roomID
            })
        }
    }
    catch(err){
        console.log(err)
    }
}

const newGame = async({ roomID, members, round_length, numRounds, socket }) => {
    try {
        members.unshift(roomID + " members")
        await redis.rpush(members)
        
        await redis.set(roomID + " round", JSON.stringify({
            round_length,
            numRounds,
            currentRound: 1,
            turn: socket.id
        }))
    }
    catch(err) {
        console.log(err)
    }
}

exports.startGuessing = async({ socket, word, roomID }) => {
    try{
        const roundData = JSON.parse(await redis.get(roomID + " round"))

        if(roundData !== null && !roundData.word) {
            await redis.set(roomID + " round", JSON.stringify({
                ...roundData,
                word,
                startTime: new Date()
            }))

            socket.broadcast.to(roomID).emit("start guessing", word.length)
        }
    }
    catch(err){
        console.log(err)
    }
}

exports.validateWord = async({ io, socket, word }) => {
    const { word: correctAnswer, startTime, round_length } = JSON.parse(await redis.get(socket.roomID + " round"))
    let color = "red"

    if(socket.currentScore){
        color = "black"
    }
    else if(word.toLowerCase() === correctAnswer) {
        // Calculates score for the round
        const score = Math.ceil(round_length - ((new Date() - new Date(startTime)) / 1000))
        socket.currentScore = score 
        socket.score += score
        
        
        socket.emit("your score", score)
        
        const name = io.sockets.connected[socket.id].memberDetails.name

        socket.emit("guesses", {
            socketID: socket.id,
            sender: name,
            message: word,
            color: "green"
        })
        
        socket.broadcast.to(socket.roomID).emit("guesses", {
            sender: "Server",
            message: `${name} got it right!`,
            color: 'black'
        })
        
        const moveToNextTurn = await everyoneAnsweredCorrectly({ io, socket, roomID: socket.roomID })
        if(moveToNextTurn) {
            this.nextTurn({ io, socket })
        }
        
        return
    }

    io.sockets.in(socket.roomID).emit("guesses", {
        socketID: socket.id,
        sender: io.sockets.connected[socket.id].memberDetails.name,
        message: word,
        color
    })
}

const everyoneAnsweredCorrectly = async({ io, socket, roomID }) => {
    try {
        const { turn, startTime } = JSON.parse(await redis.get(roomID + " round"))
    
        if(new Date() - new Date(startTime) < 2000) {
            return false
        }
        
        const sockets = Object.keys(io.sockets.adapter.rooms[roomID].sockets)
        for(let socketID of sockets) {
            if(socketID !== turn && !io.sockets.connected[socketID].currentScore) {
                return false
            }
        }
        return true
    }
    catch(err) {
        console.log(err)
        socket.emit("something broke")
    }
}

const turn = async({ io, socketID, roomID, prevWord }) => {
    numTotalheroes = heroes.length
    /*  A Set to store randomly selected heroes' indices. Set provides constant time lookup 
        which is feasible to verify whether word has already been selected or not
    */
    const selectedIndices = new Set()
    const selectedheroes = []
    
    for(let i = 0; i < 3; i++){
        let randomIndex = Math.floor(Math.random() * numTotalheroes)
        
        // To prevent repetition
        while(selectedIndices.has(randomIndex)){
            randomIndex = Math.floor(Math.random() * numTotalheroes)
        }
        
        selectedIndices.add(randomIndex)
        selectedheroes.push(heroes[randomIndex])
    }
    
    // Send selected heroes to next player
    io.sockets.in(socketID).emit("turn", selectedheroes)
    
    const socket = io.sockets.connected[socketID]
    socket.broadcast.to(roomID).emit("someone choosing word", socket.memberDetails.name)
    
    if(prevWord) {
        io.sockets.in(roomID).emit("guesses", {
            sender: "Server",
            message: `Correct answer: ${prevWord}`,
            color: 'black'
        })
    }
}

exports.nextTurn = async({ io, socket }) => {
    try {
        const roomID = socket.roomID
        const sockets = await redis.lrange(roomID + " members", 0, -1)

        let roundData = JSON.parse(await redis.get(roomID + " round"))
        if(roundData === null) return 
        
        let turnIndex = sockets.indexOf(roundData.turn)
        if(turnIndex === sockets.length - 1){
            turnIndex = 0
            let { numRounds, currentRound } = roundData
            
            if(numRounds === currentRound){
                const scores = this.scoreManagement({ io, socket, roomID })
                io.sockets.in(roomID).emit("game over", scores)
                return
            }
            currentRound += 1
            roundData.currentRound = currentRound
        }
        else{
            turnIndex += 1
        }
        
        this.scoreManagement({ io, socket, roomID })
        turn({ io, socketID: sockets[turnIndex], roomID, prevWord: roundData.word })
        
        roundData.turn = sockets[turnIndex]
        roundData.word = undefined
        await redis.set(roomID + " round", JSON.stringify(roundData))
    
    } catch (err) {
        console.log(err)
        socket.emit("something broke")
    }
}

exports.scoreManagement = ({ io, socket, roomID }) => {
    let scoreSum = 0  
    numMembers = 0
    const sockets = Object.keys(io.sockets.adapter.rooms[roomID].sockets)
    
    for(let socketID of sockets) {
        const currentScore = io.sockets.connected[socketID].currentScore
        
        if(currentScore){
            scoreSum += currentScore
        }
        
        io.sockets.connected[socketID].currentScore = undefined
        numMembers += 1
    }
    
    const drawerScore = Math.ceil(scoreSum / numMembers) 
    socket.score += drawerScore
    if(drawerScore > 0){
        socket.emit("your score", drawerScore)
    }
    
    let updatedScores = sockets.map(socketID => {
        const socketData = io.sockets.connected[socketID]
        return {
            socketID: socketData.id,
            memberDetails: socketData.memberDetails,
            score: socketData.score
        }
    })
    
    updatedScores = updatedScores.sort((a, b) => {
        if(a.score > b.score){
            return -1
        }
        return 1
    })
    
    io.sockets.in(roomID).emit("updated scores", updatedScores)
    return updatedScores
}