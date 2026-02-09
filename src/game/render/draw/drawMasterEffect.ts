import * as PIXI from "pixi.js";
import { playMasterSpin, stopMasterSpin, playMasterImpact } from "../../utils/soundManager";

export function playMasterSequence(
  app: PIXI.Application, 
  player: PIXI.Container, 
  icons: string[],
  onComplete?: () => void
) {
  playMasterSpin();

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
    const parent = player.parent || app.stage;
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
        const targetX = player.x + Math.cos(itemAngle) * ORBIT_RADIUS;
        const targetY = player.y + Math.sin(itemAngle) * ORBIT_RADIUS - 20;
        sprite.x += (targetX - sprite.x) * 0.2;
        sprite.y += (targetY - sprite.y) * 0.2;
        if (sprite.scale.x < ICON_SCALE) sprite.scale.x += 0.05;
        sprite.scale.y = sprite.scale.x;
      } else {
        sprite.x += (player.x - sprite.x) * 0.3;
        sprite.y += (player.y - sprite.y) * 0.3;
        sprite.scale.set(sprite.scale.x * 0.8);
        sprite.alpha -= 0.1;
        if (sprite.alpha <= 0) sprite.destroy();
      }
    });

    if (sprites.every(s => s.destroyed)) {
      app.ticker.remove(orbitTicker);
      stopMasterSpin();
      playMasterImpact();
      triggerMasterImpact(app, player);
      
      if (onComplete) onComplete();
    }
  };

  app.ticker.add(orbitTicker);
}

function triggerMasterImpact(app: PIXI.Application, player: PIXI.Container) {
  const originalPlayerY = player.y;
  const originalStageX = app.stage.x;
  const originalStageY = app.stage.y;
  
  let time = 0;
  const impactTicker = (delta: number) => {
    time += delta;

    const jumpHeight = Math.sin(time * 0.2) * 20; 
    if (time < 15) { 
      player.y = originalPlayerY - Math.max(0, jumpHeight);
    } else {
      player.y = originalPlayerY;
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