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

  add(solid: AABB) {
    this.solids.push(solid);
  }

  addMany(solids: AABB[]) {
    for (const solid of solids) this.add(solid);
  }

  hitsAny(hitbox: AABB): boolean {
    for (const solid of this.solids) {
      if (aabbIntersects(hitbox, solid)) return true;
    }
    return false;
  }
}

export function buildCollisionWorld(): CollisionWorld {
  const world = new CollisionWorld();

  for (const s of scenery as unknown as SceneryLike[]) {
    world.addMany(collidersForScenery(s, TILE_SIZE));
  }

  for (const landmark of landmarks) {
    const box = landmarkCollider(landmark.kind, landmark.x, landmark.y);
    if (box) world.add(box);
  }

  for (const house of houses) {
    const px = house.x * TILE_SIZE;
    const py = house.y * TILE_SIZE;
    const box = houseCollider(house.kind, px, py);
    if (box) world.add(box);
  }

  return world;
}

function landmarkCollider(kind: string, doorCenterX: number, floorY: number): AABB | null {
  const lmWidth = { cinema: TILE_SIZE * 6, computer: TILE_SIZE * 4, bank: TILE_SIZE * 4 }[kind];
  const lmHeight = { cinema: TILE_SIZE * 2.2, computer: TILE_SIZE * 2.2, bank: TILE_SIZE * 2.2 }[kind];
  if (!lmWidth || !lmHeight) return null;
  return { x: doorCenterX - lmWidth / 2, y: floorY - lmHeight, w: lmWidth, h: lmHeight };
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
