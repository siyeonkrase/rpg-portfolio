// src/game/pixi/fountainAnim.ts
import * as PIXI from "pixi.js";
import fountainImage from "../../assets/fountain.png";
import { TILE_SIZE } from "../config";
import { setDepth } from "./depthSort";

// 이 시트는 2x2 프레임이라고 가정 (네가 올린 원본 이미지)
const FRAME_COLS = 2;
const FRAME_ROWS = 2;

let fountainFrames: PIXI.Texture[] | null = null;

function getFountainFrames(): PIXI.Texture[] {
  if (fountainFrames) return fountainFrames;

  const base = PIXI.BaseTexture.from(fountainImage);
  base.scaleMode = PIXI.SCALE_MODES.NEAREST; // 픽셀 깨끗하게

  // 👉 한 프레임의 실제 픽셀 크기
  const frameWidth = base.width / FRAME_COLS;
  const frameHeight = base.height / FRAME_ROWS;

  const frames: PIXI.Texture[] = [];

  for (let row = 0; row < FRAME_ROWS; row++) {
    for (let col = 0; col < FRAME_COLS; col++) {
      frames.push(
        new PIXI.Texture(
          base,
          new PIXI.Rectangle(
            col * frameWidth,
            row * frameHeight,
            frameWidth,
            frameHeight
          )
        )
      );
    }
  }

  fountainFrames = frames;
  return frames;
}

/**
 * worldX, groundY(분수대 "바닥 중앙") 기준으로 애니메이션 분수 생성
 */
export function createFountainSprite(
  worldX: number,
  groundY: number
): PIXI.AnimatedSprite {
  const textures = getFountainFrames();
  const anim = new PIXI.AnimatedSprite(textures);

  // 🔹 여기서 "얼마나 크게 보일지" 결정됨
  //    - 4면 가로/세로 4타일
  //    - 더 키우고 싶으면 5, 6처럼 수치 올리면 됨
  const widthTiles = 4;
  const heightTiles = 4;

  anim.width = TILE_SIZE * widthTiles;
  anim.height = TILE_SIZE * heightTiles;

  // 바닥 중앙 기준 정렬
  anim.anchor.set(0.5, 1.0);
  anim.x = worldX;
  anim.y = groundY;

  anim.animationSpeed = 0.12; // 속도 느리게/빠르게 조절 가능
  anim.loop = true;
  anim.play();

  setDepth(anim as any, "building");

  return anim;
}
