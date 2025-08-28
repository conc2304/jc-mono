export const ThemedProgressMessages: Record<
  string,
  { start: string; end: string }
> = {
  'developer-terminal': {
    start: 'compiling creative algorithms',
    end: 'build successful - ready to ship',
  },
  'euclid-ci': {
    start: 'decrypting classified files',
    end: 'access granted - clearance verified',
  },

  marathon: {
    start: 'loading game assets',
    end: 'level complete - press ENTER',
  },

  'neon-cyberpunk': {
    start: 'jacking into the matrix',
    end: 'neural link established',
  },

  synthwave: {
    start: 'calibrating retro protocols',
    end: 'synthwave transmission complete',
  },

  'blade-runner': {
    start: 'scanning for replicants',
    end: 'humanity test passed',
  },

  'sunset-gradient': {
    start: 'finding creative flow state',
    end: 'inspiration levels optimized',
  },

  'neon-synthwave': {
    start: 'charging neon circuits',
    end: 'grid synchronization complete',
  },

  'ocean-depth': {
    start: 'diving to creative depths',
    end: 'pressure equalized - welcome',
  },

  'bubblegum-dream': {
    start: 'mixing sweet algorithms',
    end: 'candy-coated experience ready',
  },

  'tres-sendas': {
    start: 'growing digital roots',
    end: 'ecosystem fully established',
  },

  arasaka: {
    start: 'optimizing synergy metrics',
    end: 'stakeholder value maximized',
  },

  monochrome: {
    start: 'adjusting contrast ratios',
    end: 'clarity achieved - minimal perfection',
  },
  'liberty-city': {
    start: 'loading liberty city assets',
    end: 'mission passed - respect earned',
  },
};

export const DefaultProgressMessages = {
  start: 'initializing',
  end: 'install completed',
};

export const getProgressMessages = (themeId: string) => {
  return ThemedProgressMessages[themeId] || DefaultProgressMessages;
};

export const getStepMessage = (
  themeId: string,
  step: number,
  totalSteps: number
): string => {
  const stepFunction = ThemedStepMessages[themeId];
  return stepFunction
    ? stepFunction(step, totalSteps)
    : `processing step ${step} of ${totalSteps}`;
};

export const ThemedStepMessages: Record<
  string,
  (step: number, totalSteps: number) => string
> = {
  'developer-terminal': (step, total) =>
    `processing module ${step} of ${total}`,
  'euclid-ci': (step, total) => `declassifying file ${step} of ${total}`,
  marathon: (step, total) => `loading stage ${step} of ${total}`,
  'neon-cyberpunk': (step, total) => `bypassing ice layer ${step} of ${total}`,
  synthwave: (step, total) => `processing track ${step} of ${total}`,
  'blade-runner': (step, total) => `analyzing memory ${step} of ${total}`,
  'sunset-gradient': (step, total) => `harmonizing element ${step} of ${total}`,
  'neon-synthwave': (step, total) => `energizing circuit ${step} of ${total}`,
  'ocean-depth': (step, total) => `descending to level ${step} of ${total}`,
  'bubblegum-dream': (step, total) => `sweetening layer ${step} of ${total}`,
  'redwood-forest': (step, total) =>
    `nurturing growth ring ${step} of ${total}`,
  arasaka: (step, total) => `optimizing metric ${step} of ${total}`,
  monochrome: (step, total) => `refining element ${step} of ${total}`,
  'liberty-city': (step, total) => `completing objective ${step} of ${total}`,
};
