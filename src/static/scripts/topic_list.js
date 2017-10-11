
$(function(){
    $('.topic-navbar>.item').on('click', function () {
        $(this).addClass('active').siblings('.active').removeClass('active');
    });
});


var app = new Vue({
    el: '#app',
    data: {
    },
    methods: {
    }
});