import React from 'react';
import { RadarChartBox } from '../../atoms';
import { RadarChart } from '../../../radar-chart-widget/radar-chart-widget';
import { radarAnimationConfig } from '../../default-data';
import { remap } from '../../../utils';
import { easeQuadInOut } from 'd3';
import { darken, lighten, useTheme } from '@mui/material';

interface RadarPanelProps {
  animatedData: any;
  title: string;
  onRadarHover: () => void;
  onRadarBlur: () => void;
  theme: any;
  flex?: number;
}

export const RadarPanel: React.FC<RadarPanelProps> = ({
  animatedData,
  title,
  onRadarHover,
  onRadarBlur,
  flex = 1,
}) => {
  const theme = useTheme();
  return (
    <RadarChartBox flex={flex}>
      <RadarChart
        id="animated-radar"
        data={animatedData}
        title={title}
        onRadarHover={onRadarHover}
        onRadarBlur={onRadarBlur}
        levels={5}
        opacityArea={0.1}
        strokeWidth={1}
        dotRadius={3}
        lineType={'curved'}
        showLabels={true}
        labelFactor={1.15}
        colors={{
          primary: theme.palette.primary.main,
          accent: theme.palette.warning.main,
          series: new Array(3).fill('').map((_, i) => {
            const fn = theme.palette.mode === 'light' ? darken : lighten;
            return fn(
              theme.palette.primary[theme.palette.mode],
              remap(i, 0, 3, 0, 0.5)
            );
          }),
        }}
        margin={{ top: 20, right: 0, bottom: 0, left: 0 }}
        // animationConfig={radarAnimationConfig}

        transitionConfig={{
          duration: radarAnimationConfig.animationSpeed,
          ease: easeQuadInOut,
        }}
        titleStyle={{
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      />
    </RadarChartBox>
  );
};
