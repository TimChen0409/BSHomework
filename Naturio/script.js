$(function () {
    $(window).scroll(function () {
        if ($(this).scrollTop() > 150) {
            $('#toTop').css('opacity', '1');
        } else {
            $('#toTop').css('opacity', '0');
        }
    });

    $('.swiper-container').hover(swiperMouseIn, swiperMouseOut);
    $('.product').hover(productMouseIn, productMouseOut);
    $('.product_button_block').hide();
    $('#toTop').click(function () {
        $('html,body').animate({ scrollTop: 0 }, 500);
    });
});

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
