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

  var getRandoms = function (arr, count) {
    var resultArr = arr.concat([]);

    for (var i = resultArr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = resultArr[i];
      resultArr[i] = resultArr[j];
      resultArr[j] = temp;
    }

    return resultArr.slice(0, count);
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
    getRandoms: getRandoms,
  };
})();
