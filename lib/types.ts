export type ActorId = "user" | "browser" | "app" | "entra" | "api";

export type PacketKind =
  | "request"
  | "credential"
  | "code"
  | "token"
  | "cookie"
  | "api"
  | "error";

export type ArtifactStatus = "live" | "expired" | "consumed";

export type ArtifactKind =
  | "authorization-code"
  | "id-token"
  | "access-token"
  | "refresh-token"
  | "app-session"
  | "ests-session"
  | "ests-persistent"
  | "pkce";

export type TermGroup = "people" | "tickets" | "sessions" | "device";

export type Term = {
  id: string;
  title: string;
  group: TermGroup;
  alsoCalled?: string;
  what: string;
  why: string;
  mixUp: string;
};

export type JwtPart = {
  header: Record<string, string>;
  payload: Record<string, string | number | string[]>;
};

export type Artifact = {
  id: string;
  kind: ArtifactKind;
  label: string;
  shortLabel: string;
  lifetime: string;
  issuedBy: string;
  acceptedBy: string;
  termId: string;
  color: string;
  jwt?: JwtPart;
  opaqueValue?: string;
  claimNotes?: Record<string, string>;
};

export type ArtifactEvent = {
  action: "add" | "remove" | "expire" | "replace";
  artifactId: string;
};

export type FlowStep = {
  id: string;
  title: string;
  explanation: string;
  from: ActorId;
  to: ActorId;
  packet: string;
  packetKind: PacketKind;
  highlightActors: ActorId[];
  highlightTerms: string[];
  artifacts: ArtifactEvent[];
  failed?: boolean;
};

export type Scenario = {
  id: string;
  title: string;
  summary: string;
  startingArtifacts: string[];
  steps: FlowStep[];
};

export type Actor = {
  id: ActorId;
  label: string;
  subtitle: string;
};
