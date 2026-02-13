import * as PIXI from "pixi.js";

import { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";

import { GameCanvas } from "../game/render/GameCanvas";
import { DialogueBox } from "../components/ui/DialogueBox";
import { ProjectModal } from "../components/ui/ProjectModal";
import { HUD } from "../components/ui/HUD";
import { useGameKeyboard } from "../game/input/useGameKeyboard";

import { seenProjectsAtom, uiModeAtom } from "../game/state/stateAtoms";
import { resetInventoryAtom } from "../game/state/actionAtoms";
import { initSounds } from "../game/utils/soundManager";
import { InteractionHint } from "../components/ui/InteractionHint";

import { LOGICAL_W, LOGICAL_H } from "../game/data/config";
import { preloadImages, GAME_ASSETS } from "../game/data/gameAssets";
import { Help } from "../components/ui/Help";
import { Loading } from "../components/ui/Loading";

export default function GamePage() {
  const [isLoading, setIsLoading] = useState(true);

  const uiMode = useAtomValue(uiModeAtom);
  const setSeen = useSetAtom(seenProjectsAtom);
  const resetInv = useSetAtom(resetInventoryAtom);

  useEffect(() => {
    setSeen({});
    resetInv();
  }, [setSeen, resetInv]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const allAssets = Object.values(GAME_ASSETS);
        await preloadImages(allAssets);
        await Promise.all(
          allAssets.map(url => PIXI.Assets.load(url))
        );
        await new Promise((res) => requestAnimationFrame(() => setTimeout(res, 500)));

        if (!cancelled) setIsLoading(false);
      } catch (e) {
        console.error("Asset loading failed", e);
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!isLoading) initSounds();
  }, [isLoading]);

  useEffect(() => {
    if (uiMode === "game") {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        canvas.focus();
      }
    }
  }, [uiMode]);

  useGameKeyboard();

  if (isLoading) return <Loading />;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#020617",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          aspectRatio: `${LOGICAL_W} / ${LOGICAL_H}`,
          width: "100%",
          height: "100%",
          maxWidth: "100vw",
          maxHeight: "100vh",
          
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 40px rgba(0,0,0,0.8)",
          backgroundColor: "#020617",
        }}
      >
        <GameCanvas />
        <HUD />
        <InteractionHint />
        <Help />
        {uiMode === "dialogue" && <DialogueBox />}
        {uiMode === "project" && <ProjectModal />}
      </div>
    </div>
  );
}