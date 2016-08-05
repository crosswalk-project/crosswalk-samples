/*
Copyright (c) 2014 Intel Corporation.

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
        Zhang, Jing <jingx.zhang@intel.com>

*/


var tag = null;
var peer = null;

function addMessage(obj) {
    if(typeof obj === 'string')
        document.getElementById('log').innerHTML = obj;
    else
        document.getElementById('eventLog').innerHTML = "Received event: " + obj.type;
}

var events = [
    'poweron',
    'poweroff',
    'pollstart',
    'pollstop',
    'tagfound',
    'taglost',
    'peerfound',
    'peerlost'
];

function handleEvent(e) {
    addMessage(e);
}

events.forEach(function(event) {
    navigator.nfc.addEventListener(event, handleEvent);
});

navigator.nfc.addEventListener('tagfound', tagFound);
navigator.nfc.addEventListener('taglost', tagLost);
navigator.nfc.addEventListener('peerfound', peerFound);
navigator.nfc.addEventListener('peerlost', peerLost);

function tagFound(e) {
    tag = e.tag;
    document.getElementById('tag_methods').style.display = 'block';
}

function tagLost(e) {
    tag = null;
    document.getElementById('tag_methods').style.display = 'none';
}

function peerFound(e) {
    peer = e.peer;
    peer.addEventListener('messageread', onMessageRead);
    document.getElementById('peer_methods').style.display = 'block';
}

function peerLost(e) {
    peer = null;
    document.getElementById('peer_methods').style.display = 'none';
}

function onMessageRead(e) {
    addMessage("Received message: " + JSON.stringify(e.message));
}

function readNDEF() {
    tag.readNDEF().then(function(record) {
    addMessage("readNDEF succeeded: " + JSON.stringify(record));},
function(){ addMessage("Cannot read tag"); });
}

function writeTextNDEF() {
    var text = new NDEFRecordText("hello world", "en-US", "UTF-8");
    tag.writeNDEF(new NDEFMessage([text])).then(function(){ addMessage("writeTextNDEF Succeeded"); },
function(){ addMessage("writeTextNDEF Failed"); });
}

function writeURINDEF() {
    var uri = new NDEFRecordURI("http://www.intel.com");
    tag.writeNDEF(new NDEFMessage([uri])).then(function(){ addMessage("writeURINDEF Succeeded"); },
function(){ addMessage("writeURINDEF Failed"); });
}

function sendURINDEF() {
    var uri = new NDEFRecordURI("http://www.google.com");
    peer.sendNDEF(new NDEFMessage([uri])).then(function(){ addMessage("sendURINDEF Succeeded"); },
function(){ addMessage("sendURINDEF Failed"); });
}

function writeMediaNDEF() {
    var media = new NDEFRecordMedia("text/plain", [104, 101, 108, 108, 111]);
    tag.writeNDEF(new NDEFMessage([media])).then(function(){ addMessage("NDEFRecordMedia Succeeded"); },
function(){ addMessage("NDEFRecordMedia Failed"); });
}

function createNDEFRecord() {
    var uri = new NDEFRecordURI("http://www.intel.com");
    uri.getPayload().then(function(res){ addMessage("payload: " + res); },
function(){ addMessage("getPayload Failed"); });
}

function powerOn() {
    navigator.nfc.powerOn().then(function(){ addMessage("powerOn Succeeded"); },
function(){ addMessage("powerOn Failed"); });
}

function powerOff() {
    navigator.nfc.powerOff().then(function(){ addMessage("powerOff Succeeded"); },
function(){ addMessage("powerOff Failed"); });
}

function startPoll() {
    navigator.nfc.startPoll().then(function(){addMessage("startPoll Succeeded");},
function(){addMessage("startPoll Failed"); });
}

function stopPoll() {
    navigator.nfc.stopPoll().then(function(){addMessage("stopPoll Succeeded");},
function(){addMessage("stopPoll Failed"); });
}
