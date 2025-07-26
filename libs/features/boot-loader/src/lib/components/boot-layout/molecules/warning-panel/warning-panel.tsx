import {
  alpha,
  Box,
  Paper,
  PaperProps,
  styled,
  Typography,
} from '@mui/material';
import { WarningStripe, WarningStripes } from '../../atoms';

const WarningPanelStyled = styled(Paper)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.warning.main, 0.1),
  padding: theme.spacing(1.5),
  paddingBottom: theme.spacing(0.5),
  borderRadius: 0,

  '&[data-augmented-ui]': {
    '--aug-bl': '0.5rem',
    '--aug-br1': '0.5rem',
    '--aug-br2': '1rem',
    '--aug-tl': '0.5rem',
    '--aug-tr': '0.5rem',
    // 7 stripes are each 8 pixels wide with gap of 12 + 1 for gap
    '--aug-br-extend2': 'calc(100% - ((6px + 12px) * (7 + 1) + 1rem) )', //
    '--aug-border-all': '1px',
    '--aug-border-bg': theme.palette.warning.main,
  },
}));

const WarningPanelAugmented = (props: PaperProps) => (
  <WarningPanelStyled
    data-augmented-ui="border bl-clip br-2-clip-x tl-clip tr-clip"
    {...props}
  />
);

export const WarningPanel = () => (
  <WarningPanelAugmented elevation={0}>
    <Typography
      variant="h6"
      align="center"
      sx={{ color: 'warning.main', fontWeight: 'bold' }}
    >
      !
    </Typography>
    <Typography
      variant="caption"
      align="center"
      display="block"
      sx={{ color: 'warning.main' }}
    >
      DANGER
    </Typography>
    <Typography
      variant="caption"
      sx={{
        color: 'primary.main',
        fontSize: '0.7rem',
        lineHeight: 1.2,
        mt: 1,
        display: 'block',
      }}
    >
      HAZARD ZONE AREA
      <br />
      AUTHORIZED ONLY
      <br />
      <br />
      DO NOT
      <br />
      DISTURB OR
      <br />
      MOVE
    </Typography>
    <Box
      sx={(theme) => ({
        borderBottom: `1px solid ${theme.palette.warning.main}`,
        my: 1,
      })}
    />
    <WarningStripes>
      {[...Array(8)].map((_, i) => (
        <WarningStripe key={i} />
      ))}
    </WarningStripes>
  </WarningPanelAugmented>
);
