import type { AABB } from "./aabb";
import { aabbIntersects } from "./aabb";
import type { SceneryLike } from "./collisionRules";
import { collidersForScenery } from "./collisionRules";

import { scenery, landmarks, houses } from "../data/maps";
import { TILE_SIZE } from "../data/config";

export class CollisionWorld {
  private solids: AABB[] = [];

  clear() {
    this.solids = [];
  }

  add(box: AABB) {
    this.solids.push(box);
  }

  addMany(boxes: AABB[]) {
    for (const b of boxes) this.add(b);
  }

  hitsAny(box: AABB): boolean {
    for (const s of this.solids) {
      if (aabbIntersects(box, s)) return true;
    }
    return false;
  }
}


export function buildCollisionWorld(): CollisionWorld {
  const world = new CollisionWorld();

  for (const s of scenery as unknown as SceneryLike[]) {
    world.addMany(collidersForScenery(s, TILE_SIZE));
  }

  for (const lm of landmarks) {
    const box = landmarkCollider(lm.kind, lm.x, lm.y);
    if (box) world.add(box);
  }

  for (const h of houses) {
    const px = h.x * TILE_SIZE;
    const py = h.y * TILE_SIZE;
    const box = houseCollider(h.kind, px, py);
    if (box) world.add(box);
  }

  return world;
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
