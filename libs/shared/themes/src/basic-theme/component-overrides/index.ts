import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles';

import ButtonBase from './button-base';

export default function getComponentOverrides(theme: Theme): Components {
  return {
    ...ButtonBase(theme),
  };
}
