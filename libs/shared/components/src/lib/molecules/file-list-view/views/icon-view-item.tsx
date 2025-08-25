import { useContext } from 'react';
import { Box, Grid } from '@mui/material';

import { FileListItemProps } from './types';
import { FileSystemContext } from '../../../context';
import { FileSystemIcon } from '../../desktop-icon';
import { Star } from '@mui/icons-material';
import { useFileSystemItem } from '../../../hooks/use-file-list-item';

export const IconViewItem = ({
  item,
  handlers,
  viewConfig,
}: FileListItemProps) => {
  const context = useContext(FileSystemContext);

  const fileSystemItem = useFileSystemItem(item, handlers, viewConfig);

  return (
    <Grid>
      <Box {...fileSystemItem.itemProps} style={fileSystemItem.mergeStyles({})}>
        <FileSystemIcon
          name={item.name}
          icon={item.icon}
          isActive={!!context?.selectedItems.includes(item.id)}
          tagContent={
            item.metadata.favorite && (
              <Star
                style={{
                  fontSize: 12,
                  color: 'warning.main',
                  display: 'inline',
                  lineHeight: 1.5,
                  paddingBottom: '2px',
                  paddingRight: '2px',
                }}
              />
            )
          }
        />
      </Box>
    </Grid>
  );
};
