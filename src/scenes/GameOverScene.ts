import Phaser from 'phaser';

/**
 * Écran de fin de partie (Game Over ou Victoire)
 * Affiche le score et permet de rejouer
 */
export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create(data: { score: number; victoire: boolean }): void {
    const { width, height } = this.cameras.main;
    const victoire = data.victoire ?? false;
    const score = data.score ?? 0;

    // Fond
    this.cameras.main.setBackgroundColor(victoire ? '#2E7D32' : '#B71C1C');

    // Titre
    const titre = victoire ? 'VICTOIRE !' : 'GAME OVER';
    const couleur = victoire ? '#FFD700' : '#FF5252';

    this.add.text(width / 2, height / 3, titre, {
      fontSize: '56px',
      fontFamily: 'Arial Black, Arial',
      color: couleur,
      stroke: '#000',
      strokeThickness: 8,
    }).setOrigin(0.5);

    // Score
    this.add.text(width / 2, height / 2, `Pièces collectées : ${score}`, {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#FFF',
      stroke: '#000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    // Message
    if (victoire) {
      this.add.text(width / 2, height / 2 + 50, 'Bravo, tu as terminé le niveau !', {
        fontSize: '20px',
        fontFamily: 'Arial',
        color: '#FFF',
        stroke: '#000',
        strokeThickness: 3,
      }).setOrigin(0.5);
    }

    // Texte rejouer
    const rejouer = this.add.text(width / 2, height * 0.75, 'PRESS SPACE TO PLAY AGAIN', {
      fontSize: '22px',
      fontFamily: 'Arial',
      color: '#FFF',
      stroke: '#000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    // Clignotement
    this.tweens.add({
      targets: rejouer,
      alpha: 0.2,
      duration: 600,
      yoyo: true,
      repeat: -1,
    });

    // Écouter espace pour relancer
    this.input.keyboard!.once('keydown-SPACE', () => {
      this.scene.start('GameScene');
    });
  }
}
