import Phaser from 'phaser';
import { Player } from '../objects/Player';
import { Enemy } from '../objects/Enemy';
import { Coin } from '../objects/Coin';

/** Dimensions du monde */
const MONDE_LARGEUR = 4000;
const MONDE_HAUTEUR = 600;
const SOL_Y = MONDE_HAUTEUR - 32;

/**
 * Scène principale du jeu : un niveau complet avec plateformes,
 * ennemis, pièces, scrolling horizontal et UI
 */
export class GameScene extends Phaser.Scene {
  private player!: Player;
  private ennemis!: Phaser.Physics.Arcade.Group;
  private pieces!: Phaser.Physics.Arcade.Group;
  private plateformes!: Phaser.Physics.Arcade.StaticGroup;
  private score = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private viesText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    this.score = 0;

    // Fond ciel bleu
    this.cameras.main.setBackgroundColor('#5C94FC');

    // Limites du monde
    this.physics.world.setBounds(0, 0, MONDE_LARGEUR, MONDE_HAUTEUR);

    // Nuages de fond (parallaxe simple)
    this.creerNuages();

    // Plateformes et sol
    this.plateformes = this.physics.add.staticGroup();
    this.creerSol();
    this.creerPlateformes();

    // Drapeau de fin
    const drapeau = this.physics.add.staticImage(MONDE_LARGEUR - 100, SOL_Y - 96, 'drapeau');
    drapeau.setOrigin(0.5, 0.5);
    drapeau.refreshBody();

    // Joueur
    this.player = new Player(this, 100, SOL_Y - 60);

    // Ennemis
    this.ennemis = this.physics.add.group({ runChildUpdate: true });
    this.creerEnnemis();

    // Pièces
    this.pieces = this.physics.add.group();
    this.creerPieces();

    // Collisions
    this.physics.add.collider(this.player, this.plateformes);
    this.physics.add.collider(this.ennemis, this.plateformes);

    // Collision joueur <-> ennemi
    this.physics.add.overlap(
      this.player,
      this.ennemis,
      this.gererContactEnnemi as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this,
    );

    // Collecte de pièces
    this.physics.add.overlap(
      this.player,
      this.pieces,
      this.collecterPiece as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this,
    );

    // Collision joueur <-> drapeau (victoire)
    this.physics.add.overlap(
      this.player,
      drapeau,
      () => this.victoire(),
      undefined,
      this,
    );

    // Caméra qui suit le joueur
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setBounds(0, 0, MONDE_LARGEUR, MONDE_HAUTEUR);

    // Interface utilisateur (fixée à la caméra)
    this.creerUI();
  }

  update(): void {
    this.player.update();

    // Mise à jour UI
    this.scoreText.setText(`Pièces: ${this.score}`);
    this.viesText.setText(`Vies: ${this.player.vies}`);

    // Mort par chute dans le vide
    if (this.player.y > MONDE_HAUTEUR + 50) {
      this.player.vies = 0;
      this.gameOver();
    }

    // Vérifier game over
    if (this.player.vies <= 0) {
      this.gameOver();
    }
  }

  /** Crée les nuages en arrière-plan */
  private creerNuages(): void {
    const positions = [
      { x: 150, y: 80 }, { x: 400, y: 50 }, { x: 700, y: 90 },
      { x: 1000, y: 60 }, { x: 1350, y: 85 }, { x: 1700, y: 45 },
      { x: 2100, y: 75 }, { x: 2500, y: 55 }, { x: 2900, y: 90 },
      { x: 3300, y: 65 }, { x: 3700, y: 80 },
    ];

    for (const pos of positions) {
      this.add.image(pos.x, pos.y, 'nuage')
        .setAlpha(0.5 + Math.random() * 0.3)
        .setScale(0.6 + Math.random() * 0.8)
        .setScrollFactor(0.3); // Effet parallaxe
    }
  }

  /** Crée le sol continu sur toute la largeur */
  private creerSol(): void {
    for (let x = 0; x < MONDE_LARGEUR; x += 32) {
      // Trou dans le sol à certains endroits pour le challenge
      if ((x >= 1200 && x <= 1280) || (x >= 2600 && x <= 2700)) continue;

      this.plateformes.create(x + 16, SOL_Y, 'sol');
      // Deuxième couche sous le sol
      this.plateformes.create(x + 16, SOL_Y + 32, 'sol');
    }
  }

  /** Crée les plateformes du niveau */
  private creerPlateformes(): void {
    // Définition des plateformes : [x, y, nombre de blocs]
    const defs: [number, number, number][] = [
      // Premières plateformes (zone tutoriel)
      [300, SOL_Y - 100, 3],
      [500, SOL_Y - 180, 4],
      // Zone intermédiaire
      [800, SOL_Y - 120, 3],
      [1000, SOL_Y - 200, 5],
      [1150, SOL_Y - 80, 2],
      // Après le premier trou
      [1350, SOL_Y - 140, 4],
      [1600, SOL_Y - 220, 3],
      // Zone avancée
      [1900, SOL_Y - 100, 3],
      [2100, SOL_Y - 180, 4],
      [2350, SOL_Y - 260, 3],
      // Après le deuxième trou
      [2800, SOL_Y - 120, 3],
      [3050, SOL_Y - 200, 4],
      // Zone finale
      [3350, SOL_Y - 140, 5],
      [3600, SOL_Y - 80, 3],
    ];

    for (const [startX, y, count] of defs) {
      for (let i = 0; i < count; i++) {
        this.plateformes.create(startX + i * 32, y, 'bloc');
      }
    }
  }

  /** Place les ennemis sur le terrain */
  private creerEnnemis(): void {
    const positions = [
      { x: 600, y: SOL_Y - 32 },
      { x: 1050, y: SOL_Y - 232 },
      { x: 1800, y: SOL_Y - 32 },
      { x: 3100, y: SOL_Y - 232 },
    ];

    for (const pos of positions) {
      const ennemi = new Enemy(this, pos.x, pos.y);
      this.ennemis.add(ennemi);
    }
  }

  /** Place les pièces dans le niveau */
  private creerPieces(): void {
    // Pièces au-dessus des plateformes et en l'air
    const positions = [
      // Zone tutoriel
      { x: 300, y: SOL_Y - 140 },
      { x: 332, y: SOL_Y - 140 },
      { x: 364, y: SOL_Y - 140 },
      { x: 520, y: SOL_Y - 220 },
      { x: 552, y: SOL_Y - 220 },
      // Zone intermédiaire
      { x: 830, y: SOL_Y - 160 },
      { x: 862, y: SOL_Y - 160 },
      { x: 1020, y: SOL_Y - 240 },
      { x: 1052, y: SOL_Y - 240 },
      { x: 1084, y: SOL_Y - 240 },
      // Après premier trou
      { x: 1380, y: SOL_Y - 180 },
      { x: 1412, y: SOL_Y - 180 },
      { x: 1620, y: SOL_Y - 260 },
      { x: 1652, y: SOL_Y - 260 },
      // Zone avancée
      { x: 1930, y: SOL_Y - 140 },
      { x: 2130, y: SOL_Y - 220 },
      { x: 2162, y: SOL_Y - 220 },
      { x: 2370, y: SOL_Y - 300 },
      // Zone finale
      { x: 3380, y: SOL_Y - 180 },
      { x: 3412, y: SOL_Y - 180 },
    ];

    for (const pos of positions) {
      const piece = new Coin(this, pos.x, pos.y);
      this.pieces.add(piece);
    }
  }

  /** Gère la collision entre Mario et un ennemi */
  private gererContactEnnemi(
    joueur: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    ennemi: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ): void {
    const p = joueur as Player;
    const e = ennemi as Enemy;

    if (!e.body?.enable) return;

    // Si Mario tombe sur l'ennemi (vélocité Y positive = descend)
    if (p.body!.velocity.y > 0 && p.body!.bottom <= e.body!.top + 15) {
      e.ecraser();
      // Petit rebond
      p.setVelocityY(-250);
      this.score += 5;
    } else {
      p.subirDegats();
    }
  }

  /** Gère la collecte d'une pièce */
  private collecterPiece(
    _joueur: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    piece: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ): void {
    const c = piece as Coin;
    if (!c.body?.enable) return;
    c.collecter();
    this.score++;
  }

  /** Interface utilisateur */
  private creerUI(): void {
    const style: Phaser.Types.GameObjects.Text.TextStyle = {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#FFF',
      stroke: '#000',
      strokeThickness: 4,
    };

    this.scoreText = this.add.text(16, 16, `Pièces: ${this.score}`, style)
      .setScrollFactor(0)
      .setDepth(100);

    this.viesText = this.add.text(16, 44, `Vies: 3`, style)
      .setScrollFactor(0)
      .setDepth(100);
  }

  /** Déclenché quand Mario atteint le drapeau */
  private victoire(): void {
    this.physics.pause();
    this.scene.start('GameOverScene', { score: this.score, victoire: true });
  }

  /** Déclenché quand les vies tombent à 0 */
  private gameOver(): void {
    this.physics.pause();
    this.scene.start('GameOverScene', { score: this.score, victoire: false });
  }
}
