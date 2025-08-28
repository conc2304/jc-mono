// components/AugmentedPanel.tsx
import React from 'react';
import { Box, BoxProps, SxProps } from '@mui/material';

interface AugmentedPanelProps extends BoxProps {
  augmentType?: 'bootText' | 'progress' | 'radar' | 'envelope';
  children: React.ReactNode;
}

const AUGMENT_CONFIGS: Record<
  string,
  { attr: { 'data-augmented-ui': string }; sx: SxProps }
> = {
  bootText: {
    attr: { 'data-augmented-ui': 'border bl-clip br-clip tl-clip tr-2-clip-y' },
    sx: {
      '--aug-bl': '0.5rem',
      '--aug-br': '0.5rem',
      '--aug-tl': '0.5rem',
      '--aug-tr1': '1rem',
      '--aug-tr2': '2rem',
      '--aug-tr-extend2': '25%',
      '--aug-border-all': '1px',
    },
  },
  progress: {
    attr: { 'data-augmented-ui': 'border bl-clip br-clip tl-clip br-2-clip-y' },
    sx: {
      '--aug-bl': '0.5rem',
      '--aug-br': '0.5rem',
      '--aug-tl': '0.5rem',
      '--aug-br1': '1rem',
      '--aug-br2': '1.5rem',
      '--aug-br-extend2': '25%',
      '--aug-border-all': '1px',
    },
  },
  radar: {
    attr: { 'data-augmented-ui': 'border' },
    sx: { '--aug-border-all': '1px' },
  },
  envelope: {
    attr: {
      'data-augmented-ui':
        'border bl-clip b-clip-x br-clip tl-clip tr-2-clip-x ',
    },
    sx: {
      '--aug-bl': '8px',
      '--aug-br': '8px',
      '--aug-tl': '8px',
      '--aug-b': '8px',
      '--aug-b-extend1': '50%',
      '--aug-tr-extend1': '50%',
      '--aug-border-all': '1px',
    },
  },
};

// export const TorusLoaderBox = styled(Box)(({ theme }) => ({
//   height: '100%',
//   width: '100%',
//   backgroundColor: 'transparent',
//   position: 'relative',
//   overflow: 'hidden',
//   padding: theme.spacing(0),
//   border: 'unset',

//   '&[data-augmented-ui]': {
//     '--aug-bl': '8px',
//     '--aug-br': '8px',
//     '--aug-tl': '8px',
//     '--aug-b': '8px',
//     '--aug-b-extend1': '50%',
//     '--aug-tr-extend1': '50%',
//     '--aug-border-all': '1px',
//     '--aug-border-bg': theme.palette.primary.main,
//   },
// }));

// export const TorusLoaderCardAug = (props: BoxProps) => (
//   <TorusLoaderBox
//     data-augmented-ui="border bl-clip b-clip-x br-clip tl-clip tr-2-clip-x "
//     {...props}
//   />
// );

export const AugmentedPanel: React.FC<AugmentedPanelProps> = ({
  augmentType = 'bootText',
  children,
  sx,
  ...props
}) => {
  const { sx: sxAug, attr } = AUGMENT_CONFIGS[augmentType];

  return (
    <Box
      {...attr}
      sx={(theme) => ({
        ...sxAug,
        '--aug-border-bg': theme.palette.primary.main,
        ...(typeof sx === 'function' ? sx(theme) : sx),
      })}
      {...props}
    >
      {children}
    </Box>
  );
};
