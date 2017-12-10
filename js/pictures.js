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
var EFFECTS = [
  'chrome',
  'sepia',
  'marvin',
  'phobos',
  'heat'
];

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
var pisturesElement = document.querySelector('.pictures');
var galleryOverlayElement = document.querySelector('.gallery-overlay');
var photoProperties = createPhotoProperties(PHOTOS_COUNT);

var renderOverlay = function (photo, overlay) {
  var image = overlay.querySelector('.gallery-overlay-image');
  var likes = overlay.querySelector('.likes-count');
  var comments = overlay.querySelector('.comments-count');

  image.src = photo.url;
  likes.textContent = photo.likes;
  comments.textContent = photo.comments.length;
};

insertElements(photoProperties, pisturesElement);

var photosElement = pisturesElement.querySelectorAll('.picture');

var toggleOverlay = function (overlay) {
  if (overlay.classList.contains('hidden')) {
    overlay.classList.remove('hidden');
    document.addEventListener('keydown', onUploadOverlayEscPress);
  } else {
    overlay.classList.add('hidden');
    document.removeEventListener('keydown', onUploadOverlayEscPress);
  }
};

var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup(galleryOverlayElement);
  }
};

var openPopup = function (popup) {
  popup.classList.remove('hidden');
  // toggleOverlay(popup);
  document.addEventListener('keydown', onPopupEscPress);
};

var closePopup = function (popup) {
  popup.classList.add('hidden');
  // toggleOverlay(popup);
  document.removeEventListener('keydown', onPopupEscPress);
};

photosElement.forEach(function (item, index) {
  var close = galleryOverlayElement.querySelector('.gallery-overlay-close');

  var onItemClick = function (evt) {
    evt.preventDefault();

    renderOverlay(photoProperties[index], galleryOverlayElement);
    openPopup(galleryOverlayElement);
  };

  item.addEventListener('click', onItemClick);
  close.addEventListener('click', function (evt) {
    evt.preventDefault();
    closePopup(galleryOverlayElement);
  });
  close.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      closePopup(galleryOverlayElement);
    }
  });
});

var uploadFormElement = document.querySelector('#upload-select-image');
var uploadFileElement = uploadFormElement.querySelector('#upload-file');
var uploadOverlayElement = uploadFormElement.querySelector('.upload-overlay');
var uploadCloseElement = uploadFormElement.querySelector('.upload-form-cancel');
var uploadCommentElement = uploadFormElement.querySelector('.upload-form-description');
var uploadImageElement = uploadFormElement.querySelector('.effect-image-preview');

var onUploadFileElementChange = function (evt) {
  evt.preventDefault();
  toggleOverlay(uploadOverlayElement);
};

var onUploadCloseElementClick = function (evt) {
  evt.preventDefault();

  toggleOverlay(uploadOverlayElement);
  uploadFileElement.value = '';
};

var onUploadOverlayEscPress = function (evt) {
  evt.preventDefault();

  var activeElement = document.activeElement;

  if (evt.keyCode === ESC_KEYCODE && activeElement !== uploadCommentElement) {
    toggleOverlay(uploadOverlayElement);
    uploadFileElement.value = '';
  }
};

var removeCurrentEffect = function (element, effectsList) {
  var imageClasses = element.classList;

  for (var i = 0; i < imageClasses.length; i++) {
    for (var j = 0; j < effectsList.length; j++) {
      var effectClass = 'effect-' + effectsList[j];

      if (imageClasses[i] === effectClass) {
        element.classList.remove(imageClasses[i]);
      }
    }
  }
};

var onEffectRadioClick = function (evt) {
  if (evt.target.name === 'effect') {
    var effect = evt.target.value;
    var effectStyleClass = 'effect-' + effect;

    removeCurrentEffect(uploadImageElement, EFFECTS);

    if (effect !== 'none') {
      uploadImageElement.classList.add(effectStyleClass);
    }
  }
};

uploadFileElement.addEventListener('change', onUploadFileElementChange);
uploadCloseElement.addEventListener('click', onUploadCloseElementClick);
uploadOverlayElement.addEventListener('click', onEffectRadioClick);
