import * as PIXI from "pixi.js";

export type InputDir = "down" | "left" | "right" | "up";
export type FaceDir = "left" | "right";

export type FrameSpec =
  | { kind: "rect"; x: number; y: number; w: number; h: number }
  | { kind: "texture"; texture: PIXI.Texture };

export type AnimSet = {
  walk: {
    right: FrameSpec[];
  };
  speed?: number;
};

type CharacterSpriteProps = {
  texture: PIXI.Texture;
  tileSize: number;
  sizeTiles?: number;
  frameW: number;
  frameH: number;
  walkRow: number;
  walkCols: number[];
  nearest?: boolean;
};

export class CharacterSprite {
  public sprite: PIXI.AnimatedSprite;
  private baseTexture: PIXI.BaseTexture;
  private tileSize: number;
  private sizeTiles: number;
  private frameW: number;
  private frameH: number;

  private rows: number;
  private walkCols: number[];

  private direction: FaceDir = "right";
  private moving = false;

  private animSet: AnimSet;

  constructor(opts: CharacterSpriteProps) {
    this.tileSize = opts.tileSize;
    this.sizeTiles = opts.sizeTiles ?? 2.2;

    const anyTex = opts.texture as any;
    const bt: PIXI.BaseTexture =
      anyTex.baseTexture ??
      anyTex.texture?.baseTexture ??
      (anyTex.source ? PIXI.BaseTexture.from(anyTex.source) : undefined);

    this.baseTexture = bt ?? (opts.texture.baseTexture as PIXI.BaseTexture);

    if (opts.nearest ?? true) {
      this.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    }

    this.frameW = opts.frameW;
    this.frameH = opts.frameH;

    this.rows = 1;
    this.walkCols = opts.walkCols ?? [1, 2, 3, 4];

    this.animSet = this.buildDefaultAnimSet();

    this.sprite = new PIXI.AnimatedSprite(this.makeFrames([this.animSet.walk.right[0]]));
    this.sprite.anchor.set(0.5, 1);
    this.sprite.loop = true;
    this.sprite.animationSpeed = this.animSet.speed ?? 0.12;
    this.sprite.gotoAndStop(0);

    this.applyWorldSize();
    this.applyFlip();
  }

  public setDirection(dir: InputDir, moving: boolean) {
    const prevDir = this.direction;
    const prevMoving = this.moving;

    if (moving) {
      if (dir === "left" || dir === "right") this.direction = dir;
    }
    this.moving = moving;

    if (this.direction === prevDir && this.moving === prevMoving) return;
    this.applyAnim();
  }

  public setAnimSet(anim: Partial<AnimSet>) {
    const next: AnimSet = {
      ...this.animSet,
      ...anim,
      walk: {
        ...this.animSet.walk,
        ...(anim.walk ?? {}),
      }
    };
    this.animSet = next;

    if (typeof anim.speed === "number") {
      this.sprite.animationSpeed = anim.speed;
    }

    this.applyAnim();
  }

  private applyAnim() {
    const walkSpecs = this.animSet.walk.right;
    if (!walkSpecs || walkSpecs.length === 0) return;

    const specs = this.moving ? walkSpecs : [walkSpecs[0]];
    this.sprite.textures = this.makeFrames(specs);

    if (this.moving) {
      this.sprite.play();
    } else {
      this.sprite.gotoAndStop(0);
    }

    this.applyWorldSize();
    this.applyFlip();
  }

  private applyFlip() {
    const absX = Math.abs(this.sprite.scale.x);
    this.sprite.scale.x = this.direction === "left" ? -absX : absX;
  }

  private makeFrames(specs: FrameSpec[]): PIXI.Texture[] {
    return specs.map((s) => {
      if (s.kind === "texture") return s.texture;
      return new PIXI.Texture(this.baseTexture, new PIXI.Rectangle(s.x, s.y, s.w, s.h));
    });
  }

  private buildDefaultAnimSet(): AnimSet {
    const walkRight = this.walkCols.map((c) => this.frameRect(this.rows, c));
    return { walk: { right: walkRight }, speed: 0.12 };
  }

  private frameRect(row: number, col: number): FrameSpec {
    return { kind: "rect", x: col * this.frameW, y: row * this.frameH, w: this.frameW, h: this.frameH };
  }

  private applyWorldSize() {
    const srcH = this.sprite.texture.frame?.height ?? this.frameH;
    const targetH = this.tileSize * this.sizeTiles;
    const s = targetH / srcH;

    const signX = this.sprite.scale.x < 0 ? -1 : 1;
    this.sprite.scale.set(s * signX, s);
  }
}