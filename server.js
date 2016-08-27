// Load libs
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var passport = require('passport');
var flash = require('connect-flash');
var UserModel = require('./models/user');
var bodyParser = require('body-parser');
var session = require('express-session');

// Load config and envrionmental vars
var config = require('./config/config');
var limiter = require('./config/limiter');

// Load DB connections
var db = require('./config/databases');

// Setup passport with config
require('./config/passport.js')(passport);

// spin up app
var app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use('/clinton-emails/', limiter);
app.set('view engine', 'ejs');
app.use(bodyParser());
app.use(session({ secret: "alargewellfedarmadilloisahappycreature" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


var server = app.listen(process.env.PORT || 8080, function() {
    var port = server.address().port;
    console.log("App now running on port", port);
});

// TODO refactor routes out to their own file.

// Routes
app.get("/", function(req, res) {
    res.render("index.ejs", { user: req.user });
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

app.post("/regenerate", isLoggedIn, function(req, res) {
    var model = new UserModel();
    var key = model.generateApiKey();

    var conditions = { email: req.user.email },
        update = { $set: { api_key: key } };

    db.users.collection(config.usersCollection).update(conditions, update, function(err, doc){
        if (err)
            handleError(res, err.message, "Failed to regenerate key");
    });

    res.redirect("/profile");
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

// API key middleware
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
