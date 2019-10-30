;(() => {
  const TABLET_WIDTH = 768;
  const headerBurger = document.querySelector('.header__burger');
  const mainMenu = document.querySelector('.header__main-navigation');
  const mainMenuBurger = mainMenu.querySelector('.main-navigation__burger');
  const MENU_OPENED = 'main-navigation--opened';
  const sliderJqElem = $('.slider');
  let _sliderIsEnabled = false;

  function colorFirstWord(arr, color) {
    /* принимает массив элементов и цвет. Задает свойство color первому слому текстового содержимого каждого элемента */
    for (let i=0; i < arr.length; i++) {
      let element = arr[i];
      let words = element.innerText.split(' ').filter(Boolean);
      if (words.length > 0) {
        element.innerHTML = `<span style="color: ${color}">${words[0]}</span> ${words.slice(1).join(' ')}`;
      }
    }
  }
  colorFirstWord(document.querySelectorAll('.color-first-word'), '#FEE000');

  function slickOn(jqElem) {
    jqElem.slick({
      infinite: false,
      dots: true,
      slidesToShow: 1,
      arrows: false,
      slidesToScroll: 1
    });
    _sliderIsEnabled = true;
  }

  function slickOff(jqElem) {
    jqElem.slick('unslick');
    _sliderIsEnabled = false;
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

  if (window.innerWidth < TABLET_WIDTH) {
    slickOn(sliderJqElem);
  }

  window.addEventListener('resize', function() {
    if (window.innerWidth > TABLET_WIDTH && _sliderIsEnabled) {
      slickOff(sliderJqElem)
    } else if (window.innerWidth < TABLET_WIDTH && !_sliderIsEnabled) {
      slickOn(sliderJqElem)
    }
  })

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