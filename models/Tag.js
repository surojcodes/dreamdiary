const mongoose = require('mongoose');
const TagSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Tag', TagSchema);