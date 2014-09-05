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

jQuery(document).ready(function() {
    try {
        DisablePassButton();
        var scrollTarget = $("#scrollTarget")[0];
        var step1 = false; var step2 = false; var step3 = false;
        //touchstart event
        document.getElementById("tabletouch").addEventListener('touchstart',  function (event){
            var images = new Array("image1","image2","image3");
            var touches = event.touches;
            var resultMessage =["one button touched", "two buttons touched at one time", "three buttons touched at one time"];
            if(touches.length ==1){
                step1 = true;
            }
            if(touches.length ==2){
                step2 = true;
            }
            if(touches.length ==3){
                step3 = true;
            }
            $("#testresult").html("Touch info: " + resultMessage[touches.length-1]);
            for(var k=0;k<touches.length;k++){
                var touch = touches.item(k);
                for(var i=0;i<images.length;i++){
                    image = $("#"+images[i])[0];
                    if(touch.clientX > getLeft(image) && touch.clientX <getLeft(image)+100 && touch.clientY > getTop(image) & touch.clientY <getTop(image)+100){
                        image.src = "img/btn_down.png";
                    }
                }
            }
        }, false);

        //touchend event
        document.getElementById("tabletouch").addEventListener('touchend',  function (event){
            if(step1 && step2 && step3){
                EnablePassButton();
            }
            var images = new Array("image1","image2","image3");
            for(var i=0;i<images.length;i++){
                image = $("#"+images[i])[0];
                image.src = "img/btn_up.png";
            }
        }, false);
    } catch (err) {
        jQuery("#testresult").html("Html Console:" + err.message);
    }

    function getTop(e){
        var offset=e.offsetTop;
        if(e.offsetParent!=null) offset+=getTop(e.offsetParent);
        return offset;
    }

    function getLeft(e){
        var offset=e.offsetLeft;
        if(e.offsetParent!=null) offset+=getLeft(e.offsetParent);
        return offset;
    }
});
