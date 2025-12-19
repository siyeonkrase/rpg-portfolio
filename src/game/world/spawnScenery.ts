// src/game/world/spawnScenery.ts
import * as PIXI from "pixi.js";
import { setDepth } from "./depth";
import type { CollisionWorld, AABB } from "./collision";
import type { WorldLayers } from "./layers";
import type { SceneryInstance } from "./sceneryTypes";

// 네 프로젝트 에셋/텍스쳐 방식에 맞춰 교체
function sprite(textureId: string) {
  return PIXI.Sprite.from(textureId);
}

export function spawnScenery(
  inst: SceneryInstance,
  layers: WorldLayers,
  collision: CollisionWorld
) {
  switch (inst.kind) {
    case "treeGreenTall":
      return spawnTreeTall(inst, layers, collision);
    case "houseA":
      return spawnHouseA(inst, layers, collision);
    case "board":
      return spawnBoard(inst, layers, collision);
    case "fountain":
      return spawnFountain(inst, layers, collision);
  }
}

function spawnTreeTall(
  inst: SceneryInstance,
  layers: WorldLayers,
  collision: CollisionWorld
) {
  // trunk
  const trunk = sprite("tree_tall_trunk"); // 너의 텍스쳐 키로 바꾸기
  trunk.anchor.set(0.5, 1);
  trunk.x = inst.x;
  trunk.y = inst.y;
  layers.actors.addChild(trunk as any);
  setDepth(trunk as any, trunk.y);

  // leaves (항상 위)
  const leaves = sprite("tree_tall_leaves");
  leaves.anchor.set(0.5, 1);
  leaves.x = inst.x;
  leaves.y = inst.y;
  layers.occlusion.addChild(leaves as any);

  // collider: trunk 발판 영역만
  // 튜닝 포인트: w/h, y 오프셋
  const box: AABB = { x: inst.x - 10, y: inst.y - 12, w: 20, h: 12 };
  collision.add(box);
}

function spawnHouseA(inst: SceneryInstance, layers: WorldLayers, collision: CollisionWorld) {
  const base = sprite("houseA_base");
  base.anchor.set(0.5, 1);
  base.x = inst.x;
  base.y = inst.y;
  layers.actors.addChild(base as any);
  setDepth(base as any, base.y);

  const roof = sprite("houseA_roof");
  roof.anchor.set(0.5, 1);
  roof.x = inst.x;
  roof.y = inst.y;
  layers.occlusion.addChild(roof as any);

  // collider: 건물 벽 영역
  collision.add({ x: inst.x - 32, y: inst.y - 32, w: 64, h: 32 });
}

function spawnBoard(inst: SceneryInstance, layers: WorldLayers, collision: CollisionWorld) {
  // 보드도 “다리/하단(충돌)”과 “상단판(가림 필요 없으면 actors)”로 나눌 수 있음
  const base = sprite("board_base");
  base.anchor.set(0.5, 1);
  base.x = inst.x;
  base.y = inst.y;
  layers.actors.addChild(base as any);
  setDepth(base as any, base.y);

  // 보드 다리만 충돌시키고 싶으면 작은 collider
  collision.add({ x: inst.x - 20, y: inst.y - 10, w: 40, h: 10 });
}

function spawnFountain(inst: SceneryInstance, layers: WorldLayers, collision: CollisionWorld) {
  const base = sprite("fountain_base");
  base.anchor.set(0.5, 1);
  base.x = inst.x;
  base.y = inst.y;
  layers.actors.addChild(base as any);
  setDepth(base as any, base.y);

  // 물 분사 AnimatedSprite는 occlusion에 두면 “항상 위”가 됨
  // or actors에 두고 depth정렬로 자연스럽게 섞이게 해도 됨 (취향)
  // 지금은 미뤄둔다 했으니 생략 가능

  collision.add({ x: inst.x - 16, y: inst.y - 16, w: 32, h: 16 });
}
