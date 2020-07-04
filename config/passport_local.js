const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = (passport) => {
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
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
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        await User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}