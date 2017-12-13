'use strict';

(function () {
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
    window.toggleOverlay(uploadOverlayElement, onUploadOverlayEscPress);
  };

  var onUploadCloseElementClick = function () {
    window.toggleOverlay(uploadOverlayElement, onUploadOverlayEscPress);
    uploadFileElement.value = '';
  };

  var onUploadOverlayEscPress = function (evt) {
    var activeElement = document.activeElement;

    if (evt.keyCode === window.ESC_KEYCODE && activeElement !== uploadCommentElement) {
      window.toggleOverlay(uploadOverlayElement, onUploadOverlayEscPress);
      uploadFileElement.value = '';
    }
  };
})();
