/* Copyright (c) 2014 Intel Corporation. All rights reserved.
 * Use of this source code is governed by an Apache v2 license that can be
 * found in the LICENSE-APACHE-V2 file. */

/*
AudioFs extension

exports listFiles() and listFilesAsync(),
which return or resolve to (respectively) a response object:

   {
     id: "<call id>",
     success: true | false,
     files: []
   }

files is an array of file objects on the device in format:
[{title: ..., artist: ..., path: ...}, ...]
*/

// provides a unique ID for each async call to the extension
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
  // counter contains a unique request ID for this invocation
  counter += 1;

  return new Promise(function (resolve, reject) {
    // associate the request ID with the method which will be invoked
    // if the request is successful
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
  // you MUST pass a string to sendSyncMessage(), even if it's empty
  var result = extension.internal.sendSyncMessage('');
  return JSON.parse(result);
};
