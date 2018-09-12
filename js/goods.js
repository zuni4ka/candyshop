'use strict';

var productName = ['Чесночные сливки', 'Огуречный педант', 'Молочная хрюша', 'Грибной шейк', 'Баклажановое безумие', 'Паприколу итальяно', 'Нинзя-удар васаби', 'Хитрый баклажан', 'Горчичный вызов', 'Кедровая липучка', 'Корманный портвейн', 'Чилийский задира', 'Беконовый взрыв', 'Арахис vs виноград', 'Сельдерейная душа', 'Початок в бутылке', 'Чернющий мистер чеснок', 'Раша федераша', 'Кислая мина', 'Кукурузное утро', 'Икорный фуршет', 'Новогоднее настроение', 'С пивком потянет', 'Мисс креветка', 'Бесконечный взрыв', 'Невинные винные', 'Бельгийское пенное', 'Острый язычок'];
var cardImg = ['img/cards/gum-cedar.jpg', 'img/cards/gum-chile.jpg', 'img/cards/gum-eggplant.jpg', 'img/cards/gum-mustard.jpg', 'img/cards/gum-portwine.jpg', 'img/cards/gum-wasabi.jpg', 'img/cards/ice-cucumber.jpg', 'img/cards/ice-cucumber.jpg', 'img/cards/ice-garlic.jpg', 'img/cards/ice-italian.jpg', 'img/cards/ice-mushroom.jpg', 'img/cards/ice-pig.jpg', 'img/cards/marmalade-beer.jpg', 'img/cards/marmalade-caviar.jpg', 'img/cards/marmalade-corn.jpg', 'img/cards/marmalade-new-year.jpg', 'img/cards/marmalade-sour.jpg', 'img/cards/marshmallow-bacon.jpg', 'img/cards/marshmallow-beer.jpg', 'img/cards/marshmallow-shrimp.jpg', 'img/cards/marshmallow-spicy.jpg', 'img/cards/marshmallow-wine.jpg', 'img/cards/soda-bacon.jpg', 'img/cards/soda-celery.jpg', 'img/cards/soda-cob.jpg', 'img/cards/soda-garlic.jpg', 'img/cards/soda-peanut-grapes.jpg', 'img/cards/soda-russian.jpg'];
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

var cardsData = [productName.slice(0, 26).map(function (val) {
  return {
    name: val,
    picture: cardImg [getAmount(0, cardImg.length)],
    amount: getAmount(0, 20),
    price: getAmount(100, 1500),
    weight: getAmount(30, 300),
    rating: {value: getAmount(1, 5), number: getAmount(10, 900)},
    nutritionFacts: {sugar: getRandomBoolean(), energy: getAmount(70, 500), contents: getIngredients(ingredients)},
  };
})];

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
    default: {
    return '.stars__rating--one'
  }
};

var cardSugarContent = function (sugar) {
  return sugar
    ? 'Содержит сахар.'
    : 'Без сахара.';
};


/*
var cardsTemplate = cardsData.map(function(card, i){
  return `<article id = "${"card_"+i}" class="catalog__card card ${cardClass(card.amount)}">
        <header class="card__header">
          <h3 class="card__title">${card.name}</h3>
          <img class="card__img" src="${card.picture}" alt="${card.name}" width="265" height="264">
          <span class="card__price">${card.price} <span class="card__currency">₽</span><span class="card__weight">/ ${card.weight} Г</span></span>
        </header>
        <div class="card__main">
          <div class="card__rating">
            <button class="card__btn-composition" type="button">Состав</button>
            <div class="card__stars stars">
              <span class="stars__rating ${cardRating(card.rating.value)}">Рейтинг: ${card.rating.value} звёзд</span>
              <span class="star__count">(${card.rating.number})</span>
            </div>
          </div>
          <div class="card__composition card__composition--hidden">
            <p class="card__characteristic">${cardSugarContent(card.nutritionFacts.sugar)} ${card.nutritionFacts.energy} Ккал</p>
            <p class="card__composition-list">${card.nutritionFacts.contents}</p>
          </div>
          <p class="card__btns-wrap">
            <a class="card__btn-favorite" href="#">Добавить в избранное</a>
            <a class="card__btn" href="#">Добавить +1</a>
          </p>
        </div>
      </article>`}).join(' ');

  document.querySelector('.catalog__cards').innerHTML = cardsTemplate;
  */
