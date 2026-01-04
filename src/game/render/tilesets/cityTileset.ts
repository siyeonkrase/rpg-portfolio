// src/game/pixi/cityTileset.ts
import * as PIXI from "pixi.js";
import tilesetImage from "../../../assets/city_tilemap_packed.png";

// 타일 한 칸 크기 (이 시트는 16x16)
export const TILESET_TILE_SIZE = 16;

// 한 번만 베이스 텍스처 생성
const base = PIXI.BaseTexture.from(tilesetImage);
// 픽셀 깨끗하게
base.scaleMode = PIXI.SCALE_MODES.NEAREST;

// (col, row) 로 타일 하나 잘라오는 함수
export function citySlice(col: number, row: number): PIXI.Texture {
  return new PIXI.Texture(
    base,
    new PIXI.Rectangle(
      col * TILESET_TILE_SIZE,
      row * TILESET_TILE_SIZE,
      TILESET_TILE_SIZE,
      TILESET_TILE_SIZE
    )
  );
}

export const cityTiles = {
  // 회색 벽
  wallGrey1: citySlice(5, 5),
  wallGrey2: citySlice(6, 5),
  wallGrey3: citySlice(7, 5),
  wallGrey4: citySlice(5, 8),
  wallGrey5: citySlice(6, 8),
  wallGrey6: citySlice(7, 8),

  // 유리벽
  buildingWindowL: citySlice(20, 23),
  buildingWindowM: citySlice(21, 23),
  buildingWindowR: citySlice(22, 23),
  buildingWindowGreenL: citySlice(20, 23),
  buildingWindowGreenM: citySlice(21, 23),
  buildingWindowGreenR: citySlice(22, 23),

  // 진회색 지붕
  roofGrey1: citySlice(16, 0),
  roofGrey2: citySlice(18, 0),
  roofGrey3: citySlice(17, 0),
  roofGrey4: citySlice(18, 0),
  roofGrey5: citySlice(22, 0),
  roofGrey6: citySlice(19, 1),
  roofGrey7: citySlice(16, 1),
  roofGrey8: citySlice(18, 1),
  roofGrey9: citySlice(17, 1),

  // 창문
  windowGrey: citySlice(25, 19),

  // 문
  doorL: citySlice(23, 23),
  doorR: citySlice(24, 23),

  // 잡동사니
  signRedL: citySlice(35, 8),
  signRedR: citySlice(36, 8),
  signBlueL: citySlice(35, 7),
  signBlueR: citySlice(36, 7),
  atm: citySlice(27, 8),
  displayBoard1: citySlice(15, 21),
  displayBoard2: citySlice(18, 22),
  displayBoard3: citySlice(16, 21),
  displayBoard4: citySlice(15, 22),
  displayBoard5: citySlice(17, 22),
  displayBoard6: citySlice(16, 22),
  // board1: citySlice(16, 0),
  // board2: citySlice(18, 0),
  // board3: citySlice(17, 0),
  // board4: citySlice(19, 0),
  // board5: citySlice(22, 0),
  // board6: citySlice(19, 1),
  // board7: citySlice(16, 1),
  // board8: citySlice(18, 1),
  // board9: citySlice(17, 1),
  board1: citySlice(24, 0),
  board2: citySlice(26, 0),
  board3: citySlice(25, 0),
  board4: citySlice(27, 0),
  board5: citySlice(30, 0),
  board6: citySlice(27, 1),
  board7: citySlice(24, 1),
  board8: citySlice(26, 1),
  board9: citySlice(25, 1),
  boardL: citySlice(21, 12),
  boardR: citySlice(22, 12),
};
