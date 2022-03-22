var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var config = require('./config')

var check_auth = require('./check_auth');
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var game1Router = require('./routes/game1');
var game1DownloadTempRouter = require('./routes/download_game1_template');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
    origin: config.REACT_SERVER_URL,
}));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/game1/template', game1DownloadTempRouter);

app.use(check_auth);

app.use('/game1', game1Router);

module.exports = app;
