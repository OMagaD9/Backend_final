const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    isAdmin: { type: Boolean, default: false },
    username: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
