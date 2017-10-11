/**
 * Created by B-04 on 2016/12/26.
 */
var wxpay = new Vue({
    el: '#wxpay',
    data: {
        uid: '',
        wxcode: '',
        openid: '',
        orderId: '',
        amount: '',
        pid: 'NM_0001',
        appKey: '71599476762ca9835879f4d188919549',
        appId: '20019',
        quantity: ''

    },
    methods: {
        /**
         * 微信支付获取openid.
         */
        getWxPayAccessToken: function () {
            $.ajax({
                type: "POST",
                url: "/api/getWxPayAccessToken",
                data: {
                    WXcode: wxpay.wxcode
                },
                success: function (data) {
                    console.log(data);
                    // alert(JSON.stringify(data));
                    try {
                        wxpay.openid = data.openid;
                        util.setCookie("wxopenid", wxpay.openid);
                        wxpay.createOrderSociety();
                    } catch (err) {

                    }
                },
                error: function (data) {

                }
            });
        },
        /*生成订单（社区）*/
        createOrderSociety: function () {
            if (wxpay.uid) {
                $.ajax({
                    type: 'POST',
                    url: "/api/createOrderData",
                    data: {
                        uid: wxpay.uid,
                        appId: wxpay.appId,
                        pid: wxpay.pid,
                        quantity: util.getCookie("quantity"),
                        appKey: wxpay.appKey
                    },
                    success: function (data) {
                        // alert(JSON.stringify(data));
                        try {
                            wxpay.gameTransCode = data.data.orderId;
                            wxpay.timestamp = data.data.time;
                            wxpay.createOrder();
                        } catch (err) {

                        }
                    }
                });
            }
        },
        /*生成订单（平台）*/
        createOrder: function () {
            if (wxpay.uid) {
                $.ajax({
                    type: 'POST',
                    url: "/api/createOrder",
                    data: {
                        uid: wxpay.uid,
                        appId: wxpay.appId,
                        pid: wxpay.pid,
                        quantity: util.getCookie("quantity"),
                        gameTransCode: wxpay.gameTransCode,
                        appKey: wxpay.appKey
                    },
                    success: function (data) {
                        // alert(JSON.stringify(data));
                        try {
                            if (data.data.orderId) {
                                wxpay.orderId = data.data.orderId;
                                wxpay.createWXOrder();
                            }
                        } catch (err) {

                        }
                    }
                });
            }
        },
        /**
         * 微信支付(创建微信订单).
         */
        createWXOrder: function () {
            var url = encodeURIComponent(location.href.split('#')[0]);
            $.ajax({
                type: "POST",
                url: "/api/shareaddSign",
                data: {
                    appId: '20019',
                    url: url,
                    appKey: '71599476762ca9835879f4d188919549',
                    allianceId: '71'
                },
                success: function (data) {
                    console.log(data);
                    if (data && data.status == 0) {
                        // wx.config({
                        //     debug: false,
                        //     appId: 'wx90ea8be0c05b9630',
                        //     timestamp: data.data.timestamp,
                        //     nonceStr: data.data.nonceStr,
                        //     signature: data.data.signature,
                        //     // url: url,
                        //     jsApiList: ['onMenuShareQZone', 'checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'getNetworkType', 'hideOptionMenu', 'showOptionMenu', 'closeWindow', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'scanQRCode', 'chooseWXPay']
                        // });

                        $.ajax({
                            type: "POST",
                            url: "/api/createWXOrder",
                            data: {
                                uid: wxpay.uid,
                                appId: wxpay.appId,
                                orderId: wxpay.orderId,
                                amount: util.getCookie("quantity"),
                                openId: wxpay.openid,
                                tradeType: 'JSAPI',
                                ip: location.href.split('#')[0]
                            },
                            success: function (data) {
                                console.log(data);
                                // alert(JSON.stringify(data));
                                try {
                                    wx.ready(function () {
                                        wx.chooseWXPay({
                                            // appId: data.data.appid,
                                            timestamp: data.data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                                            nonceStr: data.data.nonceStr, // 支付签名随机串，不长于 32 位
                                            package: data.data.package,  // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                                            signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                                            paySign: data.data.sign, // 支付签名
                                            success: function (res) {
                                                // 支付成功后的回调函数
                                                // alert(JSON.stringify(res));
                                                // wxpay.getuserinfo();
                                                if (res) {
                                                    location.href = "/usercenter";
                                                }

                                            }

                                        });
                                    });
                                } catch (err) {

                                }
                            },
                            error: function (data) {

                            }
                        });


                    }
                },
                error: function (data) {
                    console.log(data);
                }
            });


        },
        getuserinfo: function () {
            $.ajax({
                type: 'POST',
                url: "/api/active_getinfo",
                data: {
                    accountId: ''
                },
                success: function (data) {
                    try {
                        $('#nmpot').html(data.data.personQuota);
                    } catch (err) {
                    }
                }
            });
        }

    }
});


wxpay.uid = util.getCookie("squid");

//默认从cookies里获取wxopenid
// wxpay.openid = util.getCookie("wxopenid");


if (util.getUrlParams('code') != "" && util.getUrlParams('code')) {
    wxpay.wxcode = util.getUrlParams("code");
    // util.setCookie("wxcode", app.wecode);//继续把wxcode存放在cookies中
    wxpay.getWxPayAccessToken();
}

$(document).ready(function () {
    $('#wxpaybtn').click(function () {

        wxpay.quantity = $('#jingying_num').val();
        wxpay.quantity = util.trim(wxpay.quantity);
        console.log(wxpay.quantity);
        if (wxpay.quantity == "") {
            wxpay.quantity = 1;
            util.setCookie("quantity", '1');
        } else {
            util.setCookie("quantity", wxpay.quantity);
        }

        //判断wxcode是否为空，为空则重新获取code否则下一步
        if (wxpay.openid == "" || !wxpay.openid) {
            //重新获取wxcode
            window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx90ea8be0c05b9630&redirect_uri=https%3a%2f%2fsocial.lemonade-game.com/usercenter/wxpay?showpay=ok&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
        } else {
            wxpay.createOrderSociety();
        }
    })

})
