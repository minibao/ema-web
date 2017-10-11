/**
 * Created by Administrator on 2017/7/11.
 */
var wxs = new Vue({
    el: '#wxshare',
    data: {
        appId: '20019',
        jsApiTicket: '',
        url: '',
        accesstoken: '',
        appKey: '71599476762ca9835879f4d188919549'
    },
    methods: {
        /**
         * 获取access_token.
         */
        getaccessToken: function () {
            $.ajax({
                type: "GET",
                url: "/api/getWxAccessToken",
                success: function (data) {
                    wxs.accesstoken = data.access_token;
                    wxs.getapi_ticket();
                },
                error: function (data) {
                    console.log(data);
                }
            });
        },
        /**
         * 获取api_ticket.
         */
        getapi_ticket: function () {
            $.ajax({
                type: "POST",
                url: "/api/apiticket",
                data: {
                    accesstoken: wxs.accesstoken,
                    type: 'jsapi'
                },
                success: function (data) {
                    console.log(data);
                    wxs.jsApiTicket = data.ticket;
                    wxs.wxshareAddSign();
                },
                error: function (data) {
                    console.log(data);
                }
            });

        },
        /**
         * 微信分享加签.
         */
        wxshareAddSign: function () {
            // var url = encodeURIComponent(location.href.split('#')[0]);
            var url = encodeURIComponent(location.href.split('#')[0]);
            $.ajax({
                type: "POST",
                url: "/api/shareaddSign",
                data: {
                    appId: wxs.appId,
                    jsApiTicket: wxs.jsApiTicket,
                    url: url,
                    appKey: wxs.appKey
                },
                success: function (data) {
                    console.log(data);
                    if (data && data.status == 0) {
                        wx.config({
                            debug: true,
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
                        var uid = getCookie("squid");
                        var server = getCookie("sserver");
                        var source = getCookie("ssource");
                        var url = location.href.split('?')[0];

                        var content = {
                            title: '次元战绩分享', // 分享标题
                            desc: '次元战绩分享', // 分享描述
                            link: url + '?uid=' + uid + '&server=' + server + '&source=' + source, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: 'https://staging-social.lemonade-game.com/static/imgs_static/heroes/126_1_1.png', // 分享图标
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
        }
    }
})

wxs.getaccessToken();


