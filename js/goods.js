'use strict';

(function () {
  var candyshop = window.candyshop;

  var backend = candyshop.backend;
  var utils = candyshop.utils;
  var tabs = candyshop.tabs;
  var filters = candyshop.filters;
  var slider = candyshop.slider;
  var modal = candyshop.modal;

  // возвращает класс соответствующий количеству единиц продукта
  var getAmountClass = function (amount) {
    if (amount > 5) {
      return 'card--in-stock';
    } else if (amount >= 1 && amount <= 5) {
      return 'card--little';
    } else if (amount === 0) {
      return 'card--soon';
    }
    return '';
  };

  // возвращает класс соответствующий рейтингу продукта
  var ratingValToClass = {
    5: 'stars__rating--five',
    4: 'stars__rating--four',
    3: 'stars__rating--three',
    2: 'stars__rating--two',
    1: 'stars__rating--one',
  };

  var getSugarContent = function (sugar) {
    return sugar ? 'Содержит сахар. ' : 'Без сахара. ';
  };

  // продукты при получении
  var initialProducts = {};

  // текущие продукты
  var products = initialProducts;

  // карта продуктов в корзине
  var cartData = {};

  // контейнер с продуктами
  var cardsTemplate = document.createDocumentFragment();

  // контейнер корзины
  var cardsOrderTemplate = document.createDocumentFragment();

  // корневой элемент каталога
  var catalogCards = document.querySelector('.catalog__cards');

  // корзина
  var cart = document.querySelector('.goods__cards');

  // заплатка пустых продуктов
  var catalogLoad = catalogCards.querySelector('.catalog__load');

  // заплатка пустой корзины
  var cartPlaceholder = cart.querySelector('.goods__card-empty');

  var headerCart = document.querySelector('.main-header__basket');

  var headerCartTextEmpty = headerCart.innerHTML;

  var payment = document.querySelector('.payment');

  var delivery = document.querySelector('.deliver');

  var orderForm = document.querySelector('#form-order');

  catalogCards.classList.remove('catalog__cards--load');

  // наполняет темплейт продуктовой картой
  var fillProductItem = function (cardData) {
    var card = utils.getElementCopy('#card', '.catalog__card');

    card.classList.remove('card--in-stock');
    card.classList.add(getAmountClass(cardData.amount));
    card.id = cardData.id;

    card.querySelector('.card__title').textContent = cardData.name;

    var picture = card.querySelector('.card__img');
    picture.src = 'img/cards/' + cardData.picture;
    picture.alt = cardData.name;

    var price = card.querySelector('.card__price');
    price.childNodes[0].textContent = cardData.price + ' ';
    price.childNodes[2].textContent = '/ ' + cardData.weight + 'Г';

    var rating = card.querySelector('.stars__rating');
    rating.classList.remove('stars__rating--five');
    rating.classList.add(ratingValToClass[cardData.rating.value]);
    rating.textContent = 'Рейтинг: ' + cardData.rating.value + ' звёзд';

    card.querySelector('.star__count').textContent = '(' + cardData.rating.number + ')';

    card.querySelector('.card__characteristic').textContent = getSugarContent(cardData.nutritionFacts.sugar) + cardData.nutritionFacts.energy + ' Ккал';

    card.querySelector('.card__composition-list').textContent = cardData.nutritionFacts.contents;

    cardsTemplate.appendChild(card);
  };

  // возвращает скопированный объект продукта как объект корзины
  var createCartItem = function (id, cardData) {
    var cartItem = Object.assign({}, cardData, {
      id: id,
      orderedAmount: 1,
    });
    delete cartItem.amount;

    return cartItem;
  };

  // наполняет темплейт корзины продуктами
  var fillCartItem = function (cardData) {
    var cardItem = utils.getElementCopy('#card-order', '.card-order');

    cardItem.querySelector('.card-order__title').textContent = cardData.name;

    var picture = cardItem.querySelector('.card-order__img');
    picture.src = 'img/cards/' + cardData.picture;
    picture.alt = cardData.name;

    var price = cardItem.querySelector('.card-order__price');
    price.textContent = cardData.price + ' ₽';

    cardItem.querySelector('.card-order__count').value = cardData.orderedAmount;

    cardsOrderTemplate.appendChild(cardItem);
  };

  var renderProducts = function (prodData) {
    var productsList = Object.values(prodData);

    if (productsList.length) {
      // наполняем темплейт картами продуктов
      productsList.forEach(fillProductItem);

      // чистим каталог
      catalogCards.innerHTML = '';

      // вставляем темплейт в корневой элмент каталога
      catalogCards.appendChild(cardsTemplate);
    } else {
      // вставляем заплатку
      catalogCards.appendChild(catalogLoad);
    }
  };

  // меняет фаворит класс
  var onToggleFavorite = function (event) {
    event.preventDefault();
    var target = event.target;

    if (target.classList.contains('card__btn-favorite')) {
      target.classList.toggle('card__btn-favorite--selected');
    }
  };

  var getCartItemsAmount = function () {
    var amount = 0;

    Object.values(cartData).forEach(function (cartItem) {
      amount += cartItem.orderedAmount;
    });

    return amount;
  };

  var updateHeaderCart = function (amount) {
    if (amount) {
      headerCart.innerHTML = 'Продуктов в корзине: ' + amount;
    } else {
      headerCart.innerHTML = headerCartTextEmpty;
    }
  };

  var renderCart = function () {
    var cartList = Object.values(cartData);

    if (cartList.length) {
      cartList.forEach(fillCartItem);

      cart.innerHTML = '';

      cart.appendChild(cardsOrderTemplate);
    } else {
      cart.appendChild(cartPlaceholder);
    }
  };

  // добавляет продукт в корзину
  var addToCart = function (id) {
    // существует ли продукт в коризне?
    // если да, то сохраняем
    var cartItem = cartData[id];
    var itemData = initialProducts[id];

    // уменьшаем количество элементов в продуктах
    itemData.amount--;

    if (cartItem) {
      cartItem.orderedAmount++;
    } else {
      cartData[id] = createCartItem(id, itemData);
    }

    renderProducts(initialProducts);
    renderCart();
    updateHeaderCart(getCartItemsAmount());
  };

  // добавляет продукт в корзину
  var onAddToCart = function (event) {
    event.preventDefault();
    var target = event.target;

    if (target.classList.contains('card__btn')) {
      var card = target.closest('.catalog__card');

      addToCart(card.id);
    }
  };

  var onOrderSuccess = function () {
    modal.callSuccess();
  };

  var onOrderFail = function (error) {
    modal.callError(error);
  };

  var onOrderSubmit = function (event) {
    backend.save(new FormData(orderForm), onOrderSuccess, onOrderFail);
    event.preventDefault();
  };

  // реагируем на изменение цены
  var onPriceChange = function (result) {
    products = filters.byPrice(initialProducts, result.min, result.max);

    renderProducts(products);
    filters.renderSidebar(products);
  };

  var onDataLoad = function (data) {
    var minPrice;
    var maxPrice = 0;

    data.forEach(function (item, i) {
      var id = 'product_' + i;
      var price = item.price;

      if (i === 0) {
        minPrice = price;
      } else if (price < minPrice) {
        minPrice = price;
      }

      if (price > maxPrice) {
        maxPrice = price;
      }

      item.id = id;

      initialProducts[id] = item;
    });

    // инициализируем компоненты
    slider.init(document.querySelector('.range'), minPrice, maxPrice, onPriceChange);

    renderProducts(initialProducts);
    filters.renderSidebar(initialProducts);
  };

  backend.load(onDataLoad, modal.callErrorModal);

  // регистрируем слушатели
  catalogCards.addEventListener('click', onToggleFavorite);
  catalogCards.addEventListener('click', onAddToCart);
  orderForm.addEventListener('submit', onOrderSubmit);
  payment.addEventListener('click', tabs.switchTab);
  delivery.addEventListener('click', tabs.switchTab);
})();
