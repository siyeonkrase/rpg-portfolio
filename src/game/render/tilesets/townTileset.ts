import * as PIXI from "pixi.js";
import tilesetImage from "../../../assets/town_tilemap_packed.png";

export const TILESET_TILE_SIZE = 16;

const base = PIXI.BaseTexture.from(tilesetImage);
base.scaleMode = PIXI.SCALE_MODES.NEAREST;

export function townSlice(col: number, row: number): PIXI.Texture {
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

export const townTiles = {
  // 잡동사니
  oneLightPoleT: townSlice(2, 6),
  oneLightPoleB: townSlice(2, 7),
  twoLightPoleLT: townSlice(0, 6),
  twoLightPoleRT: townSlice(1, 6),
  twoLightPoleB: townSlice(3, 7),
  dryingPole1: townSlice(0, 8),
  dryingPole2: townSlice(1, 9),
  dryingPole3: townSlice(2, 9),
  dryingPole4: townSlice(3, 9),
  dryingPole5: townSlice(4, 9),
  trashCan1: townSlice(9, 10),
  trashCan2: townSlice(10, 10),
  fireHyd: townSlice(8, 10),
  boxes1: townSlice(4, 11),
  boxes2: townSlice(5, 11),
  boxes3: townSlice(6, 11),
  boxes4: townSlice(7, 11),
  bench: townSlice(3, 14),

  // 영화관
  redWallSide1: townSlice(16, 0),
  redWallSide2: townSlice(16, 1),
  redWallSide3: townSlice(16, 2),
  redWallSide4: townSlice(16, 3),
  redWallCenter1: townSlice(17, 0),
  redWallCenter2: townSlice(18, 0),
  redWallCenter3: townSlice(19, 0),
  redWallCenter4: townSlice(17, 1),
  redWallCenter5: townSlice(18, 1),
  redWallCenter6: townSlice(19, 1),
  redWallCenter7: townSlice(17, 2),
  redWallCenter8: townSlice(18, 2),
  redWallCenter9: townSlice(19, 2),
  redWallCenter10: townSlice(17, 3),
  redWallCenter11: townSlice(18, 3),
  redWallCenter12: townSlice(19, 3),
  redWindowCenter1: townSlice(11, 13),
  redWindowCenter2: townSlice(11, 14),
  redWindowSide: townSlice(11, 12),
  redBigDoor: townSlice(15, 10),
  redSideDoor: townSlice(12, 9),

  // 컴퓨터 매장
  brownWallSide1: townSlice(16, 4),
  brownWallSide2: townSlice(16, 5),
  brownWallSide3: townSlice(16, 6),
  brownWallSide4: townSlice(16, 7),
  brownWallCenter1: townSlice(20, 4),
  brownWallCenter2: townSlice(21, 4),
  brownWallCenter3: townSlice(22, 4),
  brownWallCenter4: townSlice(20, 5),
  brownWallCenter5: townSlice(21, 5),
  brownWallCenter6: townSlice(22, 5),
  brownWallCenter7: townSlice(20, 6),
  brownWallCenter8: townSlice(21, 6),
  brownWallCenter9: townSlice(22, 6),
  brownWallCenter10: townSlice(20, 7),
  brownWallCenter11: townSlice(21, 7),
  brownWallCenter12: townSlice(22, 7),
  brownWindowCenter1: townSlice(11, 16),
  brownWindowCenter2: townSlice(11, 17),
  brownWindowSide: townSlice(11, 15),
  brownBigDoor1: townSlice(7, 15),
  brownBigDoor2: townSlice(8, 15),

  // 지붕
  blueRoof1: townSlice(0, 3),
  blueRoof2: townSlice(1, 3),
  blueRoof3: townSlice(2, 3),
  blueRoof4: townSlice(0, 4),
  blueRoof5: townSlice(1, 4),
  blueRoof6: townSlice(2, 4),
  blueRoof7: townSlice(0, 5),
  blueRoof8: townSlice(1, 5),
  blueRoof9: townSlice(2, 5),
  yellowRoof1: townSlice(8, 3),
  yellowRoof2: townSlice(9, 3),
  yellowRoof3: townSlice(10, 3),
  yellowRoof4: townSlice(8, 4),
  yellowRoof5: townSlice(9, 4),
  yellowRoof6: townSlice(10, 4),
  yellowRoof7: townSlice(8, 5),
  yellowRoof8: townSlice(9, 5),
  yellowRoof9: townSlice(10, 5),
  unit: townSlice(9, 12),

  // 인도
  sidewalk1: townSlice(8, 0),
  sidewalk2: townSlice(9, 0),
  sidewalk3: townSlice(10, 0),
  sidewalk4: townSlice(8, 1),
  sidewalk5: townSlice(9, 1),
  sidewalk6: townSlice(10, 1),
  sidewalk7: townSlice(8, 2),
  sidewalk8: townSlice(9, 2),
  sidewalk9: townSlice(10, 2),
  sidewalk10: townSlice(12, 2),
  sidewalk11: townSlice(15, 1),
  sidewalk12: townSlice(15, 0),


  // 주차장
  parkingLine1: townSlice(4, 17),
  parkingSymbol: townSlice(10, 16),
  barH: townSlice(1, 11),
  parkingMeter: townSlice(1, 7),
};
