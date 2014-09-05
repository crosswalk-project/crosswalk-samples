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
        Liu, yun <yun.liu@archermind.com>
*/

navigator.mediaRenderer.addEventListener('rendererfound', onRendererFound);
navigator.mediaRenderer.addEventListener('rendererlost', onRendererLost);

var renderers = {};
var showId;

var mute=false;
var speed=1.0;
var track=1;
var volume=1.0;
function scanNetwork() {
  clearTimeout(showId);
  emptyContainer('rendererContainer');
  navigator.mediaRenderer.scanNetwork();
  document.getElementById("rendererContainer").innerHTML = "Waitting......";
  showId = setTimeout("show()", 30000);
}

function show() {
  document.getElementById("rendererContainer").innerHTML = "Less than a media renderer can be scaned!";
  clearTimeout(showId);
}

function emptyContainer(id) {
  var container = document.getElementById(id);
  while(container && container.hasChildNodes())
    container.removeChild(container.lastChild);
}

function openURI(id) {
  renderers[id].openURI("../../res/media/w3c/green-at-15.mp4", "");
}

function prefetchURI(id) {
  renderers[id].prefetchURI("../../res/media/w3c/movie_300.mp4", "");
}

function cancel(id) {
  renderers[id].cancel();
}

function play(id) {
  renderers[id].controller.play();
}

function pause(id) {
  renderers[id].controller.pause();
}

function stop(id) {
  renderers[id].controller.stop();
}

function next(id) {
  renderers[id].controller.next();
}

function previous(id) {
  renderers[id].controller.previous();
}

function mute(id) {
  mute = !mute;
  renderers[id].controller.mute(mute);
}

function setSpeed(id) {
  if (speed > 0.9)
    speed = 0.5;
  else
    speed = 1.0;
  renderers[id].controller.setSpeed(speed);
}

function setVolume(id) {
  if (volume > 0.9)
    volume = 0.5;
  else
    volume = 1.0;
  renderers[id].controller.setVolume(volume);
}

function gotoTrack(id) {
  if (track == 1)
    track = 2;
  else
    track = 1;
  var renderer = renderers[id];
  var controller = renderer.controller;
  renderers[id].controller.gotoTrack(track);
}

function addButton(container, event, name, action) {
  var button = document.createElement('button');
  button.innerHTML = name;
  button.id = event.renderer.id;
  button.setAttribute('onclick', action);
  container.appendChild(button);
}

function onRendererFound(event) {
  clearTimeout(showId);
  document.getElementById("rendererContainer").innerHTML = "";
  var container = document.getElementById('rendererContainer');
  var rendererControls = document.createElement('div');
  renderers[event.renderer.id] = event.renderer;
  rendererControls.id = event.renderer.id;
  rendererControls.innerHTML = 'Renderer: ' + event.renderer.friendlyName;
  container.appendChild(rendererControls);

  addButton(rendererControls, event, 'Open', 'openURI(this.id)');
  addButton(rendererControls, event, 'Prefetch', 'prefetchURI(this.id)');
  addButton(rendererControls, event, 'Cancel', 'cancel(this.id)');
  addButton(rendererControls, event, 'Play', 'play(this.id)');
  addButton(rendererControls, event, 'Pause', 'pause(this.id)');
  addButton(rendererControls, event, 'Stop', 'stop(this.id)');
  addButton(rendererControls, event, 'Next', 'next(this.id)');
  addButton(rendererControls, event, 'Previous', 'openURI(this.id)');
  addButton(rendererControls, event, 'Mute', 'mute(this.id)');
  addButton(rendererControls, event, 'setSpeed', 'setSpeed(this.id)');
  addButton(rendererControls, event, 'setVolume', 'setVolume(this.id)');
  addButton(rendererControls, event, 'gotoTrack', 'gotoTrack(this.id)');

}

function onRendererLost(event) {
  var button = document.getElementById(event.id);
  document.removeChild(button);
}

$(document).ready(function() {
  $("#scanbutton").click(scanNetwork);
});
