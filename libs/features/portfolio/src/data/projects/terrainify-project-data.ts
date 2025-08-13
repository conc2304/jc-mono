import { ProjectData } from '@jc/ui-components';
import { getImageUrl, getResponsiveImageSet, getVideoUrl } from '@jc/utils';

export const terrainifyProject: ProjectData = {
  // =============================================================================
  // CORE PROJECT INFORMATION
  // =============================================================================
  id: 'terrainify-procedural-terrain-generator',
  projectName: 'Terrainify: Procedural Terrain Generator with BPM Animation',
  slug: 'terrainify',

  // =============================================================================
  // PROJECT BASICS
  // =============================================================================
  basics: {
    type: 'personal',
    category: '3d-modeling',
    subcategories: [
      'creative-coding',
      '3d-animation',
      'performance',
      'motion-graphics',
      'procedural-generation',
      'audio-visual-sync',
    ],
    description:
      'Advanced Maya Python plugin for procedural terrain generation featuring custom shading networks, displacement-based 3D geometry creation, and innovative BPM-synchronized animation system for music-reactive visual performances and motion graphics workflows.',
    context: 'Personal creative coding project - Maya plugin development',
  },

  // =============================================================================
  // TECHNICAL DETAILS
  // =============================================================================
  technical: {
    technologies: [
      'Python',
      'Maya API',
      'Maya Python Scripting',
      'Maya Shading Networks',
      'Displacement Shaders',
      'Volume Noise Generation',
      '3D Texture Processing',
      'Procedural Animation',
      'Custom UI Development',
      'BPM Analysis & Sync',
      'Keyframe Animation',
      '3D Geometry Manipulation',
      'Maya Node Networks',
      'MEL Integration',
    ],
    timeline: {
      startDate: undefined, // Personal project - would need clarification
      endDate: undefined,
      duration: 'Ongoing personal tool development',
    },
    myRole:
      'Solo Developer - Maya plugin architecture, Python scripting, procedural generation algorithms, BPM synchronization system, custom UI development',
    collaborators: [
      // Solo project - no collaborators mentioned
    ],
  },

  // =============================================================================
  // MEDIA ASSETS
  // =============================================================================
  media: {
    thumbnail: {
      relativePath:
        'projects/terrainify/terrainify-terrain-generation-render-result-mountains-with-lakes.png',
      url: getImageUrl(
        'projects/terrainify/terrainify-terrain-generation-render-result-mountains-with-lakes.png',
        'full'
      ),
      ...getResponsiveImageSet(
        'projects/terrainify/terrainify-terrain-generation-render-result-mountains-with-lakes.png'
      ),
      alt: 'Final rendered terrain showing detailed mountains and lakes created through procedural generation with displacement mapping and custom material shading systems',
      caption:
        'High-quality rendered terrain with mountains and water features',
      detailedCaption:
        "Sophisticated render result showcasing the final output of Terrainify's procedural generation system, featuring detailed mountainous terrain with realistic water features, demonstrating the complex shading network integration, displacement mapping techniques, and material assignment systems that create production-quality 3D landscapes for motion graphics and visual performance applications",
    },
    screenshots: [
      {
        relativePath:
          'projects/terrainify/terrainify-noise-based-terrain-generated-over-2d-plane-object.png',
        alt: 'Procedural terrain generation showing volume noise displacement applied to 2D plane object creating realistic 3D mountainous landscape using Maya shading networks',
        caption:
          'Procedural terrain generation using volume noise displacement',
        detailedCaption:
          'Advanced procedural terrain system demonstrating volume noise generation applied through displacement shaders to transform 2D plane geometry into complex 3D mountainous landscapes, showcasing automated shading network creation, 3D texture processing, and sophisticated Maya API programming for procedural generation workflows',
      },
      {
        relativePath:
          'projects/terrainify/terrainify-terrain-generation-render-result-mountains-with-lakes.png',
        alt: 'Final rendered terrain showing detailed mountains and lakes created through procedural generation with displacement mapping and custom material shading systems',
        caption:
          'High-quality rendered terrain with mountains and water features',
        detailedCaption:
          "Sophisticated render result showcasing the final output of Terrainify's procedural generation system, featuring detailed mountainous terrain with realistic water features, demonstrating the complex shading network integration, displacement mapping techniques, and material assignment systems that create production-quality 3D landscapes for motion graphics and visual performance applications",
      },
      {
        relativePath:
          'projects/terrainify/terrainify-terrain-generator-ui-modal-parameter-settings.png',
        alt: 'Custom Maya UI panel showing Terrainify plugin interface with terrain generation parameters, BPM settings, and real-time control options for procedural landscape creation',
        caption: 'Custom Maya plugin interface with terrain and BPM parameters',
        detailedCaption:
          "Advanced custom UI development showcasing Terrainify's native Maya interface panel with comprehensive parameter controls for terrain generation, BPM synchronization settings, animation timing configuration, and real-time adjustment capabilities, demonstrating professional Maya plugin development with intuitive workflow integration and immediate visual feedback systems",
      },
    ].map((mediaItem) => ({
      ...mediaItem,
      ...getResponsiveImageSet(mediaItem.relativePath),
      url: getImageUrl(mediaItem.relativePath, 'full'),
    })),
    videos: [
      {
        url: getVideoUrl(
          'projects/terrainify/Terrainify-Python-Scripting-Final-Project-Demo.mp4'
        ),
        caption:
          'Complete Maya plugin demonstration with BPM-synchronized terrain animation',
        detailedCaption:
          'Comprehensive walkthrough of Terrainify showcasing advanced Maya Python API programming for procedural terrain generation, custom shading network automation with displacement shaders and volume noise, innovative BPM analysis system creating music-synchronized animation keyframes, and real-time 3D geometry manipulation for audio-visual performance applications',
      },
    ],
  },

  // =============================================================================
  // PROJECT LINKS
  // =============================================================================
  links: {
    liveDemo: undefined, // Maya plugin - no web demo
    repository: 'https://github.com/conc2304/terrainify',
    caseStudy: undefined,
    additionalLinks: [
      {
        title: 'Maya Python API Documentation',
        url: 'https://download.autodesk.com/us/maya/2011help/CommandsPython/',
        type: 'documentation',
      },
      {
        title: 'Maya Displacement Shaders Guide',
        url: 'https://download.autodesk.com/global/docs/maya2014/en_us/files/Surface_Relief__Displacement_maps.htm',
        type: 'documentation',
      },
    ],
  },

  // =============================================================================
  // PROJECT CONTENT & NARRATIVE
  // =============================================================================
  content: {
    overview: `Terrainify is a sophisticated Maya Python plugin that combines procedural generation techniques with innovative audio-visual synchronization to create dynamic, music-reactive terrain systems. The plugin demonstrates advanced Maya API programming, custom shading network development, and creative application of BPM analysis for real-time animation control.

The project addresses the challenge of creating responsive, animated terrain systems for motion graphics and visual performance applications. Rather than static terrain generation, Terrainify introduces a novel BPM synchronization system that automatically generates animation keyframes based on musical timing, enabling terrain that pulses, scales, and moves in perfect sync with audio. This creates powerful tools for VJ performance, music visualization, and motion graphics workflows.

Built entirely in Python using Maya's comprehensive API, the plugin creates complex shading networks including displacement shaders, volume noise generators, and 3D placement controls. The procedural approach enables infinite terrain variations while the BPM animation system transforms static 3D geometry into dynamic, performative visual elements that respond to musical structure and timing.`,

    process: `**Maya API Research & Plugin Architecture**: Developed comprehensive understanding of Maya's Python API, particularly focusing on shading node creation, material assignment, and custom UI development. Researched displacement shader workflows and 3D texture processing to establish technical foundation for procedural terrain generation.

**Procedural Generation System Design**: Implemented sophisticated shading network architecture using Maya's node-based system, including displacement shaders for geometry modification, volume noise generators for height mapping, and ramp nodes for terrain colorization. Created automated node connection system enabling consistent terrain generation with user-defined parameters.

**BPM Analysis & Animation Framework**: Developed innovative BPM synchronization system that analyzes musical timing parameters and automatically generates corresponding animation keyframes. Implemented linear keyframe tangent system and continuous terrain movement loops, creating seamless integration between audio timing and visual motion.

**Custom UI Development**: Built native Maya UI panel using Python GUI frameworks, enabling intuitive parameter control for terrain generation and BPM configuration. Designed interface supporting real-time parameter adjustment and immediate visual feedback within Maya's viewport system.

**3D Geometry Manipulation & Animation**: Implemented automated timeline management system that adjusts playback ranges based on BPM parameters, sets animation start/end times, and automatically selects animated objects for immediate keyframe visibility. Created displacement scaling system synchronized to musical beats.

**Modular Component Architecture**: Designed extensible system supporting future enhancements including different 3D primitive types, terrain presets (mountains, deserts, tundras), and standalone BPM service for applying music synchronization to arbitrary Maya attributes beyond terrain applications.`,

    results: `**Advanced Maya Plugin Development**:
• Successfully created production-ready Maya plugin using Python API, demonstrating mastery of 3D software extension development
• Implemented complex shading network automation with displacement shaders, volume noise, and 3D texture placement systems
• Developed custom UI integration within Maya's interface, providing intuitive parameter control and real-time visual feedback
• Created robust node connection system enabling consistent procedural terrain generation with user-defined parameters

**Innovative BPM Synchronization Technology**:
• Pioneered novel approach to audio-visual synchronization through automated BPM analysis and keyframe generation
• Implemented dynamic animation system that scales displacement on musical beats and creates continuous terrain movement loops
• Developed timeline management automation adjusting playback ranges and animation timing based on musical parameters
• Created extensible BPM framework applicable to any Maya attribute, enabling music-synchronized animation across diverse 3D elements

**Procedural Generation & 3D Graphics Programming**:
• Built sophisticated procedural terrain system using volume noise generation and displacement mapping techniques
• Implemented real-time 3D geometry manipulation enabling dynamic terrain modification based on animation parameters
• Created efficient material assignment and shading network management system supporting complex 3D texture processing
• Developed modular architecture supporting future terrain type presets and advanced procedural generation features

**Creative Technology & Performance Tools**:
• Transformed static 3D modeling workflows into dynamic, music-reactive visual performance capabilities
• Created innovative tools for VJ performance, motion graphics, and audio-visual art applications
• Demonstrated practical application of programming skills to creative industry workflows and live performance contexts
• Established foundation for advanced audio-visual synchronization tools extending beyond terrain generation applications`,

    challenges: `**Maya API Complexity & Documentation**: Learning Maya's extensive Python API required navigating complex documentation and understanding the intricate relationships between different node types, shading networks, and animation systems. Mastering the Maya-specific approaches to UI development, node creation, and attribute manipulation demanded extensive experimentation and research.

**Shading Network Architecture & Node Management**: Creating automated shading networks with proper node connections required deep understanding of Maya's material system, displacement shader workflows, and 3D texture processing. Ensuring reliable node creation, connection, and cleanup while maintaining performance demanded careful architecture planning and error handling.

**BPM Analysis & Real-Time Synchronization**: Developing accurate BPM analysis and translating musical timing into 3D animation keyframes required researching audio analysis techniques and creating robust timing calculation systems. Ensuring precise synchronization between audio parameters and visual animation while maintaining smooth performance presented ongoing technical challenges.

**3D Geometry Manipulation & Performance**: Implementing real-time displacement and terrain modification while maintaining Maya's viewport performance required optimization of geometry processing and animation systems. Balancing visual complexity with real-time responsiveness, particularly for large terrain meshes, demanded careful performance engineering.

**Custom UI Integration & User Experience**: Creating intuitive UI panels that integrate seamlessly with Maya's existing interface required learning Maya's specific GUI frameworks and design patterns. Designing user-friendly parameter controls that provide immediate visual feedback while maintaining professional workflow integration presented ongoing UX challenges.

**Cross-Platform Compatibility & Installation**: Ensuring the plugin works reliably across different Maya versions and operating systems required addressing path management, dependency handling, and installation complexity. Creating clear installation procedures and handling different system configurations demanded thorough testing and documentation.

**Feature Scope & Extensibility Planning**: Balancing immediate functionality with future extensibility required careful architecture decisions around modularity, code organization, and feature planning. Designing systems that could support planned enhancements while maintaining current functionality stability presented ongoing development challenges.`,

    learnings: `**Advanced 3D Software Development**: This project provided comprehensive experience in professional 3D software plugin development, learning how to extend industry-standard tools like Maya through Python API programming. Understanding how to work within complex software ecosystems while maintaining stability and performance became essential knowledge for technical roles in the 3D graphics industry.

**Procedural Generation & Algorithmic Art**: Implementing procedural terrain generation taught valuable lessons about algorithmic approaches to creative content generation, noise functions, and parametric design systems. These procedural thinking skills became applicable to any project requiring algorithmic content creation or systematic approach to creative problem-solving.

**Audio-Visual Synchronization Technology**: Developing BPM analysis and music synchronization systems provided insights into real-time audio processing, timing analysis, and the technical challenges of creating responsive audio-visual experiences. This knowledge became relevant to interactive media, live performance technology, and multimedia application development.

**Maya API & Professional 3D Workflows**: Mastering Maya's Python API taught essential lessons about professional 3D production pipelines, industry-standard workflows, and the technical infrastructure supporting animation and VFX production. Understanding how professionals extend and customize their tools became valuable knowledge for technical roles in creative industries.

**Custom UI Development & Tool Creation**: Building custom interfaces within existing software environments taught important lessons about user experience design within constrained contexts, workflow integration, and creating tools that enhance rather than disrupt existing professional practices. These UI development skills became applicable to any tool or extension development.

**Performance Optimization in Graphics Applications**: Working with real-time 3D graphics and animation systems taught crucial lessons about performance optimization, memory management, and maintaining responsiveness in graphics-intensive applications. These optimization skills became essential for any application involving complex visual processing or real-time rendering.

**Creative Technology & Artistic Tool Development**: Creating tools specifically for creative and performance applications highlighted the intersection of technical development with artistic practice. Understanding how to build technology that enhances creative expression became valuable for roles in creative technology, interactive media, and digital art tool development.

**Modular Software Architecture**: Designing extensible plugin systems taught important lessons about code organization, feature planning, and creating software that can grow and evolve over time. These architectural thinking skills became applicable to any software development project requiring long-term maintainability and feature expansion.`,
  },

  // =============================================================================
  // PROJECT METADATA
  // =============================================================================
  metadata: {
    featured: true,
    status: 'live',
    lastUpdated: undefined, // Would need clarification from user
    tags: [
      'maya-plugin-development',
      'python-scripting',
      'procedural-generation',
      'audio-visual-synchronization',
      'bpm-analysis',
      'displacement-shaders',
      '3d-animation',
      'custom-ui-development',
      'maya-api',
      'volume-noise',
      'terrain-generation',
      'music-visualization',
      'motion-graphics',
      'vj-performance-tools',
      'real-time-graphics',
      'shading-networks',
      'creative-coding',
      'performance-optimization',
      'modular-architecture',
      '3d-graphics-programming',
    ],
    difficulty: 'advanced',
  },
};
