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

var system = navigator.system || xwalk.experimental.system;

var gInfo;

var init = function () {
    try {
        system.getCPUInfo().then(onCpuSuccess, onError);
        system.getMemoryInfo().then(onMemorySuccess, onError);
        system.getStorageInfo().then(onStorageSuccess, onError);
        system.getDisplayInfo().then(onDisplaySuccess, onError);
        system.getAVCodecs().then(onAVCodecsSuccess, onError);
    } catch (e) {
        alert("Exception: " + e.message);
    }
};

function makelineListItem(value) {
    return '<li>' + value + '</li>';
}

function makeDividerListItem(value) {
    return '<li data-role="list-divider">' + value + '</li>';
}

function onError(e) {
    alert("Error: " + e.message);
}

function onCpuSuccess(cpuInfo) {
    gInfo = makeDividerListItem("SystemCPU Status")
            + makelineListItem("NumOfProcessors : " + cpuInfo.numOfProcessors)
            + makelineListItem("ArchName : " + cpuInfo.archName)
            + makelineListItem("Load : " + cpuInfo.load);
    $("#cpu").html(gInfo).trigger("create").listview("refresh");
}

function onMemorySuccess(memoryInfo) {
    gInfo = makeDividerListItem("SystemMemory Status")
            + makelineListItem("Capacity : " + memoryInfo.capacity)
            + makelineListItem("AvailCapacity : " + memoryInfo.availCapacity);
    $("#memory").html(gInfo).trigger("create").listview("refresh");
}

function onStorageSuccess(storageInfo) {
    gInfo = makeDividerListItem("StorageUnit Status")
            + makelineListItem("StorageUnit number : " + storageInfo.storages.length)
            + makelineListItem("StorageUnit id : " + storageInfo.storages[0].id)
            + makelineListItem("StorageUnit name : " + storageInfo.storages[0].name)
            + makelineListItem("StorageUnit type : " + storageInfo.storages[0].type)
            + makelineListItem("StorageUnit capacity : " + storageInfo.storages[0].capacity);
    $("#storage").html(gInfo).trigger("create").listview("refresh");
}

function onDisplaySuccess(displayInfo) {
    gInfo = makeDividerListItem("DisplayUnit Status")
            + makelineListItem("DisplayUnit number : " + displayInfo.displays.length)
            + makelineListItem("DisplayUnit id : " + displayInfo.displays[0].id)
            + makelineListItem("DisplayUnit name : " + displayInfo.displays[0].name)
            + makelineListItem("DisplayUnit primary : " + displayInfo.displays[0].primary)
            + makelineListItem("DisplayUnit external : " + displayInfo.displays[0].external)
            + makelineListItem("DisplayUnit deviceXDPI : " + displayInfo.displays[0].deviceXDPI)
            + makelineListItem("DisplayUnit deviceYDPI : " + displayInfo.displays[0].deviceYDPI)
            + makelineListItem("DisplayUnit availWidth : " + displayInfo.displays[0].availWidth)
            + makelineListItem("DisplayUnit availHeight : " + displayInfo.displays[0].availHeight)
            + makelineListItem("DisplayUnit width : " + displayInfo.displays[0].width)
            + makelineListItem("DisplayUnit height : " + displayInfo.displays[0].height)
            + makelineListItem("DisplayUnit colorDepth : " + displayInfo.displays[0].colorDepth)
            + makelineListItem("DisplayUnit pixelDepth : " + displayInfo.displays[0].pixelDepth);
    $("#display").html(gInfo).trigger("create").listview("refresh");
}

function onAVCodecsSuccess(avcodecsInfo) {
    gInfo = makeDividerListItem("AVCodecs Status")
            + makelineListItem("AudioCodec format: " + avcodecsInfo.audioCodecs[0].format)
            + makelineListItem("VideoCodec format: " + avcodecsInfo.videoCodecs[0].format)
            + makelineListItem("VideoCodec hwAccel: " + avcodecsInfo.videoCodecs[0].hwAccel)
            + makelineListItem("VideoCodec encode: " + avcodecsInfo.videoCodecs[0].encode);
    $("#codec").html(gInfo).trigger("create").listview("refresh");
}

$(document).bind("pageinit", init);
