(function () {
  var playText = '>';
  var pauseText = '||';

  // make and append an HTML <p> element
  // containing "text"
  var makePara = function (text) {
    var p = document.createElement('p');
    p.innerText = text;
    document.body.appendChild(p);
  };

  // enable all play/pause buttons
  var enableButtons = function () {
    var btns = document.querySelectorAll('button');
    for (var i = 0; i < btns.length; i += 1) {
      btns[i].removeAttribute('disabled');
    }
  };

  // disable all play/pause buttons except for btn
  var disableButtonsExcept = function (btn) {
    var btns = document.querySelectorAll('button');
    for (var i = 0; i < btns.length; i += 1) {
      if (btns[i] !== btn) {
        btns[i].setAttribute('disabled', 'disabled');
      }
    }
  };

  // very basic wrapper for HTML5 audio element;
  // fileInfo has the fields:
  // uri, title, artist
  var makeAudio = function (fileInfo) {
    var p = document.createElement('p');

    var audio = document.createElement('audio');

    audio.src = 'file://' + fileInfo.uri;

    var title = document.createElement('div');
    title.innerHTML = '<strong>' +
                      fileInfo.title +
                      '</strong>';

    var artist = document.createElement('div');
    artist.innerHTML = fileInfo.artist;

    var btn = document.createElement('button');
    btn.innerHTML = playText;

    // clicking on a button toggles play/pause
    btn.addEventListener('click', function () {
      if (audio.paused) {
        disableButtonsExcept(btn);
        audio.play();
        btn.innerText = pauseText;
      }
      else {
        enableButtons();
        audio.pause();
        btn.innerText = playText;
      }
    });

    // when playback finishes, skip back to start and
    // enable all buttons
    audio.addEventListener('ended', function () {
      audio.currentTime = 0;
      btn.innerText = playText;
      enableButtons();
    });

    p.appendChild(audio);
    p.appendChild(title);
    p.appendChild(artist);
    p.appendChild(btn);

    document.body.appendChild(p);
  };

  document.addEventListener('DOMContentLoaded', function () {
    // HERE'S THE (ASYNC) CALL TO THE EXTENSION
    // show list of audio files provided by audioFs extension
    audioFs.listFilesAsync().then(
      function (result) {
        if (result.success) {
          for (var i = 0; i < result.files.length; i += 1) {
            makeAudio(result.files[i]);
          }
        }
        else {
          makePara(result.error);
        }
      },

      function (e) {
        console.error(e);
        makePara(e.message);
      }
    );
  });
})();
