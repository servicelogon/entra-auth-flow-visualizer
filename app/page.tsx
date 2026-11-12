import { FlowLab } from "@/components/flow-lab";
import { PrtCallout } from "@/components/prt-callout";
import { TokenComparison } from "@/components/token-comparison";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
      <section className="max-w-3xl">
        <p className="text-[11px] font-medium tracking-[0.18em] text-magenta uppercase">
          New Frontier Security
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          How a Microsoft sign-in works
        </h1>
        <p className="mt-2 text-base leading-7 text-muted-foreground">
          Watch the tickets move. Highlighted words open a definition.
        </p>
      </section>

      <div className="mt-6">
        <FlowLab />
      </div>

      <details className="mt-10 rounded-2xl border border-border bg-white p-4 sm:p-5">
        <summary className="cursor-pointer font-semibold tracking-tight">
          Reference
        </summary>
        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <TokenComparison />
          <PrtCallout />
        </div>
      </details>
    </main>
  );
}
