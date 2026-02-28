# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Client-side SPA dashboard built with Vite 7, React 19, and TypeScript 5.8. Uses React Router 7 in library mode (no framework). Talks to a separate Python API backend.

## Commands

- **Dev server:** `npm run dev` (starts Vite dev server on port 5173 with HMR)
- **Build:** `npm run build` (runs `tsc -b && vite build`, outputs to `dist/`)
- **Lint:** `npm run lint` (ESLint with TypeScript and React Hooks rules)
- **Preview production build:** `npm run preview`

No test framework is configured yet.

## Architecture

- **Entry point:** `index.html` → `src/main.tsx` (BrowserRouter + route definitions) → `src/App.tsx` (root layout)
- **Build tool:** Vite with SWC plugin for React Fast Refresh
- **Styling:** Plain CSS (index.css for globals, App.css for component styles)
- **Routing:** React Router 7 in library mode. Routes defined in `main.tsx`. `App.tsx` is the root layout (nav + `<Outlet />`). Page components live in `src/pages/`.
- **State management:** Local React hooks only (no global state library)

## TypeScript

Strict mode is enabled. The project uses two tsconfig files referenced from the root `tsconfig.json`:
- `tsconfig.app.json` — app source (ES2022, react-jsx, bundler resolution)
- `tsconfig.node.json` — build tooling (vite.config.ts)

`noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch` are all enabled.

## ESLint

Uses flat config format (ESLint 9.x) with TypeScript ESLint recommended rules and React Hooks plugin.
