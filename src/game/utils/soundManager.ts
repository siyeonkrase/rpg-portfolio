import { sound } from "@pixi/sound";

import coinSound from "../../assets/sounds/coin.mp3";
import walkondirt1 from "../../assets/sounds/walkondirt1.mp3";
import walkondirt2 from "../../assets/sounds/walkondirt2.mp3";
import walkondirt3 from "../../assets/sounds/walkondirt3.mp3";
import walkongrass1 from "../../assets/sounds/walkongrass1.mp3";
import walkongrass2 from "../../assets/sounds/walkongrass2.mp3";
import walkongrass3 from "../../assets/sounds/walkongrass3.mp3";
import walkonpath from "../../assets/sounds/walkonpath.mp3";

const DIRT_CODES = [4, 5, 6, 7, 8, 9, 10, 11, 12];
const PATH_CODES = [13];

let _inited = false;

const PATH_SLICES: Array<[number, number]> = [
  [0.0, 0.35],
  [0.4, 0.75],
  [0.85, 1.2],
  [1.3, 1.65],
];

export const initSounds = () => {
  if (_inited) return;
  _inited = true;

  if (!sound.exists("coin")) sound.add("coin", coinSound);

  if (!sound.exists("dirt1")) sound.add("dirt1", walkondirt1);
  if (!sound.exists("dirt2")) sound.add("dirt2", walkondirt2);
  if (!sound.exists("dirt3")) sound.add("dirt3", walkondirt3);

  if (!sound.exists("grass1")) sound.add("grass1", walkongrass1);
  if (!sound.exists("grass2")) sound.add("grass2", walkongrass2);
  if (!sound.exists("grass3")) sound.add("grass3", walkongrass3);

  if (!sound.exists("path")) sound.add("path", walkonpath);
};

const randRate = () => 0.95 + Math.random() * 0.1;

const safePlay = (alias: string, opts?: Parameters<typeof sound.play>[1]) => {
  if (!_inited) return;
  try {
    sound.play(alias, opts as any);
  } catch {
    // ignore
  }
};

export const playCoinSound = () =>
  safePlay("coin", {
    volume: 0.4,
    speed: randRate(),
  } as any);

export const playStepByCoords = (
  x: number,
  y: number,
  tiles: number[][],
  tileSize: number = 32
) => {
  const col = Math.floor(x / tileSize);
  const row = Math.floor(y / tileSize);
  const code = tiles[row]?.[col];
  if (code === undefined) return;

  const speed = randRate();

  if (PATH_CODES.includes(code)) {
    const i = Math.floor(Math.random() * 4);
    const [start, end] = PATH_SLICES[i];

    safePlay("path", {
      volume: 0.2,
      speed,
      start,
      end,
    } as any);

    return;
  }

  if (DIRT_CODES.includes(code)) {
    const i = 1 + Math.floor(Math.random() * 3);
    safePlay(`dirt${i}`, { volume: 0.15, speed } as any);
    return;
  }

  const i = 1 + Math.floor(Math.random() * 3);
  safePlay(`grass${i}`, { volume: 0.15, speed } as any);
};