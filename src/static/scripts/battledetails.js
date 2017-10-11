/**
 * Created by Administrator on 2017/4/10.
 */
/**
 * Created by B-04 on 2016/12/26.
 */
var app = new Vue({
    el: '#app',
    data: {
        isActive: 4,
        gameguid: 0,
        gamename: '',
        battleList: [],
        detailInfo: {},
        userheros: {},
        showAll: false,
        allMatch: {},
        battle: {},
        allTime: '',
        time: '',
        mapId: ''
    },
    methods: {
        changeTab: function (index) {
            app.isActive = index;
        },
        getUrlParam: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg);  //匹配目标参数
            if (r != null) return unescape(r[2]);
            return null; //返回参数值
        },
        getOneBattleData: function () {
            $('#loadingToast').show();
            if (app.gameguid) {
                $.ajax({
                    type: "POST",
                    url: "/api/getOneBattleData",
                    data: {
                        gameGuid: app.gameguid,
                        gamename: app.gamename
                    },
                    success: function (data) {
                        app.detailInfo = data;
                        console.log(app.detailInfo.LGDdata[0].result);
                        setTimeout(function(){
                            var my=$('.my .w30 span').html();
                            if (my.substring(0,2)=='我方') {
                                $('.my1').hide();
                            }else{
                                $('.my').hide();
                            }
                            $('.no_match').fadeIn(1500);
                            $('#loadingToast').hide();
                            $('.myteam').fadeIn(1500);
                        },200)
                    },
                    error: function (data) {
                        console.log(data);
                        $('.no_match').show();
                        $('#loadingToast').hide();
                    }
                });
            } else {
                $('.no_match').show();
                $('#loadingToast').hide();
            }
        },
        holdbackiconshow: function () {
            setTimeout(function () {
                $('.goback').fadeOut(2000);
            }, 4000);
            $("body").on("touchstart", function () {
                if ($('.goback').css('display') == 'none') {
                    $('.goback').fadeIn(1000, function () {
                        setTimeout(function () {
                            $('.goback').fadeOut(1000);
                        }, 3000);
                    });
                }
            });
        }
    }
});

app.gameguid = app.getUrlParam('gameGuid');
app.allTime = (app.getUrlParam('allTime') / 60000).toFixed(0) + '分钟';
app.time = app.getUrlParam('time');
app.time = app.time.substr(0, 16);
app.mapId = app.getUrlParam('mapId');
var mapjson = {
    "315": "排位模式",
    "317": "匹配人机",
    "318": "新手地图",
    "319": "人机训练",
    "320": "匹配模式",
    "321": "自定义"
};
app.mapId = mapjson[app.mapId];
app.gamename = util.getCookie("infoname");
console.log(app.gamename);
app.getOneBattleData();
app.holdbackiconshow();


