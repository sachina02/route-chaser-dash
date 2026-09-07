# Public Vehicle Tracker — Prototype

A **frontend-only prototype** of a public transport vehicle tracker. It shows buses, trams and
airport shuttles moving across an illustrative city network, with route timetables, stop-by-stop
estimates, occupancy and service alerts.

> ⚠️ Everything in this app is **demo data**. There is no backend, no database, no authentication,
> no API keys and no environment variables. Positions, times and occupancy figures are fabricated
> and never change on their own.

## Features

- **Home** (`/`) — hero overview, network stats and sample service alerts.
- **Live tracking** (`/tracking`) — search by vehicle, route or destination; filter by route and by
  status (on time / delayed / out of service); a simulated **Refresh** action; hover a vehicle in the
  list to highlight it on the map.
- **Vehicle details** (`/vehicles/:vehicleId`) — status, speed, occupancy bar, operator info and a
  scheduled-vs-estimated stop timeline with the next stop highlighted.
- **Routes** (`/routes`) — pick any route to see its stop sequence, frequency, service hours and the
  vehicles currently assigned to it.
- **Mock map** — a pure CSS + inline SVG map (grid background, coloured route polylines, clickable
  vehicle markers). No map tiles, no geolocation, no network requests.
- **Responsive** — mobile-first layouts with a hamburger menu that collapses the navigation.
- **Prototype labelling** — every page carries a visible "demo data" notice.

## Tech stack

- React 19 + TypeScript
- Vite 8 with TanStack Start / TanStack Router (file-based routing)
- Tailwind CSS v4 (design tokens in `src/styles.css`)
- lucide-react icons

## Project structure

```
src/
  data/vehicles.ts             all mock data (vehicles, routes, stops, alerts, stats)
  components/MockMap.tsx       CSS/SVG map
  components/SiteHeader.tsx    responsive nav with mobile menu
  routes/index.tsx             Home
  routes/tracking.tsx          Live tracking (search + filters + refresh)
  routes/routes.tsx            Routes & timetables
  routes/vehicles.$vehicleId.tsx  Vehicle details
  styles.css                   Tailwind theme tokens
```

All mock data lives in a single reusable module (`src/data/vehicles.ts`) and is imported by every
page, so you can extend the prototype by editing one file.

## Local development

```sh
npm install
npm run dev      # http://localhost:8080
npm run build    # production build (prerenders every route to static HTML)
npm run preview  # preview the build
npm run lint
```

## GitHub Pages deployment

Client-side navigation uses TanStack Router `<Link>` components, and all assets are bundled by Vite,
so the built output is safe to serve from static hosting.

Two workflows are included:

- `.github/workflows/build.yml` — runs lint + `npm run build` on every push and pull request.
- `.github/workflows/deploy.yml` — builds on pushes to `main`, copies the prerendered output into
  `_site`, duplicates `index.html` as `404.html` (so deep links resolve on Pages), adds `.nojekyll`,
  and publishes with `actions/deploy-pages`.

To enable it: in the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
If you deploy to a project page served from a sub-path (`https://user.github.io/repo/`), set the
Vite `base` option to `/repo/` before building.

## Not included (by design)

No backend, server code, authentication, environment variables, real-time feeds or third-party map
providers. This is a static UI prototype only.
