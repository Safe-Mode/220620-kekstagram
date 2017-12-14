'use strict';

(function () {
  var picturesElement = document.querySelector('.pictures');
  var galleryOverlayElement = document.querySelector('.gallery-overlay');
  var galleryCloseElement = galleryOverlayElement.querySelector('.gallery-overlay-close');

  var onPhotoClick = function (evt) {
    evt.preventDefault();

    window.preview(evt.target, galleryOverlayElement);
    window.data.toggleOverlay(galleryOverlayElement, onPopupEscPress);
  };

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === window.data.ESC_KEYCODE) {
      window.data.toggleOverlay(galleryOverlayElement, onPopupEscPress);
    }
  };

  window.picture(window.data.photoProperties, picturesElement);
  picturesElement.addEventListener('click', onPhotoClick);

  galleryCloseElement.addEventListener('click', function (evt) {
    evt.preventDefault();
    window.data.toggleOverlay(galleryOverlayElement, onPopupEscPress);
  });

  galleryCloseElement.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.data.ENTER_KEYCODE) {
      window.data.toggleOverlay(galleryOverlayElement, onPopupEscPress);
    }
  });
})();
