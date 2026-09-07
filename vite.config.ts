// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Every page of this prototype renders from static demo data, so all routes can be
// prerendered to plain HTML at build time (handy for GitHub Pages hosting).
const vehicleIds = [
  "V-1042",
  "V-1077",
  "V-4003",
  "V-4011",
  "V-7008",
  "V-7015",
  "V-2101",
  "V-2114",
];

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    pages: [
      { path: "/" },
      { path: "/tracking" },
      { path: "/routes" },
      ...vehicleIds.map((id) => ({ path: `/vehicles/${id}` })),
    ],
    prerender: { enabled: true, autoStaticPathsDiscovery: false },
  },
});
