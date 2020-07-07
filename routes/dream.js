
const express = require('express');
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const { showAddDreamForm, addDream, showPublicDreams, loadDream, showUserDreams } = require('../controller/dream');

const router = express.Router();
router.route('/').get(showPublicDreams);
router.route('/add-dream').get(ensureAuth, showAddDreamForm).post(ensureAuth, addDream);
router.route('/user/:username').get(showUserDreams);
router.route('/:slug').get(loadDream);

module.exports = router;
