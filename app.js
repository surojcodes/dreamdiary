const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const app = express();

// configue to use env vars
dotenv.config({ path: './config/config.env' });

// connect to mongodb
connectDB();

//Register Route 
app.get('/', (req, res) => {
    res.send('<h1>Welcome to Dream Diary</h1>');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});