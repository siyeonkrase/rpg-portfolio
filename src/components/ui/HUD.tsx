import React, { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { activeProjectAtom, inventoryAtom, isMasterModeAtom, manualOpenAtom, uiModeAtom } from "../../game/state/gameAtoms";
import { PROJECT_INVENTORY_ICONS } from "../../game/data/projectInventory";
import { playCoinSound } from "../../game/utils/soundManager";
import "./HUD.css";
import styled, { css, keyframes } from "styled-components";
import manualIcon from "../../assets/manualIcon.png"

export const SLOTS = ["flickfacts", "chromeapp", "crypto", "wedding", "bento"] as const;

const bounceTriplet = keyframes`
  0%, 100% { transform: translateY(0) scale(1); animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1); }

  7%   { transform: translateY(-30px) scaleX(0.85) scaleY(1.2); animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1); }
  14%  { transform: translateY(0) scaleX(1.2) scaleY(0.75); animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1); }
  17%  { transform: translateY(0) scaleX(1) scaleY(1); }

  23%  { transform: translateY(-15px) scaleX(0.9) scaleY(1.1); animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1); }
  29%  { transform: translateY(0) scaleX(1.1) scaleY(0.85); animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1); }

  34%  { transform: translateY(-8px) scaleX(0.95) scaleY(1.05); animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1); }
  39%  { transform: translateY(0) scaleX(1.05) scaleY(0.95); animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1); }

  44%  { transform: translateY(-3px); }
  48%  { transform: translateY(0); }
  100% { transform: translateY(0); }
`;

const masterGlow = keyframes`
  0% { box-shadow: 0 0 5px #00ff88; border-color: #00ff88; }
  50% { box-shadow: 0 0 20px #00ff88; border-color: #fff; }
  100% { box-shadow: 0 0 5px #00ff88; border-color: #00ff88; }
`;

const Wrap = styled.button`
  position: fixed;
  left: 20px;
  bottom: 14px;
  z-index: 9999;

  width: 42px;
  height: 42px;

  border: none;
  background: transparent;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  user-select: none;

  animation: ${bounceTriplet} 2.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;

  &:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0px) scale(0.98);
  }
`;

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

const pulseGlow = keyframes`
  0%, 100% { filter: drop-shadow(0 0 2px #00d4ff) brightness(1); }
  50% { filter: drop-shadow(0 0 8px #00d4ff) brightness(1.3); }
`;

const StyledSlot = styled.div<{ $isMaster: boolean; $has: boolean }>`
  width: 48px;
  height: 48px;
  background: ${props => props.$isMaster ? "rgba(0, 30, 60, 0.7)" : "rgba(0, 0, 0, 0.6)"};
  border: 2px solid ${props => props.$isMaster ? "#00d4ff" : "#444"};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  ${props => props.$isMaster && props.$has && css`
    cursor: pointer;
    border-color: #fff;
    box-shadow: 0 0 15px rgba(0, 212, 255, 0.4);
    animation: ${pulseGlow} 2s infinite;

    &::after {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0; height: 100%;
      background: linear-gradient(to bottom, transparent, rgba(0, 212, 255, 0.2), transparent);
      animation: ${scanline} 1.5s linear infinite;
    }
  `}

  &:hover {
    ${props => props.$isMaster && props.$has && css`
      transform: translateY(-4px) scale(1.05);
      background: rgba(0, 212, 255, 0.2);
      box-shadow: 0 0 20px rgba(0, 212, 255, 0.6);
    `}
  }

  .inventory-icon {
    width: 32px;
    height: 32px;
    image-rendering: pixelated;
    z-index: 2;
  }
`;

const StatusLight = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00ff88;
  box-shadow: 0 0 5px #00ff88;
  z-index: 3;
`;

const MasterHeader = styled.div`
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: #00d4ff;
  white-space: nowrap;
  letter-spacing: 2px;
  font-weight: bold;
  text-shadow: 0 0 5px #00d4ff;
`;

interface InventorySlotProps {
  id: string;
  has: boolean;
  isMaster: boolean;
  className?: string;
}

function InventorySlot({ id, has, isMaster, className }: InventorySlotProps) {
  const [animate, setAnimate] = useState(false);
  const icon = PROJECT_INVENTORY_ICONS[id] ?? null;
  
  const setActiveProject = useSetAtom(activeProjectAtom);
  const setUiMode = useSetAtom(uiModeAtom);

  useEffect(() => {
    if (has) {
      playCoinSound();
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 500);
      return () => clearTimeout(timer);
    }
  }, [has]);

  const handleClick = () => {
    if (isMaster && has) {
      setActiveProject(id);
      setUiMode("project");
    }
  };

  return (
    <StyledSlot 
      $isMaster={isMaster} 
      $has={has}
      className={`inventory-slot ${!has ? "empty" : ""} ${animate ? "acquired" : ""} ${className || ""}`}
      onClick={handleClick}
    >
      {has && icon ? <img src={icon} alt={id} className="inventory-icon" /> : null}
      {/* {isMaster && has && <StatusLight />} */}
    </StyledSlot>
  );
}

export function HUD() {
  const inventory = useAtomValue(inventoryAtom);
  const isMaster = useAtomValue(isMasterModeAtom);
  const setManualOpen = useSetAtom(manualOpenAtom);

  const [hasPlayedEffect, setHasPlayedEffect] = useState(false);

  return (
    <div className={`hud-container ${isMaster ? "master-hud" : ""}`}>

      <Wrap
        type="button"
        onClick={() => setManualOpen(true)}
        aria-label="Open manual"
        title="Manual"
      >
        <img src={manualIcon} alt="Manual" width={40} height={40} style={{ imageRendering: "pixelated" }} />
      </Wrap>

      {SLOTS.map((id) => (
        <InventorySlot 
          className="hud-slot"
          key={id} 
          id={id} 
          has={inventory.has(id)} 
          isMaster={isMaster} 
        />
      ))}
    </div>
  );
}