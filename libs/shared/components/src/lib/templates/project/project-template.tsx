import { Box } from '@mui/system';
import ProjectData from './types';

interface ProjectTemplateProps extends ProjectData {
  stuff: any;
}

export const ProjectTemplate = ({
  basics,
  technical,
  media,
  links,
  content,
  metadata,
}: ProjectTemplateProps) => {
  return <Box>Project Template </Box>;
};
