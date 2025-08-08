import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Divider,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { WorkExperience } from '../types';
import { SectionTitle } from './section-title';

export const WorkExperienceSection = ({
  workExperience,
}: {
  workExperience: WorkExperience[];
}) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Box
      sx={{
        mb: 4,
        maxWidth: '100%',
        mx: 'auto',
        '@container (min-width: 769px)': {
          maxWidth: '75%',
        },
      }}
    >
      <SectionTitle title="Professional Experience" />
      {workExperience.map((job, index) => (
        <Card
          key={index}
          variant="outlined"
          data-augmented-ui="both b-clip-x tr-2-clip-x tl-2-clip-x"
          sx={(theme) => ({
            mb: 3,
            mx: 'auto',
            background: 'unset',
            border: 'unset',
            p: 5,
            pt: 0,
            '--aug-tl': '1.25rem',
            '--aug-tr': '1.25rem',
            '--aug-tl-inset1': '0%',
            '--aug-tr-inset2': '0%',
            '--aug-tl-extend2': '20%',
            '--aug-tr-extend1': '20%',
            '--aug-bl': '1.25rem',
            '--aug-br': '1.25rem',
            '--aug-b-extend1': '60%',
            '--aug-border-bg': theme.palette.primary[theme.palette.mode],
            '--aug-border-all': '1.5px',
            '--aug-inlay-bg': theme.palette.background.paper,
            '--aug-inlay-all': '5px',
          })}
        >
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-end"
              flexWrap="wrap"
              mb={2}
            >
              <Typography variant="body2" color="text.secondary">
                {job.location}
              </Typography>
              <Stack textAlign="center">
                <Typography variant="subtitle1" color="primary">
                  {job.position}
                </Typography>

                <Typography variant="h6" component="h4" fontWeight="bold">
                  {job.company}
                  {job.acquisitionInfo && (
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                      ml={1}
                    >
                      ({job.acquisitionInfo})
                    </Typography>
                  )}
                </Typography>
              </Stack>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="medium"
              >
                {job.duration}
              </Typography>
            </Box>
            <Divider sx={{ my: 2.5 }} />
            <Typography variant="body2" fontStyle="italic">
              {job.description}
            </Typography>
            <List dense>
              {job.responsibilities.map((responsibility, respIndex) => (
                <ListItem
                  key={respIndex}
                  sx={{
                    py: 0.5,
                    '@container (max-width: 769px)': {
                      px: 0,
                      // border: '1px solid red',
                    },
                  }}
                >
                  <ListItemText primary={responsibility} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};
