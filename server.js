// Load libs
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var passport = require('passport');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var session = require('express-session');

// Load config and envrionmental vars
var limiter = require('./config/limiter');

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

// Routes
require('./routes/static')(app, passport);
require('./routes/clinton-emails')(app, passport);

var server = app.listen(process.env.PORT || 8080, function() {
    var port = server.address().port;
    console.log("App now running on port", port);
});

