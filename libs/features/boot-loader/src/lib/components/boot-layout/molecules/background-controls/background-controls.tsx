import { ControlIcon } from '../../atoms';
import { AugmentedButton } from '@jc/ui-components';
import {
  RadioButtonChecked,
  Warning,
  RemoveCircle,
  AddCircle,
  ChangeCircle,
  SvgIconComponent,
  SwapHorizontalCircle,
  FlashOn,
  Tonality,
  QuestionMark,
} from '@mui/icons-material';
import { ButtonProps, Grid, IconProps } from '@mui/material';
import { Property } from 'csstype';
import { ReactNode } from 'react';

interface BackgroundControlsPRops {
  backgroundAnimated?: boolean;
  blendModeActive?: Property.BackgroundBlendMode;

  onToggleBackground?: () => void;
  onBackgroundSizeChange?: (action: 'plus' | 'minus' | 'reset') => void;
  onBlendModeChange?: (blendMode: Property.BackgroundBlendMode) => void;
}
export const BackgroundControls = ({
  onToggleBackground,
  onBackgroundSizeChange,
  onBlendModeChange,
  backgroundAnimated = false,
  blendModeActive,
}: BackgroundControlsPRops) => {
  const blendModes: Property.BackgroundBlendMode[] = [
    'exclusion',
    'color-dodge',
    'color-burn',
  ];

  const getButtonGroupShape = (index: number, totalItems: number) => {
    if (index === 0) return 'buttonLeft';
    if (index === totalItems - 1) return 'buttonRight';
    return 'buttonMiddle';
  };

  const handleToggleBackground = () => {
    onToggleBackground && onToggleBackground();
  };

  type BgSizeAction = 'plus' | 'minus' | 'reset';
  const actionMap: Array<BgSizeAction> = ['plus', 'reset', 'minus'];

  const handleBackgroundSizeChange = (action: BgSizeAction) => {
    onBackgroundSizeChange && onBackgroundSizeChange(action);
  };

  const handleBlendModeChange = (blendMode: Property.BackgroundBlendMode) => {
    onBlendModeChange && onBlendModeChange(blendMode);
  };

  const buttonProps: ButtonProps = {
    color: 'primary',
    variant: 'outlined',
  };

  const iconProps: IconProps = {
    sx: {
      color: 'primary.main',
      fontSize: 16,
    },
  };

  const actionIconMap: Record<BgSizeAction, SvgIconComponent> = {
    plus: RemoveCircle,
    reset: ChangeCircle,
    minus: AddCircle,
  };

  const blendModeMap: Record<string, SvgIconComponent> = {
    exclusion: SwapHorizontalCircle,
    'color-dodge': FlashOn,
    'color-burn': Tonality,
  };

  return (
    <Grid size={{ xs: 2 }}>
      <ControlIcon>
        <AugmentedButton
          {...buttonProps}
          fullWidth
          onClick={() => handleToggleBackground()}
          shape="buttonLeft"
        >
          <Warning sx={{ ...iconProps.sx }} />
        </AugmentedButton>
      </ControlIcon>
      <ControlIcon>
        {blendModes.map((blendMode, i, arr) => {
          const Icon = blendModeMap[blendMode] ?? QuestionMark;
          return (
            <AugmentedButton
              {...buttonProps}
              disabled={!backgroundAnimated}
              onClick={() => handleBlendModeChange(blendMode)}
              shape={getButtonGroupShape(i, arr.length)}
              key={blendMode}
              sx={(theme) => ({
                flex: 1,

                '&&[data-augmented-ui]': {
                  '--aug-border-bg':
                    blendMode === blendModeActive && backgroundAnimated
                      ? theme.palette.getInvertedMode('primary')
                      : undefined,
                  '--aug-border-all':
                    blendModeActive && backgroundAnimated ? '2px' : undefined,
                },
              })}
            >
              <Icon
                sx={{ ...iconProps.sx, opacity: backgroundAnimated ? 1 : 0.3 }}
              />
            </AugmentedButton>
          );
        })}
      </ControlIcon>
      <ControlIcon>
        {actionMap.map((action, i, arr) => {
          const Icon = actionIconMap[action];
          return (
            <AugmentedButton
              disabled={!backgroundAnimated}
              {...buttonProps}
              onClick={() => {
                handleBackgroundSizeChange(action);
              }}
              shape={getButtonGroupShape(i, arr.length)}
              key={action}
              sx={{
                flex: 1,
              }}
            >
              {
                <Icon
                  sx={{
                    ...iconProps.sx,
                    opacity: backgroundAnimated ? 1 : 0.3,
                  }}
                />
              }
            </AugmentedButton>
          );
        })}
      </ControlIcon>
    </Grid>
  );
};
