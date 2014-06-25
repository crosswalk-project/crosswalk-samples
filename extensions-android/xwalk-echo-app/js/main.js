document.addEventListener('DOMContentLoaded', function () {
  echo.echoAsync('Hello world').then(
    function (result) {
      var p = document.createElement('p');
      p.innerHTML = result.content;
      document.body.appendChild(p);
    }
  );
});
