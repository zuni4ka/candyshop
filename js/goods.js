'use strict';

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
var getRatingClass = function (val) {
  switch (val) {
    case 5: {
      return 'stars__rating--five';
    }
    case 4: {
      return 'stars__rating--four';
    }
    case 3: {
      return 'stars__rating--three';
    }
    case 2: {
      return 'stars__rating--two';
    }
    case 1: {
      return 'stars__rating--one';
    }
    default: {
      return '';
    }
  }
};

var getSugarContent = function (sugar) {
  return sugar ? 'Содержит сахар. ' : 'Без сахара. ';
};

var productNames = ['Чесночные сливки', 'Огуречный педант', 'Молочная хрюша', 'Грибной шейк', 'Баклажановое безумие', 'Паприколу итальяно', 'Нинзя-удар васаби', 'Хитрый баклажан', 'Горчичный вызов', 'Кедровая липучка', 'Корманный портвейн', 'Чилийский задира', 'Беконовый взрыв', 'Арахис vs виноград', 'Сельдерейная душа', 'Початок в бутылке', 'Чернющий мистер чеснок', 'Раша федераша', 'Кислая мина', 'Кукурузное утро', 'Икорный фуршет', 'Новогоднее настроение', 'С пивком потянет', 'Мисс креветка', 'Бесконечный взрыв', 'Невинные винные', 'Бельгийское пенное', 'Острый язычок'];

var productImages = ['img/cards/gum-cedar.jpg', 'img/cards/gum-chile.jpg', 'img/cards/gum-eggplant.jpg', 'img/cards/gum-mustard.jpg', 'img/cards/gum-portwine.jpg', 'img/cards/gum-wasabi.jpg', 'img/cards/ice-cucumber.jpg', 'img/cards/ice-cucumber.jpg', 'img/cards/ice-garlic.jpg', 'img/cards/ice-italian.jpg', 'img/cards/ice-mushroom.jpg', 'img/cards/ice-pig.jpg', 'img/cards/marmalade-beer.jpg', 'img/cards/marmalade-caviar.jpg', 'img/cards/marmalade-corn.jpg', 'img/cards/marmalade-new-year.jpg', 'img/cards/marmalade-sour.jpg', 'img/cards/marshmallow-bacon.jpg', 'img/cards/marshmallow-beer.jpg', 'img/cards/marshmallow-shrimp.jpg', 'img/cards/marshmallow-spicy.jpg', 'img/cards/marshmallow-wine.jpg', 'img/cards/soda-bacon.jpg', 'img/cards/soda-celery.jpg', 'img/cards/soda-cob.jpg', 'img/cards/soda-garlic.jpg', 'img/cards/soda-peanut-grapes.jpg', 'img/cards/soda-russian.jpg'];

var ingredients = ['молоко', 'сливки', 'вода', 'пищевой краситель', 'патока', 'ароматизатор бекона', 'ароматизатор свинца', 'ароматизатор дуба', 'идентичный натуральному', 'ароматизатор картофеля', 'лимонная кислота', 'загуститель', 'эмульгатор', 'консервант: сорбат калия', 'посолочная смесь: соль, нитрит натрия, ксилит', 'карбамид', 'вилларибо', 'виллабаджо'];

// карта продуктов
var productsData = {};

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

// заплатка пустой корзины
// var cartPlaceholder = cart.querySelector('.goods__card-empty');

// наполнение карты продуктов
productNames.slice(0, 26).forEach(function (val, i) {
  var id = 'product_' + i;

  productsData[id] = {
    id: id,
    name: val,
    picture: productImages [getRandomFromRange(0, productImages.length)],
    amount: getRandomFromRange(0, 20),
    price: getRandomFromRange(100, 1500),
    weight: getRandomFromRange(30, 300),
    rating: {value: getRandomFromRange(1, 5), number: getRandomFromRange(10, 900)},
    nutritionFacts: {
      sugar: getRandomBoolean(),
      energy: getRandomFromRange(70, 500),
      contents: getRandomStringFromArray(ingredients),
    },
  };
});

catalogCards.classList.remove('catalog__cards--load');
catalogCards.querySelector('.catalog__load').classList.add('visually-hidden');

// наполняет темплейт продуктовой картой
var fillProductItem = function (cardData) {
  var card = getElementCopy('#card', '.catalog__card');

  card.classList.remove('card--in-stock');
  card.classList.add(getAmountClass(cardData.amount));
  card.id = cardData.id;

  card.querySelector('.card__title').textContent = cardData.name;

  var picture = card.querySelector('.card__img');
  picture.src = cardData.picture;
  picture.alt = cardData.name;

  var price = card.querySelector('.card__price');
  price.childNodes[0].textContent = cardData.price + ' ';
  price.childNodes[2].textContent = '/ ' + cardData.weight + 'Г';

  var rating = card.querySelector('.stars__rating');
  rating.classList.remove('stars__rating--five');
  rating.classList.add(getRatingClass(cardData.rating.value));
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
  var cardItem = getElementCopy('#card-order', '.card-order');

  cardItem.querySelector('.card-order__title').textContent = cardData.name;

  var picture = cardItem.querySelector('.card-order__img');
  picture.src = cardData.picture;
  picture.alt = cardData.name;

  var price = cardItem.querySelector('.card-order__price');
  price.textContent = cardData.price + ' ₽';

  cardItem.querySelector('.card-order__count').value = cardData.orderedAmount;

  cardsOrderTemplate.appendChild(cardItem);
};

var renderProducts = function () {
  // наполняем темплейт картами продуктов
  Object.values(productsData).forEach(fillProductItem);

  // вставляем темплейт в корневой элмент каталога
  catalogCards.appendChild(cardsTemplate);
};

// меняет фаворит класс
var onToggleFavorite = function (event) {
  event.preventDefault();
  var target = event.target;

  if (target.classList.contains('card__btn-favorite')) {
    target.classList.toggle('card__btn-favorite--selected');
  }
};

var renderCart = function () {
  cart.innerHTML = '';

  Object.values(cartData).forEach(fillCartItem);

  cart.appendChild(cardsOrderTemplate);
};

// добавляет продукт в корзину
var addToCart = function (id) {
  // существует ли продукт в коризне?
  // если да, то сохраняем
  var cartItem = cartData[id];

  if (cartItem) {
    cartItem.orderedAmount++;
  } else {
    var itemData = productsData[id];
    var cartItemData = createCartItem(id, itemData);

    cartData[id] = cartItemData;
  }

  renderCart();
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

// регистрируем слушатели
catalogCards.addEventListener('click', onToggleFavorite);
catalogCards.addEventListener('click', onAddToCart);

renderProducts();
