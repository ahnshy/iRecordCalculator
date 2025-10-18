'use client';
import * as React from 'react';
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';
import { ThemeModeContext } from './ThemeRegistry';

export default function ThemeToggle(){
  const {mode,setMode} = React.useContext(ThemeModeContext);
  const [el,setEl] = React.useState<null|HTMLElement>(null);
  return (<>
    <Tooltip title="Theme">
      <IconButton onClick={(e)=>setEl(e.currentTarget)}><PaletteIcon/></IconButton>
    </Tooltip>
    <Menu anchorEl={el} open={Boolean(el)} onClose={()=>setEl(null)}>
      {(['light','dark','night'] as const).map(m => <MenuItem key={m} selected={mode===m} onClick={()=>{setMode(m);setEl(null)}}>{m.toUpperCase()}</MenuItem>)}
    </Menu>
  </>);
}
