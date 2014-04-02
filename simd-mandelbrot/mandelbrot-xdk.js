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
  var timer_id;
  var use_simd       = false;
  var max_iterations = 100;
  var current_size   = "MEDIUM";

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
        _image_data.data [i+3] = 0;
      }
    }

    function update () {
      _ctx.putImageData (_image_data, 0, 0);
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
      reset:               reset,
      setPixel:            setPixel,
      getWidth:            getWidth,
      getHeight:           getHeight,
      colorMap:            colorMap,
      mapColorAndSetPixel: mapColorAndSetPixel
    };

  }());

  function mandelx1 (c_re, c_im) {
    var z_re = c_re,
        z_im = c_im,
        i;
    for (i = 0; i < max_iterations; ++i) {
      var z_re2 = z_re*z_re;
      var z_im2 = z_im*z_im;
      if (z_re2 + z_im2 > 4.0) {
        break;
      }

      var new_re = z_re2 - z_im2;
      var new_im = 2.0 * z_re * z_im;
      z_re = c_re + new_re;
      z_im = c_im + new_im;
    }
    return i;
  }

  function mandelx4(c_re4, c_im4) {
    var z_re4  = c_re4;
    var z_im4  = c_im4;
    var four4  = SIMD.float32x4.splat (4.0);
    var two4   = SIMD.float32x4.splat (2.0);
    var count4 = SIMD.int32x4.splat (0);
    var one4   = SIMD.int32x4.splat (1);
    var i;

    for (i = 0; i < max_iterations; ++i) {
      var z_re24 = SIMD.float32x4.mul (z_re4, z_re4);
      var z_im24 = SIMD.float32x4.mul (z_im4, z_im4);

      var mi4    = SIMD.float32x4.lessThanOrEqual (SIMD.float32x4.add (z_re24, z_im24), four4);
      // if all 4 values are greater than 4.0, there's no reason to continue
      if (mi4.signMask === 0x00) {
        break;
      }

      var new_re4 = SIMD.float32x4.sub (z_re24, z_im24);
      var new_im4 = SIMD.float32x4.mul (SIMD.float32x4.mul (two4, z_re4), z_im4);
      z_re4       = SIMD.float32x4.add (c_re4, new_re4);
      z_im4       = SIMD.float32x4.add (c_im4, new_im4);
      count4      = SIMD.int32x4.add (count4, SIMD.int32x4.and (mi4, one4));
    }
    return count4;
  }

  function drawMandelbrot (width, height, xc, yc, scale, use_simd) {
    var x0 = xc - 1.5*scale;
    var y0 = yc - scale;
    var xd = (3.0*scale)/width;
    var yd = (2.0*scale)/height;

//    logger.msg ("drawMandelbrot(xc:" + xc + ", yc:" + yc + ")");

    var xf = x0;
    var x, y;
    for (x = 0; x < width; ++x) {
      var yf = y0;
      if (use_simd) {
        var ydx4 = 4*yd;
        for (y = 0; y < height; y += 4) {
          var xf4 = SIMD.float32x4(xf, xf, xf, xf);
          var yf4 = SIMD.float32x4(yf, yf+yd, yf+yd+yd, yf+yd+yd+yd);
          var m4   = mandelx4 (xf4, yf4);
          canvas.mapColorAndSetPixel (x, y,   m4.x);
          canvas.mapColorAndSetPixel (x, y+1, m4.y);
          canvas.mapColorAndSetPixel (x, y+2, m4.z);
          canvas.mapColorAndSetPixel (x, y+3, m4.w);
          yf += ydx4;
        }
      }
      else {
        for (y = 0; y < height; ++y) {
          var m = mandelx1 (xf, yf);
          canvas.mapColorAndSetPixel (x, y, m);
          yf += yd;
        }
      }
      xf += xd;
    }
    canvas.update ();
  }

  function update_fps (fps) {
    var $fps = $("#fps");
    $fps.text (fps.toFixed(1));
  }

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
    var i           = 0;
    var now         = performance.now();

    function draw1 () {
      if (animate) {
        timer_id = setTimeout (draw1, 1);
      }
      drawMandelbrot (canvas.getWidth(), canvas.getHeight(), xc, yc, scale, use_simd);
      if (scale < scale_end || scale > scale_start) {
        scale_step = -scale_step;
        xc_step = -xc_step;
        yc_step = -yc_step;
      }
      scale += scale_step;
      xc += xc_step;
      yc += yc_step;
      i++;
      if (((i % 10)|0) === 0) {
        var t = performance.now();
        update_fps (10000/(t - now));
        now = t;
      }
    }  

    draw1 ();
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
      $("#start_stop").text("STOP");
      animate = true;
      animateMandelbrot ();
    }
  }

  function simd() {
    logger.msg("use SIMD clicked");
    var $simd = $("#simd");
    var $info = $("#info");
    if (!use_simd) {
      use_simd = true;
      $simd.text("- SIMD");
      $info.text("SIMD: On");
    }
    else {
      use_simd = false;
      $simd.text("+ SIMD");
      $info.text("SIMD: Off");
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
      clearTimeout(timer_id);
    }

    $size.text(current_size);
    canvas.reset("#mandel");
    animateMandelbrot ();
  }

  function main () {
    logger.msg ("main()");
    set_default_size();
    canvas.reset ("#mandel");

    $("#start_stop").click (start_stop);
    if (typeof SIMD === "undefined") {
      $("#simd").prop('disabled', true);
    }
    else {
      $("#simd").click (simd);
    }
    $("#size").click(set_size);
    animateMandelbrot ();
  }

  $(main);
}());
