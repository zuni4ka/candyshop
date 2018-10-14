'use strict';

(function () {
  var TIMEOUT = 10000;
  var OK = 200;

  var request = function (onLoad, onError, method, url, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === OK) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;

    xhr.open(method, url);

    if (data) {
      xhr.send(data);
    } else {
      xhr.send();
    }
  };

  var load = function (onLoad, onError) {
    request(onLoad, onError, 'GET', 'https://js.dump.academy/candyshop/data');
  };

  var save = function (data, onLoad, onError) {
    request(onLoad, onError, 'POST', 'https://js.dump.academy/candyshop', data);
  };

  window.candyshop.backend = {
    load: load,
    save: save,
  };
})();
