export const TILE_SIZE = 32;

// 땅으로 취급할 타일 번호
export const SOLID_TILES: number[] = []; // 1만 충돌 처리. 나중에 2도 추가 가능

// 뷰포트(화면에 보이는 영역) 크기 (타일 단위)
export const VIEWPORT_WIDTH_TILES = 22;  // 20 * 32 = 640px
export const VIEWPORT_HEIGHT_TILES = 12; // 12 * 32 = 384px

// 물리 상수
export const GRAVITY = 2500;       // px/s^2
export const MOVE_SPEED = 220;     // px/s

// 상호작용 거리
export const INTERACT_DISTANCE = TILE_SIZE * 1.2;

// 플레이어 스폰 위치 (px)
export const PLAYER_SPAWN_X = 64;
export const PLAYER_SPAWN_Y = 64; // 살짝 공중에 두면 자연스럽게 바닥으로 떨어짐