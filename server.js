var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectId = mongodb.ObjectID;

var EMAIL_COLLECTION = "emails";

var app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

var db;

mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    db = database;
    console.log("Database connection ready");

    var server = app.listen(process.env.PORT || 8080, function() {
        var port = server.address().port;
        console.log("App now running on port", port);
    });
});

// API Routes

// Generic error handler used by all endpoints
function handleError(res, reason, message, code) {
    console.log("Error: " + reason);
    res.status(code || 500).json({"error": message});
}

/* "/emails/:id"
 *      GET: finds emails by id
 */

app.get("/emails/:id", function(req, res) {
    db.collection(EMAIL_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
        if (err) {
            hadleError(res, err.message, "Failed to get email");
        } else {
            res.status(200).json(doc);
        }
    });
});

