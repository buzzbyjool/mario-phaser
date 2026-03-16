import Phaser from 'phaser';

/**
 * Écran titre du jeu avec logo MARIO et instruction pour démarrer
 */
export class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Fond ciel bleu
    this.cameras.main.setBackgroundColor('#5C94FC');

    // Quelques nuages décoratifs
    this.add.image(120, 80, 'nuage').setScale(1.2).setAlpha(0.7);
    this.add.image(500, 60, 'nuage').setAlpha(0.6);
    this.add.image(650, 100, 'nuage').setScale(0.8).setAlpha(0.5);

    // Sol décoratif en bas
    for (let x = 0; x < width; x += 32) {
      this.add.image(x + 16, height - 16, 'sol');
    }

    // Titre SUPER MARIO
    const titre = this.add.text(width / 2, height / 3 - 30, 'SUPER', {
      fontSize: '48px',
      fontFamily: 'Arial Black, Arial',
      color: '#FFD700',
      stroke: '#000',
      strokeThickness: 6,
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 3 + 30, 'MARIO', {
      fontSize: '64px',
      fontFamily: 'Arial Black, Arial',
      color: '#E52521',
      stroke: '#000',
      strokeThickness: 8,
    }).setOrigin(0.5);

    // Mario sprite décoratif
    this.add.sprite(width / 2, height / 2 + 30, 'mario', 0).setScale(2);

    // Texte clignotant "PRESS SPACE TO START"
    const startText = this.add.text(width / 2, height * 0.75, 'PRESS SPACE TO START', {
      fontSize: '22px',
      fontFamily: 'Arial',
      color: '#FFF',
      stroke: '#000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    // Animation clignotement
    this.tweens.add({
      targets: startText,
      alpha: 0.2,
      duration: 600,
      yoyo: true,
      repeat: -1,
    });

    // Animation titre
    this.tweens.add({
      targets: titre,
      y: titre.y - 5,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Crédits
    this.add.text(width / 2, height - 50, 'Fait avec Phaser 3', {
      fontSize: '12px',
      fontFamily: 'Arial',
      color: '#FFF',
      stroke: '#000',
      strokeThickness: 2,
    }).setOrigin(0.5);

    // Démarrer au clic / tap / espace (support mobile iOS)
    const demarrer = () => { this.scene.start('GameScene'); };
    this.input.keyboard!.once('keydown-SPACE', demarrer);
    this.input.once('pointerdown', demarrer);
  }
}
