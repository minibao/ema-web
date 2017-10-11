/**
 * Created by B-04 on 2016/12/20.
 */

var wait = 60;

var app = new Vue({
    el: '#app',
    data: {
        uid: 0,
        server: 0,
        loginStyle: true,
        role: {},
        roleid: 0,
        devicetype: '',
        channelTag: '',
        openId: '',
        accessToken: '',
        wecode: '',
        appId: 20015,
        tips: '',
        loginFlag: true,//true:账密 false:验证码
        captchaInfo: '获取验证码',
        goto: ''
    },
    methods: {
        login: function () {
            var postData;
            $('#loadingToast').show();
            if (app.loginStyle) {//账密或者验证码登录
                if (app.loginFlag) {//账密
                    if (/^\d+$/g.test(app.account)) {
                        postData = {
                            mobile: app.account,
                            password: app.password,
                            type: 'PT',
                            accountType: 1,
                            channelTag: app.channelTag,
                            allianceId: app.devicetype
                        }
                    } else {
                        postData = {
                            email: app.account,
                            password: app.password,
                            type: 'PT',
                            accountType: 2,
                            channelTag: app.channelTag,
                            allianceId: app.devicetype
                        }
                    }
                } else {//验证码
                    if (/^1\d{10}$/.test(app.mobile)) {
                        postData = {
                            mobile: app.mobile,
                            captcha: app.captcha,
                            type: 'PT',
                            accountType: 1,
                            channelTag: app.channelTag,
                            allianceId: app.devicetype
                        }
                    } else {
                        $('#loadingToast').hide();
                        layer.msg("请输入正确的手机号码或邮箱");
                        return false;
                    }
                }

                $.ajax({
                    type: 'POST',
                    url: "/api/getLogin",
                    data: postData,
                    success: function (data) {
                        // data = data.data;
                        $('#loadingToast').hide();

                        if (data.resultCode == 200) {
                            app.uid = data.data.uid;

                            if (app.uid != 0 && app.uid) {
                                console.log(data);
                                if (goto == 'sever') {
                                    $('.selectsever').show();
                                    // location.href = '/active/active';
                                } else if (goto == 'fuli') {

                                    // $('.selectsever').show();
                                    if (app.goto == "active1") {
                                        location.href = '/active/active';
                                    } else {
                                        location.href = '/topic/active2';
                                    }
                                } else {
                                    // location.href = '/users/pay';
                                    // $('.selectsever').show();
                                    if (app.goto == "active1") {
                                        location.href = '/active/active';
                                    } else {
                                        location.href = '/topic/active2';
                                    }

                                }
                                util.setCookie("accout", app.account);
                                util.setCookie("squid", app.uid);
                                util.setCookie("suid", app.uid);
                                util.setCookie("token", data.data.token);
                                util.setCookie("sQtoken", data.data.SQ_token);

                                app.getServer();

                            }
                        } else {
                            alert(data.resultMsg);
                        }
                    }
                })
            } else {//角色名登录
                postData = {
                    type: 'QD',
                    server: app.server,
                    nickName: app.nickName,
                    appId: app.appId
                };

                $.ajax({
                    type: 'POST',
                    url: "/api/getLogin",
                    data: postData,
                    success: function (data) {
                        $('#loadingToast').hide();
                        if (data.resultCode == 300) {//登录超过5次，登录过于频繁
                            layer.msg(data.resultMsg);
                            return false;
                        }
                        if (!data.data) {
                            app.tips = '请确认角色名是否正确（数据存在一定延迟）';
                        } else {
                            $('#msgCode').show();
                        }
                    },
                    error: function (err) {
                        $('#loadingToast').hide();
                        alert(err);
                    }
                })
            }
        },
        /*拉起QQ登录*/
        QQClick: function () {
            QC.Login({
                btnId: "qqLoginBtn",
                scope: "all",
                size: "A_XL"
            });
            setTimeout(function () {
                $('#qqLoginBtn a').html('');
                $('#qqLoginBtn a').html('<i class="icon sprite-icon_qq_login"></i>');
            }, 10);
            var paras = {};
            QC.api("get_user_info", paras)
                .success(function (s) {
                    console.log(s);
                })
                .error(function (f) {
                    alert("获取用户信息失败！");
                })
                .complete(function (c) {
                    if (QC.Login.check()) {
                        QC.Login.getMe(function (openId, accessToken) {
                            app.openId = openId;
                            app.accessToken = accessToken;
                            app.QQlogin();
                        });
                    }
                });
        },
        QQlogin: function () {
            var postData;
            $('#loadingToast').show();
            postData = {
                qqAppId: '101399880',
                openId: app.openId,
                type: 'QQ',
                accessToken: app.accessToken,
                channelTag: app.channelTag,
                allianceId: app.devicetype
            }
            $.ajax({
                type: 'POST',
                url: "/api/getLogin",
                data: postData,
                success: function (data) {
                    console.log(data);
                    alert(JSON.stringify(data));
                    data = data.data;
                    $('#loadingToast').hide();
                    try {
                        data.status == '0';
                        app.uid = data.data.uid;
                    } catch (err) {
                        alert("数据异常，稍后重试！");
                        return false;
                    }
                    if (data.status == '0') {
                        if (app.uid != 0 && app.uid) {
                            app.uid = data.data.uid;
                            $('.selectsever').show();
                            util.setCookie("squid", app.uid);
                        }
                    } else {
                        // alert(data.message);
                    }
                }
            })

        },
        /*拉起微信登录*/
        wechatClick: function () {
            $('#wechatLoginBtn').click(function () {
                // app.weChatLogin();
                window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx90ea8be0c05b9630&redirect_uri=https%3A%2F%2Fsocial.lemonade-game.com/users&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
            })
        },
        weChatLogin: function () {
            var postData;
            $('#loadingToast').show();
            postData = {
                weixinCode: app.wecode,
                type: 'WX',
                channelTag: app.channelTag,
                allianceId: app.devicetype
            }
            $.ajax({
                type: 'POST',
                url: "/api/getLogin",
                // url: "/api/getServer",
                data: postData,
                success: function (data) {
                    /**
                     * 下面这个json很有用，由于端没有给出文档，目前只能在代码里保存。
                     */
                    // data = {
                    //     "data": {
                    //         "tokens": {
                    //             "data": [{
                    //                 "loginAppIds": ["20012", "20019"],
                    //                 "token": {
                    //                     "allianceId": "70",
                    //                     "uid": 23403379,
                    //                     "appId": 20019,
                    //                     "channelTag": "0",
                    //                     "token": "A1AD80BC30A1610CC19F7902508D3753"
                    //                 }
                    //             }], "message": "成功", "config": {}, "status": "0"
                    //         }
                    //     }, "resultCode": 200, "resultMsg": "登录成功"
                    // };

                    $('#loadingToast').hide();
                    // alert(JSON.stringify(data));
                    try {
                        if (data.data.tokens.status == "1") {
                            return false;
                        }

                        data = data.data.tokens.data;
                        //游戏种类数组
                        var arr = new Array();//存放游戏的appid
                        var arrToken = new Array();//存放这个appid所存的对应的token下的信息

                        for (var i = 0; i < data.length; i++) {
                            for (var q = 0; q < data[i].loginAppIds.length; q++) {
                                if (data[i].loginAppIds[q] != 20019) {
                                    /**
                                     * 字段里有20019表示这个appid已经登绑定过社区平台
                                     */
                                    arr.push(data[i].loginAppIds[q]);//添加游戏成员,除了平台appid(20019)外的appid,
                                    arrToken.push(data[i].token);//添加这个appid所对应的token里面的字段，uid、token、allianceID等,
                                }
                            }
                        }

                        //数据去重arr,arrToken
                        for (var i = 0; i < arr.length; i++) {
                            for (var j = i + 1; j < arr.length; j++) {
                                if (arr[i] === arr[j]) {
                                    arr.splice(i, 1);
                                    arrToken.splice(i, 1);
                                    i--;
                                }
                            }
                        }
                        console.log(arr);
                        console.log(arrToken);
                        /**
                         * 选择游戏，并且把arr和arrToken添加到select里。
                         */
                        $('#sendlottery').show().removeClass('bounceInUp').addClass('bounceInUp');
                        $('#select-server-role').html("");
                        var html_str = '<option value="-1">请选择游戏</option>';
                        for (var i = 0; i < arr.length; i++) {
                            arr[i] = "" + arr[i];
                            switch (arr[i]) {
                                case "20012":
                                    arrToken[i].game = "英灵召唤师";
                                    break;
                                case "20015":
                                    arrToken[i].game = "次元大作战";
                                    break;
                                //以后再添加新的游戏在这里加
                            }
                            html_str = html_str + '<option tk=' + arrToken[i].token + ' uid=' + arrToken[i].uid + ' appid=' + arrToken[i].appId + ' value=' + arr[i] + '>' + arrToken[i].game + '</option>';
                        }

                        $('#select-server-role').html(html_str);

                    } catch (err) {
                        alert("请确认是否通过微信登录过该游戏！");
                        return false;
                    }
                    // if (app.uid == null || app.uid == "") {
                    //     alert("请确认是否通过微信登录过该游戏！");
                    // }
                }
            })
        },
        relogin: function () {
            $('.selectsever').fadeOut(500, function () {
                app.loginStyle = true;
                //清空cookie
                util.delCookie("squid");//ddd
                util.delCookie("token");
                util.delCookie("accountId_shequ");
                $('#select-server').val('-1');
                $('#select-role').val('0');
                app.role = "";
            });
        },
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

                    } catch (err) {

                    }
                }
            });
        },
        getRole: function () {
            if (app.uid) {
                $.ajax({
                    type: 'POST',
                    url: "/api/getRole",
                    async: false,
                    data: {
                        uid: app.uid,
                        server: app.server
                    },
                    success: function (data) {
                        app.role = data.data;
                    }
                });
            }
            return app.role;
        },
        transfer: function () {
            app.server = $('#select-server').val();
            if (app.loginStyle) {
                app.roleid = $('#select-role').val();
                if (app.roleid != 0 && app.server > 0 && app.uid != 0) {
                    util.setCookie("suid", app.uid);
                    util.setCookie("squid", app.uid);
                    util.setCookie("sserver", app.server);
                    util.setCookie("ssource", app.roleid);
                    // location.href = '/users/info?uid=' + app.uid + '&server=' + app.server + '&source=' + app.roleid;
                    if (goto == 'sever') {
                        location.href = '/users/info?uid=' + app.uid + '&server=' + app.server + '&source=' + app.roleid;
                    } else {
                        if (app.goto == "active1") {
                            location.href = '/active/active';
                        } else {
                            location.href = '/topic/active2';
                        }
                    }

                } else {
                    alert("请正确的选择信息！");
                }
            } else {
                if (app.server < 0) {
                    alert("请选择区服！");
                    return 0;
                }
                if (!app.nickName || app.nickName.trim() == '') {
                    alert("请输入名字！");
                    return 0;
                }
                app.login();
            }
        },
        sendCaptcha: function () {
            if (app.msgCode) {
                $('#loadingToast').show();
                postData = {
                    type: 'QD',
                    server: app.server,
                    nickName: app.nickName,
                    appId: app.appId,
                    msgCode: app.msgCode
                };
                $.ajax({
                    type: 'POST',
                    url: "/api/checkLoginMsgCode",
                    data: postData,
                    success: function (data) {
                        $('#loadingToast').hide();
                        var userInfo = data.data;
                        if (data.resultCode == 200) {
                            util.setCookie("squid", userInfo.uid);
                            util.setCookie("token", userInfo.token.token);

                            util.setCookie("suid", userInfo.uid);
                            util.setCookie("sserver", app.server);
                            util.setCookie("ssource", userInfo.source);
                            if (userInfo.email || userInfo.mobile) {
                                layer.msg('登录成功', {
                                    time: 3000
                                }, function () {
                                    // location.href = '/users/info?uid=' + userInfo.uid + '&server=' + app.server + '&source=' + userInfo.source;
                                    if (goto == 'sever') {
                                        location.href = '/users/info?uid=' + app.uid + '&server=' + app.server + '&source=' + app.roleid;
                                    } else {
                                        if (app.goto == "active1") {
                                            location.href = '/active/active';
                                        } else {
                                            location.href = '/topic/active2';
                                        }
                                    }
                                });

                            } else {

                                layer.msg('登录成功，请绑定账号！', {
                                    time: 3000
                                }, function () {
                                    // location.href = '/users/bindphone?uid=' + userInfo.uid + '&server=' + app.server + '&source=' + userInfo.source;
                                    if (goto == 'sever') {
                                        location.href = '/users/info?uid=' + app.uid + '&server=' + app.server + '&source=' + app.roleid;
                                    } else {
                                        if (app.goto == "active1") {
                                            location.href = '/active/active';
                                        } else {
                                            location.href = '/topic/active2';
                                        }
                                    }
                                });
                            }
                        } else {
                            alert('验证码错误！');
                        }
                    },
                    error: function (err) {
                        $('#loadingToast').hide();
                        console.log(err);
                        alert(err);
                    }
                })
            }
        },
        changeServer: function () {
            $("#select-server").change(function () {
                app.server = $("#select-server").val();
                if (app.server != '-1') {
                    var roledata = app.getRole();
                    console.log(roledata);
                    try {
                        if (!roledata.length) {
                            return false;
                        }
                    } catch (err) {
                        return false;
                    }
                    setTimeout(function () {
                        if (roledata.length > 0) {
                            $('#select-role option:eq(1)').prop('selected', true);
                            app.roleid = $("#select-role").val();
                        }
                    }, 200)
                } else {
                    $('#iosDialog2').show();
                    $('.weui-mask').fadeIn(200);
                    $('#select-role').val('1');
                }
            });
        },
        changeRole: function () {
            $("#select-role").change(function () {
                app.roleid = $("#select-role").val();
            });
        },
        hideDialog: function () {
            $('.weui-dialog__ft').on('click', function () {
                $('#iosDialog2').hide();
                $('.weui-mask').fadeOut(200);
            });
        },
        getCaptcha: function () {
            var tel = /^1\d{10}$/;
            if (tel.test(app.mobile)) {
                $("#captchaBtn").addClass("ban");
                app.captchaInfo = wait + "S";
                if (wait == 60) {
                    var timer1 = setInterval(function () {
                        wait--;
                        app.captchaInfo = wait + "S";
                        if (wait == 0) {
                            clearInterval(timer1);
                            app.captchaInfo = "获取验证码";
                            $("#captchaBtn").removeClass("ban");
                            wait = 60;
                        }
                    }, 1000);
                    if (app.mobile) {
                        $.ajax({
                            type: 'GET',
                            url: "/api/getCaptcha",
                            data: {
                                mobile: app.mobile
                            },
                            success: function (data) {
                                if (data.resultCode == 200) {
                                    layer.msg('验证码发送成功');
                                } else {
                                    layer.msg('验证码发送失败');
                                }
                            }
                        });
                    }
                }
            } else {
                layer.msg('请输入正确的手机号');
            }
        },
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
        changeLoginStyle: function () {
            app.loginStyle = false;
            $('.selectsever').show();
        },
        changeCaptchaLogin: function () {
            app.loginFlag = !app.loginFlag;
        },
        getUrlParams: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = decodeURI(window.location.search).substr(1).match(reg);
            return r != null ? unescape(r[2]) : null;
        },
        /*reload: function () {
         $('.logout a').click(function () {
         setTimeout(function () {
         if (typeof($('#qqLoginBtn a img').attr('src')) != "undefined") {
         QC.Login.signOut();
         window.location.href = 'https://social.lemonade-game.com/users';
         }
         }, 10)
         })
         $('body').click(function () {
         setTimeout(function () {
         if (typeof($('#qqLoginBtn a img').attr('src')) != "undefined") {
         QC.Login.signOut();
         window.location.href = 'https://social.lemonade-game.com/users';
         }
         }, 10)

         })
         },*/
        iosold: function () {
            var device = app.getUrlParams("device");
            if (device == 'ios') {
                $('.re-login').hide();
                $('.page__bd').css('background', '#02022a');
                $('.logopage').hide();
                app.uid = util.getCookie("suid");//suid,单独开给旧版本ios用的，
                $('.selectsever').show();

            }
        },
        /*保持上一步的选择的区服*/
        keepselect: function () {
            var select_server = util.getCookie("select_server");
            var select_role = util.getCookie.getItem("select_role");

            $("#select-role").append(select_role);
            $('#select-server option[value=' + select_server + ' ]').prop('selected', true);
            $('#select-role option:last').prop('selected', true);
        },
        boxCancel: function () {
            $('#msgCode').hide();
        }
    }
});

$(document).ready(function () {
    $('.weui-cell').click(function () {
        $(this).find('.weui-input').focus();
    });

    /**
     * 加载swiper
     */
    var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        autoplay: 3000,
        autoplayDisableOnInteraction: false,
        loop: true
    });

    /**
     * 游戏选择后，点击确定事件（微信登录里）
     */
    $("#sendlottery .gbtn").click(function () {
        var value = $('#select-server-role').val();
        if (value == -1) {
            layer.msg("请选择已通过微信绑定的游戏！");
        } else {
            var uid = $("#select-server-role").find("option:selected").attr("uid");
            var token = $("#select-server-role").find("option:selected").attr("tk");
            util.setCookie("squid", uid);
            util.setCookie("suid", uid);
            util.setCookie("token", token);
            if (app.goto == "active1") {
                location.href = '/active/active';
            } else {
                location.href = '/topic/active2';
            }

        }
    })
    $("#sendlottery .gbtn1").click(function () {
        $("#sendlottery").hide();
    })
});

var goto = app.getUrlParams('goto');

app.goto = app.getUrlParams('goto');//?goto=active1
if (app.goto == "active1") {//?goto=active1
    util.setCookie("goto", "active1");//?goto=active1
}

var accout = util.getCookie("accout");
var uid = util.getCookie("squid");
//ios老版本
app.iosold();
if (uid != null) {
    // $('.selectsever').show();
    if (goto == 'sever') {
        $('.selectsever').show();
    } else {
        if (app.goto == "active1") {
            location.href = '/active/active';
        } else {
            location.href = '/topic/active2';
        }

    }
    $('#select-server').val('-1');
    $('#select-role').val('0');
    app.uid = uid;
}
app.devicetype = app.getDevice();
app.getServer();
app.changeServer();
app.hideDialog();
app.changeRole();
// app.reload();QQ登录使用，目前已经废除
// app.QQClick();

var code = app.getUrlParams('code');


app.wecode = code;
if (app.wecode != "" && app.wecode != null) {
    util.setCookie("wxcode", app.wecode);
    app.weChatLogin();
}
app.wechatClick();