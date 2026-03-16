import Phaser from 'phaser';

/**
 * Scène de démarrage : génère tous les assets graphiques par code
 * (pas de fichiers externes nécessaires)
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create(): void {
    this.genererMario();
    this.genererEnnemi();
    this.genererPiece();
    this.genererBloc();
    this.genererSol();
    this.genererNuage();
    this.genererDrapeau();

    // Passer à l'écran titre
    this.scene.start('TitleScene');
  }

  /** Génère le spritesheet de Mario (3 frames : idle, run1, run2) */
  private genererMario(): void {
    const frameW = 32;
    const frameH = 48;
    const totalW = frameW * 4; // 4 frames : idle, run1, run2, jump
    const canvas = this.textures.createCanvas('mario', totalW, frameH);
    if (!canvas) return;
    const ctx = canvas.context;

    // Couleurs Mario
    const rouge = '#E52521';
    const bleu = '#0D47A1';
    const chair = '#FFB74D';
    const brun = '#5D4037';

    for (let f = 0; f < 4; f++) {
      const ox = f * frameW;

      // Casquette rouge
      ctx.fillStyle = rouge;
      ctx.fillRect(ox + 8, 2, 18, 6);
      ctx.fillRect(ox + 6, 6, 22, 4);

      // Visage
      ctx.fillStyle = chair;
      ctx.fillRect(ox + 8, 10, 16, 12);

      // Yeux
      ctx.fillStyle = '#000';
      ctx.fillRect(ox + 12, 13, 3, 3);
      ctx.fillRect(ox + 19, 13, 3, 3);

      // Moustache
      ctx.fillStyle = brun;
      ctx.fillRect(ox + 11, 18, 12, 2);

      // Corps (t-shirt rouge)
      ctx.fillStyle = rouge;
      ctx.fillRect(ox + 8, 22, 16, 10);

      // Bras
      ctx.fillStyle = chair;
      if (f === 1) {
        // Bras levé gauche
        ctx.fillRect(ox + 3, 20, 5, 8);
        ctx.fillRect(ox + 24, 26, 5, 6);
      } else if (f === 2) {
        // Bras levé droit
        ctx.fillRect(ox + 3, 26, 5, 6);
        ctx.fillRect(ox + 24, 20, 5, 8);
      } else {
        ctx.fillRect(ox + 3, 24, 5, 8);
        ctx.fillRect(ox + 24, 24, 5, 8);
      }

      // Salopette bleue
      ctx.fillStyle = bleu;
      ctx.fillRect(ox + 8, 32, 16, 8);

      // Jambes
      if (f === 3) {
        // Saut : jambes écartées
        ctx.fillRect(ox + 6, 40, 7, 6);
        ctx.fillRect(ox + 19, 40, 7, 6);
      } else if (f === 1) {
        ctx.fillRect(ox + 7, 40, 7, 6);
        ctx.fillRect(ox + 18, 40, 7, 6);
      } else if (f === 2) {
        ctx.fillRect(ox + 9, 40, 7, 6);
        ctx.fillRect(ox + 16, 40, 7, 6);
      } else {
        ctx.fillRect(ox + 8, 40, 7, 6);
        ctx.fillRect(ox + 17, 40, 7, 6);
      }

      // Chaussures marron
      ctx.fillStyle = brun;
      if (f === 3) {
        ctx.fillRect(ox + 4, 44, 9, 4);
        ctx.fillRect(ox + 19, 44, 9, 4);
      } else {
        ctx.fillRect(ox + 6, 44, 9, 4);
        ctx.fillRect(ox + 17, 44, 9, 4);
      }
    }

    canvas.refresh();

    // Créer le spritesheet à partir du canvas
    this.textures.remove('mario');
    const tex = canvas.canvas;
    this.textures.addSpriteSheet('mario', tex as unknown as HTMLImageElement, {
      frameWidth: frameW,
      frameHeight: frameH,
    });
  }

  /** Génère le sprite ennemi (champignon style Goomba) */
  private genererEnnemi(): void {
    const w = 32;
    const h = 32;
    const canvas = this.textures.createCanvas('ennemi', w * 2, h);
    if (!canvas) return;
    const ctx = canvas.context;

    for (let f = 0; f < 2; f++) {
      const ox = f * w;

      // Corps brun foncé (champignon)
      ctx.fillStyle = '#8B4513';
      ctx.beginPath();
      ctx.arc(ox + 16, 12, 14, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(ox + 2, 12, 28, 4);

      // Visage
      ctx.fillStyle = '#DEB887';
      ctx.fillRect(ox + 6, 16, 20, 10);

      // Yeux (méchants)
      ctx.fillStyle = '#000';
      ctx.fillRect(ox + 9, 18, 4, 4);
      ctx.fillRect(ox + 19, 18, 4, 4);
      // Sourcils froncés
      ctx.fillRect(ox + 8, 16, 5, 2);
      ctx.fillRect(ox + 19, 16, 5, 2);

      // Pieds
      ctx.fillStyle = '#000';
      if (f === 0) {
        ctx.fillRect(ox + 4, 26, 10, 6);
        ctx.fillRect(ox + 18, 26, 10, 6);
      } else {
        ctx.fillRect(ox + 6, 26, 10, 6);
        ctx.fillRect(ox + 16, 26, 10, 6);
      }
    }

    canvas.refresh();
    this.textures.remove('ennemi');
    this.textures.addSpriteSheet('ennemi', canvas.canvas as unknown as HTMLImageElement, {
      frameWidth: w,
      frameHeight: h,
    });
  }

  /** Génère le sprite d'une pièce (animation rotation) */
  private genererPiece(): void {
    const w = 20;
    const h = 20;
    const frames = 4;
    const canvas = this.textures.createCanvas('piece', w * frames, h);
    if (!canvas) return;
    const ctx = canvas.context;

    const largeurs = [16, 12, 6, 12];
    for (let f = 0; f < frames; f++) {
      const ox = f * w + w / 2;
      const larg = largeurs[f];

      // Pièce dorée
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.ellipse(ox, h / 2, larg / 2, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Bordure
      ctx.strokeStyle = '#DAA520';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(ox, h / 2, larg / 2, 8, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Symbole $
      if (larg > 8) {
        ctx.fillStyle = '#DAA520';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', ox, h / 2 + 1);
      }
    }

    canvas.refresh();
    this.textures.remove('piece');
    this.textures.addSpriteSheet('piece', canvas.canvas as unknown as HTMLImageElement, {
      frameWidth: w,
      frameHeight: h,
    });
  }

  /** Génère la texture d'un bloc de plateforme (style brique) */
  private genererBloc(): void {
    const size = 32;
    const canvas = this.textures.createCanvas('bloc', size, size);
    if (!canvas) return;
    const ctx = canvas.context;

    // Fond brique
    ctx.fillStyle = '#8B6914';
    ctx.fillRect(0, 0, size, size);

    // Motif briques
    ctx.fillStyle = '#A0782C';
    ctx.fillRect(1, 1, 14, 7);
    ctx.fillRect(17, 1, 14, 7);
    ctx.fillRect(1, 10, 7, 7);
    ctx.fillRect(10, 10, 14, 7);
    ctx.fillRect(26, 10, 5, 7);
    ctx.fillRect(1, 19, 14, 7);
    ctx.fillRect(17, 19, 14, 7);
    ctx.fillRect(1, 28, 7, 3);
    ctx.fillRect(10, 28, 14, 3);
    ctx.fillRect(26, 28, 5, 3);

    // Lignes de jointure
    ctx.strokeStyle = '#6B4F0A';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, size, size);

    canvas.refresh();
  }

  /** Génère la texture du sol (herbe + terre) */
  private genererSol(): void {
    const size = 32;
    const canvas = this.textures.createCanvas('sol', size, size);
    if (!canvas) return;
    const ctx = canvas.context;

    // Terre
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 0, size, size);

    // Couche d'herbe verte en haut
    ctx.fillStyle = '#2E8B2E';
    ctx.fillRect(0, 0, size, 8);

    // Détails herbe
    ctx.fillStyle = '#3DA83D';
    for (let i = 0; i < size; i += 4) {
      ctx.fillRect(i, 0, 2, 4 + (i % 8 === 0 ? 2 : 0));
    }

    // Texture terre
    ctx.fillStyle = '#7A3B10';
    ctx.fillRect(4, 14, 3, 3);
    ctx.fillRect(15, 20, 4, 2);
    ctx.fillRect(24, 12, 3, 3);
    ctx.fillRect(8, 26, 2, 3);
    ctx.fillRect(20, 28, 3, 2);

    canvas.refresh();
  }

  /** Génère un nuage */
  private genererNuage(): void {
    const w = 80;
    const h = 40;
    const canvas = this.textures.createCanvas('nuage', w, h);
    if (!canvas) return;
    const ctx = canvas.context;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    // Trois cercles pour former un nuage
    ctx.beginPath();
    ctx.arc(25, 24, 16, 0, Math.PI * 2);
    ctx.arc(40, 16, 18, 0, Math.PI * 2);
    ctx.arc(55, 24, 14, 0, Math.PI * 2);
    ctx.fill();

    canvas.refresh();
  }

  /** Génère un drapeau de fin de niveau */
  private genererDrapeau(): void {
    const w = 32;
    const h = 128;
    const canvas = this.textures.createCanvas('drapeau', w, h);
    if (!canvas) return;
    const ctx = canvas.context;

    // Mât
    ctx.fillStyle = '#666';
    ctx.fillRect(14, 0, 4, h);

    // Boule dorée en haut
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(16, 6, 6, 0, Math.PI * 2);
    ctx.fill();

    // Drapeau triangulaire vert
    ctx.fillStyle = '#00AA00';
    ctx.beginPath();
    ctx.moveTo(14, 12);
    ctx.lineTo(14, 40);
    ctx.lineTo(0, 26);
    ctx.closePath();
    ctx.fill();

    canvas.refresh();
  }
}
