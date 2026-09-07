import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { RefreshCw, Search } from "lucide-react";
import { MockMap } from "@/components/MockMap";
import { SiteHeader } from "@/components/SiteHeader";
import {
  DEMO_NOTICE,
  routes,
  statusLabel,
  vehicles as allVehicles,
  type VehicleStatus,
} from "@/data/vehicles";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tracking")({
  head: () => ({
    meta: [
      { title: "Live Tracking — Public Vehicle Tracker" },
      {
        name: "description",
        content:
          "Search and filter demo buses, trams and shuttles by route and status on an illustrative city map.",
      },
      { property: "og:title", content: "Live Tracking — Public Vehicle Tracker" },
      {
        property: "og:description",
        content: "Filter demo vehicles by route and status and open any vehicle for stop-by-stop times.",
      },
    ],
  }),
  component: Tracking,
});

const STATUSES: Array<VehicleStatus | "all"> = ["all", "on-time", "delayed", "out-of-service"];

function Tracking() {
  const [query, setQuery] = useState("");
  const [routeId, setRouteId] = useState("all");
  const [status, setStatus] = useState<VehicleStatus | "all">("all");
  const [refreshedAt, setRefreshedAt] = useState("just now");
  const [spinning, setSpinning] = useState(false);
  const [selected, setSelected] = useState<string | undefined>(undefined);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allVehicles.filter((v) => {
      if (routeId !== "all" && v.routeId !== routeId) return false;
      if (status !== "all" && v.status !== status) return false;
      if (!q) return true;
      return (
        v.label.toLowerCase().includes(q) ||
        v.id.toLowerCase().includes(q) ||
        v.headsign.toLowerCase().includes(q) ||
        v.routeId.toLowerCase().includes(q)
      );
    });
  }, [query, routeId, status]);

  function refresh() {
    setSpinning(true);
    setRefreshedAt("just now");
    window.setTimeout(() => setSpinning(false), 600);
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 pb-16">
        <p className="mt-4 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-4 py-2 text-xs font-medium text-muted-foreground">
          {DEMO_NOTICE}
        </p>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Live tracking</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Positions updated {refreshedAt} (simulated).
            </p>
          </div>
          <button
            type="button"
            onClick={refresh}
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-accent"
          >
            <RefreshCw className={cn("h-4 w-4", spinning && "animate-spin")} />
            Refresh
          </button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <span className="sr-only">Search vehicles</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by vehicle, route or destination"
              className="w-full rounded-md border border-border bg-card py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <select
            value={routeId}
            onChange={(e) => setRouteId(e.target.value)}
            aria-label="Filter by route"
            className="rounded-md border border-border bg-card px-3 py-2 text-sm"
          >
            <option value="all">All routes</option>
            {routes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as VehicleStatus | "all")}
            aria-label="Filter by status"
            className="rounded-md border border-border bg-card px-3 py-2 text-sm"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "Any status" : statusLabel(s)}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <MockMap
            vehicles={visible}
            selectedVehicleId={selected}
            highlightRouteId={routeId === "all" ? undefined : routeId}
          />

          <div>
            <p className="text-sm text-muted-foreground">
              {visible.length} of {allVehicles.length} vehicles shown
            </p>
            <ul className="mt-3 space-y-3">
              {visible.map((v) => {
                const route = routes.find((r) => r.id === v.routeId);
                const nextStop = v.stops.find((s) => s.stopId === v.nextStopId);
                return (
                  <li
                    key={v.id}
                    onMouseEnter={() => setSelected(v.id)}
                    onMouseLeave={() => setSelected(undefined)}
                    className="rounded-xl border border-border bg-card p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span
                          className="inline-block rounded px-2 py-0.5 text-xs font-bold text-background"
                          style={{ backgroundColor: route?.color }}
                        >
                          {v.routeId}
                        </span>
                        <h2 className="mt-2 font-semibold">{v.label}</h2>
                        <p className="text-sm text-muted-foreground">towards {v.headsign}</p>
                      </div>
                      <StatusPill status={v.status} delay={v.delayMinutes} />
                    </div>
                    <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <dt className="text-muted-foreground">Next stop</dt>
                        <dd className="font-medium">{nextStop?.name ?? "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">ETA</dt>
                        <dd className="font-medium">{nextStop?.estimated ?? "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Occupancy</dt>
                        <dd className="font-medium capitalize">{v.occupancy}</dd>
                      </div>
                    </dl>
                    <Link
                      to="/vehicles/$vehicleId"
                      params={{ vehicleId: v.id }}
                      className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
                    >
                      View details →
                    </Link>
                  </li>
                );
              })}
              {visible.length === 0 && (
                <li className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                  No demo vehicles match these filters.
                </li>
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export function StatusPill({ status, delay }: { status: VehicleStatus; delay: number }) {
  const tone =
    status === "on-time"
      ? "bg-lime-500/15 text-lime-700 dark:text-lime-300"
      : status === "delayed"
        ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
        : "bg-muted text-muted-foreground";
  return (
    <span className={cn("shrink-0 rounded-full px-3 py-1 text-xs font-semibold", tone)}>
      {statusLabel(status)}
      {status === "delayed" ? ` +${delay}m` : ""}
    </span>
  );
}
