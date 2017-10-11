/**
 * Created by B-04 on 2016/12/21.
 */
var express = require('express');
var async = require('async');
var store = require('../services/store');
var router = express.Router();
var mapList = require('../data/map.json');
var heroList = require('../data/hero.json');
var itemList = require('../data/item.json');
var util = require('../services/util');
var tokenName = require('../data/config.json').tokenName;
var accountIdName = require('../data/config.json').accountIdName;
var sqtoken = require('../data/config.json').sqtoken;

router.post('/pfLogin', function (req, res) {
    var postData = req.body;
    postData.appId = 20015;
    postData.allianceId = 26;
    postData.deviceType = 'ios';
    postData.deviceKey = 867822022878861;
    postData.accountType = 1;

    store.pfLogin(postData, function (err, result) {
        util.commonAjaxReturn(res, err, result);
    });
});
router.post('/getLogin', function (req, res) {
    var postData = req.body;
    store.getLogin(postData, function (err, result) {
        util.commonAjaxReturn(res, err, result);
    });
});
router.post('/checkLoginMsgCode', function (req, res) {
    var postData = req.body;
    store.checkLoginMsgCode(postData, function (err, result) {
        util.commonAjaxReturn(res, err, result);
    });
});

router.post('/getServer', function (req, res) {
    store.getServer({}, function (err, result) {
        util.commonAjaxReturn(res, err, result);
    })
});

router.post('/getRole', function (req, res) {
    store.getRole({
        uid: req.body.uid,
        server: req.body.server
    }, function (err, result) {
        util.commonAjaxReturn(res, err, result);
    })
});

router.get('/getCaptcha', function (req, res) {
    var postData = req.query;
    store.sendCaptcha({
        mobile: postData.mobile
    }, function (err, result) {
        util.commonAjaxReturn(res, err, result);
    });
});

router.post('/getBattle', function (req, res) {
    store.getBattle({
        token: 'ThgywGmdFFs=',
        uid: req.body.uid
    }, function (err, result) {
        if (err) {
            res.json(400, {msg: err})
        } else {
            if (result.data && result.data.length > 0) {
                result.data.forEach(function (item) {
                    item.map_name = mapList[item.map_id];
                    item.hero_img = heroList[item.heroId].img;
                    item.hero_name = heroList[item.heroId].name;
                });
                res.json(result);
            } else {
                res.json(400, {msg: "数据获取失败"})
            }
        }
    })
});
//地图
router.post('/getMapDictionary', function (req, res) {
    store.getMapDictionary({
        token: 'ThgywGmdFFs='
    }, function (err, result) {
        util.commonAjaxReturn(res, err, result);
    })
});

router.post('/selectUserRealData', function (req, res) {
    store.selectUserRealData({
        token: 'ThgywGmdFFs=',
        uid: req.body.uid
    }, function (err, result) {
        util.commonAjaxReturn(res, err, result);
    })
});

router.post('/getUserDataBattle', function (req, res) {
    store.getUserDataBattle({
        uid: req.body.uid,
        server: req.body.server,
        roleId: req.body.roleId,
        curPage: req.body.curPage || 1,
        pageSize: req.body.pageSize || 20
    }, function (err, result) {
        if (err) {
            res.json(400, {msg: err})
        } else {
            if (result.data && result.data.length > 0) {
                result.data.forEach(function (item) {
                    item.hero_img = heroList[item.roleJob] && heroList[item.roleJob].img;
                    item.hero_name = heroList[item.roleJob] && heroList[item.roleJob].name;
                    item._mapId = mapList[item.mapId];
                    item.item1_img = item.item1 == 65535 ? null : item.item1 + '.png';
                    item.item1_name = item.item1 == 65535 ? null : itemList[item.item1];
                    item.item2_img = item.item2 == 65535 ? null : item.item2 + '.png';
                    item.item2_name = item.item2 == 65535 ? null : itemList[item.item2];
                    item.item3_img = item.item3 == 65535 ? null : item.item3 + '.png';
                    item.item3_name = item.item3 == 65535 ? null : itemList[item.item3];
                    item.item4_img = item.item4 == 65535 ? null : item.item4 + '.png';
                    item.item4_name = item.item4 == 65535 ? null : itemList[item.item4];
                    item.item5_img = item.item5 == 65535 ? null : item.item5 + '.png';
                    item.item5_name = item.item5 == 65535 ? null : itemList[item.item5];
                    item.item6_img = item.item6 == 65535 ? null : item.item6 + '.png';
                    item.item6_name = item.item6 == 65535 ? null : itemList[item.item6];
                    // item.ohterJobArr = item.otherJob.split(",");
                    // item.otherResultArr = item.otherResult.split(",");
                    item.leftarr = [];
                    item.rightarr = [];
                    if (item.result == '1') {
                        item._result = "胜利";
                    } else {
                        item._result = "失败";
                    }
                    item.date = item.time.substr(5, 11);
                    // for (var i = 0; i < 10; i++) {
                    //     if (item.otherResultArr[i] == '1') {
                    //         // item.leftarr.push(item.job[i]);
                    //         if (heroList[item.ohterJobArr[i]].img) {
                    //             item.leftarr.push(heroList[item.ohterJobArr[i]].img);
                    //         }
                    //     } else {
                    //         if (heroList[item.ohterJobArr[i]].img) {
                    //             item.rightarr.push(heroList[item.ohterJobArr[i]].img);
                    //         }
                    //
                    //     }
                    // }
                })
                res.json(result);
            } else {
                res.json(400, {msg: "数据获取失败"});
            }

        }


    })
});

//战绩排行
router.post('/getUserBattleRankingList', function (req, res) {
    store.getUserBattleRankingList({}, function (err, result) {
        if (err) {
            res.json(400, {msg: err})
        } else {

            var array = {
                '23000': "天使之门",
                '23002': "天空之城",
                '23003': "绯红暴君"
            }
            if (result.data && result.data.length > 0) {
                result.data.forEach(function (item) {
                    item.servername = array[item.server];
                });
                res.json(result);
            } else {
                res.json(400, {msg: "数据获取失败"})
            }
        }
    })
});
//我的排行
router.post('/getUserBattleRankingByRoleId', function (req, res) {
    store.getUserBattleRankingByRoleId({
        roleId: req.body.roleId
    }, function (err, result) {
        util.commonAjaxReturn(res, err, result);
    })
});
//战绩排行里面点击查看个人榜上的数据
router.post('/getUserDataByRoleId', function (req, res) {
    store.getUserDataByRoleId({
        roleId: req.body.roleId
    }, function (err, result) {
        util.commonAjaxReturn(res, err, result);
    })
});

router.post('/getOneBattleData', function (req, res) {
    store.getOneBattleData({
        gameGuid: req.body.gameGuid
    }, function (err, result) {
        var username = req.body.gamename;
        if (err) {
            res.json(400, {msg: err})
        } else {
            if (result.data && result.data.length > 0) {
                result.LGDhurt = 0;
                result.LGDk = 0;
                result.LGDd = 0;
                result.LGDa = 0;
                result.Ehomehurt = 0;
                result.Ehomek = 0;
                result.Ehomed = 0;
                result.Ehomea = 0;
                result.LGDdata = [];
                result.Ehomedata = [];
                result.LGDname = "对方";
                result.Ehomename = "我方";
                if (!Array.isArray(result.data)) {
                    return null;
                }
                for (var i = 0; i < result.data.length; i++) {
                    if (result.data[i].result == '1') {
                        result.LGDhurt = Number(result.LGDhurt) + Number(result.data[i].damageTotal);
                        result.LGDk = Number(result.LGDk) + Number(result.data[i].killCount);
                        result.LGDd = Number(result.LGDd) + Number(result.data[i].beKilledCount);
                        result.LGDa = Number(result.LGDa) + Number(result.data[i].assistCount);
                        result.LGDdata.push(result.data[i]);
                    } else {
                        result.Ehomehurt = Number(result.Ehomehurt) + Number(result.data[i].damageTotal);
                        result.Ehomek = Number(result.Ehomek) + Number(result.data[i].killCount);
                        result.Ehomed = Number(result.Ehomed) + Number(result.data[i].beKilledCount);
                        result.Ehomea = Number(result.Ehomea) + Number(result.data[i].assistCount);
                        result.Ehomedata.push(result.data[i]);
                    }
                }
                var flag = 0;
                for (var i = 0; i < result.LGDdata.length; i++) {
                    if (username == result.LGDdata[i].NAME && flag == 0) {
                        result.LGDname = "我方";
                        result.Ehomename = "对方";
                        flag = 1;
                    }
                }
                res.json(result);
            } else {
                res.json(400, {msg: "数据获取失败"});
            }
        }
    })
});

router.post('/getUserData', function (req, res) {
    store.getUserData({
        uid: req.body.uid,
        server: req.body.server,
        source: req.body.source
    }, function (err, result) {
        if (err) {
            res.json(400, {msg: err})
        } else {
            try {
                if (result.data) {
                    if (result.data.battileWinNum) {

                    } else {
                        result.data.battileWinNum = 0;
                    }
                    if (result.data.battileFailNum) {

                    } else {
                        result.data.battileFailNum = 0;
                    }
                    result.data.rateOfWin = (result.data.battileWinNum / ((result.data.battileFailNum - 0) + (result.data.battileWinNum - 0)) * 100).toFixed(1) + "%";
                    if (result.data.rateOfWin == 'NaN%') {
                        result.data.rateOfWin = 0;
                    }
                    res.json(result);
                } else {
                    res.json(400, {msg: "数据获取失败"});
                }
            } catch (err) {

            }
        }
    })
});

router.post('/getUserHeroBattleData', function (req, res) {
    store.getUserHeroBattleData({
        roleId: req.body.roleId
    }, function (err, result) {
        if (err) {
            res.json(400, {msg: err})
        } else {
            if (result.data && result.data.length > 0) {
                for (var i = 0; i < result.data.length; i++) {
                    if (result.data[i].beKillCount != "0") {
                        result.data[i].kda = ((result.data[i].assistCount + result.data[i].killCount) / result.data[i].beKillCount).toFixed(2);
                    } else {
                        result.data[i].kda = ((result.data[i].assistCount + result.data[i].killCount) / 1);
                    }
                    result.data[i].rateOfWin = (result.data[i].winNum / (result.data[i].allNum - 0) * 100).toFixed(1) + "%";
                    result.data[i].hero_img = result.data[i].roleJob + '_1_1.png';
                    if (result.data[i].kda == "0.00") {
                        result.data[i].kda = "0";
                    }
                    if (result.data[i].rateOfWin == "0.0%") {
                        result.data[i].rateOfWin = "0";
                    }
                }
                res.json(result);
            } else {
                res.json(400, {msg: "数据获取失败"});
            }
        }

    })
});

router.post('/selectUserHeroKDAStatisticsTest', function (req, res) {
    store.selectUserHeroKDAStatisticsTest({
        token: 'ThgywGmdFFs=',
        uid: req.body.uid
    }, function (err, result) {
        if (err) {
            res.json(400, {msg: err})
        } else {
            if (result.data && result.data.length > 0) {
                result.longTime = (result.longTime / 60).toFixed(1) + "h";
                result.data.forEach(function (item) {
                    item.hero_img = heroList[item.heroId].img;
                    item.hero_name = heroList[item.heroId].name;
                    item.kda = ((item.assist + item.kill) / item.death).toFixed(2);
                    item.perKill = (item.kill / item.battleNum).toFixed(1);
                    item.perDeath = (item.death / item.battleNum).toFixed(1);
                    item.perAssist = (item.assist / item.battleNum).toFixed(1);
                    item.rateOfWin = (item.battleWinNum / item.battleNum * 100).toFixed(1) + "%";
                })
                res.json(result);
            } else {
                res.json(400, {msg: "数据获取失败"});
            }
        }
    })
});

//获取雷达图数据
router.post('/getUserBattleAvgData', function (req, res) {
    store.getUserBattleAvgData({
        roleId: req.body.roleId
    }, function (err, result) {
        util.commonAjaxReturn(res, err, result);
    })
});

//抽奖类
router.post('/active_getinfo', function (req, res) {
    var accountId = req.cookies[accountIdName];
    store.active_getinfo({
        accountId: accountId
    }, function (err, result) {
        util.commonAjaxReturn(res, err, result);
    })
});

router.post('/userdata', function (req, res) {
    store.userdata({
        uid: req.body.uid
    }, function (err, result) {
        util.commonAjaxReturn(res, err, result);
    })
});

router.post('/geTenWinningList', function (req, res) {
    store.geTenWinningList({
        boxId: req.body.boxId
    }, function (err, result) {
        util.commonAjaxReturn(res, err, result);
    })
});
router.post('/getPrizeListData', function (req, res) {
    store.getPrizeListData({
        boxId: req.body.boxId
    }, function (err, result) {
        util.commonAjaxReturn(res, err, result);
    })
});

//需要加token
router.post('/startLuckDrawData', function (req, res) {
    var token = req.cookies[tokenName];
    var accountId = req.cookies[accountIdName];
    store.startLuckDrawData({
        accountId: accountId,
        boxId: req.body.boxId,
        lotteryType: req.body.lotteryType,
        token: token
    }, function (err, result) {
        util.commonAjaxReturn(res, err, result);
    })
});

router.post('/addTopic', function (req, res) {
    var postData = {
        title: req.body.title,
        authorId: req.body.authorId,
        author: req.body.author,
        brief: req.body.brief,
        time: req.body.time,
        context: req.body.context
    };
    store.postTopic(postData, function (err, result) {
        util.commonAjaxReturn(res, err, result);
    });
});

//token
router.post('/startQuotaShake', function (req, res) {
    var token = req.cookies[tokenName];
    var accountId = req.cookies[accountIdName];
    store.startQuotaShake({
        token: token,
        accountId: accountId
    }, function (err, result) {
        util.commonAjaxReturn(res, err, result);
    })
});
//token
router.post('/subuserdata', function (req, res) {
    var token = req.cookies[tokenName];
    var accountId = req.cookies[accountIdName];
    store.subuserdata({
        id: req.body.id,
        uid: req.body.uid,
        nickName: req.body.nickName,
        sex: req.body.sex,
        qq: req.body.qq,
        address: req.body.address,
        telphone: req.body.telphone,
        signature: req.body.signature,
        token: token,
        accountId: accountId,
        name: req.body.name,
        icon: req.body.icon
    }, function (err, result) {
        util.commonAjaxReturn(res, err, result);
    })
});

router.post('/getUserWinningList', function (req, res) {
    store.getUserWinningList({
        accountId: req.body.accountId
    }, function (err, result) {
        util.commonAjaxReturn(res, err, result);
    })
});
//token
router.post('/sendGamePrize', function (req, res) {
    var token = req.cookies[tokenName];
    var accountId = req.cookies[accountIdName];
    store.sendGamePrize({
        server: req.body.server,
        allianceId: req.body.allianceId,
        roleId: req.body.roleId,
        winningId: req.body.winningId,
        accountId: accountId,
        token: token
    }, function (err, result) {
        util.commonAjaxReturn(res, err, result);
    })
});

//支付
router.post('/createOrderData', function (req, res) {
    var token = req.cookies[tokenName];
    var accountId = req.cookies[accountIdName];
    store.createOrderData({
        uid: req.body.uid,
        appId: req.body.appId,
        token: token,
        pid: req.body.pid,
        quantity: req.body.quantity,
        appKey: req.body.appKey,
        accountId: accountId
    }, function (err, result) {
        util.commonAjaxReturn(res, err, result);
    })
});

router.post('/createOrder', function (req, res) {
    var token = req.cookies[tokenName];
    store.createOrder({
        uid: req.body.uid,
        appId: req.body.appId,
        token: token,
        pid: req.body.pid,
        quantity: req.body.quantity,
        gameTransCode: req.body.gameTransCode,
        appKey: req.body.appKey
    }, function (err, result) {
        util.commonAjaxReturn(res, err, result);
    })
});

router.post('/shareaddSign', function (req, res) {
    store.shareaddSign({
        appId: req.body.appId,
        url: req.body.url,
        appKey: req.body.appKey,
        allianceId: req.body.allianceId
    }, function (err, result) {
        util.commonAjaxReturn(res, err, result);
    })
});

router.post('/addSign', function (req, res) {
    store.addSign({
        uid: req.body.uid,
        appId: req.body.appId,
        orderInfo: req.body.orderInfo,
        token: req.body.token,
        orderId: req.body.orderId
    }, function (err, result) {
        util.commonAjaxReturn(res, err, result);
    })
});

//柠檬点兑换京东卡 token
router.post('/nmExchangeCard', function (req, res) {
    var token = req.cookies[tokenName];
    var accountId = req.cookies[accountIdName];
    store.nmExchangeCard({
        accountId: accountId,
        prizeId: req.body.prizeId,
        token: token
    }, function (err, result) {
        util.commonAjaxReturn(res, err, result);
    })
});

//柠檬点兑换福利券*5 token
router.post('/nmExchangeLottery', function (req, res) {
    var token = req.cookies[tokenName];
    var accountId = req.cookies[accountIdName];
    store.nmExchangeLottery({
        accountId: accountId,
        prizeId: req.body.prizeId,
        token: token
    }, function (err, result) {
        util.commonAjaxReturn(res, err, result);
    })
});

//微信获取access_token
router.get('/getWxAccessToken', function (req, res) {
    store.getWxAccessToken(function (err, result) {
        util.commonAjaxReturn(res, err, result);
    });
});

//微信获取支付access_token
router.post('/getWxPayAccessToken', function (req, res) {
    store.getWxPayAccessToken({
        wxcode: req.body.WXcode
    }, function (err, result) {
        if (err) {
            res.json(400, {msg: err})
        } else {
            res.json(result);
        }
    })
});

//微信支付createWXOrder
router.post('/createWXOrder', function (req, res) {
    var token = req.cookies[tokenName];
    store.createWXOrder({
        uid: req.body.uid,
        appId: req.body.appId,
        token: token,
        orderId: req.body.orderId,
        amount: req.body.amount,
        openId: req.body.openId,
        tradeType: req.body.tradeType,
        ip: req._remoteAddress
    }, function (err, result) {
        if (err) {
            res.json(400, {msg: err})
        } else {
            res.json(result);
        }
    })
});

//获取api_ticket.
router.post('/apiticket', function (req, res) {
    store.apiticket({
        access_token: req.body.accesstoken,
        type: req.body.type
    }, function (err, result) {
        util.commonAjaxReturn(res, err, result);
    });
});

//验证token的有效性
router.post('/verifyToken', function (req, res) {
    store.verifyToken({
        token: req.body.token,
        accountId: req.body.accountId
    }, function (err, result) {
        util.commonAjaxReturn(res, err, result);
    });
});

//游戏里token换取社区token
router.post('/getChangeToken', function (req, res) {
    store.getChangeToken({
        uid: req.body.uid,
        appId: req.body.appId,
        token: req.body.token
    }, function (err, result) {
        if (err) {
            res.json(400, {msg: err})
        } else {
            res.json(result);
        }
    })
});

//分享出去，添加分享记录
router.post('/shareBattleSendLottery', function (req, res) {
    var token = req.cookies[tokenName];
    var accountId = req.cookies[accountIdName];
    store.shareBattleSendLottery({
        token: token,
        accountId: accountId,
        key: req.body.key
    }, function (err, result) {
        if (err) {
            res.json(400, {msg: err})
        } else {
            res.json(result);
        }
    })
});

//点击领奖
router.post('/battleSendLottery', function (req, res) {
    var accountId = req.cookies[accountIdName];
    var token = req.cookies[tokenName];
    store.battleSendLottery({
        accountId: accountId,
        key: req.body.key,
        token: token
    }, function (err, result) {
        util.commonAjaxReturn(res, err, result);
    })
});

//判断是否被领取过
router.post('/selUserRegisterCodeData', function (req, res) {
    var accountId = req.cookies[accountIdName];
    store.selUserRegisterCodeData({
        accountId: accountId,
        gameCode: req.body.gameCode,
        type: req.body.type
    }, function (err, result) {
        util.commonAjaxReturn(res, err, result);
    })
});

//获取英灵注册码
router.post('/getUserRegisterCodeData', function (req, res) {
    var accountId = req.cookies[accountIdName];
    store.getUserRegisterCodeData({
        accountId: accountId,
        gameCode: req.body.gameCode,
        type: req.body.type
    }, function (err, result) {
        util.commonAjaxReturn(res, err, result);
    })
});

//获取英灵注册码2
router.post('/getPackageCodeNoLogin', function (req, res) {
    var accountId = req.cookies[accountIdName];
    store.getPackageCodeNoLogin({
        gameCode: req.body.gameCode
    }, function (err, result) {
        util.commonAjaxReturn(res, err, result);
    })
});

//通过SQtoken获取个人信息
router.post('/getUserDataByToken', function (req, res) {
    var accountId = req.cookies[accountIdName];
    var sqtoken = req.cookies[sqtoken];
    store.getUserDataByToken({
        accountId: accountId,
        sq_token: sqtoken
    }, function (err, result) {
        util.commonAjaxReturn(res, err, result);
    })
});


module.exports = router;