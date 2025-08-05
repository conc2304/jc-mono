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
} from '@mui/material';

import { Resume } from './types';
import { ResumeHeader } from './atoms/header';
import {
  TechnicalSkillsCard,
  TechnicalSkillsSection,
} from './atoms/technical-skils-card';

export interface ResumeComponentProps {
  variant: 'sm' | 'md' | 'lg';
}

export const ResumeTemplate = ({
  variant,
  ...resumeData
}: ResumeComponentProps & Resume) => {
  const {
    contactInfo,
    title,
    summary,
    coreCompetencies,
    technicalSkills,
    workExperience,
    education,
  } = resumeData;

  return (
    <Container
      className="ResumeTemplate--root"
      maxWidth="lg"
      sx={{ py: 4, height: '100%', overflowY: 'auto' }}
    >
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Header Section */}
        <ResumeHeader title={title} contactInfo={contactInfo} />

        <Divider sx={{ my: 3 }} />

        {/* Summary Section */}
        <Box mb={4}>
          <Typography
            variant="h5"
            component="h3"
            gutterBottom
            color="primary"
            fontWeight="bold"
          >
            Professional Summary
          </Typography>
          <Typography variant="body1" paragraph>
            {summary}
          </Typography>
        </Box>

        {/* Core Competencies */}
        <Box mb={4}>
          <Typography
            variant="h5"
            component="h3"
            gutterBottom
            color="primary"
            fontWeight="bold"
          >
            Core Competencies
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1} justifyContent="center">
            {coreCompetencies.categories.map((competency, index) => (
              <Chip key={index} label={competency} variant="outlined" />
            ))}
          </Box>
        </Box>

        <TechnicalSkillsSection technicalSkills={technicalSkills} />

        {/* Work Experience */}
        <Box mb={4}>
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
            <Card key={index} variant="outlined" sx={{ mb: 3 }}>
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
                <Typography variant="body2" paragraph fontStyle="italic">
                  {job.description}
                </Typography>
                <List dense>
                  {job.responsibilities.map((responsibility, respIndex) => (
                    <ListItem key={respIndex} sx={{ py: 0.5 }}>
                      <ListItemText
                        primary={responsibility}
                        // primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Education */}
        <Box mb={4}>
          <Typography
            variant="h5"
            component="h3"
            gutterBottom
            color="primary"
            fontWeight="bold"
          >
            Education & Professional Development
          </Typography>
          {education.map((edu, index) => (
            <Card key={index} variant="outlined" sx={{ mb: 2 }}>
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
                    <Typography
                      variant="body2"
                      fontWeight="medium"
                      gutterBottom
                    >
                      Relevant Coursework:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {edu.relevantCoursework.join(', ')}
                    </Typography>
                  </Box>
                )}

                {edu.capstoneProject && (
                  <Box>
                    <Typography
                      variant="body2"
                      fontWeight="medium"
                      gutterBottom
                    >
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
      </Paper>
    </Container>
  );
};
