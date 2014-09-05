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
        Xin, liu <xinx.liu@intel.com>

*/
var presentationWindow = null;

function closePresentationWindow() {
  if (presentationWindow !== null)
    presentationWindow.close();
  reset();
}

function reset() {
  var msg = $("#message")[0];
  msg.innerHTML = "Received message: N/A";
  var result = $("#result")[0];
  result.innerHTML = "Result: N/A";
}

function showSucceed(w) {
  var e = $("#result")[0];
  e.innerHTML = "Result: OK";

  presentationWindow = w;
  presentationWindow.postMessage("I am from opener window", "*");
}

function showError(e) {
  var elem = $("#result")[0];
  elem.innerHTML = "Result: " + e.name;
}

function requestShow() {
  navigator.presentation.requestShow("contents.html", showSucceed, showError);
}

function init() {
  var e = $("#available")[0];
  e.innerHTML = navigator.presentation.displayAvailable ?
                "Display Availability: true" : "Display Availability: false";

  navigator.presentation.addEventListener("displayavailablechange", function() {
    e.innerHTML = navigator.presentation.displayAvailable ?
                  "Display Availability: true" : "Display Availability: false";
    if (!navigator.presentation.displayAvailable) {
      var button = $("#available")[0];
      button.disabled = true;
    }
  });
}

window.onload = init;

window.onmessage = function(evt) {
  var e = $("#message")[0];
  e.innerHTML = "Received message: " + evt.data;
}
