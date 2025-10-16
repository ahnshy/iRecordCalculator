import { ThemeOptions } from '@mui/material/styles';

export function getDesignTokens(mode: 'light' | 'dark' | 'night'): ThemeOptions {
  const common = {
    shape: { borderRadius: 16 },
    typography: {
      fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'`
    },
    components: {
      MuiButtonBase: { defaultProps: { disableRipple: true } }
    }
  } as ThemeOptions;

  if (mode === 'light') {
    return {
      ...common,
      palette: {
        mode: 'light',
        background: { default: '#f3f4f6', paper: '#ffffff' },
        text: { primary: '#111827' },
        primary: { main: '#ff9f0a' },
        secondary: { main: '#575757' }
      }
    };
  }
  if (mode === 'night') {
    return {
      ...common,
      palette: {
        mode: 'dark',
        background: { default: '#0b1220', paper: '#0f172a' },
        text: { primary: '#e2e8f0' },
        primary: { main: '#ff9f0a' },
        secondary: { main: '#3f3f46' }
      }
    };
  }
  // dark default
  return {
    ...common,
    palette: {
      mode: 'dark',
      background: { default: '#000000', paper: '#0d0d0d' },
      text: { primary: '#fafafa' },
      primary: { main: '#ff9f0a' },
      secondary: { main: '#3a3a3c' }
    }
  };
}
