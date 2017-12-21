'use strict';

(function () {
  var DOWNLOAD_URL = 'https://js.dump.academy/kekstagram/data';

  window.picturesElement = document.querySelector('.pictures');
  var galleryOverlayElement = document.querySelector('.gallery-overlay');
  var galleryCloseElement = galleryOverlayElement.querySelector('.gallery-overlay-close');

  var onPhotoClick = function (evt) {
    evt.preventDefault();

    window.renderPreview(evt.target, galleryOverlayElement);
    window.util.toggleOverlay(galleryOverlayElement, onPopupEscPress);
  };

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === window.util.ESC_KEYCODE) {
      window.util.toggleOverlay(galleryOverlayElement, onPopupEscPress);
    }
  };

  window.backend.load(DOWNLOAD_URL, window.appendPicture, window.util.onXHRError);
  window.picturesElement.addEventListener('click', onPhotoClick);

  galleryCloseElement.addEventListener('click', function (evt) {
    evt.preventDefault();
    window.util.toggleOverlay(galleryOverlayElement, onPopupEscPress);
  });

  galleryCloseElement.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.util.ENTER_KEYCODE) {
      window.util.toggleOverlay(galleryOverlayElement, onPopupEscPress);
    }
  });
})();
