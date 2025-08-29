import {
  alpha,
  Box,
  Paper,
  PaperProps,
  styled,
  Typography,
} from '@mui/material';
import { WarningStripe, WarningStripes } from '../../atoms';
import { InfoOutline } from '@mui/icons-material';

const WarningPanelAugmented = (props: PaperProps) => (
  <WarningPanelStyled
    data-augmented-ui="border br-clip bl-2-clip-x tl-clip tr-clip"
    {...props}
  />
);

const WarningPanelStyled = styled(Paper)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  padding: theme.spacing(1.5),
  paddingBottom: theme.spacing(0.5),
  borderRadius: 0,

  '&[data-augmented-ui]': {
    '--aug-br': '0.5rem',
    '--aug-bl1': '0.5rem',
    '--aug-bl2': '1rem',
    '--aug-tl': '0.5rem',
    '--aug-tr': '0.5rem',
    // 7 stripes are each 8 pixels wide with gap of 12 + 1 for gap
    '--aug-bl-extend1': 'calc(100% - ((6px + 12px) * (7 + 1) + 1rem) )', //
    '--aug-border-all': '1px',
    '--aug-border-bg': theme.palette.primary.main,
  },
}));

export const WarningPanel = ({
  label,
  middleSection,
  rightSection,
  ...paperProps
}: {
  label: string;
  middleSection: [string, string];
  rightSection: [string, string, string];
} & PaperProps) => (
  <WarningPanelAugmented elevation={0} {...paperProps}>
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
      <Box display="flex" justifyContent={'space-between'}>
        <Box display="flex" justifyContent="center">
          <InfoOutline fontSize="small" color="primary" />
          <Typography
            variant="caption"
            align="center"
            display="block"
            color="primary"
            ml={2}
          >
            {label}
          </Typography>
        </Box>

        <Box>
          {middleSection[0]}
          <br />
          {middleSection[1]}
        </Box>

        <Box>
          {rightSection[0]} <br />
          {rightSection[1]} <br />
          {rightSection[2]}
        </Box>
      </Box>
    </Typography>
    <Box
      sx={(theme) => ({
        borderBottom: `1px solid ${theme.palette.primary.main}`,
        my: 1,
      })}
    />
    <WarningStripes
      sx={{
        float: 'right',
      }}
    >
      {[...Array(8)].map((_, i) => (
        <WarningStripe key={i} />
      ))}
    </WarningStripes>
  </WarningPanelAugmented>
);
