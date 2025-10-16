# Next.js 계산기 — iPhone 스타일 + 히스토리 + MUI (다크 기본)

이 저장소는 **Next.js (App Router)** + **Material UI**로 구현한 아이폰 스타일 계산기입니다.  
`=`을 누르면 우측 **히스토리 Drawer**가 자동으로 열리고, **히스토리 항목을 클릭하면 결과가 즉시 디스플레이에 반영**되어 **이어 계산**이 가능합니다.  
요청 사항에 따라 **다크모드 기본**, **원형 키패드**, **결과 상단 수식 표시**, **라이트/다크/나이트 테마 토글**, **버튼 폰트 대형화**를 반영했습니다.

---

## 주요 기능

- **아이폰 느낌의 원형 버튼** (정사각 비율 + 완전 라운드)
- **= 누르면 히스토리 패널 자동 표시** (또는 디스플레이 클릭해도 열림)
- **히스토리 클릭 → 해당 결과로 바로 이어 계산**
- **결과 상단에 현재 계산식 실시간 표시**
- **3가지 테마**: Light / Dark(기본) / Night (네이비 톤)
- **반응형 레이아웃** (MUI Grid)
- **로컬스토리지에 히스토리 영구 저장**
- **키보드 입력 지원**: `0-9`, `.`, `+ - * /`, `Enter/=`(계산), `Esc`(AC), `%`

---

## 기술 스택

- **Next.js 15 (App Router)**
- **React 18**
- **Material UI v5** (`@mui/material`, `@mui/icons-material`, `@emotion/*`)
- TypeScript

---

## 설치 & 실행

```bash
pnpm install   # 또는 npm i / yarn
pnpm dev
```

프로덕션:
```bash
pnpm build && pnpm start
```

---

## 폴더 구조

```
app/
  layout.tsx          # 서버 컴포넌트 루트 레이아웃 + ThemeRegistry
  page.tsx            # 계산기 페이지 진입점 (클라이언트 Calculator 렌더)
  globals.css         # 전역 스타일 (탭룰 숫자, 기본 타이포 등)
components/
  Calculator.tsx      # 아이폰 스타일 키패드, 체인 연산, 히스토리/표시 로직
  ThemeRegistry.tsx   # MUI ThemeProvider, 모드 상태(localStorage) 저장
  ThemeToggle.tsx     # Light/Dark/Night 토글 UI
theme.ts               # getDesignTokens: 3가지 테마 팔레트/셰이프/타이포
next.config.mjs        # experimental.optimizePackageImports 설정
package.json           # 의존성 및 스크립트
tsconfig.json          # TS 설정
```

---

## 주요 컴포넌트/로직

### `Calculator.tsx`
- **상태**
  - `display`: 현재 표시값
  - `prev`: 직전 피연산자
  - `op`: 현재 연산자 (`+ | - | × | ÷ | null`)
  - `overwrite`: 새 입력이 표시값을 덮어쓸지 여부
  - `history`: 연산 히스토리(로컬스토리지에 저장/로드)
  - `historyOpen`: 히스토리 Drawer 열림 여부
  - `expr`: 상단에 보여줄 “현재 수식” 텍스트

- **핵심 동작**
  - `setOperator(op)`: 연산자 체인 처리 (선계산 후 다음 연산으로 연결)
  - `equals()`: 계산수행 → 히스토리 push → Drawer 자동 오픈 → `expr` 초기화
  - `applyHistory(item)`: 히스토리 항목 클릭 시 해당 결과를 `display`로 세팅
  - 키보드 이벤트 처리 (`keydown`)

- **UI**
  - **원형 키**: `Button`에 `borderRadius: '9999px'`, `aspectRatio: '1 / 1'`
  - **버튼 폰트**: `xs 28px / sm 34px / md 38px`, `fontWeight: 700`
  - **상단 표시부**: `expr`(caption) + `display`(h3)

### `ThemeRegistry.tsx`
- 라이트/다크/나이트 모드 지원
- 초깃값: **다크** (로컬스토리지에 `calc-theme`가 없으면 다크)

### `theme.ts`
- 다크/나이트의 배경/텍스트/primary 색상 정의
- 아이폰 느낌의 **오렌지 연산 키**: `primary.main = #ff9f0a`

---

## 커스터마이징 포인트

- **버튼 라벨 크기**: `Calculator.tsx`의 `Key` 컴포넌트 `sx.fontSize` 조정
- **버튼 높이**: `sx.minHeight` 조정
- **테마 색상**: `theme.ts`의 `getDesignTokens()` 수정
- **히스토리 최대 개수**: `history.slice(0, 200)` 범위 변경
- **숫자 포맷**: `formatNumber()`에서 통화/고정소수점 등 확장 가능

---

## 변경 이력 (이번 대화 기준)

1. **v1 (초판)**
   - Next.js + MUI 기반 계산기 구현
   - 히스토리 Drawer, 로컬스토리지 저장, 테마 토글, 키보드 입력 지원

2. **아이콘 누락 오류 수정**
   - 에러: `Module not found: Can't resolve '@mui/icons-material/History'`
   - 조치: `@mui/icons-material` 의존성 추가
   - `ListItem button` API 경고 해결 위해 `ListItemButton`으로 마이그레이션

3. **UI 확장 (요청 반영)**
   - 기본값 **다크 모드**
   - **원형 버튼**(모든 키 동일 폭) 및 **0 버튼도 원형 유지**
   - 결과 **상단에 계산식(expr)** 표시
   - 아이폰톤 **primary 오렌지** 적용

4. **가독성 개선**
   - **버튼 숫자 크게**: `xs 28px / sm 34px / md 38px`, `fontWeight: 700`
   - 버튼 최소 높이 상향

---

## 자주 묻는 빌드 이슈

- **아이콘 모듈 에러**
  - `@mui/icons-material` 설치 필요: `pnpm add @mui/icons-material`
- **타입/경고**
  - MUI v5에서는 `ListItem button` 대신 `ListItemButton` 사용

---

## 라이선스
- 샘플/데모 용도 (필요시 프로젝트 정책에 맞게 라이선스 추가하세요)
