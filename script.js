let gl, shaderProgram, colorLocation;

window.onload = function (){
    const canvas = document.getElementById('glCanvas');
    
    gl = canvas.getContext('webgl');

    if(!gl){
        alert('Unable to initialize WebGL. Your browser may not support it.');
        return;
    }

    gl.clearColor(0.96, 0.76, 0.76, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vsSource = `
        attribute vec4 aVertexPosition;
        void main() {
            gl_Position = aVertexPosition;
        }
    `;

    const fsSource = `
        precision mediump float;
        uniform vec4 uColor;
        void main() {
            gl_FragColor = uColor;
        }
    `;

    shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    const vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    colorLocation = gl.getUniformLocation(shaderProgram, 'uColor');

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = createCircleVertices(0, 0, 0.5, 100);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosition);

    gl.useProgram(shaderProgram);
    gl.uniform4f(colorLocation, 1.0, 1.0, 1.0, 1.0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, positions.length / 2);
};

function createCircleVertices(x, y, radius, segments) {
    const positions = [x, y];

    for(let i = 0; i <= segments; i++){
        const angle = (i * 2 * Math.PI) / segments;
        const w = x + radius * Math.cos(angle);
        const h = y + radius * Math.sin(angle);
        positions.push(w, h);
    }
    return positions;
}

function initShaderProgram(gl, vsSource, fsSource){
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

function loadShader(gl, type, source){
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        alert('error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function changeColor(r, g, b, a){
    gl.useProgram(shaderProgram);
    gl.uniform4f(colorLocation, r, g, b, a);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 102); 
}