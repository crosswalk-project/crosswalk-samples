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
var newBattery = navigator.battery||navigator.webkitBattery;

function init(){
  var canvas=document.getElementById('myCanvas');
  var ctx=canvas.getContext('2d');
  var end_x = 0;
  if (newBattery != undefined && newBattery.level != undefined) {
    end_x = newBattery.level * 200;
    $("#charging").html("Charging status: " + newBattery.charging ? 'charging' : 'not charging');
    $("#charging").html("Discharging time: " + newBattery.dischargingTime / 60);
  }
  ctx.fillStyle="#CCCCCC";
  ctx.fillRect(40, 50, 200, 100);
  ctx.fillRect(240, 85, 10, 30);
  ctx.fillStyle="#33CC00";
  ctx.fillRect(40, 50, end_x, 100);
}

window.onload = init;

newBattery.addEventListener('levelchange', function () {
  var canvas=document.getElementById('myCanvas');
  var ctx=canvas.getContext('2d');
  var end_x = 0;
  if (newBattery != undefined && newBattery.level != undefined) {
    end_x = newBattery.level * 200;
    $("#charging").html("Charging status: " + newBattery.charging ? 'charging' : 'not charging');
    $("#charging").html("Discharging time: " + newBattery.dischargingTime / 60);
  }
  ctx.fillStyle="#CCCCCC";
  ctx.fillRect(40, 50, 200, 100);
  ctx.fillRect(240, 85, 10, 30);
  ctx.fillStyle="#33CC00";
  ctx.fillRect(40, 50, end_x, 100);
}, false);

newBattery.addEventListener('chargingchange', function () {
  $("#charging").html("Charging status: " + newBattery.charging ? 'charging' : 'not charging');
}, false);

newBattery.addEventListener('dischargingtimechange', function () {
  $("#charging").html("Discharging time: " + newBattery.dischargingTime / 60);
}, false);
