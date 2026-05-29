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
│       ├── manage/             # "book a visit" journey (prisoner search)
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

> This is **not** the production service and is not wired to any real prison
> data or APIs. It is intended only as a sandbox.
