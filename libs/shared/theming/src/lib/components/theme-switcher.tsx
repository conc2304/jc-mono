import React from 'react';
import { styled } from '../stitches/config';
import { useTheme } from './providers';

const SwitcherContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
});

const SwitcherSelect = styled('select', {
  fontFamily: '$system',
  fontSize: '$sm',
  padding: '$2 $3',
  backgroundColor: '$surface',
  color: '$textPrimary',
  border: '1px solid $border',
  borderRadius: '$base',
  cursor: 'pointer',

  '&:focus': {
    outline: 'none',
    borderColor: '$primary',
  },

  variants: {
    theme: {
      cyberpunk: {
        backgroundColor: 'transparent',
        border: '1px solid $primary',
        color: '$primary',
        '&:focus': {
          boxShadow: '0 0 10px $primary',
        },
      },
      corporate: {
        backgroundColor: '$background',
        border: '1px solid $border',
        '&:focus': {
          borderColor: '$primary',
          boxShadow: '0 0 0 3px ${primary}20',
        },
      },
    },
  },
});

const SwitcherLabel = styled('label', {
  fontSize: '$sm',
  fontWeight: '$medium',
  color: '$textSecondary',
});

export const ThemeSwitcher: React.FC = () => {
  const { currentTheme, setTheme, availableThemes } = useTheme();

  return (
    <SwitcherContainer>
      <SwitcherLabel htmlFor="theme-select">Theme:</SwitcherLabel>
      <SwitcherSelect
        id="theme-select"
        value={currentTheme}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setTheme(e.target.value as any)
        }
        theme={currentTheme}
      >
        {availableThemes.map((theme) => (
          <option key={theme} value={theme}>
            {theme.charAt(0).toUpperCase() + theme.slice(1)}
          </option>
        ))}
      </SwitcherSelect>
    </SwitcherContainer>
  );
};
