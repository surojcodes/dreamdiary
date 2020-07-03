const express = require('express');
const dotenv = require('dotenv');
const exphbs = require('express-handlebars');
const path = require('path');

const connectDB = require('./config/db');

const app = express();

// configue to use env vars
dotenv.config({ path: './config/config.env' });

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

//Register Route 
app.use('/', require('./routes/web'));
app.use('/auth', require('./routes/auth'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});