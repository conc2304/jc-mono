import { generateGradientId, type Gradient } from '@jc/utils';

export const defaultColors = [
  '#000000',
  '#ffffff',
  '#ff0000',
  '#ff8900',
  '#fbff00',
  '#5CFF00',
  '#006d5b',
  '#00FFB8',
  '#00B8FF',
  '#002eff',
  '#5900ff',
  '#e600ff',
  '#ff008c',
];

export const defaultGradients: Gradient[] = [
  {
    stops: [
      { id: 1, color: '#FF0000', position: 0 },
      { id: 2, color: '#000000', position: 25 },
      { id: 3, color: '#00FF00', position: 50 },
      { id: 4, color: '#000000', position: 75 },
      { id: 5, color: '#0000FF', position: 100 },
    ],
  },
  {
    stops: [
      { id: 1, color: '#000000', position: 0 },
      { id: 2, color: '#0080FF', position: 30 },
      { id: 3, color: '#FF00FF', position: 60 },
      { id: 4, color: '#FF0080', position: 80 },
      { id: 5, color: '#000000', position: 100 },
    ],
  },
  {
    stops: [
      { id: 1, color: '#00FF00', position: 0 },
      { id: 2, color: '#000000', position: 33 },
      { id: 3, color: '#FFFF00', position: 50 },
      { id: 4, color: '#000000', position: 67 },
      { id: 5, color: '#00FF00', position: 100 },
    ],
  },
  {
    stops: [
      { id: 1, color: '#8000FF', position: 0 },
      { id: 2, color: '#FF0080', position: 25 },
      { id: 3, color: '#FF4500', position: 50 },
      { id: 4, color: '#FFD700', position: 75 },
      { id: 5, color: '#FFFF00', position: 100 },
    ],
  },
  {
    stops: [
      { id: 1, color: '#00FFFF', position: 0 },
      { id: 2, color: '#000000', position: 20 },
      { id: 3, color: '#FFFFFF', position: 40 },
      { id: 4, color: '#000000', position: 60 },
      { id: 5, color: '#00FFFF', position: 80 },
      { id: 6, color: '#000000', position: 100 },
    ],
  },
  {
    stops: [
      { id: 1, color: '#000000', position: 0 },
      { id: 2, color: '#8B0000', position: 25 },
      { id: 3, color: '#FF0000', position: 50 },
      { id: 4, color: '#FF8C00', position: 75 },
      { id: 5, color: '#FFFF00', position: 100 },
    ],
  },
  {
    stops: [
      { id: 1, color: '#000080', position: 0 },
      { id: 2, color: '#0080FF', position: 20 },
      { id: 3, color: '#00FF80', position: 40 },
      { id: 4, color: '#80FF00', position: 60 },
      { id: 5, color: '#FF00FF', position: 80 },
      { id: 6, color: '#000080', position: 100 },
    ],
  },
  {
    stops: [
      { id: 1, color: '#FF0000', position: 0 },
      { id: 2, color: '#000000', position: 16 },
      { id: 3, color: '#00FF00', position: 33 },
      { id: 4, color: '#000000', position: 50 },
      { id: 5, color: '#0000FF', position: 67 },
      { id: 6, color: '#000000', position: 84 },
      { id: 7, color: '#FFFFFF', position: 100 },
    ],
  },
  {
    stops: [
      { id: 1, color: '#00FFFF', position: 0 },
      { id: 2, color: '#0080FF', position: 30 },
      { id: 3, color: '#0000FF', position: 60 },
      { id: 4, color: '#000080', position: 80 },
      { id: 5, color: '#000000', position: 100 },
    ],
  },
  {
    stops: [
      { id: 1, color: '#FF00FF', position: 0 },
      { id: 2, color: '#FF0080', position: 25 },
      { id: 3, color: '#FFFF00', position: 50 },
      { id: 4, color: '#00FFFF', position: 75 },
      { id: 5, color: '#FF00FF', position: 100 },
    ],
  },
].map(({ stops }) => ({
  id: generateGradientId(stops),
  stops,
}));
