"use client";

import { artifactStatusLabel, buildJwt } from "@/lib/tokens";
import type { Artifact, ArtifactStatus } from "@/lib/types";
import { TermLink } from "@/components/term-link";
import { Badge } from "@/components/ui/badge";

export function TokenInspector({
  artifact,
  status,
}: {
  artifact: Artifact;
  status: ArtifactStatus;
}) {
  const jwt = artifact.jwt
    ? buildJwt(artifact.jwt.header, artifact.jwt.payload)
    : null;
  const [header, payload, signature] = jwt ? jwt.split(".") : [];

  return (
    <div className="rounded-2xl border border-border bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">{artifact.label}</h3>
        </div>
        <Badge variant="outline">{artifactStatusLabel(status)}</Badge>
      </div>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <Fact label="Typical lifetime" value={artifact.lifetime} />
        <Fact label="Issued by" value={artifact.issuedBy} />
        <Fact label="Accepted by" value={artifact.acceptedBy} />
        <div>
          <dt className="text-xs text-muted-foreground">Learn more</dt>
          <dd className="mt-0.5">
            <TermLink id={artifact.termId}>{artifact.label}</TermLink>
          </dd>
        </div>
      </dl>

      {artifact.opaqueValue ? (
        <div className="mt-4">
          <p className="text-xs text-muted-foreground">Opaque value</p>
          <code className="mt-1 block overflow-x-auto rounded-xl bg-muted px-3 py-2 font-mono text-xs">
            {artifact.opaqueValue}
          </code>
          <p className="mt-2 text-sm text-muted-foreground">
            This is not meant to be decoded. Treat it like a password: send it
            only to the endpoint that issued it.
          </p>
        </div>
      ) : null}

      {artifact.jwt && jwt ? (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            This is a sample <TermLink id="jwt">JWT</TermLink>. The payload is
            readable. The signature is what makes it trustworthy.
          </p>
          <JwtChunk label="Header" value={header} />
          <JwtChunk label="Payload" value={payload} />
          <JwtChunk label="Signature" value={signature} />
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[20rem] text-left text-sm">
              <thead className="bg-muted text-xs text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Claim</th>
                  <th className="px-3 py-2 font-medium">Value</th>
                  <th className="px-3 py-2 font-medium">Meaning</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(artifact.jwt.payload).map(([key, value]) => (
                  <tr key={key} className="border-t border-border">
                    <td className="px-3 py-2 font-mono text-xs">{key}</td>
                    <td className="px-3 py-2 font-mono text-xs break-all">
                      {Array.isArray(value) ? value.join(" ") : String(value)}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {artifact.claimNotes?.[key] ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5">{value}</dd>
    </div>
  );
}

function JwtChunk({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <code className="mt-1 block overflow-x-auto rounded-xl bg-muted px-3 py-2 font-mono text-[11px] break-all">
        {value}
      </code>
    </div>
  );
}
