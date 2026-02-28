# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Client-side SPA dashboard built with Vite 7, React 19, and TypeScript 5.8. Uses React Router 7 in library mode (no framework). Talks to a separate Python API backend.

## Build & Validation Commands

**IMPORTANT: After every code change, validate the build succeeds**

- **Dev server:** `npm run dev` (starts Vite dev server on port 5173 with HMR)
- **Build:** `npm run build` (runs `tsc -b && vite build`, outputs to `dist/`)
- **Lint:** `npm run lint` (ESLint with TypeScript and React Hooks rules)
- **Preview production build:** `npm run preview`
- **Add a shadcn component:** `npx shadcn@latest add <component-name>`

No test framework is configured yet.

## Architecture

- **Entry point:** `index.html` → `src/main.tsx` (BrowserRouter + route definitions) → `src/App.tsx` (root layout)
- **Build tool:** Vite with SWC plugin for React Fast Refresh
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite` plugin. Theme variables defined in `src/index.css`.
- **Routing:** React Router 7 in library mode. Routes defined in `main.tsx`. `App.tsx` is the root layout (nav + `<Outlet />`). Page components live in `src/pages/`.
- **State management:** Local React hooks only (no global state library)
- **Path alias:** `@/*` maps to `./src/*` (configured in tsconfig + vite.config.ts)

## shadcn/ui

Component library using Radix UI primitives + Tailwind CSS. Configuration in `components.json`.

- **Adding components:** `npx shadcn@latest add <name>` — this copies component source into `src/components/ui/`. Components are owned code, not node_modules; edit them directly when needed.
- **Imports:** `import { Button } from "@/components/ui/button"`
- **Utility function:** `cn()` from `@/lib/utils` for merging Tailwind classes (clsx + tailwind-merge)
- **Theming:** CSS variables in `src/index.css` using oklch color space. Semantic tokens follow `background`/`foreground` convention (e.g. `--primary` / `--primary-foreground`). Dark mode via `.dark` class.
- **Icons:** Lucide React (`lucide-react`)
- **Component docs (AI-optimised):** Each component has an `.md` version at `ui.shadcn.com/docs/components/<name>.md` with full source code — fetch these when you need implementation details.
- **ESLint:** `react-refresh/only-export-components` is disabled for `src/components/ui/` since shadcn components export variant helpers alongside components.

## TypeScript

Strict mode is enabled. The project uses two tsconfig files referenced from the root `tsconfig.json`:

- `tsconfig.app.json` — app source (ES2022, react-jsx, bundler resolution)
- `tsconfig.node.json` — build tooling (vite.config.ts)

`noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch` are all enabled.

## ESLint

Uses flat config format (ESLint 9.x) with TypeScript ESLint recommended rules and React Hooks plugin.
