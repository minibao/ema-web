/**
 * Created by Administrator on 2017/6/2.
 */
var addS = new Vue({
    el: '#addS',
    data: {
        uid: '',
        token: '',
        gameTransCode: '',
        appId: '20019',
        pid: 'NM_0001',
        quantity: '1',
        appKey: '71599476762ca9835879f4d188919549',
        sign: '',
        orderId: '',
        productInfo: '',
        orderInfo: '',
        timestamp: '',
        app_id: '2016070901596612',
        accountId: '',
        biz_content: '',
        arrparams: '',
        notifyurl: '',
        paytype: 'weixin'
    },
    methods: {
        getuserdata: function () {
            if (addS.uid) {
                $.ajax({
                    type: 'POST',
                    url: "/api/userdata",
                    data: {
                        uid: addS.uid
                    },
                    success: function (data) {
                        try {
                            addS.accountId = data.data.accountId;
                            if (!addS.accountId) {
                                layer.msg('去个人中心添加昵称');
                                setTimeout(function () {
                                    location.href = '/usercenter?accound=kong';
                                }, 1500)
                            }
                        } catch (err) {

                        }
                    }
                });
            }
        },
        /*生成订单（社区）*/
        createOrderSociety: function () {
            if (addS.uid) {
                $.ajax({
                    type: 'POST',
                    url: "/api/createOrderData",
                    data: {
                        uid: addS.uid,
                        appId: addS.appId,
                        token: addS.token,
                        pid: addS.pid,
                        quantity: addS.quantity,
                        appKey: addS.appKey,
                        accountId: addS.accountId
                    },
                    success: function (data) {
                        try {
                            addS.gameTransCode = data.data.orderId;
                            addS.timestamp = data.data.time;
                            addS.createOrder();
                        } catch (err) {

                        }
                    }
                });
            }
        },
        /*生成订单（平台）*/
        createOrder: function () {
            if (addS.uid) {
                $.ajax({
                    type: 'POST',
                    url: "/api/createOrder",
                    data: {
                        uid: addS.uid,
                        appId: addS.appId,
                        token: addS.token,
                        pid: addS.pid,
                        quantity: addS.quantity,
                        gameTransCode: addS.gameTransCode,
                        appKey: addS.appKey
                    },
                    success: function (data) {
                        try {
                            if (data == "error_goto_user") {
                                layer.msg("登录出现异常，请重新登录！");
                                util.delCookie("squid");//ddd
                                util.delCookie("token");
                                util.delCookie("accountId_shequ");
                                layer.msg("检测到帐号异常，请重新登录！");
                                setTimeout(function () {
                                    location.href = "/users";
                                }, 1000)
                            }

                            if (data.data.orderId) {
                                addS.orderId = data.data.orderId;
                                addS.productInfo = data.data.productInfo;
                                addS.addSign();
                            }
                        } catch (err) {

                        }
                    }
                });
            }
        },
        /*支付宝加签*/
        addSign: function () {
            var num = $('#jingying_num').val();
            num = util.trim(num);
            if (num == "") {
                num = 1;
            }
            var biz_content = {
                'body': addS.productInfo.description,
                'subject': '福利社-' + (100 * Number(addS.quantity)) + '柠檬点',
                'out_trade_no': addS.orderId,
                'timeout_express': '90m',
                'total_amount': num,
                'product_code': 'NM_0001'
            };
            biz_content = JSON.stringify(biz_content);

            // notify = "https://staging-platform.lemonade-game.com/ema-platform/alipay/notifycallbackWeb";
            var loaclhost = util.getlocalhostPath();//https://staging-social.lemonade-game.com
            // notify = "https://platform.lemonade-game.com/ema-platform/alipay/notifycallbackWeb";
            if (loaclhost == "https://staging-social.lemonade-game.com") {
                notify = "https://staging-platform.lemonade-game.com/ema-platform/alipay/notifycallbackWeb";
            }else{
                notify = "https://platform.lemonade-game.com/ema-platform/alipay/notifycallbackWeb";
            }

            adds.notifyurl = util.getlocalhostPath();
            var returnurl = adds.notifyurl + "/usercenter?ispaybuy=ok";
            addS.orderInfo = 'app_id=2016070901596612&biz_content=' + biz_content + '&charset=utf-8' + '&method=alipay.trade.wap.pay&notify_url=' + notify + '&return_url=' + returnurl + '&sign_type=RSA&timestamp=' + addS.timestamp + '&version=1.0';
            $.ajax({
                type: 'POST',
                url: "/api/addSign",
                data: {
                    uid: addS.uid,
                    appId: addS.appId,
                    orderInfo: addS.orderInfo,
                    token: addS.token,
                    orderId: addS.orderId
                },
                success: function (data) {
                    try {
                        if (data.data) {
                            console.log(data.data);
                            addS.sign = data.data;
                            addS.openAlipay();
                        }
                    } catch (err) {
                        console.log(err);
                    }
                }
            });
        },
        /*唤醒支付宝*/
        openAlipay: function () {
            console.log('https://openapi.alipay.com/gateway.do?' + addS.sign);
            location.href = 'https://openapi.alipay.com/gateway.do?' + addS.sign;
        }
    }
})

addS.uid = util.getCookie("squid");
addS.token = util.getCookie("token");
// adds.notifyurl = util.getlocalhostPath();

addS.getuserdata();

/**
 * 注册点击事件.
 */
$(document).ready(function () {
    //支付宝支付
    $('#zhifubao').click(function () {
        if (addS.accountId) {
            addS.quantity = $('#jingying_num').val();
            addS.quantity = util.trim(addS.quantity);
            if (addS.quantity == "") {
                addS.quantity = 1;
            }
            addS.paytype = "zhifubao";
            addS.createOrderSociety();
        }
    })

    //芝麻信用
    $('#zhima').click(function () {
        layer.msg('暂未开放');
    })
})

$('#payid').click(function () {
    document.forms['alipaysubmit'].submit();
})

