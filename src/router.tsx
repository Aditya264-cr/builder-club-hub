import { QueryClient, timeoutManager } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

// During static prerendering, unref TanStack Query's GC timers so the build
// process can exit once every page is written.
const isPrerendering =
  typeof process !== "undefined" && process.env.TSS_PRERENDERING === "true";
if (isPrerendering) {
  timeoutManager.setTimeoutProvider({
    setTimeout: (cb, ms) => {
      const id = setTimeout(cb, ms);
      (id as unknown as { unref?: () => void }).unref?.();
      return id;
    },
    clearTimeout: (id) => clearTimeout(id),
    setInterval: (cb, ms) => {
      const id = setInterval(cb, ms);
      (id as unknown as { unref?: () => void }).unref?.();
      return id;
    },
    clearInterval: (id) => clearInterval(id),
  });
}

// The base path ("/" locally, "/builder-club-hub" for the GitHub Pages build)
// is declared in vite.config.ts via tanstackStart.router.basepath so the build
// can publish a correct route manifest.
export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    // The static prerender crawler requests "/page/" and follows redirects by
    // re-adding the slash, so the default strip-slash redirect loops forever.
    trailingSlash: "preserve",
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
