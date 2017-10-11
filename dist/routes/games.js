/**
 * Created by B-04 on 2017/7/25.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.redirect("/games/fish");
});

router.get('/fish', function (req, res, next) {
    res.render('games/fish', {
        title: '抓鱼',
        layout: false
    });
});

module.exports = router;
