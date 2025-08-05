import { Box, Typography, Card, CardContent } from '@mui/material';
import { Education } from '../types';
import { SectionTitle } from './section-title';

export const EducationExperienceSection = ({
  education,
}: {
  education: Education[];
}) => {
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
      <SectionTitle title="Education & Professional Development" />
      {education.map((edu, index) => (
        <Card
          key={index}
          data-augmented-ui="both br-clip bl-clip tl-clip-x tr-2-clip-x"
          sx={(theme) => ({
            mb: 2,
            background: 'unset',
            height: '100%',
            border: 'unset',
            px: 2,
            py: 1,
            '--aug-tl': '1.25rem',
            '--aug-tr': '1.25rem',
            '--aug-tl-inset1': '0%',
            '--aug-tr-extend1': '70%',
            '--aug-border-bg': theme.palette.primary[theme.palette.mode],
            '--aug-border-all': '1px',
            '--aug-inlay-bg': theme.palette.background.paper,
            '--aug-inlay-all': '5px',
          })}
        >
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              flexWrap="wrap"
              mb={1}
            >
              <Box>
                <Typography variant="h6" component="h4" fontWeight="bold">
                  {edu.institution}
                </Typography>
                <Typography variant="subtitle1" color="primary">
                  {edu.degree}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {edu.location}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="medium"
                pt={2}
              >
                {edu.graduationDate}
              </Typography>
            </Box>

            {edu.additionalInfo && (
              <Box mb={2}>
                {edu.additionalInfo.map((info, infoIndex) => (
                  <Typography
                    key={infoIndex}
                    variant="body2"
                    color="text.secondary"
                  >
                    {info}
                  </Typography>
                ))}
              </Box>
            )}

            {edu.relevantCoursework && (
              <Box mb={2}>
                <Typography variant="body2" fontWeight="medium" gutterBottom>
                  Relevant Coursework:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {edu.relevantCoursework.join(', ')}
                </Typography>
              </Box>
            )}

            {edu.capstoneProject && (
              <Box>
                <Typography variant="body2" fontWeight="medium" gutterBottom>
                  Capstone Project:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {edu.capstoneProject}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};
