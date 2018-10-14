'use strict';

(function () {
  var PICTURES = {
    'Академическая': 'academicheskaya',
    'Василеостровская': 'vasileostrovskaya',
    'Черная речка': 'rechka',
    'Петроградская': 'petrogradskaya',
    'Пролетарская': 'proletarskaya',
    'Площадь Восстания': 'vostaniya',
    'Проспект Просвещения': 'prosvesheniya',
    'Фрунзенская': 'frunzenskaya',
    'Чернышевская': 'chernishevskaya',
    'Технологический институт': 'tehinstitute',
  };

  var PATH = 'img/map/';
  var EXTEND = '.jpg';

  var deliveryBlock = document.querySelector('.deliver__toggle');
  var tabCourier = document.querySelector('.deliver__courier');
  var tabStore = document.querySelector('.deliver__store');

  var deliveryClickHandler = function (event) {
    var tab = event.target.id;

    if (tab === 'deliver__courier') {
      tabStore.classList.add('visually-hidden');
      tabCourier.classList.remove('visually-hidden');
    } else if (tab === 'deliver__store') {
      tabCourier.classList.add('visually-hidden');
      tabStore.classList.remove('visually-hidden');
    }
  };

  // функция изменения карты
  var changeMap = function (event) {
    event.preventDefault();

    var target = event.target;
    var picture = tabStore.querySelector('.deliver__store-map-img');

    if (PICTURES[target.innerText]) {
      picture.src = PATH + PICTURES[target.innerText] + EXTEND;
      picture.alt = PICTURES[target.innerText];
      tabStore.querySelector('#store-' + PICTURES[target.innerText]).checked = true;
    }
  };

  tabStore.addEventListener('click', changeMap);
  deliveryBlock.addEventListener('click', deliveryClickHandler);
})();
