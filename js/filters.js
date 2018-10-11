'use strict';

(function () {
  var filtersSidebar = document.querySelector('.catalog__sidebar');
  var outputPrice = filtersSidebar.querySelector('#output-price');

  var filters = {
    'filter-icecream': {
      count: 0,
      isActive: false,
      filter: function (product) {
        return product.kind === 'Мороженое';
      },
      outputNode: filtersSidebar.querySelector('#output-icecream'),
    },
    'filter-soda': {
      count: 0,
      isActive: false,
      filter: function (product) {
        return product.kind === 'Газировка';
      },
      outputNode: filtersSidebar.querySelector('#output-soda'),
    },
    'filter-gum': {
      count: 0,
      isActive: false,
      filter: function (product) {
        return product.kind === 'Жевательная резинка';
      },
      outputNode: filtersSidebar.querySelector('#output-gum'),
    },
    'filter-marmalade': {
      count: 0,
      isActive: false,
      filter: function (product) {
        return product.kind === 'Мармелад';
      },
      outputNode: filtersSidebar.querySelector('#output-marmalade'),
    },
    'filter-marshmallows': {
      count: 0,
      isActive: false,
      filter: function (product) {
        return product.kind === 'Зефир';
      },
      outputNode: filtersSidebar.querySelector('#output-marshmallows'),
    },
    'filter-sugar-free': {
      count: 0,
      isActive: false,
      filter: function (product) {
        console.log(product);

        return product.nutritionFacts.sugar === false;
      },
      outputNode: filtersSidebar.querySelector('#output-sugar-free'),
    },
    'filter-vegetarian': {
      count: 0,
      isActive: false,
      filter: function (product) {
        return product.nutritionFacts.vegetarian;
      },
      outputNode: filtersSidebar.querySelector('#output-vegetarian'),
    },
    'filter-gluten-free': {
      count: 0,
      isActive: false,
      filter: function (product) {
        return product.nutritionFacts.gluten;
      },
      outputNode: filtersSidebar.querySelector('#output-gluten-free'),
    },
    'filter-availability': {
      count: 0,
      isActive: false,
      filter: function (product) {
        return product.amount > 0;
      },
      outputNode: filtersSidebar.querySelector('#output-availability'),
    },
    'filter-favorite': {
      count: 0,
      isActive: false,
      filter: function (product) {
        return product.isFavorite;
      },
      outputNode: filtersSidebar.querySelector('#output-favorite'),
    },
  };

  var wrapInParentheses = function (val) {
    return '(' + val + ')';
  };

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

  function updateCounters(products) {
    var productList = Object.values(products);

    productList.forEach(function (product) {
      switch (product.kind) {
        case 'Мороженое': {
          filters['filter-icecream'].count++;
          break;
        }
        case 'Газировка': {
          filters['filter-soda'].count++;
          break;
        }
        case 'Жевательная резинка': {
          filters['filter-gum'].count++;
          break;
        }
        case 'Мармелад': {
          filters['filter-marmalade'].count++;
          break;
        }
        case 'Зефир': {
          filters['filter-marshmallows'].count++;
          break;
        }
        default: {
          break;
        }
      }

      if (product.nutritionFacts.sugar === false) {
        filters['filter-sugar-free'].count++;
      }

      if (product.nutritionFacts.vegetarian) {
        filters['filter-vegetarian'].count++;
      }

      if (product.nutritionFacts.gluten) {
        filters['filter-gluten-free'].count++;
      }

      if (product.amount > 0) {
        filters['filter-availability'].count++;
      }
    });

    Object.keys(filters).forEach(function (key) {
      filters[key].outputNode.textContent = wrapInParentheses(filters[key].count);
    });

    outputPrice.textContent = wrapInParentheses(productList.length);
  }

  function renderSidebar(products) {
    updateCounters(products);
  }

  function onFilterClick(event) {
    var id = event.target.id;

    if (Object.keys(filters).includes(id)) {
      filters[id].isActive = event.target.checked;
    }
  }

  function getFilters() {
    return filters;
  }

  window.candyshop.filters = {
    renderSidebar: renderSidebar,
    byPrice: byPrice,
    onFilterClick: onFilterClick,
    getFilters: getFilters,
  };
})();
