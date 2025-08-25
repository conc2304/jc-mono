import { useContext } from 'react';
import { Box, TableCell, TableRow } from '@mui/material';

import { FileListItemProps } from './types';
import { FileSystemContext } from '../../../context';
import { Star } from '@mui/icons-material';
import { useFileSystemItem } from '../../../hooks/use-file-list-item';

export const DetailsViewItem = ({
  item,
  handlers,
  viewConfig,
}: FileListItemProps) => {
  const context = useContext(FileSystemContext);
  const fileSystemItem = useFileSystemItem(item, handlers, viewConfig);

  return (
    <TableRow
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
};
