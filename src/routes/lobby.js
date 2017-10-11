/**
 * Created by Administrator on 2017/9/21.
 */
var express = require('express');
var router = express.Router();

//社区大厅
router.get('/', function (req, res, next) {
    res.render('Lobby/mainlobby', {
        title: '社区大厅',
        noFooter: true
    });
});


module.exports = router;