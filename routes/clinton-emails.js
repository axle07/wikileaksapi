// routes/clinton-emails.js

// load reqs
var config = require('../config/config');
var db = require('../config/databases');
var handleError = require('../middleware/handleError');
var isValidKey = require('../middleware/isValidKey');

module.exports = function (app, passport) {
    /*
     *      GET: finds emails by id
     */
    app.get("/clinton-emails/id/:key/:id", isValidKey, function(req, res) {
        db.emails.collection(config.emailCollection).findOne({ id: parseInt(req.params.id)}, function(err, doc) {
            if (err)
                handleError(res, err.message, "Failed to get email");

            res.status(200).json(doc);
        });
    });

    /*
    *      GET: finds emails by sender
    */
    app.get("/clinton-emails/from/:key/:from", isValidKey, function(req, res) {
        db.emails.collection(config.emailCollection).find({from: req.params.from}).toArray( function(err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to get email");
            } else {
                res.status(200).json(doc);
            }
        });
    });

    /*
     *      GET: finds emails by recipient
     */
    app.get("/clinton-emails/to/:key/:to", isValidKey, function(req, res) {
        db.emails.collection(config.emailCollection).find({to: req.params.to}).toArray( function(err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to get email");
            } else {
                res.status(200).json(doc);
            }
        });
    });

    /*
     *      GET: finds emails by subject
     */
    app.get("/clinton-emails/subject/:key/:subject", isValidKey, function(req, res) {
        db.emails.collection(config.emailCollection).find({subject: req.params.subject}).toArray( function(err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to get email");
            } else {
                res.status(200).json(doc);
            }
        });
    });
}
