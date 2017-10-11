/**
 * Created by B-04 on 2017/5/10.
 */


var app = new Vue({
    el: '#app',
    data: {
        commentBoxFlag: true
    },
    methods: {
        rand: function (min, max) {
            return parseInt(Math.random() * (max - min) + 1) + min;
        },
        // barrage:function (str) {
        //     var _top = app.rand(3,30);
        //     var barrageObj = $('<div style="position: absolute;height:15px; font-size: 12px;z-index: 10;overflow: hidden;">'+str+'</div>');
        //     barrageObj.css({"left":$(window).width()+"5rem"});
        //     barrageObj.css({color:getRandomColor()});
        //     $("#main-body").append(barrageObj);
        //     // var num = $(window).width();
        //     var num = $('.content').outerWidth();
        //     setInterval(function(){
        //         num--;
        //         if (num<0-barrageObj.width()) {
        //             barrageObj.remove();
        //         }
        //         barrageObj.css({left:num,top:_top+"rem"});
        //     },20);
        //
        //     function getRandomColor(){
        //         return '#'+(function(h){
        //                 return new Array(7-h.length).join("0")+h
        //             })((Math.random()*0x1000000<<0).toString(16))
        //     }
        // },
        barrage: function (str) {
            $('.danmu').css('animation-play-state', 'paused');
            for (var i = 0; i < str.length; i++) {
                var rand = Math.floor(Math.random() * 400 + 1);
                var strhtml = '<div class="fr"><span style="margin-right: -' + rand + 'px;" class="ts3dright">' + str[i] + '</span></div>'
                $('.barrage').append(strhtml);
                $('.barrage div').addClass('danmu');
            }
            setTimeout(function () {

                $('.danmu').css('animation-play-state', 'running');
            }, 1000)

        },
        discuss: function () {
            var commentBox = $('#comment-box');
            var comment = $('#comment');
            var num = commentBox.outerWidth();
            if (app.commentBoxFlag) {
                commentBox.show();
                commentBox.animate({right: 0});
                comment.animate({right: 200});
            } else {
                comment.animate({right: 0});
                commentBox.animate({right: -num}, function () {
                    commentBox.hide();
                });
            }
            app.commentBoxFlag = !app.commentBoxFlag;
        }
    }
});


var array = [];
for (var i = 0; i < 20; i++) {
    array[i] = "傻逼年年有！";
}
app.barrage(array);