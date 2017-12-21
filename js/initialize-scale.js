'use strict';

(function () {
<<<<<<< HEAD
=======
  var OPERATOR_DEC = 'dec';
  var OPERATOR_INC = 'inc';

>>>>>>> d0d593729d245639076f1c659f118004653d33f0
  var getScaleValue = function (input, operator) {
    var value = parseInt(input.value, window.util.RADIX_TEN);
    var step = parseInt(input.dataset.step, window.util.RADIX_TEN);
    var min = parseInt(input.dataset.min, window.util.RADIX_TEN);
    var max = parseInt(input.dataset.max, window.util.RADIX_TEN);

    if (value !== min || value !== max) {
      var result;

      if (operator === 'dec') {
        result = value - step;
      }

      if (operator === 'inc') {
        result = value + step;
      }

      if (result < min) {
        result = min;
      }

      if (result > max) {
        result = max;
      }
<<<<<<< HEAD
=======

      input.value = result + '%';
>>>>>>> d0d593729d245639076f1c659f118004653d33f0
    }

    return result;
  };

<<<<<<< HEAD
  window.initializeScale = function (target, input, operator, callback) {
    var resizeValue = getScaleValue(input, operator);
    callback(target, input, resizeValue);
=======
  window.initializeScale = function (controls, input, callback) {
    var onResizeClick = function (evt) {
      evt.preventDefault();

      var isDecOperator;
      var resizeValue;
      var scaleValue;

      evt.target.classList.forEach(function (item) {
        if (item.slice(-3) === 'dec') {
          isDecOperator = true;
        }
      });

      if (isDecOperator) {
        resizeValue = getScaleValue(input, OPERATOR_DEC);
        scaleValue = parseInt(resizeValue, window.util.RADIX_TEN) / window.util.PERCENT_FACTOR;

        callback(scaleValue);
      } else {
        resizeValue = getScaleValue(input, OPERATOR_INC);
        scaleValue = parseInt(resizeValue, window.util.RADIX_TEN) / window.util.PERCENT_FACTOR;

        callback(scaleValue);
      }
    };

    controls.addEventListener('click', onResizeClick);
>>>>>>> d0d593729d245639076f1c659f118004653d33f0
  };
})();
