import * as PIXI from "pixi.js";

export type DepthKind =
  | "world"
  | "buildingDetail"
  | "effect"
  | "characters"
  | "overlay";

export const LAYER_BASE: Record<DepthKind, number> = {
  world: 1000,
  buildingDetail: 2000,
  effect: 3000,
  characters: 4000,
  overlay: 5000,
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

export function setDepth(display: PIXI.DisplayObject, kind: DepthKind, footY: number = 0) {
  (display as any).zIndex = LAYER_BASE[kind] + Math.floor(footY);
}

// export function setCharacterDepthFromWorldY(display: PIXI.DisplayObject, worldY: number) {
//   (display as AnyDisplay).zIndex = LAYER_BASE.characters + Math.floor(worldY);
// }