// Themed radar chart metrics for boot loader
export const ThemedRadarMetrics: Record<
  string,
  [string, string, string, string, string]
> = {
  'euclid-ci': [
    'ENCRYPTION DEPTH',
    'INTEL SATURATION',
    'SURVEILLANCE GRID',
    'CLEARANCE LEVEL',
    'OPERATIONAL STEALTH',
  ],

  marathon: [
    'FRAME RATE',
    'PLAYER SCORE',
    'POWER LEVEL',
    'COMBO MULTIPLIER',
    'DIFFICULTY SPIKE',
  ],

  'neon-cyberpunk': [
    'ICE PENETRATION',
    'DATA STREAM FLOW',
    'NEURAL LINK SYNC',
    'CHROME SATURATION',
    'STREET CREDIBILITY',
  ],

  synthwave: [
    'WAVEFORM PURITY',
    'FREQUENCY RANGE',
    'ANALOG WARMTH',
    'RETRO SATURATION',
    'NEON INTENSITY',
  ],

  'blade-runner': [
    'EMPATHY RESPONSE',
    'MEMORY IMPLANTS',
    'REPLICANT SCAN',
    'HUMANITY INDEX',
    'TEARS IN RAIN',
  ],

  'sunset-gradient': [
    'CREATIVE FLOW STATE',
    'WELLNESS INDEX',
    'MINDFUL PRESENCE',
    'INSPIRATION LEVELS',
    'WORK-LIFE HARMONY',
  ],

  'neon-synthwave': [
    'VOLTAGE AMPLITUDE',
    'GRID SYNCHRONIZATION',
    'ELECTRIC PULSE',
    'NEON SATURATION',
    'CIRCUIT INTEGRITY',
  ],

  'ocean-depth': [
    'PRESSURE RESISTANCE',
    'CURRENT VELOCITY',
    'DEPTH PENETRATION',
    'BIOLUMINESCENCE',
    'TIDAL RESONANCE',
  ],

  'bubblegum-dream': [
    'SWEETNESS FACTOR',
    'NOSTALGIA INTENSITY',
    'BUBBLE DENSITY',
    'PASTEL SATURATION',
    'CHILDHOOD WONDER',
  ],

  'tres-sendas': [
    'GROWTH VELOCITY',
    'ROOT NETWORK DEPTH',
    'CANOPY COVERAGE',
    'PHOTOSYNTHESIS RATE',
    'ECOSYSTEM BALANCE',
  ],

  arasaka: [
    'PROFIT MARGINS',
    'COMPLIANCE RATING',
    'EFFICIENCY METRICS',
    'MARKET DOMINANCE',
    'EMPLOYEE LOYALTY',
  ],

  monochrome: [
    'CONTRAST RATIO',
    'SIGNAL CLARITY',
    'TYPOGRAPHY PRECISION',
    'NEGATIVE SPACE',
    'GEOMETRIC BALANCE',
  ],
};

// Default fallback metrics
export const DefaultRadarMetrics: [string, string, string, string, string] = [
  'SYSTEM PERFORMANCE',
  'DATA INTEGRITY',
  'NETWORK STABILITY',
  'PROCESSING SPEED',
  'SECURITY LEVEL',
];

// Helper function to get themed metrics
export const getRadarMetrics = (
  themeId: string
): [string, string, string, string, string] => {
  return ThemedRadarMetrics[themeId] || DefaultRadarMetrics;
};
