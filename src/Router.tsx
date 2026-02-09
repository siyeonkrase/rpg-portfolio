import { Routes, Route, HashRouter, Link } from "react-router-dom";
import GamePage from "./routes/GamePage";
import styled, { keyframes } from "styled-components";
import { GAME_ASSETS } from "./game/data/gameAssets";
import { useAtom } from "jotai";
import { soundEnabledAtom } from "./game/state/gameAtoms";
import { sound } from "@pixi/sound";
import { useEffect } from "react";

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0px rgba(255,255,255,0.2); }
  50% { transform: scale(1.05); box-shadow: 0 0 20px rgba(255,255,255,0.4); }
  100% { transform: scale(1); box-shadow: 0 0 0px rgba(255,255,255,0.2); }
`;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle, #1a1a2e 0%, #020202 100%);
  color: #fff;
  text-align: center;
  padding: 20px;
`;

const Title = styled.h1`
  font-family: "KenneyMiniSquare";
  font-size: 48px;
  margin-bottom: 30px;
  color: #fff;
  text-shadow: 4px 4px 0px #3f5efb, 8px 8px 0px rgba(0,0,0,0.5);
  letter-spacing: 2px;
`;

const InfoBox = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 30px;
  max-width: 500px;
  backdrop-filter: blur(5px);
`;

const Body = styled.div`
  font-family: "KenneyMini";
  font-size: 20px;
  line-height: 1.8;
  
  b { color: #ffdf6b; text-shadow: 0 0 8px rgba(255,223,107,0.5); }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 20px 0;
    text-align: left;
    display: inline-block;
  }
  
  li {
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    &:before {
      content: "▶";
      font-size: 12px;
      margin-right: 10px;
      color: #3f5efb;
    }
  }
`;

const StyledLink = styled(Link)`
  margin-top: 40px;
  padding: 15px 40px;
  background: #fff;
  color: #000;
  text-decoration: none;
  font-family: "KenneyMiniSquare";
  font-size: 24px;
  border-radius: 4px;
  transition: all 0.2s;
  animation: ${pulse} 2s infinite ease-in-out;

  &:hover {
    background: #3f5efb;
    color: #fff;
    transform: translateY(-5px);
  }
`;

const Footer = styled.div`
  margin-top: 30px;
  font-size: 14px;
  opacity: 0.5;
  font-family: "monospace";
`;

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
          src={soundEnabled ? GAME_ASSETS.SpeakerOn : GAME_ASSETS.SpeakerOff} 
          alt="Sound Toggle" 
        />
      </SoundToggle>
      <Routes>
        <Route
          path="/"
          element={
            <Container>
              <Title>SIYEON'S RPG PORTFOLIO</Title>

              <InfoBox>
                <Body>
                  Explore the town and collect all <b>5 items</b><br/>
                  by interacting with highlighted objects.

                  <div style={{ display: 'block', textAlign: 'center' }}>
                    <ul>
                      <li><span><b>WASD /  ARROWS</b> Move</span></li>
                      <li><span><b>E</b> Interact</span></li>
                      <li><span><b>ESC</b> Close</span></li>
                    </ul>
                  </div>

                  <div style={{ marginTop: 20, fontSize: '16px', color: '#aaa' }}>
                    This project is a work in progress.<br/>
                    Feedback is always welcome!
                  </div>
                </Body>
              </InfoBox>

              <StyledLink to="/game">
                PRESS TO START
              </StyledLink>

              <Footer>
                sykang8361@gmail.com
              </Footer>
            </Container>
          }
        />

        <Route path="/game" element={<GamePage />} />
      </Routes>
    </HashRouter>
  );
}
