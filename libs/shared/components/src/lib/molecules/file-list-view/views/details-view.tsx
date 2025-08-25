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

export const DetailsView = ({
  items,
  handlers,
  useFileSystemItem,
  viewConfig,
}: FileListViewProps) => {
  const context = useContext(FileSystemContext);

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
        {items.map((item) => {
          const fileSystemItem = useFileSystemItem(item, handlers, viewConfig);

          return (
            <TableRow
              key={item.id}
              hover
              selected={context?.selectedItems.includes(item.id)}
              draggable
              {...fileSystemItem.itemProps}
              sx={fileSystemItem.mergeStyles({ cursor: 'pointer' })}
            >
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {item.icon}
                  {item.name}
                  {item.metadata.favorite && (
                    <Star
                      sx={{ color: 'warning.main', fontSize: 12 }}
                      fill="currentColor"
                    />
                  )}
                </Box>
              </TableCell>
              <TableCell>{item.dateModified.toLocaleDateString()}</TableCell>
              <TableCell>
                {item.size ? `${Math.round(item.size / 1024)} KB` : '-'}
              </TableCell>
              <TableCell>
                {item.type === 'folder'
                  ? 'Folder'
                  : item.extension?.toUpperCase() || 'File'}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
