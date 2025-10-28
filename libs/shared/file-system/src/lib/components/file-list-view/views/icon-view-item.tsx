import { useContext } from 'react';
import { Box, Grid } from '@mui/material';
import { Star } from '@mui/icons-material';

import { FileSystemIcon } from '@jc/ui-components';

import { FileListItemProps } from './types';
// import { FileSystemContext } from '../../../../../../components/src/lib/context';
// import { FileSystemIcon } from '../../../../../../components/src/lib/molecules/desktop-icon';
import { FileSystemContext } from '../../../context';
import { useFileSystemItem } from '../../../hooks/use-file-list-item/use-file-list-item';

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
                sx={(theme) => ({
                  color: theme.palette.warning.main,
                  fill: 'currentcolor',
                  fontSize: 16,
                  display: 'inline',
                  lineHeight: 1.5,
                  paddingBottom: '2px',
                  paddingRight: '2px',
                })}
              />
            )
          }
        />
      </Box>
    </Grid>
  );
};
