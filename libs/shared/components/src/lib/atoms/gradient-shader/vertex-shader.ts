// Vertex shader source
export const vertexShaderSource = `
    attribute vec2 a_position;
    varying vec2 v_uv;

    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
      // Convert from clip space (-1 to 1) to texture coordinates (0 to 1)
      v_uv = (a_position + 1.0) / 2.0;
    }
  `;
