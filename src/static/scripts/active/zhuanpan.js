var app = new Vue({
    el: '#app',
    data: {
        accountId: '',
        binfo: '',
        prize10: '',
        boxId: '',
        prizeList: '',
        lotteryType: '1',
        uid: '',
        uinfo: '',
        click: true,
        isBegin: false
    },
    methods: {
        getuserinfo: function () {
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
                            // console.log(app.binfo.personQuota);
                        } catch (err) {
                        }
                    }
                });
            }
        },
        getuserdata: function () {
            if (app.uid) {
                $.ajax({
                    type: 'POST',
                    url: "/api/userdata",
                    data: {
                        uid: app.uid
                    },
                    success: function (data) {
                        try {
                            console.log(data);
                            app.uinfo = data.data;
                            app.accountId = app.uinfo.accountId;
                            app.getuserinfo();
                            if (!app.accountId) {
                                layer.msg('去个人中心添加昵称');
                                setTimeout(function () {
                                    location.href = '/usercenter?accound=kong';
                                }, 1500)
                            }
                        } catch (err) {
                            layer.msg('去个人中心添加昵称');
                            setTimeout(function () {
                                location.href = '/usercenter?accound=kong';
                            }, 1500)
                        }
                    }
                });
            }
        },
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
        getPrizeListData: function () {
            if (app.boxId) {
                $.ajax({
                    type: 'POST',
                    url: "/api/getPrizeListData",
                    data: {
                        boxId: app.boxId
                    },
                    success: function (data) {
                        // console.log(data);
                        try {
                            app.prizeList = data.data;
                            luck.loadingjiangping(app.prizeList);
                        } catch (err) {
                        }
                    }
                });
            }
        },
        chooseTicket: function () {
            //目前只有一种券，默认选择
            $('#commonTicket').addClass('box-shadow1');
            $('#commonTicket').click(function () {
                var thishasquan = $(this).hasClass('box-shadow1');
                if (thishasquan) {
                    $(this).removeClass('box-shadow1');
                } else {
                    $('#seniorTicket').removeClass('box-shadow1');
                    $(this).addClass('box-shadow1');
                    app.lotteryType = "1";
                }
            });
            $('#seniorTicket').click(function () {
                var thishasquan = $(this).hasClass('box-shadow1');
                if (thishasquan) {
                    $(this).removeClass('box-shadow1');
                } else {
                    $('#commonTicket').removeClass('box-shadow1');
                    $(this).addClass('box-shadow1');
                    app.lotteryType = "2";
                }
            });
        },
        /**
         *添加转数字，当抽中现金点时，出现
         **/
        minStartshake: function (pr, personalQuota) {
            $('#gainingmask2').show();
            //数字对齐控制
            window.w = $(".num").width();
            w = Math.floor(w);
            window.h = w * 1.5;
            $('.num').css('width', w + 'px');
            $('.num').css('height', h + 'px');

            var u = window.h;
            if (app.isBegin) return false;
            app.isBegin = true;
            $(".num").css('backgroundPositionY', 0);
            if (!app.click) {
                console.log("点击被屏蔽");
                return false;
            }
            var prize = personalQuota;
            var result = prize;
            var resultStr = result;
            resultStr = resultStr.toString();
            if (resultStr.length < 4) {
                for (var i = resultStr.length; i < 4; i++) {
                    resultStr = '0' + resultStr;
                }
                result = resultStr;
            }
            console.log(result);
            var num_arr = (result + '').split('');
            $(".num").each(function (index) {
                var _num = $('.num').eq(3 - index);
                setTimeout(function () {
                    setTimeout(function () {
                        _num.animate({
                            backgroundPositionY: (u * 60) - (u * num_arr[3 - index])
                        }, {
                            duration: 6000 + index * 3000,
                            easing: "easeInOutCirc",
                            complete: function () {
                                if (index == 3) {
                                    app.click = true;
                                    app.isBegin = false;
                                    $('.gainingmask2 .btn').show();
                                    $('#min-shake').html(prize);
                                    app.getuserinfo();
                                }
                            }
                        });
                    }, index * 30);
                }, 5000)

            });

            /*$.ajax({
             type: 'POST',
             url: "/api/startQuotaShake ",
             data: {
             accountId: app.accountId
             },
             success: function (data) {
             if (data == "error_goto_user") {
             layer.msg("登录出现异常，请重新登录！");
             util.delCookie("squid");//ddd
             util.delCookie("token");
             util.delCookie("accountId_shequ");
             setTimeout(function () {
             location.href = "/users";
             }, 1000)
             }
             try {


             var prize = data.data.personalQuota;
             var result = prize;
             var resultStr = result;
             resultStr = resultStr.toString();
             if (resultStr.length < 4) {
             for (var i = resultStr.length; i < 4; i++) {
             resultStr = '0' + resultStr;
             }
             result = resultStr;
             }
             console.log(result);
             var num_arr = (result + '').split('');
             $(".num").each(function (index) {
             var _num = $('.num').eq(3 - index);
             setTimeout(function(){
             setTimeout(function () {
             _num.animate({
             backgroundPositionY: (u * 60) - (u * num_arr[3 - index])
             }, {
             duration: 6000 + index * 3000,
             easing: "easeInOutCirc",
             complete: function () {
             if (index == 3) {
             app.click = true;
             app.isBegin = false;
             $('.gainingmask2 .btn').show();
             $('#min-shake').html(prize);
             app.getuserinfo();
             }
             }
             });
             }, index * 30);
             },5000)

             });
             } catch (err) {
             }
             }
             });*/


        },
        startPrize: function () {
            luck.init('luck');
            $("#btn").click(function () {
                var ticket = $('.quan').hasClass('box-shadow1');
                if (ticket) {
                    // 注册事件（防止动画暂停）
                    $("body").bind("touchmove", function (event) {
                        event.preventDefault();
                    });
                    //确保抽奖时在屏幕中间
                    // $('.frm').animate({scrollTop: window.topl}, 500);

                    if (click) {
                        console.log("点击被屏蔽");
                        return false;
                    } else {

                        //30s后接口异常，自动停止
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

                        console.log("点击没屏蔽");
                        if (app.lotteryType == 1) {
                            var commonno = $('#commonno').html();
                            if (commonno == '0张') {
                                $("body").unbind("touchmove");
                                layer.msg("该类型的券已经用完！");
                                return false;
                            }
                        }
                        if (app.lotteryType == 2) {
                            var seniorno = $('#seniorno').html();
                            console.log(seniorno);
                            if (seniorno == '0张') {
                                $("body").unbind("touchmove");
                                layer.msg("该类型的券已经用完！");
                                return false;
                            }
                        }

                        $.ajax({
                            type: 'POST',
                            url: "/api/startLuckDrawData",
                            data: {
                                accountId: app.accountId,
                                boxId: app.boxId,
                                lotteryType: app.lotteryType
                            },
                            success: function (data) {
                                if (data == "error_goto_user") {
                                    layer.msg("登录出现异常，请重新登录！");
                                    util.delCookie("squid");//ddd
                                    util.delCookie("token");
                                    util.delCookie("accountId_shequ");
                                    setTimeout(function () {
                                        location.href = "/users";
                                    }, 1000)
                                }
                                if (data.resultCode == 300) {
                                    alert(JSON.stringify(data));
                                }
                                var rad;
                                try {
                                    console.log(data.data);
                                    var prizeid = data.data.prizeId;
                                    console.log(prizeid);
                                    if (prizeid != '0') {
                                        rad = Math.floor(Math.random() * 10);
                                    }
                                    console.log(rad);
                                    // console.log(prizeid);

                                    if (rad < 5) {
                                        var orderid = $('.luck-unit[prizeid = ' + prizeid + ' ]').eq(0).attr('orderid');
                                    } else if (rad >= 5) {
                                        var orderid = $('.luck-unit[prizeid = ' + prizeid + ' ]').eq(1).attr('orderid');
                                    }
                                    if (typeof(orderid) == 'undefined') {
                                        var orderid = $('.luck-unit[prizeid = ' + prizeid + ' ]').eq(0).attr('orderid');
                                    }

                                    var name = $('.luck-unit[prizeid = ' + prizeid + ' ]').attr('prizename');
                                    luck.prize = orderid - 1;

                                    var time1 = setInterval(function () {
                                        if (luck.times == 0) {
                                            if (prizeid != '0' && prizeid != '1') {
                                                //前去领奖的奖品
                                                var imgurl = $('.luck-unit[prizeid = ' + prizeid + ' ]').find('img').attr('src');
                                                $('.gbtn1').show();
                                                $('#prizedot').html("恭喜你中了" + name);
                                                $('#gainingmask').show();
                                                $('#showprizeimg').attr('src', imgurl);
                                                $('#showprizeimg').show();
                                            } else if (prizeid == '1') {
                                                $('#gainingmask2').css("opacity", '1');
                                            } else if (prizeid == '0') {
                                                $('#prizedot').html(name);
                                                $('#gainingmask').show();
                                                $('.gbtn1').hide();
                                                $('#tks').show();
                                            }
                                            clearInterval(time1);
                                            clearInterval(timeouterr);
                                            $("body").unbind("touchmove");
                                            // app.getPrizeListData();

                                        }
                                    }, 10);

                                    if (prizeid == '1') {
                                        $('#gainingmask2').css("opacity", '0');
                                        app.minStartshake(name, data.data.personalQuota);
                                    }
                                    app.getuserinfo();
                                    app.getlrecentlylist_10();

                                } catch (err) {
                                }
                            }
                        });
                        luck.speed = 100;
                        roll();
                        click = true;
                        return false;
                    }
                } else {
                    layer.msg("请先选择一张券！");
                    return false;
                }
                //按下弹起效果
                $("#btn").addClass("cjBtnDom");
                setTimeout(function () {
                    $("#btn").removeClass("cjBtnDom");
                }, 200);

            });
        },
        /**
         *上传头像图片
         **/
        uploadimg: function () {

        },
        /**
         * 微信分享.
         */
        WXshare: function () {
            var allianceId = util.getDevice();
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
                    console.log(data);
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
                        var url = util.getlocalhostPath() + '/users/sharefuli';
                        var imgurl = util.getlocalhostPath() + '/static/imgs_static/share/sharelogo1.png';
                        var content = {
                            title: '玩游戏现金奖品等你来拿', // 分享标题
                            desc: '现金奖品等你来拿', // 分享描述
                            link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: imgurl, // 分享图标
                            type: 'link', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                            success: function () {
                                // 用户确认分享后执行的回调函数
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
        /**
         * 点击领奖.
         */
        battleSendLottery: function () {
            $.ajax({
                type: 'POST',
                url: "/api/battleSendLottery",
                data: {
                    key: ''
                },
                success: function (data) {
                    // console.log(data);
                    try {
                        console.log(data);
                    } catch (err) {
                    }
                }
            });
        },

    }
})

app.uid = util.getCookie("squid");
if (app.uid) {
    app.getuserdata();
} else {
    window.location.href = "/users/sharefuli";
}

app.accountId = util.getCookie("accountId_shequ");//这设session来之于usercenterjs
app.boxId = '9';

app.getlrecentlylist_10();
app.getPrizeListData();

//注册事件
app.chooseTicket();
app.startPrize();
app.WXshare();
//关闭添加精英券按钮
$('#addS-close').click(function () {
    $('.addSenior').hide();
})
//使用平台币购买
$('#btn-addpfb').click(function () {
    adds.getuserdata();
})

//中奖后close
$('.gainingmask .gbtn').click(function () {
    $("#min-shake").html("");
    $("#gainingmask2 .btn").hide();
    $('.gainingmask').hide();
    $('#tks').hide();
    $('#showprizeimg').hide();
    $('#btn').trigger("click");
})

$('.rulebox').click(function () {
    $('.rulebox').hide();
})

$('.rule').click(function () {
    $('.rulebox').show();
})

//点击前去领奖，并且显示中奖列表部分，用cookie来实现
$('#gotoprize').click(function () {
    util.setCookie("showprize", "show");
    location.href = "/usercenter";
})

//点击查看大图
$('.luck-unit').click(function () {
    var th = $(this);
    console.log(th);
    var imgurl = th.find('img').attr('src');
    $('#gainingmask3').show();
    $('#showimgBigName').html(th.attr('prizename'));
    $('#gainingmask3 img').attr('src', imgurl);
})

//点击关闭查看大图
$('.gbtn3').click(function () {
    $('#gainingmask3').hide();
})

//点击弹出层周围，关闭
$('.showimgBig').click(function () {
    $('.showimgBig').hide();
})

$('.gainingmask').click(function () {
    $('.gainingmask').hide();
})

$('#getcard').click(function () {
    location.href = "/users/yinlingcast";
})