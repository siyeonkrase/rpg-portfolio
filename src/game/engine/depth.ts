import * as PIXI from "pixi.js";

export type DepthKind =
  | "ground"
  | "world"
  | "characters"
  | "buildingDetail"
  | "overlay";

const LAYER_BASE: Record<DepthKind, number> = {
  ground: 0,
  world: 1_000_000,
  characters: 2_000_000,
  buildingDetail: 8_000_000,
  overlay: 9_000_000,
};

type AnyDisplay = PIXI.DisplayObject & {
  x?: number;
  y?: number;
  height?: number;
  zIndex?: number;
  anchor?: { x: number; y: number };
};

export function enableDepthSorting(container: PIXI.Container) {
  container.sortableChildren = true;
}

/**
 * zIndex = base(kind) + floor(footY)
 *
 * footY는 "월드 좌표에서 발 위치(y)"를 넣어.
 * - 플레이어/NPC: 발 y
 * - 건물/오브젝트/보드: 정렬 기준이 되는 바닥 y
 * - ground/buildingDetail/overlay: 그냥 0 넣으면 됨(레이어 base로만 정렬)
 */
export function setDepth(
  display: PIXI.DisplayObject,
  kind: DepthKind,
  footY: number = 0
) {
  (display as any).zIndex = LAYER_BASE[kind] + Math.floor(footY);
}

export function setCharacterDepthFromWorldY(
  display: PIXI.DisplayObject,
  worldY: number
) {
  (display as AnyDisplay).zIndex = LAYER_BASE.characters + Math.floor(worldY);
}