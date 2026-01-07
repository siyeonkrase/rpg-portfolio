// src/game/pixi/player/PlayerSprite.ts
import * as PIXI from "pixi.js";

export type Dir = "down" | "left" | "right" | "up";

export type FrameSpec =
  | { kind: "rect"; x: number; y: number; w: number; h: number }
  | { kind: "texture"; texture: PIXI.Texture };

export type AnimSet = {
  walk: Record<Dir, FrameSpec[]>;
  idle?: Partial<Record<Dir, FrameSpec>>;
  speed?: number;
};

type Ctor = {
  texture: PIXI.Texture;
  tileSize: number;
  sizeTiles?: number;

  frameW: number;
  frameH: number;

  // ✅ row 매핑 (너 시트 규칙)
  rows?: Record<Dir, number>;

  // ✅ idle이 항상 1번째 줄이면 여기로 고정
  idleRow?: number;

  walkCols?: number[];
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
  private idleCol: number;

  private direction: Dir = "down";
  private moving = false;

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

    // ✅ 좌우는 2번째 줄(row1), 상하는 3번째 줄(row2)
    this.rows = opts.rows ?? { down: 2, left: 1, right: 1, up: 2 };

    // ✅ idle은 무조건 1번째 줄(row0)
    this.idleRow = opts.idleRow;

    // ✅ 6칸이면 보통 0~5. 걷기엔 1~4 같은 걸 쓰는게 자연스러움
    this.walkCols = opts.walkCols ?? [1, 2, 3, 4];
    this.idleCol = opts.idleCol ?? 0;

    this.animSet = this.buildDefaultAnimSet();

    this.sprite = new PIXI.AnimatedSprite(this.makeFrames(this.animSet.idle?.down ? [this.animSet.idle.down] : this.animSet.walk.down));
    this.sprite.anchor.set(0.5, 1);
    this.sprite.loop = true;
    this.sprite.animationSpeed = this.animSet.speed ?? 0.12;
    this.sprite.gotoAndStop(0);

    this.applyWorldSize();
    this.applyFlip(); // ✅ 초기 방향 반영
  }

  public setDirection(dir: Dir, moving: boolean) {
    let newDir = this.direction;

    if (moving) {
      // ✅ 1. 이동 중일 때: 위/아래 이동이면 기존 좌/우 유지, 좌/우 이동이면 해당 방향 적용
      const isVertical = dir === "up" || dir === "down";
      newDir = isVertical ? this.direction : dir;
    } else {
      // ✅ 2. 완전히 멈췄을 때: 정면(down) 차렷 자세로 변경
      newDir = "down";
    }

    const changed = newDir !== this.direction || moving !== this.moving;
    this.direction = newDir;
    this.moving = moving;

    if (changed) {
      this.applyAnim();
    }
  }

  public setSizeTiles(sizeTiles: number) {
    this.sizeTiles = sizeTiles;
    this.applyWorldSize();
    this.applyFlip();
  }

  public setAnimSet(anim: AnimSet) {
    this.animSet = anim;
    this.sprite.animationSpeed = anim.speed ?? this.sprite.animationSpeed;
    this.applyAnim();
  }

  private applyAnim() {
    const dir = this.direction; // 위에서 수정한 대로 up/down 시에도 left/right 유지됨

    // 1. 현재 방향에 맞는 Idle(차렷) 프레임 설정
    // animSet.idle에 해당 방향 설정이 없으면 걷기 애니메이션의 첫 번째 프레임을 사용
    const idleSpec = this.animSet.idle?.[dir] ?? this.animSet.walk[dir]?.[0];
    const walkSpecs = this.animSet.walk[dir];

    // 2. 이동 중이면 걷기 프레임들, 멈췄으면 차렷 프레임 하나만 전달
    const specs = this.moving ? walkSpecs : (idleSpec ? [idleSpec] : [walkSpecs[0]]);

    // 3. 텍스처 교체
    this.sprite.textures = this.makeFrames(specs);

    console.log("Moving:", this.moving)
    if (this.moving) {
      // 이동 중이면 애니메이션 재생
      this.sprite.play();
    } else {
      // 멈췄으면 첫 번째 프레임(차렷)에서 정지
      this.sprite.gotoAndStop(0);
    }

    this.applyWorldSize();
    this.applyFlip();
  }

  private applyFlip() {
    // scale.x를 반전시킬 때, anchor가 0.5라면 제자리에서 반전됩니다.
    // 만약 캐릭터가 잘려 보인다면 anchor가 제대로 적용되지 않았을 수 있으니 다시 한 번 강제합니다.
    this.sprite.anchor.set(0.5, 1); 

    const absX = Math.abs(this.sprite.scale.x);
    if (this.direction === "left") {
      this.sprite.scale.x = -absX;
    } else if ((this.direction === "right")) {
      this.sprite.scale.x = absX;
    }
  }

  private makeFrames(specs: FrameSpec[]): PIXI.Texture[] {
    return specs.map((s) => {
      if (s.kind === "texture") return s.texture;
      const rect = new PIXI.Rectangle(s.x, s.y, s.w, s.h);
      return new PIXI.Texture(this.baseTexture, rect);
    });
  }

  private buildDefaultAnimSet(): AnimSet {
    const walk: Record<Dir, FrameSpec[]> = {
      down: this.walkCols.map((c) => this.frameRect("down", c)),
      left: this.walkCols.map((c) => this.frameRect("right", c)), // ✅ left도 right 프레임 쓰고 flip
      right: this.walkCols.map((c) => this.frameRect("right", c)),
      up: this.walkCols.map((c) => this.frameRect("up", c)),
    };

    // ✅ idle은 무조건 row0에서 가져오기
    const idle: Partial<Record<Dir, FrameSpec>> = {
      down: this.idleRect(this.idleCol),
      left: this.idleRect(this.idleCol),
      right: this.idleRect(this.idleCol),
      up: this.idleRect(this.idleCol),
    };

    return { walk, idle, speed: 0.12 };
  }

  private idleRect(col: number): FrameSpec {
    const row = this.idleRow ?? 0;
    return { kind: "rect", x: col * this.frameW, y: row * this.frameH, w: this.frameW, h: this.frameH };
  }

  private frameRect(dir: Dir, col: number): FrameSpec {
    const row = this.rows[dir];
    return {
      kind: "rect",
      x: col * this.frameW,
      y: row * this.frameH,
      w: this.frameW,
      h: this.frameH,
    };
  }

  private applyWorldSize() {
  const tex = this.sprite.texture;
  // frame.height가 0이거나 없을 경우를 대비해 기본값 32를 넣어줍니다.
  const srcH = tex.frame?.height ?? 32;

  const targetH = this.tileSize * this.sizeTiles;
  const s = targetH / srcH;

  const signX = this.sprite.scale.x < 0 ? -1 : 1;
  this.sprite.scale.set(s * signX, s);
}
}