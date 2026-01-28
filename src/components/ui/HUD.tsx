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