import { ProjectData } from '../../components';

export const solarThermalSimulationProject: ProjectData = {
  // Core identification
  id: 'solar-thermal-system-simulator',
  projectName: 'Solar Thermal System Simulator',
  projectSubtitle: 'Interactive 3D Physics Simulation of Solar Heating Systems',
  slug: 'solar-thermal-system-simulator',

  // Basic information
  basics: {
    type: 'personal',
    category: '3d-animation',
    subcategories: [
      'web',
      'data-visualization',
      'creative-coding',
      'educational',
    ],

    description:
      'Real-time 3D web application simulating solar thermal heating systems with accurate thermodynamic physics and interactive visualization',
    context:
      'Personal educational project exploring the intersection of physics simulation, 3D graphics, and web technologies',
  },

  // Technical details
  technical: {
    technologies: [
      // Frontend & Framework
      'React 19',
      'TypeScript',
      'Vite',

      // 3D Graphics
      'Three.js',
      'React Three Fiber',
      '@react-three/drei',
      '@react-three/postprocessing',

      // Visualization & UI
      'D3.js',
      'Theme UI',
      'Emotion (CSS-in-JS)',

      // Testing & Quality
      'Jest',
      'Testing Library',
      'Storybook',
      'ESLint',
      'Prettier',

      // Additional
      'Lucide React',
      'Perlin Noise',
      'React Helmet',
    ],
    timeline: {
      duration: 'ongoing',
    },
    myRole:
      'Full-stack developer - Architecture, physics engine implementation, 3D visualization, UI/UX design',
  },

  // Media assets
  media: {
    hero: {
      relativePath:
        'projects/solar-thermal-simulation/solar-thermal-3d-scene-dark-mode.jpg', // Update with actual path
      alt: '3D rendered solar thermal heating system showing blue solar panel, curved pipes, pump valve, and cylindrical storage tank with temperature gradient visualization against dark background',
      caption:
        'Interactive 3D visualization of a complete solar thermal heating system with real-time physics simulation',
      detailedCaption:
        "The main 3D scene rendered in dark mode, displaying the complete solar thermal system architecture. A blue solar panel collects energy from the simulated sun (yellow sphere), transferring heat through curved blue pipes via a pump (brass valve component) to a cylindrical storage tank. The tank's color gradient transitions from deep purple (cooler) at the bottom to bright pink (warmer) at the top, visualizing thermal stratification in real-time. The system is rendered using Three.js and React Three Fiber with WebGL, demonstrating the intersection of accurate physics modeling and immersive 3D visualization.",
    },
    screenshots: [
      {
        relativePath:
          'projects/solar-thermal-simulation/solar-thermal-3d-scene-dark-mode.jpg', // Update with actual path
        alt: '3D rendered solar thermal heating system showing blue solar panel, curved pipes, pump valve, and cylindrical storage tank with temperature gradient visualization against dark background',
        caption:
          'Interactive 3D visualization of a complete solar thermal heating system with real-time physics simulation',
        detailedCaption:
          "The main 3D scene rendered in dark mode, displaying the complete solar thermal system architecture. A blue solar panel collects energy from the simulated sun (yellow sphere), transferring heat through curved blue pipes via a pump (brass valve component) to a cylindrical storage tank. The tank's color gradient transitions from deep purple (cooler) at the bottom to bright pink (warmer) at the top, visualizing thermal stratification in real-time. The system is rendered using Three.js and React Three Fiber with WebGL, demonstrating the intersection of accurate physics modeling and immersive 3D visualization.",
      },
      {
        relativePath:
          'projects/solar-thermal-simulation/solar-thermal-system-dashboard.jpg',
        alt: 'Solar thermal simulator dashboard in light mode showing 3D system with green solar panel, blue pipes, red storage tank, and control panel displaying running status.',
        caption:
          'Full application interface with real-time simulation controls and performance metrics',
        detailedCaption:
          'The complete application dashboard rendered in light mode, showcasing the integrated simulation environment. The 3D scene displays the solar thermal system from an alternative angle with a sage green solar panel, blue piping system with pump valves, and a storage tank exhibiting a red-to-black temperature gradient indicating heat distribution. Below the 3D viewport, the control panel displays live simulation metrics and playback controls, allowing users to monitor and control the simulation in real-time.',
      },
      {
        relativePath:
          'projects/solar-thermal-simulation/solar-thermal-system-ui-panel.jpg',
        alt: 'Simulation controls panel showing ambient temperature slider set to 20°C, water as working fluid, auto pump mode, red reset button, and system metrics displaying tank temperature, power transfer, efficiency, pump status, solar intensity, and energy values',
        caption:
          'Interactive control panel for adjusting simulation parameters and monitoring real-time system performance',
        detailedCaption:
          "The application's control interface displaying two main sections: Simulation Controls and System Metrics. The controls section allows users to adjust ambient temperature via slider (set to 20°C), select working fluid type (Water), and configure pump operation mode (Auto), with a prominent red reset button. The System Metrics section provides comprehensive real-time data including tank and panel temperatures, power transfer rates, system efficiency percentage, pump status, solar intensity, stored and transferred energy in megajoules, total heat loss, and temperature delta. A chart icon in the top right suggests expandable data visualization options.",
      },
      {
        relativePath:
          'projects/solar-thermal-simulation/solar-thermal-diagram.jpg',
        alt: 'Schematic diagram of solar thermal heating system showing sun, solar panel with internal tubes, pump, connecting pipes, and cylindrical storage tank with labels for each component',
        caption:
          'System architecture diagram illustrating the flow of heat energy through the solar thermal components',
        detailedCaption:
          "A simplified schematic representation of the solar thermal system architecture. The diagram shows the complete energy flow path: solar radiation (represented by a yellow sun icon) strikes the solar panel containing internal fluid tubes, transferring heat to the working fluid. The heated fluid is circulated by a pump through a closed-loop piping system (shown in tan/gold) to a cylindrical storage tank where thermal energy is stored. The storage tank displays a gradient from light pink to darker purple, indicating thermal stratification. This 2D diagram complements the 3D visualization by clearly illustrating the system's functional components and energy transfer pathway.",
      },
    ],
    videos: [
      {
        relativePath:
          'projects/solar-thermal-simulation/solar-thermal-demo-video_optimized.mp4',
        title: 'Brief Solar Thermal Simulator Demo',
        type: 'demo',
        caption:
          'Real-time solar thermal simulation showing dynamic temperature changes, fluid flow animation, and system performance metrics over a full day cycle',
        detailedCaption:
          "Interactive demonstration of the solar thermal simulator running through an accelerated day-night cycle. The 3D system responds to changing solar intensity with the storage tank's color gradient dynamically reflecting temperature changes and thermal stratification. Animated particle effects visualize fluid circulation through the pipes, while the control panel displays live metrics including power transfer rates, system efficiency, and stored energy, demonstrating the practical physics of solar thermal heating systems.",
      },
    ],
  },

  // Links
  links: {
    liveDemo: 'https://conc2304.github.io/solar-thermal-system-simulator/',
    repository: 'https://github.com/conc2304/solar-thermal-system-simulator',
    additionalLinks: [
      {
        title: 'Storybook Component Library',
        url: 'https://conc2304.github.io/solar-thermal-system-simulator/storybook',
        type: 'documentation',
      },
    ],
  },

  // Content
  content: {
    overview: [
      'An interactive 3D web application that simulates a complete solar thermal heating system with real-time physics modeling and visualization.',
      'The simulation accurately models heat collection by solar panels, thermal storage in an insulated tank, and fluid circulation through a system of pipes and a pump.',
      'Built with React Three Fiber and Three.js, the application provides an immersive 3D view with temperature-based color gradients, animated fluid flow, and dynamic lighting that follows a simulated sun position.',
      'Real-time performance metrics are displayed alongside the 3D visualization, showing energy transfer rates, system efficiency, temperatures, and stored energy.',
    ],

    process: [
      'Architected using Atomic Design principles with a clear separation between UI components (atoms/molecules/organisms) and simulation logic.',
      'Implemented an object-oriented physics engine where each physical component (solar panel, storage tank, pump, pipes) extends a base entity class with standardized interfaces for temperature state and fluid flow.',
      'Developed thermodynamic calculations for heat transfer, energy storage, and fluid dynamics based on real-world physics equations and material properties.',
      "Synchronized 3D rendering with physics updates using React Three Fiber's useFrame hook, creating smooth real-time visualization at 60fps.",
      'Created a flexible theming system with Theme UI supporting light/dark modes and responsive breakpoints.',
      'Built comprehensive component documentation and testing infrastructure using Storybook and Jest.',
    ],

    results: [
      'Successfully created an educational tool that makes complex thermodynamic concepts accessible through interactive visualization.',
      'Achieved smooth 60fps performance with real-time physics calculations and 3D rendering.',
      'Implemented accurate thermal modeling including heat loss through insulation, solar radiation absorption, and thermal stratification in the storage tank.',
      'Created a fully responsive application that works across desktop and mobile devices.',
      'Established a maintainable codebase with 100% TypeScript coverage, comprehensive testing, and modular component architecture.',
    ],

    challenges: [
      'Optimizing performance for real-time physics calculations running every frame while maintaining smooth 3D rendering.',
      'Implementing accurate thermodynamic models that balance realism with computational efficiency.',
      'Visualizing temperature gradients across 3D geometry in an intuitive and visually appealing way.',
      'Synchronizing multiple animation loops (physics updates, 3D rendering, UI updates) without performance degradation.',
      'Creating a color gradient system that effectively communicates temperature differences across narrow ranges (e.g., 20-30°C).',
    ],

    learnings: [
      'Gained deep understanding of thermodynamics, heat transfer equations, and energy system modeling.',
      "Mastered React Three Fiber and the integration of Three.js with React's component lifecycle.",
      'Learned effective patterns for managing real-time simulations in web applications, including throttling and optimization techniques.',
      'Developed expertise in 3D visualization techniques, including procedural color gradients, particle systems for fluid flow, and post-processing effects.',
      'Understood the importance of architectural decisions in managing complex state across physics simulation and UI layers.',
      'Learned to balance visual fidelity with performance constraints in browser-based 3D applications.',
    ],
  },

  // Metadata
  metadata: {
    featured: true,
    status: 'in-progress',
    lastUpdated: '2025-11-06',
    tags: [
      'physics-simulation',
      'thermodynamics',
      'solar-energy',
      'educational',
      '3d-visualization',
      'real-time',
      'interactive',
      'webgl',
      'react',
      'typescript',
      'three-js',
      'data-viz',
    ],
    difficulty: 'advanced',
  },
};
