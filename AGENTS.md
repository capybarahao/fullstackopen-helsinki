# AGENTS.md

## Repo overview

Full Stack Open (University of Helsinki) course exercises. Each `partN/` subdirectory is an **independent project** with its own `node_modules`. There is no root `package.json` or monorepo tooling.

## Project map

| Directory | Type | Stack | Notes |
|-----------|------|-------|-------|
| `part0/` | docs | Mermaid diagrams | Markdown only, no code |
| `part1/courseinfo/` | frontend | React 19 + Vite 7 | |
| `part1/unicafee/` | frontend | React 19 + Vite 7 | |
| `part2/courseinfo-v2/` | frontend | React 19 + Vite 7 | |
| `part2/phonebook/` | frontend | React 19 + Vite 7 + axios | Uses `json-server` for mock backend |
| `part3/p-book-backend/` | backend | Express 5 + CommonJS | **Not ESM** (`"type": "commonjs"`) |

## Commands

Every command must be run **inside the target project directory**:

```
cd part2/phonebook
npm install
npm run dev        # start dev server (Vite or Node --watch)
npm run build      # production build (Vite projects only)
npm run lint       # ESLint (Vite projects only)
```

- **phonebook**: run `npx json-server --watch db.json` (or similar) alongside the frontend to serve mock data.
- **p-book-backend**: `npm run dev` uses `node --watch index.js`; `npm start` uses plain `node`.
- No test scripts are configured in any project.

## Conventions

- No TypeScript (JS only, despite `@types/react` in devDependencies).
- No CI, no pre-commit hooks, no shared tooling.
- ESLint 9 flat config is used in all Vite projects.
- When adding a new exercise, create a new subdirectory under the appropriate `partN/` with its own `package.json`.
