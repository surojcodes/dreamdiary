const express = require('express');
const dotenv = require('dotenv');
const exphbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');

const passport = require('passport');
require('./config/passport_local')(passport);

const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const connectDB = require('./config/db');

const app = express();

// configue to use env vars
dotenv.config({ path: './config/config.env' });

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// connect to mongodb
connectDB();

// set view engine to handlebars and use .hbs extension
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

//static resource folder
app.use(express.static(path.join(__dirname, 'public')));

// session and flash messages
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(passport.initialize());
app.use(passport.session());

//global vars for flash messages
app.use((req, res, next) => {
    res.locals.error = req.flash('error');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.success_msg = req.flash('success_msg');
    next();
});



//Register Route 
app.use('/', require('./routes/web'));
app.use('/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});