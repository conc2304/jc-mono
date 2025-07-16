import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles';

import BaselineCSS from './baseline';
import ButtonBase from './button-base';
import ButtonIcon from './button-icon';

export default function getComponentOverrides(theme: Theme): Components {
  return {
    ...BaselineCSS(theme),
    ...ButtonBase(theme),
    ...ButtonIcon(theme),
  };
}
