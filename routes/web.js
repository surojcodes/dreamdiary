/*
    @desc  This route file will be resposible to route to website pages like contact, about etc.
*/
const express = require('express');
const { loadIndex, loadBlog } = require('../controller/web');

const router = express.Router();

router.route('/').get(loadIndex);
router.route('/blog').get(loadBlog);

module.exports = router;