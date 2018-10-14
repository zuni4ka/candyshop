'use strict';

(function () {
  var candyshop = window.candyshop;

  var backend = candyshop.backend;
  var utils = candyshop.utils;
  var tabs = candyshop.tabs;
  var filters = candyshop.filters;
  var sorters = candyshop.sorters;
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
  var products = {};

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

  // заплатка не найденных продуктов
  var catalogEmpty = utils.getElementCopy('#empty-filters', '.catalog__empty-filter');

  // заплатка пустой корзины
  var cartPlaceholder = cart.querySelector('.goods__card-empty');

  var headerCart = document.querySelector('.main-header__basket');

  var headerCartTextEmpty = headerCart.innerHTML;

  var payment = document.querySelector('.payment');

  var delivery = document.querySelector('.deliver');

  var orderForm = document.querySelector('#form-order');

  var sidebar = document.querySelector('.catalog__sidebar');

  var showAll = document.querySelector('.catalog__submit');

  var priceSlider = document.querySelector('.range');

  var minPrice;
  var maxPrice = 0;

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

    if (cardData.isFavorite) {
      card.querySelector('.card__btn-favorite').classList.add('card__btn-favorite--selected');
    }

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

    cardItem.id = cardData.id;

    cardItem.querySelector('.card-order__title').textContent = cardData.name;

    var picture = cardItem.querySelector('.card-order__img');
    picture.src = 'img/cards/' + cardData.picture;
    picture.alt = cardData.name;

    var price = cardItem.querySelector('.card-order__price');
    price.textContent = cardData.price + ' ₽';

    cardItem.querySelector('.card-order__count').value = cardData.orderedAmount;

    cardsOrderTemplate.appendChild(cardItem);
  };

  var renderProducts = function () {
    var productsList = Object.values(sorters.apply(filters.apply(products)));

    // чистим каталог
    catalogCards.innerHTML = '';

    if (productsList.length) {
      catalogEmpty.classList.add('visually-hidden');

      // наполняем темплейт картами продуктов
      productsList.forEach(fillProductItem);

      // вставляем темплейт в корневой элмент каталога
      catalogCards.appendChild(cardsTemplate);
    } else {
      catalogCards.appendChild(catalogEmpty);
      catalogEmpty.classList.remove('visually-hidden');
    }

    renderCart();
  };

  // меняет фаворит класс
  var onToggleFavorite = function (event) {
    event.preventDefault();
    var target = event.target;


    if (target.classList.contains('card__btn-favorite')) {
      var id = target.closest('.catalog__card').id;

      products[id].isFavorite = !products[id].isFavorite;

      renderProducts();
    }
  };

  var getCartItemsAmount = function () {
    var amount = 0;

    Object.values(cartData).forEach(function (cartItem) {
      amount += cartItem.orderedAmount;
    });

    return amount;
  };

  var updateHeaderCart = function () {
    var amount = getCartItemsAmount();

    if (amount) {
      headerCart.innerHTML = 'Продуктов в корзине: ' + amount;
    } else {
      headerCart.innerHTML = headerCartTextEmpty;
    }
  };

  var renderCart = function () {
    cart.innerHTML = '';

    var cartList = Object.values(cartData);

    if (cartList.length) {
      cartList.forEach(fillCartItem);
      cart.appendChild(cardsOrderTemplate);
    } else {
      cart.appendChild(cartPlaceholder);
    }

    utils.changeForm(orderForm, !cartList.length, true);

    updateHeaderCart();
  };

  // добавляет продукт в корзину
  var addToCart = function (id) {
    // существует ли продукт в коризне?
    // если да, то сохраняем
    var cartItem = cartData[id];
    var itemData = products[id];

    if (itemData.amount === 0) {
      return;
    }

    // уменьшаем количество элементов в продуктах
    itemData.amount--;

    if (cartItem) {
      cartItem.orderedAmount++;
    } else {
      cartData[id] = createCartItem(id, itemData);
    }

    renderProducts();
  };

  // удяляет продукт из корзины
  var removeFromCart = function (id) {
    var cartItem = cartData[id];
    var itemData = products[id];

    // уменьшаем количество элементов в карте
    cartItem.orderedAmount--;
    itemData.amount++;

    if (cartItem.orderedAmount === 0) {
      delete cartData[id];
    }

    renderProducts();
  };

  // удяляет продукт из корзины
  var removeAllFromCart = function (id) {
    var cartItem = cartData[id];
    var itemData = products[id];

    itemData.amount += cartItem.orderedAmount;

    delete cartData[id];

    renderProducts();
  };

  // добавляет продукт в корзину
  var onProductAdd = function (event) {
    event.preventDefault();
    var target = event.target;

    if (target.classList.contains('card__btn')) {
      var card = target.closest('.catalog__card');

      addToCart(card.id);
    }
  };

  var onCartProductAdd = function (event) {
    event.preventDefault();
    var target = event.target;

    if (target.classList.contains('card-order__btn--increase')) {
      var card = target.closest('.goods_card');

      addToCart(card.id);
    }
  };

  var onProductRemove = function (event) {
    event.preventDefault();
    var target = event.target;

    if (target.classList.contains('card-order__btn--decrease')) {
      var card = target.closest('.goods_card');

      removeFromCart(card.id);
    }
  };

  var onProductRemoveAll = function (event) {
    event.preventDefault();
    var target = event.target;

    if (target.classList.contains('card-order__close')) {
      var card = target.closest('.goods_card');

      removeAllFromCart(card.id);
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
    filters.updatePriceFilter(result.min, result.max);

    renderProducts();
  };

  var onFilterClick = function (event) {
    var target = event.target;

    var id = target.id;

    if (!id) {
      return;
    }

    if (Object.keys(filters.getFiltrarium()).includes(id)) {
      filters.toggleFilter(id, target.checked);
      renderProducts();
    }
  };

  var onSorterClick = function (event) {
    var target = event.target;

    var id = target.id;

    if (!id) {
      return;
    }

    if (Object.keys(sorters.getSorterium()).includes(id)) {
      sorters.pickSorter(id);
      renderProducts();
    }
  };

  var onReset = function (event) {
    event.preventDefault();

    filters.reset(products, minPrice, maxPrice);

    document.querySelector('#sidebar-form').reset();

    slider.reset(priceSlider, minPrice, maxPrice);

    renderProducts();
  };

  var onDataLoad = function (data) {
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

      products[id] = item;
    });

    // инициализируем компоненты
    slider.init(priceSlider, minPrice, maxPrice, onPriceChange);
    filters.init(products, minPrice, maxPrice);

    renderProducts();
  };

  backend.load(onDataLoad, modal.callError);

  // регистрируем слушатели
  catalogCards.addEventListener('click', onToggleFavorite);
  catalogCards.addEventListener('click', onProductAdd);
  cart.addEventListener('click', onCartProductAdd);
  cart.addEventListener('click', onProductRemove);
  cart.addEventListener('click', onProductRemoveAll);
  showAll.addEventListener('click', onReset);
  orderForm.addEventListener('submit', onOrderSubmit);
  payment.addEventListener('click', tabs.switchTab);
  delivery.addEventListener('click', tabs.switchTab);
  sidebar.addEventListener('click', onFilterClick);
  sidebar.addEventListener('click', onSorterClick);
})();
