import React, { CSSProperties, useCallback, useEffect, useRef } from 'react';

import { fragmentShaderSource } from './fragment-shader';
import { vertexShaderSource } from './vertex-shader';

interface GradientShaderProps {
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
  className?: string;
}

export const GradientShader = ({
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
  className = 'Canvas--GradientShader',
}: GradientShaderProps) => {
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

  // TODO - accept all colors formats and convert
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
  const colorsToRgbArray = useCallback((colorArray: string[]): number[] => {
    const rgbArray: number[] = [];
    colorArray.forEach((color) => {
      const [r, g, b] = hexToRgb(color);
      rgbArray.push(r, g, b);
    });
    return rgbArray;
  }, []);

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
  }, [internalWidth, internalHeight, colors, angle, scale, colorsToRgbArray]);

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
      className={className}
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
