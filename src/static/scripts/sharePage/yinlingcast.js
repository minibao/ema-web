/**
 * Created by lv on 2017/8/24.
 */

var app = new Vue({
    el: '#app',
    data: {
        code: ""
    },
    methods: {
        /**
         * 判断该码是否被领过
         */
        selUserRegisterCodeData: function () {
            var device = app.getDevice();
            var type = "";
            if (device == "ios") {
                type = "ios";
            } else {
                type = "android";
            }
            $.ajax({
                type: 'POST',
                url: "/api/selUserRegisterCodeData",
                data: {
                    gameCode: "20012",
                    type: type
                },
                success: function (data) {
                    // console.log(data);
                    try {
                        console.log(data);
                        if (data.data == null) {


                        } else {
                            $("#li-code").html(data.data.code);
                            app.code = data.data.code;
                            $('.down').removeClass('bounceInUp');
                            $(".down").show();
                            $('.down').addClass('bounceInUp');
                            $(".participant").hide();
                        }

                    } catch (err) {
                    }
                    if (data.resultCode != 200) {
                        // layer.msg(data.resultMsg);

                    }
                }
            });
        },
        /**
         * 点击下载按钮，在微信里打开，显示弹出层
         */
        getUserRegisterCodeData: function () {
            var device = app.getDevice();
            var type = "";
            if (device == "ios") {
                type = "ios";
            } else {
                type = "android";
            }
            $.ajax({
                type: 'POST',
                url: "/api/getUserRegisterCodeData",
                data: {
                    gameCode: "20012",
                    type: type
                },
                success: function (data) {
                    // console.log(data);
                    try {
                        console.log(data);
                        $("#li-code").html(data.data.code);
                        app.code = data.data.code;
                        $('.down').removeClass('bounceInUp');
                        $(".down").show();
                        $('.down').addClass('bounceInUp');
                        $(".participant").hide();
                    } catch (err) {
                    }
                    if (data.resultCode != 200) {
                        layer.msg(data.resultMsg);
                    }
                }
            });
        },
        /**
         * 判断是否在微信里打开
         */
        isWeiXin: function () {
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                return true;
            } else {
                return false;
            }
        },
        getDevice: function () {
            var u = navigator.userAgent;
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            if (isAndroid) {
                return "and";
            }
            if (isiOS) {
                return "ios";
            }
        }

    }
});



var code = util.getUrlParams("code");

/**
 * 点击事件
 */
$(document).ready(function () {
    //点击下载按钮，在微信里打开，显示弹出层
    $('.downbtn').click(function () {
        var device = app.getDevice();
        if (device == "ios") {
            window.location.href = "https://itunes.apple.com/cn/app/id1143387668";
        } else if (device == "and") {
            if (app.isWeiXin()) {
                var url_code = window.location.href + "?code=" + app.code;
                window.location.href = url_code;
            } else {
                window.location.href = "http://ylzhs-cdn.emagames.cn/packages/YL_emagroup.apk";
            }
        } else {
            window.location.href = "http://ylzhs.cn/";
        }
    });

    $('.mask').click(function () {
        $('.mask').hide();
    });

    $(".participant").click(function () {
        app.getUserRegisterCodeData();
    })

    //判断是不是微信里的重定向
    if (code != "" && code != null) {
        $('.mask').show();
        if (!app.isWeiXin()) {
            $('.mask').hide();
            $("#li-code").html(code);
            $('.down').removeClass('bounceInUp');
            $(".down").show();
            $('.down').addClass('bounceInUp');
            $(".participant").hide();
        }
    } else {
        app.selUserRegisterCodeData();
    }

})