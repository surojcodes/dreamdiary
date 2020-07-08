const mongoose = require('mongoose');
const Dream = require('../models/Dream');
const User = require('../models/User');
const slugify = require('slugify');

/*
@desc   Show add dream page
@route  GET /dreams/add-dream
*/
exports.showAddDreamForm = (req, res, next) => {
    res.render('dashboard_add_dream', {
        layout: 'dashboard',
        name: req.user.name,
        email: req.user.email || null
    });
}
/*
@desc   Add a  dream
@route  POST /dreams
*/
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
/*
@desc   Returns all  public dreams form all users
@route  GET /dreams
*/

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
/*
@desc   Return a specifuc public dream
@route  GET /dreams/:slug
*/
exports.loadDream = async (req, res, next) => {
    try {
        const dream = await Dream.findOne({ slug: req.params.slug }).populate('user').lean();
        if (!dream || dream.visibility == 'private') {
            return res.render('error/400', { message: 'Dream Not Found!', status: 404 });
        }
        // console.log(dream);
        res.render('dream', {
            dream
        });
    } catch (err) {
        console.log(err);
        res.render('error/500');
    }
}
/*
@desc   Return a user's public dreams
@route  GET /dreams/user/:username
*/
exports.showUserDreams = async (req, res, next) => {
    try {
        let user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.render('error/400', { message: 'User Not Found!', status: 404 });
        }
        const dreams = await Dream.find({ user: user['id'], visibility: 'public' }).populate('user').lean();
        user = await User.findOne({ username: req.params.username }).lean();
        res.render('userdreams', {
            dreams, user
        });
    } catch (error) {
        console.log(error);
        res.render('error/500');
    }
}

/*
@desc   Show form to edit dream
@route  GET /dreams/edit/:slug
*/
exports.loadEditDreamForm = async (req, res, next) => {
    try {
        const dream = await Dream.findOne({ slug: req.params.slug }).lean();
        if (!dream) {
            return res.render('error/400', { message: 'Dream Not Found!', status: 404 });
        }
        if (dream.user != req.user.id) {
            return res.render('error/400', { message: 'Not authorized!', status: 401 });
        }
        res.render('dashboard_edit_dream', {
            layout: 'dashboard',
            dream
        });
    } catch (error) {
        console.log(error);
        res.render('error/500');
    }
}

/*
@desc   Update dream
@route  PUT   /dreams/edit/:slug
*/
exports.UpdateDream = async (req, res, next) => {
    try {
        const dream = await Dream.findOne({ slug: req.params.slug });
        if (!dream) {
            return res.render('error/400', { message: 'Dream Not Found!', status: 404 });
        }
        if (dream.user != req.user.id) {
            return res.render('error/400', { message: 'Not authorized!', status: 401 });
        }
        //validate
        let errors = [];
        const { title, excerpt, content, tags, visibility } = req.body;
        if (!title || !excerpt || !content) {
            errors.push({ msg: 'Please add all the required fields' });
        }
        if (excerpt.length > 100) {
            errors.push({ msg: 'Excerpt cannot be longer than 100 characters' });
        }
        if (errors.length > 0) {
            return res.render('dashboard_edit_dream', {
                layout: 'dashboard',
                errors, title, excerpt, content, tags, visibility
            });
        }
        //update dream
        dream.title = title;
        dream.slug = slugify(title, { lower: true });
        dream.excerpt = excerpt;
        dream.content = content;
        dream.tags = tags;
        dream.visibility = visibility;

        await dream.save();

        req.flash('success_msg', 'Dream updated successfully!');
        res.redirect('/auth/dashboard');
    } catch (error) {
        console.log(error);
        res.render('error/500');
    }
}


/*
@desc   Delete dream
@route  DELETE /dreams/delete/:slug
*/
exports.deleteDream = async (req, res, next) => {
    try {
        const dream = await Dream.findOne({ slug: req.params.slug });
        if (!dream) {
            return res.render('error/400', { message: 'Dream Not Found!', status: 404 });
        }
        if (dream.user != req.user.id) {
            return res.render('error/400', { message: 'Action Not authorized!', status: 401 });
        }
        await dream.remove();
        req.flash('success_msg', 'Dream deleted successfully!');
        res.redirect('/auth/dashboard');

    } catch (error) {
        console.log(error);
        res.render('error/500');
    }
}