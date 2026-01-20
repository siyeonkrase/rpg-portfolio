import * as PIXI from "pixi.js";
import { TILE_SIZE } from "../../data/config";
import { landmarks, houses, type LandmarkKind } from "../../data/maps";
import { tiles } from "../tilesets/tileset";
import { townTiles } from "../tilesets/townTileset";
import { cityTiles } from "../tilesets/cityTileset";
import { setDepth } from "../../pixi/depthSort";
import cinemaSignPng from "../../../assets/cinemaSign.png"
import computerSignPng from "../../../assets/computerSign.png"
import churchPng from "../../../assets/churchPng.png"

export type PriceCell = { text: PIXI.Text; row: number; col: number };

export type BillboardInfo =
  | {
      kind: "simple";
      g: PIXI.Graphics;
    }
  | {
      kind: "bank";
      g: PIXI.Graphics;
      width: number;
      height: number;
      cells: PriceCell[];
    }
  | {
      kind: "sprite";
      s: PIXI.Sprite;
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

  const s = new PIXI.Sprite(opts.texture);

  const widthRatio = opts.widthRatio ?? 0.7;
  const targetW = def.width * TILE_SIZE * widthRatio;
  const texW = opts.texture.width;
  const texH = opts.texture.height;

  const scale = texW ? targetW / texW : 1;
  s.scale.set(scale);

  const offsetX = opts.offsetX ?? 0;
  const offsetY = opts.offsetY ?? 0;

  s.x = left + (def.width * TILE_SIZE - s.width) / 2 + offsetX;
  s.y = top + offsetY;

  container.addChild(s as any);

  const baseY = s.y;
  const amp = TILE_SIZE * (opts.hoverAmpTiles ?? 0);
  const speed = opts.hoverSpeed ?? 0.06;

  registry.push({
    kind: "sprite",
    s,
    baseY,
    amp,
    speed,
    phase: opts.hoverPhase ?? Math.random() * Math.PI * 2,
  });

  return s;
}

type LandmarkDef = {
  width: number;
  height: number;
  rows: (PIXI.Texture | null)[][];
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

function drawLandmarkRect(container: PIXI.Container, def: LandmarkDef, centerWorldX: number, groundWorldY: number) {
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

      setDepth(s, "building");
      container.addChild(s as any);
    }
  }
}

export function addChurchSprite(container: PIXI.Container, worldX: number, groundY: number) {
  const tex = PIXI.Texture.from(churchPng);
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
    setDepth(s, "building");
    container.addChild(s as any);
  }
  for (let i = 0; i < houseWidthTiles; i++) {
    const s = new PIXI.Sprite(roofBottomRow[i]);
    s.x = left + i * TILE_SIZE;
    s.y = top + TILE_SIZE;
    s.width = TILE_SIZE;
    s.height = TILE_SIZE;
    setDepth(s, "building");
    container.addChild(s as any);
  }
  for (let i = 0; i < houseWidthTiles; i++) {
    const s = new PIXI.Sprite(wallRow[i]);
    s.x = left + i * TILE_SIZE;
    s.y = top + TILE_SIZE * 2;
    s.width = TILE_SIZE;
    s.height = TILE_SIZE;
    setDepth(s, "building");
    container.addChild(s as any);
  }
}

/** Bank billboard (숫자판) */
function createBankBillboard(
  container: PIXI.Container,
  screenLeft: number,
  screenTop: number,
  registry: BillboardInfo[]
) {
  const screenWidth = 3.6 * TILE_SIZE;
  const screenHeight = 2 * TILE_SIZE;

  const g = new PIXI.Graphics();
  g.x = screenLeft;
  g.y = screenTop;
  setDepth(g, "decor", { useBottom: false });
  container.addChild(g as any);

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

      setDepth(txt, "decor", { useBottom: false });
      container.addChild(txt as any);
      cells.push({ text: txt, row: r, col: c });
    }
  }

  registry.push({ kind: "bank", g, width: screenWidth, height: screenHeight, cells });
}

function toWorldPx(v: number) {
  return v >= TILE_SIZE ? v : v * TILE_SIZE;
}

export function drawLandmarksAndHouses(
  layers: {
    building: PIXI.Container;
    object: PIXI.Container;
    overlay: PIXI.Container;
  },
  currentMapId: string | number,
  billboards: BillboardInfo[]
) {
  landmarks.forEach((lm) => {
    const def = LANDMARK_DEFS[lm.kind];
    if (!def) return;

    const worldX = toWorldPx(lm.x);
    const groundY = toWorldPx(lm.y);

    drawLandmarkRect(layers.building, def, worldX, groundY);

    if (lm.kind === "bank") {
      const screenLeft = 33.2 * TILE_SIZE;
      const screenTop = -1 * TILE_SIZE + TILE_SIZE;
      createBankBillboard(layers.overlay, screenLeft, screenTop, billboards);
    }

    if (lm.kind === "cinema") {
      const sign = addLandmarkSpriteBillboard(layers.overlay, worldX, groundY, billboards, {
        landmarkKind: "cinema",
        texture: PIXI.Texture.from(cinemaSignPng),
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
        texture: PIXI.Texture.from(computerSignPng),
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
        b.s.y = b.baseY + Math.sin(b.phase) * b.amp;
        continue;
      }

      const { g, width: w, height: h, cells } = b;
      g.clear();

      g.lineStyle(2, 0x222222);
      g.beginFill(0x050708);
      g.drawRect(0, 0, w, h);
      g.endFill();

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

        g.lineStyle(1, 0x0a2035);
        g.beginFill(color);
        g.drawRect(margin + panelW * i, margin, panelW - 2, topH);
        g.endFill();
      }

      g.beginFill(0x050505);
      g.drawRect(margin, margin + topH + 2, innerW, bottomH);
      g.endFill();
      
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