// Themed character sets for text scrambling effects
export const ThemedScrambleCharacters: Record<string, string> = {
  'developer-terminal':
    '█▓▒░■□▪▫○●0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz(){}[]<>/\\|+-*=.,:;"\'^$%@#!?_',
  'euclid-ci': '█▓▒░■□▪▫●○ЖДФЦЯЩЭЮ¤§†‡•‰‱₪₫₹01XVILCDM[]{}|\\/-_~',

  marathon: '█▄▀▌▐░▒▓■□◆◇◈◉◎●◐◑◒◓▲▼◄►♠♣♥♦♪♫0123456789ABCDEF+-*=/\\|^v<>',

  'neon-cyberpunk':
    'アイウエオカキクケコサシスセソタチツテトЖФЦЩЯЭЮБГД0123456789!@#$%^&*(){}[]|\\/<>?█▓▒░▪▫●○',

  synthwave:
    '█▄▀▌▐░▒▓■□▲▼◄►◆◇◈○●◎║╔╗╚╝╠╣╦╩╬≡≈≠≤≥∞∆∇∑∏0123456789ABCDEF+-*/=%^&|~',

  'blade-runner':
    '█▓▒░■□▪▫0123456789アカサタナハマヤラワABCDEFXYZ-_|/\\.:;\'"{}[]()<>?!',

  'sunset-gradient':
    '◯◎○●◐◑◒◓☉☽☾∼∽≈≋∿〜～⌇⋄◊✦✧✩✪✫✬✭✮✯✰⌘⌨⌬⌮⌯⌰⌱⌲⌳⌴aeiouylrnm()~-_.,;: ',

  'neon-synthwave':
    '█▄▀▌▐▆▇▉▊▋║═╔╗╚╝╠╣╦╩╬┌┐└┘├┤┬┴┼│─▲▼◄►◆◇◈♦♢⬥⚡⭐✨💫🔥⚪⚫🔴🔵🟣01AFEX+-*/{}[]|\\<>^v',

  'ocean-depth':
    '∼∽≈≋∿〜～⌇◊⋄○◯◎●◐◑◒◓☽☾⚬⚭⚮⚯⚰⚱⚲⚳⚴⚵♁♆♇☊☋☌☍☎☏☐˚°·∘∙∶∷∸∹∺oaeuiwvlrn()~-_.,;: ',

  'bubblegum-dream':
    '♡♥❤💗💖💕💓💝💘💟★☆✦✧✩✪✫✬✭✮✯○◯◎●◐◑◒◓☽☾♪♫♬♭♮♯♰♱♲♳☺☻☹☿♀♁♂♃♄♅aeioyrlnm()~-_.,;: ',

  'tres-sendas':
    '♠♣♥♦♧♤♡♢♕♖☘☙☚☛☜☝☞☟☠☡∼∽≈≋∿〜～⌇◊⋄○◯◎●◐◑◒◓☽☾⚘⚙⚚⚛⚜⚝⚞⚟⚠⚡aeiouylrnmwvgfhjkstdpb()~-_.,;: ',

  arasaka:
    '█▓▒░■□▪▫●○0123456789ABCDEFXYZ!@#$%^&*(){}[]|\\/<>?+-*/=%^&|~¤§†‡•‰‱₪₫₹ЖДФЦЯЩЭЮ≡≠≤≥∞∆∇∑∏',

  monochrome:
    '█▓▒░■□▪▫○●◯◎◐◑◒◓01010101010101010101010101010101010101010101010101010101010101010101.,:;-_()[]{}|\\/<>?!@', // increase probability of 0 and 1
  'liberty-city':
    '█▓▒░■□▪▫●○★☆♦♣♥♠0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-={}[]|\\:";\'<>?,./$€£¥',
};

// Default fallback character set
export const DefaultScrambleCharacters =
  '█▓▒░■□▪▫●○0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-_+={}[]|\\/<>?';

// Helper function to get themed characters
export const getScrambleCharacters = (themeId: string): string => {
  return ThemedScrambleCharacters[themeId] || DefaultScrambleCharacters;
};
