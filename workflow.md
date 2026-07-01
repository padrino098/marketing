# TMT Marketing Dashboard — Codebase Workflow & Roadmap

> **Live Preview**: [http://localhost:5173/](http://localhost:5173/)  
> Start the dev server with: `npm run dev` (or `cmd /c "npm run dev"` on Windows with restricted PowerShell)

---

## Project Overview

**TMT Marketing Dashboard** is a React 18 + Vite + TypeScript + Tailwind CSS single-page application for managing video content production pipelines. It provides role-based dashboards, a Kanban board, a data grid, and a multi-mode scheduler to coordinate a marketing team from ideation through publication.

**Stack**: React 18 · TypeScript 5 · Vite 7 · Tailwind CSS 3 · Firebase 10 (optional) · Lucide React icons

---

## Folder Structure

```
TMT-Marketing-dashboard-main/
├── index.html                   # HTML shell — mounts <div id="root">
├── package.json                 # Scripts + dependency manifest
├── vite.config.ts               # Vite bundler — React plugin, @/* path alias
├── tsconfig.json                # TS config — ES2020, bundler resolution, strict: false
├── tsconfig.node.json           # TS config for Vite/Node files
├── tailwind.config.js           # Tailwind content scan + default theme
├── postcss.config.js            # PostCSS → Tailwind + Autoprefixer
├── workflow.md                  # ← This file. Codebase roadmap.
├── scripts/
│   └── buildApp.cjs             # Custom build helper script
└── src/
    ├── main.tsx                 # React entry — renders <App /> into #root
    ├── index.css                # @tailwind base/components/utilities directives
    ├── App.tsx                  # ⚡ Monolithic root component (~3 200 lines)
    ├── types/
    │   └── index.ts             # All TypeScript interfaces & type aliases
    ├── data/
    │   └── initialData.ts       # Seed data, constants, TEAM_MEMBERS mapping
    └── utils/
        ├── timeUtils.ts         # Time parsing / formatting helpers
        └── videoUtils.ts        # Video platform detector (YouTube, GDrive, HTML5)
```

---

## Architecture at a Glance

```
index.html
  └── src/main.tsx              ReactDOM.createRoot → <App />
        └── src/App.tsx
              ├── State layer   useState + useMemo (no external store)
              ├── Firebase layer  optional Firestore real-time sync
              ├── Navigation    activeTab: my-desk | overview | list | board | calendar
              ├── Views
              │     ├── My Desk        role-scoped dashboard
              │     ├── Team Overview  executive KPI cockpit
              │     ├── Grid View      inline-editable data table
              │     ├── Board          Kanban drag-and-drop
              │     └── Calendar       production · socmed · ads modes
              └── Detail Panel  right-side drawer per selected project
```

---

## Core Data Types (`src/types/index.ts`)

| Interface | Purpose |
|-----------|---------|
| `Project` | Central entity — every video content deliverable |
| `ChecklistItem` | Subtask within a project |
| `Comment` | Timecode-anchored review comment |
| `StageEntry` | Pipeline stage (id, name, colorKey) |
| `TypeEntry` | Content format (name, colorKey) |
| `CampaignEntry` | Campaign grouping (name, colorKey) |
| `StylingPreset` | Tailwind class bundle keyed by color name |
| `VideoEmbedInfo` | Platform-specific embed URL info |
| `CalendarDay` / `WeekDay` | Calendar grid cell descriptors |

### Project Shape (key fields)

```ts
interface Project {
  id: string;
  title: string;
  type: string;         // content format
  campaign: string;
  priority: string;     // 'High' | 'Medium' | 'Low'
  assignee: string;     // TEAM_ROLES value (e.g. 'Video Editor')
  by: string;           // requester
  overall: string;      // pipeline stage (e.g. 'Editing')
  dayAdded: string;     // YYYY-MM-DD
  script: string;       // Google Docs URL
  raw: string;          // Dropbox / storage URL
  edit: string;         // Frame.io / YouTube URL
  adLink?: string;      // Facebook Ads Manager URL
  notes: string;
  checklist: ChecklistItem[];
  comments: Comment[];
  isArchived: boolean;
  // Schedule
  shootTime: string;     shootDuration: number;
  postTime: string;      socMedPlatform: string;
  adPlatforms: string[]; adStartDate?: string; adEndDate?: string;
}
```

---

## Configuration Constants (`src/data/initialData.ts`)

### STYLING_PRESETS — 8 color themes
`zinc` · `red` · `orange` · `amber` · `emerald` · `blue` · `indigo` · `fuchsia`  
Each maps to a Tailwind class bundle used on badges, borders, and backgrounds.

### TEAM_ROLES — 6 positions
```
Marketing Head · Campaign Writer · Operations Manager
Director · Video Editor · Social Media Manager
```

### TEAM_MEMBERS — name mapping (extend here to add more)
```ts
{
  'Marketing Head': 'Pia',
  'Video Editor':   'Ralph',
}
```
Dropdowns show `"Pia · Marketing Head"` when a name is mapped.

### INITIAL_STAGES — 8 pipeline stages
`Ideation → Scripting → Pre-Prod → Shooting → Editing → Review → Ready for Upload → Published`

### INITIAL_TYPES — 5 content formats
`JobZ YT` · `TMT Shorts` · `JobZ Shorts` · `Facebook Ads` · `Instagram`

### INITIAL_CAMPAIGNS — 4 campaigns
`TMT Activate` · `Launchpad` · `3-day challenge` · `Evergreen`

### INITIAL_PROJECTS — 8 seed projects
Pre-populated deliverables spanning all types and stages for development/demo.

---

## State Management (`src/App.tsx`)

All state lives in `App` via React hooks — no Redux, Zustand, or Context.

### Primary State (`useState`)

| State | Type | Purpose |
|-------|------|---------|
| `projects` | `Project[]` | Master project list |
| `stages / types / campaigns` | arrays | Schema configuration |
| `activeTab` | string | Current view |
| `currentRole` | string | Active team role (role switcher) |
| `selectedProject` | `Project \| null` | Opens detail panel |
| `searchQuery` | string | Global search filter |
| `typeFilter / campaignFilter / priorityFilter` | string | Filter dropdowns |
| `sortBy` | string | Sort key (dayAdded, priority, type…) |
| `showArchived` | boolean | Toggle archived projects |
| `calendarMode` | string | `production \| socmed \| ads` |
| `calendarDate` | `Date` | Currently viewed date |
| `isPlaying / videoTime` | playback | Video preview controls |
| `newTitle / newType / newAssignee…` | string | New entry form fields |

### Derived State (`useMemo`)

| Memo | Depends on | Output |
|------|-----------|--------|
| `typeColorMap` | `types` | `{typeName: StylingPreset}` |
| `stageColorMap` | `stages` | `{stageName: StylingPreset}` |
| `filteredProjects` | projects, filters, sort | Filtered & sorted list for Grid/Board |
| `myDeskData` | `currentRole`, `projects` | Role-scoped tasks + action metadata |
| `totals` | `projects` | Aggregated KPI counts |
| `formatMetrics` | `projects`, `types` | Per-format done/running/prep counts |
| `weeklyVelocity` | `projects` | Weekly completion % |
| `calendarDays` | `calendarDate` | 35–42 day grid cells |
| `calendarWeekDays` | `calendarDate` | 7-day week cells |
| `adsTimelineDays` | `calendarDate` | Full month day columns for Gantt |

---

## Navigation & Views

### My Desk (`activeTab === 'my-desk'`)
Personalized dashboard filtered by `currentRole`.

**Marketing Head** sees:
- Weekly velocity KPI
- 4 summary cards: Done, Running, Prep, Bottleneck Stage
- Format Operational Density grid (one card per content type)

**All other roles** see:
- Projects in their focus stages **plus** any project directly assigned to their role
- Role-specific action button (e.g. "Jump to Frame.io" for Video Editor)
- Priority-sorted task cards

**Focus stages per role:**

| Role | Focus Stages |
|------|-------------|
| Campaign Writer | Ideation, Scripting |
| Director | Pre-Prod, Shooting |
| Video Editor | Editing |
| Social Media Manager | Review, Ready for Upload, Published |
| Marketing Head / Ops Manager | All stages |

> Projects where `assignee === currentRole` also appear on that role's desk regardless of stage.

---

### Team Overview (`activeTab === 'overview'`)
- Operational density bar chart (tasks per content type)
- Phase distribution bars (tasks per stage)
- Critical reviews list (High priority in Review stage)
- Quick action panel

---

### Grid View (`activeTab === 'list'`)
- Projects grouped and collapsible by type
- Horizontal-scrolling inline-edit table (13 columns)
- All fields editable directly in the row: dates, dropdowns, text inputs, links
- Assignee field is a **role dropdown** (shows `"Name · Role"` format)
- Filters: search, type, campaign, priority, archive toggle, sort

---

### Board (`activeTab === 'board'`)
- Kanban columns = pipeline stages
- Drag card between columns → updates `project.overall`
- Click card → opens right-side detail panel

---

### Calendar (`activeTab === 'calendar'`)

| Mode | Layout | Primary data field |
|------|--------|--------------------|
| Production | Weekly hourly grid (8 AM–8 PM) | `shootTime` + `shootDuration` |
| SocMed | Monthly calendar grid | `postTime` + `socMedPlatform` |
| Ads | Horizontal Gantt (month) | `adStartDate` / `adEndDate` |

All modes support drag-to-reschedule. Platform filter buttons narrow the visible cards.

---

## Detail Panel (Right Drawer)

Opens when `selectedProject !== null`. Shows:
- Type/Priority dropdowns
- Campaign + Day Added
- **Assignee dropdown** (TEAM_ROLES, displays `"Name · Role"`)
- By (requester)
- Script / Raw / Edit / Ad link inputs with "Open ↗" buttons
- Notes textarea
- Checklist (add/complete/delete items)
- Comments (add at timecode, resolve)
- Video preview (YouTube embed / GDrive / HTML5 via `getVideoEmbedInfo`)
- Archive / Delete actions

---

## Utilities

### `src/utils/timeUtils.ts`

```ts
parseTimeToDecimal("02:30 PM")  → 14.5     // 12hr/24hr → decimal hours
formatDecimalToTime(14.5)        → "02:30 PM"
formatTimecode(935)              → "15:35"  // seconds → MM:SS
```

Used in: hourly calendar cell matching, shoot time labels, comment timecodes.

### `src/utils/videoUtils.ts`

```ts
getVideoEmbedInfo(url) → VideoEmbedInfo | null
// Detects: YouTube (watch?v=, youtu.be, /embed/)
//          Google Drive (file/d/ID, open?id=ID)
//          HTML5 (.mp4, .webm, .ogg)
// Returns embed-ready URL or null if unrecognized
```

Used in: detail panel video preview.

---

## Firebase Integration

Firebase is **fully optional**. The app runs standalone if unconfigured.

| Scenario | Behaviour |
|----------|-----------|
| No `__firebase_config` | Mock user, local React state only |
| Firebase configured | Anonymous or custom-token auth |
| Firestore available | Real-time `onSnapshot` sync across tabs/users |
| Firestore write fails | Silently falls back to local state |

**Firestore path**: `/artifacts/{appId}/public/data/projects/{projectId}`

**Persistence function**:
```ts
persistProjects(updatedList)  // setProjects() + optional Firestore setDoc()
```

---

## Key Mutation Patterns

### Add Project
```ts
handleAddProject()
// Builds new Project object from newTitle/newType/... form state
// Calls persistProjects([...projects, newProject])
// Resets all form fields
```

### Edit Field
```ts
handleUpdateField(projectId, field, value)
// Maps project id → updates that field
// Calls persistProjects(updatedList)
```

### Archive / Delete
```ts
handleArchiveProject(id)    // sets isArchived: true
handleDeleteProject(id)     // removes from array entirely
```

### Drag (Board)
```ts
onDrop(e, targetStageId)
// Reads projectId from dataTransfer
// Calls handleUpdateField(id, 'overall', targetStageId)
```

---

## Build Commands

```bash
# Development (Vite HMR on http://localhost:5173)
npm run dev

# Production build (outputs to dist/)
npm run build

# Preview production build locally
npm run preview

# Windows (restricted PowerShell — bypass with cmd)
cmd /c "npm run dev"
```

---

## Development Roadmap

### Phase 1 — Foundation ✅ Done
- [x] Project CRUD (create, read, update, delete, archive)
- [x] Kanban board with drag-and-drop stage transitions
- [x] Inline-edit Grid View (13-column data table)
- [x] Multi-mode Calendar (Production · SocMed · Ads)
- [x] Role-based My Desk view
- [x] Firebase optional sync
- [x] Video embed preview (YouTube, GDrive, HTML5)
- [x] Timecode-anchored comments
- [x] Checklist per project
- [x] TEAM_MEMBERS name mapping for assignees
- [x] Assignee dropdown (TEAM_ROLES) across all entry points

### Phase 2 — Enhancements (Planned)
- [ ] Add remaining TEAM_MEMBERS names for all 6 roles
- [ ] Per-role notification/badge counts in the tab bar
- [ ] Persistent filters (URL params or localStorage)
- [ ] Export to CSV / PDF
- [ ] Dark/light theme toggle
- [ ] Multi-assignee support per project
- [ ] Real drag-and-drop library (react-beautiful-dnd / dnd-kit)
- [ ] Component extraction (App.tsx → smaller components)
- [ ] Unit tests (Vitest + React Testing Library)
- [ ] CI/CD pipeline (GitHub Actions → Firebase Hosting)

### Phase 3 — Scale
- [ ] Auth with named user accounts (replace anonymous)
- [ ] Role-based access control (not just view filtering)
- [ ] Activity log / audit trail
- [ ] Notifications / email alerts on stage change
- [ ] Integration with Google Drive API for script auto-import
- [ ] Analytics dashboard (velocity trends over time)

---

## Quick Reference: Where to Add Things

| Task | File | What to change |
|------|------|---------------|
| Add a new pipeline stage | `src/data/initialData.ts` | `INITIAL_STAGES` array |
| Add a content type | `src/data/initialData.ts` | `INITIAL_TYPES` array |
| Add a campaign | `src/data/initialData.ts` | `INITIAL_CAMPAIGNS` array |
| Add a team member name | `src/data/initialData.ts` | `TEAM_MEMBERS` object |
| Add a team role | `src/data/initialData.ts` | `TEAM_ROLES` array |
| Change role's focus stages | `src/App.tsx` | `myDeskData` useMemo switch-case |
| Add a new project field | `src/types/index.ts` → `src/data/initialData.ts` → `src/App.tsx` | Add to interface, seed data, and form |
| Change color theme of a type/stage | `src/data/initialData.ts` | Update `colorKey` value |
| Add a new color preset | `src/data/initialData.ts` | `STYLING_PRESETS` + `StylingPresetKey` type |
