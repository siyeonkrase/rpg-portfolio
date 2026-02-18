import * as PIXI from "pixi.js";
import { playMaxInvenSpin, stopMaxInvenSpin, playMaxInvenImpact } from "../../utils/soundManager";

export function playMaxInvenSequence(
  app: PIXI.Application, 
  characters: PIXI.Container, 
  icons: string[],
  onComplete?: () => void
) {
  playMaxInvenSpin();

  const sprites: PIXI.Sprite[] = [];
  const count = icons.length;
  const root = app.stage;

  const ICON_SCALE = 0.1;
  const ORBIT_RADIUS = 40;
  const ORBIT_DURATION = 1500;
  const ROTATION_SPEED = 0.07;

  icons.forEach((iconPath) => {
    const sprite = PIXI.Sprite.from(iconPath);
    sprite.anchor.set(0.5);
    sprite.scale.set(0);
    const parent = characters.parent || app.stage;
    parent.addChild(sprite as any);
    sprites.push(sprite);
  });

  let angle = 0;
  let phase: 'orbit' | 'absorb' = 'orbit';
  const startTime = Date.now();

  const orbitTicker = (delta: number) => {
    angle += ROTATION_SPEED * delta;
    const elapsed = Date.now() - startTime;

    if (elapsed > ORBIT_DURATION && phase === 'orbit') phase = 'absorb';

    sprites.forEach((sprite, i) => {
      if (sprite.destroyed) return;
      const itemAngle = angle + (i / count) * Math.PI * 2;

      if (phase === 'orbit') {
        const targetX = characters.x + Math.cos(itemAngle) * ORBIT_RADIUS;
        const targetY = characters.y + Math.sin(itemAngle) * ORBIT_RADIUS - 20;
        sprite.x += (targetX - sprite.x) * 0.2;
        sprite.y += (targetY - sprite.y) * 0.2;
        if (sprite.scale.x < ICON_SCALE) sprite.scale.x += 0.05;
        sprite.scale.y = sprite.scale.x;
      } else {
        sprite.x += (characters.x - sprite.x) * 0.3;
        sprite.y += (characters.y - sprite.y) * 0.3;
        sprite.scale.set(sprite.scale.x * 0.8);
        sprite.alpha -= 0.1;
        if (sprite.alpha <= 0) sprite.destroy();
      }
    });

    if (sprites.every(s => s.destroyed)) {
      app.ticker.remove(orbitTicker);
      stopMaxInvenSpin();
      playMaxInvenImpact();
      triggerMaxInvenImpact(app, characters);
      
      if (onComplete) onComplete();
    }
  };

  app.ticker.add(orbitTicker);
}

function triggerMaxInvenImpact(app: PIXI.Application, characters: PIXI.Container) {
  const originalcharactersY = characters.y;
  const originalStageX = app.stage.x;
  const originalStageY = app.stage.y;
  
  let time = 0;
  const impactTicker = (delta: number) => {
    time += delta;

    const jumpHeight = Math.sin(time * 0.2) * 20; 
    if (time < 15) { 
      characters.y = originalcharactersY - Math.max(0, jumpHeight);
    } else {
      characters.y = originalcharactersY;
    }

    if (time < 20) {
      app.stage.x = originalStageX + (Math.random() - 0.5) * 10;
      app.stage.y = originalStageY + (Math.random() - 0.5) * 10;
    } else {
      app.stage.x = originalStageX;
      app.stage.y = originalStageY;
      app.ticker.remove(impactTicker);
    }
  };

  app.ticker.add(impactTicker);
}