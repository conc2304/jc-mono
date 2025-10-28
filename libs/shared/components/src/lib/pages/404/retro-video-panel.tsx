import { darken, useTheme } from '@mui/material';

import { GifPlayer } from '../../organisms';

export const RetroVideoPanel = () => {
  const theme = useTheme();

  return (
    <GifPlayer
      gifs={[
        '/gifs/404.gif',
        '/gifs/computer-terminal.gif',
        '/gifs/dithered-road-loop.gif',
        '/gifs/clouds-passing.gif',
        '/gifs/fly-into-space.gif',
        '/gifs/rocket-takeoff.gif',
        '/gifs/hands-flying-through-space.gif',
        '/gifs/space-planet-fly-through.gif',
        '/gifs/black and white art GIF by Mathew Lucas .gif',
        '/gifs/animation loop GIF by Winston Duke.gif',
        '/gifs/black and white loop GIF by Doze Studio.gif',
        '/gifs/Lizard.gif',
        '/gifs/pedro-racoon-dancing.gif',
        '/gifs/the-end.gif',
        '/gifs/rick-roll.gif',
      ]}
      transitionImage="/gifs/tv-test-static-bnw.gif"
      transitionTime={200}
      height={'100%'}
      width={'100%'}
      colorConfig={{
        primary: theme.palette.primary.main,
        secondary: theme.palette.secondary.main,
        background: `linear-gradient(-145deg, ${theme.palette.background.default}BB, ${theme.palette.background.paper}33)`,
        border: `${theme.palette.background.paper}30`,
        text: theme.palette.text.primary,
        textSecondary: theme.palette.text.primary,
        screenOff: darken(theme.palette.error.main, 0),
        buttonDisabled: theme.palette.action.disabled,
      }}
    />
  );
};
