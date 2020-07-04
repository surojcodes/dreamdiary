const mongoose = require('mongoose');
const User = require('../models/User');

/*
@desc   To show login form
@route  GET /auth/login
*/
exports.showLoginForm = (req, res, next) => {
    res.render('login');
}
/*
@desc   To show registration form
@route  GET /auth/register
*/
exports.showRegisterForm = (req, res, next) => {
    res.render('register');
}

/*
@desc   To register a user
@route  POST /auth/register
*/
exports.register = async (req, res, next) => {
    let errors = [];
    const { name, email, password, cpassword } = req.body;
    if (!name || !email || !password || !cpassword) {
        errors.push({ msg: 'Please fill all the fields' });
    }
    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters long' });
    }
    if (password != cpassword) {
        errors.push({ msg: 'Passwords do not match' });
    }
    if (errors.length > 0) {
        return res.render('register', { errors, name, email })
    }
    try {
        let user = {
            name, email, password
        }
        await User.create(user);
        return res.render('login', {
            success: 'Account created, you can now log in!'
        });
    } catch (err) {
        // mongoose duplicate key
        if (err.code === 11000) {
            errors.push({ msg: 'Email address already registered!' });
            return res.render('register', { errors, name, email })
        }
        res.render('error/500');
    }
}
exports.forgotPassword = (req, res, next) => {
    res.render('forgotPassword');
}
exports.loadDashboard = (req, res, next) => {
    res.render('dashboard_dreams', {
        layout: 'dashboard',
    });
}
exports.addDream = (req, res, next) => {
    res.render('dashboard_add_dream', {
        layout: 'dashboard',
    });
}