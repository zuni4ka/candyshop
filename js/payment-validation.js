'use strict';

(function () {
  var payment = document.querySelector('.payment');
  var paymentStatusValid = payment.querySelector('.payment__card-status--valid');
  var paymentStatusInvalid = payment.querySelector('.payment__card-status--invalid');
  var fieldCardNumber = payment.querySelector('#payment__card-number');
  var fieldCardExpiration = payment.querySelector('#payment__card-date');
  var fieldCardCVV = payment.querySelector('#payment__card-cvc');
  var fieldCardHolder = payment.querySelector('#payment__cardholder');

  var CARD_NUMBER_LENGTH = 16;

  // valid example: 4111111111111111
  var luhnCheck = function (value) {
    if (/[^0-9-\s]+/.test(value)) {
      return false;
    }

    var nCheck = 0;
    var nDigit = 0;
    var bEven = false;

    value = value.replace(/\D/g, '');

    for (var n = value.length - 1; n >= 0; n--) {
      var cDigit = value.charAt(n);
      nDigit = parseInt(cDigit, 10);

      if (bEven) {
        if ((nDigit *= 2) > 9) {
          nDigit -= 9;
        }
      }

      nCheck += nDigit;
      bEven = !bEven;
    }

    return (nCheck % 10) === 0;
  };

  var allInputsValid = function () {
    return (
      fieldCardNumber.validity.valid
      && fieldCardExpiration.validity.valid
      && fieldCardCVV.validity.valid
      && fieldCardHolder.validity.valid
    );
  };

  var updateStatus = function () {
    var hiddenClass = 'visually-hidden';

    if (allInputsValid()) {
      paymentStatusValid.classList.remove(hiddenClass);
      paymentStatusInvalid.classList.add(hiddenClass);
    } else {
      paymentStatusValid.classList.add(hiddenClass);
      paymentStatusInvalid.classList.remove(hiddenClass);
    }
  };

  var handleFieldCardNumber = function (event) {
    var target = event.target;

    if (
      luhnCheck(target.value)
      && target.value.length === CARD_NUMBER_LENGTH
    ) {
      target.setCustomValidity('');
    } else {
      target.setCustomValidity('Номер карты неверен');
    }

    updateStatus();
  };

  fieldCardNumber.addEventListener('input', handleFieldCardNumber);
  fieldCardExpiration.addEventListener('input', updateStatus);
  fieldCardCVV.addEventListener('input', updateStatus);
  fieldCardHolder.addEventListener('input', updateStatus);
}());
