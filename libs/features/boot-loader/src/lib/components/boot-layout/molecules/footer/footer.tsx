import { styled, Typography } from '@mui/material';
import { Box } from '@mui/system';

const FooterContainer = styled(Box)(({ theme }) => ({
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

export const Footer = () => (
  <FooterContainer>
    <Typography variant="caption" sx={{ color: 'primary.main' }}>
      © 2157 - ALL RIGHTS RESERVED
    </Typography>
    <Box display="flex" gap={2}>
      <Typography variant="caption" sx={{ color: 'primary.main' }}>
        SECURE CONNECTION
      </Typography>
      <Typography variant="caption" sx={{ color: 'primary.main' }}>
        ENCRYPTED
      </Typography>
    </Box>
  </FooterContainer>
);
