import {
  Box,
  Typography,
  Container,
  Paper,
  Chip,
  Divider,
  Grid,
  Link,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Stack,
  LinkProps,
} from '@mui/material';
import {
  Email,
  LocationOn,
  LinkedIn,
  GitHub,
  Language,
} from '@mui/icons-material';
import { ContactInfo } from '../types';

interface ResumeHeaderProps {
  title: string;
  contactInfo: ContactInfo;
}

const linkProps: LinkProps = {
  variant: 'body2',
  target: '_blank',
  color: 'textSecondary',
  sx: { textDecoration: 'none' },
};

export const ResumeHeader = ({ title, contactInfo }: ResumeHeaderProps) => {
  return (
    <Box textAlign="center" mb={4}>
      <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
        {contactInfo.name}
      </Typography>
      <Typography variant="h5" component="h2" color="primary" gutterBottom>
        {title}
      </Typography>

      {/* Contact Information */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
        mt={2}
      >
        <Box display="flex" alignItems="center" gap={0.5}>
          <LocationOn fontSize="small" color="action" />
          <Typography variant="body2" color="textSecondary">
            {contactInfo.location}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={0.5}>
          <Email fontSize="small" color="action" />
          <Link href={`mailto:${contactInfo.email}`} {...linkProps}>
            {contactInfo.email}
          </Link>
        </Box>
        <Box display="flex" alignItems="center" gap={0.5}>
          <LinkedIn fontSize="small" color="action" />
          <Link href={`https://${contactInfo.linkedin}`} {...linkProps}>
            LinkedIn
          </Link>
        </Box>
        <Box display="flex" alignItems="center" gap={0.5}>
          <GitHub fontSize="small" color="action" />
          <Link href={`https://${contactInfo.github}`} {...linkProps}>
            GitHub
          </Link>
        </Box>
        <Box display="flex" alignItems="center" gap={0.5}>
          <Language fontSize="small" color="action" />
          <Link href={`https://${contactInfo.website}`} {...linkProps}>
            {contactInfo.website}
          </Link>
        </Box>
      </Stack>
    </Box>
  );
};
