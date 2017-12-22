'use strict';

(function () {
  var DOWNLOAD_URL = 'https://js.dump.academy/kekstagram/data';

  var pictures = [];
  var picturesElement = document.querySelector('.pictures');
  var galleryOverlayElement = document.querySelector('.gallery-overlay');
  var galleryCloseElement = galleryOverlayElement.querySelector('.gallery-overlay-close');
  var picturesFilterElement = document.querySelector('.filters');

  var filterSorter = {
    'recommend': function () {
      return 0;
    },

    'popular': function (firstPic, secondPic) {
      return secondPic.likes - firstPic.likes;
    },

    'discussed': function (firstPic, secondPic) {
      return secondPic.comments.length - firstPic.comments.length;
    },

    'random': function () {
      return Math.random() - 0.5;
    }
  };

  var updatePictures = function () {
    var sorter = updatePictures.sorter;
    var sorted = pictures;

    if (sorter !== 'recommend') {
      sorted = pictures.slice().sort(filterSorter[sorter]);
    }

    picturesElement.innerHTML = '';
    window.appendPicture(sorted);
  };

  var onLoadSuccess = function (data) {
    pictures = data;
    window.debounce(updatePictures);
  };

  var onFilterCheck = function (evt) {
    var filterMethod = evt.target.id.slice(7);

    updatePictures.sorter = filterMethod;
    window.backend.load(DOWNLOAD_URL, onLoadSuccess, window.util.onXHRError);
  };

  picturesFilterElement.addEventListener('change', onFilterCheck);

  var showFilters = function (element) {
    element.classList.remove('filters-inactive');
  };

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
  showFilters(picturesFilterElement);
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

  window.gallery = picturesElement;
})();
