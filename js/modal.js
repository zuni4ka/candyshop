'use strict';

(function () {
  var KEY_ESCAPE = 27;
  var successModal = document.querySelector('.modal--success');
  var errorModal = document.querySelector('.modal--error');

  var hideModal = function (modal) {
    modal.classList.add('modal--hidden');
  };

  var handleClose = function (event) {
    var target = event.target;

    if (target.classList.contains('modal__close')) {
      var modal = target.closest('.modal');
      hideModal(modal);

      modal.removeEventListener('click', handleClose);
    }
  };

  var handleEscape = function (event, modal) {
    if (event.keyCode === KEY_ESCAPE) {
      hideModal(modal);
    }
  };

  var handleErrorEscape = function (event) {
    handleEscape(event, errorModal);
    window.removeEventListener('keydown', handleErrorEscape);
  };

  var handleSuccessEscape = function (event) {
    handleEscape(event, successModal);
    window.removeEventListener('keydown', handleSuccessEscape);
  };

  var callError = function (error) {
    errorModal.querySelector('.modal__message').textContent = error;
    errorModal.classList.remove('modal--hidden');

    window.addEventListener('keydown', handleErrorEscape);
    errorModal.addEventListener('click', handleClose);
  };

  var callSuccess = function () {
    successModal.classList.remove('modal--hidden');

    window.addEventListener('keydown', handleSuccessEscape);
    successModal.addEventListener('click', handleClose);
  };

  window.candyshop.modal = {
    callError: callError,
    callSuccess: callSuccess,
  };
})();
