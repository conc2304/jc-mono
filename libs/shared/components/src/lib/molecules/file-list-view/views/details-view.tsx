import { useContext } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { Star } from 'lucide-react';

import { FileListViewProps } from './types';
import { FileSystemContext } from '../../../context';

export const DetailsView = ({
  items,
  onItemClick,
  onItemDoubleClick,
  onDragStart,
  onDragOver,
  onDrop,
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
        {items.map((item) => (
          <TableRow
            key={item.id}
            hover
            selected={context?.selectedItems.includes(item.id)}
            onDoubleClick={(e) => onItemDoubleClick(item, e)}
            onClick={(e) => onItemClick(item, e)}
            draggable
            onDragStart={() => onDragStart(item)}
            onDragOver={(e) => onDragOver(item, e)}
            onDrop={(e) => onDrop(item, e)}
            sx={{ cursor: 'pointer' }}
          >
            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {item.icon}
                {item.name}
                {item.metadata.favorite && <Star size={12} color="gold" />}
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
        ))}
      </TableBody>
    </Table>
  );
};
