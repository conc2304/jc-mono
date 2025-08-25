import { Grid } from '@mui/material';
import { FileListViewProps } from './types';
import { IconViewItem } from './icon-view-item';

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
