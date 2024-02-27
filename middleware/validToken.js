const jwt = require('jsonwebtoken');
require('dotenv').config();

const validToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.clearCookie('token');
        return res.redirect('/login');
    }
};

module.exports = validToken;