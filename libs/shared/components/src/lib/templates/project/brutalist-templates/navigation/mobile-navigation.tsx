import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Typography,
  alpha,
  useTheme,
  Box,
} from '@mui/material';
import { ArrowLeft, ArrowRight, Menu as MenuIcon } from '@mui/icons-material';
import { NavigationContext } from '@jc/file-system';

interface MobileNavigationProps {
  hasNavigation: boolean;
  onMenuClick: (event: React.MouseEvent<HTMLElement>) => void;
}

export const MobileNavigation: React.FC<
  MobileNavigationProps & NavigationContext
> = ({ hasNavigation, onMenuClick, onNext, onPrevious, navigationInfo }) => {
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
          <Box>
            <Button
              startIcon={<ArrowLeft />}
              sx={{ color: theme.palette.grey[400], textTransform: 'none' }}
              onClick={onPrevious}
              disabled={!onPrevious}
            >
              <Typography variant="caption">Prev</Typography>
            </Button>

            <Button
              endIcon={<ArrowRight />}
              sx={{ color: theme.palette.grey[400], textTransform: 'none' }}
              onClick={onNext}
              disabled={!onNext}
            >
              <Typography variant="caption">Next</Typography>
            </Button>
          </Box>
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
