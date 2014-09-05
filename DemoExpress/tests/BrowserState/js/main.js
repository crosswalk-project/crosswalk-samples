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
var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
function init() {
  browserStatusSuccess();
  connectionSuccess();
}

window.onload = init;

function make1lineListItem(value) {
  return '<li>' + value + '</li>';
}

function makeDividerListItem(value) {
  return '<li data-role="list-divider">' + value + '</li>';
}

function browserStatusSuccess() {
  gInfo = makeDividerListItem("Browser status")
          + make1lineListItem("online status : " + navigator.onLine);
  $("#info-list1").html(gInfo).trigger("create").listview("refresh");
}

function connectionSuccess() {
  var bandwidth = connection == undefined ? "N/A" : connection.bandwidth;
  var metered = connection == undefined ? "N/A" : connection.metered;
  gInfo = makeDividerListItem("Connection status")
          + make1lineListItem("bandwidth : " + bandwidth)
          + make1lineListItem("metered : " + metered);
  $("#info-list2").html(gInfo).trigger("create").listview("refresh");
}

window.ononline = function () {
  browserStatusSuccess();
  connectionSuccess();
};

window.onoffline = function () {
  browserStatusSuccess();
  connectionSuccess();
};
