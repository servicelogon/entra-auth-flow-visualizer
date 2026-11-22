"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Lab", match: (path: string) => path === "/" || path === "" },
  { href: "/glossary", label: "Glossary", match: (path: string) => path.startsWith("/glossary") },
];

export function ToolIntro() {
  const pathname = usePathname() ?? "/";

  return (
    <>
      <section className="tool-intro shell" aria-labelledby="tool-title">
        <div className="tool-intro-row">
          <p className="kicker">Toolbox</p>
          <a
            className="text-btn"
            href="https://github.com/servicelogon/entra-auth-flow-visualizer"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source
          </a>
        </div>
        <h1 id="tool-title">Entra Token Lab</h1>
        <p className="opening-line">
          Watch a Microsoft Entra sign-in hand off its codes, tokens, and cookies.
          A guided simulation; nothing here talks to a real tenant.
        </p>
      </section>
      <nav className="tool-tabs" aria-label="Sections">
        <ol className="shell tool-tabs-track">
          {TABS.map((tab, index) => (
            <li key={tab.href}>
              <Link href={tab.href} aria-current={tab.match(pathname) ? "page" : undefined}>
                <span className="tab-num" aria-hidden="true">
                  0{index + 1}
                </span>
                {tab.label}
              </Link>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
