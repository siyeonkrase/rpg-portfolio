import * as PIXI from "pixi.js";
import { TILE_SIZE } from "../../data/config";
import { landmarks, houses, type LandmarkKind } from "../../data/maps";
import { tiles } from "../tilesets/tileset";
import { townTiles } from "../tilesets/townTileset";
import { cityTiles } from "../tilesets/cityTileset";
import { setDepth } from "../../engine/depth";
import { GAME_ASSETS } from "../../data/gameAssets";
import { CollisionWorld } from "../../engine/collisionWorld";

export type PriceCell = { text: PIXI.Text; row: number; col: number };

export type BillboardInfo =
  | {
      kind: "simple";
      g: PIXI.Graphics;
    }
  | {
      kind: "bank";
      bilboard: PIXI.Graphics;
      width: number;
      height: number;
      cells: PriceCell[];
    }
  | {
      kind: "sprite";
      sprite: PIXI.Sprite;
      baseY: number;
      amp: number;
      speed: number;
      phase: number;
    };

export type BillboardRefLike = { current: BillboardInfo[] };

type SpriteBillboardOpts = {
  landmarkKind: LandmarkKind;
  texture: PIXI.Texture;     

  widthRatio?: number;
  offsetX?: number;   
  offsetY?: number;   

  hoverAmpTiles?: number;
  hoverSpeed?: number;   
  hoverPhase?: number;   
};

export const BUILDING_DETAIL_KINDS = new Set<string>([
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

export function isBuildingDetailKind(kind: string) {
  return BUILDING_DETAIL_KINDS.has(kind);
}

export function drawSceneryObjects(
  sceneryList: any[], 
  layers: { world: PIXI.Container; buildingDetail: PIXI.Container },
  cw: CollisionWorld,
  isSolidKind: (kind: string) => boolean
) {
  for (const obj of sceneryList) {
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

    const sprite = new PIXI.Sprite(tex);
    sprite.x = obj.x;
    sprite.y = obj.y;
    sprite.width = TILE_SIZE;
    sprite.height = TILE_SIZE;

    // let finalFootY = sprite.y + TILE_SIZE;

    //   if(obj.kind === "sunflowerT") {
    //     finalFootY = sprite.y + TILE_SIZE * 2;
    //   }

    // 1. 빌딩 디테일인 경우 (창문, 문 등) -> Overlay 성격의 레이어로
    if (isBuildingDetailKind(obj.kind)) {
      setDepth(sprite as any, "buildingDetail");
      layers.buildingDetail.addChild(sprite as any);
      continue;
    }

    // 2. 물리적 충돌이 필요한 경우 -> CollisionWorld에 추가
    if (isSolidKind(obj.kind)) {
      cw.add({ x: obj.x, y: obj.y, w: TILE_SIZE, h: TILE_SIZE });
    }

    // 3. 일반 오브젝트 (나무 등)
    layers.world.addChild(sprite as any);
  }
}

export function isSolidKind(kind: string) {
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

function addLandmarkSpriteBillboard(
  container: PIXI.Container,
  centerWorldX: number,
  groundWorldY: number,
  registry: BillboardInfo[],
  opts: SpriteBillboardOpts
): PIXI.Sprite | null {
  const def = LANDMARK_DEFS[opts.landmarkKind];
  if (!def) return null;

  const left = centerWorldX - (def.width * TILE_SIZE) / 2;
  const top = groundWorldY - def.height * TILE_SIZE;

  const sprite = new PIXI.Sprite(opts.texture);

  const widthRatio = opts.widthRatio ?? 0.7;
  const targetW = def.width * TILE_SIZE * widthRatio;
  const texW = opts.texture.width;

  const scale = texW ? targetW / texW : 1;
  sprite.scale.set(scale);

  const offsetX = opts.offsetX ?? 0;
  const offsetY = opts.offsetY ?? 0;

  sprite.x = left + (def.width * TILE_SIZE - sprite.width) / 2 + offsetX;
  sprite.y = top + offsetY;

  setDepth(sprite as any, "overlay");
  container.addChild(sprite as any);

  const baseY = sprite.y;
  const amp = TILE_SIZE * (opts.hoverAmpTiles ?? 0);
  const speed = opts.hoverSpeed ?? 0.06;

  registry.push({
    kind: "sprite",
    sprite,
    baseY,
    amp,
    speed,
    phase: opts.hoverPhase ?? Math.random() * Math.PI * 2,
  });

  return sprite;
}

type LandmarkDef = {
  width: number;
  height: number;
  rows: (PIXI.Texture | null)[][];
};

export const DOOR_TILE_IDS_BY_LANDMARK_ID: Record<string, string[]> = {
  "lm-cinema": ["cinema-door-main"],
  "lm-computer": ["pc-door-l", "pc-door-r"],
  "lm-bank": ["bank-door-l", "bank-door-r"],
};

export const LANDMARK_DEFS: Record<LandmarkKind, LandmarkDef> = {
  cinema: {
    width: 6,
    height: 5,
    rows: [
      [townTiles.blueRoof1, townTiles.blueRoof2, townTiles.blueRoof2, townTiles.blueRoof2, townTiles.blueRoof2, townTiles.blueRoof3],
      [townTiles.blueRoof7, townTiles.blueRoof8, townTiles.blueRoof8, townTiles.blueRoof8, townTiles.blueRoof8, townTiles.blueRoof9],
      [townTiles.redWallSide1, townTiles.redWallCenter1, townTiles.redWallCenter2, townTiles.redWallCenter2, townTiles.redWallCenter3, townTiles.redWallSide2],
      [townTiles.redWallSide2, townTiles.redWallCenter4, townTiles.redWallCenter5, townTiles.redWallCenter5, townTiles.redWallCenter6, townTiles.redWallSide2],
      [townTiles.redWallSide4, townTiles.redWallCenter10, townTiles.redWallCenter11, townTiles.redWallCenter11, townTiles.redWallCenter11, townTiles.redWallSide4],
    ],
  },
  computer: {
    width: 4,
    height: 5,
    rows: [
      [townTiles.yellowRoof1, townTiles.yellowRoof2, townTiles.yellowRoof2, townTiles.yellowRoof3],
      [townTiles.yellowRoof7, townTiles.yellowRoof8, townTiles.yellowRoof8, townTiles.yellowRoof9],
      [townTiles.brownWallSide1, townTiles.brownWallCenter1, townTiles.brownWallCenter3, townTiles.brownWallSide1],
      [townTiles.brownWallSide2, townTiles.brownWallCenter4, townTiles.brownWallCenter6, townTiles.brownWallSide2],
      [townTiles.brownWallSide4, townTiles.brownWallCenter10, townTiles.brownWallCenter12, townTiles.brownWallSide4],
    ],
  },
  bank: {
    width: 5,
    height: 6,
    rows: [
      [cityTiles.roofGrey1, cityTiles.roofGrey2, cityTiles.roofGrey2, cityTiles.roofGrey2, cityTiles.roofGrey3],
      [cityTiles.roofGrey7, cityTiles.roofGrey8, cityTiles.roofGrey8, cityTiles.roofGrey8, cityTiles.roofGrey9],
      [cityTiles.buildingWindowL, cityTiles.buildingWindowGreenM, cityTiles.buildingWindowGreenM, cityTiles.buildingWindowGreenM, cityTiles.buildingWindowGreenR],
      [cityTiles.buildingWindowL, cityTiles.buildingWindowGreenM, cityTiles.buildingWindowGreenM, cityTiles.buildingWindowGreenM, cityTiles.buildingWindowGreenR],
      [cityTiles.buildingWindowL, cityTiles.buildingWindowGreenM, cityTiles.buildingWindowGreenM, cityTiles.buildingWindowGreenM, cityTiles.buildingWindowGreenR],
      [cityTiles.buildingWindowL, cityTiles.buildingWindowGreenM, cityTiles.buildingWindowGreenM, cityTiles.buildingWindowGreenM, cityTiles.buildingWindowGreenR],
    ],
  },
  board: {
    width: 3,
    height: 2,
    rows: [
      [cityTiles.board1, cityTiles.board2, cityTiles.board3],
      [cityTiles.board7, cityTiles.board8, cityTiles.board9],
    ],
  },
};

function assembleLandmarkTiles(container: PIXI.Container, def: LandmarkDef, centerWorldX: number, groundWorldY: number) {
  const { width, height, rows } = def;
  const left = centerWorldX - (width * TILE_SIZE) / 2;
  const top = groundWorldY - height * TILE_SIZE;

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const tex = rows[row]?.[col];
      if (!tex) continue;

      const s = new PIXI.Sprite(tex);
      s.x = left + col * TILE_SIZE;
      s.y = top + row * TILE_SIZE;
      s.width = TILE_SIZE;
      s.height = TILE_SIZE;

      setDepth(s as any, "world", groundWorldY);
      container.addChild(s as any);
    }
  }
}

export function addChurchSprite(container: PIXI.Container, worldX: number, groundY: number) {
  const tex = PIXI.Texture.from(GAME_ASSETS.churchBuilding);
  tex.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

  const s = new PIXI.Sprite(tex);

  // 바닥 중앙 기준
  s.anchor.set(0.5, 1);

  // 위치
  s.x = worldX;
  s.y = groundY;

  // 크기: 타일 기준으로 맞추기
  const TARGET_W_TILES = 5;
  const targetW = TARGET_W_TILES * TILE_SIZE;
  const scale = targetW / tex.width;
  s.scale.set(scale);

  setDepth(s as any, "world", groundY);
  container.addChild(s as any);

  return {
    sprite: s,
    scale,
    targetW,
  };
}

function drawHouses(container: PIXI.Container, kind: "orangeM" | "orangeS" | "blueM" | "blueS", worldX: number, groundY: number) {
  const houseWidthTiles = kind === "orangeS" || kind === "blueS" ? 3 : 4;
  const houseHeightTiles = 3;

  const left = worldX - (houseWidthTiles * TILE_SIZE) / 2;
  const top = groundY - houseHeightTiles * TILE_SIZE;

  let roofTopRow: PIXI.Texture[] = [];
  let roofBottomRow: PIXI.Texture[] = [];
  let wallRow: PIXI.Texture[] = [];

  switch (kind) {
    case "orangeM":
      roofTopRow = [tiles.roofOrangeLT, tiles.roofOrangeChimney, tiles.roofOrangeMT, tiles.roofOrangeRT];
      roofBottomRow = [tiles.roofOrangeLB, tiles.roofOrangeMB, tiles.roofOrangeGable, tiles.roofOrangeRB];
      wallRow = [tiles.wallOrangeL, tiles.closeOrangeWindow, tiles.closeOrangeDoor, tiles.wallOrangeR];
      break;
    case "orangeS":
      roofTopRow = [tiles.roofOrangeLT, tiles.roofOrangeMT, tiles.roofOrangeRT];
      roofBottomRow = [tiles.roofOrangeLB, tiles.roofOrangeGable, tiles.roofOrangeRB];
      wallRow = [tiles.wallOrangeL, tiles.closeOrangeDoor, tiles.wallOrangeR];
      break;
    case "blueS":
      roofTopRow = [tiles.roofBlueLT, tiles.roofBlueMT, tiles.roofBlueRT];
      roofBottomRow = [tiles.roofBlueLB, tiles.roofBlueGable, tiles.roofBlueRB];
      wallRow = [tiles.wallBlueL, tiles.closeBlueDoor, tiles.wallBlueR];
      break;
    case "blueM":
      roofTopRow = [tiles.roofBlueLT, tiles.roofBlueChimney, tiles.roofBlueMT, tiles.roofBlueRT];
      roofBottomRow = [tiles.roofBlueLB, tiles.roofBlueMB, tiles.roofBlueGable, tiles.roofBlueRB];
      wallRow = [tiles.wallBlueL, tiles.closeBlueWindow, tiles.closeBlueDoor, tiles.wallBlueR];
      break;
  }

  for (let i = 0; i < houseWidthTiles; i++) {
    const s = new PIXI.Sprite(roofTopRow[i]);
    s.x = left + i * TILE_SIZE;
    s.y = top;
    s.width = TILE_SIZE;
    s.height = TILE_SIZE;
    setDepth(s as any, "world");
    container.addChild(s as any);
  }
  for (let i = 0; i < houseWidthTiles; i++) {
    const s = new PIXI.Sprite(roofBottomRow[i]);
    s.x = left + i * TILE_SIZE;
    s.y = top + TILE_SIZE;
    s.width = TILE_SIZE;
    s.height = TILE_SIZE;
    setDepth(s as any, "world");
    container.addChild(s as any);
  }
  for (let i = 0; i < houseWidthTiles; i++) {
    const s = new PIXI.Sprite(wallRow[i]);
    s.x = left + i * TILE_SIZE;
    s.y = top + TILE_SIZE * 2;
    s.width = TILE_SIZE;
    s.height = TILE_SIZE;

    setDepth(s as any, "world", groundY);
    container.addChild(s as any);
  }
}

/** Bank billboard (숫자판) */
function createBankBillboard(container: PIXI.Container, screenLeft: number, screenTop: number, registry: BillboardInfo[]) {
  const screenWidth = 3.6 * TILE_SIZE;
  const screenHeight = 2 * TILE_SIZE;

  const  bilboard = new PIXI.Graphics();
  bilboard.x = screenLeft;
  bilboard.y = screenTop;
  setDepth(bilboard as any, "buildingDetail");
  container.addChild(bilboard as any);

  const margin = 2;
  const innerW = screenWidth - margin * 2;
  const innerH = screenHeight - margin * 2;
  const topH = innerH * 0.4;
  const bottomH = innerH - topH - 2;

  const gridRows = 5;
  const gridCols = 6;
  const cellW = innerW / gridCols;
  const cellH = bottomH / gridRows;

  const cells: PriceCell[] = [];
  for (let r = 0; r < gridRows; r++) {
    for (let c = 0; c < gridCols; c++) {
      const txt = new PIXI.Text("0.00", {
        fontFamily: "monospace",
        fontSize: 6,
        fill: 0xffffff,
      });
      txt.x = screenLeft + margin + c * cellW + 1;
      txt.y = screenTop + margin + topH + 2 + r * cellH + 1;

      setDepth(txt as any, "buildingDetail");
      container.addChild(txt as any);
      cells.push({ text: txt, row: r, col: c });
    }
  }

  registry.push({ kind: "bank", bilboard, width: screenWidth, height: screenHeight, cells });
}

function toWorldPx(v: number) {
  return v >= TILE_SIZE ? v : v * TILE_SIZE;
}

export function drawWorld(
  layers: {
    building: PIXI.Container;
    object: PIXI.Container;
    overlay: PIXI.Container;
  },
  currentMapId: string | number,
  billboards: BillboardInfo[],
) {
  landmarks.forEach((lm) => {
    const def = LANDMARK_DEFS[lm.kind];
    if (!def) return;

    const worldX = toWorldPx(lm.x);
    const groundY = toWorldPx(lm.y);

    assembleLandmarkTiles(layers.building, def, worldX, groundY);

    if (lm.kind === "bank") {
      const screenLeft = 33.2 * TILE_SIZE;
      const screenTop = -1 * TILE_SIZE + TILE_SIZE;
      createBankBillboard(layers.overlay, screenLeft, screenTop, billboards);
    }

    if (lm.kind === "cinema") {
      const sign = addLandmarkSpriteBillboard(layers.overlay, worldX, groundY, billboards, {
        landmarkKind: "cinema",
        texture: PIXI.Texture.from(GAME_ASSETS.cinemaSign),
        widthRatio: 0.9,
        offsetX: 0,
        offsetY: 0,
        hoverAmpTiles: 0,
        hoverSpeed: 0.15,
      });
    }

    if (lm.kind === "computer") {
      addLandmarkSpriteBillboard(layers.overlay, lm.x, lm.y, billboards, {
        landmarkKind: "computer",
        texture: PIXI.Texture.from(GAME_ASSETS.computerSign),
        widthRatio: 1.3,
        offsetY: -30,
        hoverAmpTiles: 0,
        hoverSpeed: 0.15,
      });
    }
  });

  houses.forEach((h) => {
    const worldX = h.x * TILE_SIZE;
    const groundY = h.y * TILE_SIZE;
    drawHouses(layers.building, h.kind, worldX, groundY);
  });
}

export function attachBillboardTicker(app: PIXI.Application, billboardsRef: { current: BillboardInfo[] }): () => void {
  let t = 0;
  let accum = 0;

  const update = (delta: number) => {
    const list = billboardsRef.current;
    if (!list.length) return;

    t += delta * 0.08;
    accum += delta;

    for (const b of list) {
      if (b.kind === "simple") {
        b.g.alpha = 0.8 + Math.sin(performance.now() / 300) * 0.2;
        continue;
      }

      if (b.kind === "sprite") {
        b.phase += delta * b.speed;
        b.sprite.y = b.baseY + Math.sin(b.phase) * b.amp;
        continue;
      }

      const { bilboard, width: w, height: h, cells } = b;
      bilboard.clear();

      bilboard.lineStyle(2, 0x222222);
      bilboard.beginFill(0x050708);
      bilboard.drawRect(0, 0, w, h);
      bilboard.endFill();

      const margin = 2;
      const innerW = w - margin * 2;
      const innerH = h - margin * 2;
      const topH = innerH * 0.4;
      const bottomH = innerH - topH - 2;

      const panelCount = 3;
      const panelW = innerW / panelCount;
      for (let i = 0; i < panelCount; i++) {
        const baseBlue = 0x1b4f72;
        const flicker = ((Math.sin(t * 1.5 + i) + 1) * 0x10) | 0;
        const blueR = (baseBlue >> 16) & 0xff;
        const blueG = (baseBlue >> 8) & 0xff;
        const blueB = baseBlue & 0xff;
        const color =
          ((blueR << 16) |
            (Math.min(255, blueG + flicker) << 8) |
            Math.min(255, blueB + flicker)) >>> 0;

        bilboard.lineStyle(1, 0x0a2035);
        bilboard.beginFill(color);
        bilboard.drawRect(margin + panelW * i, margin, panelW - 2, topH);
        bilboard.endFill();
      }

      bilboard.beginFill(0x050505);
      bilboard.drawRect(margin, margin + topH + 2, innerW, bottomH);
      bilboard.endFill();
      
      if (accum > 6) {
        accum = 0;
        cells.forEach(({ text, col }) => {
          if (Math.random() < 0.4) return;
          const value =
            Math.random() < 0.15 ? (Math.random() * 30000).toFixed(0) : (Math.random() * 999).toFixed(2);
          text.text = value;
          if (col % 3 === 0) text.style.fill = 0xffffff;
          else text.style.fill = Math.random() > 0.5 ? 0x00ff4f : 0xff3350;
        });
      }
    }
  };

  app.ticker.add(update);
  return () => app.ticker.remove(update);
}