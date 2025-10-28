import { List } from '@mui/material';

import { ListViewItem } from './list-view-item';
import { FileListViewProps } from './types';

export const ListView = ({
  items,
  handlers,
  viewConfig,
}: FileListViewProps) => {
  return (
    <List className="FileListView--root">
      {items.map((item) => (
        <ListViewItem
          key={item.id}
          item={item}
          handlers={handlers}
          viewConfig={viewConfig}
        />
      ))}
    </List>
  );
};
