'use client';

import * as React from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { getDesignTokens } from '../theme';

type Props = { children: React.ReactNode };

export const ThemeModeContext = React.createContext<{
  mode: 'light' | 'dark' | 'night';
  setMode: (m: 'light' | 'dark' | 'night') => void;
}>({ mode: 'dark', setMode: () => {} });

export default function ThemeRegistry({ children }: Props) {
  const [mode, setMode] = React.useState<'light'|'dark'|'night'>(() => {
    if (typeof window === 'undefined') return 'dark';
    return (localStorage.getItem('calc-theme') as any) || 'dark';
  });

  React.useEffect(() => { localStorage.setItem('calc-theme', mode); }, [mode]);

  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeModeContext.Provider value={{ mode, setMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
