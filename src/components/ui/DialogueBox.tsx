// src/components/ui/DialogueBox.tsx
import React from "react";
import { useAtom } from "jotai";
import { dialogueAtom } from "../../game/state/gameAtoms";

export function DialogueBox() {
  const [dialogue, setDialogue] = useAtom(dialogueAtom);

  if (!dialogue) return null;

  const { lines, index } = dialogue;
  const last = index >= lines.length - 1;

  const handleClick = () => {
    if (last) {
      setDialogue(null);
    } else {
      setDialogue(prev =>
        prev ? { ...prev, index: prev.index + 1 } : prev
      );
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        width: "100%",
        padding: "10px 16px",
        backgroundColor: "rgba(0,0,0,0.8)",
        color: "#ffffff",
        fontFamily: "monospace",
        fontSize: 14,
        boxSizing: "border-box",
        cursor: "pointer",
      }}
      onClick={handleClick}
    >
      <div style={{ marginBottom: 4 }}>{lines[index]}</div>
      <div style={{ fontSize: 11, opacity: 0.7 }}>
        {last ? "Click / Enter : close" : "Click / Enter : next"}
      </div>
    </div>
  );
}
