import type { AnimSet, FrameSpec } from "./characterSprite";

const rect = (x: number, y: number, w: number, h: number): FrameSpec => ({
  kind: "rect",
  x,
  y,
  w,
  h,
});

export function makeVillagerAnim(opts: {
  frameW: number;
  frameH: number;
  row?: number;
  walkCols?: number[];
  speed?: number;
}): AnimSet {
  const {
    frameW,
    frameH,
    row = 1,
    walkCols = [0, 1, 2, 3, 4, 5],
    speed = 0.12,
  } = opts;

  const y = row * frameH;

  const walkRight = walkCols.map((c) => rect(c * frameW, y, frameW, frameH));

  return {
    walk: { right: walkRight },
    speed,
  }
}