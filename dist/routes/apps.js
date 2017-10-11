/**
 * Created by B-04 on 2017/8/8.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/ciyuan', function(req, res, next) {
    res.render('apps/ciyuan', {
        title: '选区',
        noFooter: true
    });
});

module.exports = router;
