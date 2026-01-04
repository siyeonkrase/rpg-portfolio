import * as PIXI from "pixi.js";

// zIndex만 먹이면 되는 유틸이라 "타입 강제"를 버리는 게 안전함.
type ZLike = { zIndex: number; y?: number; height?: number; anchor?: { y: number } };

export function setDepth(display: ZLike, footY: number) {
  display.zIndex = Math.floor(footY);
}

// anchor(0.5,1)이면 y가 발(바닥)인 케이스
// anchor 없거나 0인 케이스도 대응해서 "발 위치"를 계산
export function footYFromSprite(sprite: PIXI.Sprite) {
  const ay = (sprite.anchor?.y ?? 0);
  // 보통 anchor=0이면 top-left 기준이라 height만큼 내려가야 발이 됨
  // anchor=1이면 이미 sprite.y가 발
  return sprite.y + (1 - ay) * sprite.height;
}
