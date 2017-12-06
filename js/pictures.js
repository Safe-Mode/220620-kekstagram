'use strict';

var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
var PHOTOS_COUNT = 25;
var LIKES_MIN = 15;
var LIKES_MAX = 200;
var COMMENTS_MIN = 0;
var COMMENTS_MAX = 5;
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

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

var pictureTemplate = document.querySelector('#picture-template').content.querySelector('.picture');
var container = document.querySelector('.pictures');
var galleryOverlay = document.querySelector('.gallery-overlay');
var photoProperties = createPhotoProperties(PHOTOS_COUNT);

var renderOverlay = function (photo, overlay) {
  var image = overlay.querySelector('.gallery-overlay-image');
  var likes = overlay.querySelector('.likes-count');
  var comments = overlay.querySelector('.comments-count');

  image.src = photo.url;
  likes.textContent = photo.likes;
  comments.textContent = photo.comments.length;
};

insertElements(photoProperties, container);

var photos = container.querySelectorAll('.picture');

// var toggleOverlay = function (overlay) {
//   if (overlay.classList.contains('hidden')) {
//     overlay.classList.remove('hidden');
//   } else {
//     overlay.classList.add('hidden');
//   }
// };

var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup(galleryOverlay);
  }
};

var openPopup = function (popup) {
  popup.classList.remove('hidden');
  document.addEventListener('keydown', onPopupEscPress);
};

var closePopup = function (popup) {
  popup.classList.add('hidden');
  document.removeEventListener('keydown', onPopupEscPress);
};

photos.forEach(function (item, index) {
  var close = galleryOverlay.querySelector('.gallery-overlay-close');

  var onItemClick = function (evt) {
    evt.preventDefault();

    renderOverlay(photoProperties[index], galleryOverlay);
    openPopup(galleryOverlay);
  };

  item.addEventListener('click', onItemClick);
  close.addEventListener('click', function (evt) {
    evt.preventDefault();
    closePopup(galleryOverlay);
  });
  close.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      closePopup(galleryOverlay);
    }
  });
});
