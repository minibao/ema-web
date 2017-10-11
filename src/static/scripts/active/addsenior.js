/**
 * Created by Administrator on 2017/6/14.
 */
var adds = new Vue({
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
        psd: '',
        orderId: '' //游戏币下单中的orderID
    },
    methods: {
        /*事件*/
        addsenjorevent: function () {

        },
        /**
         *获取用户信息(accountId)
         **/
        getuserdata: function () {
            if (adds.uid) {
                $.ajax({
                    type: 'POST',
                    url: "/api/userdata",
                    data: {
                        uid: adds.uid
                    },
                    success: function (data) {
                        try {
                            adds.accountId = data.data.accountId;
                            console.log(adds.accountId);
                            console.log();
                            if (adds.accountId) {
                                adds.createOrderSociety();
                            }
                        } catch (err) {
                        }
                    }
                });
            }
        },
        /**
         *创建游戏币的订单(社区)
         **/
        createOrderSociety: function () {
            if (adds.uid) {
                $.ajax({
                    type: 'POST',
                    url: "/api/createOrderData",
                    data: {
                        uid: adds.uid,
                        appId: adds.appId,
                        token: adds.token,
                        pid: adds.pid,
                        quantity: adds.quantity,
                        appKey: adds.appKey,
                        accountId: adds.accountId
                    },
                    success: function (data) {
                        try {
                            console.log(data);
                            adds.gameTransCode = data.data.orderId;
                            adds.timestamp = data.data.time;
                            adds.createOrder();
                        } catch (err) {

                        }
                    }
                });
            }
        },
        /**
         *创建游戏币的订单(平台)
         **/
        createOrder: function () {
            if (adds.uid) {
                $.ajax({
                    type: 'POST',
                    url: "/api/createOrder",
                    data: {
                        uid: adds.uid,
                        appId: adds.appId,
                        token: adds.token,
                        pid: adds.pid,
                        quantity: '1',
                        gameTransCode: adds.gameTransCode,
                        appKey: adds.appKey
                    },
                    success: function (data) {
                        try {
                            var ob = data.data;
                            adds.orderId = ob.orderId;
                            if (ob.coinEnough == false) {
                                alert("游戏账户游戏币不够！");
                            } else if (ob.coinEnough == true) {
                                layer.prompt({
                                    title: '请输入游戏支付密码！'
                                }, function (pass, index) {
                                    console.log(pass);
                                    if (pass == "" || pass == null) {
                                        adds.confirmOrder(pass);
                                    } else {
                                        layer.close(index);
                                    }
                                });

                            }
                        } catch (err) {

                        }
                    }
                });
            }
        },
        /**
         *确认订单(确定支付)
         **/
        confirmOrder: function (psd) {
            if (psd == "" || psd == null) {
                return false;
            }
            $.ajax({
                type: 'POST',
                url: "/api/confirmOrder",
                data: {
                    uid: adds.uid,
                    appId: adds.appId,
                    token: adds.token,
                    orderId: adds.orderId,
                    chargePwd: psd
                },
                success: function (data) {
                    try {
                        if (data.status == '0') {
                            layer.msg(data.message);
                        } else {
                            layer.msg(data.message);
                        }
                    } catch (err) {

                    }
                }
            });

        },
        /**
         * 点击选择金额
         * */
        chooseyuan: function (psd) {
            $(document).ready(function () {
                $('.chooseyuan img').click(function () {
                    $('.chooseyuan img').removeClass('yuanactive');
                    // alert( $(this).attr('jine'));//yuanactive
                    $(this).addClass('yuanactive');
                    $('#jingying_num').val($(this).attr('jine'));
                })

                $("#jingying_num").focus(function(){
                    $('.chooseyuan img').removeClass('yuanactive');
                });

            })


        }

    }
});

adds.uid = util.getCookie("uid");
adds.token = util.getCookie("token");

adds.addsenjorevent();
adds.chooseyuan();