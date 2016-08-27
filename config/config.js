// config/config.js
module.exports = {

    emailCollection: "emails",
    usersCollection: "users",
    mongoDbUri: process.env.MONGODB_URI,
    userDbUri: "mongodb://localhost:27017/users", // TODO set this up as an environmental variable
    maxRequests: process.env.RATE_LIMIT_MAX_REQUESTS,
    rateTimePeriod: process.env.RATE_LIMIT_TIME_PERIOD,
    rateThrotTime: process.env.RATE_LIMIT_THROTTLE_TIME,

}
