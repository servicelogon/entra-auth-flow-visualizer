"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const labActive = pathname === "/";
  const glossaryActive = pathname.startsWith("/glossary");

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:h-24 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <BrandMark className="size-12 shrink-0 sm:size-14" />
          <span className="truncate text-lg font-semibold tracking-tight sm:text-xl">
            Entra Token Lab
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/"
            aria-current={labActive ? "page" : undefined}
            className={cn(
              "rounded-full px-3 py-1.5",
              labActive
                ? "bg-foreground text-background"
                : "text-foreground/80 hover:bg-muted"
            )}
          >
            Lab
          </Link>
          <Link
            href="/glossary"
            aria-current={glossaryActive ? "page" : undefined}
            className={cn(
              "rounded-full px-3 py-1.5",
              glossaryActive
                ? "bg-foreground text-background"
                : "text-foreground/80 hover:bg-muted"
            )}
          >
            Glossary
          </Link>
        </nav>
      </div>
    </header>
  );
}
