'use strict';

(function () {
  var createFiltrarium = function (minPrice, maxPrice) {
    return {
      'filter-icecream': {
        type: 'accumulative',
        count: 0,
        isActive: false,
        outputId: 'output-icecream',
        filter: function (product) {
          return product.kind === 'Мороженое';
        },
      },
      'filter-soda': {
        type: 'accumulative',
        count: 0,
        isActive: false,
        outputId: 'output-soda',
        filter: function (product) {
          return product.kind === 'Газировка';
        },
      },
      'filter-gum': {
        type: 'accumulative',
        count: 0,
        isActive: false,
        outputId: 'output-gum',
        filter: function (product) {
          return product.kind === 'Жевательная резинка';
        },
      },
      'filter-marmalade': {
        type: 'accumulative',
        count: 0,
        isActive: false,
        outputId: 'output-marmalade',
        filter: function (product) {
          return product.kind === 'Мармелад';
        },
      },
      'filter-marshmallows': {
        type: 'accumulative',
        count: 0,
        isActive: false,
        outputId: 'output-marshmallows',
        filter: function (product) {
          return product.kind === 'Зефир';
        },
      },
      'filter-sugar-free': {
        type: 'decresent',
        count: 0,
        isActive: false,
        outputId: 'output-sugar-free',
        filter: function (product) {
          return product.nutritionFacts.sugar === false;
        },
      },
      'filter-vegetarian': {
        type: 'decresent',
        count: 0,
        isActive: false,
        outputId: 'output-vegetarian',
        filter: function (product) {
          return product.nutritionFacts.vegetarian;
        },
      },
      'filter-gluten-free': {
        type: 'decresent',
        count: 0,
        isActive: false,
        outputId: 'output-gluten-free',
        filter: function (product) {
          return product.nutritionFacts.gluten;
        },
      },
      'filter-availability': {
        type: 'decresent',
        count: 0,
        isActive: false,
        outputId: 'output-availability',
        filter: function (product) {
          return product.amount > 0;
        },
      },
      'filter-favorite': {
        type: 'decresent',
        count: 0,
        isActive: false,
        outputId: 'output-favorite',
        filter: function (product) {
          return product.isFavorite;
        },
      },
      'filter-price': {
        type: 'decresent',
        count: 0,
        min: minPrice,
        max: maxPrice,
        isActive: true,
        outputId: 'output-price',
        filter: function (product) {
          var priceFilter = getFiltrarium()['filter-price'];
          var price = product.price;

          return price >= priceFilter.min && price <= priceFilter.max;
        },
      },
    };
  };

  var filtrarium = {};

  var wrapInParentheses = function (val) {
    return '(' + val + ')';
  };

  var updatePriceFilter = function (min, max) {
    var priceFilter = filtrarium['filter-price'];

    priceFilter.min = min;
    priceFilter.max = max;
  };

  var apply = function (initialProducts) {
    var products = Object.assign({}, initialProducts);

    var productKeys = Object.keys(products);
    var filteredProducts = {};
    var filters = Object.values(filtrarium);

    filters.forEach(function (filter) {
      if (filter.isActive && filter.type === 'accumulative') {
        productKeys.forEach(function (key) {
          var product = products[key];

          if (filter.filter(product)) {
            filteredProducts[key] = products[key];
          }
        });
      }
    });

    if (!Object.keys(filteredProducts).length) {
      filteredProducts = products;
    }

    filters.forEach(function (filter) {
      if (filter.isActive && filter.type === 'decresent') {
        Object.keys(filteredProducts).forEach(function (key) {
          var product = filteredProducts[key];

          if (!filter.filter(product)) {
            delete filteredProducts[key];
          }
        });
      }
    });

    renderSidebar(filteredProducts);

    return filteredProducts;
  };

  function renderSidebar(products) {
    var productList = Object.values(products);
    var filtersList = Object.values(filtrarium);
    var filtersKeys = Object.keys(filtrarium);

    filtersList.forEach(function (filter) {
      filter.count = 0;
    });

    productList.forEach(function (product) {
      filtersList.forEach(function (filter) {
        if (filter.filter(product)) {
          filter.count++;
        }
      });
    });

    filtersKeys.forEach(function (key) {
      var id = filtrarium[key].outputId;

      if (id) {
        document.getElementById(id).textContent = wrapInParentheses(filtrarium[key].count);
      }
    });
  }

  var getFiltrarium = function () {
    return filtrarium;
  };

  var toggleFilter = function (id, status) {
    if (Object.keys(filtrarium).includes(id)) {
      filtrarium[id].isActive = status;
      return true;
    }

    return false;
  };

  var reset = function (products, minPrice, maxPrice) {
    filtrarium = createFiltrarium(minPrice, maxPrice);
    renderSidebar(products);
  };

  var init = function (products, minPrice, maxPrice) {
    filtrarium = createFiltrarium(minPrice, maxPrice);
    renderSidebar(products);
  };

  window.candyshop.filters = {
    init: init,
    apply: apply,
    toggleFilter: toggleFilter,
    updatePriceFilter: updatePriceFilter,
    reset: reset,
  };
})();
