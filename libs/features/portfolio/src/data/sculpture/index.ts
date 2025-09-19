import { BaseImageData } from '@jc/ui-components';

export interface Sculpture {
  id: number;
  title: string;
  subtitle?: string;
  date: string;
  materials: string;
  images: BaseImageData[];
  description: string;
}

export const sculpturesData: Sculpture[] = [
  {
    id: 1,
    title: 'Hoodie Scarves',
    subtitle:
      'Burning Man Edition with Audio Reactive LEDs and City Chic Edition in Tweed',
    date: 'Summer 2019',
    materials:
      'Wool, Faux Fur, Faux Leather, (BM edition – Batting, Sequin, Arduino Nano, NeoPixel Strip)',
    images: [],
    description:
      'I grew up in a household where, for years, my mom would sew my Halloween costumes using a sewing machine her mother gave her. For years I had been obsessed and inspired with sleeveless clothing with hoods. With my first trip to Burning Man approaching, I was determined to make my own hoody scarf truly unique. I not only wanted to be seen in the darkness of the desert, but I also wanted my hood to interact with noisy world it was about to be placed into.',
  },
  {
    id: 2,
    title: 'Square Peg',
    date: 'Fall 2018',
    materials: 'Colorado Alabaster',
    images: [],
    description:
      'Square Peg is the first piece to emerge after my Body Positivity exploration where I had begun to explore a form that was captivating me. With Square Peg my goal was to be process driven, and precision oriented. Melding the precision of a square with the organic yet mechanical presence of a circle, the two shapes that contrast each other so starkly become one.',
  },
  {
    id: 3,
    title: 'Belly Love',
    date: 'Summer 2018',
    materials: 'Colorado Alabaster',
    images: [],
    description:
      "As the last piece in my iterative exploration of the celebration of the inclusivity of the natural human body I place my focus and my frame on the belly. The belly, which many of us are ashamed of or embarrassed about, is brought into focus and is framed by the idea of an exaggerated 'muffin top' which we are all so self conscious about. But rather than being ashamed of it, The Belly celebrates it with a triumphant a playful pose that saying here I am.",
  },
  {
    id: 4,
    title: 'Healthy Heart',
    date: 'Spring 2017',
    materials: 'Colorado Alabaster',
    images: [],
    description:
      "Healthy Heart iterates on Rolls' exploration of the voluptuousness of the human body. This piece brings body positivity to heart by both literally and figuratively. Here we see a heart as the foundation being punctuated and accented by soft curves reminiscent of a belly and sumptuous rolls and folds that celebrate the natural human form.",
  },
  {
    id: 5,
    title: 'Rolls',
    date: 'Spring 2016',
    materials: 'Colorado Alabaster',
    images: [],
    description:
      'In this piece I start exploring new tools and techniques including diamond needle files in order to be able to create more voluptuous curves and folds. With rolls I begin looking at parts of the human form and finding ways to abstract out less desirable traits, like body fat rolls, and intersperse them into the natural shape of the stone. Rolls celebrates the idea of body positivity through its motif of voluptuous rolls.',
  },
  {
    id: 6,
    title: 'Intersections',
    date: 'Fall 2010',
    materials: 'Colorado Alabaster and Red Oak',
    images: [],
    description:
      'Intersections explores the juxtaposition of a traditionally hard, jagged material like stone being softened and rounded out to be given human like curvatures and suppleness while wood, a raw material traditionally organic in shape is is given a very machined and sharp feel. The play between the materials is then heightened by having the oak perfectly and seamlessly pierce through stone.',
  },
  {
    id: 7,
    title: 'Spinal Fossil',
    date: 'Fall 2010',
    materials: 'Colorado Alabaster',
    images: [],
    description:
      'Spinal Fossil seeks to play with the contrast between the refined and polished parts of the stone with those parts which have been left raw. The general shape loosely resembles that of a vertebra with the raw stone sections acting like encroaching osteoporosis speaks to the raw fragility of even the most durable natural materials.',
  },
  {
    id: 8,
    title: 'Handsome',
    date: 'Fall 2009',
    materials: 'Plaster and Spray Paint',
    images: [],
    description:
      "Part of a college assignment where students were given a random word to sculpt using plaster as a reductive medium. When researching the word 'Handsome' many images and shapes came to mind. 'Handsome' explores the architecture of a birds skull, full of contrasting soft and strong lines intermixing.",
  },
];
