import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { useAtom, useAtomValue } from "jotai";
import { currentMapIdAtom, charactersAtom, cameraXAtom, activeInteractableAtom, interactHintAtom, activeProjectAtom, inventoryAtom, activeInteractableActionAtom, dialogueAtom, uiModeAtom, soundEnabledAtom } from "../state/stateAtoms";
import { maps, scenery, landmarks, houses } from "../data/maps";
import { TILE_SIZE, LOGICAL_W, LOGICAL_H, MAX_INVENTORY } from "../data/config";
import { tiles } from "../render/tilesets/tileset";
import { drawWorld, attachBillboardTicker, type BillboardInfo, LANDMARK_DEFS, addChurchSprite, DOOR_TILE_IDS_BY_LANDMARK_ID, drawSceneryObjects, isSolidKind } from "../render/draw/drawWorld";
import { enableDepthSorting, setDepth } from "../engine/depth";
import { drawStickyNotesOnBoard } from "../render/draw/drawStickyNotes";
import { CharacterSprite } from "../character/characterSprite";
import { makeVillagerAnim } from "../character/characterAnims";
import { playItemAcquiredEffect } from "./draw/drawItemEffect";
import { PROJECT_INVENTORY_ICONS } from "../data/projectInventory";
import { GAME_ASSET_URLS, GAME_ASSETS, preloadImages } from "../data/gameAssets";
import type { AABB } from "../engine/aabb";
import { aabbIntersects } from "../engine/aabb";
import { createHighlight, tickHighlights, type HighlightHandle } from "../render/draw/drawHighlight";
import { aabbFromDoorTiles } from "../engine/door";
import type { DoorTile } from "../engine/door";
import { SLOTS } from "../../components/ui/HUD";
import { playMaxInvenSequence } from "./draw/drawMaxInvenEffect";
import bgm_town from "../../assets/sounds/bgm_town.mp3"
import { BGM_VOLUME } from "../utils/soundManager";
import { CollisionWorld } from "../engine/collisionWorld";

const WORLD_OFFSET_Y = 0;

type Layers = {
  ground: PIXI.Container;
  world: PIXI.Container;
};

type Interactable = {
  id: string;
  aabb: AABB;
  hint: string;
  action: { type: "project"; projectId: string };
};

function createLayers(): Layers {
  const ground = new PIXI.Container();
  const world = new PIXI.Container();

  world.sortableChildren = true;

  return { ground, world };
}

const palette = {
  skyBottom: 0x5f8dd3,
};

const TILE_CODE = {
  EMPTY: 0,
  GRASS: 1,
  GRASS_DECO: 2,
  GRASS_FLOWER: 3,
  DIRT1: 4,
  DIRT2: 5,
  DIRT3: 6,
  DIRT4: 7,
  DIRT5: 8,
  DIRT6: 9,
  DIRT7: 10,
  DIRT8: 11,
  DIRT9: 12,
  PATH: 13,
} as const;

function groundTexFromCode(code: number): PIXI.Texture | null {
  switch (code) {
    case TILE_CODE.EMPTY:
      return null;
    case TILE_CODE.GRASS:
      return tiles.grass;
    case TILE_CODE.GRASS_DECO:
      return tiles.grassDecor;
    case TILE_CODE.GRASS_FLOWER:
      return tiles.grassFlower;
    case TILE_CODE.DIRT1:
      return tiles.dirt1;
    case TILE_CODE.DIRT2:
      return tiles.dirt2;
    case TILE_CODE.DIRT3:
      return tiles.dirt3;
    case TILE_CODE.DIRT4:
      return tiles.dirt4;
    case TILE_CODE.DIRT5:
      return tiles.dirt5;
    case TILE_CODE.DIRT6:
      return tiles.dirt6;
    case TILE_CODE.DIRT7:
      return tiles.dirt7;
    case TILE_CODE.DIRT8:
      return tiles.dirt8;
    case TILE_CODE.DIRT9:
      return tiles.dirt9;
    case TILE_CODE.PATH:
      return tiles.path;
    default:
      return tiles.grass;
  }
}

function findDoorTilesByIds(ids: string[]): DoorTile[] {
  return scenery.filter((o: any) => ids.includes(o.id)) as DoorTile[];
}

export function GameCanvas() {
  const [activeInteractable, setActiveInteractable] = useAtom(activeInteractableAtom);
  const [, setHint] = useAtom(interactHintAtom);
  const [, setActiveAction] = useAtom(activeInteractableActionAtom);
  const [, setDialogue] = useAtom(dialogueAtom);
  const [uiMode, setUiMode] = useAtom(uiModeAtom);
  
  const inventory = useAtomValue(inventoryAtom);
  const isSoundEnabled = useAtomValue(soundEnabledAtom);
  const activeProject = useAtomValue(activeProjectAtom);
  const currentMapId = useAtomValue(currentMapIdAtom);
  const characters = useAtomValue(charactersAtom);
  const cameraX = useAtomValue(cameraXAtom);
  
  const collisionRef = useRef<CollisionWorld | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const rootRef = useRef<PIXI.Container | null>(null);
  const cameraLayerRef = useRef<PIXI.Container | null>(null);
  const layersRef = useRef<Layers | null>(null);

  const characterSpriteRef = useRef<CharacterSprite | null>(null);
  const prevPosRef = useRef<{ x: number; y: number } | null>(null);
  
  const lastCountRef = useRef(inventory.size);
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  
  const highlightsRef = useRef<HighlightHandle[]>([]);
  const interactablesRef = useRef<Interactable[]>([]);

  const billboardsRef = useRef<BillboardInfo[]>([]);
  const boardFaceRef = useRef<Record<string, AABB>>({});
  const prevUiMode = useRef(uiMode);

  const map = maps[currentMapId];

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await preloadImages(GAME_ASSET_URLS);
        await PIXI.Assets.load(GAME_ASSET_URLS as string[]);
        if (cancelled) return;
      } catch (e) {
        if (cancelled) return;
        console.warn("[assets] preload failed (continuing anyway)", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (appRef.current || !canvasRef.current) return;

    const app = new PIXI.Application({
      view: canvasRef.current,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: palette.skyBottom,
      antialias: false,
      autoDensity: true,
      resolution: window.devicePixelRatio || 1,
    });

    const root = new PIXI.Container();
    const cameraLayer = new PIXI.Container();
    root.addChild(cameraLayer as any);

    const layers = createLayers();
    cameraLayer.sortableChildren = true;

    layers.ground.zIndex = 0;
    layers.world.zIndex = 1000;

    cameraLayer.addChild(layers.ground as any);
    cameraLayer.addChild(layers.world as any);

    cameraLayer.sortChildren();

    const tex = PIXI.Texture.from(GAME_ASSETS.villagerManPng);
    const characterSprite = new CharacterSprite({
      texture: tex,
      tileSize: TILE_SIZE,
      sizeTiles: 2.2,
      frameW: 32,
      frameH: 32,
      walkRow: 1,
      walkCols: [1, 2, 3, 4],
    });

    characterSprite.setAnimSet(
      makeVillagerAnim({
        frameW: 32,
        frameH: 32,
        row: 1,
        walkCols: [0, 1, 2, 3, 4, 5],
        speed: 0.18,
      })
    );

    characterSpriteRef.current = characterSprite;
    prevPosRef.current = { x: characters.x, y: characters.y };

    (window as any).charactersContainer = characterSprite.sprite;
    (window as any).pixiApp = app;

    setDepth(characterSprite.sprite as any, "characters", characters.y);
    layers.world.addChild(characterSprite.sprite as any);

    app.stage.addChild(root as any);
    enableDepthSorting(cameraLayer);

    const cw = new CollisionWorld();
    collisionRef.current = cw;
    (globalThis as any).collisionWorld = cw;

    appRef.current = app;
    rootRef.current = root;
    cameraLayerRef.current = cameraLayer;
    layersRef.current = layers;

    const doResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      app.renderer.resize(w, h);

      const scale = Math.max(w / LOGICAL_W, h / LOGICAL_H);
      const intScale = Math.max(1, Math.ceil(scale));

      root.scale.set(intScale);
      root.x = Math.floor((w - LOGICAL_W * intScale) / 2);
      root.y = Math.floor((h - LOGICAL_H * intScale) / 2);
    };

    doResize();
    window.addEventListener("resize", doResize);

    return () => {
      window.removeEventListener("resize", doResize);

      delete (window as any).pixiApp;
      delete (window as any).charactersContainer;

      app.destroy(true);

      appRef.current = null;
      rootRef.current = null;
      cameraLayerRef.current = null;
      layersRef.current = null;
      collisionRef.current = null;
      characterSpriteRef.current = null;
      prevPosRef.current = null;
      delete (globalThis as any).collisionWorld;
    };
  }, []);

  useEffect(() => {
    const cameraLayer = cameraLayerRef.current;
    const layers = layersRef.current;
    const cw = collisionRef.current;

    if (!cameraLayer || !layers || !cw || !map) return;

    interactablesRef.current = [];
    setActiveInteractable(null);
    setHint(null);

    layers.ground.removeChildren();
    layers.world.removeChildren();

    for (const h of highlightsRef.current) h.destroy();
    highlightsRef.current = [];

    cw.clear();
    billboardsRef.current = [];

    const tileLayer = new PIXI.Container();
    setDepth(tileLayer as any, "world");

    for (let y = 0; y < map.tiles.length; y++) {
      const row = map.tiles[y];
      for (let x = 0; x < row.length; x++) {
        const tex = groundTexFromCode(row[x]);
        if (!tex) continue;

        const sprite = new PIXI.Sprite(tex);
        sprite.x = x * TILE_SIZE;
        sprite.y = y * TILE_SIZE;
        sprite.width = TILE_SIZE;
        sprite.height = TILE_SIZE;
        setDepth(sprite as any, "world");
        tileLayer.addChild(sprite as any);
      }
    }
    layers.ground.addChild(tileLayer as any);

    drawWorld({ building: layers.world, object: layers.world, overlay: layers.world } as any, currentMapId, billboardsRef.current);

    boardFaceRef.current = {};

    for (const lm of landmarks) {
      if (lm.kind !== "board") continue;

      const def = (LANDMARK_DEFS as any)[lm.kind];
      if (!def) continue;

      const boardFaceX = lm.x - (def.width * TILE_SIZE) / 2;
      const boardFaceY = lm.y - def.height * TILE_SIZE;
      const boardFaceW = def.width * TILE_SIZE;
      const boardFaceH = def.height * TILE_SIZE;

      const offsetX = 2;
      const offsetY = 0;
      const bottomOffset = 4;

      const faceX = boardFaceX + offsetX;
      const faceY = boardFaceY + offsetY + 2;
      const faceW = boardFaceW - offsetX * 2;
      const faceH = boardFaceH - offsetY - bottomOffset;

      drawStickyNotesOnBoard(layers.world, faceX, faceY, faceW, faceH, 6);

      boardFaceRef.current[lm.id] = { x: faceX, y: faceY, w: faceW, h: faceH };
    }

    const churchX = 43 * TILE_SIZE;
    const churchY = 6 * TILE_SIZE;
    const church = addChurchSprite(layers.world, churchX, churchY);

    setDepth(church.sprite as any, "world");

    layers.world.sortChildren();

    const CHURCH_W_TILES = 5;
    const churchW = CHURCH_W_TILES * TILE_SIZE;

    const CHURCH_SRC_W = 1536;
    const CHURCH_SRC_H = 1024;
    const churchH = (CHURCH_SRC_H / CHURCH_SRC_W) * churchW;

    const boxX = churchX - churchW / 2;
    const boxY = churchY - churchH;
    const boxW = churchW;
    const boxH = churchH;

    cw.add({ x: boxX, y: boxY, w: boxW, h: boxH });

    for (const lm of landmarks) {
      const def = (LANDMARK_DEFS as any)[lm.kind];
      if (!def) continue;

      const left = lm.x - (def.width * TILE_SIZE) / 2;
      const top = lm.y - def.height * TILE_SIZE;

      cw.add({ x: left, y: top, w: def.width * TILE_SIZE, h: def.height * TILE_SIZE });
    }

    const PROJECT_BY_LANDMARK_ID: Record<string, string> = {
      "lm-cinema": "flickfacts",
      "lm-computer": "chromeapp",
      "lm-bank": "crypto",
      "lm-board": "bento",
    };

    for (const lm of landmarks) {
      const def = (LANDMARK_DEFS as any)[lm.kind];
      if (!def) continue;

      let aabb: AABB;

      if (lm.kind === "board") {
        const b = def.interactBox ?? { x: -1.5, y: -2.0, w: 3.0, h: 3.0 };
        aabb = {
          x: lm.x + b.x * TILE_SIZE,
          y: lm.y + b.y * TILE_SIZE,
          w: b.w * TILE_SIZE,
          h: b.h * TILE_SIZE,
        };
      } else {
        const d = def.doorBox ?? { x: -1.1, y: -1.6, w: 2.2, h: 1.6 };
        aabb = {
          x: lm.x + d.x * TILE_SIZE,
          y: lm.y + d.y * TILE_SIZE,
          w: d.w * TILE_SIZE,
          h: d.h * TILE_SIZE,
        };
      }

      const projectId = PROJECT_BY_LANDMARK_ID[lm.id];
      if (!projectId) continue;

      interactablesRef.current.push({
        id: lm.id,
        aabb,
        hint: "E : Open",
        action: { type: "project", projectId },
      });

      const face = boardFaceRef.current[lm.id];

      const doorIds = DOOR_TILE_IDS_BY_LANDMARK_ID[lm.id];
      const doorTiles = doorIds ? findDoorTilesByIds(doorIds) : [];
      const doorBox = doorTiles.length ? aabbFromDoorTiles(doorTiles) : null;

      let highlightBox = lm.kind === "board" && face ? face : doorBox ?? aabb;

        if (lm.id === "lm-bank") {
          const leftTrim = 4;
          const rightTrim = 2;

          highlightBox = {
            x: highlightBox.x + leftTrim,
            y: highlightBox.y,
            w: highlightBox.w - leftTrim - rightTrim,
            h: highlightBox.h,
          };
        }


      highlightsRef.current.push(
        createHighlight(layers.world, projectId, highlightBox, { pad: 0 })
      );
    }

    interactablesRef.current.push({
      id: "lm-church",
      aabb: {
        x: churchX - TILE_SIZE * 1.2,
        y: churchY - TILE_SIZE * 1.6,
        w: TILE_SIZE * 2.4,
        h: TILE_SIZE * 1.6,
      },
      hint: "E : Open",
      action: { type: "project", projectId: "wedding" },
    });

    const churchDoorBox: AABB = {
      x: churchX - TILE_SIZE * 0.55,
      y: churchY - TILE_SIZE * 1.75,
      w: TILE_SIZE * 1.1,
      h: TILE_SIZE * 1.4,
    };

    highlightsRef.current.push(
      createHighlight(layers.world, "wedding", churchDoorBox, { pad: 0 })
    );

    for (const h of houses) {
      const houseWidthTiles = h.kind === "orangeS" || h.kind === "blueS" ? 3 : 4;
      const houseHeightTiles = 3;

      const worldX = h.x * TILE_SIZE;
      const groundY = h.y * TILE_SIZE;

      const left = worldX - (houseWidthTiles * TILE_SIZE) / 2;
      const top = groundY - houseHeightTiles * TILE_SIZE;

      cw.add({ x: left, y: top, w: houseWidthTiles * TILE_SIZE, h: houseHeightTiles * TILE_SIZE });
    }

    drawSceneryObjects(scenery, { world: layers.world, buildingDetail: layers.world }, cw, isSolidKind);

    if (characterSpriteRef.current) {
      layers.world.addChild(characterSpriteRef.current.sprite as any);
    }
    layers.world.sortChildren();
  }, [currentMapId, map]);

  useEffect(() => {
    const cameraLayer = cameraLayerRef.current;
    const cs = characterSpriteRef.current;
    if (!cameraLayer || !cs) return;
    
    cameraLayer.x = -cameraX;
    cameraLayer.y = WORLD_OFFSET_Y;

    cs.sprite.x = characters.x;
    cs.sprite.y = characters.y + WORLD_OFFSET_Y;

    cs.setDirection(characters.dir, characters.moving);

    // setCharacterDepthFromWorldY(cs.sprite as any, characters.y + WORLD_OFFSET_Y);

    prevPosRef.current = { x: characters.x, y: characters.y };
  }, [characters.x, characters.y, characters.dir, characters.moving, cameraX]);

  useEffect(() => {
    const app = appRef.current;
    if (!app) return;

    const cleanup = attachBillboardTicker(app, billboardsRef as unknown as { current: BillboardInfo[] });
    return () => cleanup?.();
  }, []);

  useEffect(() => {
    const app = appRef.current;
    if (!app) return;

    const tick = (delta: number) => {
      tickHighlights(highlightsRef.current, delta);
    };

    app.ticker.add(tick);
    return () => {
      app.ticker.remove(tick);
    };
  }, []);

  useEffect(() => {
    if (activeProject) return;

    const app = appRef.current;
    if (!app) return;

    const update = () => {
      const char = characterSpriteRef.current;
      if (!char) return;

      const cx = char.sprite.x;
      const cy = char.sprite.y;

      const checker: AABB = {
        x: cx - TILE_SIZE * 0.6,
        y: cy - TILE_SIZE * 0.9,
        w: TILE_SIZE * 1.2,
        h: TILE_SIZE * 0.9,
      };

      const list = interactablesRef.current;
      let hit: Interactable | null = null;

      for (const it of list) {
        if (aabbIntersects(checker, it.aabb)) {
          hit = it;
          break;
        }
      }

      const nextId = hit ? hit.id : null;

      if (nextId !== activeInteractable) {
        setActiveInteractable(nextId);
        setHint(hit ? hit.hint : null);
        setActiveAction(hit ? hit.action : null);
      }
    };

    app.ticker.add(update);
    return () => {
      app.ticker.remove(update);
    };
  }, [activeInteractable, setActiveInteractable, setHint]);

  useEffect(() => {
    for (const h of highlightsRef.current) {
      h.setVisible(!inventory.has(h.projectId));
    }
  }, [inventory]);


  useEffect(() => {
  if (inventory.size > lastCountRef.current) {
    const sprite = characterSpriteRef.current;
    const layers = layersRef.current;
    const app = appRef.current;

    if (sprite && layers && app) {
      const inventoryArray = Array.from(inventory);
      const lastItemId = inventoryArray[inventoryArray.length - 1];
      const texture = PIXI.Texture.from(PROJECT_INVENTORY_ICONS[lastItemId] || PROJECT_INVENTORY_ICONS[0]);

      playItemAcquiredEffect(
        layers.world, 
        sprite.sprite.x, 
        sprite.sprite.y, 
        texture,
        () => {
          const isMaxInven = inventory.size >= MAX_INVENTORY;
          
          if (isMaxInven) {
            const iconPaths = SLOTS.map(id => PROJECT_INVENTORY_ICONS[id]);
            
            playMaxInvenSequence(app, sprite.sprite, iconPaths, () => {
              setTimeout(() => {
                setDialogue({
                  npcId: "characters",
                  index: 0,
                  lines: [
                    "......!",
                    "Wait, what was that? My bag is... shaking?",
                    "Everything I've collected... it's all starting to glow together!",
                    "Perhaps I should check my bag!",
                  ]
                });

                setUiMode("dialogue");
              }, 800);
            });
          }
        }
      );
    }
  }
  lastCountRef.current = inventory.size;
}, [inventory]);

  useEffect(() => {
    return () => {
      for (const h of highlightsRef.current) h.destroy();
      highlightsRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (prevUiMode.current === "dialogue" && uiMode === "game") {
      if (inventory.size >= MAX_INVENTORY) {
        setTimeout(() => {
          const slots = document.querySelectorAll('.hud-slot');
          console.log("Found slots after dialogue:", slots.length); 

          if (slots.length > 0) {
            slots.forEach((slot, index) => {
              setTimeout(() => {
                slot.classList.add('inventory-pulse');

                setTimeout(() => {
                  slot.classList.remove('inventory-pulse');
                }, 2000);
              }, index * 100);
            });
          }
        }, 300)

      }
    }
    prevUiMode.current = uiMode;
  }, [uiMode, inventory.size]);

  useEffect(() => {
    if(!bgmRef.current) {
      const audio = new Audio(bgm_town); 
      audio.loop = true;
      bgmRef.current = audio;
    }

    const audio = bgmRef.current;
    audio.volume = isSoundEnabled ? BGM_VOLUME : 0;

    const startBgm = () => {
      audio.play()
        .then(() => {
          console.log("BGM 재생 성공!");
          cleanupListeners();
        })
        .catch(err => console.log("BGM 자동 재생 차단됨, 대기 중..."));
    };

    const cleanupListeners = () => {
      window.removeEventListener("click", startBgm);
      window.removeEventListener("keydown", startBgm);
    };

    window.addEventListener("click", startBgm);
    window.addEventListener("keydown", startBgm);

    startBgm();

    return () => {
      audio.pause();
      audio.src = "";
      cleanupListeners();
    }
  }, []);

  useEffect(() => {
    if (bgmRef.current) {
      bgmRef.current.volume = isSoundEnabled ? BGM_VOLUME : 0;
    }
  }, [isSoundEnabled]);

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <canvas
        id="game-canvas"
        ref={canvasRef}
        tabIndex={0}
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          imageRendering: "pixelated",
          zIndex: 0,
        }}
      />
    </div>
  );
}