// Mandelbrot using SIMD
// Author: Peter Jensen, Intel Corporation

// JSLint directives:
/*jslint white: true */
/*jslint vars: true */
/*jslint nomen: true */
/*jslint bitwise: true */
/*jslint plusplus: true */
/*globals console: true */
/*globals $: true */
/*globals SIMD: true */
/*globals performance: true */
/*globals setTimeout: true */

(function () {
  "use strict";

  // available sizes
  var sizes = {
    SMALL:  {width: 160, height: 100},
    MEDIUM: {width: 320, height: 200},
    LARGE:  {width: 640, height: 400}
  }
  
  // state variables
  var animate        = false;
  var use_simd       = false;
  var max_iterations = 100;
  var current_size   = "MEDIUM";
  var worker_count   = 1;

  // logging operations
  var logger = {
    msg: function (msg) {
      console.log (msg);
    }
  };    

  // Basic canvas operations
  var canvas = (function () {

    var _ctx;
    var _width;
    var _height;

    var _image_data;

    function init (canvas_id) {
      var $canvas = $(canvas_id);
      $canvas.attr("width", sizes[current_size].width);
      $canvas.attr("height", sizes[current_size].height);
      _ctx        = $canvas.get(0).getContext("2d");
      _width      = sizes[current_size].width;
      _height     = sizes[current_size].height;
      _image_data = _ctx.getImageData (0, 0, _width, _height);
    }

    function clear () {
      var i;
      for (i = 0; i < _image_data.data.length; i = i + 4) {
        _image_data.data [i] = 0;
        _image_data.data [i+1] = 0;
        _image_data.data [i+2] = 0;
        _image_data.data [i+3] = 255;
      }
    }

    function update () {
      _ctx.putImageData (_image_data, 0, 0);
    }

    function updateFromImageData(image_data) {
      _image_data.data.set(image_data);
      _ctx.putImageData(_image_data, 0, 0);
    }

    function reset (canvas_id) {
      init(canvas_id);
      clear();
      update();
    }

    function setPixel (x, y, rgb) {
      var index = 4*(x + _width*y);
      _image_data.data[index]   = rgb[0];
      _image_data.data[index+1] = rgb[1];
      _image_data.data[index+2] = rgb[2];
      _image_data.data[index+3] = 255;
    }

    function colorMap(value) {
        if (value === max_iterations) {
            return [0, 0, 0];
        }
        var rgb = (value * 0xffff/max_iterations) * 0xff;
        var red = rgb & 0xff;
        var green = (rgb >> 8) & 0xff;
        var blue = (rgb >> 16) & 0xff;
        return [red, green, blue];
    }

    function mapColorAndSetPixel (x, y, value) {
      var rgb, r, g, b;
      var index = 4*(x + _width*y);
      if (value === max_iterations) {
        r = 0;
        g = 0;
        b = 0;
      }
      else {
        rgb = (value*0xffff/max_iterations)*0xff;
        r = rgb & 0xff;
        g = (rgb >> 8) & 0xff;
        b = (rgb >> 16) & 0xff;
      }
      _image_data.data[index]   = r;
      _image_data.data[index+1] = g;
      _image_data.data[index+2] = b;
      _image_data.data[index+3] = 255;
    }

    function getWidth () {
      return _width;
    }

    function getHeight () {
      return _height;
    }

    return {
      init:                init,
      clear:               clear,
      update:              update,
      updateFromImageData: updateFromImageData,
      reset:               reset,
      setPixel:            setPixel,
      getWidth:            getWidth,
      getHeight:           getHeight,
      colorMap:            colorMap,
      mapColorAndSetPixel: mapColorAndSetPixel
    };

  }());

  // Web Worker management
  var mandelbrotWorkers = function () {

    // private

    var mWorkers     = [];
    var mWorkerCode  = "mandelbrot-worker.js";
    var mWorkerCount = 0;

    function mWorker (wworker, handler, bufferSize) {
      this.wworker = wworker;
      this.buffer  = new ArrayBuffer (bufferSize);
      this.handler = handler;
    }

    // public

    function addWorker(handler, bufferSize) {
      var wworker = new Worker (mWorkerCode);
      var worker  = new mWorker (wworker, handler, bufferSize);
      mWorkers [mWorkerCount] = worker;
      wworker.addEventListener('message', handler, false);
      mWorkerCount++;
      return mWorkerCount - 1;
    }

    function sendRequest(worker_index, message) {
      var w = mWorkers [worker_index].wworker;
      var b = mWorkers [worker_index].buffer;
      w.postMessage ({message: message, worker_index: worker_index, buffer: b}, [b]);
    }

    function restoreBuffer(worker_index, buffer) {
      mWorkers[worker_index].buffer = buffer;
    }

    function terminateLastWorker() {
      var mw = mWorkers [mWorkerCount-1];
      mw.wworker.postMessage({terminate:true});    
      mWorkerCount--;
    }

    function terminateAllWorkers() {
      while (mWorkerCount > 0) {
        terminateLastWorker ();
      }
    }

    function numberOfWorkers() {
      return mWorkerCount;
    }

    function bufferOf(worker_index) {
      return mWorkers[worker_index].buffer;
    }

    function workerIsActive(worker_index) {
      return worker_index < mWorkerCount;
    }

    return {
      addWorker:           addWorker,
      sendRequest:         sendRequest,
      restoreBuffer:       restoreBuffer,
      terminateLastWorker: terminateLastWorker,
      terminateAllWorkers: terminateAllWorkers,
      numberOfWorkers:     numberOfWorkers,
      bufferOf:            bufferOf,
      workerIsActive:      workerIsActive
    };

  }();

  function update_fps (fps) {
    var $fps = $("#fps");
    $fps.text (fps.toFixed(1));
  }

  // The main animation function
  function animateMandelbrot () {
    var scale_start = 1.0;
    var scale_end   = 0.0005;
    var xc_start    = -0.5;
    var yc_start    = 0.0;
    var xc_end      = 0.0;
    var yc_end      = 0.75;
    var steps       = 200.0;
    var scale_step  = (scale_end - scale_start)/steps;
    var xc_step     = (xc_end - xc_start)/steps;
    var yc_step     = (yc_end - yc_start)/steps;
    var scale       = scale_start;
    var xc          = xc_start;
    var yc          = yc_start;
    var frame_count   = 0;  // number of frames painted to the canvas
    var request_count = 0;  // number of frames requested from workers
    var now         = performance.now();
    var width       = canvas.getWidth();
    var height      = canvas.getHeight();
    var bufferSize  = width*height*4;
    var pending_frames = [];

    // Look for a frame with 'frame_index' in the pending frames
    function findFrame(frame_index) {
      for (var i = 0, n = pending_frames.length; i < n; ++i) {
        if (pending_frames[i].frame_index === frame_index) {
          return i;
        }
      }
      return false;
    }

    // Send a request to a worker to compute a frame
    function requestFrame(worker_index) {
      mandelbrotWorkers.sendRequest(
        worker_index,
        { request_count:  request_count,
          width:          width,
          height:         height,
          xc:             xc,
          yc:             yc,
          scale:          scale,
          use_simd:       use_simd,
          max_iterations: max_iterations});
      request_count++;
    }

    // Send the pixels to the canvas, and update the FPS measurement
    function paintFrame(buffer) {
      canvas.updateFromImageData(buffer);
      if (frame_count > 0 && ((frame_count % 10)|0) === 0) {
        var t = performance.now();
        update_fps (10000/(t - now));
        now = t;
      }
    }

    // Called when a worker has computed a frame
    function updateFrame(e) {
      var worker_index  = e.data.worker_index;
      var request_count = e.data.message.request_count;
      mandelbrotWorkers.restoreBuffer (worker_index, e.data.buffer);

      if (!animate) {
        paintFrame (new Uint8ClampedArray(e.data.buffer));
        mandelbrotWorkers.terminateAllWorkers ();
        return;
      }

      if (mandelbrotWorkers.numberOfWorkers() < worker_count) {
        // add another worker
        var new_worker = mandelbrotWorkers.addWorker (updateFrame, bufferSize);
        requestFrame (new_worker);
        advanceFrame ();
      }
      if (mandelbrotWorkers.numberOfWorkers() > worker_count) {
        // terminate a worker
        mandelbrotWorkers.terminateLastWorker ();
      }

      if (request_count !== frame_count) {
        // frame came early, save it for later and do nothing now
        pending_frames.push ({worker_index: worker_index, frame_index: request_count});
        return;
      }
    
      var buffer = new Uint8ClampedArray (e.data.buffer);
      logger.msg ("Painting frame - no delay: " + frame_count);
      paintFrame (buffer);
      frame_count++

      if (pending_frames.length > 0) {
        // there are delayed frames queued up.  Process them
        var frame;
        while ((frame = findFrame (frame_count)) !== false) {
          var windex = pending_frames[frame].worker_index;
          pending_frames.splice (frame, 1); // remove the frame from the pending_frames
          var buffer = new Uint8ClampedArray (mandelbrotWorkers.bufferOf (windex));
          logger.msg ("Painting frame -  delayed: " + frame_count);
          paintFrame(buffer);
          frame_count++;
          if (mandelbrotWorkers.workerIsActive(windex)) {
            requestFrame(windex);
            advanceFrame();
          }
          else {
            logger.msg ("Worker is deactivated - 1");
          }
        }
      }

      if (mandelbrotWorkers.workerIsActive (e.data.worker_index)) {
        requestFrame (e.data.worker_index);
        advanceFrame ();
      }
      else {
        logger.msg ("Worker is deactivated - 2");
      }
    }

    function advanceFrame () {
      if (scale < scale_end || scale > scale_start) {
        scale_step = -scale_step;
        xc_step = -xc_step;
        yc_step = -yc_step;
      }
      scale += scale_step;
      xc += xc_step;
      yc += yc_step;
    }

    mandelbrotWorkers.addWorker (updateFrame, bufferSize);
    requestFrame(0);
    advanceFrame();
  }

  function set_default_size() {
    current_size = "LARGE";
    if (typeof navigator.appVersion !== "undefined") {
      if (navigator.appVersion.indexOf("Android") !== -1) {
        current_size = "MEDIUM";
      }
    }
    $("#size").text(current_size);
  }

  // input click handlers

  function start_stop() {
    if (animate) {
      $("#start_stop").text("START");
      animate = false;
    }
    else {
      var $ww_count = $("#ww_count");
      animate = true;
      worker_count = 1;  // always start with one worker
      $ww_count.text (worker_count);
      animateMandelbrot ();
      $("#start_stop").text("STOP");
    }
  }

  function simd() {
    logger.msg("use SIMD clicked");
    var $simd = $("#simd");
    var $info = $("#info");
    if (!use_simd) {
      use_simd = true;
      $simd.text("- SIMD");
      $info.text("On");
    }
    else {
      use_simd = false;
      $simd.text("+ SIMD");
      $info.text("Off");
    }
  }

  function set_size() {
    logger.msg("Size clicked");
    var $size = $("#size");
    if (current_size === "SMALL") {
      current_size = "MEDIUM";
    }
    else if (current_size === "MEDIUM") {
      current_size = "LARGE";
    }
    else {
      current_size = "SMALL";
    }
    if (animate) {
      $("#start_stop").text("START");
      animate = false;
    }

    $size.text(current_size);
    canvas.reset("#mandel");
    animateMandelbrot ();
  }

  function ww_add() {
    var $ww_count = $("#ww_count");
    worker_count++;
    $ww_count.text (worker_count);
  }

  function ww_sub() {
    var $ww_count = $("#ww_count");
    if (worker_count > 1) {
      worker_count--;
      $ww_count.text (worker_count);
    }
  }

  function main () {
    logger.msg ("main()");
    set_default_size();
    canvas.reset ("#mandel");

    // setup the click handlers
    $("#start_stop").click (start_stop);
    if (typeof SIMD === "undefined") {
      $("#simd").prop('disabled', true);
    }
    else {
      $("#simd").click (simd);
    }
    $("#size").click(set_size);
    $("#ww_add").click (ww_add);
    $("#ww_sub").click (ww_sub);
    animateMandelbrot ();
  }

  $(main);
}());
