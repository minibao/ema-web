var express = require('express');
var router = express.Router();
var tokenName = require('../data/config.json').tokenName;


router.get('/', function (req, res, next) {
    res.render('login', {
        title: '登录--选区',
        noFooter: true
    });
});

router.get('/bindphone', function (req, res, next) {
    res.render('bindphone', {
        title: '手机绑定',
        noFooter: true
    });
});

router.get('/check', function (req, res, next) {
    res.render('check', {
        title: '排行榜',
        noFooter: true
    });
});

router.get('/news', function (req, res, next) {
    res.render('news', {
        title: 'news',
        uid: req.query.uid,
        tabFlag: 3
    });
});

router.get('/chat', function (req, res, next) {
    res.render('chat', {
        title: 'chat',
        uid: req.query.uid,
        tabFlag: 2
    });
});

router.get('/find', function (req, res, next) {
    res.render('find', {
        title: 'find',
        uid: req.query.uid,
        tabFlag: 3
    });
});
router.get('/qqback', function (req, res, next) {
    res.render('qq_back', {
        title: 'QQ授权登录',
        noFooter: true
    });
});
router.get('/info', function (req, res, next) {
    var showbottom = req.query.showbottom;
    if (showbottom == 0) {
        res.render('info', {
            title: '战绩',
            uid: req.query.uid,
            tabFlag: 1,
            noFooter: true
        });
    }else{
        res.render('info', {
            title: '战绩',
            uid: req.query.uid,
            tabFlag: 1
        });
    }

});
router.get('/info_details', function (req, res, next) {
    res.render('battledetails', {
        title: '战场数据',
        gameGuid: req.query.gameguid,
        tabFlag: 1
    });
});

router.get('/app_download', function (req, res, next) {
    res.render('testDownload', {
        title: 'app_download',
        layout: false
    });
});



// router.get('/active', function (req, res, next) {
//     var token = req.cookies[tokenName];
//     res.render('active_lottery/zhuanpan', {
//         title: '社区福利',
//         layout: 'layout',
//         tabFlag: 2
//     });
// });
// router.get('/active2', function (req, res, next) {
//     var token = req.cookies[tokenName];
//     res.render('active_lottery/fanpai', {
//         title: '社区福利',
//         layout: 'layout',
//         tabFlag: 2
//     });
// });
//
// router.get('/active3', function (req, res, next) {
//     res.render('active_lottery/shake', {
//         title: 'active_lottery',
//         layout: 'layout',
//         tabFlag: 2
//     });
// });
//
// router.get('/active4', function (req, res, next) {
//     res.render('active_lottery/index', {
//         title: 'active_lottery',
//         layout: 'layout',
//         tabFlag: 2
//     });
// });
router.get('/pay', function (req, res, next) {
    res.render('pay', {
        title: '充值',
        layout: 'layout',
        tabFlag: 4
    });
});

//分享测试
router.get('/sharePage', function (req, res, next) {
    res.render('mytest', {
        title: '分享我的战绩',
        layout: 'layout',
        tabFlag: 4
    });
});

//分享福利
router.get('/sharefuli', function (req, res, next) {
    res.render('sharePage/sharefuli', {
        title: '我的福利',
        layout: 'layout',
        tabFlag: 4
    });
});

//分享福利
router.get('/yinlingcast', function (req, res, next) {
    res.render('sharePage/yinlingcast', {
        title: '玩英灵更多福利等你来拿',
        layout: false
    });
});

//英灵领礼包
router.get('/yinlinggift', function (req, res, next) {
    res.render('sharePage/yinlingcast_byalone', {
        title: '英灵礼包',
        layout: false
    });
});

module.exports = router;
