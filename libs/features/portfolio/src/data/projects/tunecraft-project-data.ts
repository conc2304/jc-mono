import { ProjectData } from '@jc/ui-components';
import { getImageUrl, getResponsiveImageSet, getVideoUrl } from '@jc/utils';

export const tunecraftProject: ProjectData = {
  // =============================================================================
  // CORE PROJECT INFORMATION
  // =============================================================================
  id: 'tunecraft-6d-object-tracking-audio-control',
  projectName: 'TuneCraft',
  projectSubtitle: 'Dynamic Audio Control via 6D Object Tracking',
  slug: 'tune-craft-cv',

  // =============================================================================
  // PROJECT BASICS
  // =============================================================================
  basics: {
    type: 'graduate',
    category: 'creative-coding',
    subcategories: [
      'performance',
      'data-visualization',
      '3d-animation',
      'motion-graphics',
      'digital-art',
      'audio-visual-sync',
    ],
    description:
      "Innovative computer vision art project leveraging MediaPipe's 6D object pose detection to create real-time music control through physical object manipulation, featuring TouchDesigner integration, Ableton Live audio control, and projected augmented reality interface.",
    context:
      'Harvard Extension School - DGMD E-14: Wearable Devices and Computer Vision (Fall 2023)',
  },

  // =============================================================================
  // TECHNICAL DETAILS
  // =============================================================================
  technical: {
    technologies: [
      'MediaPipe Objectron',
      'TouchDesigner',
      'Ableton Live',
      'TDAbleton Integration',
      'Python',
      'OpenCV',
      'Computer Vision',
      '6D Pose Estimation',
      'ArUco Marker Detection',
      'Real-time Processing',
      'Anaconda Environment',
      'NumPy',
      'Projection Mapping',
      'Audio Parameter Mapping',
      'Visual Programming',
      'Real-time Audio Control',
    ],
    timeline: {
      startDate: '2023-09', // Fall 2023 semester
      endDate: '2023-12',
      duration: 'Fall semester final project (3-4 months)',
    },
    myRole:
      'Solo Developer & Researcher - Computer vision implementation, TouchDesigner programming, audio-visual integration, system architecture design, academic research and documentation',
    collaborators: [
      // Solo academic project - no collaborators mentioned
    ],
  },

  // =============================================================================
  // MEDIA ASSETS
  // =============================================================================
  media: {
    thumbnail: {
      relativePath:
        'projects/tunecraft/tunecraft-spotlight-tracking-of-shoe-with-rotation-markers-XYZ-as-RGB-arcs.jpg',
      url: getImageUrl(
        'projects/tunecraft/tunecraft-spotlight-tracking-of-shoe-with-rotation-markers-XYZ-as-RGB-arcs.jpg',
        'full'
      ),
      ...getResponsiveImageSet(
        'projects/tunecraft/tunecraft-spotlight-tracking-of-shoe-with-rotation-markers-XYZ-as-RGB-arcs.jpg'
      ),
      alt: 'Real-time visual feedback showing tracked shoe object with spotlight positioning and RGB arc rotation indicators for XYZ axis rotations in projected interface',
      caption: 'Real-time object tracking with visual rotation feedback',
      detailedCaption:
        'Advanced projected augmented reality interface demonstrating real-time object tracking visualization with spotlight position tracking and RGB arc system representing XYZ rotation values, providing immediate visual feedback for users to understand their physical interactions and object pose detection accuracy in the interactive music control system',
    },
    screenshots: [
      {
        relativePath:
          'projects/tunecraft/tunecraft-ArUco-detection-projection-on-left-cropped-video-stream-right.jpg',
        alt: 'ArUco marker detection system showing camera-projector calibration with detected markers on projected surface and corresponding cropped video stream processing',
        caption: 'ArUco marker calibration for camera-projector alignment',
        detailedCaption:
          'Sophisticated camera-projector calibration system using ArUco marker detection for precise coordinate alignment between camera input and projector output, featuring automated corner detection, video stream cropping, and coordinate system transformation essential for accurate projection mapping in the interactive audio-visual interface',
      },
      {
        relativePath:
          'projects/tunecraft/tunecraft-ableton-live-session-view-interface.jpg',
        alt: 'Ableton Live session interface showing audio clips, drum loops, and instrument tracks controlled by 6D object pose parameters through TDAbleton integration',
        caption: 'Ableton Live audio interface controlled by object tracking',
        detailedCaption:
          "Ableton Live session view interface demonstrating the audio production environment controlled by TuneCraft's 6D object tracking system, featuring drum loops, melody clips, and instrument tracks with parameters dynamically mapped to object position and rotation data through TDAbleton integration for real-time music generation",
      },
      {
        relativePath:
          'projects/tunecraft/tunecraft-implementation-of-td-ableton-in-touchdesigner-from-objectron-data.jpg',
        alt: 'TouchDesigner visual programming interface showing TDAbleton integration nodes processing MediaPipe Objectron pose data for audio parameter control',
        caption:
          'TouchDesigner audio control integration with pose detection data',
        detailedCaption:
          'Advanced TouchDesigner visual programming implementation featuring TDAbleton integration nodes that process MediaPipe Objectron 6D pose detection data and convert object position and rotation coordinates into audio parameter control signals for real-time music manipulation and dynamic audio generation',
      },
      {
        relativePath:
          'projects/tunecraft/tunecraft-media-pipe-objectron-example-results.jpg',
        alt: 'MediaPipe Objectron 6D pose detection results showing 3D bounding box visualization and coordinate tracking for real-time object pose estimation',
        caption: 'MediaPipe Objectron 6D pose detection visualization',
        detailedCaption:
          "MediaPipe Objectron computer vision results demonstrating accurate 6D object pose estimation with 3D bounding box visualization, coordinate tracking, and real-time object detection capabilities that form the foundation of TuneCraft's innovative human-computer interaction paradigm for tangible music control",
      },
      {
        relativePath:
          'projects/tunecraft/tunecraft-methodology-and-process-diagram.jpg',
        alt: 'Technical methodology diagram showing complete TuneCraft system architecture from camera input through computer vision processing to audio output and visual feedback',
        caption: 'Complete system architecture and data flow methodology',
        detailedCaption:
          "Comprehensive system architecture diagram illustrating TuneCraft's complete methodology and data flow from camera input through MediaPipe computer vision processing, TouchDesigner visual programming, coordinate transformation, audio parameter mapping, and dual outputs to Ableton Live audio control and projected visual feedback systems",
      },
      {
        relativePath:
          'projects/tunecraft/tunecraft-overview-of-touchdesigner-workflow.jpg',
        alt: 'TouchDesigner visual programming workflow showing node-based processing pipeline for computer vision, audio control, and projection mapping integration',
        caption: 'TouchDesigner visual programming workflow overview',
        detailedCaption:
          'Detailed TouchDesigner visual programming workflow showcasing the complete node-based processing pipeline including video input processing, MediaPipe integration, coordinate transformation, audio parameter mapping, and projection output systems that coordinate real-time computer vision with audio-visual performance capabilities',
      },
      {
        relativePath:
          'projects/tunecraft/tunecraft-projector-and-camera-setup.jpg',
        alt: 'Hardware setup showing projector and camera configuration for TuneCraft interactive installation with optimal positioning for object tracking and projection mapping',
        caption: 'Physical hardware setup for camera tracking and projection',
        detailedCaption:
          "Professional hardware installation featuring optimally positioned camera and projector setup for TuneCraft's interactive audio-visual system, demonstrating the physical computing infrastructure required for reliable 6D object tracking, projection mapping, and real-time performance applications with proper mounting and environmental considerations",
      },
      {
        relativePath:
          'projects/tunecraft/tunecraft-spotlight-tracking-of-shoe-with-rotation-markers-XYZ-as-RGB-arcs.jpg',
        alt: 'Real-time visual feedback showing tracked shoe object with spotlight positioning and RGB arc rotation indicators for XYZ axis rotations in projected interface',
        caption: 'Real-time object tracking with visual rotation feedback',
        detailedCaption:
          'Advanced projected augmented reality interface demonstrating real-time object tracking visualization with spotlight position tracking and RGB arc system representing XYZ rotation values, providing immediate visual feedback for users to understand their physical interactions and object pose detection accuracy in the interactive music control system',
      },
      {
        relativePath:
          'projects/tunecraft/tunecraft-touchdesigner-td-ableton-and-ableton-side-by-side.jpg',
        alt: 'Side-by-side interface view showing TouchDesigner TDAbleton integration controls alongside Ableton Live interface demonstrating real-time parameter synchronization',
        caption: 'TouchDesigner and Ableton Live integration interface',
        detailedCaption:
          "Professional software integration showcase featuring TouchDesigner's TDAbleton control interface alongside Ableton Live's audio production environment, demonstrating real-time parameter synchronization, audio control mapping, and the sophisticated multi-application coordination that enables seamless object tracking to music control translation",
      },
    ].map((mediaItem) => ({
      ...mediaItem,
      ...getResponsiveImageSet(mediaItem.relativePath),
      url: getImageUrl(mediaItem.relativePath, 'full'),
    })),
    videos: [
      {
        url: getVideoUrl(
          'projects/tunecraft/TUNECRAFT - An interactive Immersive  Art Experience via 6D Object Tracking Final Project Proposal.mp4'
        ),
        title: 'TuneCraft Project Proposal',
        type: 'process',
        caption: 'Project proposal for 6D object tracking music control system',
        detailedCaption:
          "Comprehensive project proposal presentation introducing TuneCraft's innovative concept of using MediaPipe Objectron for 6D object pose detection to create real-time music control through physical object manipulation, featuring planned integration of computer vision, TouchDesigner visual programming, and Ableton Live audio production for immersive audio-visual performance experiences",
      },
      {
        url: getVideoUrl(
          'projects/tunecraft/TuneCraft - 3D Object Pose Detection in TouchDesigner to control Ableton.mp4'
        ),
        title: '3D Pose Detection Technical Implementation',
        type: 'process',
        caption:
          '3D pose detection system controlling audio parameters in real-time',
        detailedCaption:
          'Advanced technical demonstration showcasing the complete computer vision pipeline using MediaPipe Objectron within TouchDesigner for 6D object pose estimation, real-time coordinate processing, audio parameter mapping, and seamless integration with Ableton Live for dynamic music control through physical object manipulation',
      },
      {
        url: getVideoUrl(
          'projects/tunecraft/TuneCraft By Jose Conchello - Final Project Demo Video.mp4'
        ),
        title: 'Complete System Demonstration',
        type: 'demo',
        caption: 'Complete interactive audio-visual system demonstration',
        detailedCaption:
          'Comprehensive final project demonstration featuring the complete TuneCraft system with 6D object pose detection, projected augmented reality visual feedback, real-time audio parameter control, camera-projector calibration using ArUco markers, and seamless integration of computer vision, visual programming, and audio production technologies for innovative human-computer interaction',
      },
      {
        url: getVideoUrl(
          'projects/tunecraft/TuneCraft Final Presentation Video By Jose Conchello.mp4'
        ),
        title: 'Academic Research Presentation',
        type: 'final',
        caption: 'Academic research presentation with methodology and results',
        detailedCaption:
          "Professional academic presentation covering TuneCraft's comprehensive research methodology, technical implementation details, system architecture analysis, performance evaluation results, limitations assessment, and proposed future development directions for 6D object pose estimation in interactive media applications",
      },
    ],
  },

  // =============================================================================
  // PROJECT LINKS
  // =============================================================================
  links: {
    liveDemo: undefined, // Hardware installation - no web demo
    repository: 'https://github.com/conc2304/tune-craft-cv',
    caseStudy: undefined,
    additionalLinks: [
      {
        title: 'Detailed Project Report',
        url: 'https://docs.google.com/document/d/1nDZOWPT0zQLzOOU27f3uuQJEj4dGhFwn-rsLJNAcoKE/edit',
        type: 'documentation',
      },
      {
        title: 'Project Demo Video',
        url: 'https://youtu.be/2n1Z5icfN-w',
        type: 'other',
      },
      {
        title: 'Project Presentation',
        url: 'https://youtu.be/IWK0HBRLtzk',
        type: 'other',
      },
      {
        title: 'MediaPipe Objectron Documentation',
        url: 'https://mediapipe.dev/solutions/objectron',
        type: 'documentation',
      },
      {
        title: 'TouchDesigner Official Site',
        url: 'https://derivative.ca/',
        type: 'documentation',
      },
    ],
  },

  // =============================================================================
  // PROJECT CONTENT & NARRATIVE
  // =============================================================================
  content: {
    overview: `TuneCraft represents an innovative exploration of human-computer interaction, reimagining how we interface with technology by creating a physio-digital approach to audio control through tangible object manipulation. Developed as a final project for Harvard Extension School's DGMD E-14 course, the project successfully demonstrates the transformative potential of combining cutting-edge computer vision with interactive digital media.

The project addresses the challenge of moving beyond traditional screen-based and mouse/keyboard interactions by leveraging MediaPipe's Objectron solution for 6D object pose detection. Through real-time tracking of a shoe's position and rotation in 3D space, TuneCraft creates an immersive musical instrument where physical movements directly control audio parameters in Ableton Live, while simultaneously providing visual feedback through projected augmented reality interfaces.

Built using a sophisticated integration of TouchDesigner for visual programming, MediaPipe for computer vision processing, and Ableton Live for real-time audio generation, the project showcases advanced system architecture design and multi-technology coordination. The implementation includes camera-projector calibration using ArUco markers, real-time 6D pose estimation, dynamic audio parameter mapping, and projected visual feedback systems working together to create a seamless interactive experience.`,

    process: `**Research & Technology Selection**: Conducted comprehensive research into 6D object pose estimation, comparing MediaPipe's Objectron against alternatives like YOLO for 2D detection. Selected MediaPipe for its superior 3D understanding, real-time processing capabilities, and depth information crucial for interactive applications. Researched Google's Objectron dataset creation process and AR-based annotation techniques to understand the underlying machine learning foundations.

**System Architecture & Integration Planning**: Designed complex multi-technology architecture integrating computer vision (MediaPipe), visual programming (TouchDesigner), audio production (Ableton Live), and projection mapping systems. Planned data flow from camera input through computer vision processing to dual outputs: audio parameter control and projected visual feedback, requiring careful consideration of real-time performance constraints.

**Computer Vision Pipeline Development**: Implemented sophisticated video processing pipeline using OpenCV for preprocessing, including color correction, normalization, and data type conversion for MediaPipe compatibility. Configured Objectron API with optimized parameters for real-time performance: static image mode for TouchDesigner integration, reduced detection confidence for responsiveness, and single object tracking for performance optimization.

**Camera-Projector Calibration System**: Developed ArUco marker-based calibration system enabling precise alignment between camera input and projector output. Implemented automated corner detection and video cropping to ensure object detection coordinates accurately correspond to projected interface positions, solving the fundamental challenge of coordinate system alignment in projection mapping applications.

**Real-time Audio Parameter Mapping**: Created sophisticated parameter mapping system translating 6D pose data into musical control parameters. Implemented coordinate remapping algorithms converting normalized detection values to Ableton Live parameter ranges, enabling object position to control drum loop selection, instrument selection, and rotation values to control melody clips, tempo, and audio effects like reverb and delay.

**Interactive UI & Visual Feedback Development**: Designed and implemented projected augmented reality interface providing real-time visual feedback for object tracking. Created spotlight tracking system for position visualization and RGB arc system representing rotation values, enabling users to understand their interactions through immediate visual confirmation of detected movements and rotations.

**Performance Optimization & Environment Setup**: Established reproducible Python environment using Anaconda for dependency management, configured TouchDesigner path integration for external library access, and implemented video stream optimization through resolution scaling and region-of-interest cropping to maintain real-time performance while processing complex computer vision algorithms.`,

    results: `**Innovative Human-Computer Interaction Paradigm**:
• Successfully demonstrated novel approach to technology interaction using 6D object pose detection for real-time music control
• Created seamless integration between physical object manipulation and digital audio generation, eliminating traditional interface barriers
• Established proof-of-concept for tangible interaction design that could influence future interface development across multiple domains
• Achieved real-time responsiveness enabling natural, intuitive control over complex audio parameters through simple physical movements

**Advanced Multi-Technology System Integration**:
• Successfully coordinated MediaPipe computer vision, TouchDesigner visual programming, and Ableton Live audio production in real-time processing pipeline
• Implemented robust camera-projector calibration system using ArUco markers enabling precise coordinate alignment for projection mapping applications
• Created sophisticated data flow architecture processing video input, computer vision analysis, audio parameter mapping, and visual feedback generation simultaneously
• Demonstrated technical proficiency in complex system design requiring deep understanding of multiple professional-grade software platforms

**Real-time Computer Vision & Audio Processing**:
• Achieved stable 6D object pose detection and tracking using MediaPipe Objectron with optimized parameters for interactive performance
• Implemented efficient video processing pipeline including preprocessing, object detection, coordinate transformation, and dual-output routing
• Created responsive audio parameter control system mapping object position to drum loops and instruments, rotation to melody clips, tempo, and effects
• Established reliable real-time processing pipeline maintaining performance despite computational complexity of simultaneous CV and audio processing

**Academic Research & Documentation Excellence**:
• Produced comprehensive technical documentation including detailed methodology, system architecture analysis, and performance evaluation
• Conducted thorough background research into 6D pose estimation, MediaPipe Objectron dataset creation, and computer vision applications in interactive media
• Created professional presentation and demonstration materials effectively communicating complex technical concepts and research findings
• Identified specific technical limitations and proposed concrete solutions for future development, demonstrating critical analysis and research methodology`,

    challenges: `**MediaPipe Integration & Performance Limitations**: Integrating MediaPipe's Python API within TouchDesigner's synchronous execution environment created significant performance bottlenecks and stability issues. Running Objectron in static image mode (required due to TouchDesigner's frame-by-frame processing) resulted in noisier rotation data compared to video stream mode, requiring extensive parameter tuning and optimization strategies.

**Multi-Technology Coordination & Real-time Constraints**: Coordinating real-time data flow between MediaPipe computer vision processing, TouchDesigner visual programming, and Ableton Live audio generation required solving complex synchronization challenges. Maintaining stable frame rates while processing computationally intensive 6D pose estimation alongside audio parameter updates and projection mapping demanded careful resource management and optimization.

**Camera-Projector Alignment & Calibration Complexity**: Achieving precise coordinate alignment between camera input and projector output required developing sophisticated calibration system using ArUco markers. Ensuring accurate mapping between detected object positions and projected interface elements while accounting for projection angles, camera perspectives, and coordinate system transformations presented ongoing geometric and computational challenges.

**6D Pose Estimation Accuracy & Stability**: Working with MediaPipe Objectron's limited object recognition (only 4 supported objects) and achieving stable rotation detection required extensive experimentation with confidence thresholds, processing parameters, and detection optimization. Balancing detection sensitivity with accuracy while maintaining real-time performance demanded continuous fine-tuning and performance analysis.

**System Setup & Hardware Configuration**: Creating reliable hardware setup with optimal projector positioning, camera mounting, and environmental considerations required addressing multiple technical constraints. Ensuring consistent performance across different hardware configurations while maintaining projection quality and tracking accuracy presented ongoing installation and deployment challenges.

**Python Environment Management & Dependencies**: Establishing reproducible development environment integrating TouchDesigner's specific Python version requirements with MediaPipe, OpenCV, and other dependencies required sophisticated environment management. Solving path configuration and library access issues while maintaining cross-platform compatibility demanded extensive troubleshooting and documentation.

**Real-time Processing Optimization**: Achieving smooth interactive experience required implementing multiple optimization strategies including video resolution scaling, region-of-interest cropping, parameter tuning, and processing pipeline optimization. Balancing visual quality, detection accuracy, and real-time responsiveness while preventing system lag or audio dropouts presented continuous performance engineering challenges.`,

    learnings: `**Advanced Computer Vision & Machine Learning Application**: This project provided hands-on experience with cutting-edge computer vision techniques, specifically 6D object pose estimation using MediaPipe Objectron. Learning to optimize machine learning model performance for real-time applications while understanding the underlying dataset creation and training methodologies became valuable knowledge applicable to any computer vision or ML project.

**Complex System Integration & Architecture Design**: Successfully coordinating multiple professional-grade software platforms (TouchDesigner, MediaPipe, Ableton Live) taught essential lessons about system architecture design, real-time data flow management, and inter-application communication protocols. These integration skills became directly applicable to any project requiring coordination of diverse technology stacks.

**Real-time Interactive Media Development**: Creating responsive interactive experiences requiring millisecond-level latency taught crucial lessons about performance optimization, resource management, and user experience design in real-time applications. Understanding how to balance computational complexity with interactive responsiveness became essential knowledge for any interactive media or performance technology development.

**Creative Technology & Artistic Programming**: Developing technology specifically for artistic expression and performance applications highlighted the unique challenges of creative technology development, including user experience design for non-traditional interfaces, aesthetic considerations in technical implementation, and the intersection of artistic vision with technical constraints.

**Hardware Integration & Physical Computing**: Working with cameras, projectors, and physical calibration systems provided practical experience in hardware integration, coordinate system transformations, and physical computing challenges. These skills became applicable to any project involving real-world hardware coordination and spatial computing applications.

**TouchDesigner Visual Programming Mastery**: Learning TouchDesigner's node-based visual programming paradigm demonstrated alternative approaches to software development beyond traditional coding. Understanding how to create complex processing pipelines through visual programming became valuable for rapid prototyping and multimedia application development.

**Academic Research & Technical Documentation**: Conducting comprehensive research into computer vision techniques, documenting complex technical processes, and presenting findings in academic format taught essential skills for technical communication, research methodology, and knowledge transfer applicable to any professional technical role.

**Performance Technology & Live Audio-Visual Systems**: Creating technology for real-time performance applications taught important lessons about reliability, user experience under performance pressure, and the unique requirements of live audio-visual systems. These insights became applicable to any technology designed for live performance, broadcasting, or real-time creative applications.`,
  },

  // =============================================================================
  // PROJECT METADATA
  // =============================================================================
  metadata: {
    featured: true,
    status: 'live',
    lastUpdated: '2023-12',
    tags: [
      'computer-vision',
      '6d-pose-estimation',
      'mediapipe-objectron',
      'touchdesigner-programming',
      'ableton-live-integration',
      'real-time-processing',
      'interactive-media',
      'projection-mapping',
      'audio-visual-programming',
      'creative-technology',
      'human-computer-interaction',
      'tangible-interfaces',
      'augmented-reality',
      'performance-technology',
      'python-opencv',
      'academic-research',
      'harvard-extension',
      'graduate-project',
      'innovative-interaction-design',
      'multi-technology-integration',
    ],
    difficulty: 'advanced',
  },
};
