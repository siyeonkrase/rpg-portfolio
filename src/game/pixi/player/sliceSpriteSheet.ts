import * as PIXI from "pixi.js";

export function sliceSpriteSheet(
  base: PIXI.BaseTexture,
  frameW: number,
  frameH: number
) {
  const cols = Math.floor(base.width / frameW);
  const rows = Math.floor(base.height / frameH);

  const grid: PIXI.Texture[][] = [];

  for (let r = 0; r < rows; r++) {
    const row: PIXI.Texture[] = [];
    for (let c = 0; c < cols; c++) {
      row.push(
        new PIXI.Texture(
          base,
          new PIXI.Rectangle(c * frameW, r * frameH, frameW, frameH)
        )
      );
    }
    grid.push(row);
  }

  return grid;
}
