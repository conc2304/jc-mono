import React from 'react';
import {
  AppBar,
  Toolbar,
  Container,
  Typography,
  alpha,
  useTheme,
  IconButton,
} from '@mui/material';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';

interface DesktopNavigationProps {
  title: string;
  onPreviousProject?: () => void;
  onNextProject?: () => void;
}

export const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  onPreviousProject,
  onNextProject,
  title,
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
          <IconButton onClick={onPreviousProject}>
            <ArrowLeft />
          </IconButton>

          <Typography
            variant="h2"
            sx={{
              mt: 0.25,
              textAlign: 'center',
              p: 0.125,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              wordBreak: 'break-word',
            }}
          >
            {title}
          </Typography>
          <IconButton onClick={onNextProject}>
            <ArrowRight />
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
