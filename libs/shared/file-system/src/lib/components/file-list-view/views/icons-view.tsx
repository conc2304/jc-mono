import { Grid } from '@mui/material';

import { IconViewItem } from './icon-view-item';
import { FileListViewProps } from './types';

export const IconsView = ({
  items,
  handlers,
  viewConfig,
}: FileListViewProps) => {
  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      {items.map((item) => (
        <IconViewItem
          key={item.id}
          item={item}
          handlers={handlers}
          viewConfig={viewConfig}
        />
      ))}
    </Grid>
  );
};
