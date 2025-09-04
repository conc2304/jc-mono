import { Typography, Box, styled, alpha } from '@mui/material';

export const BrowserHeader = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${theme.palette.primary.main}`,
  padding: theme.spacing(1),
  backgroundColor: alpha(theme.palette.background.default, 0.28),
}));

export const AddressBar = styled(Box)(({ theme }) => ({
  flex: 1,
  margin: `0 ${theme.spacing(2)}`,
  backgroundColor: alpha(theme.palette.background.paper, 0.2),
  border: `1px solid ${theme.palette.primary.main}`,
  padding: theme.spacing(0.5, 1.5),
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
}));

export const Header = ({ compact = false, passwordMsg = '' }) => (
  <BrowserHeader>
    <AddressBar>
      Welcome to a Video Game UI inspired Portfolio Website
    </AddressBar>
    {!compact && (
      <Typography variant="caption" sx={{ color: 'primary.main' }}>
        USER-MAINFRAME-RESEARCH
      </Typography>
    )}
  </BrowserHeader>
);
