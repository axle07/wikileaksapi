var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var rateLimit = require("express-rate-limit");
var ObjectId = mongodb.ObjectID;

var EMAIL_COLLECTION = "emails";
var RATE_LIMIT_MAX_REQUESTS = process.env.RATE_LIMIT_MAX_REQUESTS;
var RATE_LIMIT_TIME_PERIOD = process.env.RATE_LIMIT_TIME_PERIOD;
var RATE_LIMIT_THROTTLE_TIME = process.env.RATE_LIMIT_THROTTLE_TIME;


var app = express();

var limiter = new rateLimit({
    windowMs: process.env.RATE_LIMIT_TIME_PERIOD,
    max: process.env.RATE_LIMIT_MAX_REQUESTS,
    delayMs: process.env.RATE_LIMIT_THROTTLE_TIME
});

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use('/clinton-emails/', limiter);

var db;

/**
*   process.env.MONGODB_URI is mapped to MONGODB_URI as an environmental variable
*   so that needs to be setup on any machines using the db.
*   format is: mongodb://localhost:27017/clintonEmails
*   TODO remove db from connectionstring so one server can handle multiple leaks.
*/
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    db = database;

    var server = app.listen(process.env.PORT || 8080, function() {
        var port = server.address().port;
        console.log("App now running on port", port);
    });
});

// Static Routes

app.use(express.static('public'));

// API Routes

// Generic error handler used by all endpoints
function handleError(res, reason, message, code) {
    console.log("Error: " + reason);
    res.status(code || 500).json({"error": message});
}

/* "/emails/:id"
 *      GET: finds emails by id
 */

app.get("/clinton-emails/:id", function(req, res) {
    db.collection(EMAIL_COLLECTION).findOne({id: parseInt(req.params.id)}, function(err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to get email");
        } else {
            res.status(200).json(doc);
        }
    });
});

