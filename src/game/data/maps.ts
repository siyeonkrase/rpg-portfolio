import { TILE_SIZE } from "./config";
import type { MapId, MapData, SceneryKind } from "./types";

function createEmptyCity(): number[][] {
  const tiles: number[][] = [
    [1, 1, 1, 1, 2, 1, 2, 3, 1, 1, 1, 1, 1, 10, 8, 8, 12, 3, 1, 2, 2, 1, 2, 3, 1, 1, 1, 1, 1, 1, 2, 10, 8, 8, 1, 1, 1, 1, 2, 3, 2, 1, 3, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 10, 12, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 10, 12, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 13, 1, 2, 1, 1, 1, 1, 3, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 2, 1, 2, 2, 2, 3, 1, 1, 1, 1, 1, 1, 13, 1, 1, 1, 1, 1, 2, 1, 3, 1, 2, 13, 13, 13, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 13, 1, 1, 1, 13, 1, 2, 1, 13, 13, 1, 1, 1, 13, 13, 1, 3, 2, 13, 13, 1, 13, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 1, 1, 2, 2, 1, 1, 1, 1, 3, 1, 13, 13, 13, 13, 13, 13, 13, 13, 13, 2, 1, 13, 2, 1, 1, 1, 1, 2, 3, 13, 1, 13, 13, 2, 13, 13, 13, 13, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 3, 1, 13, 2, 1, 2, 3, 13, 13, 2, 3, 1, 1, 1, 1, 1, 2, 2, 13, 2, 1, 1, 2, 1, 2, 1, 13, 13, 13, 13, 13, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 2, 2, 13, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 13, 1, 1, 1, 1, 1, 1, 13, 1, 1, 1, 1, 1, 1, 1, 13, 2, 1, 3, 2, 2, 1, 2, 1, 3, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 2, 2, 13, 2, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 13, 1, 1, 1, 1, 1, 1, 13, 1, 1, 1, 1, 1, 1, 1, 13, 1, 1, 1, 1, 1, 1, 1, 2, 4, 5, 5, 5, 5, 5, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [5, 5, 6, 1, 2, 13, 2, 13, 13, 13, 13, 13, 13, 13, 13, 13, 1, 1, 1, 1, 1, 1, 13, 1, 1, 1, 1, 1, 1, 1, 3, 13, 1, 1, 1, 1, 1, 1, 2, 7, 8, 8, 8, 8, 8, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [8, 8, 8, 5, 6, 1, 2, 1, 2, 1, 1, 2, 1, 2, 2, 13, 13, 2, 13, 13, 13, 13, 1, 13, 2, 13, 13, 1, 13, 13, 13, 2, 1, 2, 1, 1, 1, 3, 1, 10, 11, 11, 11, 11, 11, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [8, 8, 8, 8, 8, 6, 3, 2, 2, 2, 1, 2, 1, 1, 2, 3, 1, 1, 3, 2, 2, 1, 2, 3, 13, 1, 1, 1, 3, 1, 2, 13, 1, 13, 13, 2, 3, 1, 2, 3, 2, 1, 3, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  return tiles;
}

export const tiles: number[][] = createEmptyCity();
export const maps: Record<MapId, MapData> = {
  town: {
    id: "town",
    name: "Siyeon Town",
    tiles,
  },
};

// export type NpcData = {
//   id: string;
//   name: string;
//   x: number;
//   y: number;
//   lines: string[];
// };

export type LandmarkKind = "cinema" | "computer" | "bank" | "board";

export type LandmarkData = {
  id: string;
  x: number;
  y: number;
  kind: LandmarkKind
};

export const landmarks: LandmarkData[] = [
  {
    id: "lm-cinema",
    x: 11 * TILE_SIZE,
    y: 5 * TILE_SIZE,
    kind: "cinema",
  },
  {
    id: "lm-computer",
    x: 26.5 * TILE_SIZE,
    y: 10 * TILE_SIZE,
    kind: "computer",
  },
  {
    id: "lm-bank",
    x: 35 * TILE_SIZE,
    y: 4 * TILE_SIZE,
    kind: "bank",
  },
  {
    id: "lm-board",
    x: 47.5 * TILE_SIZE,
    y: 5 * TILE_SIZE,
    kind: "board",
  },
];

export type HouseKind =
  | "orangeM"
  | "orangeS"
  | "blueM"
  | "blueS";

  export type HouseData = {
    id: string,
    x: number,
    y: number,
    kind: HouseKind
  };

  export const houses: HouseData[] = [
  { id: "house-1", x: 7, y: 9, kind: "blueM" },
  { id: "house-2", x: 19.5, y: 4, kind: "blueS" },
  { id: "house-3", x: 19, y: 10, kind: "orangeM" },
  { id: "house-4", x: 27.5, y: 3, kind: "orangeS" },
  { id: "house-5", x: 35, y: 10.5, kind: "blueM" },
];

export type SceneryData = {
  id: string;
  x: number;
  y: number;
  kind: SceneryKind;
};

export const scenery: SceneryData[] = [
  { id: "tree-left-1", x: 0 * TILE_SIZE, y: 0 * TILE_SIZE, kind: "treeGreenGroup5" },
  { id: "tree-left-2", x: 1 * TILE_SIZE, y: 0 * TILE_SIZE, kind: "treeGreenGroup5" },
  { id: "tree-left-3", x: 2 * TILE_SIZE, y: 0 * TILE_SIZE, kind: "treeGreenGroup5" },
  { id: "tree-left-4", x: 3 * TILE_SIZE, y: 0 * TILE_SIZE, kind: "treeGreenGroup9" },

  { id: "tree-left-5", x: 0 * TILE_SIZE, y: 1 * TILE_SIZE, kind: "treeGreenGroup5" },
  { id: "tree-left-6", x: 1 * TILE_SIZE, y: 1 * TILE_SIZE, kind: "treeGreenGroup5" },
  { id: "tree-left-7", x: 2 * TILE_SIZE, y: 1 * TILE_SIZE, kind: "treeGreenGroup9" },

  { id: "tree-left-8", x: 0 * TILE_SIZE, y: 2 * TILE_SIZE, kind: "treeGreenGroup5" },
  { id: "tree-left-9", x: 1 * TILE_SIZE, y: 2 * TILE_SIZE, kind: "treeGreenGroup9" },

  { id: "tree-left-10", x: 0 * TILE_SIZE, y: 3 * TILE_SIZE, kind: "treeGreenGroup5" },
  { id: "tree-left-11", x: 1 * TILE_SIZE, y: 3 * TILE_SIZE, kind: "treeGreenGroup6" },

  { id: "tree-left-12", x: 0 * TILE_SIZE, y: 4 * TILE_SIZE, kind: "treeGreenGroup5" },
  { id: "tree-left-13", x: 1 * TILE_SIZE, y: 4 * TILE_SIZE, kind: "treeGreenGroup6" },

  { id: "tree-left-14", x: 0 * TILE_SIZE, y: 5 * TILE_SIZE, kind: "treeGreenGroup8" },

  // B) CITY: 상단 우측(대략 x=21~24, y=0~1) 경계 숲
  { id: "tree-top-1", x: 21 * TILE_SIZE, y: 0 * TILE_SIZE, kind: "treeGreenGroup7" },
  { id: "tree-top-2", x: 22 * TILE_SIZE, y: 0 * TILE_SIZE, kind: "treeGreenGroup5" },
  { id: "tree-top-3", x: 23 * TILE_SIZE, y: 0 * TILE_SIZE, kind: "treeGreenGroup9" },
  { id: "tree-top-4", x: 24 * TILE_SIZE, y: 0 * TILE_SIZE, kind: "treeGreenGroup8" },
  { id: "tree-top-5", x: 22 * TILE_SIZE, y: 1 * TILE_SIZE, kind: "treeGreenGroup8" },

  // C) CITY: 중앙/우측 상단 포인트(노란나무/식물/작은나무)
  { id: "tree-mid-1", x: 26 * TILE_SIZE, y: 11 * TILE_SIZE, kind: "treeYellowGroup1" },
  { id: "tree-mid-2", x: 27 * TILE_SIZE, y: 11 * TILE_SIZE, kind: "treeYellowGroup3" },

  { id: "plant-1", x: 23 * TILE_SIZE, y: 7 * TILE_SIZE, kind: "plant" },
  { id: "tree-small-1", x: 23 * TILE_SIZE, y: 5 * TILE_SIZE, kind: "treeGreenSmall" },
  

  // D) CITY: 좌하단/우하단 정원/울타리/나무/우물/꽃 등
  // (좌하단) 시작점 근처 작은 나무
  { id: "tree-bottom-left-1", x: 0 * TILE_SIZE, y: 7 * TILE_SIZE, kind: "treeGreenSmall" },

  // 울타리 블록(ㄱ자 형태)
  { id: "fence-1", x: 1 * TILE_SIZE, y: 6 * TILE_SIZE, kind: "fenceSquare1" },
  { id: "fence-2", x: 2 * TILE_SIZE, y: 6 * TILE_SIZE, kind: "fenceSquare2" },
  { id: "fence-3", x: 3 * TILE_SIZE, y: 6 * TILE_SIZE, kind: "fenceSquare2" },
  { id: "fence-4", x: 4 * TILE_SIZE, y: 6 * TILE_SIZE, kind: "fenceSquare2" },
  { id: "fence-5", x: 1 * TILE_SIZE, y: 7 * TILE_SIZE, kind: "fenceSquare4" },
  { id: "fence-6", x: 1 * TILE_SIZE, y: 8 * TILE_SIZE, kind: "fenceSquare6" },
  { id: "fence-7", x: 2 * TILE_SIZE, y: 8 * TILE_SIZE, kind: "fenceH3" },

  { id: "fence-1", x: 39 * TILE_SIZE, y: 1 * TILE_SIZE, kind: "fenceSquare1" },
  { id: "fence-2", x: 40 * TILE_SIZE, y: 1 * TILE_SIZE, kind: "fenceSquare2" },
  { id: "fence-3", x: 41 * TILE_SIZE, y: 1 * TILE_SIZE, kind: "fenceSquare2" },
  { id: "fence-4", x: 42 * TILE_SIZE, y: 1 * TILE_SIZE, kind: "fenceSquare2" },
  { id: "fence-2", x: 43 * TILE_SIZE, y: 1 * TILE_SIZE, kind: "fenceSquare2" },
  { id: "fence-3", x: 44 * TILE_SIZE, y: 1 * TILE_SIZE, kind: "fenceSquare2" },
  { id: "fence-4", x: 45 * TILE_SIZE, y: 1 * TILE_SIZE, kind: "fenceSquare2" },
  { id: "fence-4", x: 46 * TILE_SIZE, y: 1 * TILE_SIZE, kind: "fenceSquare3" },
  { id: "fence-5", x: 39 * TILE_SIZE, y: 2 * TILE_SIZE, kind: "fenceSquare4" },
  { id: "fence-5", x: 39 * TILE_SIZE, y: 3 * TILE_SIZE, kind: "fenceSquare4" },
  { id: "fence-4", x: 46 * TILE_SIZE, y: 2 * TILE_SIZE, kind: "fenceSquare5" },
  { id: "fence-6", x: 39 * TILE_SIZE, y: 4 * TILE_SIZE, kind: "fenceSquare6" },
  { id: "fence-7", x: 40 * TILE_SIZE, y: 4 * TILE_SIZE, kind: "fenceSquare7" },
  { id: "fence-7", x: 45 * TILE_SIZE, y: 4 * TILE_SIZE, kind: "fenceSquare7" },

  // 키 큰 나무(2칸짜리: 위/아래)
  { id: "tree-tall-1-top", x: 10 * TILE_SIZE, y: 7 * TILE_SIZE, kind: "treeGreenTall2" },
  { id: "tree-tall-1-bot", x: 10 * TILE_SIZE, y: 8 * TILE_SIZE, kind: "treeGreenTall1" },

  // 우물(2칸짜리)
  { id: "well-1-top", x: 14 * TILE_SIZE, y: 7 * TILE_SIZE, kind: "well1" },
  { id: "well-1-bot", x: 14 * TILE_SIZE, y: 8 * TILE_SIZE, kind: "well2" },

  { id: "well-2-top", x: 31.9 * TILE_SIZE, y: 8.5 * TILE_SIZE, kind: "well1" },
  { id: "well-2-bot", x: 31.9 * TILE_SIZE, y: 9.5 * TILE_SIZE, kind: "well2" },

  // 노란 나무 라인
  { id: "tree-yellow-1-top", x: 1 * TILE_SIZE, y: 8 * TILE_SIZE, kind: "treeYellowTall2" },
  { id: "tree-yellow-1-bot", x: 1 * TILE_SIZE, y: 9 * TILE_SIZE, kind: "treeYellowTall1" },

  { id: "tree-yellow-2", x: 2 * TILE_SIZE, y: 10 * TILE_SIZE, kind: "treeYellowSmall" },

  { id: "tree-yellow-3-top", x: 3 * TILE_SIZE, y: 10 * TILE_SIZE, kind: "treeYellowTall2" },
  { id: "tree-yellow-3-bot", x: 3 * TILE_SIZE, y: 11 * TILE_SIZE, kind: "treeYellowTall1" },

  { id: "tree-yellow-4", x: 4 * TILE_SIZE, y: 11 * TILE_SIZE, kind: "treeYellowSmall" },

  // 우측 상단 작은 노란나무
  { id: "tree-yellow-6-top", x: 23 * TILE_SIZE, y: 1 * TILE_SIZE, kind: "treeYellowTall2" },
  { id: "tree-yellow-6-bot", x: 23 * TILE_SIZE, y: 2 * TILE_SIZE, kind: "treeYellowTall1" },
  { id: "tree-yellow-7", x: 24 * TILE_SIZE, y: 1 * TILE_SIZE, kind: "treeYellowSmall" },

  // 식물/작은 나무들
  { id: "plant-2", x: 2 * TILE_SIZE, y: 5 * TILE_SIZE, kind: "plant" },
  { id: "tree-small-2-top", x: 4 * TILE_SIZE, y: 3 * TILE_SIZE, kind: "treeGreenTall2" },
  { id: "tree-small-2-bot", x: 4 * TILE_SIZE, y: 4 * TILE_SIZE, kind: "treeGreenTall1" },

  { id: "tree-small-3", x: 3 * TILE_SIZE, y: 2 * TILE_SIZE, kind: "treeGreenSmall" },
  { id: "tree-small-4", x: 5 * TILE_SIZE, y: 5 * TILE_SIZE, kind: "treeGreenSmall" },
  { id: "tree-small-5", x: 6 * TILE_SIZE, y: 4 * TILE_SIZE, kind: "treeGreenSmall" },

  // 초록 키큰나무들(여러 구역)
  { id: "tree-tall-3-top", x: 17 * TILE_SIZE, y: 1 * TILE_SIZE, kind: "treeGreenTall2" },
  { id: "tree-tall-3-bot", x: 17 * TILE_SIZE, y: 2 * TILE_SIZE, kind: "treeGreenTall1" },

  { id: "tree-tall-4-top", x: 16 * TILE_SIZE, y: 0 * TILE_SIZE, kind: "treeGreenTall2" },
  { id: "tree-tall-4-bot", x: 16 * TILE_SIZE, y: 1 * TILE_SIZE, kind: "treeGreenTall1" },

  { id: "tree-tall-5-top", x: 16 * TILE_SIZE, y: 7 * TILE_SIZE, kind: "treeGreenTall2" },
  { id: "tree-tall-5-bot", x: 16 * TILE_SIZE, y: 8 * TILE_SIZE, kind: "treeGreenTall1" },

  { id: "tree-tall-6-bot", x: 29 * TILE_SIZE, y: 0 * TILE_SIZE, kind: "treeGreenTall1" },

  { id: "tree-tall-7-top", x: 30 * TILE_SIZE, y: 0 * TILE_SIZE, kind: "treeGreenTall2" },
  { id: "tree-tall-7-bot", x: 30 * TILE_SIZE, y: 1 * TILE_SIZE, kind: "treeGreenTall1" },

  { id: "tree-yellow-8", x: 31 * TILE_SIZE, y: 0 * TILE_SIZE, kind: "treeYellowSmall" },

  { id: "tree-tall-8-top", x: 28.7 * TILE_SIZE, y: 7 * TILE_SIZE, kind: "treeGreenTall2" },
  { id: "tree-tall-8-bot", x: 28.7 * TILE_SIZE, y: 8 * TILE_SIZE, kind: "treeGreenTall1" },

  { id: "tree-tall-7-top", x: 37 * TILE_SIZE, y: 8 * TILE_SIZE, kind: "treeGreenTall2" },
  { id: "tree-tall-7-bot", x: 37 * TILE_SIZE, y: 9 * TILE_SIZE, kind: "treeGreenTall1" },
  { id: "tree-tall-7-top", x: 38 * TILE_SIZE, y: 9 * TILE_SIZE, kind: "treeGreenTall2" },
  { id: "tree-tall-7-bot", x: 38 * TILE_SIZE, y: 10 * TILE_SIZE, kind: "treeGreenTall1" },


  // 작은 오브젝트들
  { id: "mush-1", x: 16.5 * TILE_SIZE, y: 4 * TILE_SIZE, kind: "mushroom" },
  { id: "carrot-1", x: 39.5 * TILE_SIZE, y: 8 * TILE_SIZE, kind: "tomato" },
  { id: "carrot-1", x: 40.5 * TILE_SIZE, y: 8 * TILE_SIZE, kind: "corn" },
  { id: "carrot-1", x: 41.5 * TILE_SIZE, y: 8 * TILE_SIZE, kind: "carrot" },
  { id: "carrot-1", x: 42.5 * TILE_SIZE, y: 8 * TILE_SIZE, kind: "carrot2" },
  { id: "carrot-1", x: 43.5 * TILE_SIZE, y: 8 * TILE_SIZE, kind: "carrot2" },
  { id: "carrot-1", x: 44.5 * TILE_SIZE, y: 8 * TILE_SIZE, kind: "carrot" },
  { id: "corn-1", x: 39.5 * TILE_SIZE, y: 9.5 * TILE_SIZE, kind: "corn" },
  { id: "corn-1", x: 40.5 * TILE_SIZE, y: 9.5 * TILE_SIZE, kind: "carrot" },
  { id: "corn-1", x: 41.5 * TILE_SIZE, y: 9.5 * TILE_SIZE, kind: "carrot2" },
  { id: "corn-1", x: 42.5 * TILE_SIZE, y: 9.5 * TILE_SIZE, kind: "tomato" },
  { id: "corn-1", x: 43.5 * TILE_SIZE, y: 9.5 * TILE_SIZE, kind: "corn" },
  { id: "corn-1", x: 44.5 * TILE_SIZE, y: 9.5 * TILE_SIZE, kind: "carrot2" },

  // 해바라기(2칸)
  { id: "sunflower-1-top", x: 39.5 * TILE_SIZE, y: 3.5 * TILE_SIZE, kind: "sunflowerT" },
  { id: "sunflower-1-bot", x: 39.5 * TILE_SIZE, y: 4.5 * TILE_SIZE, kind: "sunflowerB" },
  { id: "sunflower-1-top", x: 46 * TILE_SIZE, y: 8.5 * TILE_SIZE, kind: "sunflowerT" },
  { id: "sunflower-1-bot", x: 46 * TILE_SIZE, y: 9.5 * TILE_SIZE, kind: "sunflowerB" },

  // E) CITY: 가로등/세탁대/쓰레기통/벤치 등 생활 소품
  // 가로등 1 (3조각)
  { id: "light-1-lt", x: 6.4 * TILE_SIZE, y: 3.2 * TILE_SIZE, kind: "twoLightPoleLT" },
  { id: "light-1-rt", x: 7.4 * TILE_SIZE, y: 3.2 * TILE_SIZE, kind: "twoLightPoleRT" },
  { id: "light-1-b", x: 6.78 * TILE_SIZE, y: 4.2 * TILE_SIZE, kind: "twoLightPoleB" },

  // 가로등 2 (3조각)
  { id: "light-2-lt", x: 22.64 * TILE_SIZE, y: 8 * TILE_SIZE, kind: "twoLightPoleLT" },
  { id: "light-2-rt", x: 23.64 * TILE_SIZE, y: 8 * TILE_SIZE, kind: "twoLightPoleRT" },
  { id: "light-2-b", x: 23 * TILE_SIZE, y: 9 * TILE_SIZE, kind: "twoLightPoleB" },

  // 세탁대(연속 5조각)
  { id: "drying-1-1", x: 7 * TILE_SIZE, y: 10 * TILE_SIZE, kind: "dryingPole1" },
  { id: "drying-1-2", x: 8 * TILE_SIZE, y: 10 * TILE_SIZE, kind: "dryingPole2" },
  { id: "drying-1-3", x: 9 * TILE_SIZE, y: 10 * TILE_SIZE, kind: "dryingPole3" },
  { id: "drying-1-4", x: 10 * TILE_SIZE, y: 10 * TILE_SIZE, kind: "dryingPole4" },
  { id: "drying-1-5", x: 10.1 * TILE_SIZE, y: 10 * TILE_SIZE, kind: "dryingPole1" },

  // 쓰레기통
  { id: "trashcan-1", x: 16 * TILE_SIZE, y: 9 * TILE_SIZE, kind: "trashCan2" },
  { id: "trashcan-2", x: 28.7 * TILE_SIZE, y: 9 * TILE_SIZE, kind: "trashCan2" },

  // 벤치
  { id: "bench-1", x: 24 * TILE_SIZE, y: 2 * TILE_SIZE, kind: "bench" },

  // F) CITY: 보드(게시판) + 포스트잇 올라가는 영역
  // 보드(윗줄 3 + 아랫줄 3 + 다리 2)
  { id: "board-1-legL", x: 46.5 * TILE_SIZE, y: 5 * TILE_SIZE, kind: "boardL" },
  { id: "board-1-legR", x: 47.5 * TILE_SIZE, y: 5 * TILE_SIZE, kind: "boardR" },

  // G) CITY: 기타 울타리 (짧은 구간)
  { id: "fence-short-1", x: 17 * TILE_SIZE, y: 3 * TILE_SIZE, kind: "fenceH2" },
  { id: "fence-short-2", x: 16 * TILE_SIZE, y: 3 * TILE_SIZE, kind: "fenceH1" },

  // H) CITY: 시네마(극장) 외벽 디테일(창문/문/에어컨 등)
  { id: "cinema-win-1", x: 9.3 * TILE_SIZE, y: 2 * TILE_SIZE, kind: "redWindowCenter1" },
  { id: "cinema-win-2", x: 10.5 * TILE_SIZE, y: 2 * TILE_SIZE, kind: "redWindowCenter1" },
  { id: "cinema-win-3", x: 11.7 * TILE_SIZE, y: 2 * TILE_SIZE, kind: "redWindowCenter1" },
  { id: "cinema-win-4", x: 9.3 * TILE_SIZE, y: 3 * TILE_SIZE, kind: "redWindowCenter2" },
  { id: "cinema-win-5", x: 10.5 * TILE_SIZE, y: 3 * TILE_SIZE, kind: "redWindowCenter2" },
  { id: "cinema-win-6", x: 11.7 * TILE_SIZE, y: 3 * TILE_SIZE, kind: "redWindowCenter2" },
  { id: "cinema-side-1", x: 8 * TILE_SIZE, y: 3 * TILE_SIZE, kind: "redWindowSide" },
  { id: "cinema-side-2", x: 8 * TILE_SIZE, y: 4 * TILE_SIZE, kind: "redWindowSide" },
  { id: "cinema-side-3", x: 13 * TILE_SIZE, y: 3 * TILE_SIZE, kind: "redWindowSide" },
  { id: "cinema-side-4", x: 13 * TILE_SIZE, y: 4 * TILE_SIZE, kind: "redWindowSide" },
  { id: "cinema-door-1", x: 9.3 * TILE_SIZE, y: 4 * TILE_SIZE, kind: "redSideDoor" },
  { id: "cinema-door-2", x: 11.7 * TILE_SIZE, y: 4 * TILE_SIZE, kind: "redSideDoor" },
  { id: "cinema-door-main", x: 10.5 * TILE_SIZE, y: 4 * TILE_SIZE, kind: "redBigDoor" },
  { id: "cinema-ac", x: 11.7 * TILE_SIZE, y: 0 * TILE_SIZE, kind: "unit" },

  // I) CITY: 컴퓨터샵 외벽 디테일
  { id: "pc-win-1", x: 25.5 * TILE_SIZE, y: 7 * TILE_SIZE, kind: "brownWindowCenter1" },
  { id: "pc-win-2", x: 26.5 * TILE_SIZE, y: 7 * TILE_SIZE, kind: "brownWindowCenter1" },
  { id: "pc-win-3", x: 25.5 * TILE_SIZE, y: 8 * TILE_SIZE, kind: "brownWindowCenter2" },
  { id: "pc-win-4", x: 26.5 * TILE_SIZE, y: 8 * TILE_SIZE, kind: "brownWindowCenter2" },
  { id: "pc-side-1", x: 24.5 * TILE_SIZE, y: 8 * TILE_SIZE, kind: "brownWindowSide" },
  { id: "pc-side-2", x: 27.5 * TILE_SIZE, y: 8 * TILE_SIZE, kind: "brownWindowSide" },
  { id: "pc-side-3", x: 24.5 * TILE_SIZE, y: 9 * TILE_SIZE, kind: "brownWindowSide" },
  { id: "pc-side-4", x: 27.5 * TILE_SIZE, y: 9 * TILE_SIZE, kind: "brownWindowSide" },
  { id: "pc-door-l", x: 25.5 * TILE_SIZE, y: 9 * TILE_SIZE, kind: "brownBigDoor1" },
  { id: "pc-door-r", x: 26.5 * TILE_SIZE, y: 9 * TILE_SIZE, kind: "brownBigDoor2" },

  // J) CITY: 은행 디테일(문/간판/ATM)
  { id: "bank-door-l", x: 35 * TILE_SIZE, y: 3 * TILE_SIZE, kind: "doorL" },
  { id: "bank-door-r", x: 36 * TILE_SIZE, y: 3 * TILE_SIZE, kind: "doorR" },
  { id: "bank-sign-l", x: 35 * TILE_SIZE, y: 2 * TILE_SIZE, kind: "signBlueL" },
  { id: "bank-sign-r", x: 36 * TILE_SIZE, y: 2 * TILE_SIZE, kind: "signBlueR" },
  { id: "bank-atm-1", x: 33 * TILE_SIZE, y: 3 * TILE_SIZE, kind: "atm" },
  { id: "bank-atm-2", x: 34 * TILE_SIZE, y: 3 * TILE_SIZE, kind: "atm" },

  
];