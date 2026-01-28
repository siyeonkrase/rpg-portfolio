import type { AABB } from "./aabb";

export type SceneryLike = {
  id?: string;
  kind: string;
  x: number;
  y: number;
  mapId?: string;
};

// const PASSABLE = new Set<string>([
  
// ]);

export function collidersForScenery(
  obj: SceneryLike,
  TILE_SIZE: number
): AABB[] {
  // if (PASSABLE.has(obj.kind)) return [];

  return [
    {
      x: obj.x,
      y: obj.y,
      w: TILE_SIZE,
      h: TILE_SIZE,
    },
  ];
}