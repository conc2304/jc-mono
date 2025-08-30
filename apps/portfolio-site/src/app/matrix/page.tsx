import { Box } from '@mui/system';

import { MatrixWebcamPointCloud, MatrixWebcamWithControls } from './component';

export default function Index() {
  return (
    <Box sx={{ height: '100vh', width: '100vw' }}>
      <MatrixWebcamWithControls />
    </Box>
  );
}
