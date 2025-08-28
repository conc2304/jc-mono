// hooks/useBootLayout.ts
import { useState, useCallback, useMemo } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import { Property } from 'csstype';
import {
  MetricGroup,
  RadarData,
} from '../../radar-chart-widget/radar-chart-widget';
import { useSharedAnimatedData } from '../../radar-chart-widget/use-animated-data';
import { radarAnimationConfig } from '../default-data';

export const useBootLayout = (radarMetricsConfig: any) => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));

  const [progress, setProgress] = useState({
    current: 0,
    total: 0,
    message: '',
  });

  const [isComplete, setIsComplete] = useState(false);

  // Background state
  const initialBgSize = 200;
  const [animateBackground, setAnimateBackground] = useState(false);
  const [backgroundSize, setBackgroundSize] = useState(initialBgSize);
  const [backgroundBlendMode, setBackgroundBlendMode] =
    useState<Property.BackgroundBlendMode>('color-burn');

  const baseRadarData: RadarData = useMemo(() => {
    const systemMetrics: MetricGroup = [
      { value: 87.5, metricGroupName: 'Player 1' },
      { value: 42.3, metricGroupName: 'Player 1' },
      { value: 68.7, metricGroupName: 'Player 1' },
      { value: 91.2, metricGroupName: 'Player 1' },
      { value: 45.8, metricGroupName: 'Player 1' },
      { value: 73.4, metricGroupName: 'Player 1' },
    ].map((unThemedMetric, i) => ({
      ...unThemedMetric,
      axis: radarMetricsConfig.metrics[i].label,
      formatFn: radarMetricsConfig.metrics[i].formatFn,
    }));

    return [systemMetrics];
  }, [radarMetricsConfig]);

  const { animatedData, isAnimating, startAnimation, stopAnimation } =
    useSharedAnimatedData(baseRadarData, radarAnimationConfig);

  const handleProgress = useCallback(
    (
      percentComplete: number,
      currentMessage: string,
      messageIndex: number,
      charIndex: number
    ) => {
      setProgress({
        current: percentComplete,
        total: 7,
        message: currentMessage,
      });
    },
    []
  );

  const handleBootComplete = useCallback(() => {
    setIsComplete(true);
  }, []);

  const handleBackgroundResize = (action: 'plus' | 'minus' | 'reset') => {
    if (action === 'reset') {
      setBackgroundSize(initialBgSize);
      return;
    }
    const incrementAmount = 20;
    const direction = action === 'plus' ? 1 : -1;
    const value = incrementAmount * direction;
    setBackgroundSize((prev) => prev + value);
  };

  return {
    theme,
    breakpoints: { isMd, isSm, isXs },
    progress,
    isComplete,
    backgroundState: {
      animateBackground,
      backgroundSize,
      backgroundBlendMode,
      setAnimateBackground,
      setBackgroundBlendMode,
      handleBackgroundResize,
    },
    radarData: {
      animatedData,
      startAnimation,
      stopAnimation,
    },
    handlers: {
      handleProgress,
      handleBootComplete,
    },
  };
};
