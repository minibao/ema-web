/**
 * Created by Administrator on 2017/9/21.
 */
var app = new Vue({
    el: '#app',
    data: {
        loginFlag: true,//true:账密 false:验证码
        channelTag: '',
        devicetype: '',
        uid: '',
        SQ_token: '',
        token: '',
        captchaInfo: '获取验证码',
        wecode: '',
        appId: 20015,
        wait: ''

    },
    methods: {
        /**
         * init
         */
        init: function () {
            //短信发送cd时间是60s
            app.wait = 60;

            //获取设备信息
            app.devicetype = app.getDevice();

            //判断上次是不是微信登录
            app.wecode = util.getUrlParams('code');
            if (app.wecode != "" && app.wecode != null) {
                util.setCookie("wxcode", app.wecode);
                app.weChatLogin();//获取到微信code后，开始登录
            }
            app.wechatClick();//注册微信登录方法


        },
        /**
         * 切换登录方式。
         */
        changeCaptchaLogin: function () {
            app.loginFlag = !app.loginFlag;
        },
        /**
         *login登录方式。
         */
        login: function () {
            $('#loadingToast').show();//菊花转起来
            var postData;
            if (app.loginFlag) { //帐密登录
                if (/^\d+$/g.test(app.account)) {
                    postData = {//手机
                        mobile: app.account,
                        password: app.password,
                        type: 'PT',
                        accountType: 1,
                        channelTag: app.channelTag,
                        allianceId: app.devicetype
                    }
                } else {
                    postData = {//邮箱
                        email: app.account,
                        password: app.password,
                        type: 'PT',
                        accountType: 2,
                        channelTag: app.channelTag,
                        allianceId: app.devicetype
                    }
                }
            } else { //验证码登录
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
                    $('#loadingToast').hide();
                    console.log(data.resultMsg);

                    console.log(data);
                    try {
                        app.uid = data.data.uid;
                        if (data.resultCode == 200 && app.uid) {

                            util.setCookie("accout", app.account);
                            util.setCookie("squid", app.uid);
                            util.setCookie("suid", app.uid);
                            util.setCookie("token", data.data.token);
                            util.setCookie("sQtoken", data.data.SQ_token);

                            //do something
                            location.href = '/yinling/active2';
                            console.log(data);

                        }
                    } catch (err) {
                        layer.msg("数据异常，稍后重试！");
                        return false;
                    }
                }
            })
        },
        /**
         * 获取设备信息。
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
         * 验证码登录（）
         */
        getCaptcha: function () {
            var tel = /^1\d{10}$/;
            if (tel.test(app.mobile)) {
                $("#captchaBtn").addClass("ban");
                app.captchaInfo = app.wait + "S";
                if (app.wait == 60) {
                    var timer1 = setInterval(function () {
                        app.wait--;
                        app.captchaInfo = app.wait + "S";
                        if (app.wait == 0) {
                            clearInterval(timer1);
                            app.captchaInfo = "获取验证码";
                            $("#captchaBtn").removeClass("ban");
                            app.wait = 60;
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
        /**
         * 微信登录（拉取微信登录）。
         */
        wechatClick: function () {
            $('#wechatLoginBtn').click(function () {
                // app.weChatLogin();
                window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx90ea8be0c05b9630&redirect_uri=https%3A%2F%2Fsocial.lemonade-game.com/users&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
            })
        },
        /**
         * 微信登录（通过上步获取的code去平台验证）
         */
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
                data: postData,
                success: function (data) {

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

                        for (var i = 0; i < arr.length; i++) {
                            arr[i] = "" + arr[i];
                            if (arr[i] == "20012") {//英灵
                                var uid = arrToken[i].uid;
                                // var appid = arrToken[i].appId;
                                var token = arrToken[i].token;

                                util.setCookie("squid", uid);
                                util.setCookie("suid", uid);
                                util.setCookie("token", token);
                                //还少一个SQ_token

                                // location.href = '/topic/active2';

                            }

                        }

                    } catch (err) {
                        alert("请确认是否通过微信登录过该游戏！");
                        return false;
                    }

                }
            })
        }


    }
})

app.init();//初始化


