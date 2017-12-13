'use strict';

(function () {
  'use strict';

  (function () {
    var pictureTemplate = document.querySelector('#picture-template').content.querySelector('.picture');

    var renderPhoto = function (photos) {
      var photoElement = pictureTemplate.cloneNode(true);

      photoElement.querySelector('img').src = photos.url;
      photoElement.querySelector('.picture-likes').textContent = photos.likes;
      photoElement.querySelector('.picture-comments').textContent = photos.comments.length;

      return photoElement;
    };

    var insertElements = function (elements, parentNode) {
      var fragment = document.createDocumentFragment();

      for (var i = 0; i < elements.length; i++) {
        fragment.appendChild(renderPhoto(elements[i]));
      }

      parentNode.appendChild(fragment);
    };

    window.picturesElement = document.querySelector('.pictures');
    insertElements(window.photoProperties, window.picturesElement);
  })();
})();
