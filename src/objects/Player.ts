import Phaser from 'phaser';

/**
 * Classe du joueur (Mario)
 * Gère les mouvements, le double saut, les animations et les vies
 */
export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private sautsRestants = 2;
  private readonly vitesseDeplacement = 200;
  private readonly forceSaut = -420;
  public vies = 3;
  public invincible = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'mario', 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Configuration physique
    this.setCollideWorldBounds(false);
    this.setBounce(0);
    this.setSize(20, 40);
    this.setOffset(6, 8);

    // Contrôles
    this.cursors = scene.input.keyboard!.createCursorKeys();
    this.spaceKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Création des animations
    this.creerAnimations();
  }

  private creerAnimations(): void {
    // Animation idle
    if (!this.scene.anims.exists('mario-idle')) {
      this.scene.anims.create({
        key: 'mario-idle',
        frames: [{ key: 'mario', frame: 0 }],
        frameRate: 1,
      });
    }

    // Animation course
    if (!this.scene.anims.exists('mario-run')) {
      this.scene.anims.create({
        key: 'mario-run',
        frames: this.scene.anims.generateFrameNumbers('mario', { start: 1, end: 2 }),
        frameRate: 8,
        repeat: -1,
      });
    }

    // Animation saut
    if (!this.scene.anims.exists('mario-jump')) {
      this.scene.anims.create({
        key: 'mario-jump',
        frames: [{ key: 'mario', frame: 3 }],
        frameRate: 1,
      });
    }
  }

  update(): void {
    const auSol = this.body!.blocked.down;

    // Réinitialiser les sauts quand on touche le sol
    if (auSol) {
      this.sautsRestants = 2;
    }

    // Déplacement horizontal
    if (this.cursors.left.isDown) {
      this.setVelocityX(-this.vitesseDeplacement);
      this.setFlipX(true);
    } else if (this.cursors.right.isDown) {
      this.setVelocityX(this.vitesseDeplacement);
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }

    // Saut (espace ou flèche haut) avec double saut
    const sautPresse = Phaser.Input.Keyboard.JustDown(this.spaceKey) ||
                       Phaser.Input.Keyboard.JustDown(this.cursors.up);

    if (sautPresse && this.sautsRestants > 0) {
      this.setVelocityY(this.forceSaut);
      this.sautsRestants--;
    }

    // Animations
    if (!auSol) {
      this.anims.play('mario-jump', true);
    } else if (this.body!.velocity.x !== 0) {
      this.anims.play('mario-run', true);
    } else {
      this.anims.play('mario-idle', true);
    }
  }

  /** Appelé quand Mario touche un ennemi (pas par le dessus) */
  subirDegats(): void {
    if (this.invincible) return;

    this.vies--;
    this.invincible = true;

    // Effet de clignotement
    this.scene.tweens.add({
      targets: this,
      alpha: 0.3,
      duration: 100,
      yoyo: true,
      repeat: 10,
      onComplete: () => {
        this.invincible = false;
        this.setAlpha(1);
      },
    });

    // Petit recul
    this.setVelocityY(-200);
  }
}
