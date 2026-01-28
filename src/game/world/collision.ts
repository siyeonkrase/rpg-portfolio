import type { AABB } from "../engine/aabb";
import { aabbIntersects } from "../engine/aabb";

export class CollisionWorld {
  solids: AABB[] = [];

  clear() {
    this.solids = [];
  }

  add(box: AABB) {
    this.solids.push(box);
  }

  hitsAny(box: AABB) {
    for (const s of this.solids) {
      if (aabbIntersects(box, s)) return true;
    }
    return false;
  }
}
