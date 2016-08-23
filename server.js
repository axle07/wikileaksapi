var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var rateLimit = require("express-rate-limit");
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

// Needed due to version of express
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var ObjectId = mongodb.ObjectID;

var EMAIL_COLLECTION = "emails";
var RATE_LIMIT_MAX_REQUESTS = process.env.RATE_LIMIT_MAX_REQUESTS;
var RATE_LIMIT_TIME_PERIOD = process.env.RATE_LIMIT_TIME_PERIOD;
var RATE_LIMIT_THROTTLE_TIME = process.env.RATE_LIMIT_THROTTLE_TIME;
var USER_DB_URI = "mongodb://localhost:27017/users"; // TODO set this up as a environmental var

var app = express();

var limiter = new rateLimit({
    windowMs: process.env.RATE_LIMIT_TIME_PERIOD,
    max: process.env.RATE_LIMIT_MAX_REQUESTS,
    delayMs: process.env.RATE_LIMIT_THROTTLE_TIME
});

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use('/clinton-emails/', limiter);
app.set('view engine', 'ejs');
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

// Setup auth stuff
mongoose.connect(USER_DB_URI);

require('./config/passport.js')(passport); // pass passport for config
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

app.use(session({ secret: "alargewellfedarmadilloisahappycreature" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// TODO refactor routes out to their own file.

// Routes
app.get("/", function(req, res) {
    res.render("index.ejs");
});

app.get("/profile", isLoggedIn, function(req, res) {
    res.render("profile.ejs", { user: req.user });
});

app.get("/signup", function(req, res) {
    res.render("signup.ejs", { message: req.flash('signupMessage') });
});

app.post("/signup", passport.authenticate('local-signup', {
    successRedirect: "/profile",
    failureRedirect: "/signup",
    failureFlash: true
}));

app.get("/login", function(req, res) {
    res.render("login.ejs", { message: req.flash('loginMessage') });
});

app.post("/login", passport.authenticate('local-login', {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true
}));

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});


// API Routes

// Generic error handler used by all endpoints
function handleError(res, reason, message, code) {
    console.log("Error: " + reason);
    res.status(code || 500).json({"error": message});
}

// Logged in middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect("/");
}

/*
 *      GET: finds emails by id
 */

app.get("/clinton-emails/id/:id", function(req, res) {
    db.collection(EMAIL_COLLECTION).findOne({id: parseInt(req.params.id)}, function(err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to get email");
        } else {
            res.status(200).json(doc);
        }
    });
});

/*
 *      GET: finds emails by sender
 */

app.get("/clinton-emails/from/:from", function(req, res) {
    db.collection(EMAIL_COLLECTION).find({from: req.params.from}).toArray( function(err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to get email");
        } else {
            console.log(doc)
            res.status(200).json(doc);
        }
    });
});

/*
 *      GET: finds emails by recipient
 */

app.get("/clinton-emails/to/:to", function(req, res) {
    db.collection(EMAIL_COLLECTION).find({to: req.params.to}).toArray( function(err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to get email");
        } else {
            console.log(doc)
            res.status(200).json(doc);
        }
    });
});

/*
 *      GET: finds emails by subject
 */

app.get("/clinton-emails/subject/:subject", function(req, res) {
    db.collection(EMAIL_COLLECTION).find({subject: req.params.subject}).toArray( function(err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to get email");
        } else {
            console.log(doc)
            res.status(200).json(doc);
        }
    });
});


