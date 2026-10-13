# SPFM dashboard (preview)

Internal project financial management app for Shield Security Doors.
This is a **frontend preview**: it runs on its own with sample data so the
screens and the Alpha workflow can be reviewed before it is wired to the
ASP.NET Core API and Microsoft Entra.

Alpha workflow covered: sign in → create or open a project → enter data →
calculate → save → reopen → edit → recalculate → save.

## Run it

Requires Node.js 20 or later.

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # SPFM calculation tests
npm run build      # production build check
```

Use **Reset sample data** in the sidebar to restore the sample projects.

## What's real and what's a placeholder

| Area | In this preview | In the Alpha |
|---|---|---|
| Sign-in | Simulated (`src/lib/auth.tsx`) | MSAL + Microsoft Entra, token sent to the API |
| Storage | Browser localStorage (`src/lib/projectStore.ts`) | Project API + database on the ASP.NET Core backend |
| SPFM fields | Placeholder job-costing fields (`src/lib/types.ts`) | Samuel's confirmed SPFM field list |
| Calculations | Placeholder formulas (`src/lib/spfm.ts`) | Samuel's SPFM rules, checked against 2–3 real projects |
| Tests | `src/lib/spfm.test.ts`, TC-01 sample case | Named test cases from real Shield projects |

## Structure

```
src/
  app/
    login/                 sign-in screen
    (app)/page.tsx         overview: totals, margin by project, needs calculating
    (app)/projects/        project list with search and status filter
    (app)/projects/new     new project
    (app)/projects/[id]    main project screen
  components/
    ProjectEditor.tsx      inputs, validation, Calculate / Save, results ledger
    CostBar.tsx            breakdown of where the contract value goes
    AppShell.tsx           sidebar, session guard
  lib/
    spfm.ts                calculation engine + validation (no UI code)
    projectStore.ts        repository; swap localStorage for API calls here
    auth.tsx               session provider; swap for MSAL here
```

The calculation engine has no UI dependencies, so it can be moved behind the
API (or ported to C#) with the same test cases.
