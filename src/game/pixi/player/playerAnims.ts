import type { AnimSet, Dir, FrameSpec } from "./PlayerSprite";

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
  idleRow: number;
  sideRow: number;
  verticalRow: number;
  jumpRow?: number;
  idleCol?: number;   
  walkCols?: number[];
  jumpCols?: number[];
  speed?: number;
}): AnimSet {
  const {
    frameW,
    frameH,
    idleRow,
    sideRow,
    jumpRow = 2,
    idleCol = 0,
    walkCols = [0, 1, 2, 3, 4, 5],
    jumpCols = [0, 1, 2],
    speed = 0.12,
  } = opts;

  const idleFrame = rect(idleCol * frameW, idleRow * frameH, frameW, frameH);
  const sideWalk = walkCols.map((c) => rect(c * frameW, sideRow * frameH, frameW, frameH));

  const jumpFrames = jumpCols.map((c) => rect(c * frameW, jumpRow * frameH, frameW, frameH));

  const staticFrames = [idleFrame]; 

  const walk: Record<Dir, FrameSpec[]> = {
    right: sideWalk,
    left: sideWalk,
    down: staticFrames,
    up: staticFrames,
    jump: jumpFrames,
  };

  return {
    walk,
    jump: jumpFrames,
    idle: { 
      down: rect(0, idleRow * frameH, frameW, frameH), 
      up: rect(0, idleRow * frameH, frameW, frameH), 
      left: rect(idleCol * frameW, sideRow * frameH, frameW, frameH), 
      right: rect(idleCol * frameW, sideRow * frameH, frameW, frameH) 
    },
    speed,
  };
}