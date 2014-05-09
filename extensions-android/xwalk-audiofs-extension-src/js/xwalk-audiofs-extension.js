/* Copyright (c) 2014 Intel Corporation. All rights reserved.
 * Use of this source code is governed by an Apache v2 license that can be
 * found in the LICENSE-APACHE-V2 file. */

// returns an array of file objects on the device in format:
// [{title: ..., artist: ..., path: ...}, ...]
// the path property is a playable URI if inserted into an <audio> element
// as the src attribute

// provides a unique ID for each call to the extension
var counter = 0;

// map from a request ID to a callback for the response
var successCbs = {};

// message listener for ALL messages; this invokes the correct
// callback depending on the ID in the message
extension.setMessageListener(function (message) {
  var data = JSON.parse(message);
  var cb = successCbs[data.id];

  if (cb) {
    cb(data);
    delete successCbs[data.id];
  }
});

// returns a promise which resolves to an array of file objects, or
// rejects with an error if the call to the extension fails
exports.listFilesAsync = function () {
  counter += 1;

  return new Promise(function (resolve, reject) {
    successCbs[counter] = resolve;

    // you MUST pass a string to postMessage()
    try {
      extension.postMessage('' + counter);
    }
    catch (e) {
      reject(e);
    }
  });
};

// returns an array of file objects
exports.listFiles = function () {
  var result = extension.internal.sendSyncMessage('');
  return JSON.parse(result);
};
