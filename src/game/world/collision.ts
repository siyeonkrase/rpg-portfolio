export type AABB = { x: number; y: number; w: number; h: number };

export function aabbIntersects(a: AABB, b: AABB) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

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
