import { Box, BoxProps } from '@mui/material';

interface BackgroundOverlayProps extends BoxProps {
  url: string;
}
export const BackgroundOverlay = ({
  url,
  ...boxProps
}: BackgroundOverlayProps) => {
  return (
    <Box
      {...boxProps}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url('${url}')`,
        ...boxProps.sx,
      }}
    />
  );
};
