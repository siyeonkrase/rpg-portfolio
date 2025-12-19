import * as PIXI from "pixi.js";
import { TILE_SIZE } from "../config";
import { tiles } from "./tileset";
import { townTiles } from "./townTileset";
import { cityTiles } from "./cityTileset";
import { landmarks, houses, LandmarkKind } from "../maps";
import { setDepth } from "./depthSort";
import { createFountainSprite } from "./fountainAnim";

type LandmarkDef = {
  width: number;
  height: number;
  rows: (PIXI.Texture | null)[][];
};

export type PriceCell = {
  text: PIXI.Text;
  row: number;
  col: number;
};

export type BillboardInfo = {
  g: PIXI.Graphics;
  width: number;
  height: number;
  cells: PriceCell[];
};

export type BillboardRefLike = { current: BillboardInfo[] };

const LANDMARK_DEFS: Record<LandmarkKind, LandmarkDef> = {
  cinema: {
    width: 6,
    height: 5,
    rows: [
      [
        townTiles.blueRoof1,
        townTiles.blueRoof2,
        townTiles.blueRoof2,
        townTiles.blueRoof2,
        townTiles.blueRoof2,
        townTiles.blueRoof3,
      ],
      [
        townTiles.blueRoof7,
        townTiles.blueRoof8,
        townTiles.blueRoof8,
        townTiles.blueRoof8,
        townTiles.blueRoof8,
        townTiles.blueRoof9,
      ],
      [
        townTiles.redWallSide1,
        townTiles.redWallCenter1,
        townTiles.redWallCenter2,
        townTiles.redWallCenter2,
        townTiles.redWallCenter3,
        townTiles.redWallSide2,
      ],
      [
        townTiles.redWallSide2,
        townTiles.redWallCenter4,
        townTiles.redWallCenter5,
        townTiles.redWallCenter5,
        townTiles.redWallCenter6,
        townTiles.redWallSide2,
      ],
      [
        townTiles.redWallSide4,
        townTiles.redWallCenter10,
        townTiles.redWallCenter11,
        townTiles.redWallCenter11,
        townTiles.redWallCenter11,
        townTiles.redWallSide4,
      ],
    ],
  },
  computer: {
    width: 5,
    height: 5,
    rows: [
      [
        townTiles.yellowRoof1,
        townTiles.yellowRoof2,
        townTiles.yellowRoof2,
        townTiles.yellowRoof3,
      ],
      [
        townTiles.yellowRoof7,
        townTiles.yellowRoof8,
        townTiles.yellowRoof8,
        townTiles.yellowRoof9,
      ],
      [
        townTiles.brownWallSide1,
        townTiles.brownWallCenter1,
        townTiles.brownWallCenter3,
        townTiles.brownWallSide1,
      ],
      [
        townTiles.brownWallSide2,
        townTiles.brownWallCenter4,
        townTiles.brownWallCenter6,
        townTiles.brownWallSide2,
      ],
      [
        townTiles.brownWallSide4,
        townTiles.brownWallCenter10,
        townTiles.brownWallCenter12,
        townTiles.brownWallSide4,
      ],
    ],
  },
  bank: {
    width: 5,
    height: 6,
    rows: [
      [
        cityTiles.roofGrey1,
        cityTiles.roofGrey2,
        cityTiles.roofGrey2,
        cityTiles.roofGrey2,
        cityTiles.roofGrey3,
      ],
      [
        cityTiles.roofGrey7,
        cityTiles.roofGrey8,
        cityTiles.roofGrey8,
        cityTiles.roofGrey8,
        cityTiles.roofGrey9,
      ],
      [
        cityTiles.buildingWindowL,
        cityTiles.buildingWindowGreenM,
        cityTiles.buildingWindowGreenM,
        cityTiles.buildingWindowGreenM,
        cityTiles.buildingWindowGreenR,
      ],
      [
        cityTiles.buildingWindowL,
        cityTiles.buildingWindowGreenM,
        cityTiles.buildingWindowGreenM,
        cityTiles.buildingWindowGreenM,
        cityTiles.buildingWindowGreenR,
      ],
      [
        cityTiles.buildingWindowL,
        cityTiles.buildingWindowGreenM,
        cityTiles.buildingWindowGreenM,
        cityTiles.buildingWindowGreenM,
        cityTiles.buildingWindowGreenR,
      ],
      [
        cityTiles.buildingWindowL,
        cityTiles.buildingWindowGreenM,
        cityTiles.buildingWindowGreenM,
        cityTiles.buildingWindowGreenM,
        cityTiles.buildingWindowGreenR,
      ],
      [
        cityTiles.buildingWindowL,
        cityTiles.buildingWindowGreenM,
        cityTiles.buildingWindowGreenM,
        cityTiles.buildingWindowGreenM,
        cityTiles.buildingWindowGreenR,
      ],
    ],
  },
  fountain: {
    width: 0,
    height: 0,
    rows: []
  }
};

function drawLandmarkRect(
  container: PIXI.Container,
  def: LandmarkDef,
  centerWorldX: number,
  groundWorldY: number
) {
  const { width, height, rows } = def;

  const left = centerWorldX - (width * TILE_SIZE) / 2;
  const top = groundWorldY - height * TILE_SIZE;

  for (let row = 0; row < height; row++) {
    const texRow = rows[row];
    for (let col = 0; col < width; col++) {
      const tex = texRow[col];
      if (!tex) continue;
      const s = new PIXI.Sprite(tex);
      s.x = left + col * TILE_SIZE;
      s.y = top + row * TILE_SIZE;
      s.zIndex = s.y;
      s.width = TILE_SIZE;
      s.height = TILE_SIZE;
      setDepth(s, "building");
      container.addChild(s as any);
    }
  }
}

function drawHouses(
  container: PIXI.Container,
  kind: "orangeM" | "orangeS" | "blueM" | "blueS",
  worldX: number,
  groundY: number
) {
  const houseWidthTiles =
    kind === "orangeS" || kind === "blueS" ? 3 : 4;
  const houseHeightTiles = 3;

  const left = worldX - (houseWidthTiles * TILE_SIZE) / 2;
  const top = groundY - houseHeightTiles * TILE_SIZE;

  let roofTopRow: PIXI.Texture[] = [];
  let roofBottomRow: PIXI.Texture[] = [];
  let wallRow: PIXI.Texture[] = [];

  switch (kind) {
    case "orangeM":
      roofTopRow = [
        tiles.roofOrangeLT,
        tiles.roofOrangeChimney,
        tiles.roofOrangeMT,
        tiles.roofOrangeRT,
      ];
      roofBottomRow = [
        tiles.roofOrangeLB,
        tiles.roofOrangeMB,
        tiles.roofOrangeGable,
        tiles.roofOrangeRB,
      ];
      wallRow = [
        tiles.wallOrangeL,
        tiles.closeOrangeWindow,
        tiles.closeOrangeDoor,
        tiles.wallOrangeR,
      ];
      break;
    case "orangeS":
      roofTopRow = [
        tiles.roofOrangeLT,
        tiles.roofOrangeMT,
        tiles.roofOrangeRT,
      ];
      roofBottomRow = [
        tiles.roofOrangeLB,
        tiles.roofOrangeGable,
        tiles.roofOrangeRB,
      ];
      wallRow = [
        tiles.wallOrangeL,
        tiles.closeOrangeDoor,
        tiles.wallOrangeR,
      ];
      break;
    case "blueS":
      roofTopRow = [
        tiles.roofBlueLT,
        tiles.roofBlueMT,
        tiles.roofBlueRT,
      ];
      roofBottomRow = [
        tiles.roofBlueLB,
        tiles.roofBlueGable,
        tiles.roofBlueRB,
      ];
      wallRow = [
        tiles.wallBlueL,
        tiles.closeBlueDoor,
        tiles.wallBlueR,
      ];
      break;
    case "blueM":
      roofTopRow = [
        tiles.roofBlueLT,
        tiles.roofBlueChimney,
        tiles.roofBlueMT,
        tiles.roofBlueRT,
      ];
      roofBottomRow = [
        tiles.roofBlueLB,
        tiles.roofBlueMB,
        tiles.roofBlueGable,
        tiles.roofBlueRB,
      ];
      wallRow = [
        tiles.wallBlueL,
        tiles.closeBlueWindow,
        tiles.closeBlueDoor,
        tiles.wallBlueR,
      ];
      break;
  }

  for (let i = 0; i < houseWidthTiles; i++) {
    const s = new PIXI.Sprite(roofTopRow[i]);
    s.x = left + i * TILE_SIZE;
    s.y = top;
    s.width = TILE_SIZE;
    s.height = TILE_SIZE;
    container.addChild(s as any);
  }

  for (let i = 0; i < houseWidthTiles; i++) {
    const s = new PIXI.Sprite(roofBottomRow[i]);
    s.x = left + i * TILE_SIZE;
    s.y = top + TILE_SIZE;
    s.width = TILE_SIZE;
    s.height = TILE_SIZE;
    container.addChild(s as any);
  }

  for (let i = 0; i < houseWidthTiles; i++) {
    const s = new PIXI.Sprite(wallRow[i]);
    s.x = left + i * TILE_SIZE;
    s.y = top + TILE_SIZE * 2;
    s.width = TILE_SIZE;
    s.height = TILE_SIZE;
    container.addChild(s as any);
  }
}

function createBankBillboard(
  container: PIXI.Container,
  def: LandmarkDef,
  centerWorldX: number,
  groundWorldY: number,
  registry: BillboardInfo[]
) {
  const rows = def.rows;
  const buildingHeight = rows.length;
  const buildingTop = groundWorldY - buildingHeight * TILE_SIZE;

  const screenWidthTiles = 3.6;
  const screenHeightTiles = 2;
  const screenWidth = screenWidthTiles * TILE_SIZE;
  const screenHeight = screenHeightTiles * TILE_SIZE;

  const screenLeft = 34.2 * TILE_SIZE;
  const screenTop = 0.8 + TILE_SIZE;

  const g = new PIXI.Graphics();
  g.x = screenLeft;
  g.y = screenTop;
  g.zIndex = g.y;

  g.beginFill(0x111111);
  g.drawRect(0, 0, screenWidth, screenHeight);
  g.endFill();
  setDepth(g, "building");

  container.addChild(g as any);
  const margin = 2;
  const innerX = screenLeft + margin;
  const innerY = screenTop + margin;
  const innerW = screenWidth - margin * 2;
  const innerH = screenHeight - margin * 2;
  const topH = innerH * 0.4;
  const bottomH = innerH - topH - 2;

  const gridRows = 5; // 너무 촘촘하면 글자 안보여서 약간 줄임
  const gridCols = 6;
  const gridX = innerX;
  const gridY = innerY + topH + 2;
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

      txt.x = gridX + c * cellW + 1;
      txt.y = gridY + r * cellH + 1;
      setDepth(txt, "decor", { useBottom: false });
      
      container.addChild(txt as any);
      cells.push({ text: txt, row: r, col: c });
    }
  }

  registry.push({
    g,
    width: screenWidth,
    height: screenHeight,
    cells,
  });
}

export function drawLandmarksAndHouses(
  container: PIXI.Container,
  currentMapId: string | number,
  billboards: BillboardInfo[]
) {
  // landmarks
  landmarks.forEach((lm) => {
    if (lm.mapId !== currentMapId) return;

    
    const worldX = lm.x;
    const groundY = lm.y;

    if (lm.kind === "fountain") {
      const fountain = createFountainSprite(worldX, groundY);
      container.addChild(fountain as any);
      return;
    }
  
    const def = LANDMARK_DEFS[lm.kind];
    if (!def) return;

    drawLandmarkRect(container, def, worldX, groundY);

    if (lm.kind === "bank") {
      createBankBillboard(container, def, worldX, groundY, billboards);
    }
  });

  // houses
  houses.forEach((h) => {
    if (h.mapId !== currentMapId) return;
    const worldX = h.x * TILE_SIZE;
    const groundY = h.y * TILE_SIZE;
    drawHouses(container, h.kind, worldX, groundY);
  });
}

export function attachBillboardTicker(
  app: PIXI.Application,
  billboardsRef: BillboardRefLike
) {
  let t = 0;
  let accum = 0;

  const update = (delta: number) => {
    const list = billboardsRef.current;
    if (!list.length) return;

    t += delta * 0.08;
    accum += delta;

    list.forEach(({ g, width, height, cells }) => {
      const w = width;
      const h = height;

      g.clear();

      // 0. 전체 배경 + 테두리
      g.lineStyle(2, 0x222222);
      g.beginFill(0x050708);
      g.drawRect(0, 0, w, h);
      g.endFill();

      const margin = 2;
      const innerX = margin;
      const innerY = margin;
      const innerW = w - margin * 2;
      const innerH = h - margin * 2;
      const topH = innerH * 0.4;
      const bottomH = innerH - topH - 2;

      // 1. 위쪽 파란 패널 (대충 3개)
      const panelCount = 3;
      const panelW = innerW / panelCount;

      for (let i = 0; i < panelCount; i++) {
        const px = innerX + panelW * i;
        const py = innerY;
        const pw = panelW - 2;
        const ph = topH;

        const baseBlue = 0x1b4f72;
        const flicker =
          ((Math.sin(t * 1.5 + i) + 1) * 0x10) | 0;
        const blueR = (baseBlue >> 16) & 0xff;
        const blueG = (baseBlue >> 8) & 0xff;
        const blueB = baseBlue & 0xff;
        const color =
          ((blueR << 16) |
            (Math.min(255, blueG + flicker) << 8) |
            Math.min(255, blueB + flicker)) >>> 0;

        g.lineStyle(1, 0x0a2035);
        g.beginFill(color);
        g.drawRect(px, py, pw, ph);
        g.endFill();
      }

      // 2. 아래쪽 숫자판 영역(살짝 어둡게)
      const gridBgY = innerY + topH + 2;
      g.beginFill(0x050505);
      g.drawRect(innerX, gridBgY, innerW, bottomH);
      g.endFill();

      // 3. 숫자 업데이트 (accum이 일정 이상 쌓일 때만)
      if (accum > 6) {
        accum = 0;

        cells.forEach(({ text, row, col }) => {
          // 랜덤하게 일부만 바꾸기 (너무 번쩍거리지 않게)
          if (Math.random() < 0.4) return;

          // 0.xx ~ 999.xx 랜덤 값
          const value =
            Math.random() < 0.15
              ? (Math.random() * 30000).toFixed(0) // 큰 지수 느낌
              : (Math.random() * 999).toFixed(2);

          text.text = value;

          if (col % 3 === 0) {
            text.style.fill = 0xffffff;
          } else {
            const up = Math.random() > 0.5;
            text.style.fill = up ? 0x00ff4f : 0xff3350;
          }
        });
      }
    });
  };

  app.ticker.add(update);
  return () => {
    app.ticker.remove(update);
  };
}

