// theme/beveled-themes.css.ts
import { themeContract } from '@jc/theming';
import { createTheme } from '@vanilla-extract/css';

import { beveledThemeContract } from '.';

export const lightBeveledTheme = createTheme(beveledThemeContract, {
  components: {
    button: {
      background: {
        default: themeContract.palette.primary.main,
        hover: themeContract.palette.primary.dark,
        focus: themeContract.palette.primary.dark,
        active: themeContract.palette.primary.dark,
        disabled: themeContract.palette.action.disabledBackground,
      },
      border: {
        color: {
          default: themeContract.palette.primary.main,
          hover: themeContract.palette.primary.dark,
          focus: themeContract.palette.primary.main,
          active: themeContract.palette.primary.dark,
          disabled: themeContract.palette.action.disabled,
        },
        width: {
          default: '1px',
          hover: '1px',
          focus: '2px',
          active: '1px',
          disabled: '1px',
        },
      },
      content: {
        color: {
          default: themeContract.palette.primary.contrastText,
          hover: themeContract.palette.primary.contrastText,
          focus: themeContract.palette.primary.contrastText,
          active: themeContract.palette.primary.contrastText,
          disabled: themeContract.palette.action.disabled,
        },
        fontSize: themeContract.typography.button.fontSize,
        fontWeight: themeContract.typography.button.fontWeight,
        lineHeight: themeContract.typography.button.lineHeight,
      },
      shadow: {
        default: themeContract.shadows[2],
        hover: themeContract.shadows[4],
        focus: themeContract.shadows[6],
        active: themeContract.shadows[8],
        disabled: 'none',
      },
    },
    card: {
      background: {
        default: themeContract.palette.background.paper,
        hover: themeContract.palette.background.paper,
        focus: themeContract.palette.background.paper,
        active: themeContract.palette.background.paper,
        disabled: themeContract.palette.action.disabledBackground,
      },
      border: {
        color: {
          default: themeContract.palette.divider,
          hover: themeContract.palette.divider,
          focus: themeContract.palette.primary.main,
          active: themeContract.palette.divider,
          disabled: themeContract.palette.action.disabled,
        },
        width: {
          default: '1px',
          hover: '1px',
          focus: '2px',
          active: '1px',
          disabled: '1px',
        },
      },
      content: {
        color: {
          default: themeContract.palette.text.primary,
          hover: themeContract.palette.text.primary,
          focus: themeContract.palette.text.primary,
          active: themeContract.palette.text.primary,
          disabled: themeContract.palette.action.disabled,
        },
        fontSize: themeContract.typography.body1.fontSize,
        fontWeight: themeContract.typography.body1.fontWeight,
        lineHeight: themeContract.typography.body1.lineHeight,
      },
      shadow: {
        default: themeContract.shadows[1],
        hover: themeContract.shadows[3],
        focus: themeContract.shadows[4],
        active: themeContract.shadows[2],
        disabled: 'none',
      },
    },
  },
});

export const darkBeveledTheme = createTheme(beveledThemeContract, {
  components: {
    button: {
      background: {
        default: themeContract.palette.primary.main,
        hover: themeContract.palette.primary.light,
        focus: themeContract.palette.primary.light,
        active: themeContract.palette.primary.light,
        disabled: themeContract.palette.action.disabledBackground,
      },
      border: {
        color: {
          default: themeContract.palette.primary.main,
          hover: themeContract.palette.primary.light,
          focus: themeContract.palette.primary.main,
          active: themeContract.palette.primary.light,
          disabled: themeContract.palette.action.disabled,
        },
        width: {
          default: '1px',
          hover: '1px',
          focus: '2px',
          active: '1px',
          disabled: '1px',
        },
      },
      content: {
        color: {
          default: themeContract.palette.primary.contrastText,
          hover: themeContract.palette.primary.contrastText,
          focus: themeContract.palette.primary.contrastText,
          active: themeContract.palette.primary.contrastText,
          disabled: themeContract.palette.action.disabled,
        },
        fontSize: themeContract.typography.button.fontSize,
        fontWeight: themeContract.typography.button.fontWeight,
        lineHeight: themeContract.typography.button.lineHeight,
      },
      shadow: {
        default: themeContract.shadows[2],
        hover: themeContract.shadows[4],
        focus: themeContract.shadows[6],
        active: themeContract.shadows[8],
        disabled: 'none',
      },
    },
    card: {
      background: {
        default: themeContract.palette.background.paper,
        hover: themeContract.palette.background.paper,
        focus: themeContract.palette.background.paper,
        active: themeContract.palette.background.paper,
        disabled: themeContract.palette.action.disabledBackground,
      },
      border: {
        color: {
          default: themeContract.palette.divider,
          hover: themeContract.palette.divider,
          focus: themeContract.palette.primary.main,
          active: themeContract.palette.divider,
          disabled: themeContract.palette.action.disabled,
        },
        width: {
          default: '1px',
          hover: '1px',
          focus: '2px',
          active: '1px',
          disabled: '1px',
        },
      },
      content: {
        color: {
          default: themeContract.palette.text.primary,
          hover: themeContract.palette.text.primary,
          focus: themeContract.palette.text.primary,
          active: themeContract.palette.text.primary,
          disabled: themeContract.palette.action.disabled,
        },
        fontSize: themeContract.typography.body1.fontSize,
        fontWeight: themeContract.typography.body1.fontWeight,
        lineHeight: themeContract.typography.body1.lineHeight,
      },
      shadow: {
        default: themeContract.shadows[1],
        hover: themeContract.shadows[3],
        focus: themeContract.shadows[4],
        active: themeContract.shadows[2],
        disabled: 'none',
      },
    },
  },
});

// Blue theme variants would be similar but with different color mappings
export const blueLightBeveledTheme = createTheme(beveledThemeContract, {
  components: {
    button: {
      background: {
        default: themeContract.palette.primary.main,
        hover: themeContract.palette.primary.dark,
        focus: themeContract.palette.primary.dark,
        active: themeContract.palette.primary.dark,
        disabled: themeContract.palette.action.disabledBackground,
      },
      border: {
        color: {
          default: themeContract.palette.primary.main,
          hover: themeContract.palette.primary.dark,
          focus: themeContract.palette.primary.main,
          active: themeContract.palette.primary.dark,
          disabled: themeContract.palette.action.disabled,
        },
        width: {
          default: '1px',
          hover: '1px',
          focus: '2px',
          active: '1px',
          disabled: '1px',
        },
      },
      content: {
        color: {
          default: themeContract.palette.primary.contrastText,
          hover: themeContract.palette.primary.contrastText,
          focus: themeContract.palette.primary.contrastText,
          active: themeContract.palette.primary.contrastText,
          disabled: themeContract.palette.action.disabled,
        },
        fontSize: themeContract.typography.button.fontSize,
        fontWeight: themeContract.typography.button.fontWeight,
        lineHeight: themeContract.typography.button.lineHeight,
      },
      shadow: {
        default: themeContract.shadows[2],
        hover: themeContract.shadows[4],
        focus: themeContract.shadows[6],
        active: themeContract.shadows[8],
        disabled: 'none',
      },
    },
    card: {
      background: {
        default: themeContract.palette.background.paper,
        hover: themeContract.palette.background.paper,
        focus: themeContract.palette.background.paper,
        active: themeContract.palette.background.paper,
        disabled: themeContract.palette.action.disabledBackground,
      },
      border: {
        color: {
          default: themeContract.palette.divider,
          hover: themeContract.palette.divider,
          focus: themeContract.palette.primary.main,
          active: themeContract.palette.divider,
          disabled: themeContract.palette.action.disabled,
        },
        width: {
          default: '1px',
          hover: '1px',
          focus: '2px',
          active: '1px',
          disabled: '1px',
        },
      },
      content: {
        color: {
          default: themeContract.palette.text.primary,
          hover: themeContract.palette.text.primary,
          focus: themeContract.palette.text.primary,
          active: themeContract.palette.text.primary,
          disabled: themeContract.palette.action.disabled,
        },
        fontSize: themeContract.typography.body1.fontSize,
        fontWeight: themeContract.typography.body1.fontWeight,
        lineHeight: themeContract.typography.body1.lineHeight,
      },
      shadow: {
        default: themeContract.shadows[1],
        hover: themeContract.shadows[3],
        focus: themeContract.shadows[4],
        active: themeContract.shadows[2],
        disabled: 'none',
      },
    },
  },
});

export const blueDarkBeveledTheme = createTheme(beveledThemeContract, {
  components: {
    button: {
      background: {
        default: themeContract.palette.primary.main,
        hover: themeContract.palette.primary.dark,
        focus: themeContract.palette.primary.dark,
        active: themeContract.palette.primary.dark,
        disabled: themeContract.palette.action.disabledBackground,
      },
      border: {
        color: {
          default: themeContract.palette.primary.main,
          hover: themeContract.palette.primary.dark,
          focus: themeContract.palette.primary.main,
          active: themeContract.palette.primary.dark,
          disabled: themeContract.palette.action.disabled,
        },
        width: {
          default: '1px',
          hover: '1px',
          focus: '2px',
          active: '1px',
          disabled: '1px',
        },
      },
      content: {
        color: {
          default: themeContract.palette.primary.contrastText,
          hover: themeContract.palette.primary.contrastText,
          focus: themeContract.palette.primary.contrastText,
          active: themeContract.palette.primary.contrastText,
          disabled: themeContract.palette.action.disabled,
        },
        fontSize: themeContract.typography.button.fontSize,
        fontWeight: themeContract.typography.button.fontWeight,
        lineHeight: themeContract.typography.button.lineHeight,
      },
      shadow: {
        default: themeContract.shadows[2],
        hover: themeContract.shadows[4],
        focus: themeContract.shadows[6],
        active: themeContract.shadows[8],
        disabled: 'none',
      },
    },
    card: {
      background: {
        default: themeContract.palette.background.paper,
        hover: themeContract.palette.background.paper,
        focus: themeContract.palette.background.paper,
        active: themeContract.palette.background.paper,
        disabled: themeContract.palette.action.disabledBackground,
      },
      border: {
        color: {
          default: themeContract.palette.divider,
          hover: themeContract.palette.divider,
          focus: themeContract.palette.primary.main,
          active: themeContract.palette.divider,
          disabled: themeContract.palette.action.disabled,
        },
        width: {
          default: '1px',
          hover: '1px',
          focus: '2px',
          active: '1px',
          disabled: '1px',
        },
      },
      content: {
        color: {
          default: themeContract.palette.text.primary,
          hover: themeContract.palette.text.primary,
          focus: themeContract.palette.text.primary,
          active: themeContract.palette.text.primary,
          disabled: themeContract.palette.action.disabled,
        },
        fontSize: themeContract.typography.body1.fontSize,
        fontWeight: themeContract.typography.body1.fontWeight,
        lineHeight: themeContract.typography.body1.lineHeight,
      },
      shadow: {
        default: themeContract.shadows[1],
        hover: themeContract.shadows[3],
        focus: themeContract.shadows[4],
        active: themeContract.shadows[2],
        disabled: 'none',
      },
    },
  },
});
