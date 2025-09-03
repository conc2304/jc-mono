import { alpha, BoxProps, Paper, styled, Theme, Box } from '@mui/material';
import { ScanLinesOverlay } from '../../atoms';

export const Container = styled(Box)(({ theme }) => ({
  position: 'relative',
  '&[data-augmented-ui]': {
    '--aug-br': '0.5rem',
    '--aug-border-all': '1px',
    '--aug-border-bg': theme.palette.primary.main,
  },
}));

const Inner = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  inset: 8,
  backgroundColor: theme.palette.background.paper,
  borderRadius: 0,

  '&[data-augmented-ui]': {
    '--aug-br': '0.5rem',
    '--aug-border-all': '1px',
    '--aug-border-bg': theme.palette.primary.main,
  },
}));

const gradient = (theme: Theme) =>
  `linear-gradient(to bottom, ${alpha(
    theme.palette.primary.main,
    0.4
  )}, ${alpha(theme.palette.background.paper, 0.4)})`;

export const SliderGradient = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'url',
})<{ url: string }>(({ theme, url }) => ({
  width: '100%',
  height: '100%',
  background: `${gradient(theme)}, url('${url}')`,
  backgroundSize: 'cover',
  backgroundPositionY: 'center',
  opacity: 0.5,
  backgroundBlendMode: 'hard-light',
}));

export const FilterEffect = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'fill',
  backdropFilter: 'brightness(0.85) contrast(1.1) saturate(5.2) grayscale(0.7)',
  zIndex: 1,
}));

export const GifContainer = ({
  url,
  ...boxProps
}: {
  url: string;
} & BoxProps) => {
  return (
    <Container data-augmented-ui="border br-clip" {...boxProps}>
      <Inner elevation={0} data-augmented-ui="border br-clip">
        <ScanLinesOverlay />
        <SliderGradient url={url} />
        <FilterEffect />
      </Inner>
    </Container>
  );
};
