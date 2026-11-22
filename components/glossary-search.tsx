"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { TERM_GROUPS, TERMS } from "@/lib/glossary";
import { useDrawer } from "@/components/glossary-provider";

export function GlossarySearch() {
  const [query, setQuery] = useState("");
  const { openTerm } = useDrawer();
  const normalized = query.trim().toLowerCase();

  const { grouped, matches } = useMemo(() => {
    const found = TERMS.filter((term) => {
      if (!normalized) {
        return true;
      }
      return [term.title, term.alsoCalled ?? "", term.what, term.why, term.mixUp]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    });
    return {
      matches: found.length,
      grouped: TERM_GROUPS.map((group) => ({
        ...group,
        terms: found.filter((term) => term.group === group.id),
      })).filter((group) => group.terms.length > 0),
    };
  }, [normalized]);

  return (
    <div>
      <div className="search-field">
        <Search aria-hidden />
        <input
          type="search"
          className="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search tokens, cookies, PKCE, PRT…"
          aria-label="Search the glossary"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <p className="muted search-status" role="status">
        {normalized
          ? `${matches} ${matches === 1 ? "term matches" : "terms match"} “${query.trim()}”`
          : `${TERMS.length} terms in ${TERM_GROUPS.length} groups`}
      </p>

      {grouped.length === 0 ? (
        <div className="empty-note">
          <h3>No matching terms</h3>
          <p className="muted">Try “refresh”, “cookie”, or “audience”.</p>
        </div>
      ) : (
        grouped.map((group) => (
          <section key={group.id} className="term-group" aria-labelledby={`group-${group.id}`}>
            <div className="term-group-head">
              <h3 className="block-title" id={`group-${group.id}`}>
                {group.title}
                <span className="count">{group.terms.length}</span>
              </h3>
              <p className="muted">{group.blurb}</p>
            </div>
            <ul className="term-list">
              {group.terms.map((term) => (
                <li key={term.id} className="term-row">
                  <div>
                    <button
                      type="button"
                      className="term-title"
                      aria-haspopup="dialog"
                      onClick={() => openTerm(term.id)}
                    >
                      {term.title}
                      <span className="arrow-icon" aria-hidden="true" />
                    </button>
                    {term.alsoCalled ? <p className="term-also">Also called {term.alsoCalled}</p> : null}
                  </div>
                  <div>
                    <p className="term-what">{term.what}</p>
                    <p className="term-mixup">
                      <b>Common mix-up.</b> {term.mixUp}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
