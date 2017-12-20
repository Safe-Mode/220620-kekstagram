'use strict';

(function () {
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
    }

    return result;
  };

  window.initializeScale = function (target, input, operator, callback) {
    var resizeValue = getScaleValue(input, operator);
    callback(target, input, resizeValue);
  };
})();
