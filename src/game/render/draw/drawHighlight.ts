import * as PIXI from "pixi.js";
import type { AABB } from "../../engine/aabb";
import { padAABB } from "../../engine/aabb";
import { setDepth } from "../../pixi/depthSort";

export type HighlightHandle = {
  projectId: string;
  g: PIXI.Graphics;
  base: AABB;
  pad: number;
  phase: number;
  setVisible: (v: boolean) => void;
  destroy: () => void;
};

function poisonColor(t: number) {
  const r = Math.floor(0 + (204 - 0) * t);
  const g = 255;
  const b = Math.floor(136 + (0 - 136) * t);
  return (r << 16) + (g << 8) + b;
}

export function createHighlight(
  container: PIXI.Container,
  projectId: string,
  target: AABB,
  opts?: { pad?: number; depthKey?: string }
): HighlightHandle {
  const g = new PIXI.Graphics();
  const pad = opts?.pad ?? 0;

  setDepth(g as any, (opts?.depthKey ?? "decor") as any, { useBottom: false });
  container.addChild(g as any);

  const handle: HighlightHandle = {
    projectId,
    g,
    base: target,
    pad,
    phase: Math.random(),
    setVisible: (v) => (g.visible = v),
    destroy: () => {
      g.removeFromParent();
      g.destroy();
    },
  };

  redraw(handle, 0);
  return handle;
}

function redraw(hh: HighlightHandle, dt: number) {
  hh.phase = (hh.phase + dt * 0.01) % 1;

  const breathingT = (Math.sin(hh.phase * Math.PI * 2) + 1) / 2;

  const c = poisonColor(breathingT);

  const box = padAABB(hh.base, hh.pad);

  const amp = 2;
  const pulse = Math.round((breathingT - 0.5) * 2 * amp);

  const x = Math.floor(box.x) - pulse;
  const y = Math.floor(box.y) - pulse;
  const w = Math.floor(box.w) + pulse * 2;
  const h_box = Math.floor(box.h) + pulse * 2;

  hh.g.clear();

  hh.g.lineStyle(4, 0x000000, 0.4);
  hh.g.drawRect(x - 1, y - 1, w + 2, h_box + 2);

  hh.g.lineStyle({
    width: 2,
    color: c,
    alpha: 0.85,
    alignment: 0,
  });
  hh.g.drawRect(x, y, w, h_box);
}

export function tickHighlights(list: HighlightHandle[], deltaMS: number) {
  for (const h of list) {
    if (!h.g || !h.g.visible) continue;
    redraw(h, deltaMS);
  }
}