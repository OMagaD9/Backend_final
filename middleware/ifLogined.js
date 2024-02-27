const jwt = require('jsonwebtoken');
require('dotenv').config();

const ifLogined = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.clearCookie('token');
                return res.redirect('/login');
            } else {
                return res.redirect('/');
            }
        });
    } else {
        return next();
    }
};

module.exports = ifLogined;