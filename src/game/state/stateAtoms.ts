import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { MapId, charactersState } from "../data/types";
import { MAX_INVENTORY } from "../data/config";

export const currentMapIdAtom = atom<MapId>("town");

export type UiMode = "game" | "dialogue" | "project";
export const uiModeAtom = atom<UiMode>("game");

export const seenProjectsAtom = atom<Record<string, boolean>>({});
export const inventoryAtom = atom<Set<string>>(new Set<string>());
export const isMaxInventoryModeAtom = atom((get) => get(inventoryAtom).size >= MAX_INVENTORY);

// character, camera
export const charactersAtom = atom<charactersState>({
  x: 112,
  y: 240,
  dir: "down",
  moving: false,
});

export const cameraXAtom = atom(0);

// dialogue
export type DialogueState =
  | {
      npcId: string;
      name?: string;
      portraitUrl?: string;
      lines: string[];
      index: number;
    }
  | null;

export const dialogueAtom = atom<DialogueState>(null);

// interaction / ui
export const activeProjectAtom = atom<string | null>(null);
export const activeInteractableAtom = atom<string | null>(null);
export const interactHintAtom = atom<string | null>(null);

export type InteractAction =
  | { type: "project"; projectId: string }
  | { type: "dialogue"; lines: string[] };

export const activeInteractableActionAtom = atom<InteractAction | null>(null);

export const helpOpenAtom = atom(false);

export const soundEnabledAtom = atomWithStorage("sound_enabled", false);
