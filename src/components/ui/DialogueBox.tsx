import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { dialogueAtom, uiModeAtom } from "../../game/state/stateAtoms";

export function DialogueBox() {
  const [dialogue, setDialogue] = useAtom(dialogueAtom);
  const [displayedText, setDisplayedText] = useState("");
  const [, setUiMode] = useAtom(uiModeAtom);

  const currentFullText = dialogue ? dialogue.lines[dialogue.index] : "";

  useEffect(() => {
    if (!dialogue) {
      setDisplayedText("");
      return;
    }

    setDisplayedText("");
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(currentFullText.slice(0, i + 1));
      i++;
      if (i >= currentFullText.length) clearInterval(timer);
    }, 40);

    return () => clearInterval(timer);
  }, [dialogue?.index, currentFullText]);

  if (!dialogue) return null;

  const last = dialogue.index >= dialogue.lines.length - 1;

  const handleClick = () => {
    if (displayedText.length < currentFullText.length) {
      setDisplayedText(currentFullText);
      return;
    }
    if (last) {
      setDialogue(null);
      setUiMode("game");
      const canvas = document.querySelector('canvas');
      if (canvas) canvas.focus();
    } else {
      setDialogue((dialogue) => (dialogue ? { ...dialogue, index: dialogue.index + 1 } : dialogue));
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        position: "fixed",
        left: "50%",
        bottom: "50px",
        transform: "translateX(-50%)",
        width: "650px",
        height: "170px",
        backgroundColor: "rgba(10, 10, 15, 0.95)",
        border: "3px solid #fff",
        borderRadius: "12px",
        padding: "25px",
        display: "flex",
        alignItems: "center",
        gap: "25px",
        cursor: "pointer",
        zIndex: 10060,
        boxSizing: "border-box",
        fontFamily: "'kenneyminisquare'",
        boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
        animation: "slideUp 0.3s ease-out"
      }}
    >

      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
        <div style={{ 
          fontSize: "20px", 
          color: "#eee", 
          lineHeight: "1.7", 
          wordBreak: "keep-all",
          textShadow: "2px 2px 0px rgba(0,0,0,0.5)" 
        }}>
          {displayedText}
          {displayedText.length < currentFullText.length && (
            <span style={{ marginLeft: "6px", animation: "blink 0.8s infinite", color: "#ffd700" }}>▼</span>
          )}
        </div>

        <div style={{ 
          fontSize: "14px", 
          color: "#888", 
          textAlign: "right",
          letterSpacing: "1px",
          fontWeight: "bold"
        }}>
            {last ? "CLOSE [Click]" : "NEXT [Click]"}
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes slideUp { from { transform: translate(-50%, 20px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
      `}</style>
    </div>
  );
}