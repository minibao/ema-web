var express = require('express');
var async = require('async');
var util = require('./util');
// var tokenName = require('../data/config.json').tokenName;
var mapList = require('../data/map.json');

var request = require('request').defaults({
    baseUrl: 'http://localhost:' + (process.env.PORT || 3000),
    json: true
});

var wx_appid = 'wx90ea8be0c05b9630';
var wx_secret = 'c28a48d911f51fe118e5567d99eb7d99';

module.exports = {
    pfLogin: function (params, callback) {
        params.sign = util.getSign(params);
        request({
            url: '/pf/ema-platform/member/pfLogin',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    /*新的Login接口*/
    getLogin: function (params, callback) {
        // params.sign = util.getSign(params);
        request({
            url: '/bi/emaGameData/login/getLogin',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    verifyToken: function (params, callback) {
        request({
            url: '/bi/emaGameData/system/verifiToken',
            method: 'POST',
            form: {
                appId: 20019,
                type: 'YZ',
                accountId: params.accountId,
                token: params.token
            }
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    //code校验
    checkLoginMsgCode: function (params, callback) {
        request({
            url: '/bi/emaGameData/login/checkLoginMsgCode',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    getServer: function (params, callback) {
        request({
            url: '/bi/emaGameData/dictionary/getCiyuanServerData',
            method: 'POST',
            form: ''
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    getRole: function (params, callback) {
        request({
            url: '/bi/emaGameData/ciyuan/getUserCharacterData',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    sendCaptcha: function (params, callback) {
        request({
            url: '/bi/emaGameData/login/sendMessageLoginCode',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    getBattle: function (params, callback) {
        request({
            url: '/bi/BI-Dimension/getBattleDataTest.do',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    //战绩排行
    getUserBattleRankingList: function (params, callback) {
        request({
            url: '/bi/emaGameData/ranking/getUserBattleRankingList',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    //我的排行
    getUserBattleRankingByRoleId: function (params, callback) {
        request({
            url: '/bi/emaGameData/ranking/getUserBattleRankingByRoleId',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    //战绩排行里面点击查看个人榜上的数据
    getUserDataByRoleId: function (params, callback) {
        request({
            url: '/bi/emaGameData/ciyuan/getUserDataByRoleIdByRoleId',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    getMapDictionary: function (params, callback) {
        request({
            url: '/bi/BI-Dimension/dictionaries/getMapDictionary.do',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    selectUserRealData: function (params, callback) {
        request({
            url: '/bi/BI-Dimension/userReal/selectUserRealData.do',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    selectUserHeroKDAStatisticsTest: function (params, callback) {
        request({
            url: '/bi/BI-Dimension/userHero/selectUserHeroKDAStatisticsTest.do',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    getUserData: function (params, callback) {
        request({
            url: '/bi/emaGameData/ciyuan/getUserData',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    getUserDataBattle: function (params, callback) {
        request({
            url: '/bi/emaGameData/ciyuan/getUserBattleListData',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    getUserHeroBattleData: function (params, callback) {
        request({
            url: '/bi/emaGameData/ciyuan/getUserHeroBattleData',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    getOneBattleData: function (params, callback) {
        request({
            url: '/bi/emaGameData/ciyuan/getOneBattleData',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    loadTopic: function (params, callback) {
        request({
            url: '/pms/topic/loadTopic',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    loadTopicDetail: function (params, callback) {
        request({
            url: '/pms/topic/loadTopicDetail',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    postTopic: function (params, callback) {
        request({
            url: '/pms/topic/postTopic',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    //雷达数据
    getUserBattleAvgData: function (params, callback) {
        request({
            url: '/bi/emaGameData/ciyuan/getUserBattleAvgData',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    //抽奖类
    active_getinfo: function (params, callback) {
        request({
            url: '/bi/emaGameData/user/getUserPrizeLotteryDate',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    userdata: function (params, callback) {
        request({
            url: '/bi/emaGameData/user/getUserInformationDataForUid  ',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    geTenWinningList: function (params, callback) {
        request({
            url: '/bi/emaGameData/luckDraw/geTenWinningList',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    getPrizeListData: function (params, callback) {
        request({
            url: '/bi/emaGameData/luckDraw/getPrizeListData',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    startLuckDrawData: function (params, callback) {
        request({
            url: '/bi/emaGameData/luckDraw/startLuckDrawData',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    startQuotaShake: function (params, callback) {
        request({
            url: '/bi/emaGameData/luckDraw/startQuotaShake',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    subuserdata: function (params, callback) {
        request({
            url: '/bi/emaGameData/user/updateUserInformationData',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    getUserWinningList: function (params, callback) {
        request({
            url: '/bi/emaGameData/luckDraw/getUserWinningList',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    sendGamePrize: function (params, callback) {
        request({
            url: '/bi/emaGameData/luckDraw/sendGamePrize',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    //支付
    createOrderData: function (params, callback) {
        request({
            url: '/bi/emaGameData/transaction/createOrderData',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    createOrder: function (params, callback) {
        console.log(params);
        params.sign = util.getSignCreate(params);
        request({
            url: '/pf/ema-platform/order/createOrder',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    //微信分享加签（临时插入）
    shareaddSign: function (params, callback) {
        console.log(params);
        params.sign = util.getShareSign(params);
        console.log(params);
        request({
            url: '/pf/ema-platform/share/weChatShareSign',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    //柠檬点兑换京东卡
    nmExchangeCard: function (params, callback) {
        request({
            url: '/bi/emaGameData/luckDraw/nmExchangeCard',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    //柠檬点兑换福利券*5
    nmExchangeLottery: function (params, callback) {
        request({
            url: '/bi/emaGameData/transaction/nmExchangeLottery',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    addSign: function (params, callback) {
        request({
            url: '/pf/ema-platform/sign/addH5',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },

    //微信获取access_token
    getWxAccessToken: function (callback) {
        var url = '/wxapi/cgi-bin/token';
        request({
            url: url,
            method: 'GET',
            qs: {
                grant_type: 'client_credential',
                appid: wx_appid,
                secret: wx_secret

            }
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    //获取api_ticket
    apiticket: function (params, callback) {
        var url = '/wxapi/cgi-bin/ticket/getticket';
        request({
            url: url,
            method: 'GET',
            qs: {
                access_token: params.access_token,
                type: 'jsapi'
            }
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    //游戏里token换取社区token
    getChangeToken: function (params, callback) {
        request({
            url: '/bi/emaGameData/login/getChangeToken',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    //分享出去，添加分享记录
    shareBattleSendLottery: function (params, callback) {
        request({
            url: '/bi/emaGameData/luckDraw/shareBattleSendLottery',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    //微信获取支付access_token
    getWxPayAccessToken: function (params, callback) {
        var url = '/wxapi/sns/oauth2/access_token';
        request({
            url: url,
            method: 'GET',
            qs: {
                appid: wx_appid,
                secret: wx_secret,
                code: params.wxcode,
                grant_type: 'authorization_code'
            }
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    //微信支付createWXOrder
    createWXOrder: function (params, callback) {
        request({
            url: '/pf/ema-platform/order/createWXOrder',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    //点击领奖
    battleSendLottery: function (params, callback) {
        request({
            url: '/bi/emaGameData/luckDraw/battleSendLottery',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    //判断是否被领取过
    selUserRegisterCodeData: function (params, callback) {
        request({
            url: '/bi/emaGameData/package/selUserRegisterCodeData',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    //获取英灵注册码
    getUserRegisterCodeData: function (params, callback) {
        request({
            url: '/bi/emaGameData/package/getUserRegisterCodeData',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    //获取英灵注册码1
    getPackageCodeNoLogin: function (params, callback) {
        request({
            url: '/bi/emaGameData/package/getPackageCodeNoLogin',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    },
    //通过SQtoken获取个人信息
    getUserDataByToken: function (params, callback) {
        request({
            url: '/bi/emaGameData/user/getUserDataByToken',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    }



};
