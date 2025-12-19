// src/game/useGameKeyboard.ts
import { useEffect, useRef } from "react";
import { useAtom, useAtomValue } from "jotai";
import { playerAtom, cameraXAtom, currentMapIdAtom } from "./state/gameAtoms";
import { TILE_SIZE, VIEWPORT_WIDTH_TILES, VIEWPORT_HEIGHT_TILES } from "./config";
import { maps, isBlockedAt } from "./maps";

const MOVE_SPEED = 500; // px/s
const VIEWPORT_WIDTH_PX = VIEWPORT_WIDTH_TILES * TILE_SIZE;
const VIEWPORT_HEIGHT_PX = VIEWPORT_HEIGHT_TILES * TILE_SIZE;

type PressState = {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
};

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

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const k = e.key;

      if (
        k === "ArrowLeft" || k === "ArrowRight" ||
        k === "ArrowUp"   || k === "ArrowDown"  ||
        k === "w" || k === "W" ||
        k === "a" || k === "A" ||
        k === "s" || k === "S" ||
        k === "d" || k === "D"
      ) {
        e.preventDefault();
      }

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
      if (lastTimeRef.current == null) {
        lastTimeRef.current = time;
      }
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
        const map = maps[currentMapId];
        const mapWidthTiles = map.tiles[0].length;
        // const mapHeightTiles = map.tiles.length;
        const mapWidthPx = mapWidthTiles * TILE_SIZE;
        // const mapHeightPx = mapHeightTiles * TILE_SIZE;

        setPlayer((prev) => {
          let nextX = prev.x + dx * MOVE_SPEED * dt;
          let nextY = prev.y + dy * MOVE_SPEED * dt;

          // 🔹 충돌 체크는 지금 비활성화 상태 유지 (에디터 모드)
          // const tileX = Math.floor(nextX / TILE_SIZE);
          // const tileY = Math.floor(nextY / TILE_SIZE);
          // if (isBlockedAt(currentMapId, tileX, tileY)) { ... }

          // 🔹 맵 밖으로 너무 튀어나가는 것만 대충 막기
          const margin = TILE_SIZE * 0.1;
          nextX = Math.min(Math.max(nextX, margin), mapWidthPx - margin);

          const maxY = VIEWPORT_HEIGHT_PX - margin;
          nextY = Math.min(Math.max(nextY, margin), maxY);

          // 🔹 카메라: 플레이어를 가운데 두되,
          //    맵 밖(왼/오른쪽)은 절대 안 보이게 클램프
          let targetCameraX = nextX - VIEWPORT_WIDTH_PX / 2;

          if (mapWidthPx <= VIEWPORT_WIDTH_PX) {
            // 맵이 화면보다 짧으면 스크롤할 필요 없음
            targetCameraX = 0;
          } else {
            const maxCamX = mapWidthPx - VIEWPORT_WIDTH_PX;
            if (targetCameraX < 0) targetCameraX = 0;
            if (targetCameraX > maxCamX) targetCameraX = maxCamX;
          }

          // cameraX는 ref로 안 들고 그냥 여기서 바로 세팅
          setCameraX(targetCameraX);

          return {
            ...prev,
            x: nextX,
            y: nextY,
          };
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
