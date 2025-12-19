// src/game/world/sceneryTypes.ts
import type { AABB } from "./collision";

export type SceneryKind = "treeGreenTall" | "houseA" | "board" | "fountain";

export type SceneryInstance = {
  kind: SceneryKind;
  x: number; // world px, 바닥 기준
  y: number; // world px, 바닥 기준
};

export type ScenerySpawnResult = {
  // 필요 시 나중에 remove/cleanup 위해 반환
  colliders?: AABB[];
};
