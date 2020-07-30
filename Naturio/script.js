var _loadingExcuted = false;
var timeoutId1;
var timeoutId2;
var timeoutId3;
$(function () {

    function funcA(s) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                $('#loading').addClass('animate__animated animate__fadeOut');
                resolve();
            }, s);
        });
    }

    function funcB(s) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                $('#loading').hide();
                resolve();
            }, s);
        });
    }

    function funchC(s) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                $('.popup').show();
                showPopup();
                resolve();
            }, s);
        });
    }

    funcA(1500).then(function () {
    }).then(function () {
        funcB(1000); 
    }).then(function () {
        funchC(6000);
    });


    $(window).scroll(() => {
        if ($(this).scrollTop() > 150) {
            $('#toTop').css('opacity', '1');
        } else {
            $('#toTop').css('opacity', '0');
        }
    });

    init();
});

function init() {
    $('.product_button_block').hide();
    $('.popup').hide();

    $('.swiper-container').hover(swiperMouseIn, swiperMouseOut);
    $('.product').hover(productMouseIn, productMouseOut);

    $('#toTop').click(() => {
        $('html,body').animate({ scrollTop: 0 }, 500);
    });

    $('.close-btn').click(() => {
        $('.popup').hide();
    })
}

function swiperMouseIn() {
    $('.swiper-button-next').css('right', '10px');
    $('.swiper-button-prev').css('left', '10px');
}

function swiperMouseOut() {
    $('.swiper-button-next').css('right', '-50px');
    $('.swiper-button-prev').css('left', '-50px');
}

function productMouseIn() {
    var productInfo = $(this).children('.product-content').children('.product-info');
    var productButtonBlock = $(this).children('.product-content').children('.product_button_block');

    productButtonBlock.show();
    productInfo.addClass('animate__animated animate__fadeOutUp').css('height', '0');
    productButtonBlock.removeClass('animate__fadeOutDown').addClass('animate__animated animate__fadeInUp');
}

function productMouseOut() {
    var productInfo = $(this).children('.product-content').children('.product-info');
    var productButtonBlock = $(this).children('.product-content').children('.product_button_block');

    setTimeout(() => { productInfo.removeClass('animate__fadeOutUp').addClass('animate__fadeInDown').show() }, 800);
    productButtonBlock.removeClass('animate__fadeInUp').addClass('animate__fadeOutDown');
}

function showPopup() {
    $('.popup').addClass('animate__animated animate__fadeInUp');
}
