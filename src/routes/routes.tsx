import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Repeat } from "lucide-react";
import { MockMap } from "@/components/MockMap";
import { SiteHeader } from "@/components/SiteHeader";
import { DEMO_NOTICE, routes, vehicles } from "@/data/vehicles";

export const Route = createFileRoute("/routes")({
  head: () => ({
    meta: [
      { title: "Routes & Timetables — Public Vehicle Tracker" },
      {
        name: "description",
        content:
          "Explore demo bus, tram and shuttle routes with stop lists, frequencies and first and last departures.",
      },
      { property: "og:title", content: "Routes & Timetables — Public Vehicle Tracker" },
      {
        property: "og:description",
        content: "Sample stop sequences, service frequencies and vehicles assigned to each demo route.",
      },
    ],
  }),
  component: RoutesPage,
});

function RoutesPage() {
  const [activeId, setActiveId] = useState(routes[0]?.id ?? "");
  const active = routes.find((r) => r.id === activeId) ?? routes[0];
  const routeVehicles = vehicles.filter((v) => v.routeId === active?.id);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 pb-16">
        <p className="mt-4 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-4 py-2 text-xs font-medium text-muted-foreground">
          {DEMO_NOTICE}
        </p>

        <h1 className="mt-6 text-3xl font-bold tracking-tight">Routes & timetables</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Four sample routes with fixed demo stop sequences.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {routes.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setActiveId(r.id)}
              aria-pressed={r.id === active?.id}
              className="rounded-full border px-4 py-2 text-sm font-semibold transition-colors"
              style={
                r.id === active?.id
                  ? { backgroundColor: r.color, borderColor: r.color, color: "#0b1220" }
                  : { borderColor: "var(--color-border)" }
              }
            >
              {r.name}
            </button>
          ))}
        </div>

        {active && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-xl font-semibold">{active.name}</h2>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <Repeat className="h-4 w-4" /> every {active.frequencyMinutes} min
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4" /> {active.firstDeparture}–{active.lastDeparture}
                </span>
                <span className="capitalize">{active.type}</span>
              </div>

              <ol className="mt-5 space-y-0">
                {active.stops.map((stop, i) => (
                  <li key={`${stop}-${i}`} className="flex items-start gap-3">
                    <span className="flex flex-col items-center">
                      <span
                        className="mt-1 h-3 w-3 rounded-full"
                        style={{ backgroundColor: active.color }}
                      />
                      {i < active.stops.length - 1 && (
                        <span className="h-8 w-0.5" style={{ backgroundColor: active.color }} />
                      )}
                    </span>
                    <span className="pb-2 text-sm font-medium">{stop}</span>
                  </li>
                ))}
              </ol>

              <h3 className="mt-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Vehicles on this route
              </h3>
              <ul className="mt-2 space-y-2">
                {routeVehicles.map((v) => (
                  <li key={v.id} className="flex items-center justify-between text-sm">
                    <span>
                      {v.label} · towards {v.headsign}
                    </span>
                    <Link
                      to="/vehicles/$vehicleId"
                      params={{ vehicleId: v.id }}
                      className="font-semibold text-primary hover:underline"
                    >
                      Details
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <MockMap vehicles={routeVehicles} highlightRouteId={active.id} />
          </div>
        )}
      </main>
    </div>
  );
}
