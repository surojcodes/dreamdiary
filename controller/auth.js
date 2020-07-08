const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const slugify = require('slugify');
const Dream = require('../models/Dream');
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
    const { name, email } = req.body;
    const pwd = req.body.password;
    const cpwd = req.body.cpassword;
    if (!name || !email || !pwd || !cpwd) {
        errors.push({ msg: 'Please fill all the fields' });
    }
    if (pwd.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters long' });
    }
    if (pwd != cpwd) {
        errors.push({ msg: 'Passwords do not match' });
    }
    if (errors.length > 0) {
        return res.render('register', { errors, name, email })
    }
    try {
        let user = await User.findOne({ email });
        if (user) {
            errors.push({ msg: 'Email address already registered!' });
            return res.render('register', { errors, name, email })
        }
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(pwd, salt);
        const toSlugify = `${name}-${email.split('@')[0]}-${Date.now()}`;
        const username = slugify(toSlugify, { lower: true });
        user = {
            name, email, password, username
        }

        await User.create(user);
        return res.render('login', {
            success: 'Account created, you can now log in!'
        });
    } catch (err) {
        // // mongoose duplicate key
        // if (err.code === 11000) {
        //     errors.push({ msg: 'Email address already registered!' });
        //     return res.render('register', { errors, name, email })
        // }
        console.log(err);
        res.render('error/500');
    }
}
exports.forgotPassword = (req, res, next) => {
    res.render('forgotPassword');
}
exports.loadDashboard = async (req, res, next) => {
    const dreams = await Dream.find({ user: req.user.id }).lean();
    res.render('dashboard_dreams', {
        layout: 'dashboard',
        name: req.user.name,
        email: req.user.email || null,
        dreams,
        count: dreams.length
    });
}
exports.logOut = (req, res, next) => {
    req.logOut();
    req.flash('success_msg', 'You have been logged Out!');
    res.redirect('/auth/login');
}
