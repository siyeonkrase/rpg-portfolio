import { atom } from "jotai";
import type { MapId, PlayerState } from "../data/types";

export const currentMapIdAtom = atom<MapId>("town");
export const uiModeAtom = atom<"game" | "dialogue" | "project">("game");
export const seenProjectsAtom = atom<Record<string, boolean>>({});
export const inventoryAtom = atom<Set<string>>(new Set<string>());

export type PlayerEffect = { text: "SUCCESS!"; at: number } | null;
export const playerEffectAtom = atom<PlayerEffect>(null);

export const playerAtom = atom<PlayerState>({
  x: 112,
  y: 240,
  dir: "down",
  moving: false,
});

export const cameraXAtom = atom(0);

export const dialogueAtom = atom<
  | {
      npcId: string;
      name?: string;
      portraitUrl?: string;
      lines: string[];
      index: number;
    }
  | null
>(null);

export const activeProjectAtom = atom<string | null>(null);
export const activeInteractableAtom = atom<string | null>(null);
export const interactHintAtom = atom<string | null>(null);

export type InteractAction =
  | { type: "project"; projectId: string }
  | { type: "dialogue"; lines: string[] };

export const activeInteractableActionAtom = atom<InteractAction | null>(null);
