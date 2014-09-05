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
        Tan, Shiyou <shiyoux.tan@intel.com>
*/
$(document).ready(function () {
    DisablePassButton();
    $("#requestFullScreen").on(
        "click",
        function(evt) {
            document.documentElement.webkitRequestFullScreen();
            requestElement("cancelFullScreen");
            EnablePassButton();
     });

     $("#cancelFullScreen").on(
        "click",
        function(evt) {
            document.webkitCancelFullScreen();
            requestElement("");
     });

     $("#cssFullScreen").on(
        "click",
        function(evt) {
            if (!document.webkitIsFullScreen) {
                var element = evt.originalEvent.srcElement;
                requestElement("cancelCssFullScreen");
                element.webkitRequestFullScreen();
                setTimeout(function() {
                    document.documentElement.webkitRequestFullScreen();
                }, 50);
            }
            EnablePassButton();
     });

     $("#cancelCssFullScreen").on(
        "click",
        function(evt) {
            if (document.webkitIsFullScreen) {
                document.webkitCancelFullScreen();
                if ($(document)["context"].styleSheets.length == 2) {
                    $(document)["context"].styleSheets[1].deleteRule(1);
                }
                document.documentElement.webkitRequestFullScreen();
                window.location.reload();
            }
     });
});

function requestElement(ID) {
    var IDs = ["requestFullScreen", "cancelFullScreen", "cssFullScreen", "cancelCssFullScreen", "labelFullScreen", "labelcssFullScreen", "buttonFullScreen", "buttoncssFullScreen"];
    IDs.forEach(function(entry) {
        if (ID != entry) {
            if (ID == "cancelFullScreen" && entry != "labelFullScreen" && entry != "buttonFullScreen") {
                $("#" + entry).hide();
            } else if (ID == "cancelCssFullScreen" && entry != "labelcssFullScreen" && entry != "buttoncssFullScreen") {
                $("#" + entry).hide();
            }
        } else {
            $("#" + entry).css("display", "");
            $("#" + entry).show();
        }
        if (ID == "") {
            if (entry == IDs[1] || entry == IDs[3]) {
                $("#" + entry).hide();
            } else {
                $("#" + entry).show();
            }
        }
    });
}
