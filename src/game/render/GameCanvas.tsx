import { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { useAtom, useAtomValue } from "jotai";
import { currentMapIdAtom, playerAtom, cameraXAtom, activeInteractableAtom, interactHintAtom, activeProjectAtom, inventoryAtom, activeInteractableActionAtom } from "../state/gameAtoms";
import { maps, scenery, landmarks, houses } from "../data/maps";
import { TILE_SIZE, LOGICAL_W, LOGICAL_H } from "../data/config";

import { tiles } from "../render/tilesets/tileset";
import { townTiles } from "../render/tilesets/townTileset";
import { cityTiles } from "../render/tilesets/cityTileset";
import {
  drawLandmarksAndHouses,
  attachBillboardTicker,
  type BillboardInfo,
  LANDMARK_DEFS,
  addChurchSprite,
} from "../render/draw/drawLandmarks";

import { enableDepthSorting, setCharacterDepthFromWorldY, setDepth } from "../pixi/depthSort";
import { drawStickyNotesOnBoard } from "../render/draw/drawStickyNotes";
import cinemaSignPng from "../../assets/cinemaSign.png";

import { PlayerSprite } from "../pixi/player/PlayerSprite";
import villagerManPng from "../../assets/MiniVillagerMan.png";
import { makeVillagerAnim } from "../pixi/player/playerAnims";
import { playItemAcquiredEffect } from "./draw/ItemEffect";
import { PROJECT_INVENTORY_ICONS } from "../data/projectInventory";

const WORLD_OFFSET_Y = 0;

const BUILDING_DETAIL_KINDS = new Set<string>([
  "redWindowCenter1",
  "redWindowCenter2",
  "redWindowSide",
  "redSideDoor",
  "redBigDoor",
  "unit",
  "brownWindowCenter1",
  "brownWindowCenter2",
  "brownWindowSide",
  "brownBigDoor1",
  "brownBigDoor2",
  "doorL",
  "doorR",
  "signBlueL",
  "signBlueR",
  "atm",
]);

function isBuildingDetailKind(kind: string) {
  return BUILDING_DETAIL_KINDS.has(kind);
}

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

type Layers = {
  ground: PIXI.Container;
  actors: PIXI.Container;
  buildingDetail: PIXI.Container;
  player: PIXI.Container;
  overlay: PIXI.Container;
};

function createLayers(): Layers {
  const ground = new PIXI.Container();
  const actors = new PIXI.Container();
  const buildingDetail = new PIXI.Container();
  const player = new PIXI.Container();
  const overlay = new PIXI.Container();

  actors.sortableChildren = true;
  buildingDetail.sortableChildren = true;
  player.sortableChildren = true;
  overlay.sortableChildren = true;

  return { ground, actors, buildingDetail, player, overlay };
}

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
    kind.startsWith("well") ||
    kind.endsWith("Tall2") ||
    kind.endsWith("Tall1") ||
    kind.startsWith("board") ||
    kind.startsWith("drying") ||
    kind.startsWith("oneLight") ||
    kind.startsWith("twoLight") ||
    kind.startsWith("sunflower")
  );
}

const palette = {
  skyBottom: 0x5f8dd3,
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
    default:
      return tiles.grass;
  }
}

export function GameCanvas() {
  const [assetsReady, setAssetsReady] = useState(false);
  const [activeInteractable, setActiveInteractable] = useAtom(activeInteractableAtom);
  const [hint, setHint] = useAtom(interactHintAtom);
  const [activeProject, setActiveProject] = useAtom(activeProjectAtom);
  const [, setActiveAction] = useAtom(activeInteractableActionAtom);
  const inventory = useAtomValue(inventoryAtom);
  const lastCountRef = useRef(inventory.size);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const appRef = useRef<PIXI.Application | null>(null);

  const rootRef = useRef<PIXI.Container | null>(null);
  const cameraLayerRef = useRef<PIXI.Container | null>(null);

  const layersRef = useRef<Layers | null>(null);

  const playerSpriteRef = useRef<PlayerSprite | null>(null);
  const prevPosRef = useRef<{ x: number; y: number } | null>(null);

  const billboardsRef = useRef<BillboardInfo[]>([]);
  const collisionRef = useRef<CollisionWorld | null>(null);

  const currentMapId = useAtomValue(currentMapIdAtom);
  const player = useAtomValue(playerAtom);
  const cameraX = useAtomValue(cameraXAtom);

  const map = maps[currentMapId];

  const interactablesRef = useRef<Interactable[]>([]);

    type Interactable = {
    id: string;
    aabb: AABB;
    hint: string;
    action: { type: "project"; projectId: string } | { type: "dialogue"; lines: string[] };
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await PIXI.Assets.load([cinemaSignPng, villagerManPng]);
      } catch (e) {
        console.warn("[assets] load failed (continuing anyway)", e);
      } finally {
        if (!cancelled) setAssetsReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (appRef.current || !canvasRef.current) return;

    const app = new PIXI.Application({
      view: canvasRef.current,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: palette.skyBottom,
      antialias: false,
      autoDensity: true,
      resolution: window.devicePixelRatio || 1,
    });

    const root = new PIXI.Container();
    const cameraLayer = new PIXI.Container();
    root.addChild(cameraLayer as any);

    const layers = createLayers();
    cameraLayer.sortableChildren = true;

    layers.ground.zIndex = 0;
    layers.actors.zIndex = 10;
    layers.buildingDetail.zIndex = 20;
    layers.player.zIndex = 30;
    layers.overlay.zIndex = 40;

    cameraLayer.addChild(layers.ground as any);
    cameraLayer.addChild(layers.actors as any);
    cameraLayer.addChild(layers.buildingDetail as any);
    cameraLayer.addChild(layers.player as any);
    cameraLayer.addChild(layers.overlay as any);
    cameraLayer.sortChildren();

    const tex = PIXI.Texture.from(villagerManPng);
    const playerSprite = new PlayerSprite({
      texture: tex,
      tileSize: TILE_SIZE,
      sizeTiles: 2.2,
      frameW: 32,
      frameH: 32,
      rows: { down: 0, up: 0, right: 1, left: 1 },
      idleRow: 0,
      walkCols: [1, 2, 3, 4],
      idleCol: 0,
    });

    playerSprite.setAnimSet(
      makeVillagerAnim({
        frameW: 32,
        frameH: 32,
        idleRow: 0,
        sideRow: 1,
        verticalRow: 1,
        idleCol: 0,
        walkCols: [0, 1, 2, 3, 4, 5],
        jumpCols: [0, 1, 2],
        speed: 0.18,
      })
    );

    playerSpriteRef.current = playerSprite;
    prevPosRef.current = { x: player.x, y: player.y };

    layers.player.addChild(playerSprite.sprite as any);

    app.stage.addChild(root as any);
    enableDepthSorting(cameraLayer, app.stage);

    const cw = new CollisionWorld();
    collisionRef.current = cw;
    (globalThis as any).__collisionWorld = cw;

    appRef.current = app;
    rootRef.current = root;
    cameraLayerRef.current = cameraLayer;
    layersRef.current = layers;

    const doResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      app.renderer.resize(w, h);

      const scale = Math.max(w / LOGICAL_W, h / LOGICAL_H);
      const intScale = Math.max(1, Math.ceil(scale));

      root.scale.set(intScale);
      root.x = Math.floor((w - LOGICAL_W * intScale) / 2);
      root.y = Math.floor((h - LOGICAL_H * intScale) / 2);
    };

    doResize();
    window.addEventListener("resize", doResize);

    return () => {
      window.removeEventListener("resize", doResize);
      app.destroy(true);

      appRef.current = null;
      rootRef.current = null;
      cameraLayerRef.current = null;
      layersRef.current = null;
      collisionRef.current = null;
      playerSpriteRef.current = null;
      prevPosRef.current = null;
      delete (globalThis as any).__collisionWorld;
    };
  }, []);

  useEffect(() => {
    const cameraLayer = cameraLayerRef.current;
    const layers = layersRef.current;
    const cw = collisionRef.current;

    if (!cameraLayer || !layers || !cw || !map) return;

    interactablesRef.current = [];
    setActiveInteractable(null);
    setHint(null);

    layers.ground.removeChildren();
    layers.actors.removeChildren();
    layers.buildingDetail.removeChildren();
    layers.overlay.removeChildren();

    cw.clear();
    billboardsRef.current = [];

    const tileLayer = new PIXI.Container();
    setDepth(tileLayer as any, "ground");

    for (let y = 0; y < map.tiles.length; y++) {
      const row = map.tiles[y];
      for (let x = 0; x < row.length; x++) {
        const tex = groundTexFromCode(row[x]);
        if (!tex) continue;

        const s = new PIXI.Sprite(tex);
        s.x = x * TILE_SIZE;
        s.y = y * TILE_SIZE;
        s.width = TILE_SIZE;
        s.height = TILE_SIZE;
        setDepth(s as any, "ground");
        tileLayer.addChild(s as any);
      }
    }
    layers.ground.addChild(tileLayer as any);

    drawLandmarksAndHouses(
      { building: layers.actors, object: layers.actors, overlay: layers.overlay } as any,
      currentMapId,
      billboardsRef.current
    );

    for (const lm of landmarks) {
      if (lm.kind !== "board") continue;

      const def = (LANDMARK_DEFS as any)[lm.kind];
      if (!def) continue;

      const boardFaceX = lm.x - (def.width * TILE_SIZE) / 2;
      const boardFaceY = lm.y - def.height * TILE_SIZE;
      const boardFaceW = def.width * TILE_SIZE;
      const boardFaceH = def.height * TILE_SIZE;

      const offsetX = 6;
      const offsetY = 6;
      const bottomOffset = 10;

      const faceX = boardFaceX + offsetX;
      const faceY = boardFaceY + offsetY + 2;
      const faceW = boardFaceW - offsetX * 2;
      const faceH = boardFaceH - offsetY - bottomOffset;

      drawStickyNotesOnBoard(layers.buildingDetail, faceX, faceY, faceW, faceH, 6);
    }

    const churchX = 43 * TILE_SIZE;
    const churchY = 6 * TILE_SIZE;
    addChurchSprite(layers.buildingDetail, churchX, churchY);

    const CHURCH_W_TILES = 5;
    const churchW = CHURCH_W_TILES * TILE_SIZE;

    const CHURCH_SRC_W = 1536;
    const CHURCH_SRC_H = 1024;
    const churchH = (CHURCH_SRC_H / CHURCH_SRC_W) * churchW;

    const boxX = churchX - churchW / 2;
    const boxY = churchY - churchH;
    const boxW = churchW;
    const boxH = churchH;

    cw.add({ x: boxX, y: boxY, w: boxW, h: boxH });

    for (const lm of landmarks) {
      const def = (LANDMARK_DEFS as any)[lm.kind];
      if (!def) continue;

      const left = lm.x - (def.width * TILE_SIZE) / 2;
      const top = lm.y - def.height * TILE_SIZE;

      cw.add({ x: left, y: top, w: def.width * TILE_SIZE, h: def.height * TILE_SIZE });
    }

    const PROJECT_BY_LANDMARK_ID: Record<string, string> = {
      "lm-cinema": "flickfacts",
      "lm-computer": "chromeapp",
      "lm-bank": "crypto",
      "lm-board": "bento",
    };

    for (const lm of landmarks) {
      const def = (LANDMARK_DEFS as any)[lm.kind];
      if (!def) continue;

      const left = lm.x - (def.width * TILE_SIZE) / 2;
      const top = lm.y - def.height * TILE_SIZE;

      const doorW = TILE_SIZE * 2.2;
      const doorH = TILE_SIZE * 1.6;

      const doorX = lm.x - doorW / 2;
      const doorY = lm.y - doorH;

      const aabb =
        lm.kind === "board"
          ? { x: left, y: top, w: TILE_SIZE * def.width, h: TILE_SIZE * (def.height + 1) }
          : { x: doorX, y: doorY, w: doorW, h: doorH };

      const projectId = PROJECT_BY_LANDMARK_ID[lm.id];
      if (!projectId) continue;
      if (lm.kind === "board") {
        console.log("[board]", { id: lm.id, projectId, aabb, def });
      }

      interactablesRef.current.push({
        id: lm.id,
        aabb,
        hint: "E : Open",
        action: { type: "project", projectId },
      });
    }

    addChurchSprite(layers.buildingDetail, churchX, churchY);

    interactablesRef.current.push({
      id: "lm-church",
      aabb: {
        x: churchX - TILE_SIZE * 1.2,
        y: churchY - TILE_SIZE * 1.6,
        w: TILE_SIZE * 2.4,
        h: TILE_SIZE * 1.6,
      },
      hint: "E : Open",
      action: { type: "project", projectId: "wedding" },
    });

    for (const h of houses) {
      const houseWidthTiles = h.kind === "orangeS" || h.kind === "blueS" ? 3 : 4;
      const houseHeightTiles = 3;

      const worldX = h.x * TILE_SIZE;
      const groundY = h.y * TILE_SIZE;

      const left = worldX - (houseWidthTiles * TILE_SIZE) / 2;
      const top = groundY - houseHeightTiles * TILE_SIZE;

      cw.add({ x: left, y: top, w: houseWidthTiles * TILE_SIZE, h: houseHeightTiles * TILE_SIZE });
    }

    const sceneryActors = new PIXI.Container();
    const sceneryOverlay = new PIXI.Container();

    for (const obj of scenery) {
      let tex: PIXI.Texture | null = null;

      switch (obj.kind) {
        case "treeGreenGroup1": tex = tiles.treeGreenGroup1; break;
        case "treeGreenGroup2": tex = tiles.treeGreenGroup2; break;
        case "treeGreenGroup3": tex = tiles.treeGreenGroup3; break;
        case "treeGreenGroup4": tex = tiles.treeGreenGroup4; break;
        case "treeGreenGroup5": tex = tiles.treeGreenGroup5; break;
        case "treeGreenGroup6": tex = tiles.treeGreenGroup6; break;
        case "treeGreenGroup7": tex = tiles.treeGreenGroup7; break;
        case "treeGreenGroup8": tex = tiles.treeGreenGroup8; break;
        case "treeGreenGroup9": tex = tiles.treeGreenGroup9; break;

        case "treeYellowGroup1": tex = tiles.treeYellowGroup1; break;
        case "treeYellowGroup2": tex = tiles.treeYellowGroup2; break;
        case "treeYellowGroup3": tex = tiles.treeYellowGroup3; break;
        case "treeYellowGroup4": tex = tiles.treeYellowGroup4; break;
        case "treeYellowGroup5": tex = tiles.treeYellowGroup5; break;
        case "treeYellowGroup6": tex = tiles.treeYellowGroup6; break;
        case "treeYellowGroup7": tex = tiles.treeYellowGroup7; break;
        case "treeYellowGroup8": tex = tiles.treeYellowGroup8; break;
        case "treeYellowGroup9": tex = tiles.treeYellowGroup9; break;

        case "bush": tex = tiles.bush; break;
        case "treeYellowSmall": tex = tiles.treeYellowSmall; break;
        case "treeGreenSmall": tex = tiles.treeGreenSmall; break;
        case "plant": tex = tiles.plant; break;
        case "mushroom": tex = tiles.mushroom; break;
        case "sunflowerT": tex = tiles.sunflowerT; break;
        case "sunflowerB": tex = tiles.sunflowerB; break;

        case "treeYellowTall1": tex = tiles.treeYellowTall1; break;
        case "treeYellowTall2": tex = tiles.treeYellowTall2; break;
        case "treeGreenTall1": tex = tiles.treeGreenTall1; break;
        case "treeGreenTall2": tex = tiles.treeGreenTall2; break;

        case "well1": tex = tiles.wellT; break;
        case "well2": tex = tiles.wellB; break;

        case "fenceSquare1": tex = tiles.fenceSquare1; break;
        case "fenceSquare2": tex = tiles.fenceSquare2; break;
        case "fenceSquare3": tex = tiles.fenceSquare3; break;
        case "fenceSquare4": tex = tiles.fenceSquare4; break;
        case "fenceSquare5": tex = tiles.fenceSquare5; break;
        case "fenceSquare6": tex = tiles.fenceSquare6; break;
        case "fenceSquare7": tex = tiles.fenceSquare7; break;
        case "fenceSquare8": tex = tiles.fenceSquare8; break;

        case "fenceH1": tex = tiles.fenceH1; break;
        case "fenceH2": tex = tiles.fenceH2; break;
        case "fenceH3": tex = tiles.fenceH3; break;
        case "fenceV1": tex = tiles.fenceV1; break;
        case "fenceV2": tex = tiles.fenceV2; break;
        case "fenceV3": tex = tiles.fenceV3; break;

        case "sign": tex = tiles.sign; break;

        case "oneLightPoleT": tex = townTiles.oneLightPoleT; break;
        case "oneLightPoleB": tex = townTiles.oneLightPoleB; break;
        case "twoLightPoleLT": tex = townTiles.twoLightPoleLT; break;
        case "twoLightPoleRT": tex = townTiles.twoLightPoleRT; break;
        case "twoLightPoleB": tex = townTiles.twoLightPoleB; break;

        case "dryingPole1": tex = townTiles.dryingPole1; break;
        case "dryingPole2": tex = townTiles.dryingPole2; break;
        case "dryingPole3": tex = townTiles.dryingPole3; break;
        case "dryingPole4": tex = townTiles.dryingPole4; break;
        case "dryingPole5": tex = townTiles.dryingPole5; break;

        case "trashCan1": tex = townTiles.trashCan1; break;
        case "trashCan2": tex = townTiles.trashCan2; break;
        case "fireHyd": tex = townTiles.fireHyd; break;

        case "boxes1": tex = townTiles.boxes1; break;
        case "boxes2": tex = townTiles.boxes2; break;
        case "boxes3": tex = townTiles.boxes3; break;
        case "boxes4": tex = townTiles.boxes4; break;

        case "bench": tex = townTiles.bench; break;
        case "parkingMeter": tex = townTiles.parkingMeter; break;
        case "barH": tex = townTiles.barH; break;

        case "signRedL": tex = cityTiles.signRedL; break;
        case "signRedR": tex = cityTiles.signRedR; break;
        case "signBlueL": tex = cityTiles.signBlueL; break;
        case "signBlueR": tex = cityTiles.signBlueR; break;
        case "atm": tex = cityTiles.atm; break;

        case "board1": tex = cityTiles.board1; break;
        case "board2": tex = cityTiles.board2; break;
        case "board3": tex = cityTiles.board3; break;
        case "board4": tex = cityTiles.board4; break;
        case "board5": tex = cityTiles.board5; break;
        case "board6": tex = cityTiles.board6; break;
        case "board7": tex = cityTiles.board7; break;
        case "board8": tex = cityTiles.board8; break;
        case "board9": tex = cityTiles.board9; break;
        case "boardL": tex = cityTiles.boardL; break;
        case "boardR": tex = cityTiles.boardR; break;

        case "redWindowCenter1": tex = townTiles.redWindowCenter1; break;
        case "redWindowCenter2": tex = townTiles.redWindowCenter2; break;
        case "redWindowSide": tex = townTiles.redWindowSide; break;
        case "redSideDoor": tex = townTiles.redSideDoor; break;
        case "redBigDoor": tex = townTiles.redBigDoor; break;
        case "unit": tex = townTiles.unit; break;

        case "brownWindowCenter1": tex = townTiles.brownWindowCenter1; break;
        case "brownWindowCenter2": tex = townTiles.brownWindowCenter2; break;
        case "brownWindowSide": tex = townTiles.brownWindowSide; break;
        case "brownBigDoor1": tex = townTiles.brownBigDoor1; break;
        case "brownBigDoor2": tex = townTiles.brownBigDoor2; break;

        case "doorL": tex = cityTiles.doorL; break;
        case "doorR": tex = cityTiles.doorR; break;
        case "signBlueL": tex = cityTiles.signBlueL; break;
        case "signBlueR": tex = cityTiles.signBlueR; break;
        case "atm": tex = cityTiles.atm; break;

        case "tomato": tex = tiles.tomato; break;
        case "radish": tex = tiles.radish; break;
        case "corn": tex = tiles.corn; break;
        case "carrot": tex = tiles.carrot; break;
        case "carrot2": tex = tiles.carrot2; break;

        default:
          tex = null;
          break;
      }

      if (!tex) continue;

      const px = obj.x;
      const py = obj.y;

      const s = new PIXI.Sprite(tex);
      s.x = px;
      s.y = py;
      s.width = TILE_SIZE;
      s.height = TILE_SIZE;

      if (isBuildingDetailKind(obj.kind)) {
        s.zIndex = 0;
        sceneryOverlay.addChild(s as any);
        continue;
      }

      if (isSolidKind(obj.kind)) {
        cw.add({ x: px, y: py, w: TILE_SIZE, h: TILE_SIZE });
      }

      setCharacterDepthFromWorldY(s as any, py + TILE_SIZE);
      sceneryActors.addChild(s as any);
    }

    if (playerSpriteRef.current) {
      layers.player.removeChildren();
      layers.player.addChild(playerSpriteRef.current.sprite as any);
    }
    
    layers.actors.addChild(sceneryActors as any);
    layers.buildingDetail.addChild(sceneryOverlay as any);

    layers.actors.sortChildren();
    layers.buildingDetail.sortChildren();
    layers.overlay.sortChildren();
  }, [currentMapId, map, assetsReady]);

  useEffect(() => {
    const cameraLayer = cameraLayerRef.current;
    const ps = playerSpriteRef.current;
    if (!cameraLayer || !ps) return;
    
    cameraLayer.x = -cameraX;
    cameraLayer.y = WORLD_OFFSET_Y;

    ps.sprite.x = player.x;
    ps.sprite.y = player.y + WORLD_OFFSET_Y;

    ps.setDirection(player.dir, player.moving);

    setCharacterDepthFromWorldY(ps.sprite as any, player.y + WORLD_OFFSET_Y);

    prevPosRef.current = { x: player.x, y: player.y };
  }, [player.x, player.y, player.dir, player.moving, cameraX]);

  useEffect(() => {
    const app = appRef.current;
    if (!app) return;

    const cleanup = attachBillboardTicker(app, billboardsRef as unknown as { current: BillboardInfo[] });
    return () => cleanup?.();
  }, []);

  useEffect(() => {
    if (activeProject) return;

    const app = appRef.current;
    if (!app) return;

    const update = () => {
      const ps = playerSpriteRef.current;
      if (!ps) return;

      const px = ps.sprite.x;
      const py = ps.sprite.y;

      const probe: AABB = {
        x: px - TILE_SIZE * 0.6,
        y: py - TILE_SIZE * 0.9,
        w: TILE_SIZE * 1.2,
        h: TILE_SIZE * 0.9,
      };

      const list = interactablesRef.current;
      let hit: Interactable | null = null;

      for (const it of list) {
        if (aabbIntersects(probe, it.aabb)) {
          hit = it;
          break;
        }
      }

      const nextId = hit ? hit.id : null;

      if (nextId !== activeInteractable) {
        setActiveInteractable(nextId);
        setHint(hit ? hit.hint : null);
        setActiveAction(hit ? hit.action : null);
      }
    };

    app.ticker.add(update);
    return () => {
      app.ticker.remove(update);
    };
  }, [activeInteractable, setActiveInteractable, setHint]);

  useEffect(() => {
    console.log("현재 인벤토리 크기:", inventory.size);

    if (inventory.size > lastCountRef.current) {
      const sprite = playerSpriteRef.current;
      const layers = layersRef.current;

      if (sprite && layers) {
        const inventoryArray = Array.from(inventory);
        const lastItemId = inventoryArray[inventoryArray.length - 1];

        const texture = PIXI.Texture.from(PROJECT_INVENTORY_ICONS[lastItemId] || PROJECT_INVENTORY_ICONS[0]);

        playItemAcquiredEffect(
          layers.player, 
          sprite.sprite.x, 
          sprite.sprite.y, 
          texture
        );
      }
    }
    lastCountRef.current = inventory.size;
  }, [inventory]);

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <canvas
        id="game-canvas"
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          imageRendering: "pixelated",
          zIndex: 0,
        }}
      />
    </div>
  );
}