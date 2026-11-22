"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { ACTORS, SCENARIOS } from "@/lib/flow-scenarios";
import { computeStage } from "@/lib/stage";
import { ARTIFACTS_BY_ID } from "@/lib/tokens";
import type { ActorId, FlowStep } from "@/lib/types";
import { FlowCanvas } from "@/components/flow-canvas";
import { useDrawer } from "@/components/glossary-provider";
import { RichText } from "@/components/term-link";
import { cx } from "@/lib/utils";

const STEP_MS = 3200;

export function FlowLab() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const [stepIndex, setStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const { open: drawerOpen } = useDrawer();

  const scenarioIndex = Math.max(0, SCENARIOS.findIndex((item) => item.id === scenarioId));
  const scenario = SCENARIOS[scenarioIndex];
  const nextScenario = SCENARIOS[scenarioIndex + 1];
  const total = scenario.steps.length;
  const step: FlowStep | null = stepIndex >= 0 ? scenario.steps[stepIndex] : null;
  const idle = stepIndex < 0;
  const atEnd = stepIndex >= total - 1;

  const reserve = useMemo(() => {
    const held = Object.fromEntries(ACTORS.map((actor) => [actor.id, [] as string[]])) as Record<ActorId, string[]>;
    const ids = [
      ...scenario.startingArtifacts,
      ...scenario.steps.flatMap((item) => item.artifacts.map((event) => event.artifactId)),
    ];
    for (const id of ids) {
      const artifact = ARTIFACTS_BY_ID[id];
      if (artifact && !held[artifact.heldBy].includes(id)) {
        held[artifact.heldBy].push(id);
      }
    }
    return held;
  }, [scenario]);

  const items = useMemo(
    () => computeStage(scenario.startingArtifacts, scenario.steps, stepIndex),
    [scenario, stepIndex]
  );

  // Autoplay: one step every few seconds, stopping on the last one. It holds
  // while a definition or ticket is open, and carries on once it is closed.
  const running = playing && !drawerOpen && stepIndex < total - 1;
  useEffect(() => {
    if (!running) {
      return;
    }
    const timer = window.setTimeout(() => {
      const next = Math.min(stepIndex + 1, total - 1);
      setStepIndex(next);
      if (next >= total - 1) {
        setPlaying(false);
      }
    }, STEP_MS);
    return () => window.clearTimeout(timer);
  }, [running, stepIndex, total]);

  const goTo = useCallback(
    (index: number) => {
      setPlaying(false);
      setStepIndex(Math.max(-1, Math.min(index, total - 1)));
    },
    [total]
  );

  const stepBy = useCallback(
    (delta: number) => {
      setPlaying(false);
      setStepIndex((current) => Math.max(-1, Math.min(current + delta, total - 1)));
    },
    [total]
  );

  const togglePlay = useCallback(() => {
    if (idle || atEnd) {
      setStepIndex(0);
      setPlaying(true);
      return;
    }
    setPlaying((value) => !value);
  }, [idle, atEnd]);

  const chooseScenario = useCallback((id: string) => {
    setScenarioId(id);
    setStepIndex(-1);
    setPlaying(false);
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (
        drawerOpen ||
        document.documentElement.classList.contains("nav-open") ||
        event.altKey ||
        event.metaKey ||
        event.ctrlKey ||
        isTypingTarget(event.target)
      ) {
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        stepBy(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        stepBy(-1);
      } else if (event.key === " " && !isControlTarget(event.target)) {
        event.preventDefault();
        togglePlay();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen, stepBy, togglePlay]);

  const playLabel = playing ? "Pause" : atEnd ? "Replay" : "Play";

  return (
    <section className="lab" aria-labelledby="lab-title">
      <header className="step-head">
        <p className="kicker">Lab</p>
        <h2 id="lab-title">How a Microsoft sign-in works</h2>
        <p className="lede">
          Pick a scenario and press Play. Underlined words open a definition. Select a
          ticket on the stage to see what is inside it.
        </p>
      </header>

      <div className="scenarios">
        <ul className="scenario-tabs" aria-label="Scenarios">
          {SCENARIOS.map((item, index) => (
            <li key={item.id}>
              <button
                type="button"
                aria-pressed={item.id === scenarioId}
                onClick={() => chooseScenario(item.id)}
              >
                <span className="tab-num" aria-hidden="true">
                  0{index + 1}
                </span>
                {item.title}
              </button>
            </li>
          ))}
        </ul>
        <label className="scenario-select">
          <span className="kicker">Scenario</span>
          <select
            className="select"
            value={scenarioId}
            onChange={(event) => chooseScenario(event.target.value)}
          >
            {SCENARIOS.map((item, index) => (
              <option key={item.id} value={item.id}>
                {`0${index + 1}  ${item.title}`}
              </option>
            ))}
          </select>
        </label>
      </div>

      <FlowCanvas step={step} items={items} reserve={reserve} />

      <div className="transport" role="group" aria-label="Playback">
        <div className="transport-buttons">
          <button type="button" className="t-btn" disabled={idle} onClick={() => stepBy(-1)}>
            <span className="arrow-icon arrow-back" aria-hidden="true" />
            Back
          </button>
          <button type="button" className="t-btn primary" onClick={togglePlay}>
            <span className={playing ? "pause-icon" : "play-icon"} aria-hidden="true" />
            {/* Every label sits in one cell, so the button never changes width. */}
            <span className="label-stack">
              {["Play", "Pause", "Replay"].map((label) => (
                <span key={label} data-hidden={label === playLabel ? undefined : ""}>
                  {label}
                </span>
              ))}
            </span>
          </button>
          <button type="button" className="t-btn" disabled={atEnd} onClick={() => stepBy(1)}>
            Next
            <span className="arrow-icon" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="t-btn quiet"
            disabled={idle}
            onClick={() => goTo(-1)}
            aria-label="Restart scenario"
          >
            <RotateCcw className="restart-icon" aria-hidden />
            <span className="t-label">Restart</span>
          </button>
        </div>
        <div className="progress">
          <ol className="progress-track" aria-label="Steps">
            {scenario.steps.map((item, index) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={cx(
                    "seg",
                    index < stepIndex && "done",
                    index === stepIndex && "current",
                    item.failed && "failed"
                  )}
                  aria-label={`Step ${index + 1}: ${item.title}`}
                  aria-current={index === stepIndex ? "step" : undefined}
                  onClick={() => goTo(index)}
                />
              </li>
            ))}
          </ol>
          <span className="step-count" aria-hidden="true">
            <b>{pad(Math.max(stepIndex + 1, 0))}</b> / {pad(total)}
          </span>
        </div>
      </div>

      <div
        className={cx("narration", step?.failed && "failed")}
        aria-live="polite"
        aria-atomic="true"
      >
        {step ? (
          <div className="narration-body" key={`${scenario.id}-${step.id}`}>
            <div className="narration-meta">
              <p className="kicker">
                Step {pad(stepIndex + 1)} of {pad(total)}
                {step.failed ? " · Rejected" : ""}
              </p>
              <p className="route">
                <span>{actorLabel(step.from)}</span>
                <span className="route-arrow" aria-label="to">
                  →
                </span>
                <span>{actorLabel(step.to)}</span>
                <span className="route-packet">{step.packet}</span>
              </p>
            </div>
            <h3>{step.title}</h3>
            <p className="narration-text">
              <RichText text={step.explanation} />
            </p>
            {atEnd && !playing && nextScenario ? (
              <div className="narration-next">
                <button
                  type="button"
                  className="t-btn"
                  onClick={() => chooseScenario(nextScenario.id)}
                >
                  Next scenario: {nextScenario.title}
                  <span className="arrow-icon" aria-hidden="true" />
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="narration-body" key={`${scenario.id}-ready`}>
            <div className="narration-meta">
              <p className="kicker">
                Ready · {total} steps
              </p>
            </div>
            <h3>{scenario.title}</h3>
            <p className="narration-text">{scenario.summary}</p>
            <p className="key-hint">
              <kbd>←</kbd>
              <kbd>→</kbd> step through · <kbd>Space</kbd> play or pause
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function actorLabel(id: ActorId) {
  return ACTORS.find((actor) => actor.id === id)?.label ?? id;
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
