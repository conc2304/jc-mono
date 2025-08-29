import { ScrambleText } from '@jc/ui-components';
import { Typography } from '@mui/material';
import { Box, styled } from '@mui/system';

export const BrowserHeader = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${theme.palette.primary.main}`,
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.default,
}));

export const AddressBar = styled(Box)(({ theme }) => ({
  flex: 1,
  margin: `0 ${theme.spacing(2)}`,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.primary.main}`,
  padding: theme.spacing(0.5, 1.5),
  // fontSize: '0.75rem',
  // color: theme.palette.primary.main,
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
}));

export const Header = ({ compact = false, passwordMsg = '' }) => (
  <BrowserHeader>
    <AddressBar>
      CT14 | USERNAME: JOSE-CONCHELLO | PASSWORD:{' '}
      <ScrambleText
        defaultText={Array(passwordMsg.length).fill('*').join('')}
        hoverText={passwordMsg}
        sx={(theme) => ({
          color: theme.palette.primary.main,
          fontsize: '0.75rem',
        })}
        color="primary"
        fontSize="inherit"
        fontFamily={'inherit'}
        lineHeight={1.2}
        style={{ verticalAlign: 'middle' }}
      />
    </AddressBar>
    {!compact && (
      <Typography variant="caption" sx={{ color: 'primary.main' }}>
        USER-MAINFRAME-RESEARCH
      </Typography>
    )}
  </BrowserHeader>
);
