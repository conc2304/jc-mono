import { ProjectData } from '@jc/ui-components';

export const verdantiaProject: ProjectData = {
  // =============================================================================
  // CORE PROJECT INFORMATION
  // =============================================================================
  id: 'verdantia-urban-reforestation-city-builder',
  projectName: 'Verdantia: Urban Reforestation City Builder Game',
  slug: 'verdantia',

  // =============================================================================
  // PROJECT BASICS
  // =============================================================================
  basics: {
    type: 'graduate',
    category: 'game-dev',
    subcategories: [
      '3d-modeling',
      'creative-coding',
      'data-visualization',
      'digital-art',
      'education',
      'environmental-activism',
      'interactive-installation',
      'museum-exhibit',
      'scientific-computing',
      'ui-ux',
    ],
    description:
      'An urban simulation museum installation game that educates players about environmental impact, city planning, and sustainability through interactive city building, real-time heat island simulation using advanced calculus, and immersive touch kiosk interface design.',
    context:
      'Harvard University - Masters in Digital Media Design Capstone Project',
  },

  // =============================================================================
  // TECHNICAL DETAILS
  // =============================================================================
  technical: {
    technologies: [
      'Unity 2021.3',
      'C#',
      'Thomas Algorithm (Calculus)',
      'Heat Equation Implementation',
      'Touch Screen Interface',
      'Multi-Display Support',
      '3D Modeling',
      'Low-Poly Art Style',
      'City Engine (Unity Asset)',
      'Stylized Solarpunk City Assets',
      'QR Code Generation',
      'Joystick Pack (Touch Navigation)',
      'Data Visualization',
      'Real-time Metrics Processing',
      'Save/Load System',
      'Mission System Architecture',
      'Dynamic Building System',
      'Grid-based City Planning',
    ],
    timeline: {
      startDate: '2023-09', // Estimated start of capstone year
      endDate: '2024-05', // Graduate program completion
      duration: '8 months (intensive capstone project)',
    },
    myRole:
      'Sole Developer, Designer, and Researcher - Full-stack game development, calculus implementation, 3D asset creation, UI/UX design, educational content design',
    collaborators: [
      {
        name: 'Father (Calculus Mentor)',
        role: 'Mathematical Consultant & Heat Equation Implementation Partner',
        url: undefined,
      },
      {
        name: 'Professor Mikhak',
        role: 'Academic Advisor - Suggested passive user engagement features',
        url: undefined,
      },
      {
        name: 'Graduate Program Cohort',
        role: 'User Testing and Feedback',
        url: undefined,
      },
    ],
  },

  // =============================================================================
  // MEDIA ASSETS
  // =============================================================================
  media: {
    thumbnail: undefined, // Would need to extract from actual game screenshots
    screenshots: [
      {
        url: 'https://github.com/conc2304/verdantia/raw/main/screenshot1.png', // Placeholder - actual screenshots would be in GitHub
        alt: 'Verdantia city builder main interface showing 3D low-poly city grid',
        caption:
          'Main game interface with touch kiosk controls and 3D city visualization',
      },
      {
        url: 'https://github.com/conc2304/verdantia/raw/main/heat-map-view.png',
        alt: 'Urban heat island visualization with color-coded temperature map',
        caption:
          'Real-time heat island simulation using Thomas Algorithm implementation',
      },
      {
        url: 'https://github.com/conc2304/verdantia/raw/main/building-placement.png',
        alt: 'Building placement interface with green infrastructure options',
        caption:
          'Interactive building placement system with environmental impact preview',
      },
      {
        url: 'https://github.com/conc2304/verdantia/raw/main/metrics-dashboard.png',
        alt: 'City metrics dashboard showing temperature, happiness, pollution data',
        caption: 'Real-time city metrics display for educational feedback',
      },
    ],
    videos: [
      {
        url: 'Arctice_Drone_Exhibit.mov', // From documentation - would need actual path
        title: 'Arctic Drone Survey Installation Inspiration',
        type: 'inspiration',
        caption:
          'Moment Factory installation that inspired interactive touch kiosk design',
      },
      {
        url: 'River_Infrastructure_Installation.mov', // From documentation
        title: 'River Infrastructure Installation Reference',
        type: 'inspiration',
        caption:
          'Museum of Science Boston exhibit that inspired physical interaction design',
      },
      {
        url: 'verdantia_gameplay_demo.mp4', // Would be created from game footage
        title: 'Verdantia Gameplay Demonstration',
        type: 'demo',
        caption:
          'Complete gameplay flow showing city building, heat simulation, and educational elements',
      },
    ],
  },

  // =============================================================================
  // PROJECT LINKS
  // =============================================================================
  links: {
    liveDemo: undefined, // Museum installation - no web demo
    repository: 'https://github.com/conc2304/verdantia',
    caseStudy: undefined, // Would link to portfolio page when created
    additionalLinks: [
      {
        title: 'Unity Asset - City Engine',
        url: 'https://assetstore.unity.com/packages/templates/systems/city-engine-174406',
        type: 'documentation',
      },
      {
        title: 'Unity Asset - Stylized Solarpunk City',
        url: 'https://assetstore.unity.com/packages/3d/environments/sci-fi/stylized-solarpunk-city-267031',
        type: 'documentation',
      },
      {
        title: 'Moment Factory - Arctic Exhibit Reference',
        url: 'https://momentfactory.com/', // General company site
        type: 'inspiration',
      },
      {
        title: 'Museum of Science Boston',
        url: 'https://www.mos.org/',
        type: 'inspiration',
      },
      {
        title: 'Thomas Algorithm Technical Reference',
        url: 'https://en.wikipedia.org/wiki/Tridiagonal_matrix_algorithm',
        type: 'documentation',
      },
    ],
  },

  // =============================================================================
  // PROJECT CONTENT & NARRATIVE
  // =============================================================================
  content: {
    overview: `Verdantia is a groundbreaking urban simulation museum installation that transforms climate change education through interactive city building and real-time environmental science visualization. Born from a desire to make reforestation personally meaningful rather than abstractly altruistic, the project enables users to create and manage cities while witnessing the immediate effects of their urban planning decisions on temperature, pollution, happiness, and sustainability metrics.

The game addresses the fundamental challenge identified in climate education: people only care about environmental issues when they personally impact them. By implementing Sarah Ivens' research from "Forest Therapy" about the tangible health and well-being benefits of green spaces, Verdantia reframes reforestation from a distant global concept into an immediately relatable personal experience. Players see how urban heat islands affect their daily comfort, how green spaces reduce mental fatigue, and how sustainable planning directly improves quality of life.

The project represents a sophisticated fusion of advanced mathematical modeling, game design, environmental education, and museum installation experience. At its technical core, it implements the heat equation using the Thomas Algorithm to simulate urban heat island effects with scientific accuracy, while maintaining an accessible, engaging interface designed for diverse museum audiences.`,

    process: `The development journey began with an ambitious vision to create a multi-modal multimedia exhibit inspired by art house documentaries like Koyaanisqatsi and museum installations by Moment Factory. After extensive research at the Museum of Science Boston and New England Botanic Garden, the scope crystallized around a single, deeply developed city builder game that could address the complexity of urban environmental systems without oversimplifying critical decision-making processes.

**Mathematical Implementation Challenge**: The project's most technically demanding aspect was implementing real-time heat island simulation using calculus. Working collaboratively with my father (who taught me linear algebra and calculus specifically for this project), we first solved the heat equation analytically before developing numerical solutions. Our initial Euler method approach suffered from critical stability issues that would cause unrealistic temperature spikes across the entire city. Through extensive research, we discovered and successfully implemented the Thomas Algorithm - a method for solving tridiagonal systems of equations that provided the stability necessary for real-time heat diffusion simulation.

**Unity Development & Asset Management**: Transitioning from web development to Unity presented significant learning curves and architectural challenges. The project utilized the City Engine asset as a foundation but required extensive customization and restructuring. The purchased code suffered from poor documentation, inconsistencies, and inflexible architecture, ultimately requiring a complete philosophical shift from using it as a finished product to treating it as raw materials for a custom solution.

**3D Asset Creation & Visual Design**: To effectively demonstrate heat retention and mitigation effects, I designed and built custom 3D models representing different building types (concrete heat-retaining structures, glass energy-intensive buildings, green roofs, parks, tree-lined streets). Each model was optimized for both visual clarity and functional gameplay integration, using a cohesive low-poly aesthetic that maintained performance while clearly communicating environmental concepts.

**Educational Integration**: Professor Mikhak's suggestion to engage passive viewers led to the development of comprehensive informational pop-up systems, dynamic city metrics displays, and visual storytelling elements. These features ensure the installation educates both active players and museum visitors observing the experience.`,

    results: `Verdantia successfully demonstrates that complex environmental concepts can be made personally meaningful and immediately actionable through thoughtful interactive design:

**Technical Achievements**:
• Real-time heat equation simulation using Thomas Algorithm provides scientifically accurate urban heat island modeling
• Stable, responsive city-building mechanics supporting dynamic building placement, demolition, and upgrading systems
• Multi-display museum installation architecture supporting both active players and passive observers
• Comprehensive save/load system enabling persistent city development and comparison studies
• Mission-based learning system that guides users through increasingly complex environmental challenges

**Educational Impact**:
• Transforms abstract climate change concepts into personal, relatable experiences through heat island visualization
• Demonstrates immediate consequences of urban planning decisions on temperature, air quality, and citizen happiness
• Integrates scientific research on forest therapy and green space benefits into gameplay mechanics
• Provides real-time data visualization helping users understand complex environmental systems
• Bridges the gap between environmental activism and personal well-being through tangible gameplay feedback

**Museum Installation Success**:
• Touch kiosk interface designed for diverse user capabilities and museum traffic flow
• Educational pop-ups provide value to passive observers while active users play
• Dynamic visual storytelling keeps spectators engaged with city development progress
• QR code integration enables extended learning beyond the installation experience

**Personal and Professional Growth**:
• Successfully transitioned technical skills from web development to game development and scientific computing
• Demonstrated ability to implement advanced mathematical concepts in interactive applications
• Developed comprehensive project management skills coordinating technical development, educational content creation, and user experience design
• Created meaningful collaboration experience working with family member on complex technical challenges`,

    challenges: `**Mathematical Complexity & Stability Issues**: Implementing real-time heat equation simulation presented unprecedented technical challenges. The initial Euler method approach created catastrophic instability issues causing unrealistic temperature fluctuations that would render the entire simulation unusable. Researching and implementing the Thomas Algorithm required deep understanding of partial differential equations, numerical methods, and tridiagonal matrix solutions - all while maintaining real-time performance in a game environment.

**Unity Development Architecture**: Coming from web development, Unity's component-based architecture and asset management systems required fundamental mindset shifts. The project grew increasingly complex without proper architectural planning, leading to code bloat and violations of the Single Responsibility Principle. UI state management became particularly problematic, evolving into "spaghetti code" that made implementing new features increasingly difficult.

**Asset Store Integration Challenges**: The City Engine asset, while feature-rich, suffered from poor code quality, inconsistent documentation, and inflexible architecture. Rather than providing a ready-to-use foundation, it required extensive debugging, restructuring, and custom development. This experience taught valuable lessons about evaluating third-party solutions and the importance of maintaining ownership over core project architecture.

**Scope Management & Feature Creep**: The original vision for a multi-installation exhibit proved overly ambitious for a solo capstone project. Recognizing that each system (city building, environmental simulation, educational content) required deep development to avoid oversimplifying complex topics led to difficult decisions about project focus and feature prioritization.

**Educational Content Integration**: Balancing scientific accuracy with accessibility required careful attention to user interface design, information presentation, and cognitive load management. Creating educational pop-ups that inform without overwhelming, and metrics displays that teach without confusing, demanded extensive iteration and user testing.

**Technical Performance Optimization**: Real-time heat simulation, 3D rendering, touch interface responsiveness, and multi-display support created significant performance constraints requiring continuous optimization of algorithms, asset management, and rendering systems.`,

    learnings: `**Advanced Scientific Computing Integration**: This project demonstrated that complex mathematical concepts can be successfully integrated into interactive applications when proper numerical methods are employed. The experience of implementing the Thomas Algorithm taught valuable lessons about stability analysis, numerical precision, and real-time computational constraints that apply broadly to scientific computing applications.

**Game Development as Educational Medium**: Unity proved to be an exceptionally powerful platform for creating educational experiences, offering rapid prototyping capabilities, sophisticated 3D rendering, and comprehensive debugging tools that accelerated development compared to web-based alternatives. The experience reinforced the value of choosing appropriate tools for project requirements rather than defaulting to familiar technologies.

**Collaborative Problem-Solving & Knowledge Transfer**: Working with my father on calculus implementation created a meaningful model for collaborative learning where expertise in different domains (mathematical theory vs. software implementation) combines to solve complex problems. This experience highlighted the value of cross-generational knowledge sharing and mentorship in technical projects.

**User Experience Design for Complex Systems**: Creating interfaces that make complex environmental systems comprehensible required developing new approaches to data visualization, progressive disclosure, and contextual education. The challenge of designing for both active users and passive observers taught valuable lessons about multi-audience experience design.

**Personal Connection as Educational Strategy**: Sarah Ivens' research on forest therapy provided crucial insight that environmental education becomes most effective when connected to personal well-being and immediate experience. This principle guided design decisions throughout the project and offers a replicable approach for other educational applications.

**Project Architecture & Technical Debt Management**: The experience of rebuilding significant portions of third-party code reinforced the importance of establishing strong architectural foundations early in development. Understanding when to refactor versus when to rebuild became crucial skills for maintaining long-term project health.

**Perseverance & Creative Problem-Solving**: Encountering multiple technical dead-ends (Euler method instability, asset integration problems, UI architecture challenges) and finding alternative solutions reinforced personal confidence in tackling complex, multi-disciplinary problems. The project demonstrated that persistence combined with research and collaboration can overcome seemingly insurmountable technical challenges.`,
  },

  // =============================================================================
  // PROJECT METADATA
  // =============================================================================
  metadata: {
    featured: true,
    status: 'live', // Completed capstone project
    lastUpdated: '2024-05',
    tags: [
      'unity-game-development',
      'environmental-education',
      'climate-change-activism',
      'urban-heat-islands',
      'reforestation',
      'calculus-implementation',
      'thomas-algorithm',
      'scientific-computing',
      'museum-installation',
      'touch-kiosk-interface',
      'data-visualization',
      'sustainability-education',
      'interactive-learning',
      '3d-modeling',
      'low-poly-art',
      'city-building-game',
      'real-time-simulation',
      'multi-display-systems',
      'graduate-capstone',
      'harvard-university',
      'masters-thesis',
      'cross-generational-collaboration',
      'career-transition',
      'creative-coding',
    ],
    difficulty: 'advanced',
  },
};
