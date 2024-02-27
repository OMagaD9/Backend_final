const mongoose = require('mongoose');

const mainPage = new mongoose.Schema({
    nameEn: {
        type: String,
        required: true
    },
    nameRus: {
        type: String,
        required: true
    },
    descriptionEn: {
        type: String,
        required: true
    },
    descriptionRus: {
        type: String,
        required: true
    },
    imageURL1: {
        type: String,
        required: true
    },
    imageURL2: {
        type: String,
        required: true
    },
    imageURL3: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Item', mainPage);
