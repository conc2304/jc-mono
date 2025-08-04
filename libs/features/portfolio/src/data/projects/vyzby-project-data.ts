import { ProjectData } from '@jc/ui-components';

export const vyzbyProject: ProjectData = {
  // =============================================================================
  // CORE PROJECT INFORMATION
  // =============================================================================
  id: 'vyzby-interactive-audio-visualizer',
  projectName: 'VYZBY: Interactive Audio Visualizer & Digital Playground',
  slug: 'vyzby-about',

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
    // TODO GATHER MEDIA
    thumbnail: undefined, // No specific thumbnail mentioned in documentation
    screenshots: [
      // Note: Actual screenshots would need to be captured from the live demo
      {
        url: 'https://modest-darwin-601c1d.netlify.app/screenshots/main-interface.png', // Placeholder
        alt: 'VYZBY main visualizer interface with layer controls and parameter sliders',
        caption:
          'Main visualizer interface showing layered sketch composition and intuitive parameter controls',
      },
      {
        url: 'https://modest-darwin-601c1d.netlify.app/screenshots/layer-library.png', // Placeholder
        alt: 'Layer library showing available p5.js sketches with preview thumbnails',
        caption:
          'Layer library interface displaying various creative coding sketches users can add to compositions',
      },
      {
        url: 'https://modest-darwin-601c1d.netlify.app/screenshots/midi-controls.png', // Placeholder
        alt: 'MIDI controller integration interface for expressive parameter control',
        caption:
          'MIDI controller support enabling DJ-like expressive control over visual parameters',
      },
    ],
    videos: [
      {
        url: 'https://modest-darwin-601c1d.netlify.app/demo-video.mp4', // Placeholder
        title: 'VYZBY Interactive Demo',
        type: 'demo',
        caption:
          "Demonstration of VYZBY's multi-modal interaction capabilities including audio response, MIDI control, and webcam tracking",
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
    overview: `VYZBY is a comprehensive web framework designed to solve a fundamental workflow problem in creative coding: the tedious cycle of editing code parameters to see visual variations in p5.js sketches. Born from direct frustration with the repetitive process of modifying source code to experiment with visual parameters, VYZBY provides a sophisticated runtime parameter manipulation system that transforms static creative coding into dynamic, interactive experiences.

The framework bridges the gap between coded creativity and real-time interaction by automatically generating intuitive UI controls for sketch parameters, enabling live manipulation without touching code. Beyond traditional UI controls, VYZBY provides a robust API architecture supporting multiple interaction modalities including MIDI controller integration, Web Audio API reactivity, and TensorFlow-powered webcam body tracking.

At its core, VYZBY represents a fundamental reimagining of the creative coding development experience. Rather than the traditional write-compile-test cycle, the framework enables immediate parameter feedback, real-time experimentation, and interactive performance capabilities. The modular architecture allows creative coders to focus on algorithm development while VYZBY handles the interaction layer, UI generation, and real-time parameter management.`,

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
