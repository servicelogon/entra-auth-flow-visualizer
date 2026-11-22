import type { Metadata } from "next";
import Link from "next/link";
import { GlossarySearch } from "@/components/glossary-search";

export const metadata: Metadata = {
  title: "Glossary · Entra Token Lab · New Frontier Security",
  description:
    "Plain-language definitions for Entra ID tokens, cookies, PKCE, the PRT, and related sign-in terms.",
};

export default function GlossaryPage() {
  return (
    <main id="main" tabIndex={-1} className="page shell">
      <div className="page-body">
        <header className="step-head">
          <p className="kicker">Glossary</p>
          <h2>The words this lab uses</h2>
          <p className="lede">
            Every token, cookie, and sign-in term in the lab, in plain language. Open a
            term to read why it exists.
          </p>
        </header>
        <GlossarySearch />
      </div>
      <nav className="pager" aria-label="Section navigation">
        <Link className="pager-link pager-prev" href="/">
          <span className="pager-kicker">
            <span className="arrow-icon arrow-back" aria-hidden="true" />
            Back
          </span>
          <span className="pager-title">Lab</span>
        </Link>
      </nav>
    </main>
  );
}
