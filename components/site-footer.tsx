"use client";

import { useEffect, useRef } from "react";
import { NavLinks } from "@/components/site-header";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-mark">
        <FooterWire />
      </div>
      <div className="footer-base">
        <div className="footer-base-inner">
          <div>
            <p className="footer-name">New Frontier Security</p>
            <p className="footer-note">Simulated flows only. No real tokens leave this page.</p>
          </div>
          <nav className="footer-nav" aria-label="Footer">
            <NavLinks />
          </nav>
        </div>
      </div>
    </footer>
  );
}

type Vec = [number, number, number];
type Wire = { verts: Vec[]; edges: [number, number][] };

// The lab's token as a low-poly solid: a thin ticket notched at both ends,
// perforated into header . payload . signature, with three claim lines on the
// payload. Built flat in the x/y plane, then fitted to the unit sphere.
function buildToken(): Wire {
  const verts: Vec[] = [];
  const edges: [number, number][] = [];
  const v = (x: number, y: number, z: number) => verts.push([x, y, z]) - 1;
  const e = (a: number, b: number) => edges.push([a, b]);

  const HW = 0.8; // half width
  const HH = 0.44; // half height
  const T = 0.06; // half thickness
  const NR = 0.15; // notch radius
  const NS = 5; // facets per notch

  // Outline, clockwise from the top-left corner, with a notch bitten into each end.
  const outline: [number, number][] = [[-HW, HH], [HW, HH]];
  for (let k = 0; k <= NS; k++) {
    const a = Math.PI / 2 + (k * Math.PI) / NS;
    outline.push([HW + NR * Math.cos(a), NR * Math.sin(a)]);
  }
  outline.push([HW, -HH], [-HW, -HH]);
  for (let k = 0; k <= NS; k++) {
    const a = -Math.PI / 2 + (k * Math.PI) / NS;
    outline.push([-HW + NR * Math.cos(a), NR * Math.sin(a)]);
  }
  const front = outline.map(([x, y]) => v(x, y, T));
  const back = outline.map(([x, y]) => v(x, y, -T));
  outline.forEach((_, k) => {
    e(front[k], front[(k + 1) % outline.length]);
    e(back[k], back[(k + 1) % outline.length]);
  });
  // Side walls at the corners and the mouths of the notches.
  for (const k of [0, 1, 2, 2 + NS, 3 + NS, 4 + NS, 5 + NS, 5 + 2 * NS]) {
    e(front[k], back[k]);
  }

  // Two perforations on the face: header . payload . signature.
  const dashes = 6;
  const margin = 0.06;
  const step = (2 * (HH - margin)) / dashes;
  for (const x of [-0.3, 0.3]) {
    for (let k = 0; k < dashes; k++) {
      const y = HH - margin - k * step - step * 0.2;
      e(v(x, y, T), v(x, y - step * 0.6, T));
    }
  }
  // Claim lines on the payload.
  for (const [y, length] of [[0.16, 0.42], [0, 0.3], [-0.16, 0.36]]) {
    e(v(-0.21, y, T), v(-0.21 + length, y, T));
  }

  const reach = Math.max(...verts.map(([x, y, z]) => Math.hypot(x, y, z)));
  return { verts: verts.map(([x, y, z]) => [x / reach, y / reach, z / reach]), edges };
}

const TOKEN = buildToken();
// Lean the top toward the viewer, then roll it onto a shallow diagonal, as the
// key is drawn on the Passkey AAGUID Lookup.
const LEAN = 0.32;
const ROLL = 0.3;
const SPEED = 0.00018; // radians per millisecond, as on the NFS site
const STILL = 0.4;

// The footer mark: a hairline wireframe that turns slowly, drawn the same way
// as the icosahedron on newfrontiersecurity.net (1px strokes, back edges faint,
// one slow turn). On this tool the solid is a token. A still frame when motion
// is reduced, and nothing at all where canvas is missing.
function FooterWire() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const [cl, sl, cr, sr] = [Math.cos(LEAN), Math.sin(LEAN), Math.cos(ROLL), Math.sin(ROLL)];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let running = false;

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth || 168;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = canvas.width;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    // Turn about the vertical axis, lean toward the viewer, then roll.
    const project = ([x, y, z]: Vec, yaw: number) => {
      const x1 = x * Math.cos(yaw) + z * Math.sin(yaw);
      const z1 = -x * Math.sin(yaw) + z * Math.cos(yaw);
      const y2 = y * cl - z1 * sl;
      const z2 = y * sl + z1 * cl;
      return { x: x1 * cr - y2 * sr, y: x1 * sr + y2 * cr, z: z2 };
    };
    const draw = (yaw: number) => {
      const w = canvas.clientWidth || 168;
      const r = w * 0.44;
      ctx.clearRect(0, 0, w, w);
      ctx.lineWidth = 1;
      ctx.strokeStyle = getComputedStyle(canvas).color;
      const lines = TOKEN.edges
        .map(([a, b]) => {
          const s = project(TOKEN.verts[a], yaw);
          const e = project(TOKEN.verts[b], yaw);
          return { s, e, d: (s.z + e.z) / 2 };
        })
        .sort((p, q) => p.d - q.d);
      for (const line of lines) {
        ctx.globalAlpha = line.d < 0 ? 0.28 : 0.9;
        ctx.beginPath();
        ctx.moveTo(w / 2 + line.s.x * r, w / 2 - line.s.y * r);
        ctx.lineTo(w / 2 + line.e.x * r, w / 2 - line.e.y * r);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };
    const tick = (now: number) => {
      draw(now * SPEED);
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running || reduce.matches) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
      draw(STILL);
    };

    size();
    draw(STILL);
    const resize = new ResizeObserver(() => {
      size();
      if (!running) draw(STILL);
    });
    resize.observe(canvas);
    const visible = new IntersectionObserver(([entry]) =>
      entry.isIntersecting ? start() : stop()
    );
    visible.observe(canvas);
    const onMotion = () => (reduce.matches ? stop() : start());
    reduce.addEventListener("change", onMotion);
    return () => {
      stop();
      resize.disconnect();
      visible.disconnect();
      reduce.removeEventListener("change", onMotion);
    };
  }, []);

  return <canvas ref={ref} className="footer-wire" width={180} height={180} aria-hidden="true" />;
}
