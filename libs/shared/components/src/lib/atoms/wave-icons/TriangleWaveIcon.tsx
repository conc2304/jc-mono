import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

export const TriangleWaveIcon: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path
        d="M2 18 L 5.5 6 L 9 18 L 12.5 6 L 16 18 L 19.5 6 L 23 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
};
