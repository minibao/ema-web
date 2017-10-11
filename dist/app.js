var express = require('express');
var compression = require('compression');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var proxy = require('proxy-middleware');
var hbs = require('hbs');
var helpers = require('handlebars-helpers');
var fs = require('fs');
var backApi = require("../process.json");

var app = express();

/* Setup Handlebars */
hbs.registerPartials(__dirname + '/views/partials/');
hbs.registerHelper('raw', function (options) {
    return options.fn(this);
});
hbs.registerHelper('section', function (name, options) {
    this.sections = this.sections || {};
    this.sections[name] = options.fn(this);
    return null;
});

hbs.registerHelper('json', function (obj, options) {
    return JSON.stringify(obj);
});

hbs.localsAsTemplateData(app);
helpers(hbs);


/* Setup Application */
app.disable('x-powered-by');
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

app.use('/h5', express.static(__dirname + '/views'));


var envMap = {
    development: 'testing-',
    test: 'testing-',
    staging: 'staging-',
    production: ''
};

var suffix = envMap[process.env.NODE_ENV];
suffix = suffix === undefined ? 'testing-' : suffix;

var portMap = {
    development: ':8443',
    test: ':8443',
    staging: '',
    production: ''
};

var reqPort = portMap[process.env.NODE_ENV];
reqPort = reqPort === undefined ? ':8443' : reqPort;


/* External Routes */
app.use('/pf', proxy(backApi[process.env.NODE_ENV]["pf"]));
app.use('/bi', proxy(backApi[process.env.NODE_ENV]["bi"]));
// app.use('/bo', proxy(backApi[process.env.NODE_ENV]["bo"]));
// app.use('/pms', proxy(backApi[process.env.NODE_ENV]["pm"]));
app.use('/wxapi', proxy('https://api.weixin.qq.com'));


/* Global MiddleWares */
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

/* Static MiddleWare */
app.use('/static', express.static(__dirname + '/static'));

/* Common Routes */
app.use(require('./middlewares/authentication'));
// app.use(require('./middlewares/common'));

/* API Routes */
app.use('/api', require('./routes/api'));

// uncomment after placing your favicon in /static
// app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));

/* Website Routes */
app.locals.static_url = backApi[process.env.NODE_ENV]["STATIC_URL"] || process.env.STATIC_URL || '/static';

app.use(require('./routes/index'));

app.use('/users', require('./routes/users'));

app.use('/apps', require('./routes/apps'));

app.use('/usercenter', require('./routes/usercenter'));

app.use('/active', require('./routes/active'));

app.use('/topic', require('./routes/topic'));

app.use('/game', require('./routes/games'));

app.use('/others', require('./routes/others'));

app.use('/yinling', require('./routes/yinling/yinling'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            noFooter: true
        });
    });
}

// production error handler
// no stacktrace leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        noFooter: true
    });
});

process.on("uncaughtException",function (err) {
    console.log(err);
    console.log(err.stack);
});


module.exports = app;