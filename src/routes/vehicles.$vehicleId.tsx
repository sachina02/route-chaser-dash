import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Gauge, Users } from "lucide-react";
import { MockMap } from "@/components/MockMap";
import { SiteHeader } from "@/components/SiteHeader";
import { StatusPill } from "@/routes/tracking";
import { DEMO_NOTICE, getRouteById, getVehicleById } from "@/data/vehicles";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/vehicles/$vehicleId")({
  head: () => ({
    meta: [
      { title: "Vehicle Details — Public Vehicle Tracker" },
      {
        name: "description",
        content:
          "Stop-by-stop demo arrival times, occupancy and status for a single vehicle in the prototype network.",
      },
      { property: "og:title", content: "Vehicle Details — Public Vehicle Tracker" },
      {
        property: "og:description",
        content: "Sample stop times, occupancy and speed for one demo vehicle.",
      },
    ],
  }),
  component: VehicleDetails,
});

function VehicleDetails() {
  const { vehicleId } = Route.useParams();
  const vehicle = getVehicleById(vehicleId);
  const route = vehicle ? getRouteById(vehicle.routeId) : undefined;

  if (!vehicle || !route) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Vehicle not in the demo set</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            “{vehicleId}” isn’t part of this prototype’s sample data.
          </p>
          <Link to="/tracking" className="mt-6 inline-block font-semibold text-primary hover:underline">
            Back to live tracking
          </Link>
        </main>
      </div>
    );
  }

  const occupancyPercent = Math.round((vehicle.onboard / vehicle.capacity) * 100);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 pb-16">
        <p className="mt-4 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-4 py-2 text-xs font-medium text-muted-foreground">
          {DEMO_NOTICE}
        </p>

        <Link
          to="/tracking"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Live tracking
        </Link>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <span
              className="inline-block rounded px-2 py-0.5 text-xs font-bold text-background"
              style={{ backgroundColor: route.color }}
            >
              {route.name}
            </span>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">{vehicle.label}</h1>
            <p className="text-sm text-muted-foreground">
              towards {vehicle.headsign} · updated {vehicle.lastUpdated}
            </p>
          </div>
          <StatusPill status={vehicle.status} delay={vehicle.delayMinutes} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-card p-4">
                <span className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                  <Gauge className="h-4 w-4" /> Speed
                </span>
                <p className="mt-2 text-2xl font-bold">{vehicle.speedKph} km/h</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <span className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                  <Users className="h-4 w-4" /> Onboard
                </span>
                <p className="mt-2 text-2xl font-bold">
                  {vehicle.onboard}/{vehicle.capacity}
                </p>
                <div className="mt-2 h-2 w-full rounded-full bg-secondary">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${occupancyPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-card p-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Operator</dt>
                <dd className="font-medium">{vehicle.operator}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Fleet number</dt>
                <dd className="font-medium">{vehicle.plate}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Vehicle type</dt>
                <dd className="font-medium capitalize">{vehicle.type}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Occupancy</dt>
                <dd className="font-medium capitalize">{vehicle.occupancy}</dd>
              </div>
            </dl>

            <MockMap
              vehicles={[vehicle]}
              highlightRouteId={vehicle.routeId}
              selectedVehicleId={vehicle.id}
              interactive={false}
            />
          </div>

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-lg font-semibold">Stop times</h2>
            <p className="text-xs text-muted-foreground">Scheduled vs estimated (demo values).</p>
            <ol className="mt-4 space-y-3">
              {vehicle.stops.map((stop) => {
                const isNext = stop.stopId === vehicle.nextStopId;
                return (
                  <li
                    key={stop.stopId}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm",
                      stop.passed && "opacity-50",
                      isNext && "bg-primary/10 ring-1 ring-primary/40",
                    )}
                  >
                    <span className="font-medium">
                      {stop.name}
                      {isNext && (
                        <span className="ml-2 text-xs font-semibold uppercase text-primary">next</span>
                      )}
                    </span>
                    <span className="shrink-0 tabular-nums text-muted-foreground">
                      {stop.scheduled !== stop.estimated && (
                        <span className="mr-2 line-through">{stop.scheduled}</span>
                      )}
                      <span className="font-semibold text-foreground">{stop.estimated}</span>
                    </span>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>
      </main>
    </div>
  );
}
