import { useEffect, useRef } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  playerAtom,
  cameraXAtom,
  currentMapIdAtom,
  uiModeAtom,
  activeProjectAtom,
  activeInteractableActionAtom,
} from "../state/gameAtoms";
import { closeProjectAtom } from "../state/inventoryAtoms";

import {
  TILE_SIZE,
  VIEWPORT_WIDTH_TILES,
  VIEWPORT_HEIGHT_TILES,
  MOVE_SPEED,
} from "../data/config";
import { maps } from "../data/maps";
import type { PlayerState } from "../data/types";
import { playStepByCoords } from "../utils/soundManager";

const VIEWPORT_WIDTH_PX = VIEWPORT_WIDTH_TILES * TILE_SIZE;
const VIEWPORT_HEIGHT_PX = VIEWPORT_HEIGHT_TILES * TILE_SIZE;

type PressState = { left: boolean; right: boolean; up: boolean; down: boolean };

export type AABB = { x: number; y: number; w: number; h: number };

const FOOT_W = TILE_SIZE * 0.45;
const FOOT_H = TILE_SIZE * 0.25;
export function footBox(x: number, y: number): AABB {
  return { x: x - FOOT_W / 2, y: y - FOOT_H, w: FOOT_W, h: FOOT_H };
}

export function useGameKeyboard() {
  const [, setPlayer] = useAtom(playerAtom);
  const [, setCameraX] = useAtom(cameraXAtom);
  const currentMapId = useAtomValue(currentMapIdAtom);

  const uiMode = useAtomValue(uiModeAtom);
  const setUiMode = useSetAtom(uiModeAtom);

  const activeAction = useAtomValue(activeInteractableActionAtom);
  const activeProject = useAtomValue(activeProjectAtom);
  const setActiveProject = useSetAtom(activeProjectAtom);
  const closeProject = useSetAtom(closeProjectAtom);

  const stepTimerRef = useRef<number>(0);
  const STEP_INTERVAL = 0.35;

  const pressedRef = useRef<PressState>({ left: false, right: false, up: false, down: false });
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;

      const key = e.key.toLowerCase();

      if (key === "escape") {
        closeProject();
        setUiMode("game");
        return;
      }

      if (key !== "e" && key !== "enter") return;

      if (!activeAction) return;

      if (activeAction.type === "project") {
        setActiveProject(activeAction.projectId);
        setUiMode("project");
      } else if (activeAction.type === "dialogue") {
        setUiMode("dialogue");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeAction, closeProject, setActiveProject, setUiMode]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (uiMode !== "game") return;

      const k = e.key;

      const isMoveKey =
        k === "ArrowLeft" ||
        k === "ArrowRight" ||
        k === "ArrowUp" ||
        k === "ArrowDown" ||
        k === "w" || k === "W" ||
        k === "a" || k === "A" ||
        k === "s" || k === "S" ||
        k === "d" || k === "D";

      if (isMoveKey) e.preventDefault();

      if (k === "ArrowLeft" || k === "a" || k === "A") pressedRef.current.left = true;
      if (k === "ArrowRight" || k === "d" || k === "D") pressedRef.current.right = true;
      if (k === "ArrowUp" || k === "w" || k === "W") pressedRef.current.up = true;
      if (k === "ArrowDown" || k === "s" || k === "S") pressedRef.current.down = true;
    }

    function handleKeyUp(e: KeyboardEvent) {
      const k = e.key;
      if (k === "ArrowLeft" || k === "a" || k === "A") pressedRef.current.left = false;
      if (k === "ArrowRight" || k === "d" || k === "D") pressedRef.current.right = false;
      if (k === "ArrowUp" || k === "w" || k === "W") pressedRef.current.up = false;
      if (k === "ArrowDown" || k === "s" || k === "S") pressedRef.current.down = false;
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    let frameId: number;

    const loop = (time: number) => {
      if (lastTimeRef.current == null) lastTimeRef.current = time;
      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      if (uiMode !== "game") {
        setPlayer((p) => ({ ...p, moving: false }));
        frameId = requestAnimationFrame(loop);
        return;
      }

      const { left, right, up, down } = pressedRef.current;

      let dx = 0;
      let dy = 0;
      if (left) dx -= 1;
      if (right) dx += 1;
      if (up) dy -= 1;
      if (down) dy += 1;

      const isMoving = dx !== 0 || dy !== 0;

      if (isMoving) {
        stepTimerRef.current += dt;
        if (stepTimerRef.current >= STEP_INTERVAL) {
          const currentMapData = maps["town"].tiles;
          setPlayer((p) => {
            playStepByCoords(p.x, p.y, currentMapData, TILE_SIZE);
            return p;
          });
          stepTimerRef.current = 0;
        }
      } else {
        stepTimerRef.current = STEP_INTERVAL;
      }

      if (dx !== 0 && dy !== 0) {
        const inv = 1 / Math.sqrt(2);
        dx *= inv;
        dy *= inv;
      }

      setPlayer((prev: PlayerState) => {
        let nextX = prev.x;
        let nextY = prev.y;
        let nextDir = prev.dir;

        if (isMoving) {
          nextX = prev.x + dx * MOVE_SPEED * dt;
          nextY = prev.y + dy * MOVE_SPEED * dt;

          if (dx < 0) nextDir = "left";
          else if (dx > 0) nextDir = "right";

          const map = maps["town"];
          const mapWidthPx = map.tiles[0].length * TILE_SIZE;
          const cw = (globalThis as any).__collisionWorld;

          const margin = TILE_SIZE * 0.1;
          nextX = Math.min(Math.max(nextX, margin), mapWidthPx - margin);
          nextY = Math.min(Math.max(nextY, margin), VIEWPORT_HEIGHT_PX - margin);

          if (cw?.hitsAny) {
            if (cw.hitsAny(footBox(nextX, prev.y))) nextX = prev.x;
            if (cw.hitsAny(footBox(nextX, nextY))) nextY = prev.y;
          }
        } else {
          nextDir = "down";
        }

        const map = maps["town"];
        const mapWidthPx = map.tiles[0].length * TILE_SIZE;
        let targetCameraX = nextX - VIEWPORT_WIDTH_PX / 2;

        if (mapWidthPx <= VIEWPORT_WIDTH_PX) {
          targetCameraX = 0;
        } else {
          const maxCamX = mapWidthPx - VIEWPORT_WIDTH_PX;
          if (targetCameraX < 0) targetCameraX = 0;
          if (targetCameraX > maxCamX) targetCameraX = maxCamX;
        }

        setCameraX(targetCameraX);

        return { ...prev, x: nextX, y: nextY, dir: nextDir, moving: isMoving };
      });

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(frameId);
      lastTimeRef.current = null;
    };
  }, [setPlayer, setCameraX, currentMapId, uiMode]);
}
