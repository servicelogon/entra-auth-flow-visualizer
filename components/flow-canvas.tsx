"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ACTORS } from "@/lib/flow-scenarios";
import type { Actor, ActorId, FlowStep, PacketKind } from "@/lib/types";
import { cn } from "@/lib/utils";

const PACKET_STYLES: Record<PacketKind, string> = {
  request: "bg-[#191919] text-white",
  credential: "bg-[#6a1b9a] text-white",
  code: "bg-[#7c4dff] text-white",
  token: "bg-magenta text-white",
  cookie: "bg-[#1565c0] text-white",
  api: "bg-[#00897b] text-white",
  error: "bg-destructive text-white",
};

const LEGEND: { kind: PacketKind; label: string }[] = [
  { kind: "request", label: "Request" },
  { kind: "credential", label: "Credential" },
  { kind: "code", label: "Code" },
  { kind: "token", label: "Token" },
  { kind: "cookie", label: "Cookie" },
  { kind: "api", label: "API" },
  { kind: "error", label: "Error" },
];

export function FlowCanvas({
  step,
  idle,
}: {
  step: FlowStep | null;
  idle: boolean;
}) {
  const reduceMotion = useReducedMotion() === true;

  return (
    <div className="relative rounded-2xl border border-border bg-[linear-gradient(180deg,#fff_0%,#fafafa_100%)]">
      <div className="p-4 md:hidden">
        <ul className="flex flex-wrap gap-x-3 gap-y-1">
          {ACTORS.map((actor) => {
            const active = step?.highlightActors.includes(actor.id) ?? false;
            return (
              <li
                key={actor.id}
                className={cn(
                  "text-sm",
                  active ? "font-semibold text-magenta" : "text-muted-foreground"
                )}
              >
                {actor.label}
              </li>
            );
          })}
        </ul>
        {idle || !step ? null : (
          <div className="mt-4 space-y-2">
            <ActorCard actor={actorById(step.from)} active />
            <div className="flex justify-center px-1">
              <PacketChip step={step} detail="packet" />
            </div>
            <ActorCard actor={actorById(step.to)} active />
          </div>
        )}
      </div>

      <div className="hidden p-6 md:block">
        <div className="grid grid-cols-5 gap-3">
          {ACTORS.map((actor, index) => {
            const active = step?.highlightActors.includes(actor.id) ?? false;
            return (
              <ActorCard
                key={actor.id}
                actor={actor}
                active={active}
                index={index}
              />
            );
          })}
        </div>
        {idle || !step ? (
          <div className="mt-4 h-16" />
        ) : (
          <DesktopHop step={step} reduceMotion={reduceMotion} />
        )}
      </div>

      <ul className="flex flex-wrap gap-x-3 gap-y-1 border-t border-border px-4 py-3 text-xs text-muted-foreground">
        {LEGEND.map((item) => (
          <li key={item.kind} className="flex items-center gap-1.5">
            <span
              className={cn("size-2 rounded-full", PACKET_STYLES[item.kind])}
              aria-hidden
            />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DesktopHop({
  step,
  reduceMotion,
}: {
  step: FlowStep;
  reduceMotion: boolean;
}) {
  const from = actorIndex(step.from);
  const to = actorIndex(step.to);
  const startCol = Math.min(from, to) + 1;
  const span = Math.abs(to - from) + 1;
  const towardRight = to > from;

  return (
    <div className="mt-4 grid grid-cols-5 gap-3">
      <div
        className="relative flex min-h-16 items-center justify-center py-3"
        style={{ gridColumn: `${startCol} / span ${span}` }}
      >
        <div
          className="absolute top-1/2 h-px bg-foreground/25"
          style={{
            left: `calc(50% / ${span})`,
            right: `calc(50% / ${span})`,
          }}
        />
        <span
          className="absolute top-1/2 size-2 rounded-full bg-foreground"
          style={{
            [towardRight ? "right" : "left"]: `calc(50% / ${span})`,
            transform: towardRight
              ? "translate(50%, -50%)"
              : "translate(-50%, -50%)",
          }}
          aria-hidden
        />
        <motion.div
          key={step.id}
          initial={reduceMotion ? false : { x: towardRight ? -72 : 72, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: reduceMotion ? 0 : 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative z-10"
        >
          <PacketChip step={step} detail="route" />
        </motion.div>
      </div>
    </div>
  );
}

function ActorCard({
  actor,
  active,
  index,
}: {
  actor: Actor;
  active: boolean;
  index?: number;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-3 py-3 transition-colors",
        active
          ? "border-magenta bg-magenta-soft shadow-[0_0_0_3px_rgba(216,27,96,0.12)]"
          : "border-border bg-white"
      )}
    >
      {index !== undefined ? (
        <p className="text-[11px] font-medium text-muted-foreground">
          {String(index + 1).padStart(2, "0")}
        </p>
      ) : null}
      <p className={cn("font-semibold tracking-tight", index === undefined && "text-sm")}>
        {actor.label}
      </p>
      <p className="text-xs text-muted-foreground">{actor.subtitle}</p>
    </div>
  );
}

function PacketChip({
  step,
  detail,
}: {
  step: FlowStep;
  detail: "packet" | "route";
}) {
  const label =
    detail === "route"
      ? `${actorLabel(step.from)} → ${actorLabel(step.to)}: ${step.packet}`
      : step.packet;

  return (
    <div
      className={cn(
        "rounded-xl px-3 py-2 text-center text-xs leading-5 font-medium whitespace-normal shadow-lg",
        detail === "route" ? "max-w-[12rem]" : "max-w-full",
        PACKET_STYLES[step.packetKind]
      )}
    >
      {label}
    </div>
  );
}

function actorLabel(id: ActorId) {
  return ACTORS.find((actor) => actor.id === id)?.label ?? id;
}

function actorById(id: ActorId) {
  const actor = ACTORS.find((item) => item.id === id);
  if (!actor) {
    throw new Error(`Unknown actor: ${id}`);
  }
  return actor;
}

function actorIndex(id: ActorId) {
  return ACTORS.findIndex((actor) => actor.id === id);
}
