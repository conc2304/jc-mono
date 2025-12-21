import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

export const SawtoothWaveIcon: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path
        d="M2 18 L 9 6 L 9 18 L 16 6 L 16 18 L 23 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
};
