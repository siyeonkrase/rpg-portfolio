import * as PIXI from "pixi.js";
import { tiles } from "../tilesets/tileset";
import { townTiles } from "../tilesets/townTileset";
import { cityTiles } from "../tilesets/cityTileset";

export function texFromKind(kind: string): PIXI.Texture | null {
  switch (kind) {
    case "treeGreenGroup1": return tiles.treeGreenGroup1;
    case "treeGreenGroup2": return tiles.treeGreenGroup2;
    case "treeGreenGroup3": return tiles.treeGreenGroup3;
    case "treeGreenGroup4": return tiles.treeGreenGroup4;
    case "treeGreenGroup5": return tiles.treeGreenGroup5;
    case "treeGreenGroup6": return tiles.treeGreenGroup6;
    case "treeGreenGroup7": return tiles.treeGreenGroup7;
    case "treeGreenGroup8": return tiles.treeGreenGroup8;
    case "treeGreenGroup9": return tiles.treeGreenGroup9;

    case "treeYellowGroup1": return tiles.treeYellowGroup1;
    case "treeYellowGroup2": return tiles.treeYellowGroup2;
    case "treeYellowGroup3": return tiles.treeYellowGroup3;
    case "treeYellowGroup4": return tiles.treeYellowGroup4;
    case "treeYellowGroup5": return tiles.treeYellowGroup5;
    case "treeYellowGroup6": return tiles.treeYellowGroup6;
    case "treeYellowGroup7": return tiles.treeYellowGroup7;
    case "treeYellowGroup8": return tiles.treeYellowGroup8;
    case "treeYellowGroup9": return tiles.treeYellowGroup9;

    case "bush": return tiles.bush;
    case "treeYellowSmall": return tiles.treeYellowSmall;
    case "treeGreenSmall": return tiles.treeGreenSmall;
    case "plant": return tiles.plant;
    case "mushroom": return tiles.mushroom;

    case "treeYellowTall1": return tiles.treeYellowTall1;
    case "treeYellowTall2": return tiles.treeYellowTall2;
    case "treeGreenTall1": return tiles.treeGreenTall1;
    case "treeGreenTall2": return tiles.treeGreenTall2;

    case "well1": return tiles.wellT;
    case "well2": return tiles.wellB;

    case "fenceSquare1": return tiles.fenceSquare1;
    case "fenceSquare2": return tiles.fenceSquare2;
    case "fenceSquare3": return tiles.fenceSquare3;
    case "fenceSquare4": return tiles.fenceSquare4;
    case "fenceSquare5": return tiles.fenceSquare5;
    case "fenceSquare6": return tiles.fenceSquare6;
    case "fenceSquare7": return tiles.fenceSquare7;
    case "fenceSquare8": return tiles.fenceSquare8;

    case "fenceH1": return tiles.fenceH1;
    case "fenceH2": return tiles.fenceH2;
    case "fenceH3": return tiles.fenceH3;
    case "fenceV1": return tiles.fenceV1;
    case "fenceV2": return tiles.fenceV2;
    case "fenceV3": return tiles.fenceV3;

    case "sign": return tiles.sign;

    case "oneLightPoleT": return townTiles.oneLightPoleT;
    case "oneLightPoleB": return townTiles.oneLightPoleB;
    case "twoLightPoleLT": return townTiles.twoLightPoleLT;
    case "twoLightPoleRT": return townTiles.twoLightPoleRT;
    case "twoLightPoleB": return townTiles.twoLightPoleB;

    case "dryingPole1": return townTiles.dryingPole1;
    case "dryingPole2": return townTiles.dryingPole2;
    case "dryingPole3": return townTiles.dryingPole3;
    case "dryingPole4": return townTiles.dryingPole4;
    case "dryingPole5": return townTiles.dryingPole5;

    case "trashCan1": return townTiles.trashCan1;
    case "trashCan2": return townTiles.trashCan2;
    case "fireHyd": return townTiles.fireHyd;

    case "boxes1": return townTiles.boxes1;
    case "boxes2": return townTiles.boxes2;
    case "boxes3": return townTiles.boxes3;
    case "boxes4": return townTiles.boxes4;

    case "bench": return townTiles.bench;

    case "signRedL": return cityTiles.signRedL;
    case "signRedR": return cityTiles.signRedR;
    case "signBlueL": return cityTiles.signBlueL;
    case "signBlueR": return cityTiles.signBlueR;
    case "atm": return cityTiles.atm;

    case "parkingMeter": return townTiles.parkingMeter;
    case "barH": return townTiles.barH;

    case "board1": return cityTiles.board1;
    case "board2": return cityTiles.board2;
    case "board3": return cityTiles.board3;
    case "board4": return cityTiles.board4;
    case "board5": return cityTiles.board5;
    case "board6": return cityTiles.board6;
    case "board7": return cityTiles.board7;
    case "board8": return cityTiles.board8;
    case "board9": return cityTiles.board9;
    case "boardL": return cityTiles.boardL;
    case "boardR": return cityTiles.boardR;

    default:
      return null;
  }
}