"use client";

import { Dialog } from "@base-ui/react/dialog";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { TERMS_BY_ID } from "@/lib/glossary";
import { ARTIFACTS_BY_ID } from "@/lib/tokens";
import type { ArtifactStatus } from "@/lib/types";
import { RichText } from "@/components/term-link";
import { TokenInspector } from "@/components/token-inspector";

// One drawer for the whole site. A glossary card and a ticket inspector share
// it, so opening a term from inside a ticket swaps the view (with a way back)
// instead of stacking a second modal on top of the first.

type View =
  | { kind: "term"; id: string }
  | { kind: "token"; id: string; status: ArtifactStatus };

type DrawerContextValue = {
  open: boolean;
  activeTokenId: string | null;
  openTerm: (id: string) => void;
  openToken: (id: string, status: ArtifactStatus) => void;
};

const DrawerContext = createContext<DrawerContextValue | null>(null);

export function useDrawer() {
  const value = useContext(DrawerContext);
  if (!value) {
    throw new Error("useDrawer must be used inside DrawerProvider");
  }
  return value;
}

export const useGlossary = useDrawer;

export function DrawerProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [stack, setStack] = useState<View[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const openRef = useRef(false);
  const view = stack[stack.length - 1];

  const push = useCallback((next: View) => {
    setStack((current) => {
      const top = current[current.length - 1];
      if (top && top.kind === next.kind && top.id === next.id) {
        return current;
      }
      // Opened from the page: start fresh. Opened from inside the drawer: keep a way back.
      return [...(openRef.current ? current : []), next];
    });
    setOpen(true);
  }, []);

  const openTerm = useCallback(
    (id: string) => {
      if (TERMS_BY_ID[id]) {
        push({ kind: "term", id });
      }
    },
    [push]
  );

  const openToken = useCallback(
    (id: string, status: ArtifactStatus) => {
      if (ARTIFACTS_BY_ID[id]) {
        push({ kind: "token", id, status });
      }
    },
    [push]
  );

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  // A new view starts at the top, with focus on its heading.
  useEffect(() => {
    if (!open || stack.length < 2) {
      return;
    }
    scrollRef.current?.scrollTo({ top: 0 });
    headingRef.current?.focus({ preventScroll: true });
  }, [open, stack]);

  const value = useMemo(
    () => ({
      open,
      activeTokenId: open && view?.kind === "token" ? view.id : null,
      openTerm,
      openToken,
    }),
    [open, view, openTerm, openToken]
  );

  const previous = stack[stack.length - 2];

  return (
    <DrawerContext.Provider value={value}>
      {children}
      <Dialog.Root
        open={open}
        onOpenChange={(next) => setOpen(next)}
        onOpenChangeComplete={(next) => {
          if (!next) {
            setStack([]);
          }
        }}
      >
        <Dialog.Portal>
          <Dialog.Backdrop className="drawer-backdrop" />
          <Dialog.Popup className="drawer" aria-label={viewTitle(view)}>
            <div className="drawer-bar">
              {previous ? (
                <button
                  type="button"
                  className="text-btn"
                  onClick={() => setStack((current) => current.slice(0, -1))}
                >
                  <span className="arrow-icon arrow-back" aria-hidden="true" />
                  {viewTitle(previous)}
                </button>
              ) : (
                <p className="kicker">{view?.kind === "token" ? "Ticket" : "Glossary"}</p>
              )}
              <Dialog.Close className="text-btn drawer-close">
                Close
                <span className="close-icon" aria-hidden="true" />
              </Dialog.Close>
            </div>
            <div className="drawer-scroll" ref={scrollRef}>
              {view?.kind === "term" ? <TermCard id={view.id} headingRef={headingRef} /> : null}
              {view?.kind === "token" ? (
                <TokenInspector
                  artifact={ARTIFACTS_BY_ID[view.id]}
                  status={view.status}
                  headingRef={headingRef}
                />
              ) : null}
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </DrawerContext.Provider>
  );
}

function viewTitle(view: View | undefined) {
  if (!view) {
    return undefined;
  }
  return view.kind === "term" ? TERMS_BY_ID[view.id]?.title : ARTIFACTS_BY_ID[view.id]?.label;
}

function TermCard({
  id,
  headingRef,
}: {
  id: string;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  const term = TERMS_BY_ID[id];
  if (!term) {
    return null;
  }
  return (
    <article>
      <header className="drawer-head">
        <Dialog.Title ref={headingRef} tabIndex={-1} render={<h2 />}>
          {term.title}
        </Dialog.Title>
        {term.alsoCalled ? (
          <Dialog.Description className="lede" render={<p />}>
            Also called {term.alsoCalled}.
          </Dialog.Description>
        ) : null}
      </header>
      <section className="drawer-section">
        <h3 className="kicker">What it is</h3>
        <p>
          <RichText text={term.what} />
        </p>
      </section>
      <section className="drawer-section">
        <h3 className="kicker">Why it exists</h3>
        <p>
          <RichText text={term.why} />
        </p>
      </section>
      <section className="drawer-section">
        <h3 className="kicker">Common mix-up</h3>
        <p>
          <RichText text={term.mixUp} />
        </p>
      </section>
    </article>
  );
}
