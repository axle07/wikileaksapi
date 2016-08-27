// config/config.js
module.exports = {

    emailCollection: process.env.EMAIL_COLLECTION,
    usersCollection: process.env.USERS_COLLECTION,
    mongoDbUri: process.env.MONGODB_URI,
    userDbUri: process.env.USERDB_URI,
    maxRequests: process.env.RATE_LIMIT_MAX_REQUESTS,
    rateTimePeriod: process.env.RATE_LIMIT_TIME_PERIOD,
    rateThrotTime: process.env.RATE_LIMIT_THROTTLE_TIME,
    sessionSecret: process.env.SESSION_SECRET,

}
