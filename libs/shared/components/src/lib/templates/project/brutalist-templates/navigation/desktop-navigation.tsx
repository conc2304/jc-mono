import React from 'react';
import {
  AppBar,
  Toolbar,
  Container,
  Typography,
  alpha,
  useTheme,
  IconButton,
  Box,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import { NavigationContext } from '@jc/file-system';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DesktopNavigationProps {
  title: string;
}

export const DesktopNavigation: React.FC<
  DesktopNavigationProps & NavigationContext
> = ({ onNext, onPrevious, onSelectItem, navigationInfo, title }) => {
  const theme = useTheme();
  const showNavigation = onNext || onPrevious || onSelectItem;

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
        <Toolbar
          sx={{ justifyContent: 'space-between', alignContent: 'center' }}
        >
          {showNavigation && (
            <IconButton
              onClick={onPrevious}
              disabled={!onPrevious}
              sx={{
                color: onPrevious ? 'primary.main' : 'text.disabled',
                '&:hover': {
                  background: onPrevious ? 'action.hover' : 'transparent',
                },
              }}
            >
              <ChevronLeft />
              <Typography variant="h6" sx={{ ml: 1 }}>
                Previous
              </Typography>
            </IconButton>
          )}

          <Box sx={{ textAlign: 'center', flex: 1 }}>
            {showNavigation && navigationInfo ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <FormControl sx={{ minWidth: 300 }}>
                  <Select
                    value={
                      navigationInfo.items[navigationInfo.currentIndex]?.id ||
                      ''
                    }
                    onChange={(event) => {
                      const selectedId = event.target.value as string;
                      if (onSelectItem && selectedId) {
                        onSelectItem(selectedId);
                      }
                    }}
                    variant="standard"
                    disableUnderline
                    renderValue={(value) => {
                      const selectedItem = navigationInfo.items.find(
                        (item) => item.id === value
                      );
                      return (
                        <Typography
                          variant="h4"
                          component="h1"
                          sx={{
                            fontWeight: 'bold',
                            textAlign: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          {selectedItem?.name || title}
                        </Typography>
                      );
                    }}
                    sx={{
                      '& .MuiSelect-select': {
                        padding: 0,
                        border: 'none',
                      },
                      '& .MuiSelect-icon': {
                        right: -8,
                        top: 'calc(50% - 12px)',
                      },
                    }}
                  >
                    {navigationInfo.items.map((item, index) => (
                      <MenuItem key={item.id} value={item.id}>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {index + 1}.
                          </Typography>
                          <Typography variant="body2">{item.name}</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Typography variant="caption" color="text.secondary">
                  Project {navigationInfo.currentIndex + 1} of{' '}
                  {navigationInfo.totalItems}
                </Typography>
              </Box>
            ) : (
              <Typography
                variant="h4"
                component="h1"
                sx={{ fontWeight: 'bold' }}
              >
                {title}
              </Typography>
            )}
          </Box>

          {showNavigation && (
            <IconButton
              onClick={onNext}
              disabled={!onNext}
              sx={{
                color: onNext ? 'primary.main' : 'text.disabled',
                '&:hover': {
                  background: onNext ? 'action.hover' : 'transparent',
                },
              }}
            >
              <Typography variant="h6" sx={{ mr: 1 }}>
                Next
              </Typography>
              <ChevronRight />
            </IconButton>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
