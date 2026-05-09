import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

//  Lower Period (Higher Frequency)
export const LowAmplitudeIcon: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path
        d="M2 12 Q8 10, 14 12 T26 12"
        stroke-linecap="round"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      />
    </SvgIcon>
  );
};

// Higher Period (Lower Frequency)
export const HighAmplitudeIcon: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path
        d="M2 12 Q8 4, 14 12 T26 12"
        stroke-linecap="round"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      />
    </SvgIcon>
  );
};
