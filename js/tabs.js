'use strict';

(function () {
  // переключаем вкладки
  var switchTab = function (event) {
    var target = event.target;

    if (target.classList.contains('toggle-btn__label')) {
      target.parentNode.querySelectorAll('input').forEach(function (input) {
        document.querySelector('.' + input.id).classList.toggle('visually-hidden');
      });
    }
  };

  window.candyshop.tabs = {
    switchTab: switchTab,
  };
})();
