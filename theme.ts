import { ThemeOptions } from '@mui/material/styles';

export function getDesignTokens(mode:'light'|'dark'|'night'): ThemeOptions {
  const common: ThemeOptions = { shape:{borderRadius:16}, components:{ MuiButtonBase:{ defaultProps:{ disableRipple:true } } } };
  if(mode==='light') return { ...common, palette:{ mode:'light', background:{default:'#f3f4f6', paper:'#fff'}, text:{primary:'#111827'}, primary:{main:'#ff9f0a'}, secondary:{main:'#3f3f46'} } };
  if(mode==='night') return { ...common, palette:{ mode:'dark', background:{default:'#0b1220', paper:'#0f172a'}, text:{primary:'#e2e8f0'}, primary:{main:'#ff9f0a'}, secondary:{main:'#3f3f46'} } };
  return { ...common, palette:{ mode:'dark', background:{default:'#000', paper:'#0d0d0d'}, text:{primary:'#fafafa'}, primary:{main:'#ff9f0a'}, secondary:{main:'#3a3a3c'} } };
}
