'use client';
import * as React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { getDesignTokens } from '../theme';

export const ThemeModeContext = React.createContext<{mode:'light'|'dark'|'night', setMode:(m:'light'|'dark'|'night')=>void}>({mode:'dark', setMode:()=>{}});

export default function ThemeRegistry({ children }: {children: React.ReactNode}){
  const [mode, setMode] = React.useState<'light'|'dark'|'night'>(() => (typeof window==='undefined' ? 'dark' : ((localStorage.getItem('calc-theme') as any) || 'dark')));
  React.useEffect(()=>{ try{localStorage.setItem('calc-theme', mode)}catch{} },[mode]);
  const theme = React.useMemo(()=>createTheme(getDesignTokens(mode)),[mode]);
  return <ThemeModeContext.Provider value={{mode,setMode}}><ThemeProvider theme={theme}><CssBaseline/>{children}</ThemeProvider></ThemeModeContext.Provider>
}
