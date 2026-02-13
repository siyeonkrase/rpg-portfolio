import type { AABB } from "./aabb";

export type SceneryLike = {
  id?: string;
  kind: string;
  x: number;
  y: number;
};

export function collidersForScenery(
  obj: SceneryLike,
  TILE_SIZE: number
): AABB[] {
  return [
    {
      x: obj.x,
      y: obj.y,
      w: TILE_SIZE,
      h: TILE_SIZE,
    },
  ];
}