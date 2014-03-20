/*
Copyright (c) 2014 Intel Corporation. All rights reserved.
Use of this source code is governed by a MIT-style license that can be
found in the LICENSE file. 

Based on http://threejs.org/examples/canvas_geometry_cube.html

The following notice pertains to Three.js:

The MIT License

Copyright (c) 2010-2013 three.js authors

Permission is hereby granted, free of charge, to any person obtaining a 
copy of this software and associated documentation files (the 
"Software"), to deal in the Software without restriction, including 
without limitation the rights to use, copy, modify, merge, publish, 
distribute, sublicense, and/or sell copies of the Software, and to 
permit persons to whom the Software is furnished to do so, subject to 
the following conditions:

The above copyright notice and this permission notice shall be included 
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS 
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY 
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
document.addEventListener ('DOMContentLoaded', function () {
    var camera, scene, renderer;

	var cube, plane;

	var targetRotation = 0;
	var targetRotationOnMouseDown = 0;

	var mouseX = 0;
	var mouseXOnMouseDown = 0;

	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;
    
    var auto_timer = 0;

    init();
    animate();
    
    function init() {
        renderer = new THREE.WebGLRenderer ();
        renderer.setSize (window.innerWidth, window.innerHeight);
        document.body.appendChild (renderer.domElement);
        
        camera = new THREE.PerspectiveCamera (
            70, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.y = 150;
        camera.position.z = 500;
        
        scene = new THREE.Scene();
        
        // Cube
        var geometry = new THREE.CubeGeometry (200, 200, 200);
        
        var texture = THREE.ImageUtils.loadTexture ('textures/crosswalk.png');
        texture.anisotropy = renderer.getMaxAnisotropy ();
        
        var material = new THREE.MeshBasicMaterial ( { map: texture } );
        
        cube = new THREE.Mesh (geometry, material);
        cube.position.y = 150;
        scene.add( cube );
        
        // Plane
        var geometry = new THREE.PlaneGeometry (180, 180);
        geometry.applyMatrix (new THREE.Matrix4 ().makeRotationX (-Math.PI / 2));

        var material = new THREE.MeshBasicMaterial ( { color: 0xde613e } );

        plane = new THREE.Mesh (geometry, material);
        scene.add (plane);

        document.addEventListener ('mousedown', onDocumentMouseDown, false);
        document.addEventListener ('touchstart', onDocumentTouchStart, false);
        document.addEventListener ('touchmove', onDocumentTouchMove, false);

        // Generic setup
        
        window.addEventListener ('resize', onWindowResize, false);
    }
    
    function onWindowResize () {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix ();
        renderer.setSize (window.innerWidth, window.innerHeight);
    }
    
    function stopAutoRotate () {
        if (auto_timer)
            window.clearTimeout (auto_timer);
        auto_timer = window.setTimeout (startAutoRotate, 1000);
    }
            
    function startAutoRotate () {
        auto_timer = 0;
    }
    
    function animate () {
        requestAnimationFrame (animate);
        plane.rotation.y = cube.rotation.y += (targetRotation - cube.rotation.y) * 0.05;
        if (auto_timer == 0) {
            targetRotation += 0.025;
        }
        renderer.render (scene, camera);
    }
    
    function onDocumentMouseDown (e) {
        e.preventDefault();
        document.addEventListener ('mousemove', onDocumentMouseMove, false);
        document.addEventListener ('mouseup', onDocumentMouseUp, false);
        document.addEventListener ('mouseout', onDocumentMouseOut, false);
        mouseXOnMouseDown = e.clientX - windowHalfX;
        targetRotationOnMouseDown = targetRotation;
        stopAutoRotate ();
    }

    function onDocumentMouseMove (e) {
        mouseX = e.clientX - windowHalfX;
        targetRotation = targetRotationOnMouseDown + 
            (mouseX - mouseXOnMouseDown) * 0.02;
        stopAutoRotate ();
    }

    function onDocumentMouseUp (e) {
        document.removeEventListener ('mousemove', onDocumentMouseMove, false);
        document.removeEventListener ('mouseup', onDocumentMouseUp, false);
        document.removeEventListener ( 'mouseout', onDocumentMouseOut, false);
        stopAutoRotate ();
    }

    function onDocumentMouseOut (e) {
        document.removeEventListener ('mousemove', onDocumentMouseMove, false);
        document.removeEventListener ('mouseup', onDocumentMouseUp, false);
        document.removeEventListener ('mouseout', onDocumentMouseOut, false);
        stopAutoRotate ();
    }

    function onDocumentTouchStart (e) {
        if (e.touches.length === 1) {
            e.preventDefault ();
            mouseXOnMouseDown = e.touches[ 0 ].pageX - windowHalfX;
            targetRotationOnMouseDown = targetRotation;
            stopAutoRotate ();
        }
    }

    function onDocumentTouchMove (e) {
        if (e.touches.length === 1) {
            e.preventDefault ();
            mouseX = e.touches[0].pageX - windowHalfX;
            targetRotation = targetRotationOnMouseDown + 
                (mouseX - mouseXOnMouseDown) * 0.05;
            stopAutoRotate ();
        }
    }
});