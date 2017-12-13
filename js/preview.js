'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var galleryOverlayElement = document.querySelector('.gallery-overlay');
  var galleryCloseElement = galleryOverlayElement.querySelector('.gallery-overlay-close');

  var toggleOverlay = function (overlay, escHandler) {
    if (overlay.classList.contains('hidden')) {
      overlay.classList.remove('hidden');
      document.addEventListener('keydown', escHandler);
    } else {
      overlay.classList.add('hidden');
      document.removeEventListener('keydown', escHandler);
    }
  };

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      toggleOverlay(galleryOverlayElement, onPopupEscPress);
    }
  };

  galleryCloseElement.addEventListener('click', function (evt) {
    evt.preventDefault();
    toggleOverlay(galleryOverlayElement, onPopupEscPress);
  });

  galleryCloseElement.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      toggleOverlay(galleryOverlayElement, onPopupEscPress);
    }
  });

  var getImageProperties = function (image) {
    var post = image.parentElement;

    var properties = {
      url: image.src,
      likes: post.querySelector('.picture-likes').textContent,
      comments: post.querySelector('.picture-comments').textContent
    };

    return properties;
  };

  var renderOverlay = function (photo, overlay) {
    var image = overlay.querySelector('.gallery-overlay-image');
    var likes = overlay.querySelector('.likes-count');
    var comments = overlay.querySelector('.comments-count');

    image.src = getImageProperties(photo).url;
    likes.textContent = getImageProperties(photo).likes;
    comments.textContent = getImageProperties(photo).comments;
  };

  var onPhotoClick = function (evt) {
    evt.preventDefault();

    renderOverlay(evt.target, galleryOverlayElement);
    toggleOverlay(galleryOverlayElement, onPopupEscPress);
  };

  window.picturesElement.addEventListener('click', onPhotoClick);
})();
