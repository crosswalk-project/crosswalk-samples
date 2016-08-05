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

var testFlag = {
    green: false,
    red: false,
    blue: false,
    yellow: false
};

function status() {
    if (testFlag.green && testFlag.red && testFlag.blue && testFlag.yellow) {
        EnablePassButton();
    }
}

$(document).ready(function () {
    DisablePassButton();
    $("#apply1").click(function () {
        testFlag.green = true;
        $("style")[0].innerHTML = $("style")[0].innerHTML +
            "@media screen and (max-device-aspect-ratio:2/1) {#media{color:green;}}";
        status();
    });
    $("#apply2").click(function () {
        testFlag.red = true;
        $("style")[0].innerHTML = $("style")[0].innerHTML +
            "@media screen and (min-device-aspect-ratio:1/10) {#media{color:red;}}";
        status();
    });
    $("#apply3").click(function () {
        testFlag.blue = true;
        $("style")[0].innerHTML = $("style")[0].innerHTML +
            "@media screen and (max-device-height: 1300px) {#media{color:blue;}}";
        status();
    });
    $("#apply4").click(function () {
        testFlag.yellow = true;
        $("style")[0].innerHTML = $("style")[0].innerHTML +
            "@media screen and (min-device-height: 100px) {#media{color:yellow;}}";
        status();
    });
});
