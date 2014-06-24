/* Copyright (c) 2014 Intel Corporation. All rights reserved.
 * Use of this source code is governed by an Apache v2 license that can be
 * found in the LICENSE-APACHE-V2 file. */

/*
echoAsync() and echo() resolve to/return an object (respectively)
with the form:

{
  id: '<request ID>',
  content: '<content of reply from Java extension code>'
}
*/

// provides a unique ID for each call to the extension
var counter = 0;

// map from a request ID to a callback for the response
var successCbs = {};

// private method for building the message object and converting it
// to a JSON string for transfer to the Java part of the extension
var messageToJson = function (counter, message) {
  var obj = {
    id: '' + counter,
    content: message
  };

  return JSON.stringify(obj);
};

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
exports.echoAsync = function (message) {
  counter += 1;
  var messageJson = messageToJson(counter, message);

  return new Promise(function (resolve, reject) {
    successCbs[counter] = resolve;

    // NB you MUST pass a string to postMessage()
    try {
      extension.postMessage(messageJson);
    }
    catch (e) {
      reject(e);
    }
  });
};

// returns a Response object
exports.echo = function (message) {
  counter += 1;
  var messageJson = messageToJson(counter, message);

  // NB you MUST pass a string to sendSyncMessage()
  var result = extension.internal.sendSyncMessage(messageJson);

  return JSON.parse(result);
};
