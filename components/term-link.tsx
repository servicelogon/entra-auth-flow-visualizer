"use client";

import { useDrawer } from "@/components/glossary-provider";
import { cx } from "@/lib/utils";

export function TermLink({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { openTerm } = useDrawer();

  return (
    <button
      type="button"
      onClick={() => openTerm(id)}
      aria-haspopup="dialog"
      className={cx("term", className)}
    >
      {children}
    </button>
  );
}

export function RichText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\[\[[^\]]+\]\])/g);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        const match = part.match(/^\[\[([^\]|]+)(?:\|([^\]]+))?\]\]$/);
        if (!match) {
          return <span key={index}>{part}</span>;
        }
        const [, id, label] = match;
        return (
          <TermLink key={`${id}-${index}`} id={id}>
            {label ?? id.replace(/-/g, " ")}
          </TermLink>
        );
      })}
    </span>
  );
}
