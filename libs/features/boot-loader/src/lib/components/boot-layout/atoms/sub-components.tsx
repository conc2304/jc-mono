import {
  Box,
  Paper,
  Typography,
  styled,
  keyframes,
  BoxProps,
} from '@mui/material';

export const BootContainer = styled(Box)<{}>(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.primary.main,
  fontFamily: 'monospace',
  height: [
    '100vh', // Fallback
    '100dvh', // Preferred value
  ],
  padding: theme.spacing(2),
  transition: 'background-size 0.1s ease-in',
  pb: '100px',
}));

export const BrowserFrame = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `2px solid ${theme.palette.primary.main}`,
  borderRadius: 0,
  overflow: 'hidden',
  height: '100%',

  display: 'flex',
  flexDirection: 'column',
}));

const RadarChartBoxStyled = styled(Box)(({ theme }) => ({
  // minHeight: 192,
  backgroundColor: theme.palette.background.paper,
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  '&[data-augmented-ui]': {
    '--aug-bl': '0.5rem',
    '--aug-br': '0.5rem',
    '--aug-tl': '0.5rem',
    '--aug-tr': '0.5rem',
    '--aug-l-extend1': '60%',
    '--aug-r-extend1': '60%',
    '--aug-border-all': '1px',
    '--aug-border-bg': theme.palette.primary.main,
  },
}));

export const RadarChartBox = (props: BoxProps) => (
  <RadarChartBoxStyled
    {...props}
    data-augmented-ui="border bl-clip br-clip tl-clip tr-clip l-clip-y r-clip-y r-clip-y"
  />
);

export const WarningStripes = styled(Box)({
  display: 'inline-flex',
  alignItems: 'end',
  gap: 12,
  marginTop: 8,
  maxHeight: 12,
  overflow: 'clip',
});

export const WarningStripe = styled(Box)(({ theme }) => ({
  width: 6,
  height: 40,
  backgroundColor: theme.palette.getInvertedMode('primary'),
  transform: 'rotate(-45deg) translateY(35%)',
}));

export const TorusLoaderBox = styled(Box)(({ theme }) => ({
  height: '100%',
  width: '100%',
  backgroundColor: 'transparent',
  position: 'relative',
  overflow: 'hidden',
  padding: theme.spacing(0),
  border: 'unset',

  '&[data-augmented-ui]': {
    '--aug-bl': '8px',
    '--aug-br': '8px',
    '--aug-tl': '8px',
    '--aug-b': '8px',
    '--aug-b-extend1': '50%',
    '--aug-tr-extend1': '50%',
    '--aug-border-all': '1px',
    '--aug-border-bg': theme.palette.primary.main,
  },
}));

export const TorusLoaderCardAug = (props: BoxProps) => (
  <TorusLoaderBox
    data-augmented-ui="border bl-clip b-clip-x br-clip tl-clip tr-2-clip-x "
    {...props}
  />
);

export const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
`;

export const RadarTarget = styled(Box)<{
  top: string;
  left: string;
  color: string;
}>(({ top, left, color }) => ({
  position: 'absolute',
  top,
  left,
  width: 4,
  height: 4,
  backgroundColor: color,
  borderRadius: '50%',
  animation: `${pulse} 1.5s infinite`,
}));

export const StatusButton = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  backgroundColor: theme.palette.background.paper,
  height: 32,
  display: 'flex',
  alignItems: 'center',
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
}));

export const BottomPanel = styled(Box)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.primary.main}`,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
}));

export const SystemsText = styled(Typography)(({ theme }) => ({
  letterSpacing: '0.1em',
  marginTop: 4,
}));

export const spinAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const RightDisplay = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  height: 64,
  backgroundColor: theme.palette.background.paper,
  position: 'relative',
}));

const scanLines = keyframes`
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(4px);
  }
`;

export const ScanLinesOverlay = styled(Box)({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  background: 'linear-gradient(transparent 50%, rgba(0, 255, 136, 0.03) 50%)',
  backgroundSize: '100% 4px',
  animation: `${scanLines} 0.1s linear infinite`,
});
