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
import {
  Email,
  Phone,
  LocationOn,
  LinkedIn,
  GitHub,
  Language,
} from '@mui/icons-material';
import { Resume } from './types';

export interface ResumeComponentProps {
  variant: 'sm' | 'md' | 'lg';
}

export const ResumeComponent = ({
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Header Section */}
        <Box textAlign="center" mb={4}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
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
              <Typography variant="body2">{contactInfo.location}</Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={0.5}>
              <Email fontSize="small" color="action" />
              <Link href={`mailto:${contactInfo.email}`} variant="body2">
                {contactInfo.email}
              </Link>
            </Box>
            <Box display="flex" alignItems="center" gap={0.5}>
              <LinkedIn fontSize="small" color="action" />
              <Link
                href={`https://${contactInfo.linkedin}`}
                variant="body2"
                target="_blank"
              >
                LinkedIn
              </Link>
            </Box>
            <Box display="flex" alignItems="center" gap={0.5}>
              <GitHub fontSize="small" color="action" />
              <Link
                href={`https://${contactInfo.github}`}
                variant="body2"
                target="_blank"
              >
                GitHub
              </Link>
            </Box>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Language fontSize="small" color="action" />
              <Link
                href={`https://${contactInfo.website}`}
                variant="body2"
                target="_blank"
              >
                {contactInfo.website}
              </Link>
            </Box>
          </Stack>
        </Box>

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
          <Box display="flex" flexWrap="wrap" gap={1}>
            {coreCompetencies.categories.map((competency, index) => (
              <Chip key={index} label={competency} variant="outlined" />
            ))}
          </Box>
        </Box>

        {/* Technical Skills */}
        <Box mb={4}>
          <Typography
            variant="h5"
            component="h3"
            gutterBottom
            color="primary"
            fontWeight="bold"
          >
            Technical Skills
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Front End
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {technicalSkills.frontEnd.map((skill, index) => (
                      <Chip key={index} label={skill} size="small" />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Back End
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {technicalSkills.backEnd.map((skill, index) => (
                      <Chip key={index} label={skill} size="small" />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Testing Frameworks
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {technicalSkills.testingFrameworks.map((skill, index) => (
                      <Chip key={index} label={skill} size="small" />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    DevOps Tools
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {technicalSkills.devopsTools.map((skill, index) => (
                      <Chip key={index} label={skill} size="small" />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Creative Technology
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {technicalSkills.creativeTechnology.map((skill, index) => (
                      <Chip key={index} label={skill} size="small" />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

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
