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
var RADIX_TEN = 10;
var OPERATOR_DEC = 'dec';
var OPERATOR_INC = 'inc';
var PERCENT_FACTOR = 100;
var HASHTAG_SYMBOL = '#';
var HASHTAG_COUNT = 5;
var HASHTAG_LENGTH = 20;

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

// var photosElement = pisturesElement.querySelectorAll('.picture');
var close = galleryOverlayElement.querySelector('.gallery-overlay-close');

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

close.addEventListener('click', function (evt) {
  evt.preventDefault();
  toggleOverlay(galleryOverlayElement, onPopupEscPress);
});

close.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    toggleOverlay(galleryOverlayElement, onPopupEscPress);
  }
});

var getImageProperties = function (image) {
  var post = image.parentElement;

  var properties = {
    url: image.src,
    likes: post.querySelector('.picture-likes'),
    comments: post.querySelector('.picture-comments')
  };

  return properties;
};

var onPhotoClick = function (evt) {
  evt.preventDefault();

  renderOverlay(getImageProperties(evt.target), galleryOverlayElement);
  toggleOverlay(galleryOverlayElement, onPopupEscPress);
};

pisturesElement.addEventListener('click', onPhotoClick);

var uploadFormElement = document.querySelector('#upload-select-image');
var uploadFileElement = uploadFormElement.querySelector('#upload-file');
var uploadOverlayElement = uploadFormElement.querySelector('.upload-overlay');
var uploadCloseElement = uploadFormElement.querySelector('.upload-form-cancel');
var uploadCommentElement = uploadFormElement.querySelector('.upload-form-description');
var uploadImageElement = uploadFormElement.querySelector('.effect-image-preview');
var uploadEffectsContainerElement = uploadFormElement.querySelector('.upload-effect-controls');
var uploadResizeValueElement = uploadFormElement.querySelector('.upload-resize-controls-value');
var uploadRezizeIncElement = uploadFormElement.querySelector('.upload-resize-controls-button-inc');
var uploadRezizeDecElement = uploadFormElement.querySelector('.upload-resize-controls-button-dec');
var uploadHashtagsElement = uploadFormElement.querySelector('.upload-form-hashtags');

var onUploadFileElementChange = function () {
  toggleOverlay(uploadOverlayElement, onUploadOverlayEscPress);
};

var onUploadCloseElementClick = function () {
  toggleOverlay(uploadOverlayElement, onUploadOverlayEscPress);
  uploadFileElement.value = '';
};

var onUploadOverlayEscPress = function (evt) {
  var activeElement = document.activeElement;

  if (evt.keyCode === ESC_KEYCODE && activeElement !== uploadCommentElement) {
    toggleOverlay(uploadOverlayElement, onUploadOverlayEscPress);
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
uploadEffectsContainerElement.addEventListener('click', onEffectRadioClick);

var getScaleValue = function (input, operator) {
  var value = parseInt(input.value, RADIX_TEN);
  var step = parseInt(input.dataset.step, RADIX_TEN);
  var min = parseInt(input.dataset.min, RADIX_TEN);
  var max = parseInt(input.dataset.max, RADIX_TEN);

  if (value !== min || value !== max) {
    var result;

    if (operator === 'dec') {
      result = value - step;
    }

    if (operator === 'inc') {
      result = value + step;
    }

    if (result < min) {
      result = min;
    }

    if (result > max) {
      result = max;
    }

    input.value = result + '%';
  }

  return result;
};

var setScaleValue = function (operator, factor, radix) {
  var resizeValue = getScaleValue(uploadResizeValueElement, operator);
  var scaleValue = parseInt(resizeValue, radix) / factor;

  uploadImageElement.style.transform = 'scale(' + scaleValue + ')';
};

var onResizeDecClick = function (evt) {
  evt.preventDefault();
  setScaleValue(OPERATOR_DEC, PERCENT_FACTOR, RADIX_TEN);
};

var onResizeIncClick = function (evt) {
  evt.preventDefault();
  setScaleValue(OPERATOR_INC, PERCENT_FACTOR, RADIX_TEN);
};

var setErrorState = function (element, message) {
  element.style.borderColor = 'red';
  element.setCustomValidity(message);
};

var setOrdinaryState = function (element) {
  element.style.borderColor = '';
  element.setCustomValidity('');
};

uploadRezizeDecElement.addEventListener('click', onResizeDecClick);
uploadRezizeIncElement.addEventListener('click', onResizeIncClick);

uploadHashtagsElement.addEventListener('change', function (evt) {
  var hashtags = evt.currentTarget.value.toLowerCase().split(' ');
  var target = evt.target;
  var j;

  if (hashtags.length > HASHTAG_COUNT) {
    setErrorState(target, 'Максимальное число хэштэгов - ' + HASHTAG_COUNT);
    return;
  } else {
    setOrdinaryState(target);
  }

  for (var i = 0; i < hashtags.length; i++) {
    if (hashtags[i][0] !== HASHTAG_SYMBOL) {
      setErrorState(target, 'Хэштэг должен начинаться со знака #');
      return;
    } else {
      setOrdinaryState(target);
    }

    if (hashtags[i].length > HASHTAG_LENGTH) {
      setErrorState(target, 'Максимальная длина хэштэга - ' + HASHTAG_LENGTH + ' символов');
      return;
    } else {
      setOrdinaryState(target);
    }

    for (j = 0; j < hashtags.length; j++) {
      if (hashtags[i] === hashtags[j] && i !== j) {
        setErrorState(target, 'Хэштэги не должны повторяться');
        return;
      } else {
        setOrdinaryState(target);
      }
    }

    for (j = 0; j < hashtags[i].length; j++) {
      if (hashtags[i][j] === HASHTAG_SYMBOL && j !== 0) {
        setErrorState(target, 'Хэштэги должны разделяться пробелами');
        return;
      } else {
        setOrdinaryState(target);
      }
    }
  }
});
