'use client';

import * as React from 'react';
import {
  Box, Paper, Typography, Grid, Button, Divider, Drawer, List, ListItem, ListItemButton, ListItemText, IconButton, Stack
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
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

export default function Calculator() {
  const [display, setDisplay] = React.useState('0');
  const [prev, setPrev] = React.useState<string | null>(null);
  const [op, setOp] = React.useState<Op>(null);
  const [overwrite, setOverwrite] = React.useState(true);
  const [history, setHistory] = React.useState<HistoryItem[]>([]);
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [expr, setExpr] = React.useState<string>('');

  React.useEffect(() => {
    try { const raw = localStorage.getItem('calc-history'); if (raw) setHistory(JSON.parse(raw)); } catch {}
  }, []);
  React.useEffect(() => {
    try { localStorage.setItem('calc-history', JSON.stringify(history)); } catch {}
  }, [history]);

  const inputDigit = (d: string) => {
    setDisplay(prevDisp => {
      if (overwrite) { setOverwrite(false); return d === '.' ? '0.' : d; }
      if (d === '.' && prevDisp.includes('.')) return prevDisp;
      if (prevDisp.replace('.', '').length >= 12) return prevDisp;
      return prevDisp === '0' && d !== '.' ? d : prevDisp + d;
    });
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
      const trimmed = e?.trim();
      if (!trimmed) return display + ' ' + nextOp;
      const ops = ['+','-','×','÷'];
      if (ops.includes(trimmed.slice(-1))) return trimmed.slice(0, -1) + nextOp;
      return trimmed + ' ' + nextOp;
    });
  };

  const toggleSign = () => { setDisplay(d => (d.startsWith('-') ? d.slice(1) : (d === '0' ? d : '-' + d))); };
  const percent = () => { setDisplay(d => (Number(d) / 100).toString()); };
  const clear = () => { setDisplay('0'); setPrev(null); setOp(null); setOverwrite(true); setExpr(''); };

  const compute = (): string => {
    const a = Number(prev ?? '0'); const b = Number(display);
    let r = 0;
    switch (op) {
      case '+': r = a + b; break;
      case '-': r = a - b; break;
      case '×': r = a * b; break;
      case '÷': r = b === 0 ? NaN : a / b; break;
      default: r = b;
    }
    return r.toString();
  };

  const equals = () => {
    const result = compute();
    const expression = (expr ? expr + ' ' + display : (op ? `${prev ?? '0'} ${op} ${display}` : display));
    setDisplay(result); setPrev(null); setOp(null); setOverwrite(true);
    const item: HistoryItem = { id: Math.random().toString(36).slice(2), expression, result, timestamp: Date.now() };
    setHistory(h => [item, ...h].slice(0, 200));
    setHistoryOpen(true);
    setExpr('');
  };

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
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [display, prev, op]);

  const Key = ({ label, onClick, variant='contained', sx={}, className='' }:
    { label: React.ReactNode; onClick: () => void; variant?: 'contained'|'outlined'|'text'; sx?: any; className?: string }
  ) => (
    <Button
      className={'key ' + className}
      onClick={onClick}
      variant={variant}
      sx={{
        fontSize: { xs: 28, sm: 34, md: 38 }, fontWeight: 700,
        borderRadius: '9999px',
        aspectRatio: '1 / 1',
        minHeight: { xs: 76, sm: 88 },
        ...sx,
      }}
      fullWidth
    >
      {label}
    </Button>
  );

  return (
    <Box className="container">
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="h5" fontWeight={700}>계산기</Typography>
        <ThemeToggle />
      </Stack>

      <Paper elevation={3} className="calculator" sx={{ p: 2, borderRadius: 3 }}>
        <Box onClick={() => setHistoryOpen(true)} sx={{ mb: 1, p: 2, borderRadius: 2, bgcolor: 'background.paper', display: 'flex', flexDirection:'column', gap: .5, cursor: 'pointer' }}>
          <Typography variant="caption" color="text.secondary" sx={{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{expr || (op ? `${prev ?? '0'} ${op}` : '')}</Typography>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Typography variant="h3" className="display" sx={{ fontWeight: 700 }}>{formatNumber(display)}</Typography>
            <HistoryIcon fontSize="small" />
          </Stack>
        </Box>

        <Divider sx={{ mb: 1 }} />

        <Grid container spacing={1}>
          <Grid item xs={3}><Key label="AC" onClick={clear} sx={{ bgcolor: 'secondary.main' }} /></Grid>
          <Grid item xs={3}><Key label="+/−" onClick={toggleSign} sx={{ bgcolor: 'secondary.main' }} /></Grid>
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

          <Grid item xs={3}><Key label="0" onClick={() => inputDigit('0')} /></Grid>
          <Grid item xs={3}><Key label="." onClick={() => inputDigit('.')} /></Grid>
          <Grid item xs={3}><Key label="=" onClick={() => equals()} sx={{ bgcolor: 'primary.main' }} /></Grid>
          <Grid item xs={3}><Key label=" " onClick={() => {}} sx={{ visibility:'hidden' }} /></Grid>
        </Grid>
      </Paper>

      <Drawer anchor="right" open={historyOpen} onClose={() => setHistoryOpen(false)}>
        <Box sx={{ width: { xs: 300, sm: 360 }, p: 2, height: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={700}>연산 히스토리</Typography>
            <IconButton onClick={() => { setHistory([]); try { localStorage.removeItem('calc-history'); } catch {} }} title="히스토리 비우기"><DeleteOutlineIcon /></IconButton>
          </Stack>
          <Typography variant="body2" color="text.secondary">항목을 클릭하면 해당 결과로 이어서 계산합니다.</Typography>
          <Divider />
          <Box sx={{ overflowY: 'auto' }}>
            <List dense>
              {history.length === 0 && (<ListItem><ListItemText primary="기록이 없습니다." /></ListItem>)}
              {history.map(h => (
                <ListItem key={h.id} className="history-item" disablePadding>
                  <ListItemButton onClick={() => { setDisplay(h.result); setPrev(null); setOp(null); setOverwrite(true); setHistoryOpen(false); }}>
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
