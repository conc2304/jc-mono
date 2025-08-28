import { AugmentedButton, ScrambleText } from '@jc/ui-components';
import { alpha } from '@mui/system';
import { Property } from 'csstype';

// TODO download and get locally
const url =
  'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHV5eWhoaHl5d3Nmam4xNGY4enJoamZ2anhnYm45d3M5M2w3emJoaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WWSPhALYIBk1wtIwGZ/giphy.gif';
const urlStyle = `url("${url}") 50% 50% / 200% 200%;`;
const gradientStyle = `radial-gradient(${alpha('#fff', 0.3)}, ${alpha(
  '#000',
  0.4
)})`;
const bgStyle = `${gradientStyle}, ${urlStyle}`;

export const EnterButton = ({ fontSize }: { fontSize?: Property.FontSize }) => (
  <AugmentedButton
    variant="contained"
    shape="buttonRight"
    fullWidth
    size="large"
    sx={{
      flexGrow: 1,
      flexShrink: 0,
      height: '100%',
      '&[data-augmented-ui]': { '--aug-border-bg': `${bgStyle} !important` },
    }}
    href="/desktop"
    style={{}}
  >
    <ScrambleText
      variant="display"
      defaultText="ENTER"
      hoverText=" ??? "
      scrambleDuration={0.1}
      color="background.paper"
      fontSize={fontSize}
    />
  </AugmentedButton>
);
