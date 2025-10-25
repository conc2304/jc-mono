import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

import { FileListViewProps } from './types';

import { DetailsViewItem } from './details-view-item';

export const DetailsView = ({
  items,
  handlers,
  viewConfig,
}: FileListViewProps) => {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Date Modified</TableCell>
          <TableCell>Size</TableCell>
          <TableCell>Type</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((item) => (
          <DetailsViewItem
            key={item.id}
            item={item}
            handlers={handlers}
            viewConfig={viewConfig}
          />
        ))}
      </TableBody>
    </Table>
  );
};
