import { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";

import { GameCanvas } from "../game/render/GameCanvas";
import { DialogueBox } from "../components/ui/DialogueBox";
import { ProjectModal } from "../components/ui/ProjectModal";
import { HUD } from "../components/ui/HUD";
import { useGameKeyboard } from "../game/input/useGameKeyboard";

import { seenProjectsAtom, uiModeAtom } from "../game/state/gameAtoms";
import { resetInventoryAtom } from "../game/state/inventoryAtoms";
import { initSounds } from "../game/utils/soundManager";
import { InteractionHint } from "../components/ui/InteractionHint";

import { LOGICAL_W, LOGICAL_H } from "../game/data/config";
import { preloadImages, GAME_ASSETS } from "../game/data/gameAssets";
import { Manual } from "../components/ui/Manual";
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
        const urls = [
        GAME_ASSETS.movieModalPng,
        GAME_ASSETS.comModalPng,
        GAME_ASSETS.cryptoModalPng,
        GAME_ASSETS.weddingModalPng,
        GAME_ASSETS.kanbanModalPng,
        GAME_ASSETS.weddingShot,
        GAME_ASSETS.movieShot,
        GAME_ASSETS.bentoShot,
        GAME_ASSETS.chromeShot,
        GAME_ASSETS.cryptoShot,
        ];

        await preloadImages(urls);

        if (!cancelled) setIsLoading(false);
      } catch {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isLoading) initSounds();
  }, [isLoading]);

  useGameKeyboard();

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
        <Manual />
        {uiMode === "dialogue" && <DialogueBox />}
        {uiMode === "project" && <ProjectModal />}
        {isLoading && <Loading />}
      </div>
    </div>
  );
}