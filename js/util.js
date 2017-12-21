'use strict';

(function () {
  window.util = {
    ESC_KEYCODE: 27,
    ENTER_KEYCODE: 13,
    RADIX_TEN: 10,
    PERCENT_FACTOR: 100,

    getRandomInt: function (min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },

    toggleOverlay: function (overlay, escHandler) {
      if (overlay.classList.contains('hidden')) {
        overlay.classList.remove('hidden');
        document.addEventListener('keydown', escHandler);
      } else {
        overlay.classList.add('hidden');
        document.removeEventListener('keydown', escHandler);
      }
    },

    onXHRError: function (errorMessage) {
      var node = document.createElement('div');

      node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
      node.style.position = 'absolute';
      node.style.left = 0;
      node.style.right = 0;
      node.style.fontSize = '30px';
      node.textContent = errorMessage;

      document.body.insertAdjacentElement('afterbegin', node);
    }
  };
})();
