'use client';
import * as React from 'react';
import { Box, Paper, Typography, Grid, Button, Divider, Drawer, List, ListItem, ListItemButton, ListItemText, IconButton, Stack, ListItemIcon, SvgIcon } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import HistoryIcon from '@mui/icons-material/History';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ChecklistIcon from '@mui/icons-material/Checklist';
import CancelIcon from '@mui/icons-material/Cancel';
import ThemeToggle from './ThemeToggle';

type HistoryItem = { id: string; expression: string; result: string; timestamp: number };
type Op = '+' | '-' | '×' | '÷' | null;

function formatNumber(n: string) {
  if (!n || n === '.') return '0';
  const num = Number(n);
  if (!isFinite(num)) return n;
  const [i, f] = n.split('.');
  const int = Number(i).toLocaleString();
  return f ? `${int}.${f}` : int;
}

function AutoFitText({ text, maxPx=56, minPx=18, step=1, weight=800, align='right', family='inherit', color }:
{ text: string; maxPx?: number; minPx?: number; step?: number; weight?: number; align?: 'left'|'right'|'center'; family?: string; color?: any; }){
  const containerRef = React.useRef<HTMLDivElement>(null);
  const spanRef = React.useRef<HTMLSpanElement>(null);
  const [size, setSize] = React.useState<number>(maxPx);

  const fit = React.useCallback(()=>{
    const c = containerRef.current, s = spanRef.current;
    if(!c || !s) return;
    let v = Math.min(maxPx, Math.max(minPx, size));
    // grow
    while(v < maxPx){
      s.style.fontSize = v+'px';
      if(s.scrollWidth <= c.clientWidth) v += step; else break;
    }
    if(v > maxPx) v = maxPx;
    s.style.fontSize = v+'px';
    // shrink
    while(s.scrollWidth > c.clientWidth && v > minPx){
      v -= step; s.style.fontSize = v+'px';
    }
    setSize(v);
  }, [size, maxPx, minPx, step, text]);

  React.useEffect(()=>{ fit(); }, [text, fit]);
  React.useEffect(()=>{ const onR=()=>fit(); window.addEventListener('resize',onR); return ()=>window.removeEventListener('resize',onR); }, [fit]);

  return (<div ref={containerRef} style={{width:'100%'}}>
    <span ref={spanRef} style={{display:'inline-block',width:'100%',textAlign:align as any,fontWeight:weight,fontFamily:family,fontSize:size,lineHeight:1.1,whiteSpace:'nowrap',color}}>{text}</span>
  </div>);
}

function BackspaceIcon(props: any){
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M9.5 6.5L4 12l5.5 5.5h8.5c1.1 0 2-.9 2-2v-7c0-1.1-.9-2-2-2H9.5z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M12 9l6 6M18 9l-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </SvgIcon>
  );
}

export default function Calculator(){
  const [display, setDisplay] = React.useState('0');
  const [prev, setPrev] = React.useState<string|null>(null);
  const [op, setOp] = React.useState<Op>(null);
  const [overwrite, setOverwrite] = React.useState(true);
  const [history, setHistory] = React.useState<HistoryItem[]>([]);
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [expr, setExpr] = React.useState('');

  const [selectionMode, setSelectionMode] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  React.useEffect(()=>{ try{ const raw = localStorage.getItem('calc-history'); if(raw) setHistory(JSON.parse(raw)); }catch{} },[]);
  React.useEffect(()=>{ try{ localStorage.setItem('calc-history', JSON.stringify(history)); }catch{} },[history]);

  const canBackspace = React.useMemo(()=> !overwrite && !(display === '0' || display === '-0'), [display, overwrite]);

  const inputDigit = (d: string) => {
    setDisplay(cur => {
      if (overwrite) { setOverwrite(false); return d === '.' ? '0.' : d; }
      if (d === '.' && cur.includes('.')) return cur;
      if (cur.replace('.', '').length >= 12) return cur;
      return cur === '0' && d !== '.' ? d : cur + d;
    });
  };

  const compute = (): string => {
    const a = Number(prev ?? '0'); const b = Number(display);
    let r = 0;
    switch (op) { case '+': r = a + b; break; case '-': r = a - b; break; case '×': r = a * b; break; case '÷': r = b === 0 ? NaN : a / b; break; default: r = b; }
    return r.toString();
  };

  const setOperator = (nextOp: Op) => {
    if (op && !overwrite) {
      const r = compute();
      setPrev(r); setDisplay(r); setOverwrite(true); setOp(nextOp);
      setExpr(e => (e ? e + ' ' + r + ' ' + nextOp : (r + ' ' + nextOp)));
      return;
    }
    setPrev(display); setOp(nextOp); setOverwrite(true);
    setExpr(e => {
      const trimmed = e?.trim(); if (!trimmed) return display + ' ' + nextOp;
      const ops = ['+','-','×','÷'];
      if (ops.includes(trimmed.slice(-1))) return trimmed.slice(0, -1) + nextOp;
      return trimmed + ' ' + nextOp;
    });
  };

  const toggleSign = () => { setDisplay(d => (d.startsWith('-') ? d.slice(1) : (d === '0' ? d : '-' + d))); };
  const percent = () => { setDisplay(d => (Number(d) / 100).toString()); };
  const clear = () => { setDisplay('0'); setPrev(null); setOp(null); setOverwrite(true); setExpr(''); };

  const backspace = () => {
    if (!canBackspace) return;
    setDisplay(d => {
      if (d.length <= 1) return '0';
      if (d.startsWith('-') && d.length === 2) return '0';
      const nd = d.slice(0, -1); if (nd === '' || nd === '-') return '0'; return nd;
    });
  };

  const equals = () => {
    const result = compute();
    const expression = (expr ? expr + ' ' + display : (op ? `${prev ?? '0'} ${op} ${display}` : display));
    setDisplay(result); setPrev(null); setOp(null); setOverwrite(true);
    const item: HistoryItem = { id: Math.random().toString(36).slice(2), expression, result, timestamp: Date.now() };
    setHistory(h => [item, ...h].slice(0, 200)); setHistoryOpen(true); setExpr('');
  };

  // keyboard
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key >= '0' && e.key <= '9') || e.key === '.') inputDigit(e.key);
      if (e.key === '+') setOperator('+');
      if (e.key === '-') setOperator('-');
      if (e.key === '*' || e.key.toLowerCase() === 'x') setOperator('×');
      if (e.key === '/') setOperator('÷');
      if (e.key === 'Enter' || e.key === '=') equals();
      if (e.key === 'Escape') clear();
      if (e.key === '%') percent();
      if (e.key === 'Backspace') backspace();
      if (e.key === 'Delete') clear();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [display, prev, op, overwrite, expr, canBackspace]);

  // selection mode helpers
  const toggleSelectionMode = () => { setSelectionMode(v => { const nv = !v; if (!nv) setSelectedIds(new Set()); return nv; }); };
  const isSelected = (id: string) => selectedIds.has(id);
  const toggleChecked = (id: string) => { setSelectedIds(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; }); };
  const selectAll = () => setSelectedIds(new Set(history.map(h => h.id)));
  const clearSelection = () => setSelectedIds(new Set());
  const deleteSelected = () => {
    if (selectedIds.size === 0) return;
    setHistory(h => { const keep = h.filter(it => !selectedIds.has(it.id)); try{ localStorage.setItem('calc-history', JSON.stringify(keep)); }catch{} return keep; });
    setSelectedIds(new Set());
  };
  const clearHistory = () => { setHistory([]); try{localStorage.removeItem('calc-history')}catch{} };

  const applyHistory = (h: HistoryItem) => { setDisplay(h.result); setPrev(null); setOp(null); setOverwrite(true); setHistoryOpen(false); };

  const Key = ({ label, onClick, variant='contained', sx={}, className='' }:
    { label: React.ReactNode; onClick: () => void; variant?: 'contained'|'outlined'|'text'; sx?: any; className?: string }
  ) => (
    <Button className={'key ' + className} onClick={onClick} variant={variant}
      sx={{ fontSize:{xs:28,sm:34,md:38}, fontWeight:700, borderRadius:'9999px', aspectRatio:'1 / 1', minHeight:{xs:76,sm:88}, ...sx }} fullWidth>
      {label}
    </Button>
  );

  return (
    <Box className="container">
      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ mb: 1 }}>
        <ThemeToggle />
      </Stack>

      <Paper elevation={3} className="calculator" sx={{ p: 2, borderRadius: 3 }}>
        <Box onClick={() => setHistoryOpen(true)} sx={{ mb: 1, p: 2, borderRadius: 2, bgcolor: 'background.paper', display: 'flex', flexDirection:'column', gap: .5, cursor: 'pointer' }}>
          <Typography variant="caption" color="text.secondary" sx={{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{expr || (op ? `${prev ?? '0'} ${op}` : '')}</Typography>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <div style={{ flex:1, minWidth:0 }}><AutoFitText text={formatNumber(display)} maxPx={56} minPx={18} step={1} weight={800} align="right" /></div>
            <HistoryIcon fontSize="small" />
          </Stack>
        </Box>

        <Divider sx={{ mb: 1 }} />

        <Grid container spacing={1}>
          <Grid item xs={3}><Key label="AC" onClick={clear} sx={{ bgcolor: 'secondary.main' }} /></Grid>
          <Grid item xs={3}><Key label={<BackspaceIcon sx={{ fontSize: "1.4em" }} />} onClick={backspace} sx={{ bgcolor: canBackspace ? 'primary.main' : 'secondary.main', opacity: canBackspace ? 1 : 0.6 }} /></Grid>
          <Grid item xs={3}><Key label="%" onClick={percent} sx={{ bgcolor: 'secondary.main' }} /></Grid>
          <Grid item xs={3}><Key label="÷" onClick={() => setOperator('÷')} sx={{ bgcolor: 'primary.main' }} /></Grid>

          <Grid item xs={3}><Key label="7" onClick={() => inputDigit('7')} /></Grid>
          <Grid item xs={3}><Key label="8" onClick={() => inputDigit('8')} /></Grid>
          <Grid item xs={3}><Key label="9" onClick={() => inputDigit('9')} /></Grid>
          <Grid item xs={3}><Key label="×" onClick={() => setOperator('×')} sx={{ bgcolor: 'primary.main' }} /></Grid>

          <Grid item xs={3}><Key label="4" onClick={() => inputDigit('4')} /></Grid>
          <Grid item xs={3}><Key label="5" onClick={() => inputDigit('5')} /></Grid>
          <Grid item xs={3}><Key label="6" onClick={() => inputDigit('6')} /></Grid>
          <Grid item xs={3}><Key label="−" onClick={() => setOperator('-')} sx={{ bgcolor: 'primary.main' }} /></Grid>

          <Grid item xs={3}><Key label="1" onClick={() => inputDigit('1')} /></Grid>
          <Grid item xs={3}><Key label="2" onClick={() => inputDigit('2')} /></Grid>
          <Grid item xs={3}><Key label="3" onClick={() => inputDigit('3')} /></Grid>
          <Grid item xs={3}><Key label="+" onClick={() => setOperator('+')} sx={{ bgcolor: 'primary.main' }} /></Grid>

          <Grid item xs={3}><Key label="+/−" onClick={toggleSign} sx={{ bgcolor: 'secondary.main' }} /></Grid>
          <Grid item xs={3}><Key label="0" onClick={() => inputDigit('0')} /></Grid>
          <Grid item xs={3}><Key label="." onClick={() => inputDigit('.')} /></Grid>
          <Grid item xs={3}><Key label="=" onClick={equals} sx={{ bgcolor: 'primary.main' }} /></Grid>
        </Grid>
      </Paper>

      <Drawer anchor="right" open={historyOpen} onClose={() => setHistoryOpen(false)}>
        <Box sx={{ width: { xs: 300, sm: 360 }, p: 2, height: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={700}>연산 히스토리</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              {selectionMode ? (
                <>
                  <IconButton onClick={deleteSelected} title="Delete selected" color="error" disabled={selectedIds.size === 0}><DeleteForeverIcon/></IconButton>
                  <IconButton onClick={toggleSelectionMode} title="Exit selection mode"><CancelIcon/></IconButton>
                </>
              ) : (
                <IconButton onClick={toggleSelectionMode} title="Selection mode"><ChecklistIcon/></IconButton>
              )}
              <IconButton onClick={clearHistory} title="히스토리 비우기"><DeleteOutlineIcon/></IconButton>
            </Stack>
          </Stack>
          <Typography variant="body2" color="text.secondary">{selectionMode ? 'Select items to delete (tap checkboxes).' : '항목을 클릭하면 해당 결과로 이어서 계산합니다.'}</Typography>
          {selectionMode && (
            <Stack direction="row" spacing={1} sx={{ my: 1 }}>
              <Button size="small" variant="outlined" onClick={selectAll}>Select All</Button>
              <Button size="small" variant="outlined" onClick={clearSelection}>Clear</Button>
              <Button size="small" variant="contained" color="error" onClick={deleteSelected} disabled={selectedIds.size === 0}>Delete Selected</Button>
            </Stack>
          )}
          <Divider/>
          <Box sx={{ overflowY: 'auto' }}>
            <List dense>
              {history.length === 0 && (<ListItem><ListItemText primary="기록이 없습니다." /></ListItem>)}
              {history.map(h => (
                <ListItem key={h.id} className="history-item" disablePadding>
                  {selectionMode && (
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Checkbox checked={isSelected(h.id)} onClick={(e) => { e.stopPropagation(); toggleChecked(h.id); }} />
                    </ListItemIcon>
                  )}
                  <ListItemButton onClick={() => applyHistory(h)}>
                    <ListItemText
                      primary={h.expression + ' = ' + h.result}
                      secondary={new Date(h.timestamp).toLocaleString()}
                      primaryTypographyProps={{ sx: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace' } }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
