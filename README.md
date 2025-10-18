# Next.js Calculator — iPhone Style + History + MUI (Dark by Default)

A sleek **iPhone‑style calculator** built with **Next.js (App Router)** and **Material UI**.  
When you press `=`, a right‑side **History Drawer** opens automatically, and **clicking a history item immediately restores its result to the display** so you can **continue calculating** from there.

> Default theme is **Dark**. Includes **round keypad**, **live expression above result**, **Light/Dark/Night theme toggle**, and **large button typography**.

---

## ✨ Features

- **iPhone‑like round keys** (square size with fully rounded corners)
- **History auto‑opens on `=`** (also opens by tapping the display)
- **Click history ⇒ continue from that result** instantly
- **Live expression shown above the main result**
- **3 Themes**: Light / Dark (default) / Night (navy tone)
- **Responsive layout** powered by MUI Grid
- **History persisted in LocalStorage**
- **Keyboard input**: `0–9`, `.`, `+ - * /`, `Enter/=` (calculate), `Esc` (AC), `%`

---

## 🧰 Tech Stack

- **Next.js 15 (App Router)**
- **React 18**
- **Material UI v5** (`@mui/material`, `@mui/icons-material`, `@emotion/*`)
- **TypeScript**

---

## 🚀 Getting Started

```bash
pnpm install   # or: npm i / yarn
pnpm dev
```

Production:
```bash
pnpm build && pnpm start
```

> **Tip:** If you see an icon‑related error, install icons with:  
> `pnpm add @mui/icons-material`

---

## 📁 Project Structure

```
app/
  layout.tsx          # Server component root layout + ThemeRegistry
  page.tsx            # Entry renders the client Calculator
  globals.css         # Global styles (type scale, resets, etc.)
components/
  Calculator.tsx      # iPhone keypad, chained ops, history/display logic
  ThemeRegistry.tsx   # MUI ThemeProvider, persists theme in localStorage
  ThemeToggle.tsx     # Light/Dark/Night toggle UI
theme.ts              # getDesignTokens: palettes/shapes/typo for 3 themes
next.config.mjs       # experimental.optimizePackageImports config
package.json          # scripts & deps
tsconfig.json         # TypeScript settings
```

---

## 🧠 Core Components & Logic

### `Calculator.tsx`
- **State**
  - `display`: current value shown
  - `prev`: previous operand
  - `op`: current operator (`+ | - | × | ÷ | null`)
  - `overwrite`: whether next input overwrites `display`
  - `history`: calculation history (saved/loaded via LocalStorage)
  - `historyOpen`: right drawer visibility
  - `expr`: text for the live “current expression”

- **Key Behaviors**
  - `setOperator(op)`: chained operator handling (compute previous, queue next)
  - `equals()`: compute → push to history → open Drawer → reset `expr`
  - `applyHistory(item)`: clicking a history item sets its result to `display`
  - Global **keyboard** handling via `keydown`

- **UI Notes**
  - **Round keys**: `borderRadius: '9999px'`, `aspectRatio: '1 / 1'`
  - **Large labels**: `xs 28px / sm 34px / md 38px`, `fontWeight: 700`
  - **Top display**: `expr` (caption) + `display` (h3 weight/scale)

### `ThemeRegistry.tsx`
- Supports **Light/Dark/Night** modes
- **Default is Dark** (when `calc-theme` not found in LocalStorage)

### `theme.ts`
- Defines palette for Dark/Night backgrounds/text/primary
- **Orange primary for operator keys**: `primary.main = #ff9f0a`

---

## 🔧 Customization

- **Button label size**: tweak `sx.fontSize` in `Key` (inside `Calculator.tsx`)
- **Button height**: adjust `sx.minHeight`
- **Theme colors**: edit `getDesignTokens()` in `theme.ts`
- **Max history length**: change `history.slice(0, 200)`
- **Number formatting**: extend `formatNumber()` for currency/fixed decimals

---

## 🧩 Changelog (for this iteration)

1. **v1 (Initial)**
   - Next.js + MUI calculator scaffold
   - History Drawer, LocalStorage persistence, theme toggle, keyboard input
2. **Fixes**
   - Resolved icon import error by adding `@mui/icons-material`
   - Migrated deprecated `ListItem button` ⇒ `ListItemButton` (MUI v5)
3. **UI Enhancements**
   - **Dark mode by default**
   - **Uniform round buttons** (including `0` key)
   - **Live expression** above result
   - **iOS‑like orange** for operator keys
4. **Readability**
   - Larger, heavier button typography
   - Increased minimum button height

---

## ❓ Troubleshooting

- **Icon module error**
  - Install: `pnpm add @mui/icons-material`  
- **TypeScript warnings**
  - Use `ListItemButton` instead of `ListItem button` in MUI v5.

---

## ⌨️ Keyboard Map

- Digits & dot: `0–9`, `.`
- Operators: `+ - * /`
- Calculate: `Enter` or `=`
- All Clear: `Esc`
- Percent: `%`

---

## 📜 License

Demo / sample use. Replace with your project’s license as needed.
