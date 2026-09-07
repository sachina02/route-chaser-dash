import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Gauge, MapPin, Route as RouteIcon, TriangleAlert } from "lucide-react";
import { MockMap } from "@/components/MockMap";
import { SiteHeader } from "@/components/SiteHeader";
import { DEMO_NOTICE, networkStats, routes, serviceAlerts, vehicles } from "@/data/vehicles";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Public Vehicle Tracker — Live Transit Prototype" },
      {
        name: "description",
        content:
          "A frontend-only prototype for tracking buses, trams and shuttles across a city network using demo data.",
      },
      { property: "og:title", content: "Public Vehicle Tracker — Live Transit Prototype" },
      {
        property: "og:description",
        content:
          "Browse demo vehicle positions, routes, stop times and service alerts in this static prototype.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 pb-16">
        <p className="mt-4 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-4 py-2 text-xs font-medium text-muted-foreground">
          {DEMO_NOTICE}
        </p>

        <section className="grid gap-8 py-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Prototype build
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              See every vehicle on the network at a glance.
            </h1>
            <p className="mt-4 max-w-prose text-muted-foreground">
              Follow buses, trams and airport shuttles, check estimated arrivals stop by stop, and
              scan service alerts. This build runs entirely in the browser on fixed demo data.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/tracking"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Open live tracking <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/routes"
                className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-semibold transition-colors hover:bg-accent"
              >
                Browse routes
              </Link>
            </div>
          </div>
          <MockMap vehicles={vehicles} />
        </section>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat icon={<MapPin className="h-4 w-4" />} label="Vehicles tracked" value={String(networkStats.vehiclesTracked)} />
          <Stat icon={<RouteIcon className="h-4 w-4" />} label="Routes live" value={String(networkStats.routesLive)} />
          <Stat icon={<Gauge className="h-4 w-4" />} label="On time" value={`${networkStats.onTimePercent}%`} />
          <Stat
            icon={<TriangleAlert className="h-4 w-4" />}
            label="Average delay"
            value={`${networkStats.avgDelayMinutes} min`}
          />
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight">Service alerts</h2>
          <p className="mt-1 text-sm text-muted-foreground">Sample notices, not real disruptions.</p>
          <ul className="mt-4 grid gap-4 md:grid-cols-3">
            {serviceAlerts.map((alert) => {
              const route = routes.find((r) => r.id === alert.routeId);
              return (
                <li key={alert.id} className="rounded-xl border border-border bg-card p-4">
                  <span
                    className="inline-block rounded px-2 py-0.5 text-xs font-bold text-background"
                    style={{ backgroundColor: route?.color }}
                  >
                    {alert.routeId}
                  </span>
                  <h3 className="mt-2 font-semibold">{alert.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{alert.detail}</p>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {icon}
        {label}
      </span>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
