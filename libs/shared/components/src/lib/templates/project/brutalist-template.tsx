import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  AppBar,
  Toolbar,
  Button,
  Menu,
  MenuItem,
  Grid,
  Container,
  Avatar,
  Link,
  Tabs,
  Tab,
  Paper,
  useTheme,
  alpha,
  styled,
} from '@mui/material';
import {
  ExternalLink,
  Github,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Menu as MenuIcon,
  Visibility,
  People,
  PlayArrow,
} from '@mui/icons-material';

// TypeScript interfaces based on your project structure
interface ProjectCore {
  id: string;
  projectName: string;
  slug?: string;
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
  subcategories?: string[];
  description?: string;
  context?: string;
}

interface ProjectTechnical {
  technologies?: string[];
  timeline?: {
    startDate?: string;
    endDate?: string;
    duration?: string;
  };
  myRole?: string;
  collaborators?: Array<{
    name: string;
    role?: string;
    url?: string;
  }>;
}

interface ProjectMedia {
  thumbnail?: string;
  screenshots?: Array<{
    url: string;
    alt: string;
    caption?: string;
  }>;
  videos?: Array<{
    url: string;
    title?: string;
    type?: 'demo' | 'process' | 'final' | 'inspiration';
    thumbnail?: string;
    caption?: string;
  }>;
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
  overview?: string | string[];
  process?: string | string[];
  results?: string | string[];
  challenges?: string | string[];
  learnings?: string | string[];
}

interface ProjectMetadata {
  featured?: boolean;
  status?: 'live' | 'archived' | 'in-progress' | 'concept';
  lastUpdated?: string;
  tags?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

interface ProjectMVP extends ProjectCore {
  basics: ProjectBasics;
  technical?: ProjectTechnical;
  media?: ProjectMedia;
  links?: ProjectLinks;
  content?: ProjectContent;
  metadata?: ProjectMetadata;
}

interface PortfolioProjectProps {
  project?: ProjectMVP;
}

// Styled components for container queries
const ResponsiveContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  width: '100%',
  backgroundColor: theme.palette.grey[900],
  color: theme.palette.common.white,
  overflow: 'auto',
  containerType: 'inline-size',
  '& .mobile-layout': {
    display: 'block',
    '@container (min-width: 769px)': {
      display: 'none',
    },
  },
  '& .desktop-layout': {
    display: 'none',
    '@container (min-width: 769px)': {
      display: 'block',
    },
  },
  '& .hero-mobile': {
    height: '250px',
    '@container (min-width: 769px)': {
      height: '500px',
    },
    '@container (min-width: 1200px)': {
      height: '600px',
    },
  },
  '& .title-mobile': {
    fontSize: '2rem',
    '@container (min-width: 769px)': {
      fontSize: '4rem',
    },
    '@container (min-width: 1200px)': {
      fontSize: '6rem',
    },
  },
  '& .description-mobile': {
    fontSize: '1rem',
    '@container (min-width: 769px)': {
      fontSize: '1.25rem',
    },
    '@container (min-width: 1200px)': {
      fontSize: '1.5rem',
    },
  },
}));

const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  '& .hero-image': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  '& .hero-overlay': {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(to top, ${alpha(
      theme.palette.common.black,
      0.7
    )}, ${alpha(theme.palette.grey[900], 0.2)}, transparent)`,
  },
  '& .hero-content': {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: `linear-gradient(to top, ${theme.palette.common.black}, transparent)`,
    padding: theme.spacing(4),
  },
}));

export const BrutalistTemplate: React.FC<PortfolioProjectProps> = ({
  project,
}) => {
  const theme = useTheme();
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  // Default project data
  const defaultProject: ProjectMVP = {
    id: 'ai-design-studio',
    projectName: 'AI Design Studio',
    slug: 'ai-design-studio',
    basics: {
      type: 'professional',
      category: 'web',
      subcategories: ['frontend', 'ui-dev', 'ai-tools'],
      description:
        'An AI-powered design platform for creating beautiful user interfaces',
      context: 'Personal Project',
    },
    technical: {
      technologies: [
        'React',
        'TypeScript',
        'Material-UI',
        'OpenAI API',
        'Framer Motion',
      ],
      timeline: {
        startDate: '2024-01',
        endDate: '2024-06',
        duration: '6 months',
      },
      myRole: 'Full-Stack Developer & Designer',
      collaborators: [
        {
          name: 'Alex Chen',
          role: 'UX Designer',
          url: 'https://alexchen.design',
        },
        { name: 'Jordan Smith', role: 'Backend Developer' },
      ],
    },
    media: {
      thumbnail:
        'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&h=800&fit=crop',
      screenshots: [
        {
          url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&h=800&fit=crop',
          alt: 'Main dashboard view',
          caption: 'The main dashboard showcasing AI-generated designs',
        },
        {
          url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop',
          alt: 'Design editor interface',
          caption: 'Real-time collaborative design editor',
        },
        {
          url: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1200&h=800&fit=crop',
          alt: 'Mobile responsive view',
          caption: 'Mobile-optimized interface for on-the-go design',
        },
      ],
    },
    links: {
      liveDemo: 'https://ai-design-studio.com',
      repository: 'https://github.com/username/ai-design-studio',
      caseStudy: 'https://medium.com/@username/building-ai-design-studio',
    },
    content: {
      overview: [
        'AI Design Studio revolutionizes the creative process by enabling designers and developers to generate professional-quality user interfaces through natural language descriptions.',
        'Built with modern web technologies, the platform leverages advanced AI models to understand design intent and produce pixel-perfect components, layouts, and complete design systems.',
        'The tool bridges the gap between creative vision and technical implementation, making sophisticated design accessible to teams of all sizes.',
      ],
      process: [
        'Research & Discovery: Conducted user interviews with 50+ designers to understand pain points in the design-to-development workflow.',
        'AI Model Training: Fine-tuned language models on thousands of high-quality design examples and component libraries.',
        'Iterative Development: Built and tested the platform through multiple sprints, incorporating user feedback at each stage.',
        'Performance Optimization: Implemented advanced caching and real-time collaboration features for seamless user experience.',
      ],
      results: [
        'Achieved 40% reduction in design-to-development time for participating teams',
        'Generated over 10,000 unique design components in the first 3 months',
        'Maintained 99.9% uptime with sub-200ms response times globally',
      ],
      challenges: [
        'Balancing AI creativity with design consistency and brand guidelines',
        'Optimizing model inference speed while maintaining quality output',
        'Creating an intuitive interface for complex AI-powered functionality',
      ],
      learnings: [
        'The importance of clear prompt engineering for consistent AI output',
        'How to design human-AI collaboration workflows that feel natural',
        'Strategies for scaling AI applications to handle enterprise workloads',
      ],
    },
    metadata: {
      featured: true,
      status: 'live',
      lastUpdated: '2024-06-15',
      tags: ['AI', 'Design Tools', 'React', 'TypeScript'],
      difficulty: 'advanced',
    },
  };

  const data = project || defaultProject;
  const screenshots = data.media?.screenshots || [];

  const nextImage = (): void => {
    setActiveImageIndex((prev) => (prev + 1) % screenshots.length);
  };

  const prevImage = (): void => {
    setActiveImageIndex(
      (prev) => (prev - 1 + screenshots.length) % screenshots.length
    );
  };

  const getStatusColor = (
    status?: string
  ): 'success' | 'warning' | 'default' | 'primary' => {
    switch (status) {
      case 'live':
        return 'success';
      case 'in-progress':
        return 'warning';
      case 'archived':
        return 'default';
      default:
        return 'primary';
    }
  };

  const renderContent = (content?: string | string[]): React.ReactNode => {
    if (Array.isArray(content)) {
      return content.map((paragraph, index) => (
        <Typography
          key={index}
          variant="body1"
          sx={{
            mb: 2,
            lineHeight: 1.6,
            color: theme.palette.grey[300],
          }}
        >
          {paragraph}
        </Typography>
      ));
    }
    return (
      <Typography
        variant="body1"
        sx={{
          lineHeight: 1.6,
          color: theme.palette.grey[300],
        }}
      >
        {content}
      </Typography>
    );
  };

  const tabsData = [
    { key: 'overview', label: 'Overview' },
    { key: 'process', label: 'Process' },
    { key: 'results', label: 'Results' },
    { key: 'challenges', label: 'Challenges' },
    { key: 'learnings', label: 'Learnings' },
  ];

  const handleTabChange = (
    event: React.SyntheticEvent,
    newValue: string
  ): void => {
    setActiveTab(newValue);
  };

  return (
    <ResponsiveContainer>
      {/* Mobile Navigation */}
      <AppBar
        position="sticky"
        className="mobile-layout"
        sx={{
          backgroundColor: alpha(theme.palette.common.black, 0.8),
          backdropFilter: 'blur(8px)',
          borderBottom: `1px solid ${theme.palette.grey[800]}`,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: 1.5 }}>
          <Button
            startIcon={<ArrowLeft />}
            sx={{ color: theme.palette.grey[400], textTransform: 'none' }}
          >
            <Typography variant="caption">Back</Typography>
          </Button>
          <IconButton
            onClick={(e) => setMobileMenuAnchor(e.currentTarget)}
            sx={{ color: theme.palette.grey[400] }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Menu */}
      <Menu
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={() => setMobileMenuAnchor(null)}
        PaperProps={{
          sx: {
            backgroundColor: alpha(theme.palette.common.black, 0.95),
            backdropFilter: 'blur(8px)',
            border: `1px solid ${theme.palette.grey[800]}`,
            minWidth: 200,
          },
        }}
      >
        {data.metadata?.status && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Chip
              label={data.metadata.status.replace('-', ' ').toUpperCase()}
              color={getStatusColor(data.metadata.status)}
              size="small"
            />
          </Box>
        )}
        {tabsData.map((tab) => (
          <MenuItem
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setMobileMenuAnchor(null);
            }}
            selected={activeTab === tab.key}
          >
            {tab.label}
          </MenuItem>
        ))}
      </Menu>

      {/* Desktop Navigation */}
      <AppBar
        position="sticky"
        className="desktop-layout"
        sx={{
          backgroundColor: alpha(theme.palette.common.black, 0.5),
          backdropFilter: 'blur(8px)',
          borderBottom: `1px solid ${theme.palette.grey[800]}`,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Button
              startIcon={<ArrowLeft />}
              sx={{ color: theme.palette.grey[400], textTransform: 'none' }}
            >
              Back to Portfolio
            </Button>
            {data.metadata?.status && (
              <Chip
                label={data.metadata.status.replace('-', ' ').toUpperCase()}
                color={getStatusColor(data.metadata.status)}
                size="small"
              />
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <HeroSection>
        {screenshots.length > 0 && (
          <Box
            className="hero-mobile"
            sx={{ position: 'relative', overflow: 'hidden' }}
          >
            <img
              src={screenshots[activeImageIndex]?.url}
              alt={screenshots[activeImageIndex]?.alt}
              className="hero-image"
            />
            <Box className="hero-overlay" />

            {/* Image Navigation - Desktop Only */}
            {screenshots.length > 1 && (
              <>
                <IconButton
                  onClick={prevImage}
                  className="desktop-layout"
                  sx={{
                    position: 'absolute',
                    left: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: alpha(theme.palette.common.white, 0.2),
                    backdropFilter: 'blur(8px)',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.common.white, 0.3),
                    },
                  }}
                >
                  <ChevronLeft />
                </IconButton>
                <IconButton
                  onClick={nextImage}
                  className="desktop-layout"
                  sx={{
                    position: 'absolute',
                    right: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: alpha(theme.palette.common.white, 0.2),
                    backdropFilter: 'blur(8px)',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.common.white, 0.3),
                    },
                  }}
                >
                  <ChevronRight />
                </IconButton>

                {/* Image Indicators */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: 1,
                  }}
                >
                  {screenshots.map((_, index) => (
                    <Box
                      key={index}
                      component="button"
                      onClick={() => setActiveImageIndex(index)}
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor:
                          index === activeImageIndex
                            ? theme.palette.common.white
                            : alpha(theme.palette.common.white, 0.5),
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                      }}
                    />
                  ))}
                </Box>
              </>
            )}
          </Box>
        )}

        {/* Project Title Overlay */}
        <Box className="hero-content">
          <Container maxWidth="xl">
            <Typography
              variant="h1"
              className="title-mobile"
              sx={{
                fontWeight: 'bold',
                mb: 1,
                color: theme.palette.common.white,
                lineHeight: 1,
              }}
            >
              {data.projectName}
            </Typography>
            {data.basics?.description && (
              <Typography
                className="description-mobile"
                sx={{
                  color: theme.palette.grey[300],
                  maxWidth: '768px',
                }}
              >
                {data.basics.description}
              </Typography>
            )}
          </Container>
        </Box>
      </HeroSection>

      {/* Mobile Content Layout */}
      <Box className="mobile-layout" sx={{ p: 2 }}>
        {/* Mobile Image Carousel */}
        {screenshots.length > 1 && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1.5 }}>
              {screenshots.map((screenshot, index) => (
                <Box
                  key={index}
                  component="button"
                  onClick={() => setActiveImageIndex(index)}
                  sx={{
                    flexShrink: 0,
                    width: 80,
                    height: 64,
                    borderRadius: 1,
                    overflow: 'hidden',
                    border: 2,
                    borderColor:
                      index === activeImageIndex
                        ? theme.palette.primary.main
                        : theme.palette.grey[600],
                    cursor: 'pointer',
                    transition: 'border-color 0.3s',
                    '&:hover': {
                      borderColor: theme.palette.grey[500],
                    },
                  }}
                >
                  <img
                    src={screenshot.url}
                    alt={screenshot.alt}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Mobile Tab Content */}
        <Paper
          sx={{
            backgroundColor: alpha(theme.palette.grey[900], 0.5),
            border: `1px solid ${theme.palette.grey[700]}`,
            p: 2,
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{ mb: 2, fontWeight: 'bold', textTransform: 'capitalize' }}
          >
            {activeTab}
          </Typography>
          {data.content?.[activeTab as keyof ProjectContent] &&
            renderContent(data.content[activeTab as keyof ProjectContent])}
        </Paper>

        {/* Mobile Project Details */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Paper
              sx={{
                backgroundColor: alpha(theme.palette.grey[800], 0.5),
                border: `1px solid ${theme.palette.grey[700]}`,
                p: 2,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ mb: 1.5, color: theme.palette.grey[300] }}
              >
                Details
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {data.basics?.type && (
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: theme.palette.grey[400] }}
                    >
                      Type:
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ ml: 1, textTransform: 'capitalize' }}
                    >
                      {data.basics.type}
                    </Typography>
                  </Box>
                )}
                {data.technical?.timeline?.duration && (
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: theme.palette.grey[400] }}
                    >
                      Duration:
                    </Typography>
                    <Typography variant="caption" sx={{ ml: 1 }}>
                      {data.technical.timeline.duration}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={6}>
            <Paper
              sx={{
                backgroundColor: alpha(theme.palette.grey[800], 0.5),
                border: `1px solid ${theme.palette.grey[700]}`,
                p: 2,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ mb: 1.5, color: theme.palette.grey[300] }}
              >
                Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {data.links?.liveDemo && (
                  <Link
                    href={data.links.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: theme.palette.primary.main,
                      textDecoration: 'none',
                      fontSize: '0.75rem',
                      '&:hover': { color: theme.palette.primary.light },
                    }}
                  >
                    <ExternalLink sx={{ fontSize: 12 }} />
                    Demo
                  </Link>
                )}
                {data.links?.repository && (
                  <Link
                    href={data.links.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: theme.palette.grey[300],
                      textDecoration: 'none',
                      fontSize: '0.75rem',
                      '&:hover': { color: theme.palette.common.white },
                    }}
                  >
                    <Github sx={{ fontSize: 12 }} />
                    Code
                  </Link>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Mobile Technologies */}
        {data.technical?.technologies &&
          data.technical.technologies.length > 0 && (
            <Paper
              sx={{
                backgroundColor: alpha(theme.palette.grey[800], 0.5),
                border: `1px solid ${theme.palette.grey[700]}`,
                p: 2,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ mb: 1.5, color: theme.palette.grey[300] }}
              >
                Technologies
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {data.technical.technologies.map((tech, index) => (
                  <Chip
                    key={index}
                    label={tech}
                    size="small"
                    sx={{
                      backgroundColor: theme.palette.grey[700],
                      border: `1px solid ${theme.palette.grey[600]}`,
                      fontSize: '0.75rem',
                    }}
                  />
                ))}
              </Box>
            </Paper>
          )}
      </Box>

      {/* Desktop Content Layout */}
      <Container maxWidth="xl" className="desktop-layout" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Desktop Sidebar */}
          <Grid item xs={12} lg={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Project Info */}
              <Paper
                sx={{
                  backgroundColor: alpha(theme.palette.grey[800], 0.3),
                  border: `1px solid ${theme.palette.grey[700]}`,
                  p: 3,
                }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Project Details
                </Typography>

                {data.basics?.type && (
                  <Box sx={{ mb: 1.5 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        textTransform: 'uppercase',
                        letterSpacing: 2,
                        color: theme.palette.grey[400],
                      }}
                    >
                      Type
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, textTransform: 'capitalize' }}
                    >
                      {data.basics.type}
                    </Typography>
                  </Box>
                )}

                {data.basics?.category && (
                  <Box sx={{ mb: 1.5 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        textTransform: 'uppercase',
                        letterSpacing: 2,
                        color: theme.palette.grey[400],
                      }}
                    >
                      Category
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, textTransform: 'capitalize' }}
                    >
                      {data.basics.category.replace('-', ' ')}
                    </Typography>
                  </Box>
                )}

                {data.technical?.timeline?.duration && (
                  <Box sx={{ mb: 1.5 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        textTransform: 'uppercase',
                        letterSpacing: 2,
                        color: theme.palette.grey[400],
                      }}
                    >
                      Duration
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {data.technical.timeline.duration}
                    </Typography>
                  </Box>
                )}

                {data.technical?.myRole && (
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        textTransform: 'uppercase',
                        letterSpacing: 2,
                        color: theme.palette.grey[400],
                      }}
                    >
                      My Role
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {data.technical.myRole}
                    </Typography>
                  </Box>
                )}
              </Paper>

              {/* Technologies */}
              {data.technical?.technologies &&
                data.technical.technologies.length > 0 && (
                  <Paper
                    sx={{
                      backgroundColor: alpha(theme.palette.grey[800], 0.3),
                      border: `1px solid ${theme.palette.grey[700]}`,
                      p: 3,
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Technologies
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {data.technical.technologies.map((tech, index) => (
                        <Chip
                          key={index}
                          label={tech}
                          sx={{
                            backgroundColor: theme.palette.grey[700],
                            border: `1px solid ${theme.palette.grey[600]}`,
                          }}
                        />
                      ))}
                    </Box>
                  </Paper>
                )}

              {/* Links */}
              <Paper
                sx={{
                  backgroundColor: alpha(theme.palette.grey[800], 0.3),
                  border: `1px solid ${theme.palette.grey[700]}`,
                  p: 3,
                }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Links
                </Typography>
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}
                >
                  {data.links?.liveDemo && (
                    <Link
                      href={data.links.liveDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        color: theme.palette.primary.main,
                        textDecoration: 'none',
                        '&:hover': { color: theme.palette.primary.light },
                      }}
                    >
                      <ExternalLink sx={{ fontSize: 16 }} />
                      <Typography variant="body2">Live Demo</Typography>
                    </Link>
                  )}
                  {data.links?.repository && (
                    <Link
                      href={data.links.repository}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        color: theme.palette.grey[300],
                        textDecoration: 'none',
                        '&:hover': { color: theme.palette.common.white },
                      }}
                    >
                      <Github sx={{ fontSize: 16 }} />
                      <Typography variant="body2">Source Code</Typography>
                    </Link>
                  )}
                  {data.links?.caseStudy && (
                    <Link
                      href={data.links.caseStudy}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        color: theme.palette.grey[300],
                        textDecoration: 'none',
                        '&:hover': { color: theme.palette.common.white },
                      }}
                    >
                      <Visibility sx={{ fontSize: 16 }} />
                      <Typography variant="body2">Case Study</Typography>
                    </Link>
                  )}
                </Box>
              </Paper>

              {/* Collaborators */}
              {data.technical?.collaborators &&
                data.technical.collaborators.length > 0 && (
                  <Paper
                    sx={{
                      backgroundColor: alpha(theme.palette.grey[800], 0.3),
                      border: `1px solid ${theme.palette.grey[700]}`,
                      p: 3,
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Team
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                      }}
                    >
                      {data.technical.collaborators.map(
                        (collaborator, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                            }}
                          >
                            <People
                              sx={{
                                fontSize: 16,
                                color: theme.palette.grey[400],
                              }}
                            />
                            <Box>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 500 }}
                              >
                                {collaborator.name}
                              </Typography>
                              {collaborator.role && (
                                <Typography
                                  variant="caption"
                                  sx={{ color: theme.palette.grey[400] }}
                                >
                                  {collaborator.role}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        )
                      )}
                    </Box>
                  </Paper>
                )}
            </Box>
          </Grid>

          {/* Desktop Main Content */}
          <Grid item xs={12} lg={9}>
            <Box>
              {/* Tab Navigation */}
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                sx={{
                  mb: 4,
                  borderBottom: `1px solid ${theme.palette.grey[800]}`,
                  '& .MuiTab-root': {
                    textTransform: 'capitalize',
                    color: theme.palette.grey[400],
                    '&.Mui-selected': {
                      color: theme.palette.common.white,
                    },
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: theme.palette.primary.main,
                  },
                }}
              >
                {tabsData.map((tab) => (
                  <Tab key={tab.key} label={tab.label} value={tab.key} />
                ))}
              </Tabs>

              {/* Tab Content */}
              <Box sx={{ mb: 8 }}>
                {data.content?.[activeTab as keyof ProjectContent] && (
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        mb: 3,
                        fontWeight: 'bold',
                        textTransform: 'capitalize',
                        color: theme.palette.common.white,
                      }}
                    >
                      {activeTab}
                    </Typography>
                    {renderContent(
                      data.content[activeTab as keyof ProjectContent]
                    )}
                  </Box>
                )}
              </Box>

              {/* Desktop Image Gallery */}
              {screenshots.length > 1 && (
                <Box>
                  <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
                    Gallery
                  </Typography>
                  <Grid container spacing={3}>
                    {screenshots.map((screenshot, index) => (
                      <Grid item xs={12} lg={6} key={index}>
                        <Paper
                          sx={{
                            overflow: 'hidden',
                            backgroundColor: theme.palette.grey[800],
                            border: `1px solid ${theme.palette.grey[700]}`,
                            cursor: 'pointer',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              '& img': {
                                transform: 'scale(1.05)',
                              },
                            },
                          }}
                          onClick={() => setActiveImageIndex(index)}
                        >
                          <Box sx={{ height: 256, overflow: 'hidden' }}>
                            <img
                              src={screenshot.url}
                              alt={screenshot.alt}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.3s ease',
                              }}
                            />
                          </Box>
                          {screenshot.caption && (
                            <CardContent>
                              <Typography
                                variant="body2"
                                sx={{ color: theme.palette.grey[300] }}
                              >
                                {screenshot.caption}
                              </Typography>
                            </CardContent>
                          )}
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </ResponsiveContainer>
  );
};
