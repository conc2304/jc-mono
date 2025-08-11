import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { ArrowLeft, Menu as MenuIcon } from '@mui/icons-material';
import { NavigationContext } from '@jc/file-system';

interface MobileNavigationProps {
  hasNavigation: boolean;
  onMenuClick: (event: React.MouseEvent<HTMLElement>) => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps & NavigationContext> = ({
  hasNavigation,
  onMenuClick,
  onNext, onPrevious, navigationInfo
}) => {
  const theme = useTheme();
  const showNavigation = onNext || onPrevious;

  return (
    <AppBar
      position="sticky"
      className="mobile-layout"
      sx={{
        backgroundColor: alpha(theme.palette.secondary.main, 0.8),
        backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${theme.palette.getInvertedMode('secondary')}`,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: 1.5 }}>
        {showNavigation && (
          <Button
            startIcon={<ArrowLeft />}
            sx={{ color: theme.palette.grey[400], textTransform: 'none' }}
          >
            <Typography variant="caption">Back</Typography>
          </Button>
        )}
        <IconButton
          onClick={onMenuClick}
          sx={{
            color: theme.palette.getContrastText(theme.palette.secondary.main),
          }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
