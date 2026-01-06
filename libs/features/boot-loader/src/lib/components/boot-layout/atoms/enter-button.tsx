import { AugmentedButton } from '@jc/ui-components';
// import { alpha } from '@mui/system';
import { Property } from 'csstype';
import { ButtonProps, Typography } from '@mui/material';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// const url = '/gifs/art-flow-bg.gif';
// const urlStyle = `url("${url}") 50% 50% / 200% 200%;`;
// const gradientStyle = `linear-gradient(135deg, ${alpha('#fff', 0.2)}, ${alpha(
//   '#000',
//   0.2
// )})`;
// const bgStyle = `${gradientStyle}, ${urlStyle}`;

interface EnterButtonProps extends ButtonProps {
  fontSize?: Property.FontSize;
}

export const EnterButton = ({ fontSize, ...buttonProps }: EnterButtonProps) => {
  const navigate = useNavigate();
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);
  const timerThreshold = 500;

  const handlePressStart = () => {
    isLongPressRef.current = false;
    pressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      navigate('/led-controller');
    }, timerThreshold);
  };

  const handlePressEnd = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }

    if (!isLongPressRef.current) {
      navigate('/home');
    }
  };

  const handlePressCancel = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    isLongPressRef.current = false;
  };

  return (
    <AugmentedButton
      variant="contained"
      shape="buttonRight"
      fullWidth
      size="large"
      sx={{
        flexGrow: 1,
        flexShrink: 0,
        height: '100%',
        '&[data-augmented-ui]': {
          '--aug-border-all': '2px',
        },
      }}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressCancel}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onTouchCancel={handlePressCancel}
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
};
