'use client';
import * as React from 'react';
import { ThemeModeContext } from './ThemeRegistry';
import { ToggleButton, ToggleButtonGroup, Box } from '@mui/material';

export default function ThemeToggle() {
  const { mode, setMode } = React.useContext(ThemeModeContext);
  const handle = (_: any, val: 'light'|'dark'|'night'|null) => { if (val) setMode(val); };
  return (
    <Box sx={{ display:'flex', justifyContent:'center' }}>
      <ToggleButtonGroup value={mode} exclusive onChange={handle} size="small" aria-label="theme-toggle">
        <ToggleButton value="light">Light</ToggleButton>
        <ToggleButton value="dark">Dark</ToggleButton>
        <ToggleButton value="night">Night</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
