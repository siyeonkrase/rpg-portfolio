import { useEffect, useRef } from "react";
import { useAtom, useAtomValue } from "jotai";
import { playerAtom, cameraXAtom, currentMapIdAtom } from "../state/gameAtoms";
import {
  TILE_SIZE,
  VIEWPORT_WIDTH_TILES,
  VIEWPORT_HEIGHT_TILES,
} from "../data/config";
import { maps } from "../data/maps";
import type { PlayerState } from "../data/types";

console.log("✅ useGameKeyboard file loaded (v-test-123)");

const MOVE_SPEED = 500; // px/s
const VIEWPORT_WIDTH_PX = VIEWPORT_WIDTH_TILES * TILE_SIZE;
const VIEWPORT_HEIGHT_PX = VIEWPORT_HEIGHT_TILES * TILE_SIZE;

type PressState = {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
};

export type AABB = { x: number; y: number; w: number; h: number };
type CollisionWorldLike = {
  hitsAny?: (box: AABB) => boolean;
  solids?: AABB[];      // 디버그용(있을 수도/없을 수도)
  colliders?: AABB[];   // 디버그용(있을 수도/없을 수도)
};

// ✅ 발바닥 히트박스(중요!)
const FOOT_W = TILE_SIZE * 0.45;
const FOOT_H = TILE_SIZE * 0.25;
export function footBox(x: number, y: number): AABB {
  return {
    x: x - FOOT_W / 2,
    y: y - FOOT_H,
    w: FOOT_W,
    h: FOOT_H,
  };
}

// 로그 폭발 방지 (ms)
const DEBUG_LOG_EVERY_MS = 200;

export function useGameKeyboard() {
  const [, setPlayer] = useAtom(playerAtom);
  const [, setCameraX] = useAtom(cameraXAtom);
  const currentMapId = useAtomValue(currentMapIdAtom);

  const pressedRef = useRef<PressState>({
    left: false,
    right: false,
    up: false,
    down: false,
  });

  const lastTimeRef = useRef<number | null>(null);
  const lastLogRef = useRef<number>(0);

  useEffect(() => {
    console.log("✅ useGameKeyboard effect mounted (v-test-123)");
    function handleKeyDown(e: KeyboardEvent) {
      const k = e.key;

      const isMoveKey =
        k === "ArrowLeft" ||
        k === "ArrowRight" ||
        k === "ArrowUp" ||
        k === "ArrowDown" ||
        k === "w" ||
        k === "W" ||
        k === "a" ||
        k === "A" ||
        k === "s" ||
        k === "S" ||
        k === "d" ||
        k === "D";

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

      const { left, right, up, down } = pressedRef.current;

      let dx = 0;
      let dy = 0;
      if (left) dx -= 1;
      if (right) dx += 1;
      if (up) dy -= 1;
      if (down) dy += 1;

      // 대각선 보정
      if (dx !== 0 && dy !== 0) {
        const inv = 1 / Math.sqrt(2);
        dx *= inv;
        dy *= inv;
      }

      if (dx !== 0 || dy !== 0) {
        const map = maps["town"];
        const mapWidthTiles = map.tiles[0].length;
        const mapWidthPx = mapWidthTiles * TILE_SIZE;

        // ✅ GameCanvas에서 노출한 collision world 사용
        const cw = (globalThis as any).__collisionWorld as CollisionWorldLike | undefined;

        setPlayer((prev: PlayerState) => {
          let nextX = prev.x + dx * MOVE_SPEED * dt;
          let nextY = prev.y + dy * MOVE_SPEED * dt;

          // 🔹 맵 밖 클램프(기존 유지)
          const margin = TILE_SIZE * 0.1;
          nextX = Math.min(Math.max(nextX, margin), mapWidthPx - margin);

          const maxY = VIEWPORT_HEIGHT_PX - margin;
          nextY = Math.min(Math.max(nextY, margin), maxY);

          // ✅ 충돌: X 이동 먼저 (슬라이딩)
          if (cw?.hitsAny) {
            const tryX = footBox(nextX, prev.y);
            const hitX = cw.hitsAny(tryX);
            if (hitX) nextX = prev.x;

            const tryY = footBox(nextX, nextY);
            const hitY = cw.hitsAny(tryY);
            if (hitY) nextY = prev.y;

            // (디버그) 200ms에 1번만
            if (time - lastLogRef.current > DEBUG_LOG_EVERY_MS) {
              lastLogRef.current = time;

              const count =
                (cw.solids?.length ?? cw.colliders?.length ?? -1);

              console.log("[COLLISION]", {
                map: currentMapId,
                cwCount: count,
                prev: { x: prev.x, y: prev.y },
                next: { x: nextX, y: nextY },
                tryX,
                hitX,
                tryY,
                hitY,
              });
            }
          } else {
            // cw가 없거나 hitsAny가 없을 때도 1초에 1번 정도만 찍기
            if (time - lastLogRef.current > 1000) {
              lastLogRef.current = time;
              console.log("[COLLISION] cw missing or hitsAny missing", cw);
            }
          }

          // 🔹 카메라 (기존 유지)
          let targetCameraX = nextX - VIEWPORT_WIDTH_PX / 2;

          if (mapWidthPx <= VIEWPORT_WIDTH_PX) {
            targetCameraX = 0;
          } else {
            const maxCamX = mapWidthPx - VIEWPORT_WIDTH_PX;
            if (targetCameraX < 0) targetCameraX = 0;
            if (targetCameraX > maxCamX) targetCameraX = maxCamX;
          }

          setCameraX(targetCameraX);
          return { ...prev, x: nextX, y: nextY };
        });
      }

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(frameId);
      lastTimeRef.current = null;
    };
  }, [setPlayer, setCameraX, currentMapId]);
}