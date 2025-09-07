import { ProjectData } from '@jc/ui-components';
import { getImageUrl, getResponsiveImageSet, getVideoUrl } from '@jc/utils';

export const vyzbyProject: ProjectData = {
  // =============================================================================
  // CORE PROJECT INFORMATION
  // =============================================================================
  id: 'vyzby-interactive-audio-visualizer',
  projectName: 'VYZBY',
  projectSubtitle: 'Interactive Audio Visualizer & Digital Playground',
  slug: 'vyzby',

  // =============================================================================
  // PROJECT BASICS
  // =============================================================================
  basics: {
    type: 'personal',
    category: 'creative-coding',
    subcategories: [
      'web',
      'framework-development',
      'developer-tools',
      'data-visualization',
      'ui-ux',
      'api-design',
    ],
    description:
      'A sophisticated web framework for real-time parameter manipulation and interaction control in creative coding sketches (p5.js), solving the workflow friction of editing code to adjust visual parameters by providing live UI controls, MIDI integration, audio reactivity, and webcam tracking APIs.',
    context:
      'Personal framework development project - Solving creative coding workflow inefficiencies',
  },

  // =============================================================================
  // TECHNICAL DETAILS
  // =============================================================================
  technical: {
    technologies: [
      'Vue.js',
      'Vuetify',
      'p5.js',
      'JavaScript (ES6+)',
      'Web Audio API',
      'TensorFlow.js',
      '@tensorflow-models/posenet',
      'MIDI Web API',
      'WebRTC (Webcam)',
      'HTML5 Canvas',
      'SCSS/CSS3',
      'Netlify (Deployment)',
      'npm/Node.js',
      'Vue Knob Control',
      'NoUI Slider',
      'Material Design Icons',
    ],
    timeline: {
      startDate: undefined, // Early project - would need clarification
      endDate: undefined,
      duration: 'Ongoing personal project',
    },
    myRole:
      'Framework Architect & Lead Developer - Designed and built comprehensive creative coding framework, API architecture, multi-modal interaction systems, and developer experience optimization',
    collaborators: [
      // Solo project - no collaborators mentioned
    ],
  },

  // =============================================================================
  // MEDIA ASSETS
  // =============================================================================
  media: {
    thumbnail: {
      ...getResponsiveImageSet(
        'projects/vyzby/vyzby-screenshot-tunnel-hero.png'
      ),
      alt: 'VYZBY hero image featuring immersive tunnel visualization with dynamic lighting and perspective effects demonstrating advanced creative coding capabilities',
      caption: 'Immersive tunnel visualization hero demonstration',
      detailedCaption:
        "Striking tunnel visualization serving as VYZBY's hero demonstration, featuring immersive perspective effects, dynamic lighting, and complex visual algorithms that showcase the framework's potential for creating compelling visual experiences through creative coding and real-time parameter manipulation",
    },
    hero: {
      src: getImageUrl(
        'projects/vyzby/vyzby-screenshot-tunnel-hero.png',
        'thumbnail'
      ),
      alt: 'VYZBY hero image featuring immersive tunnel visualization with dynamic lighting and perspective effects demonstrating advanced creative coding capabilities',
      caption: 'Immersive tunnel visualization hero demonstration',
      detailedCaption:
        "Striking tunnel visualization serving as VYZBY's hero demonstration, featuring immersive perspective effects, dynamic lighting, and complex visual algorithms that showcase the framework's potential for creating compelling visual experiences through creative coding and real-time parameter manipulation",
    },
    screenshots: [
      {
        relativePath:
          'projects/vyzby/vyzby-audio-player-interface-music-selection.png',
        alt: 'VYZBY audio player interface showing music selection controls and Web Audio API integration for audio-reactive visual programming',
        caption: 'Audio player interface with Web Audio API integration',
        detailedCaption:
          "Sophisticated audio player interface demonstrating VYZBY's Web Audio API integration with music selection controls, audio analysis visualization, and real-time parameter mapping system that enables creative coders to create audio-reactive visuals without complex audio programming knowledge",
      },
      {
        relativePath:
          'projects/vyzby/vyzby-home-screen-with-interactive-mouse-chasing-brush-processing-sketch.png',
        alt: 'VYZBY home screen featuring interactive mouse-chasing brush sketch demonstrating real-time parameter manipulation and creative coding framework capabilities',
        caption:
          'Interactive home screen with mouse-chasing brush sketch demonstration',
        detailedCaption:
          "Engaging home screen showcasing VYZBY's interactive capabilities with mouse-chasing brush sketch, demonstrating real-time parameter manipulation, Vue.js and p5.js integration, and the framework's ability to transform static creative coding into dynamic, responsive visual experiences",
      },
      {
        relativePath:
          'projects/vyzby/vyzby-initial-scene-with-sin-wave-sketches.png',
        alt: 'Initial VYZBY scene displaying mathematical sin wave sketches with parameter controls demonstrating algorithmic visual generation and real-time manipulation',
        caption:
          'Mathematical sin wave sketches with real-time parameter controls',
        detailedCaption:
          "Mathematical visualization showcase featuring sin wave algorithms with real-time parameter manipulation, demonstrating VYZBY's capability to transform mathematical concepts into interactive visual experiences with immediate parameter feedback and algorithmic exploration",
      },
      {
        relativePath:
          'projects/vyzby/vyzby-portfolio-1-audio-reactive-sin-wave.gif',
        alt: 'Animated demonstration of audio-reactive sin wave visualization responding to music input with dynamic parameter changes and real-time visual feedback',
        caption:
          'Audio-reactive sin wave visualization with dynamic parameters',
        detailedCaption:
          "Dynamic audio-reactive sin wave visualization demonstrating VYZBY's Web Audio API integration, real-time parameter modulation based on audio analysis, and the framework's ability to create responsive visual experiences that react to musical input with sophisticated parameter mapping",
      },
      {
        relativePath:
          'projects/vyzby/vyzby-portfolio-2-audio-reactive-randomized-parameters.gif',
        alt: 'Audio-reactive sketch with randomized parameter generation showing dynamic visual variations and algorithmic creativity through VYZBY framework',
        caption: 'Audio-reactive sketch with randomized parameter generation',
        detailedCaption:
          "Advanced audio-reactive sketch featuring randomized parameter generation algorithms, demonstrating VYZBY's capability to create unpredictable yet controlled visual variations through algorithmic parameter manipulation and audio-driven creative coding experiences",
      },
      {
        relativePath:
          'projects/vyzby/vyzby-portfolio-3-green-2d-plane-rect-moving-quickly.gif',
        alt: 'High-speed animated green geometric shapes demonstrating performance optimization and rapid parameter changes in VYZBY creative coding framework',
        caption:
          'High-performance geometric animation with rapid parameter changes',
        detailedCaption:
          "Performance-optimized geometric animation showcasing VYZBY's ability to handle rapid parameter changes and high-frequency visual updates while maintaining smooth frame rates, demonstrating the framework's sophisticated performance engineering and real-time optimization capabilities",
      },
      {
        relativePath:
          'projects/vyzby/vyzby-portfolio-4-audio-reactive-parametric-line-sketch.gif',
        alt: 'Audio-reactive parametric line drawing sketch showing mathematical curve generation with real-time audio input modulation and dynamic visual complexity',
        caption:
          'Audio-reactive parametric line sketch with mathematical curve generation',
        detailedCaption:
          "Sophisticated audio-reactive parametric line sketch demonstrating mathematical curve generation algorithms modulated by audio input, showcasing VYZBY's ability to transform complex mathematical concepts into engaging audio-visual experiences with real-time parameter manipulation",
      },
      {
        relativePath:
          'projects/vyzby/vyzby-portfolio-5-audio-reactive-parametric-line-sketch-variation2.gif',
        alt: 'Advanced parametric line sketch variation with complex mathematical algorithms and audio reactivity demonstrating VYZBY framework extensibility and creative potential',
        caption:
          'Advanced parametric line sketch variation with complex algorithms',
        detailedCaption:
          "Advanced parametric line sketch variation featuring complex mathematical algorithms and sophisticated audio reactivity, demonstrating VYZBY's extensibility for creating diverse visual experiences and the framework's potential for supporting advanced creative coding experimentation",
      },
      {
        relativePath:
          'projects/vyzby/vyzby-portfolio-6-multilayer-sketch-with-3d-swords.gif',
        alt: 'Multi-layer 3D composition featuring sword models with complex scene management and layer control demonstrating VYZBY advanced rendering capabilities',
        caption: 'Multi-layer 3D composition with advanced scene management',
        detailedCaption:
          "Complex multi-layer 3D composition featuring sword models and sophisticated scene management, demonstrating VYZBY's advanced rendering capabilities, layer control systems, and ability to handle complex 3D scenes with multiple concurrent p5.js instances and individual parameter control",
      },
      {
        relativePath:
          'projects/vyzby/vyzby-processing-sketch-parameter-control-panel.png',
        alt: 'VYZBY parameter control panel interface showing automatic UI generation with sliders, knobs, and controls for real-time sketch manipulation',
        caption:
          'Automatic parameter control panel with intuitive UI generation',
        detailedCaption:
          "Comprehensive parameter control panel showcasing VYZBY's automatic UI generation system with sliders, knobs, and control interfaces that eliminate the need for code editing during creative experimentation, demonstrating the framework's core value proposition of real-time parameter manipulation",
      },
      {
        relativePath:
          'projects/vyzby/vyzby-screenshot-multi-layer-scene-with-3d-lamborghinis.png',
        alt: 'Multi-layer scene composition featuring 3D Lamborghini models demonstrating advanced 3D rendering and layer management in VYZBY creative coding framework',
        caption:
          'Multi-layer 3D scene with complex model rendering and management',
        detailedCaption:
          "Advanced multi-layer scene composition featuring 3D Lamborghini models, demonstrating VYZBY's sophisticated 3D rendering capabilities, layer management system, and ability to handle complex 3D assets with individual parameter control and real-time manipulation",
      },
      {
        relativePath:
          'projects/vyzby/vyzby-screenshot-parametric-lines-sketch.png',
        alt: 'Parametric line sketch showing mathematical curve generation with real-time parameter control demonstrating algorithmic art creation in VYZBY framework',
        caption:
          'Parametric line sketch with mathematical curve generation algorithms',
        detailedCaption:
          'Elegant parametric line sketch demonstrating mathematical curve generation with real-time parameter control, showcasing how VYZBY enables creators to explore algorithmic art concepts through immediate parameter feedback and live experimentation with mathematical formulas',
      },
      {
        relativePath: 'projects/vyzby/vyzby-screenshot-tunnel-hero.png',
        alt: 'VYZBY hero image featuring immersive tunnel visualization with dynamic lighting and perspective effects demonstrating advanced creative coding capabilities',
        caption: 'Immersive tunnel visualization hero demonstration',
        detailedCaption:
          "Striking tunnel visualization serving as VYZBY's hero demonstration, featuring immersive perspective effects, dynamic lighting, and complex visual algorithms that showcase the framework's potential for creating compelling visual experiences through creative coding and real-time parameter manipulation",
      },
      {
        relativePath:
          'projects/vyzby/vyzby-showcase-calm-tunnel-with-lamborghini-and-parametric-lines.gif',
        alt: 'Sophisticated multi-element composition featuring tunnel environment, 3D Lamborghini, and parametric lines demonstrating VYZBY comprehensive creative capabilities',
        caption:
          'Complex multi-element composition showcasing framework capabilities',
        detailedCaption:
          "Sophisticated showcase composition combining tunnel environment, 3D Lamborghini model, and parametric line algorithms, demonstrating VYZBY's comprehensive creative coding capabilities, multi-layer composition system, and ability to integrate diverse visual elements with unified parameter control",
      },
      {
        relativePath: 'projects/vyzby/vyzby-sketch-catalogue-menu.png',
        alt: 'VYZBY sketch catalogue interface showing organized collection of creative coding projects with metadata and selection system for framework extensibility',
        caption:
          'Organized sketch catalogue with extensible framework architecture',
        detailedCaption:
          "Comprehensive sketch catalogue interface demonstrating VYZBY's extensible architecture with organized creative coding project collection, metadata management, preview system, and easy sketch selection that enables developers to build and share creative coding libraries within the framework",
      },
    ].map(({ relativePath, ...mediaItem }) => ({
      ...mediaItem,
      ...getResponsiveImageSet(relativePath),
      url: getImageUrl(relativePath, 'full'),
    })),
    videos: [
      {
        url: getVideoUrl(
          'projects/vyzby/vyzby-audio-reactive-demo-jam-session.mp4'
        ),
        title: 'Audio-Reactive Live Performance Demo',
        type: 'demo',
        caption:
          'Live audio-reactive performance demonstration with real-time parameter manipulation',
        detailedCaption:
          "Dynamic live performance demonstration showcasing VYZBY's audio-reactive capabilities using Web Audio API integration, real-time parameter manipulation through UI controls, MIDI controller integration, and multi-layer visual composition system creating responsive creative coding experiences that react to musical input and enable live visual performance",
      },
    ],
  },

  // =============================================================================
  // PROJECT LINKS
  // =============================================================================
  links: {
    liveDemo: 'https://modest-darwin-601c1d.netlify.app/',
    repository: 'https://github.com/conc2304/audio-visualizer',
    caseStudy: 'https://www.joseconchello.com/vyzby-about',
    additionalLinks: [
      {
        title: 'p5.js Library',
        url: 'https://p5js.org/',
        type: 'documentation',
      },
      {
        title: 'Daniel Shiffman p5.js Tutorials',
        url: 'https://www.youtube.com/playlist?list=PLRqwX-V7Uu6Zy51Q-x9tMWIv9cueOFTFA',
        type: 'inspiration',
      },
      {
        title: 'Vue.js Framework',
        url: 'https://vuejs.org/',
        type: 'documentation',
      },
      {
        title: 'TensorFlow PoseNet',
        url: 'https://www.npmjs.com/package/@tensorflow-models/posenet',
        type: 'documentation',
      },
    ],
  },

  // =============================================================================
  // PROJECT CONTENT & NARRATIVE
  // =============================================================================
  content: {
    overview: `Web framework solving creative coding workflow friction by enabling real-time parameter manipulation in p5.js sketches without code editing.

    Built with Vue.js, p5.js, Web Audio API, and TensorFlow.js, featuring automatic UI generation for sketch parameters, MIDI controller integration, audio-reactive visualization, and webcam body tracking through PoseNet.

    The framework provides  API for multi-modal interaction, supporting live performance capabilities and eliminating repetitive write-compile-test cycles.

    Uses extensible architecture enabling developers to easily add custom sketches and interaction methods while maintaining real-time performance across concurrent visual layers.`,

    process: `**Problem Identification & Framework Conceptualization**: The project emerged from direct developer experience with p5.js where the iterative process of modifying hardcoded parameters to experiment with visual variations created significant development friction. Initial attempts using mouse coordinates or keyboard increments provided insufficient control granularity and lacked parameter state visibility, highlighting the need for a comprehensive parameter manipulation framework.

**Architecture Design & API Development**: Designed modular framework architecture separating parameter definition, UI generation, and interaction handling into distinct, extensible systems. Created sophisticated parameter type system supporting numeric ranges, categorical variables, and future boolean controls with automatic UI component generation and state management.

**Integration Layer Development**: Built seamless integration bridge between Vue.js application state and p5.js sketch runtime, solving complex challenges around bidirectional parameter binding, render cycle coordination, and memory management across framework boundaries. Implemented sketch registration system enabling modular composition and runtime layer management.

**Multi-Modal Interaction API**: Developed extensible interaction architecture supporting traditional UI controls, MIDI Web API integration, Web Audio API parameter mapping, and TensorFlow PoseNet body tracking. Created unified parameter binding system allowing any interaction method to control any sketch parameter through consistent API.

**Developer Experience Optimization**: Implemented comprehensive sketch catalogue system with metadata management, preview generation, and CPU usage profiling. Created clear documentation patterns and example implementations enabling other developers to easily extend the framework with custom sketches and interaction methods.

**Performance & Scalability Engineering**: Addressed complex real-time performance challenges including multi-layer rendering optimization, parameter update throttling, and resource management for concurrent p5.js instances. Implemented visibility controls and CPU monitoring to maintain responsive performance across varying complexity scenarios.`,

    results: `**Framework Architecture & Developer Experience**:
• Created comprehensive parameter manipulation framework that eliminates repetitive code-edit-test cycles in creative coding workflows
• Developed sophisticated runtime parameter binding system enabling bidirectional communication between UI controls and p5.js sketch variables
• Implemented modular sketch registration architecture allowing developers to easily extend the framework with custom visual algorithms
• Built automatic UI generation system that creates appropriate control interfaces based on parameter type definitions

**Technical Innovation & API Design**:
• Successfully architected seamless integration between Vue.js application framework and p5.js creative coding environment
• Developed unified interaction API supporting traditional UI, MIDI controllers, audio analysis, and machine learning-powered body tracking
• Created real-time multi-layer composition engine capable of managing concurrent p5.js instances with individual parameter control
• Implemented comprehensive parameter type system with automatic validation, range enforcement, and state persistence

**Performance & Scalability Solutions**:
• Solved complex real-time rendering challenges enabling smooth performance across multiple concurrent visual layers
• Created intelligent resource management system with CPU usage monitoring and performance optimization controls
• Developed efficient parameter update throttling and change detection to maintain responsive user interaction
• Implemented memory management solutions preventing resource leaks in long-running creative coding sessions

**Framework Extensibility & Documentation**:
• Established clear patterns for sketch development with comprehensive parameter definition and metadata systems
• Created developer-friendly registration process enabling easy framework extension without core code modification
• Built example implementations demonstrating integration of various interaction methods and parameter types
• Developed systematic approach to performance profiling and optimization guidance for framework users`,

    challenges: `**Framework Architecture & State Management**: Designing bidirectional parameter binding between Vue.js application state and p5.js sketch variables required solving complex challenges around render cycle coordination, memory management, and preventing parameter update loops. Creating a unified state management system that works seamlessly across both frameworks demanded deep understanding of each technology's lifecycle and constraints.

**Real-Time Performance Optimization**: Enabling multiple concurrent p5.js instances with real-time parameter manipulation created significant performance challenges. Developed sophisticated throttling mechanisms, change detection algorithms, and resource management systems to maintain responsive interaction while preventing frame rate degradation and memory leaks.

**Cross-Technology Integration Complexity**: Building seamless integration between Vue.js, p5.js, Web Audio API, MIDI API, and TensorFlow.js required solving fundamental architectural challenges around event handling, parameter type coercion, and API lifecycle management. Each technology had different paradigms for state management and event handling that needed unified coordination.

**Parameter Type System Design**: Creating a flexible yet type-safe parameter system that could handle numeric ranges, categorical options, and future boolean types while automatically generating appropriate UI controls required extensive design iteration. The system needed to balance developer flexibility with runtime safety and UI consistency.

**Multi-Modal Interaction API Design**: Designing a unified API that could seamlessly map MIDI controller inputs, audio analysis data, body tracking coordinates, and traditional UI interactions to arbitrary sketch parameters required creating flexible abstraction layers that maintained performance while providing intuitive developer experience.

**Framework Extensibility vs. Simplicity**: Creating a framework extensible enough for diverse creative coding applications while maintaining simple integration patterns for new sketches demanded careful API design and comprehensive documentation. Balancing power and ease-of-use required extensive iteration on developer experience patterns.

**Development Tool Integration**: Building developer-friendly debugging capabilities, parameter monitoring, and performance profiling tools within the browser environment required creating custom development interfaces that could inspect and manipulate framework state without interfering with creative coding performance.`,

    learnings: `**Framework Architecture & API Design**: Developing VYZBY taught crucial lessons about designing extensible frameworks that balance power with simplicity. Learning to create APIs that feel intuitive to developers while maintaining flexibility for diverse use cases became a cornerstone skill applicable to any framework development project. The experience highlighted the importance of clear separation of concerns and well-defined extension points.

**Cross-Technology Integration Mastery**: Successfully orchestrating Vue.js, p5.js, Web Audio API, MIDI API, and TensorFlow.js taught valuable lessons about technology integration patterns, state management across framework boundaries, and performance optimization in complex multi-technology stacks. This experience became fundamental for future projects requiring sophisticated technology integration.

**Developer Experience (DX) Optimization**: Building tools for other creative coders emphasized the critical importance of developer experience design. Learning to create clear documentation patterns, intuitive registration systems, and helpful debugging tools became essential skills for any developer-facing tool creation. Understanding how to reduce cognitive load while maintaining framework power proved crucial.

**Real-Time Performance Engineering**: Working with multiple concurrent p5.js instances and real-time parameter manipulation taught deep lessons about browser performance optimization, memory management, and frame rate maintenance. These performance engineering skills became applicable to any real-time web application development, particularly those involving graphics or animation.

**Parameter System Design & Type Safety**: Creating flexible parameter type systems with automatic UI generation taught valuable lessons about balancing type safety with runtime flexibility. Learning to design systems that could gracefully handle diverse data types while maintaining developer productivity became a transferable skill for API and framework design.

**Multi-Modal Interaction Architecture**: Implementing diverse interaction methods (UI, MIDI, audio, webcam) within a unified framework taught important lessons about abstraction layer design and event system architecture. Understanding how to create consistent APIs across vastly different input modalities became valuable for any interactive application development.

**Creative Technology Problem-Solving**: Using framework development to solve personal workflow inefficiencies demonstrated the value of building developer tools that address real productivity pain points rather than pursuing technology for its own sake. This experience reinforced the importance of developer empathy and problem validation in tool creation.

**Extensible System Design**: Creating architecture that enables community contribution and framework extension taught essential lessons about sustainable software design, documentation requirements, and maintainable code patterns. These insights became fundamental for any project intended to grow beyond its original creator.`,
  },

  // =============================================================================
  // PROJECT METADATA
  // =============================================================================
  metadata: {
    featured: true,
    status: 'live',
    lastUpdated: undefined, // Would need clarification - appears to be ongoing
    tags: [
      'framework-development',
      'creative-coding-tools',
      'developer-experience',
      'p5js-framework',
      'vuejs-integration',
      'real-time-parameter-control',
      'api-design',
      'multi-modal-interaction',
      'web-audio-integration',
      'midi-api',
      'machine-learning-integration',
      'performance-optimization',
      'cross-technology-integration',
      'developer-tools',
      'workflow-automation',
      'parameter-manipulation',
      'runtime-ui-generation',
      'extensible-architecture',
      'creative-coding-workflow',
      'browser-based-framework',
    ],
    difficulty: 'intermediate',
  },
};
