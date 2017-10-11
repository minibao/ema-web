var app = new Vue({
    el: '#app',
    data: {
        accountId: '',
        ads: '',
        icon: '',
        name: '',
        nickName: '',
        qq: '',
        sex: '',
        signature: '',
        telphone: '',
        uid: ''


    },
    methods: {
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
                            app.name = data.data.name;
                            app.sex = data.data.sex;
                            app.ads = data.data.address;
                            app.qq = data.data.qq;
                            app.phone = data.data.telphone;
                            app.nickName = data.data.nickName;
                            app.accountId = data.data.accountId;
                            app.icon = data.data.icon;
                        } catch (err) {

                        }
                    }
                });
            }
        },
        submituserdata: function () {
            if (app.accountId) {
                var nickName = app.nickName;
                var sex = app.sex;
                var ads = app.ads;
                var qq = app.qq;
                var phone = app.phone;
                var rname = app.name;

                $.ajax({
                    type: 'POST',
                    url: "/api/subuserdata",
                    data: {
                        uid: app.uid,
                        id: app.accountID,
                        nickName: nickName,
                        sex: sex,
                        address: ads,
                        qq: qq,
                        telphone: phone,
                        name: rname,
                        icon: app.icon
                    },
                    success: function (data) {
                        if (data == "error_goto_user") {
                            alert("登录出现异常，请重新登录！");
                            util.delCookie("squid");//dd
                            util.delCookie("token");
                            util.delCookie("accountId_shequ");
                            setTimeout(function () {
                                location.href = "/users";
                            }, 1000)
                            return false;
                        }
                        try {
                            if (data.resultCode == 200) {
                                alert("修改成功！");
                                location.href = "/usercenter";
                            }

                        } catch (err) {
                        }
                    }
                });
            }
        },
        /**
         * 图片上传ajax.
         */
        AjaxImgLoad: function (filename, base64) {
            $.ajax({
                type: 'post',
                url: "https://staging-uploadimg.lemonade-game.com/ema-dingding/upload",
                data: {
                    fileName: filename,
                    file: base64 + ""
                },
                success: function (data) {
                    try {
                        console.log(data.data);
                        var url = data.data;
                        var code = url.split('code=')[1];
                        url = "https://staging-uploadimg.lemonade-game.com/ema-dingding/download?code=" + code;

                        //提交头像URL
                        app.icon = url;
                        app.submituserdata();
                    } catch (err) {

                    }
                }
            });
        }
    }
})

app.uid = util.getCookie("squid");
app.getuserdata();


$(document).ready(function () {
    //做个下简易的验证  大小 格式
    $('#avatarInput').on('change', function (e) {
        var filemaxsize = 1024 * 5;//5M
        var target = $(e.target);
        var Size = target[0].files[0].size / 1024;
        if (Size > filemaxsize) {
            alert('图片过大，请重新选择!');
            $(".avatar-wrapper").childre().remove;
            return false;
        }
        if (!this.files[0].type.match(/image.*/)) {
            alert('请选择正确的图片!')
        } else {
            var filename = document.querySelector("#avatar-name");
            var texts = document.querySelector("#avatarInput").value;
            var teststr = texts; //你这里的路径写错了
            testend = teststr.match(/[^\\]+\.[^\(]+/i); //直接完整文件名的
            filename.innerHTML = testend;
        }

    });

    $(".avatar-save").on("click", function () {
        var img_lg = document.getElementById('imageHead');
        // 截图小的显示框内的内容
        html2canvas(img_lg, {
            allowTaint: true,
            taintTest: false,
            onrendered: function (canvas) {
                canvas.id = "mycanvas";
                //生成base64图片数据
                var dataUrl = canvas.toDataURL("image/jpeg");
                var newImg = document.createElement("img");
                newImg.src = dataUrl;

                var filename = $("#avatar-name").html();
                var imageHead = $("#imageHead").html();
                if (imageHead) {
                    app.AjaxImgLoad(filename, dataUrl);
                } else {
                    alert("请先上传图片！");
                }
            }
        });
    })
})
