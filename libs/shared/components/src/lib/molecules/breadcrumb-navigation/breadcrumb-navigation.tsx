import { useContext } from 'react';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { ChevronRight } from 'lucide-react';

import { FileSystemContext } from '../../context';

export const BreadcrumbNavigation = () => {
  const context = useContext(FileSystemContext);

  const pathSegments = context?.currentPath.split('/').filter(Boolean) || [];
  const segments = ['Home', ...pathSegments];

  console.log({ pathSegments, segments });

  return (
    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
      <Breadcrumbs separator={<ChevronRight size={16} />}>
        <Link
          component="button"
          variant="body2"
          onClick={() => context?.navigateToPath('/')}
          sx={{ textDecoration: 'none' }}
        >
          Home
        </Link>
        {pathSegments.map((segment, index) => {
          const path = '/' + pathSegments.slice(0, index + 1).join('/');
          const isLast = index === pathSegments.length - 1;

          return isLast ? (
            <Typography key={path} color="text.primary" variant="body2">
              {segment}
            </Typography>
          ) : (
            <Link
              key={path}
              component="button"
              variant="body2"
              onClick={() => context?.navigateToPath(path)}
              sx={{ textDecoration: 'none' }}
            >
              {segment}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};
