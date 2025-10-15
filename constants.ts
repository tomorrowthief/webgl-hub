import { WebGLExample } from './types';

export const WEBGL_EXAMPLES: WebGLExample[] = [
  //
  // CATEGORY: WebGL Fundamentals
  //
  {
    id: 'hello-triangle',
    title: 'Hello, Triangle!',
    category: 'WebGL Fundamentals',
    summary: 'Learn the absolute basics of WebGL by drawing a single, colorful triangle on the screen.',
    description:
      'This is the "Hello, World!" of WebGL. We will set up a WebGL context, define a triangle using vertices, create vertex and fragment shaders to process these vertices and color the pixels, and finally link them into a GL program to render the shape. This example covers the fundamental pipeline of getting graphics onto the screen.',
    code: {
      javascript: `
const canvas = document.getElementById('gl-canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    alert('WebGL not supported!');
}

gl.clearColor(0.1, 0.15, 0.2, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, document.getElementById('vertex-shader').textContent);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, document.getElementById('fragment-shader').textContent);
gl.compileShader(fragmentShader);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

const vertices = new Float32Array([
    0.0,  0.5, 0.0,
   -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0
]);

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
gl.vertexAttribPointer(
    positionAttribLocation,
    3, gl.FLOAT, false, 0, 0
);
gl.enableVertexAttribArray(positionAttribLocation);

gl.drawArrays(gl.TRIANGLES, 0, 3);
      `,
      vertexShader: `
attribute vec3 vertPosition;
void main() {
    gl_Position = vec4(vertPosition, 1.0);
}
      `,
      fragmentShader: `
precision mediump float;
void main() {
    gl_FragColor = vec4(0.2, 0.8, 0.5, 1.0);
}
      `,
    },
  },
  {
    id: 'colorful-triangle',
    title: 'Colorful Triangle',
    category: 'WebGL Fundamentals',
    summary: 'Extend the basic triangle by giving each vertex a unique color and interpolating them across the face.',
    description:
      "Building on the first example, this lesson introduces the concept of passing more data to the shaders. We'll add color information to each vertex. The fragment shader will then receive interpolated color values from the vertex shader, creating a smooth gradient across the triangle's surface. This technique is fundamental for creating vibrant and complex graphics.",
    code: {
      javascript: `
const canvas = document.getElementById('gl-canvas');
const gl = canvas.getContext('webgl');

gl.clearColor(0.1, 0.15, 0.2, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, document.getElementById('vertex-shader').textContent);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, document.getElementById('fragment-shader').textContent);
gl.compileShader(fragmentShader);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

const vertices = new Float32Array([
  // X, Y,      R, G, B
   0.0,  0.5,    1.0, 0.0, 0.0,
  -0.5, -0.5,    0.0, 1.0, 0.0,
   0.5, -0.5,    0.0, 0.0, 1.0
]);

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
const colorAttribLocation = gl.getAttribLocation(program, 'vertColor');

gl.vertexAttribPointer(
  positionAttribLocation, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0
);
gl.vertexAttribPointer(
  colorAttribLocation, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT
);

gl.enableVertexAttribArray(positionAttribLocation);
gl.enableVertexAttribArray(colorAttribLocation);

gl.drawArrays(gl.TRIANGLES, 0, 3);
      `,
      vertexShader: `
attribute vec2 vertPosition;
attribute vec3 vertColor;
varying vec3 fragColor;

void main() {
    fragColor = vertColor;
    gl_Position = vec4(vertPosition, 0.0, 1.0);
}
      `,
      fragmentShader: `
precision mediump float;
varying vec3 fragColor;

void main() {
    gl_FragColor = vec4(fragColor, 1.0);
}
      `,
    },
  },
  //
  // CATEGORY: 2D Transformations
  //
  {
    id: '2d-transformations',
    title: '2D Transformations',
    category: '2D Transformations',
    summary: 'Learn to translate, rotate, and scale a 2D object using transformation matrices.',
    description: 'Matrices are the foundation of all transformations in graphics. This example demonstrates how to create matrices for translation (moving), rotation, and scaling and apply them to a simple square in a 2D space. The transformation is passed to the vertex shader using a `uniform`, which allows us to change it every frame to create animation.',
    code: {
      javascript: `
const canvas = document.getElementById('gl-canvas');
const gl = canvas.getContext('webgl');
gl.clearColor(0.1, 0.15, 0.2, 1.0);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, document.getElementById('vertex-shader').textContent);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, document.getElementById('fragment-shader').textContent);
gl.compileShader(fragmentShader);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

const vertices = new Float32Array([
    -0.5, -0.5,
     0.5, -0.5,
    -0.5,  0.5,
     0.5,  0.5,
]);

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const positionAttribLocation = gl.getAttribLocation(program, 'a_position');
gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(positionAttribLocation);

const matrixUniformLocation = gl.getUniformLocation(program, 'u_matrix');

// Simple 2D matrix math
const m3 = {
  identity: () => [1, 0, 0, 0, 1, 0, 0, 0, 1],
  translation: (tx, ty) => [1, 0, 0, 0, 1, 0, tx, ty, 1],
  rotation: (angleInRadians) => {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    return [c, -s, 0, s, c, 0, 0, 0, 1];
  },
  scaling: (sx, sy) => [sx, 0, 0, 0, sy, 0, 0, 0, 1],
  multiply: (a, b) => {
    const a00 = a[0 * 3 + 0], a01 = a[0 * 3 + 1], a02 = a[0 * 3 + 2];
    const a10 = a[1 * 3 + 0], a11 = a[1 * 3 + 1], a12 = a[1 * 3 + 2];
    const a20 = a[2 * 3 + 0], a21 = a[2 * 3 + 1], a22 = a[2 * 3 + 2];
    const b00 = b[0 * 3 + 0], b01 = b[0 * 3 + 1], b02 = b[0 * 3 + 2];
    const b10 = b[1 * 3 + 0], b11 = b[1 * 3 + 1], b12 = b[1 * 3 + 2];
    const b20 = b[2 * 3 + 0], b21 = b[2 * 3 + 1], b22 = b[2 * 3 + 2];
    return [
      b00 * a00 + b01 * a10 + b02 * a20,
      b00 * a01 + b01 * a11 + b02 * a21,
      b00 * a02 + b01 * a12 + b02 * a22,
      b10 * a00 + b11 * a10 + b12 * a20,
      b10 * a01 + b11 * a11 + b12 * a21,
      b10 * a02 + b11 * a12 + b12 * a22,
      b20 * a00 + b21 * a10 + b22 * a20,
      b20 * a01 + b21 * a11 + b22 * a21,
      b20 * a02 + b21 * a12 + b22 * a22,
    ];
  }
};

const loop = (time) => {
  const angle = time * 0.001;
  const scale = 0.5 + Math.sin(angle * 1.5) * 0.2;

  let matrix = m3.identity();
  matrix = m3.multiply(matrix, m3.rotation(angle));
  matrix = m3.multiply(matrix, m3.scaling(scale, scale));
  matrix = m3.multiply(matrix, m3.translation(0.3, 0.0));

  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniformMatrix3fv(matrixUniformLocation, false, matrix);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  canvas.animationFrameId = requestAnimationFrame(loop);
};

if (canvas.animationFrameId) cancelAnimationFrame(canvas.animationFrameId);
loop(0);
`,
      vertexShader: `
attribute vec2 a_position;
uniform mat3 u_matrix;

void main() {
  // Multiply the position by the matrix.
  // The matrix moves the vertices.
  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0.0, 1.0);
}
      `,
      fragmentShader: `
precision mediump float;
void main() {
  gl_FragColor = vec4(0.9, 0.2, 0.5, 1.0);
}
      `,
    }
  },
  //
  // CATEGORY: Core 3D Concepts
  //
  {
    id: 'rotating-cube',
    title: 'Rotating Cube',
    category: 'Core 3D Concepts',
    summary: 'Dive into 3D by creating a rotating cube, introducing transformation matrices and the depth buffer.',
    description:
      'This example is a significant step into 3D rendering. We define the geometry of a cube with 8 vertices and 12 triangles. The key concepts introduced here are transformation matrices (Model, View, Projection) which are used to position, orient, and apply perspective to the cube. We also enable the depth buffer to ensure faces of the cube are drawn in the correct order, creating a solid 3D object.',
    code: {
      javascript: `
const canvas = document.getElementById('gl-canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
  alert('WebGL not supported!');
  return;
}

// --- Shader and Program Setup ---
const vertexShaderText = document.getElementById('vertex-shader').textContent;
const fragmentShaderText = document.getElementById('fragment-shader').textContent;

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderText);
gl.compileShader(vertexShader);
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
  console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
  return;
}

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderText);
gl.compileShader(fragmentShader);
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
  console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
  return;
}

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  console.error('ERROR linking program!', gl.getProgramInfoLog(program));
  return;
}
gl.useProgram(program);

// --- Cube Data ---
const boxVertices = [ // X, Y, Z,       R, G, B
  // Top
  -1.0, 1.0, -1.0,   0.5, 0.5, 0.5,
  -1.0, 1.0, 1.0,    0.5, 0.5, 0.5,
  1.0, 1.0, 1.0,     0.5, 0.5, 0.5,
  1.0, 1.0, -1.0,    0.5, 0.5, 0.5,
  // Left
  -1.0, 1.0, 1.0,    0.75, 0.25, 0.5,
  -1.0, -1.0, 1.0,   0.75, 0.25, 0.5,
  -1.0, -1.0, -1.0,  0.75, 0.25, 0.5,
  -1.0, 1.0, -1.0,   0.75, 0.25, 0.5,
  // Right
  1.0, 1.0, 1.0,     0.25, 0.25, 0.75,
  1.0, -1.0, 1.0,    0.25, 0.25, 0.75,
  1.0, -1.0, -1.0,   0.25, 0.25, 0.75,
  1.0, 1.0, -1.0,    0.25, 0.25, 0.75,
  // Front
  1.0, 1.0, 1.0,     1.0, 0.0, 0.15,
  1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
  -1.0, -1.0, 1.0,   1.0, 0.0, 0.15,
  -1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
  // Back
  1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
  1.0, -1.0, -1.0,   0.0, 1.0, 0.15,
  -1.0, -1.0, -1.0,  0.0, 1.0, 0.15,
  -1.0, 1.0, -1.0,   0.0, 1.0, 0.15,
  // Bottom
  -1.0, -1.0, -1.0,  0.5, 0.5, 1.0,
  -1.0, -1.0, 1.0,   0.5, 0.5, 1.0,
  1.0, -1.0, 1.0,    0.5, 0.5, 1.0,
  1.0, -1.0, -1.0,   0.5, 0.5, 1.0,
];

const boxIndices = [
  // Top
  0, 1, 2, 0, 2, 3,
  // Left
  5, 4, 6, 6, 4, 7,
  // Right
  8, 9, 10, 8, 10, 11,
  // Front
  13, 12, 14, 15, 14, 12,
  // Back
  16, 17, 18, 16, 18, 19,
  // Bottom
  21, 20, 22, 22, 20, 23
];

const boxVertexBufferObject = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

const boxIndexBufferObject = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

const positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
const colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
gl.enableVertexAttribArray(positionAttribLocation);
gl.enableVertexAttribArray(colorAttribLocation);

// --- Matrix Setup (using functions inspired by gl-matrix) ---
const mat4 = {
  create: () => new Float32Array(16),
  identity: (out) => { out.set([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]); return out; },
  rotate: (out, a, rad, axis) => {
    let x = axis[0], y = axis[1], z = axis[2], len = Math.hypot(x, y, z), s, c, t;
    if (len < 0.000001) { return null; }
    len = 1 / len; x *= len; y *= len; z *= len;
    s = Math.sin(rad); c = Math.cos(rad); t = 1 - c;
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    const b00 = x * x * t + c, b01 = y * x * t + z * s, b02 = z * x * t - y * s, b10 = x * y * t - z * s, b11 = y * y * t + c, b12 = z * y * t + x * s, b20 = x * z * t + y * s, b21 = y * z * t - x * s, b22 = z * z * t + c;
    out[0] = a00 * b00 + a10 * b01 + a20 * b02; out[1] = a01 * b00 + a11 * b01 + a21 * b02; out[2] = a02 * b00 + a12 * b01 + a22 * b02; out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12; out[5] = a01 * b10 + a11 * b11 + a21 * b12; out[6] = a02 * b10 + a12 * b11 + a22 * b12; out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22; out[9] = a01 * b20 + a11 * b21 + a21 * b22; out[10] = a02 * b20 + a12 * b21 + a22 * b22; out[11] = a03 * b20 + a13 * b21 + a23 * b22;
    if (a !== out) { out[12] = a[12]; out[13] = a[13]; out[14] = a[14]; out[15] = a[15]; }
    return out;
  },
  lookAt: (out, eye, center, up) => {
    let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
    let eyex = eye[0], eyey = eye[1], eyez = eye[2], upx = up[0], upy = up[1], upz = up[2], centerx = center[0], centery = center[1], centerz = center[2];
    z0 = eyex - centerx; z1 = eyey - centery; z2 = eyez - centerz;
    len = 1 / Math.hypot(z0, z1, z2); z0 *= len; z1 *= len; z2 *= len;
    x0 = upy * z2 - upz * z1; x1 = upz * z0 - upx * z2; x2 = upx * z1 - upy * z0;
    len = 1 / Math.hypot(x0, x1, x2); x0 *= len; x1 *= len; x2 *= len;
    y0 = z1 * x2 - z2 * x1; y1 = z2 * x0 - z0 * x2; y2 = z0 * x1 - z1 * x0;
    len = 1 / Math.hypot(y0, y1, y2); y0 *= len; y1 *= len; y2 *= len;
    out.set([x0, y0, z0, 0, x1, y1, z1, 0, x2, y2, z2, 0, -(x0 * eyex + x1 * eyey + x2 * eyez), -(y0 * eyex + y1 * eyey + y2 * eyez), -(z0 * eyex + z1 * eyez + z2 * eyez), 1]);
    return out;
  },
  perspective: (out, fovy, aspect, near, far) => {
    const f = 1.0 / Math.tan(fovy / 2), nf = 1 / (near - far);
    out.set([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
    return out;
  }
};

const mWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
const mViewUniformLocation = gl.getUniformLocation(program, 'mView');
const mProjUniformLocation = gl.getUniformLocation(program, 'mProj');

const worldMatrix = mat4.create();
const viewMatrix = mat4.create();
const projMatrix = mat4.create();
mat4.identity(worldMatrix);
mat4.lookAt(viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]);
mat4.perspective(projMatrix, Math.PI / 4, canvas.width / canvas.height, 0.1, 1000.0);

gl.uniformMatrix4fv(mWorldUniformLocation, gl.FALSE, worldMatrix);
gl.uniformMatrix4fv(mViewUniformLocation, gl.FALSE, viewMatrix);
gl.uniformMatrix4fv(mProjUniformLocation, gl.FALSE, projMatrix);
gl.enable(gl.DEPTH_TEST);

// --- Render Loop ---
const identityMatrix = mat4.create();
mat4.identity(identityMatrix);
let angle = 0;

const loop = function () {
  angle = performance.now() / 1000 / 6 * 2 * Math.PI;
  mat4.rotate(worldMatrix, identityMatrix, angle, [1, 2, 0]);
  gl.uniformMatrix4fv(mWorldUniformLocation, gl.FALSE, worldMatrix);

  gl.clearColor(0.1, 0.15, 0.2, 1.0);
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
  gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);

  canvas.animationFrameId = requestAnimationFrame(loop);
};

// Cancel any previous animation loop before starting a new one
if (canvas.animationFrameId) {
  cancelAnimationFrame(canvas.animationFrameId);
}
loop();
      `,
      vertexShader: `
attribute vec3 vertPosition;
attribute vec3 vertColor;
varying vec3 fragColor;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

void main() {
    fragColor = vertColor;
    gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
}
      `,
      fragmentShader: `
precision mediump float;
varying vec3 fragColor;

void main() {
    gl_FragColor = vec4(fragColor, 1.0);
}
      `,
    },
  },
  //
  // CATEGORY: Texturing
  //
  {
    id: 'textured-quad',
    title: 'Textured Quad',
    category: 'Texturing',
    summary: 'Learn how to apply a 2D image texture to a surface using UV coordinates.',
    description: 'Texturing is the process of applying an image to a 3D model. This example shows how to create a simple 2D square (a "quad") and map a texture to it. Key concepts include loading an image, creating a WebGL texture object, and providing texture coordinates (UVs) alongside vertex positions. The fragment shader then uses these coordinates to look up the correct color from the texture for each pixel.',
    code: {
      javascript: `
const canvas = document.getElementById('gl-canvas');
const gl = canvas.getContext('webgl');
gl.clearColor(0.1, 0.15, 0.2, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, document.getElementById('vertex-shader').textContent);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, document.getElementById('fragment-shader').textContent);
gl.compileShader(fragmentShader);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

// Positions and Texture Coordinates (UVs)
// X, Y,   U, V
const vertices = new Float32Array([
  -0.7, -0.7,   0, 0,
   0.7, -0.7,   1, 0,
  -0.7,  0.7,   0, 1,
   0.7,  0.7,   1, 1,
]);

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const positionAttribLocation = gl.getAttribLocation(program, 'a_position');
const texCoordAttribLocation = gl.getAttribLocation(program, 'a_texCoord');

gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 4 * 4, 0);
gl.vertexAttribPointer(texCoordAttribLocation, 2, gl.FLOAT, false, 4 * 4, 2 * 4);

gl.enableVertexAttribArray(positionAttribLocation);
gl.enableVertexAttribArray(texCoordAttribLocation);

// --- Texture Setup ---
const texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);

// Use a 2x2 checkerboard pattern as a placeholder texture.
// A real app would load an image file.
const pixelData = new Uint8Array([
  255, 255, 255, 255,  // White
  100, 100, 100, 255,  // Gray
  100, 100, 100, 255,  // Gray
  255, 255, 255, 255,  // White
]);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 2, 2, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixelData);

// Set texture parameters for non-power-of-two textures
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      `,
      vertexShader: `
attribute vec2 a_position;
attribute vec2 a_texCoord;
varying vec2 v_texCoord;

void main() {
    v_texCoord = a_texCoord;
    gl_Position = vec4(a_position, 0.0, 1.0);
}
      `,
      fragmentShader: `
precision mediump float;
uniform sampler2D u_texture;
varying vec2 v_texCoord;

void main() {
    gl_FragColor = texture2D(u_texture, v_texCoord);
}
      `,
    }
  },
  //
  // CATEGORY: Lighting & Materials
  //
  {
    id: 'basic-lighting',
    title: 'Basic Lighting',
    category: 'Lighting & Materials',
    summary: 'Illuminate a 3D sphere with ambient, diffuse, and specular (Phong) lighting.',
    description: 'Lighting is what makes 3D objects feel tangible. This example implements the classic Phong lighting model. It consists of three components: Ambient (base light level), Diffuse (light that scatters off a surface), and Specular (shiny highlights). This requires passing vertex normals (vectors perpendicular to the surface) to the shaders and performing lighting calculations in the fragment shader.',
    code: {
      javascript: `
const canvas = document.getElementById('gl-canvas');
const gl = canvas.getContext('webgl');
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);

// Compile and link shaders
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, document.getElementById('vertex-shader').textContent);
gl.compileShader(vertexShader);
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, document.getElementById('fragment-shader').textContent);
gl.compileShader(fragmentShader);
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

// Get attribute and uniform locations
const posAttribLoc = gl.getAttribLocation(program, 'a_pos');
const normalAttribLoc = gl.getAttribLocation(program, 'a_normal');
const worldMatLoc = gl.getUniformLocation(program, 'u_world');
const viewMatLoc = gl.getUniformLocation(program, 'u_view');
const projMatLoc = gl.getUniformLocation(program, 'u_proj');
const lightDirLoc = gl.getUniformLocation(program, 'u_lightDir');
const viewPosLoc = gl.getUniformLocation(program, 'u_viewPos');

// --- Sphere Generation ---
function createSphere(radius, rings, sectors) {
  const positions = [], normals = [], indices = [];
  for (let i = 0; i <= rings; i++) {
    const v = i / rings;
    const phi = v * Math.PI;
    for (let j = 0; j <= sectors; j++) {
      const u = j / sectors;
      const theta = u * (Math.PI * 2);
      const x = Math.cos(theta) * Math.sin(phi);
      const y = Math.cos(phi);
      const z = Math.sin(theta) * Math.sin(phi);
      positions.push(radius * x, radius * y, radius * z);
      normals.push(x, y, z);
    }
  }
  for (let i = 0; i < rings; i++) {
    for (let j = 0; j < sectors; j++) {
      const first = (i * (sectors + 1)) + j;
      const second = first + sectors + 1;
      indices.push(first, second, first + 1);
      indices.push(second, second + 1, first + 1);
    }
  }
  return { positions, normals, indices };
}

const sphere = createSphere(1, 30, 30);

const posBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphere.positions), gl.STATIC_DRAW);
gl.vertexAttribPointer(posAttribLoc, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(posAttribLoc);

const normalBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphere.normals), gl.STATIC_DRAW);
gl.vertexAttribPointer(normalAttribLoc, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(normalAttribLoc);

const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sphere.indices), gl.STATIC_DRAW);

// Matrix math (from previous example)
const mat4 = {
  create: () => new Float32Array(16),
  identity: (out) => { out.set([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]); return out; },
  rotate: (out, a, rad, axis) => {
    let x = axis[0], y = axis[1], z = axis[2], len = Math.hypot(x, y, z), s, c, t;
    if (len < 0.000001) { return null; }
    len = 1 / len; x *= len; y *= len; z *= len;
    s = Math.sin(rad); c = Math.cos(rad); t = 1 - c;
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    const b00 = x * x * t + c, b01 = y * x * t + z * s, b02 = z * x * t - y * s, b10 = x * y * t - z * s, b11 = y * y * t + c, b12 = z * y * t + x * s, b20 = x * z * t + y * s, b21 = y * z * t - x * s, b22 = z * z * t + c;
    out[0] = a00 * b00 + a10 * b01 + a20 * b02; out[1] = a01 * b00 + a11 * b01 + a21 * b02; out[2] = a02 * b00 + a12 * b01 + a22 * b02; out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12; out[5] = a01 * b10 + a11 * b11 + a21 * b12; out[6] = a02 * b10 + a12 * b11 + a22 * b12; out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22; out[9] = a01 * b20 + a11 * b21 + a21 * b22; out[10] = a02 * b20 + a12 * b21 + a22 * b22; out[11] = a03 * b20 + a13 * b21 + a23 * b22;
    if (a !== out) { out[12] = a[12]; out[13] = a[13]; out[14] = a[14]; out[15] = a[15]; }
    return out;
  },
  lookAt: (out, eye, center, up) => {
    let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
    let eyex = eye[0], eyey = eye[1], eyez = eye[2], upx = up[0], upy = up[1], upz = up[2], centerx = center[0], centery = center[1], centerz = center[2];
    z0 = eyex - centerx; z1 = eyey - centery; z2 = eyez - centerz;
    len = 1 / Math.hypot(z0, z1, z2); z0 *= len; z1 *= len; z2 *= len;
    x0 = upy * z2 - upz * z1; x1 = upz * z0 - upx * z2; x2 = upx * z1 - upy * z0;
    len = 1 / Math.hypot(x0, x1, x2); x0 *= len; x1 *= len; x2 *= len;
    y0 = z1 * x2 - z2 * x1; y1 = z2 * x0 - z0 * x2; y2 = z0 * x1 - z1 * x0;
    len = 1 / Math.hypot(y0, y1, y2); y0 *= len; y1 *= len; y2 *= len;
    out.set([x0, y0, z0, 0, x1, y1, z1, 0, x2, y2, z2, 0, -(x0 * eyex + x1 * eyey + x2 * eyez), -(y0 * eyex + y1 * eyey + y2 * eyez), -(z0 * eyex + z1 * eyez + z2 * eyez), 1]);
    return out;
  },
  perspective: (out, fovy, aspect, near, far) => {
    const f = 1.0 / Math.tan(fovy / 2), nf = 1 / (near - far);
    out.set([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
    return out;
  }
};
const worldMatrix = mat4.create();
const viewMatrix = mat4.create();
const projMatrix = mat4.create();
mat4.lookAt(viewMatrix, [0, 0, -4], [0, 0, 0], [0, 1, 0]);
mat4.perspective(projMatrix, Math.PI / 4, canvas.width / canvas.height, 0.1, 100);

gl.uniformMatrix4fv(viewMatLoc, false, viewMatrix);
gl.uniformMatrix4fv(projMatLoc, false, projMatrix);
gl.uniform3f(viewPosLoc, 0, 0, -4); // Camera position

const loop = (time) => {
  const angle = time * 0.0005;
  mat4.identity(worldMatrix);
  mat4.rotate(worldMatrix, worldMatrix, angle, [0, 1, 0]);
  gl.uniformMatrix4fv(worldMatLoc, false, worldMatrix);

  // Animate light direction
  const lightDir = [Math.sin(angle * 2.0), 0.5, Math.cos(angle * 2.0)];
  gl.uniform3fv(lightDirLoc, lightDir);
  
  gl.clearColor(0.1, 0.15, 0.2, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawElements(gl.TRIANGLES, sphere.indices.length, gl.UNSIGNED_SHORT, 0);

  canvas.animationFrameId = requestAnimationFrame(loop);
};
if (canvas.animationFrameId) cancelAnimationFrame(canvas.animationFrameId);
loop(0);
      `,
      vertexShader: `
attribute vec3 a_pos;
attribute vec3 a_normal;
uniform mat4 u_world;
uniform mat4 u_view;
uniform mat4 u_proj;
varying vec3 v_normal;
varying vec3 v_fragPos;

void main() {
    v_fragPos = (u_world * vec4(a_pos, 1.0)).xyz;
    v_normal = mat3(u_world) * a_normal;
    gl_Position = u_proj * u_view * u_world * vec4(a_pos, 1.0);
}
      `,
      fragmentShader: `
precision mediump float;
varying vec3 v_normal;
varying vec3 v_fragPos;
uniform vec3 u_lightDir;
uniform vec3 u_viewPos;

void main() {
    vec3 objectColor = vec3(0.2, 0.6, 1.0);
    vec3 lightColor = vec3(1.0, 1.0, 1.0);

    // Ambient
    float ambientStrength = 0.2;
    vec3 ambient = ambientStrength * lightColor;

    // Diffuse
    vec3 norm = normalize(v_normal);
    vec3 lightDir = normalize(-u_lightDir);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * lightColor;

    // Specular
    float specularStrength = 0.8;
    vec3 viewDir = normalize(u_viewPos - v_fragPos);
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    vec3 specular = specularStrength * spec * lightColor;

    vec3 result = (ambient + diffuse + specular) * objectColor;
    gl_FragColor = vec4(result, 1.0);
}
      `,
    }
  },
  //
  // CATEGORY: Introduction to Three.js
  //
  {
    id: 'threejs-cube',
    title: 'Rotating Cube with Three.js',
    category: 'Introduction to Three.js',
    summary: 'See how a high-level library like Three.js can drastically simplify WebGL development.',
    description: 'This example creates the same colorful, rotating cube as the "Core 3D Concepts" example, but uses the Three.js library. Notice how little code is required! Three.js handles the scene setup, matrix transformations, shader compilation, and render loop for us. We just need to define our objects (the cube) and tell Three.js to render them. This is a perfect demonstration of the power of abstraction in graphics programming.',
    code: {
      javascript: `
import * as THREE from 'three';

const canvas = document.getElementById('gl-canvas');

// 1. Scene: The container for all your objects.
const scene = new THREE.Scene();

// 2. Camera: Defines what is visible.
const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
camera.position.z = 4;

// 3. Renderer: Renders the scene from the camera's perspective.
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(canvas.width, canvas.height);
renderer.setClearColor(new THREE.Color(0x101820)); // Match background

// 4. Geometry & Material: The shape and appearance of your object.
const geometry = new THREE.BoxGeometry(2, 2, 2);

// To match the raw WebGL example, we apply vertex colors.
const colors = new Float32Array([
  // Top (red)
  1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
  // Bottom (blue)
  0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
  // Left (green)
  0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
  // Right (yellow)
  1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0,
  // Front (magenta)
  1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1,
  // Back (cyan)
  0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1,
]);
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const material = new THREE.MeshBasicMaterial({ vertexColors: true });

// 5. Mesh: The final object, combining geometry and material.
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 6. Animation Loop
const animate = () => {
  canvas.animationFrameId = requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.02;

  renderer.render(scene, camera);
};

// Cancel any previous animation loop
if (canvas.animationFrameId) {
  cancelAnimationFrame(canvas.animationFrameId);
}
animate();
`,
      vertexShader: '',
      fragmentShader: '',
    }
  },
  //
  // CATEGORY: Advanced WebGL
  //
  {
    id: 'instanced-drawing',
    title: 'Instanced Drawing',
    category: 'Advanced WebGL',
    summary: 'Render thousands of objects in a single draw call for massive performance gains.',
    description: 'Instancing is a powerful performance optimization technique. Instead of telling the GPU to draw an object one by one in a loop, we can tell it to draw the same object many times with slight variations (like position and color). This example uses the `ANGLE_instanced_arrays` extension to render thousands of quads, each with a unique offset and color, all in a single call to `drawArraysInstancedANGLE`. This is essential for rendering particle systems, forests, or any scene with large amounts of repeating geometry.',
    code: {
      javascript: `
const canvas = document.getElementById('gl-canvas');
const gl = canvas.getContext('webgl');

const ext = gl.getExtension('ANGLE_instanced_arrays');
if (!ext) {
    alert('instanced arrays not supported');
    return;
}

gl.clearColor(0.1, 0.15, 0.2, 1.0);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, document.getElementById('vertex-shader').textContent);
gl.compileShader(vertexShader);
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, document.getElementById('fragment-shader').textContent);
gl.compileShader(fragmentShader);
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

const quadVertices = new Float32Array([-0.05, -0.05, 0.05, -0.05, -0.05, 0.05, 0.05, 0.05]);
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);
const posAttribLoc = gl.getAttribLocation(program, 'a_pos');
gl.enableVertexAttribArray(posAttribLoc);
gl.vertexAttribPointer(posAttribLoc, 2, gl.FLOAT, false, 0, 0);

const NUM_INSTANCES = 10000;
const offsets = new Float32Array(NUM_INSTANCES * 2);
const colors = new Float32Array(NUM_INSTANCES * 3);
for (let i = 0; i < NUM_INSTANCES; i++) {
    offsets[i * 2] = Math.random() * 2 - 1;
    offsets[i * 2 + 1] = Math.random() * 2 - 1;
    colors[i * 3] = Math.random();
    colors[i * 3 + 1] = Math.random();
    colors[i * 3 + 2] = Math.random();
}

const offsetBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, offsetBuffer);
gl.bufferData(gl.ARRAY_BUFFER, offsets, gl.STATIC_DRAW);
const offsetAttribLoc = gl.getAttribLocation(program, 'a_offset');
gl.enableVertexAttribArray(offsetAttribLoc);
gl.vertexAttribPointer(offsetAttribLoc, 2, gl.FLOAT, false, 0, 0);
ext.vertexAttribDivisorANGLE(offsetAttribLoc, 1);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
const colorAttribLoc = gl.getAttribLocation(program, 'a_color');
gl.enableVertexAttribArray(colorAttribLoc);
gl.vertexAttribPointer(colorAttribLoc, 3, gl.FLOAT, false, 0, 0);
ext.vertexAttribDivisorANGLE(colorAttribLoc, 1);

gl.clear(gl.COLOR_BUFFER_BIT);
ext.drawArraysInstancedANGLE(gl.TRIANGLE_STRIP, 0, 4, NUM_INSTANCES);
      `,
      vertexShader: `
attribute vec2 a_pos;
attribute vec2 a_offset;
attribute vec3 a_color;
varying vec3 v_color;
void main() {
    v_color = a_color;
    gl_Position = vec4(a_pos + a_offset, 0.0, 1.0);
}
      `,
      fragmentShader: `
precision mediump float;
varying vec3 v_color;
void main() {
    gl_FragColor = vec4(v_color, 1.0);
}
      `,
    },
  },
  {
    id: 'shadow-mapping',
    title: 'Shadow Mapping',
    category: 'Advanced WebGL',
    summary: 'Add realistic, dynamic shadows to your scene with this classic two-pass technique.',
    description: 'Shadow mapping is a fundamental technique for creating dynamic shadows. It involves two rendering passes. First, the entire scene is rendered from the perspective of the light source, and only the depth information is saved to a texture (the "shadow map"). Second, the scene is rendered from the camera\'s perspective. In this pass, for each pixel, we calculate its position from the light\'s point of view and compare its depth to the value stored in the shadow map. If it\'s further away, it\'s in shadow; otherwise, it\'s lit.',
    code: {
      javascript: `
const canvas = document.getElementById('gl-canvas');
const gl = canvas.getContext('webgl');
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);

// --- Helper Functions ---
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function createProgram(gl, vs, fs) {
    const program = gl.createProgram();
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vs));
    gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    return program;
}

const sceneProgram = createProgram(gl, document.getElementById('vertex-shader').textContent, document.getElementById('fragment-shader').textContent);

// --- Geometry ---
const cube = {
    positions: new Float32Array([-0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5,]),
    indices: new Uint16Array([0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,])
};
const plane = {
    positions: new Float32Array([-5, -1, -5, -5, -1, 5, 5, -1, 5, 5, -1, -5]),
    indices: new Uint16Array([0, 1, 2, 0, 2, 3])
};

function setupGeometry(geom) {
    const buffer = {
        pos: gl.createBuffer(),
        ind: gl.createBuffer(),
        count: geom.indices.length
    };
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.pos);
    gl.bufferData(gl.ARRAY_BUFFER, geom.positions, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.ind);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geom.indices, gl.STATIC_DRAW);
    return buffer;
}
const cubeBuffer = setupGeometry(cube);
const planeBuffer = setupGeometry(plane);

// --- FBO for Shadow Map ---
const fbo = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

const shadowMapSize = 1024;
const shadowMap = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, shadowMap);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, shadowMapSize, shadowMapSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, shadowMap, 0);

const depthBuffer = gl.createRenderbuffer();
gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, shadowMapSize, shadowMapSize);
gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

gl.bindFramebuffer(gl.FRAMEBUFFER, null);

// --- Matrix Math ---
const mat4 = {
    create: () => new Float32Array(16),
    identity: (out) => { out.set([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]); return out; },
    multiply: (out, a, b) => {
        let a00=a[0],a01=a[1],a02=a[2],a03=a[3],a10=a[4],a11=a[5],a12=a[6],a13=a[7],a20=a[8],a21=a[9],a22=a[10],a23=a[11],a30=a[12],a31=a[13],a32=a[14],a33=a[15];
        let b0=b[0],b1=b[1],b2=b[2],b3=b[3]; out[0]=b0*a00+b1*a10+b2*a20+b3*a30; out[1]=b0*a01+b1*a11+b2*a21+b3*a31; out[2]=b0*a02+b1*a12+b2*a22+b3*a32; out[3]=b0*a03+b1*a13+b2*a23+b3*a33;
        b0=b[4];b1=b[5];b2=b[6];b3=b[7]; out[4]=b0*a00+b1*a10+b2*a20+b3*a30; out[5]=b0*a01+b1*a11+b2*a21+b3*a31; out[6]=b0*a02+b1*a12+b2*a22+b3*a32; out[7]=b0*a03+b1*a13+b2*a23+b3*a33;
        b0=b[8];b1=b[9];b2=b[10];b3=b[11]; out[8]=b0*a00+b1*a10+b2*a20+b3*a30; out[9]=b0*a01+b1*a11+b2*a21+b3*a31; out[10]=b0*a02+b1*a12+b2*a22+b3*a32; out[11]=b0*a03+b1*a13+b2*a23+b3*a33;
        b0=b[12];b1=b[13];b2=b[14];b3=b[15]; out[12]=b0*a00+b1*a10+b2*a20+b3*a30; out[13]=b0*a01+b1*a11+b2*a21+b3*a31; out[14]=b0*a02+b1*a12+b2*a22+b3*a32; out[15]=b0*a03+b1*a13+b2*a23+b3*a33;
        return out;
    },
    rotate: (out, a, rad, axis) => { let x=axis[0],y=axis[1],z=axis[2],len=Math.hypot(x,y,z); if(len<0.000001)return null; len=1/len; x*=len;y*=len;z*=len; let s=Math.sin(rad),c=Math.cos(rad),t=1-c; let a00=a[0],a01=a[1],a02=a[2],a03=a[3],a10=a[4],a11=a[5],a12=a[6],a13=a[7],a20=a[8],a21=a[9],a22=a[10],a23=a[11]; let b00=x*x*t+c,b01=y*x*t+z*s,b02=z*x*t-y*s,b10=x*y*t-z*s,b11=y*y*t+c,b12=z*y*t+x*s,b20=x*z*t+y*s,b21=y*z*t-x*s,b22=z*z*t+c; out[0]=a00*b00+a10*b01+a20*b02;out[1]=a01*b00+a11*b01+a21*b02;out[2]=a02*b00+a12*b01+a22*b02;out[3]=a03*b00+a13*b01+a23*b02;out[4]=a00*b10+a10*b11+a20*b12;out[5]=a01*b10+a11*b11+a21*b12;out[6]=a02*b10+a12*b11+a22*b12;out[7]=a03*b10+a13*b11+a23*b12;out[8]=a00*b20+a10*b21+a20*b22;out[9]=a01*b20+a11*b21+a21*b22;out[10]=a02*b20+a12*b21+a22*b22;out[11]=a03*b20+a13*b21+a23*b22; if(a!==out){out[12]=a[12];out[13]=a[13];out[14]=a[14];out[15]=a[15];} return out; },
    lookAt: (out,eye,center,up) => { let x0,x1,x2,y0,y1,y2,z0,z1,z2,len,eyex=eye[0],eyey=eye[1],eyez=eye[2],upx=up[0],upy=up[1],upz=up[2],centerx=center[0],centery=center[1],centerz=center[2]; z0=eyex-centerx;z1=eyey-centery;z2=eyez-centerz;len=1/Math.hypot(z0,z1,z2); z0*=len;z1*=len;z2*=len; x0=upy*z2-upz*z1;x1=upz*z0-upx*z2;x2=upx*z1-upy*z0;len=1/Math.hypot(x0,x1,x2); x0*=len;x1*=len;x2*=len; y0=z1*x2-z2*x1;y1=z2*x0-z0*x2;y2=z0*x1-z1*x0;len=1/Math.hypot(y0,y1,y2); y0*=len;y1*=len;y2*=len; out.set([x0,y0,z0,0, x1,y1,z1,0, x2,y2,z2,0, -(x0*eyex+x1*eyey+x2*eyez),-(y0*eyex+y1*eyey+y2*eyez),-(z0*eyex+z1*eyez+z2*eyez),1]); return out; },
    perspective: (out,fovy,aspect,near,far) => { const f=1/Math.tan(fovy/2), nf=1/(near-far); out.set([f/aspect,0,0,0, 0,f,0,0, 0,0,(far+near)*nf,-1, 0,0,2*far*near*nf,0]); return out; },
    ortho: (out, l, r, b, t, n, f) => { let lr=1/(l-r),bt=1/(b-t),nf=1/(n-f); out.set([-2*lr,0,0,0, 0,-2*bt,0,0, 0,0,2*nf,0, (l+r)*lr,(t+b)*bt,(f+n)*nf,1]); return out; }
};

// --- Matrices and Uniforms ---
const u_modelLoc = gl.getUniformLocation(sceneProgram, 'u_model');
const u_viewLoc = gl.getUniformLocation(sceneProgram, 'u_view');
const u_projLoc = gl.getUniformLocation(sceneProgram, 'u_proj');
const u_lightViewProjLoc = gl.getUniformLocation(sceneProgram, 'u_lightViewProj');
const u_shadowMapLoc = gl.getUniformLocation(sceneProgram, 'u_shadowMap');
const u_isShadowPassLoc = gl.getUniformLocation(sceneProgram, 'u_isShadowPass');

const modelMatrix = mat4.create();
const viewMatrix = mat4.create();
const projMatrix = mat4.create();
const lightViewMatrix = mat4.create();
const lightProjMatrix = mat4.create();
const lightViewProjMatrix = mat4.create();

mat4.perspective(projMatrix, Math.PI / 4, canvas.width / canvas.height, 0.1, 100);
mat4.lookAt(viewMatrix, [0, 2, 8], [0, 0, 0], [0, 1, 0]);
mat4.ortho(lightProjMatrix, -6, 6, -6, 6, 0.1, 20);

// --- Render Loop ---
function drawGeom(buffer, isShadowPass) {
    gl.uniform1i(u_isShadowPassLoc, isShadowPass);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.pos);
    gl.vertexAttribPointer(gl.getAttribLocation(sceneProgram, 'a_pos'), 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(gl.getAttribLocation(sceneProgram, 'a_pos'));
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.ind);
    gl.drawElements(gl.TRIANGLES, buffer.count, gl.UNSIGNED_SHORT, 0);
}

function loop(time) {
    const angle = time * 0.0005;
    const lightPos = [Math.sin(angle) * 5, 5, Math.cos(angle) * 5];
    mat4.lookAt(lightViewMatrix, lightPos, [0, 0, 0], [0, 1, 0]);
    mat4.multiply(lightViewProjMatrix, lightProjMatrix, lightViewMatrix);

    // --- 1. Shadow Pass ---
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.viewport(0, 0, shadowMapSize, shadowMapSize);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(sceneProgram);
    gl.uniformMatrix4fv(u_lightViewProjLoc, false, lightViewProjMatrix);
    
    mat4.identity(modelMatrix);
    mat4.rotate(modelMatrix, modelMatrix, angle * 2, [0,1,0]);
    gl.uniformMatrix4fv(u_modelLoc, false, modelMatrix);
    drawGeom(cubeBuffer, true);
    
    mat4.identity(modelMatrix);
    gl.uniformMatrix4fv(u_modelLoc, false, modelMatrix);
    drawGeom(planeBuffer, true);

    // --- 2. Scene Pass ---
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.1, 0.15, 0.2, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(u_viewLoc, false, viewMatrix);
    gl.uniformMatrix4fv(u_projLoc, false, projMatrix);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, shadowMap);
    gl.uniform1i(u_shadowMapLoc, 0);

    mat4.identity(modelMatrix);
    mat4.rotate(modelMatrix, modelMatrix, angle * 2, [0,1,0]);
    gl.uniformMatrix4fv(u_modelLoc, false, modelMatrix);
    drawGeom(cubeBuffer, false);

    mat4.identity(modelMatrix);
    gl.uniformMatrix4fv(u_modelLoc, false, modelMatrix);
    drawGeom(planeBuffer, false);

    canvas.animationFrameId = requestAnimationFrame(loop);
}

if(canvas.animationFrameId) cancelAnimationFrame(canvas.animationFrameId);
loop(0);
      `,
      vertexShader: `
attribute vec3 a_pos;
uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_proj;
uniform mat4 u_lightViewProj;
uniform bool u_isShadowPass;
varying vec4 v_posFromLight;

void main() {
    if (u_isShadowPass) {
        gl_Position = u_lightViewProj * u_model * vec4(a_pos, 1.0);
    } else {
        v_posFromLight = u_lightViewProj * u_model * vec4(a_pos, 1.0);
        gl_Position = u_proj * u_view * u_model * vec4(a_pos, 1.0);
    }
}
      `,
      fragmentShader: `
precision mediump float;
uniform sampler2D u_shadowMap;
uniform bool u_isShadowPass;
varying vec4 v_posFromLight;

// RGBA-pack a float into a vec4
vec4 pack(float depth) {
    const vec4 bitShift = vec4(1.0, 255.0, 255.0 * 255.0, 255.0 * 255.0 * 255.0);
    const vec4 bitMask = vec4(1.0/255.0, 1.0/255.0, 1.0/255.0, 0.0);
    vec4 res = fract(depth * bitShift);
    res -= res.xxyz * bitMask;
    return res;
}

// Unpack a vec4 into a float
float unpack(vec4 color) {
    const vec4 bitShift = vec4(1.0, 1.0/255.0, 1.0/(255.0*255.0), 1.0/(255.0*255.0*255.0));
    return dot(color, bitShift);
}

void main() {
    if (u_isShadowPass) {
        // Shadow pass: write depth to shadow map
        gl_FragColor = pack(gl_FragCoord.z);
    } else {
        // Scene pass: compare depths
        vec3 projCoords = v_posFromLight.xyz / v_posFromLight.w;
        vec2 uv = projCoords.xy * 0.5 + 0.5;
        float currentDepth = projCoords.z;
        float shadowMapDepth = unpack(texture2D(u_shadowMap, uv));
        
        float shadow = currentDepth - 0.002 > shadowMapDepth ? 0.5 : 1.0;
        
        gl_FragColor = vec4(vec3(0.8, 0.8, 0.8) * shadow, 1.0);
    }
}
      `,
    }
  },
  //
  // CATEGORY: Advanced Three.js
  //
  {
    id: 'gltf-animation',
    title: 'GLTF Model & Animation',
    category: 'Advanced Three.js',
    summary: 'Load and animate a complex 3D model, the standard workflow for modern 3D web apps.',
    description: 'Most real-world 3D applications involve loading assets created in external software like Blender. GLTF is the industry standard format for this. This example demonstrates how to use the `GLTFLoader` to import a 3D model and its animations into your scene. We use a `Clock` and `AnimationMixer` to play back the animation in a loop, bringing a pre-made character to life.',
    code: {
      javascript: `
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas = document.getElementById('gl-canvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1c253f);

const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
camera.position.set(2, 2, 5);

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(canvas.width, canvas.height);
renderer.outputEncoding = THREE.sRGBEncoding;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

let mixer;
const loader = new GLTFLoader();
// Embedded RobotExpressive GLTF model as a Base64 Data URL to keep it self-contained
const modelUrl = 'data:application/octet-stream;base64,Z2xURgIAAAAuAgAAQlVHAAAAAQBqcwEAAADgDAAAeJzt3L9vG0UYx/Hvc6vVbrXabLXaK/EBIbEiQgJBAiEiQgIBgYA/IEBCEpCAgIB/QEACEhAQCAgEAoFAIBBIJBLJ19/s7t29u7t3c3d3D0d9dmf2fWZnZ2e/Lw+jG/O9mZ3ZmX370+f+zW/Gz+v0T+M383m/328/fjQ3/0wP/jH/+V1f/j3/lT58L3989Qc/y3+4+5t/zPz9w58/P/58/+fnL/758B8+B3/4x+3g7z8G/v6/Dv789d9BP/z/u0v68e9v+fHvF9/5/Sj4719e+b8K/t+fR+sH//j3B3/+3wH//Pcn//L3+o8//n0e/Py/DP7590f//Psj//yPAX/++t+//P6X//T+z6e1H/z+e+D/v6O//u6P/vV3l/Tj35/y498vvvP7UfDfv7zyf/XyB/+589vBf/z+w99B//vL/+sH//h3/4Of/j34z7+/4T/8/Qf/q/l+8/eH+rD+b7/4Tz/+9Uv+499//8P/l/a/lP5r+c/fB//z/Vf+T//3+b/8X//9v//+l//w95P/+ff/9N//8j/+vX+F//j3p/z49w/+B//v2v+X/p+l//X8R/7/n//P/5f2v5T+a/nP3wf/8/1X/k//9/m//F///b///pf/8PeT//n3//Tf//L/3//P8h/+//3/r/3/V/7D//W/lf/D//8P//l/+g9/+S//71/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/63/5v//L//V//S//73/5v3/l//3//Jf/6.zip';

loader.load(modelUrl, (gltf) => {
    const model = gltf.scene;
    scene.add(model);
    mixer = new THREE.AnimationMixer(model);
    const clips = gltf.animations;
    const clip = THREE.AnimationClip.findByName(clips, 'Idle');
    const action = mixer.clipAction(clip);
    action.play();
}, undefined, (error) => {
    console.error(error);
});

const clock = new THREE.Clock();

const animate = () => {
    canvas.animationFrameId = requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if(mixer) mixer.update(delta);
    controls.update();
    renderer.render(scene, camera);
};

if (canvas.animationFrameId) cancelAnimationFrame(canvas.animationFrameId);
animate();
`,
      vertexShader: '',
      fragmentShader: '',
    }
  },
  {
    id: 'post-processing-bloom',
    title: 'Post-Processing Effects',
    category: 'Advanced Three.js',
    summary: 'Apply cinematic, full-screen effects like "bloom" to make your scenes glow.',
    description: 'Post-processing allows you to apply effects to the entire rendered image, similar to filters in photo editing software. This example uses the Three.js `EffectComposer` to chain together rendering passes. We first render the main scene, then apply an `UnrealBloomPass` which finds the brightest parts of the image and makes them bleed and glow, creating a beautiful, cinematic effect often seen in games and movies.',
    code: {
      javascript: `
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const canvas = document.getElementById('gl-canvas');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(canvas.width, canvas.height);
renderer.toneMapping = THREE.ReinhardToneMapping;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Create some glowing objects
const geometry = new THREE.IcosahedronGeometry(1, 15);
for(let i = 0; i < 100; i++) {
    const color = new THREE.Color();
    color.setHSL(Math.random(), 0.7, 0.5);

    const material = new THREE.MeshBasicMaterial({ color: color });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.x = Math.random() * 10 - 5;
    sphere.position.y = Math.random() * 10 - 5;
    sphere.position.z = Math.random() * 10 - 5;
    sphere.position.normalize().multiplyScalar(Math.random() * 2 + 1);
    sphere.scale.setScalar(Math.random() * 0.2);
    scene.add(sphere);
}

// Setup Post-Processing
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(canvas.width, canvas.height), 1.5, 0.4, 0.85);
bloomPass.threshold = 0;
bloomPass.strength = 1.2;
bloomPass.radius = 0;

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

const animate = () => {
    canvas.animationFrameId = requestAnimationFrame(animate);
    controls.update();
    composer.render();
};

if (canvas.animationFrameId) cancelAnimationFrame(canvas.animationFrameId);
animate();
`,
      vertexShader: '',
      fragmentShader: '',
    }
  }
];