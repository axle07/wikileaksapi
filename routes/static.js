// routes/static.js

// Load reqs
var config = require('../config/config');
var db = require('../config/databases');
var UserModel = require('../models/user');
var isLoggedIn = require('../middleware/isLoggedIn');
var handleError = require('../middleware/handleError');

module.exports = function (app, passport) {

    /*
     *  GET: Loads the home page
     */
    app.get("/", function(req, res) {
        res.render("index.ejs", { user: req.user });
    });

    /*
     *  GET: Loads profile page if user is logged in
     */
    app.get("/profile", isLoggedIn, function(req, res) {
        res.render("profile.ejs", { user: req.user });
    });

    /*
     *  GET: Loads the signup page
     */
    app.get("/signup", function(req, res) {
        // Check if Production and no SSL
        if (config.environment != "dev" && req.headers['x-forwarded-proto'] != "https") {
            res.redirect("https://www.leaksapi.com/signup");
        } else {
            res.render("signup.ejs", { message: req.flash('signupMessage') });
        }
    });

    /*
     *  POST: Submits the signup form
     */
    app.post("/signup", passport.authenticate('local-signup', {
        successRedirect: "/profile",
        failureRedirect: "/signup",
        failureFlash: true
    }));

    /*
     *  GET: Loads the login page
     */
    app.get("/login", function(req, res) {
        // Check if Production and no SSL
        if (config.environment != "dev" && req.headers['x-forwarded-proto'] != "https") {
            res.redirect("https://www.leaksapi.com/signup");
        } else {
            res.render("login.ejs", { message: req.flash('loginMessage') });
        }
    });

    /*
     *  POST: Submits the login form
     */
    app.post("/login", passport.authenticate('local-login', {
        successRedirect: "/profile",
        failureRedirect: "/login",
        failureFlash: true
    }));

    /*
     *  GET: Logs the user out
     */
    app.get("/logout", function(req, res) {
        req.logout();
        res.redirect("/");
    });

    /*
     *  POST: Replaces user's api_key with a freshly generated one
     */
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

    /*
     * GET: temp routes for lets encrypt confirmation
     */
    app.get("/.well-known/acme-challenge/Wpu6fyQ43iMguzsL3x7d7gU78LAX96OH3ylXFqWN_Jc", function(req, res) {
        res.send(config.letsEncryptKey);
    });

    app.get("/.well-known/acme-challenge/7pWz7MAY93P38RmkBq6kPrLLrsTelgsdmWap3C9De6E", function(req, res) {
        res.send(config.letsEncryptKey2);
    });

}
