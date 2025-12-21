import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles';
import { LinkProps } from '@mui/material/Link';

import BaselineCSS from './baseline';
import ButtonBase from './button-base';
import ButtonIcon from './button-icon';
import { LinkBehavior } from './link-behavior';

export default function getComponentOverrides(theme: Theme): Components {
  return {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      } as LinkProps,
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
    ...BaselineCSS(theme),
    ...ButtonBase(theme),
    ...ButtonIcon(theme),
  };
}
