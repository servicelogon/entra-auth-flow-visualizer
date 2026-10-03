"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import { SCENARIOS } from "@/lib/flow-scenarios";
import { ARTIFACTS_BY_ID } from "@/lib/tokens";
import type { ArtifactStatus, FlowStep } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { FlowCanvas } from "@/components/flow-canvas";
import { RichText } from "@/components/term-link";
import { TokenInspector } from "@/components/token-inspector";
import { TokenTray, type TrayItem } from "@/components/token-tray";
import { cn } from "@/lib/utils";

export function FlowLab() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const [stepIndex, setStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const scenario = SCENARIOS.find((item) => item.id === scenarioId) ?? SCENARIOS[0];
  const step: FlowStep | null = stepIndex >= 0 ? scenario.steps[stepIndex] : null;
  const idle = stepIndex < 0;

  const tray = useMemo(
    () => computeTray(scenario.startingArtifacts, scenario.steps, stepIndex),
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
    }, 2200);
    return () => window.clearTimeout(timer);
  }, [playing, stepIndex, scenario.steps.length]);

  const selected = selectedId ? ARTIFACTS_BY_ID[selectedId] : undefined;
  const selectedStatus = tray.find((item) => item.id === selectedId)?.status ?? "live";

  function reset(nextScenario = scenarioId) {
    setScenarioId(nextScenario);
    setStepIndex(-1);
    setPlaying(false);
    setSelectedId(null);
  }

  return (
    <section id="lab" className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {SCENARIOS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => reset(item.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition-colors",
              item.id === scenarioId
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-white hover:border-foreground/30"
            )}
          >
            {item.title}
          </button>
        ))}
      </div>

      <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
        {scenario.summary}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="lg"
          className="rounded-full px-4"
          onClick={() => {
            if (idle || stepIndex >= scenario.steps.length - 1) {
              setStepIndex(0);
              setPlaying(true);
              return;
            }
            setPlaying((value) => !value);
          }}
        >
          {playing ? <Pause /> : <Play />}
          {idle ? "Play" : playing ? "Pause" : "Resume"}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="rounded-full"
          disabled={stepIndex < 0}
          onClick={() => {
            setPlaying(false);
            setStepIndex((current) => Math.max(-1, current - 1));
          }}
        >
          <ChevronLeft />
          Back
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="rounded-full"
          disabled={stepIndex >= scenario.steps.length - 1}
          onClick={() => {
            setPlaying(false);
            setStepIndex((current) =>
              current < 0 ? 0 : Math.min(scenario.steps.length - 1, current + 1)
            );
          }}
        >
          Next
          <ChevronRight />
        </Button>
        <Button
          variant="ghost"
          size="lg"
          className="rounded-full"
          onClick={() => reset()}
        >
          <RotateCcw />
          Restart
        </Button>
        <p className="text-sm text-muted-foreground">
          {idle
            ? "Ready"
            : `Step ${stepIndex + 1} of ${scenario.steps.length}`}
        </p>
      </div>

      <FlowCanvas step={step} idle={idle} />

      <div
        className={cn(
          "sticky bottom-3 z-30 rounded-2xl border p-4 shadow-lg sm:static sm:shadow-none",
          step?.failed
            ? "border-destructive/30 bg-[#fef3f2]"
            : "border-border bg-white/95 backdrop-blur-md"
        )}
      >
        {idle || !step ? (
          <div>
            <p className="font-semibold tracking-tight">Waiting to start</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Press Play to watch Alex sign in to Contoso. Highlighted words open
              a definition.
            </p>
          </div>
        ) : (
          <div>
            <p className="text-[11px] font-medium tracking-[0.14em] text-magenta uppercase">
              {step.failed ? "This step failed" : "What just happened"}
            </p>
            <h3 className="mt-1 text-lg font-semibold tracking-tight">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-6">
              <RichText text={step.explanation} />
            </p>
          </div>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div>
          <h3 className="mb-3 font-semibold tracking-tight">Token tray</h3>
          <TokenTray
            items={tray}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
        {selected ? (
          <TokenInspector artifact={selected} status={selectedStatus} />
        ) : (
          <div className="rounded-2xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground lg:flex lg:items-center lg:justify-center">
            Select a ticket to see lifetime, audience, and sample claims.
          </div>
        )}
      </div>
    </section>
  );
}

function computeTray(
  starting: string[],
  steps: FlowStep[],
  stepIndex: number
): TrayItem[] {
  const map = new Map<string, ArtifactStatus>();
  for (const id of starting) {
    map.set(id, "live");
  }
  const applied = stepIndex < 0 ? [] : steps.slice(0, stepIndex + 1);
  for (const step of applied) {
    for (const event of step.artifacts) {
      if (event.action === "add" || event.action === "replace") {
        map.set(event.artifactId, "live");
      } else if (event.action === "remove") {
        map.set(event.artifactId, "consumed");
      } else if (event.action === "expire") {
        map.set(event.artifactId, "expired");
      }
    }
  }
  return Array.from(map.entries()).map(([id, status]) => ({ id, status }));
}
