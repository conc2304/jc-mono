// theme/beveled-components.css.ts
import { createThemeContract } from '@vanilla-extract/css';

// Theme contract specifically for beveled components
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
  },
});
