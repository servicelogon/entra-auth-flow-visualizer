"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { siteBasePath } from "@/lib/site-path";

// The same chrome as newfrontiersecurity.net: logo, three links, and a
// full-screen menu on phones. The lab lives in the Toolbox.
export const SITE = "https://newfrontiersecurity.net";
export const NAV_LINKS: [string, string][] = [
  ["Blog", `${SITE}/`],
  ["Newsroom", `${SITE}/newsroom`],
  ["Toolbox", `${SITE}/tools`],
];

export function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      {NAV_LINKS.map(([name, href]) => (
        <a
          key={name}
          href={href}
          aria-current={name === "Toolbox" ? "page" : undefined}
          onClick={onNavigate}
        >
          {name}
        </a>
      ))}
    </>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("nav-open", menuOpen);
    if (!menuOpen) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };
    // Rotating a phone into a desktop width closes the menu.
    const wide = window.matchMedia("(min-width: 701px)");
    const onWide = () => wide.matches && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [menuOpen]);

  return (
    <header className="topbar shell">
      <a className="brand" href={`${SITE}/`} aria-label="New Frontier Security home">
        <Image
          className="brand-logo"
          src={`${siteBasePath}/new-frontier-security-logo.png`}
          width={837}
          height={349}
          alt="New Frontier Security"
          priority
          unoptimized
        />
      </a>
      <div className="header-actions">
        <nav className="desktop-nav" aria-label="Main navigation">
          <NavLinks />
        </nav>
        <div className={`site-menu${menuOpen ? " open" : ""}`}>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="hamburger" aria-hidden="true" />
          </button>
          {menuOpen ? (
            <nav id="mobile-nav" aria-label="Mobile navigation">
              <NavLinks onNavigate={() => setMenuOpen(false)} />
            </nav>
          ) : null}
        </div>
      </div>
    </header>
  );
}
