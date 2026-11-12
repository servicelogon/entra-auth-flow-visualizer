import type { Metadata } from "next";
import { GlossarySearch } from "@/components/glossary-search";

export const metadata: Metadata = {
  title: "Glossary · Entra Token Lab",
  description:
    "Definitions for Entra ID tokens, cookies, PKCE, PRT, and related sign-in terms.",
};

export default function GlossaryPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <section className="max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight">
          The words this lab uses
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          Definitions for the tokens, cookies, and sign-in terms in the lab. Open
          a title to read why the term exists.
        </p>
      </section>
      <div className="mt-8">
        <GlossarySearch />
      </div>
    </main>
  );
}
