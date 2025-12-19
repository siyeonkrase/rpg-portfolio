import * as PIXI from "pixi.js";

export function setDepth(display: PIXI.DisplayObject, footY: number) {
  display.zIndex = Math.floor(footY);
}

// anchor(0.5,1)면 y가 발 위치라서 그냥 y 사용해도 됨
export function footYFromSprite(sprite: PIXI.Sprite) {
  // 일반화 버전 (anchor 고려)
  const ay = (sprite as any).anchor?.y ?? 0;
  return sprite.y + (1 - ay) * 0; // anchor=1이면 sprite.y가 바닥
}
