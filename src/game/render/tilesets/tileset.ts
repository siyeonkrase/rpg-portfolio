// src/game/pixi/tileset.ts
import * as PIXI from "pixi.js";
import tilesetImage from "../../../assets/tilemap_packed.png";
import farmTilesetImage from "../../../assets/farm_tilemap_packed.png";

// 타일 한 칸 크기 (이 시트는 16x16)
export const TILESET_TILE_SIZE = 16;
export const TILESET_TILE_SIZE2 = 18;

// 한 번만 베이스 텍스처 생성
const base = PIXI.BaseTexture.from(tilesetImage);
const baseFarm = PIXI.BaseTexture.from(farmTilesetImage);
// 픽셀 깨끗하게
base.scaleMode = PIXI.SCALE_MODES.NEAREST;
baseFarm.scaleMode = PIXI.SCALE_MODES.NEAREST;

// (col, row) 로 타일 하나 잘라오는 함수
export function slice(col: number, row: number): PIXI.Texture {
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

export function sliceFarm(col: number, row: number): PIXI.Texture {
  return new PIXI.Texture(
    baseFarm,
    new PIXI.Rectangle(
      col * TILESET_TILE_SIZE2,
      row * TILESET_TILE_SIZE2,
      TILESET_TILE_SIZE2,
      TILESET_TILE_SIZE2
    )
  );
}

export const tiles = {
  // 바닥
  grass: slice(0, 0),          // 기본 잔디
  grassDecor: slice(1, 0),          // 꾸며진 잔디
  grassFlower: slice(2, 0),     // 꽃 있는 잔디

  // 흙
  dirt1: slice(0, 1),
  dirt2: slice(1, 1),
  dirt3: slice(2, 1),
  dirt4: slice(0, 2),
  dirt5: slice(1, 2),
  dirt6: slice(2, 2),
  dirt7: slice(0, 3),
  dirt8: slice(1, 3),
  dirt9: slice(2, 3),
  path: slice(7, 3),

  // 식물
  treeYellowTall1: slice(3, 1),
  treeYellowTall2: slice(3, 0),
  treeGreenTall1: slice(4, 1),
  treeGreenTall2: slice(4, 0),
  bush: slice(5, 0),
  treeYellowSmall: slice(3, 2),
  treeGreenSmall: slice(4, 2),
  plant: slice(5, 1),
  mushroom: slice(5, 2),

  // 나무 그룹
  treeGreenGroup1: slice(6, 0),
  treeGreenGroup2: slice(7, 0),
  treeGreenGroup3: slice(8, 0),
  treeGreenGroup4: slice(6, 1),
  treeGreenGroup5: slice(7, 1),
  treeGreenGroup6: slice(8, 1),
  treeGreenGroup7: slice(6, 2),
  treeGreenGroup8: slice(7, 2),
  treeGreenGroup9: slice(8, 2),
  treeYellowGroup1: slice(9, 0),
  treeYellowGroup2: slice(10, 0),
  treeYellowGroup3: slice(11, 0),
  treeYellowGroup4: slice(9, 1),
  treeYellowGroup5: slice(10, 1),
  treeYellowGroup6: slice(11, 1),
  treeYellowGroup7: slice(9, 2),
  treeYellowGroup8: slice(10, 2),
  treeYellowGroup9: slice(11, 2),

  // 울타리
  fenceSquare1: slice(8, 3),
  fenceSquare2: slice(9, 3),
  fenceSquare3: slice(10, 3),
  fenceSquare4: slice(8, 4),
  fenceSquare5: slice(10, 4),
  fenceSquare6: slice(8, 5),
  fenceSquare7: slice(9, 5),
  fenceSquare8: slice(10, 5),
  fenceH1: slice(8, 6),
  fenceH2: slice(9, 6),
  fenceH3: slice(10, 6),
  fenceV1: slice(11, 3),
  fenceV2: slice(11, 4),
  fenceV3: slice(11, 5),
  sign: slice(11, 6),

  // 집 (파란색)
  roofBlueLT: slice(0, 4),
  roofBlueMT: slice(1, 4),
  roofBlueRT: slice(2, 4),
  roofBlueLB: slice(0, 5),
  roofBlueMB: slice(1, 5),
  roofBlueRB: slice(2, 5),
  roofBlueChimney: slice(3, 4),
  roofBlueGable: slice(3, 5),
  wallBlueL: slice(0, 6),
  wallBlueM: slice(1, 6),
  wallBlueR: slice(3, 6),
  openedBlueDoor: slice(2, 6),
  closeBlueWindow: slice(0, 7),
  closeBlueDoor: slice(1, 7),
  closeBlueDoorL: slice(2, 7),
  closeBlueDoorR: slice(3, 7),

  // 집 (주황색)
  roofOrangeLT: slice(4, 4),
  roofOrangeMT: slice(5, 4),
  roofOrangeRT: slice(6, 4),
  roofOrangeLB: slice(4, 5),
  roofOrangeMB: slice(5, 5),
  roofOrangeRB: slice(6, 5),
  roofOrangeChimney: slice(7, 4),
  roofOrangeGable: slice(7, 5),
  wallOrangeL: slice(4, 6),
  wallOrangeM: slice(5, 6),
  wallOrangeR: slice(7, 6),
  openedOrangeDoor: slice(6, 6),
  closeOrangeWindow: slice(4, 7),
  closeOrangeDoor: slice(5, 7),
  closeOrangeDoorL: slice(6, 7),
  closeOrangeDoorR: slice(7, 7),

  // 성
  castle9LT: slice(0, 8),
  castle9MT: slice(1, 8),
  castle9RT: slice(2, 8),
  castle9LM: slice(0, 9),
  castle9MM: slice(1, 9),
  castle9RM: slice(2, 9),
  castle9LB: slice(0, 10),
  castle9MB: slice(1, 10),
  castle9RB: slice(2, 10),
  castle3L: slice(3, 8),
  castle3M: slice(4, 8),
  castle3R: slice(5, 8),
  castle1: slice(6, 8),
  castleClosingDoorLT: slice(3, 9),
  castleClosingDoorRT: slice(4, 9),
  castleOpenedDoorLT: slice(5, 9),
  castleOpenedDoorRT: slice(6, 9),
  castleDoorLB: slice(3, 10),
  castleDoorRB: slice(4, 10),
  castleWindow: slice(5, 10),
  castleWall: slice(6, 10),

  // 잡동사니
  wellT: slice(8, 7),
  wellB: slice(8, 8),
  sunflowerT: sliceFarm(4, 1),
  sunflowerB: sliceFarm(4, 2),
};
