"use client";

import { useMemo, useState } from "react";
import { TERM_GROUPS, TERMS } from "@/lib/glossary";
import { Input } from "@/components/ui/input";
import { TermLink } from "@/components/term-link";

export function GlossarySearch() {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();

  const grouped = useMemo(() => {
    const matches = TERMS.filter((term) => {
      if (!normalized) {
        return true;
      }
      const haystack = [
        term.title,
        term.alsoCalled ?? "",
        term.what,
        term.why,
        term.mixUp,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    });

    return TERM_GROUPS.map((group) => ({
      ...group,
      terms: matches.filter((term) => term.group === group.id),
    })).filter((group) => group.terms.length > 0);
  }, [normalized]);

  return (
    <div className="space-y-8">
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search tokens, cookies, PKCE, PRT…"
        aria-label="Search glossary"
        className="h-11 rounded-full px-4"
      />

      {grouped.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border px-4 py-10 text-center">
          <p className="font-medium">No matching terms</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try “refresh”, “cookie”, or “audience”.
          </p>
        </div>
      ) : (
        grouped.map((group) => (
          <section key={group.id} className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">{group.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{group.blurb}</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {group.terms.map((term) => (
                <article
                  key={term.id}
                  className="rounded-2xl border border-border bg-white p-4"
                >
                  <h3 className="font-semibold tracking-tight">
                    <TermLink id={term.id}>{term.title}</TermLink>
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {term.what}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
