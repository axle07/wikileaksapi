// config/databases.js

// load libs
var config = require('./config.js');
var mongodb = require('mongodb');
var mongoose = require('mongoose');

mongodb.MongoClient.connect(config.mongoDbUri, function (err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    module.exports.emails = database;
    console.log("emails_db is connected.");
});

mongodb.MongoClient.connect(config.userDbUri, function (err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    module.exports.users = database;
    console.log("users_db is connected.");
});

// mongoose connect for user Schema manipulation
mongoose.connect(config.userDbUri);
