import React, { useEffect, useState, useRef, ComponentType } from 'react';
import { RadarChart, RadarData, RadarDataEntry } from './RadarChart'; // Adjust import path

// Configuration for value animation
export interface AnimationConfig {
  animationSpeed?: number; // milliseconds between updates (default: 1000)
  valueRange?:
    | {
        min: number;
        max: number;
      }
    | {
        percentage: number; // percentage of original value to vary by (e.g., 0.2 = ±20%)
      };
  enableAnimation?: boolean; // whether animation is active (default: true)
  smoothTransition?: boolean; // whether to use smooth transitions (default: false)
}

// Props for the HOC
export interface AnimatedRadarChartProps
  extends React.ComponentProps<typeof RadarChart> {
  animationConfig?: AnimationConfig;
}

// Default animation configuration
const defaultAnimationConfig: Required<AnimationConfig> = {
  animationSpeed: 1000,
  valueRange: { percentage: 0.15 }, // ±15% variation
  enableAnimation: true,
  smoothTransition: false,
};

/**
 * Higher Order Component that adds animated value updates to RadarChart
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

    // Store original data when it changes
    useEffect(() => {
      originalDataRef.current = originalData;
      setAnimatedData(originalData);
    }, [originalData]);

    // Animation logic
    useEffect(() => {
      if (!config.enableAnimation || !originalDataRef.current) {
        setAnimatedData(originalDataRef.current);
        return;
      }

      const animate = () => {
        if (!originalDataRef.current) return;

        const newData: RadarData = originalDataRef.current.map((group) =>
          group.map((entry) => {
            const originalValue = entry.value;
            let newValue: number;

            if ('percentage' in config.valueRange) {
              // Percentage-based variation
              const variation = originalValue * config.valueRange.percentage;
              const minValue = Math.max(0, originalValue - variation);
              const maxValue = originalValue + variation;
              newValue = minValue + Math.random() * (maxValue - minValue);
            } else {
              // Absolute range
              const { min, max } = config.valueRange;
              newValue = min + Math.random() * (max - min);
            }

            return {
              ...entry,
              value: Math.round(newValue * 100) / 100, // Round to 2 decimal places
            };
          })
        );

        setAnimatedData(newData);
      };

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
    }, [
      config.enableAnimation,
      config.animationSpeed,
      JSON.stringify(config.valueRange), // Deep comparison for valueRange
    ]);

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }, []);

    return <WrappedComponent {...(restProps as T)} data={animatedData} />;
  };
}

// Pre-wrapped component for convenience
export const AnimatedRadarChart = withAnimatedValues(RadarChart);

// Example usage component
export const RadarChartExample: React.FC = () => {
  // Sample data
  const sampleData: RadarData = [
    [
      { axis: 'Performance', value: 80, metricGroupName: 'Team A' },
      { axis: 'Quality', value: 90, metricGroupName: 'Team A' },
      { axis: 'Innovation', value: 70, metricGroupName: 'Team A' },
      { axis: 'Collaboration', value: 85, metricGroupName: 'Team A' },
      { axis: 'Delivery', value: 75, metricGroupName: 'Team A' },
    ],
    [
      { axis: 'Performance', value: 75, metricGroupName: 'Team B' },
      { axis: 'Quality', value: 85, metricGroupName: 'Team B' },
      { axis: 'Innovation', value: 90, metricGroupName: 'Team B' },
      { axis: 'Collaboration', value: 80, metricGroupName: 'Team B' },
      { axis: 'Delivery', value: 70, metricGroupName: 'Team B' },
    ],
    [
      { axis: 'Performance', value: 85, metricGroupName: 'Team C' },
      { axis: 'Quality', value: 75, metricGroupName: 'Team C' },
      { axis: 'Innovation', value: 80, metricGroupName: 'Team C' },
      { axis: 'Collaboration', value: 90, metricGroupName: 'Team C' },
      { axis: 'Delivery', value: 85, metricGroupName: 'Team C' },
    ],
  ];

  return (
    <div style={{ width: '600px', height: '400px' }}>
      <AnimatedRadarChart
        id="animated-radar"
        data={sampleData}
        title="Animated Team Performance Metrics"
        animationConfig={{
          animationSpeed: 800, // Update every 800ms
          valueRange: { percentage: 0.1 }, // ±10% variation
          enableAnimation: true,
          smoothTransition: false,
        }}
        levels={5}
        labelFactor={1.3}
        opacityArea={0.2}
        strokeWidth={2}
        dotRadius={5}
      />
    </div>
  );
};

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

  const startAnimation = () => setIsAnimating(true);
  const stopAnimation = () => setIsAnimating(false);
  const resetToOriginal = () => setAnimatedData(originalData);

  useEffect(() => {
    if (!isAnimating || !originalData) {
      setAnimatedData(originalData);
      return;
    }

    const animate = () => {
      if (!originalData) return;

      const newData: RadarData = originalData.map((group) =>
        group.map((entry) => {
          const originalValue = entry.value;
          let newValue: number;

          if ('percentage' in mergedConfig.valueRange) {
            const variation =
              originalValue * mergedConfig.valueRange.percentage;
            const minValue = Math.max(0, originalValue - variation);
            const maxValue = originalValue + variation;
            newValue = minValue + Math.random() * (maxValue - minValue);
          } else {
            const { min, max } = mergedConfig.valueRange;
            newValue = min + Math.random() * (max - min);
          }

          return {
            ...entry,
            value: Math.round(newValue * 100) / 100,
          };
        })
      );

      setAnimatedData(newData);
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
