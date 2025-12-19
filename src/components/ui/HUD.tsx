// src/components/ui/HUD.tsx
import React from "react";
import { useAtomValue } from "jotai";
import { currentMapIdAtom } from "../../game/state/gameAtoms";
import { maps } from "../../game/maps";

export function HUD() {
  const currentMapId = useAtomValue(currentMapIdAtom);
  const map = maps[currentMapId];

  return (
    <div
      style={{
        position: "absolute",
        left: 8,
        top: 8,
        padding: "4px 8px",
        backgroundColor: "rgba(0,0,0,0.5)",
        color: "#fff",
        fontFamily: "monospace",
        fontSize: 12,
      }}
    >
      <div>Map: {map.name}</div>
      <div>Move: Arrow / WASD · Interact: Enter / Space</div>
    </div>
  );
}
