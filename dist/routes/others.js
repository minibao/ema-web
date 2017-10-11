/**
 * Created by Administrator on 2017/8/22.
 */

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/menubar', function (req, res, next) {
    res.render('others/menubar_download', {
        title: '英灵官方下载',
        layout: false
    });
});

// router.get('others/menubar', function (req, res, next) {
//     res.render('others/menubar_doonload', {
//         title: '英灵官方下载',
//         layout: false
//     });
// });

module.exports = router;
