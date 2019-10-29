let TABLET_WIDTH = 768;

function slickOn(jqElem) {
  jqElem.slick({
    infinite: false,
    dots: true,
    slidesToShow: 1,
    arrows: false,
    slidesToScroll: 1
  });
}

if ($(window).width() < TABLET_WIDTH) {
  slickOn( $('.slider') );
}