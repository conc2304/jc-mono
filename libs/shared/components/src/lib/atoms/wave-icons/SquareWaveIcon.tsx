import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

export const SquareWaveIcon: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path
        d="M2 18 L 2 6 L 8 6 L 8 18 L 14 18 L 14 6 L 20 6 L 20 18 L 23 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
};
