import {
  Box,
  Paper,
  Typography,
  styled,
  keyframes,
  BoxProps,
} from '@mui/material';

export const BootContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.primary.main,
  fontFamily: 'monospace',
  minHeight: '100vh',
  padding: theme.spacing(2),
}));

export const BrowserFrame = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `2px solid ${theme.palette.primary.main}`,
  borderRadius: 0,
  overflow: 'hidden',
}));

export const BrowserHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${theme.palette.primary.main}`,
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.default,
}));

export const TrafficLight = styled(Box)<{ color: string }>(({ color }) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor: color,
}));

export const AddressBar = styled(Box)(({ theme }) => ({
  flex: 1,
  margin: `0 ${theme.spacing(2)}`,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.primary.main}`,
  padding: theme.spacing(0.5, 1.5),
  fontSize: '0.75rem',
  color: theme.palette.primary.main,
}));

const RadarChartBox1 = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  height: 192,
  backgroundColor: theme.palette.background.paper,
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const RadarChartBox = (props: BoxProps) => <RadarChartBox {...props} />;

export const CrosshairContainer = styled(Box)({
  position: 'relative',
  width: 96,
  height: 96,
});

export const CrosshairCircle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  border: `2px solid ${theme.palette.primary.main}`,
  borderRadius: '50%',
}));

export const CrosshairLine = styled(Box)<{
  orientation: 'horizontal' | 'vertical';
}>(({ orientation, theme }) => ({
  position: 'absolute',
  backgroundColor: theme.palette.primary.main,
  ...(orientation === 'horizontal'
    ? {
        top: '50%',
        left: 0,
        width: '100%',
        height: 2,
        transform: 'translateY(-50%)',
      }
    : {
        top: 0,
        left: '50%',
        width: 2,
        height: '100%',
        transform: 'translateX(-50%)',
      }),
}));

export const CrosshairCenter = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: 8,
  height: 8,
  backgroundColor: theme.palette.primary.main,
  borderRadius: '50%',
  transform: 'translate(-50%, -50%)',
}));

export const ControlSlider = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  height: 128,
  position: 'relative',
}));

export const SliderInner = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  inset: 8,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.primary.main}`,
}));

export const SliderGradient = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.background.paper})`,
  opacity: 0.5,
}));

export const WarningPanel = styled(Paper)(({ theme }) => ({
  border: `1px solid ${theme.palette.warning.main}`,
  backgroundColor: 'rgba(154, 52, 18, 0.2)',
  padding: theme.spacing(1.5),
  borderRadius: 0,
}));

export const WarningStripes = styled(Box)({
  display: 'flex',
  gap: 4,
  marginTop: 8,
});

export const WarningStripe = styled(Box)(({ theme }) => ({
  width: 8,
  height: 8,
  backgroundColor: theme.palette.warning.main,
}));

export const TorusLoaderBox = styled(Box)(({ theme }) => ({
  height: '100%',
  width: '100%',
  backgroundColor: 'transparent',
  position: 'relative',
  overflow: 'hidden',
  padding: theme.spacing(0),

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

export const StatusBar = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

export const StatusIndicator = styled(Box)(({ theme }) => ({
  width: 16,
  height: 16,
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
}));

export const StatusIcons = styled(Box)({
  display: 'flex',
  gap: 8,
});

export const StatusIcon = styled(Box)<{ color: string }>(
  ({ color, theme }) => ({
    width: 24,
    height: 24,
    border: `1px solid ${theme.palette.primary.main}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& > div': {
      width: 8,
      height: 8,
      backgroundColor: color,
    },
  })
);

export const DataPanel = styled(Paper)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1.5),
  height: 128,
  borderRadius: 0,
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

export const MultiplexText = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 'bold',
  letterSpacing: '0.1em',
  fontFamily: 'monospace',
  color: theme.palette.primary.main,
}));

export const SystemsText = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  letterSpacing: '0.1em',
  fontFamily: 'monospace',
  color: theme.palette.primary.main,
  marginTop: 4,
}));

export const ControlIcon = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  height: 32,
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(1),
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

export const RightDisplayInner = styled(Box)(({ theme }) => ({
  position: 'absolute',
  inset: 8,
  border: `1px solid ${theme.palette.primary.main}`,
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const SpinningShape = styled(Box)(({ theme }) => ({
  height: 32,
  border: `5px solid ${theme.palette.primary.main}`,
  animation: `${spinAnimation} 2s linear infinite`,
  clipPath:
    'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
}));

export const Footer = styled(Box)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.primary.main}`,
  backgroundColor: theme.palette.background.paper,
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '0.75rem',
}));

const scanlines = keyframes`
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(4px);
  }
`;

export const ScanlinesOverlay = styled(Box)({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  // background: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.41) 100%)',
  background: 'linear-gradient(transparent 50%, rgba(0, 255, 136, 0.03) 50%)',
  backgroundSize: '100% 4px',
  animation: `${scanlines} 0.1s linear infinite`,
});
