/**
 * Created by Administrator on 2017/9/22.
 */
var app = new Vue({
    el: '#app',
    data: {
        uid: '',
        accountId: '',
        binfo: '',//券的剩余量
        boxId: '11',//配置boxId
        prize10: '',//显示10个中奖的名单
        duobaoflag: 0,
        desc: '次元深海大和绝版皮肤,各种周边实物奖励等你来拿',
        congxinxipai: 0,
        prizeDIV: '',
        prizeName: '',
        lotteryType: '',
        prizeList: ''

    },
    methods: {
        /**
         * 初始化
         */
        init: function () {
            app.accountId = util.getCookie("accountId_shequ");
            app.uid = util.getCookie("squid");
            if (app.uid) {
                app.getuserdata();//个人信息
            }
            if (app.accountId) {
                app.activeGetInfo();//查询用户券余量
            }

            app.getlrecentlylist_10();//获取中奖人的列表电视机
            app.getPrizeListData();//获取奖品列表
            app.startPrize();//开始抽奖

        },
        /**
         * 加载个人信息(判断该用户能否抽奖，否则去个人中心添加完整信息)
         */
        getuserdata: function () {
            $.ajax({
                type: 'POST',
                url: "/api/userdata",
                data: {
                    uid: app.uid
                },
                success: function (data) {
                    try {
                        var accountId = data.data.accountId;
                        if (!accountId || accountId == null || accountId == "") {
                            layer.msg('去个人中心添加昵称');
                            setTimeout(function () {
                                // location.href = '/usercenter?accound=kong';
                            }, 1500)
                        }
                    } catch (err) {
                        layer.msg('去个人中心添加昵称');
                        setTimeout(function () {
                            // location.href = '/usercenter?accound=kong';
                        }, 1500)
                    }
                }
            })
        },
        /**
         * 查询用户券余量
         */
        activeGetInfo: function () {
            if (app.accountId) {
                $.ajax({
                    type: 'POST',
                    url: "/api/active_getinfo",
                    data: {
                        accountId: app.accountId
                    },
                    success: function (data) {
                        try {
                            app.binfo = data.data;
                        } catch (err) {
                        }
                    }
                });
            }
        },
        /**
         * 获取中奖名单（显示10个）
         */
        getlrecentlylist_10: function () {
            $.ajax({
                type: 'POST',
                url: "/api/geTenWinningList",
                data: {
                    boxId: app.boxId
                },
                success: function (data) {
                    try {
                        // console.log(data);
                        app.prize10 = data.data;
                        $('#scrollmessage ul').html('');
                        var strhtml = "";
                        for (var i = 0; i < app.prize10.length; i++) {
                            strhtml = strhtml + '<li><p><span class="sever">' + app.prize10[i].nickName + '</span><span class="name"> ' + '' + ' </span> 抽到 <span class="jiang"> ' + app.prize10[i].prizeName + ' </span> <span class="gang">' + app.prize10[i].time.substring(5, 16) + '</span></p></li>';
                        }
                        $('#scrollmessage ul').html(strhtml);
                    } catch (err) {
                    }
                }
            });
        },
        /**
         * 获取奖品列表
         */
        getPrizeListData: function () {
            $.ajax({
                type: 'POST',
                url: "/api/getPrizeListData",
                data: {
                    boxId: app.boxId
                },
                success: function (data) {
                    try {
                        app.prizeList = data.data;
                        setTimeout(function () {
                            app.initBox(data.data);
                        }, 6000)
                    } catch (err) {
                    }
                }
            });
        },
        /**
         * 卡牌初始入场
         */
        initBox: function (data) {
            if (!data) {
                layer.msg("数据异常，稍后重试！");
                return false;
            }
            $('.spades').addClass('fanpai2');
            for (var i = 0; i < 9; i++) {
                doset1(i);
            }
            function doset1(i) {
                var orderid = data[i].orderId;
                $('.spades').eq(i).addClass('fanpai');
                $('.spades').eq(i).removeClass('fanpai').addClass('fanpai1');
                $('.spades').eq(i).find('.face').addClass('background80');
                $('.spades').eq(i).find('.face').css('background-image', 'url(../../static/imgs_static/fanpai/jiang/' + jiangpin[orderid] + '.png)');
                setTimeout(function () {
                    $('.title').addClass('titlestyle');
                    $('.title').eq(i).html(data[i].prizeName);
                    if (i >= 8) {
                        app.duobaoflag = 1;
                    } else {
                        app.duobaoflag = 0;
                    }
                }, 500)
            }

        },
        /**
         * 开始抽奖
         */
        startPrize: function () {
            var cl_flag = 0;
            $('.spades').click(function () {
                if (app.duobaoflag != 1) {
                    layer.msg('正在洗牌！');
                    return false;
                }

                if (app.congxinxipai != 0) {
                    layer.msg('重新夺宝');
                    return false;
                }

                if ($('.card').hasClass('fanpai1')) {
                    layer.msg('点击夺宝');
                    return false;
                }

                if (cl_flag == 0) {
                    // 获取该张的索引
                    var index = $(this).index();
                    var th = $(this);
                    app.prizeDIV = index;
                    if (app.binfo.personQuota < 288) {
                        layer.msg("柠檬点不足！");
                        setTimeout(function () {
                            location.href = "/usercenter?congzhi=ok";
                        }, 1000)
                        return false;
                    }
                    if ($(this).hasClass('fanpaisign')) {
                        layer.msg("该张牌已经被抽过！");
                        return false;
                    } else {
                        var errtime = 0;
                        var timeouterr = setInterval(function () {
                            if (errtime == 30) {
                                layer.msg("网络异常,请稍候再试！");
                                setTimeout(function () {
                                    window.location.reload();
                                }, 3000)
                            }
                            errtime = errtime + 1;
                        }, 1000);
                        cl_flag = 1;
                        $.ajax({
                            type: 'POST',
                            url: "/api/startLuckDrawData",
                            data: {
                                accountId: app.accountId,
                                boxId: app.boxId,
                                lotteryType: '2'
                            },
                            success: function (data) {
                                console.log(data);
                                if (data == "error_goto_user") {
                                    layer.msg("登录出现异常，请重新登录！");
                                    util.delCookie("squid");
                                    util.delCookie("token");
                                    util.delCookie("accountId_shequ");
                                    setTimeout(function () {
                                        location.href = "/yinling";
                                    }, 1000)
                                }

                                if (data.resultCode == 300) {
                                    layer.msg(data.resultMsg);
                                    setTimeout(function () {
                                        window.location.reload();
                                    }, 2000)
                                    return false;
                                }

                                try {
                                    var prizeid = data.data.prizeId;
                                    if (typeof(prizeid) == 'number') {
                                        $('.card').css('opacity', '0');
                                        th.css('opacity', '1');
                                        th.addClass('fanpai');
                                        th.addClass('fanpaisign');
                                        setTimeout(function () {
                                            th.removeClass('fanpai').addClass('fanpai1');
                                        }, 500)
                                        var url = "";
                                        setTimeout(function () {
                                            // th.find('.face').addClass('changeimg');
                                            th.find('.face').attr('prizeName', data.data.prizeName);

                                            var dd = prizeID[prizeid];
                                            dd = jiangpin[dd];
                                            th.addClass('fanpai2');
                                            th.attr('orderid', prizeID[prizeid]);
                                            th.find('.face').addClass('background80');
                                            th.find('.title').addClass('titlestyle');
                                            th.find('.title').html(data.data.prizeName);
                                            url = '../../static/imgs_static/fanpai/jiang/' + dd + '.png';
                                            th.find('.face').css('background-image', 'url(' + url + ')');

                                            th.css({
                                                "transform": " " + th[0].style.transform + " rotate3d(0, 1, 0, 180deg) scale(1.05,1.05)"
                                            });
                                        }, 100)
                                        setTimeout(function () {
                                            th.css({
                                                "transform": " " + th[0].style.transform + " rotate3d(0, 1, 0, 180deg) scale(1.0,1.0)"
                                            });
                                        }, 200)
                                        setTimeout(function () {
                                            $('.card').css('opacity', '1');
                                        }, 700)

                                        app.prizeName = data.data.prizeName;
                                        setTimeout(function () {
                                            // $('#prizedot').html("恭喜你中了" + prizeid);
                                            clearInterval(timeouterr);
                                            //区分自动发放还是手动去领取
                                            var prizetype = app.distinguishDistribution(prizeid);

                                            if (prizetype == '1' || prizetype == '2') {//前去领奖
                                                $('#showimgBigName').html("恭喜抽中了" + data.data.prizeName);
                                                $('#gainingmask3 img').attr('src', url);
                                                $('#gainingmask3').show();

                                            } else {//自动发放
                                                $('#showimgBigName1').html("恭喜抽中了" + data.data.prizeName);
                                                $('#gainingmask1 img').attr('src', url);
                                                $('#gainingmask1').show();

                                            }

                                        }, 1000)
                                        cl_flag = 0;
                                        app.congxinxipai = 1;
                                        app.activeGetInfo();
                                        app.getlrecentlylist_10();
                                        setTimeout(function () {
                                            app.allFanpai(prizeid);
                                        }, 1000)

                                        app.WXshare();

                                    }
                                } catch (err) {
                                    layer.msg("出现异常！");
                                    cl_flag = 0;
                                }
                            }, error: function (data) {
                                console.log(data);
                                layer.msg("网络出现错误，请稍后再试！");
                            }
                        });
                    }
                } else {
                    // layer.msg("请先选择一张券！");
                    return false;
                }
            })
        },
        /**
         * 区分发奖手动或自动
         * */
        distinguishDistribution: function (prizeId) {
            try {
                for (var i = 0; i < app.prizeList.length; i++) {
                    if (app.prizeList[i].prizeId == prizeId) {
                        return app.prizeList[i].prizeType;
                    }
                }
            } catch (err) {

            }

        },
        /*
         * 重新洗牌
         * */
        chouwanxipai: function () {
            if (app.duobaoflag != 1) {
                layer.msg('正在洗牌！');
                return false;
            }
            app.duobaoflag = 0;
            $('.title').html('');
            $('.title').removeClass('titlestyle');
            $('.face').removeClass('background80');
            app.congxinxipai = 0;
            $('.card ').removeClass('fanpai1 fanpaisign fanpai fanpai2');
            deck.fan();
            $('.face').css('background-image', 'url(../../static/imgs_static/fanpai/card.png)');
            deck.shuffle();
            deck.shuffle();
            deck.poker();

            setTimeout(function () {
                app.duobaoflag = 1;
            }, 4000)
        },
        /**
         * 全部翻牌
         **/
        allFanpai: function (prizeid) {
            $('.spades').addClass('fanpai2');
            for (var i = 0; i < 9; i++) {
                doset(i);
            }
            function doset(i) {
                if ($('.spades').eq(i).hasClass('fanpaisign')) {


                } else {
                    var orderid = app.prizeList[i].orderId;
                    // console.log(orderid);
                    $('.spades').eq(i).addClass('fanpai');
                    $('.spades').eq(i).removeClass('fanpai').addClass('fanpai1');
                    $('.spades').eq(i).find('.face').addClass('background80');
                    $('.spades').eq(i).find('.face').css('background-image', 'url(../../static/imgs_static/fanpai/jiang/' + jiangpin[orderid] + '.png)');

                    setTimeout(function () {
                        $('.title').addClass('titlestyle');
                        $('.title').eq(i).html(app.prizeList[i].prizeName);

                        //判断重复显示其它没有抽中的奖品
                        if ($('.fanpaisign .face').attr('prizename') == app.prizeList[i].prizeName) {
                            var od = Number(app.prizeDIV) + 1;
                            $('.spades').eq(i).find('.face').css('background-image', 'url(../../static/imgs_static/fanpai/jiang/' + jiangpin[od] + '.png)');
                            $('.title').eq(i).html(app.prizeList[app.prizeDIV].prizeName);
                        }

                    }, 1)
                }

                if (i >= 8) {
                    app.duobaoflag = 1;
                } else {
                    app.duobaoflag = 0;
                }
            }
        },
        /**
         * 微信分享.
         */
        WXshare: function () {
            var allianceId = app.getDevice();
            var url = encodeURIComponent(location.href.split('#')[0]);
            $.ajax({
                type: "POST",
                url: "/api/shareaddSign",
                data: {
                    appId: '20019',
                    url: url,
                    appKey: '71599476762ca9835879f4d188919549',
                    allianceId: allianceId
                },
                success: function (data) {
                    if (data && data.status == 0) {
                        wx.config({
                            debug: false,
                            appId: 'wx90ea8be0c05b9630',
                            timestamp: data.data.timestamp,
                            nonceStr: data.data.nonceStr,
                            signature: data.data.signature,
                            // url: url,
                            jsApiList: ['onMenuShareQZone', 'checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'getNetworkType', 'hideOptionMenu', 'showOptionMenu', 'closeWindow', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'scanQRCode', 'chooseWXPay']
                        });
                    }
                    /**
                     * 微信分享.
                     */
                    wx.ready(function () {
                        if (app.prizeName != "") {
                            app.desc = "我在福利社夺宝中夺得" + app.prizeName + ",次元深海大和绝版皮肤,各种周边实物奖励等你来拿";
                        } else {
                            app.desc = '次元深海大和绝版皮肤,各种周边实物奖励等你来拿';
                        }
                        var url = location.href.split('/topic/active2')[0];
                        var imgurl = location.href.split('/topic/active2')[0] + '/static/imgs_static/share/share_dh.png';
                        var content = {
                            title: '超给力的夺宝福利', // 分享标题
                            desc: app.desc, // 分享描述
                            link: url + '/users/sharefuli', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: imgurl, // 分享图标
                            type: 'link', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                            success: function () {
                                // 用户确认分享后执行的回调函数
                                $('.sharemask').hide();
                            },
                            cancel: function () {
                                // 用户取消分享后执行的回调函数
                            }
                        }

                        wx.onMenuShareQZone(content);
                        wx.onMenuShareAppMessage(content);
                        wx.onMenuShareTimeline(content);
                        wx.onMenuShareQQ(content);
                    })
                },
                error: function (data) {
                    console.log(data);
                }
            });

        },


    }
})


app.init();
$(document).ready(function () {
    //中奖后close
    $('#gainingmask3 .gbtn3').click(function () {
        $('#gainingmask3').hide();
        app.chouwanxipai();
    })

    $('#gainingmask1 .gbtn3').click(function () {
        $('#gainingmask1').hide();
        app.chouwanxipai();
    })

    //点击弹出层周围，关闭
    $('.showimgBig').click(function () {
        $('.showimgBig').hide();
    })
})


/**
 * 礼品的配置文件
 */
var jiangpin = {
    '1': 'ps4',
    '2': 'shdh',
    '3': 'wlwp',
    '4': 'baozhen',
    '5': 'jdEcard',
    '6': 'Qcard',
    '7': 'nm500',
    '8': 'expX2greenzhanghao',
    '9': 'expX2purplehero'
}

var prizeID = {
    '39': '1',
    '30': '2',
    '48': '3',
    '32': '4',
    '19': '5',
    '20': '6',
    '45': '7',
    '55': '8',
    '56': '9'
}