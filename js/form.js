'use strict';

(function () {
  var EFFECTS = [
    'chrome',
    'sepia',
    'marvin',
    'phobos',
    'heat'
  ];
  var RADIX_TEN = 10;
  var OPERATOR_DEC = 'dec';
  var OPERATOR_INC = 'inc';
  var PERCENT_FACTOR = 100;
  var HASHTAG_SYMBOL = '#';
  var HASHTAG_COUNT = 5;
  var HASHTAG_LENGTH = 20;

  var uploadFormElement = document.querySelector('#upload-select-image');
  var uploadFileElement = uploadFormElement.querySelector('#upload-file');
  var uploadOverlayElement = uploadFormElement.querySelector('.upload-overlay');
  var uploadCloseElement = uploadFormElement.querySelector('.upload-form-cancel');
  var uploadCommentElement = uploadFormElement.querySelector('.upload-form-description');
  var uploadEffectsContainerElement = uploadFormElement.querySelector('.upload-effect-controls');
  var uploadResizeValueElement = uploadFormElement.querySelector('.upload-resize-controls-value');
  var uploadRezizeIncElement = uploadFormElement.querySelector('.upload-resize-controls-button-inc');
  var uploadRezizeDecElement = uploadFormElement.querySelector('.upload-resize-controls-button-dec');
  var uploadHashtagsElement = uploadFormElement.querySelector('.upload-form-hashtags');

  var onUploadCloseElementClick = function () {
    window.util.toggleOverlay(uploadOverlayElement, onUploadOverlayEscPress);
    uploadFileElement.value = '';
  };

  var onUploadOverlayEscPress = function (evt) {
    var activeElement = document.activeElement;

    if (evt.keyCode === window.util.ESC_KEYCODE && activeElement !== uploadCommentElement) {
      window.util.toggleOverlay(uploadOverlayElement, onUploadOverlayEscPress);
      uploadFileElement.value = '';
    }
  };

  var onUploadFileElementChange = function () {
    window.util.toggleOverlay(uploadOverlayElement, onUploadOverlayEscPress);
  };

  var uploadImageElement = uploadFormElement.querySelector('.effect-image-preview');

  var removeCurrentEffect = function (element, effectsList) {
    var imageClasses = element.classList;

    for (var i = 0; i < imageClasses.length; i++) {
      for (var j = 0; j < effectsList.length; j++) {
        var effectClass = 'effect-' + effectsList[j];

        if (imageClasses[i] === effectClass) {
          element.classList.remove(imageClasses[i]);
        }
      }
    }
  };

  var defineEffect = function (element) {
    var currentEffect = element.style.filter || getComputedStyle(element).filter;
    var effectNameEndIndex = currentEffect.indexOf('(');
    var currentEffectName = currentEffect.slice(0, effectNameEndIndex);

    return currentEffectName;
  };

  var setEffectValue = function (effect) {
    if (effect === 'grayscale' || effect === 'sepia') {
      uploadImageElement.style.filter = effect + '(' + 0.01 * uploadEffectValueElement.value + ')';
    } else if (effect === 'invert') {
      uploadImageElement.style.filter = effect + '(' + uploadEffectValueElement.value + '%' + ')';
    } else if (effect === 'blur') {
      uploadImageElement.style.filter = effect + '(' + 0.03 * uploadEffectValueElement.value + 'px' + ')';
    } else if (effect === 'brightness') {
      uploadImageElement.style.filter = effect + '(' + 0.03 * uploadEffectValueElement.value + ')';
    } else {
      uploadImageElement.style.filter = '';
    }
  };

  var setDefaultEffectValue = function (pin, fillBar, valueInput) {
    pin.style.left = '20%';
    fillBar.style.width = '20%';
    valueInput.value = parseInt(uploadEffectPinElement.style.left, RADIX_TEN);
  };

  var applyFilters = function (target, effect) {
    var effectStyleClass = 'effect-' + effect;

    removeCurrentEffect(target, EFFECTS);

    if (effect !== 'none') {
      target.classList.add(effectStyleClass);
    }
  };

  var onEffectRadioClick = function (evt) {
    if (evt.target.name === 'effect') {
      var effect = evt.target.value;

      if (effect !== 'none') {
        uploadEffectElement.classList.remove('hidden');
      } else {
        uploadEffectElement.classList.add('hidden');
      }

      window.initializeFilters(uploadImageElement, effect, applyFilters);
      uploadImageElement.removeAttribute('style');

      var currentEffect = defineEffect(uploadImageElement);

      setDefaultEffectValue(uploadEffectPinElement, uploadEffectFillElement, uploadEffectValueElement);
      setEffectValue(currentEffect);
    }
  };

  uploadFileElement.addEventListener('change', onUploadFileElementChange);
  uploadCloseElement.addEventListener('click', onUploadCloseElementClick);
  uploadEffectsContainerElement.addEventListener('click', onEffectRadioClick);

  var getScaleValue = function (input, operator) {
    var value = parseInt(input.value, RADIX_TEN);
    var step = parseInt(input.dataset.step, RADIX_TEN);
    var min = parseInt(input.dataset.min, RADIX_TEN);
    var max = parseInt(input.dataset.max, RADIX_TEN);

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

      input.value = result + '%';
    }

    return result;
  };

  var setScaleValue = function (operator, factor, radix) {
    var resizeValue = getScaleValue(uploadResizeValueElement, operator);
    var scaleValue = parseInt(resizeValue, radix) / factor;

    uploadImageElement.style.transform = 'scale(' + scaleValue + ')';
  };

  var onResizeDecClick = function (evt) {
    evt.preventDefault();
    setScaleValue(OPERATOR_DEC, PERCENT_FACTOR, RADIX_TEN);
  };

  var onResizeIncClick = function (evt) {
    evt.preventDefault();
    setScaleValue(OPERATOR_INC, PERCENT_FACTOR, RADIX_TEN);
  };

  var setErrorState = function (element, message) {
    element.style.borderColor = 'red';
    element.setCustomValidity(message);
  };

  var setOrdinaryState = function (element) {
    element.style.borderColor = '';
    element.setCustomValidity('');
  };

  uploadRezizeDecElement.addEventListener('click', onResizeDecClick);
  uploadRezizeIncElement.addEventListener('click', onResizeIncClick);

  uploadHashtagsElement.addEventListener('change', function (evt) {
    var hashtags = evt.currentTarget.value.toLowerCase().split(' ');
    var target = evt.target;
    var j;

    if (hashtags.length > HASHTAG_COUNT) {
      setErrorState(target, 'Максимальное число хэштэгов - ' + HASHTAG_COUNT);
      return;
    } else {
      setOrdinaryState(target);
    }

    for (var i = 0; i < hashtags.length; i++) {
      if (hashtags[i][0] !== HASHTAG_SYMBOL) {
        setErrorState(target, 'Хэштэг должен начинаться со знака #');
        return;
      } else {
        setOrdinaryState(target);
      }

      if (hashtags[i].length > HASHTAG_LENGTH) {
        setErrorState(target, 'Максимальная длина хэштэга - ' + HASHTAG_LENGTH + ' символов');
        return;
      } else {
        setOrdinaryState(target);
      }

      for (j = 0; j < hashtags.length; j++) {
        if (hashtags[i] === hashtags[j] && i !== j) {
          setErrorState(target, 'Хэштэги не должны повторяться');
          return;
        } else {
          setOrdinaryState(target);
        }
      }

      for (j = 0; j < hashtags[i].length; j++) {
        if (hashtags[i][j] === HASHTAG_SYMBOL && j !== 0) {
          setErrorState(target, 'Хэштэги должны разделяться пробелами');
          return;
        } else {
          setOrdinaryState(target);
        }
      }
    }
  });

  var uploadEffectElement = uploadFormElement.querySelector('.upload-effect-level');
  var uploadEffectPinElement = uploadEffectElement.querySelector('.upload-effect-level-pin');
  var uploadEffectLineElement = uploadEffectElement.querySelector('.upload-effect-level-line');
  var uploadEffectValueElement = uploadEffectElement.querySelector('.upload-effect-level-value');
  var uploadEffectFillElement = uploadEffectElement.querySelector('.upload-effect-level-val');

  uploadEffectPinElement.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoordX = evt.clientX;
    var lineWidth = parseInt(getComputedStyle(uploadEffectLineElement).width, RADIX_TEN);

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = startCoordX - moveEvt.clientX;
      var percent = (PERCENT_FACTOR / lineWidth) * (evt.target.offsetLeft - shift);

      startCoordX = moveEvt.clientX;

      if (percent < 0 || percent > 100) {
        return;
      } else {
        evt.target.style.left = (PERCENT_FACTOR / lineWidth) * (evt.target.offsetLeft - shift) + '%';
      }

      uploadEffectFillElement.style.width = evt.target.style.left;
      uploadEffectValueElement.value = parseInt(evt.target.style.left, RADIX_TEN);

      var currentEffect = defineEffect(uploadImageElement);

      setEffectValue(currentEffect);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
