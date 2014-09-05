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
        Xin, Liu <xinx.liu@intel.com>

*/
var html_log;
html_log = "<b>Html Console:</b><br>";

function html_console(message) {
    html_log += message + "<br>";
    jQuery("#htmlConsole").html(html_log);
}
// -------------------------------------------

function initialize() {
    $.mobile.showPageLoadingMsg();
    DisablePassButton();
    try {
        navigator.geolocation.watchPosition(successCallback, errorCallback, { maximumAge: 60000});
    } catch (err) {
        $.mobile.hidePageLoadingMsg();
        jQuery("#errormessage").html("<p>Error Message: <font color='red'>" + err.message + "</font></p>");
    }
}

function successCallback (position) {
    $.mobile.hidePageLoadingMsg();
    EnablePassButton();
    var coordinates = position.coords;
    jQuery("#latitudeDiv").text("Latitude: " + coordinates.latitude);
    jQuery("#longitudeDiv").text("Longitude: " + coordinates.longitude);
    jQuery("#speedDiv").text("Speed: " + coordinates.speed);
}

function errorCallback (error) {
    $.mobile.hidePageLoadingMsg();
    var positionError_const =["PERMISSION DENIED", "POSITION UNAVAILABLE", "TIMEOUT"];
    var index = error.code-0-1;
    jQuery("#errormessage").html("<p>Error Message: <font color='red'>" + positionError_const[index] + "</font></p>");
}
