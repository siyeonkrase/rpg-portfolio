import * as PIXI from "pixi.js";

export function setDepth(display: PIXI.DisplayObject, footY: number) {
  display.zIndex = Math.floor(footY);
}

export function footYFromSprite(sprite: PIXI.Sprite) {
  const ay = (sprite as any).anchor?.y ?? 0;
  return sprite.y + (1 - ay) * 0;
}
