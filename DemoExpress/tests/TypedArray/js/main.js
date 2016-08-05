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
        Li, Hao <haox.li@intel.com>
        Zhang, Jing <jingx.zhang@intel.com>

*/

var elementSize = 2*Int8Array.BYTES_PER_ELEMENT + 2*Uint8Array.BYTES_PER_ELEMENT + 2*Int16Array.BYTES_PER_ELEMENT + 2*Uint16Array.BYTES_PER_ELEMENT + 2*Int32Array.BYTES_PER_ELEMENT + 2*Uint32Array.BYTES_PER_ELEMENT + 2*Float32Array.BYTES_PER_ELEMENT + 2*Float64Array.BYTES_PER_ELEMENT;

var buffer = new ArrayBuffer(elementSize);
var float64 = new Float64Array(buffer, 0, 2);
var float32 = new Float32Array(buffer, float64.byteOffset + float64.byteLength, 2);
var uint32 = new Uint32Array(buffer, float32.byteOffset + float32.byteLength, 2);
var int32 = new Int32Array(buffer, uint32.byteOffset + uint32.byteLength, 2);
var uint16 = new Uint16Array(buffer, int32.byteOffset + int32.byteLength, 2);
var int16 = new Int16Array(buffer, uint16.byteOffset + uint16.byteLength, 2);
var uint8 = new Uint8Array(buffer, int16.byteOffset + int16.byteLength, 2);
var int8 = new Int8Array(buffer, uint8.byteOffset + uint8.byteLength, 2);

$(document).ready(function () {
    DisablePassButton();
    getValue("#array1", 0);
    $("#setValue").click(function () {
        setValue();
        getValue("#array1", 1);
        EnablePassButton();
    });
    $("#getValue").click(function () {

    });
});

function showArray(tab, arr1, arr2, value) {
    var td = "";
    for (var i = 0; i < 2; i++) {
        if(arr1[i] == value) {
            td = td + "<td>" + arr1[i] + "</td>";
        } else {
            td = td + "<td>" + "U" + "</td>";
        }
    }
    for (var i = 0; i < 2; i++) {
        if(arr2[i] == value) {
            td = td + "<td>" + arr2[i] + "</td>";
        } else {
            td = td + "<td>" + "U" + "</td>";
        }
    }
    tab.html(tab.html() + "<tr>" + td + "</tr>");
}

function fillValue(arr, num, value) {
    for(var i = 0; i < num; i++) {
        try {
            arr[i] = value;
        } catch(err) {
            arr[i] = 0;
        }
    }
}

function getValue(table, value) {
    var tab =$(table);
    tab.html("");
    showArray(tab, float64, float32, value);
    showArray(tab, uint32, int32, value);
    showArray(tab, uint16, int16, value);
    showArray(tab, uint8, int8, value);
}

function setValue() {
    fillValue(float64, 2, 1);
    fillValue(float32, 2, 1);
    fillValue(uint32, 2, 1);
    fillValue(int32, 2, 1);
    fillValue(uint16, 2, 1);
    fillValue(int16, 2, 1);
    fillValue(uint8, 2, 1);
    fillValue(int8, 2, 1);
}
