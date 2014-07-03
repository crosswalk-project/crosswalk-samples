# Introduction

Basic WebRTC client (for making calls) + server (for brokering
connections), built using peerjs (http://peerjs.com/).

## Pre-requisites

nodejs, npm

## "Build"

    cd server
    npm install

## Running

    # start the server
    ./run.sh

    # this displays the IP address of the WebRTC brokering server;
    # to keep the application simple, this is hard-coded into
    # the clients

    # edit client/app/js/main.js:
    # you need to set the SERVER_IP at the top of the file to
    # the IP address of your server;
    # the clients you are installing on will need to be able
    # to access that IP

    # open client/app/index.html in a browser which supports
    # WebRTC (recent Chrome or Firefox)

    # or package for Crosswalk (7+)
    python make_apk.py --app-root=client/app --app-local-path=index.html --name=WebRTC --package=org.crosswalkproject.samples.webrtc
    # then install on an Android target

You can use two browser tabs if you like, or a mix of Crosswalk apps
on devices + browsers.

In each client, set a unique caller ID.

Now you can send messages to the other clients or make video calls to
them.

(The recipient IDs for calls or messages are whatever IDs you put into
the client instances.)

## Licenses

This application uses **peerjs** (both the client and server libraries),
released under an MIT license:

*   Client: https://github.com/peers/peerjs
*   Server: https://github.com/peers/peerjs-server

See LICENSE-MIT-PEERJS.txt for the full license. Note that only the
peerjs client library is distributed with this project.

The server part also uses the nodejs **ip** library, released under an
MIT license:

*   ip: https://github.com/indutny/node-ip

See LICENSE-MIT-IP.txt for the full license.
