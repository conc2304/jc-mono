import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import { RadarChart } from './radar-chart-widget'; // Adjust import path
import { DataPanel } from './DataPanel'; // Adjust import path
import { useSharedAnimatedData } from './useSharedAnimatedData'; // Adjust import path
import { RadarData, RadarDataEntry, MetricGroup } from './radar-chart-widget'; // Adjust import path
import { getRadarMetrics } from './themed-radar-metrics'; // Adjust import path

// Interface for the themed radar configuration
interface ThemedRadarConfig {
  themeId: string;
  metricGroups: Array<{
    name: string;
    values: number[]; // Values should match the number of metrics in the theme
  }>;
}

/**
 * Parent component that uses themed radar metrics
 */
interface DashboardViewProps {
  themeConfig: ThemedRadarConfig;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  themeConfig,
}) => {
  // Get the themed metrics (labels and formatFn)
  const themedMetrics = getRadarMetrics(themeConfig.themeId);

  // Generate radar data using themed configuration
  const baseRadarData: RadarData = useMemo(() => {
    return themeConfig.metricGroups.map((group) => {
      // Create radar entries for each metric in the theme
      return themedMetrics.map((metric, index) => ({
        axis: metric.label,
        value: group.values[index] || 0, // Use provided value or default to 0
        metricGroupName: group.name,
        formatFn: metric.formatFn,
      }));
    });
  }, [themeConfig, themedMetrics]);

  // Animation configuration
  const animationConfig = {
    animationSpeed: 100,
    numTrails: 3,
    trailOffset: 1.5,
    noiseScale: 0.05,
    trailIntensity: 0.2,
    enableAnimation: true,
  };

  // Use the shared animated data hook
  const {
    animatedData,
    axisGroupedData,
    getTopAxes,
    getAxisData,
    getAxisNames,
    getMetricGroupNames,
    isAnimating,
    startAnimation,
    stopAnimation,
  } = useSharedAnimatedData(baseRadarData, animationConfig);

  return (
    <Box display="flex" gap={2} p={2}>
      {/* Radar Chart */}
      <Box flex={1}>
        <RadarChart
          data={animatedData}
          transitionConfig={{
            duration: animationConfig.animationSpeed,
            ease: (t: number) => t, // Linear easing
          }}
          // Add other radar chart props as needed
        />
      </Box>

      {/* Data Panels */}
      <Box display="flex" flexDirection="column" gap={2}>
        {/* Panel showing first 3 axes with all their metric groups */}
        <DataPanel
          axisData={getTopAxes(3)}
          title="PRIMARY"
          maxDisplayedAxes={3}
        />

        {/* Panel showing next 3 axes */}
        <DataPanel
          axisData={getTopAxes(6).slice(3)}
          title="SECONDARY"
          maxDisplayedAxes={3}
        />

        {/* Optional: Animation controls */}
        <Box display="flex" gap={1} mt={1}>
          <button
            onClick={startAnimation}
            disabled={isAnimating}
            style={{ fontSize: '0.8rem', padding: '4px 8px' }}
          >
            Start
          </button>
          <button
            onClick={stopAnimation}
            disabled={!isAnimating}
            style={{ fontSize: '0.8rem', padding: '4px 8px' }}
          >
            Stop
          </button>
        </Box>
      </Box>
    </Box>
  );
};

// Example usage with different themes
export const CyberpunkDashboard: React.FC = () => {
  const themeConfig: ThemedRadarConfig = {
    themeId: 'neon-cyberpunk',
    metricGroups: [
      {
        name: 'NetRunner A',
        values: [87.5, 42, 68, 91, 45, 73], // ICE, DATA, NEURAL, CHROME, STREET, HACK
      },
      {
        name: 'NetRunner B',
        values: [74.1, 88, 65, 82, 91, 56],
      },
      {
        name: 'NetRunner C',
        values: [68.9, 79, 77, 91, 82, 84],
      },
    ],
  };

  return <DashboardView themeConfig={themeConfig} />;
};

export const SynthwaveDashboard: React.FC = () => {
  const themeConfig: ThemedRadarConfig = {
    themeId: 'synthwave',
    metricGroups: [
      {
        name: 'Player 1',
        values: [95.2, 8.7, 42, 88.1, 156, 92.3], // WAVE, FREQ, ANALOG, RETRO, NEON, VIBE
      },
      {
        name: 'Player 2',
        values: [78.9, 6.2, 38, 72.4, 203, 85.7],
      },
    ],
  };

  return <DashboardView themeConfig={themeConfig} />;
};

export const OceanDashboard: React.FC = () => {
  const themeConfig: ThemedRadarConfig = {
    themeId: 'ocean-depth',
    metricGroups: [
      {
        name: 'Submersible Alpha',
        values: [15, 2.3, 45, 67.8, 12, 35.2], // PRESSURE, CURRENT, DEPTH, BIOLUM, TIDAL, SALINITY
      },
      {
        name: 'Submersible Beta',
        values: [22, 1.8, 62, 45.2, 8, 34.1],
      },
    ],
  };

  return <DashboardView themeConfig={themeConfig} />;
};

// Dynamic theme selector example
interface DynamicDashboardProps {
  selectedTheme: string;
}

export const DynamicDashboard: React.FC<DynamicDashboardProps> = ({
  selectedTheme,
}) => {
  // Generate random values for demo purposes
  const generateRandomValues = (count: number) =>
    Array.from({ length: count }, () => Math.random() * 100);

  const themeConfig: ThemedRadarConfig = useMemo(
    () => ({
      themeId: selectedTheme,
      metricGroups: [
        {
          name: 'Entity A',
          values: generateRandomValues(6),
        },
        {
          name: 'Entity B',
          values: generateRandomValues(6),
        },
        {
          name: 'Entity C',
          values: generateRandomValues(6),
        },
      ],
    }),
    [selectedTheme]
  );

  return <DashboardView themeConfig={themeConfig} />;
};

// Example: Different metric groups (players/teams)
export const DashboardViewWithGroups: React.FC = () => {
  const baseRadarData: RadarData = useMemo(() => {
    const teamAlpha: MetricGroup = [
      {
        axis: 'Accuracy',
        value: 85.2,
        metricGroupName: 'Team Alpha',
        formatFn: (n) => `${n.valueOf().toFixed(1)}%`,
      },
      {
        axis: 'Speed',
        value: 78.9,
        metricGroupName: 'Team Alpha',
        formatFn: (n) => `${n.valueOf().toFixed(1)}%`,
      },
      {
        axis: 'Teamwork',
        value: 92.4,
        metricGroupName: 'Team Alpha',
        formatFn: (n) => `${n.valueOf().toFixed(1)}%`,
      },
    ];

    const teamBeta: MetricGroup = [
      {
        axis: 'Accuracy',
        value: 91.5,
        metricGroupName: 'Team Beta',
        formatFn: (n) => `${n.valueOf().toFixed(1)}%`,
      },
      {
        axis: 'Speed',
        value: 87.1,
        metricGroupName: 'Team Beta',
        formatFn: (n) => `${n.valueOf().toFixed(1)}%`,
      },
      {
        axis: 'Teamwork',
        value: 76.8,
        metricGroupName: 'Team Beta',
        formatFn: (n) => `${n.valueOf().toFixed(1)}%`,
      },
    ];

    const teamGamma: MetricGroup = [
      {
        axis: 'Accuracy',
        value: 73.3,
        metricGroupName: 'Team Gamma',
        formatFn: (n) => `${n.valueOf().toFixed(1)}%`,
      },
      {
        axis: 'Speed',
        value: 94.2,
        metricGroupName: 'Team Gamma',
        formatFn: (n) => `${n.valueOf().toFixed(1)}%`,
      },
      {
        axis: 'Teamwork',
        value: 88.7,
        metricGroupName: 'Team Gamma',
        formatFn: (n) => `${n.valueOf().toFixed(1)}%`,
      },
    ];

    return [teamAlpha, teamBeta, teamGamma];
  }, []);

  const { animatedData, axisGroupedData, getMetricGroupNames } =
    useSharedAnimatedData(baseRadarData, {
      animationSpeed: 100,
      enableAnimation: true,
    });

  const groupNames = getMetricGroupNames();

  return (
    <Box display="flex" gap={2} p={2}>
      <Box flex={1}>
        <RadarChart data={animatedData} />
      </Box>

      <Box display="flex" flexDirection="column" gap={2}>
        <DataPanel
          axisData={axisGroupedData}
          title="TEAM COMPARISON"
          showGroupNames={true}
        />

        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Teams: {groupNames.join(', ')}
        </Typography>
      </Box>
    </Box>
  );
};

// Example: Specific axis display
export const DashboardViewWithSpecificAxes: React.FC = () => {
  const baseRadarData: RadarData = useMemo(
    () => [
      [
        // Team Alpha
        {
          axis: 'Attack',
          value: 87.5,
          metricGroupName: 'Team Alpha',
          formatFn: (n) => `${n.valueOf().toFixed(1)}%`,
        },
        {
          axis: 'Defense',
          value: 72.3,
          metricGroupName: 'Team Alpha',
          formatFn: (n) => `${n.valueOf().toFixed(1)}%`,
        },
        {
          axis: 'Speed',
          value: 91.2,
          metricGroupName: 'Team Alpha',
          formatFn: (n) => `${n.valueOf().toFixed(1)}%`,
        },
      ],
      [
        // Team Beta
        {
          axis: 'Attack',
          value: 74.1,
          metricGroupName: 'Team Beta',
          formatFn: (n) => `${n.valueOf().toFixed(1)}%`,
        },
        {
          axis: 'Defense',
          value: 88.7,
          metricGroupName: 'Team Beta',
          formatFn: (n) => `${n.valueOf().toFixed(1)}%`,
        },
        {
          axis: 'Speed',
          value: 65.4,
          metricGroupName: 'Team Beta',
          formatFn: (n) => `${n.valueOf().toFixed(1)}%`,
        },
      ],
    ],
    []
  );

  const { animatedData, getAxisData } = useSharedAnimatedData(baseRadarData, {
    animationSpeed: 100,
    enableAnimation: true,
  });

  // Get specific axes data
  const attackData = getAxisData('Attack');
  const defenseData = getAxisData('Defense');

  return (
    <Box display="flex" gap={2} p={2}>
      <Box flex={1}>
        <RadarChart data={animatedData} />
      </Box>

      <Box display="flex" flexDirection="column" gap={2}>
        {/* Show specific axis data */}
        {attackData && (
          <DataPanel
            axisData={[attackData]}
            title="ATTACK STATS"
            showGroupNames={true}
          />
        )}
        {defenseData && (
          <DataPanel
            axisData={[defenseData]}
            title="DEFENSE STATS"
            showGroupNames={true}
          />
        )}
      </Box>
    </Box>
  );
};
