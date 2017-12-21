'use strict';

(function () {
  window.initializeFilters = function (effectContainer, callback) {
    var onEffectRadioClick = function (evt) {
      if (evt.target.name === 'effect') {
        var effect = evt.target.value;
        callback(effect);
      }
    };

    effectContainer.addEventListener('click', onEffectRadioClick);
  };
})();
