/**
 * Created by Administrator on 2017/9/25.
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
        /**
         * 初始化
         */
        init: function () {
            app.uid = util.getCookie("squid");
            app.sserver = util.getCookie("sserver");
            app.ssource = util.getCookie("ssource");

            app.getuserdata();

        },
        /**
         * 获取基本信息
         */
        getuserdata: function () {
            $('#loadingToast').show();
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
                            app.getHeadImgByUrl(app.uinfo.icon);//url获取头像
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
                        app.activeGetInfo();
                    } catch (err) {
                        var url = util.getlocalhostPath() + '/static/imgs_static/icon/head.png';
                        $("#cl-img-input").attr('src', url);
                        app.uinfo = {};
                        app.uinfo.nickName = util.getCookie("infoname");
                        $('#name').val(util.getCookie("infoname"));
                        $('#loadingToast').hide();
                    }
                }
            });
        },
        /**
         * url获取头像
         */
        getHeadImgByUrl: function (url) {
            $.ajax({
                type: 'post',
                url: url,
                success: function (data) {
                    try {
                        $("#cl-img-input").attr('src', data);
                        //纠正下图片的样式
                        var w = $("#cl-img-input").width();
                        $("#cl-img-input").css("height", w + "px");
                    } catch (err) {
                    }
                }
            });
        },
        /**
         * 查询用户券余量柠檬点
         */
        activeGetInfo: function () {
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
                            $('#loadingToast').hide();
                        } catch (err) {
                            $('#loadingToast').hide();
                        }
                    }
                });
            } else {
                $('#loadingToast').hide();
            }
        },
        /**
         * 获取中奖列表
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
        }


    }
})


//init
app.init();

$(document).ready(function () {

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

    //分享显示
    $('#sharebtn').click(function () {
        $('.sharemask').show();
    })

    //分享隐藏
    $('.shareclose').click(function () {
        $('.sharemask').hide();
    })

    //充值按钮
    $('#Recharge').click(function () {
        $('.addSenior').show();
    })


    $('#addS-close').click(function () {
        $('.addSenior').hide();
    })

})