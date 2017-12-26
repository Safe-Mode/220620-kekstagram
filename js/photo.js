'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var uploadFileElement = document.querySelector('.upload-input');
  var uploadImageElement = document.querySelector('.effect-image-preview');

  uploadFileElement.addEventListener('change', function () {
    var file = uploadFileElement.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (type) {
      return fileName.endsWith(type);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        uploadImageElement.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });

  window.photo = {
    fileInput: uploadFileElement,
    preview: uploadImageElement
  };
})();
