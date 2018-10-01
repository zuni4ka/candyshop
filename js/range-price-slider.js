'use strict';

function recalculate(rangeValue, rangeMax, max) {
  return parseInt(rangeValue * max / rangeMax, 10);
}

(function () {
  var init = function (rangeElement, min, max, callback) {
    var rangeFilter = rangeElement.querySelector('.range__filter');
    var btnRight = rangeElement.querySelector('.range__btn--right');
    var btnLeft = rangeElement.querySelector('.range__btn--left');
    var fillLine = rangeElement.querySelector('.range__fill-line');
    var priceMax = rangeElement.querySelector('.range__price--max');
    var priceMin = rangeElement.querySelector('.range__price--min');

    priceMin.textContent = min;
    priceMax.textContent = max;

    var result = {
      min: min,
      max: max,
    };

    var onMouseDown = function (mouseDownEvent) {

      mouseDownEvent.preventDefault();
      var element = mouseDownEvent.target;

      if (element !== btnRight || element !== btnLeft) {
        element = element.closest('button');
      }

      var clientX = mouseDownEvent.clientX;

      var rangeMax = rangeFilter.offsetWidth;

      var onMouseMove = function (mouseMoveEvent) {

        mouseMoveEvent.preventDefault();

        var shift = clientX - mouseMoveEvent.clientX;

        clientX = mouseMoveEvent.clientX;

        var leftEdgeNext = element.offsetLeft - shift;

        var rightEdge = rangeMax - element.offsetWidth;

        if (leftEdgeNext < 0) {
          leftEdgeNext = 0;
        } else if (leftEdgeNext > rightEdge) {
          leftEdgeNext = rightEdge;
        }

        element.style.left = leftEdgeNext + 'px';

        if (element === btnLeft) {
          fillLine.style.left = leftEdgeNext + 'px';

          var updateMin = function (leftEdge) {
            var value = recalculate(leftEdge, rangeMax, max);

            priceMin.textContent = value;
            result.min = value;
          };

          if (btnRight.offsetLeft < leftEdgeNext) {
            leftEdgeNext = btnRight.offsetLeft;
            element.style.left = leftEdgeNext + 'px';

            updateMin(leftEdgeNext);

            return;
          }

          updateMin(leftEdgeNext);
        }

        if (element === btnRight) {
          leftEdgeNext += btnRight.offsetWidth;

          fillLine.style.right = (rangeFilter.offsetWidth - leftEdgeNext) + 'px';

          var updateMax = function (leftEdge) {
            var value = recalculate(leftEdge, rangeMax, max);
            priceMax.textContent = value;
            result.max = value;
          };

          if (btnLeft.offsetLeft > leftEdgeNext) {
            leftEdgeNext = btnLeft.offsetLeft;

            element.style.left = leftEdgeNext + 'px';

            updateMax(leftEdgeNext);

            return;
          }

          updateMax(leftEdgeNext);
        }
      };

      var onMouseUp = function (mouseUpEvent) {
        mouseUpEvent.preventDefault();

        callback(result);

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    btnLeft.addEventListener('mousedown', onMouseDown);
    btnRight.addEventListener('mousedown', onMouseDown);
  };

  window.candyshop.slider = {
    init: init,
  };
})();
