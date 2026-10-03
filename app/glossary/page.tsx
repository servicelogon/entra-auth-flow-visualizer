import type { Metadata } from "next";
import { GlossarySearch } from "@/components/glossary-search";

export const metadata: Metadata = {
  title: "Glossary · Entra Token Lab",
  description:
    "Plain-language definitions for Entra ID tokens, cookies, PKCE, PRT, and related sign-in terms.",
};

export default function GlossaryPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <section className="max-w-2xl">
        <p className="text-[11px] font-medium tracking-[0.18em] text-magenta uppercase">
          Glossary
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          The words this lab uses
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          Each term has three parts: what it is, why it exists, and the mix-up
          people usually make. Tap a title for the full card.
        </p>
      </section>
      <div className="mt-8">
        <GlossarySearch />
      </div>
    </main>
  );
}
