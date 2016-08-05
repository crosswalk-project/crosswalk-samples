/*
Copyright (c) 2014 Intel Corporation.

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
        Liu, yun <yunx.liu@intel.com>
*/

function loadimg() {
  $("#background").attr("src", "http://test.csswg.org/source/support/cat.png");
  $("#background").attr("onload","sendResourceTiming()");
}

function sendResourceTiming() {
  var resourceList = window.performance.getEntriesByType('resource');
  if (resourceList.length > 0) {
    for (i = 0; i < resourceList.length; i++) {
      if (resourceList[i].initiatorType == 'img') {
        $("#info").css("display", "block");
        document.getElementById("name").innerHTML = "Name: " + resourceList[i].name;
        document.getElementById("entryType").innerHTML = "Entry type: " + resourceList[i].entryType;
        document.getElementById("start").innerHTML = "Start time: " + Math.round(resourceList[i].startTime) + "ms";
        document.getElementById("duration").innerHTML = "Duration time: " + Math.round(resourceList[i].duration) + "ms";
        EnablePassButton();
      }
    }
  }
}

$(document).ready(function() {
  DisablePassButton();
  $("#test").css("border", "1px solid black");
  $("#info").css("display", "none");
  $("#loadimg").click(loadimg);
});
