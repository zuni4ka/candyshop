'use strict';

(function () {
  var changeForm = function (form, disabled, root) {
    var labels = form.getElementsByTagName('label');
    var inputs = form.getElementsByTagName('input');
    var textareas = form.getElementsByTagName('textarea');
    var selects = form.getElementsByTagName('select');

    disableElements(inputs);
    disableElements(textareas);
    disableElements(selects);
    disableElements(labels);

    function disableElements(elements) {
      Array.from(elements).forEach(function (element) {
        element.disabled = disabled;

        if (disabled) {
          element.classList.add('disabled');
        } else {
          element.classList.remove('disabled');
        }
      });
    }

    if (root) {
      document.querySelector('.buy__submit-btn').disabled = disabled;
    }

  };

  // возвращает копию элемента найденного в темплейте
  var getElementCopy = function (template, element) {
    return document.importNode(document.querySelector(template).content.querySelector(element), true);
  };

  window.candyshop.utils = {
    changeForm: changeForm,
    getElementCopy: getElementCopy,
  };
})();
