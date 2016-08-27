// middleware/isValidKey.js

// Load reqs
var config = require('../config/config');
var db = require('../config/databases');
var handleError = require('./handleError');

function isValidKey(req, res, next) {
    var key = req.params.key;

    db.users.collection(config.usersCollection).findOne({ api_key: key}, function(err, doc) {
        if (err)
            handleError(res, err.message, "Failed to get user");
        if (!doc)
            handleError(res, "Invalid API key", "Invalid API key");
        if (doc)
            return next();
    });
}

module.exports = isValidKey;
