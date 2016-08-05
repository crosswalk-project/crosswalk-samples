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
        Wang, Hongjuan <hongjuanx.wang@intel.com>

*/

navigator.mediaServer.addEventListener('serverfound', onServerFound);

var servers = {};

function scanNetwork() {
  emptyContainer('serverContainer');
  navigator.mediaServer.scanNetwork();
}

function getServerId() {
  return document.getElementById('serverContainer').serverId;
}

function browseRootContainer(id) {
  document.getElementById('serverContainer').serverId = id;
  browseContainer(servers[id].root.id);
}

function browseContainer(id) {
  emptyContainer('mediaObjectsContainer');
  var server = servers[getServerId()];
  server.browse(id, '', 0 , 0).then(listMediaObjects);
 }

function searchContainer(id) {
  emptyContainer('mediaObjectsContainer');
  document.getElementById('serverContainer').serverId = id;
  var server = servers[id];
  var selectedIndex = document.getElementById('searchParameter').selectedIndex;
  var selectedParameter = document.getElementById('searchParameter').options[selectedIndex].text;
  var searchValue = document.getElementById('searchField').value;
  var query = selectedParameter + ' contains ' + '"' + searchValue + '"';
  server.find(server.root.id, query, '', 0, 0).then(listMediaObjects);
}

function listMediaObjects(response) {
  var container = document.getElementById('mediaObjectsContainer');
  for(var i = 0; i < response.length; i++) {
    if(response[i].type === 'container')
      addMediaContainerObject(response[i]);
    else
      addMediaItemObject(response[i]);
  }
}

function addMediaContainerObject(obj) {
  var container = document.getElementById('mediaObjectsContainer');
  var newElement = document.createElement('button');
  newElement.id = obj.id;
  newElement.innerHTML = 'Browse  ' + obj.title;
  newElement.setAttribute('onclick', 'browseContainer(this.id)');
  container.appendChild(newElement);
}

function addMediaItemObject(obj) {
  var container = document.getElementById('mediaObjectsContainer');
  var newElement = document.createElement('div');
  newElement.innerHTML = obj.title;
  container.appendChild(newElement);

  if (obj.type === 'image') {
    var img = document.createElement('img');
    img.setAttribute('src', obj.sourceUri);
    img.setAttribute('height', obj.height);
    img.setAttribute('width', obj.width);
    container.appendChild(img);
  } else if (obj.type === 'audio' || obj.type === 'music') {
    var audio = document.createElement('audio');
    audio.src = obj.sourceUri;
    audio.controls=true;
    container.appendChild(audio);
  } else if (obj.type === 'video') {
    var video = document.createElement('video');
    video.src = obj.sourceUri;
    video.controls = true;
    video.style.height = "100px";
    video.style.width = "200px";
    container.appendChild(video);
  }
}

function emptyContainer(id) {
  var container = document.getElementById(id);
  while(container.hasChildNodes())
    container.removeChild(container.lastChild);
}

function onServerFound(event) {
  var container = document.getElementById('serverContainer');
  var browseButton = document.createElement('button');
  servers[event.server.id] = event.server;
  browseButton.id = event.server.id;
  browseButton.innerHTML = 'Browse root container of ' + event.server.friendlyName;
  browseButton.setAttribute('onclick', 'browseRootContainer(this.id)');
  container.appendChild(browseButton);
}
