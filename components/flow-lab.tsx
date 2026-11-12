"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import { SCENARIOS } from "@/lib/flow-scenarios";
import { computeStage } from "@/lib/stage";
import { ARTIFACTS_BY_ID } from "@/lib/tokens";
import type { FlowStep } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { FlowCanvas } from "@/components/flow-canvas";
import { RichText } from "@/components/term-link";
import { TokenInspector } from "@/components/token-inspector";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function FlowLab() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const [stepIndex, setStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const scenario = SCENARIOS.find((item) => item.id === scenarioId) ?? SCENARIOS[0];
  const step: FlowStep | null = stepIndex >= 0 ? scenario.steps[stepIndex] : null;
  const idle = stepIndex < 0;
  const atEnd = stepIndex >= scenario.steps.length - 1 && stepIndex >= 0;

  const items = useMemo(
    () => computeStage(scenario.startingArtifacts, scenario.steps, stepIndex),
    [scenario, stepIndex]
  );

  useEffect(() => {
    if (!playing || stepIndex >= scenario.steps.length - 1) {
      return;
    }
    const last = scenario.steps.length - 1;
    const timer = window.setTimeout(() => {
      const next = Math.min(stepIndex + 1, last);
      setStepIndex(next);
      if (next >= last) {
        setPlaying(false);
      }
    }, 2400);
    return () => window.clearTimeout(timer);
  }, [playing, stepIndex, scenario.steps.length]);

  const stepBy = useCallback((delta: number) => {
    setPlaying(false);
    setStepIndex((current) => {
      if (delta > 0) {
        if (current >= scenario.steps.length - 1) {
          return current;
        }
        return current < 0 ? 0 : current + 1;
      }
      return Math.max(-1, current - 1);
    });
  }, [scenario.steps.length]);

  const togglePlay = useCallback(() => {
    if (idle || atEnd) {
      setStepIndex(0);
      setPlaying(true);
      return;
    }
    setPlaying((value) => !value);
  }, [idle, atEnd]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (isTypingTarget(event.target) || event.altKey || event.metaKey || event.ctrlKey) {
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        stepBy(1);
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        stepBy(-1);
        return;
      }
      if (event.key === " " && !isControlTarget(event.target)) {
        event.preventDefault();
        togglePlay();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stepBy, togglePlay]);

  const selected = selectedId ? ARTIFACTS_BY_ID[selectedId] : undefined;
  const selectedStatus = items.find((item) => item.id === selectedId)?.status ?? "live";
  const playLabel = playing ? "Pause" : idle ? "Play" : atEnd ? "Replay" : "Resume";

  function reset(nextScenario = scenarioId) {
    setScenarioId(nextScenario);
    setStepIndex(-1);
    setPlaying(false);
    setSelectedId(null);
  }

  return (
    <section id="lab" className="space-y-4">
      <div
        className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="group"
        aria-label="Scenarios"
      >
        {SCENARIOS.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={item.id === scenarioId}
            onClick={() => reset(item.id)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-sm transition-colors",
              item.id === scenarioId
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-white hover:border-foreground/30"
            )}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Playback">
        <Button className="rounded-full px-4" onClick={togglePlay}>
          {playing ? <Pause /> : <Play />}
          {playLabel}
        </Button>
        <Button
          variant="outline"
          className="rounded-full"
          disabled={stepIndex < 0}
          onClick={() => stepBy(-1)}
        >
          <ChevronLeft />
          Back
        </Button>
        <Button
          variant="outline"
          className="rounded-full"
          disabled={atEnd}
          onClick={() => stepBy(1)}
        >
          Next
          <ChevronRight />
        </Button>
        <Button
          variant="ghost"
          size="icon-lg"
          className="rounded-full"
          aria-label="Restart"
          onClick={() => reset()}
        >
          <RotateCcw />
        </Button>
        <p className="text-sm text-muted-foreground tabular-nums">
          {idle ? "Ready" : `${stepIndex + 1} / ${scenario.steps.length}`}
        </p>
      </div>

      <FlowCanvas
        step={step}
        items={items}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      <div
        className={cn(
          "rounded-2xl border p-4 pb-[max(1rem,env(safe-area-inset-bottom))]",
          step?.failed ? "border-destructive/30 bg-[#fef3f2]" : "border-border bg-white"
        )}
        aria-live="polite"
        aria-atomic="true"
      >
        {idle || !step ? (
          <p className="text-sm leading-6 text-muted-foreground">
            Play to watch Alex sign in.
          </p>
        ) : (
          <div>
            <h3 className="text-base font-semibold tracking-tight">{step.title}</h3>
            <p className="mt-1.5 text-sm leading-6">
              <RichText text={step.explanation} />
            </p>
          </div>
        )}
      </div>

      <Sheet
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedId(null);
          }
        }}
      >
        <SheetContent side="right" className="w-full! max-w-none! sm:max-w-md!">
          {selected ? (
            <>
              <SheetHeader className="sr-only">
                <SheetTitle>{selected.label}</SheetTitle>
              </SheetHeader>
              <div className="overflow-y-auto px-4 pb-6">
                <TokenInspector
                  artifact={selected}
                  status={selectedStatus}
                  embedded
                />
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </section>
  );
}

function isTypingTarget(target: EventTarget | null) {
  return target instanceof HTMLElement
    ? Boolean(target.closest("input, textarea, select, [contenteditable='true']"))
    : false;
}

function isControlTarget(target: EventTarget | null) {
  return target instanceof HTMLElement
    ? Boolean(target.closest("button, a, input, textarea, select, [contenteditable='true']"))
    : false;
}
