import { styled, Box, alpha } from '@mui/material';

export const TileContainer = styled(Box, {
  shouldForwardProp: (prop) =>
    !['effectiveIsDragging', 'tileSize', 'gradient'].includes(prop as string),
})<{
  effectiveIsDragging: boolean;
  tileSize: { width: number; height: number };
  gradient: { from: string; to: string };
}>(({ theme, effectiveIsDragging, tileSize, gradient }) => ({
  position: 'absolute',
  cursor: 'pointer',
  borderRadius: theme.spacing(3),
  overflow: 'hidden',
  width: tileSize.width,
  height: tileSize.height,
  background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
  transition: !effectiveIsDragging
    ? theme.transitions.create(['transform', 'box-shadow'], {
        duration: theme.transitions.duration.standard,
      })
    : 'none',

  transform: effectiveIsDragging ? 'scale(1.05) rotate(2deg)' : 'scale(1)',

  boxShadow: effectiveIsDragging
    ? `0 20px 40px ${alpha(theme.palette.common.black, 0.3)}`
    : `0 8px 24px ${alpha(theme.palette.common.black, 0.15)}`,

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
}));

export const BackgroundPattern = styled(Box)(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  opacity: 0.1,
  pointerEvents: 'none',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: 128,
    height: 128,
    background: alpha(theme.palette.common.white, 0.2),
    borderRadius: '50%',
    transform: 'translate(64px, -64px)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 96,
    height: 96,
    background: alpha(theme.palette.common.white, 0.1),
    borderRadius: '50%',
    transform: 'translate(-48px, 48px)',
  },
}));

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
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2),
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));
