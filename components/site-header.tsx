import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <BrandMark className="size-8 shrink-0" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold tracking-tight">
              New Frontier Security
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              Entra Token Lab
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/"
            className="rounded-full px-3 py-1.5 text-foreground/80 hover:bg-muted"
          >
            Lab
          </Link>
          <Link
            href="/glossary"
            className="rounded-full px-3 py-1.5 text-foreground/80 hover:bg-muted"
          >
            Glossary
          </Link>
        </nav>
      </div>
    </header>
  );
}
