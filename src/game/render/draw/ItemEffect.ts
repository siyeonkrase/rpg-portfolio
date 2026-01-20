import * as PIXI from "pixi.js";

export const playItemAcquiredEffect = (
  container: PIXI.Container,
  x: number,
  y: number,
  itemTexture: PIXI.Texture
) => {
  const itemSprite = new PIXI.Sprite(itemTexture);

  itemSprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
  itemSprite.anchor.set(0.5);

  const BASE_SIZE = 24;
  itemSprite.width = BASE_SIZE;
  itemSprite.height = BASE_SIZE;

  itemSprite.x = x;
  itemSprite.y = y - 50; 
  itemSprite.zIndex = 2000;
  itemSprite.alpha = 0;

  container.addChild(itemSprite as any);

  let elapsed = 0;
  const duration = 60;   
  const fallDistance = 30; 
  const startY = itemSprite.y;

  const animate = () => {
    elapsed++;
    const progress = elapsed / duration;

    itemSprite.y = startY + (fallDistance * progress);

    if (progress < 0.2) {
      itemSprite.alpha = progress * 5;
    } else {
      itemSprite.alpha = 1 - progress;
    }

    const currentSize = BASE_SIZE * (1 - progress * 0.6);
    itemSprite.width = currentSize;
    itemSprite.height = currentSize;

    if (elapsed >= duration) {
      container.removeChild(itemSprite as any);
      PIXI.Ticker.shared.remove(animate);
    }
  };

  PIXI.Ticker.shared.add(animate);
};