import type { AABB, SceneryLike } from "./collisionRules";
import { collidersForScenery } from "./collisionRules";
import { scenery, landmarks, houses } from "../data/maps";
import { TILE_SIZE } from "../data/config";
import type { MapId } from "../data/types";

export type CollisionWorld = { colliders: AABB[]; hitsAny: (box: AABB) => boolean };

function intersects(a: AABB, b: AABB) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export function buildCollisionWorld(mapId: MapId): CollisionWorld {
  const colliders: AABB[] = [];

  for (const s of scenery as unknown as SceneryLike[]) {
    if ((s as any).mapId !== mapId) continue;
    colliders.push(...collidersForScenery(s, TILE_SIZE));
  }

  for (const lm of landmarks) {
    const box = landmarkCollider(lm.kind, lm.x, lm.y);
    if (box) colliders.push(box);
  }

  for (const h of houses) {
    const px = h.x * TILE_SIZE;
    const py = h.y * TILE_SIZE;
    const box = houseCollider(h.kind, px, py);
    if (box) colliders.push(box);
  }

  return { colliders, hitsAny: (box) => colliders.some((c) => intersects(box, c)) };
}

function landmarkCollider(kind: string, doorCenterX: number, floorY: number): AABB | null {
  const W = { cinema: TILE_SIZE * 6, computer: TILE_SIZE * 4, bank: TILE_SIZE * 4 }[kind];
  const H = { cinema: TILE_SIZE * 2.2, computer: TILE_SIZE * 2.2, bank: TILE_SIZE * 2.2 }[kind];
  if (!W || !H) return null;
  return { x: doorCenterX - W / 2, y: floorY - H, w: W, h: H };
}

function houseCollider(kind: string, tileX: number, tileY: number): AABB | null {
  const base = {
    blueM: { w: TILE_SIZE * 3, h: TILE_SIZE * 1.2 },
    orangeM: { w: TILE_SIZE * 3, h: TILE_SIZE * 1.2 },
    blueS: { w: TILE_SIZE * 2, h: TILE_SIZE * 1.1 },
    orangeS: { w: TILE_SIZE * 2, h: TILE_SIZE * 1.1 },
  }[kind];
  if (!base) return null;
  return { x: tileX, y: tileY + TILE_SIZE * 0.8, w: base.w, h: base.h };
}