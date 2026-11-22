"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useDrawer } from "@/components/glossary-provider";
import { ARTIFACTS_BY_ID, artifactStatusLabel } from "@/lib/tokens";
import type { StageItem } from "@/lib/stage";
import { cx } from "@/lib/utils";

export function TokenChip({ item }: { item: StageItem }) {
  const artifact = ARTIFACTS_BY_ID[item.id];
  const reduceMotion = useReducedMotion() === true;
  const { openToken, activeTokenId } = useDrawer();
  const spent = item.status !== "live";
  const status = artifactStatusLabel(item.status);

  return (
    <motion.button
      type="button"
      layout={reduceMotion ? false : "position"}
      onClick={() => openToken(item.id, item.status)}
      aria-haspopup="dialog"
      aria-label={`${artifact.label}, ${status.toLowerCase()}. Inspect`}
      className={cx(
        "ticket",
        spent && "is-spent",
        item.changed && !spent && "is-new",
        activeTokenId === item.id && "is-selected"
      )}
      style={{ "--dot": artifact.color } as React.CSSProperties}
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 0.7, 0.2, 1] }}
    >
      {artifact.shortLabel}
    </motion.button>
  );
}
