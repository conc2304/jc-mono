import { ProjectData } from '@jc/ui-components';

export const projectJawaProject: ProjectData = {
  // =============================================================================
  // CORE PROJECT INFORMATION
  // =============================================================================
  id: 'simplisafe-project-jawa',
  projectName: 'Project Jawa - SimpliSafe Fulfillment System Redesign',
  slug: 'project-jawa',

  // =============================================================================
  // PROJECT BASICS
  // =============================================================================
  basics: {
    type: 'professional',
    category: 'web',
    subcategories: [
      'full-stack',
      'ui-ux',
      'backend-apis',
      'warehouse-systems',
      'enterprise-software',
      'user-research',
      'business-intelligence',
    ],
    description:
      "Complete redesign and replacement of SimpliSafe's legacy Flash-based fulfillment software with a modern web application that enables over-the-air sensor pairing, real-time inventory tracking, advanced barcode validation, and comprehensive analytics for warehouse operations.",
    context: 'SimpliSafe Inc. - Boston-based home security technology company',
  },

  // =============================================================================
  // TECHNICAL DETAILS
  // =============================================================================
  technical: {
    technologies: [
      'Frontend UI Development', // Specific tech stack not specified in available docs
      'Angular.js',
      'Drupal',
      'PHP',
      'MySQL',
      'Backend APIs',
      'Web Services',
      'Database Systems',
      'Barcode Scanning Integration',
      'Wireless Communication Protocols',
      'Real-time Data Processing',
      'Analytics & Reporting',
      'User Authentication Systems',
      'Inventory Management Systems',
      'Quality Assurance Testing',
      'Enterprise Integration',
    ],
    timeline: {
      startDate: undefined, // Not specified in available documentation
      endDate: undefined, // Not specified in available documentation
      duration: undefined, // Would need clarification from user
    },
    myRole:
      'Technical and Design Lead - Full-stack development, UX design, user research oversight, API development, business requirements definition',
    collaborators: [
      {
        name: 'SimpliSafe CEO',
        role: 'Executive Stakeholder & Requirements Definition',
        url: undefined,
      },
      {
        name: 'SimpliSafe COO',
        role: 'Operations Stakeholder & Business Requirements',
        url: undefined,
      },
      {
        name: 'Fulfillment Team',
        role: 'End Users & User Testing Participants',
        url: undefined,
      },
      {
        name: 'Warehouse Operations Staff',
        role: 'Subject Matter Experts & Process Consultants',
        url: undefined,
      },
    ],
  },

  // =============================================================================
  // MEDIA ASSETS
  // =============================================================================
  media: {
    thumbnail:
      'http://www.joseconchello.com/wp-content/uploads/2021/06/Jawa-UI-Home-view.png',
    screenshots: [
      {
        url: 'http://www.joseconchello.com/wp-content/uploads/2021/06/Jawa-UI-Home-view.png',
        alt: 'Project Jawa main dashboard interface showing modern web-based fulfillment system',
        caption:
          'Main dashboard view of the new web-based fulfillment system replacing legacy Flash software',
      },
      {
        url: 'http://www.joseconchello.com/wp-content/uploads/2020/02/Jawa-order-view.jpg',
        alt: 'Project Jawa order processing interface with barcode validation',
        caption:
          'Order processing view demonstrating improved barcode validation and device pairing workflow',
      },
    ],
    videos: [
      // No video content specified in available documentation
    ],
  },

  // =============================================================================
  // PROJECT LINKS
  // =============================================================================
  links: {
    liveDemo: undefined, // Internal enterprise software - no public demo
    repository: undefined, // Proprietary SimpliSafe code
    caseStudy: 'https://www.joseconchello.com/project-jawa',
    additionalLinks: [
      {
        title: 'SimpliSafe Company',
        url: 'https://simplisafe.com/',
        type: 'other',
      },
      {
        title: 'SimpliSafe Home Security Systems',
        url: 'https://simplisafe.com/alarm-sensors',
        type: 'documentation',
      },
      {
        title: 'SimpliSafe LinkedIn',
        url: 'https://www.linkedin.com/company/simplisafe',
        type: 'other',
      },
    ],
  },

  // =============================================================================
  // PROJECT CONTENT & NARRATIVE
  // =============================================================================
  content: {
    overview: `Project Jawa represented a critical digital transformation initiative for SimpliSafe, completely redesigning and replacing the company's legacy Flash-based fulfillment software with a modern, web-based solution. As Technical and Design Lead working directly with CEO and COO stakeholders, I spearheaded the development of a comprehensive system that revolutionized SimpliSafe's warehouse operations and significantly improved customer experience.

The project addressed fundamental challenges in SimpliSafe's fulfillment process, where sensors and security devices needed to be pre-paired with base stations before shipping to customers. The legacy Flash-based system created numerous operational inefficiencies, validation errors, and customer support issues that directly impacted SimpliSafe's ability to scale their home security business effectively.

Project Jawa delivered a modern web application enabling over-the-air sensor pairing, real-time inventory tracking, advanced barcode validation, and comprehensive analytics. The system fundamentally transformed how fulfillment representatives processed orders, eliminated silent pairing failures, and created a more resilient, scalable foundation for SimpliSafe's rapidly growing customer base.`,

    process: `**Requirements Definition & Stakeholder Collaboration**: Working directly with SimpliSafe's CEO and COO, I led the process of defining comprehensive project requirements that balanced technical feasibility with business objectives. This executive-level collaboration ensured the solution aligned with SimpliSafe's strategic goals while addressing immediate operational pain points.

**User Research & Process Analysis**: I oversaw and implemented comprehensive user experience research with fulfillment representatives to understand existing workflows, identify friction points, and uncover the root causes of fulfillment errors. This research revealed that validation issues stemmed not from user negligence but from fundamental limitations in the barcode system and software architecture.

**System Architecture & Technical Design**: The project required designing a complete replacement for the Flash-based system, including frontend user interfaces, backend APIs, database architecture, and integration with SimpliSafe's existing hardware and business systems. I developed the technical architecture to support real-time device pairing, inventory tracking, and analytics while ensuring scalability for SimpliSafe's growth trajectory.

**Barcode Validation Innovation**: A critical breakthrough came from implementing an enhanced barcode format that enabled the system to identify exactly what device types were being scanned. This eliminated the previous dependency on precise scanning order and allowed fulfillment representatives to scan devices in any sequence while maintaining accurate pairing.

**Frontend Development & UX Design**: I designed and developed intuitive user interface components that streamlined the fulfillment workflow, reduced cognitive load on operators, and provided clear visual feedback for successful operations. The interface design prioritized speed and accuracy for high-volume warehouse operations.

**Backend Development & API Integration**: Developed robust backend services and APIs to handle device pairing communications, inventory management, real-time status updates, and comprehensive reporting. The system needed to reliably communicate with SimpliSafe's base stations and maintain data integrity across all fulfillment operations.`,

    results: `Project Jawa delivered transformative results across multiple dimensions of SimpliSafe's business operations:

**Operational Efficiency Improvements**:
• Significantly faster order fulfillment times through streamlined scanning workflows and elimination of order-dependent device processing
• Dramatic reduction in fulfillment errors caused by device pairing mismatches and validation failures
• Enhanced inventory tracking capabilities providing real-time visibility into warehouse operations and device availability
• Comprehensive analytics dashboard enabling data-driven business decisions and operational optimization

**Customer Experience Enhancement**:
• Reduced customer support calls related to device pairing issues, as pre-pairing became more reliable and accurate
• Improved customer satisfaction through faster order processing and more reliable device functionality upon delivery
• Enhanced system reliability reducing instances where customers received improperly paired security systems

**Technical & Business Impact**:
• Successfully eliminated dependency on deprecated Flash technology, future-proofing SimpliSafe's fulfillment operations
• Created scalable foundation supporting SimpliSafe's rapid growth from startup to protecting millions of customers
• Enabled over-the-air device pairing capabilities, positioning SimpliSafe for advanced wireless communication features
• Established robust data collection capabilities for business intelligence and operational optimization

**Process Transformation**:
• Revolutionized fulfillment workflows by removing order-dependency requirements for device scanning
• Implemented intelligent barcode validation that provides immediate feedback on device types and compatibility
• Created user-friendly interfaces that reduced training time for new fulfillment staff and minimized human error
• Established foundation for continuous improvement through comprehensive analytics and reporting capabilities`,

    challenges: `**Legacy System Integration & Migration**: Replacing a critical Flash-based system while maintaining 100% operational uptime required careful planning, phased rollouts, and robust fallback mechanisms. The migration needed to occur without disrupting SimpliSafe's fulfillment operations or impacting customer deliveries.

**Hardware-Software Integration Complexity**: Creating reliable over-the-air communication between web-based software and SimpliSafe's base stations and sensors required deep understanding of wireless protocols, device communication standards, and error handling for various failure scenarios.

**Barcode System Redesign & Validation**: The existing barcode format provided insufficient information for proper device identification and validation. Developing a new barcode system required coordination across multiple business units and careful consideration of backward compatibility with existing inventory.

**High-Volume Operational Requirements**: The system needed to support high-throughput warehouse operations with multiple concurrent users processing orders simultaneously. Performance optimization and real-time synchronization became critical technical challenges requiring sophisticated architecture design.

**User Experience Design for Operational Efficiency**: Designing interfaces for warehouse environments required understanding unique user needs: speed, accuracy under pressure, minimal training requirements, and clear error communication. Balancing comprehensive functionality with operational simplicity demanded extensive user research and iterative design.

**Executive Stakeholder Management**: Working directly with CEO and COO stakeholders required translating technical concepts into business impact, managing competing priorities, and ensuring solution alignment with strategic company objectives while maintaining technical integrity.

**Data Integrity & Error Recovery**: Developing robust error handling for device pairing failures, communication interruptions, and data synchronization issues while maintaining comprehensive audit trails for quality assurance and troubleshooting.`,

    learnings: `**Executive-Level Stakeholder Collaboration**: Working directly with CEO and COO provided invaluable experience in translating technical solutions into business value, understanding strategic decision-making processes, and communicating complex technical concepts to executive audiences. This experience reinforced the importance of aligning technical solutions with broader business objectives.

**Enterprise Software Development & Operations**: Developing mission-critical software for warehouse operations taught crucial lessons about system reliability, performance optimization, user experience design for operational environments, and the business impact of technical decisions. Understanding how software failures directly affect customer experience became a guiding principle.

**User-Centered Design for Operational Efficiency**: Conducting user research with fulfillment representatives revealed how small UX improvements can dramatically impact operational efficiency and error rates. This experience highlighted the importance of designing for actual user workflows rather than theoretical use cases.

**Full-Stack Technical Leadership**: Leading both frontend and backend development while overseeing user research and stakeholder management demonstrated the value of technical breadth in complex projects. The ability to understand and optimize across the entire technical stack enabled more effective architectural decisions and problem-solving.

**Hardware-Software Integration**: Working with SimpliSafe's wireless devices and base stations provided deep insights into IoT communication protocols, device pairing mechanisms, and the challenges of creating reliable software-hardware interactions at scale.

**Legacy System Modernization**: Successfully replacing Flash-based software taught valuable lessons about migration strategies, technology sunset planning, and maintaining operational continuity during major system transitions. This experience became applicable to numerous subsequent modernization projects.

**Data-Driven Business Intelligence**: Implementing analytics and reporting capabilities revealed how proper data architecture can transform operational decision-making and enable continuous improvement processes. Understanding the relationship between data collection, analysis, and business outcomes became a key competency.

**Process Optimization Through Technology**: The project demonstrated how thoughtful software design can fundamentally improve business processes, reduce human error, and create scalable operational foundations. This reinforced the strategic value of technology investments in operational efficiency.`,
  },

  // =============================================================================
  // PROJECT METADATA
  // =============================================================================
  metadata: {
    featured: true,
    status: 'live', // Likely still in use at SimpliSafe
    lastUpdated: undefined, // Would need clarification from user
    tags: [
      'full-stack-development',
      'enterprise-software',
      'warehouse-management',
      'iot-integration',
      'barcode-systems',
      'user-experience-research',
      'legacy-system-modernization',
      'executive-stakeholder-management',
      'operational-efficiency',
      'home-security-technology',
      'wireless-communication',
      'inventory-management',
      'business-intelligence',
      'flash-replacement',
      'device-pairing',
      'quality-assurance',
      'scalable-architecture',
      'real-time-systems',
      'process-optimization',
      'technical-leadership',
    ],
    difficulty: 'advanced',
  },
};
