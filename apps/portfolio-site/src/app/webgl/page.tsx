'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTheme } from '@mui/material';

import ColorShaderExample from './shader';

export default function Index() {
  const theme = useTheme();
  return (
    //   <ColorShader
    //     colors={[
    //       theme.palette.primary.dark,
    //       theme.palette.primary.main,
    //       theme.palette.primary.light,
    //     ]}
    //     width={400}
    //     height={400}
    //   />
    // );
    <ColorShaderExample />
  );
}
