# hmpps-official-visits-ui (dummy)

A **lightweight, standalone dummy** of the
[`hmpps-official-visits-ui`](https://github.com/ministryofjustice/hmpps-official-visits-ui)
service, created for local tinkering.

It mirrors the real service's look (GOV.UK + MoJ Design System) and the shape of
its main journeys — **home → view visits, book a visit, admin locations** — but
strips out everything that needs external infrastructure:

| Real service | This dummy |
| --- | --- |
| HMPPS Auth (passport-oauth2) | A fixed fake signed-in user with all permissions |
| Redis session store | In-memory `express-session` |
| Official Visits / Prisoner Search / Prison / Locations APIs | In-memory dummy data in `server/services/*` |
| esbuild + SCSS bundling, asset manifest | Pre-compiled GOV.UK/MoJ CSS served from `node_modules`, plus `public/assets/css/application.css` |
| App Insights, audit SQS, DPS components | Removed |

So it runs with **zero configuration**.

## Screenshots

Want to see it without running it? Every page is captured in
[`docs/screenshots/`](docs/screenshots/) — the home dashboard, view/admin pages,
the full **book a visit** journey, and the **amend** journey.

[![Home dashboard](docs/screenshots/01-home.png)](docs/screenshots/)

## Running it

```bash
npm install
npm run start:dev
```

Then open http://localhost:3000.

- `npm run start:dev` — run with hot reload (via `tsx watch`)
- `npm start` — run once
- `npm run typecheck` — TypeScript type checking

## Where to make tweaks

```
server/
├── app.ts                      # middleware wiring (auth/session/static/routes)
├── config.ts                   # the few settings the dummy needs
├── routes/
│   ├── index.ts                # top-level routing + permission gating
│   └── journeys/
│       ├── home/               # the landing page with the cards
│       ├── view/               # list + view a single visit
│       ├── manage/             # full "book a visit" journey (see below)
│       └── admin/              # locations admin
├── services/                   # in-memory dummy data — edit these to change content
│   ├── officialVisitsService.ts
│   ├── locationsService.ts
│   └── prisonerService.ts
├── views/                      # Nunjucks templates (GOV.UK + MoJ macros)
└── middleware/                 # fake user, health checks, static resources
public/assets/css/application.css  # custom styles (homepage cards)
```

Want a new page? Add a route in the relevant `routes/journeys/*/index.ts`, drop a
template under `server/views/pages/`, and (if it needs data) extend the matching
service. To change the fake user's permissions, edit
`server/middleware/setUpFakeUser.ts`.

### The "book an official visit" journey

A simplified, single-session version of the real multi-step wizard. The steps
live in `server/routes/journeys/manage/`:

```
search → results → pick prisoner → visit type → time slot →
official visitors → social visitors → assistance → equipment →
extra information → check your answers → confirmation
```

It follows the same patterns as the production service:

- **Session-backed state** — the in-progress booking lives on
  `req.session.journey.officialVisit` (typed in `server/interfaces/journey.ts`).
- **A step guard** (`journeyState.ts` `requireStep`) that pushes you back a step
  if you try to skip ahead, mirroring the real `JourneyStateGuard`.
- **Per-step handlers** under `handlers/`, each exposing `GET`/`POST`.
- **A progress tracker** (`partials/progress-tracker.njk`) driven by how many
  milestones are complete.
- **Conditional steps**, like the real service:
  - *Social visitors* only appears when the `allowSocialVisitors` feature toggle
    is on (`config.ts`) and at least one official visitor is chosen.
  - *Equipment* only appears for in-person visits (a "Video link visit" skips
    it).

Confirming on the check-your-answers page "creates" the visit in
`officialVisitsService` — so it then shows up in **View or cancel existing
official visits**.

### The "amend an official visit" journey

Open any visit from the view list and choose **Amend this visit**
(`/manage/amend/:id`). This re-uses the very same step handlers in "amend mode"
(`res.locals.mode === 'amend'`):

- The landing page (`amendLanding.njk`) hydrates the journey from the stored
  visit and shows a summary with **Change** links to each step.
- Each step, in amend mode, saves the change straight back to the visit via
  `officialVisitsService.updateVisit` and returns you to the landing — rather
  than walking to the next create step.
- `requireAmendJourney` re-hydrates the journey if you deep-link to a step.

> This is **not** the production service and is not wired to any real prison
> data or APIs. It is intended only as a sandbox.
