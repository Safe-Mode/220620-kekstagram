'use strict';

(function () {
  var UPLOAD_URL = 'https://js.dump.academy/kekstagram';
  var EFFECTS = [
    'chrome',
    'sepia',
    'marvin',
    'phobos',
    'heat'
  ];
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
  var uploadRezizeElement = uploadFormElement.querySelector('.upload-resize-controls');
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

    imageClasses.forEach(function (imageClass) {
      effectsList.forEach(function (effect) {
        var effectClass = 'effect-' + effect;

        if (imageClass === effectClass) {
          element.classList.remove(imageClass);
        }
      });
    });
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

  var applyFilters = function (effect) {
    var effectStyleClass = 'effect-' + effect;

    removeCurrentEffect(uploadImageElement, EFFECTS);

    if (effect !== 'none') {
      uploadEffectElement.classList.remove('hidden');
      uploadImageElement.classList.add(effectStyleClass);
    } else {
      uploadEffectElement.classList.add('hidden');
    }

    var currentEffect = defineEffect(uploadImageElement);

    setDefaultEffectValue(uploadEffectPinElement, uploadEffectFillElement, uploadEffectValueElement);
    setEffectValue(currentEffect);
  };

  uploadFileElement.addEventListener('change', onUploadFileElementChange);
  uploadCloseElement.addEventListener('click', onUploadCloseElementClick);
  window.initializeFilters(uploadEffectsContainerElement, applyFilters);

  var setScaleValue = function (scaleValue) {
    uploadImageElement.style.transform = 'scale(' + scaleValue + ')';
  };

  window.initializeScale(uploadRezizeElement, uploadResizeValueElement, setScaleValue);

  var setErrorState = function (element, message) {
    element.style.borderColor = 'red';
    element.setCustomValidity(message);
  };

  var setOrdinaryState = function (element) {
    element.style.borderColor = '';
    element.setCustomValidity('');
  };

  uploadHashtagsElement.addEventListener('change', function (evt) {
    var hashtags = evt.currentTarget.value.toLowerCase().split(' ');
    var target = evt.target;

    if (hashtags.length > HASHTAG_COUNT) {
      setErrorState(target, 'Максимальное число хэштэгов - ' + HASHTAG_COUNT);
      return;
    } else {
      setOrdinaryState(target);
    }

    hashtags.forEach(function (hashtag, index) {
      if (hashtag[0] !== HASHTAG_SYMBOL) {
        setErrorState(target, 'Хэштэг должен начинаться со знака #');
        return;
      } else {
        setOrdinaryState(target);
      }

      if (hashtag.length > HASHTAG_LENGTH) {
        setErrorState(target, 'Максимальная длина хэштэга - ' + HASHTAG_LENGTH + ' символов');
        return;
      } else {
        setOrdinaryState(target);
      }

      hashtags.forEach(function (hashtagInner, indexInner) {
        if (hashtag === hashtagInner && index !== indexInner) {
          setErrorState(target, 'Хэштэги не должны повторяться');
          return;
        } else {
          setOrdinaryState(target);
        }
      });

      for (var i = 0; i < hashtag.length; i++) {
        if (hashtag[i] === HASHTAG_SYMBOL && i !== 0) {
          setErrorState(target, 'Хэштэги должны разделяться пробелами');
          return;
        } else {
          setOrdinaryState(target);
        }
      }
    });
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

      if (percent >= 0 && percent <= 100) {
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

  var formElement = document.querySelector('.upload-form');

  var onLoadUserData = function () {
    window.util.toggleOverlay(uploadOverlayElement, onUploadOverlayEscPress);
    formElement.reset();
    removeCurrentEffect(uploadImageElement, EFFECTS);
    setDefaultEffectValue(uploadEffectPinElement, uploadEffectFillElement, uploadEffectValueElement);

    uploadImageElement.removeAttribute('style');
    uploadEffectElement.classList.add('hidden');
    uploadFileElement.value = '';
  };

  formElement.addEventListener('submit', function (evt) {
    window.backend.save(new FormData(formElement), UPLOAD_URL, onLoadUserData, window.util.onXHRError);
    evt.preventDefault();
  });
})();
