import { ProjectData } from '@jc/ui-components';
import { getImageUrl, getResponsiveImageSet, getVideoUrl } from '@jc/utils';

export const verdantiaProject: ProjectData = {
  // =============================================================================
  // CORE PROJECT INFORMATION
  // =============================================================================
  id: 'verdantia-urban-reforestation-city-builder',
  projectName: 'Verdantia',
  projectSubtitle: 'Urban Reforestation City Builder Game',
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
    hero: {
      relativePath:
        'projects/verdantia/verdantia-screenshot-welcome-screen-over-forest-hero-image.jpg',
      alt: 'Game welcome screen displaying over forest background imagery introducing environmental themes and sustainable city building educational objectives',
      caption: 'Welcome screen with environmental theme introduction',
      detailedCaption:
        "Engaging welcome screen featuring forest imagery that introduces Verdantia's environmental themes and educational objectives, setting the foundation for learning about urban reforestation, sustainable development, and the personal benefits of green spaces in city planning through interactive simulation experience",
    },
    screenshots: [
      {
        relativePath:
          'projects/verdantia/verdantia-gameplay-building-selection-menu-on-left-city-map-with-heat-map-on-right.jpg',
        alt: 'Verdantia gameplay interface showing building selection menu with construction options alongside city map featuring heat island visualization using scientific calculus simulation',
        caption:
          'Building selection interface with real-time heat map visualization',
        detailedCaption:
          "Advanced gameplay interface demonstrating Verdantia's building selection system with comprehensive construction options alongside real-time heat island simulation using Thomas Algorithm implementation, showcasing how different building types affect urban temperature patterns and environmental metrics in the educational city builder game",
      },
      {
        relativePath:
          'projects/verdantia/verdantia-gameplay-screenshot-city-neighborhood-with-parks.jpg',
        alt: 'Urban neighborhood gameplay view showing green spaces, parks, and sustainable city planning with low-poly 3D art style and environmental design elements',
        caption:
          'Sustainable neighborhood with integrated green spaces and parks',
        detailedCaption:
          "Detailed city neighborhood showcasing Verdantia's sustainable urban planning approach with integrated parks, green spaces, and environmentally conscious building placement, demonstrating the game's educational focus on urban reforestation and the positive impact of green infrastructure on city livability and temperature regulation",
      },
      {
        relativePath:
          'projects/verdantia/verdantia-gameplay-screenshot-green-city-with-eco-building.jpg',
        alt: 'Eco-friendly city development showing sustainable buildings, green roofs, and environmental architecture integrated into urban planning simulation gameplay',
        caption:
          'Eco-friendly city development with sustainable building systems',
        detailedCaption:
          'Comprehensive eco-friendly city showcase featuring sustainable building types including green roofs, renewable energy systems, and environmentally conscious architecture, demonstrating how Verdantia educates players about the relationship between building choices and environmental impact through scientifically accurate simulation',
      },
      {
        relativePath:
          'projects/verdantia/verdantia-gameplay-screenshot-heatmap-on-left-city-stats-bar-on-top-city-in-main-view.jpg',
        alt: 'Complete game interface showing heat map panel, city statistics dashboard, and main city view with comprehensive environmental data visualization and metrics',
        caption:
          'Complete interface with heat simulation and city metrics dashboard',
        detailedCaption:
          'Comprehensive game interface featuring real-time heat map simulation using advanced mathematical modeling, city statistics dashboard displaying temperature, pollution, happiness, and sustainability metrics, demonstrating the sophisticated data visualization systems that make complex environmental science concepts accessible and engaging for museum visitors',
      },
      {
        relativePath:
          'projects/verdantia/verdantia-gameplay-screenshot-heatmap-overlay-with-factoid-popup.jpg',
        alt: 'Heat map visualization overlay with educational factoid popup displaying environmental science information and urban heat island effects explanation',
        caption: 'Heat map overlay with educational popup content integration',
        detailedCaption:
          'Educational interface integration showcasing heat map visualization with contextual factoid popups that provide scientific information about urban heat island effects, forest therapy benefits, and environmental science concepts, demonstrating how Verdantia transforms complex climate science into personally meaningful and immediately understandable experiences',
      },
      {
        relativePath: 'projects/verdantia/verdantia-hero-image-city-ai.jpg',
        alt: "Verdantia hero image showing futuristic green city with sustainable architecture and urban forest integration representing the game's environmental vision",
        caption: 'Project hero image showcasing sustainable city vision',
        detailedCaption:
          "Inspiring project hero image representing Verdantia's vision of sustainable urban development with integrated green spaces, renewable energy systems, and environmentally conscious architecture, embodying the game's educational mission to demonstrate how thoughtful city planning can create healthier, more livable urban environments",
      },
      {
        relativePath:
          'projects/verdantia/verdantia-kiosk-and-main-game-game-completion-screen.jpg',
        alt: 'Museum kiosk installation showing game completion screen with final city results and environmental impact summary for educational assessment',
        caption: 'Museum kiosk with game completion and results summary',
        detailedCaption:
          'Museum installation completion interface displaying final city development results, environmental impact assessment, and sustainability metrics, demonstrating how Verdantia provides meaningful educational outcomes and allows museum visitors to evaluate their urban planning decisions and environmental stewardship effectiveness',
      },
      {
        relativePath:
          'projects/verdantia/verdantia-projected-gameplay-intro-scene.jpg',
        alt: 'Large-scale projected gameplay introduction scene for museum installation showing immersive environmental storytelling and game narrative presentation',
        caption:
          'Large-scale projection intro for museum installation experience',
        detailedCaption:
          "Immersive museum installation introduction featuring large-scale projection of Verdantia's opening narrative, designed to engage both active players and passive observers with environmental storytelling, setting the context for urban reforestation education and sustainable city planning learning experience",
      },
      {
        relativePath:
          'projects/verdantia/verdantia-screenshot-welcome-screen-over-forest-hero-image.jpg',
        alt: 'Game welcome screen displaying over forest background imagery introducing environmental themes and sustainable city building educational objectives',
        caption: 'Welcome screen with environmental theme introduction',
        detailedCaption:
          "Engaging welcome screen featuring forest imagery that introduces Verdantia's environmental themes and educational objectives, setting the foundation for learning about urban reforestation, sustainable development, and the personal benefits of green spaces in city planning through interactive simulation experience",
      },
      {
        relativePath:
          'projects/verdantia/verdantia-touchscreen-kiosk-building-selection-menu.jpg',
        alt: 'Touch kiosk interface showing comprehensive building selection menu with sustainable construction options and environmental impact indicators for museum visitors',
        caption: 'Touch kiosk building selection with sustainability metrics',
        detailedCaption:
          'Intuitive touch kiosk building selection interface designed for diverse museum audiences, featuring comprehensive sustainable construction options with clear environmental impact indicators, energy efficiency ratings, and educational information that helps visitors understand the relationship between building choices and urban environmental health',
      },
      {
        relativePath:
          'projects/verdantia/verdantia-touchscreen-kiosk-main-menu-actions-with-virtual-joystick.jpg',
        alt: 'Touch kiosk main menu interface with virtual joystick navigation controls and action buttons optimized for museum installation accessibility and user interaction',
        caption: 'Touch kiosk main menu with virtual navigation controls',
        detailedCaption:
          'Accessible touch kiosk main menu featuring virtual joystick navigation and intuitive action buttons designed specifically for museum installation use, accommodating diverse user capabilities and ensuring smooth interaction flow for visitors of all ages and technical backgrounds engaging with the environmental education experience',
      },
      {
        relativePath:
          'projects/verdantia/verdantia-touchscreen-kiosk-mission-selection-menu.jpg',
        alt: 'Mission selection interface showing educational challenges and learning objectives for progressive city building and environmental stewardship skill development',
        caption:
          'Mission system for progressive environmental education challenges',
        detailedCaption:
          'Structured mission selection system providing progressive environmental education challenges that guide museum visitors through increasingly complex urban planning scenarios, sustainable development objectives, and environmental stewardship skills, ensuring comprehensive learning outcomes and meaningful engagement with climate science concepts',
      },
      {
        relativePath:
          'projects/verdantia/verdantia-touchscreen-kiosk-screenshot-building-menu-for-eco-high-rise-building-with-building-metrics.jpg',
        alt: 'Detailed building information interface showing eco-friendly high-rise specifications with environmental metrics, energy efficiency data, and sustainability indicators',
        caption:
          'Detailed building metrics for eco-friendly high-rise construction',
        detailedCaption:
          'Comprehensive building information system showcasing eco-friendly high-rise specifications with detailed environmental metrics including energy efficiency ratings, carbon footprint data, sustainability indicators, and educational content about green building technologies, demonstrating how Verdantia integrates scientific accuracy with accessible learning',
      },
      {
        relativePath:
          'projects/verdantia/verdantia-touchscreen-kiosk-ui-city-metrics.jpg',
        alt: 'City metrics dashboard displaying real-time environmental data including temperature, pollution levels, citizen happiness, and sustainability scores for educational assessment',
        caption:
          'Real-time city metrics dashboard for environmental assessment',
        detailedCaption:
          'Advanced city metrics visualization system displaying real-time environmental data including temperature patterns from heat equation simulation, pollution levels, citizen happiness indices, and comprehensive sustainability scores, providing immediate feedback on urban planning decisions and demonstrating the complex relationships between city design and environmental health',
      },
    ],
    videos: [
      {
        relativePath:
          'projects/verdantia/Verdantia - Green City Builder _ Final Graduate Capstone Presentation.mp4',
        title: 'Graduate Capstone Final Presentation',
        type: 'final',
        caption:
          'Academic presentation of urban reforestation city builder game',
        detailedCaption:
          "Comprehensive graduate capstone presentation covering Verdantia's educational objectives, advanced heat equation implementation using Thomas Algorithm, museum installation design, environmental science integration, and the project's role in transforming climate change education through interactive city building and real-time environmental simulation",
      },
      {
        relativePath:
          'projects/verdantia/Verdantia _ Green City Builder Game (2024 Graduate Capstone)  Walk Through.mp4',
        title: 'Complete Game Walkthrough',
        type: 'demo',
        caption:
          'Full gameplay demonstration of museum installation city builder',
        detailedCaption:
          "Complete gameplay walkthrough showcasing Verdantia's touch kiosk interface, city building mechanics, real-time heat island simulation, environmental metrics visualization, mission system, and educational pop-up integration designed for museum audiences to learn about urban planning and sustainability through interactive experience",
      },
      {
        relativePath:
          'projects/verdantia/Arctice_Drone_Exhibit-touchscreen-kiosk-gameplay-inspiration-by-moment-factory.mp4',
        title: 'Arctic Drone Exhibit - Moment Factory Inspiration',
        type: 'inspiration',
        caption:
          'Moment Factory touchscreen kiosk design inspiration for museum installations',
        detailedCaption:
          "Inspirational reference showcasing Moment Factory's Arctic Drone exhibit with sophisticated touchscreen kiosk interface design, demonstrating professional museum installation standards, interactive experience design principles, and multi-modal engagement strategies that influenced Verdantia's development approach and user interface design philosophy",
      },
      {
        relativePath:
          'projects/verdantia/Charles_River_Infrastructure_Installation-inspiration-documentation.MOV.mp4',
        title: 'Charles River Infrastructure Installation Research',
        type: 'inspiration',
        caption:
          'Environmental infrastructure installation research and documentation',
        detailedCaption:
          "Research documentation of Charles River infrastructure installations exploring environmental monitoring systems, public engagement with urban environmental data, and real-world applications of environmental science communication that informed Verdantia's approach to making climate data personally meaningful and accessible through interactive visualization",
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
    overview: `Harvard Masters in Digital Media Design capstone project creating a museum installation city builder game focused on urban reforestation and climate education.

      Built in Unity with C#, featuring real-time heat island simulation using the Thomas Algorithm for scientifically accurate temperature modeling.

      The touch kiosk interface enables players to build sustainable cities while visualizing immediate environmental impacts through heat maps, pollution metrics, and citizen happiness indicators.

      The project transforms abstract climate concepts into personally meaningful experiences by demonstrating how green spaces directly affect urban livability.

      Designed for multi-modal museum engagement with educational popups for both active players and passive observers.`,

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
