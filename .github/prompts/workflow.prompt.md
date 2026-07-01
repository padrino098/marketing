---
name: workflow
description: >
  Open the TMT Marketing Dashboard roadmap and launch the live preview.
  Use when: "show workflow", "open dashboard", "view codebase roadmap",
  "run the app", "open localhost", "show me the app".
mode: agent
tools:
  - open_browser_page
  - run_in_terminal
---

# TMT Marketing Dashboard — Workflow Prompt

When this prompt is invoked, do the following in order:

1. **Start the dev server** if it is not already running:
   ```
   cmd /c "cd /d C:\Users\Gian\Downloads\TMT-Marketing-dashboard-main\TMT-Marketing-dashboard-main && npm run dev"
   ```
   Run it in async/background mode so it keeps running.

2. **Open the live preview** in the integrated browser:
   - URL: `http://localhost:5173/`

3. **Display the codebase roadmap** from [workflow.md](../../workflow.md).

---

## Codebase Snapshot

| Layer | Key File |
|-------|---------|
| Entry point | `src/main.tsx` |
| Root component | `src/App.tsx` (~3 200 lines) |
| Types | `src/types/index.ts` |
| Seed data & constants | `src/data/initialData.ts` |
| Time utilities | `src/utils/timeUtils.ts` |
| Video utilities | `src/utils/videoUtils.ts` |

## Quick Commands

```bash
npm run dev      # Dev server → http://localhost:5173
npm run build    # Production build → dist/
npm run preview  # Preview production build
```

## Key Extension Points

| Goal | File | What to edit |
|------|------|-------------|
| Add pipeline stage | `src/data/initialData.ts` | `INITIAL_STAGES` |
| Add team member name | `src/data/initialData.ts` | `TEAM_MEMBERS` |
| Add content type | `src/data/initialData.ts` | `INITIAL_TYPES` |
| Change role desk stages | `src/App.tsx` | `myDeskData` useMemo |
| Add project field | `src/types/index.ts` → `initialData.ts` → `App.tsx` | Interface + seed + form |

See [workflow.md](../../workflow.md) for the full roadmap.
