import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
} from '@mui/material';
import { WorkExperience } from '../types';

export const WorkExperienceSection = ({
  workExperience,
}: {
  workExperience: WorkExperience[];
}) => {
  return (
    <Box mb={4} maxWidth="75%" mx="auto">
      <Typography
        variant="h5"
        component="h3"
        gutterBottom
        color="primary"
        fontWeight="bold"
      >
        Professional Experience
      </Typography>
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

          // sx={{  }}
        >
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              flexWrap="wrap"
              mb={2}
            >
              <Box>
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
                <Typography variant="subtitle1" color="primary">
                  {job.position}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {job.location}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="medium"
              >
                {job.duration}
              </Typography>
            </Box>
            <Typography variant="body2" fontStyle="italic">
              {job.description}
            </Typography>
            <List dense>
              {job.responsibilities.map((responsibility, respIndex) => (
                <ListItem key={respIndex} sx={{ py: 0.5 }}>
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
