import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

export const SineWaveIcon: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path
        d="M2 12 Q 5 6, 8 12 T 14 12 T 20 12 T 26 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </SvgIcon>
  );
};
