## Introduction

DemoExpress demostrate how to use Web API in Crosswalk application and development based on JQuery framework, including:
* `Runtime & Packaging`: app uri
* `Multimedia & Graphics`: 
  * CSS3 APIs; 
  * Graphics related APIs: cavas, svg; 
  * Muti-Media related APIs: html audio/video, media query, web RTC. 
* `Networking & Storage`:
  * Networking related APIs: web messaging, web speech,
  * Storage related APIs: web storage, index DB, web SQL, session history, 
  * File related APIs: file API, File directory & system, file writer 
* `Performance & Optimization`: Navigation timing, PageVisibility, Resource Timing, Animation Timing, Typed Arrary, Workers,ViewPort...
* `Device & Hardware`: screen orientation, device orientation, browser status, gamepad, WebGL, LocationGPS, media capture, touch, vibration, web notificaiton...
* `Socail` : contacts
* `Experimental` : Device Capability, Presentation, SIMD,    
* `Security` : CSP, Sandbox,
* `UI` : clipboard, drag&drop,
* `Others` : DLNA media server, DLNA media renderer, NFC,

More information about API support in Crosswalk, see https://crosswalk-project.org/#documentation/apis/web_apis

## Prerequisite
*   Python >=2.7 
*   Following the instructions to set up the Crosswalk build enviornment for tizen or android at https://crosswalk-project.org/#documentation/getting_started  
*   Set up the DLNA server (e.g. dleyna server) before running DLNA samples(`media server`, `media renderer`), details at https://github.com/01org/cloud-dleyna/wiki.

## Building
* Run pack.py to pack DemoExpress package, e.g.: 

    ./pack.py -t apk -m embedded -a x86 --tools= $PATH_TO_CROSSWALK

* Check full options of `pack.py` by `--help` option.
* You are ready to install and run DemoExpress(in zip package) on a target device.

## Organization
* Organize and filter the samples with tests.xml. 
* 2 samples are available:
 * `tests.tizen.xml` filter the APIs and features supported on Tizen platform.
 * `tests.android.xml` fliter the APIs and features supported on Android platform.
* Update tests.xml to make user customized samples filter. 

## LICENSE

Except as noted in `COPYING` and/or `NOTICE` files, or as headed with license
info, test suite source code uses a BSD-3-Clause license that can be found in the
`LICENSE.BSD-3` file.


