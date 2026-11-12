/** Project site: https://servicelogon.github.io/entra-auth-flow-visualizer/ */
export const pagesBasePath = "/entra-auth-flow-visualizer";

/**
 * `next build` sets NODE_ENV=production and emits the GitHub Pages export.
 * `next dev` leaves this empty so the lab stays at http://localhost:3847/.
 */
export const siteBasePath =
  process.env.NODE_ENV === "production" ? pagesBasePath : "";
