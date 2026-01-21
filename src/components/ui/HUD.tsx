import React, { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { inventoryAtom, manualOpenAtom } from "../../game/state/gameAtoms";
import { PROJECT_INVENTORY_ICONS } from "../../game/data/projectInventory";
import { playCoinSound } from "../../game/utils/soundManager";
import "./HUD.css";
import styled, { keyframes } from "styled-components";
import manualIcon from "../../assets/manualIcon.png"

const SLOTS = ["flickfacts", "chromeapp", "crypto", "wedding", "bento"] as const;

const bounceTriplet = keyframes`
  0% { transform: translateY(0) scale(1); }

  5%   { transform: translateY(-12px) scaleX(0.9) scaleY(1.1); }
  10%  { transform: translateY(0) scaleX(1.05) scaleY(0.9); }

  16%  { transform: translateY(-25px) scaleX(0.8) scaleY(1.2); }
  21% { transform: translateY(0) scaleX(1.1) scaleY(0.8); }
  23%  { transform: translateY(0) scaleX(1.05) scaleY(0.9); }

  28%  { transform: translateY(-12px) scaleX(0.9) scaleY(1.1); }
  33%  { transform: translateY(0) scaleX(1.05) scaleY(0.9); }

  38%  { transform: translateY(-4px); }
  41%  { transform: translateY(0); }
  44%  { transform: translateY(-2px); }
  47%  { transform: translateY(0); }
  50%  { transform: translateY(-1px); }
  53%  { transform: translateY(0); }

  100% { transform: translateY(0); }
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

  animation: ${bounceTriplet} 3s ease-in-out infinite;

  &:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0px) scale(0.98);
  }
`;

function InventorySlot({ id, has }: { id: string; has: boolean }) {
  const [animate, setAnimate] = useState(false);
  const icon = PROJECT_INVENTORY_ICONS[id] ?? null;

  useEffect(() => {
    if (has) {
      playCoinSound();
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 500);
      return () => clearTimeout(timer);
    }
  }, [has]);

  return (
    <div className={`inventory-slot ${!has ? "empty" : ""} ${animate ? "acquired" : ""}`}>
      {has && icon ? <img src={icon} alt={id} className="inventory-icon" /> : null}
    </div>
  );
}

export function HUD() {
  const inventory = useAtomValue(inventoryAtom);
  const setManualOpen = useSetAtom(manualOpenAtom);

  return (
    <div className="hud-container">
      <Wrap
        type="button"
        onClick={() => setManualOpen(true)}
        aria-label="Open manual"
        title="Manual"
      >
          <img src={manualIcon} alt="Manual" width={40} height={40} style={{ imageRendering: "pixelated" }} />
      </Wrap>
      {SLOTS.map((id) => (
        <InventorySlot key={id} id={id} has={inventory.has(id)} />
      ))}
    </div>
  );
}