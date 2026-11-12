import { FlowLab } from "@/components/flow-lab";
import { PrtCallout } from "@/components/prt-callout";
import { TokenComparison } from "@/components/token-comparison";
import { TermLink } from "@/components/term-link";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <section className="max-w-3xl">
        <p className="text-[11px] font-medium tracking-[0.18em] text-magenta uppercase">
          New Frontier Security
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          How a Microsoft sign-in works
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground text-pretty">
          A person, a browser, an app,{" "}
          <TermLink id="entra-id">Microsoft Entra ID</TermLink>, and Microsoft
          Graph pass tickets between them. Highlighted words open a definition.
        </p>
      </section>

      <div className="mt-10">
        <FlowLab />
      </div>

      <div className="mt-12 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <TokenComparison />
        <PrtCallout />
      </div>
    </main>
  );
}
