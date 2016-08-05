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
        Shentu, Jiazhen <jiazhenx.shentu@intel.com>

*/

function getNavigationTiming() {
  timing = window.performance.timing;
  var prompt = timing.fetchStart - timing.navigationStart;
  var redirect = timing.redirectEnd  - timing.redirectStart;
  var app_cache = timing.domainLookupStart  - timing.fetchStart;
  var dns = timing.domainLookupEnd - timing.domainLookupStart;
  var tcp = timing.connectEnd - timing.connectStart;
  var request = timing.responseEnd - timing.requestStart;
  var response = timing.domInteractive - timing.responseEnd;
  var processing = timing.domComplete - timing.domInteractive;
  var load = timing.loadEventEnd - timing.navigationStart;
  $("#prompt").html("<span>Prompt for unload time:</span> " + prompt + " ms");
  $("#redirect").html("<span>Redirect time:</span> " + redirect + " ms");
  $("#cache").html("<span>App cache time:</span> " + app_cache + " ms");
  $("#dns").html("<span>DNS time:</span> " + dns + " ms");
  $("#tcp").html("<span>TCP time:</span> " + tcp + " ms");
  $("#request").html("<span>Request time:</span> " + request + " ms");
  $("#response").html("<span>Response time:</span> " + response + " ms");
  $("#processing").html("<span>Processing time:</span> " + processing + " ms");
  $("#load").html("<span>Load time:</span> " + load + " ms");
}
