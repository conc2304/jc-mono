import { ProjectData } from '@jc/ui-components';
import { getImageUrl, getResponsiveImageSet, getVideoUrl } from '@jc/utils';

export const atomicVisualizerProject: ProjectData = {
  // =============================================================================
  // CORE PROJECT INFORMATION
  // =============================================================================
  id: '3d-atomic-visualizer',
  projectName: '3D Atomic Visualizer',
  projectSubtitle: 'Interactive Periodic Table Explorer',
  slug: '3d-atomic-visualizer',

  // =============================================================================
  // PROJECT BASICS
  // =============================================================================
  basics: {
    type: 'school',
    category: '3d-modeling',
    subcategories: [
      'web',
      '3d-animation',
      'data-visualization',
      'creative-coding',
      'educational-technology',
      'scientific-visualization',
    ],
    description:
      'WebGL-based 3D educational application demonstrating React Three Fiber mastery through interactive atomic structure visualization. Features 3D carousel navigation through 118 periodic elements, real-time electron orbital animations, and scientifically accurate Bohr model implementation with TypeScript integration.',
    context:
      'Harvard Extension School - CS50 Course Final Project (Summer 2023)',
  },

  // =============================================================================
  // TECHNICAL DETAILS
  // =============================================================================
  technical: {
    technologies: [
      'React Three Fiber',
      'TypeScript',
      'Three.js',
      'WebGL',
      'React',
      'React Spring',
      'Node.js',
      'npm',
      'Create React App',
      'HTML5 Canvas',
      'CSS3',
      'GitHub Pages (Deployment)',
      'RESTful API Integration',
      'JSON Data Processing',
    ],
    timeline: {
      startDate: '2023-06', // Summer 2023 course
      endDate: '2023-08',
      duration: 'Summer semester project (2-3 months)',
    },
    myRole:
      'Solo Developer - 3D web application development, React Three Fiber implementation, TypeScript programming, WebGL optimization, scientific research and atomic modeling, user interface design',
    collaborators: [
      // Solo academic project - no collaborators mentioned
    ],
  },

  // =============================================================================
  // MEDIA ASSETS
  // =============================================================================
  media: {
    thumbnail: {
      ...getResponsiveImageSet(
        'projects/3d-atomic-visualizer/atomic-structure-hero.png'
      ),
      alt: 'Atomic Structure Hero',
    },
    screenshots: [
      {
        relativePath:
          'projects/3d-atomic-visualizer/Screenshot-atomic-structure-3:4.png',
        alt: '3D atomic structure visualization showing Bohr model with animated electron orbits around atomic nucleus in WebGL rendered scene',
        caption: '3D atomic structure with animated electron orbits',
        detailedCaption:
          'Detailed atomic structure visualization featuring scientifically accurate Bohr model representation with animated electron orbital paths around the atomic nucleus, demonstrating the electron configuration parsing system that transforms chemistry notation into dynamic 3D visualizations using Three.js WebGL technology',
      },
      {
        relativePath:
          'projects/3d-atomic-visualizer/Screenshot-atomic-structure.png',
        alt: 'Interactive 3D atomic structure display with electron configuration visualization and orbital animation in React Three Fiber application',
        caption: 'Interactive atomic structure with orbital mechanics',
        detailedCaption:
          'Real-time atomic structure rendering showcasing the sophisticated electron configuration processing system that automatically generates accurate atomic structures from standard chemistry notation strings, complete with animated orbital mechanics and shell-based electron organization using React Three Fiber',
      },
      {
        relativePath: 'projects/3d-atomic-visualizer/Screenshot-info-card.png',
        alt: 'Element information interface displaying periodic table data, atomic properties, and navigation controls integrated with 3D visualization system',
        caption: 'Element information panel with atomic data',
        detailedCaption:
          'Comprehensive element information interface demonstrating seamless integration between external API data and 3D visualization system, featuring atomic properties, electron configuration details, and navigation controls that coordinate with the interactive 3D atomic structure display',
      },
      {
        relativePath:
          'projects/3d-atomic-visualizer/Screenshot-search-menu.png',
        alt: 'Interactive search interface for periodic table navigation with element filtering and selection controls in 3D web application',
        caption: 'Search interface for element navigation',
        detailedCaption:
          'Intuitive search and filtering system enabling efficient discovery and navigation across all 118 periodic elements, featuring responsive design patterns and smooth integration with the 3D carousel interface while maintaining optimal performance for WebGL rendering',
      },
      {
        relativePath: 'projects/3d-atomic-visualizer/Screenshot-tile-view.png',
        alt: 'Periodic table element tile display showing individual element cards with hover interactions and 3D spatial navigation controls',
        caption: 'Interactive element tiles with hover effects',
        detailedCaption:
          'Dynamic element tile interface showcasing 3D spatial navigation design with intuitive hover states and interactive controls that bridge traditional 2D UI patterns with immersive 3D experiences, demonstrating thoughtful user experience design for WebGL applications',
      },
      {
        relativePath:
          'projects/3d-atomic-visualizer/Screenshot-tile-carousel.png',
        alt: '3D carousel interface displaying periodic table elements as interactive tiles with smooth navigation and dynamic focus management',
        caption: '3D carousel navigation through periodic elements',
        detailedCaption:
          'Sophisticated 3D carousel system featuring all 118 periodic elements with smooth transitions, dynamic focus management, and responsive layout adaptation. Demonstrates complex state coordination between carousel position, active element selection, and atomic structure updates using React state management',
      },
      {
        relativePath: 'projects/3d-atomic-visualizer/atomic-structure-hero.png',
        alt: 'Hero image of 3D Atomic Visualizer showing WebGL-rendered periodic table explorer with React Three Fiber implementation and educational interface design',
        caption: '3D Atomic Visualizer application overview',
        detailedCaption:
          'Project hero image highlighting the successful integration of cutting-edge 3D web development technologies with educational applications, showcasing React Three Fiber mastery through interactive atomic structure exploration, modern WebGL implementation, and the intersection of advanced programming skills with scientific visualization',
      },
    ].map(({ relativePath, ...mediaItem }) => ({
      ...mediaItem,
      ...getResponsiveImageSet(relativePath),
      url: getImageUrl(relativePath, 'full'),
    })),
    videos: [
      {
        url: getVideoUrl(
          'projects/3d-atomic-visualizer/Jose Conchello - Harvard CS50 Final Project - 3D Atomic Structure Visualizer.mp4'
        ),
        title: '3D Atomic Visualizer Demo',
        type: 'demo',
        caption: 'Complete project walkthrough and feature demonstration',
        detailedCaption:
          'Comprehensive video demonstration showcasing the full 3D Atomic Visualizer application, including carousel navigation through 118 periodic elements, real-time atomic structure visualization with Bohr model implementation, electron orbital animations, and interactive WebGL-based educational interface built with React Three Fiber and TypeScript',
      },
    ],
  },

  // =============================================================================
  // PROJECT LINKS
  // =============================================================================
  links: {
    liveDemo: 'https://conc2304.github.io/3D-Atomic-Visualizer/',
    repository: 'https://github.com/conc2304/3D-Atomic-Visualizer',
    caseStudy: undefined,
    additionalLinks: [
      {
        title: 'Project Demo Video',
        url: 'https://youtu.be/1rKQbis-Bmw',
        type: 'other',
      },
      {
        title: 'React Three Fiber Documentation',
        url: 'https://r3f.docs.pmnd.rs/',
        type: 'documentation',
      },
      {
        title: 'Three.js Library',
        url: 'https://threejs.org/',
        type: 'documentation',
      },
      {
        title: 'Periodic Table Data API',
        url: 'https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json',
        type: 'documentation',
      },
    ],
  },

  // =============================================================================
  // PROJECT CONTENT & NARRATIVE
  // =============================================================================
  content: {
    overview: `Harvard CS50 final project demonstrating cutting-edge 3D web development through an interactive periodic table explorer.

    Built with React Three Fiber and TypeScript, the application features a 3D carousel navigation system for all 118 elements, real-time atomic structure visualization using scientifically accurate Bohr models, and animated electron orbital mechanics.

    The project integrates WebGL with educational technology, featuring an electron configuration parsing system that transforms chemistry notation into dynamic 3D visualizations.`,

    process: `**Learning Objective & Technology Selection**: As a CS50 student, the primary goal was mastering new web programming techniques leveraging cutting-edge 3D technologies. Selected React Three Fiber as the core framework to combine familiar React paradigms with powerful Three.js 3D capabilities, enabling component-based architecture for complex 3D scene management.

**Scientific Research & Atomic Model Implementation**: Conducted extensive research into atomic structure representation, electron configuration parsing, and orbital mechanics to ensure scientific accuracy. Chose the Bohr model for visualization due to its clarity and educational value, while acknowledging the complexity trade-offs compared to more advanced orbital models (s, p, d, f orbitals).

**3D Scene Architecture & Component Design**: Developed modular component architecture separating concerns between periodic table navigation, atomic structure visualization, and user interface controls. Created reusable 3D components including element tiles, atomic structure renderers, and interactive controls while maintaining clean separation between React state management and Three.js scene manipulation.

**Interactive Carousel Development**: Implemented sophisticated 3D carousel system supporting smooth navigation between 118 periodic elements, with dynamic focus management and responsive layout adaptation. Integrated complex state management to coordinate between carousel position, active element selection, and atomic structure updates.

**Electron Configuration Processing & Visualization**: Developed parsing system for electron configuration strings (e.g., "1s2 2s2 2p5" for Fluorine) to programmatically generate accurate atomic structures. Implemented orbital animation system creating realistic electron movement patterns around atomic nuclei with proper shell-based organization.

**Performance Optimization & Browser Compatibility**: Addressed WebGL performance challenges through efficient geometry management, texture optimization, and frame rate monitoring. Implemented browser compatibility checks and provided clear user guidance for optimal viewing experience, particularly for WebGL-intensive 3D rendering.

**Data Integration & External API Management**: Integrated real-time periodic table data from external JSON API, implementing efficient data fetching, caching, and error handling. Created robust data processing pipeline transforming raw element data into 3D visualization parameters while maintaining application responsiveness.`,

    results: `**3D Web Development Skill Acquisition**:
• Successfully learned and implemented React Three Fiber, demonstrating ability to master cutting-edge 3D web development technologies
• Created functional integration between React component architecture and Three.js WebGL rendering, solving fundamental state synchronization challenges
• Built responsive 3D carousel navigation system supporting smooth transitions between 118 periodic elements with intuitive user controls
• Developed working atomic structure visualization system rendering Bohr model representations with animated electron orbits

**Educational Application Development**:
• Transformed abstract atomic structure concepts into interactive 3D experiences, demonstrating practical application of programming skills to educational challenges
• Implemented electron configuration parsing system automatically generating atomic structures from standard chemistry notation strings
• Created functional orbital animation system demonstrating electron movement patterns and shell-based atomic organization
• Developed comprehensive element information system integrating external API data with 3D visualizations

**Technical Implementation & Performance**:
• Successfully optimized WebGL rendering to maintain smooth animation performance across different browser environments
• Implemented efficient component architecture enabling clean separation between React state management and 3D scene rendering
• Created robust data integration system handling real-time periodic table data fetching and processing
• Developed multi-modal interaction system supporting both traditional UI controls and 3D spatial navigation

**Academic Project Excellence**:
• Exceeded typical CS50 project scope by implementing advanced 3D graphics programming and modern web frameworks
• Demonstrated independent learning capability by mastering React Three Fiber and WebGL concepts not covered in coursework
• Created production-ready application with professional deployment practices and comprehensive documentation
• Successfully balanced technical complexity with educational value and user experience considerations`,

    challenges: `**Learning React Three Fiber Integration**: Mastering the integration between React's component model and Three.js 3D rendering required understanding new concepts around state synchronization, lifecycle management, and 3D scene updates. Learning how to coordinate React state changes with 3D object transformations while maintaining performance demanded extensive experimentation with the React Three Fiber framework.

**WebGL Performance & Browser Compatibility**: Creating smooth 3D experiences with animated atomic visualizations required learning about WebGL performance optimization and browser compatibility considerations. Understanding how to maintain consistent frame rates while rendering multiple 3D elements and ensuring the application worked across different graphics hardware configurations presented ongoing technical challenges.

**Scientific Research & Implementation**: Implementing scientifically accurate atomic structure representations required researching chemistry concepts, electron configuration notation, and orbital mechanics. Balancing scientific accuracy with visual clarity and educational value while working within the constraints of the Bohr model demanded careful consideration of both technical limitations and educational objectives.

**3D User Interface Design**: Designing intuitive interaction patterns for 3D environments required learning new approaches to user experience design beyond traditional web interfaces. Creating effective hover states, navigation controls, and spatial interactions that felt natural to users unfamiliar with 3D environments demanded extensive iteration and testing.

**Data Processing & Real-Time Visualization**: Transforming electron configuration strings into dynamic 3D atomic structures required developing parsing algorithms and animation systems. Creating smooth transitions between different atomic structures while maintaining visual appeal and educational value presented coordination challenges between data processing and 3D rendering.

**Project Scope Management**: Balancing the ambitious technical goals of learning advanced 3D web development with the practical constraints of an academic project timeline required careful scope management and feature prioritization. Deciding which aspects of atomic visualization to implement while ensuring a polished final product demanded ongoing project management decisions.

**Independent Learning & Problem Solving**: Working with cutting-edge technologies like React Three Fiber that had limited learning resources and community support required developing strong independent learning skills and problem-solving approaches when encountering technical obstacles with minimal available documentation or examples.`,

    learnings: `**React Three Fiber & 3D Web Development**: This project provided hands-on experience with cutting-edge 3D web development, learning how React Three Fiber enables component-based architecture for WebGL applications. Understanding how to integrate React's declarative paradigm with Three.js 3D rendering became valuable knowledge for future interactive web applications requiring visual complexity.

**WebGL Performance & Optimization**: Working with real-time 3D graphics taught important lessons about browser performance, frame rate optimization, and memory management in graphics applications. Learning to balance visual complexity with smooth performance provided insights applicable to any application involving complex visual processing or animation.

**Scientific Data Processing & Visualization**: Implementing electron configuration parsing and atomic structure generation taught valuable lessons about transforming technical data into visual representations. Understanding how to research scientific concepts and translate them into interactive experiences demonstrated the intersection of programming skills with domain knowledge.

**Modern Web Technology Integration**: Successfully coordinating React, TypeScript, WebGL, and external APIs in a complex application taught essential lessons about modern web architecture and technology selection. Learning to manage dependencies and coordinate multiple sophisticated technologies became foundational knowledge for large-scale web development.

**3D User Interface Design**: Creating intuitive interactions in 3D environments introduced new concepts about spatial interface design and user guidance in immersive experiences. Understanding the unique challenges of 3D interaction design provided insights into emerging interface paradigms beyond traditional 2D web development.

**Independent Technical Learning**: Mastering React Three Fiber and advanced WebGL concepts independently demonstrated ability to learn cutting-edge technologies through documentation, experimentation, and problem-solving. This self-directed learning approach became valuable for staying current with evolving web technologies.

**Educational Technology Development**: Creating an educational application highlighted how interactive technology can enhance learning experiences. Understanding how to make technical concepts accessible through thoughtful interaction design became applicable to documentation, training materials, and knowledge transfer in professional contexts.

**Academic Project Management**: Completing a sophisticated technical project within academic constraints taught valuable lessons about scope management, technical decision-making, and balancing learning objectives with deliverable quality. These project management skills became essential for future independent development work.`,
  },

  // =============================================================================
  // PROJECT METADATA
  // =============================================================================
  metadata: {
    featured: true,
    status: 'live',
    lastUpdated: '2023-08',
    tags: [
      'react-three-fiber',
      '3d-web-development',
      'webgl-programming',
      'scientific-visualization',
      'educational-technology',
      'typescript-development',
      'three-js',
      'atomic-structure-simulation',
      'interactive-3d-ui',
      'periodic-table-visualization',
      'electron-orbital-animation',
      'chemistry-education',
      'real-time-3d-graphics',
      'browser-based-3d',
      'react-spring-animation',
      'performance-optimization',
      'cross-browser-compatibility',
      'academic-project',
      'harvard-cs50',
      'solo-development',
    ],
    difficulty: 'advanced',
  },
};
