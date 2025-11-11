# Frontend (React + Vite + Tailwind)

## Setup
```bash
npm install
npm run dev
```
- Edit `src/App.jsx` to customize content.
- Projects data source:
  - Default: local JSON at `src/data/projects.json`.
  - Optional remote API: set Vite env vars:
    - `VITE_PROJECTS_SOURCE=remote`
    - `VITE_API_BASE=http://127.0.0.1:5000` (Flask)
  - Image fallback: if a project has no `image`, a generic placeholder at `/images/coder-placeholder.svg` is used.

## Projects Data Model
- Required: `title`
- Optional: `desc`, `tags` (string[]), `image` (URL or `/images/...` in `public`), `featured` (bool), `date` (`YYYY-MM-DD`), `links` object with `repo`/`demo`, or top-level `repo`/`demo`.
- Items are normalized and sorted: featured first, then by date (newest), then title.

## Profile Configuration
- Default profile lives at `src/data/profile.json`.
- Override any field via env vars (create `.env.local`):
  - `VITE_NAME`, `VITE_TAG`, `VITE_EMAIL`, `VITE_GITHUB`, `VITE_LINKEDIN`

## Hero Configuration
- Default hero content is at `src/data/hero.json`.
- Optional env overrides (create `.env.local`):
  - `VITE_HERO_BADGE`, `VITE_HERO_TITLE`, `VITE_HERO_SUBTITLE`
  - `VITE_HERO_PRIMARY_LABEL`, `VITE_HERO_PRIMARY_HREF`
  - `VITE_HERO_SECONDARY_LABEL`, `VITE_HERO_SECONDARY_HREF` (supports `{email}` placeholder)
  - `VITE_HERO_SHOW_PREVIEW` (`true`/`false`), `VITE_HERO_PREVIEW_IMAGE`, `VITE_HERO_PREVIEW_TEXT`
  - If no `previewImage` is provided, the hero falls back to `/images/coder-placeholder.svg`.
