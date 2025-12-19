import { atom } from "jotai";
import type { MapId, PlayerState } from "../types";

export const currentMapIdAtom = atom<MapId>("city");

export const playerAtom = atom<PlayerState>({
  // x: 112,
  // y: 240
  x: 1000,
  y: 240
});

// 카메라 X (px)
export const cameraXAtom = atom(0);

// 대화 / 모달은 기존 그대로 유지
export const dialogueAtom = atom<
  | {
      npcId: string;
      lines: string[];
      index: number;
    }
  | null
>(null);

export const activeProjectAtom = atom<string | null>(null);
