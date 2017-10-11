/**
 * Created by Administrator on 2017/5/23.
 */
var app = new Vue({
    el: '#app',
    data: {
        accountId: '',
        binfo: '',
        prize10: '',
        boxId: '',
        prizeList: '',
        lotteryType: '',
        uid: '',
        uinfo: ''
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

                        } catch (err) {
                        }
                    }
                });
            }
        },
        chooseTicket: function () {
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
        getlrecentlylist_10: function () {
            $.ajax({
                type: 'POST',
                url: "/api/geTenWinningList",
                data: {},
                success: function (data) {
                    try {
                        // console.log(data);
                        app.prize10 = data.data;
                        $('#scrollmessage ul').html('');
                        var strhtml = "";
                        for (var i = 0; i < app.prize10.length; i++) {
                            strhtml = strhtml + '<li><p><span class="sever"> 平台的 </span><span class="name"> 同学' + i + ' </span> 抽到 <span class="jiang"> ' + app.prize10[i].prizeName + ' </span> <span class="gang">' + app.prize10[i].time + '</span></p></li>';
                        }
                        $('#scrollmessage ul').html(strhtml);
                    } catch (err) {
                    }
                }
            });
        },
        btntoggle: function () {
            $('.gainingmask .gbtn').click(function () {
                $('.gainingmask').hide();
            })
        },
        startPrize: function () {
            var u = window.h;
            window.click = true;
            $('#gbtn').click(function () {
                $('.gainingmask').hide();
                if (!click) {
                    console.log("点击被屏蔽");
                    return false;
                }
                var ticket = $('.quan').hasClass('box-shadow1');
                if (!ticket) {
                    alert("请先选择一张券！");
                    window.click = false;
                    setTimeout(function () {
                        window.click = true;
                    }, 3000)
                    return false;
                }
                if (isBegin) return false;
                isBegin = true;
                if (app.lotteryType == 1) {
                    var commonno = $('#commonno').html();
                    if (commonno == '0张') {
                        $("body").unbind("touchmove");
                        alert("该类型的券已经用完！");
                        return false;
                    }
                }
                if (app.lotteryType == 2) {
                    var seniorno = $('#seniorno').html();
                    console.log(seniorno);
                    if (seniorno == '0张') {
                        $("body").unbind("touchmove");
                        alert("该类型的券已经用完！");
                        return false;
                    }
                }
                //确保抽奖时在屏幕中间
                $('.frm').animate({scrollTop: 1000}, 500);
                $(".num").css('backgroundPositionY', 0);
                // var result = numRand();
                $.ajax({
                    type: 'POST',
                    url: "/api/startQuotaShake ",
                    data: {
                        accountId: app.accountId
                    },
                    success: function (data) {
                        try {
                            console.log(data);
                            var prize = data.data.personalQuota;
                            console.log(prize);
                            var result = Math.floor(prize * 100);
                            var resultStr = result.toString();
                            if (resultStr.length < 5) {
                                for (var i = resultStr.length; i < 5; i++) {
                                    resultStr = '0' + resultStr;
                                }
                                result = resultStr;
                            }
                            var num_arr = (result + '').split('');
                            $(".num").each(function (index) {
                                var _num = $('.num').eq(4 - index);
                                console.log(_num);
                                setTimeout(function () {
                                    _num.animate({
                                        backgroundPositionY: (u * 60) - (u * num_arr[4 - index])
                                    }, {
                                        duration: 6000 + index * 3000,
                                        easing: "easeInOutCirc",
                                        complete: function () {
                                            if (index == 4) {
                                                window.click = true;
                                                isBegin = false;
                                                console.log(prize);
                                                if (prize) {
                                                    $('#prizedot').html(prize.toFixed(2));
                                                    $('.gainingmask').show();
                                                    app.getuserinfo();
                                                    app.getlrecentlylist_10();
                                                }
                                            }
                                        }
                                    });
                                }, (index) * 30);
                            });
                        } catch (err) {
                        }
                    }
                });
            });

        }
    }
})

app.uid = sessionStorage.getItem("uid");
if (app.uid) {
    app.getuserdata();
}
app.accountId = sessionStorage.getItem("accountId_shequ");
app.boxId = '3';
app.getuserinfo();
app.getuserdata();
app.getlrecentlylist_10();
app.chooseTicket();
app.btntoggle();

var isBegin = false;
$(function () {
    app.startPrize();
});