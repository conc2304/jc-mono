import { styled, Box, alpha, lighten, darken } from '@mui/material';
import { TileSize } from '../../organisms/tile-grid/types';

export const TileContainer = styled(Box, {
  shouldForwardProp: (prop) =>
    !['effectiveIsDragging', 'size', 'tileColor'].includes(prop as string),
})<{
  effectiveIsDragging: boolean;
  // gradient: { from: string; to: string };
  size: TileSize;
  tileColor: string;
}>(({ theme, effectiveIsDragging, tileColor, size }) => {
  const gradient = {
    from: alpha(
      theme.palette.mode === 'dark'
        ? lighten(tileColor, 0.25)
        : darken(tileColor, 0.75),
      0.4
    ),
    to: alpha(tileColor, 0.2),
  };
  return {
    position: 'absolute',
    cursor: 'grab',
    overflow: 'hidden',
    background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,

    transition: !effectiveIsDragging
      ? theme.transitions.create(['transform', 'box-shadow'], {
          duration: theme.transitions.duration.standard,
        })
      : 'none',

    transform: effectiveIsDragging ? 'scale(1.05) rotate(2deg)' : 'scale(1)',

    // Augmented UI Styles
    '--aug-border-all': '1px',
    '--aug-border-bg': tileColor,
    '--aug-t-extend1': size === 'large' ? '40%' : '30%',
    '--aug-t': '1rem',
    '--aug-tl': '0.75rem',
    '--aug-tr': '0.75rem',
    '--aug-bl': '0.75rem',
    '--aug-br': '0.75rem',

    '&:hover': !effectiveIsDragging
      ? {
          transform: 'scale(1.02)',
          boxShadow: `0 12px 32px ${alpha(theme.palette.common.black, 0.2)}`,
        }
      : {},

    '&:focus-visible': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: '2px',
    },
  };
});

export const IconContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isLarge',
})<{ isLarge: boolean }>(({ theme, isLarge }) => ({
  width: isLarge ? 40 : 32,
  height: isLarge ? 40 : 32,
  backgroundColor: alpha(theme.palette.common.white, 0.2),
  borderRadius: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.common.white,
}));

export const ContentContainer = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.common.white, 0.1),
  flex: 1,
  display: 'flex',
}));
