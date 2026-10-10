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

// Vite injects the configured base as BASE_URL ("/" locally,
// "/builder-club-hub/" for the GitHub Pages build). TanStack Router wants it
// without the trailing slash.
const basepath = import.meta.env.BASE_URL.replace(/\/$/, "") || undefined;

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    basepath,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
