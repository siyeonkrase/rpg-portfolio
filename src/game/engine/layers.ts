import * as PIXI from "pixi.js";

export type WorldLayers = {
  root: PIXI.Container;
  ground: PIXI.Container;
  actors: PIXI.Container;
  occlusion: PIXI.Container;
};

export function createWorldLayers(): WorldLayers {
  const root = new PIXI.Container();

  const ground = new PIXI.Container();
  const actors = new PIXI.Container();
  const occlusion = new PIXI.Container();

  actors.sortableChildren = true;

  root.addChild(ground as any);
  root.addChild(actors as any);
  root.addChild(occlusion as any); // 항상 위

  return { root, ground, actors, occlusion };
}
