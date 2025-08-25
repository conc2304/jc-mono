import { useContext } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

import { FileListViewProps } from './types';
import { FileSystemContext } from '../../../context';
import { Star } from '@mui/icons-material';
import { useFileSystemItem } from '../../../hooks/use-file-list-item';
import { DetailsViewItem } from './details-view-item';

export const DetailsView = ({
  items,
  handlers,
  // useFileSystemItem,
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
