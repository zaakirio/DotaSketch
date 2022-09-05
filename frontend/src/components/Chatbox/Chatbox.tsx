import React, { useCallback, useRef, useEffect } from 'react';
import useStore from '../../state/Store';
import useGameStore from '../../state/Game';
import useChatsStore from '../../state/Chats';
import GuessInput from '../GuessInput/GuessInput';
import { Card, CardContent } from '@material-ui/core';
import './Chatbox.css';

const Chatbox: React.FC = () => {
    const getSocket = useStore(useCallback(state => state.getSocket, []))

    const myTurn = useGameStore(useCallback(state => state.myTurn, []))

    const chats = useChatsStore(useCallback(state => state.chats, []))

    const chatboxRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if(!chatboxRef.current) return
        chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight
    }, [chats])

    const submitGuess = (e: React.FormEvent, guess: string) => { 
        e.preventDefault()
        getSocket().emit("guess", guess)
    }

    return (
        <Card>
            <CardContent id="chatboxContainer">
                <div id="chatbox" ref={chatboxRef} style={{ height: myTurn ? '100%' : '85%' }}>
                    {chats.map((chat, index) => (
                        <div className="guessContainer" key={index}>
                            <p style={{ color: chat.color }}><b>{chat.socketID === getSocket().id ? "You" : chat.sender}</b>{": " + chat.message}</p>
                        </div>
                    ))}
                </div>
                {!myTurn && 
                    <div>
                        <GuessInput submitGuess={submitGuess} />
                    </div>
                }
            </CardContent>
        </Card>
    )
}

export default React.memo(Chatbox)