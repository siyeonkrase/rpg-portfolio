import React, { useEffect, useCallback } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import styled, { keyframes } from "styled-components";
import { manualOpenAtom, uiModeAtom } from "../../game/state/gameAtoms";

const popIn = keyframes`
  0% { transform: scale(0.9); opacity: 0; }
  70% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
`;

const Dim = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(6px);
`;

const Card = styled.div`
  position: relative;
  width: min(500px, 100%);
  background: #1a1a2e;
  border: 3px solid #3f5efb;
  box-shadow: 0 0 20px rgba(63, 94, 251, 0.4), inset 0 0 15px rgba(0,0,0,0.5);
  border-radius: 8px;
  padding: 30px;
  color: #fff;
  animation: ${popIn} 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
`;

const Title = styled.h2`
  margin: 0 0 20px;
  font-size: 32px;
  text-align: center;
  font-family: "KenneyMiniSquare";
  color: #fff;
  text-shadow: 3px 3px 0px #3f5efb;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 15px;
`;

const Body = styled.div`
  font-size: 18px;
  line-height: 1.8;
  font-family: "KenneyMini";
  
  b { color: #ffdf6b; }

  ul { 
    margin: 20px 0; 
    padding: 0; 
    list-style: none;
  }
  
  li { 
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px dashed rgba(255,255,255,0.1);
    padding-bottom: 4px;

    span:last-child {
      color: #3f5efb;
      font-weight: bold;
    }
  }
`;

const Btn = styled.button`
  width: 100%;
  margin-top: 20px;
  border: none;
  background: #fff;
  color: #000;
  padding: 12px;
  font-size: 20px;
  font-family: "KenneyMiniSquare";
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  outline: none;

  &:hover {
    background: #3f5efb;
    color: #fff;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
  }
`;

export function ManualOverlay() {
  const isOpen = useAtomValue(manualOpenAtom);
  const setOpen = useSetAtom(manualOpenAtom);
  const setUiMode = useSetAtom(uiModeAtom);

  const close = useCallback(() => {
    setOpen(false);
    setUiMode("game");
    setTimeout(() => document.getElementById("game-canvas")?.focus(), 10);
  }, [setOpen, setUiMode]);

  useEffect(() => {
    if (isOpen) setUiMode("dialogue");
  }, [isOpen, setUiMode]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <Overlay onClick={close}>
      <Dim />
      <Card onClick={(e) => e.stopPropagation()}>
        <Title>HOW TO PLAY</Title>
        <Body>
          Explore the town and collect all <b>5 items</b><br/>
          by interacting with buildings.
          <ul>
            <li><span>Move</span> <span>WASD / ARROWS</span></li>
            <li><span>Interact</span> <span>E</span></li>
            <li><span>Close</span> <span>ESC</span></li>
          </ul>
        </Body>
        <Btn onClick={close}>BACK TO GAME</Btn>
      </Card>
    </Overlay>
  );
}