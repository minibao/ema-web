/**
 * Created by B-04 on 2016/12/12.
 */
$(function () {
    /**
     *控制福利button
     **/
    var toggleflag = 1;
    $('.fulibtn').click(function () {

        if (toggleflag == 1) {
            $('.fulibox').toggle();
            $('.fulibox').removeClass('fadeOutDown');
            $('.fulibox').addClass('fadeInUp');
            toggleflag = 0;
        } else {
            $('.fulibox').removeClass('fadeInUp');
            $('.fulibox').addClass('fadeOutDown');
            toggleflag = 1;
            setTimeout(function () {
                $('.fulibox').toggle();
            }, 500);
        }
    })

    $('.activebtn').click(function () {
        location.href = "active";
    })
    $('.active2btn').click(function () {
        location.href = "active2";
    })
    $('.active3btn').click(function () {
        location.href = "active3";
    })
    $('.headimg').click(function () {
        location.href = "ucenter";
    })

    $('#add-senior').click(function () {
        $('.addSenior').show();
    })


});

var util = {
    getUrlParams: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = decodeURI(window.location.search).substr(1).match(reg);
        return r != null ? unescape(r[2]) : null;
    },
    /**
     * 左右都去掉空格.
     */
    trim: function (str) {
        return str.replace(/(^s*)|(s*$)/g, "");
    },
    /**
     * 重写ajax方法.
     */
    XAjax: function (method, url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var data = JSON.parse(xhr.responseText);
                callback(data);
            }
        };
        xhr.send();
    },
    /**
     * cookie操作机制.
     */
    setCookie: function (name, value) {
        var Days = 3;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(encodeURIComponent(value)) + "; expires=" + exp.toGMTString() + "; path=/; domain=" + document.domain + ";";
    },
    getCookie: function (name) {
        cookie_name = name + "=";
        cookie_length = document.cookie.length;
        cookie_begin = 0;
        while (cookie_begin < cookie_length) {
            value_begin = cookie_begin + cookie_name.length;
            if (document.cookie.substring(cookie_begin, value_begin) == cookie_name) {
                var value_end = document.cookie.indexOf(";", value_begin);
                if (value_end == -1) {
                    value_end = cookie_length;
                }
                return decodeURIComponent(decodeURIComponent(document.cookie.substring(value_begin, value_end)));
            }
            cookie_begin = document.cookie.indexOf(" ", cookie_begin) + 1;
            if (cookie_begin == 0) {
                break;
            }
        }
        return null;
    },
    delCookie: function (name) {
        //删除cookies
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = util.getCookie(name);
        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + "; path=/; domain=" + document.domain + ";";
    },
    /**
     * 获取url （https://staging-social.lemonade-game.com）.
     */
    getlocalhostPath: function () {
        var curWwwPath = window.document.location.href;
        var pathName = window.document.location.pathname;
        var pos = curWwwPath.indexOf(pathName);
        var localhostPath = curWwwPath.substring(0, pos);
        return localhostPath;
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
            return "71";//ios
        }
        else {
            app.channelTag = 1001;
            return "26";//安卓
        }
    }
};
