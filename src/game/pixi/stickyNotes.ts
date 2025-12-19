// src/game/pixi/stickyNotes.ts
import * as PIXI from "pixi.js";

const POSTIT_COLORS = [
  0xfff2a8, // 연노랑
  0xb3ffcc, // 연초록
  0xa8e0ff, // 연파랑
  0xffc7d1, // 연핑크
  0xf5d0ff, // 연보라
];

function darken(color: number, factor = 0.8): number {
  const r = ((color >> 16) & 0xff) * factor;
  const g = ((color >> 8) & 0xff) * factor;
  const b = (color & 0xff) * factor;
  return ((r & 0xff) << 16) | ((g & 0xff) << 8) | (b & 0xff);
}

export function drawStickyNotesOnBoard(
  container: PIXI.Container,
  boardX: number,
  boardY: number,
  boardWidth: number,
  boardHeight: number,
  count: number = 6
) {
  // 보드 안쪽 여백 (외곽 라인 안쪽부터 시작)
  const padding = 4;
  const POSTIT_SIZE = 10;
  const MIN_DISTANCE  =  14;

  container.sortableChildren = true;

  const innerX = boardX + padding;
  const innerY = boardY + padding;
  const innerW = boardWidth - padding * 2;
  const innerH = boardHeight - padding * 2;

  const placed: { x: number; y: number }[] = [];

  function isFarEnough(x: number, y: number) {
    return placed.every((p) => {
      const dx = p.x - x;
      const dy= p.y - y;
      return Math.sqrt(dx * dx + dy * dy) > MIN_DISTANCE;
    })
  }

  for (let i = 0; i < count; i++) {
    const color =
      POSTIT_COLORS[Math.floor(Math.random() * POSTIT_COLORS.length)];

    let centerX = 0;
    let centerY = 0;
    let tries = 0;

    // ✔ 겹치지 않는 위치 찾기
    do {
      centerX = innerX + Math.random() * innerW;
      centerY = innerY + Math.random() * innerH;
      tries++;
    } while (!isFarEnough(centerX, centerY) && tries < 50);

    // 새 포스트잇 위치 확정
    placed.push({ x: centerX, y: centerY });

    const noteX = centerX - POSTIT_SIZE / 2;
    const noteY = centerY - POSTIT_SIZE / 2;

    // 회전은 약간만
    const rotation = (Math.random() - 0.5) * 0.15;

    // 그림자
    const shadow = new PIXI.Graphics();
    shadow.beginFill(0x000000, 0.18);
    shadow.drawRoundedRect(2, 3, POSTIT_SIZE, POSTIT_SIZE, 2);
    shadow.endFill();
    shadow.x = noteX;
    shadow.y = noteY;
    shadow.rotation = rotation;
    shadow.zIndex = 1001;

    // 포스트잇 본체
    const borderColor = darken(color, 0.7);

    const note = new PIXI.Graphics();

    note.lineStyle(2, borderColor, 1);
    note.beginFill(color);
    note.drawRoundedRect(0, 0, POSTIT_SIZE, POSTIT_SIZE, 2);
    note.endFill();
    note.x = noteX;
    note.y = noteY;
    note.rotation = rotation;
    note.zIndex = 1002;

    container.addChild(shadow as any);
    container.addChild(note as any);
  }
}
