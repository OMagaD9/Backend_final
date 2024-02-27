const express = require('express');

const router = express.Router();


router.post('/',(req, res) => {

    const { lang } = req.body;
    if (lang && (lang === 'en' || lang === 'ru' || lang === 'kz' || lang === 'es')) {
        res.cookie('lang', lang);
        res.status(200).send('Language updated successfully');
    } else {
        res.status(400).send('Invalid language'); 
    }
});

module.exports = router;