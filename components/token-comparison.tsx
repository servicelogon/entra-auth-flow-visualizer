import { ARTIFACTS_BY_ID, TOKEN_COMPARISON } from "@/lib/tokens";

export function TokenComparison() {
  return (
    <section className="block" aria-labelledby="compare-title">
      <h2 className="block-title" id="compare-title">
        Compare the tickets
      </h2>
      <p className="muted block-note">
        How long each one lasts, the question it answers, and the only place it should be sent.
      </p>
      <table className="compare">
        <thead>
          <tr>
            <th scope="col">Ticket</th>
            <th scope="col">Lifetime</th>
            <th scope="col">Answers</th>
            <th scope="col">Sent to</th>
          </tr>
        </thead>
        <tbody>
          {TOKEN_COMPARISON.map((row) => (
            <tr key={row.name}>
              <td>
                <span className="dot-label" style={dot(row.artifactId)}>
                  {row.name}
                </span>
              </td>
              <td>{row.lifetime}</td>
              <td>{row.answers}</td>
              <td className="mono">{row.sentTo}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="compare-cards">
        {TOKEN_COMPARISON.map((row) => (
          <li key={row.name}>
            <h3>
              <span className="dot-label" style={dot(row.artifactId)}>
                {row.name}
              </span>
            </h3>
            <dl>
              <dt>Lifetime</dt>
              <dd>{row.lifetime}</dd>
              <dt>Answers</dt>
              <dd>{row.answers}</dd>
              <dt>Sent to</dt>
              <dd>{row.sentTo}</dd>
            </dl>
          </li>
        ))}
      </ul>
    </section>
  );
}

function dot(artifactId: string) {
  return { "--dot": ARTIFACTS_BY_ID[artifactId]?.color } as React.CSSProperties;
}
