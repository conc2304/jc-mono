import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  alpha,
  useTheme,
  Box,
} from '@mui/material';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';
import { NavigationContext } from '@jc/file-system';

interface MobileNavigationProps {
  hasNavigation: boolean;
}

export const MobileNavigation: React.FC<
  MobileNavigationProps & NavigationContext
> = ({ hasNavigation, onNext, onPrevious }) => {
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
      <Toolbar sx={{ justifyContent: 'center', px: 1.5 }}>
        {showNavigation && (
          <Box>
            <Button
              startIcon={<ArrowLeft />}
              sx={{
                color: onPrevious
                  ? theme.palette.secondary.contrastText
                  : 'text.disabled',
                '&:hover': {
                  background: onPrevious ? 'action.hover' : 'transparent',
                },
              }}
              onClick={onPrevious}
              disabled={!onPrevious}
            >
              <Typography variant="caption">Prev</Typography>
            </Button>

            <Button
              endIcon={<ArrowRight />}
              sx={{
                color: onNext
                  ? theme.palette.secondary.contrastText
                  : 'text.disabled',
                '&:hover': {
                  background: onNext ? 'action.hover' : 'transparent',
                },
              }}
              onClick={onNext}
              disabled={!onNext}
            >
              <Typography variant="caption" fontWeight="bolder">
                Next
              </Typography>
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};
