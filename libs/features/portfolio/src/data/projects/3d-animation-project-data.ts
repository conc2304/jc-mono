import { ProjectData } from '../../components';

export const dgmdE45AnimationProject: ProjectData = {
  // Core Information
  id: 'dgmd-e45-3d-animation',
  projectName: 'DGMD E-45: 3D Animation & VR Coursework',
  projectSubtitle: 'Character Animation, Modeling & Rendering',
  slug: 'dgmd-e45-3d-animation',

  // Basics
  basics: {
    type: 'school',
    category: '3d-animation',
    subcategories: ['3d-modeling', 'character-animation', 'rendering'],
    description:
      'Comprehensive 3D animation coursework including character performance animation, hard surface and organic modeling, rigging, and AR integration',
    context:
      'Harvard Extension School - DGMD E-45 Introduction to 3D Animation and Virtual Reality',
  },

  // Technical Details
  technical: {
    technologies: [
      'Autodesk Maya',
      'Arnold Renderer',
      'Unity',
      'Adobe Photoshop',
      'Adobe After Effects',
    ],
    timeline: {
      startDate: '2023-01',
      endDate: '2023-05',
      duration: '5 months',
    },
    myRole:
      'Student - 3D Generalist (modeling, rigging, animation, lighting, rendering)',
    collaborators: [
      {
        name: 'Jason Wiser',
        role: 'Instructor',
        url: undefined,
      },
    ],
  },

  // Media
  media: {
    hero: {
      relativePath: 'projects/3d-animation/11-second-film-intro-shot.jpg',
      alt: '11 Second Film - Health Problems - Opening shot of animated character',
      caption:
        '11 Second Film: "Health Problems" - Performance Animation Final Project',
    },
    screenshots: [
      {
        relativePath:
          'projects/3d-animation/11-second-film-still-3d-animation.jpg',
        alt: '11 Second Film character animation still frame',
        caption:
          'Character performance animation with facial expressions and full-body mechanics',
      },
      {
        relativePath: 'projects/3d-animation/cactus-apc40-3d-modelling.jpg',
        alt: 'Textured 3D models - APC40 MIDI controller and cactus',
        caption:
          'Hard surface (APC40) and organic (cactus) modeling with UV unwrapping and texturing',
      },
    ],
    videos: [
      {
        relativePath:
          'projects/3d-animation/Jose Conchello  - 11 Second Film _Health Problems_ - Final Project 2k Upscale.mp4',
        title: '11 Second Film: "Health Problems"',
        type: 'final',
        caption:
          'Performance animation reimagining an 11-second clip with character acting, prop interaction, and cinematography',
        detailedCaption:
          'Final project demonstrating the complete 3D film pipeline: storyboarding, blocking, character animation with the Eleven rig, lighting, rendering, and post-production',
      },
      {
        relativePath:
          'projects/3d-animation/Jose Conchello - Haunted Room - Final Project.mp4',
        title: 'Haunted Room - Introductory Project',
        type: 'final',
        caption:
          'Animated haunted room environment with camera animation and object interactions',
        detailedCaption:
          'First project: built from primitives, detailed modeling, object animation, and camera movement through the scene',
      },
      {
        relativePath:
          'projects/3d-animation/Jose Conchello - Object Turn Table FINAL  [APC 40 + Cactus].mp4',
        title: 'Object Turntable - Textured Models',
        type: 'demo',
        caption:
          'Turntable showcase of hard surface and organic models with full texturing',
        detailedCaption:
          'Showcasing UV unwrapping and PBR texturing with diffuse, specular, bump, and opacity maps',
      },
      {
        relativePath: 'projects/3d-animation/3d-Animation-walk-cycles.mp4',
        title: 'Walk Cycles & Character Animation',
        type: 'process',
        caption:
          'Character walk cycle animations and lift exercises using the Eleven rig',
        detailedCaption:
          'Practice animations demonstrating character mechanics, weight, and expressive movement',
      },
    ],
  },

  // Links
  links: {
    additionalLinks: [],
  },

  // Content
  content: {
    overview: [
      'Completed comprehensive coursework in 3D animation and virtual reality at Harvard Extension School, covering the full production pipeline from concept to final render.',
      'Projects included character performance animation, hard surface and organic modeling, texturing, rigging, lighting, and rendering using industry-standard tools and workflows.',
    ],
    process: [
      '**Haunted Room Project**: Built an animated environment from primitive shapes, refined object details, and created camera animations to explore scene composition and basic animation principles.',

      '**Textured Models**: Created two detailed 3D models - a hard surface object (APC40 MIDI controller) and an organic object (cactus). Developed UV unwrapping skills and applied PBR texturing with diffuse, specular, bump, and opacity maps.',

      '**Character Animation**: Practiced animation fundamentals using the industry-standard Eleven rig, creating in-place walk cycles and lift animations to understand weight, timing, and character mechanics.',

      '**11 Second Film - "Health Problems"**: Executed the complete 3D film pipeline over 6 weeks:',
      '• Pre-production: Created storyboards and shot lists',
      '• Blocking: Built primitive sets, animated character proxy and camera cuts',
      '• Animation: Replaced proxy with Eleven rig, animated root position, core, limbs, hands, and facial expressions',
      '• Finishing: Refined lighting, rendered with Arnold, applied post-production and audio',

      '**Augmented Reality**: Prepared and imported 3D scenes as AR projects using Unity, bridging the gap between animation and interactive experiences.',
    ],
    learnings: [
      "Gained hands-on experience with Autodesk Maya's core toolsets including polygon modeling, UV unwrapping, rigging, animation, lighting, and Arnold rendering.",
      'Developed understanding of the professional 3D animation pipeline from concept through final delivery.',
      'Learned to solve visual storytelling problems through camera work, blocking, and character performance.',
      'Built skills in both hard surface and organic modeling with proper topology and texturing workflows.',
      'Practiced iterative refinement through playblasting, peer feedback, and revision cycles.',
    ],
    challenges: [
      'Managing the time-intensive nature of 3D animation while maintaining quality across multiple concurrent projects.',
      "Learning Maya's complex interface and workflow as a first 3D software package.",
      'Balancing technical constraints (render times, polygon budgets) with creative vision.',
      'Achieving believable character performance animation with proper weight, timing, and expression.',
    ],
  },

  // Metadata
  metadata: {
    featured: true,
    status: 'archived',
    lastUpdated: '2023-05',
    tags: [
      'character-animation',
      'modeling',
      'texturing',
      'rigging',
      'lighting',
      'rendering',
      'cinematography',
      'storytelling',
      'AR',
      'Unity',
      'Maya',
      'Arnold',
    ],
    difficulty: 'intermediate',
  },
};
