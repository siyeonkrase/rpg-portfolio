export type AABB = { x: number; y: number; w: number; h: number };

export function aabbIntersects(a: AABB, b: AABB) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export function padAABB(a: AABB, pad: number): AABB {
  return { x: a.x - pad, y: a.y - pad, w: a.w + pad * 2, h: a.h + pad * 2 };
}
