$(function () {
    var w = $(".num").width();
    w = Math.floor(w);
    window.h = w * 1.5;
    $('.num').css('width', w + 'px');
    $('.num').css('height', h + 'px');
    w = w * 265;
    //运动事件监听
    if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', deviceMotionHandler, false);
    } else {
        alert("你的设备不支持摇一摇功能，请点击按钮！");
    }

})
function numRand() {
    var x = 999; //上限
    var y = 00000; //下限
    var rand = parseInt(Math.random() * (x - y + 1) + y);
    console.log(rand);
    return rand;

}

// var isBegin = false;
// $(function () {
//     var u = window.h;
//     $('.gbtn').click(function () {
//         if (isBegin) return false;
//         isBegin = true;
//         $(".num").css('backgroundPositionY', 0);
//         var result = numRand();
//         var resultStr = result.toString();
//         if (resultStr.length < 5) {
//             for (var i = resultStr.length; i < 5; i++) {
//                 resultStr = '0' + resultStr;
//             }
//             result = resultStr;
//         }
//
//         var num_arr = (result + '').split('');
//         $(".num").each(function (index) {
//             var _num = $('.num').eq(4 - index);
//             console.log(_num);
//             setTimeout(function () {
//                 _num.animate({
//                     backgroundPositionY: (u * 60) - (u * num_arr[4 - index])
//                 }, {
//                     duration: 6000 + index * 3000,
//                     easing: "easeInOutCirc",
//                     complete: function () {
//                         if (index == 4) isBegin = false;
//                     }
//                 });
//             }, (index) * 30);
//         });
//     });
// });

//获取加速度信息
//通过监听上一步获取到的x, y, z 值在一定时间范围内的变化率，进行设备是否有进行晃动的判断。
//而为了防止正常移动的误判，需要给该变化率设置一个合适的临界值。
var SHAKE_THRESHOLD = 20000;
var last_update = 0;
var x, y, z, last_x = 0, last_y = 0, last_z = 0;
function deviceMotionHandler(eventData) {
    var acceleration = eventData.accelerationIncludingGravity;
    var curTime = new Date().getTime();
    if ((curTime - last_update) > 10) {
        var diffTime = curTime - last_update;
        last_update = curTime;
        x = acceleration.x;
        y = acceleration.y;
        z = acceleration.z;
        var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;
        if (speed > SHAKE_THRESHOLD) {
            // Do something
            $(".mark").show();
            $(".mark").css('display', 'table');
            $("#swing-img").addClass('an-swing');
            if (!window.click) {
                console.log("点击被屏蔽");
                return false;
            }
            setTimeout(function () {
                $('#gbtn').trigger("click");
            }, 200)

            setTimeout(function () {
                $(".mark").hide();
                $("#swing-img").removeClass('an-swing');
            }, 2000)
        }
        last_x = x;
        last_y = y;
        last_z = z;
    }
}

//下面全是控制滚动文字
var stopscroll = false;
var scrollElem = document.getElementById("andyscroll");
var marqueesHeight = scrollElem.style.height;
scrollElem.onmouseover = new Function('stopscroll = true');
scrollElem.onmouseout = new Function('stopscroll = false');
var preTop = 0;
var currentTop = 0;
var stoptime = 0;
var leftElem = document.getElementById("scrollmessage");
scrollElem.appendChild(leftElem.cloneNode(true));
init_srolltext();

function init_srolltext() {
    scrollElem.scrollTop = 0;
    setInterval('scrollUp()', 60); //确定滚动速度的, 数值越小, 速度越快
}

function scrollUp() {
    if (stopscroll) return;
    currentTop += 2; //设为1, 可以实现间歇式的滚动; 设为2, 则是连续滚动
    if (currentTop == 19) {
        stoptime += 1;
        currentTop -= 1;
        if (stoptime == 180) {
            currentTop = 0;
            stoptime = 0;
        }
    } else {
        preTop = scrollElem.scrollTop;
        scrollElem.scrollTop += 1;
        if (preTop == scrollElem.scrollTop) {
            scrollElem.scrollTop = 0;
            scrollElem.scrollTop += 1;
        }
    }
}