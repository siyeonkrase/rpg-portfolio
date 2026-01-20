import * as PIXI from "pixi.js";

export type DepthKind =
  | "ground"     // 바닥 타일
  | "decor"      // 나무, 울타리, 간판 등
  | "building"   // 집, 은행 같은 건물
  | "character"  // 플레이어, NPC
  | "ui";        // 화면 고정 UI

const LAYER_BASE = {
  ground: 0,
  decor: 1_000_000,
  building: 2_000_000,
  character: 3_000_000,
  ui: 10_000_000,
} as const;

export function enableDepthSorting(
  world: PIXI.Container,
  stage?: PIXI.Container
) {
  world.sortableChildren = true;
  if (stage) {
    stage.sortableChildren = true;
  }
}

export function setDepth(
  display:
    | (PIXI.DisplayObject & { y?: number; height?: number })
    | PIXI.Sprite
    | PIXI.Graphics
    | PIXI.Text,
  kind: DepthKind = "decor",
  options?: { useBottom?: boolean }
) {
  const useBottom = options?.useBottom ?? true;

  const y = (display as any).y ?? 0;
  const h = (display as any).height ?? 0;
  const pivotY = useBottom ? y + h : y;

  const base = LAYER_BASE[kind];
  (display as any).zIndex = base + pivotY;
}

export function setCharacterDepthFromWorldY(
  display: any,
  worldY: number
) {
  display.zIndex = LAYER_BASE.character + worldY;
}
