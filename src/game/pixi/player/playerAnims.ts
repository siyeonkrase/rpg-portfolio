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
  idleRow: number;     // 0
  sideRow: number;     // 1
  verticalRow: number; // 2
  idleCol?: number;    // 보통 0
  walkCols?: number[]; // 예: [0,1] 또는 [0,1,2]
  speed?: number;      // animationSpeed
}): AnimSet {
  const {
    frameW,
    frameH,
    idleRow,
    sideRow,
    idleCol = 0,
    walkCols = [0, 1, 2, 3, 4, 5],
    speed = 0.12,
  } = opts;

  const idleFrame = rect(idleCol * frameW, idleRow * frameH, frameW, frameH);
  const sideWalk = walkCols.map((c) => rect(c * frameW, sideRow * frameH, frameW, frameH));
  
  // 2. 수직 이동(up, down) 시 사용할 '멈춰있는' 프레임 배열
  // 걷기 애니메이션이 작동해도 계속 같은 이미지만 보여서 멈춘 것처럼 보입니다.
  const staticFrames = [idleFrame]; 

  const walk: Record<Dir, FrameSpec[]> = {
    right: sideWalk,
    left: sideWalk,
    down: staticFrames, // ✅ 위아래 이동 시 애니메이션 변화 없음
    up: staticFrames,   // ✅ 위아래 이동 시 애니메이션 변화 없음
  };

  return {
    walk,
    idle: { 
      down: rect(0, idleRow * frameH, frameW, frameH), 
      up: rect(0, idleRow * frameH, frameW, frameH), 
      left: rect(idleCol * frameW, sideRow * frameH, frameW, frameH), 
      right: rect(idleCol * frameW, sideRow * frameH, frameW, frameH) 
    },
    speed,
  };
}