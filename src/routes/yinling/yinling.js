/**
 * Created by Administrator on 2017/9/21.
 */
var express = require('express');
var router = express.Router();
var tokenName = require('../../data/config.json').tokenName;

router.get('/', function (req, res, next) {
    res.render('yinling/login', {
        title: '英灵--登录',
        layout: 'layoutyinling',
        noFooter: true
    });
});

//英灵夺宝
router.get('/active2', function (req, res, next) {
    var token = req.cookies[tokenName];
    if (token) {
        res.render('yinling/active/active2', {
            title: '夺宝',
            layout: 'layoutyinling',
            tabFlag: 3
        });
    } else {
        //微信分享的战线，点击其它的按钮要去引导层
        res.redirect('/users/sharefuli');
    }
});

//英灵个人中心
router.get('/user', function (req, res, next) {
    res.render('yinling/userscenter', {
        title: '个人中心',
        layout: 'layoutyinling',
        tabFlag: 4
    });
});


module.exports = router;