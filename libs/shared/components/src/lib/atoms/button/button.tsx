'use client';

import { Button as MuiButton } from '@mui/material';
import { styled } from '@mui/material/styles';

// Augmented Button
export const AugmentedButton = styled(MuiButton)(({ theme }) => ({
  // Apply augmented-ui classes

  '&.MuiButton-root': {
    // borderRadius: 0,
    // border: 'red',
    // background: 'linear-gradient(45deg, #001122 0%, #003344 100%)',
    // color: '#00ffff',
    // fontFamily: 'monospace',
    // textTransform: 'uppercase',
    // letterSpacing: '1px',
    // position: 'relative',
    // overflow: 'hidden',
    // // Add augmented-ui data attributes
    // '&[data-augmented-ui]': {
    //   '--aug-border-all': '1px',
    //   '--aug-border-bg': '#00ffff',
    //   '--aug-tl': '10px',
    //   '--aug-tr': '10px',
    //   '--aug-bl': '10px',
    //   '--aug-br': '10px',
    // },
    // '&:hover': {
    //   background: 'linear-gradient(45deg, #002244 0%, #004466 100%)',
    //   boxShadow: '0 0 20px #00ffff',
    //   transform: 'translateY(-2px)',
    // },
    // '&:active': {
    //   transform: 'translateY(0)',
    // },
    // // Add scanning line effect
    // '&::before': {
    //   content: '""',
    //   position: 'absolute',
    //   top: 0,
    //   left: '-100%',
    //   width: '100%',
    //   height: '100%',
    //   background:
    //     'linear-gradient(45deg, transparent, rgba(0, 255, 255, 0.3), transparent)',
    //   transition: 'left 0.5s',
    // },
    // '&:hover::before': {
    //   left: '100%',
    // },
  },
}));
