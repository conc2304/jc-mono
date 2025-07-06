import { themeContract } from './contract.css';

// Helper function to create spacing values
export const spacing = (multiplier: number) =>
  `calc(${themeContract.spacing.unit} * ${multiplier})`;

// Helper function for responsive breakpoints
export const createMediaQuery = (
  breakpoint: keyof typeof themeContract.breakpoints
) => `screen and (min-width: ${themeContract.breakpoints[breakpoint]})`;

// Helper for creating transitions
export const createTransition = (
  properties: string | string[],
  duration?: keyof typeof themeContract.transitions.duration,
  easing?: keyof typeof themeContract.transitions.easing
) => {
  const props = Array.isArray(properties) ? properties : [properties];
  const dur = duration
    ? themeContract.transitions.duration[duration]
    : themeContract.transitions.duration.standard;
  const ease = easing
    ? themeContract.transitions.easing[easing]
    : themeContract.transitions.easing.easeInOut;

  return props.map((prop) => `${prop} ${dur} ${ease}`).join(', ');
};

// Typography mixins
export const typography = {
  h1: {
    fontFamily: themeContract.typography.fontFamily,
    fontSize: themeContract.typography.h1.fontSize,
    fontWeight: themeContract.typography.h1.fontWeight,
    lineHeight: themeContract.typography.h1.lineHeight,
    letterSpacing: themeContract.typography.h1.letterSpacing,
  },
  h2: {
    fontFamily: themeContract.typography.fontFamily,
    fontSize: themeContract.typography.h2.fontSize,
    fontWeight: themeContract.typography.h2.fontWeight,
    lineHeight: themeContract.typography.h2.lineHeight,
    letterSpacing: themeContract.typography.h2.letterSpacing,
  },
  h3: {
    fontFamily: themeContract.typography.fontFamily,
    fontSize: themeContract.typography.h3.fontSize,
    fontWeight: themeContract.typography.h3.fontWeight,
    lineHeight: themeContract.typography.h3.lineHeight,
    letterSpacing: themeContract.typography.h3.letterSpacing,
  },
  h4: {
    fontFamily: themeContract.typography.fontFamily,
    fontSize: themeContract.typography.h4.fontSize,
    fontWeight: themeContract.typography.h4.fontWeight,
    lineHeight: themeContract.typography.h4.lineHeight,
    letterSpacing: themeContract.typography.h4.letterSpacing,
  },
  h5: {
    fontFamily: themeContract.typography.fontFamily,
    fontSize: themeContract.typography.h5.fontSize,
    fontWeight: themeContract.typography.h5.fontWeight,
    lineHeight: themeContract.typography.h5.lineHeight,
    letterSpacing: themeContract.typography.h5.letterSpacing,
  },
  h6: {
    fontFamily: themeContract.typography.fontFamily,
    fontSize: themeContract.typography.h6.fontSize,
    fontWeight: themeContract.typography.h6.fontWeight,
    lineHeight: themeContract.typography.h6.lineHeight,
    letterSpacing: themeContract.typography.h6.letterSpacing,
  },
  subtitle1: {
    fontFamily: themeContract.typography.fontFamily,
    fontSize: themeContract.typography.subtitle1.fontSize,
    fontWeight: themeContract.typography.subtitle1.fontWeight,
    lineHeight: themeContract.typography.subtitle1.lineHeight,
    letterSpacing: themeContract.typography.subtitle1.letterSpacing,
  },
  subtitle2: {
    fontFamily: themeContract.typography.fontFamily,
    fontSize: themeContract.typography.subtitle2.fontSize,
    fontWeight: themeContract.typography.subtitle2.fontWeight,
    lineHeight: themeContract.typography.subtitle2.lineHeight,
    letterSpacing: themeContract.typography.subtitle2.letterSpacing,
  },
  body1: {
    fontFamily: themeContract.typography.fontFamily,
    fontSize: themeContract.typography.body1.fontSize,
    fontWeight: themeContract.typography.body1.fontWeight,
    lineHeight: themeContract.typography.body1.lineHeight,
    letterSpacing: themeContract.typography.body1.letterSpacing,
  },
  body2: {
    fontFamily: themeContract.typography.fontFamily,
    fontSize: themeContract.typography.body2.fontSize,
    fontWeight: themeContract.typography.body2.fontWeight,
    lineHeight: themeContract.typography.body2.lineHeight,
    letterSpacing: themeContract.typography.body2.letterSpacing,
  },
  button: {
    fontFamily: themeContract.typography.fontFamily,
    fontSize: themeContract.typography.button.fontSize,
    fontWeight: themeContract.typography.button.fontWeight,
    lineHeight: themeContract.typography.button.lineHeight,
    letterSpacing: themeContract.typography.button.letterSpacing,
    textTransform: themeContract.typography.button.textTransform,
  },
  caption: {
    fontFamily: themeContract.typography.fontFamily,
    fontSize: themeContract.typography.caption.fontSize,
    fontWeight: themeContract.typography.caption.fontWeight,
    lineHeight: themeContract.typography.caption.lineHeight,
    letterSpacing: themeContract.typography.caption.letterSpacing,
  },
  overline: {
    fontFamily: themeContract.typography.fontFamily,
    fontSize: themeContract.typography.overline.fontSize,
    fontWeight: themeContract.typography.overline.fontWeight,
    lineHeight: themeContract.typography.overline.lineHeight,
    letterSpacing: themeContract.typography.overline.letterSpacing,
    textTransform: themeContract.typography.overline.textTransform,
  },
};
