import { Link } from "@tanstack/react-router";
import { routes, type Vehicle } from "@/data/vehicles";
import { cn } from "@/lib/utils";

interface MockMapProps {
  vehicles: Vehicle[];
  highlightRouteId?: string;
  selectedVehicleId?: string;
  className?: string;
  interactive?: boolean;
}

/**
 * A purely decorative CSS + SVG "map". No tiles, no geolocation, no network.
 */
export function MockMap({
  vehicles,
  highlightRouteId,
  selectedVehicleId,
  className,
  interactive = true,
}: MockMapProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-border bg-secondary",
        className,
      )}
      role="img"
      aria-label="Illustrative demo map of vehicle positions"
    >
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute inset-x-0 top-1/3 h-16 -rotate-6 bg-sky-500/10" aria-hidden />
      <div className="absolute left-1/2 top-0 h-full w-24 rotate-12 bg-lime-500/5" aria-hidden />

      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {routes.map((route) => {
          const dimmed = highlightRouteId && highlightRouteId !== route.id;
          return (
            <polyline
              key={route.id}
              points={route.path.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke={route.color}
              strokeWidth={dimmed ? 0.6 : 1.2}
              strokeLinecap="round"
              strokeOpacity={dimmed ? 0.25 : 0.9}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>

      <div className="relative aspect-[16/10] w-full">
        {vehicles.map((vehicle) => {
          const route = routes.find((r) => r.id === vehicle.routeId);
          const isSelected = selectedVehicleId === vehicle.id;
          const dot = (
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full border-2 border-background text-[10px] font-bold text-background shadow-lg transition-transform",
                isSelected && "scale-125 ring-2 ring-primary ring-offset-2 ring-offset-secondary",
                vehicle.status === "out-of-service" && "opacity-50",
              )}
              style={{ backgroundColor: route?.color ?? "#94a3b8" }}
            >
              {vehicle.routeId.replace("R", "")}
            </span>
          );

          return (
            <div
              key={vehicle.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${vehicle.position.x}%`, top: `${vehicle.position.y}%` }}
            >
              {interactive ? (
                <Link
                  to="/vehicles/$vehicleId"
                  params={{ vehicleId: vehicle.id }}
                  aria-label={`${vehicle.label} on route ${vehicle.routeId}`}
                  title={`${vehicle.label} — ${vehicle.headsign}`}
                >
                  {dot}
                </Link>
              ) : (
                dot
              )}
            </div>
          );
        })}
      </div>

      <p className="absolute bottom-2 right-3 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
        Illustrative map · demo data
      </p>
    </div>
  );
}
