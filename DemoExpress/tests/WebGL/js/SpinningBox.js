var g = {}; // globals

var incAngle = 0;
var currentAngle = 0;
var bakAngle = 0;
var viewDistance = 18;
var requestId;

var canvas;


function init() {
    // Initialize
    var gl = initWebGL(
        // The id of the Canvas Element
        "canvas");
    if (!gl) {
        return;
    }

    g.program = simpleSetup(
        gl,
        // The ids of the vertex and fragment shaders
        "vshader", "fshader",
        // The vertex attribute names used by the shaders.
        // The order they appear here corresponds to their index
        // used later.
        [ "vNormal", "vColor", "vPosition"],
        // The clear color and depth values
        [ 0, 0, 0, 1 ], 10000);

    // Set up a uniform variable for the shaders
    gl.uniform3f(gl.getUniformLocation(g.program, "lightDir"), 0, 0, 1);

    // Create a box. On return 'gl' contains a 'box' property with
    // the BufferObjects containing the arrays for vertices,
    // normals, texture coords, and indices.
    g.box = makeBox(gl);

    // Set up the array of colors for the cube's faces
    var colors = new Uint8Array(
        [  0, 0, 1, 1,   0, 0, 1, 1,   0, 0, 1, 1,   0, 0, 1, 1,     // v0-v1-v2-v3 front
        1, 0, 0, 1,   1, 0, 0, 1,   1, 0, 0, 1,   1, 0, 0, 1,     // v0-v3-v4-v5 right
        0, 1, 0, 1,   0, 1, 0, 1,   0, 1, 0, 1,   0, 1, 0, 1,     // v0-v5-v6-v1 top
        1, 1, 0, 1,   1, 1, 0, 1,   1, 1, 0, 1,   1, 1, 0, 1,     // v1-v6-v7-v2 left
        1, 0, 1, 1,   1, 0, 1, 1,   1, 0, 1, 1,   1, 0, 1, 1,     // v7-v4-v3-v2 bottom
        0, 1, 1, 1,   0, 1, 1, 1,   0, 1, 1, 1,   0, 1, 1, 1 ]    // v4-v7-v6-v5 back
        );

    // Set up the vertex buffer for the colors
    g.box.colorObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, g.box.colorObject);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

    // Create some matrices to use later and save their locations in the shaders
    g.mvMatrix = new J3DIMatrix4();
    g.u_normalMatrixLoc = gl.getUniformLocation(g.program, "u_normalMatrix");
    g.normalMatrix = new J3DIMatrix4();
    g.u_modelViewProjMatrixLoc =
    gl.getUniformLocation(g.program, "u_modelViewProjMatrix");
    g.mvpMatrix = new J3DIMatrix4();

    // Enable all of the vertex attribute arrays.
    gl.enableVertexAttribArray(0);
    gl.enableVertexAttribArray(1);
    gl.enableVertexAttribArray(2);

    // Set up all the vertex attributes for vertices, normals and colors
    gl.bindBuffer(gl.ARRAY_BUFFER, g.box.vertexObject);
    gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, g.box.normalObject);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, g.box.colorObject);
    gl.vertexAttribPointer(1, 4, gl.UNSIGNED_BYTE, false, 0, 0);

    // Bind the index array
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, g.box.indexObject);

    return gl;
}

//width = -1;
//height = -1;
//var requestId;

function reshape(gl) {
    //var canvas = document.getElementById('example');
    var canvas = document.getElementById('canvas');
    //var windowWidth = window.innerWidth - 20;
    //var windowHeight = window.innerHeight - 40;
    //if (windowWidth == width && windowHeight == height)
    //    return;

    //width = windowWidth;
    //height = windowHeight;
    //canvas.width = width;
    //canvas.height = height;

    // Set the viewport and projection matrix for the scene
    //gl.viewport(0, 0, width, height);
    gl.viewport(0, 0, canvas.width, canvas.height);
    g.perspectiveMatrix = new J3DIMatrix4();
    //g.perspectiveMatrix.perspective(30, width/height, 1, 10000);
    g.perspectiveMatrix.perspective(30, canvas.width/canvas.height, 1, 10000);
    //g.perspectiveMatrix.lookat(0, 0, 7, 0, 0, 0, 0, 1, 0);
    g.perspectiveMatrix.lookat(0, 0, viewDistance, 0, 0, 0, 0, 1, 0);
}

function drawPicture(gl) {
    // Make sure the canvas is sized correctly.
    reshape(gl);

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    // Clear the canvas
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Make a model/view matrix.
    g.mvMatrix.makeIdentity();
    g.mvMatrix.rotate(20, 1, 0, 0);
    g.mvMatrix.rotate(currentAngle, 0, 1, 0);

    // Construct the normal matrix from the model-view matrix and pass it in
    g.normalMatrix.load(g.mvMatrix);
    g.normalMatrix.invert();
    g.normalMatrix.transpose();
    g.normalMatrix.setUniform(gl, g.u_normalMatrixLoc, false);

    // Construct the model-view * projection matrix and pass it in
    g.mvpMatrix.load(g.perspectiveMatrix);
    g.mvpMatrix.multiply(g.mvMatrix);
    g.mvpMatrix.setUniform(gl, g.u_modelViewProjMatrixLoc, false);

    // Draw the cube
    gl.drawElements(gl.TRIANGLES, g.box.numIndices, gl.UNSIGNED_BYTE, 0);

    currentAngle += incAngle;
    if (currentAngle > 360)
    currentAngle -= 360;
}
