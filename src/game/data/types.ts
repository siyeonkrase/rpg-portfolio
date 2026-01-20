export type MapId = "town";
export type Dir = "down" | "left" | "right" | "up";

export interface PlayerState {
  x: number; // px
  y: number; // px
  dir: Dir;
  moving: boolean;
}

export interface MapData {
  id: MapId;
  name: string;
  tiles: number[][];
}

export interface NPC {
  id: string;
  mapId: MapId;
  x: number;
  y: number;
  lines: string[];
}

export interface Landmark {
  id: string;
  mapId: MapId;
  x: number;
  y: number;
  projectId: string;
}

export type SceneryKind =
  | "treeYellowTall1"
  | "treeYellowTall2"
  | "treeGreenTall1"
  | "treeGreenTall2"
  | "bush"
  | "treeYellowSmall"
  | "treeGreenSmall"
  | "plant"
  | "mushroom"
  | "treeGreenGroup1"
  | "treeGreenGroup2"
  | "treeGreenGroup3"
  | "treeGreenGroup4"
  | "treeGreenGroup5"
  | "treeGreenGroup6"
  | "treeGreenGroup7"
  | "treeGreenGroup8"
  | "treeGreenGroup9"
  | "treeYellowGroup1"
  | "treeYellowGroup2"
  | "treeYellowGroup3"
  | "treeYellowGroup4"
  | "treeYellowGroup5"
  | "treeYellowGroup6"
  | "treeYellowGroup7"
  | "treeYellowGroup8"
  | "treeYellowGroup9"
  | "well1"
  | "well2"
  | "fenceSquare1"
  | "fenceSquare2"
  | "fenceSquare3"
  | "fenceSquare4"
  | "fenceSquare5"
  | "fenceSquare6"
  | "fenceSquare7"
  | "fenceSquare8"
  | "fenceH1"
  | "fenceH2"
  | "fenceH3"
  | "fenceV1"
  | "fenceV2"
  | "fenceV3"
  | "sign"
  | "oneLightPoleT"
  | "oneLightPoleB"
  | "twoLightPoleLT"
  | "twoLightPoleRT"
  | "twoLightPoleB"
  | "dryingPole1"
  | "dryingPole2"
  | "dryingPole3"
  | "dryingPole4"
  | "dryingPole5"
  | "trashCan1"
  | "trashCan2"
  | "fireHyd"
  | "boxes1"
  | "boxes2"
  | "boxes3"
  | "boxes4"
  | "redWindowCenter1"
  | "redWindowCenter2"
  | "redWindowSide"
  | "redBigDoor"
  | "redSideDoor"
  | "unit"
  | "brownWindowCenter1"
  | "brownWindowCenter2"
  | "brownWindowSide"
  | "brownBigDoor1"
  | "brownBigDoor2"
  | "bench"
  | "signRedL"
  | "signRedR"
  | "signBlueL"
  | "signBlueR"
  | "atm"
  | "windowGrey"
  | "doorL"
  | "doorR"
  | "buildingWindowL"
  | "buildingWindowM"
  | "buildingWindowR"
  | "barH"
  | "parkingMeter"
  | "sunflowerT"
  | "sunflowerB"
  | "board1"
  | "board2"
  | "board3"
  | "board4"
  | "board5"
  | "board6"
  | "board7"
  | "board8"
  | "board9"
  | "boardL"
  | "boardR"
  | "displayBoard1"
  | "displayBoard2"
  | "displayBoard3"
  | "displayBoard4"
  | "displayBoard5"
  | "displayBoard6"
  | "fountain1"
  | "tomato"
  | "radish"
  | "carrot"
  | "corn"
  | "carrot2";
