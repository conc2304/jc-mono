import {
  Box,
  Slider,
  SliderProps,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ReactNode } from 'react';
import { AugmentedButton } from '../../atoms';
import type { ButtonProps } from '@mui/material';

export interface AugmentedSliderProps {
  /** Label text displayed on desktop (hidden on mobile) */
  label: string;
  /** Current value of the slider */
  value: number;
  /** Handler called when the slider value changes */
  onChange: (event: Event | null, value: number | number[]) => void;
  /** Minimum slider value */
  min?: number;
  /** Maximum slider value */
  max?: number;
  /** Reset value - if provided, a restore button will be shown */
  resetValue?: number;
  /** Icon to display on the decrement button */
  decrementIcon: ReactNode;
  /** Icon to display on the increment button */
  incrementIcon: ReactNode;
  /** Icon to display on the restore button (defaults to Restore) */
  restoreIcon?: ReactNode;
  /** Slot props for the slider component */
  sliderSlotProps?: Partial<SliderProps>;
  /** Slot props for the decrement button */
  decrementButtonSlotProps?: Partial<ButtonProps>;
  /** Slot props for the increment button */
  incrementButtonSlotProps?: Partial<ButtonProps>;
  /** Slot props for the restore button */
  restoreButtonSlotProps?: Partial<ButtonProps>;
  /** Aria label for the slider */
  ariaLabel?: string;
  /** Aria labelledby for the slider */
  ariaLabelledBy?: string;
}

export const AugmentedSlider = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  resetValue,
  decrementIcon,
  incrementIcon,
  restoreIcon,
  sliderSlotProps,
  decrementButtonSlotProps,
  incrementButtonSlotProps,
  restoreButtonSlotProps,
  ariaLabel,
  ariaLabelledBy,
}: AugmentedSliderProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDecrement = () => {
    onChange(null, Math.max(min, value - 1));
  };

  const handleIncrement = () => {
    onChange(null, Math.min(max, value + 1));
  };

  const handleReset = () => {
    if (resetValue !== undefined) {
      onChange(null, resetValue);
    }
  };

  return (
    <Box>
      <Stack
        spacing={3}
        direction="row"
        sx={{ alignItems: 'center', my: 1, width: '100%' }}
      >
        {!isMobile && label && (
          <Typography
            variant="caption"
            noWrap
            sx={{
              flexShrink: 0,
              width: '75px',
            }}
          >
            {label}
          </Typography>
        )}

        <AugmentedButton
          size="small"
          color="primary"
          variant="outlined"
          onClick={handleDecrement}
          {...decrementButtonSlotProps}
        >
          {decrementIcon}
        </AugmentedButton>

        <Slider
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          aria-label={ariaLabel}
          valueLabelDisplay="auto"
          aria-labelledby={ariaLabelledBy}
          {...sliderSlotProps}
        />

        <AugmentedButton
          size="small"
          color="primary"
          variant="outlined"
          onClick={handleIncrement}
          {...incrementButtonSlotProps}
        >
          {incrementIcon}
        </AugmentedButton>

        {resetValue !== undefined && (
          <AugmentedButton
            size="small"
            color="warning"
            variant="outlined"
            onClick={handleReset}
            {...restoreButtonSlotProps}
          >
            {restoreIcon}
          </AugmentedButton>
        )}
      </Stack>
    </Box>
  );
};
