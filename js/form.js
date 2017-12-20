'use strict';

(function () {
  var EFFECTS = [
    'chrome',
    'sepia',
    'marvin',
    'phobos',
    'heat'
  ];
  var OPERATOR_DEC = 'dec';
  var OPERATOR_INC = 'inc';
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

  var uploadImageElement = uploadFormElement.querySelector('.effect-image-preview');

  var onUploadFileElementChange = function () {
    window.util.toggleOverlay(uploadOverlayElement, onUploadOverlayEscPress);
  };

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
    valueInput.value = parseInt(uploadEffectPinElement.style.left, window.util.RADIX_TEN);
  };

  var onEffectRadioClick = function (evt) {
    if (evt.target.name === 'effect') {
      var effect = evt.target.value;
      var effectStyleClass = 'effect-' + effect;

      removeCurrentEffect(uploadImageElement, EFFECTS);

      if (effect !== 'none') {
        uploadImageElement.classList.add(effectStyleClass);
        uploadEffectElement.classList.remove('hidden');
      } else {
        uploadEffectElement.classList.add('hidden');
      }

      uploadImageElement.removeAttribute('style');

      var currentEffect = defineEffect(uploadImageElement);

      setDefaultEffectValue(uploadEffectPinElement, uploadEffectFillElement, uploadEffectValueElement);
      setEffectValue(currentEffect);
    }
  };

  uploadFileElement.addEventListener('change', onUploadFileElementChange);
  uploadCloseElement.addEventListener('click', onUploadCloseElementClick);
  uploadEffectsContainerElement.addEventListener('click', onEffectRadioClick);

  var setScaleValue = function (target, input, resizeValue) {
    var scaleValue = parseInt(resizeValue, window.util.RADIX_TEN) / window.util.PERCENT_FACTOR;

    input.value = resizeValue + '%';
    target.style.transform = 'scale(' + scaleValue + ')';
  };

  var onResizeDecClick = function (evt) {
    evt.preventDefault();
    window.initializeScale(uploadImageElement, uploadResizeValueElement, OPERATOR_DEC, setScaleValue);
  };

  var onResizeIncClick = function (evt) {
    evt.preventDefault();
    window.initializeScale(uploadImageElement, uploadResizeValueElement, OPERATOR_INC, setScaleValue);
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
    var lineWidth = parseInt(getComputedStyle(uploadEffectLineElement).width, window.util.RADIX_TEN);

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = startCoordX - moveEvt.clientX;
      var percent = (window.util.PERCENT_FACTOR / lineWidth) * (evt.target.offsetLeft - shift);

      startCoordX = moveEvt.clientX;

      if (percent < 0 || percent > 100) {
        return;
      } else {
        evt.target.style.left = (window.util.PERCENT_FACTOR / lineWidth) * (evt.target.offsetLeft - shift) + '%';
      }

      uploadEffectFillElement.style.width = evt.target.style.left;
      uploadEffectValueElement.value = parseInt(evt.target.style.left, window.util.RADIX_TEN);

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
