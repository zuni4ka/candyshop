'use strict';

(function () {
  // возвращает случайное булевое значение
  var getRandomBoolean = function () {
    return Math.random() > 0.5;
  };

  // возвращает случайное значение из диапазона чисел
  var getRandomFromRange = function (max, min) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // возвращает случайную строку из элементов массива
  var getRandomStringFromArray = function (arr) {
    var result = arr.filter(function filter() {
      return getRandomBoolean();
    });
    return result.join(', ');
  };

  // возвращает копию элемента найденного в темплейте
  var getElementCopy = function (template, element) {
    return document.importNode(document.querySelector(template).content.querySelector(element), true);
  };

  window.candyshop.utils = {
    getRandomBoolean: getRandomBoolean,
    getRandomFromRange: getRandomFromRange,
    getRandomStringFromArray: getRandomStringFromArray,
    getElementCopy: getElementCopy,
  };
})();
