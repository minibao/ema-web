/**
 * Created by B-04 on 2016/12/26.
 */

var app = new Vue({
    el: '#app',
    data: {
        isActive: 4,
        uid: 0,
        server: 0,
        battleList: [],
        userInfo: {},
        userheros: {},
        showAll: false,
        roleid: '',
        allMatch: {},
        battle: [],
        source: '',
        curPage: 1,
        pageSize: 20,
        isEnd: false,
        rank: '',
        myrank: '',
        desc: '一起来查看你在次元的战绩',
        infoserver: '',
        inforole: '',
        inforoleid: ''
    },
    methods: {
        changeTab: function (index) {
            app.isActive = index;
        },
        getUrlParams: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = decodeURI(window.location.search).substr(1).match(reg);
            return r != null ? unescape(r[2]) : null;
        },
        // getDevice: function () {
        //     var u = navigator.userAgent;
        //     var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        //     var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        //     if (isAndroid) {
        //         return "26";//安卓
        //     }
        //     if (isiOS) {
        //         return "71";//ios
        //     }
        // },
        getBattle: function () {
            $('#loadingToast').show();
            if (app.uid) {
                $.ajax({
                    type: "POST",
                    url: "/api/getBattle",
                    data: {
                        uid: app.uid
                        // uid : 207055678
                    },
                    success: function (data) {
                        app.battleList = data.data;
                        $('#loadingToast').hide();
                        if (!app.battleList || app.battleList.length == 0) {
                            // $('.no_match').show();
                        }
                    },
                    error: function (data) {
                        // $('.no_match').show();
                        // console.log(data);
                        $('#loadingToast').hide();
                    }
                });
            } else {
                // $('.no_match').show();
                $('#loadingToast').hide();
            }
        },
        getMapDictionary: function () {
            $.ajax({
                type: "POST",
                url: "/api/getMapDictionary",
                success: function (data) {
                    app.battleList = data.data;
                },
                error: function (data) {
                    console.log(data);
                }
            });
        },
        selectUserRealData: function () {
            if (app.uid) {
                $.ajax({
                    type: "POST",
                    url: "/api/selectUserRealData",
                    data: {
                        uid: app.uid
                    },
                    success: function (data) {
                        // console.log(data);
                        // app.userInfo = data.data[0];
                        // app.userInfo.rateOfWin = (app.userInfo.battleWinNum/app.userInfo.battleNum*100).toFixed(2) + '%';
                    },
                    error: function (data) {
                        console.log(data);
                    }
                });
            } else {
                app.userInfo = {
                    rateOfWin: '0',
                    elo: '0',
                    battleNum: '0'
                }
            }
        },
        getUserData: function () {
            $('.detail-list').hide();
            $('.no_match').hide();
            var sessionflag = util.getCookie("suid");
            if (other == "other") {

            } else {
                if (sessionflag) {
                    app.uid = util.getCookie("suid");
                    app.server = util.getCookie("sserver");
                    app.source = util.getCookie("ssource");
                } else {
                    app.server = util.getCookie("sserver");
                    app.source = util.getCookie("ssource");
                    $('.sendlottery').show();
                }
            }

            if (app.uid) {
                $.ajax({
                    type: "POST",
                    url: "/api/getUserData",
                    data: {
                        uid: app.uid,
                        server: app.server,
                        source: app.source
                    },
                    success: function (data) {
                        // alert(JSON.stringify(data));
                        if (data == null) {
                            setTimeout(function () {
                                $('.match').show();
                                $('.no_match').show();
                                $('#loadingToast').hide();
                                $('.detail-list').hide();
                                $('.sendlottery ').removeClass('bounceOutDown');
                                $('.sendlottery ').addClass('bounceOutDown');
                                setTimeout(function () {
                                    $('.sendlottery ').hide();
                                }, 1000)
                            }, 200)
                            app.userInfo = {
                                rateOfWin: 0,
                                battileFailNum: 0,
                                battileWinNum: 0
                            };
                            return false;
                        }
                        setTimeout(function () {
                            $('.match').show();
                            // $('.no_match').show();
                            $('#loadingToast').hide();
                            $('.detail-list').show();
                            $('.sendlottery ').removeClass('bounceOutDown');
                            $('.sendlottery ').addClass('bounceOutDown');
                            util.setCookie("suid", app.uid);//这个uid，目前没有setcookie，为了下次进来时，不用再选择区服
                            setTimeout(function () {
                                $('.sendlottery ').hide();
                            }, 1000)
                        }, 200)
                        try {
                            app.userInfo = data.data;
                            //test canvas画胜率
                            var rate = (app.userInfo.battileWinNum / (app.userInfo.battileWinNum + app.userInfo.battileFailNum)).toFixed(3);
                            app.ctx_win("ctx-win", rate);
                            app.ctx_changci('ctx-win1', app.userInfo.battileWinNum + app.userInfo.battileFailNum);

                            util.setCookie("infoname", app.userInfo.name);
                            app.roleid = app.userInfo.roleId;
                            //获取五角星接口
                            app.getRadar();
                            //我的排行
                            app.myrankfun();

                        } catch (err) {

                        }
                        if (app.roleid != "") {
                            app.getUserDataBattle();
                            app.getUserHeroBattleData(app.roleid);
                        }
                    },
                    error: function (data) {

                        console.log(data);
                        $('.match').show();
                        $('.no_match').show();
                        $('#loadingToast').hide();
                        app.userInfo = {
                            rateOfWin: '0',
                            battileFailNum: 0,
                            battileWinNum: 0
                        };
                    }
                });
            } else {
                app.userInfo = {
                    rateOfWin: '0',
                    battileFailNum: 0,
                    battileWinNum: 0
                };
                $('.match').show();
                $('.no_match').show();
                $('#loadingToast').hide();
                // $('.detail-list').show();

            }
        },
        getUserDataBattle: function () {
            $('#loadingToast').show();

            if (app.uid) {
                $.ajax({
                    type: "POST",
                    url: "/api/getUserDataBattle",
                    data: {
                        uid: app.uid,
                        server: app.server,
                        roleId: app.roleid,
                        curPage: app.curPage || 1,
                        pageSize: app.pageSize || 20
                    },
                    success: function (data) {
                        app.battle = app.battle.concat(data.data);
                        if (data.count <= app.curPage * app.pageSize) {
                            app.isEnd = true;
                        }
                        app.curPage++;
                        setTimeout(function () {
                            $('.match').show();
                            $('.no_match').hide();
                            $('#loadingToast').hide();
                            $('.detail-list').show();
                        }, 200)
                    },
                    error: function (data) {
                        $('.match').show();
                        // $('.no_match').show();
                        $('#loadingToast').hide();
                    }
                });
            } else {
                app.userInfo = {
                    rateOfWin: '0',
                    elo: '0',
                    battleNum: '0'
                };
                $('.match').show();
                $('.no_match').show();
                $('#loadingToast').hide();

            }
        },
        getUserHeroBattleData: function (roleid) {
            $.ajax({
                type: "POST",
                url: "/api/getUserHeroBattleData",
                data: {
                    roleId: roleid
                },
                success: function (data) {
                    app.userheros = data.data;
                },
                error: function (data) {
                    console.log(data);
                }
            });
        },
        selectUserHeroKDAStatisticsTest: function () {
            if (app.uid) {
                $.ajax({
                    type: "POST",
                    url: "/api/selectUserHeroKDAStatisticsTest",
                    data: {
                        uid: app.uid
                    },
                    success: function (data) {
                        if (data.resultCode == 200) {
                            app.allMatch = data;
                        } else {
                            alert("网络错误！");
                        }
                    },
                    error: function (data) {
                        console.log(data);
                    }
                });
            } else {
                app.userInfo = {
                    rateOfWin: '0',
                    elo: '0',
                    battleNum: '0'
                }
            }
        },

        /**
         * 获取战绩排行榜.
         */
        rankingList: function () {
            $.ajax({
                type: "POST",
                url: "/api/getUserBattleRankingList",
                success: function (data) {
                    // console.log(data);
                    app.rank = data.data;
                },
                error: function (data) {
                    console.log(data);
                }
            });
        },
        changeShowAll: function () {
            app.showAll = !app.showAll;
        },
        show_myrecord: function () {
            $(".my-heros").hide();
            $(".paihang").hide();
            $(".my-record").show();
        },
        show_myheros: function () {
            $(".my-heros").show();
            $(".my-record").hide();
            $(".paihang").hide();
        },
        show_paihang: function () {
            $(".my-heros").hide();
            $(".my-record").hide();
            $(".paihang").show();
        },
        /**
         * 注册页面中的事件.
         */
        registerclick: function () {
            //基本数据和雷达的切换
            $('.infobar .bars').click(function () {
                $(this).addClass('bars-active').siblings('.bars').removeClass('bars-active');
                $('.bars img').removeClass('box-shadow');
                $(this).find('img').addClass('box-shadow');
                var flag = $(this).find('p').html();
                if (flag == "基本数据") {
                    $('#basic-info').show();
                    $('#radar').hide();
                } else {
                    $('#basic-info').hide();
                    $('#radar').show();
                }
            })

        },
        /**
         * 绘画战线的三维图.
         */
        three_combat: function (data) {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('three-combat'));
            // 指定图表的配置项和数据
            var option = {
                title: {
                    text: ''
                },
                tooltip: {},
                legend: {
                    orient: 'horizontal', // 'vertical，horizontal'
                    x: 'right', // 'center' | 'left' | {number},
                    y: 'top', // 'center' | 'bottom' | {number}
                    itemGap: 10,
                    top: '0px;',
                    // data: ['近20场']
                },
                radar: {
                    // shape: 'circle',
                    indicator: [
                        {name: '金币' + data.avgTotalMoney.toFixed(1), max: 100},
                        {name: '输出\n' + data.avgDamageTotal.toFixed(1), max: 100},
                        {name: '生存' + data.avgBeKilledCount.toFixed(1), max: 100},
                        {name: '助攻' + data.avgAssistCount.toFixed(1), max: 100},
                        {name: 'KDA\n' + data.avgKDA.toFixed(1), max: 100},
                        {name: '综合' + data.avgAll.toFixed(1), max: 100}
                    ],
                    startAngle: 120,
                    radius: '60%'
                },
                series: [{
                    name: '战绩图',
                    type: 'radar',
                    // areaStyle: {normal: {}},
                    data: [
                        {
                            value: [data.avgTotalMoney, data.avgDamageTotal, data.avgBeKilledCount, data.avgAssistCount, data.avgKDA, data.avgAll],
                            name: '近20场'
                        }
                    ],
                    itemStyle: {
                        normal: {
                            color: "rgb(51, 153, 254)",
                            fontsize: '12px',
                            label: {
                                show: false
                            }
                        }
                    }
                }]
            };
            // 使用刚指定的配置项和数据显示图表。
            //不显示label
            myChart.setOption(option);
        },
        /**
         * 绘画ctx胜率.
         */
        ctx_win: function (id, rate) {
            /**
             * 绘画胜率.
             */
                //获取Canvas对象(画布)
            var canvas = document.getElementById(id);
            if (canvas.getContext) {
                var ctx = canvas.getContext("2d");
                //开始一个新的绘制路径
                ctx.beginPath();
                //设置弧线的颜色为蓝色
                ctx.strokeStyle = "rgba(160, 148, 141, 0.51)";
                ctx.lineWidth = 40;
                ctx.font = "100px Arial";
                ctx.textAlign = "center";
                ctx.fillText((rate * 100).toFixed(1) + '%', 360, 400);

                var circle = {
                    x: 360,    //圆心的x轴坐标值
                    y: 360,    //圆心的y轴坐标值
                    r: 300     //圆的半径
                };
                //顺时针方向绘制弧线
                ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2, false);
                ctx.stroke();

                //开始一个新的绘制路径
                ctx.beginPath();
                //设置弧线的颜色为蓝色
                var gradient = ctx.createLinearGradient(500, 50, 0, 460);
                gradient.addColorStop("0", "#846779");
                // gradient.addColorStop("0.1", "#c16444");
                gradient.addColorStop("1.0", "#ff610f");
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 40;
                var circle = {
                    x: 360,    //圆心的x轴坐标值
                    y: 360,    //圆心的y轴坐标值
                    r: 300     //圆的半径
                };
                //顺时针方向绘制弧线
                ctx.arc(circle.x, circle.y, circle.r, 1.5 * Math.PI, 1.5 * Math.PI + Math.PI * rate * 2, false);
                ctx.stroke();
            }

        },
        /**
         * 绘画ctx场次.
         */
        ctx_changci: function (id, times) {
            //获取Canvas对象(画布)
            var canvas = document.getElementById(id);
            if (canvas.getContext) {
                var ctx = canvas.getContext("2d");
                //开始一个新的绘制路径
                ctx.beginPath();
                ctx.strokeStyle = "rgba(160, 148, 141, 0.51)";
                ctx.lineWidth = 40;
                ctx.font = "100px Arial";
                ctx.textAlign = "center";
                ctx.fillText(times, 360, 400);
                var circle = {
                    x: 360,    //圆心的x轴坐标值
                    y: 360,    //圆心的y轴坐标值
                    r: 300     //圆的半径
                };
                //顺时针方向绘制弧线
                ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2, false);
                ctx.stroke();
            }

        },
        /**
         * 绘画ctx综合.
         */
        ctx_zonghe: function (id, all) {
            //获取Canvas对象(画布)
            var canvas = document.getElementById(id);
            if (canvas.getContext) {
                var ctx = canvas.getContext("2d");
                //开始一个新的绘制路径
                ctx.beginPath();
                ctx.strokeStyle = "rgba(160, 148, 141, 0.51)";
                ctx.lineWidth = 40;
                ctx.font = "100px Arial";
                ctx.textAlign = "center";
                ctx.fillText(all.toFixed(1), 360, 400);
                var circle = {
                    x: 360,    //圆心的x轴坐标值
                    y: 360,    //圆心的y轴坐标值
                    r: 300     //圆的半径
                };
                //顺时针方向绘制弧线
                ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2, false);
                ctx.stroke();

                ctx.beginPath();
                var gradient = ctx.createLinearGradient(500, 50, 0, 460);
                gradient.addColorStop("0", "#846779");
                // gradient.addColorStop("0.5", "#c71988");
                gradient.addColorStop("1.0", "#ff610f");
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 40;
                var circle = {
                    x: 360,    //圆心的x轴坐标值
                    y: 360,    //圆心的y轴坐标值
                    r: 300     //圆的半径
                };
                ctx.arc(circle.x, circle.y, circle.r, 1.5 * Math.PI, 1.5 * Math.PI + Math.PI * (all / 100) * 2, false);
                ctx.stroke();
            }

        },
        /**
         * 获取雷达数据.
         */
        getRadar: function () {
            if (app.roleid) {
                $.ajax({
                    type: "POST",
                    url: "/api/getUserBattleAvgData",
                    data: {
                        roleId: app.roleid
                    },
                    success: function (data) {
                        try {
                            app.three_combat(data.data.data);
                            app.ctx_zonghe('ctx-win2', data.data.data.avgAll);
                        } catch (err) {

                        }

                    },
                    error: function (data) {
                        console.log(data);
                    }
                });

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
                    // console.log(data);
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
                        var uid = getCookie("squid");
                        var server = getCookie("sserver");
                        var source = getCookie("ssource");
                        var url = location.href.split('?')[0];
                        var imgurl = location.href.split('/users')[0] + '/static/imgs_static/share/sharelogo.png';

                        var content = {
                            title: '次元战绩分享', // 分享标题
                            desc: app.desc, // 分享描述
                            link: url + '?uid=' + uid + '&server=' + server + '&source=' + source + '&WXshare=fromwx&&otherps=other', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: imgurl, // 分享图标
                            type: 'link', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                            success: function () {
                                // 用户确认分享后执行的回调函数
                                $('.sharemask').hide();
                                //分享成功能后，添加分享次数
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
                return "71";//ios
            }
            else {
                app.channelTag = 1001;
                return "26";//安卓
            }
        },

        /**
         * 从微信里面分享出来，其它三个按钮不让点.
         */
        formWX: function () {
            var parm = app.getUrlParams('WXshare');
            if (parm == 'fromwx') {
                // var url = location.href.split('info')[0];
                var a = $('.weui-tabbar a');
                for (var i = 1; i < a.length; i++) {//由于战绩第一个，i从1开始
                    a.eq(i).attr('href', '/users/sharefuli');
                }
            }
        },
        /**
         * 点击战绩后，查看榜上人的数据.
         */
        showbangData: function (sever, role) {
            if (role) {
                $.ajax({
                    type: "POST",
                    url: "/api/getUserDataByRoleId",
                    data: {
                        roleId: role
                    },
                    success: function (data) {
                        // console.log(data);
                        try {
                            if (data.data) {

                                location.href = "/users/info?uid=" + data.data.accountUid + "&server=" + sever + "&source=" + data.data.source + "&otherps=other";
                            }
                        } catch (err) {

                        }
                    },
                    error: function (data) {
                        console.log(data);
                    }
                });
            }
        },
        /**
         * 查看个人的排行.
         */
        myrankfun: function () {

            $.ajax({
                type: "POST",
                url: "/api/getUserBattleRankingByRoleId",
                data: {
                    roleId: app.roleid
                },
                success: function (data) {
                    // console.log(data);
                    try {
                        if (Number(data.data.orderNum) <= 1000) {
                            app.myrank = "你的当前名次：" + data.data.orderNum;
                            if (app.uid == util.getCookie("suid")) {
                                app.desc = "我在次元本周综合实力排行中取得了第" + data.data.orderNum + "名, 一起来查看你在次元的战绩";
                            }

                        } else {
                            app.myrank = "未上榜";
                            app.desc = " 一起来查看你在次元的战绩";
                        }
                    } catch (err) {
                        app.myrank = "未上榜";
                        app.desc = " 一起来查看你在次元的战绩";
                    }
                },
                error: function (data) {
                    console.log(data);
                }
            });


        },
        /**
         * sdk进入，token换token.
         */
        transToken: function (uid, appid, token) {
            $.ajax({
                type: "POST",
                url: "/api/getChangeToken",
                data: {
                    uid: uid,
                    appId: appid,
                    token: token
                },
                success: function (data) {
                    try {
                        // alert(JSON.stringify(data));
                        if (data.resultCode == 200) {
                            util.setCookie("token", data.data.token);
                        }

                    } catch (err) {
                        // console.log(err);
                    }
                },
                error: function (data) {
                    console.log(data);
                }
            });
        },
        /**
         * 分享出去后添加一次分享的记录.
         */
        shareBattleSendLottery: function () {
            $.ajax({
                type: 'POST',
                url: "/api/shareBattleSendLottery",
                data: {
                    key: "zhanji"
                },
                success: function (data) {

                }
            });
        },
        /**
         * 控制选择区服（界面）.
         */
        selectServerPage: function () {

        },
        /**
         * 获取区服信息.
         */
        getServer: function () {
            $.ajax({
                type: 'POST',
                url: "/api/getServer",
                success: function (data) {
                    $('#select-server-role').html("");
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
                        $('#select-server-role').html(html_str);
                        // app.keepselect();
                        // $('#select-server').val(app.sserver);
                        // app.getRole(app.sserver);
                    } catch (err) {

                    }
                }
            });
        },
        /**
         * 获取角色信息.
         */
        getRole: function (server) {
            app.uid = getCookie("squid");

            if (app.uid) {
                $.ajax({
                    type: 'POST',
                    url: "/api/getRole",
                    async: false,
                    data: {
                        uid: app.uid,
                        server: server == ("" || undefined) ? app.infoserver : server
                    },
                    success: function (data) {
                        app.inforole = data.data;
                        try {
                            setTimeout(function () {
                                // $('#select-role').val(app.ssource);
                                $('#select-role option:eq(1)').prop('selected', true);
                            }, 10)
                        } catch (err) {

                        }
                    }
                });
            }
            return app.inforole;
        },
        /**
         * 区服角色级联操作.
         */
        changeServer: function () {
            $("#select-server-role").change(function () {
                app.infoserver = $("#select-server-role").val();

                if (app.infoserver != '-1') {
                    var roledata = app.getRole();
                    console.log(roledata);
                    setTimeout(function () {
                        if (roledata.length > 0) {
                            app.inforoleid = $("#select-role").val();
                        }
                    }, 200)
                } else {
                    layer.alert('请先选择区服！');
                    $('#select-role').val('1');
                }
            });
        },
    }
});

function getCookie(name) {
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
            return decodeURIComponent(document.cookie.substring(value_begin, value_end));
        }
        cookie_begin = document.cookie.indexOf(" ", cookie_begin) + 1;
        if (cookie_begin == 0) {
            break;
        }
    }
    return null;
}

app.uid = app.getUrlParams('uid');
app.server = app.getUrlParams('server');
app.source = app.getUrlParams('source');
var other = app.getUrlParams('otherps');

//控制是否显示下面的条栏
var showbottom = app.getUrlParams('showbottom');
if (showbottom == 0) {
    util.setCookie("showbottom", "hide");

    // $('.weui-tabbar').hide();//从menubar里进来不显示下面的导航栏
    $('#go-to-fuli').hide();//从menubar里进来不显示猫
    $('#select-server').hide();//从menubar里进来不显示上面的选择区服
    $('#sharebtn').hide();//从menubar里进来不显示上面的分享
} else {
    $('#go-to-fuli').show();//
    $('#select-server').show();//
}

if (util.getCookie("showbottom") == "hide") {
    // $('.weui-tabbar').hide();
}

if (app.uid != null && app.server != null && app.source) {
    // util.setCookie("suid", app.uid);
    // util.setCookie("sserver", app.server);
    // util.setCookie("ssource", app.source);
} else if (showbottom == 0) {
    //这里面是sdk途径
    app.source = app.getDevice();
    try {
        app.uid = getCookie("uid");
        app.server = getCookie("zoneId");
        var token = getCookie("token");
        //从sdk里进入需要把当前的参数存至cookie（安卓）
        util.setCookie("suid", app.uid);
        util.setCookie("sserver", app.server);
        util.setCookie("ssource", app.source);
        util.setCookie("squid", app.uid);//这个squid在zhuanpan.js页面里会用到
        //sdk里的token换取社区token
        app.transToken(app.uid, '20015', token);
        //ios旧版本上没有zoneId,
        // if (app.server == null && app.uid != null) {
        //     //suid是来之info页面的uid，uid则是来之login的uid，值是一样的
        //     util.setCookie("suid", app.uid);//suid,单独开给旧版本ios用的，
        //     window.location.href = "../users?device=ios";
        // }
    } catch (e) {
        alert("获取cookie失败！");
    }
}

app.getUserData();
app.rankingList();
app.WXshare();
app.formWX();
app.getServer();
app.changeServer();

$("#show-myheros").click(function () {
    app.show_myheros();
    $('#11').show();
    $('#12').hide();
    $('#21').hide();
    $('#22').show();
    $('#31').hide();
    $('#32').show();
})

$("#show-myrecord").click(function () {
    app.show_myrecord();
    $('#11').hide();
    $('#12').show();
    $('#21').show();
    $('#22').hide();
    $('#31').hide();
    $('#32').show();
})

$("#show-paihang").click(function () {
    app.show_paihang();
    $('#11').hide();
    $('#12').show();
    $('#21').hide();
    $('#22').show();
    $('#31').show();
    $('#32').hide();
})

$("#sever-select").change(function () {
    app.server = $("#sever-select").val();
    app.getUserData();
});

$('#go-to-fuli').click(function () {
    location.href = '/active/active';
})

app.registerclick();//添加页面中的事件

$(document).ready(function () {
    $('#sharebtn').click(function () {
        $('.sharemask').show();
    })

    $('.shareclose').click(function () {
        $('.sharemask').hide();
    })

    //选择区服
    $('#gainingmask .gbtn1').click(function () {
        $('.sendlottery').hide();
    })
    $('#select-server').click(function () {
        $('.sendlottery ').removeClass('bounceOutDown');
        $('.sendlottery').show();
    })

    //区服选择完成，开始查看战绩
    $('#gainingmask .gbtn').click(function () {
        util.setCookie("sserver", $('#select-server-role').val());
        util.setCookie("ssource", $('#select-role').val());
        $('.sendlottery').hide();
        app.curPage = 1;
        app.getUserData();
    })
})


