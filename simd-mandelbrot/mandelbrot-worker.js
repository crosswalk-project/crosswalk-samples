/*
Copyright (c) 2014 Intel Corporation. All rights reserved.
Use of this source code is governed by a MIT-style license that can be
found in the LICENSE file.
*/
self.addEventListener ("message", computeFrame, false);

var max_iterations;
var image_buffer;
var width;
var heigth;

function computeFrame (e) {
  if (typeof e.data.terminate !== "undefined") {
    self.close ();
    return;
  }
  var message = e.data.message;
  max_iterations = message.max_iterations;
  image_buffer = new Uint8ClampedArray (e.data.buffer);
  width        = message.width;
  height       = message.height;
  drawMandelbrot (message);
  self.postMessage ({worker_index: e.data.worker_index, message: message, buffer: e.data.buffer}, [e.data.buffer]);
//   self.postMessage ({worker_index: e.data.worker_index, buffer: e.data.buffer});
}

function mandelx1 (c_re, c_im) {
  var z_re = c_re,
      z_im = c_im,
      i;
  for (i = 0; i < max_iterations; i++) {
    var z_re2 = z_re*z_re;
    var z_im2 = z_im*z_im;
    if (z_re2 + z_im2 > 4.0)
      break;

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
  var four4  = SIMD.Float32x4.splat (4.0);
  var two4   = SIMD.Float32x4.splat (2.0);
  var count4 = SIMD.Int32x4.splat (0);
  var one4   = SIMD.Int32x4.splat (1);

  for (var i = 0; i < max_iterations; ++i) {
    var z_re24 = SIMD.Float32x4.mul (z_re4, z_re4);
    var z_im24 = SIMD.Float32x4.mul (z_im4, z_im4);

    var mi4    = SIMD.Float32x4.lessThanOrEqual (SIMD.Float32x4.add (z_re24, z_im24), four4);
    // if all 4 values are greater than 4.0, there's no reason to continue
    if (mi4.signMask === 0x00) {
      break;
    }

    var new_re4 = SIMD.Float32x4.sub (z_re24, z_im24);
    var new_im4 = SIMD.Float32x4.mul (SIMD.Float32x4.mul (two4, z_re4), z_im4);
    z_re4       = SIMD.Float32x4.add (c_re4, new_re4);
    z_im4       = SIMD.Float32x4.add (c_im4, new_im4);
    count4      = SIMD.Int32x4.add (count4, SIMD.Int32x4.and (mi4, one4));
  }
  return count4;
}

function mapColorAndSetPixel (x, y, value) {
  var rgb, r, g, b;
  var index = 4*(x + width*y);
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
  image_buffer[index]   = r;
  image_buffer[index+1] = g;
  image_buffer[index+2] = b;
  image_buffer[index+3] = 255;
}

function drawMandelbrot (params) {
  var width        = params.width;
  var height       = params.height;
  var scale        = params.scale;
  var use_simd     = params.use_simd;
  var xc           = params.xc;
  var yc           = params.yc;
  var x0 = xc - 1.5*scale;
  var y0 = yc - scale;
  var xd = (3.0*scale)/width;
  var yd = (2.0*scale)/height;

  var xf = x0;
  for (var x = 0; x < width; ++x) {
    var yf = y0;
    if (use_simd) {
      var ydx4 = 4*yd;
      for (var y = 0; y < height; y += 4) {
        var xf4 = SIMD.Float32x4(xf, xf, xf, xf);
        var yf4 = SIMD.Float32x4(yf, yf+yd, yf+yd+yd, yf+yd+yd+yd);
        var m4   = mandelx4 (xf4, yf4);
        mapColorAndSetPixel (x, y,   SIMD.Int32x4.extractLane(m4, 0));
        mapColorAndSetPixel (x, y+1, SIMD.Int32x4.extractLane(m4, 1));
        mapColorAndSetPixel (x, y+2, SIMD.Int32x4.extractLane(m4, 2));
        mapColorAndSetPixel (x, y+3, SIMD.Int32x4.extractLane(m4, 3));
        yf += ydx4;
      }
    }
    else {
      for (var y = 0; y < height; ++y) {
        var m = mandelx1 (xf, yf);
        mapColorAndSetPixel (x, y, m);
        yf += yd;
      }
    }
    xf += xd;
  }
}
