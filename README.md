# Entra Token Lab

An interactive explainer from [New Frontier Security](https://medium.com/hybrid-identity-security) for how Microsoft Entra ID login works: authorization codes, ID tokens, access tokens, refresh tokens, app session cookies, and Entra ESTS cookies.

Nothing here talks to a real tenant. The flows are a guided simulation.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3847](http://localhost:3847).

- **Lab** — play, pause, and step through first sign-in, SSO, refresh, sign-out, and a reused authorization code.
- **Glossary** — searchable plain-language definitions. Highlighted words in the lab open the same cards.

## Stack

Next.js, TypeScript, Tailwind CSS, and shadcn/ui.
