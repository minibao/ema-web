/**
 * Created by B-04 on 2017/5/17.
 */
var express = require('express');
var router = express.Router();
var tokenName = require('../data/config.json').tokenName;
/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect("/topic/active2");
});

router.get('/demo', function(req, res, next) {
    res.render('demo', {
        title: '大V指路',
        tabFlag: 3
    });
});

router.get('/active2', function (req, res, next) {
    var token = req.cookies[tokenName];
    if (token) {
        res.render('active_lottery/fanpai', {
            title: '夺宝',
            layout: 'layout',
            tabFlag: 3
        });
    } else {
        //微信分享的战线，点击其它的按钮要去引导层
        res.redirect('/users/sharefuli');
    }
});

router.get('/list', function(req, res, next) {
    res.render('topic_list', {
        title: '大V指路'
    });
});

router.get('/add', function(req, res, next) {
    res.render('topic_add', {
        title: '大V指路'
    });
});

module.exports = router;
