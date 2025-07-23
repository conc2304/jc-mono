// TypeScript interfaces for resume data structure
interface ContactInfo {
  name: string;
  location: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  website: string;
}

interface CoreCompetencies {
  categories: string[];
}

interface TechnicalSkills {
  frontEnd: string[];
  backEnd: string[];
  testingFrameworks: string[];
  devopsTools: string[];
  creativeTechnology: string[];
}

interface WorkExperience {
  company: string;
  location: string;
  position: string;
  duration: string;
  description: string;
  responsibilities: string[];
  acquisitionInfo?: string;
}

interface Education {
  institution: string;
  location: string;
  degree: string;
  graduationDate: string;
  additionalInfo?: string[];
  relevantCoursework?: string[];
  capstoneProject?: string;
}

export interface Resume {
  contactInfo: ContactInfo;
  title: string;
  summary: string;
  coreCompetencies: CoreCompetencies;
  technicalSkills: TechnicalSkills;
  workExperience: WorkExperience[];
  education: Education[];
}
