import { atom } from "jotai";
import { activeProjectAtom, inventoryAtom, seenProjectsAtom, uiModeAtom } from "./gameAtoms";

export const addInventoryAtom = atom(null, (get, set, projectId: string) => {
  const prev = get(inventoryAtom);
  if (prev.has(projectId)) return;

  const next = new Set(prev);
  next.add(projectId);
  set(inventoryAtom, next);
});

export const resetInventoryAtom = atom(null, (_get, set) => {
  set(inventoryAtom, new Set<string>());
});

export const closeProjectAtom = atom(null, (get, set) => {
  const active = get(activeProjectAtom);
  if (!active) return;

  const seen = get(seenProjectsAtom);
  if (!seen[active]) {
    set(seenProjectsAtom, { ...seen, [active]: true });

    const inv = get(inventoryAtom);
    const next = new Set(inv);
    next.add(active);
    set(inventoryAtom, next);
  }

  set(activeProjectAtom, null);
  set(uiModeAtom, "game");
});