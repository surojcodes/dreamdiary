const mongoose = require('mongoose');
const Dream = require('../models/Dream');
const slugify = require('slugify');

exports.showAddDreamForm = (req, res, next) => {
    res.render('dashboard_add_dream', {
        layout: 'dashboard',
        name: req.user.name,
        email: req.user.email || null
    });
}

exports.addDream = async (req, res, next) => {
    let errors = [];
    const { title, excerpt, content, tags, visibility } = req.body;
    if (!title || !excerpt || !content) {
        errors.push({ msg: 'Please add all the required fields' });
    }
    if (excerpt.length > 100) {
        errors.push({ msg: 'Excerpt cannot be longer than 100 characters' });
    }
    if (errors.length > 0) {
        return res.render('dashboard_add_dream', {
            layout: 'dashboard',
            errors, title, excerpt, content, tags, visibility
        });
    }
    try {
        req.body.user = req.user.id;
        req.body.slug = slugify(req.body.title, { lower: true });

        await Dream.create(req.body);
        req.flash('success_msg', 'Dream logged successfully!');
        res.redirect('/auth/dashboard');
    } catch (err) {
        console.log(err);
        res.render('error/500');
    }
}

exports.showPublicDreams = async (req, res, next) => {
    try {
        const dreams = await Dream.find({ visibility: 'public' }).sort('-createdAt').populate('user').lean();
        res.render('dreams', {
            dreams
        });
    } catch (err) {
        console.log(err);
        res.render('error/500');
    }
}
exports.loadDream = async (req, res, next) => {
    try {
        const dream = await Dream.findOne({ slug: req.params.slug }).populate('user').lean();
        if (!dream || dream.visibility == 'private') {
            res.render('error/404');
        }
        console.log(dream);
        res.render('dream', {
            dream
        });
    } catch (err) {
        console.log(err);
        res.render('error/500');
    }
}