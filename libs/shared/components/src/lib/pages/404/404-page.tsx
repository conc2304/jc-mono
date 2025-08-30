import { useMediaQuery, useTheme } from '@mui/material';
import { MobilePageNotFound404 } from './404-page-mobile';
import { DesktopPageNotFound404 } from './404-page-desktop';
import { useNavigate } from 'react-router-dom';

export const PageNotFound404 = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate(); // Call hook here, not in the handler

  const handleHomeClick = () => {
    navigate('/home');
  };

  if (isMobile) return <MobilePageNotFound404 onHomeClick={handleHomeClick} />;

  if (isTablet) return <MobilePageNotFound404 onHomeClick={handleHomeClick} />;

  return <DesktopPageNotFound404 onHomeClick={handleHomeClick} />;
};
