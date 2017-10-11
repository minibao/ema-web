var express = require('express');
var crypto = require('crypto');
var tokenName = require('../data/config.json').tokenName;
var accountIdName = require('../data/config.json').accountIdName;

function md5(str) {
    var md5sum = crypto.createHash('md5');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
}

var appKey = '5600441101c8818c4480d3c503742a3b';

module.exports = {
    getSign: function (params) {
        var temArray = [];
        for (var i in params) {
            temArray.push(i);
        }
        temArray.sort();
        var str = '';
        for (var j in temArray) {
            str += params[temArray[j]];
        }
        str += appKey;
        return md5(str).toUpperCase();
    },
    getSignCreate: function (params) {
        var sign = params.appId + params.gameTransCode + params.pid + params.quantity + params.token + params.appKey;
        return md5(sign).toUpperCase();
    },
    getShareSign: function (params) {
        // var sign = params.appId + params.jsApiTicket + params.appKey;
        var sign = params.allianceId + params.appId + params.appKey;
        return md5(sign).toUpperCase();
    },
    loginOut: function (res) {
        res.clearCookie(tokenName);
        res.redirect('/users');
    },
    commonAjaxReturn: function (res, err, result) {
        if (err) {
            res.json(400, {msg: err})
        } else {
            try {
                if ((result.resultCode == 300 && result.resultMsg.trim() == 20005) || (result.status == 1 && result.message == 'errorCode 20005')) { //token失效组合
                    res.clearCookie(tokenName);
                    res.clearCookie(accountIdName);
                    // res.redirect('error_goto_user');
                    res.json('error_goto_user');
                } else {
                    res.json(result);
                }
            } catch (err) {
            }
        }
    },
    commonRender: function (res, err, result, path) {
        if (err) {
            res.render('error');
        } else {
            if (result.msgCode == 303) {
                res.clearCookie(tokenName);
                res.redirect('/users');
            } else {
                res.render(path, result);
            }
        }
    }
};