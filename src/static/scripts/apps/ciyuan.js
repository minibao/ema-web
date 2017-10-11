/**
 * Created by B-04 on 2017/8/8.
 */
/**
 * Created by B-04 on 2016/12/20.
 */

var wait = 60;

var app = new Vue({
    el: '#app',
    data: {
        uid: 0,
        server: 0,
        loginStyle: true,
        role: {},
        roleid: 0,
        channelTag: '',
        appId: 20015,
        tips: ''
    },
    methods: {
        /**左上角退出箭头*/
        relogin: function () {
            $('.selectsever').fadeOut(500, function () {
                app.loginStyle = true;
                //清空cookie
                util.delCookie("squid");//ddd
                util.delCookie("token");
                util.delCookie("accountId_shequ");
                $('#select-server').val('-1');
                $('#select-role').val('0');
                app.role = "";
            });
        },
        getServer: function () {
            $.ajax({
                type: 'POST',
                url: "/api/getServer",
                success: function (data) {
                    $('#select-server').html("");
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
                        $('#select-server').html(html_str);
                    } catch (err) {

                    }
                }
            });
        },
        getRole: function () {
            if (app.uid) {
                $.ajax({
                    type: 'POST',
                    url: "/api/getRole",
                    async: false,
                    data: {
                        uid: app.uid,
                        server: app.server
                    },
                    success: function (data) {
                        app.role = data.data;
                    }
                });
            }
            return app.role;
        },
        changeServer: function () {
            $("#select-server").change(function () {
                app.server = $("#select-server").val();
                if (app.server != '-1') {
                    var roledata = app.getRole();
                    console.log(roledata);
                    try {
                        if (!roledata.length) {
                            return false;
                        }
                    } catch (err) {
                        return false;

                    }
                    setTimeout(function () {
                        if (roledata.length > 0) {
                            $('#select-role option:eq(1)').prop('selected', true);
                            app.roleid = $("#select-role").val();
                        }
                    }, 200)
                } else {
                    $('#iosDialog2').show();
                    $('.weui-mask').fadeIn(200);
                    $('#select-role').val('1');
                }
            });
        },
        changeRole: function () {
            $("#select-role").change(function () {
                app.roleid = $("#select-role").val();
            });
        },
        changeLoginStyle: function () {
            app.loginStyle = false;
            $('.selectsever').show();
        }
    }
});

var accout = util.getCookie("accout");
var uid = util.getCookie("squid");
if (uid != null) {
    $('.selectsever').show();
    $('#select-server').val('-1');
    $('#select-role').val('0');
    app.uid = uid;
}
app.getServer();
app.changeServer();
app.changeRole();