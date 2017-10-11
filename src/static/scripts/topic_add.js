/**
 * Created by B-04 on 2017/5/17.
 */

var app = new Vue({
    el: '#app',
    data: {
        uid : 10086
    },
    methods: {
        addTopic:function () {
            var postData = {
                title : app.title,
                authorId : app.uid,
                author : 'joker',
                brief : 'sha dou mei you',
                time : new Date().toLocaleString(),
                context : um.getContent()
            };
            console.log(postData);


            if (app.uid) {
                $('#loadingToast').show();
                $.ajax({
                    type: "POST",
                    url: "/api/addTopic",
                    data: postData,
                    success: function (data) {
                        $('#loadingToast').hide();
                        console.log(data);
                    },
                    error: function (data) {
                        $('#loadingToast').hide();
                        console.log(data);
                    }
                });
            } else {
                alert("未登录！");
            }
        }
    }
});