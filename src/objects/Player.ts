import Phaser from 'phaser';

/**
 * Classe du joueur (Mario)
 * Gère les mouvements, le double saut, les animations et les vies
 * Support clavier + touch mobile
 */
export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private sautsRestants = 2;
  private readonly vitesseDeplacement = 200;
  private readonly forceSaut = -420;
  public vies = 3;
  public invincible = false;

  // Contrôles touch (mis à jour par GameScene)
  public touchGauche = false;
  public touchDroite = false;
  public touchSaut = false;
  private sautPrecedent = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'mario0');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(false);
    this.setBounce(0);
    this.setSize(20, 40);
    this.setOffset(6, 8);

    // Clavier (optionnel sur mobile)
    if (scene.input.keyboard) {
      this.cursors = scene.input.keyboard.createCursorKeys();
      this.spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    this.creerAnimations();
  }

  private creerAnimations(): void {
    // Les animations sont créées dans BootScene — on vérifie juste qu'elles existent
    if (!this.scene.anims.exists('mario-idle')) {
      this.scene.anims.create({ key: 'mario-idle', frames: [{ key: 'mario0' }], frameRate: 1 });
    }
    if (!this.scene.anims.exists('mario-run')) {
      this.scene.anims.create({
        key: 'mario-run',
        frames: [{ key: 'mario1' }, { key: 'mario2' }],
        frameRate: 8, repeat: -1,
      });
    }
    if (!this.scene.anims.exists('mario-jump')) {
      this.scene.anims.create({ key: 'mario-jump', frames: [{ key: 'mario3' }], frameRate: 1 });
    }
  }

  update(): void {
    const auSol = this.body!.blocked.down;

    if (auSol) {
      this.sautsRestants = 2;
    }

    // Déplacement horizontal — clavier + touch
    const gauche = (this.cursors?.left?.isDown ?? false) || this.touchGauche;
    const droite = (this.cursors?.right?.isDown ?? false) || this.touchDroite;

    if (gauche) {
      this.setVelocityX(-this.vitesseDeplacement);
      this.setFlipX(true);
    } else if (droite) {
      this.setVelocityX(this.vitesseDeplacement);
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }

    // Saut — clavier + touch (détection front montant pour éviter saut continu)
    const sautClavierJustDown = this.spaceKey
      ? Phaser.Input.Keyboard.JustDown(this.spaceKey)
      : false;
    const sautHautJustDown = this.cursors?.up
      ? Phaser.Input.Keyboard.JustDown(this.cursors.up)
      : false;
    const sautTouchJustDown = this.touchSaut && !this.sautPrecedent;
    this.sautPrecedent = this.touchSaut;

    const sautPresse = sautClavierJustDown || sautHautJustDown || sautTouchJustDown;

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

  subirDegats(): void {
    if (this.invincible) return;

    this.vies--;
    this.invincible = true;

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

    this.setVelocityY(-200);
  }
}
