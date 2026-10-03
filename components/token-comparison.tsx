import { TOKEN_COMPARISON } from "@/lib/tokens";

export function TokenComparison() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Compare the tickets</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          If you remember only this table, you will already be ahead of most
          sign-in bugs.
        </p>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[36rem] text-left text-sm">
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
