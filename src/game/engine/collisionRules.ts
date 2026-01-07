// src/game/engine/collisionRules.ts

export type AABB = { x: number; y: number; w: number; h: number };
export type SceneryLike = {
  id?: string;
  kind: string;
  x: number;
  y: number;
  mapId?: string;
};

// 지나갈 수 있는 것만 명시 (기본은 전부 막힘)
const PASSABLE = new Set<string>([
  // 예: "grassDecor", "flower"
]);

export function collidersForScenery(
  obj: SceneryLike,
  TILE_SIZE: number
): AABB[] {
  if (PASSABLE.has(obj.kind)) return [];

  return [
    {
      x: obj.x,
      y: obj.y,
      w: TILE_SIZE,
      h: TILE_SIZE,
    },
  ];
}