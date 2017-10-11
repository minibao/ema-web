/**
 * Created by Administrator on 2017/9/28.
 */
var app = new Vue({
    el: '#app',
    data: {},
    methods: {
        /**
         * init()
         */
        init: function () {
            app.addSwiper();//初始化swiper

        },
        /**
         * 初始化swiper
         */
        addSwiper: function () {
            var galleryTop = new Swiper('.gallery-top', {
                // nextButton: '.swiper-button-next',
                // prevButton: '.swiper-button-prev',
                spaceBetween: 10
            });

            var galleryThumbs = new Swiper('.gallery-thumbs', {
                spaceBetween: 10,
                centeredSlides: true,
                slidesPerView: '2.5',
                touchRatio: 0.2,
                slideToClickedSlide: true
            });

            galleryTop.params.control = galleryThumbs;
            galleryThumbs.params.control = galleryTop;
        }
    }
})


app.init();//init