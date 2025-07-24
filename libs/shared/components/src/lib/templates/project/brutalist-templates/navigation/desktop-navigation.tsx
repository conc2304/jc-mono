import React from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Container,
  Chip,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { ArrowLeft } from '@mui/icons-material';

interface DesktopNavigationProps {
  hasNavigation: boolean;
  status?: string;
  getStatusColor: (
    status?: string
  ) => 'success' | 'warning' | 'default' | 'primary';
}

export const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  hasNavigation,
  status,
  getStatusColor,
}) => {
  const theme = useTheme();

  return (
    <AppBar
      position="sticky"
      className="desktop-layout"
      sx={{
        backgroundColor: alpha(theme.palette.secondary.main, 0.5),
        backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${theme.palette.getInvertedMode('secondary')}`,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {hasNavigation && (
            <Button
              startIcon={<ArrowLeft />}
              sx={{ color: theme.palette.grey[400], textTransform: 'none' }}
            >
              Back to Portfolio
            </Button>
          )}
          {status && (
            <Chip
              label={status.replace('-', ' ').toUpperCase()}
              color={getStatusColor(status)}
              size="small"
            />
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
