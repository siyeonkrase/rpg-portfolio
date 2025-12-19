// src/routes/GamePage.tsx
import { GameCanvas } from "../game/pixi/GameCanvas";
import { DialogueBox } from "../components/ui/DialogueBox";
import { ProjectModal } from "../components/ui/ProjectModal";
import { HUD } from "../components/ui/HUD";
import { useGameKeyboard } from "../game/useGameKeyboard";

export default function GamePage() {
  useGameKeyboard();

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#020617",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          boxShadow: "0 0 40px rgba(0,0,0,0.6)",
        }}
      >
        <GameCanvas />
        <HUD />
        <DialogueBox />
        <ProjectModal />
      </div>
    </div>
  );
}
