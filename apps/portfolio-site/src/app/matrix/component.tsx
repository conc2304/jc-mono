'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  Slider,
  Button,
  FormControlLabel,
  Grid,
  Chip,
  IconButton,
  Collapse,
  Divider,
  Tooltip,
  Paper,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  VisibilityOff as VisibilityOffIcon,
  RestartAlt as RestartAltIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';
import * as THREE from 'three';

// Original MatrixWebcamPointCloud component
const MatrixWebcamPointCloud = ({
  rainEffect = true,
  useOriginalColors = false,
  matrixColor = '#00ff00',
  pointSize = 8,
  renderAsCharacters = true,
  pointLifespan = 300,
  brightness = 1.0,
  contrast = 1.0,
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const pointsRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const animationRef = useRef(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [error, setError] = useState(null);

  // Matrix characters
  const matrixChars =
    'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 300;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create video element for webcam
    const video = document.createElement('video');
    video.width = 160;
    video.height = 120;
    video.autoplay = true;
    video.muted = true;
    videoRef.current = video;

    // Create canvas for pixel sampling
    const canvas = document.createElement('canvas');
    canvas.width = 160;
    canvas.height = 120;
    const context = canvas.getContext('2d');
    canvasRef.current = canvas;
    contextRef.current = context;

    // Start webcam
    startWebcam();

    // Handle window resize
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  // Update point size when prop changes
  useEffect(() => {
    if (pointsRef.current && pointsRef.current.mesh) {
      pointsRef.current.mesh.material.size = pointSize;
      pointsRef.current.mesh.material.needsUpdate = true;
    }
  }, [pointSize]);

  // Update lifespan timers when pointLifespan changes
  useEffect(() => {
    if (pointsRef.current && pointsRef.current.lifespanTimers) {
      const { lifespanTimers } = pointsRef.current;
      // Reset all lifespan timers to new value
      for (let i = 0; i < lifespanTimers.length; i++) {
        lifespanTimers[i] = Math.random() * pointLifespan;
      }
    }
  }, [pointLifespan]);

  // Recreate point cloud when renderAsCharacters changes
  useEffect(() => {
    if (isWebcamActive && videoRef.current) {
      createPointCloud();
    }
  }, [renderAsCharacters, pointSize, pointLifespan]);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 160, height: 120 },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setIsWebcamActive(true);
          createPointCloud();
          animate();
        };
      }
    } catch (err) {
      setError('Could not access webcam: ' + err.message);
    }
  };

  const createPointCloud = () => {
    if (!videoRef.current || !sceneRef.current) return;

    const video = videoRef.current;
    const width = video.width;
    const height = video.height;

    // Create geometry for points
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(width * height * 3);
    const colors = new Float32Array(width * height * 3);
    const characters = [];
    const fallSpeeds = new Float32Array(width * height);
    const changeTimers = new Float32Array(width * height);
    const lifespanTimers = new Float32Array(width * height);
    const opacities = new Float32Array(width * height);
    const originalPositions = new Float32Array(width * height * 3); // Store original positions

    let index = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Position points in 3D space
        const posX = (x - width / 2) * 3;
        const posY = (height / 2 - y) * 3;
        const posZ = 0;

        positions[index * 3] = posX;
        positions[index * 3 + 1] = posY;
        positions[index * 3 + 2] = posZ;

        // Store original positions
        originalPositions[index * 3] = posX;
        originalPositions[index * 3 + 1] = posY;
        originalPositions[index * 3 + 2] = posZ;

        // Initialize colors to green
        colors[index * 3] = 0.2; // R
        colors[index * 3 + 1] = 1.0; // G
        colors[index * 3 + 2] = 0.2; // B

        // Random character and fall speed
        characters.push(
          matrixChars[Math.floor(Math.random() * matrixChars.length)]
        );
        fallSpeeds[index] = Math.random() * 2 + 1;
        changeTimers[index] = Math.random() * 60;
        lifespanTimers[index] = Math.random() * pointLifespan;
        opacities[index] = 1.0;

        index++;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Create material
    const material = new THREE.PointsMaterial({
      size: pointSize,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    // Create points mesh
    const points = new THREE.Points(geometry, material);

    // Clear existing points if any
    if (pointsRef.current && pointsRef.current.mesh) {
      sceneRef.current.remove(pointsRef.current.mesh);
      pointsRef.current.mesh.geometry.dispose();
      pointsRef.current.mesh.material.dispose();
    }

    sceneRef.current.add(points);
    pointsRef.current = {
      mesh: points,
      geometry: geometry,
      characters: characters,
      fallSpeeds: fallSpeeds,
      changeTimers: changeTimers,
      lifespanTimers: lifespanTimers,
      opacities: opacities,
      positions: positions,
      colors: colors,
      originalPositions: originalPositions, // Store reference to original positions
    };
  };

  const updatePointCloud = () => {
    if (!pointsRef.current || !videoRef.current || !contextRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = contextRef.current;
    const width = video.width;
    const height = video.height;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, width, height);
    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Apply brightness and contrast adjustments
    for (let i = 0; i < data.length; i += 4) {
      // Apply brightness (additive)
      let r = data[i] + (brightness - 1) * 255;
      let g = data[i + 1] + (brightness - 1) * 255;
      let b = data[i + 2] + (brightness - 1) * 255;

      // Apply contrast (multiplicative around midpoint)
      r = ((r / 255 - 0.5) * contrast + 0.5) * 255;
      g = ((g / 255 - 0.5) * contrast + 0.5) * 255;
      b = ((b / 255 - 0.5) * contrast + 0.5) * 255;

      // Clamp values to 0-255 range
      data[i] = Math.max(0, Math.min(255, r));
      data[i + 1] = Math.max(0, Math.min(255, g));
      data[i + 2] = Math.max(0, Math.min(255, b));
      // Alpha channel (data[i + 3]) remains unchanged
    }

    const {
      positions,
      colors,
      characters,
      fallSpeeds,
      changeTimers,
      lifespanTimers,
      opacities,
      originalPositions,
    } = pointsRef.current;

    // Parse matrix color
    const matrixColorObj = new THREE.Color(matrixColor);

    for (let i = 0; i < width * height; i++) {
      const pixelIndex = i * 4;
      const r = data[pixelIndex] / 255;
      const g = data[pixelIndex + 1] / 255;
      const b = data[pixelIndex + 2] / 255;

      // Calculate brightness
      const brightness = (r + g + b) / 3;

      if (rainEffect) {
        // Rain effect is ON - use lifespan and falling animation
        // Update lifespan and opacity
        lifespanTimers[i]--;
        if (lifespanTimers[i] <= 0) {
          // Reset point
          lifespanTimers[i] = pointLifespan;
          opacities[i] = 1.0;
          positions[i * 3 + 1] = (height / 2) * 3; // Reset to top
        } else {
          // Fade out over time
          opacities[i] = Math.max(0, lifespanTimers[i] / pointLifespan);
        }

        // Update Y position - make points fall
        positions[i * 3 + 1] -= fallSpeeds[i] * (brightness + 0.1);

        // Reset position if it falls too far
        if (positions[i * 3 + 1] < -height * 2) {
          positions[i * 3 + 1] = (height / 2) * 3;
          lifespanTimers[i] = pointLifespan;
          opacities[i] = 1.0;
        }
      } else {
        // Rain effect is OFF - static positions, no lifespan
        // Keep original position for static effect
        positions[i * 3] = originalPositions[i * 3];
        positions[i * 3 + 1] = originalPositions[i * 3 + 1];
        positions[i * 3 + 2] = originalPositions[i * 3 + 2];

        // No fading when rain is off - opacity based on brightness only
        opacities[i] = Math.max(0.1, brightness);
      }

      // Update colors based on useOriginalColors prop
      const currentOpacity = opacities[i];
      if (useOriginalColors) {
        colors[i * 3] = r * currentOpacity;
        colors[i * 3 + 1] = g * currentOpacity;
        colors[i * 3 + 2] = b * currentOpacity;
      } else {
        // Use matrix color with brightness intensity
        const intensity = Math.max(0.1, brightness) * currentOpacity;
        colors[i * 3] = matrixColorObj.r * intensity;
        colors[i * 3 + 1] = matrixColorObj.g * intensity;
        colors[i * 3 + 2] = matrixColorObj.b * intensity;
      }

      // Change characters periodically (only if rendering as characters)
      if (renderAsCharacters) {
        changeTimers[i]--;
        if (changeTimers[i] <= 0) {
          characters[i] =
            matrixChars[Math.floor(Math.random() * matrixChars.length)];
          changeTimers[i] = Math.random() * 60 + 30;
        }
      }
    }

    // Update geometry
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.color.needsUpdate = true;
  };

  const animate = () => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    updatePointCloud();

    // Rotate camera slightly
    if (cameraRef.current) {
      cameraRef.current.position.x = Math.sin(Date.now() * 0.001) * 50;
      cameraRef.current.lookAt(0, 0, 0);
    }

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    animationRef.current = requestAnimationFrame(animate);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* Status overlay */}
      <Paper
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          p: 2,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: '#00ff00',
          fontFamily: 'monospace',
        }}
      >
        {error && <Typography color="error">{error}</Typography>}
        {!isWebcamActive && !error && (
          <Typography>Initializing webcam...</Typography>
        )}
        {isWebcamActive && <Typography>Point Cloud Active</Typography>}
      </Paper>
    </Box>
  );
};

// Main component with Material-UI controls
export const MatrixWebcamWithControls = () => {
  const [showControls, setShowControls] = useState(true);
  const [settings, setSettings] = useState({
    rainEffect: true,
    useOriginalColors: false,
    matrixColor: '#00ff00',
    pointSize: 8,
    renderAsCharacters: true,
    pointLifespan: 300,
    brightness: 1.0,
    contrast: 1.0,
  });

  const presetColors = [
    { name: 'Matrix Green', color: '#00ff00' },
    { name: 'Electric Blue', color: '#0080ff' },
    { name: 'Cyber Red', color: '#ff0040' },
    { name: 'Neon Purple', color: '#8000ff' },
    { name: 'Acid Yellow', color: '#ffff00' },
    { name: 'Hot Pink', color: '#ff0080' },
    { name: 'Orange', color: '#ff8000' },
    { name: 'Cyan', color: '#00ffff' },
  ];

  const presetConfigurations = [
    {
      name: 'Classic Matrix',
      config: {
        rainEffect: true,
        useOriginalColors: false,
        matrixColor: '#00ff00',
        pointSize: 8,
        renderAsCharacters: true,
        pointLifespan: 300,
        brightness: 1.0,
        contrast: 1.0,
      },
      color: 'success',
    },
    {
      name: 'Static Reality',
      config: {
        rainEffect: false,
        useOriginalColors: true,
        matrixColor: '#00ff00',
        pointSize: 6,
        renderAsCharacters: false,
        pointLifespan: 180,
        brightness: 1.2,
        contrast: 1.3,
      },
      color: 'primary',
    },
    {
      name: 'Cyberpunk',
      config: {
        rainEffect: true,
        useOriginalColors: false,
        matrixColor: '#ff0080',
        pointSize: 12,
        renderAsCharacters: true,
        pointLifespan: 120,
        brightness: 0.8,
        contrast: 1.5,
      },
      color: 'secondary',
    },
    {
      name: 'Digital Rain',
      config: {
        rainEffect: true,
        useOriginalColors: false,
        matrixColor: '#0080ff',
        pointSize: 4,
        renderAsCharacters: false,
        pointLifespan: 450,
        brightness: 1.1,
        contrast: 0.8,
      },
      color: 'info',
    },
  ];

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetToDefaults = () => {
    setSettings({
      rainEffect: true,
      useOriginalColors: false,
      matrixColor: '#00ff00',
      pointSize: 8,
      renderAsCharacters: true,
      pointLifespan: 300,
      brightness: 1.0,
      contrast: 1.0,
    });
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: [
          '100vh', // Fallback
          '100dvh', // Preferred value
        ],
        backgroundColor: 'black',
        position: 'relative',
      }}
    >
      {/* Main component */}
      <MatrixWebcamPointCloud {...settings} />

      {/* Toggle controls button */}
      <IconButton
        onClick={() => setShowControls(!showControls)}
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: '#00ff00',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
          },
        }}
      >
        {showControls ? <VisibilityOffIcon /> : <SettingsIcon />}
      </IconButton>

      {/* Control panel */}
      <Collapse in={showControls}>
        <Card
          sx={{
            position: 'absolute',
            left: 16,
            top: 72,
            maxWidth: 380,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: '#00ff00',
            backdropFilter: 'blur(10px)',
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ textAlign: 'center', fontFamily: 'monospace' }}
            >
              <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Matrix Controls
            </Typography>

            <Box sx={{ mb: 3 }}>
              {/* Toggle Controls */}
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.rainEffect}
                    onChange={(e) =>
                      handleSettingChange('rainEffect', e.target.checked)
                    }
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#00ff00',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                        {
                          backgroundColor: '#00ff00',
                        },
                    }}
                  />
                }
                label="Rain Effect"
                sx={{
                  color: '#00ff00',
                  fontFamily: 'monospace',
                  display: 'block',
                  mb: 1,
                }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.useOriginalColors}
                    onChange={(e) =>
                      handleSettingChange('useOriginalColors', e.target.checked)
                    }
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#00ff00',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                        {
                          backgroundColor: '#00ff00',
                        },
                    }}
                  />
                }
                label="Original Colors"
                sx={{
                  color: '#00ff00',
                  fontFamily: 'monospace',
                  display: 'block',
                  mb: 1,
                }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.renderAsCharacters}
                    onChange={(e) =>
                      handleSettingChange(
                        'renderAsCharacters',
                        e.target.checked
                      )
                    }
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#00ff00',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                        {
                          backgroundColor: '#00ff00',
                        },
                    }}
                  />
                }
                label="Matrix Characters"
                sx={{
                  color: '#00ff00',
                  fontFamily: 'monospace',
                  display: 'block',
                  mb: 2,
                }}
              />
            </Box>

            {/* Matrix Color Section */}
            {!settings.useOriginalColors && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 2, color: '#00ff00', fontFamily: 'monospace' }}
                >
                  <PaletteIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Matrix Color
                </Typography>

                <Grid container spacing={1} sx={{ mb: 2 }}>
                  {presetColors.map((preset) => (
                    <Grid item key={preset.name}>
                      <Tooltip title={preset.name}>
                        <IconButton
                          onClick={() =>
                            handleSettingChange('matrixColor', preset.color)
                          }
                          sx={{
                            width: 32,
                            height: 32,
                            backgroundColor: preset.color,
                            border:
                              settings.matrixColor === preset.color
                                ? '3px solid white'
                                : '1px solid #666',
                            '&:hover': {
                              transform: 'scale(1.1)',
                            },
                          }}
                        />
                      </Tooltip>
                    </Grid>
                  ))}
                </Grid>

                <input
                  type="color"
                  value={settings.matrixColor}
                  onChange={(e) =>
                    handleSettingChange('matrixColor', e.target.value)
                  }
                  style={{
                    width: '100%',
                    height: 40,
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                  }}
                />
              </Box>
            )}

            {/* Video Processing Controls */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 2, color: '#00ff00', fontFamily: 'monospace' }}
              >
                📹 Video Processing
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: '#00ff00', fontFamily: 'monospace' }}
                >
                  Brightness: {settings.brightness.toFixed(1)}
                </Typography>
                <Slider
                  value={settings.brightness}
                  onChange={(e, value) =>
                    handleSettingChange('brightness', value)
                  }
                  min={0.1}
                  max={2.0}
                  step={0.1}
                  sx={{
                    color: '#00ff00',
                    '& .MuiSlider-thumb': {
                      backgroundColor: '#00ff00',
                    },
                    '& .MuiSlider-track': {
                      backgroundColor: '#00ff00',
                    },
                    '& .MuiSlider-rail': {
                      backgroundColor: '#333',
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: '#00ff00', fontFamily: 'monospace' }}
                >
                  Contrast: {settings.contrast.toFixed(1)}
                </Typography>
                <Slider
                  value={settings.contrast}
                  onChange={(e, value) =>
                    handleSettingChange('contrast', value)
                  }
                  min={0.1}
                  max={3.0}
                  step={0.1}
                  sx={{
                    color: '#00ff00',
                    '& .MuiSlider-thumb': {
                      backgroundColor: '#00ff00',
                    },
                    '& .MuiSlider-track': {
                      backgroundColor: '#00ff00',
                    },
                    '& .MuiSlider-rail': {
                      backgroundColor: '#333',
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Sliders */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, color: '#00ff00', fontFamily: 'monospace' }}
              >
                Point Size: {settings.pointSize}px
              </Typography>
              <Slider
                value={settings.pointSize}
                onChange={(e, value) => handleSettingChange('pointSize', value)}
                min={2}
                max={20}
                step={1}
                sx={{
                  color: '#00ff00',
                  '& .MuiSlider-thumb': {
                    backgroundColor: '#00ff00',
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: '#00ff00',
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: '#333',
                  },
                }}
              />
            </Box>

            {/* Only show lifespan slider when rain effect is on */}
            {settings.rainEffect && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: '#00ff00', fontFamily: 'monospace' }}
                >
                  Point Lifespan: {settings.pointLifespan} frames
                </Typography>
                <Slider
                  value={settings.pointLifespan}
                  onChange={(e, value) =>
                    handleSettingChange('pointLifespan', value)
                  }
                  min={60}
                  max={600}
                  step={30}
                  sx={{
                    color: '#00ff00',
                    '& .MuiSlider-thumb': {
                      backgroundColor: '#00ff00',
                    },
                    '& .MuiSlider-track': {
                      backgroundColor: '#00ff00',
                    },
                    '& .MuiSlider-rail': {
                      backgroundColor: '#333',
                    },
                  }}
                />
              </Box>
            )}

            <Divider sx={{ mb: 2, backgroundColor: '#333' }} />

            {/* Preset Configurations */}
            <Typography
              variant="subtitle2"
              sx={{ mb: 2, color: '#00ff00', fontFamily: 'monospace' }}
            >
              Presets
            </Typography>
            <Grid container spacing={1} sx={{ mb: 2 }}>
              {presetConfigurations.map((preset) => (
                <Grid item xs={6} key={preset.name}>
                  <Button
                    variant="outlined"
                    fullWidth
                    size="small"
                    onClick={() => setSettings(preset.config)}
                    sx={{
                      color: '#00ff00',
                      borderColor: '#00ff00',
                      fontSize: '0.7rem',
                      py: 0.5,
                      '&:hover': {
                        borderColor: '#00ff00',
                        backgroundColor: 'rgba(0, 255, 0, 0.1)',
                      },
                    }}
                  >
                    {preset.name}
                  </Button>
                </Grid>
              ))}
            </Grid>

            {/* Reset Button */}
            <Button
              variant="contained"
              fullWidth
              onClick={resetToDefaults}
              startIcon={<RestartAltIcon />}
              sx={{
                backgroundColor: '#cc0000',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#aa0000',
                },
              }}
            >
              Reset to Defaults
            </Button>

            {/* Tips */}
            <Paper
              sx={{
                mt: 2,
                p: 1.5,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderLeft: '3px solid #00ff00',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: '#00ff00',
                  fontFamily: 'monospace',
                  display: 'block',
                  mb: 0.5,
                }}
              >
                💡 Tips:
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#aaa',
                  fontFamily: 'monospace',
                  display: 'block',
                  lineHeight: 1.3,
                }}
              >
                • Rain off = static webcam point cloud
                <br />
                • Rain on = falling particles with lifespan
                <br />
                • Adjust brightness/contrast for better detection
                <br />
                • Use original colors for realistic look
                <br />• Large points work well with characters off
              </Typography>
            </Paper>
          </CardContent>
        </Card>
      </Collapse>

      {/* Current settings display */}
      <Paper
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          p: 1.5,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: '#00ff00',
          fontFamily: 'monospace',
          fontSize: '0.75rem',
        }}
      >
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Chip
              label={`Rain: ${settings.rainEffect ? 'ON' : 'OFF'}`}
              size="small"
              sx={{
                backgroundColor: settings.rainEffect ? '#004400' : '#440000',
                color: '#00ff00',
                fontSize: '0.7rem',
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Chip
              label={`Colors: ${
                settings.useOriginalColors ? 'Original' : 'Matrix'
              }`}
              size="small"
              sx={{
                backgroundColor: '#003300',
                color: '#00ff00',
                fontSize: '0.7rem',
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Chip
              label={`Size: ${settings.pointSize}px`}
              size="small"
              sx={{
                backgroundColor: '#003300',
                color: '#00ff00',
                fontSize: '0.7rem',
              }}
            />
          </Grid>
          {settings.rainEffect && (
            <Grid item xs={6}>
              <Chip
                label={`Life: ${settings.pointLifespan}f`}
                size="small"
                sx={{
                  backgroundColor: '#003300',
                  color: '#00ff00',
                  fontSize: '0.7rem',
                }}
              />
            </Grid>
          )}
          <Grid item xs={6}>
            <Chip
              label={`Bright: ${settings.brightness.toFixed(1)}`}
              size="small"
              sx={{
                backgroundColor: '#003300',
                color: '#00ff00',
                fontSize: '0.7rem',
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Chip
              label={`Contrast: ${settings.contrast.toFixed(1)}`}
              size="small"
              sx={{
                backgroundColor: '#003300',
                color: '#00ff00',
                fontSize: '0.7rem',
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Chip
              label={`Mode: ${
                settings.renderAsCharacters ? 'Chars' : 'Points'
              }`}
              size="small"
              sx={{
                backgroundColor: '#003300',
                color: '#00ff00',
                fontSize: '0.7rem',
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Chip
              label={`Color: ${settings.matrixColor}`}
              size="small"
              sx={{
                backgroundColor: '#003300',
                color: '#00ff00',
                fontSize: '0.7rem',
              }}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};
