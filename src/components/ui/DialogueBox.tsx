import { useAtom } from "jotai";
import { dialogueAtom } from "../../game/state/gameAtoms";
import villagerManPng from "../../assets/MiniVillagerMan.png";

const PORTRAIT = {
  img: villagerManPng,
  frameW: 32,
  frameH: 32,
  cols: 6,
  // idle: row 0, col 0
  col: 0,
  row: 0,
  scale: 8,
};


function Portrait() {
  const { img, frameW, frameH, col, row, scale } = PORTRAIT;

  return (
    <div
      style={{
        width: frameW * scale,
        height: frameH * scale,
        backgroundImage: `url(${img})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `${frameW * 6 * scale}px ${frameH * 5 * scale}px`,
        backgroundPosition: `${-col * frameW * scale}px ${-row * frameH * scale}px`,
        imageRendering: "pixelated",
        flexShrink: 0,
        borderRadius: 6,
      }}
    />
  );
}

export function DialogueBox() {
  const [dialogue, setDialogue] = useAtom(dialogueAtom);
  if (!dialogue) return null;

  const { lines, index } = dialogue;
  const last = index >= lines.length - 1;

  const handleClick = () => {
    if (last) setDialogue(null);
    else setDialogue(d => d ? { ...d, index: d.index + 1 } : d);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        position: "fixed",
        left: 0,
        bottom: 0,
        width: "100%",
        padding: "12px 16px",
        boxSizing: "border-box",
        cursor: "pointer",
        zIndex: 2500,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 12,
          maxWidth: 720,
          margin: "0 auto",
        }}
      >
        <Portrait />

        <div
          style={{
            background: "rgba(0,0,0,0.8)",
            color: "#fff",
            padding: "10px 14px",
            borderRadius: 6,
            fontFamily: "monospace",
            fontSize: 14,
            lineHeight: 1.4,
            position: "relative",
          }}
        >
          {lines[index]}
          <div
            style={{
              marginTop: 6,
              fontSize: 11,
              opacity: 0.7,
              textAlign: "right",
            }}
          >
            {last ? "Click / Enter : close" : "Click / Enter : next"}
          </div>
        </div>
      </div>
    </div>
  );
}
