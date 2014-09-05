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

function drawOnCanvas(file) {
  var reader = new FileReader();

  reader.onload = function (e) {
    var dataURL = e.target.result;
        var c = document.createElement("Canvas");
        ctx = c.getContext('2d');
        img = new Image();

    img.onload = function() {
      c.width = img.width;
      c.height = img.height;

      var fheight = 180;
      var fwidth = fheight / img.height * img.width
      ctx.drawImage(img, 0, 0, fwidth, fheight);
    };
    img.src = dataURL;
    $('#photoShow').html(c);
  };

  reader.readAsDataURL(file);
}

$(document).ready(function(){
    DisablePassButton();
    $("#photoShow").html("No photo");
    $("#files")[0].onchange = function(evt) {
        try {
            // loading
            $.mobile.showPageLoadingMsg();

            var files = evt.target.files; // FileList object
            $("#filename").html(files[0].name);
            drawOnCanvas(files[0]);

            $.mobile.hidePageLoadingMsg();
            EnablePassButton();
        } catch(err) {
            $.mobile.hidePageLoadingMsg();
            $("#filename").html(err);
        }
    }

    $("#button")[0].onclick = function() {
        var ie = navigator.appName == "Microsoft Internet Explorer" ? true : false;
        if(ie){
            $("#files")[0].click();
            $("#button")[0].value = $("#files")[0].value;
        }else{
            var evt = document.createEvent("MouseEvents");
            evt.initEvent("click", true, true);
            $("#files")[0].dispatchEvent(evt);
        }
    }

});
