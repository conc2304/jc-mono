import { ProjectData } from '@jc/ui-components';
import { getImageUrl, getResponsiveImageSet, getVideoUrl } from '@jc/utils';

export const gravityScavengerProject: ProjectData = {
  // =============================================================================
  // CORE PROJECT INFORMATION
  // =============================================================================
  id: 'gravity-scavenger-physics-space-game',
  projectName: 'Gravity Scavenger',
  projectSubtitle: 'Physics-Based Procedural Space Game',
  slug: 'gravity-scavenger',

  // =============================================================================
  // PROJECT BASICS
  // =============================================================================
  basics: {
    type: 'school',
    category: 'game-dev',
    subcategories: [
      '3d-modeling',
      '3d-animation',
      'creative-coding',
      'procedural-generation',
      'physics-simulation',
      'ui-ux',
    ],
    description:
      'Comprehensive 2.5D space exploration game featuring advanced physics simulation, procedural world generation, and real-time trajectory prediction using calculus and gravitational mechanics. Built in Unity with sophisticated AI systems, upgrade mechanics, and infinite scrolling gameplay.',
    context:
      'Harvard Extension School - GD50 Game Development Final Project (Spring 2024)',
  },

  // =============================================================================
  // TECHNICAL DETAILS
  // =============================================================================
  technical: {
    technologies: [
      'Unity',
      'C# Programming',
      'Unity Physics System',
      'Procedural Generation',
      "Newton's Universal Gravitation",
      'Calculus & Trigonometry Implementation',
      'Unity Shader Graph',
      'Unity UI Toolkit',
      'Custom AI Programming',
      'Audio Management Systems',
      'Unity ProBuilder',
      'Particle Effects',
      'Parallax Scrolling',
      'Real-time Physics Simulation',
      'Custom Material Shaders',
      'Singleton Pattern Implementation',
    ],
    timeline: {
      startDate: '2024-01', // Spring 2024 semester
      endDate: '2024-05',
      duration: 'Spring semester final project (4-5 months)',
    },
    myRole:
      'Solo Game Developer - Complete game design, programming, physics implementation, procedural generation systems, AI development, UI/UX design, audio integration',
    collaborators: [
      // Solo academic project - no collaborators mentioned
    ],
  },

  // =============================================================================
  // MEDIA ASSETS
  // =============================================================================
  media: {
    hero: {
      ...getResponsiveImageSet(
        'projects/gravity-scavenger/gravity-scavenger-gameplay-orbiting-with-pickups.png'
      ),
      alt: 'Spaceship performing orbital maneuvers around planet with physics-based trajectory visualization and collectible items using advanced gravitational mechanics',
      caption: 'Advanced orbital mechanics with trajectory prediction system',
      detailedCaption:
        'Sophisticated physics demonstration showcasing the trajectory prediction system using calculus and trigonometry implementation, where players must strategically use gravitational forces to navigate orbital paths while collecting resources, demonstrating educational value of mathematical concepts applied to engaging interactive gameplay',
    },
    thumbnail: {
      src: getImageUrl(
        'projects/gravity-scavenger/gravity-scavenger-gameplay-orbiting-with-pickups.png',
        'thumbnail'
      ),
      alt: 'Spaceship performing orbital maneuvers around planet with physics-based trajectory visualization and collectible items using advanced gravitational mechanics',
      caption: 'Advanced orbital mechanics with trajectory prediction system',
      detailedCaption:
        'Sophisticated physics demonstration showcasing the trajectory prediction system using calculus and trigonometry implementation, where players must strategically use gravitational forces to navigate orbital paths while collecting resources, demonstrating educational value of mathematical concepts applied to engaging interactive gameplay',
    },
    screenshots: [
      {
        relativePath:
          'projects/gravity-scavenger/gravity-scavenger-gameplay-orbiting-with-pickups.png',
        alt: 'Spacecraft orbiting planet with gravitational physics simulation showing trajectory prediction lines and resource pickup items scattered in space',
        caption:
          'Gravitational orbiting mechanics with resource collection gameplay',
        detailedCaption:
          "Core gameplay demonstration featuring realistic gravitational physics simulation where spacecraft orbits planetary bodies using Newton's universal gravitation law, with visible trajectory prediction lines showing calculated flight paths and scattered resource pickups requiring strategic navigation through complex gravitational fields",
      },
      {
        relativePath:
          'projects/gravity-scavenger/gravity-scavenger-orbiting-planet-with-pickups.png',
        alt: 'Spaceship performing orbital maneuvers around planet with physics-based trajectory visualization and collectible items using advanced gravitational mechanics',
        caption: 'Advanced orbital mechanics with trajectory prediction system',
        detailedCaption:
          'Sophisticated physics demonstration showcasing the trajectory prediction system using calculus and trigonometry implementation, where players must strategically use gravitational forces to navigate orbital paths while collecting resources, demonstrating educational value of mathematical concepts applied to engaging interactive gameplay',
      },
      {
        relativePath:
          'projects/gravity-scavenger/gravity-scavenger-pickup-item.png',
        alt: 'Close-up view of resource pickup item collection in space environment with particle effects and physics-based interaction systems',
        caption:
          'Resource collection with particle effects and physics interaction',
        detailedCaption:
          'Detailed view of the resource collection system featuring custom particle effects, physics-based interaction mechanics, and visual feedback systems that reward strategic navigation through gravitational fields, demonstrating the polished game systems integration and attention to user experience design',
      },
      {
        relativePath:
          'projects/gravity-scavenger/gravity-scavenger-pickups-fuel-parts-and-health.png',
        alt: 'Various resource types including fuel, ship parts, and health items scattered in space environment with distinct visual designs for gameplay clarity',
        caption: 'Diverse resource types with strategic collection mechanics',
        detailedCaption:
          'Comprehensive resource management system showcasing different pickup types including fuel, ship parts, and health items with distinct visual designs, supporting the upgrade system and persistent progression mechanics that encourage strategic exploration through procedurally generated infinite space environments',
      },
      {
        relativePath:
          'projects/gravity-scavenger/gravity-scavenger-ship-upgrade-center-ui.png',
        alt: 'Ship upgrade interface showing Unity UI Toolkit implementation with upgrade options, resource costs, and progression systems for spacecraft customization',
        caption: 'Comprehensive ship upgrade system with resource management',
        detailedCaption:
          'Advanced upgrade interface built with Unity UI Toolkit featuring comprehensive ship customization options, resource cost management, and persistent progression systems using singleton pattern for cross-scene state management, demonstrating sophisticated game architecture and player advancement mechanics',
      },
      {
        relativePath:
          'projects/gravity-scavenger/gravity-scavenger-shoot-asteroids.png',
        alt: 'Combat system showing spacecraft shooting asteroids with physics-based projectile trajectories influenced by gravitational fields in space environment',
        caption: 'Physics-based combat with gravitational projectile mechanics',
        detailedCaption:
          'Advanced combat system demonstration where projectile trajectories are influenced by gravitational fields, creating strategic gameplay that rewards understanding of physics mechanics, with asteroid destruction yielding resources and requiring tactical positioning to account for complex gravitational influences on weapon trajectories',
      },
      {
        relativePath:
          'projects/gravity-scavenger/gravity-scavenger-space-station-upgrade-station.png',
        alt: 'Space station upgrade facility showing procedurally generated structure with docking interface and comprehensive upgrade system integration',
        caption: 'Procedurally generated space station with upgrade facilities',
        detailedCaption:
          'Sophisticated space station system featuring procedural generation algorithms, docking mechanics, and comprehensive upgrade facility integration, demonstrating the chunk-based infinite world generation system that dynamically creates varied encounters and progression opportunities while maintaining efficient memory management',
      },
      {
        relativePath:
          'projects/gravity-scavenger/gravity-scavenger-start-screen.png',
        alt: 'Game start screen showing polished UI design with title graphics, navigation options, and space-themed visual presentation for physics-based game experience',
        caption: 'Polished game start screen with professional UI design',
        detailedCaption:
          'Professional game start screen showcasing polished visual design, comprehensive UI systems, and cohesive space-themed aesthetic that introduces players to the physics-based gameplay experience, demonstrating attention to user experience design and the educational game development approach combining academic rigor with engaging presentation',
      },
    ].map(({ relativePath, ...mediaItem }) => ({
      ...mediaItem,
      ...getResponsiveImageSet(relativePath),
      url: getImageUrl(relativePath, 'full'),
    })),
    videos: [
      {
        url: getVideoUrl(
          'projects/gravity-scavenger/Gravity%20Scavenger%20_%20GD50%20Final%20Project%20-%20Game%20Development.mp4'
        ),
        title: 'Gravity Scavenger Final Project Demo',
        type: 'demo',
        caption:
          'Complete gameplay demonstration showing physics mechanics, procedural generation, and upgrade systems',
      },
    ],
  },

  // =============================================================================
  // PROJECT LINKS
  // =============================================================================
  links: {
    liveDemo:
      'https://play.unity.com/en/games/f6872dc0-9da6-462f-b037-1d6f705c55d8/gravity-scavenger',
    repository: 'https://github.com/conc2304/gravity-scavenger',
    caseStudy: undefined,
    additionalLinks: [
      {
        title: 'Final Project Demo Video',
        url: 'https://youtu.be/Cs_P3tOuU4w',
        type: 'other',
      },
      {
        title: 'Play on Unity Cloud',
        url: 'https://play.unity.com/en/games/f6872dc0-9da6-462f-b037-1d6f705c55d8/gravity-scavenger',
        type: 'deployment',
      },
      {
        title: 'Unity Documentation',
        url: 'https://docs.unity3d.com/',
        type: 'documentation',
      },
    ],
  },

  // =============================================================================
  // PROJECT CONTENT & NARRATIVE
  // =============================================================================
  content: {
    overview: `Harvard Extension School GD50 final project showcasing Unity game development through a 2.5D space exploration game featuring realistic physics simulation and procedural world generation.

    Built in C# using Unity, the game implements Newton's law of universal gravitation for authentic orbital mechanics, real-time trajectory prediction using calculus and trigonometry, and an infinite chunk-based world generation system.

    Players navigate complex gravitational fields while collecting resources, upgrading spacecraft, and engaging physics-influenced combat with intelligent AI enemies.`,

    process: `**Game Design & Physics Research**: Conducted comprehensive research into physics-based game mechanics, studying classical games like Asteroids and modern titles like Spore and Gravitura for inspiration. Designed core gameplay loop centered around resource management, strategic use of gravitational physics, and progressive difficulty scaling through procedural generation.

**Mathematical Implementation & Trajectory System**: Implemented Newton's law of universal gravitation using rigorous mathematical calculations to create realistic planetary attraction forces. Developed sophisticated trajectory prediction system using physics simulation to forecast spaceship paths through complex gravitational fields, originally planning Runge-Kutta method implementation but successfully deploying Euler method for real-time performance.

**Procedural World Generation Architecture**: Designed and implemented chunk-based infinite world generation system enabling seamless exploration in all directions. Created sophisticated spawning algorithms for planets, asteroids, enemies, and pickups with dynamic difficulty scaling based on player experience points. Implemented efficient memory management through distance-based despawning and chunk loading/unloading systems.

**Advanced AI & Combat Systems**: Developed intelligent enemy AI with variable aggression and anxiety parameters creating diverse behavioral patterns. Implemented physics-based combat system where gravitational fields influence projectile trajectories and ship movements, enabling strategic gameplay that rewards understanding of underlying physics mechanics.

**Custom Shader Development & Visual Systems**: Created custom trajectory line shader using Unity Shader Graph with animated textures to visualize predicted flight paths. Implemented comprehensive visual effects including particle systems for explosions, parallax scrolling backgrounds for depth perception, and dynamic lighting systems for space environments.

**Comprehensive Game Systems Integration**: Built robust upgrade system using Unity UI Toolkit enabling ship customization through collected resources. Implemented persistent player progression system using singleton pattern for cross-scene state management. Created sophisticated audio management system with positional audio, dynamic music, and comprehensive sound effect integration.

**Performance Optimization & Polish**: Optimized rendering and physics calculations for smooth gameplay across different hardware configurations. Implemented efficient collision detection systems, distance-based level-of-detail management, and memory optimization for long play sessions. Created comprehensive user interface systems with accessibility considerations and intuitive control schemes.`,

    results: `**Advanced Physics Simulation Achievement**:
• Successfully implemented Newton's law of universal gravitation creating realistic planetary attraction mechanics
• Developed real-time trajectory prediction system using calculus and physics simulation for educational gameplay visualization
• Created sophisticated physics-based combat system where gravitational fields influence tactical decision-making
• Achieved stable performance while simulating multiple gravitational bodies and complex physics interactions simultaneously

**Procedural Generation & Technical Architecture**:
• Built comprehensive chunk-based infinite world generation system enabling seamless exploration in all directions
• Implemented dynamic difficulty scaling system that adjusts challenge complexity based on player progression and experience points
• Created efficient memory management system handling unlimited world generation without performance degradation
• Developed sophisticated spawning algorithms creating diverse planetary configurations and encounter variety

**Game Development Mastery & System Integration**:
• Successfully coordinated multiple complex game systems including AI, physics, progression, audio, and user interface
• Implemented comprehensive upgrade system with persistent progression using singleton pattern for cross-scene state management
• Created sophisticated enemy AI with variable behavioral parameters producing diverse and engaging combat encounters
• Built robust audio management system with positional audio, dynamic music transitions, and comprehensive sound effect integration

**Educational Technology & Mathematical Application**:
• Transformed complex mathematical concepts (calculus, trigonometry, gravitational physics) into intuitive and engaging gameplay mechanics
• Created educational tool demonstrating practical applications of physics and mathematics in interactive entertainment
• Designed gameplay that rewards understanding of underlying mathematical concepts while remaining accessible to diverse audiences
• Established foundation for educational game development combining rigorous academic content with engaging interactive experiences`,

    challenges: `**Advanced Physics Implementation & Real-time Performance**: Implementing Newton's law of universal gravitation for multiple simultaneous gravitational bodies while maintaining stable frame rates required extensive optimization and mathematical precision. Balancing scientific accuracy with gameplay responsiveness demanded careful parameter tuning and performance profiling throughout development.

**Procedural Generation Complexity & World Coherence**: Creating infinite world generation that maintains engaging gameplay variety while ensuring coherent difficulty progression required sophisticated algorithm design. Balancing randomness with structured progression, managing memory efficiently for unlimited exploration, and ensuring consistent performance across diverse generated content presented ongoing architectural challenges.

**Unity Engine Mastery & System Architecture**: Learning Unity's comprehensive toolset including physics systems, UI Toolkit, Shader Graph, and audio management while building complex game architecture required extensive documentation research and experimentation. Coordinating multiple interdependent systems while maintaining clean, maintainable code architecture demanded careful planning and iterative refinement.

**Mathematical Algorithm Implementation & Optimization**: Translating complex mathematical concepts (calculus, trigonometry, physics equations) into efficient game code required bridging theoretical knowledge with practical programming implementation. Originally planning Runge-Kutta method for trajectory calculation but successfully adapting to Euler method for performance reasons demonstrated adaptive problem-solving and pragmatic decision-making.

**Game Balance & Physics-Based Gameplay Design**: Creating engaging gameplay that leverages realistic physics while remaining accessible to players unfamiliar with advanced mathematics required extensive playtesting and iterative design refinement. Balancing educational value with entertainment appeal while ensuring physics mechanics enhance rather than frustrate gameplay presented ongoing design challenges.

**Comprehensive Feature Integration & Polish**: Coordinating multiple ambitious features including AI systems, upgrade mechanics, audio management, visual effects, and user interface design within academic project timeline required careful scope management and feature prioritization. Ensuring all systems worked cohesively while maintaining high polish standards demanded efficient development workflow and testing processes.

**Cross-Platform Deployment & Optimization**: Preparing the game for Unity Cloud deployment while ensuring consistent performance across different hardware configurations required platform-specific optimization and testing. Managing build processes, asset optimization, and performance profiling for web deployment presented additional technical challenges beyond core game development.`,

    learnings: `**Advanced Game Physics & Mathematical Programming**: This project provided comprehensive experience implementing real-world physics concepts in interactive applications, learning how to translate mathematical theory into practical game mechanics. Understanding Newton's gravitational laws, trajectory calculation methods, and real-time physics simulation became valuable knowledge applicable to any physics-based application development.

**Unity Engine Mastery & Professional Game Development**: Working extensively with Unity's advanced features including physics systems, Shader Graph, UI Toolkit, and audio management taught essential skills for professional game development. Learning to architect complex game systems while maintaining performance and maintainability became foundational knowledge for any Unity-based development work.

**Procedural Generation & Algorithmic Design**: Implementing infinite world generation using chunk-based systems taught crucial lessons about algorithmic content creation, memory management, and performance optimization in procedural applications. Understanding how to create engaging variety through systematic generation became applicable to any project requiring dynamic content creation or data-driven experiences.

**Game System Architecture & Design Patterns**: Coordinating multiple interdependent game systems taught essential lessons about software architecture, singleton pattern implementation, and cross-system communication. Learning to design maintainable, scalable game architecture became valuable knowledge for any complex software development project requiring system coordination.

**AI Programming & Behavioral Systems**: Developing enemy AI with variable behavioral parameters taught important concepts about artificial intelligence programming, state management, and creating engaging non-player character behaviors. Understanding how to create diverse, realistic AI behaviors became applicable to any application requiring intelligent system responses or automated decision-making.

**Educational Game Design & Learning Through Play**: Creating gameplay that successfully teaches complex mathematical concepts while remaining entertaining taught valuable lessons about educational technology design and learning experience creation. Understanding how to make abstract concepts tangible through interactive experiences became applicable to training applications, educational tools, and knowledge transfer systems.

**Performance Optimization & Resource Management**: Optimizing complex game systems for stable performance while handling unlimited procedural content taught crucial lessons about memory management, rendering optimization, and efficient algorithm implementation. These performance engineering skills became essential for any application requiring real-time processing or resource-intensive computation.

**Audio-Visual Design & User Experience**: Integrating comprehensive audio systems, visual effects, and user interface design taught important lessons about creating cohesive, polished user experiences. Understanding how to coordinate multiple sensory elements to create immersive experiences became applicable to any multimedia application or interactive experience design.`,
  },

  // =============================================================================
  // PROJECT METADATA
  // =============================================================================
  metadata: {
    featured: true,
    status: 'live',
    lastUpdated: '2024-05',
    tags: [
      'unity-game-development',
      'physics-simulation',
      'procedural-generation',
      'calculus-implementation',
      'gravitational-mechanics',
      'real-time-trajectory-prediction',
      'advanced-ai-programming',
      'custom-shader-development',
      'infinite-world-generation',
      'upgrade-systems',
      'unity-ui-toolkit',
      'audio-management',
      'performance-optimization',
      'educational-gaming',
      'space-exploration-game',
      'mathematical-programming',
      'singleton-pattern',
      'chunk-based-loading',
      'particle-effects',
      'harvard-extension-school',
    ],
    difficulty: 'advanced',
  },
};
