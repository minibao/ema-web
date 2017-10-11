/**
 * Created by B-04 on 2017/7/12.
 */

var express = require('express');
var router = express.Router();
var tokenName = require('../data/config.json').tokenName;


router.get('/active', function (req, res, next) {
    var token = req.cookies[tokenName];
    // var str = req.query;
    if (token) {
        res.render('active_lottery/zhuanpan', {
            title: '社区福利',
            layout: 'layout',
            tabFlag: 2
        });
    } else {
        //微信分享的战线，点击其它的按钮要去引导层
        res.redirect('/users/sharefuli');
    }
});

// router.get('/active2', function (req, res, next) {
//     var token = req.cookies[tokenName];
//     if (token) {
//         res.render('active_lottery/fanpai', {
//             title: '社区福利',
//             layout: 'layout',
//             tabFlag: 3
//         });
//     } else {
//         //微信分享的战线，点击其它的按钮要去引导层
//         res.redirect('/users/sharefuli');
//     }
// });

router.get('/active3', function (req, res, next) {
    res.render('active_lottery/shake', {
        title: 'active_lottery',
        layout: 'layout',
        tabFlag: 2
    });
});

module.exports = router;