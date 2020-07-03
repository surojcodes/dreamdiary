/*
    @desc  This file will be resposible for authentication routes.
*/

const express = require('express');
const { login, register, forgotPassword, loadDashboard, addDream } = require('../controller/auth');
const router = express.Router();

router.route('/login').get(login);
router.route('/register').get(register);
router.route('/forgot-password').get(forgotPassword);
router.route('/dashboard').get(loadDashboard);
router.route('/dashboard/add-dream').get(addDream);



module.exports = router;
