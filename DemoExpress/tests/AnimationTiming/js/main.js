/*
Copyright (c) 2013 Intel Corporation.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of works must retain the original copyright notice, this list
  of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the original copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.
* Neither the name of Intel Corporation nor the names of its contributors
  may be used to endorse or promote products derived from this work without
  specific prior written permission.

THIS SOFTWARE IS PROVIDED BY INTEL CORPORATION "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL INTEL CORPORATION BE LIABLE FOR ANY DIRECT,
INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

Authors:
        Wang, Hongjuan <hongjuanx.wang@intel.com>

*/

var reqAnimAPI = window.requestAnimationFrame ||
                 window.webkitRequestAnimationFrame ||
                 window.mozRequestAnimationFrame ||
                 window.msRequestAnimationFrame ||
                 oRequestAnimationFrame;
var cancelAnimAPI = window.cancelRequestAnimationFrame ||
                    window.webkitCancelRequestAnimationFrame ||
                    window.mozCancelAnimationFrame ||
                    window.msCancelAnimationFrame ||
                    window.oCancelAnimationFrame;
var requestId = 0;
var l = 0;

window.onload = function () {
  getPoint(document.getElementById("testDiv"));
}

function getPoint (obj) {
  var t = obj.offsetTop;
  var l = obj.offsetLeft;

  while (obj = obj.offsetParent) {
    obj = obj.offsetParent;
    if (obj != undefined) {
      t += obj.offsetTop;
      l += obj.offsetLeft;
    }
  }
}

function animate(time) {
  var obj = document.getElementById("testDiv");
  var l = obj.offsetLeft;
  while (obj = obj.offsetParent) {
    obj = obj.offsetParent;
    if (obj != undefined) {
      l += obj.offsetLeft;
    }
  }
  document.getElementById("animated").style.left = (time - animationStartTime) % 2400 / 10 + l + "px";
  requestId = reqAnimAPI(animate);
}
function start() {
  animationStartTime = window.performance.now();
  requestId = reqAnimAPI(animate);
}
function stop() {
  if (requestId)
    cancelAnimAPI(requestId);
  requestId = 0;
}
