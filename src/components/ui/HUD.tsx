import React, { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { inventoryAtom } from "../../game/state/gameAtoms";
import { PROJECT_INVENTORY_ICONS } from "../../game/data/projectInventory";
import { playCoinSound } from "../../game/utils/soundManager";
import "./HUD.css";

const SLOTS = ["flickfacts", "chromeapp", "crypto", "wedding", "bento"] as const;

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
      {has ? (
        icon ? (
          <img src={icon} alt={id} className="inventory-icon" />
        ) : (
          <span className="no-icon-text">NO ICON</span>
        )
      ) : null}
    </div>
  );
}

export function HUD() {
  const inventory = useAtomValue(inventoryAtom);

  return (
    <div className="hud-container">
      {SLOTS.map((id) => (
        <InventorySlot key={id} id={id} has={inventory.has(id)} />
      ))}
    </div>
  );
}