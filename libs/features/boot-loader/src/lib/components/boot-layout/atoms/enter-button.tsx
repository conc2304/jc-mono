import { AugmentedButton } from '@jc/ui-components';
import { alpha } from '@mui/system';
import { Property } from 'csstype';
import { ButtonProps, Typography } from '@mui/material';

const url = '/gifs/art-flow-bg.gif';
const urlStyle = `url("${url}") 50% 50% / 200% 200%;`;
const gradientStyle = `radial-gradient(${alpha('#fff', 0.3)}, ${alpha(
  '#000',
  0.4
)})`;
const bgStyle = `${gradientStyle}, ${urlStyle}`;

interface EnterButtonProps extends ButtonProps {
  fontSize?: Property.FontSize;
}

export const EnterButton = ({ fontSize, ...buttonProps }: EnterButtonProps) => (
  <AugmentedButton
    variant="contained"
    shape="buttonRight"
    fullWidth
    size="large"
    sx={{
      flexGrow: 1,
      flexShrink: 0,
      height: '100%',
      '&[data-augmented-ui]': { '--aug-border-bg': `${bgStyle} !important` },
    }}
    href="/home"
    {...buttonProps}
  >
    <Typography
      variant="h1"
      color="background.paper"
      fontSize={fontSize}
      sx={{
        '&.MuiTypography-root': {
          fontSize: fontSize,
          letterSpacing: '0.75rem',
        },
      }}
    >
      ENTER
    </Typography>
  </AugmentedButton>
);
