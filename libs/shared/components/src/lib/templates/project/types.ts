import { ImageMediaData, VideoMediaData } from '../../organisms';

// =============================================================================
// CORE INTERFACES (MVP - Essential for getting projects live)
// =============================================================================

interface ProjectCore {
  id: string; // unique identifier for routing/linking
  projectName: string;
  projectSubtitle?: string;
  slug?: string; // URL-friendly version, auto-generated if not provided
}

interface ProjectBasics {
  type: 'professional' | 'graduate' | 'personal' | 'school';
  category:
    | 'web'
    | 'data-visualization'
    | 'creative-coding'
    | '3d-animation'
    | '3d-modeling'
    | 'game-dev'
    | 'digital-art'
    | 'motion-graphics'
    | 'sculpture'
    | 'drawing'
    | 'performance'
    | 'industrial-design'
    | 'other';
  subcategories?: string[]; // e.g., ['front-end', 'ui-dev']
  description?: string; // simple one-liner description
  context?: string; // company, school, personal context
}

interface ProjectTechnical {
  technologies?: string[]; // flexible array for any tech stack
  timeline?: {
    startDate?: string;
    endDate?: string;
    duration?: string; // e.g., "3 months", "ongoing"
  };
  myRole?: string; // your specific contribution
  collaborators?: Array<{
    name: string;
    role?: string;
    url?: string;
  }>;
}

interface BaseImageData {
  relativePath: string;
  alt: string;
  caption?: string;
  detailedCaption?: string;
}

interface BaseVideoData {
  relativePath: string;
  title?: string;
  type?: 'demo' | 'process' | 'final' | 'inspiration';
  thumbnail?: string;
  caption?: string;
  detailedCaption?: string; // For longer captions in modal
}

interface ProjectMedia {
  hero: BaseImageData; // main project image
  screenshots?: BaseImageData[];
  videos?: BaseVideoData[];
}

interface ProjectLinks {
  liveDemo?: string;
  repository?: string;
  caseStudy?: string;
  additionalLinks?: Array<{
    title: string;
    url: string;
    type?: 'deployment' | 'documentation' | 'inspiration' | 'other';
  }>;
}

interface ProjectContent {
  overview?: string | string[]; // main project description
  process?: string | string[]; // how it was made
  results?: string | string[]; // outcomes, impact, metrics
  challenges?: string | string[]; // what was difficult
  learnings?: string | string[]; // what you discovered/learned
}

interface ProjectMetadata {
  featured?: boolean; // highlight in portfolio
  status?: 'live' | 'archived' | 'in-progress' | 'concept';
  lastUpdated?: string;
  tags?: string[]; // flexible tagging system
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

// =============================================================================
// MVP PROJECT TYPE (Minimal viable project)
// =============================================================================

interface ProjectMVP extends ProjectCore {
  basics: ProjectBasics;
  technical?: ProjectTechnical;
  media: ProjectMedia;
  links?: ProjectLinks;
  content?: ProjectContent;
  metadata?: ProjectMetadata;
}

// =============================================================================
// EXTENDED INTERFACES (Future narrative enhancements)
// =============================================================================

interface ProjectNarrative {
  personalSignificance?: {
    whyItMatters?: string;
    creativeVsCorporateSpectrum?: number; // 1-10 scale
    internalConflictLevel?: number; // 1-10 scale
    personalReflection?: string;
  };
  narrativeRole?: {
    corporateOSAppearance?: string; // how it appears in the OS interface
    hiddenStory?: string; // the deeper meaning/mission
    emotionalIntent?: string[]; // emotions to evoke
    thematicTags?: string[]; // ['democratization', 'accessibility', etc.]
  };
  meowWolfNarrative?: {
    corporateSurface?: string; // surface-level corporate description
    hiddenLayer?: string; // what's really going on underneath
    emotionalArc?: string; // the journey visitors should experience
    interactiveMystery?: string; // questions the project poses
    worldBuildingElements?: string[]; // fits into overall portfolio narrative
  };
}

interface ProjectTechnicalDeep {
  breakthroughMoments?: string[];
  challenges?: string[];
  growthShowcase?: string;
  technicalAchievements?: string[];
  codeSnippets?: Array<{
    language: string;
    code: string;
    description?: string;
    filename?: string;
  }>;
  architecture?: string; // technical architecture explanation
}

interface ProjectInteractive {
  specificInteractions?: string[]; // descriptions of planned interactions
  easterEggs?: Array<{
    trigger: string; // how to activate
    description: string;
    type: 'console-command' | 'click-sequence' | 'konami-code' | 'other';
  }>;
  progressiveRevelation?: Array<{
    stage: number;
    trigger: string;
    reveals: string;
  }>;
  miniDemos?: Array<{
    title: string;
    type: 'interactive' | 'simulation' | 'visualization';
    description: string;
    embedCode?: string; // for p5.js sketches, etc.
  }>;
}

interface ProjectOSIntegration {
  appIcon?: string; // path to icon for OS desktop
  appType?: 'application' | 'file' | 'folder' | 'system-tool';
  windowBehavior?: {
    resizable?: boolean;
    minimizable?: boolean;
    terminalMode?: boolean;
  };
  accessLevel?: 'public' | 'authenticated' | 'hidden' | 'easter-egg';
  fileSystemPath?: string; // where it appears in your OS file structure
}

interface ProjectMediaExtended {
  assets?: Array<{
    url: string;
    type: 'document' | 'image' | 'model' | 'other';
    title: string;
    description?: string;
  }>;
  gallery?: Array<{
    url: string;
    alt: string;
    caption?: string;
    category?: 'process' | 'final' | 'inspiration' | 'other';
  }>;
}

interface ProjectContentExtended {
  reflections?: string; // personal thoughts, what you'd do differently
  futureWork?: string; // potential improvements, next steps
  acknowledgments?: string; // credits, thanks, etc.
  customSections?: Array<{
    title: string;
    content: string;
    order: number;
  }>;
}

// =============================================================================
// FULL PROJECT TYPE (All features enabled)
// =============================================================================

interface ProjectFull extends ProjectMVP {
  narrative?: ProjectNarrative;
  technicalDeep?: ProjectTechnicalDeep;
  interactive?: ProjectInteractive;
  osIntegration?: ProjectOSIntegration;
  mediaExtended?: ProjectMediaExtended;
  contentExtended?: ProjectContentExtended;
}

// =============================================================================
// TYPE ALIASES FOR DIFFERENT USE CASES
// =============================================================================

// Start here - just the essentials
type ProjectData = ProjectMVP;

// Add narrative layer when ready
type ProjectWithNarrative = ProjectMVP & {
  narrative: ProjectNarrative;
};

// Add interactivity when building advanced features
type ProjectWithInteractivity = ProjectMVP & {
  interactive: ProjectInteractive;
};

// The complete experience
type ProjectComplete = ProjectFull;

// =============================================================================
// EXPORT TYPES
// =============================================================================

export type {
  // Core building blocks
  ProjectCore,
  ProjectBasics,
  ProjectTechnical,
  ProjectMedia,
  ProjectLinks,
  ProjectContent,
  ProjectMetadata,

  // Main types for different phases
  ProjectData, // MVP - start here
  ProjectWithNarrative,
  ProjectWithInteractivity,
  ProjectComplete,

  // Extension interfaces
  ProjectNarrative,
  ProjectTechnicalDeep,
  ProjectInteractive,
  ProjectOSIntegration,
  ProjectMediaExtended,
  ProjectContentExtended,
  ProjectFull,
};

export default ProjectData;
