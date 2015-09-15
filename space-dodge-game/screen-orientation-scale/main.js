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

  // DOM elements in stop screen
  var restart = document.querySelector('#restart');
  restart.addEventListener('click', start);
  var finalScore = document.querySelector('#final-score');
  var stopScreen = document.querySelector('#finish-screen');

  // scale function
  var scale = function () {
    var container = document.querySelector('#container');
    var containerWidth = container.offsetWidth;
    var containerHeight = container.offsetHeight;

    var viewportWidth = document.documentElement.clientWidth;
    var viewportHeight = document.documentElement.clientHeight;

    var scaleWidth = viewportWidth / containerWidth;
    var scaleHeight = viewportHeight / containerHeight;
    var scaleBoth = (scaleHeight < scaleWidth) ? scaleHeight : scaleWidth;

    var newContainerWidth = containerWidth * scaleBoth;
    var newContainerHeight = containerHeight * scaleBoth;

    var left = (viewportWidth - newContainerWidth) / 2;
    left = parseInt(left * (1 / scaleBoth), 10);

    var top = (viewportHeight - newContainerHeight) / 2;
    top = parseInt(top * (1 / scaleBoth), 10);

    // scale the whole container
    var transform = 'scale(' + scaleBoth + ',' + scaleBoth + ') ' +
                    'translate(' + left + 'px, ' + top + 'px)';
    container.style['-webkit-transform-origin'] = 'top left 0';
    container.style['-webkit-transform'] = transform;
    container.style['transform-origin'] = 'top left 0';
    container.style['transform'] = transform;
  };

  window.onresize = scale;
  scale();

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
      var asteroidY = (Math.random() * playArea.height) - asteroid.height;

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
    moveY = (player.height * delta * 3);

    if (controlPressed === 'up') {
      y -= moveY;
    }
    else if (controlPressed === 'down') {
      y += moveY;
    }

    if (y < 0) {
      y = 0;
    }
    else if ((y + player.height) >= playArea.height) {
      y = playArea.height - player.height;
    }

    // clear the whole canvas
    ctx.clearRect(0, 0, playArea.width, playArea.height);

    // draw the player with some jitter
    drawImage(
      player,
      x + (Math.random() - 1) * 2,
      y + (Math.random() - 1) * 2,
      player.width,
      player.height
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
        hasCollided = (x + player.width - 10 >= asteroids[i].x) &&
                      (x <= asteroids[i].x + asteroid.width - 10) &&
                      (y + player.height - 4 >= asteroids[i].y) &&
                      (y <= asteroids[i].y + asteroid.height - 4);
      }

      // asteroid has left the screen
      if (asteroids[i].x < (0 - asteroid.width)) {
        asteroids[i].offscreen = true;
        score++;
        needReplenish = true;
      }
      // asteroid needs to be drawn
      else {
        var newX = asteroids[i].x - (delta * asteroids[i].speed * asteroid.width);

        drawImage(asteroid, asteroids[i].x, asteroids[i].y, asteroid.width, asteroid.height);

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
    y = (playArea.height / 2) - (player.height / 2);
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
