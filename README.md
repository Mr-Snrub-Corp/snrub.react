# snrub.react

React SPA for the Snrub Corp Nuclear Power Plant dashboard. Built with React 19, Vite 7, TypeScript, and React Router 7. Talks to the Python API in [snrub.api](https://github.com/Mr-Snrub-Corp/snrub.api).

## Project structure

```
snrub.react/
├── public/                 # Static assets served as-is
├── src/
│   ├── components/
│   │   └── ui/             # shadcn/ui components (owned source)
│   ├── constants/          # Shared constants (roles, statuses, etc.)
│   ├── hooks/              # Reusable React hooks
│   ├── layouts/            # Auth and dashboard layouts
│   ├── lib/                # Shared utilities (e.g. cn())
│   ├── pages/              # Route-level views (auth/, dashboard/)
│   ├── services/           # HTTP client and API calls
│   ├── stores/             # Client state (Zustand)
│   ├── test/               # Vitest setup
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Pure helper functions
│   ├── App.tsx             # Root layout
│   ├── main.tsx            # Entry point and route definitions
│   └── index.css           # Tailwind theme and global styles
├── components.json         # shadcn/ui CLI config
├── Dockerfile
└── package.json
```

## Local development

This repo is run as the **React frontend** alongside the API. Docker Compose lives in [snrub.api](https://github.com/Mr-Snrub-Corp/snrub.api) — see its [README](https://github.com/Mr-Snrub-Corp/snrub.api#local-development) for full setup.

1. Clone both repos into adjacent folders:

   ```
   parent/
   ├── snrub.api/
   └── snrub.react/
   ```

2. Follow the snrub.api local development steps (env file, Docker Compose, migrations, etc.).

3. Start the stack with the React profile:

   ```bash
   COMPOSE_PROFILES=react docker compose up -d --build
   ```

   Or set `COMPOSE_PROFILES=react` in the `.env` next to `docker-compose.yaml` in snrub.api.

The client is served by Docker as part of that stack. API docs: http://localhost:8000/docs

## End-to-End Tests

E2E tests live in [`Mr-Snrub-Corp/snrub.e2e`](https://github.com/Mr-Snrub-Corp/snrub.e2e) — not this repo. This allows the same test suite to run against the Vue, React, and Angular versions of the app.

On pull request, `.github/workflows/e2e.yaml` dispatches a `react-pr` event to `snrub.e2e` with the branch name. Results appear in the `snrub.e2e` Actions tab.

## Scripts

| Command             | Description                    |
| ------------------- | ------------------------------ |
| `npm run dev`       | Vite dev server with HMR       |
| `npm run build`     | Typecheck and production build |
| `npm run lint`      | ESLint                         |
| `npm run test:unit` | Vitest unit tests              |
| `npm run preview`   | Preview production build       |

## AI coding

Collaborators can run `npx skills install` to update agent skills.
