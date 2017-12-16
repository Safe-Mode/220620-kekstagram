'use strict';

(function () {
  window.util = {
    ESC_KEYCODE: 27,
    ENTER_KEYCODE: 13,

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
    }
  };
})();
