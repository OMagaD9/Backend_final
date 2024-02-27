const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
var methodOverride = require('method-override')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const i18n = require('i18n');
const middlewareNavbar = require('./middleware/navbar');
const validToken = require('./middleware/validToken');
const ifLogined = require('./middleware/ifLogined');

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to Database');
    })
    .catch(err => console.error(err));

const app = express();
//start seting
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser()); // Move cookieParser before i18n.init

i18n.configure({
    locales: ['en', 'ru', 'kz', 'es'],
    directory: __dirname + '/languages',
    defaultLocale: 'en',
    cookie: 'lang',
});
app.use(i18n.init);

app.use(methodOverride('_method'))
app.use(express.static('public'));
//end setting
app.use(middlewareNavbar);
app.use('/language', require('./utils/language'));
app.use('/register', ifLogined, require('./routes/register'));
app.use('/login', ifLogined, require('./routes/login'));
app.use('/manga', validToken, require('./routes/manga'));
app.use('/comics', validToken, require('./routes/comics'));
app.use('/profile', validToken, require('./routes/profile'));
app.use('/admin', validToken, require('./routes/admin'));
app.use('/logout', validToken, require('./routes/logout'));
app.use('/', validToken, require('./routes/main'));

app.listen(process.env.PORT, () => {
    console.log('Server is running on port ' + process.env.PORT);
});