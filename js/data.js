'use strict';

(function () {
  var PHOTOS_COUNT = 25;
  var COMMENTS = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];
  var LIKES_MIN = 15;
  var LIKES_MAX = 200;
  var COMMENTS_MIN = 0;
  var COMMENTS_MAX = 5;

  var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  var getComments = function (count) {
    var comments = [];

    for (var i = 0; i < count; i++) {
      comments[i] = COMMENTS[getRandomInt(0, COMMENTS.length - 1)];
    }

    return comments;
  };

  var createPhotoProperties = function (count) {
    var photos = [];

    for (var i = 0; i <= count; i++) {
      var photo = {
        url: 'photos/' + (i + 1) + '.jpg',
        likes: getRandomInt(LIKES_MIN, LIKES_MAX),
        comments: getComments(getRandomInt(COMMENTS_MIN, COMMENTS_MAX))
      };

      photos[i] = photo;
    }

    return photos;
  };

  window.data = {
    ESC_KEYCODE: 27,
    ENTER_KEYCODE: 13,

    toggleOverlay: function (overlay, escHandler) {
      if (overlay.classList.contains('hidden')) {
        overlay.classList.remove('hidden');
        document.addEventListener('keydown', escHandler);
      } else {
        overlay.classList.add('hidden');
        document.removeEventListener('keydown', escHandler);
      }
    },

    photoProperties: createPhotoProperties(PHOTOS_COUNT),
  };
})();
