const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Manga = require('../models/manga');
const Comics = require('../models/comics');
const passwordChangeUser = require('../utils/passwordChangeUser');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const decodedToken = jwt.decode(req.cookies.token);
        const userId = decodedToken.userId;

        let userManga = await Manga.find({ userId }).select('search createdAt').lean();
        let userComics = await Comics.find({ userId }).select('search createdAt').lean();

        userManga = userManga.sort((a, b) => b.createdAt - a.createdAt);
        userComics = userComics.sort((a, b) => b.createdAt - a.createdAt);

        res.render('profile', { userManga, userComics });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.delete('/', async (req, res) => {
    try {
        const decodedToken = jwt.decode(req.cookies.token);
        const userId = decodedToken.userId;
        await User.findOneAndDelete({ _id: userId });
        res.clearCookie('token');
        res.redirect('/logout');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting account');
    }
});

router.put('/', async (req, res) => {
    const { password, newPassword, confirmPassword } = req.body;

    const decodedToken = jwt.decode(req.cookies.token);
    const userId = decodedToken.userId;
    let userManga = await Manga.find({ userId }).select('search createdAt').lean();
    let userComics = await Comics.find({ userId }).select('search createdAt').lean();

    userManga = userManga.sort((a, b) => b.createdAt - a.createdAt);
    userComics = userComics.sort((a, b) => b.createdAt - a.createdAt);

    // Validate password change
    const validation = await passwordChangeUser(password, newPassword, confirmPassword, userId);
    if (!validation.success) {
        return res.render('profile', {userManga, userComics, errorMessage: validation.message });
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const user = await User.findOneAndUpdate({ _id: userId }, { password: hashedPassword }, { new: true });
        if (!user) {
            return res.status(404).send('User not found');
        }
        
        return res.render('profile', { userManga, userComics, successMessage: 'Password changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error changing password');
    }
});


module.exports = router;
