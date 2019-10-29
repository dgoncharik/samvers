;(() => {
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

  $(document).click(function(evt) { /* Скрыть меню при клике за его пределами */
    let elem = $(mainMenu);
    if(evt.target != elem[0] && !elem.has(evt.target).length && menuIsOpened()) {
      hideMenu();
    } 
  });

  if ($(window).width() < TABLET_WIDTH) {
    slickOn( $('.slider') );
  }

  $(document).ready(function(){
    $("a[href*=\\#]").on("click", function(e){
    let anchor = $(this);
    $('html, body').stop().animate({
    scrollTop: $(anchor.attr('href')).offset().top
    }, 777);
    e.preventDefault();
    return false;
    });
  });
})()