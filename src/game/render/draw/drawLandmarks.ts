import * as PIXI from "pixi.js";
import { TILE_SIZE } from "../../data/config";
import { landmarks } from "../../data/maps";

export type BillboardInfo = {
  g: PIXI.Graphics;
};

export function drawLandmarksAndHouses(
  actors: PIXI.Container,
  overlay: PIXI.Container,
  currentMapId: string | number,
  billboards: BillboardInfo[]
) {
  landmarks.forEach((lm) => {
    // 은행 전광판 예시
    if (lm.kind === "bank") {
      const g = new PIXI.Graphics();
      g.beginFill(0x111111);
      g.drawRect(0, 0, TILE_SIZE * 4, TILE_SIZE * 2);
      g.endFill();

      g.x = lm.x * TILE_SIZE;
      g.y = lm.y * TILE_SIZE - TILE_SIZE * 2;

      overlay.addChild(g as any);
      billboards.push({ g });
    }
  });
}

export function attachBillboardTicker(
  app: PIXI.Application,
  billboardsRef: { current: BillboardInfo[] }
) {
  app.ticker.add(() => {
    billboardsRef.current.forEach(({ g }) => {
      g.alpha = 0.8 + Math.sin(performance.now() / 300) * 0.2;
    });
  });

  return () => {};
}
