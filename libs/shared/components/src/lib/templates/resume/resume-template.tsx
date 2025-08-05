import {
  Box,
  Typography,
  Container,
  Paper,
  Chip,
  Divider,
} from '@mui/material';

import { Resume } from './types';
import {
  ResumeHeader,
  TechnicalSkillsSection,
  WorkExperienceSection,
  EducationExperienceSection,
  SectionTitle,
} from './sections';

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

  return (
    <Container
      className="ResumeTemplate--root"
      maxWidth="lg"
      sx={{
        py: 4,
        height: '100%',
        overflowY: 'auto',
        containerType: 'inline-size',
      }}
    >
      <Paper elevation={3} sx={{ p: 4 }}>
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
