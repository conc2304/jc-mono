import type { ProjectionCorners } from '@jc/of-control-protocol';

const GRID = 16; // 16×16 vertex grid → 15×15 quads → 450 triangles

export interface WarpMesh {
  positions: Float32Array; // 2 floats per vertex, pixel space
  texCoords: Float32Array; // 2 floats per vertex, 0–1
  indices: Uint16Array;
}

export interface WarpProgram {
  render(
    mesh: WarpMesh,
    source: HTMLImageElement | HTMLCanvasElement | null,
    width: number,
    height: number
  ): void;
  destroy(): void;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function buildWarpMesh(corners: ProjectionCorners, width: number, height: number): WarpMesh {
  const vertexCount = GRID * GRID;
  const positions = new Float32Array(vertexCount * 2);
  const texCoords = new Float32Array(vertexCount * 2);

  // corners: [topLeft, topRight, bottomRight, bottomLeft]
  const [tl, tr, br, bl] = corners;

  for (let row = 0; row < GRID; row++) {
    for (let col = 0; col < GRID; col++) {
      const u = col / (GRID - 1);
      const v = row / (GRID - 1);

      // Bilinear interpolation
      const leftX = lerp(tl.x, bl.x, v);
      const leftY = lerp(tl.y, bl.y, v);
      const rightX = lerp(tr.x, br.x, v);
      const rightY = lerp(tr.y, br.y, v);
      const px = lerp(leftX, rightX, u) * width;
      const py = lerp(leftY, rightY, u) * height;

      const i = (row * GRID + col) * 2;
      positions[i]     = px;
      positions[i + 1] = py;
      texCoords[i]     = u;
      texCoords[i + 1] = v;
    }
  }

  // Build index buffer for quad mesh
  const quadCount = (GRID - 1) * (GRID - 1);
  const indices = new Uint16Array(quadCount * 6);
  let idx = 0;
  for (let row = 0; row < GRID - 1; row++) {
    for (let col = 0; col < GRID - 1; col++) {
      const a = row * GRID + col;
      const b = a + 1;
      const c = a + GRID;
      const d = c + 1;
      indices[idx++] = a;
      indices[idx++] = c;
      indices[idx++] = b;
      indices[idx++] = b;
      indices[idx++] = c;
      indices[idx++] = d;
    }
  }

  return { positions, texCoords, indices };
}

export function compositeGridOntoImage(
  maskImg: HTMLImageElement,
  gridSize: number,
  canvasWidth: number,
  canvasHeight: number
): HTMLCanvasElement {
  const offscreen = document.createElement('canvas');
  offscreen.width = canvasWidth;
  offscreen.height = canvasHeight;
  const ctx = offscreen.getContext('2d')!;

  ctx.drawImage(maskImg, 0, 0, canvasWidth, canvasHeight);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 1;
  const step = Math.max(1, gridSize);
  for (let x = 0; x <= canvasWidth; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvasHeight);
    ctx.stroke();
  }
  for (let y = 0; y <= canvasHeight; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvasWidth, y);
    ctx.stroke();
  }

  return offscreen;
}

const VERT_SRC = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  uniform vec2 u_resolution;
  varying vec2 v_texCoord;
  void main() {
    vec2 clip = (a_position / u_resolution) * 2.0 - 1.0;
    gl_Position = vec4(clip * vec2(1.0, -1.0), 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`;

const FRAG_SRC = `
  precision mediump float;
  uniform sampler2D u_image;
  varying vec2 v_texCoord;
  void main() {
    gl_FragColor = texture2D(u_image, v_texCoord);
  }
`;

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) ?? 'shader compile error');
  }
  return shader;
}

export function initWebGL(canvas: HTMLCanvasElement): WarpProgram | null {
  const gl = canvas.getContext('webgl');
  if (!gl) return null;

  const vert = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
  const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
  const program = gl.createProgram()!;
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) ?? 'program link error');
  }

  const aPosition = gl.getAttribLocation(program, 'a_position');
  const aTexCoord = gl.getAttribLocation(program, 'a_texCoord');
  const uResolution = gl.getUniformLocation(program, 'u_resolution')!;
  const uImage = gl.getUniformLocation(program, 'u_image')!;

  const posBuffer = gl.createBuffer()!;
  const texBuffer = gl.createBuffer()!;
  const idxBuffer = gl.createBuffer()!;
  const texture = gl.createTexture()!;

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  // Upload a 1×1 dark placeholder so the canvas isn't blank before mask loads
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
    new Uint8Array([26, 26, 46, 255]));

  // Upload static texCoords and index buffer once
  let lastMesh: WarpMesh | null = null;

  return {
    render(mesh, source, width, height) {
      gl.viewport(0, 0, width, height);
      gl.clearColor(0.1, 0.1, 0.18, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.uniform2f(uResolution, width, height);

      // Upload position buffer (changes every frame when corners move)
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, mesh.positions, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(aPosition);
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

      // Upload texCoord buffer only when mesh changes (indices are constant for same GRID)
      if (mesh !== lastMesh) {
        gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, mesh.texCoords, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);

        lastMesh = mesh;
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
      gl.enableVertexAttribArray(aTexCoord);
      gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 0, 0);

      // Upload texture if source provided
      if (source) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      }

      gl.uniform1i(uImage, 0);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuffer);
      gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0);
    },

    destroy() {
      gl.deleteBuffer(posBuffer);
      gl.deleteBuffer(texBuffer);
      gl.deleteBuffer(idxBuffer);
      gl.deleteTexture(texture);
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
    },
  };
}
