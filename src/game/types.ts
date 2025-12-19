// src/game/types.ts
export type MapId = "city"; // 너가 쓰는 맵 id들로 맞추기

export interface PlayerState {
  x: number; // 픽셀 단위
  y: number; // 픽셀 단위 (위로 갈수록 작아짐)
}

// 타일맵 구조
export interface MapData {
  id: MapId;
  name: string;
  tiles: number[][]; // 0 = 빈공간, 1 = 땅/플랫폼, 2 = 배경건물, 3 = 엔딩 트리거 등
}

export interface NPC {
  id: string;
  mapId: MapId;
  x: number; // 타일 좌표
  y: number; // 타일 좌표
  lines: string[];
}

export interface Landmark {
  id: string;
  mapId: MapId;
  x: number; // 타일 좌표
  y: number; // 타일 좌표
  projectId: string; // flickfacts / wedding / bento / chromeapp / crypto / rpg / contact ...
}
