// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// GitHub Pages serves the site at https://<user>.github.io/builder-club-hub/,
// so static builds need that base path. GH_PAGES=true is set only by the
// deploy workflow; the Lovable preview and local dev keep "/".
const ghPages = process.env.GH_PAGES === "true";

// Every route renders identical HTML for every visitor, so all of them are
// safe to prerender. Parameterized routes are enumerated with concrete paths.
const staticPages = [
  "/",
  "/about",
  "/opportunities",
  "/opportunities/learning-programme-preview",
  "/opportunities/build-challenge-preview",
  "/opportunities/learning-access-preview",
  "/opportunities/career-development-preview",
  "/opportunities/community-activity-preview",
  "/learning",
  "/community",
  "/insights",
  "/insights/learn-by-building",
  "/insights/learning-with-ai",
  "/insights/evaluate-learning-opportunities",
  "/contact",
  "/privacy",
  "/accessibility",
];

export default defineConfig({
  vite: {
    base: ghPages ? "/builder-club-hub/" : "/",
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    router: {
      basepath: ghPages ? "/builder-club-hub" : "/",
      // The prerender crawler requests "/page/" and follows redirects by
      // re-adding the slash, so the default strip-slash redirect loops forever.
      trailingSlash: "preserve",
    },
    // Prerender requests must include the router basepath, or the router
    // answers every request with a redirect to the prefixed URL.
    pages: staticPages.map((path) => ({
      path: ghPages ? `/builder-club-hub${path === "/" ? "" : path}` : path,
    })),
    prerender: { enabled: true, autoStaticPathsDiscovery: false },
  },
});
