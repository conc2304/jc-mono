import { ReactNode } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { BasicTheme } from '@jc/themes';
import { ButtonDemo } from '@jc/ui-components';
// type Props = {
//   children: ReactNode;
// };

export default function Page() {
  return (
    <div>
      <ThemeProvider theme={BasicTheme}>
        <CssBaseline />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
          }}
        >
          <ButtonDemo />
        </div>
      </ThemeProvider>
    </div>
  );
}
