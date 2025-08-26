// Themed radar chart metrics for boot loader
export type formatFn = (n: number | { valueOf(): number }) => string;
export const ThemedRadarMetrics: Record<
  string,
  Array<{ label: string; formatFn: formatFn }>
> = {
  'euclid-ci': [
    { label: 'CRYPTO LVL', formatFn: (n) => `${n.valueOf().toFixed(0)}` },
    { label: 'INTEL', formatFn: (n) => `${n.valueOf().toFixed(1)}%` },
    { label: 'SURV GRD', formatFn: (n) => ` ${n.valueOf().toFixed(0)}` },
    { label: 'CL ACCESS', formatFn: (n) => `${n.valueOf().toFixed(0)}` },
    { label: 'STEALTH', formatFn: (n) => `${n.valueOf().toFixed(1)}%` },
    { label: 'THREAT LVL', formatFn: (n) => `${n.valueOf().toFixed(0)}` },
  ],

  marathon: [
    { label: 'FPS', formatFn: (n) => `${n.valueOf().toFixed(0)}` },
    {
      label: 'SCORE',
      formatFn: (n) => `${(n.valueOf() * 1000).valueOf().toFixed(0)}`,
    },
    { label: 'POWER LVL', formatFn: (n) => `${n.valueOf().toFixed(0)}` },
    { label: 'COMBO', formatFn: (n) => `x${n.valueOf().toFixed(1)}` },
    { label: 'DIFF', formatFn: (n) => `${n.valueOf().toFixed(1)}%` },
    { label: 'HEALTH HP', formatFn: (n) => `${n.valueOf().toFixed(0)}` },
  ],

  'neon-cyberpunk': [
    { label: 'ICE', formatFn: (n) => `${n.valueOf().toFixed(1)}%` },
    { label: 'DATA MB/s`', formatFn: (n) => `${n.valueOf().toFixed(0)}` },
    { label: 'NEURAL SYNC', formatFn: (n) => ` ${n.valueOf().toFixed(0)}` },
    { label: 'CHROME', formatFn: (n) => `${n.valueOf().toFixed(1)}%` },
    { label: 'STREET CR', formatFn: (n) => `${n.valueOf().toFixed(0)}` },
    { label: 'HACK LVL', formatFn: (n) => ` ${n.valueOf().toFixed(0)}` },
  ],

  synthwave: [
    { label: 'WAVE', formatFn: (n) => `${n.valueOf().toFixed(1)}%` },
    {
      label: 'FREQ',
      formatFn: (n) => `${(n.valueOf() * 10).valueOf().toFixed(0)}Hz`,
    },
    { label: 'ANALOG', formatFn: (n) => `${n.valueOf().toFixed(0)}dB` },
    { label: 'RETRO', formatFn: (n) => `${n.valueOf().toFixed(1)}%` },
    { label: 'NEON LUX', formatFn: (n) => `${n.valueOf().toFixed(0)}` },
    { label: 'VIBE', formatFn: (n) => `${n.valueOf().toFixed(1)}%` },
  ],

  'blade-runner': [
    { label: 'EMPATHY', formatFn: (n) => `${n.valueOf().toFixed(1)}%` },
    { label: 'MEMORY', formatFn: (n) => `${n.valueOf().toFixed(0)}GB` },
    { label: 'SCAN', formatFn: (n) => `${n.valueOf().toFixed(1)}%` },
    { label: 'HUMANITY IDX', formatFn: (n) => ` ${n.valueOf().toFixed(0)}` },
    { label: 'TEARS', formatFn: (n) => `${n.valueOf().toFixed(1)}%` },
    { label: 'NEXUS GEN', formatFn: (n) => ` ${n.valueOf().toFixed(0)}` },
  ],

  'sunset-gradient': [
    { label: 'FLOW', formatFn: (n) => `${n.valueOf().toFixed(1)}%` },
    { label: 'WELLNESS', formatFn: (n) => `${n.valueOf().toFixed(0)}%` },
    { label: 'MINDFUL', formatFn: (n) => `${n.valueOf().toFixed(1)}%` },
    { label: 'INSPIRE LVL', formatFn: (n) => `${n.valueOf().toFixed(0)}` },
    { label: 'HARMONY', formatFn: (n) => `${n.valueOf().toFixed(1)}%` },
    { label: 'CREATIVE', formatFn: (n) => `${n.valueOf().toFixed(0)}%` },
  ],

  'neon-synthwave': [
    { label: 'VOLTAGE', formatFn: (n) => `${n.valueOf().toFixed(1)}V` },
    { label: 'GRID', formatFn: (n) => `${n.valueOf().toFixed(0)}%` },
    { label: 'PULSE BPM', formatFn: (n) => `${n.valueOf().toFixed(0)}` },
    { label: 'NEON', formatFn: (n) => `${n.valueOf().toFixed(1)}%` },
    { label: 'CIRCUIT', formatFn: (n) => `${n.valueOf().toFixed(0)}Ω` },
    { label: 'ENERGY', formatFn: (n) => `${n.valueOf().toFixed(1)}kW` },
  ],

  'ocean-depth': [
    { label: 'PRESSURE', formatFn: (n) => `${n.valueOf().toFixed(0)}ATM` },
    { label: 'CURRENT', formatFn: (n) => `${n.valueOf().toFixed(1)}m/s` },
    {
      label: 'DEPTH',
      formatFn: (n) => `${(n.valueOf() * 10).valueOf().toFixed(0)}m`,
    },
    { label: 'BIOLUM', formatFn: (n) => `${n.valueOf().toFixed(1)}%` },
    { label: 'TIDAL', formatFn: (n) => `${n.valueOf().toFixed(0)}Hz` },
    { label: 'SALINITY', formatFn: (n) => `${n.valueOf().toFixed(1)}‰` },
  ],

  'bubblegum-dream': [
    { label: 'SWEET', formatFn: (n) => `${n.valueOf().toFixed(0)}°B` },
    { label: 'NOSTALGIA', formatFn: (n) => `${n.valueOf().toFixed(1)}%` },
    { label: 'BUBBLES', formatFn: (n) => `${n.valueOf().toFixed(0)}/cm³` },
    { label: 'PASTEL', formatFn: (n) => `${n.valueOf().toFixed(1)}%` },
    { label: 'WONDER LVL', formatFn: (n) => `${n.valueOf().toFixed(0)}` },
    { label: 'MAGIC', formatFn: (n) => `${n.valueOf().toFixed(0)}✨` },
  ],

  'tres-sendas': [
    { label: 'GROWTH cm/yr', formatFn: (n) => `${n.valueOf().toFixed(1)}` },
    { label: 'ROOTS', formatFn: (n) => `${n.valueOf().toFixed(0)}m` },
    { label: 'CANOPY', formatFn: (n) => `${n.valueOf().toFixed(1)}%` },
    { label: 'PHOTO μmol', formatFn: (n) => `${n.valueOf().toFixed(0)}` },
    { label: 'ECOSYSTEM', formatFn: (n) => `${n.valueOf().toFixed(1)}%` },
    { label: 'CARBON', formatFn: (n) => `${n.valueOf().toFixed(0)}kg` },
  ],

  arasaka: [
    { label: 'PROFIT', formatFn: (n) => `${n.valueOf().toFixed(1)}%` },
    { label: 'COMPLY', formatFn: (n) => `${n.valueOf().toFixed(0)}%` },
    { label: 'EFFICIENCY', formatFn: (n) => `${n.valueOf().toFixed(1)}%` },
    { label: 'MARKET', formatFn: (n) => `${n.valueOf().toFixed(0)}%` },
    { label: 'LOYALTY', formatFn: (n) => `${n.valueOf().toFixed(1)}%` },
    { label: 'SYNERGY', formatFn: (n) => `${n.valueOf().toFixed(0)}X` },
  ],

  monochrome: [
    { label: 'CONTRAST', formatFn: (n) => `${n.valueOf().toFixed(1)}:1` },
    { label: 'SIGNAL', formatFn: (n) => `${n.valueOf().toFixed(0)}dB` },
    { label: 'TYPO', formatFn: (n) => `${n.valueOf().toFixed(1)}px` },
    { label: 'SPACE', formatFn: (n) => `${n.valueOf().toFixed(1)}%` },
    { label: 'GEOMETRY', formatFn: (n) => `${n.valueOf().toFixed(0)}°` },
    { label: 'MINIMAL', formatFn: (n) => `${n.valueOf().toFixed(1)}%` },
  ],
};

// Default fallback metrics
export const DefaultRadarMetrics: Array<{
  label: string;
  formatFn: formatFn;
}> = [
  { label: 'SYSTEM', formatFn: (n) => `${n.valueOf().toFixed(1)}%` },
  { label: 'DATA', formatFn: (n) => `${n.valueOf().toFixed(1)}%` },
  { label: 'NETWORK', formatFn: (n) => `${n.valueOf().toFixed(1)}%` },
  { label: 'PROCESS', formatFn: (n) => `${n.valueOf().toFixed(1)}%` },
  { label: 'SECURITY', formatFn: (n) => `${n.valueOf().toFixed(1)}%` },
  { label: 'MEMORY', formatFn: (n) => `${n.valueOf().toFixed(1)}%` },
];

// Helper function to get themed metrics
export const getRadarMetrics = (
  themeId: string
): Array<{ label: string; formatFn: formatFn }> => {
  return ThemedRadarMetrics[themeId] || DefaultRadarMetrics;
};
