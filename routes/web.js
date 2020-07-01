/*
    @desc  This route file will be resposible to route to website pages like contact, about etc.
*/
const express = require('express');
const { loadIndex } = require('../controller/web');
const router = express.Router();

router.route('/').get(loadIndex);

module.exports = router;