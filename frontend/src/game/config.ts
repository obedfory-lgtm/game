import { GameConfig } from "phaser";

const TILE = 32;

const config: GameConfig = {
  type: "WEBGL",
  parent: "game-root",
  width: 1280,
  height: 720,
  scale: {
    mode: "scale.FIT",
    autoRound: true,
    parent: "game-root",
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scene: [BootScene, WorldScene],
  renderPixelArt: true,
  antialias: false,
};

export default config;
export { TILE };

class BootScene extends import("phaser").Scene {
  constructor() { super("Boot"); }
  preload() {
    this.load.image("tile_floor", "/assets/tiles/floor.png");
    this.load.image("tile_wall", "/assets/tiles/wall.png");
    this.load.image("tile_grass", "/assets/tiles/grass.png");
    this.load.image("tile_water", "/assets/tiles/water.png");
    this.load.image("tile_path", "/assets/tiles/path.png");
    this.load.image("door", "/assets/tiles/door.png");
    this.load.image("portal", "/assets/tiles/portal.png");
    this.load.image("sign", "/assets/tiles/sign.png");
    this.load.image("chest", "/assets/tiles/chest.png");
    this.load.image("npc", "/assets/sprites/npc.png");
    this.load.image("player", "/assets/sprites/player.png");
    this.load.image("chat_bg", "/assets/ui/chat-bg.png");
    this.load.audio("footstep", "/assets/sfx/footstep.mp3");
    this.load.audio("door_open", "/assets/sfx/door_open.mp3");
    this.load.audio("chime", "/assets/sfx/chime.mp3");
  }
  create() {
    this.scene.start("World");
  }
}

// WorldScene imported dynamically in main.ts to avoid circular scene registration.