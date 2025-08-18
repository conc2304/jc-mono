import { ensureContrast } from '@jc/utils';
import { Box, Stack, Typography, styled } from '@mui/material';

const TextBox = styled(Box)(({ theme }) => ({
  containerType: 'size',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));
const TextColumn = styled(Stack)(({ theme }) => ({
  height: '100%',
  flexGrow: 1,
}));
const TextElem = styled(Typography)(({ theme }) => ({
  fontSize: '100cqh !important',
  lineHeight: 1,
  WebkitTextStrokeWidth: '1px',
  WebkitTextStrokeColor: ensureContrast(
    // make sure there is enough contrast with the background chevron color
    theme.palette.text.primary,
    theme.palette.getInvertedMode('secondary'),
    3
  ).color,
  WebkitTextFillColor: ensureContrast(
    theme.palette.getInvertedMode('secondary'),
    ensureContrast(
      // make sure that there is contrast with the stroke color
      theme.palette.text.primary,
      theme.palette.getInvertedMode('secondary'),
      3
    ).color,
    3
  ).color,
  color: theme.ap, // fallback
}));

export const HomeTextBox = () => {
  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        px: 2,
      }}
    >
      <TextColumn>
        <TextBox height={'40%'}>
          <TextElem variant="display">H</TextElem>
        </TextBox>
        <TextBox height={'40%'}>
          <TextElem variant="display">M</TextElem>
        </TextBox>
        <TextBox flexGrow={1} />
      </TextColumn>
      <TextColumn>
        <TextBox flexGrow={1} />
        <TextBox height={'40%'}>
          <TextElem variant="display"> O</TextElem>
        </TextBox>
        <TextBox height={'40%'}>
          <TextElem variant="display">E</TextElem>
        </TextBox>
      </TextColumn>
    </Box>
  );
};
