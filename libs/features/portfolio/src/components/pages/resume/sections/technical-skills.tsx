import {
  Box,
  Typography,
  Chip,
  Grid,
  Card,
  CardContent,
  GridProps,
} from '@mui/material';
import { TechnicalSkills } from '../types';
import { formatLabel } from '@jc/utils';
import { SectionTitle } from './section-title';
interface TechnicalSkillsCardProps {
  title: string;
  skills: string[];
}
export const TechnicalSkillsCard = ({
  title,
  skills,
  ...gridProps
}: TechnicalSkillsCardProps & GridProps) => {
  return (
    <Grid {...gridProps}>
      <Card variant="outlined" sx={{ background: 'unset', height: '100%' }}>
        <CardContent>
          <Typography variant="h5" mb={2} textAlign="center">
            {title}
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={0.5}>
            {skills.map((skill, index) => (
              <Chip key={index} label={skill} size="small" />
            ))}
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export const TechnicalSkillsSection = ({
  technicalSkills,
}: {
  technicalSkills: TechnicalSkills;
}) => {
  return (
    <Box mb={4}>
      <SectionTitle title="Technical Skills" />

      <Grid container spacing={2}>
        {Object.entries(technicalSkills).map(([key, value], i, arr) => {
          return (
            <TechnicalSkillsCard
              key={key}
              title={formatLabel(key)}
              skills={value}
              size={
                arr.length % 2 == 0
                  ? { xs: 12, md: 6 }
                  : i < arr.length - 1
                  ? { xs: 12, md: 6 }
                  : { xs: 12 }
              }
              data-augmented-ui="both br-clip bl-clip tr-clip-x tl-clip-x"
              sx={(theme) => ({
                '--aug-tl': '1.25rem',
                '--aug-tr': '1.25rem',
                '--aug-tl-inset1': '20%',
                '--aug-tr-inset2': '20%',
                '--aug-border-bg': theme.palette.primary[theme.palette.mode],
                '--aug-border-all': '1px',
                '--aug-inlay-bg': theme.palette.background.paper,
                '--aug-inlay-all': '5px',
              })}
            />
          );
        })}
      </Grid>
    </Box>
  );
};
