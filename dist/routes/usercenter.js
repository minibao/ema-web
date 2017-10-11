/**
 * Created by B-04 on 2017/7/12.
 */
var express = require('express');
var router = express.Router();
var tokenName = require('../data/config.json').tokenName;

router.get('/', function (req, res, next) {
    var token = req.cookies[tokenName];
    if (token) {
        res.render('userscenter', {
            title: '个人中心',
            layout: 'layout',
            tabFlag: 4,
            count_unsend: 8
        });
    } else {
        res.redirect('/users/sharefuli');
    }
});

router.get('/wxpay', function (req, res, next) {
    var token = req.cookies[tokenName];
    if (token) {
        res.render('userscenter', {
            title: '个人中心',
            layout: 'layout',
            tabFlag: 4,
            count_unsend: 8
        });
    } else {
        res.redirect('/users/sharefuli');
    }
});

router.get('/upimg', function (req, res, next) {
    res.render('uploadimg', {
        title: '头像上传',
        layout: false,
        noFooter: true
    });

});


module.exports = router;