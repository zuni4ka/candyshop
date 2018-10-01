'use strict';

(function () {
  var byPrice = function (map, min, max) {
    var mapCopy = Object.assign({}, map);

    Object.values(mapCopy).forEach(function (product) {
      var price = product.price;

      if (price < min || price > max) {
        delete mapCopy[product.id];
      }
    });

    return mapCopy;
  };

  window.candyshop.filters = {
    byPrice: byPrice,
  };
})();
