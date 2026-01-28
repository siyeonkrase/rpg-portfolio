import type { AABB } from "./aabb";
import { TILE_SIZE } from "../data/config";

export type DoorTile = { id: string; x: number; y: number; kind: string };

export function aabbFromDoorTiles(tiles: DoorTile[], padPx = 0): AABB {
  if (tiles.length === 0) return { x: 0, y: 0, w: 0, h: 0 };

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  for (const t of tiles) {
    const x0 = t.x;
    const y0 = t.y;
    const x1 = t.x + TILE_SIZE;
    const y1 = t.y + TILE_SIZE;

    if (x0 < minX) minX = x0;
    if (y0 < minY) minY = y0;
    if (x1 > maxX) maxX = x1;
    if (y1 > maxY) maxY = y1;
  }

  return {
    x: minX - padPx,
    y: minY - padPx,
    w: (maxX - minX) + padPx * 2,
    h: (maxY - minY) + padPx * 2,
  };
}