export const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const deslugify = (str: string): string =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, ' ')
    .trim();

export const urlRegexPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

export const formatLabel = (key: string): string => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

export const hashString = (string: string) => {
  return string.split('').reduce(function (a, b) {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
};

export const getFileExtension = (filename: string) => {
  return filename.split('.').pop();
};

export const generateRandomString = () => {
  return Math.random().toString(36).slice(2);
};
