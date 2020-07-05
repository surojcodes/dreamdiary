const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    password: {
        type: String,
        minlength: 6,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    googleId: {
        type: String,
        default: null
    }
});
module.exports = mongoose.model('User', UserSchema)