'use strict';

var productNames = ['Чесночные сливки', 'Огуречный педант', 'Молочная хрюша', 'Грибной шейк', 'Баклажановое безумие', 'Паприколу итальяно', 'Нинзя-удар васаби', 'Хитрый баклажан', 'Горчичный вызов', 'Кедровая липучка', 'Корманный портвейн', 'Чилийский задира', 'Беконовый взрыв', 'Арахис vs виноград', 'Сельдерейная душа', 'Початок в бутылке', 'Чернющий мистер чеснок', 'Раша федераша', 'Кислая мина', 'Кукурузное утро', 'Икорный фуршет', 'Новогоднее настроение', 'С пивком потянет', 'Мисс креветка', 'Бесконечный взрыв', 'Невинные винные', 'Бельгийское пенное', 'Острый язычок'];
var cardImgs = ['img/cards/gum-cedar.jpg', 'img/cards/gum-chile.jpg', 'img/cards/gum-eggplant.jpg', 'img/cards/gum-mustard.jpg', 'img/cards/gum-portwine.jpg', 'img/cards/gum-wasabi.jpg', 'img/cards/ice-cucumber.jpg', 'img/cards/ice-cucumber.jpg', 'img/cards/ice-garlic.jpg', 'img/cards/ice-italian.jpg', 'img/cards/ice-mushroom.jpg', 'img/cards/ice-pig.jpg', 'img/cards/marmalade-beer.jpg', 'img/cards/marmalade-caviar.jpg', 'img/cards/marmalade-corn.jpg', 'img/cards/marmalade-new-year.jpg', 'img/cards/marmalade-sour.jpg', 'img/cards/marshmallow-bacon.jpg', 'img/cards/marshmallow-beer.jpg', 'img/cards/marshmallow-shrimp.jpg', 'img/cards/marshmallow-spicy.jpg', 'img/cards/marshmallow-wine.jpg', 'img/cards/soda-bacon.jpg', 'img/cards/soda-celery.jpg', 'img/cards/soda-cob.jpg', 'img/cards/soda-garlic.jpg', 'img/cards/soda-peanut-grapes.jpg', 'img/cards/soda-russian.jpg'];
var ingredients = ['молоко', 'сливки', 'вода', 'пищевой краситель', 'патока', 'ароматизатор бекона', 'ароматизатор свинца', 'ароматизатор дуба', 'идентичный натуральному', 'ароматизатор картофеля', 'лимонная кислота', 'загуститель', 'эмульгатор', 'консервант: сорбат калия', 'посолочная смесь: соль, нитрит натрия, ксилит', 'карбамид', 'вилларибо', 'виллабаджо'];

function getRandomBoolean() {
  return Math.random() > 0.5;
}

function getIngredients(arr) {
  var result = arr.filter(function filter() {
    return getRandomBoolean();
  });
  return result.join(', ');
}

function getAmount(max, min) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var cardsData = productNames.slice(0, 26).map(function (val) {
  return {
    name: val,
    picture: cardImgs [getAmount(0, cardImgs.length)],
    amount: getAmount(0, 20),
    price: getAmount(100, 1500),
    weight: getAmount(30, 300),
    rating: {value: getAmount(1, 5), number: getAmount(10, 900)},
    nutritionFacts: {sugar: getRandomBoolean(), energy: getAmount(70, 500), contents: getIngredients(ingredients)},
  };
});

document.querySelector('.catalog__cards').classList.remove('catalog__cards--load');
document.querySelector('.catalog__cards .catalog__load').classList.add('visually-hidden');

var cardClass = function (amount) {
  if (amount > 5) {
    return '.card--in-stock';
  } else if (amount >= 1 && amount <= 5) {
    return '.card--little';
  } else if (amount === 0) {
    return '.card--soon';
  }
};

var cardRating = function (val) {
  switch (val) {
    case 5: {
    return '.stars__rating--five'
    }
    case 4: {
    return '.stars__rating--four'
    } 
    case 3: {
    return '.stars__rating--three'
  } 
    case 2: {
    return '.stars__rating--two'
  } 
  case 1: {
    return '.stars__rating--one'
  }
  default: {
    return ''
  }
};

var cardSugarContent = function (sugar) {
  return sugar ? 'Содержит сахар. ' : 'Без сахара. ';
};

var cardContent = document.querySelector('#card').content;
var catalogNode = document.querySelector('.catalog__cards');

var renderCards = function (cardData, i) {

// article
var article = cardContent.querySelector('.catalog__card');
article.classList.remove('card--in-stock');
article.classList.add(cardClass(cardData.amount));
article.id = 'card_' + ++i;

// title
cardContent.querySelector('.card__title').textContent = cardData.name;

//product pic
var picture = cardContent.querySelector('.card__img');
picture.src = cardData.picture;
picture.alt = cardData.name;

//product price
var price = cardContent.querySelector('.card__price');
price.childNodes[0].textContent = cardData.price + ' ';
price.childNodes[2].textContent = '/ ' + cardData.weight + 'Г';

//product rating
var rating = cardContent.querySelector('.stars__rating');
rating.classList.remove('stars__rating--five');
rating.classList.add(cardRating(cardData.rating.value));
rating.textContent = 'Рейтинг: ' + cardData.rating.value + ' звёзд';

//product rating number
cardContent.querySelector('.star__count').textContent = '(' + cardData.rating.number + ')';

//product nutrition info
cardContent.querySelector('.card__characteristic').textContent = cardSugarContent(cardData.nutritionFacts.sugar) + cardData.nutritionFacts.energy + ' Ккал';

//product ingridients list
cardContent.querySelector('.card__composition-list').textContent = cardData.nutritionFacts.contents;

// render
catalogNode.appendChild(document.importNode(cardContent, true));
};

cardsData.forEach(renderCards);