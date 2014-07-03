# Introduction

Basic WebRTC client (for making calls) + server (for brokering
connections), built using peerjs (http://peerjs.com/).

## Pre-requisites

nodejs, bower, npm

## "Build"

    cd server
    npm install
    cd ../client
    bower install

## Running

    # start the server
    cd server
    ./run.sh

    # this displays the IP address of the WebRTC brokering server

    # edit client/app/js/main.js:
    # you need to set the hostIp at the top of the file to
    # the IP address of your server;
    # the clients you are installing on will need to be able
    # to access that IP

    # open client/app/index.html in a browser which supports
    # WebRTC (recent Chrome or Firefox)

    # or package for Crosswalk (7+)
    python make_apk.py --app-root=client/app --app-local-path=index.html --name=WebRTC --package=org.crosswalkproject.samples.webrtc
    # and install on a target

You can use two browser tabs if you like, or a mix of Crosswalk apps
on devices + browsers.

In each client, set a unique caller ID.

Now you can send messages to the other clients or make video calls to
them.

(The recipient IDs for calls or messages are whatever IDs you put into
the client instances.)

## Licenses

This application uses peerjs (both the client and server libraries),
released under an MIT license:

*   Client: https://github.com/peers/peerjs
*   Server: https://github.com/peers/peerjs-server

See LICENSE-MIT-PEERJS.txt for the full license.
