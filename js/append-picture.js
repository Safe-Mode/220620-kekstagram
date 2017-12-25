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

  window.appendPicture = function (elements) {
    var fragment = document.createDocumentFragment();

    elements.forEach(function (item) {
      fragment.appendChild(renderPhoto(item));
    });

    window.gallery.appendChild(fragment);
  };
})();
