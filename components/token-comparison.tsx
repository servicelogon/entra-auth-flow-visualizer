import { TOKEN_COMPARISON } from "@/lib/tokens";

export function TokenComparison() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Compare the tickets</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Lifetime, the question each ticket answers, and where it is sent.
        </p>
      </div>
      <div className="grid gap-3 md:hidden">
        {TOKEN_COMPARISON.map((row) => (
          <article key={row.name} className="rounded-2xl border border-border bg-white p-4">
            <h3 className="font-medium">{row.name}</h3>
            <dl className="mt-3 grid gap-2 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Lifetime</dt>
                <dd>{row.lifetime}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Answers</dt>
                <dd>{row.answers}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Sent to</dt>
                <dd>{row.sentTo}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
      <div className="hidden overflow-x-auto rounded-2xl border border-border md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted text-xs tracking-wide text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Ticket</th>
              <th className="px-4 py-3 font-medium">Lifetime</th>
              <th className="px-4 py-3 font-medium">Answers</th>
              <th className="px-4 py-3 font-medium">Sent to</th>
            </tr>
          </thead>
          <tbody>
            {TOKEN_COMPARISON.map((row) => (
              <tr key={row.name} className="border-t border-border bg-white">
                <td className="px-4 py-3 font-medium">{row.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.lifetime}</td>
                <td className="px-4 py-3">{row.answers}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.sentTo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
