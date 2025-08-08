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

// cloud looping background
const defaultGif = `url('https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExODAwejhrMW0weGZ4dGV5YWp6N3c4YzV3ZXl4OWM1ZzE4eTM1dDY2cCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT9IgC2RzpbE7vBZ6M/giphy.gif')`;
const gradient = (theme: Theme) =>
  `linear-gradient(to bottom, ${alpha(
    theme.palette.primary.main,
    0.4
  )}, ${alpha(theme.palette.background.paper, 0.4)})`;

export const SliderGradient = styled(Box)<{ url: string }>(
  ({ theme, url }) => ({
    width: '100%',
    height: '100%',
    background: `${gradient(theme)}, ${url}`,
    backgroundSize: 'cover',
    opacity: 0.5,
    backgroundBlendMode: 'hard-light',
  })
);

export const GifContainer = ({
  url = defaultGif,
  ...boxProps
}: {
  url?: string;
} & BoxProps) => {
  return (
    <Container data-augmented-ui="border br-clip" {...boxProps}>
      <Inner elevation={0} data-augmented-ui="border br-clip">
        <ScanLinesOverlay />
        <SliderGradient url={url} />
      </Inner>
    </Container>
  );
};
