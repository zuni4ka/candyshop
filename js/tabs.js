'use strict';

(function () {
  // переключаем вкладки
  var switchTab = function (event) {
    var target = event.target;

    if (target.classList.contains('toggle-btn__label')) {
      target.parentNode.querySelectorAll('input').forEach(function (input) {
        document.querySelector('.' + input.id).classList.toggle('visually-hidden');
        document.querySelector('[for="' + input.id + '"]').classList.toggle('toggle-btn__label--active');
      });
    }

    var orderForm = document.getElementById('form-order');

    if (target.getAttribute('for') === 'payment__cash') {
      orderForm.noValidate = true;
    } else if (target.getAttribute('for') === 'payment__card') {
      orderForm.noValidate = false;
    }
  };

  window.candyshop.tabs = {
    switchTab: switchTab,
  };
})();
