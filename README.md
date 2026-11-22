# Entra Token Lab

**Live site:** [servicelogon.github.io/entra-auth-flow-visualizer](https://servicelogon.github.io/entra-auth-flow-visualizer/)

An interactive explainer from the [New Frontier Security](https://newfrontiersecurity.net/tools) toolbox for how Microsoft Entra ID login works: authorization codes, ID tokens, access tokens, refresh tokens, app session cookies, and Entra ESTS cookies.

Nothing here talks to a real tenant. The flows are a guided simulation.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3847](http://localhost:3847).

- **Lab** — play, pause, and step through first sign-in, SSO, refresh, sign-out, and a reused authorization code.
- **Glossary** — searchable plain-language definitions. Highlighted words in the lab open the same cards.

## Design

The lab uses the New Frontier Security system shared with [newfrontiersecurity.net](https://newfrontiersecurity.net) and the CA Gap Evaluator: a dark, square, editorial layout with hairlines instead of boxes, text actions instead of buttons, and one yellow accent. All styles live in `app/globals.css`.

## Stack

Next.js (static export for GitHub Pages), TypeScript, Framer Motion, and Base UI for the drawer.
