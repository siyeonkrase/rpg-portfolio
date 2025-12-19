// src/game/pixi/GameCanvas.tsx
import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { useAtomValue } from "jotai";
import { currentMapIdAtom, playerAtom, cameraXAtom } from "../state/gameAtoms";
import { maps, scenery } from "../maps";
import { TILE_SIZE, VIEWPORT_WIDTH_TILES, VIEWPORT_HEIGHT_TILES } from "../config";
import { tiles } from "./tileset";
import { townTiles } from "./townTileset";
import { cityTiles } from "./cityTileset";
import {
  drawLandmarksAndHouses,
  attachBillboardTicker,
  type BillboardInfo,
} from "./landmarks";
import { enableDepthSorting, setCharacterDepthFromWorldY, setDepth } from "./depthSort";
import { drawStickyNotesOnBoard } from "./stickyNotes";

const WORLD_OFFSET_Y = 0;

// ─────────────────────────────
// Collision (AABB) - 최소 내장 버전
// ─────────────────────────────
type AABB = { x: number; y: number; w: number; h: number };

function aabbIntersects(a: AABB, b: AABB) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

class CollisionWorld {
  solids: AABB[] = [];
  clear() {
    this.solids = [];
  }
  add(box: AABB) {
    this.solids.push(box);
  }
  hitsAny(box: AABB) {
    for (const s of this.solids) if (aabbIntersects(box, s)) return true;
    return false;
  }
}

// ─────────────────────────────
// 레이어 & depth/occlusion 규칙
// ─────────────────────────────
type Layers = {
  ground: PIXI.Container;
  actors: PIXI.Container;
  occlusion: PIXI.Container;
};

function createLayers(): Layers {
  const ground = new PIXI.Container();
  const actors = new PIXI.Container();
  const occlusion = new PIXI.Container();
  actors.sortableChildren = true;
  return { ground, actors, occlusion };
}

// “Tall1 = 잎(top)” “Tall2 = 몸통(bottom)”을 기본 규칙으로
function isOcclusionKind(kind: string) {
  return (
    kind.endsWith("Tall1") || // 잎
    kind === "oneLightPoleT" ||
    kind === "twoLightPoleLT" ||
    kind === "twoLightPoleRT" ||
    kind.startsWith("sign") // 간판 상단류가 많으면 여기로
  );
}

// 충돌(막힘) 기본 규칙: fence/나무몸통/덤불/박스/쓰레기통 등
function isSolidKind(kind: string) {
  return (
    kind.startsWith("fence") ||
    kind.startsWith("treeGreenGroup") ||
    kind.startsWith("treeYellowGroup") ||
    kind === "treeGreenSmall" ||
    kind === "treeYellowSmall" ||
    kind === "bush" ||
    kind === "mushroom" ||
    kind === "plant" ||
    kind === "trashCan1" ||
    kind === "trashCan2" ||
    kind === "boxes1" ||
    kind === "boxes2" ||
    kind === "boxes3" ||
    kind === "boxes4" ||
    kind === "fireHyd" ||
    kind === "bench" ||
    kind === "atm" ||
    kind === "parkingMeter" ||
    kind === "barH" ||
    kind === "unit" ||
    kind === "well2" || // wellB 같은 “아랫칸”을 막고 싶으면
    kind.endsWith("Tall2") // 몸통(아랫칸)
  );
}

// tile top-left 좌표(px,py) 스프라이트의 “발(footY)”는 보통 py + TILE_SIZE
function footYForTile(px: number, py: number) {
  return py + TILE_SIZE;
}

// ─────────────────────────────
// 기존 코드들(팔레트/타일 코드 등)
// ─────────────────────────────
const palette = {
  skyBottom: 0x5f8dd3,
  playerBody: 0xfb7185,
  playerHead: 0xfff7ed,
};

const TILE_CODE = {
  EMPTY: 0,
  GRASS: 1,
  GRASS_DECO: 2,
  GRASS_FLOWER: 3,
  DIRT1: 4,
  DIRT2: 5,
  DIRT3: 6,
  DIRT4: 7,
  DIRT5: 8,
  DIRT6: 9,
  DIRT7: 10,
  DIRT8: 11,
  DIRT9: 12,
  PATH: 13,
  SIDEWALK1: 14,
  SIDEWALK2: 15,
  SIDEWALK3: 16,
  SIDEWALK4: 17,
  SIDEWALK5: 18,
  SIDEWALK6: 19,
  SIDEWALK7: 20,
  SIDEWALK8: 21,
  SIDEWALK9: 22,
  PARKINGLINE: 23,
  PARKINGSYM: 24,
  SIDEWALK10: 25,
  SIDEWALK11: 26,
  SIDEWALK12: 27,
} as const;

function groundTexFromCode(code: number): PIXI.Texture | null {
  switch (code) {
    case TILE_CODE.EMPTY:
      return null;
    case TILE_CODE.GRASS:
      return tiles.grass;
    case TILE_CODE.GRASS_DECO:
      return tiles.grassDecor;
    case TILE_CODE.GRASS_FLOWER:
      return tiles.grassFlower;
    case TILE_CODE.DIRT1:
      return tiles.dirt1;
    case TILE_CODE.DIRT2:
      return tiles.dirt2;
    case TILE_CODE.DIRT3:
      return tiles.dirt3;
    case TILE_CODE.DIRT4:
      return tiles.dirt4;
    case TILE_CODE.DIRT5:
      return tiles.dirt5;
    case TILE_CODE.DIRT6:
      return tiles.dirt6;
    case TILE_CODE.DIRT7:
      return tiles.dirt7;
    case TILE_CODE.DIRT8:
      return tiles.dirt8;
    case TILE_CODE.DIRT9:
      return tiles.dirt9;
    case TILE_CODE.PATH:
      return tiles.path;
    case TILE_CODE.SIDEWALK1:
      return townTiles.sidewalk1;
    case TILE_CODE.SIDEWALK2:
      return townTiles.sidewalk2;
    case TILE_CODE.SIDEWALK3:
      return townTiles.sidewalk3;
    case TILE_CODE.SIDEWALK4:
      return townTiles.sidewalk4;
    case TILE_CODE.SIDEWALK5:
      return townTiles.sidewalk5;
    case TILE_CODE.SIDEWALK6:
      return townTiles.sidewalk6;
    case TILE_CODE.SIDEWALK7:
      return townTiles.sidewalk7;
    case TILE_CODE.SIDEWALK8:
      return townTiles.sidewalk8;
    case TILE_CODE.SIDEWALK9:
      return townTiles.sidewalk9;
    case TILE_CODE.SIDEWALK10:
      return townTiles.sidewalk10;
    case TILE_CODE.SIDEWALK11:
      return townTiles.sidewalk11;
    case TILE_CODE.SIDEWALK12:
      return townTiles.sidewalk12;
    case TILE_CODE.PARKINGLINE:
      return townTiles.parkingLine1;
    case TILE_CODE.PARKINGSYM:
      return townTiles.parkingSymbol;
    default:
      return tiles.grass;
  }
}

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const appRef = useRef<PIXI.Application | null>(null);

  const worldRef = useRef<PIXI.Container | null>(null);
  const layersRef = useRef<Layers | null>(null);
  const playerRef = useRef<PIXI.Graphics | null>(null);
  const billboardsRef = useRef<BillboardInfo[]>([]);
  const collisionRef = useRef<CollisionWorld | null>(null);

  const currentMapId = useAtomValue(currentMapIdAtom);
  const player = useAtomValue(playerAtom);
  const cameraX = useAtomValue(cameraXAtom);
  const map = maps[currentMapId];

  // ─ 1) Pixi 앱 & 기본 노드 한 번만 생성 ─
  useEffect(() => {
    if (appRef.current || !canvasRef.current) return;

    const width = VIEWPORT_WIDTH_TILES * TILE_SIZE;
    const height = VIEWPORT_HEIGHT_TILES * TILE_SIZE;

    const app = new PIXI.Application({
      view: canvasRef.current,
      width,
      height,
      backgroundColor: palette.skyBottom,
      antialias: false,
    });

    const world = new PIXI.Container();
    world.x = 0;
    world.y = WORLD_OFFSET_Y;

    const layers = createLayers();
    world.addChild(layers.ground as any);
    world.addChild(layers.actors as any);
    world.addChild(layers.occlusion as any);

    const playerG = new PIXI.Graphics();
    // ✅ 플레이어를 stage가 아니라 actors 레이어에 넣는다 (월드 좌표로 움직이기 위해)
    layers.actors.addChild(playerG as any);

    const stage = app.stage as any;
    stage.addChild(world as any);

    enableDepthSorting(world, stage);

    appRef.current = app;
    worldRef.current = world;
    layersRef.current = layers;
    playerRef.current = playerG;

    const cw = new CollisionWorld();
    collisionRef.current = cw;

    // 다른 파일(이동 로직)에서 빨리 써먹게 global로 임시 노출 (원하면 나중에 atom으로 빼자)
    (globalThis as any).__collisionWorld = cw;

    return () => {
      app.destroy(true);
      appRef.current = null;
      worldRef.current = null;
      layersRef.current = null;
      playerRef.current = null;
      collisionRef.current = null;
      delete (globalThis as any).__collisionWorld;
    };
  }, []);

  // ─ 2) 월드(타일/건물/나무) 다시 그리기 ─
  useEffect(() => {
    const app = appRef.current;
    const world = worldRef.current;
    const layers = layersRef.current;
    const cw = collisionRef.current;
    if (!app || !world || !layers || !cw) return;

    const width = VIEWPORT_WIDTH_TILES * TILE_SIZE;
    const height = VIEWPORT_HEIGHT_TILES * TILE_SIZE;
    app.renderer.resize(width, height);

    // 레이어만 비우기 (world는 유지)
    layers.ground.removeChildren();
    layers.actors.removeChildren();
    layers.occlusion.removeChildren();

    // ✅ 플레이어는 actors에 유지해야 하니까 다시 붙여주기
    if (playerRef.current) layers.actors.addChild(playerRef.current as any);

    cw.clear();

    world.x = 0;
    world.y = WORLD_OFFSET_Y;

    // 2-1. 바닥 타일 -> ground
    const tileContainer = new PIXI.Container();
    map.tiles.forEach((row, y) => {
      row.forEach((code, x) => {
        const tex = groundTexFromCode(code);
        if (!tex) return;

        const px = x * TILE_SIZE;
        const py = y * TILE_SIZE;

        const sprite = new PIXI.Sprite(tex);
        sprite.x = px;
        sprite.y = py;
        sprite.width = TILE_SIZE;
        sprite.height = TILE_SIZE;

        setDepth(sprite, "ground"); // 너 기존 룰 유지
        tileContainer.addChild(sprite as any);
      });
    });
    layers.ground.addChild(tileContainer as any);

    // 2-2. Landmark/Houses -> 일단 actors (나중에 roof 분리하고 싶으면 drawLandmarksAndHouses 쪼개면 됨)
    const lmContainer = new PIXI.Container();
    billboardsRef.current = [];
    drawLandmarksAndHouses(lmContainer, currentMapId, billboardsRef.current);

    // lmContainer 내부 스프라이트들도 “발 기준 정렬”하려면 컨테이너째로가 아니라
    // drawLandmarksAndHouses에서 각 스프라이트마다 setCharacterDepthFromWorldY 적용하는 게 이상적.
    layers.actors.addChild(lmContainer as any);

    // 2-3. scenery -> actors / occlusion 분리 + collision 등록
    const sceneryActors = new PIXI.Container();
    const sceneryOcclusion = new PIXI.Container();

    scenery.forEach((obj) => {
      if (obj.mapId !== currentMapId) return;

      const px = obj.x; // 이미 TILE_SIZE 곱해둔 상태
      const py = obj.y;

      let tex: PIXI.Texture | null = null;

      switch (obj.kind) {
        case "treeGreenGroup1":
          tex = tiles.treeGreenGroup1;
          break;
        case "treeGreenGroup2":
          tex = tiles.treeGreenGroup2;
          break;
        case "treeGreenGroup3":
          tex = tiles.treeGreenGroup3;
          break;
        case "treeGreenGroup4":
          tex = tiles.treeGreenGroup4;
          break;
        case "treeGreenGroup5":
          tex = tiles.treeGreenGroup5;
          break;
        case "treeGreenGroup6":
          tex = tiles.treeGreenGroup6;
          break;
        case "treeGreenGroup7":
          tex = tiles.treeGreenGroup7;
          break;
        case "treeGreenGroup8":
          tex = tiles.treeGreenGroup8;
          break;
        case "treeGreenGroup9":
          tex = tiles.treeGreenGroup9;
          break;
        case "treeYellowGroup1":
          tex = tiles.treeYellowGroup1;
          break;
        case "treeYellowGroup2":
          tex = tiles.treeYellowGroup2;
          break;
        case "treeYellowGroup3":
          tex = tiles.treeYellowGroup3;
          break;
        case "treeYellowGroup4":
          tex = tiles.treeYellowGroup4;
          break;
        case "treeYellowGroup5":
          tex = tiles.treeYellowGroup5;
          break;
        case "treeYellowGroup6":
          tex = tiles.treeYellowGroup6;
          break;
        case "treeYellowGroup7":
          tex = tiles.treeYellowGroup7;
          break;
        case "treeYellowGroup8":
          tex = tiles.treeYellowGroup8;
          break;
        case "treeYellowGroup9":
          tex = tiles.treeYellowGroup9;
          break;
        case "bush":
          tex = tiles.bush;
          break;
        case "treeYellowSmall":
          tex = tiles.treeYellowSmall;
          break;
        case "treeGreenSmall":
          tex = tiles.treeGreenSmall;
          break;
        case "plant":
          tex = tiles.plant;
          break;
        case "mushroom":
          tex = tiles.mushroom;
          break;
        case "treeYellowTall1":
          tex = tiles.treeYellowTall1;
          break;
        case "treeYellowTall2":
          tex = tiles.treeYellowTall2;
          break;
        case "treeGreenTall1":
          tex = tiles.treeGreenTall1;
          break;
        case "treeGreenTall2":
          tex = tiles.treeGreenTall2;
          break;
        case "well1":
          tex = tiles.wellT;
          break;
        case "well2":
          tex = tiles.wellB;
          break;
        case "fenceSquare1":
          tex = tiles.fenceSquare1;
          break;
        case "fenceSquare2":
          tex = tiles.fenceSquare2;
          break;
        case "fenceSquare3":
          tex = tiles.fenceSquare3;
          break;
        case "fenceSquare4":
          tex = tiles.fenceSquare4;
          break;
        case "fenceSquare5":
          tex = tiles.fenceSquare5;
          break;
        case "fenceSquare6":
          tex = tiles.fenceSquare6;
          break;
        case "fenceSquare7":
          tex = tiles.fenceSquare7;
          break;
        case "fenceSquare8":
          tex = tiles.fenceSquare8;
          break;
        case "fenceH1":
          tex = tiles.fenceH1;
          break;
        case "fenceH2":
          tex = tiles.fenceH2;
          break;
        case "fenceH3":
          tex = tiles.fenceH3;
          break;
        case "fenceV1":
          tex = tiles.fenceV1;
          break;
        case "fenceV2":
          tex = tiles.fenceV2;
          break;
        case "fenceV3":
          tex = tiles.fenceV3;
          break;
        case "sign":
          tex = tiles.sign;
          break;
        case "oneLightPoleT":
          tex = townTiles.oneLightPoleT;
          break;
        case "oneLightPoleB":
          tex = townTiles.oneLightPoleB;
          break;
        case "twoLightPoleLT":
          tex = townTiles.twoLightPoleLT;
          break;
        case "twoLightPoleRT":
          tex = townTiles.twoLightPoleRT;
          break;
        case "twoLightPoleB":
          tex = townTiles.twoLightPoleB;
          break;
        case "dryingPole1":
          tex = townTiles.dryingPole1;
          break;
        case "dryingPole2":
          tex = townTiles.dryingPole2;
          break;
        case "dryingPole3":
          tex = townTiles.dryingPole3;
          break;
        case "dryingPole4":
          tex = townTiles.dryingPole4;
          break;
        case "dryingPole5":
          tex = townTiles.dryingPole5;
          break;
        case "trashCan1":
          tex = townTiles.trashCan1;
          break;
        case "trashCan2":
          tex = townTiles.trashCan2;
          break;
        case "fireHyd":
          tex = townTiles.fireHyd;
          break;
        case "boxes1":
          tex = townTiles.boxes1;
          break;
        case "boxes2":
          tex = townTiles.boxes2;
          break;
        case "boxes3":
          tex = townTiles.boxes3;
          break;
        case "boxes4":
          tex = townTiles.boxes4;
          break;

        case "bench":
          tex = townTiles.bench;
          break;

        case "signRedL":
          tex = cityTiles.signRedL;
          break;
        case "signRedR":
          tex = cityTiles.signRedR;
          break;
        case "signBlueL":
          tex = cityTiles.signBlueL;
          break;
        case "signBlueR":
          tex = cityTiles.signBlueR;
          break;
        case "atm":
          tex = cityTiles.atm;
          break;

        case "parkingMeter":
          tex = townTiles.parkingMeter;
          break;
        case "barH":
          tex = townTiles.barH;
          break;

        case "board1":
          tex = cityTiles.board1;
          break;
        case "board2":
          tex = cityTiles.board2;
          break;
        case "board3":
          tex = cityTiles.board3;
          break;
        case "board4":
          tex = cityTiles.board4;
          break;
        case "board5":
          tex = cityTiles.board5;
          break;
        case "board6":
          tex = cityTiles.board6;
          break;
        case "board7":
          tex = cityTiles.board7;
          break;
        case "board8":
          tex = cityTiles.board8;
          break;
        case "board9":
          tex = cityTiles.board9;
          break;
        case "boardL":
          tex = cityTiles.boardL;
          break;
        case "boardR":
          tex = cityTiles.boardR;
          break;

        default:
          tex = null;
          break;
      }

      if (!tex) return;

      const sprite = new PIXI.Sprite(tex);
      sprite.x = px;
      sprite.y = py;
      sprite.width = TILE_SIZE;
      sprite.height = TILE_SIZE;

      const footY = footYForTile(px, py);
      // ✅ actors에 올라갈 애들만 depth 정렬 의미가 있음
      if (isOcclusionKind(obj.kind)) {
        sceneryOcclusion.addChild(sprite as any);
      } else {
        setCharacterDepthFromWorldY(sprite as any, footY);
        sceneryActors.addChild(sprite as any);
      }

      // ✅ collision 등록 (일단 타일 1칸짜리 AABB로 시작)
      if (isSolidKind(obj.kind)) {
        cw.add({ x: px, y: py, w: TILE_SIZE, h: TILE_SIZE });
      }

      // ✅ 보드 포스트잇은 “보드가 actors에 올라갈 때” 같이 올라가야 자연스럽다
      if (obj.kind === "board2") {
        const SCALE_FIX = 1;

        const boardFaceX = px - TILE_SIZE * SCALE_FIX;
        const boardFaceY = py;
        const boardFaceW = TILE_SIZE * 3 * SCALE_FIX;
        const boardFaceH = TILE_SIZE * 2 * SCALE_FIX;

        const offsetX = 6 * SCALE_FIX;
        const offsetY = 6 * SCALE_FIX;
        const bottomOffset = 10 * SCALE_FIX;

        const faceX = boardFaceX + offsetX;
        const faceY = boardFaceY + offsetY + 2;
        const faceW = boardFaceW - offsetX * 2;
        const faceH = boardFaceH - offsetY - bottomOffset;

        drawStickyNotesOnBoard(sceneryActors, faceX, faceY, faceW, faceH, 6);
      }
    });

    layers.actors.addChild(sceneryActors as any);
    layers.occlusion.addChild(sceneryOcclusion as any);

    // 초기 1회 정렬
    layers.actors.sortChildren();
  }, [map, currentMapId]);

  // ─ 3) 카메라 & 플레이어만 업데이트 ─
  useEffect(() => {
    const world = worldRef.current;
    const layers = layersRef.current;
    const playerG = playerRef.current;
    if (!world || !layers || !playerG) return;

    // 카메라: 월드를 통째로 이동
    world.x = -cameraX;
    world.y = WORLD_OFFSET_Y;

    // ✅ 플레이어는 월드 좌표로 위치만 갱신
    playerG.x = player.x;
    playerG.y = player.y + WORLD_OFFSET_Y;

    // ✅ depth = footY
    setCharacterDepthFromWorldY(playerG as any, playerG.y);

    // Graphics는 로컬(0,0) 기준으로 그림
    playerG.clear();

    const bodyW = TILE_SIZE * 0.5;
    const bodyH = TILE_SIZE * 0.9;
    const head = TILE_SIZE * 0.42;

    const bodyX = -bodyW / 2;
    const bodyY = -bodyH;
    const headX = -head / 2;
    const headY = bodyY - head;

    playerG.beginFill(palette.playerBody);
    playerG.drawRect(bodyX, bodyY, bodyW, bodyH);
    playerG.endFill();

    playerG.beginFill(palette.playerHead);
    playerG.drawRect(headX, headY, head, head);
    playerG.endFill();

    // ✅ 필요하면 “플레이어가 타일 경계 넘어갈 때만” sortChildren()로 최적화 가능
    layers.actors.sortChildren();
  }, [player, cameraX]);

  useEffect(() => {
    const app = appRef.current;
    if (!app) return;
    return attachBillboardTicker(app, billboardsRef);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        imageRendering: "pixelated",
        border: "2px solid #e5e7eb",
        backgroundColor: "#0f172a",
        width: "100vw",
        height: "auto",
        maxHeight: "100vh",
        display: "block",
      }}
    />
  );
}
