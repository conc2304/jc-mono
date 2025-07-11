'use client';

import { Box, Typography, Card, CardContent } from '@mui/material';
import { EnhancedThemeSwitcher, useEnhancedTheme } from '@jc/themes';
import { AugmentedButton as Button } from '@jc/ui-components';

export default function Index() {
  const { themes, currentThemeId, changeTheme } = useEnhancedTheme();

  return (
    <Box sx={{ p: 3, minHeight: '100vh' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Theme Switcher Demo
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Choose from our collection of retro futurism and cyberpunk themes
        </Typography>

        <EnhancedThemeSwitcher
          themes={themes}
          selectedThemeId={currentThemeId}
          onThemeChange={changeTheme}
          compact={true}
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        }}
      >
        <Card>
          <CardContent>
            <Typography variant="h6" color="primary" gutterBottom>
              Primary Color
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This card demonstrates the primary color theme
            </Typography>
            <Button variant="contained" sx={{ mt: 2 }}>
              Primary Button
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" color="secondary" gutterBottom>
              Secondary Color
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This card demonstrates the secondary color theme
            </Typography>
            <Button variant="contained" color="secondary" sx={{ mt: 2 }}>
              Secondary Button
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" color="error" gutterBottom>
              Error State
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This shows how error colors look in the theme
            </Typography>
            <Button variant="contained" color="error" sx={{ mt: 2 }}>
              Error Button
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" color="success" gutterBottom>
              Success State
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This shows how success colors look in the theme
            </Typography>
            <Button variant="contained" color="success" sx={{ mt: 2 }}>
              Success Button
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
