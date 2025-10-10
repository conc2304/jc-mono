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

// const directoryPath = 'portfolio-media/gallery/sculpture'

const projectDir = 'sculpture';
const baseRelativePath = `${R2_PROJECT_DIR_GALLERY}/${projectDir}`;
const path = (filename: string) => `${baseRelativePath}/${filename}`;

export const sculpturesData: Sculpture[] = [
  {
    id: 1,
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
  {
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
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
    id: 6,
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
    id: 7,
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
    id: 8,
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
    id: 8,
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
];
