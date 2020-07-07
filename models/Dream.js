const mongoose = require('mongoose');
const DreamSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    slug: String,
    excerpt: {
        type: String,
        trim: true,
        required: true
    },
    visibility: {
        type: String,
        enum: ['public', 'private'],
        default: private
    },
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Dream', DreamSchema);