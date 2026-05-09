import { BaseImageData } from '@jc/ui-components';
import { R2_PROJECT_DIR_GALLERY } from '../art-gallery/constants';

export interface Sculpture {
  id: number;
  title: string;
  subtitle?: string;
  date: string;
  materials: string;
  images: BaseImageData[];
  description: string;
}

const projectDir = 'sculpture';
const baseRelativePath = `${R2_PROJECT_DIR_GALLERY}/${projectDir}`;
const path = (filename: string) => `${baseRelativePath}/${filename}`;

export const sculpturesData: Sculpture[] = [
  {
    id: 50,
    title: 'The Ancient Softness',
    date: 'Summer 2020',
    materials: 'Colorado Alabaster',
    description:
      'The first sculpture in the Broken Dreams series, The Ancient Softness explores organic emergence, erosion, and vulnerability through hand-carved Colorado alabaster. Its flowing voids and biomorphic contours suggest something both ancient and unfamiliar — a primordial form suspended between fossil, organism, and memory. This original sculpture later fractured, becoming the source form for the subsequent Broken Dreams works.',

    images: [
      {
        relativePath: path(
          'Broken Dreams 1 - The Ancient Softness 001 - front view studio light.jpg'
        ),
        alt: 'Front studio view of The Ancient Softness alabaster sculpture',
        caption: 'Front studio view',
      },

      {
        relativePath: path(
          'Broken Dreams 1 - The Ancient Softness 003 - close up top view studio light.jpg'
        ),
        alt: 'Close-up top detail of The Ancient Softness showing organic openings and alabaster marbling',
        caption: 'Close-up top detail',
      },

      {
        relativePath: path(
          'Broken Dreams 1 - The Ancient Softness 003 - side view studio light.jpg'
        ),
        alt: 'Side studio view of The Ancient Softness alabaster sculpture',
        caption: 'Side studio view',
      },

      {
        relativePath: path(
          'Broken Dreams 1 - The Ancient Softness - 100 process late quarter profile.jpg'
        ),
        alt: 'Late-stage process view of The Ancient Softness from a quarter profile angle',
        caption: 'Late-stage process — quarter profile',
      },

      {
        relativePath: path(
          'Broken Dreams 1 - The Ancient Softness - 101 process on table with hammer.jpg'
        ),
        alt: 'Process photograph of The Ancient Softness on worktable with carving tools and hammer',
        caption: 'Studio carving process',
      },

      {
        relativePath: path(
          'Broken Dreams 1 - The Ancient Softness - 102 process late font view.jpg'
        ),
        alt: 'Late-stage front process view of The Ancient Softness sculpture',
        caption: 'Late-stage process — front view',
      },

      {
        relativePath: path(
          'Broken Dreams 1 - The Ancient Softness - 104 process quarter profile.jpg'
        ),
        alt: 'Quarter profile process view of The Ancient Softness during carving',
        caption: 'Process — quarter profile',
      },

      {
        relativePath: path(
          'Broken Dreams 1 - The Ancient Softness - 107 process early top view.jpg'
        ),
        alt: 'Early-stage top process view of The Ancient Softness alabaster sculpture',
        caption: 'Early-stage process — top view',
      },

      {
        relativePath: path(
          'Broken Dreams 1 - The Ancient Softness - 108 process top quarter profile.jpg'
        ),
        alt: 'Top quarter profile process photograph of The Ancient Softness',
        caption: 'Process — top quarter profile',
      },

      {
        relativePath: path(
          'Broken Dreams 1 - The Ancient Softness - 109 process mid-stage quarter profileJPG.JPG'
        ),
        alt: 'Mid-stage quarter profile process view of The Ancient Softness sculpture',
        caption: 'Mid-stage process — quarter profile',
      },

      {
        relativePath: path(
          'Broken Dreams 1 - The Ancient Softness - 111 process mid-stage  quarter profile.jpg'
        ),
        alt: 'Mid-stage carving process of The Ancient Softness from a quarter profile angle',
        caption: 'Mid-stage carving process',
      },
    ],
  },
  {
    id: 100,
    title: 'Mossy Lady',
    date: 'Fall 2025',
    materials: 'Colorado Alabaster,  Preserved & Artificial Moss',
    description:
      'This piece is my first exploration into the use of moss as part of the sculptural process and represents my love for nature and mossy areas in particular. This piece started by ignoring a large fracture in the stone while chasing a particular shape for years, which led to the larger stone fracturing into 3 major pieces. Part 3 of 3 of the Broken Dreams Series.',
    images: [
      {
        relativePath: path('Mossy-Lady-01-profile-view.jpg'),
        alt: 'Profile view of Mossy Lady alabaster sculpture with preserved moss accents',
        caption:
          'Profile view highlighting the flowing silhouette and moss-covered surface details.',
      },
      {
        relativePath: path('Mossy-Lady-02-front-quarter-view.jpg'),
        alt: 'Front quarter view of Mossy Lady sculpture in Colorado alabaster and moss',
        caption:
          'Front quarter view showing the organic form and contrasting stone and moss textures.',
      },
      {
        relativePath: path('Mossy-Lady-03-back-quarter-view.jpg'),
        alt: 'Back quarter view of Mossy Lady stone sculpture with moss elements',
        caption:
          'Rear angle revealing fractures, contours, and the integration of moss into the sculpture.',
      },
      {
        relativePath: path('Mossy-Lady-04-close-up-top-view.jpg'),
        alt: 'Close-up top view of Mossy Lady sculpture surface and moss detail',
        caption:
          'Close-up from above emphasizing the layered textures of alabaster and moss.',
      },
      {
        relativePath: path('Mossy-Lady-05-close-up-top-view-detail.jpg'),
        alt: 'Detailed close-up of moss and alabaster textures on Mossy Lady sculpture',
        caption:
          'Detailed surface study capturing the tactile contrast between polished stone and soft moss.',
      },
    ],
  },
  {
    id: 150,
    title: 'Knobber',
    date: 'Spring 2025',
    description:
      'An exercise in using the entire stone and finding beauty in the broken. This piece emerged from what would have been the lower half of Mossy Lady, formed from one of the major fragments of the original fractured sculpture. Part 2 of 3 of the Broken Dreams Series.',
    materials: 'Colorado Alabaster',
    images: [
      {
        relativePath: path('Knobber-01-front-view.JPG'),
        alt: 'Front view of Knobber alabaster sculpture',
        caption:
          'Front view emphasizing the organic contours and fractured origins of the form.',
      },

      {
        relativePath: path('Knobber-02-left-quarter-view.JPG'),
        alt: 'Left quarter view of Knobber Colorado alabaster sculpture',
        caption:
          'Left quarter view revealing the asymmetrical carving and natural stone patterns.',
      },

      {
        relativePath: path('Knobber-03-right-quarter-view.JPG'),
        alt: 'Right quarter view of Knobber abstract alabaster sculpture',
        caption:
          'Right quarter view highlighting the sculptural balance and polished alabaster surface.',
      },
    ],
  },
  {
    id: 200,
    title: 'Square Peg',
    date: 'Fall 2018',
    materials: 'Colorado Alabaster',
    images: [
      {
        relativePath: path('square-hole.jpg'),
        alt: 'White Alabaster Sculpture of Square Hole - Front View',
        caption: 'White Alabaster Sculpture of Square Hole - Front View',
      },
      {
        relativePath: path('Square-Peg-Profile.jpg'),
        alt: 'White Alabaster Sculpture of Square Hole - Side View',
        caption: 'White Alabaster Sculpture of Square Hole - Side View',
      },
    ],
    description:
      'Square Peg is the first piece to emerge after my Body Positivity exploration where I had begun to explore a form that was captivating me. With Square Peg my goal was to be process driven, and precision oriented. Melding the precision of a square with the organic yet mechanical presence of a circle, the two shapes that contrast each other so starkly become one.',
  },
  {
    id: 300,
    title: 'Belly Love',
    date: 'Summer 2018',
    materials: 'Colorado Alabaster',
    images: [
      {
        relativePath: path('belly-button-cropped.jpg'),
        alt: 'White Alabaster Sculpture of Belly Love - Close Up Quarter View',
        caption:
          'White Alabaster Sculpture of Belly Love - Close Up Quarter View',
      },
      {
        relativePath: path('belly-button2-cropped.jpg'),
        alt: 'White Alabaster Sculpture of Belly Love - Front View',
        caption: 'White Alabaster Sculpture of Belly Love - Front  View',
      },
    ],
    description:
      "As the last piece in my iterative exploration of the celebration of the inclusivity of the natural human body I place my focus and my frame on the belly. The belly, which many of us are ashamed of or embarrassed about, is brought into focus and is framed by the idea of an exaggerated 'muffin top' which we are all so self conscious about. But rather than being ashamed of it, The Belly celebrates it with a triumphant a playful pose that saying here I am.",
  },
  {
    id: 400,
    title: 'Healthy Heart',
    date: 'Spring 2017',
    materials: 'Colorado Alabaster',
    images: [
      {
        relativePath: path('heart-thing.jpg'),
        alt: 'White Alabaster Sculpture of Healthy Heart - Front Quarter View',
        caption:
          'White Alabaster Sculpture of Healthy Heart - Front Quarter View',
      },
      {
        relativePath: path('heart-thing2.jpg'),
        alt: 'White Alabaster Sculpture of Healthy Heart - Side View',
        caption: 'White Alabaster Sculpture of Healthy Heart - Side View',
      },
    ],
    description:
      "Healthy Heart iterates on Rolls' exploration of the voluptuousness of the human body. This piece brings body positivity to heart by both literally and figuratively. Here we see a heart as the foundation being punctuated and accented by soft curves reminiscent of a belly and sumptuous rolls and folds that celebrate the natural human form.",
  },
  {
    id: 500,
    title: 'Rolls',
    date: 'Spring 2016',
    materials: 'Colorado Alabaster',
    images: [
      {
        relativePath: path('worm-dude-profile-black.jpg'),
        alt: 'Spotted Alabaster Sculpture of Rolls - Front Quarter View',
        caption: 'Spotted Alabaster Sculpture of Rolls - Front Quarter View',
      },
      {
        relativePath: path('worm-dude-side-profile-black.jpg'),
        alt: 'Spotted Alabaster Sculpture of Rolls - Side View',
        caption: 'Spotted Alabaster Sculpture of Rolls - Side View',
      },
    ],
    description:
      'In this piece I start exploring new tools and techniques including diamond needle files in order to be able to create more voluptuous curves and folds. With rolls I begin looking at parts of the human form and finding ways to abstract out less desirable traits, like body fat rolls, and intersperse them into the natural shape of the stone. Rolls celebrates the idea of body positivity through its motif of voluptuous rolls.',
  },
  {
    id: 600,
    title: 'Intersections',
    date: 'Fall 2010',
    materials: 'Colorado Alabaster and Red Oak',
    images: [
      {
        relativePath: path('intersections-stone-sculpture-side-view.jpg'),
        alt: 'Spotted Alabaster and Red Oak Sculpture of InterSections - Front Quarter View',
        caption:
          'Spotted Alabaster and Red Oak Sculpture of InterSections - Front Quarter View',
      },
      {
        relativePath: path('Intersections2_alabaster.jpg'),
        alt: 'Spotted Alabaster and Red Oak Sculpture of InterSections - Side View',
        caption:
          'Spotted Alabaster and Red Oak Sculpture of InterSections - Side View',
      },
    ],
    description:
      'Intersections explores the juxtaposition of a traditionally hard, jagged material like stone being softened and rounded out to be given human like curvatures and suppleness while wood, a raw material traditionally organic in shape is is given a very machined and sharp feel. The play between the materials is then heightened by having the oak perfectly and seamlessly pierce through stone.',
  },
  {
    id: 700,
    title: 'Spinal Fossil',
    date: 'Fall 2010',
    materials: 'Colorado Alabaster',
    images: [
      {
        relativePath: path('spinal-fossil-mirror-base-side-view.jpg'),
        alt: 'Grey Veined Alabaster Sculpture of Spinal Fossil - Front View',
        caption:
          'Grey Veined Alabaster Sculpture of Spinal Fossil - Front View',
      },
      {
        relativePath: path(
          'spinal-fossil-stone-sculpture-mirror-quarter view.jpg'
        ),
        alt: 'Grey Veined Alabaster Sculpture of Spinal Fossil - Quarter View',
        caption:
          'Grey Veined Alabaster Sculpture of Spinal Fossil - Quarter View',
      },
    ],
    description:
      'Spinal Fossil seeks to play with the contrast between the refined and polished parts of the stone with those parts which have been left raw. The general shape loosely resembles that of a vertebra with the raw stone sections acting like encroaching osteoporosis speaks to the raw fragility of even the most durable natural materials.',
  },
  {
    id: 800,
    title: 'Handsome',
    date: 'Fall 2009',
    materials: 'Plaster and Spray Paint',
    images: [
      {
        relativePath: path('handsome-sculpture-01.jpg'),
        alt: 'Bird skull inspired plaster sculpture - Front View',
        caption: 'Bird skull inspired plaster sculpture - Front  View',
      },
      {
        relativePath: path('handsome-sculpture-02.jpg'),
        alt: 'Bird skull inspired plaster sculpture - Quarter View',
        caption: 'Bird skull inspired plaster sculpture - Quarter View',
      },
      {
        relativePath: path('handsome-sculpture-side-view.jpg'),
        alt: 'Bird skull inspired plaster sculpture - Side View',
        caption: 'Bird skull inspired plaster sculpture - Side View',
      },
    ],
    description:
      "Part of a college assignment where students were given a random word to sculpt using plaster as a reductive medium. When researching the word 'Handsome' many images and shapes came to mind. 'Handsome' explores the architecture of a birds skull, full of contrasting soft and strong lines intermixing.",
  },

  {
    id: 850,
    title: 'Envy',
    date: 'Fall 2009',
    materials: 'Plaster and Spray Paint',
    images: [
      {
        relativePath: path('envy-sculpture-above-red-ligthing.jpg'),
        alt: 'Envy inspired plaster sculpture - TOp View',
        caption: 'Envy inspired plaster sculpture - TOp  View',
      },
      {
        relativePath: path('envy-sculpture-mirror-base.jpg'),
        alt: 'Envy inspired plaster sculpture - Quarter View',
        caption: 'Envy inspired plaster sculpture - Quarter View',
      },
      {
        relativePath: path('envy-sculpture-plaster-mirror-base-front-view.jpg'),
        alt: 'Envy inspired plaster sculpture - Front View',
        caption: 'Envy inspired plaster sculpture - Front View',
      },
    ],
    description:
      'Part of a college assignment through the University of Oklahoma’s sculpture department, where students were given a random word to sculpt using plaster as a reductive medium. They say that “jealousy is in the eyes of the beholder”, with that in mind I strove to create a shape of wanting and reaching , with the two arms pulling for each other. With jealousy we tend to want what we can’t have or maybe even are not supposed to have. I wanted to play with this idea by having the pupil of the play the role of a treasure that Indiana Jones would be seen taking and running away with. Something in the middle to want to covet at all cost.',
  },
  {
    id: 900,
    title: 'Hoodie Scarves',
    subtitle:
      'Burning Man Edition with Audio Reactive LEDs and City Chic Edition in Tweed',
    date: 'Summer 2019',
    materials:
      'Wool, Faux Fur, Faux Leather, (BM edition – Batting, Sequin, Arduino Nano, NeoPixel Strip)',
    images: [
      {
        relativePath: path('hoodie-scarf-wool.jpeg'),
        alt: 'Light Grey Wool and White Faux Fur Hooded Scarf',
        caption: 'Light Grey Wool and White Faux Fur Hooded Scarf',
      },
      {
        relativePath: path('hoodie-scarf-red-blue.jpg'),
        alt: 'Hooded Scarf with internal LED lights in Red and Blue',
        caption: 'Hooded Scarf with internal LED lights in Red and Blue',
      },
      {
        relativePath: path('hooded-scarf-blue-light.jpg'),
        alt: 'Hooded Scarf with internal LED lights in blue',
        caption: 'Hooded Scarf with internal LED lights in blue',
      },
      {
        relativePath: path('hoodie-scarf-vid.gif'),
        alt: 'Video loop of hooded scarf with animated LED sequences',
        caption: 'Video loop of hooded scarf with animated LED sequences',
      },
    ],
    description:
      'I grew up in a household where, for years, my mom would sew my Halloween costumes using a sewing machine her mother gave her. For years I had been obsessed and inspired with sleeveless clothing with hoods. With my first trip to Burning Man approaching, I was determined to make my own hoody scarf truly unique. I not only wanted to be seen in the darkness of the desert, but I also wanted my hood to interact with noisy world it was about to be placed into.',
  },
];
