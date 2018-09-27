'use strict';

(function () {
  var range = document.querySelector('.range');
  var rangeFilter = document.querySelector('.range__filter');
  var btnRight = range.querySelector('.range__btn--right');
  var btnLeft = range.querySelector('.range__btn--left');
  var fillLine = range.querySelector('.range__fill-line');
  var priceMax = range.querySelector('.range__price--max');
  var priceMin = range.querySelector('.range__price--min');

  var onMouseDown = function (mouseDownEvent) {
    mouseDownEvent.preventDefault();
    var element = mouseDownEvent.target;

    var clientX = mouseDownEvent.clientX;

    var onMouseMove = function (mouseMoveEvent) {
      mouseMoveEvent.preventDefault();

      var shift = clientX - mouseMoveEvent.clientX;

      clientX = mouseMoveEvent.clientX;

      var leftEdgeNext = element.offsetLeft - shift;
      var rightEdge = rangeFilter.offsetWidth - element.offsetWidth;

      if (leftEdgeNext < 0) {
        leftEdgeNext = 0;
      } else if (leftEdgeNext > rightEdge) {
        leftEdgeNext = rightEdge;
      }

      element.style.left = leftEdgeNext + 'px';

      if (element === btnLeft) {
        fillLine.style.left = leftEdgeNext + 'px';

        if (btnRight.offsetLeft < leftEdgeNext) {
          leftEdgeNext = btnRight.offsetLeft;
          element.style.left = leftEdgeNext + 'px';
          priceMin.textContent = leftEdgeNext;

          return;
        }

        priceMin.textContent = leftEdgeNext;
      }

      if (element === btnRight) {
        fillLine.style.right = (rangeFilter.offsetWidth - leftEdgeNext) + 'px';

        if (btnLeft.offsetLeft > leftEdgeNext) {
          leftEdgeNext = btnLeft.offsetLeft;
          element.style.left = leftEdgeNext + 'px';
          priceMax.textContent = leftEdgeNext;

          return;
        }

        priceMax.textContent = leftEdgeNext;
      }
    };

    var onMouseUp = function (mouseUpEvent) {
      mouseUpEvent.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  btnLeft.addEventListener('mousedown', onMouseDown);
  btnRight.addEventListener('mousedown', onMouseDown);
})();
