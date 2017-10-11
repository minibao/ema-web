/**
 * Created by B-04 on 2017/6/21.
 */
var flag=false;
var type = 'phone';
$(document).ready(function(){
    var uid = util.getUrlParams("uid");
    var server = util.getUrlParams("server");
    var source = util.getUrlParams("source");
    /*----------绑定手机---------*/
    $("#btn_bind_phone").click(function(){
        var phone=$("#txt_mobile").val(),
            code =$("#txt_code").val();
        $('#loadingToast').show();
        if(!checkmobile(phone))
        {
            $('#loadingToast').hide();
            return false;
        }
        var postData = {};
        var url = "/pf/ema-platform/member/bindAccount";
        if(type == 'mobile'){
            postData = {
                accountType:1,
                mobile:phone,
                uid:uid,
                captcha:code
            };
        }else{
            postData = {
                accountType: 2,
                email: phone,
                uid:uid,
                captcha:code
            };
        }
        $.ajax({
            url:url,
            type:"post",
            dataType:"json",
            data:postData,
            error: function(){
                $('#loadingToast').hide();
                layer.msg("请求失败！");
            },
            success: function(data){
                $('#loadingToast').hide();
                if(data.status == 0){
                    layer.msg(data.message);
                    location.href = '/users/info?uid=' + uid + '&server=' + server + '&source=' + source;
                    // util.setCookie("squid", uid);//验证登录直接登录，玩家绑定手机后，会自动跳到选区服
                }else{
                    layer.msg(data.message);
                }
            }
        });
    });

    var wait = 60;
    $("#getmsgyzm").click(function() {
        var phone = $("#txt_mobile").val();
        $('#loadingToast').show();
        if (!checkmobile(phone)) {
            $('#loadingToast').hide();
            return false;
        }
        var postData = {};
        var url = '';
        if(type == 'mobile'){
            url = "/pf/ema-platform/notice/sendCaptcha";
            postData = {
                mobile: phone
            };
        }else{
            url = "/pf/ema-platform/notice/sendEmailCaptcha";
            postData = {
                email: phone
            };
        }
        if (wait == 60) {
            $("#mfyz").html(wait + "S");
            $(".btn_dxyzm").addClass("btn_dxyzm_60s");
            var timer1 = setInterval(function() {
                wait--;
                $("#mfyz").html(wait + "S");
                if (wait == 0) {
                    clearInterval(timer1);
                    $("#mfyz").html("重新发送");
                    $(".btn_dxyzm").removeClass("btn_dxyzm_60s");
                    wait = 60;
                }
            }, 1000);

            $.ajax({
                url: url,
                type: "post",
                dataType: "json",
                data: postData,
                error: function() {
                    $('#loadingToast').hide();layer.msg("请求失败！") },
                success: function(data) {
                    $('#loadingToast').hide();
                    layer.msg(data.message);
                }
            });

        } else {
            layer.msg("请求时间过短！");
            $('#loadingToast').hide();
        }
    });

    $(".menulist").on("click", "#getmsgyzmnew", function() {
        var phone = $("#txt_mobile").val();
        $('#loadingToast').show();
        if (!checkmobile(phone)) {
            $('#loadingToast').hide();
            return false;
        }
        if (wait == 60) {
            $("#mfyz").html(wait + "S");
            $(".btn_dxyzm").addClass("btn_dxyzm_60s");
            var timer1 = setInterval(function() {
                wait--;
                $("#mfyz").html(wait + "S");
                if (wait == 0) {
                    clearInterval(timer1);
                    $("#mfyz").html("重新发送");
                    $(".btn_dxyzm").removeClass("btn_dxyzm_60s");
                    wait = 60;
                }
            }, 1000)

            var phone = $("#txt_mobile").val();
            $.ajax({
                url: "/pf/ema-platform/notice/sendCaptcha",
                type: "post",
                dataType: "json",
                data: {
                    mobile: phone
                },
                error: function() {
                    $('#loadingToast').hide();layer.msg("请求失败！") },
                success: function(data) {
                    layer.msg(data.message);
                    $('#loadingToast').hide();
                }
            });

        } else {
            layer.msg("请求时间过短！");
            $('#loadingToast').hide();
        }
    })
});

function checkmobile(phonenume) //验证手机号码
{
    var errMsg = "请输入正确的手机号码或邮箱";
    if (phonenume == '') {
        layer.msg(errMsg);
        return false;
    }
    var tel = /^1\d{10}$/;
    var emailTest = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (tel.test(phonenume) || emailTest.test(phonenume)) {
        if(tel.test(phonenume)){
            if (phonenume.length != 11) {
                layer.msg(errMsg);
                return false;
            }
            type = 'mobile';
        }else{
            type = 'email';
        }
        return true;
    }else{
        layer.msg(errMsg);
        return false;

    }
}