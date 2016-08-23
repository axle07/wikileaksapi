// models/user.js

var mongoose = require('mongoose'),
    bcrypt   = require('bcrypt-nodejs'),
    uuid     = require('node-uuid');

// Schema definition for User model
var userSchema = mongoose.Schema({
    email   : String,
    password: String,
    api_key : String
});

// Methods
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateApiKey = function () {
    return uuid.v4();
};

module.exports = mongoose.model('User', userSchema);
