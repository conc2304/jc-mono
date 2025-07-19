// Fragment shader source
export const fragmentShaderSource = `
    precision mediump float;

    uniform vec3 u_colors[16]; // Support up to 16 colors
    uniform float u_angle;
    uniform int u_numColors;
    uniform float u_time;
    uniform float u_scrollSpeed;
    uniform float u_scale;
    uniform vec2 u_mouse;
    uniform vec2 u_resolution;
    uniform bool u_mouseInteraction;
    varying vec2 v_uv;

    // Noise functions for displacement
    vec3 random3(vec3 c) {
      float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
      vec3 r;
      r.z = fract(512.0*j);
      j *= .125;
      r.x = fract(512.0*j);
      j *= .125;
      r.y = fract(512.0*j);
      return r-0.5;
    }

    const float F3 = 0.3333333;
    const float G3 = 0.1666667;

    float noise(vec3 p) {
      vec3 s = floor(p + dot(p, vec3(F3)));
      vec3 x = p - s + dot(s, vec3(G3));
      vec3 e = step(vec3(0.0), x - x.yzx);
      vec3 i1 = e*(1.0 - e.zxy);
      vec3 i2 = 1.0 - e.zxy*(1.0 - e);
      vec3 x1 = x - i1 + G3;
      vec3 x2 = x - i2 + 2.0*G3;
      vec3 x3 = x - 1.0 + 3.0*G3;
      vec4 w, d;
      w.x = dot(x, x);
      w.y = dot(x1, x1);
      w.z = dot(x2, x2);
      w.w = dot(x3, x3);
      w = max(0.6 - w, 0.0);
      d.x = dot(random3(s), x);
      d.y = dot(random3(s + i1), x1);
      d.z = dot(random3(s + i2), x2);
      d.w = dot(random3(s + 1.0), x3);
      w *= w;
      w *= w;
      d *= w;
      return dot(d, vec4(52.0));
    }

    float fbm(vec3 p) {
      float v = 0.0;
      v += noise(p*1.)*.5;
      v += noise(p*2.)*.25;
      v += noise(p*4.)*.125;
      return v;
    }

    void main() {
      vec2 uv = v_uv;

      // Mouse interaction displacement
      if (u_mouseInteraction) {
        // Convert mouse to UV coordinates (flip Y for WebGL)
        vec2 mouse = vec2(u_mouse.x / u_resolution.x, 1.0 - u_mouse.y / u_resolution.y);

        // Calculate distance from mouse
        float dist = length(mouse - uv);

        // Create exponential falloff around mouse
        float distExp = 1.0 + exp(dist * -8.0) * 40.0;

        // Generate noise for displacement
        float n1 = fbm(vec3(uv * 6.0, u_time * 0.0002));
        n1 *= 0.5;

        // Apply displacement based on distance from mouse
        float displace = n1 * 0.08 * distExp;

        // Create swirl effect around mouse
        vec2 mouseDir = uv - mouse;
        float mouseAngle = atan(mouseDir.y, mouseDir.x);
        vec2 swirl = vec2(cos(mouseAngle + displace * 3.0), sin(mouseAngle + displace * 3.0)) * displace * 0.5;

        uv += swirl;
      }

      // Convert angle from degrees to radians
      float angleRad = radians(u_angle);

      // Calculate gradient direction vector
      vec2 direction = vec2(cos(angleRad), sin(angleRad));

      // Project UV coordinates onto the gradient direction
      float t = dot(uv - 0.5, direction) + 0.5;

      // Apply scale to zoom into the gradient (higher scale = thicker bands)
      t *= u_scale;

      // Add scrolling based on time
      t += u_time * u_scrollSpeed * 0.001; // Scale time for reasonable speed

      // Use fract to make the gradient repeat/tile
      t = fract(t);

      // Calculate which color segment we're in
      float numColorsFloat = float(u_numColors);
      float scaledT = t * numColorsFloat; // Scale to full color range for seamless wrapping
      float colorIndexFloat = floor(scaledT);
      float localT = scaledT - colorIndexFloat;
      int targetIndex = int(colorIndexFloat);

      // Handle wraparound - if we're at the last color, next color is the first
      int nextIndex = targetIndex + 1;
      if (nextIndex >= u_numColors) {
        nextIndex = 0; // Wrap to first color
      }

      // Find colors using a loop (WebGL 1.0 compatible)
      vec3 color1 = vec3(0.0);
      vec3 color2 = vec3(0.0);

      for (int i = 0; i < 16; i++) {
        if (i == targetIndex) {
          color1 = u_colors[i];
        }
        if (i == nextIndex) {
          color2 = u_colors[i];
        }
        if (i >= u_numColors) break;
      }

      vec3 finalColor = mix(color1, color2, localT);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;
