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
        Xu, Kang <kangx.xu@intel.com>

*/

if (Element.prototype.webkitCreateShadowRoot && !Element.prototype.createShadowRoot) {
    Element.prototype.createShadowRoot = Element.prototype.webkitCreateShadowRoot;
    Object.defineProperty(Element.prototype, 'pseudo', {
        get: function () {
            return this.webkitPseudo;
        },
        set: function (value) {
            return this.webkitPseudo = value;
        }
   });

    Object.defineProperty(Element.prototype, 'shadowRoot', {
        get: function () {
            return this.webkitShadowRoot;
        }
    });
}

$(document).ready(function () {
    DisablePassButton();
    var temp = $("#templates")[0].content.cloneNode(true);
    var shadow = $("#outPut")[0].createShadowRoot();
    shadow.appendChild(temp);
    $("#submit").click(function () {
        var inputData = $("input").val();
        $("#outPut").text(inputData);
        EnablePassButton();
    });
});
