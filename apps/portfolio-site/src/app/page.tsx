import { Button, ThemeSwitcher } from '@jc/theming';

export default function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.none file.
   */
  return (
    <div>
      <ThemeSwitcher variant="dropdown" showLabel />

      <Button variant="contained" size="large" color="primary">
        Click me
      </Button>
    </div>
  );
}
