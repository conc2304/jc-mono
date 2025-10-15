import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import HomeIcon from '@mui/icons-material/Home';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReboot = (): void => {
    window.location.href = '/';
  };

  handleHome = (): void => {
    window.location.href = '/home';
  };

  override render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={(theme) => ({
            minHeight: '100vh',
            background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 50%, ${theme.palette.background.default} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                  repeating-linear-gradient(
                    0deg,
                    ${theme.palette.primary.main}08 0px,
                    transparent 1px,
                    transparent 2px,
                    ${theme.palette.primary.main}08 3px
                  )
                `,
              pointerEvents: 'none',
            },
          })}
        >
          <Container maxWidth="md">
            <Box
              sx={(theme) => ({
                textAlign: 'center',
                p: 4,
                border: '2px solid',
                borderColor: 'primary.main',
                borderRadius: 2,
                bgcolor: `${theme.palette.background.paper}cc`,
                backdropFilter: 'blur(10px)',
                boxShadow: `0 0 30px ${theme.palette.primary.main}4d`,
                position: 'relative',
              })}
            >
              <Typography
                variant="h1"
                sx={(theme) => ({
                  fontSize: { xs: '4rem', md: '6rem' },
                  fontWeight: 700,
                  color: 'error.main',
                  textShadow: `0 0 20px ${theme.palette.error.main}cc`,
                  mb: 2,
                })}
              >
                ERROR
              </Typography>

              <Typography
                variant="h5"
                sx={(theme) => ({
                  color: 'primary.main',
                  textShadow: `0 0 10px ${theme.palette.primary.main}99`,
                  mb: 1,
                })}
              >
                SYSTEM MALFUNCTION DETECTED
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'secondary.main',
                  mb: 4,
                  opacity: 0.8,
                }}
              >
                {this.state.error?.message || 'Unknown error occurred'}
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<RestartAltIcon />}
                  onClick={this.handleReboot}
                  sx={(theme) => ({
                    color: 'primary.main',
                    borderColor: 'primary.main',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    textShadow: `0 0 5px ${theme.palette.primary.main}80`,
                    boxShadow: `0 0 15px ${theme.palette.primary.main}4d`,
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: `${theme.palette.primary.main}1a`,
                      boxShadow: `0 0 25px ${theme.palette.primary.main}80`,
                    },
                  })}
                >
                  REBOOT SYSTEM
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<HomeIcon />}
                  onClick={this.handleHome}
                  sx={(theme) => ({
                    color: 'secondary.main',
                    borderColor: 'secondary.main',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    textShadow: `0 0 5px ${theme.palette.secondary.main}80`,
                    boxShadow: `0 0 15px ${theme.palette.secondary.main}4d`,
                    '&:hover': {
                      borderColor: 'secondary.main',
                      bgcolor: `${theme.palette.secondary.main}1a`,
                      boxShadow: `0 0 25px ${theme.palette.secondary.main}80`,
                    },
                  })}
                >
                  RETURN HOME
                </Button>
              </Box>

              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mt: 4,
                  color: 'primary.main',
                  opacity: 0.5,
                }}
              >
                [NEURAL LINK DISRUPTED - RECONNECTION REQUIRED]
              </Typography>
            </Box>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
