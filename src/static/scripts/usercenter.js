/**
 * Created by Administrator on 2017/5/24.
 */
var app = new Vue({
    el: '#app',
    data: {
        uid: '',
        server: '',
        roleid: '',
        role: '',
        accountID: '',
        uinfo: {},
        sex: '',
        describe: '',
        winlist: '',
        winid: '',
        count_unsend: 0,
        sserver: '',//cookie里用到的和上面的server区分
        ssource: '',
        binfo: '',
        Ecard: '',
        appId: '20019',
        desc: '玩游戏兑换京东E卡/Q币卡,现金奖品拿到手软',
        icon: '',
        rotateFlag: 0,
        base64: '',
        filename: '',
        blob: '',
        file: '',
        o: ''
    },
    methods: {
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
                            app.uinfo = data.data;
                            if (app.uinfo.nickName && app.uinfo.nickName != "") {
                                $('#name').val(app.uinfo.nickName);
                            } else {
                                uinfo.nickName = util.getCookie("infoname");
                                $('#name').val(util.getCookie("infoname"));
                            }
                            $('#phone').val(app.uinfo.telphone);
                            $('#QQ').val(app.uinfo.qq);
                            $('#ads').val(app.uinfo.address);
                            $('#Rname').val(app.uinfo.name);
                            //头像获取
                            if (app.uinfo.icon == "" || app.uinfo.icon == null) {

                                var url = util.getlocalhostPath() + '/static/imgs_static/icon/head.png';
                                $("#cl-img-input").attr('src', url);
                                var w = $("#cl-img-input").width();
                                $("#cl-img-input").css("height", w + "px");
                            } else {
                                // $("#cl-img-input").attr('src', app.uinfo.icon);
                                // var w = $("#cl-img-input").width();
                                // $("#cl-img-input").css("height", w + "px");
                                console.log(app.uinfo.icon);
                                $.ajax({
                                    type: 'post',
                                    url: app.uinfo.icon,
                                    success: function (data) {
                                        try {
                                            // $("#rotateImg").attr('src', data);
                                            $("#cl-img-input").attr('src', data);
                                            //纠正下图片的样式
                                            var w = $("#cl-img-input").width();
                                            $("#cl-img-input").css("height", w + "px");

                                        } catch (err) {

                                        }
                                    }
                                });
                            }

                            app.accountID = app.uinfo.accountId;

                            util.setCookie("accountId_shequ", app.accountID);
                            app.sex = app.uinfo.sex;
                            app.describe = app.uinfo.signature;
                            if (app.sex == 1) {
                                $('#girl').hide();
                                $('#boy').show();
                            } else if (app.sex = 2) {
                                $('#girl').show();
                                $('#boy').hide();
                            }
                            if (app.uinfo.accountId == null || app.uinfo.accountId == "") {
                                //不显示取消按钮
                                $('.layui-layer-btn1').hide();
                                layer.prompt({
                                    title: '请修改你的昵称,昵称不能为空！'
                                }, function (pass, index) {
                                    var str = pass;
                                    console.log(pass);
                                    if (pass == "" || pass == null) {

                                    } else {
                                        layer.close(index);
                                    }
                                });
                            }
                            //修改和添加描述
                            if (app.describe != "" && app.describe) {
                                $('#info-describe').html(app.describe);
                            }
                            //获取中奖列表
                            app.getUserWinningList();
                            //获取柠檬点
                            app.getuserinfo();

                        } catch (err) {
                            var url = util.getlocalhostPath() + '/static/imgs_static/icon/head.png';
                            $("#cl-img-input").attr('src', url);
                            app.uinfo = {};
                            app.uinfo.nickName = util.getCookie("infoname");

                            $('#name').val(util.getCookie("infoname"));

                        }
                    }
                });
            }
        },
        getuserinfo: function () {
            if (app.accountID) {
                $.ajax({
                    type: 'POST',
                    url: "/api/active_getinfo",
                    data: {
                        accountId: app.accountID
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
        submituserdata: function () {
            if (app.uid) {
                var name = $('#name').val();
                var sex = app.sex;
                var ads = $('#ads').val();
                var qq = $('#QQ').val();
                var phone = $('#phone').val();
                var rname = $('#Rname').val();

                if (!checkPhone(phone)) {
                    layer.msg('手机格式有误！');
                    return false;
                }
                if (!name) {
                    layer.msg("请填写昵称！");
                    return false;
                } else {
                    console.log(name.length);
                    if (name.length > 10) {
                        layer.msg("昵称不得超过10个字符！");
                        return false;
                    }
                }
                if (!rname) {
                    layer.msg("请填写真实姓名！");
                    return false;
                } else {
                    if (rname.length > 5) {
                        layer.msg("姓名过长！");
                        return false;
                    }
                }
                if (!app.icon) {
                    // app.icon = $("#cl-img-input").attr('src');
                }
                $("#name").change(function () {
                    return false;
                });
                $.ajax({
                    type: 'POST',
                    url: "/api/subuserdata",
                    data: {
                        uid: app.uid,
                        id: app.accountID,
                        nickName: name,
                        sex: sex,
                        address: ads,
                        qq: qq,
                        telphone: phone,
                        name: rname,
                        icon: app.icon
                    },
                    success: function (data) {
                        if (data == "error_goto_user") {
                            layer.msg("登录出现异常，请重新登录！");
                            util.delCookie("squid");//dd
                            util.delCookie("token");
                            util.delCookie("accountId_shequ");
                            setTimeout(function () {
                                location.href = "/users";
                            }, 1000)
                            return false;
                        }
                        try {
                            console.log(data);
                            $('#iosDialog2 .weui-dialog__bd').html(data.resultMsg + '!');
                            $('#iosDialog2').show();
                            app.getuserdata();
                        } catch (err) {
                        }
                    }
                });
            }
        },
        /**
         * 获取个人中奖列表.
         */
        getUserWinningList: function () {
            if (app.accountID != "") {
                $.ajax({
                    type: 'POST',
                    url: "/api/getUserWinningList",
                    data: {
                        accountId: app.accountID
                    },
                    success: function (data) {
                        try {
                            app.count_unsend = 0;
                            app.winlist = data.data;
                            if (data.lastSendCardName != "") {
                                app.desc = "我拿到了" + data.lastSendCardName + ", 现金奖品拿到手软";
                            }
                            for (var i = 0; i < data.data.length; i++) {
                                if (data.data[i].isSend == "0") {
                                    app.count_unsend = app.count_unsend + 1;
                                }

                            }
                        } catch (err) {
                        }
                    }
                });
            } else {
                console.log("accountID为空！");
            }
        },
        /**
         * 获取区服信息.
         */
        getServer: function () {
            $.ajax({
                type: 'POST',
                url: "/api/getServer",
                success: function (data) {
                    $('#select-server').html("");
                    try {
                        var serverList = data.serverList;
                        var html_str = '<option value="-1">请选择大区</option>';
                        for (var i = 0; i < serverList.length; i++) {
                            switch (serverList[i].serverName) {
                                case "天使之门":
                                    serverList[i].serverKey = '23000';
                                    break;
                                case "天空之城":
                                    serverList[i].serverKey = '23002';
                                    break;
                                case "绯红暴君":
                                    serverList[i].serverKey = '23003';
                                    break;
                            }
                            html_str = html_str + '<option value=' + serverList[i].serverKey + '>' + serverList[i].serverName + '</option>';
                        }
                        $('#select-server').html(html_str);
                        // app.keepselect();
                        $('#select-server').val(app.sserver);
                        app.getRole(app.sserver);
                    } catch (err) {

                    }
                }
            });
        },
        /**
         * 获取角色信息.
         */
        getRole: function (server) {
            if (app.uid) {
                $.ajax({
                    type: 'POST',
                    url: "/api/getRole",
                    async: false,
                    data: {
                        uid: app.uid,
                        server: server == ("" || undefined) ? app.server : server
                    },
                    success: function (data) {
                        app.role = data.data;
                        try {
                            setTimeout(function () {
                                $('#select-role').val(app.ssource);
                            }, 10)
                        } catch (err) {

                        }
                    }
                });
            }
            return app.role;
        },
        /**
         * 区服角色级联操作.
         */
        changeServer: function () {
            $("#select-server").change(function () {
                app.server = $("#select-server").val();
                if (app.server != '-1') {
                    var roledata = app.getRole();
                    console.log(roledata);
                    setTimeout(function () {
                        if (roledata.length > 0) {
                            app.roleid = $("#select-role").val();
                        }
                    }, 200)
                } else {
                    layer.alert('请先选择区服！');
                    $('#select-role').val('1');
                }
            });
        },
        /**
         * 奖品发放提交.
         */
        sendGamePrize: function (winid) {
            app.server = $('#select-server').val();
            if (!app.server || app.server == "") {
                layer.msg("请选择区服");
                return false;
            }
            app.allianceId = $('#select-role').val();
            if (!app.allianceId || app.allianceId == "") {
                layer.msg("请选择角色1");
                return false;
            }
            app.roleid = $('#select-role ').find("option:selected").attr('roleid');
            if (!app.roleid || app.roleid == "") {
                layer.msg("请选择角色2");
                return false;
            }

            if (app.winningid != "") {
                $.ajax({
                    type: 'POST',
                    url: "/api/sendGamePrize",
                    data: {
                        server: app.server,
                        allianceId: app.allianceId,
                        roleId: app.roleid,
                        winningId: winid,
                        accountId: app.accountID
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
                            return false;
                        }
                        try {
                            console.log(data);
                            if (data.resultCode == 200) {
                                $('.sendlottery').hide();
                                setTimeout(function () {
                                    layer.msg(data.resultMsg);
                                    //获取中奖列表
                                    app.getUserWinningList();
                                }, 200)
                            } else {
                                $('.sendlottery').hide();
                                layer.msg(data.resultMsg);
                                app.getUserWinningList();
                            }
                        } catch (err) {
                            $('.sendlottery').hide();
                            layer.msg(data.resultMsg);
                            app.getUserWinningList();
                        }
                    }
                });
            }
        },
        /**
         * 兑换柠檬点.
         */
        swicthNingMeng: function (type) {
            var str = "";
            if (type == 1) {
                str = "1200柠檬点兑换10元京东卡！";
            } else if (type == 2) {
                str = "1200柠檬点兑换10Q币！";
            }
            layer.confirm(str, {
                skin: 'my-class', //样式类名
                title: '温馨提示',
                btn: ['确定', '取消'], //按钮
                closeBtn: 0,
                anim: 4 //动画类型
            }, function () {
                if (app.accountID) {
                    app.Ecard = type;
                    $.ajax({
                        type: 'POST',
                        url: "/api/nmExchangeCard",
                        async: false,
                        data: {
                            accountId: app.accountID,
                            prizeId: app.Ecard
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
                                return false;
                            }
                            // console.log(data);
                            if (data.resultCode == 200) {
                                layer.msg(data.resultMsg);
                                app.getuserinfo();
                            } else {
                                layer.msg(data.resultMsg);
                            }
                        }
                    });
                }
            }, function () {

            });
        },
        /**
         * 兑换柠檬点.
         */
        swicthNingMeng2: function (type) {
            var str = "";
            if (type == 11) {
                str = "100柠檬点兑换福利券礼包！";
            }
            layer.confirm(str, {
                skin: 'my-class', //样式类名
                title: '温馨提示',
                btn: ['确定', '取消'], //按钮
                closeBtn: 0,
                anim: 4 //动画类型
            }, function () {
                if (app.accountID) {
                    app.Ecard = type;
                    $.ajax({
                        type: 'POST',
                        url: "/api/nmExchangeLottery",
                        async: false,
                        data: {
                            accountId: app.accountID,
                            prizeId: app.Ecard
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
                                return false;
                            }
                            // console.log(data);
                            if (data.resultCode == 200) {
                                layer.msg(data.resultMsg);
                                app.getuserinfo();
                            } else if (data.resultMsg == "nmbz") {
                                layer.msg("柠檬点不足！");
                                setTimeout(function () {
                                    $('.addSenior').show();
                                }, 500)

                            } else {
                                layer.msg(data.resultMsg);
                            }
                        }
                    });
                }
            }, function () {

            });
        },
        registerclick: function () {
            $('#iosDialoghide').on('click', function () {
                $('.js_dialog').hide();
            });
            //选择性别
            app.sex = 1;
            $('.right .seximg').click(function () {
                if (app.sex == 1) {
                    app.sex = 2;
                } else if (app.sex = 2) {
                    app.sex = 1;
                }
                if (app.sex == 1) {
                    $('#girl').hide();
                    $('#boy').show();
                } else {
                    $('#girl').show();
                    $('#boy').hide();
                }
            })

            //添加个人描述
            $('#info-describe').click(function () {
                var name = $('#name').val();
                var phone = $('#phone').val();
                //显示取消按钮
                $('.layui-layer-btn1').show();
                layer.prompt({
                    title: '个人描述添加(20字以内)'
                }, function (pass, index) {
                    var str = pass;
                    console.log(pass);
                    if (pass != "" && pass != null) {
                        $.ajax({
                            type: 'POST',
                            url: "/api/subuserdata",
                            data: {
                                uid: app.uid,
                                id: app.accountID,
                                nickName: app.uinfo.nickName,
                                telphone: app.uinfo.telphone,
                                sex: app.sex,
                                signature: pass
                            },
                            success: function (data) {
                                try {
                                    console.log(data);
                                    if (data.resultCode == 200) {
                                        layer.close(index);
                                        app.getuserdata();
                                        // $('#iosDialog2 .weui-dialog__bd').html(data.resultMsg + '!');
                                        // $('#iosDialog2').show();

                                    }
                                } catch (err) {
                                }
                            }
                        });
                    } else {
                        layer.close(index);
                    }
                });

            })

            //个人中心和中奖列表bar的切换
            $('.infobar .bars').click(function () {
                $(this).addClass('bars-active').siblings('.bars').removeClass('bars-active');
                $('.bars img').removeClass('box-shadow');
                $(this).find('img').addClass('box-shadow');
                var flag = $(this).find('p').html();
                if (flag == "个人中心") {
                    $('.lottery-list').hide();
                    $('.ningmeng').hide();
                    $('.user-info').show();
                } else if (flag == "柠檬兑换") {
                    $('.user-info').hide();
                    $('.lottery-list').hide();
                    $('.ningmeng').show();
                } else {
                    $('.user-info').hide();
                    $('.ningmeng').hide();
                    $('.lottery-list').show();
                }
            })

            $(document).ready(function () {
                //从未领按钮到选择区服界面
                $(".list-box").on("click", ".lbtn", function () {
                    var thisbtn = $(this);
                    var flag = thisbtn.find('span').html();
                    if (flag == '已领') {
                        layer.msg('该奖品已经被领取！');
                        return false;
                    }

                    var type = thisbtn.attr('prizetype');
                    if (type == '1') { //type是1表示手动发放
                        $('.sendlottery1').show();
                    } else if (type == '3') {//type是3发送到手机里面
                        $('.sendlottery3').show();
                        app.winid = thisbtn.attr('winningid');
                    } else {//else自己领取
                        $('.sendlottery').show();
                        app.winid = thisbtn.attr('winningid');
                    }

                });

                //点击领取手机短信的奖品
                $('.sendlottery3 .gbtn').bind("click", function () {
                    if (app.winningid != "") {
                        $.ajax({
                            type: 'POST',
                            url: "/api/sendGamePrize",
                            data: {
                                server: "",
                                allianceId: "",
                                roleId: "",
                                winningId: app.winid,
                                accountId: app.accountID
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
                                    return false;
                                }
                                try {
                                    console.log(data);
                                    if (data.resultCode == 200) {
                                        $('.sendlottery3').hide();
                                        setTimeout(function () {
                                            layer.msg(data.resultMsg);
                                            // $('.gainingmask').hide();
                                            //获取中奖列表
                                            app.getUserWinningList();
                                        }, 200)
                                    } else {
                                        $('.sendlottery3').hide();
                                        layer.msg(data.resultMsg);
                                        // $('.gainingmask').hide();
                                        //获取中奖列表
                                        app.getUserWinningList();
                                    }
                                } catch (err) {
                                    $('.sendlottery3').hide();
                                    layer.msg(data.resultMsg);
                                    // $('.gainingmask').hide();
                                    //获取中奖列表
                                    app.getUserWinningList();
                                }
                            }
                        });
                    }

                });

                $('.sendlottery3 .gbtn1').bind("click", function () {
                    $('.sendlottery3').hide();
                });


                //发送奖品确定按钮
                $(".sendlottery .gbtn").bind("click", function () {
                    //call发奖品接口
                    var winid = app.winid;
                    app.sendGamePrize(winid);
                });

                //领奖取消
                $(".sendlottery .gbtn1").bind("click", function () {
                    $('.sendlottery').hide();
                });

                //手动领奖点击确定
                $(".sendlottery1 .gbtn").bind("click", function () {
                    $('.sendlottery1').hide();
                });

                //点击兑换
                $("#duihuanE").bind("click", function () {
                    app.swicthNingMeng(1);
                });

                $("#duihuanQ").bind("click", function () {
                    app.swicthNingMeng(2);
                });

                $("#duihuanFli").bind("click", function () {
                    app.swicthNingMeng2(11);
                });

                //点击福利券大图，直接显示充值
                $('#showaddsenior').click(function () {
                    // $('.addSenior').show();
                    app.swicthNingMeng2(11);
                })

            });
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
                    appId: app.appId,
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
                        var url = location.href.split('/usercenter')[0];
                        var imgurl = location.href.split('/usercenter')[0] + '/static/imgs_static/share/sharelogo1.png';
                        var content = {
                            title: '玩游戏现金奖品等你来拿', // 分享标题
                            desc: app.desc, // 分享描述
                            link: url + '/users/sharefuli', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: imgurl, // 分享图标
                            type: 'link', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                            success: function () {
                                // 用户确认分享后执行的回调函数
                                $('.sharemask').hide();
                                app.shareBattleSendLottery();
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
         * 获取allianceId.
         */
        getDevice: function () {
            var u = navigator.userAgent;
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            if (isAndroid) {
                app.channelTag = 1001;
                return "26";//安卓
            }
            else if (isiOS) {
                app.channelTag = 0;
                return "70";//ios
            }
            else {
                app.channelTag = 1001;
                return "26";//安卓
            }
        },
        /**
         * 分享出去后添加一次分享的记录.
         */
        shareBattleSendLottery: function () {
            $.ajax({
                type: 'POST',
                url: "/api/shareBattleSendLottery",
                data: {
                    key: "fuli"
                },
                success: function (data) {

                }
            });
        },
        /**
         * 能过sqtoken获取个人信息
         */
        getUserDataByToken: function () {
            $.ajax({
                type: 'POST',
                url: "/api/getUserDataByToken",
                data: {

                },
                success: function (data) {
                    console.log(data);
                }
            });
        }
    }
})

app.getServer();
app.changeServer();
app.uid = util.getCookie("squid");
app.sserver = util.getCookie("sserver");
app.ssource = util.getCookie("ssource");
app.WXshare();
$('#jingying_num').val('6');

if (app.uid) {
    app.getuserdata();
}

$('#save').click(function () {
    app.submituserdata();
})

$('#zhuxiao').click(function () {
    util.delCookie("squid");//ddd
    util.delCookie("token");
    util.delCookie("accountId_shequ");

    var goto = util.getCookie("goto");
    if (goto == "active1") {
        location.href = "/users" + "?goto=active1";
    } else {
        location.href = "/users";
    }

})

//注册点击事件
app.registerclick();

//判断是否显示中奖列表
if (util.getCookie("showprize") == "show") {
    // $('.infobar .bars').eq(1).addClass('bars-active').siblings('.bars').removeClass('bars-active');
    $('.infobar .bars').eq(1).trigger("click");
    util.setCookie("showprize", "hide");
} else if (util.getUrlParams('sign') != null) {
    setTimeout(function () {
        layer.msg("购买成功！");
    }, 1000)
} else if (util.getUrlParams('showpay') == 'ok') {
    $('.addSenior').show();
}

//menubar里隐藏充
if (util.getCookie("showbottom") == "hide") {
    // $("#Recharge").hide();
}

//柠檬点不足时跳转过来直接显示充值页面
if (util.getUrlParams('congzhi') == 'ok') {
    $('.addSenior').show();
}

$(document).ready(function () {
    $('#sharebtn').click(function () {
        $('.sharemask').show();
    })

    $('.shareclose').click(function () {
        $('.sharemask').hide();
    })

    $('#Recharge').click(function () {
        $('.addSenior').show();
    })

    $('#addS-close').click(function () {
        $('.addSenior').hide();
    })

    $("#cl-img-input").click(function () {

        layer.msg("暂未开放！");
        // return false;
        if (app.uinfo.telphone) {
            location.href = "/usercenter/upimg";
        } else {
            layer.msg("请填写完整的个人信息");
        }

    });

})

