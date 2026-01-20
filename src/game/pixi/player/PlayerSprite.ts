import * as PIXI from "pixi.js";

export type Dir = "down" | "left" | "right" | "up" | "jump";

export type FrameSpec =
  | { kind: "rect"; x: number; y: number; w: number; h: number }
  | { kind: "texture"; texture: PIXI.Texture };

export type AnimSet = {
  walk: Record<Dir, FrameSpec[]>;
  idle?: Partial<Record<Dir, FrameSpec>>;
  jump?: FrameSpec[];
  speed?: number;
};

type Ctor = {
  texture: PIXI.Texture;
  tileSize: number;
  sizeTiles?: number;
  frameW: number;
  frameH: number;
  rows?: Partial<Record<Dir, number>>;
  idleRow?: number;
  walkCols?: number[];
  jumpCols?: number[];
  idleCol?: number;
  nearest?: boolean;
};

export class PlayerSprite {
  public sprite: PIXI.AnimatedSprite;
  private baseTexture: PIXI.BaseTexture;
  private tileSize: number;
  private sizeTiles: number;
  private frameW: number;
  private frameH: number;

  private rows: Record<Dir, number>;
  private idleRow?: number;
  private walkCols: number[];
  private jumpCols: number[];
  private idleCol: number;

  private direction: Dir = "down";
  private moving = false;
  private isJumping = false;
  private animSet: AnimSet;

  constructor(opts: Ctor) {
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

    this.rows = { 
      down: 0, 
      left: 1, 
      right: 1, 
      up: 1, 
      jump: 2,
      ...(opts.rows || {}) 
    };

    this.idleRow = opts.idleRow ?? 0;
    this.walkCols = opts.walkCols ?? [1, 2, 3, 4];
    this.jumpCols = opts.jumpCols ?? [0, 1, 2];
    this.idleCol = opts.idleCol ?? 0;

    this.animSet = this.buildDefaultAnimSet();

    this.sprite = new PIXI.AnimatedSprite(this.makeFrames(this.animSet.idle?.down ? [this.animSet.idle.down] : this.animSet.walk.down));
    this.sprite.anchor.set(0.5, 1);
    this.sprite.loop = true;
    this.sprite.animationSpeed = this.animSet.speed ?? 0.12;
    this.sprite.gotoAndStop(0);

    this.applyWorldSize();
    this.applyFlip();
  }

  public setDirection(dir: Dir, moving: boolean) {
    if (this.isJumping) return;

    let newDir = this.direction;
    if (moving) {
      const isVertical = dir === "up" || dir === "down";
      newDir = isVertical ? this.direction : dir;
    } else {
      newDir = "down";
    }

    const changed = newDir !== this.direction || moving !== this.moving;
    this.direction = newDir;
    this.moving = moving;

    if (changed) this.applyAnim();
  }

  public setAnimSet(anim: Partial<AnimSet>) {
    this.animSet = { ...this.animSet, ...anim };
    this.sprite.animationSpeed = anim.speed ?? this.sprite.animationSpeed;
    this.applyAnim();
  }

  private applyAnim() {
    if (this.isJumping) return;
    const dir = this.direction;
    const idleSpec = this.animSet.idle?.[dir] ?? this.animSet.walk[dir]?.[0];
    const walkSpecs = this.animSet.walk[dir];
    const specs = this.moving ? walkSpecs : (idleSpec ? [idleSpec] : [walkSpecs[0]]);

    this.sprite.textures = this.makeFrames(specs);
    if (this.moving) this.sprite.play();
    else this.sprite.gotoAndStop(0);

    this.applyWorldSize();
    this.applyFlip();
  }

  public playJumpAnim() {
    if (this.isJumping) return;

    this.isJumping = true;
    const jumpSpecs = this.animSet.jump || this.jumpCols.map(c => this.frameRect("jump", c));
    
    this.sprite.textures = this.makeFrames(jumpSpecs);
    this.sprite.loop = false;
    this.sprite.gotoAndPlay(0);

    const duration = (jumpSpecs.length / this.sprite.animationSpeed) * 16.6; 

    setTimeout(() => {
      this.isJumping = false;
      this.sprite.loop = true;
      this.applyAnim();
    }, duration + 100);
  }

  private applyFlip() {
    this.sprite.anchor.set(0.5, 1); 
    const absX = Math.abs(this.sprite.scale.x);
    if (this.direction === "left") this.sprite.scale.x = -absX;
    else if (this.direction === "right") this.sprite.scale.x = absX;
  }

  private makeFrames(specs: FrameSpec[]): PIXI.Texture[] {
    return specs.map((s) => {
      if (s.kind === "texture") return s.texture;
      return new PIXI.Texture(this.baseTexture, new PIXI.Rectangle(s.x, s.y, s.w, s.h));
    });
  }

  private buildDefaultAnimSet(): AnimSet {
    const walk: Record<Dir, FrameSpec[]> = {
      down: this.walkCols.map((c) => this.frameRect("down", c)),
      left: this.walkCols.map((c) => this.frameRect("right", c)),
      right: this.walkCols.map((c) => this.frameRect("right", c)),
      up: this.walkCols.map((c) => this.frameRect("up", c)),
      jump: this.jumpCols.map((c) => this.frameRect("jump", c)),
    };

    const idle: Partial<Record<Dir, FrameSpec>> = {
      down: this.idleRect(this.idleCol),
      left: this.idleRect(this.idleCol),
      right: this.idleRect(this.idleCol),
      up: this.idleRect(this.idleCol),
    };

    return { walk, idle, jump: walk.jump, speed: 0.12 };
  }

  private idleRect(col: number): FrameSpec {
    const row = this.idleRow ?? 0;
    return { kind: "rect", x: col * this.frameW, y: row * this.frameH, w: this.frameW, h: this.frameH };
  }

  private frameRect(dir: Dir, col: number): FrameSpec {
    const row = this.rows[dir] ?? 0;
    return { kind: "rect", x: col * this.frameW, y: row * this.frameH, w: this.frameW, h: this.frameH };
  }

  private applyWorldSize() { 
    const srcH = this.sprite.texture.frame?.height ?? 32;
    const targetH = this.tileSize * this.sizeTiles;
    const s = targetH / srcH;
    const signX = this.sprite.scale.x < 0 ? -1 : 1;
    this.sprite.scale.set(s * signX, s);
  }
}