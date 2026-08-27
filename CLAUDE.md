# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start Vite dev server (http://localhost:5173)
npm run build     # tsc -b (type check) then vite build
npm run lint      # oxlint
npm run preview   # preview the production build
npm run generate  # regenerate src/routeTree.gen.ts after adding/changing routes
```

There is no test suite configured. `build1` / `lint1` / `preview1` are legacy alternates (`tsr generate` + ESLint) kept for reference but not the standard path — use the commands above.

## Architecture

React + TypeScript + Vite app rendering a MapLibre GL JS map, with **map view state (center/zoom/bearing/pitch) synced to URL query parameters** so a map view can be shared/reproduced via URL alone.

- **Routing**: TanStack Router in file-based mode. Routes live in `src/routes/`; `src/routeTree.gen.ts` is auto-generated from that directory by the `tanstackRouter()` Vite plugin (runs on `npm run dev`/`build`, or manually via `npm run generate`) — never hand-edit it.
  - `src/routes/__root.tsx` — root layout (`Header` + `Footer` around an `Outlet`).
  - `src/routes/index.tsx` — landing page linking into `/map`.
  - `src/routes/map.tsx` — the map screen; owns the MapLibre `Map` instance and its search-param schema.
- **URL state pattern** (`src/routes/map.tsx`): a `zod` schema (`mapSearchSchema`) validates/defaults `lat`/`lng`/`zoom`/`bearing`/`pitch` search params via `validateSearch`. The MapLibre instance is created once in a `useEffect` with an empty dependency array from the *initial* search params; on `moveend` the map's current view is written back into the URL with `navigate({ search: ..., replace: true })`. When touching this file, preserve that one-way-in/one-way-out flow (URL → initial map state on mount; map moves → URL) rather than binding the URL reactively to the live map view.
- **Map style**: currently a hand-written raster `StyleSpecification` pointing at GSI (国土地理院) tiles (`gsiStyle` in `map.tsx`), replacing the CARTO basemap mentioned in the README. GSI's terms of use require the attribution link present in the style — keep it if the source changes.
- **Vite `base` path**: `vite.config.ts` sets `base: "/maplibre-app/"` only when `command === "build"` (dev stays at `/`), because this app deploys to a GitHub Pages *project* page at `https://kankocityis.github.io/maplibre-app/`. The router's `basepath` in `src/main.tsx` is derived from `import.meta.env.BASE_URL` to stay in sync — if the repo/Pages path ever changes, update both together (plus `%BASE_URL%` in `index.html`).
- **GitHub Pages SPA fallback**: `public/404.html` + a decode script in `index.html` implement the standard [spa-github-pages](https://github.com/rafgraph/spa-github-pages) redirect trick, since GitHub Pages can't do server-side SPA rewrites. Needed because direct navigation/reload on `/map` would otherwise 404.
- **CI/CD**: `.github/workflows/ci.yml` runs lint + build on push/PR to `main`. `.github/workflows/deploy.yml` builds and deploys `dist/` to GitHub Pages on push to `main` (repo Pages source must be set to "GitHub Actions").
- **Styling**: inline `style` objects throughout, using CSS custom properties defined in `src/index.css` (`--bg`, `--text`, `--text-h`, `--border`, `--accent`, `--shadow`) rather than a component/CSS-module system.
- **Entry point**: `src/main.tsx` mounts `RouterProvider`. (`src/App.tsx` is the unused Vite starter template component — not part of the render tree.)
