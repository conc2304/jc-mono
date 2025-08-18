import { useMediaQuery, useTheme } from '@mui/material';
import { MobilePageNotFound404 } from './404-page-mobile';
import { DesktopPageNotFound404 } from './404-page-desktop';

export const PageNotFound404 = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  if (isMobile) return <MobilePageNotFound404 />;

  if (isTablet) return <MobilePageNotFound404 />;

  return <DesktopPageNotFound404 />;
};
