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
   Ma,Yue <yuex.ma@intel.com>

*/

var visibilitychange = "visibilitychange";
var array = new Array("webkit", "o", "moz", "ms");
for(var i = 0; i < array.length; i++) {
    if(array[i] + "Hidden" in document) {
        visibilitychange = array[i] + "visibilitychange";
    }
}

$(document).delegate("#main", "pageinit", function() {
    document.addEventListener(visibilitychange, notification);
    DisablePassButton();
});

function notification() {
    EnablePassButton();
    var doc_hidden = document.hidden | document.webkitHidden | document.oHidden | document.mozHidden | document.msHidden;
    var visibilitystate = document.visibilityState || document.webkitVisibilityState || document.oVisibilityState || document.mozVisibilityState || document.msVisibilityState;
    var hidden = doc_hidden == 0 ? false : true;
    var date = new Date().toString().substr(4, 20);
    if(visibilitystate === "hidden" && hidden) {
        $("#lock").html(function(i, origText) {return origText  + date + "<br>" + "visibilitystate : " + visibilitystate + "<br>" + " hidden : " + hidden + "<br>"});
    } else if (visibilitystate === "visible" && !hidden) {
         $("#unlock").html(function(i, origText) {return origText + date + "<br>" + "visibilitystate : " + visibilitystate + "<br>" + " hidden : " + hidden + "<br>"});
    }else {
        $("#lock").html(function(i, origText) {return origText + date + "<br>" + "Fail " + "<br>"});
        $("#unlock").html(function(i, origText) {return origText + date + "<br>" + "Fail " + "<br>"});
    }
}
