'use strict';

(function () {
  var OPERATOR_DEC = 'dec';
  var OPERATOR_INC = 'inc';

  window.initializeScale = function (controls, callback) {
    var onResizeClick = function (evt) {
      evt.preventDefault();

      var isDecOperator;

      evt.target.classList.forEach(function (item) {
        if (item.slice(-3) === 'dec') {
          isDecOperator = true;
        }
      });

      if (isDecOperator) {
        callback(OPERATOR_DEC, window.util.PERCENT_FACTOR, window.util.RADIX_TEN);
      } else {
        callback(OPERATOR_INC, window.util.PERCENT_FACTOR, window.util.RADIX_TEN);
      }
    };

    controls.addEventListener('click', onResizeClick);
  };
})();
