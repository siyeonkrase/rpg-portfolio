// src/game/pixi/depthSort.ts
import * as PIXI from "pixi.js";

export type DepthKind =
  | "ground"     // 바닥 타일
  | "decor"      // 나무, 울타리, 간판 등
  | "building"   // 집, 은행 같은 건물
  | "character"  // 플레이어, NPC
  | "ui";        // 화면 고정 UI

// 각 레이어끼리 겹치지 않게 base 값만 다르게 줌
const LAYER_BASE = {
  ground: 0,
  decor: 1_000_000,
  building: 2_000_000,
  character: 3_000_000,
  ui: 10_000_000,
} as const;

// world / stage에 zIndex 정렬을 켜는 헬퍼
export function enableDepthSorting(
  world: PIXI.Container,
  stage?: PIXI.Container
) {
  world.sortableChildren = true;
  if (stage) {
    stage.sortableChildren = true;
  }
}

// y(또는 bottomY)를 기준으로 zIndex 계산해주는 헬퍼
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

// 플레이어 Graphics처럼, 그냥 y값만으로 캐릭터 depth 주고 싶을 때
export function setCharacterDepthFromWorldY(
  display: any,
  worldY: number
) {
  display.zIndex = LAYER_BASE.character + worldY;
}
