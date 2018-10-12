'use strict';

(function () {
  var ratingSorter = function (a, b) {
    return b.rating.number - a.rating.number;
  };

  var sorterium = {
    'filter-popular': {
      id: 'filter-popular',
      isActive: true,
      sorter: null,
    },
    'filter-expensive': {
      id: 'filter-expensive',
      isActive: false,
      sorter: function (a, b) {
        var value = b.price - a.price;
        return value === 0 ? ratingSorter(a, b) : value;
      },
    },
    'filter-cheep': {
      id: 'filter-cheep',
      isActive: false,
      sorter: function (a, b) {
        var value = a.price - b.price;
        return value === 0 ? ratingSorter(a, b) : value;
      },
    },
    'filter-rating': {
      id: 'filter-rating',
      isActive: false,
      sorter: function (a, b) {
        var value = b.rating.value - a.rating.value;
        return value === 0 ? ratingSorter(a, b) : value;
      },
    },
  };

  var apply = function (products) {
    var sortedProducts = {};
    var sortedList = [];
    var productsList = Object.values(products);

    Object.values(sorterium).forEach(function (sorter) {
      if (sorter.isActive) {
        sortedList = sorter.sorter
          ? productsList.sort(sorter.sorter)
          : productsList;
      }
    });

    sortedList.forEach(function (product) {
      sortedProducts[product.id] = product;
    });

    return sortedProducts;
  };

  var pickSorter = function (id) {
    Object.keys(sorterium).forEach(function (key) {
      sorterium[key].isActive = key === id;
    });
  };

  var getSorterium = function () {
    return sorterium;
  };

  window.candyshop.sorters = {
    apply: apply,
    pickSorter: pickSorter,
    getSorterium: getSorterium,
  };
})();
