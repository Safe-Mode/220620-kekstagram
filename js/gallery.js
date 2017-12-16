'use strict';

(function () {
  var picturesElement = document.querySelector('.pictures');
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

  window.appendPicture(window.data, picturesElement);
  picturesElement.addEventListener('click', onPhotoClick);

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
