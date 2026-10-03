"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { TERMS_BY_ID } from "@/lib/glossary";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type GlossaryContextValue = {
  openTerm: (id: string) => void;
};

const GlossaryContext = createContext<GlossaryContextValue | null>(null);

export function useGlossary() {
  const value = useContext(GlossaryContext);
  if (!value) {
    throw new Error("useGlossary must be used inside GlossaryProvider");
  }
  return value;
}

export function GlossaryProvider({ children }: { children: React.ReactNode }) {
  const [termId, setTermId] = useState<string | null>(null);
  const term = termId ? TERMS_BY_ID[termId] : undefined;

  const value = useMemo(
    () => ({
      openTerm: (id: string) => {
        if (TERMS_BY_ID[id]) {
          setTermId(id);
        }
      },
    }),
    []
  );

  return (
    <GlossaryContext.Provider value={value}>
      {children}
      <Sheet
        open={Boolean(term)}
        onOpenChange={(open) => {
          if (!open) {
            setTermId(null);
          }
        }}
      >
        <SheetContent side="right" className="w-full sm:max-w-md">
          {term ? (
            <>
              <SheetHeader className="border-b border-border pr-10">
                <p className="text-[11px] font-medium tracking-[0.16em] text-magenta uppercase">
                  Defined term
                </p>
                <SheetTitle className="text-xl">{term.title}</SheetTitle>
                {term.alsoCalled ? (
                  <SheetDescription>Also called {term.alsoCalled}.</SheetDescription>
                ) : (
                  <SheetDescription>Plain-language definition.</SheetDescription>
                )}
              </SheetHeader>
              <div className="flex flex-col gap-5 overflow-y-auto px-4 pb-6">
                <DefinitionBlock label="What it is" text={term.what} />
                <DefinitionBlock label="Why it exists" text={term.why} />
                <DefinitionBlock label="Common mix-up" text={term.mixUp} />
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </GlossaryContext.Provider>
  );
}

function DefinitionBlock({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="mb-1 text-[11px] font-medium tracking-[0.14em] text-magenta uppercase">
        {label}
      </p>
      <p className="text-sm leading-6 text-foreground">{text}</p>
    </div>
  );
}
