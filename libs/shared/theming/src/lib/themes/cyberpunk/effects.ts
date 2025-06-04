import { cyberpunkTokens } from './tokens';

export const cyberpunkEffects = {
  shadows: {
    glow: {
      primary: `0 0 10px ${cyberpunkTokens.colors.primary}, 0 0 20px ${cyberpunkTokens.colors.primary}, 0 0 30px ${cyberpunkTokens.colors.primary}`,
      secondary: `0 0 10px ${cyberpunkTokens.colors.secondary}, 0 0 20px ${cyberpunkTokens.colors.secondary}`,
      accent: `0 0 10px ${cyberpunkTokens.colors.accent}, 0 0 20px ${cyberpunkTokens.colors.accent}`,
    },
    panel:
      '0 4px 20px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    button: `0 2px 10px ${cyberpunkTokens.colors.primary}33, inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
  },

  animations: {
    pulse: 'cyberpunk-pulse 2s ease-in-out infinite alternate',
    flicker: 'cyberpunk-flicker 0.15s ease-in-out infinite alternate',
    scanline: 'cyberpunk-scanline 2s linear infinite',
  },
};
