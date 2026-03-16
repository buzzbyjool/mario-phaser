import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { TitleScene } from './scenes/TitleScene';
import { GameScene } from './scenes/GameScene';
import { GameOverScene } from './scenes/GameOverScene';

/**
 * Point d'entrée du jeu Mario-like
 * Configuration Phaser et lancement
 */
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  width: 800,
  height: 600,
  backgroundColor: '#5C94FC',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 800 },
      debug: false,
    },
  },
  scene: [BootScene, TitleScene, GameScene, GameOverScene],
  scale: {
    parent: 'game-container',
    mode: Phaser.Scale.RESIZE,
    width: '100%',
    height: '100%',
  },
  pixelArt: true,
  input: {
    activePointers: 3,
  },
};

new Phaser.Game(config);
