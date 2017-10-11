/**
 * Created by lv on 2017/8/24.
 */

var app = new Vue({
    el: '#app',
    data: {
        code: "",
        btnclicksign: "on"
    },
    methods: {
        /**
         * 判断该码是否被领过
         */

        getPackageCodeNoLogin: function () {
            if (app.btnclicksign != "on") {
                return false;
            }
            $.ajax({
                type: 'POST',
                url: "/api/getPackageCodeNoLogin",
                data: {
                    gameCode: "20012"
                },
                success: function (data) {
                    // console.log(data);
                    try {
                        $("#in").val(data.data.code);
                        $("#in").attr("readonly", "readonly");
                        $("#in").attr("unselectable", "on");
                        $(".btns .btn").addClass("disable");
                        app.btnclicksign = "off";
                    } catch (err) {
                    }
                }
            });
        }

    }
});

/**
 * 点击事件
 */
$(document).ready(function () {
    //点击下载按钮，在微信里打开，显示弹出层
    $('.btn').click(function () {
        app.getPackageCodeNoLogin();
    });
})