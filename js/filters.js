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

  function renderSidebar(products) {
    var wrapInParentheses = function (val) {
      return '(' + val + ')';
    };

    var filtersSidebar = document.querySelector('.catalog__sidebar');
    var outputPrice = filtersSidebar.querySelector('#output-price');

    var outputs = {
      icecream: {
        count: 0,
        node: filtersSidebar.querySelector('#output-icecream'),
      },
      soda: {
        count: 0,
        node: filtersSidebar.querySelector('#output-soda')
      },
      gum: {
        count: 0,
        node: filtersSidebar.querySelector('#output-gum'),
      },
      marmalade: {
        count: 0,
        node: filtersSidebar.querySelector('#output-marmalade'),
      },
      marshmallows: {
        count: 0,
        node: filtersSidebar.querySelector('#output-marshmallows'),
      },
      sugarFree: {
        count: 0,
        node: filtersSidebar.querySelector('#output-sugar-free')
      },
      vegetarian: {
        count: 0,
        node: filtersSidebar.querySelector('#output-vegetarian'),
      },
      glutenFree: {
        count: 0,
        node: filtersSidebar.querySelector('#output-gluten-free'),
      },
      availability: {
        count: 0,
        node: filtersSidebar.querySelector('#output-availability'),
      },
      favorite: {
        count: 0,
        node: filtersSidebar.querySelector('#output-favorite'),
      },
    };

    var productList = Object.values(products);

    productList.forEach(function (product) {
      switch (product.kind) {
        case 'Мороженое': {
          outputs.icecream.count++;
          break;
        }
        case 'Газировка': {
          outputs.soda.count++;
          break;
        }
        case 'Жевательная резинка': {
          outputs.gum.count++;
          break;
        }
        case 'Мармелад': {
          outputs.marmalade.count++;
          break;
        }
        case 'Зефир': {
          outputs.marshmallows.count++;
          break;
        }
        default: {
          break;
        }
      }

      if (product.nutritionFacts.sugar === false) {
        outputs.sugarFree.count++;
      }

      if (product.nutritionFacts.vegetarian) {
        outputs.vegetarian.count++;
      }

      if (product.nutritionFacts.gluten) {
        outputs.glutenFree.count++;
      }

      if (product.amount > 0) {
        outputs.availability.count++;
      }
    });

    Object.keys(outputs).forEach(function (key) {
      outputs[key].node.textContent = wrapInParentheses(outputs[key].count);
    });

    outputPrice.textContent = wrapInParentheses(productList.length);
  }

  window.candyshop.filters = {
    renderSidebar: renderSidebar,
    byPrice: byPrice,
  };
})();
