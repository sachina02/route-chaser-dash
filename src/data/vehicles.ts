/**
 * Mock demo data for the Public Vehicle Tracker prototype.
 * Everything here is fabricated sample data — no backend, no live feeds.
 */

export type VehicleStatus = "on-time" | "delayed" | "out-of-service";

export type VehicleType = "bus" | "tram" | "shuttle";

export interface StopTime {
  stopId: string;
  name: string;
  scheduled: string;
  estimated: string;
  passed: boolean;
}

export interface Vehicle {
  id: string;
  label: string;
  type: VehicleType;
  routeId: string;
  status: VehicleStatus;
  delayMinutes: number;
  speedKph: number;
  occupancy: "low" | "medium" | "high";
  capacity: number;
  onboard: number;
  operator: string;
  plate: string;
  lastUpdated: string;
  headsign: string;
  /** Position on the mock map, expressed as percentages (0-100). */
  position: { x: number; y: number };
  nextStopId: string;
  stops: StopTime[];
}

export interface TransitRoute {
  id: string;
  name: string;
  color: string;
  type: VehicleType;
  frequencyMinutes: number;
  firstDeparture: string;
  lastDeparture: string;
  stops: string[];
  /** Polyline points on the mock map, in percentages (0-100). */
  path: Array<{ x: number; y: number }>;
}

export const DEMO_NOTICE =
  "Prototype — all vehicle positions, times and occupancy figures are demo data.";

export const routes: TransitRoute[] = [
  {
    id: "R12",
    name: "12 · Harbour ↔ University",
    color: "#f59e0b",
    type: "bus",
    frequencyMinutes: 8,
    firstDeparture: "05:20",
    lastDeparture: "23:50",
    stops: [
      "Harbour Gate",
      "Old Mill",
      "Civic Square",
      "Museum Quarter",
      "Rail Bridge",
      "University North",
    ],
    path: [
      { x: 8, y: 78 },
      { x: 24, y: 64 },
      { x: 41, y: 58 },
      { x: 58, y: 44 },
      { x: 74, y: 34 },
      { x: 90, y: 22 },
    ],
  },
  {
    id: "R4",
    name: "4 · Airport Express",
    color: "#38bdf8",
    type: "shuttle",
    frequencyMinutes: 15,
    firstDeparture: "04:00",
    lastDeparture: "01:10",
    stops: ["Central Terminal", "Fair Grounds", "Ring Road", "Airport T1", "Airport T2"],
    path: [
      { x: 12, y: 24 },
      { x: 32, y: 30 },
      { x: 52, y: 22 },
      { x: 70, y: 14 },
      { x: 88, y: 10 },
    ],
  },
  {
    id: "R7",
    name: "7 · Riverside Tram",
    color: "#a3e635",
    type: "tram",
    frequencyMinutes: 6,
    firstDeparture: "05:00",
    lastDeparture: "00:30",
    stops: [
      "Riverside Depot",
      "Foundry Lane",
      "Market Hall",
      "Civic Square",
      "Hospital",
      "Green Hills",
    ],
    path: [
      { x: 6, y: 44 },
      { x: 22, y: 46 },
      { x: 38, y: 40 },
      { x: 52, y: 52 },
      { x: 68, y: 62 },
      { x: 86, y: 70 },
    ],
  },
  {
    id: "R21",
    name: "21 · Night Loop",
    color: "#c084fc",
    type: "bus",
    frequencyMinutes: 20,
    firstDeparture: "22:00",
    lastDeparture: "04:40",
    stops: ["Civic Square", "Stadium", "Old Mill", "Market Hall", "Civic Square"],
    path: [
      { x: 44, y: 56 },
      { x: 60, y: 72 },
      { x: 44, y: 86 },
      { x: 26, y: 74 },
      { x: 44, y: 56 },
    ],
  },
];

function makeStops(
  names: string[],
  startHour: number,
  startMinute: number,
  gap: number,
  delay: number,
  passedCount: number,
): StopTime[] {
  return names.map((name, index) => {
    const total = startMinute + index * gap;
    const hour = (startHour + Math.floor(total / 60)) % 24;
    const minute = total % 60;
    const pad = (n: number) => String(n).padStart(2, "0");
    const scheduled = `${pad(hour)}:${pad(minute)}`;
    const estTotal = total + delay;
    const estHour = (startHour + Math.floor(estTotal / 60)) % 24;
    const estimated = `${pad(estHour)}:${pad(((estTotal % 60) + 60) % 60)}`;
    return {
      stopId: `${name.toLowerCase().replace(/[^a-z]+/g, "-")}-${index}`,
      name,
      scheduled,
      estimated,
      passed: index < passedCount,
    };
  });
}

function routeStops(id: string): string[] {
  return routes.find((r) => r.id === id)?.stops ?? [];
}

export const vehicles: Vehicle[] = [
  {
    id: "V-1042",
    label: "Bus 1042",
    type: "bus",
    routeId: "R12",
    status: "on-time",
    delayMinutes: 0,
    speedKph: 34,
    occupancy: "medium",
    capacity: 72,
    onboard: 38,
    operator: "Metro City Transit",
    plate: "MC-1042",
    lastUpdated: "12 seconds ago",
    headsign: "University North",
    position: { x: 46, y: 52 },
    nextStopId: "museum-quarter-3",
    stops: makeStops(routeStops("R12"), 9, 5, 7, 0, 3),
  },
  {
    id: "V-1077",
    label: "Bus 1077",
    type: "bus",
    routeId: "R12",
    status: "delayed",
    delayMinutes: 6,
    speedKph: 12,
    occupancy: "high",
    capacity: 72,
    onboard: 66,
    operator: "Metro City Transit",
    plate: "MC-1077",
    lastUpdated: "41 seconds ago",
    headsign: "Harbour Gate",
    position: { x: 22, y: 66 },
    nextStopId: "civic-square-2",
    stops: makeStops(routeStops("R12"), 9, 22, 7, 6, 2),
  },
  {
    id: "V-4003",
    label: "Shuttle 4003",
    type: "shuttle",
    routeId: "R4",
    status: "on-time",
    delayMinutes: -1,
    speedKph: 58,
    occupancy: "low",
    capacity: 40,
    onboard: 11,
    operator: "AirLink Coaches",
    plate: "AL-4003",
    lastUpdated: "6 seconds ago",
    headsign: "Airport T2",
    position: { x: 61, y: 18 },
    nextStopId: "airport-t1-3",
    stops: makeStops(routeStops("R4"), 9, 0, 11, -1, 3),
  },
  {
    id: "V-4011",
    label: "Shuttle 4011",
    type: "shuttle",
    routeId: "R4",
    status: "out-of-service",
    delayMinutes: 0,
    speedKph: 0,
    occupancy: "low",
    capacity: 40,
    onboard: 0,
    operator: "AirLink Coaches",
    plate: "AL-4011",
    lastUpdated: "8 minutes ago",
    headsign: "Depot",
    position: { x: 14, y: 26 },
    nextStopId: "central-terminal-0",
    stops: makeStops(routeStops("R4"), 10, 15, 11, 0, 0),
  },
  {
    id: "V-7008",
    label: "Tram 7008",
    type: "tram",
    routeId: "R7",
    status: "on-time",
    delayMinutes: 1,
    speedKph: 27,
    occupancy: "high",
    capacity: 180,
    onboard: 154,
    operator: "Riverside Rail",
    plate: "RR-7008",
    lastUpdated: "18 seconds ago",
    headsign: "Green Hills",
    position: { x: 55, y: 54 },
    nextStopId: "hospital-4",
    stops: makeStops(routeStops("R7"), 9, 12, 5, 1, 4),
  },
  {
    id: "V-7015",
    label: "Tram 7015",
    type: "tram",
    routeId: "R7",
    status: "delayed",
    delayMinutes: 11,
    speedKph: 8,
    occupancy: "medium",
    capacity: 180,
    onboard: 92,
    operator: "Riverside Rail",
    plate: "RR-7015",
    lastUpdated: "1 minute ago",
    headsign: "Riverside Depot",
    position: { x: 33, y: 42 },
    nextStopId: "foundry-lane-1",
    stops: makeStops(routeStops("R7"), 9, 30, 5, 11, 1),
  },
  {
    id: "V-2101",
    label: "Bus 2101",
    type: "bus",
    routeId: "R21",
    status: "on-time",
    delayMinutes: 2,
    speedKph: 41,
    occupancy: "low",
    capacity: 64,
    onboard: 9,
    operator: "Metro City Transit",
    plate: "MC-2101",
    lastUpdated: "25 seconds ago",
    headsign: "Night Loop",
    position: { x: 57, y: 74 },
    nextStopId: "old-mill-2",
    stops: makeStops(routeStops("R21"), 22, 40, 9, 2, 1),
  },
  {
    id: "V-2114",
    label: "Bus 2114",
    type: "bus",
    routeId: "R21",
    status: "on-time",
    delayMinutes: 0,
    speedKph: 36,
    occupancy: "low",
    capacity: 64,
    onboard: 6,
    operator: "Metro City Transit",
    plate: "MC-2114",
    lastUpdated: "50 seconds ago",
    headsign: "Night Loop",
    position: { x: 30, y: 78 },
    nextStopId: "market-hall-3",
    stops: makeStops(routeStops("R21"), 23, 5, 9, 0, 3),
  },
];

export const serviceAlerts = [
  {
    id: "A1",
    routeId: "R7",
    severity: "warning" as const,
    title: "Signal works near Foundry Lane",
    detail: "Trams on route 7 may run up to 12 minutes late until 18:00 (demo alert).",
  },
  {
    id: "A2",
    routeId: "R4",
    severity: "info" as const,
    title: "Extra airport shuttle added",
    detail: "A 15-minute frequency runs all day during the fair (demo alert).",
  },
  {
    id: "A3",
    routeId: "R12",
    severity: "warning" as const,
    title: "Diversion at Civic Square",
    detail: "Route 12 uses Museum Quarter stop instead of Civic Square (demo alert).",
  },
];

export const networkStats = {
  vehiclesTracked: vehicles.length,
  routesLive: routes.length,
  onTimePercent: 82,
  avgDelayMinutes: 2.4,
};

export function getVehicleById(id: string): Vehicle | undefined {
  return vehicles.find((v) => v.id.toLowerCase() === id.toLowerCase());
}

export function getRouteById(id: string): TransitRoute | undefined {
  return routes.find((r) => r.id === id);
}

export function statusLabel(status: VehicleStatus): string {
  if (status === "on-time") return "On time";
  if (status === "delayed") return "Delayed";
  return "Out of service";
}
