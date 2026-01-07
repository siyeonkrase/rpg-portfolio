import { useEffect, useRef } from "react";
import { useAtom, useAtomValue } from "jotai";
import { playerAtom, cameraXAtom, currentMapIdAtom } from "../state/gameAtoms";
import {
  TILE_SIZE,
  VIEWPORT_WIDTH_TILES,
  VIEWPORT_HEIGHT_TILES,
  MOVE_SPEED,
} from "../data/config";
import { maps } from "../data/maps";
import type { PlayerState } from "../data/types";

console.log("✅ useGameKeyboard file loaded (v-test-123)");

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

      // ✅ 1. 이동 여부 판단
      const isMoving = dx !== 0 || dy !== 0;

      // 대각선 보정
      if (dx !== 0 && dy !== 0) {
        const inv = 1 / Math.sqrt(2);
        dx *= inv;
        dy *= inv;
      }

      setPlayer((prev: PlayerState) => {
        let nextX = prev.x;
        let nextY = prev.y;
        let nextDir = prev.dir; // 기존 방향 유지

        if (isMoving) {
          nextX = prev.x + dx * MOVE_SPEED * dt;
          nextY = prev.y + dy * MOVE_SPEED * dt;

          // ✅ 방향 결정 로직: 좌우 입력이 있을 때만 방향 전환
          if (dx < 0) nextDir = "left";
          else if (dx > 0) nextDir = "right";

          // --- 충돌 및 클램프 로직 ---
          const map = maps["town"];
          const mapWidthTiles = map.tiles[0].length;
          const mapWidthPx = mapWidthTiles * TILE_SIZE;
          const cw = (globalThis as any).__collisionWorld;

          const margin = TILE_SIZE * 0.1;
          nextX = Math.min(Math.max(nextX, margin), mapWidthPx - margin);
          nextY = Math.min(Math.max(nextY, margin), VIEWPORT_HEIGHT_PX - margin);

          if (cw?.hitsAny) {
            if (cw.hitsAny(footBox(nextX, prev.y))) nextX = prev.x;
            if (cw.hitsAny(footBox(nextX, nextY))) nextY = prev.y;
          }
        } else {
          // ✅ 멈췄을 때: 정면 차렷 자세
          nextDir = "down";
        }

        // ✅ 카메라 업데이트 로직 추가
        const map = maps["town"];
        const mapWidthPx = map.tiles[0].length * TILE_SIZE;
        
        // 캐릭터를 화면 중앙에 두기 위한 계산
        let targetCameraX = nextX - VIEWPORT_WIDTH_PX / 2;

        // 맵 경계 클램프 (카메라가 맵 밖을 보지 않도록)
        if (mapWidthPx <= VIEWPORT_WIDTH_PX) {
          targetCameraX = 0;
        } else {
          const maxCamX = mapWidthPx - VIEWPORT_WIDTH_PX;
          if (targetCameraX < 0) targetCameraX = 0;
          if (targetCameraX > maxCamX) targetCameraX = maxCamX;
        }

        // Jotai Atom에 카메라 좌표 반영
        setCameraX(targetCameraX);

        return { 
          ...prev, 
          x: nextX, 
          y: nextY, 
          dir: nextDir, 
          moving: isMoving 
        };
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
  }, [setPlayer, setCameraX, currentMapId]);
}