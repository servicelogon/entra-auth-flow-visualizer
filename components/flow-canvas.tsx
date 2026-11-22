"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentType,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AppWindow, Database, Globe, ShieldCheck, User } from "lucide-react";
import { ACTORS } from "@/lib/flow-scenarios";
import { ARTIFACTS_BY_ID } from "@/lib/tokens";
import type { StageItem } from "@/lib/stage";
import type { ActorId, FlowStep } from "@/lib/types";
import { TokenChip } from "@/components/token-chip";
import { cx } from "@/lib/utils";

const ICONS: Record<ActorId, ComponentType<{ className?: string; "aria-hidden"?: boolean }>> = {
  user: User,
  browser: Globe,
  app: AppWindow,
  entra: ShieldCheck,
  api: Database,
};

type Node = { x: number; y: number; r: number };
type Point = { x: number; y: number };

// Five parties on one wire. On wide screens they stand in a row and the
// packet rides a lane above them; on phones they stack and the wire runs down
// the left edge, with the packet named in the narration instead.
export function FlowCanvas({
  step,
  items,
  reserve,
}: {
  step: FlowStep | null;
  items: StageItem[];
  /** Every ticket each actor holds at some point in the scenario. */
  reserve: Record<ActorId, string[]>;
}) {
  const reduceMotion = useReducedMotion() === true;
  const rootRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [width, setWidth] = useState(0);

  const measure = useCallback(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }
    const rootBox = root.getBoundingClientRect();
    setWidth(Math.round(rootBox.width));
    const next = ACTORS.map((_, index) => {
      const box = nodeRefs.current[index]?.getBoundingClientRect();
      if (!box) {
        return { x: 0, y: 0, r: 0 };
      }
      return {
        x: Math.round(box.left + box.width / 2 - rootBox.left),
        y: Math.round(box.top + box.height / 2 - rootBox.top),
        r: box.width / 2,
      };
    });
    setNodes((current) =>
      current.length === next.length &&
      current.every((node, i) => node.x === next[i].x && node.y === next[i].y && node.r === next[i].r)
        ? current
        : next
    );
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [measure, step?.id, items]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => observer.disconnect();
  }, [measure]);

  const ready = nodes.length === ACTORS.length && nodes.some((node) => node.r > 0);
  const vertical = ready && Math.abs(nodes[0].x - nodes[1].x) < 4;
  const from = step && ready ? nodes[actorIndex(step.from)] : undefined;
  const to = step && ready ? nodes[actorIndex(step.to)] : undefined;
  const failed = Boolean(step?.failed);

  return (
    <div className="stage" ref={rootRef}>
      {ready ? (
        <svg className="stage-wire" aria-hidden="true">
          <line
            className="rail"
            x1={nodes[0].x}
            y1={nodes[0].y}
            x2={nodes[nodes.length - 1].x}
            y2={nodes[nodes.length - 1].y}
          />
          {from && to ? <Route key={step?.id} from={from} to={to} failed={failed} /> : null}
        </svg>
      ) : null}

      <ol className="actors" aria-label="Who holds what">
        {ACTORS.map((actor, index) => {
          const Icon = ICONS[actor.id];
          const active = step?.highlightActors.includes(actor.id) ?? false;
          const held = items.filter((item) => item.holder === actor.id);
          return (
            <li
              key={actor.id}
              className={cx("actor", active && "is-active", active && failed && "is-failed")}
            >
              <div
                className="actor-node"
                ref={(node) => {
                  nodeRefs.current[index] = node;
                }}
              >
                <Icon aria-hidden />
              </div>
              <div className="actor-copy">
                <span className="actor-name">{actor.label}</span>
                <span className="actor-sub">
                  {/* Host names break after the first dot only: login. / microsoftonline.com */}
                  {actor.subtitle.includes(" ")
                    ? actor.subtitle
                    : actor.subtitle.replace(/^([^.]+\.)/, "$1\u200b")}
                </span>
              </div>
              {/* The hidden set keeps room for every ticket this actor will hold,
                  so the stage never changes height while a scenario plays. */}
              <div className="holdings-wrap">
                <ul
                  className="holdings"
                  aria-label={held.length ? `${actor.label} holds` : `${actor.label} holds nothing yet`}
                >
                  {held.map((item) => (
                    <li key={item.id}>
                      <TokenChip item={item} />
                    </li>
                  ))}
                </ul>
                <div className="holdings ghost" aria-hidden="true">
                  {reserve[actor.id].map((id) => (
                    <span key={id} className="ticket">
                      {ARTIFACTS_BY_ID[id]?.shortLabel}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {step && from && to && !vertical ? (
        <motion.div
          key={step.id}
          className={cx("packet", failed && "failed")}
          aria-hidden="true"
          style={{ "--px": `${to.x}px`, "--sw": `${width}px` } as React.CSSProperties}
          initial={
            reduceMotion
              ? { x: to.x, y: lane(to), opacity: 1 }
              : { x: from.x, y: lane(from), opacity: 0 }
          }
          animate={{ x: to.x, y: lane(to), opacity: 1 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.8, ease: [0.22, 0.7, 0.2, 1] }}
        >
          <span className="packet-body">{step.packet}</span>
        </motion.div>
      ) : null}
    </div>
  );
}

// The lane the packet travels in, just above the actors.
function lane(node: Node) {
  return node.y - node.r - 34;
}

function Route({ from, to, failed }: { from: Node; to: Node; failed: boolean }) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy);
  if (length < 1) {
    return null;
  }
  const ux = dx / length;
  const uy = dy / length;
  const start: Point = { x: from.x + ux * (from.r + 6), y: from.y + uy * (from.r + 6) };
  const end: Point = { x: to.x - ux * (to.r + 7), y: to.y - uy * (to.r + 7) };
  const head = 7;
  const spread = 0.55;
  const left: Point = {
    x: end.x - head * (ux * Math.cos(spread) - uy * Math.sin(spread)),
    y: end.y - head * (uy * Math.cos(spread) + ux * Math.sin(spread)),
  };
  const right: Point = {
    x: end.x - head * (ux * Math.cos(spread) + uy * Math.sin(spread)),
    y: end.y - head * (uy * Math.cos(spread) - ux * Math.sin(spread)),
  };

  return (
    <g>
      <line className={cx("route route-line", failed && "failed")} x1={start.x} y1={start.y} x2={end.x} y2={end.y} />
      <polyline
        className={cx("route", failed && "failed")}
        points={`${left.x},${left.y} ${end.x},${end.y} ${right.x},${right.y}`}
      />
    </g>
  );
}

function actorIndex(id: ActorId) {
  return ACTORS.findIndex((actor) => actor.id === id);
}
