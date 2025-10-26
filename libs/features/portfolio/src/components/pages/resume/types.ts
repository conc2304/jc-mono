// TypeScript interfaces for resume data structure
export interface ContactInfo {
  name: string;
  location: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  website: string;
}

export interface CoreCompetencies {
  categories: string[];
}

export interface TechnicalSkills {
  frontEnd: string[];
  backEnd: string[];
  testingFrameworks: string[];
  devopsTools: string[];
  creativeTechnology: string[];
}

export interface WorkExperience {
  company: string;
  location: string;
  position: string;
  duration: string;
  description: string;
  responsibilities: string[];
  acquisitionInfo?: string;
}

export interface Education {
  institution: string;
  location: string;
  degree: string;
  graduationDate: string;
  additionalInfo?: string[];
  relevantCoursework?: string[];
  capstoneProject?: string;
}

export interface ResumeFields {
  contactInfo: ContactInfo;
  title: string;
  summary: string;
  coreCompetencies: CoreCompetencies;
  technicalSkills: TechnicalSkills;
  workExperience: WorkExperience[];
  education: Education[];
}
