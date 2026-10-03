import type { Artifact } from "./types";

function encodeSegment(value: object) {
  const json = JSON.stringify(value);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function buildJwt(header: Record<string, string>, payload: Record<string, string | number | string[]>) {
  return `${encodeSegment(header)}.${encodeSegment(payload)}.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`;
}

const jwtHeader = {
  alg: "RS256",
  typ: "JWT",
  kid: "nfs-lab-key",
};

export const ARTIFACTS: Artifact[] = [
  {
    id: "pkce",
    kind: "pkce",
    label: "PKCE verifier",
    shortLabel: "PKCE",
    lifetime: "One login",
    issuedBy: "Contoso app",
    acceptedBy: "Entra ID token endpoint",
    termId: "pkce",
    color: "#6d4c41",
    opaqueValue: "nQ8vL2p0xE4wR7sK1mC9bT6yU3iA5dF8hG2j",
  },
  {
    id: "authorization-code",
    kind: "authorization-code",
    label: "Authorization code",
    shortLabel: "Code",
    lifetime: "About 10 minutes, one use",
    issuedBy: "Entra ID",
    acceptedBy: "Entra ID token endpoint",
    termId: "authorization-code",
    color: "#7c4dff",
    opaqueValue: "0.AXQAnM8code_lab_only_not_real",
  },
  {
    id: "id-token",
    kind: "id-token",
    label: "ID token",
    shortLabel: "ID",
    lifetime: "About 1 hour",
    issuedBy: "Entra ID",
    acceptedBy: "Contoso app (to identify Alex)",
    termId: "id-token",
    color: "#00897b",
    jwt: {
      header: jwtHeader,
      payload: {
        aud: "11111111-2222-3333-4444-555555555555",
        iss: "https://login.microsoftonline.com/aaaabbbb-cccc-dddd-eeee-ffffffffffff/v2.0",
        iat: 1770000000,
        nbf: 1770000000,
        exp: 1770003600,
        name: "Alex Rivera",
        preferred_username: "alex@contoso.com",
        oid: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
        tid: "aaaabbbb-cccc-dddd-eeee-ffffffffffff",
        ver: "2.0",
      },
    },
    claimNotes: {
      aud: "The Contoso app’s client ID. ID tokens are meant for the app, not for Graph.",
      iss: "Which Entra tenant minted this token.",
      name: "Display name for the welcome screen. Not a permission.",
      oid: "Alex’s immutable object ID in this tenant.",
      tid: "Contoso’s tenant ID.",
      exp: "Unix time when this ID token stops being valid.",
    },
  },
  {
    id: "access-token",
    kind: "access-token",
    label: "Access token",
    shortLabel: "Access",
    lifetime: "About 60–90 minutes",
    issuedBy: "Entra ID",
    acceptedBy: "Microsoft Graph",
    termId: "access-token",
    color: "#d81b60",
    jwt: {
      header: jwtHeader,
      payload: {
        aud: "00000003-0000-0000-c000-000000000000",
        iss: "https://login.microsoftonline.com/aaaabbbb-cccc-dddd-eeee-ffffffffffff/v2.0",
        iat: 1770000000,
        nbf: 1770000000,
        exp: 1770003600,
        scp: "User.Read Mail.Read",
        oid: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
        tid: "aaaabbbb-cccc-dddd-eeee-ffffffffffff",
        azp: "11111111-2222-3333-4444-555555555555",
        preferred_username: "alex@contoso.com",
      },
    },
    claimNotes: {
      aud: "00000003-… is Microsoft Graph. A different API would have a different audience.",
      scp: "Delegated permissions this token carries for Alex.",
      azp: "The Contoso app that requested the token (authorized party).",
      exp: "After this, Graph returns 401 and the app should refresh.",
      oid: "The user the API is acting for.",
    },
  },
  {
    id: "refresh-token",
    kind: "refresh-token",
    label: "Refresh token",
    shortLabel: "Refresh",
    lifetime: "Days to months (24 hours for many SPAs)",
    issuedBy: "Entra ID",
    acceptedBy: "Entra ID token endpoint only",
    termId: "refresh-token",
    color: "#f9a825",
    opaqueValue: "0.AXQArefr_lab_only_do_not_send_to_graph",
  },
  {
    id: "app-session",
    kind: "app-session",
    label: "Contoso session cookie",
    shortLabel: "App session",
    lifetime: "Until sign-out or idle timeout",
    issuedBy: "Contoso app",
    acceptedBy: "Contoso app",
    termId: "app-session",
    color: "#191919",
    opaqueValue: "contoso.sid=s%3Aalex.lab",
  },
  {
    id: "ests-session",
    kind: "ests-session",
    label: "ESTSAUTH",
    shortLabel: "ESTSAUTH",
    lifetime: "Until the browser closes",
    issuedBy: "Entra ID",
    acceptedBy: "login.microsoftonline.com",
    termId: "estsauth",
    color: "#1565c0",
    opaqueValue: "ESTSAUTH=session-lab-value",
  },
  {
    id: "ests-persistent",
    kind: "ests-persistent",
    label: "ESTSAUTHPERSISTENT",
    shortLabel: "ESTS persistent",
    lifetime: "Until “Stay signed in” expires",
    issuedBy: "Entra ID",
    acceptedBy: "login.microsoftonline.com",
    termId: "estsauth",
    color: "#283593",
    opaqueValue: "ESTSAUTHPERSISTENT=persistent-lab-value",
  },
];

export const ARTIFACTS_BY_ID = Object.fromEntries(
  ARTIFACTS.map((artifact) => [artifact.id, artifact])
);

export const TOKEN_COMPARISON = [
  {
    name: "Authorization code",
    lifetime: "~10 minutes, one use",
    answers: "May the app collect tokens?",
    sentTo: "Entra /token",
  },
  {
    name: "ID token",
    lifetime: "~1 hour",
    answers: "Who signed in?",
    sentTo: "The app only",
  },
  {
    name: "Access token",
    lifetime: "~1 hour",
    answers: "What may the app do at this API?",
    sentTo: "Graph or your API",
  },
  {
    name: "Refresh token",
    lifetime: "Long-lived",
    answers: "May the app get new access tokens?",
    sentTo: "Entra /token only",
  },
  {
    name: "App session",
    lifetime: "Until logout",
    answers: "Is this browser still signed into Contoso?",
    sentTo: "Contoso only",
  },
  {
    name: "Entra session",
    lifetime: "Browser or persistent",
    answers: "Is this browser still signed into Microsoft?",
    sentTo: "login.microsoftonline.com",
  },
];
