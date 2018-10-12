'use strict';

(function () {
  var createFiltrarium = function (minPrice, maxPrice) {
    return {
      'filter-icecream': {
        id: 'filter-icecream',
        type: 'accumulative',
        count: 0,
        isActive: false,
        outputId: 'output-icecream',
        filter: function (product) {
          return product.kind === 'Мороженое';
        },
      },
      'filter-soda': {
        id: 'filter-soda',
        type: 'accumulative',
        count: 0,
        isActive: false,
        outputId: 'output-soda',
        filter: function (product) {
          return product.kind === 'Газировка';
        },
      },
      'filter-gum': {
        id: 'filter-gum',
        type: 'accumulative',
        count: 0,
        isActive: false,
        outputId: 'output-gum',
        filter: function (product) {
          return product.kind === 'Жевательная резинка';
        },
      },
      'filter-marmalade': {
        id: 'filter-marmalade',
        type: 'accumulative',
        count: 0,
        isActive: false,
        outputId: 'output-marmalade',
        filter: function (product) {
          return product.kind === 'Мармелад';
        },
      },
      'filter-marshmallows': {
        id: 'filter-marshmallows',
        type: 'accumulative',
        count: 0,
        isActive: false,
        outputId: 'output-marshmallows',
        filter: function (product) {
          return product.kind === 'Зефир';
        },
      },
      'filter-sugar-free': {
        id: 'filter-sugar-free',
        type: 'decresent',
        count: 0,
        isActive: false,
        outputId: 'output-sugar-free',
        filter: function (product) {
          return product.nutritionFacts.sugar === false;
        },
      },
      'filter-vegetarian': {
        id: 'filter-vegetarian',
        type: 'decresent',
        count: 0,
        isActive: false,
        outputId: 'output-vegetarian',
        filter: function (product) {
          return product.nutritionFacts.vegetarian;
        },
      },
      'filter-gluten-free': {
        id: 'filter-gluten-free',
        type: 'decresent',
        count: 0,
        isActive: false,
        outputId: 'output-gluten-free',
        filter: function (product) {
          return product.nutritionFacts.gluten;
        },
      },
      'filter-availability': {
        id: 'filter-availability',
        type: 'cleaner',
        count: 0,
        isActive: false,
        outputId: 'output-availability',
        filter: function (product) {
          return product.amount > 0;
        },
      },
      'filter-favorite': {
        id: 'filter-favorite',
        type: 'cleaner',
        count: 0,
        isActive: false,
        outputId: 'output-favorite',
        filter: function (product) {
          return product.isFavorite;
        },
      },
      'filter-price': {
        id: 'filter-price',
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
      if (filter.isActive && filter.type === 'cleaner') {
        filters.forEach(function (otherFilter) {
          if (
            otherFilter.id !== filter.id
          ) {
            if (otherFilter.id !== 'filter-price') {
              otherFilter.isActive = false;
              document.getElementById(otherFilter.id).checked = false;
            }
          }
        });
      }
    });

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
      if (
        filter.isActive
        && (
          filter.type === 'decresent'
          || filter.type === 'cleaner'
        )
      ) {
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
    if (id === 'filter-favorite') {
      filtrarium['filter-availability'].isActive = false;
      document.getElementById('filter-availability').checked = false;
    }

    if (id === 'filter-availability') {
      filtrarium['filter-favorite'].isActive = false;
      document.getElementById('filter-favorite').checked = false;
    }

    filtrarium[id].isActive = status;
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
    getFiltrarium: getFiltrarium,
  };
})();
