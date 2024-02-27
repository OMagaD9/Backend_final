const jwt = require('jsonwebtoken');
require('dotenv').config();

const navbar = (req, res, next) => {
    res.locals.loggedIn = req.cookies.token ? true : false;
    res.locals.lang = req.cookies.lang || 'en'; // Default to 'en' if lang cookie is not set
    if (req.cookies.token) {
        const decodedToken = jwt.decode(req.cookies.token);
        res.locals.admin = decodedToken.isAdmin ? true : false;
    } else {
        res.locals.admin = false;
    }
    next();
};

module.exports = navbar;
