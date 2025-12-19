// src/game/maps.ts
import { TILE_SIZE } from "./config";
import type { MapId, MapData } from "./types";

// ─────────────────────────────
// 기본 맵 사이즈 설정
// ─────────────────────────────
const CITY_WIDTH = 80;   // 가로로 쭉 늘어난 마을
const CITY_HEIGHT = 10;  // 🔥 14 → 18 : 화면 높이랑 맞춰줌
const PATH_Y = 9;       // 🔥 길을 조금 아래로 내려서 가운데쯤 오게
const BUILDING_TOP_Y = 5; // 🔥 건물 지붕이 시작하는 줄도 같이 내려줌

function createEmptyCity(): number[][] {
  const tiles: number[][] = [
    [1, 1, 1, 1, 2, 1, 2, 3, 1, 1, 1, 1, 1, 10, 8, 8, 12, 3, 1, 2, 2, 1, 2, 3, 1, 1, 1, 1, 1, 1, 2, 10, 8, 8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 10, 12, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 10, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 13, 1, 2, 1, 1, 1, 1, 3, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 2, 1, 2, 2, 2, 3, 1, 1, 1, 1, 1, 1, 13, 1, 1, 1, 1, 1, 2, 1, 3, 1, 2, 13, 13, 13, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 13, 1, 1, 1, 13, 1, 2, 1, 13, 13, 1, 1, 1, 13, 13, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 1, 1, 2, 2, 1, 1, 1, 1, 3, 1, 13, 13, 13, 13, 13, 13, 13, 13, 13, 2, 1, 13, 2, 1, 1, 1, 1, 2, 3, 13, 1, 13, 1, 13, 13, 13, 13, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 3, 1, 13, 2, 1, 2, 3, 13, 13, 2, 3, 1, 1, 1, 1, 1, 2, 2, 13, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 2, 2, 13, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 13, 1, 1, 1, 1, 1, 1, 13, 1, 1, 1, 1, 1, 1, 1, 13, 2, 1, 3, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 2, 2, 13, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 13, 1, 1, 1, 1, 1, 1, 13, 1, 1, 1, 1, 1, 1, 1, 13, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [5, 5, 6, 1, 2, 2, 1, 13, 13, 13, 13, 13, 13, 13, 13, 13, 1, 1, 1, 1, 1, 1, 13, 1, 1, 1, 1, 1, 1, 1, 3, 13, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [8, 8, 8, 5, 6, 1, 2, 1, 2, 1, 1, 2, 1, 2, 2, 13, 13, 2, 13, 13, 13, 13, 1, 13, 2, 13, 13, 1, 13, 13, 13, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [8, 8, 8, 8, 8, 6, 3, 2, 2, 2, 1, 2, 1, 1, 2, 3, 1, 1, 3, 2, 2, 1, 2, 3, 13, 1, 1, 1, 3, 1, 2, 13, 1, 13, 13, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  return tiles;
}

// 건물의 충돌(블록) 영역 찍기용 helper
function addBuildingFootprint(
  tiles: number[][],
  centerX: number,
  width: number,
  height: number
) {
  const startX = centerX - Math.floor(width / 2);
  const endX = centerX + Math.floor((width - 1) / 2);
  const startY = BUILDING_TOP_Y;
  const endY = BUILDING_TOP_Y + height - 1;

  for (let y = startY; y <= endY; y++) {
    if (y < 0 || y >= CITY_HEIGHT) continue;
    for (let x = startX; x <= endX; x++) {
      if (x < 0 || x >= CITY_WIDTH) continue;
      tiles[y][x] = 9; // 9 = 충돌 타일
    }
  }
}

// ─────────────────────────────
// 실제 city 맵 생성
// ─────────────────────────────
const tiles: number[][] = createEmptyCity();

// 각 프로젝트별 건물 x 좌표 (길은 PATH_Y, 건물은 BUILDING_TOP_Y 기준으로 위에 서 있음)
const FLICK_X = 12;
const CHROME_X = 26;
const WEDDING_X = 40;
const CRYPTO_X = 54;
const BENTO_X = 68;
const HALL_X = 76; // 제일 오른쪽 City Hall

// 건물 충돌 영역 (3~4타일 정도 너비, 3타일 높이)
// addBuildingFootprint(tiles, FLICK_X, 4, 3);
// addBuildingFootprint(tiles, CHROME_X, 4, 3);
// addBuildingFootprint(tiles, WEDDING_X, 4, 3);
// addBuildingFootprint(tiles, CRYPTO_X, 4, 3);
// addBuildingFootprint(tiles, BENTO_X, 4, 3);
// addBuildingFootprint(tiles, HALL_X, 5, 4);

// City Hall 앞 바닥에 엔딩 트리거용 타일 (3) 한 칸
tiles[PATH_Y][HALL_X] = 3;

// ─────────────────────────────
// maps 객체
// ─────────────────────────────
export const maps: Record<MapId, MapData> = {
  city: {
    id: "city",
    name: "Siyeon City",
    tiles,
  },
};

// ─────────────────────────────
// NPC & Landmarks
// ─────────────────────────────

export type NpcData = {
  id: string;
  name: string;
  mapId: MapId;
  x: number;      // 타일 단위 좌표
  y: number;
  lines: string[]; // 대사 배열
};

// ─────────────────────────────
// NPC & Landmarks
// ─────────────────────────────

export type LandmarkKind = "cinema" | "computer" | "bank" | "fountain"; // 원하는 만큼 추가

export type LandmarkData = {
  id: string;
  mapId: MapId;
  x: number;      // 타일 단위 (문 / 정중앙 기준 x)
  y: number;      // 타일 단위 (문이 닿는 바닥 y)
  kind: LandmarkKind;
  // projectId?: string;  // 나중에 포폴 상호작용 쓰고 싶으면 다시 넣기
};

export const landmarks: LandmarkData[] = [
  {
    id: "lm-cinema",
    mapId: "city",
    x: 11 * TILE_SIZE,
    y: 5 * TILE_SIZE,
    kind: "cinema",
  },
  {
    id: "lm-computer",
    mapId: "city",
    x: 27 * TILE_SIZE,
    y: 10 * TILE_SIZE,
    kind: "computer",
  },
  {
    id: "lm-bank",
    mapId: "city",
    x: 36 * TILE_SIZE,
    y: 5 * TILE_SIZE,
    kind: "bank",
  },
  {
    id: "lm-fountain",
    mapId: "city",
    x: 45 * TILE_SIZE,
    y: 7 * TILE_SIZE,
    kind: "fountain",
  }
];


// 플레이어 스폰은 PATH_Y 근처일 거라고 가정 (gameAtoms에서 설정)
export const npcs: NpcData[] = [
  {
    id: "guide",
    name: "Tour Guide",
    mapId: "city",
    x: 4,
    y: PATH_Y,
    lines: [
      "Welcome to Siyeon City!",
      "Walk along the main road and talk to the locals — every building is one of Siyeon's projects.",
      "When you're ready to actually reach out, head all the way right to City Hall.",
    ],
  },
  // FlickFacts 앞 영화 덕후 NPC
  {
    id: "npc-flick",
    name: "Movie Buff",
    mapId: "city",
    x: FLICK_X - 1,
    y: PATH_Y,
    lines: [
      "See that cinema? That's FlickFacts — Siyeon's movie discovery app.",
      "You can filter by genre and sort by rating. No more endless scrolling on what to watch.",
      "Trailers even play right on the homepage. Perfect for lazy movie nights.",
    ],
  },
  // Chrome App 앞 NPC
  {
    id: "npc-chrome",
    name: "Morning Dev",
    mapId: "city",
    x: CHROME_X - 1,
    y: PATH_Y,
    lines: [
      "That cozy little building? That's a custom Chrome start page Siyeon built.",
      "Clock, weather, quotes, even your name — all saved with local storage.",
      "It's like a tiny dashboard that makes opening a new tab oddly satisfying.",
    ],
  },
  // Wedding Invitation 앞 NPC
  {
    id: "npc-wedding",
    name: "Wedding Guest",
    mapId: "city",
    x: WEDDING_X - 1,
    y: PATH_Y,
    lines: [
      "This hall hosted Siyeon's own wedding — well, the website version of it.",
      "Clean, mobile-first design with Korean/English switching built in.",
      "You can even preview the venue through an embedded Google Map. Very thoughtful, right?",
    ],
  },
  // Crypto Tracker 앞 NPC
  {
    id: "npc-crypto",
    name: "Market Analyst",
    mapId: "city",
    x: CRYPTO_X - 1,
    y: PATH_Y,
    lines: [
      "Over there is the crypto lab — Siyeon's real-time tracker.",
      "Charts, rankings, percentage changes… all typed with TypeScript for safety.",
      "There’s even dark/light mode so your eyes don’t dump you before the market does.",
    ],
  },
  // Bento Board 앞 NPC
  {
    id: "npc-bento",
    name: "Project Manager",
    mapId: "city",
    x: BENTO_X - 1,
    y: PATH_Y,
    lines: [
      "See that studio? That’s Bento Board, her Kanban-style workflow app.",
      "You can create boards, color-code them, and drag tasks around like bento pieces.",
      "The whole thing is responsive, strongly typed, and dangerously fun to organize.",
    ],
  },
  // City Hall 비서 NPC (엔딩)
  {
    id: "npc-hall",
    name: "City Hall Assistant",
    mapId: "city",
    x: HALL_X - 2,
    y: PATH_Y,
    lines: [
      "You made it all the way to Siyeon City Hall. Nice.",
      "Siyeon is currently in a deep-focus coding session and can't come out…",
      "But you can still reach her via GitHub or LinkedIn on the contact panel over there.",
    ],
  },
];

export type HouseKind =
  | "orangeM"
  | "orangeS"
  | "blueM"
  | "blueS";

  export type HouseData = {
    id: string,
    mapId: MapId,
    x: number,
    y: number,
    kind: HouseKind
  };

  export const houses: HouseData[] = [
  { id: "house-1", mapId: "city", x: 7, y: 9, kind: "blueM" },
  { id: "house-2", mapId: "city", x: 19.5, y: 4, kind: "blueS" },
  { id: "house-3", mapId: "city", x: 19, y: 10, kind: "orangeM" },
  { id: "house-4", mapId: "city", x: 27.5, y: 3, kind: "orangeS" },
  { id: "house-5", mapId: "city", x: 35, y: 11, kind: "blueM" },
  // { id: "house-6", mapId: "city", x: 45, y: 4, kind: "blueS" },
  // { id: "house-4", mapId: "city", x: 27, y: 5, kind: "orangeS" },
];

// ─────────────────────────────
// 장식용 오브젝트 (나무, 울타리 등)
// ─────────────────────────────
export type SceneryKind =
  | "treeYellowTall1"
  | "treeYellowTall2"
  | "treeGreenTall1"
  | "treeGreenTall2"
  | "bush"
  | "treeYellowSmall"
  | "treeGreenSmall"
  | "plant"
  | "mushroom"
  | "treeGreenGroup1"
  | "treeGreenGroup2"
  | "treeGreenGroup3"
  | "treeGreenGroup4"
  | "treeGreenGroup5"
  | "treeGreenGroup6"
  | "treeGreenGroup7"
  | "treeGreenGroup8"
  | "treeGreenGroup9"
  | "treeYellowGroup1"
  | "treeYellowGroup2"
  | "treeYellowGroup3"
  | "treeYellowGroup4"
  | "treeYellowGroup5"
  | "treeYellowGroup6"
  | "treeYellowGroup7"
  | "treeYellowGroup8"
  | "treeYellowGroup9"
  | "treeYellowTall1"
  | "treeYellowTall2"
  | "treeGreenTall1"
  | "treeGreenTall2"
  | "bush"
  | "treeYellowSmall"
  | "treeGreenSmall"
  | "plant"
  | "mushroom"
  | "well1"
  | "well2"
  | "fenceSquare1"
  | "fenceSquare2"
  | "fenceSquare3"
  | "fenceSquare4"
  | "fenceSquare5"
  | "fenceSquare6"
  | "fenceSquare7"
  | "fenceSquare8"
  | "fenceH1"
  | "fenceH2"
  | "fenceH3"
  | "fenceV1"
  | "fenceV2"
  | "fenceV3"
  | "sign"
  | "oneLightPoleT"
  | "oneLightPoleB"
  | "twoLightPoleLT"
  | "twoLightPoleRT"
  | "twoLightPoleB"
  | "dryingPole1"
  | "dryingPole2"
  | "dryingPole3"
  | "dryingPole4"
  | "dryingPole5"
  | "trashCan1"
  | "trashCan2"
  | "fireHyd"
  | "boxes1"
  | "boxes2"
  | "boxes3"
  | "boxes4"
  | "redWindowCenter1"
  | "redWindowCenter2"
  | "redWindowSide"
  | "redBigDoor"
  | "redSideDoor"
  | "unit"
  | "brownWindowCenter1"
  | "brownWindowCenter2"
  | "brownWindowSide"
  | "brownBigDoor1"
  | "brownBigDoor2"
  | "bench"
  | "signRedL"
  | "signRedR"
  | "signBlueL"
  | "signBlueR"
  | "atm"
  | "windowGrey"
  | "doorL"
  | "doorR"
  | "buildingWindowL"
  | "buildingWindowM"
  | "buildingWindowR"
  | "barH"
  | "parkingMeter"
  | "sunflowerT"
  | "sunflowerB"
  | "board1"
  | "board2"
  | "board3"
  | "board4"
  | "board5"
  | "board6"
  | "board7"
  | "board8"
  | "board9"
  | "boardL"
  | "boardR"
  | "displayBoard1"
  | "displayBoard2"
  | "displayBoard3"
  | "displayBoard4"
  | "displayBoard5"
  | "displayBoard6"
  | "fountain1";

export type SceneryData = {
  id: string;
  mapId: MapId;
  x: number; // 타일 좌표
  y: number;
  kind: SceneryKind;
};

export const scenery: SceneryData[] = [
  // =========================================================
  // A) CITY: 좌상단(0,0) 주변 숲/경계 타일 채우기
  // =========================================================
  { id: "tree-left-1", mapId: "city", x: 0 * TILE_SIZE, y: 0 * TILE_SIZE, kind: "treeGreenGroup5" },
  { id: "tree-left-2", mapId: "city", x: 1 * TILE_SIZE, y: 0 * TILE_SIZE, kind: "treeGreenGroup5" },
  { id: "tree-left-3", mapId: "city", x: 2 * TILE_SIZE, y: 0 * TILE_SIZE, kind: "treeGreenGroup5" },
  { id: "tree-left-4", mapId: "city", x: 3 * TILE_SIZE, y: 0 * TILE_SIZE, kind: "treeGreenGroup9" },

  { id: "tree-left-5", mapId: "city", x: 0 * TILE_SIZE, y: 1 * TILE_SIZE, kind: "treeGreenGroup5" },
  { id: "tree-left-6", mapId: "city", x: 1 * TILE_SIZE, y: 1 * TILE_SIZE, kind: "treeGreenGroup5" },
  { id: "tree-left-7", mapId: "city", x: 2 * TILE_SIZE, y: 1 * TILE_SIZE, kind: "treeGreenGroup9" },

  { id: "tree-left-8", mapId: "city", x: 0 * TILE_SIZE, y: 2 * TILE_SIZE, kind: "treeGreenGroup5" },
  { id: "tree-left-9", mapId: "city", x: 1 * TILE_SIZE, y: 2 * TILE_SIZE, kind: "treeGreenGroup9" },

  { id: "tree-left-10", mapId: "city", x: 0 * TILE_SIZE, y: 3 * TILE_SIZE, kind: "treeGreenGroup5" },
  { id: "tree-left-11", mapId: "city", x: 1 * TILE_SIZE, y: 3 * TILE_SIZE, kind: "treeGreenGroup6" },

  { id: "tree-left-12", mapId: "city", x: 0 * TILE_SIZE, y: 4 * TILE_SIZE, kind: "treeGreenGroup5" },
  { id: "tree-left-13", mapId: "city", x: 1 * TILE_SIZE, y: 4 * TILE_SIZE, kind: "treeGreenGroup6" },

  { id: "tree-left-14", mapId: "city", x: 0 * TILE_SIZE, y: 5 * TILE_SIZE, kind: "treeGreenGroup8" },

  // =========================================================
  // B) CITY: 상단 우측(대략 x=21~24, y=0~1) 경계 숲
  // =========================================================
  { id: "tree-top-1", mapId: "city", x: 21 * TILE_SIZE, y: 0 * TILE_SIZE, kind: "treeGreenGroup7" },
  { id: "tree-top-2", mapId: "city", x: 22 * TILE_SIZE, y: 0 * TILE_SIZE, kind: "treeGreenGroup5" },
  { id: "tree-top-3", mapId: "city", x: 23 * TILE_SIZE, y: 0 * TILE_SIZE, kind: "treeGreenGroup9" },
  { id: "tree-top-4", mapId: "city", x: 24 * TILE_SIZE, y: 0 * TILE_SIZE, kind: "treeGreenGroup8" },
  { id: "tree-top-5", mapId: "city", x: 22 * TILE_SIZE, y: 1 * TILE_SIZE, kind: "treeGreenGroup8" },

  // =========================================================
  // C) CITY: 중앙/우측 상단 포인트(노란나무/식물/작은나무)
  // =========================================================
  { id: "tree-mid-1", mapId: "city", x: 26 * TILE_SIZE, y: 11 * TILE_SIZE, kind: "treeYellowGroup1" },
  { id: "tree-mid-2", mapId: "city", x: 27 * TILE_SIZE, y: 11 * TILE_SIZE, kind: "treeYellowGroup3" },

  { id: "plant-1", mapId: "city", x: 23 * TILE_SIZE, y: 7 * TILE_SIZE, kind: "plant" },
  { id: "tree-small-1", mapId: "city", x: 23 * TILE_SIZE, y: 5 * TILE_SIZE, kind: "treeGreenSmall" },

  // =========================================================
  // D) CITY: 좌하단/우하단 정원/울타리/나무/우물/꽃 등
  // =========================================================
  // (좌하단) 시작점 근처 작은 나무
  { id: "tree-bottom-left-1", mapId: "city", x: 0 * TILE_SIZE, y: 7 * TILE_SIZE, kind: "treeGreenSmall" },

  // 울타리 블록(ㄱ자 형태)
  { id: "fence-1", mapId: "city", x: 1 * TILE_SIZE, y: 6 * TILE_SIZE, kind: "fenceSquare1" },
  { id: "fence-2", mapId: "city", x: 2 * TILE_SIZE, y: 6 * TILE_SIZE, kind: "fenceSquare2" },
  { id: "fence-3", mapId: "city", x: 3 * TILE_SIZE, y: 6 * TILE_SIZE, kind: "fenceSquare2" },
  { id: "fence-4", mapId: "city", x: 4 * TILE_SIZE, y: 6 * TILE_SIZE, kind: "fenceSquare2" },
  { id: "fence-5", mapId: "city", x: 1 * TILE_SIZE, y: 7 * TILE_SIZE, kind: "fenceSquare4" },
  { id: "fence-6", mapId: "city", x: 1 * TILE_SIZE, y: 8 * TILE_SIZE, kind: "fenceSquare6" },
  { id: "fence-7", mapId: "city", x: 2 * TILE_SIZE, y: 8 * TILE_SIZE, kind: "fenceH3" },
  { id: "fence-8", mapId: "city", x: 4 * TILE_SIZE, y: 8 * TILE_SIZE, kind: "fenceH1" },

  // 키 큰 나무(2칸짜리: 위/아래)
  { id: "tree-tall-1-top", mapId: "city", x: 10 * TILE_SIZE, y: 7 * TILE_SIZE, kind: "treeGreenTall2" },
  { id: "tree-tall-1-bot", mapId: "city", x: 10 * TILE_SIZE, y: 8 * TILE_SIZE, kind: "treeGreenTall1" },
  { id: "tree-tall-2-top", mapId: "city", x: 12 * TILE_SIZE, y: 7 * TILE_SIZE, kind: "treeGreenTall2" },
  { id: "tree-tall-2-bot", mapId: "city", x: 12 * TILE_SIZE, y: 8 * TILE_SIZE, kind: "treeGreenTall1" },

  // 우물(2칸짜리)
  { id: "well-1-top", mapId: "city", x: 14 * TILE_SIZE, y: 7 * TILE_SIZE, kind: "well1" },
  { id: "well-1-bot", mapId: "city", x: 14 * TILE_SIZE, y: 8 * TILE_SIZE, kind: "well2" },

  { id: "well-2-top", mapId: "city", x: 31.9 * TILE_SIZE, y: 9 * TILE_SIZE, kind: "well1" },
  { id: "well-2-bot", mapId: "city", x: 31.9 * TILE_SIZE, y: 10 * TILE_SIZE, kind: "well2" },

  // 노란 나무 라인
  { id: "tree-yellow-1-top", mapId: "city", x: 1 * TILE_SIZE, y: 8 * TILE_SIZE, kind: "treeYellowTall2" },
  { id: "tree-yellow-1-bot", mapId: "city", x: 1 * TILE_SIZE, y: 9 * TILE_SIZE, kind: "treeYellowTall1" },

  { id: "tree-yellow-2", mapId: "city", x: 2 * TILE_SIZE, y: 10 * TILE_SIZE, kind: "treeYellowSmall" },

  { id: "tree-yellow-3-top", mapId: "city", x: 3 * TILE_SIZE, y: 10 * TILE_SIZE, kind: "treeYellowTall2" },
  { id: "tree-yellow-3-bot", mapId: "city", x: 3 * TILE_SIZE, y: 11 * TILE_SIZE, kind: "treeYellowTall1" },

  { id: "tree-yellow-4", mapId: "city", x: 4 * TILE_SIZE, y: 11 * TILE_SIZE, kind: "treeYellowSmall" },

  { id: "tree-yellow-5-top", mapId: "city", x: 4 * TILE_SIZE, y: 9 * TILE_SIZE, kind: "treeYellowTall2" },
  { id: "tree-yellow-5-bot", mapId: "city", x: 4 * TILE_SIZE, y: 10 * TILE_SIZE, kind: "treeYellowTall1" },

  // 우측 상단 작은 노란나무
  { id: "tree-yellow-6-top", mapId: "city", x: 23 * TILE_SIZE, y: 1 * TILE_SIZE, kind: "treeYellowTall2" },
  { id: "tree-yellow-6-bot", mapId: "city", x: 23 * TILE_SIZE, y: 2 * TILE_SIZE, kind: "treeYellowTall1" },
  { id: "tree-yellow-7", mapId: "city", x: 24 * TILE_SIZE, y: 1 * TILE_SIZE, kind: "treeYellowSmall" },

  // 식물/작은 나무들
  { id: "plant-2", mapId: "city", x: 2 * TILE_SIZE, y: 5 * TILE_SIZE, kind: "plant" },
  { id: "tree-small-2-top", mapId: "city", x: 4 * TILE_SIZE, y: 3 * TILE_SIZE, kind: "treeGreenTall2" },
  { id: "tree-small-2-bot", mapId: "city", x: 4 * TILE_SIZE, y: 4 * TILE_SIZE, kind: "treeGreenTall1" },

  { id: "tree-small-3", mapId: "city", x: 3 * TILE_SIZE, y: 2 * TILE_SIZE, kind: "treeGreenSmall" },
  { id: "tree-small-4", mapId: "city", x: 5 * TILE_SIZE, y: 5 * TILE_SIZE, kind: "treeGreenSmall" },
  { id: "tree-small-5", mapId: "city", x: 6 * TILE_SIZE, y: 4 * TILE_SIZE, kind: "treeGreenSmall" },

  // 초록 키큰나무들(여러 구역)
  { id: "tree-tall-3-top", mapId: "city", x: 17 * TILE_SIZE, y: 1 * TILE_SIZE, kind: "treeGreenTall2" },
  { id: "tree-tall-3-bot", mapId: "city", x: 17 * TILE_SIZE, y: 2 * TILE_SIZE, kind: "treeGreenTall1" },

  { id: "tree-tall-4-top", mapId: "city", x: 16 * TILE_SIZE, y: 0 * TILE_SIZE, kind: "treeGreenTall2" },
  { id: "tree-tall-4-bot", mapId: "city", x: 16 * TILE_SIZE, y: 1 * TILE_SIZE, kind: "treeGreenTall1" },

  { id: "tree-tall-5-top", mapId: "city", x: 16 * TILE_SIZE, y: 7 * TILE_SIZE, kind: "treeGreenTall2" },
  { id: "tree-tall-5-bot", mapId: "city", x: 16 * TILE_SIZE, y: 8 * TILE_SIZE, kind: "treeGreenTall1" },

  { id: "tree-tall-6-bot", mapId: "city", x: 29 * TILE_SIZE, y: 0 * TILE_SIZE, kind: "treeGreenTall1" },

  { id: "tree-tall-7-top", mapId: "city", x: 30 * TILE_SIZE, y: 0 * TILE_SIZE, kind: "treeGreenTall2" },
  { id: "tree-tall-7-bot", mapId: "city", x: 30 * TILE_SIZE, y: 1 * TILE_SIZE, kind: "treeGreenTall1" },

  { id: "tree-yellow-8", mapId: "city", x: 31 * TILE_SIZE, y: 0 * TILE_SIZE, kind: "treeYellowSmall" },

  { id: "tree-tall-8-top", mapId: "city", x: 28.7 * TILE_SIZE, y: 7 * TILE_SIZE, kind: "treeGreenTall2" },
  { id: "tree-tall-8-bot", mapId: "city", x: 28.7 * TILE_SIZE, y: 8 * TILE_SIZE, kind: "treeGreenTall1" },

  // 작은 오브젝트들
  { id: "mush-1", mapId: "city", x: 16.5 * TILE_SIZE, y: 4 * TILE_SIZE, kind: "mushroom" },

  // 해바라기(2칸)
  { id: "sunflower-1-top", mapId: "city", x: 31.9 * TILE_SIZE, y: 7 * TILE_SIZE, kind: "sunflowerT" },
  { id: "sunflower-1-bot", mapId: "city", x: 31.9 * TILE_SIZE, y: 8 * TILE_SIZE, kind: "sunflowerB" },

  // =========================================================
  // E) CITY: 가로등/세탁대/쓰레기통/벤치 등 생활 소품
  // =========================================================
  // 가로등 1 (3조각)
  { id: "light-1-lt", mapId: "city", x: 6.4 * TILE_SIZE, y: 3.2 * TILE_SIZE, kind: "twoLightPoleLT" },
  { id: "light-1-rt", mapId: "city", x: 7.4 * TILE_SIZE, y: 3.2 * TILE_SIZE, kind: "twoLightPoleRT" },
  { id: "light-1-b", mapId: "city", x: 6.78 * TILE_SIZE, y: 4.2 * TILE_SIZE, kind: "twoLightPoleB" },

  // 가로등 2 (3조각)
  { id: "light-2-lt", mapId: "city", x: 22.64 * TILE_SIZE, y: 8 * TILE_SIZE, kind: "twoLightPoleLT" },
  { id: "light-2-rt", mapId: "city", x: 23.64 * TILE_SIZE, y: 8 * TILE_SIZE, kind: "twoLightPoleRT" },
  { id: "light-2-b", mapId: "city", x: 23 * TILE_SIZE, y: 9 * TILE_SIZE, kind: "twoLightPoleB" },

  // 세탁대(연속 5조각)
  { id: "drying-1-1", mapId: "city", x: 7 * TILE_SIZE, y: 10.5 * TILE_SIZE, kind: "dryingPole1" },
  { id: "drying-1-2", mapId: "city", x: 8 * TILE_SIZE, y: 10.5 * TILE_SIZE, kind: "dryingPole2" },
  { id: "drying-1-3", mapId: "city", x: 9 * TILE_SIZE, y: 10.5 * TILE_SIZE, kind: "dryingPole3" },
  { id: "drying-1-4", mapId: "city", x: 10 * TILE_SIZE, y: 10.5 * TILE_SIZE, kind: "dryingPole4" },
  { id: "drying-1-5", mapId: "city", x: 10.1 * TILE_SIZE, y: 10.5 * TILE_SIZE, kind: "dryingPole1" },

  // 쓰레기통
  { id: "trashcan-1", mapId: "city", x: 16 * TILE_SIZE, y: 9 * TILE_SIZE, kind: "trashCan2" },
  { id: "trashcan-2", mapId: "city", x: 28.7 * TILE_SIZE, y: 9 * TILE_SIZE, kind: "trashCan2" },

  // 벤치
  { id: "bench-1", mapId: "city", x: 24 * TILE_SIZE, y: 2 * TILE_SIZE, kind: "bench" },

  // =========================================================
  // F) CITY: 보드(게시판) + 포스트잇 올라가는 영역
  // =========================================================
  // 보드(윗줄 3 + 아랫줄 3 + 다리 2)
  { id: "board-1-1", mapId: "city", x: 29.7 * TILE_SIZE, y: 1 * TILE_SIZE, kind: "board1" },
  { id: "board-1-2", mapId: "city", x: 30.7 * TILE_SIZE, y: 1 * TILE_SIZE, kind: "board2" },
  { id: "board-1-3", mapId: "city", x: 31.7 * TILE_SIZE, y: 1 * TILE_SIZE, kind: "board3" },
  { id: "board-1-4", mapId: "city", x: 29.7 * TILE_SIZE, y: 2 * TILE_SIZE, kind: "board7" },
  { id: "board-1-5", mapId: "city", x: 30.7 * TILE_SIZE, y: 2 * TILE_SIZE, kind: "board8" },
  { id: "board-1-6", mapId: "city", x: 31.7 * TILE_SIZE, y: 2 * TILE_SIZE, kind: "board9" },
  { id: "board-1-legL", mapId: "city", x: 30.2 * TILE_SIZE, y: 3 * TILE_SIZE, kind: "boardL" },
  { id: "board-1-legR", mapId: "city", x: 31.2 * TILE_SIZE, y: 3 * TILE_SIZE, kind: "boardR" },

  // =========================================================
  // G) CITY: 기타 울타리 (짧은 구간)
  // =========================================================
  { id: "fence-short-1", mapId: "city", x: 17 * TILE_SIZE, y: 3 * TILE_SIZE, kind: "fenceH2" },
  { id: "fence-short-2", mapId: "city", x: 16 * TILE_SIZE, y: 3 * TILE_SIZE, kind: "fenceH1" },

  // =========================================================
  // H) CITY: 시네마(극장) 외벽 디테일(창문/문/에어컨 등)
  // =========================================================
  { id: "cinema-win-1", mapId: "city", x: 9.3 * TILE_SIZE, y: 2 * TILE_SIZE, kind: "redWindowCenter1" },
  { id: "cinema-win-2", mapId: "city", x: 10.5 * TILE_SIZE, y: 2 * TILE_SIZE, kind: "redWindowCenter1" },
  { id: "cinema-win-3", mapId: "city", x: 11.7 * TILE_SIZE, y: 2 * TILE_SIZE, kind: "redWindowCenter1" },
  { id: "cinema-win-4", mapId: "city", x: 9.3 * TILE_SIZE, y: 3 * TILE_SIZE, kind: "redWindowCenter2" },
  { id: "cinema-win-5", mapId: "city", x: 10.5 * TILE_SIZE, y: 3 * TILE_SIZE, kind: "redWindowCenter2" },
  { id: "cinema-win-6", mapId: "city", x: 11.7 * TILE_SIZE, y: 3 * TILE_SIZE, kind: "redWindowCenter2" },
  { id: "cinema-side-1", mapId: "city", x: 8 * TILE_SIZE, y: 3 * TILE_SIZE, kind: "redWindowSide" },
  { id: "cinema-side-2", mapId: "city", x: 8 * TILE_SIZE, y: 4 * TILE_SIZE, kind: "redWindowSide" },
  { id: "cinema-side-3", mapId: "city", x: 13 * TILE_SIZE, y: 3 * TILE_SIZE, kind: "redWindowSide" },
  { id: "cinema-side-4", mapId: "city", x: 13 * TILE_SIZE, y: 4 * TILE_SIZE, kind: "redWindowSide" },
  { id: "cinema-door-1", mapId: "city", x: 9.3 * TILE_SIZE, y: 4 * TILE_SIZE, kind: "redSideDoor" },
  { id: "cinema-door-2", mapId: "city", x: 11.7 * TILE_SIZE, y: 4 * TILE_SIZE, kind: "redSideDoor" },
  { id: "cinema-door-main", mapId: "city", x: 10.5 * TILE_SIZE, y: 4 * TILE_SIZE, kind: "redBigDoor" },
  { id: "cinema-ac", mapId: "city", x: 11.7 * TILE_SIZE, y: 0 * TILE_SIZE, kind: "unit" },

  // =========================================================
  // I) CITY: 컴퓨터샵 외벽 디테일
  // =========================================================
  { id: "pc-win-1", mapId: "city", x: 25.5 * TILE_SIZE, y: 7 * TILE_SIZE, kind: "brownWindowCenter1" },
  { id: "pc-win-2", mapId: "city", x: 26.5 * TILE_SIZE, y: 7 * TILE_SIZE, kind: "brownWindowCenter1" },
  { id: "pc-win-3", mapId: "city", x: 25.5 * TILE_SIZE, y: 8 * TILE_SIZE, kind: "brownWindowCenter2" },
  { id: "pc-win-4", mapId: "city", x: 26.5 * TILE_SIZE, y: 8 * TILE_SIZE, kind: "brownWindowCenter2" },
  { id: "pc-side-1", mapId: "city", x: 24.5 * TILE_SIZE, y: 8 * TILE_SIZE, kind: "brownWindowSide" },
  { id: "pc-side-2", mapId: "city", x: 27.5 * TILE_SIZE, y: 8 * TILE_SIZE, kind: "brownWindowSide" },
  { id: "pc-side-3", mapId: "city", x: 24.5 * TILE_SIZE, y: 9 * TILE_SIZE, kind: "brownWindowSide" },
  { id: "pc-side-4", mapId: "city", x: 27.5 * TILE_SIZE, y: 9 * TILE_SIZE, kind: "brownWindowSide" },
  { id: "pc-door-l", mapId: "city", x: 25.5 * TILE_SIZE, y: 9 * TILE_SIZE, kind: "brownBigDoor1" },
  { id: "pc-door-r", mapId: "city", x: 26.5 * TILE_SIZE, y: 9 * TILE_SIZE, kind: "brownBigDoor2" },

  // =========================================================
  // J) CITY: 은행 디테일(문/간판/ATM)
  // =========================================================
  { id: "bank-door-l", mapId: "city", x: 36 * TILE_SIZE, y: 4 * TILE_SIZE, kind: "doorL" },
  { id: "bank-door-r", mapId: "city", x: 37 * TILE_SIZE, y: 4 * TILE_SIZE, kind: "doorR" },
  { id: "bank-sign-l", mapId: "city", x: 36 * TILE_SIZE, y: 3 * TILE_SIZE, kind: "signBlueL" },
  { id: "bank-sign-r", mapId: "city", x: 37 * TILE_SIZE, y: 3 * TILE_SIZE, kind: "signBlueR" },
  { id: "bank-atm-1", mapId: "city", x: 34 * TILE_SIZE, y: 4 * TILE_SIZE, kind: "atm" },
  { id: "bank-atm-2", mapId: "city", x: 35 * TILE_SIZE, y: 4 * TILE_SIZE, kind: "atm" },

  // (미사용 후보)
  // { id: "fountain-1", mapId: "city", x: 45 * TILE_SIZE, y: 5 * TILE_SIZE, kind: "fountain1" },
];


// ─────────────────────────────
// 충돌 체크 helper
// usePlayerMovementTopDown 에서 사용
// ─────────────────────────────
export function isBlockedAt(mapId: MapId, tileX: number, tileY: number): boolean {
  // const map = maps[mapId];
  // if (!map) return true;

  // if (
  //   tileX < 0 ||
  //   tileX >= map.tiles[0].length ||
  //   tileY < 0 ||
  //   tileY >= map.tiles.length
  // ) {
  //   // 맵 밖은 막힌 것으로 처리
  //   return true;
  // }

  // const tile = map.tiles[tileY][tileX];

  // // 9만 충돌 타일로 사용 (건물/울타리 영역)
  // if (tile === 9) return true;

  return false;
}
