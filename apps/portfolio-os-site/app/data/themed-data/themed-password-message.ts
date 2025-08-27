// Themed password hover messages
export const ThemedPasswordHoverMessages: Record<string, string> = {
  'developer-terminal': 'ACCESS DENIED: TRY SUDO',
  'euclid-ci': 'CLASSIFIED: NICE TRY AGENT',

  marathon: 'GAME OVER SNOOPER',

  'neon-cyberpunk': 'CAUGHT YOU JACKING IN',

  synthwave: 'PASSWORD1234 IS SO 1985',

  'blade-runner': 'SEARCHING FOR HUMANS',

  'sunset-gradient': 'MINDFUL HACKING VIBES',

  'neon-synthwave': 'HIGH VOLTAGE DETECTED',

  'ocean-depth': 'DIVING TOO DEEP HERE',

  'bubblegum-dream': 'SWEET TOOTH FOR SECRETS',

  'tres-sendas': 'ROOTING AROUND I SEE',

  arasaka: 'PRODUCTIVITY -47% TODAY',

  monochrome: 'LESS IS MORE SNOOPING',
};

// Default fallback message
export const DefaultPasswordHoverMessage = 'CAUGHT YOU SNOOPING';

// Helper function to get themed message
export const getPasswordHoverMessage = (themeId: string): string => {
  return ThemedPasswordHoverMessages[themeId] || DefaultPasswordHoverMessage;
};
