// theme/components-theme.css.ts
import { createThemeContract } from '@vanilla-extract/css';

export const beveledThemeContract = createThemeContract({
  components: {
    button: {
      background: {
        default: null,
        hover: null,
        focus: null,
        active: null,
        disabled: null,
      },
      border: {
        color: {
          default: null,
          hover: null,
          focus: null,
          active: null,
          disabled: null,
        },
        width: {
          default: null,
          hover: null,
          focus: null,
          active: null,
          disabled: null,
        },
      },
      content: {
        color: {
          default: null,
          hover: null,
          focus: null,
          active: null,
          disabled: null,
        },
        fontSize: null,
        fontWeight: null,
        lineHeight: null,
      },
      shadow: {
        default: null,
        hover: null,
        focus: null,
        active: null,
        disabled: null,
      },
    },
    card: {
      background: {
        default: null,
        hover: null,
        focus: null,
        active: null,
        disabled: null,
      },
      border: {
        color: {
          default: null,
          hover: null,
          focus: null,
          active: null,
          disabled: null,
        },
        width: {
          default: null,
          hover: null,
          focus: null,
          active: null,
          disabled: null,
        },
      },
      content: {
        color: {
          default: null,
          hover: null,
          focus: null,
          active: null,
          disabled: null,
        },
        fontSize: null,
        fontWeight: null,
        lineHeight: null,
      },
      shadow: {
        default: null,
        hover: null,
        focus: null,
        active: null,
        disabled: null,
      },
    },
    // Add more components as needed
  },
});
