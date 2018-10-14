'use strict';

(function () {
  var utils = window.candyshop.utils;

  // переключаем вкладки
  var switchTab = function (event) {
    var target = event.target;


    if (target.classList.contains('toggle-btn__label')) {
      target.parentNode.querySelectorAll('input').forEach(function (input) {
        document.querySelector('.' + input.id).classList.toggle('visually-hidden');
        document.querySelector('[for="' + input.id + '"]').classList.toggle('toggle-btn__label--active');
      });
    }

    var orderForm = document.querySelector('#form-order');
    var paymentFieldset = document.querySelector('.payment__card');
    var deliveryFieldset = document.querySelector('.deliver__entry-fields-wrap');

    if (target.getAttribute('for') === 'payment__cash') {
      orderForm.noValidate = true;
      utils.changeForm(paymentFieldset, true);
    } else if (target.getAttribute('for') === 'payment__card') {
      orderForm.noValidate = false;
      utils.changeForm(paymentFieldset, false);
    }

    if (target.getAttribute('for') === 'deliver__store') {
      orderForm.noValidate = true;
      utils.changeForm(deliveryFieldset, true);
    } else if (target.getAttribute('for') === 'deliver__courier') {
      orderForm.noValidate = false;
      utils.changeForm(deliveryFieldset, false);
    }
  };

  window.candyshop.tabs = {
    switchTab: switchTab,
  };
})();
