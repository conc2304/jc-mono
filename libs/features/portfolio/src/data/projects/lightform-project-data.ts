import { ProjectData } from '@jc/ui-components';

const projectDir = 'projects/lightform/';

export const lightformWebControllerProject: ProjectData = {
  // =============================================================================
  // CORE PROJECT INFORMATION
  // =============================================================================
  id: 'lightform-web-controller',
  projectName: 'Lightform OAK App',
  projectSubtitle: 'Web Controller & FTUX Experience',
  slug: 'lightforms-web-app-controller',

  // =============================================================================
  // PROJECT BASICS
  // =============================================================================
  basics: {
    type: 'professional',
    category: 'web',
    subcategories: [
      'front-end',
      'ui-dev',
      'pwa',
      'mobile-web',
      'embedded-systems',
      'creative-coding',
      'projection-mapping',
    ],
    description:
      "Progressive Web Application and First Time User Experience (FTUX) for Lightform's AR projection mapping system, enabling seamless setup and control of projection mapping experiences through mobile and desktop interfaces.",
    context: 'Lightform Inc. - AR projection mapping hardware company',
  },

  // =============================================================================
  // TECHNICAL DETAILS
  // =============================================================================
  technical: {
    technologies: [
      'StencilJS',
      'TypeScript',
      'Ionic',
      'Stencil Store',
      'SCSS',
      'P5.js',
      'Three.js',
      'PWA',
      'JSX',
      'Jest',
      'Storybooks',
      'Rollup',
      'Workbox',
      'REST APIs',
      'RPC APIs',
      'NPM',
      'Gulp',
      'AWS',
      'Android WebView',
      'Vue.js',
    ],
    timeline: {
      startDate: '2020-08',
      endDate: '2021-06',
      duration: '11 months',
    },
    myRole: 'Lead Frontend Engineer & Tech Stack Decision Maker',
    collaborators: [
      {
        name: 'UX Designers',
        role: 'User Experience Design',
        url: undefined,
      },
      {
        name: 'C-level Executives',
        role: 'Stakeholder Requirements',
        url: undefined,
      },
      {
        name: 'Backend Engineering Team',
        role: 'API Integration',
        url: undefined,
      },
      {
        name: 'Firmware Team',
        role: 'Projector Integration',
        url: undefined,
      },
    ],
  },

  // =============================================================================
  // MEDIA ASSETS
  // =============================================================================
  media: {
    // Thumbnail/hero image
    hero: {
      relativePath: 'projects/lightform/lf2-upside-down-gradpink-1-800x450.jpg',
      alt: 'Lightform LF2+ AR Projector - Primary Hardware',
      caption:
        'The Lightform LF2+ AR projector that the web controller interfaces with',
    },

    screenshots: [
      {
        relativePath: 'projects/lightform/App-Header.jpg',
        alt: 'Web Application Header Interface',
        caption: 'Main application header showing navigation and device status',
      },
      {
        relativePath:
          'projects/lightform/lf2-upside-down-gradpink-1-800x450.jpg',
        alt: 'Lightform LF2+ AR Projector - Primary Hardware',
        caption:
          'The Lightform LF2+ AR projector that the web controller interfaces with',
      },
      {
        relativePath:
          'projects/lightform/LF2plus-front-transparent-square.webp',
        alt: 'LF2+ Front View Technical Specification',
        caption: 'Front view showing camera array and projection lens',
      },
      {
        relativePath: 'projects/lightform/FTUX-Step-2-Update-Firmware.jpg',
        alt: 'First Time User Experience - Firmware Update',
        caption: 'Step 2 of device setup process - firmware update interface',
      },
      {
        relativePath: 'projects/lightform/FTUX-Step-3-Device-Registration.jpg',
        alt: 'First Time User Experience - Device Registration',
        caption: 'Step 3 of device setup - registering device to user account',
      },
      {
        relativePath: 'projects/lightform/OAK-Step-1-Object-Scanning.jpg',
        alt: 'Object Alignment Kit - 3D Scanning Interface',
        caption:
          'Real-time 3D scanning interface for object detection and alignment',
      },
      {
        relativePath: 'projects/lightform/OAK-Step-2-Environments-UI.jpg',
        alt: 'Object Alignment Kit - Environment Selection',
        caption: 'Environment selection interface for projection mapping setup',
      },
      {
        relativePath: 'projects/lightform/OAK-Step-2-Object-Alignment.jpg',
        alt: 'Object Alignment Kit - Precision Alignment',
        caption:
          'Fine-tuned object alignment controls for accurate projection mapping',
      },
      {
        relativePath: 'projects/lightform/article-1-step-1-v1.jpg',
        alt: 'Tutorial Article 1 - Getting Started',
        caption: 'Step-by-step tutorial showing initial device setup process',
      },
    ],
    videos: [
      {
        relativePath: 'projects/lightform/Desktop-View-Full-With-Errors-.mp4',
        title: 'Desktop Application Demo with Error Handling',
        type: 'demo',
        caption:
          'Complete desktop application walkthrough including error state management',
      },
      {
        relativePath:
          'projects/lightform/Skate Shop Mural Mapping - Houston.mp4',
        title: 'Real-World Projection Mapping Demo',
        type: 'demo',
        caption:
          'Live demonstration of projection mapping on a mural at a Houston skate shop',
      },
      {
        relativePath: 'projects/lightform/lightform-bgloop720.mp4',
        title: 'Lightform Background Demo Loop',
        type: 'demo',
        caption:
          'Ambient projection mapping demonstration showing dynamic visual effects',
      },
      {
        relativePath: 'projects/lightform/lf-article1_step1_v1.mp4',
        title: 'Tutorial: Getting Started - Step 1',
        type: 'process',
        caption: 'First step of the guided setup process for new users',
      },
      {
        relativePath: 'projects/lightform/lf-article1_step2_v1.mp4',
        title: 'Tutorial: Getting Started - Step 2',
        type: 'process',
        caption:
          'Second step covering device connection and initial calibration',
      },
      {
        relativePath: 'projects/lightform/lf-article1_step3_v1.mp4',
        title: 'Tutorial: Getting Started - Step 3',
        type: 'process',
        caption: 'Final setup step showing first projection and basic controls',
      },
      {
        relativePath: 'projects/lightform/lf-article2_step2_v1.mp4',
        title: 'Advanced Tutorial: Object Detection - Step 2',
        type: 'process',
        caption: 'Advanced object detection and tracking setup process',
      },
      {
        relativePath: 'projects/lightform/lf-article2_step3_v1.mp4',
        title: 'Advanced Tutorial: Object Detection - Step 3',
        type: 'process',
        caption: 'Fine-tuning object detection parameters for optimal tracking',
      },
      {
        relativePath: 'projects/lightform/lf-article3_step2_v1.mp4',
        title: 'Professional Tutorial: Complex Mappings - Step 2',
        type: 'process',
        caption: 'Creating complex multi-surface projection mappings',
      },
    ],
  },

  // =============================================================================
  // PROJECT LINKS
  // =============================================================================
  links: {
    liveDemo: undefined, // Would need to be provided if still available
    repository: 'https://github.com/conc2304/lightform-web-controller',
    caseStudy: 'https://www.joseconchello.com/lightforms-web-app-controller',
    additionalLinks: [
      {
        title: 'Web Controller Repository',
        url: 'https://github.com/conc2304/lightform-web-controller/tree/main/web-controller',
        type: 'deployment',
      },
      {
        title: 'Web Components Library',
        url: 'https://github.com/conc2304/lightform-web-controller/tree/main/web-components',
        type: 'documentation',
      },
      {
        title: 'Oak App (FTUX)',
        url: 'https://github.com/conc2304/lightform-web-controller/tree/main/oak-app',
        type: 'deployment',
      },
      {
        title: 'Lightform Company',
        url: 'https://lightform.com/',
        type: 'other',
      },
      {
        title: 'LF2+ Product Page',
        url: 'https://lightform.com/lf2plus',
        type: 'documentation',
      },
    ],
  },

  // =============================================================================
  // PROJECT CONTENT & NARRATIVE
  // =============================================================================
  content: {
    overview: `Led development of a comprehensive web-based ecosystem for Lightform's AR projection mapping hardware, consisting of two integrated applications: a First Time User Experience (FTUX) app for device setup running through Android WebView, and a Progressive Web App controller for real-time projection mapping management.

    Built with StencilJS and TypeScript, the system features a custom virtual keyboard for D-pad navigation, P5.js-powered corner pinning for precision alignment, and cross-platform PWA functionality.

    The applications successfully transitioned Lightform from serving primarily professional markets to enabling home consumers to create projection mapping experiences, democratizing access to AR projection technology through intuitive mobile and desktop interfaces.`,

    process: `The development process began with critical technology stack decisions to future-proof the applications. I chose Stencil.js as the primary framework to create standards-compliant web components that could integrate across different platforms and frameworks, reducing dependency on framework trends. This decision proved crucial as it allowed the same components to be used in both the FTUX Android WebView application and the standalone PWA.

For the FTUX application, I developed a highly customized virtual keyboard using NPM packages, enabling users to access full QWERTY keyboard functionality via just the D-pad on the Lightform remote control. All remote control behavior was handled and controlled through the web application, creating a seamless hardware-software integration.

The Web Controller leveraged the popular Processing library P5.js to create an interactive corner pinning UI that adjusts the image rendered in the interface and sends updated coordinates to the projector in real-time. I also integrated Ionic to create a mobile-first PWA experience that could be installed as both a desktop and mobile app, ensuring device-agnostic functionality.

A critical architectural decision was implementing a robust state management system using Stencil State Tunnel, which works similarly to React's Redux but is framework-agnostic. This enabled seamless data flow between the device setup process, network configuration, firmware updates, and projection control features.`,

    results: `The project successfully delivered two production applications that democratized projection mapping technology:

• **FTUX Application**: Streamlined the first-time setup process for Lightform devices, handling device settings, network pairing, firmware updates, and user registration through an intuitive remote-control-driven interface
• **Web Controller PWA**: Created an on-demand visual experience platform that allows users to change and adjust projected moods seamlessly, similar to setting the mood for a party
• **Technical Innovation**: The virtual keyboard implementation allowed complex text input through simple D-pad navigation, solving a major UX challenge for embedded device setup
• **Cross-Platform Success**: The PWA approach made the application device-agnostic and installable, appearing as a native app on users' devices while maintaining web-based flexibility
• **Performance**: Real-time projection adjustment through P5.js corner pinning provided immediate visual feedback and precise projection mapping control

The applications enabled Lightform to transition from serving primarily prosumer markets (artists and design agencies) to reaching home consumers, significantly expanding their addressable market.`,

    challenges: `Several significant technical and user experience challenges were overcome:

• **Hardware-Software Integration**: Creating seamless communication between web applications and specialized projection hardware required extensive API integration and real-time data synchronization
• **Remote Control Navigation**: Designing complex user interfaces that could be navigated efficiently using only a simple D-pad remote required innovative UX solutions and custom virtual keyboard implementation
• **Cross-Platform Compatibility**: Ensuring consistent experience across Android WebView, mobile browsers, and desktop installations while maintaining PWA functionality
• **Network Configuration**: Handling complex network setup processes through a simplified UI while managing various connection scenarios and error states
• **Real-time Projection Mapping**: Implementing responsive corner pinning adjustments that provide immediate visual feedback while maintaining projection accuracy
• **Framework Future-Proofing**: Selecting and implementing a technology stack that would remain viable as web standards evolved, leading to the adoption of standards-compliant web components`,

    learnings: `This project provided deep insights into several cutting-edge areas:

• **Web Components Architecture**: Gained expertise in building truly framework-agnostic components using Stencil.js, learning how to create reusable UI elements that could integrate across different platforms and future frameworks
• **PWA Implementation**: Mastered Progressive Web App development, including service workers, offline functionality, and installability features that bridge the gap between web and native applications
• **Hardware Integration**: Developed skills in creating web applications that interface with specialized hardware, including real-time communication with projection systems and embedded devices
• **Creative Coding for Practical Applications**: Applied creative coding libraries (P5.js, Three.js) to solve real-world user interface challenges, demonstrating how creative technologies can enhance practical applications
• **State Management at Scale**: Implemented sophisticated state management for complex multi-step processes involving device configuration, network setup, and real-time projection control
• **Cross-Platform Design Thinking**: Learned to design interfaces that work effectively across vastly different input methods - from touch interfaces to remote control navigation

The project reinforced the importance of making early, thoughtful technology decisions that consider long-term maintainability and cross-platform compatibility.`,
  },

  // =============================================================================
  // PROJECT METADATA
  // =============================================================================
  metadata: {
    featured: true,
    status: 'archived', // Lightform company closed in 2022
    lastUpdated: '2021-06',
    tags: [
      'progressive-web-app',
      'projection-mapping',
      'augmented-reality',
      'hardware-integration',
      'mobile-web',
      'creative-coding',
      'stenciljs',
      'ionic',
      'p5js',
      'embedded-systems',
      'ui-ux',
      'web-components',
      'real-time',
      'cross-platform',
    ],
    difficulty: 'advanced',
  },
};
