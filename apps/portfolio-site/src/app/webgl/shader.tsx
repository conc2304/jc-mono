import React, { CSSProperties, useEffect, useRef } from 'react';

interface ColorShaderProps {
  colors: string[];
  angle?: number; // Angle in degrees (0 = horizontal left to right, 90 = vertical bottom to top)
  width?: number;
  height?: number;
  scrollSpeed?: number; // Speed of scrolling (default: 1.0)
  scale?: number; // Scale/zoom factor (default: 1.0, higher = thicker bands)
  mouseInteraction?: boolean; // Enable mouse displacement effects (default: true)
  resolution?: number; // Resolution multiplier (default: 1.0, 0.5 = half resolution)
  isBackground?: boolean; // Optimizes for background use (uses document mouse events)
  autoResize?: boolean; // Automatically resize to window dimensions when isBackground is true
  style?: CSSProperties;
}

export const ColorShader: React.FC<ColorShaderProps> = ({
  colors,
  angle = 0,
  width = 400,
  height = 400,
  scrollSpeed = 1.0,
  scale = 1.0,
  mouseInteraction = true,
  resolution = 1.0,
  isBackground = false,
  autoResize = false,
  style = {},
}) => {
  // State for dynamic dimensions when autoResize is enabled
  const [dynamicWidth, setDynamicWidth] = React.useState(width);
  const [dynamicHeight, setDynamicHeight] = React.useState(height);

  // Use dynamic dimensions when autoResize is enabled, otherwise use props
  const actualWidth = autoResize && isBackground ? dynamicWidth : width;
  const actualHeight = autoResize && isBackground ? dynamicHeight : height;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const colorsLocationRef = useRef<WebGLUniformLocation | null>(null);
  const angleLocationRef = useRef<WebGLUniformLocation | null>(null);
  const numColorsLocationRef = useRef<WebGLUniformLocation | null>(null);
  const timeLocationRef = useRef<WebGLUniformLocation | null>(null);
  const scrollSpeedLocationRef = useRef<WebGLUniformLocation | null>(null);
  const scaleLocationRef = useRef<WebGLUniformLocation | null>(null);
  const mouseLocationRef = useRef<WebGLUniformLocation | null>(null);
  const resolutionLocationRef = useRef<WebGLUniformLocation | null>(null);
  const mouseInteractionLocationRef = useRef<WebGLUniformLocation | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const mousePositionRef = useRef({ x: 0.5, y: 0.5 });

  // Calculate internal resolution
  const internalWidth = Math.max(1, Math.floor(actualWidth * resolution));
  const internalHeight = Math.max(1, Math.floor(actualHeight * resolution));

  // Convert hex color to RGB values
  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16) / 255,
          parseInt(result[2], 16) / 255,
          parseInt(result[3], 16) / 255,
        ]
      : [1, 0, 1]; // Fallback to magenta if parsing fails
  };

  // Convert colors array to flat RGB array
  const colorsToRgbArray = (colorArray: string[]): number[] => {
    const rgbArray: number[] = [];
    colorArray.forEach((color) => {
      const [r, g, b] = hexToRgb(color);
      rgbArray.push(r, g, b);
    });
    return rgbArray;
  };

  // Vertex shader source
  const vertexShaderSource = `
    attribute vec2 a_position;
    varying vec2 v_uv;

    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
      // Convert from clip space (-1 to 1) to texture coordinates (0 to 1)
      v_uv = (a_position + 1.0) / 2.0;
    }
  `;

  // Fragment shader source
  const fragmentShaderSource = `
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

  // Create shader function
  const createShader = (
    gl: WebGLRenderingContext,
    type: number,
    source: string
  ): WebGLShader | null => {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  };

  // Create program function
  const createProgram = (
    gl: WebGLRenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ): WebGLProgram | null => {
    const program = gl.createProgram();
    if (!program) return null;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }

    return program;
  };

  // Window resize handler for background mode
  useEffect(() => {
    if (!autoResize || !isBackground) return;

    const handleResize = () => {
      setDynamicWidth(window.innerWidth);
      setDynamicHeight(window.innerHeight);
    };

    // Set initial size
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [autoResize, isBackground]);
  // Mouse event handlers
  const handleMouseMove = React.useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!mouseInteraction) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Scale mouse coordinates to match internal resolution
      const scaledX = (x / actualWidth) * internalWidth;
      const scaledY = (y / actualHeight) * internalHeight;

      mousePositionRef.current = { x: scaledX, y: scaledY };
    },
    [mouseInteraction, actualWidth, actualHeight, internalWidth, internalHeight]
  );

  const handleMouseLeave = React.useCallback(() => {
    // Reset mouse position to offscreen when mouse leaves
    mousePositionRef.current = { x: -1000, y: -1000 };
  }, []);

  // Initialize WebGL
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    glRef.current = gl;

    // Set canvas internal resolution
    canvas.width = internalWidth;
    canvas.height = internalHeight;

    // Create shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    if (!vertexShader || !fragmentShader) return;

    // Create program
    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    programRef.current = program;

    // Get attribute and uniform locations
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    colorsLocationRef.current = gl.getUniformLocation(program, 'u_colors');
    angleLocationRef.current = gl.getUniformLocation(program, 'u_angle');
    numColorsLocationRef.current = gl.getUniformLocation(
      program,
      'u_numColors'
    );
    timeLocationRef.current = gl.getUniformLocation(program, 'u_time');
    scrollSpeedLocationRef.current = gl.getUniformLocation(
      program,
      'u_scrollSpeed'
    );
    scaleLocationRef.current = gl.getUniformLocation(program, 'u_scale');
    mouseLocationRef.current = gl.getUniformLocation(program, 'u_mouse');
    resolutionLocationRef.current = gl.getUniformLocation(
      program,
      'u_resolution'
    );
    mouseInteractionLocationRef.current = gl.getUniformLocation(
      program,
      'u_mouseInteraction'
    );

    // Create buffer for a full-screen quad
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Two triangles that form a full-screen quad
    const positions = new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]);

    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    // Setup the attribute
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Set viewport to internal resolution
    gl.viewport(0, 0, internalWidth, internalHeight);

    // Clean up shaders (they're linked to the program now)
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    return () => {
      if (gl && program) {
        gl.deleteProgram(program);
      }
    };
  }, [internalWidth, internalHeight]);

  // Update viewport when resolution changes
  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = glRef.current;
    const program = programRef.current;

    if (!canvas || !gl || !program) return;

    // Update canvas internal resolution
    canvas.width = internalWidth;
    canvas.height = internalHeight;

    // Update viewport
    gl.viewport(0, 0, internalWidth, internalHeight);

    // Force a re-render with current settings
    const colorsLocation = colorsLocationRef.current;
    const angleLocation = angleLocationRef.current;
    const numColorsLocation = numColorsLocationRef.current;
    const scaleLocation = scaleLocationRef.current;

    if (
      colorsLocation &&
      angleLocation &&
      numColorsLocation &&
      scaleLocation &&
      colors.length > 0
    ) {
      gl.useProgram(program);

      // Re-apply all current uniform values
      const rgbArray = colorsToRgbArray(colors);
      gl.uniform3fv(colorsLocation, rgbArray);
      gl.uniform1f(angleLocation, angle);
      gl.uniform1i(numColorsLocation, colors.length);
      gl.uniform1f(scaleLocation, scale);

      // Clear and redraw
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  }, [internalWidth, internalHeight, colors, angle, scale]);

  // Animation loop for scrolling
  const animate = React.useCallback(
    (currentTime: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = currentTime;
      }

      const gl = glRef.current;
      const program = programRef.current;
      const timeLocation = timeLocationRef.current;
      const scrollSpeedLocation = scrollSpeedLocationRef.current;
      const mouseLocation = mouseLocationRef.current;
      const resolutionLocation = resolutionLocationRef.current;
      const mouseInteractionLocation = mouseInteractionLocationRef.current;

      if (
        !gl ||
        !program ||
        !timeLocation ||
        !scrollSpeedLocation ||
        !mouseLocation ||
        !resolutionLocation ||
        !mouseInteractionLocation
      ) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const elapsedTime = currentTime - startTimeRef.current;

      gl.useProgram(program);
      gl.uniform1f(timeLocation, elapsedTime);
      gl.uniform1f(scrollSpeedLocation, scrollSpeed);
      gl.uniform2f(
        mouseLocation,
        mousePositionRef.current.x,
        mousePositionRef.current.y
      );
      gl.uniform2f(resolutionLocation, internalWidth, internalHeight);
      gl.uniform1i(mouseInteractionLocation, mouseInteraction ? 1 : 0);

      // Redraw
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameRef.current = requestAnimationFrame(animate);
    },
    [scrollSpeed, internalWidth, internalHeight, mouseInteraction]
  );

  // Start animation loop
  useEffect(() => {
    startTimeRef.current = null;
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animate]);

  // Update gradient when colors, angle, or scale changes
  useEffect(() => {
    const gl = glRef.current;
    const program = programRef.current;
    const colorsLocation = colorsLocationRef.current;
    const angleLocation = angleLocationRef.current;
    const numColorsLocation = numColorsLocationRef.current;
    const scaleLocation = scaleLocationRef.current;

    if (
      !gl ||
      !program ||
      !colorsLocation ||
      !angleLocation ||
      !numColorsLocation ||
      !scaleLocation
    )
      return;
    if (colors.length === 0) return;

    gl.useProgram(program);

    // Convert colors to RGB array
    const rgbArray = colorsToRgbArray(colors);

    // Set uniforms
    gl.uniform3fv(colorsLocation, rgbArray);
    gl.uniform1f(angleLocation, angle);
    gl.uniform1i(numColorsLocation, colors.length);
    gl.uniform1f(scaleLocation, scale);
  }, [colors, angle, scale]);

  // Alternative mouse tracking using document events for background use
  useEffect(() => {
    if (!mouseInteraction || !isBackground) return;

    const handleDocumentMouseMove = (event: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();

      // Check if mouse is over the canvas area
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        // Scale mouse coordinates to match internal resolution
        const scaledX = (x / actualWidth) * internalWidth;
        const scaledY = (y / actualHeight) * internalHeight;
        mousePositionRef.current = { x: scaledX, y: scaledY };
      }
    };

    // Use document-level event listeners for background canvases
    document.addEventListener('mousemove', handleDocumentMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleDocumentMouseMove);
    };
  }, [
    mouseInteraction,
    isBackground,
    actualWidth,
    actualHeight,
    internalWidth,
    internalHeight,
  ]);

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={isBackground ? undefined : handleMouseMove}
      onMouseLeave={isBackground ? undefined : handleMouseLeave}
      style={{
        width: `${actualWidth}px`,
        height: `${actualHeight}px`,
        imageRendering: resolution < 1 ? 'pixelated' : 'auto',
        // Automatically set pointer-events for background use
        pointerEvents: isBackground ? 'none' : 'auto',
        ...style,
      }}
    />
  );
};

// Example usage component
const ColorShaderExample: React.FC = () => {
  const [colors, setColors] = React.useState(['#ff0000', '#00ff00', '#0000ff']);
  const [angle, setAngle] = React.useState(0);
  const [scrollSpeed, setScrollSpeed] = React.useState(1.0);
  const [scale, setScale] = React.useState(1.0);
  const [mouseInteraction, setMouseInteraction] = React.useState(true);
  const [resolution, setResolution] = React.useState(1.0);
  const [isBackground, setIsBackground] = React.useState(false);
  const [autoResize, setAutoResize] = React.useState(false);

  const addColor = () => {
    const randomColor =
      '#' +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0');
    setColors([...colors, randomColor]);
  };

  const removeColor = (index: number) => {
    if (colors.length > 1) {
      setColors(colors.filter((_, i) => i !== index));
    }
  };

  const updateColor = (index: number, newColor: string) => {
    const newColors = [...colors];
    newColors[index] = newColor;
    setColors(newColors);
  };

  const getResolutionLabel = (res: number): string => {
    if (res >= 1) return 'Full';
    if (res >= 0.75) return 'High';
    if (res >= 0.5) return 'Medium';
    if (res >= 0.25) return 'Low';
    return 'Lowest';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        WebGL Interactive Scrolling Gradient Shader
      </h2>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Colors</h3>
          <div className="space-y-2">
            {colors.map((color, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => updateColor(index, e.target.value)}
                  className="w-10 h-6 rounded border"
                />
                <span className="text-xs font-mono">{color}</span>
                <button
                  onClick={() => removeColor(index)}
                  disabled={colors.length <= 1}
                  className="ml-auto px-1 py-0.5 text-xs bg-red-500 text-white rounded disabled:opacity-50"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={addColor}
              disabled={colors.length >= 16}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Add Color
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Angle</h3>
          <div className="space-y-2">
            <label className="block text-sm font-medium">{angle}°</label>
            <input
              type="range"
              min="0"
              max="360"
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full"
            />
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => setAngle(0)}
                className="px-1 py-0.5 text-xs bg-gray-500 text-white rounded"
              >
                0°
              </button>
              <button
                onClick={() => setAngle(90)}
                className="px-1 py-0.5 text-xs bg-gray-500 text-white rounded"
              >
                90°
              </button>
              <button
                onClick={() => setAngle(180)}
                className="px-1 py-0.5 text-xs bg-gray-500 text-white rounded"
              >
                180°
              </button>
              <button
                onClick={() => setAngle(270)}
                className="px-1 py-0.5 text-xs bg-gray-500 text-white rounded"
              >
                270°
              </button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Speed</h3>
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              {scrollSpeed.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={scrollSpeed}
              onChange={(e) => setScrollSpeed(Number(e.target.value))}
              className="w-full"
            />
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => setScrollSpeed(0)}
                className="px-1 py-0.5 text-xs bg-gray-500 text-white rounded"
              >
                Stop
              </button>
              <button
                onClick={() => setScrollSpeed(1)}
                className="px-1 py-0.5 text-xs bg-gray-500 text-white rounded"
              >
                1x
              </button>
              <button
                onClick={() => setScrollSpeed(3)}
                className="px-1 py-0.5 text-xs bg-gray-500 text-white rounded"
              >
                3x
              </button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Scale</h3>
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              {scale.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full"
            />
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => setScale(0.5)}
                className="px-1 py-0.5 text-xs bg-gray-500 text-white rounded"
              >
                0.5x
              </button>
              <button
                onClick={() => setScale(1)}
                className="px-1 py-0.5 text-xs bg-gray-500 text-white rounded"
              >
                1x
              </button>
              <button
                onClick={() => setScale(5)}
                className="px-1 py-0.5 text-xs bg-gray-500 text-white rounded"
              >
                5x
              </button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Mouse FX</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={mouseInteraction}
                onChange={(e) => setMouseInteraction(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Enable</span>
            </label>
            <p className="text-xs text-gray-600">
              {mouseInteraction
                ? 'Move mouse over canvas to displace colors'
                : 'Mouse interaction disabled'}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Resolution</h3>
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              {getResolutionLabel(resolution)} ({(resolution * 100).toFixed(0)}
              %)
            </label>
            <input
              type="range"
              min="0.25"
              max="1"
              step="0.25"
              value={resolution}
              onChange={(e) => setResolution(Number(e.target.value))}
              className="w-full"
            />
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => setResolution(0.5)}
                className="px-1 py-0.5 text-xs bg-gray-500 text-white rounded"
              >
                50%
              </button>
              <button
                onClick={() => setResolution(1)}
                className="px-1 py-0.5 text-xs bg-gray-500 text-white rounded"
              >
                100%
              </button>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3">Background Mode</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isBackground}
                onChange={(e) => setIsBackground(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Background Mode</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={autoResize}
                onChange={(e) => setAutoResize(e.target.checked)}
                disabled={!isBackground}
                className="rounded disabled:opacity-50"
              />
              <span className="text-sm">Auto Resize</span>
            </label>
            <p className="text-xs text-gray-600">
              {isBackground
                ? autoResize
                  ? 'Uses document events + auto-resizes to window size'
                  : 'Uses document events, fixed size'
                : 'Uses canvas mouse events (normal mode)'}
            </p>
          </div>
        </div>
      </div>

      {isBackground && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Background Mode Demo:</strong> The canvas below has
            pointer-events: none and uses document-level mouse tracking. Mouse
            over this entire area to see the effect work even though the canvas
            can't receive direct mouse events.
          </p>
        </div>
      )}

      <div className="mb-4 relative">
        <ColorShader
          colors={colors}
          angle={angle}
          scrollSpeed={scrollSpeed}
          scale={scale}
          mouseInteraction={mouseInteraction}
          resolution={resolution}
          isBackground={isBackground}
          autoResize={autoResize}
          width={800}
          height={400}
          style={
            isBackground
              ? {
                  position: 'absolute',
                  zIndex: -1,
                }
              : {}
          }
        />
        {isBackground && (
          <div className="relative z-10 p-4 bg-white/80 backdrop-blur-sm rounded border-2 border-dashed border-gray-300">
            <h3 className="text-lg font-semibold mb-2">
              Content Over Background
            </h3>
            <p className="text-sm text-gray-700">
              This content is positioned over the background shader. Move your
              mouse around this area and you'll see the shader responding even
              though it's behind this content with z-index: -1 and
              pointer-events: none.
            </p>
            <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
              Clickable Button
            </button>
          </div>
        )}
      </div>

      <div className="text-sm text-gray-600 space-y-1">
        <p>
          <strong>Performance Features:</strong>
        </p>
        <p>
          • <strong>Resolution Control:</strong> Lower resolution values (e.g.,
          0.5) render at half the pixel density but maintain full visual size
        </p>
        <p>
          • <strong>Auto Resize:</strong> When enabled with background mode,
          automatically resizes to match window dimensions
        </p>
        <p>
          • <strong>Perfect for Websites:</strong> Use autoResize + background
          mode for full-screen responsive backgrounds
        </p>
        <p>
          • <strong>Interactive Features:</strong> All previous features remain:
          mouse effects, animated scrolling, scalable bands
        </p>
        <p>
          • <strong>Tip:</strong> For website backgrounds, try 25-50% resolution
          for optimal performance
        </p>
      </div>
    </div>
  );
};

export default ColorShaderExample;
