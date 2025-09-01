import {
  Box,
  Dialog,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { PaletteOptionName } from '@mui/material/styles';
import { useState } from 'react';
import { PickerPanel } from './picker-panel';
import { useEnhancedTheme } from '@jc/themes';
import { SunIcon as LightMode, MoonStarIcon as DarkMode } from 'lucide-react';
import { AugmentedButton } from '@jc/ui-components';

const StatusBar = styled(AugmentedButton)(({ theme }) => ({
  padding: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  px: 2,
}));

const StatusIcons = styled(Box)({
  display: 'flex',
  gap: 8,
});

const StatusIcon = styled(Box)<{}>(({ theme }) => ({
  width: 24,
  height: 24,
  border: `1px solid ${theme.palette.primary.main}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const ThemePickerPanel = ({
  compact = false,
  compactMenu = false,
  compactToggle = false,
}: {
  compact?: boolean;
  compactMenu?: boolean;
  compactToggle?: boolean;
}) => {
  const { currentTheme } = useEnhancedTheme();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm')) || compact;

  const [pickerOpen, setPickerOpen] = useState(false);

  const themeColors: PaletteOptionName[] = [
    'primary',
    'secondary',
    'error',
    'warning',
    'info',
    'success',
  ];

  return (
    <>
      <StatusBar
        onClick={() => setPickerOpen((prev) => !prev)}
        variant="outlined"
        shape="bottomClipped"
      >
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          flexWrap={'wrap'}
          justifyContent={isSm ? 'center' : 'space-between'}
          width={'100%'}
          px={1.5}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="caption" sx={{ color: 'primary.main' }}>
              ACTIVE COLOR THEME : {currentTheme?.name.toUpperCase()}
            </Typography>
            {/* Color Mode Icons */}
            {theme.palette.mode === 'dark' ? (
              <DarkMode
                size={'1rem'}
                style={{
                  color: theme.palette.primary.main,
                }}
              />
            ) : (
              <LightMode
                size={'1rem'}
                style={{
                  color: theme.palette.primary.main,
                }}
              />
            )}
          </Box>
          <StatusIcons>
            {themeColors.map((color) => (
              <StatusIcon
                sx={(theme) => ({
                  '& > div': {
                    width: 8,
                    height: 8,
                    backgroundColor: theme.palette[color].main,
                  },
                })}
                key={color}
              >
                <div />
              </StatusIcon>
            ))}
          </StatusIcons>
        </Box>
      </StatusBar>

      <Dialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: 'unset',
            boxShadow: 'unset',
            backgroundImage: 'unset',
          },
        }}
      >
        <Box
          data-augmented-ui="border bl-clip br-clip tl-clip tr-clip"
          sx={(theme) => ({
            p: 2,
            backgroundColor: theme.palette.background.paper,
            '&[data-augmented-ui]': {
              '--aug-bl': theme.spacing(2),
              '--aug-br': theme.spacing(2),
              '--aug-tl': theme.spacing(2),
              '--aug-tr': theme.spacing(2),

              '--aug-border-all': '2px',
              '--aug-border-bg': theme.palette.primary.main,
            },
          })}
        >
          <PickerPanel
            compact={compact}
            compactMenu={compactMenu}
            compactToggle={compactToggle}
          />
        </Box>
      </Dialog>
    </>
  );
};
