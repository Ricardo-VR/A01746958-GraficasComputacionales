let mat4 = glMatrix.mat4;

let projectionMatrix;

let shaderProgram, shaderVertexPositionAttribute, shaderVertexColorAttribute, shaderProjectionMatrixUniform, shaderModelViewMatrixUniform;

let duration = 10000; // ms

// Attributes: Input variables used in the vertex shader. Since the vertex shader is called on each vertex, these will be different every time the vertex shader is invoked.
// Uniforms: Input variables for both the vertex and fragment shaders. These do not change values from vertex to vertex.
// Varyings: Used for passing data from the vertex shader to the fragment shader. Represent information for which the shader can output different value for each vertex.
let vertexShaderSource =    
    "    attribute vec3 vertexPos;\n" +
    "    attribute vec4 vertexColor;\n" +

    "    uniform mat4 modelViewMatrix;\n" +
    "    uniform mat4 projectionMatrix;\n" +

    "    varying vec4 vColor;\n" +

    "    void main(void) {\n" +
    "		// Return the transformed and projected vertex value\n" +
    "        gl_Position = projectionMatrix * modelViewMatrix * \n" +
    "            vec4(vertexPos, 1.0);\n" +
    "        // Output the vertexColor in vColor\n" +
    "        vColor = vertexColor * 0.8;\n" +
    "    }\n";

// precision lowp float
// This determines how much precision the GPU uses when calculating floats. The use of highp depends on the system.
// - highp for vertex positions,
// - mediump for texture coordinates,
// - lowp for colors.
let fragmentShaderSource = 
    "    precision lowp float;\n" +
    "    varying vec4 vColor;\n" +
    "    void main(void) {\n" +
    "    gl_FragColor = vColor;\n" +
    "}\n";

function main() 
{
    let canvas = document.getElementById("webglcanvas");
    let gl = initWebGL(canvas);
    initViewport(gl, canvas);
    initGL(canvas);
    
    let octa = createOcta(gl, [2.5 , 0, -2], [0, 1, 0]);
    let dodeca = createDodeca(gl, [-2.5, 0, -2], [-0.4, 1, 0.1], [0.0, 1.0, 0.0]);
    let scutoid = createScutoid(gl, [0, 0, 0], [1, 1, 0.2]);
    
    initShader(gl);
    
    run(gl, [octa, dodeca, scutoid]);
}

function initWebGL(canvas)
{
    let gl = null;
    let msg = "Your browser does not support WebGL, " +
        "or it is not enabled by default.";
    try 
    {
        gl = canvas.getContext("experimental-webgl");
    } 
    catch (e)
    {
        msg = "Error creating WebGL Context!: " + e.toString();
    }

    if (!gl)
    {
        alert(msg);
        throw new Error(msg);
    }

    return gl;        
 }

function initViewport(gl, canvas)
{
    gl.viewport(0, 0, canvas.width, canvas.height);
}

function initGL(canvas)
{
    // Create a project matrix with 45 degree field of view
    projectionMatrix = mat4.create();
    
    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 100);
    mat4.translate(projectionMatrix, projectionMatrix, [0, 0, -5]);
}

// Create the vertex, color and index data for a multi-colored cube
function createScutoid(gl, translation, rotationAxis)
{    
    // Vertex Data
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    //Utilizando GeoGebra
    let verts = [
        //Pentagon base
        1, 1, 0, //A
        0.309, 1, 0.95, //B
        -0.809, 1, 0.587, //C
        -0.809, 1, -0.587, //D
        0.309, 1, -0.95, //E

        //Hexagon base
        1, -1, 0, //F
        0.5, -1, 0.866, //G
        -0.5, -1, 0.866, //H
        -1, -1, 0, //I
        -0.5, -1, -0.866, //J
        0.5, -1, - 0.866, //K

        //Quadrilaterals
        0.309, 1, 0.95, //B
        -0.809, 1, 0.587, //C
        -0.5, -1, 0.866, //H
        0.5, -1, 0.866, //G

        1, 1, 0, //A
        0.309, 1, 0.95, //B
        0.5, -1, 0.866, //G
        1, -1, 0, //F

        0.309, 1, -0.95, //E
        1, 1, 0, //A
        1, -1, 0, //F
        0.5, -1, - 0.866, //K

        -0.809, 1, -0.587, //D
        0.309, 1, -0.95, //E
        0.5, -1, - 0.866, //K
        -0.5, -1, -0.866, //J

        -1, 0, 0, //L
        -0.809, 1, -0.587, //D
        -0.5, -1, -0.866, //J
        -1, -1, 0, //I

        -0.809, 1, 0.587, //C
        -1, 0, 0, //L
        -1, -1, 0, //I
        -0.5, -1, 0.866, //H


        //Trianular face
        -0.809, 1, 0.587, //C
        -0.809, 1, -0.587, //D
        -1, 0, 0, //L
       ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    let faceColors = [];

    for(let i = 0; i < 9; i++){
        let face = []

        for(let j = 0; j < 3; j++){
            face.push(Math.random())
        }
        face.push(1.0)

        faceColors.push(face)
    }

    // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the cube's face.
    let vertexColors = [];
    // for (const color of faceColors) 
    // {
    //     for (let j=0; j < 4; j++)
    //         vertexColors.push(...color);
    // }

    let numbFace = 0
    faceColors.forEach(color =>{
        if(numbFace == 0){
            //Vertices in pentagon
            for (let j=0; j < 5; j++)
            vertexColors.push(...color);
        }
        else if(numbFace == 1){
            //Vertices in hexagon
            for (let j=0; j < 6; j++)
            vertexColors.push(...color);
        }
        else if(numbFace == 8){
            //Vertices in traingle
            for (let j=0; j < 3; j++)
            vertexColors.push(...color);
        }
        else{
            //Vertices in quadroateral
            for (let j=0; j < 4; j++)
            vertexColors.push(...color);
        }

        numbFace =+ 1;
    });

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let scutoidIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, scutoidIndexBuffer);

    let scutoidIndices = [
        0, 1, 2,    0, 2, 3,    0, 3, 4,
        5, 6, 7,    5, 7, 8,    5, 8, 9,    5, 9, 10,
        11, 12, 13,     11, 13, 14,
        15, 16, 17,     15, 17, 18,
        19, 20, 21,     19, 21, 22,
        23, 24, 25,     23, 25, 26,
        27, 28, 29,     27, 29, 30,
        31, 32, 33,     31, 33, 34,
        35, 36, 37,
    ];

    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(scutoidIndices), gl.STATIC_DRAW);
    
    let scutoid = {
            buffer: vertexBuffer, colorBuffer:colorBuffer, indices:scutoidIndexBuffer,
            vertSize:3, nVerts:38, colorSize:4, nColors: 38, nIndices:60,
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()
        };

    mat4.translate(scutoid.modelViewMatrix, scutoid.modelViewMatrix, translation);
    mat4.scale(scutoid.modelViewMatrix, scutoid.modelViewMatrix, [0.66, 0.66, 0.66])

    scutoid.update = function()
    {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;
    
        // Rotates a mat4 by the given angle
        // mat4 out the receiving matrix
        // mat4 a the matrix to rotate
        // Number rad the angle to rotate the matrix by
        // vec3 axis the axis to rotate around
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
    };
    
    return scutoid;
}

function createOcta(gl, translation, rotationAxis)
{    
    // Vertex Data
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let h = 1.73

    let verts = [
       //Top half
       0, h, 0,
       1, 0, 1,
       -1, 0, 1,
       
       0, h, 0,
       1, 0, -1,
       1, 0, 1,

       0, h, 0,
       -1, 0, -1,
       1, 0, -1,

       0, h, 0,
       -1, 0, 1,
       -1, 0, -1,

       //Bottom half
       0, -1 * h, 0,
       1, 0, 1,
       -1, 0, 1,
       
       0, -1 * h, 0,
       1, 0, -1,
       1, 0, 1,

       0, -1 * h, 0,
       -1, 0, -1,
       1, 0, -1,

       0, -1 * h, 0,
       -1, 0, 1,
       -1, 0, -1,
       ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    let faceColors = []

    for(let i = 0; i < 8; i++){
        let face = []

        for(let j = 0; j < 3; j++){
            face.push(Math.random())
        }
        face.push(1.0)

        faceColors.push(face)
    }

    // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the cube's face.
    let vertexColors = [];
    // for (const color of faceColors) 
    // {
    //     for (let j=0; j < 4; j++)
    //         vertexColors.push(...color);
    // }
    faceColors.forEach(color =>{
        for (let j=0; j < 3; j++)
            vertexColors.push(...color);
    });

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let octaIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, octaIndexBuffer);

    let octaIndices = [
        0, 1, 2,
        3, 4, 5,
        6, 7, 8,
        9, 10, 11,
        12, 13, 14,
        15, 16, 17,
        18, 19, 20,
        21, 22, 23,
    ];

    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(octaIndices), gl.STATIC_DRAW);
    
    let octa = {
            buffer: vertexBuffer, colorBuffer:colorBuffer, indices:octaIndexBuffer,
            vertSize:3, nVerts:24, colorSize:4, nColors: 24, nIndices:24,
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()
        };

    mat4.translate(octa.modelViewMatrix, octa.modelViewMatrix, translation);
    mat4.scale(octa.modelViewMatrix, octa.modelViewMatrix, [0.66, 0.66, 0.66])

    let stepMovement = 0.05;

    octa.update = function()
    {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;
        
    
        // Rotates a mat4 by the given angle
        // mat4 out the receiving matrix
        // mat4 a the matrix to rotate
        // Number rad the angle to rotate the matrix by
        // vec3 axis the axis to rotate around
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
       
        if(this.modelViewMatrix[13] >= 1.75 || this.modelViewMatrix[13] <= -1.75){
            stepMovement = -1 * stepMovement;
        }
        mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [0, stepMovement, 0]);
    };
    
    return octa;
}

function createDodeca(gl, translation, rotationAxis1, rotationAxis2)
{    
    // Vertex Data
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    /*  Puntos Generados y gráficados con GeoGebra para ver el dodecahedro.
        1, 1, 1, //A
        -1, 1, 1, //B
        1, -1, 1, //C
        1, 1, -1, //D
        -1, -1, 1, //E
        1, -1, -1, //F 
        -1, 1, -1, //G
        -1, -1, -1, //H
        
        0, phi, 1/phi, //I
        0, -phi, 1/phi, //J
        0, -phi, -1/phi, //K
        0, phi, -1/phi, //L

        1/phi, 0, phi, //M
        -1/phi, 0, phi, //N
        1/phi, 0, -phi, //O
        -1/phi, 0, -phi, //P

        phi, 1/phi, 0, //Q
        -phi, 1/phi, 0, //R
        phi, -1/phi, 0, //S
        -phi, -1/phi, 0, //T
    */

    let phi = 1.618;
    /*  El orden de los vertices causa que dos triangulos no se vean.
        No se localizaron antes de eliminar el ploteo de los puntos en
        GeoGebra.
    */
    let verts = [
        1, 1, 1,//A
        0, phi, 1/phi,//I
        -1, 1, 1,//B
        1/phi, 0, phi,//M
        -1/phi, 0, phi,//N

        1, 1, 1, //A
        phi, 1/phi, 0, //Q
        phi, -1/phi, 0, //S
        1, -1, 1, //C
        1/phi, 0, phi, //M
        
        1, -1, 1, //C
        0, -phi, 1/phi, //J
        -1, -1, 1, //E
        -1/phi, 0, phi, //N
        1/phi, 0, phi, //M
        
        -1, -1, 1, //E
        -phi, -1/phi, 0, //T
        -phi, 1/phi, 0, //R
        -1, 1, 1, //B
        -1/phi, 0, phi, //N

        -1, -1, 1, //E
        -phi, -1/phi, 0, //T
        -1, -1, -1, //H
        0, -phi, -1/phi, //K
        0, -phi, 1/phi, //J

        -1, 1, 1, //B
        0, phi, 1/phi, //I
        0, phi, -1/phi, //L
        -1, 1, -1, //G
        -phi, 1/phi, 0, //R

        0, phi, 1/phi, //I
        1, 1, 1, //A
        phi, 1/phi, 0, //Q
        1, 1, -1, //D
        0, phi, -1/phi, //L

        phi, -1/phi, 0, //S
        1, 1, -1, //D
        0, -phi, 1/phi, //J
        0, -phi, -1/phi, //K
        1, -1, -1, //F 

        -phi, -1/phi, 0, //T
        -phi, 1/phi, 0, //R
        -1, 1, -1, //G
        -1/phi, 0, -phi, //P
        -1, -1, -1, //H

        -1, 1, -1, //G
        0, phi, -1/phi, //L
        1, 1, -1, //D
        1/phi, 0, -phi, //O
        -1/phi, 0, -phi, //P

        phi, 1/phi, 0, //Q
        phi, -1/phi, 0, //S
        1, -1, -1, //F 
        1/phi, 0, -phi, //O
        1, 1, -1, //D

        1, -1, -1, //F 
        0, -phi, -1/phi, //K
        -1, -1, -1, //H
        -1/phi, 0, -phi, //P
        1/phi, 0, -phi, //O 
    ];



    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    let faceColors = []

    for(let i = 0; i < 12; i++){
        let face = []

        for(let j = 0; j < 3; j++){
            face.push(Math.random())
        }
        face.push(1.0)

        faceColors.push(face)
    }

    // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the cube's face.
    let vertexColors = [];
    // for (const color of faceColors) 
    // {
    //     for (let j=0; j < 4; j++)
    //         vertexColors.push(...color);
    // }
    faceColors.forEach(color =>{
        for (let j=0; j < 5; j++)
            vertexColors.push(...color);
    });

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let dodecaIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, dodecaIndexBuffer);

    let dodecaIndices = [
        0, 1, 2,    0, 2, 3,    0, 3, 4, //1
        5, 6, 7,    5, 7, 8,    5, 8, 9, //2
        10, 11, 12,    10, 12, 13,    10, 13, 14, //3
        15, 16, 17,    15, 17, 18,    15, 18, 19, //4
        20, 21, 22,    20, 22, 23,    20, 23, 24, //5
        25, 26, 27,    25, 27, 28,    25, 28, 29, //6
        30, 31, 32,    30, 32, 33,    30, 33, 34, //7
        35, 36, 37,    35, 37, 38,    35, 38, 39, //8
        40, 41, 42,    40, 42, 43,    40, 43, 44, //9
        45, 46, 47,    45, 47, 48,    45, 48, 49, //10
        50, 51, 52,    50, 52, 53,    50, 53, 54, //11
        55, 56, 57,    55, 57, 58,    55, 58, 59, //12
    ];

    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(dodecaIndices), gl.STATIC_DRAW);
    
    let dodeca = {
            buffer: vertexBuffer, colorBuffer:colorBuffer, indices:dodecaIndexBuffer,
            vertSize:3, nVerts:60, colorSize:4, nColors: 108, nIndices:108,
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()
        };

    mat4.translate(dodeca.modelViewMatrix, dodeca.modelViewMatrix, translation);
    mat4.scale(dodeca.modelViewMatrix, dodeca.modelViewMatrix, [0.66, 0.66, 0.66])

    dodeca.update = function()
    {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;
    
        // Rotates a mat4 by the given angle
        // mat4 out the receiving matrix
        // mat4 a the matrix to rotate
        // Number rad the angle to rotate the matrix by
        // vec3 axis the axis to rotate around
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis1);
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis2);
    };
    
    return dodeca;
}


function createShader(gl, str, type)
{
    let shader;
    if (type == "fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (type == "vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function initShader(gl)
{
    // load and compile the fragment and vertex shader
    let fragmentShader = createShader(gl, fragmentShaderSource, "fragment");
    let vertexShader = createShader(gl, vertexShaderSource, "vertex");

    // link them together into a new program
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // get pointers to the shader params
    shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPos");
    gl.enableVertexAttribArray(shaderVertexPositionAttribute);

    shaderVertexColorAttribute = gl.getAttribLocation(shaderProgram, "vertexColor");
    gl.enableVertexAttribArray(shaderVertexColorAttribute);
    
    shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "modelViewMatrix");

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
}

function draw(gl, objs) 
{
    // clear the background (with black)
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // set the shader to use
    gl.useProgram(shaderProgram);

    for(i = 0; i< objs.length; i++)
    {
        obj = objs[i];
        // connect up the shader parameters: vertex position, color and projection/model matrices
        // set up the buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
        gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorBuffer);
        gl.vertexAttribPointer(shaderVertexColorAttribute, obj.colorSize, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indices);

        gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
        gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, obj.modelViewMatrix);

        // Draw the object's primitives using indexed buffer information.
        // void gl.drawElements(mode, count, type, offset);
        // mode: A GLenum specifying the type primitive to render.
        // count: A GLsizei specifying the number of elements to be rendered.
        // type: A GLenum specifying the type of the values in the element array buffer.
        // offset: A GLintptr specifying an offset in the element array buffer.
        gl.drawElements(obj.primtype, obj.nIndices, gl.UNSIGNED_SHORT, 0);
    }
}

function run(gl, objs) 
{
    // The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint. The method takes a callback as an argument to be invoked before the repaint.
    requestAnimationFrame(function() { run(gl, objs); });

    draw(gl, objs);

    for(i = 0; i< objs.length; i++)
        objs[i].update();
}