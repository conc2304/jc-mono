// Themed info panel content
export const ThemedInfoPanelContent: Record<
  string,
  {
    label: string;
    middleSection: [string, string];
    rightSection: [string, string, string];
  }
> = {
  'developer-terminal':
    Math.random() < 0.6
      ? {
          label: 'DEBUG',
          middleSection: ['CURIOSITY ZONE', 'EXPLORATION REWARDED'],
          rightSection: ['DO NOT', 'FORGET TO', 'HOVER'],
        }
      : {
          label: 'BUILD',
          middleSection: ['DEV ZONE', 'CODE QUALITY HIGH'],
          rightSection: ['DO NOT', 'PUSH TO', 'PRODUCTION'],
        },

  'euclid-ci': {
    label: 'CLASSIFIED',
    middleSection: ['RESTRICTED AREA', 'CLEARANCE REQUIRED'],
    rightSection: ['DO NOT', 'COMPROMISE', 'OPERATION'],
  },

  marathon: {
    label: 'GAME',
    middleSection: ['PLAYER ZONE', 'HIGH SCORE MODE'],
    rightSection: ['READY', 'PLAYER', 'ONE?'],
  },

  'neon-cyberpunk': {
    label: 'JACK IN',
    middleSection: ['NEURAL ZONE', 'INTERFACE ACTIVE'],
    rightSection: ['DO NOT', 'DISCONNECT', 'PREMATURELY'],
  },

  synthwave: {
    label: 'RETRO',
    middleSection: ['ANALOG ZONE', 'SYNTHESIS ACTIVE'],
    rightSection: ['DO NOT', 'ADJUST', 'FREQUENCY'],
  },

  'blade-runner': {
    label: 'SCAN',
    middleSection: ['MEMORY ZONE', 'REPLICANT TEST'],
    rightSection: ['DO NOT', 'QUESTION', 'HUMANITY'],
  },

  'sunset-gradient': {
    label: 'FLOW',
    middleSection: ['CREATIVE ZONE', 'INSPIRATION MODE'],
    rightSection: ['DO NOT', 'RUSH THE', 'PROCESS'],
  },

  'neon-synthwave': {
    label: 'GRID',
    middleSection: ['ELECTRIC ZONE', 'HIGH VOLTAGE'],
    rightSection: ['DO NOT', 'TOUCH', 'CIRCUITS'],
  },

  'ocean-depth': {
    label: 'DIVE',
    middleSection: ['DEEP ZONE', 'PRESSURE SUIT ON'],
    rightSection: ['DO NOT', 'SURFACE', 'TOO FAST'],
  },

  'bubblegum-dream': {
    label: 'SWEET',
    middleSection: ['WONDER ZONE', 'MAGIC REQUIRED'],
    rightSection: ['DO NOT', 'LOSE', 'IMAGINATION'],
  },

  'tres-sendas': {
    label: 'GROW',
    middleSection: ['FOREST ZONE', 'ECOSYSTEM ACTIVE'],
    rightSection: ['DO NOT', 'DISTURB', 'BALANCE'],
  },

  arasaka: {
    label: 'SYNERGY',
    middleSection: ['OPTIMIZATION ZONE', 'EFFICIENCY MODE'],
    rightSection: ['DO NOT', 'QUESTION', 'METRICS'],
  },

  monochrome: {
    label: 'FOCUS',
    middleSection: ['MINIMAL ZONE', 'CLARITY MODE'],
    rightSection: ['DO NOT', 'ADD', 'COMPLEXITY'],
  },
};

// Default fallback content
export const DefaultInfoPanelContent = {
  label: 'INFO',
  middleSection: ['FUN ZONE AREA', 'CURIOSITY REQUIRED'] as [string, string],
  rightSection: ['DO NOT', 'RESIST THE', 'EXPERIENCE'] as [
    string,
    string,
    string
  ],
};

// Helper function to get themed content
export const getInfoPanelContent = (themeId: string) => {
  return ThemedInfoPanelContent[themeId] || DefaultInfoPanelContent;
};
