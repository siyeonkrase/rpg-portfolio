// src/game/engine/collisionRules.ts
export type AABB = { x: number; y: number; w: number; h: number };
export type SceneryLike = { id?: string; kind: string; x: number; y: number; mapId?: string };

type Preset = {
  w: number; h: number; offsetX: number; offsetY: number;
  enabled?: (obj: SceneryLike) => boolean; // top 조각 끄기 등
};

const PASSABLE = new Set<string>([
  // "grassDecor", "flower"...
]);

const PRESETS: Record<string, (T: number) => Preset> = {
  // 기본 1타일 꽉 막기
  fenceH1: (T) => ({ w: T, h: T, offsetX: 0, offsetY: 0 }),
  fenceH2: (T) => ({ w: T, h: T, offsetX: 0, offsetY: 0 }),

  // 바닥만 막기(나무/기둥류)
  treeGreenSmall: (T) => bottom(T, 0.6, 0.4),
  trashCan2: (T) => bottom(T, 0.45, 0.35),

  // 2칸짜리: bot만 막고 top은 비활성
  treeGreenTall1: (T) => bottom(T, 0.65, 0.45), // bot
  treeGreenTall2: (T) => ({ w: 0, h: 0, offsetX: 0, offsetY: 0, enabled: () => false }), // top off

  well2: (T) => bottom(T, 0.8, 0.55),
  well1: (T) => ({ w: 0, h: 0, offsetX: 0, offsetY: 0, enabled: () => false }),
};

function bottom(T: number, wRatio: number, hRatio: number): Preset {
  const w = T * wRatio;
  const h = T * hRatio;
  return { w, h, offsetX: (T - w) / 2, offsetY: T - h };
}

export function collidersForScenery(obj: SceneryLike, TILE_SIZE: number): AABB[] {
  if (PASSABLE.has(obj.kind)) return [];

  const make = PRESETS[obj.kind];
  if (!make) {
    // 기본은 1타일 막기(네 목표가 “전부 못 지나감”이라 이게 안전)
    return [{ x: obj.x, y: obj.y, w: TILE_SIZE, h: TILE_SIZE }];
  }

  const p = make(TILE_SIZE);
  if (p.enabled && !p.enabled(obj)) return [];
  if (p.w <= 0 || p.h <= 0) return [];

  return [{ x: obj.x + p.offsetX, y: obj.y + p.offsetY, w: p.w, h: p.h }];
}