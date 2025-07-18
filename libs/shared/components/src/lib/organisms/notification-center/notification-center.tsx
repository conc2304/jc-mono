import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  IconButton,
  Collapse,
  Card,
  CardContent,
  Avatar,
  Tooltip,
  Badge,
  Stack,
  darken,
  CardProps,
} from '@mui/material';
import {
  AccessTime,
  Memory,
  Speed,
  Visibility,
  ExpandMore,
  ExpandLess,
  Wifi,
  WifiOff,
  Computer,
  NetworkCheck,
  TouchApp,
  Keyboard,
  Timeline,
} from '@mui/icons-material';
import { alpha, styled } from '@mui/material/styles';

// Type definitions
interface NetworkInfo {
  type: string;
  speed: number | string;
  rtt: number | string;
}

interface MemoryUsage {
  used: number;
  total: number;
  limit: number;
}

interface Metrics {
  fps: number;
  domManipulationTime: number;
  pageLoadTime: number;
  sessionDuration: number;
  clickCount: number;
  keystrokes: number;
  networkInfo: NetworkInfo | null;
  memoryUsage: MemoryUsage | null;
  cpuCores: number | string;
  isOnline: boolean;
  sessionStartTime: number;
}

interface PerformanceStatus {
  color: 'success' | 'warning' | 'error';
  status: string;
  severity: 'success' | 'warning' | 'error';
}

const CardAugStyled = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2.5),
  borderRadius: 'unset',
  backgroundColor: alpha(darken(theme.palette.background.paper, 0.3), 0.7),
  '&[data-augmented-ui]': {
    '--aug-bl': '8px',
    '--aug-br': '8px',
    '--aug-tl': '8px',
    '--aug-b': '6px',
    '--aug-b-extend1': '50%',
    '--aug-border-all': '1px',
    '--aug-border-bg': theme.palette.info[theme.palette.mode],
  },
}));

const CardAug = (props: CardProps) => (
  <CardAugStyled
    className="Card--Augmented"
    elevation={0}
    data-augmented-ui="border bl-clip b-clip-x br-clip tl-clip"
    {...props}
  />
);

export const NotificationCenter: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [metrics, setMetrics] = useState<Metrics>({
    fps: 0,
    domManipulationTime: 0,
    pageLoadTime: 0,
    sessionDuration: 0,
    clickCount: 0,
    keystrokes: 0,
    networkInfo: null,
    memoryUsage: null,
    cpuCores: navigator.hardwareConcurrency || 'Unknown',
    isOnline: navigator.onLine,
    sessionStartTime: Date.now(),
  });

  const fpsRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());
  const domTimerRef = useRef<number>(0);
  const clickCountRef = useRef<number>(0);
  const keystrokeRef = useRef<number>(0);

  // FPS Counter
  useEffect(() => {
    const calculateFPS = (): void => {
      const now = performance.now();
      frameCountRef.current++;

      if (now - lastTimeRef.current >= 1000) {
        fpsRef.current = Math.round(
          (frameCountRef.current * 1000) / (now - lastTimeRef.current)
        );
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      requestAnimationFrame(calculateFPS);
    };

    calculateFPS();
  }, []);

  // Time and metrics updater
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());

      const sessionDuration = Math.floor(
        (Date.now() - metrics.sessionStartTime) / 1000
      );

      // Type assertion for connection API
      const connection =
        (navigator as any).connection ||
        (navigator as any).mozConnection ||
        (navigator as any).webkitConnection;

      const networkInfo: NetworkInfo | null = connection
        ? {
            type: connection.effectiveType || 'Unknown',
            speed: connection.downlink || 'Unknown',
            rtt: connection.rtt || 'Unknown',
          }
        : null;

      // Type assertion for memory API
      const performanceMemory = (performance as any).memory;
      const memoryUsage: MemoryUsage | null = performanceMemory
        ? {
            used: Math.round(performanceMemory.usedJSHeapSize / 1024 / 1024),
            total: Math.round(performanceMemory.totalJSHeapSize / 1024 / 1024),
            limit: Math.round(performanceMemory.jsHeapSizeLimit / 1024 / 1024),
          }
        : null;

      setMetrics((prev) => ({
        ...prev,
        fps: fpsRef.current,
        sessionDuration,
        clickCount: clickCountRef.current,
        keystrokes: keystrokeRef.current,
        networkInfo,
        memoryUsage,
        isOnline: navigator.onLine,
        domManipulationTime: domTimerRef.current,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [metrics.sessionStartTime]);

  // DOM manipulation time measurement
  useEffect(() => {
    const measureDOMManipulation = (): void => {
      const start = performance.now();

      // Create and manipulate DOM elements
      const div = document.createElement('div');
      div.style.display = 'none';
      div.innerHTML = '<span>Test</span>';
      document.body.appendChild(div);
      const span = div.querySelector('span');
      if (span) span.textContent = 'Updated';
      document.body.removeChild(div);

      const end = performance.now();
      domTimerRef.current = end - start;
    };

    const interval = setInterval(measureDOMManipulation, 3000);
    return () => clearInterval(interval);
  }, []);

  // Page load time
  useEffect(() => {
    // Type assertion for timing API
    const timing = (performance as any).timing;
    const loadTime = timing ? timing.loadEventEnd - timing.navigationStart : 0;

    setMetrics((prev) => ({
      ...prev,
      pageLoadTime: loadTime,
    }));
  }, []);

  // Event listeners for user interactions
  useEffect(() => {
    const handleClick = (): void => {
      clickCountRef.current++;
    };

    const handleKeyDown = (): void => {
      keystrokeRef.current++;
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  const getPerformanceStatus = (): PerformanceStatus => {
    if (metrics.fps >= 55)
      return { color: 'success', status: 'Excellent', severity: 'success' };
    if (metrics.fps >= 30)
      return { color: 'warning', status: 'Good', severity: 'warning' };
    return { color: 'error', status: 'Poor', severity: 'error' };
  };

  const getMemoryUsagePercentage = (): number => {
    if (!metrics.memoryUsage) return 0;
    return (metrics.memoryUsage.used / metrics.memoryUsage.total) * 100;
  };

  const performanceStatus = getPerformanceStatus();

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Collapsed View */}
      <Box
        sx={{
          p: 1.5,
          cursor: 'pointer',
          color: 'text.primary',
          minWidth: 320,
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTime sx={{ fontSize: 18, color: 'info.main' }} />
            <Typography
              variant="body2"
              sx={{ fontFamily: 'monospace', fontWeight: 500 }}
            >
              {formatTime(currentTime)}
            </Typography>
          </Box>

          <Chip
            icon={<Speed sx={{ color: 'inherit !important' }} />}
            label={`${metrics.fps} FPS`}
            color={performanceStatus.color}
            size="small"
            variant="outlined"
            sx={{
              minWidth: '85px',
              fontWeight: 'bold',
              '& .MuiChip-icon': {
                color: 'inherit',
              },
              '& .MuiChip-label': {
                minWidth: 50,
              },
            }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Visibility sx={{ fontSize: 18, color: 'success.main' }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {formatDuration(metrics.sessionDuration)}
            </Typography>
          </Box>

          <Box sx={{ ml: 'auto' }}>
            <IconButton
              size="small"
              sx={{
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <ExpandLess
                sx={{
                  transform: `rotate(${isExpanded ? '360deg' : '180deg'})`,
                  transition: 'transform 200ms ease-in',
                }}
              />
            </IconButton>
          </Box>
        </Stack>
      </Box>

      {/* Expanded View */}
      <Collapse in={isExpanded}>
        <Paper
          data-augmented-ui="border tl-2-clip-y bl-2-clip-x clip-tl l-clip-y "
          className="NotificationCenter--expanded-view"
          sx={(theme) => ({
            position: 'absolute',
            bottom: theme.mixins.taskbar.height,
            right: 1,
            mb: 1,
            mr: 1,
            width: 420, // nice
            p: 2,
            pt: 0,
            maxHeight: '66vh',
            backgroundColor: alpha(theme.palette.background.paper, 0.5),
            color: 'text.primary',
            zIndex: theme.zIndex.modal,

            '&[data-augmented-ui]': {
              '--aug-bl': '8px',
              '--aug-br': '8px',
              '--aug-tr': '8px',
              '--aug-l': '6px',
              '--aug-l-extend1': '50%',
              '--aug-border-all': '1.5px',
              '--aug-border-bg':
                theme.palette.info[theme.palette.getInvertedMode()],
            },
          })}
        >
          <Box
            sx={{
              p: 2.5,
              height: '100%',
              overflow: 'auto',
              maxHeight: 'inherit',
              pr: '3px',
            }}
          >
            {/* System Information Card */}
            <CardAug>
              <CardContent sx={{ pb: '16px !important' }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: 'text.primary',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontWeight: 600,
                    mb: 2,
                  }}
                >
                  <Computer sx={{ color: '#64b5f6' }} /> System Information
                </Typography>
                <Grid container spacing={2.5}>
                  <Grid
                    // item
                    xs={6}
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <AccessTime sx={{ fontSize: 20, color: '#64b5f6' }} />
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary', fontSize: '0.7rem' }}
                        >
                          Current Time
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.primary',
                            fontFamily: 'monospace',
                            fontWeight: 500,
                          }}
                        >
                          {formatTime(currentTime)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid
                    // item
                    xs={6}
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar
                        sx={{
                          width: 20,
                          height: 20,
                          fontSize: 10,
                          bgcolor: '#2196f3',
                        }}
                      >
                        TZ
                      </Avatar>
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary', fontSize: '0.7rem' }}
                        >
                          Timezone
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.primary',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                          }}
                        >
                          {Intl.DateTimeFormat()
                            .resolvedOptions()
                            .timeZone.replace('_', ' ')
                            .split('/')
                            .pop()}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Memory sx={{ fontSize: 20, color: '#ff9800' }} />
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary', fontSize: '0.7rem' }}
                        >
                          CPU Cores
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.primary', fontWeight: 500 }}
                        >
                          {metrics.cpuCores} cores
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      {metrics.isOnline ? (
                        <Wifi sx={{ fontSize: 20, color: '#4caf50' }} />
                      ) : (
                        <WifiOff sx={{ fontSize: 20, color: '#f44336' }} />
                      )}
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary', fontSize: '0.7rem' }}
                        >
                          Connection
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: metrics.isOnline ? '#4caf50' : '#f44336',
                            fontWeight: 500,
                          }}
                        >
                          {metrics.isOnline ? 'Online' : 'Offline'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </CardAug>

            {/* Performance Metrics Card */}
            <CardAug>
              <CardContent sx={{ pb: '16px !important' }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: 'text.primary',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontWeight: 600,
                    mb: 2,
                  }}
                >
                  <Speed sx={{ color: '#4caf50' }} /> Performance Metrics
                </Typography>

                {/* FPS with Progress Bar */}
                <Box sx={{ mb: 3 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary', fontWeight: 500 }}
                    >
                      Frames Per Second
                    </Typography>
                    <Chip
                      label={`${metrics.fps} FPS (${performanceStatus.status})`}
                      color={performanceStatus.color}
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((metrics.fps / 60) * 100, 100)}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                      },
                    }}
                    color={performanceStatus.color}
                  />
                </Box>

                <Grid container spacing={2.5}>
                  <Grid item xs={6}>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ color: 'text.secondary', fontSize: '0.7rem' }}
                      >
                        DOM Manipulation
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.primary', fontWeight: 500 }}
                      >
                        {metrics.domManipulationTime.toFixed(3)}ms
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ color: 'text.secondary', fontSize: '0.7rem' }}
                      >
                        Page Load Time
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.primary', fontWeight: 500 }}
                      >
                        {(metrics.pageLoadTime / 1000).toFixed(2)}s
                      </Typography>
                    </Box>
                  </Grid>
                  {metrics.memoryUsage && (
                    <Grid item xs={6}>
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary', fontSize: '0.7rem' }}
                        >
                          Memory Usage
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.primary', fontWeight: 500 }}
                        >
                          {metrics.memoryUsage.used}MB /{' '}
                          {metrics.memoryUsage.total}MB
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={getMemoryUsagePercentage()}
                          sx={{
                            height: 4,
                            borderRadius: 2,
                            mt: 0.5,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          }}
                          color={
                            getMemoryUsagePercentage() > 80
                              ? 'error'
                              : 'primary'
                          }
                        />
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </CardAug>

            {/* Session Data Card */}
            <CardAug>
              <CardContent sx={{ pb: '16px !important' }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: 'text.primary',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontWeight: 600,
                    mb: 2,
                  }}
                >
                  <Timeline sx={{ color: '#9c27b0' }} /> Session Analytics
                </Typography>
                <Grid container spacing={2.5}>
                  <Grid item xs={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <AccessTime sx={{ fontSize: 20, color: '#64b5f6' }} />
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary', fontSize: '0.7rem' }}
                        >
                          Session Duration
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.primary', fontWeight: 500 }}
                        >
                          {formatDuration(metrics.sessionDuration)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid item xs={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <TouchApp sx={{ fontSize: 20, color: '#ff9800' }} />
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary', fontSize: '0.7rem' }}
                        >
                          Clicks
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.primary', fontWeight: 500 }}
                        >
                          {metrics.clickCount.toLocaleString()}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Keyboard sx={{ fontSize: 20, color: '#e91e63' }} />
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary', fontSize: '0.7rem' }}
                        >
                          Keystrokes
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.primary', fontWeight: 500 }}
                        >
                          {metrics.keystrokes.toLocaleString()}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </CardAug>

            {/* Network Information Card */}
            {metrics.networkInfo && (
              <CardAug>
                <CardContent sx={{ pb: '16px !important' }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      color: 'text.primary',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    <NetworkCheck sx={{ color: '#00bcd4' }} /> Network
                    Information
                  </Typography>
                  <Grid container spacing={2.5}>
                    <Grid item xs={4}>
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary', fontSize: '0.7rem' }}
                        >
                          Connection Type
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.primary',
                            fontWeight: 500,
                            textTransform: 'uppercase',
                          }}
                        >
                          {metrics.networkInfo.type}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary', fontSize: '0.7rem' }}
                        >
                          Download Speed
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.primary', fontWeight: 500 }}
                        >
                          {metrics.networkInfo.speed} Mbps
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary', fontSize: '0.7rem' }}
                        >
                          Round Trip Time
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.primary', fontWeight: 500 }}
                        >
                          {metrics.networkInfo.rtt}ms
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </CardAug>
            )}
          </Box>
        </Paper>
      </Collapse>
    </Box>
  );
};
