// src/game/render/draw/sceneryParts.ts
import * as PIXI from "pixi.js";
import { texFromKind } from "./texFromKind"; // 너가 만든 매핑 함수

export type SceneryLike = { kind: string; x: number; y: number; mapId?: string };

export type SceneryLayer = "actors" | "occlusion";

export type SceneryPart = {
  layer: SceneryLayer;
  texture: PIXI.Texture;
  x: number;
  y: number;
  w: number;
  h: number;
  // depth 계산에 쓰는 기준 y(보통 발 = y + TILE_SIZE)
  footY: number;
};

/**
 * kind + 좌표를 받아서 “어떤 스프라이트 파츠들이 필요한지”만 반환한다.
 * - 여기서는 addChild 하지 않는다.
 * - 충돌도 안 만든다.
 */
export function sceneryParts(
  obj: SceneryLike,
  TILE_SIZE: number
): SceneryPart[] {
  const tex = texFromKind(obj.kind);
  if (!tex) return [];

  const px = obj.x;
  const py = obj.y;
  const footY = py + TILE_SIZE;

  // ✅ 기본: 한 장짜리 타일은 actors
  // ✅ occlusion로 보내고 싶은 규칙도 여기서만 관리
  const isOcclusion =
    obj.kind.endsWith("Tall1") ||
    obj.kind === "oneLightPoleT" ||
    obj.kind === "twoLightPoleLT" ||
    obj.kind === "twoLightPoleRT" ||
    obj.kind.startsWith("sign");

  return [
    {
      layer: isOcclusion ? "occlusion" : "actors",
      texture: tex,
      x: px,
      y: py,
      w: TILE_SIZE,
      h: TILE_SIZE,
      footY,
    },
  ];
}
