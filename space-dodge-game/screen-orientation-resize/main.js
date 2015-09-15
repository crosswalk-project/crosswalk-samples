document.addEventListener('DOMContentLoaded', function () {
  // Make the application fullscreen to lock the screen
  if (document.documentElement.webkitRequestFullScreen) {
    document.documentElement.webkitRequestFullScreen();
  }

  if (screen.orientation.lock) {
    screen.orientation.lock('landscape');
  }

  // DOM elements in main game area
  var scoreDisplay = document.querySelector('#score-display');
  var controlUp = document.querySelector('#control-up');
  var controlDown = document.querySelector('#control-down');
  var playArea = document.querySelector('#play-area');

  // factor by which to modify canvas width and height
  var scaleCanvas = 1;

  var fitCanvas = function () {
    var container = document.querySelector('#play-area-container');
    var containerWidth = container.offsetWidth;
    var containerHeight = container.offsetHeight;

    var playAreaWidth = playArea.width;
    var playAreaHeight = playArea.height;

    var scaleWidth = containerWidth / playAreaWidth;
    var scaleHeight = containerHeight / playAreaHeight;
    scaleCanvas = (scaleHeight < scaleWidth) ? scaleHeight : scaleWidth;

    var newPlayAreaWidth = playAreaWidth * scaleCanvas;
    var newPlayAreaHeight = playAreaHeight * scaleCanvas;

    var left = (containerWidth - newPlayAreaWidth) / 2;
    var top = (containerHeight - newPlayAreaHeight) / 2;

    // resize and position the canvas
    playArea.width = parseInt(newPlayAreaWidth, 10);
    playArea.height = parseInt(newPlayAreaHeight, 10);
    playArea.style.top = top + 'px';
    playArea.style.left = left + 'px';
  };

  window.onresize = fitCanvas;
  fitCanvas();

  // DOM elements in stop screen
  var restart = document.querySelector('#restart');
  restart.addEventListener('click', start);
  var finalScore = document.querySelector('#final-score');
  var stopScreen = document.querySelector('#finish-screen');

  // player image (to draw onto canvas)
  var player = new Image();
  player.src = 'rocket.png';

  // asteroid image (to draw onto canvas)
  var asteroid = new Image();
  asteroid.src = 'asteroid.png';

  // canvas context
  var ctx = playArea.getContext('2d');

  // time of current frame
  var currentTime;

  // time since last frame, in seconds
  var delta;

  // distance to move on y axis
  var moveY;

  // previous y position for player
  var oldY;

  // time of last frame
  var lastTime;

  // x position of player (fixed)
  var x;

  // y position of player
  var y;

  // asteroids
  var asteroids;

  // base speed of each asteroid when added to screen
  // (incremented as game progresses);
  // the actual speed is this plus some small random amount
  var asteroidSpeed;

  // maximum base speed of asteroids
  var asteroidSpeedMax;

  // num of asteroids to keep on screen (incremented as game progresses)
  var asteroidNum;

  // maximum number of asteroids to have on the screen at any time
  var asteroidNumMax;

  // set to 'up' or 'down' if a control is active;
  // otherwise, set to null
  var controlPressed;

  // player score
  var score;

  // set to true if an asteroid collides with the player; used
  // to stop the game
  var hasCollided;

  // do we need to add asteroids?
  var needsReplenish;

  // set to false if the game isn't running (e.g. on collision)
  var running;

  // control button event handlers
  function handleControlOn(e) {
    if (e.target === controlUp) {
      controlPressed = 'up';
    }
    else if (e.target === controlDown) {
      controlPressed = 'down';
    }
  };

  function handleControlOff() {
    controlPressed = null;
  }

  // turn off controls if the touch move event happens outside the
  // up and down controls
  function handleTouchMove(e) {
    e.preventDefault();

    var elt = document.elementFromPoint(
      e.touches[0].clientX,
      e.touches[0].clientY
    );

    if (elt === controlDown) {
      controlPressed = 'down';
    }
    else if (elt === controlUp) {
      controlPressed = 'up';
    }
    else {
      controlPressed = null;
    }
  }

  controlUp.addEventListener('mousedown', handleControlOn);
  controlDown.addEventListener('mousedown', handleControlOn);
  controlUp.addEventListener('mouseout', handleControlOff);
  controlDown.addEventListener('mouseout', handleControlOff);
  controlUp.addEventListener('mouseup', handleControlOff);
  controlDown.addEventListener('mouseup', handleControlOff);

  controlUp.addEventListener('touchstart', handleControlOn);
  controlDown.addEventListener('touchstart', handleControlOn);
  controlUp.addEventListener('touchend', handleControlOff);
  controlDown.addEventListener('touchend', handleControlOff);
  document.addEventListener('touchmove', handleTouchMove);

  // get dimensions of an Image, taking scaleCanvas into account
  function getImgWidth(img) {
    return img.width * scaleCanvas;
  }

  function getImgHeight(img) {
    return img.height * scaleCanvas;
  }

  // draw an image to the canvas; this rounds off the x,y coordinates
  // first
  function drawImage(image, x, y, width, height) {
    ctx.drawImage(image, x, y, width, height);
  }

  // asteroidY: starting y position of the asteroid (px)
  // speed: > 0
  // the asteroid starts at x = canvas width, so is initially not visible
  function addAsteroid(asteroidY, speed) {
    // enough asteroids already
    if (asteroids.length >= asteroidNumMax) {
      return;
    }

    var asteroidX = playArea.width;

    var obj = {
      x: asteroidX,
      y: asteroidY,
      speed: speed,
      offscreen: false
    };

    asteroids.push(obj);

    // increment the number of asteroids which can be on screen
    // at once
    asteroidNum *= 1 + (0.5 / (asteroidNum * asteroidNum));

    // increment the base speed for asteroids
    if (asteroidSpeed < asteroidSpeedMax) {
      asteroidSpeed *= 1.02;
    }
  }

  // top up asteroids on screen; the starting speed for the asteroid
  // is the current asteroidSpeed, plus up to 1.5 extra
  function replenishAsteroids() {
    // remove any offscreen asteroids
    for (var i = 0; i < asteroids.length; i++) {
      if (asteroids[i].offscreen) {
        asteroids.splice(i, 1);
      }
    }

    // add enough asteroids to fill the quota
    for (var i = 1; i <= (asteroidNum - asteroids.length); i++) {
      var asteroidY = (Math.random() * playArea.height) - getImgHeight(asteroid);

      if (asteroidY < 0) {
        asteroidY = 0;
      }

      addAsteroid(asteroidY, asteroidSpeed + (Math.random() * 1.5));
    }
  }

  function showScore() {
    scoreDisplay.innerText = score;
  }

  // runs on every animation frame
  function gameLoop() {
    if (!running) {
      return;
    }

    window.requestAnimationFrame(gameLoop);

    // apply movement to player
    oldY = y;

    currentTime = (new Date()).getTime();
    delta = (currentTime - lastTime) / 1000;

    // player moves 3 times own height per second
    moveY = (getImgHeight(player) * delta * 3);

    if (controlPressed === 'up') {
      y -= moveY;
    }
    else if (controlPressed === 'down') {
      y += moveY;
    }

    if (y < 0) {
      y = 0;
    }
    else if ((y + getImgHeight(player)) >= playArea.height) {
      y = playArea.height - getImgHeight(player);
    }

    // clear the whole canvas
    ctx.clearRect(0, 0, playArea.width, playArea.height);

    // draw the player with some jitter
    drawImage(
      player,
      x + (Math.random() - 1) * 2,
      y + (Math.random() - 1) * 2,
      getImgWidth(player),
      getImgHeight(player)
    );

    // move asteroids and draw them
    hasCollided = false;

    // set to true if at least one asteroid goes offscreen
    needReplenish = false;

    for (var i = 0; i < asteroids.length; i++) {
      // check whether asteroid has hit player; the numbers subtracted
      // below give more realistic collisions for the sprite shapes
      // involved
      if (!hasCollided) {
        hasCollided = (x + getImgWidth(player) - 10 >= asteroids[i].x) &&
                      (x <= asteroids[i].x + getImgWidth(asteroid) - 10) &&
                      (y + getImgHeight(player) - 4 >= asteroids[i].y) &&
                      (y <= asteroids[i].y + getImgHeight(asteroid) - 4);
      }

      // asteroid has left the screen
      if (asteroids[i].x < (0 - getImgWidth(asteroid))) {
        asteroids[i].offscreen = true;
        score++;
        needReplenish = true;
      }
      // asteroid needs to be drawn
      else {
        var newX = asteroids[i].x
                   - (delta * asteroids[i].speed * getImgWidth(asteroid));

        drawImage(
          asteroid,
          asteroids[i].x,
          asteroids[i].y,
          getImgWidth(asteroid),
          getImgHeight(asteroid)
        );

        asteroids[i].x = newX;
      }
    }

    if (needReplenish) {
      showScore();
      replenishAsteroids();
    }

    // check for game end
    if (hasCollided) {
      stop();
    }

    lastTime = currentTime;
  }

  function start() {
    lastTime = 0;
    x = 30;
    y = (playArea.height / 2) - (getImgHeight(player) / 2);
    asteroids = [];
    asteroidSpeed = 3;
    asteroidSpeedMax = 4;
    asteroidNum = 1;
    asteroidNumMax = 5;
    controlPressed = null;
    score = 0;
    lastTime = (new Date()).getTime();

    stopScreen.setAttribute('data-visible', 'false');
    running = true;

    showScore();
    replenishAsteroids();

    gameLoop();
  }

  function stop() {
    running = false;
    stopScreen.setAttribute('data-visible', 'true');
    finalScore.innerHTML = 'Your final score was<br>' + score;
  }

  // track loading of assets and start game when they're ready
  var assetsLoaded = 0;

  function startWhenAssetsLoaded() {
    assetsLoaded++;
    if (assetsLoaded == 2) {
      start();
    }
  }

  player.onload = asteroid.onload = startWhenAssetsLoaded;
});
