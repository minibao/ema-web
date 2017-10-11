var store = require('../services/store');
var async = require('async');
var tokenName = require('../data/config.json').tokenName;
var accountIdName = require('../data/config.json').accountIdName;
var sqtoken = require('../data/config.json').sqtoken;

module.exports = function (req, res, next) {
    var token = req.cookies[tokenName];
    var uid = req.cookies['squid'];

    if (token) {
        var account = req.cookies[accountIdName];
        if (!account) {
            store.userdata({uid:uid}, function (err, result) {
                if (err) {
                    next();
                } else {
                    try {
                        account = result.data.accountId;
                        res.cookie(accountIdName, account, {maxAge: 1000 * 3600 * 24 * 14, path: '/'});
                        next();
                    } catch (err) {
                        //没有accountId
                        next();
                    }

                }
            })
        }else{
            next();
        }
    } else {
        res.clearCookie(accountIdName);
        next();
    }
};
