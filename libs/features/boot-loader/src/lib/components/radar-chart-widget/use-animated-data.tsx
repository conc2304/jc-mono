import { useMemo } from 'react';
import { RadarData, RadarDataEntry, MetricGroup } from './radar-chart-widget'; // Adjust import path
import { AnimationConfig, useRadarAnimation } from './animated-radar';

// Interface for data panel display
export interface DataPanelMetric {
  axis: string;
  value: number;
  formattedValue: string;
  metricGroupName?: string;
}

/**
 * Shared hook that provides animated radar data and extracted values for data panel
 */
export const useSharedAnimatedData = (
  originalData: RadarData | undefined,
  config: AnimationConfig = {}
) => {
  const {
    animatedData,
    isAnimating,
    startAnimation,
    stopAnimation,
    resetToOriginal,
  } = useRadarAnimation(originalData, config);

  // Extract and format entries from ALL animated radar data (flatten all groups)
  const currentMetrics: DataPanelMetric[] = useMemo(() => {
    if (!animatedData || animatedData.length === 0) {
      return [];
    }

    // Flatten all metric groups into one array
    const allEntries: RadarDataEntry[] = animatedData.flat();

    // Convert radar entries to data panel format
    return allEntries.map((entry: RadarDataEntry) => ({
      axis: entry.axis,
      value: entry.value,
      formattedValue: entry.formatFn
        ? entry.formatFn(entry.value)
        : entry.value.toFixed(1),
      metricGroupName: entry.metricGroupName,
    }));
  }, [animatedData]);

  // Get metrics by axis name (helper function)
  const getMetricByAxis = (axisName: string): DataPanelMetric | undefined => {
    return currentMetrics.find((metric) =>
      metric.axis.toLowerCase().includes(axisName.toLowerCase())
    );
  };

  // Get metrics by group name
  const getMetricsByGroup = (groupName: string): DataPanelMetric[] => {
    return currentMetrics.filter((metric) =>
      metric.metricGroupName?.toLowerCase().includes(groupName.toLowerCase())
    );
  };

  // Get first N metrics (useful for data panel display)
  const getTopMetrics = (count: number = 3): DataPanelMetric[] => {
    return currentMetrics.slice(0, count);
  };

  // Get all available axis names
  const getAxisNames = (): string[] => {
    return currentMetrics.map((metric) => metric.axis);
  };

  // Get all available group names
  const getGroupNames = (): string[] => {
    const groups = currentMetrics
      .map((metric) => metric.metricGroupName)
      .filter(Boolean) as string[];
    return [...new Set(groups)]; // Remove duplicates
  };

  return {
    // For radar chart
    animatedData,

    // For data panel - flexible metric access
    currentMetrics,
    getMetricByAxis,
    getMetricsByGroup,
    getTopMetrics,
    getAxisNames,
    getGroupNames,

    // Animation controls
    isAnimating,
    startAnimation,
    stopAnimation,
    resetToOriginal,
  };
};
