import { ProjectData } from '@jc/ui-components';
import { getImageUrl, getResponsiveImageSet, getVideoUrl } from '@jc/utils';

export const climateDataVizProject: ProjectData = {
  // =============================================================================
  // CORE PROJECT INFORMATION
  // =============================================================================
  id: 'climate-impact-data-visualization',
  projectName: 'Planet Habitability',
  projectSubtitle: 'Climate Impact Data Visualization',
  slug: 'climate-impact-data-viz',

  // =============================================================================
  // PROJECT BASICS
  // =============================================================================
  basics: {
    type: 'school',
    category: 'data-visualization',
    subcategories: [
      'web',
      'climate-science',
      'interactive-design',
      'geographic-visualization',
      'statistical-analysis',
      'environmental-data',
    ],
    description:
      'Comprehensive interactive data visualization exploring correlations between rising temperatures and severe weather patterns across US states, featuring dynamic heatmaps, temporal filtering, and multi-dimensional analysis tools to reveal climate impact trends and identify most vulnerable regions.',
    context:
      'Harvard University - CS171 Data Visualization Course Final Project',
  },

  // =============================================================================
  // TECHNICAL DETAILS
  // =============================================================================
  technical: {
    technologies: [
      'React',
      'TypeScript',
      'D3.js',
      'D3-geo',
      'Material UI',
      'React Bootstrap',
      'Bootstrap',
      'React Spring (Animation)',
      'Lodash',
      'TopoJSON Client',
      'HTML5 Canvas',
      'CSS3/SCSS',
      'Node.js',
      'npm',
      'GitHub Pages (Deployment)',
      'Git Version Control',
    ],
    timeline: {
      startDate: undefined, // Would be semester-based
      endDate: undefined,
      duration: 'Academic semester final project',
    },
    myRole:
      'Frontend Developer & Data Visualization Specialist - React/D3 integration, interactive chart development, user experience design, deployment',
    collaborators: [
      {
        name: 'Ben Fulroth',
        role: 'Team Member - Data Analysis & UI Development',
        url: undefined,
      },
      {
        name: 'Patrick Niebrzydowski',
        role: 'Team Member - Data Processing & Backend Integration',
        url: undefined,
      },
    ],
  },

  // =============================================================================
  // MEDIA ASSETS
  // =============================================================================
  media: {
    hero: {
      relativePath:
        'projects/climate-data-vis/climate-data-hero-exploration-page.jpg',
      alt: 'Hero view of Planet Habitability climate data visualization application showing comprehensive interface with heatmaps, charts, and interactive controls',
      caption: 'Complete Planet Habitability application interface overview',
      detailedCaption:
        'Project hero showcase highlighting the comprehensive climate data visualization platform featuring integrated US heatmap, temporal analysis tools, comparative charts, and interactive controls, demonstrating the successful integration of React, TypeScript, and D3.js technologies for exploring complex climate science data and regional vulnerability assessment',
    },
    screenshots: [
      {
        relativePath:
          'projects/climate-data-vis/climate-data-exploration-page-initial-state.jpg',
        alt: 'Initial state of climate data exploration interface showing US heatmap, temperature anomaly timeline, and navigation controls for interactive data analysis',
        caption:
          'Main exploration interface with US heatmap and timeline controls',
        detailedCaption:
          'Primary exploration page interface featuring dynamic US state heatmap visualization with climate impact data overlay, temporal temperature anomaly timeline with interactive scrubbing capabilities, and comprehensive navigation controls enabling multi-dimensional climate data analysis and regional vulnerability assessment',
      },
      {
        relativePath:
          'projects/climate-data-vis/climate-data-exploration-page-radar-chart-metric-comparison-with-tooltip.jpg',
        alt: 'Radar chart visualization showing multi-dimensional climate metrics comparison between states with interactive tooltip displaying detailed data values',
        caption:
          'Interactive radar chart for multi-state climate metrics comparison',
        detailedCaption:
          'Advanced radar chart visualization system enabling comparative analysis of multiple climate metrics across different states, featuring interactive tooltips with detailed data values, multi-dimensional data representation including storm frequency, temperature anomalies, and damage assessments for comprehensive regional climate impact comparison',
      },
      {
        relativePath:
          'projects/climate-data-vis/climate-data-exploration-page-timeline-scrubbing-selection.jpg',
        alt: 'Interactive timeline interface with temporal scrubbing controls for filtering climate data by specific time periods and observing trend evolution',
        caption:
          'Temporal filtering with interactive timeline scrubbing controls',
        detailedCaption:
          'Sophisticated temporal exploration interface featuring interactive timeline with scrubbing functionality, enabling users to filter climate data by specific time periods, observe temperature anomaly trends over time, and dynamically update all connected visualizations based on temporal selections for comprehensive trend analysis',
      },
      {
        relativePath:
          'projects/climate-data-vis/climate-data-exploration-page-weather-type-selection-menu.jpg',
        alt: 'Weather event type selection interface showing filtering options for different storm categories and severe weather patterns in climate analysis',
        caption: 'Weather event type filtering and selection interface',
        detailedCaption:
          'Comprehensive weather event categorization system featuring interactive filtering options for different storm types including hurricanes, tornadoes, floods, and other severe weather patterns, enabling focused analysis of specific weather phenomena and their correlation with temperature anomalies across different regions and time periods',
      },
      {
        relativePath:
          'projects/climate-data-vis/climate-data-hero-exploration-page.jpg',
        alt: 'Hero view of Planet Habitability climate data visualization application showing comprehensive interface with heatmaps, charts, and interactive controls',
        caption: 'Complete Planet Habitability application interface overview',
        detailedCaption:
          'Project hero showcase highlighting the comprehensive climate data visualization platform featuring integrated US heatmap, temporal analysis tools, comparative charts, and interactive controls, demonstrating the successful integration of React, TypeScript, and D3.js technologies for exploring complex climate science data and regional vulnerability assessment',
      },
      {
        relativePath:
          'projects/climate-data-vis/climate-data-intro-storms-events-over-time.jpg',
        alt: 'Temporal visualization showing storm events frequency over time with trend analysis and pattern identification for climate impact assessment',
        caption: 'Storm events frequency trends over time visualization',
        detailedCaption:
          'Introductory temporal analysis visualization displaying storm event frequency patterns over extended time periods, featuring trend identification capabilities, seasonal pattern recognition, and baseline establishment for understanding the evolution of severe weather patterns in relation to climate change and temperature anomaly data',
      },
      {
        relativePath:
          'projects/climate-data-vis/climate-data-line-chart-events-by-state.jpg',
        alt: 'Comparative line chart visualization showing climate events data by state with multi-series analysis and interactive legend controls',
        caption:
          'Multi-state comparative analysis with interactive line charts',
        detailedCaption:
          'Advanced comparative line chart system enabling side-by-side analysis of climate event data across multiple US states, featuring multi-series visualization, interactive legend controls, and dynamic data binding that updates based on user selections, supporting comprehensive regional comparison and vulnerability assessment for climate impact analysis',
      },
    ],
    videos: [
      {
        relativePath:
          'projects/climate-data-vis/The Future of Climate and Severe Weather - Data Vis Final Video_optimized.mp4',
        caption:
          'Complete project walkthrough of climate data visualization application',
        detailedCaption:
          'Comprehensive demonstration of Planet Habitability application showcasing interactive exploration of climate data through dynamic US heatmaps, temporal temperature anomaly filtering, comparative state analysis, and radar chart visualizations, demonstrating the correlation between rising temperatures and severe weather patterns across the United States',
        title: 'Planet Habitability Project Screencast',
        type: 'demo',
      },
    ],
  },

  // =============================================================================
  // PROJECT LINKS
  // =============================================================================
  links: {
    liveDemo:
      'https://conc2304.github.io/Climate-Impact-Data-Viz-Final-Project/',
    repository:
      'https://github.com/conc2304/Climate-Impact-Data-Viz-Final-Project',
    caseStudy: undefined,
    additionalLinks: [
      {
        title: 'Project Screencast',
        url: 'https://www.youtube.com/watch?v=29FGDYg1OEY',
        type: 'other',
      },
      {
        title: 'Process Book PDF',
        url: 'https://github.com/conc2304/Climate-Impact-Data-Viz-Final-Project/blob/final_docs/Process%20Book%20-%20CS%20171%20-%20Planet%20Habitability%20.pdf',
        type: 'documentation',
      },
      {
        title: 'D3.js Library',
        url: 'https://d3js.org/',
        type: 'documentation',
      },
      {
        title: 'React Framework',
        url: 'https://reactjs.org/',
        type: 'documentation',
      },
    ],
  },

  // =============================================================================
  // PROJECT CONTENT & NARRATIVE
  // =============================================================================
  content: {
    overview: `Harvard CS171 final project exploring critical correlations between rising global temperatures and severe weather patterns across US states through interactive data visualization.

    Built with React, TypeScript, and D3.js, "Planet Habitability" features an integrated analysis combining US heatmaps, temporal temperature anomaly timelines, multi-state comparative line charts, and radar chart systems for comprehensive regional vulnerability assessment.

    The application enables users to filter climate data by time periods, weather event types, and geographic regions while discovering trends through intuitive interactive exploration.

    The project transforms complex climate science datasets into information that reveal which regions face greatest climate risks and how severe weather patterns correlate with temperature changes over time.`,

    process: `**Team Formation & Project Scope Definition**: Formed "The Three Planeteers" team and established project focus on climate data visualization addressing the intersection of temperature anomalies and severe weather impacts. Defined primary research questions and target audience needs for climate impact exploration and regional vulnerability assessment.

**Data Research & Analysis Strategy**: Conducted comprehensive research into climate datasets, focusing on Global Temperature Anomaly scales and severe weather event databases. Established data segmentation strategies including metrics-based analysis (total storms, deaths/injuries, property damages) and storm event type categorization to enable multi-dimensional exploration.

**Technical Architecture & Framework Selection**: Designed React/TypeScript architecture with D3.js integration for sophisticated data visualization capabilities. Selected complementary libraries including Material UI for consistent design systems, React Spring for smooth animations, and D3-geo for geographic projections. Established modular component structure supporting reusable visualization components.

**Interactive Visualization Development**: Developed comprehensive suite of interconnected visualizations including primary US heatmap with state-level detail, temporal temperature anomaly timeline with zoom/scrub functionality, comparative line charts enabling multi-state analysis, and radar chart systems for snapshot comparisons. Implemented dynamic data binding ensuring all visualizations update cohesively based on user interactions.

**User Experience & Interface Design**: Created intuitive navigation flow progressing from temporal overview to detailed exploration and comparative analysis. Designed contextual information systems including explanatory content for Global Temperature Anomaly scale and interactive help features. Implemented responsive design ensuring accessibility across different devices and screen sizes.

**Integration & Performance Optimization**: Coordinated team development using Git version control and established deployment pipeline to GitHub Pages. Optimized data loading and rendering performance for smooth interaction with large climate datasets. Implemented efficient state management enabling real-time updates across multiple interconnected visualizations.`,

    results: `**Interactive Climate Data Exploration Platform**:
• Created comprehensive visualization system enabling users to independently discover climate trends and regional vulnerabilities through intuitive interactive exploration
• Developed dynamic US heatmap visualization highlighting most impacted states with real-time updates based on user-selected metrics and timeframes
• Implemented temporal filtering system allowing users to explore climate data across different time periods and observe trend evolution
• Built comparative analysis tools enabling side-by-side state and storm event analysis through interactive line charts and radar visualizations

**Technical Achievement & Performance**:
• Successfully integrated React component architecture with D3.js visualization library, creating seamless data binding and update cycles
• Developed responsive, performant application handling complex climate datasets with smooth interactive transitions and real-time filtering
• Implemented modular visualization component system supporting reusable chart types and consistent interaction patterns
• Created efficient data processing pipeline transforming raw climate data into multiple visualization formats while maintaining performance

**Educational Impact & Accessibility**:
• Transformed complex climate science data into accessible, explorable format enabling non-expert audiences to understand climate impact trends
• Designed progressive disclosure interface guiding users from overview understanding to detailed analysis and comparative insights
• Implemented contextual educational content explaining Global Temperature Anomaly methodology and climate science concepts
• Created engaging narrative flow encouraging deeper exploration of climate data through interactive storytelling approach

**Collaborative Development Success**:
• Successfully coordinated 3-person development team using modern collaboration tools and agile development practices
• Established clear role divisions enabling parallel development of data processing, visualization components, and user interface design
• Created comprehensive documentation including process book and demonstration materials supporting project reproducibility and knowledge transfer
• Delivered polished final product meeting academic requirements while demonstrating professional-level development capabilities`,

    challenges: `**Complex Data Integration & Processing**: Handling large, multi-dimensional climate datasets required developing efficient data processing pipelines that could support real-time filtering and updates across multiple visualization types. Creating consistent data structures that could drive heatmaps, line charts, and radar visualizations simultaneously demanded careful architectural planning and performance optimization.

**React & D3.js Integration Architecture**: Combining React's component-based rendering with D3.js's direct DOM manipulation required solving fundamental architectural challenges around state management, update cycles, and event handling. Ensuring smooth data binding between React state and D3 visualizations while maintaining performance demanded deep understanding of both frameworks' paradigms.

**Multi-Dimensional Visualization Coordination**: Creating cohesive user experience across multiple interconnected visualizations (heatmap, timeline, line charts, radar charts) required sophisticated state management ensuring all charts update consistently based on user interactions. Maintaining data consistency and visual coherence while enabling complex filtering scenarios presented significant coordination challenges.

**Geographic Data Visualization Complexity**: Implementing accurate US state geographic visualizations using D3-geo and TopoJSON required mastering coordinate projections, geographic data formats, and efficient rendering techniques. Creating responsive heatmap overlays that accurately represent state-level data while maintaining visual clarity across different zoom levels demanded extensive experimentation.

**Team Coordination & Development Workflow**: Coordinating three-person development team with different technical backgrounds required establishing clear Git workflow, code review processes, and integration procedures. Balancing individual contribution areas while maintaining code consistency and avoiding merge conflicts demanded proactive project management and communication.

**Performance Optimization with Large Datasets**: Ensuring responsive user interaction while processing and visualizing large climate datasets required implementing efficient data loading strategies, smart caching mechanisms, and optimized rendering techniques. Balancing visual complexity with performance constraints, particularly for real-time filtering and animation, demanded continuous optimization.

**User Experience Design for Complex Data**: Creating intuitive interface for exploring multi-dimensional climate data without overwhelming users required extensive UX iteration and user testing. Balancing comprehensive analytical capabilities with approachable interaction design demanded careful progressive disclosure and contextual guidance implementation.`,

    learnings: `**Advanced Data Visualization Architecture**: This project provided deep experience in designing and implementing complex data visualization systems that seamlessly integrate multiple chart types, interaction methods, and data filtering capabilities. Learning to orchestrate React component architecture with D3.js visualization library taught valuable lessons about framework integration and performance optimization in data-intensive applications.

**Geographic Data Visualization Mastery**: Working with D3-geo, TopoJSON, and geographic coordinate systems provided comprehensive understanding of cartographic visualization techniques, projection methods, and efficient geographic data rendering. These skills became directly applicable to any project requiring location-based data visualization or mapping capabilities.

**Multi-Dimensional Data Analysis & Presentation**: Designing systems that enable users to explore complex datasets through multiple analytical lenses (temporal, geographic, categorical) taught crucial lessons about information architecture and progressive disclosure. Understanding how to present complex data relationships without overwhelming users became a transferable skill for any data-driven application design.

**Collaborative Development & Version Control**: Coordinating three-person development team using Git, establishing code review processes, and managing feature integration taught essential lessons about professional development workflows. Learning to balance individual contribution areas while maintaining code consistency prepared valuable teamwork skills for professional development environments.

**Climate Science Communication Through Technology**: Translating complex climate science concepts into accessible interactive experiences highlighted the powerful role of visualization in science communication. Understanding how to make technical subject matter approachable through thoughtful interaction design became applicable to communicating any complex technical topic through technology.

**Performance Engineering for Data Applications**: Optimizing application performance while handling large datasets and complex visualizations taught important lessons about efficient data processing, smart caching strategies, and rendering optimization. These performance engineering skills became essential for any application dealing with substantial data processing requirements.

**User Experience Design for Analytical Tools**: Creating intuitive interfaces for data exploration taught valuable lessons about designing for different user expertise levels, providing contextual guidance, and enabling both casual exploration and deep analysis. These UX design principles became applicable to any application requiring users to understand and interact with complex information.

**Academic Project to Professional Standards**: Delivering university coursework that demonstrates professional development capabilities taught lessons about exceeding academic requirements to create portfolio-worthy projects. Understanding how to balance educational objectives with career preparation became a valuable approach for maximizing learning opportunities.`,
  },

  // =============================================================================
  // PROJECT METADATA
  // =============================================================================
  metadata: {
    featured: true,
    status: 'live',
    lastUpdated: undefined, // Academic project completion date
    tags: [
      'data-visualization',
      'climate-science',
      'interactive-design',
      'react-development',
      'd3js-integration',
      'geographic-visualization',
      'typescript',
      'team-collaboration',
      'environmental-data',
      'heatmap-visualization',
      'temporal-analysis',
      'comparative-analysis',
      'user-experience-design',
      'performance-optimization',
      'academic-project',
      'harvard-cs171',
      'weather-patterns',
      'temperature-anomalies',
      'statistical-visualization',
      'science-communication',
    ],
    difficulty: 'advanced',
  },
};
