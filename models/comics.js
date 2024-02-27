const mongoose = require('mongoose');

const comicsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    search: { type: String }, 
    createdAt: { type: Date, default: Date.now },
    comicsList: [{
        cover: { type: String, required: true },
        title: String,
        issue_number: String,
        cover_date: Date,
        site_detail_url: String,
    }],
});

module.exports = mongoose.model('Comics', comicsSchema);
