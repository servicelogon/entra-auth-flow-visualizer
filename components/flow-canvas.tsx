"use client";

import { motion } from "framer-motion";
import { ACTORS } from "@/lib/flow-scenarios";
import type { ActorId, FlowStep, PacketKind } from "@/lib/types";
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

export function FlowCanvas({
  step,
  idle,
}: {
  step: FlowStep | null;
  idle: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-[linear-gradient(180deg,#fff_0%,#fafafa_100%)]">
      <div className="pointer-events-none absolute inset-x-8 top-[4.75rem] hidden h-px bg-border md:block" />
      <div className="pointer-events-none absolute top-8 bottom-8 left-[1.35rem] w-px bg-border md:hidden" />

      <div className="grid gap-6 p-4 md:grid-cols-5 md:gap-3 md:p-6">
        {ACTORS.map((actor, index) => {
          const active = step?.highlightActors.includes(actor.id) ?? false;
          return (
            <div key={actor.id} className="relative pl-8 md:pl-0">
              <span className="absolute top-5 left-0 size-2.5 rounded-full border-2 border-white bg-border shadow md:hidden" />
              <div
                className={cn(
                  "rounded-2xl border px-3 py-3 transition-all",
                  active
                    ? "border-magenta bg-magenta-soft shadow-[0_0_0_3px_rgba(216,27,96,0.12)]"
                    : "border-border bg-white"
                )}
              >
                <p className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-1 font-semibold tracking-tight">{actor.label}</p>
                <p className="text-xs text-muted-foreground">{actor.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative h-16 border-t border-border bg-white md:h-20">
        {idle || !step ? (
          <p className="flex h-full items-center justify-center px-4 text-center text-sm text-muted-foreground">
            Press Play to watch the tickets move.
          </p>
        ) : (
          <PacketTrack step={step} />
        )}
      </div>
    </div>
  );
}

function PacketTrack({ step }: { step: FlowStep }) {
  const fromIndex = actorIndex(step.from);
  const toIndex = actorIndex(step.to);

  return (
    <>
      <div className="hidden h-full md:block">
        <motion.div
          key={`${step.id}-desktop`}
          initial={{ left: `${lane(fromIndex)}%`, opacity: 0, y: 8 }}
          animate={{ left: `${lane(toIndex)}%`, opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <PacketChip step={step} />
        </motion.div>
      </div>
      <div className="flex h-full items-center justify-center px-3 md:hidden">
        <motion.div
          key={`${step.id}-mobile`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-full"
        >
          <PacketChip step={step} />
        </motion.div>
      </div>
    </>
  );
}

function PacketChip({ step }: { step: FlowStep }) {
  return (
    <div
      className={cn(
        "max-w-[16rem] truncate rounded-full px-3 py-1.5 text-xs font-medium shadow-lg",
        PACKET_STYLES[step.packetKind]
      )}
    >
      {step.from} → {step.to}: {step.packet}
    </div>
  );
}

function actorIndex(id: ActorId) {
  return ACTORS.findIndex((actor) => actor.id === id);
}

function lane(index: number) {
  return ((index + 0.5) / ACTORS.length) * 100;
}
