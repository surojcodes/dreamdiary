const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { default: slugify } = require('slugify');


module.exports = (passport) => {
    passport.use('google', new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ googleId: profile.id }).lean();
            if (user) {
                done(null, user);
            } else {
                const toSlugify = `${profile.displayName}-${profile.id}`;
                user = await User.create({
                    googleId: profile.id,
                    name: profile.displayName,
                    username: slugify(toSlugify, { lower: true })

                });
                done(null, user);
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
    passport.use('local', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            //find the user
            const user = await User.findOne({ email });
            if (!user) {
                // console.log('no user with that email');
                return done(null, false, { message: 'User with that email does not exist' });
            }
            //check the password using a method in User model
            if (!await bcrypt.compare(password, user.password)) {
                // console.log('incorrect password');
                return done(null, false, { message: 'Password is incorrect' });
            } else {
                done(null, user);
            }
        } catch (error) {
            console.log(error);
            return done(error);
        }
    }));
    passport.use('facebook', new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:5000/auth/facebook/callback"
    },
        async (accessToken, refreshToken, profile, done) => {
            // console.log(profile);
            try {
                let user = await User.findOne({ facebookId: profile.id });
                if (user) {
                    done(null, user);
                } else {
                    const toSlugify = `${profile.displayName}-${profile.id}`;
                    user = await User.create({
                        facebookId: profile.id,
                        name: profile.displayName,
                        username: slugify(toSlugify, { lower: true }),
                    });
                    done(null, user);
                }
            } catch (error) {
                // console.error(error);
                done(error);
            }
        }
    ));
    passport.serializeUser((user, done) => done(null, user._id));
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user));
    });
}