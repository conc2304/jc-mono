import { useEffect, useMemo, useState } from 'react';
import { TILE_CONFIG } from './tile-config';
import { WindowSize, Breakpoint } from './types';
import { useMediaQuery, useTheme } from '@mui/material';

export const useResponsiveTileConfig = () => {
  const theme = useTheme();
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = (): void => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const breakpoint: Breakpoint = useMemo(() => {
    if (useMediaQuery(theme.breakpoints.down('sm'))) return 'mobile';
    if (useMediaQuery(theme.breakpoints.down('lg'))) return 'tablet';
    return 'desktop';
  }, [windowSize.width]);

  return {
    config: TILE_CONFIG[breakpoint],
    breakpoint,
    windowSize,
  };
};
