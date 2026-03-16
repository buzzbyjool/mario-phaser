import Phaser from 'phaser';

/**
 * Pièce collectable avec animation de rotation
 */
export class Coin extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'piece', 0);

    scene.add.existing(this);
    scene.physics.add.existing(this, true); // statique

    this.setSize(16, 16);

    // Animation de rotation
    if (!scene.anims.exists('piece-spin')) {
      scene.anims.create({
        key: 'piece-spin',
        frames: scene.anims.generateFrameNumbers('piece', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1,
      });
    }
    this.anims.play('piece-spin');
  }

  /** Appelé quand Mario collecte la pièce */
  collecter(): void {
    this.body!.enable = false;

    // Animation de collecte (monte puis disparaît)
    this.scene.tweens.add({
      targets: this,
      y: this.y - 30,
      alpha: 0,
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        this.destroy();
      },
    });
  }
}
