import {
  Box,
  Typography,
  Container,
  Paper,
  Chip,
  Divider,
  useTheme,
} from '@mui/material';

import { Resume } from './types';
import {
  ResumeHeader,
  TechnicalSkillsSection,
  WorkExperienceSection,
  EducationExperienceSection,
  SectionTitle,
} from './sections';
import { useMediaQuery } from '@mui/system';

export interface ResumeComponentProps {
  variant: 'sm' | 'md' | 'lg'; // TODO - this is just an example
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

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Container
      className="ResumeTemplate--root"
      maxWidth="lg"
      sx={{
        // py: 4,
        height: '100%',
        overflowY: 'auto',
        containerType: 'inline-size',
        px: isXs ? 0 : undefined,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          '@container (max-width: 769px)': {
            px: 1,
            // border: '3px solid red',
          },
        }}
      >
        <ResumeHeader title={title} contactInfo={contactInfo} />

        <Divider sx={{ my: 3 }} />
        {/* Summary Section */}
        <Box mb={4}>
          <SectionTitle title="Professional Summary" />
          <Typography variant="body1">{summary}</Typography>
        </Box>

        {/* Core Competencies */}
        <Box mb={4}>
          <SectionTitle title="Core Competencies" />
          <Box display="flex" flexWrap="wrap" gap={1} justifyContent="center">
            {coreCompetencies.categories.map((competency, index) => (
              <Chip key={index} label={competency} variant="outlined" />
            ))}
          </Box>
        </Box>

        <TechnicalSkillsSection technicalSkills={technicalSkills} />
        <WorkExperienceSection workExperience={workExperience} />
        <EducationExperienceSection education={education} />
      </Paper>
    </Container>
  );
};
