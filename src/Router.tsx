import { Routes, Route, HashRouter } from "react-router-dom";
import GamePage from "./routes/GamePage";
import StartPage from "./routes/StartPage";
import styled from "styled-components";
import { GAME_ASSETS } from "./game/data/gameAssets";
import { useAtom } from "jotai";
import { soundEnabledAtom } from "./game/state/stateAtoms";
import { sound } from "@pixi/sound";
import { useEffect } from "react";


const SoundToggle = styled.div`
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 11000;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  padding: 10px;
  border-radius: 8px;
  transition: all 0.2s;
  backdrop-filter: blur(5px);

  img {
    width: 32px;
    height: 32px;
    mix-blend-mode: screen;
    image-rendering: pixelated;
  }

  &:hover {
    border-color: #fff;
    transform: scale(1.1);
  }
`;

export default function Router() {
  const [soundEnabled, setSoundEnabled] = useAtom(soundEnabledAtom);
  
  useEffect(() => {
    if (soundEnabled) {
      sound.unmuteAll();
    } else {
      sound.stopAll(); 
      sound.muteAll();
    }
  }, [soundEnabled]);
  
  return (
    <HashRouter>
      <SoundToggle onClick={() => setSoundEnabled(!soundEnabled)}>
        <img 
          src={soundEnabled ? GAME_ASSETS.speakerOn : GAME_ASSETS.speakerOff} 
          alt="Sound Toggle" 
        />
      </SoundToggle>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </HashRouter>
  );
}
