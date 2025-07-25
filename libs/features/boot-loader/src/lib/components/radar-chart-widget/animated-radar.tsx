import React, {
  useEffect,
  useState,
  useRef,
  ComponentType,
  ComponentProps,
  useCallback,
  memo,
} from 'react';
import { RadarChart, RadarData, MetricGroup } from './radar-chart-widget';
import { generateTrailingRadarData } from '../utils';

import { easeLinear } from 'd3';

// Configuration for trailing animation
export interface AnimationConfig {
  animationSpeed?: number; // milliseconds between updates (default: 100)
  numTrails?: number; // number of trailing metric groups (default: 3)
  trailOffset?: number; // time offset between trails (default: 1.5)
  noiseScale?: number; // scale factor for noise (default: 0.05)
  trailIntensity?: number; // how much trails deviate (default: 0.2)
  enableAnimation?: boolean; // whether animation is active (default: true)
  easing?: (timeStep: number) => number;
}

// Props for the HOC
export interface AnimatedRadarChartProps
  extends React.ComponentProps<typeof RadarChart> {
  animationConfig?: AnimationConfig;
}

// Default animation configuration
const defaultAnimationConfig: Required<AnimationConfig> = {
  animationSpeed: 100,
  numTrails: 3,
  trailOffset: 1.5,
  noiseScale: 0.05,
  trailIntensity: 0.2,
  enableAnimation: true,
  easing: easeLinear,
};

/**
 * Higher Order Component that adds animated trailing effects to RadarChart
 */
export function withAnimatedValues<T extends ComponentProps<typeof RadarChart>>(
  WrappedComponent: ComponentType<T>
) {
  return function AnimatedRadarChart(props: AnimatedRadarChartProps) {
    const { animationConfig = {}, data: originalData, ...restProps } = props;
    const config = { ...defaultAnimationConfig, ...animationConfig };

    const [animatedData, setAnimatedData] = useState<RadarData | undefined>(
      originalData
    );
    const originalDataRef = useRef<RadarData | undefined>(originalData);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const animationStartTimeRef = useRef<number>(Date.now());

    // Trailing animation function
    const animate = useCallback(() => {
      if (!originalDataRef.current || originalDataRef.current.length === 0)
        return;

      console.log('animate');
      // Use the first metric group as base data for trailing
      const baseData: MetricGroup = originalDataRef.current[0];

      // Calculate time step based on elapsed time
      const elapsed = Date.now() - animationStartTimeRef.current;
      const timeStep = (elapsed / 1000) * config.noiseScale * 10; // Scale for better visual effect

      const trailingData = generateTrailingRadarData({
        numTrails: config.numTrails,
        trailOffset: config.trailOffset,
        timeStep,
        baseData,
        noiseScale: config.noiseScale,
        trailIntensity: config.trailIntensity,
      });

      setAnimatedData(trailingData);
    }, [
      config.numTrails,
      config.trailOffset,
      config.noiseScale,
      config.trailIntensity,
    ]);

    // Store original data when it changes
    useEffect(() => {
      originalDataRef.current = originalData;
      setAnimatedData(originalData);
      animationStartTimeRef.current = Date.now(); // Reset animation time
    }, [originalData]);

    // Animation logic
    useEffect(() => {
      if (!config.enableAnimation || !originalDataRef.current) {
        setAnimatedData(originalDataRef.current);
        return;
      }

      // Start animation
      animate(); // Initial call
      intervalRef.current = setInterval(animate, config.animationSpeed);

      // Cleanup
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }, [config.enableAnimation, config.animationSpeed, animate]);

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }, []);

    return (
      <WrappedComponent
        transitionConfig={{
          duration: config.animationSpeed,
          ease: config.easing,
        }}
        {...(restProps as T)}
        data={animatedData}
      />
    );
  };
}

// Pre-wrapped component for convenience
export const AnimatedRadarChart = memo(withAnimatedValues(RadarChart));

// Animation control hooks for advanced usage
export const useRadarAnimation = (
  originalData: RadarData | undefined,
  config: AnimationConfig = {}
) => {
  const mergedConfig = { ...defaultAnimationConfig, ...config };
  const [animatedData, setAnimatedData] = useState<RadarData | undefined>(
    originalData
  );
  const [isAnimating, setIsAnimating] = useState(mergedConfig.enableAnimation);
  const animationStartTimeRef = useRef<number>(Date.now());

  const startAnimation = () => {
    setIsAnimating(true);
    animationStartTimeRef.current = Date.now();
  };
  const stopAnimation = () => setIsAnimating(false);
  const resetToOriginal = () => setAnimatedData(originalData);

  useEffect(() => {
    if (!isAnimating || !originalData || originalData.length === 0) {
      setAnimatedData(originalData);
      return;
    }

    const animate = () => {
      if (!originalData) return;

      // Use the first metric group as base data for trailing
      const baseData: MetricGroup = originalData[0];
      const elapsed = Date.now() - animationStartTimeRef.current;
      const timeStep = (elapsed / 1000) * mergedConfig.noiseScale * 10;

      const trailingData = generateTrailingRadarData({
        numTrails: mergedConfig.numTrails,
        trailOffset: mergedConfig.trailOffset,
        timeStep,
        baseData,
        noiseScale: mergedConfig.noiseScale,
        trailIntensity: mergedConfig.trailIntensity,
      });

      setAnimatedData(trailingData);
    };

    const interval = setInterval(animate, mergedConfig.animationSpeed);
    return () => clearInterval(interval);
  }, [isAnimating, originalData, JSON.stringify(mergedConfig)]);

  return {
    animatedData,
    isAnimating,
    startAnimation,
    stopAnimation,
    resetToOriginal,
  };
};

// Utility function to convert single metric group to trailing data
export const createTrailingRadarData = (
  baseData: MetricGroup,
  timeStep: number,
  trailingConfig: Partial<AnimationConfig> = {}
): RadarData => {
  const config = { ...defaultAnimationConfig, ...trailingConfig };

  return generateTrailingRadarData({
    numTrails: config.numTrails,
    trailOffset: config.trailOffset,
    timeStep,
    baseData,
    noiseScale: config.noiseScale,
    trailIntensity: config.trailIntensity,
  });
};
