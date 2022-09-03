const redis = require("async-redis")

let redisClient = "redis://127.0.0.1"


const client = redis.createClient(redisClient)

client.auth(err => {
    if(err) {
        throw err;
    }
    console.log("redis connected")
});

module.exports = client