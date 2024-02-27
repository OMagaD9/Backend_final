const mongoose = require('mongoose');

const mangaSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Ссылка на пользователя
    search: { type: String }, 
    createdAt: { type: Date, default: Date.now },
    mangaList: [{
        cover: { type: String, required: true },
        title: String,
        chapters: Number,
        genres: [String],
        provider_url: String,
    }],
});

module.exports = mongoose.model('Manga', mangaSchema);
