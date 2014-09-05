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
        Liu,Yun <yunx.liu@intel.com>
*/

var testFlag = {
    green: false,
    red: false,
    blue: false
};
var showId;
var pc1, pc2, dc1, dc2;
var pc1_offer;
var pc2_answer;

function status() {
  if (testFlag.green && testFlag.red && testFlag.blue) {
    EnablePassButton();
  }
}

function show() {
  fancy_log("Could not connect pc1 and pc2!", "black");
  $("#startbutton").removeClass("ui-disabled");
  $("#stopbutton").addClass("ui-disabled");
  $("#pc1_send").addClass("ui-disabled");
  clearTimeout(showId);
}

function fancy_log(msg,color) {
  var message = '<span style="color: ' + color + ';">' + msg + '</span>';
  $("#datawindow").html("<p>" + message + "</p>" + $("#datawindow").html());
}

function pc1_send() {
  testFlag.red = true;
  dc1.send($("#pc1_input").val());
  $("#pc1_input").attr("value", "");
  status();
}

function requestFailed(code) {
  fancy_log("Failure callback: " + code, "black");
}

// pc1.createOffer finished, call pc1.setLocal
function requestSuccessed1(offer) {
  pc1_offer = offer;
  pc1.setLocalDescription(offer, requestSuccessed2, requestFailed);
}

// pc1.setLocal finished, call pc2.setRemote
function requestSuccessed2() {
  pc2.setRemoteDescription(pc1_offer, requestSuccessed3, requestFailed);
};

// pc2.setRemote finished, call pc2.createAnswer
function requestSuccessed3() {
  pc2.createAnswer(requestSuccessed4, requestFailed);
}

// pc2.createAnswer finished, call pc2.setLocal
function requestSuccessed4(answer) {
  pc2_answer = answer;
  pc2.setLocalDescription(answer, requestSuccessed5, requestFailed);
}

// pc2.setLocal finished, call pc1.setRemote
function requestSuccessed5() {
  pc1.setRemoteDescription(pc2_answer, function() {}, requestFailed);
}

function gotLocalCandidate(event) {
  if (event.candidate) {
    pc2.addIceCandidate(event.candidate);
  }
}

function gotRemoteIceCandidate(event) {
  if (event.candidate) {
    pc1.addIceCandidate(event.candidate);
  }
}

function handleSendChannelStateChange() {
  var readyState = dc1.readyState;
  fancy_log("Channel state is: " + readyState, "black");
  if (readyState == "open") {
    $("#startbutton").addClass("ui-disabled");
    $("#stopbutton").removeClass("ui-disabled");
    $("#pc1_send").removeClass("ui-disabled");
  } else {
    $("#startbutton").removeClass("ui-disabled");
    $("#stopbutton").addClass("ui-disabled");
    $("#pc1_send").addClass("ui-disabled");
  }
}

function start() {
  testFlag.green = true;
  $("#datawindow").html("Connecting......");
  $("#startbutton").addClass("ui-disabled");
  clearTimeout(showId);
  showId = setTimeout("show()", 30000);

  if (typeof RTCPeerConnection != "undefined") {
    pc1 = new RTCPeerConnection(null, {optional: [{RtpDataChannels: true}]});
    pc2 = new RTCPeerConnection(null, {optional: [{RtpDataChannels: true}]});
  } else {
    pc1 = new webkitRTCPeerConnection(null, {optional: [{RtpDataChannels: true}]});
    pc2 = new webkitRTCPeerConnection(null, {optional: [{RtpDataChannels: true}]});
  }
  dc1 = pc1.createDataChannel("pc1");
  pc1.onicecandidate = gotLocalCandidate;
  dc1.onopen = handleSendChannelStateChange;
  dc1.onclose = handleSendChannelStateChange;
  pc2.onicecandidate = gotRemoteIceCandidate;
  pc2.ondatachannel = function(event) {
    dc2 = event.channel;

    dc2.onmessage = function(evt) {
      fancy_log("Received message: " + evt.data, "blue");
    };
    dc2.onopen = function() {
      clearTimeout(showId);
      fancy_log("pc1 and pc2 are connected successfully, and can send message now!", "black");
    };
    dc2.onclose = function() {
      fancy_log("The connection is closed, stop send message now!", "black");
    };
  };
  pc1.createOffer(requestSuccessed1, requestFailed);
  status();
}

function stop() {
  testFlag.blue = true;
  dc1.close();
  dc2.close();
  pc1.close();
  pc2.close();
  status();
}

$(document).ready(function() {
  DisablePassButton();
  $("#stopbutton").addClass("ui-disabled");
  $("#pc1_send").addClass("ui-disabled");

  $("#startbutton").click(start);
  $("#stopbutton").click(stop);
  $("#pc1_send").click(pc1_send);
});
