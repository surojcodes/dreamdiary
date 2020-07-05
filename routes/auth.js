
/*
    @desc  This file will be resposible for authentication routes.
*/

const express = require('express');
const passport = require('passport');
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const { showLoginForm, showRegisterForm, register, forgotPassword, loadDashboard, logOut, addDream } = require('../controller/auth');

const router = express.Router();

router.route('/login').get(ensureGuest, showLoginForm).
    post(ensureGuest, passport.authenticate(['local', 'google',], {
        scope: 'profile',
        successRedirect: '/auth/dashboard',
        failureRedirect: '/auth/login',
        failureFlash: true
    }));

router.route('/register').get(ensureGuest, showRegisterForm).post(ensureGuest, register);
router.route('/forgot-password').get(ensureAuth, forgotPassword);
router.route('/dashboard').get(ensureAuth, loadDashboard);
router.route('/dashboard/add-dream').get(ensureAuth, addDream);
router.route('/logout').get(logOut);

// router.route('/google').get(passport.authenticate('google', { scope: ['profile'] }));
router.route('/google/callback').get(passport.authenticate('google',
    { failureRedirect: '/auth/login' }),
    (req, res) => {
        res.redirect('/auth/dashboard');
    });

module.exports = router;
