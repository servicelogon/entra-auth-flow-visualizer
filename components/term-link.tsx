"use client";

import { useGlossary } from "@/components/glossary-provider";
import { cn } from "@/lib/utils";

export function TermLink({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { openTerm } = useGlossary();

  return (
    <button
      type="button"
      onClick={() => openTerm(id)}
      className={cn(
        "inline rounded-sm bg-magenta-soft px-1 py-0.5 font-medium text-magenta underline decoration-magenta/30 underline-offset-2 transition-colors hover:bg-[#f8bbd0]",
        className
      )}
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
