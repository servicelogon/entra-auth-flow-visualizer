"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ARTIFACTS_BY_ID, artifactStatusLabel } from "@/lib/tokens";
import type { StageItem } from "@/lib/stage";
import { cn } from "@/lib/utils";

export function TokenChip({
  item,
  selected,
  onSelect,
}: {
  item: StageItem;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const artifact = ARTIFACTS_BY_ID[item.id];
  const reduceMotion = useReducedMotion() === true;
  const faded = item.status !== "live";
  const darkText = artifact.color === "#f9a825";

  return (
    <motion.button
      type="button"
      layoutId={reduceMotion ? undefined : `token-${item.id}`}
      layout={!reduceMotion}
      onClick={() => onSelect(item.id)}
      title={`${artifact.label} · ${artifactStatusLabel(item.status)}`}
      aria-pressed={selected}
      className={cn(
        "rounded-full px-2 py-0.5 text-[11px] font-medium shadow-sm",
        faded && "line-through",
        selected && "ring-2 ring-offset-1 ring-magenta",
        item.changed && item.status === "live" && "ring-2 ring-white/80"
      )}
      style={{
        backgroundColor: artifact.color,
        color: darkText ? "#191919" : "#ffffff",
      }}
      initial={reduceMotion ? false : { scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: faded ? 0.45 : 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
    >
      {artifact.shortLabel}
    </motion.button>
  );
}
