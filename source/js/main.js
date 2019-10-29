let TABLET_WIDTH = 768;
let headerBurger = document.querySelector('.header__burger');
let mainMenu = document.querySelector('.header__main-navigation');
let mainMenuBurger = mainMenu.querySelector('.main-navigation__burger');
let MENU_OPENED = 'main-navigation--opened';

function slickOn(jqElem) {
  jqElem.slick({
    infinite: false,
    dots: true,
    slidesToShow: 1,
    arrows: false,
    slidesToScroll: 1
  });
}

function menuIsOpened() {
  return mainMenu.classList.contains(MENU_OPENED);
}

function showMenu() {
  mainMenu.classList.add(MENU_OPENED);
}

function hideMenu() {
  mainMenu.classList.remove(MENU_OPENED);
}

if ($(window).width() < TABLET_WIDTH) {
  slickOn( $('.slider') );
}

headerBurger.addEventListener('click', function(evt) {
  evt.preventDefault();
  evt.stopPropagation();
  showMenu();
})

mainMenuBurger.addEventListener('click', function(evt) {
  evt.preventDefault();
  evt.stopPropagation();
  hideMenu();
})

$(document).click(function(evt) {
   var elem = $('.header__main-navigation');
   console.log(elem);
   console.log(evt.target);
   if(evt.target != elem[0] && !elem.has(evt.target).length) {
     hideMenu();
   } 
});