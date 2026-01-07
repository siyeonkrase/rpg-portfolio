import * as PIXI from "pixi.js";

export type WorldLayers = {
  ground: PIXI.Container;
  actors: PIXI.Container;
};

export function createWorldLayers(): WorldLayers {
  const ground = new PIXI.Container();
  const actors = new PIXI.Container();

  ground.sortableChildren = true;
  actors.sortableChildren = true;

  return { ground, actors };
}
