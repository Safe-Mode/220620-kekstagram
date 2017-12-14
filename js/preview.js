'use strict';

(function () {
  var getImageProperties = function (image) {
    var post = image.parentElement;

    var properties = {
      url: image.src,
      likes: post.querySelector('.picture-likes').textContent,
      comments: post.querySelector('.picture-comments').textContent
    };

    return properties;
  };

  window.preview = function (photo, overlay) {
    var image = overlay.querySelector('.gallery-overlay-image');
    var likes = overlay.querySelector('.likes-count');
    var comments = overlay.querySelector('.comments-count');

    image.src = getImageProperties(photo).url;
    likes.textContent = getImageProperties(photo).likes;
    comments.textContent = getImageProperties(photo).comments;
  };
})();
