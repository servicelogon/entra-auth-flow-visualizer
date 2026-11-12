"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentType,
} from "react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import {
  AppWindow,
  Database,
  Globe,
  Shield,
  User,
} from "lucide-react";
import { ACTORS } from "@/lib/flow-scenarios";
import type { StageItem } from "@/lib/stage";
import type { ActorId, FlowStep, PacketKind } from "@/lib/types";
import { TokenChip } from "@/components/token-chip";
import { cn } from "@/lib/utils";

const ICONS: Record<ActorId, ComponentType<{ className?: string }>> = {
  user: User,
  browser: Globe,
  app: AppWindow,
  entra: Shield,
  api: Database,
};

const PACKET_STYLES: Record<PacketKind, string> = {
  request: "bg-[#191919] text-white",
  credential: "bg-[#6a1b9a] text-white",
  code: "bg-[#7c4dff] text-white",
  token: "bg-magenta text-white",
  cookie: "bg-[#1565c0] text-white",
  api: "bg-[#00897b] text-white",
  error: "bg-destructive text-white",
};

type Point = { x: number; y: number };

export function FlowCanvas({
  step,
  items,
  selectedId,
  onSelect,
}: {
  step: FlowStep | null;
  items: StageItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const reduceMotion = useReducedMotion() === true;
  const rootRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [points, setPoints] = useState<Point[]>([]);

  const measure = useCallback(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }
    const rootBox = root.getBoundingClientRect();
    setPoints(
      ACTORS.map((_, index) => {
        const el = iconRefs.current[index];
        if (!el) {
          return { x: 0, y: 0 };
        }
        const box = el.getBoundingClientRect();
        return {
          x: box.left + box.width / 2 - rootBox.left,
          y: box.top + box.height / 2 - rootBox.top,
        };
      })
    );
  }, []);

  useLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, step?.id, items]);

  const fromIndex = step ? actorIndex(step.from) : -1;
  const toIndex = step ? actorIndex(step.to) : -1;
  const vertical =
    points.length >= 2 && Math.abs(points[0].x - points[1].x) < 24;
  const packetShift = vertical ? 88 : 0;
  const fromPoint = fromIndex >= 0 ? points[fromIndex] : undefined;
  const toPoint = toIndex >= 0 ? points[toIndex] : undefined;
  const packetFrom = fromPoint
    ? { x: fromPoint.x + packetShift, y: fromPoint.y }
    : undefined;
  const packetTo = toPoint
    ? { x: toPoint.x + packetShift, y: toPoint.y }
    : undefined;
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  return (
    <LayoutGroup>
      <div
        ref={rootRef}
        className="relative overflow-hidden rounded-3xl border border-border bg-[linear-gradient(180deg,#fff_0%,#f7f7f8_100%)]"
      >
        {firstPoint && lastPoint ? (
          <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
            <line
              x1={firstPoint.x}
              y1={firstPoint.y}
              x2={lastPoint.x}
              y2={lastPoint.y}
              className="stroke-border"
              strokeWidth="2"
            />
            {fromPoint && toPoint ? (
              <line
                x1={fromPoint.x}
                y1={fromPoint.y}
                x2={toPoint.x}
                y2={toPoint.y}
                className={step?.failed ? "stroke-destructive/50" : "stroke-magenta/45"}
                strokeWidth="3"
                strokeLinecap="round"
              />
            ) : null}
          </svg>
        ) : null}

        <div className="relative grid gap-1 p-3 sm:p-4 md:grid-cols-5 md:gap-3 md:p-6">
          {ACTORS.map((actor, index) => {
            const Icon = ICONS[actor.id];
            const active = step?.highlightActors.includes(actor.id) ?? false;
            const held = items.filter((item) => item.holder === actor.id);
            return (
              <div
                key={actor.id}
                className="flex items-center gap-3 rounded-2xl px-2 py-2 md:flex-col md:items-center md:gap-2 md:px-1 md:py-0"
              >
                <div
                  ref={(node) => {
                    iconRefs.current[index] = node;
                  }}
                  title={actor.subtitle}
                  className={cn(
                    "relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border bg-white shadow-sm transition-colors md:size-14",
                    active
                      ? "border-magenta bg-magenta-soft text-magenta"
                      : "border-border text-foreground"
                  )}
                >
                  <Icon className="size-5 md:size-6" />
                </div>
                <div className="min-w-0 flex-1 md:flex md:w-full md:flex-col md:items-center">
                  <p className="font-semibold tracking-tight">{actor.label}</p>
                  <div className="mt-1.5 flex min-h-7 flex-wrap content-start gap-1 md:justify-center">
                    {held.map((item) => (
                      <TokenChip
                        key={item.id}
                        item={item}
                        selected={selectedId === item.id}
                        onSelect={onSelect}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {step && packetFrom && packetTo ? (
          <motion.div
            key={step.id}
            initial={
              reduceMotion
                ? { x: packetTo.x, y: packetTo.y, opacity: 1 }
                : { x: packetFrom.x, y: packetFrom.y, opacity: 0 }
            }
            animate={{ x: packetTo.x, y: packetTo.y, opacity: 1 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.75, ease: [0.22, 1, 0.36, 1] }
            }
            className="pointer-events-none absolute top-0 left-0 z-20 -translate-x-1/2 -translate-y-1/2"
          >
            <div
              className={cn(
                "max-w-[11rem] rounded-full px-3 py-1.5 text-center text-[11px] leading-4 font-medium whitespace-normal shadow-lg",
                PACKET_STYLES[step.packetKind]
              )}
            >
              {step.packet}
            </div>
          </motion.div>
        ) : null}
      </div>
    </LayoutGroup>
  );
}

function actorIndex(id: ActorId) {
  return ACTORS.findIndex((actor) => actor.id === id);
}
