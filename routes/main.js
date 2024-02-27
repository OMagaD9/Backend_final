const express = require('express');
const router = express.Router();
const Item = require('../models/mainPage');

router.get('/', async (req, res) => {
    try {
        const items = await Item.find();
        res.render('main', { items ,lang: req.cookies.lang });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
