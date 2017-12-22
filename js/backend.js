'use strict';

(function () {
  var TIMEOUT = 10000;
  var STATUS_OK = 200;

  var prepareXHR = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS_OK) {
        onSuccess(xhr.response);
      } else {
        onError('Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;

    return xhr;
  };

  window.backend = {
    load: function (url, onLoad, onError) {
      var xhr = prepareXHR(onLoad, onError);

      xhr.open('GET', url);
      xhr.send();
    },

    save: function (data, url, onLoad, onError) {
      var xhr = prepareXHR(onLoad, onError);

      xhr.open('POST', url);
      xhr.send(data);
    }
  };
})();
