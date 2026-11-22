"use client";

import { Dialog } from "@base-ui/react/dialog";
import { artifactStatusLabel, buildJwt } from "@/lib/tokens";
import type { Artifact, ArtifactStatus } from "@/lib/types";
import { TermLink } from "@/components/term-link";

export function TokenInspector({
  artifact,
  status,
  headingRef,
}: {
  artifact: Artifact;
  status: ArtifactStatus;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  const jwt = artifact.jwt ? buildJwt(artifact.jwt.header, artifact.jwt.payload) : null;
  const [header, payload, signature] = jwt ? jwt.split(".") : [];

  return (
    <article>
      <header className="drawer-head">
        <span className={`badge ${status}`}>{artifactStatusLabel(status)}</span>
        <Dialog.Title ref={headingRef} tabIndex={-1} render={<h2 />}>
          <span className="dot-label" style={{ "--dot": artifact.color } as React.CSSProperties}>
            {artifact.label}
          </span>
        </Dialog.Title>
      </header>

      <dl className="facts">
        <Fact label="Typical lifetime" value={artifact.lifetime} />
        <Fact label="Issued by" value={artifact.issuedBy} />
        <Fact label="Accepted by" value={artifact.acceptedBy} />
        <div>
          <dt>Learn more</dt>
          <dd>
            <TermLink id={artifact.termId}>{artifact.label}</TermLink>
          </dd>
        </div>
      </dl>

      {artifact.opaqueValue ? (
        <section className="drawer-section">
          <h3 className="kicker">Opaque value</h3>
          <code className="code-block">{artifact.opaqueValue}</code>
          <p className="muted" style={{ marginTop: 10 }}>
            Not meant to be decoded. Treat it like a password: send it only to the
            endpoint that issued it.
          </p>
        </section>
      ) : null}

      {artifact.jwt && jwt ? (
        <>
          <section className="drawer-section">
            <h3 className="kicker">Sample JWT</h3>
            <p>
              A sample <TermLink id="jwt">JWT</TermLink>. Anyone can read the
              payload. The signature is what makes it trustworthy.
            </p>
            <div className="jwt">
              <code className="code-block">
                <span className="jwt-h">{header}</span>
                <span className="jwt-dot">.</span>
                <span className="jwt-p">{payload}</span>
                <span className="jwt-dot">.</span>
                <span className="jwt-s">{signature}</span>
              </code>
              <ul className="jwt-legend" aria-label="Parts">
                <li className="jwt-h"><span>Header</span></li>
                <li className="jwt-p"><span>Payload</span></li>
                <li className="jwt-s"><span>Signature</span></li>
              </ul>
            </div>
          </section>
          <section className="drawer-section">
            <h3 className="kicker">Claims in the payload</h3>
            <ul className="claims">
              {Object.entries(artifact.jwt.payload).map(([key, value]) => (
                <li key={key}>
                  <span className="claim-key">{key}</span>
                  <span className="claim-value">
                    {Array.isArray(value) ? value.join(" ") : String(value)}
                  </span>
                  {artifact.claimNotes?.[key] ? (
                    <span className="claim-note">{artifact.claimNotes[key]}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : null}
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
