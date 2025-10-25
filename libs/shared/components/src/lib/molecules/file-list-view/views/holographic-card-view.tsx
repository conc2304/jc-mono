import { Box } from '@mui/material';

import { FileListViewProps } from './types';
import { HolographicCardViewItem } from './holographic-card-view-item';

export const HolographicCardView = ({
  items,
  handlers,
  viewConfig,
}: FileListViewProps) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 3,
        padding: 2,
        justifyItems: 'center',
      }}
    >
      {items.map((item) => (
        <HolographicCardViewItem
          key={item.id}
          item={item}
          handlers={handlers}
          viewConfig={viewConfig}
        />
      ))}
    </Box>
  );
};
