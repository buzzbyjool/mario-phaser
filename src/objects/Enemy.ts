import Phaser from 'phaser';

/**
 * Ennemi de type Goomba : patrouille de gauche à droite,
 * fait demi-tour aux bords ou obstacles
 */
export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private readonly vitesse = 60;
  private direction = -1; // -1 = gauche, 1 = droite

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'ennemi0');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setBounce(0);
    this.setCollideWorldBounds(false);
    this.setSize(28, 28);
    this.setOffset(2, 4);
    this.setVelocityX(this.vitesse * this.direction);

    if (!scene.anims.exists('ennemi-walk')) {
      scene.anims.create({
        key: 'ennemi-walk',
        frames: [{ key: 'ennemi0' }, { key: 'ennemi1' }],
        frameRate: 4, repeat: -1,
      });
    }
    this.anims.play('ennemi-walk');
  }

  update(): void {
    // Demi-tour si bloqué par un mur
    if (this.body!.blocked.left) {
      this.direction = 1;
      this.setVelocityX(this.vitesse);
      this.setFlipX(true);
    } else if (this.body!.blocked.right) {
      this.direction = -1;
      this.setVelocityX(-this.vitesse);
      this.setFlipX(false);
    }
  }

  /** Appelé quand Mario saute sur l'ennemi */
  ecraser(): void {
    this.setVelocity(0, 0);
    this.body!.enable = false;

    // Animation d'écrasement
    this.scene.tweens.add({
      targets: this,
      scaleY: 0.2,
      alpha: 0,
      duration: 300,
      onComplete: () => {
        this.destroy();
      },
    });
  }
}
