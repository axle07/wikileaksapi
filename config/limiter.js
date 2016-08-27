// config/limiter.js

// load lib
var rateLimit = require("express-rate-limit");
var config = require("./config.js");

module.exports = new rateLimit({
    windowMs: config.rateTimePeriod,
    max: config.maxRequests,
    delayMs: config.rateThrotTime
});

