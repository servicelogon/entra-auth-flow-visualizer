import type { Term, TermGroup } from "./types";

export const TERM_GROUPS: { id: TermGroup; title: string; blurb: string }[] = [
  {
    id: "people",
    title: "People and places",
    blurb: "Who is talking to whom during a Microsoft sign-in.",
  },
  {
    id: "tickets",
    title: "Tickets",
    blurb: "The codes and tokens Entra ID hands out after a successful login.",
  },
  {
    id: "sessions",
    title: "Sessions",
    blurb: "Cookies that remember you in the app versus at Microsoft.",
  },
  {
    id: "device",
    title: "Device trust",
    blurb: "Why a work laptop often signs you in without asking again.",
  },
];

export const TERMS: Term[] = [
  {
    id: "entra-id",
    title: "Microsoft Entra ID",
    alsoCalled: "formerly Azure Active Directory",
    group: "people",
    what: "Microsoft’s cloud directory. It stores users, apps, and the rules for who can sign in.",
    why: "Apps do not keep your Microsoft password. They send you to Entra ID, which proves who you are and then issues tickets the app can trust.",
    mixUp:
      "Entra ID is the identity service. Microsoft 365 and Azure are products that use it. Signing in to Outlook still goes through Entra ID.",
  },
  {
    id: "tenant",
    title: "Tenant",
    group: "people",
    what: "One organization’s private Entra ID directory, such as contoso.onmicrosoft.com.",
    why: "Tokens are minted for a specific tenant. That is how Entra ID keeps Contoso’s users and Fabrikam’s users apart.",
    mixUp:
      "A tenant is not a subscription. One company can have several Azure subscriptions inside one tenant.",
  },
  {
    id: "user",
    title: "User",
    group: "people",
    what: "The person (or mailbox, or guest) who is trying to use an app.",
    why: "Almost every token in this lab is issued on behalf of a user. The user’s object ID (oid) is stamped into the token.",
    mixUp:
      "A user account is not the same as an admin role. The same person can be a regular user in one app and a privileged admin in another.",
  },
  {
    id: "app-registration",
    title: "App registration",
    group: "people",
    what: "The record in Entra ID that represents Contoso’s app: its name, redirect URLs, and secrets.",
    why: "Entra ID will only send codes and tokens back to an app it already knows.",
    mixUp:
      "The app registration is the identity of the app. An enterprise app / service principal is that registration as it appears inside a tenant.",
  },
  {
    id: "client-id",
    title: "Client ID",
    alsoCalled: "application ID",
    group: "people",
    what: "A public GUID that names the app during login. It is safe to show in a browser URL.",
    why: "Entra ID uses it to look up the app registration and decide which redirect URI and permissions are allowed.",
    mixUp:
      "The client ID is not a secret. A client secret or certificate is the confidential part, and it never belongs in a single-page app.",
  },
  {
    id: "redirect-uri",
    title: "Redirect URI",
    group: "people",
    what: "The exact address Entra ID is allowed to send the browser back to after sign-in.",
    why: "If this is wrong, an attacker could steal the authorization code. Entra ID only returns to registered URIs.",
    mixUp:
      "http://localhost is allowed for development. A production web app should use HTTPS and an exact path match.",
  },
  {
    id: "audience",
    title: "Audience",
    alsoCalled: "resource",
    group: "people",
    what: "The API the access token is meant for, written in the token as the aud claim.",
    why: "Microsoft Graph will reject a token that was minted for your own API, and the other way around.",
    mixUp:
      "One sign-in can produce several access tokens over time, each with a different audience, by using the refresh token.",
  },
  {
    id: "scope",
    title: "Scope",
    alsoCalled: "permission",
    group: "people",
    what: "A named permission the app is asking for, such as User.Read or Mail.Read.",
    why: "The access token’s scp (or roles) claim tells the API what the app may do for this user.",
    mixUp:
      "openid, profile, and email identify the user. offline_access is what asks for a refresh token. Those are not Graph data permissions.",
  },
  {
    id: "consent",
    title: "Consent",
    group: "people",
    what: "The user or an admin agreeing that this app may use those scopes.",
    why: "Without consent, Entra ID will not issue a token for that permission, even if the user signed in.",
    mixUp:
      "Admin consent is for tenant-wide or highly privileged permissions. User consent is only for what that one person can grant.",
  },
  {
    id: "authorization-code",
    title: "Authorization code",
    group: "tickets",
    what: "A short-lived, one-time code Entra ID puts in the browser redirect after the user signs in.",
    why: "The browser never holds the real tokens in this flow. The app swaps the code at the token endpoint, away from the address bar.",
    mixUp:
      "The code is not a login session and not an access token. Reusing it returns an error such as AADSTS54005.",
  },
  {
    id: "id-token",
    title: "ID token",
    group: "tickets",
    what: "A signed JWT that tells the app who signed in: name, username, tenant, and a few profile claims.",
    why: "The app uses it to create its own welcome screen and session. APIs should not accept it as proof of access.",
    mixUp:
      "An ID token answers “who is this person?” An access token answers “what may this app do at that API?”",
  },
  {
    id: "access-token",
    title: "Access token",
    group: "tickets",
    what: "A short-lived JWT the app sends to an API as proof it may call that API for this user.",
    why: "The API can validate the signature and claims without calling Entra ID on every request.",
    mixUp:
      "Having a valid access token does not mean the user is still sitting at the keyboard. It is not the Microsoft login session.",
  },
  {
    id: "refresh-token",
    title: "Refresh token",
    group: "tickets",
    what: "A long-lived secret the app stores and later sends to Entra ID to mint a new access token.",
    why: "Access tokens expire in about an hour. A refresh token lets the app keep working without another password prompt.",
    mixUp:
      "Never send a refresh token to Microsoft Graph or your own API. Only the Entra ID token endpoint should see it.",
  },
  {
    id: "jwt",
    title: "JWT",
    alsoCalled: "JSON Web Token",
    group: "tickets",
    what: "A three-part string: header, payload, and signature, each Base64url-encoded and joined by dots.",
    why: "Anyone can read the payload. The signature is what proves Entra ID issued it and that nobody changed it.",
    mixUp:
      "Readable is not the same as valid. Always verify the signature, issuer, audience, and expiry before trusting claims.",
  },
  {
    id: "claims",
    title: "Claims",
    group: "tickets",
    what: "The fields inside a token payload, such as oid, tid, aud, scp, and exp.",
    why: "They are how Entra ID tells the app or API who the user is, which tenant they belong to, and what is allowed.",
    mixUp:
      "A claim is not a permission by itself. scp and roles are the permission claims. name is just display data.",
  },
  {
    id: "bearer-token",
    title: "Bearer token",
    group: "tickets",
    what: "A token that works for whoever holds it. The API call looks like Authorization: Bearer <access_token>.",
    why: "That is the standard way HTTP APIs accept OAuth access tokens.",
    mixUp:
      "If someone steals a bearer token, they can call the API until it expires. That is why HTTPS and short lifetimes matter.",
  },
  {
    id: "pkce",
    title: "PKCE",
    alsoCalled: "Proof Key for Code Exchange",
    group: "tickets",
    what: "A one-time secret the app creates before login. Entra ID only gives tokens if the later swap presents the matching verifier.",
    why: "It stops someone who steals the authorization code from the redirect from cashing it in themselves.",
    mixUp:
      "PKCE is required for single-page apps and recommended for all public clients. It is not a replacement for HTTPS.",
  },
  {
    id: "msal",
    title: "MSAL",
    alsoCalled: "Microsoft Authentication Library",
    group: "tickets",
    what: "Microsoft’s official libraries that run these flows, cache tokens, and attach the right access token to API calls.",
    why: "Hand-rolling redirects is easy to get wrong. MSAL already knows PKCE, refresh, and silent SSO.",
    mixUp:
      "MSAL does not replace Entra ID. It is the client that talks to Entra ID.",
  },
  {
    id: "token-lifetime",
    title: "Token lifetime",
    group: "tickets",
    what: "How long a ticket stays valid. Access and ID tokens are usually about 60–90 minutes. Refresh tokens last much longer.",
    why: "Short access tokens limit the damage if one is stolen. Refresh tokens trade convenience for a secret you must protect.",
    mixUp:
      "SPA refresh tokens that return to a spa redirect URI expire in 24 hours. Desktop and confidential web apps last longer, subject to Conditional Access.",
  },
  {
    id: "app-session",
    title: "App session cookie",
    group: "sessions",
    what: "The cookie Contoso’s own server sets after it has seen a valid ID token. It is how the app remembers you on the next page load.",
    why: "The app should not send the access token on every HTML navigation. It keeps tokens server-side (or in MSAL cache) and uses its own session.",
    mixUp:
      "Clearing the app cookie signs you out of Contoso. It does not sign you out of Microsoft or Teams.",
  },
  {
    id: "entra-session",
    title: "Entra session",
    alsoCalled: "ESTS cookies",
    group: "sessions",
    what: "Cookies Entra ID sets on login.microsoftonline.com so the next app can sign you in without another password.",
    why: "That is single sign-on across Outlook, Teams, Azure portal, and your own apps.",
    mixUp:
      "These cookies are Microsoft’s session, not your app’s. Your API never sees ESTSAUTH.",
  },
  {
    id: "estsauth",
    title: "ESTSAUTH and ESTSAUTHPERSISTENT",
    group: "sessions",
    what: "The main Entra ID browser cookies. ESTSAUTH is a session cookie. ESTSAUTHPERSISTENT lasts across browser restarts if the user chose “Stay signed in.”",
    why: "They let Entra ID recognize an already-authenticated browser and skip the password prompt.",
    mixUp:
      "Incognito windows, blocked third-party cookies, and some mobile browsers can hide these cookies and force a visible login.",
  },
  {
    id: "sso",
    title: "Single sign-on",
    group: "sessions",
    what: "Signing in once at Entra ID, then opening other Microsoft or Entra-registered apps without typing the password again.",
    why: "The Entra session cookie (or a device PRT) is reused for each new authorize request.",
    mixUp:
      "SSO is not the same as an access token. Each app still gets its own tokens after the silent handshake.",
  },
  {
    id: "silent-auth",
    title: "Silent authentication",
    group: "sessions",
    what: "A sign-in request that succeeds using an existing Entra session or MSAL cache, with no UI.",
    why: "MSAL tries this first so apps can refresh or get a new API token without interrupting the user.",
    mixUp:
      "If there is no Entra session, silent auth fails. That is expected. The app should then fall back to an interactive login.",
  },
  {
    id: "mfa",
    title: "Multifactor authentication",
    group: "sessions",
    what: "A second proof beyond the password, such as a phone prompt, FIDO2 key, or Authenticator number match.",
    why: "Stolen passwords are common. MFA is what Conditional Access usually requires before Entra ID issues tokens.",
    mixUp:
      "Completing MFA updates the Entra session. Later SSO often does not ask for MFA again until the session or policy says so.",
  },
  {
    id: "prt",
    title: "Primary Refresh Token",
    group: "device",
    what: "A device-bound token Windows, macOS, iOS, or Android gets when the device is joined or registered to Entra ID.",
    why: "The OS and broker (WAM or Microsoft Authenticator) use the PRT to mint tokens for apps, which is why a work laptop often never shows a password.",
    mixUp:
      "A PRT is not an access token and not the ESTSAUTH cookie. It lives with the device account, not inside your web app.",
  },
  {
    id: "conditional-access",
    title: "Conditional Access",
    group: "device",
    what: "If-then policies in Entra ID: if this user, app, location, or risk, then require MFA, a compliant device, or block.",
    why: "Tokens are only issued after the policy passes. That is the control plane sitting in front of every flow in this lab.",
    mixUp:
      "Security Defaults is a simpler on/off baseline. Conditional Access is the customizable replacement once you have Entra ID P1.",
  },
  {
    id: "device-code",
    title: "Device code flow",
    group: "device",
    what: "A sign-in for TVs and CLIs: the device shows a code, you enter it at microsoft.com/devicelogin on another computer.",
    why: "Those devices cannot host a full browser login.",
    mixUp:
      "Attackers abuse this flow in phishing. Many tenants block it with Conditional Access unless it is required.",
  },
  {
    id: "client-credentials",
    title: "Client credentials flow",
    group: "device",
    what: "An app signs in as itself with a secret or certificate. There is no user, and usually no refresh token.",
    why: "Background jobs and daemons need to call APIs when nobody is at a keyboard.",
    mixUp:
      "Those access tokens have roles, not scp. They are app-only and should never be confused with a signed-in user.",
  },
  {
    id: "on-behalf-of",
    title: "On-behalf-of flow",
    group: "device",
    what: "A middle-tier API trades a user’s incoming access token for a new token to call a downstream API.",
    why: "Your API should not reuse the browser’s Graph token. It asks Entra ID for a token meant for the next API.",
    mixUp:
      "This is not the same as a refresh. The incoming token must have the right audience for your API first.",
  },
];

export const TERMS_BY_ID = Object.fromEntries(TERMS.map((term) => [term.id, term]));

export function getTerm(id: string): Term {
  const term = TERMS_BY_ID[id];
  if (!term) {
    throw new Error(`Unknown term: ${id}`);
  }
  return term;
}
