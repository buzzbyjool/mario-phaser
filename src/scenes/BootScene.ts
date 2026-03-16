import Phaser from 'phaser';

/**
 * BootScene — génère tous les assets via Phaser Graphics + generateTexture
 * Compatible iOS / Android / desktop (n'utilise pas createCanvas / addSpriteSheet)
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
    this.scene.start('TitleScene');
  }

  private g(): Phaser.GameObjects.Graphics {
    return this.make.graphics({ x: 0, y: 0 });
  }

  private genererMario(): void {
    const fw = 32, fh = 48;
    const frames = 4;
    // Génère 4 textures séparées : mario0, mario1, mario2, mario3
    for (let f = 0; f < frames; f++) {
      const gfx = this.g();

      // Casquette rouge
      gfx.fillStyle(0xE52521);
      gfx.fillRect(8, 2, 18, 6);
      gfx.fillRect(6, 6, 22, 4);
      // Visage chair
      gfx.fillStyle(0xFFB74D);
      gfx.fillRect(8, 10, 16, 12);
      // Yeux
      gfx.fillStyle(0x000000);
      gfx.fillRect(12, 13, 3, 3);
      gfx.fillRect(19, 13, 3, 3);
      // Moustache
      gfx.fillStyle(0x5D4037);
      gfx.fillRect(11, 18, 12, 2);
      // Corps rouge
      gfx.fillStyle(0xE52521);
      gfx.fillRect(8, 22, 16, 10);
      // Bras
      gfx.fillStyle(0xFFB74D);
      if (f === 1) {
        gfx.fillRect(3, 20, 5, 8);
        gfx.fillRect(24, 26, 5, 6);
      } else if (f === 2) {
        gfx.fillRect(3, 26, 5, 6);
        gfx.fillRect(24, 20, 5, 8);
      } else {
        gfx.fillRect(3, 24, 5, 8);
        gfx.fillRect(24, 24, 5, 8);
      }
      // Salopette bleue
      gfx.fillStyle(0x0D47A1);
      gfx.fillRect(8, 32, 16, 8);
      // Jambes
      if (f === 3) {
        gfx.fillRect(6, 40, 7, 6);
        gfx.fillRect(19, 40, 7, 6);
      } else if (f === 1) {
        gfx.fillRect(7, 40, 7, 6);
        gfx.fillRect(18, 40, 7, 6);
      } else if (f === 2) {
        gfx.fillRect(9, 40, 7, 6);
        gfx.fillRect(16, 40, 7, 6);
      } else {
        gfx.fillRect(8, 40, 7, 6);
        gfx.fillRect(17, 40, 7, 6);
      }
      // Chaussures marron
      gfx.fillStyle(0x5D4037);
      if (f === 3) {
        gfx.fillRect(4, 44, 9, 4);
        gfx.fillRect(19, 44, 9, 4);
      } else {
        gfx.fillRect(6, 44, 9, 4);
        gfx.fillRect(17, 44, 9, 4);
      }

      gfx.generateTexture(`mario${f}`, fw, fh);
      gfx.destroy();
    }

    // Créer un faux spritesheet en collant les 4 frames dans un atlas manuel
    // On va créer mario-sheet comme image composée puis l'enregistrer comme spritesheet
    const rt = this.add.renderTexture(0, 0, fw * frames, fh);
    rt.setVisible(false);
    for (let f = 0; f < frames; f++) {
      rt.draw(`mario${f}`, f * fw, 0);
    }
    rt.saveTexture('mario');
    rt.destroy();

    this.textures.remove('mario');
    // Recréer le spritesheet depuis les textures individuelles via atlas
    this.createMarioAtlas(fw, fh, frames);
  }

  private createMarioAtlas(fw: number, fh: number, frames: number): void {
    // On utilise les textures mario0..mario3 directement dans les animations
    // Pas besoin de spritesheet — on crée les anims avec les clés séparées
    if (!this.anims.exists('mario-idle')) {
      this.anims.create({ key: 'mario-idle', frames: [{ key: 'mario0' }], frameRate: 1 });
    }
    if (!this.anims.exists('mario-run')) {
      this.anims.create({
        key: 'mario-run',
        frames: [{ key: 'mario1' }, { key: 'mario2' }],
        frameRate: 8, repeat: -1,
      });
    }
    if (!this.anims.exists('mario-jump')) {
      this.anims.create({ key: 'mario-jump', frames: [{ key: 'mario3' }], frameRate: 1 });
    }
  }

  private genererEnnemi(): void {
    for (let f = 0; f < 2; f++) {
      const gfx = this.g();
      // Corps champignon brun
      gfx.fillStyle(0x8B4513);
      gfx.fillCircle(16, 12, 14);
      gfx.fillRect(2, 12, 28, 4);
      // Visage
      gfx.fillStyle(0xDEB887);
      gfx.fillRect(6, 16, 20, 10);
      // Yeux méchants
      gfx.fillStyle(0x000000);
      gfx.fillRect(9, 18, 4, 4);
      gfx.fillRect(19, 18, 4, 4);
      gfx.fillRect(8, 16, 5, 2);
      gfx.fillRect(19, 16, 5, 2);
      // Pieds
      gfx.fillStyle(0x000000);
      if (f === 0) {
        gfx.fillRect(4, 26, 10, 6);
        gfx.fillRect(18, 26, 10, 6);
      } else {
        gfx.fillRect(6, 26, 10, 6);
        gfx.fillRect(16, 26, 10, 6);
      }
      gfx.generateTexture(`ennemi${f}`, 32, 32);
      gfx.destroy();
    }
    if (!this.anims.exists('ennemi-walk')) {
      this.anims.create({
        key: 'ennemi-walk',
        frames: [{ key: 'ennemi0' }, { key: 'ennemi1' }],
        frameRate: 4, repeat: -1,
      });
    }
  }

  private genererPiece(): void {
    const gfx = this.g();
    gfx.fillStyle(0xFFD700);
    gfx.fillCircle(10, 10, 8);
    gfx.fillStyle(0xDAA520);
    gfx.fillCircle(10, 10, 5);
    gfx.fillStyle(0xFFD700);
    gfx.fillCircle(10, 10, 3);
    gfx.generateTexture('piece', 20, 20);
    gfx.destroy();
    if (!this.anims.exists('piece-spin')) {
      this.anims.create({ key: 'piece-spin', frames: [{ key: 'piece' }], frameRate: 8, repeat: -1 });
    }
  }

  private genererBloc(): void {
    const gfx = this.g();
    gfx.fillStyle(0x8B6914);
    gfx.fillRect(0, 0, 32, 32);
    gfx.fillStyle(0xA0782C);
    gfx.fillRect(1, 1, 14, 7);
    gfx.fillRect(17, 1, 14, 7);
    gfx.fillRect(1, 10, 7, 7);
    gfx.fillRect(10, 10, 14, 7);
    gfx.fillRect(26, 10, 5, 7);
    gfx.fillRect(1, 19, 14, 7);
    gfx.fillRect(17, 19, 14, 7);
    gfx.lineStyle(1, 0x6B4F0A);
    gfx.strokeRect(0, 0, 32, 32);
    gfx.generateTexture('bloc', 32, 32);
    gfx.destroy();
  }

  private genererSol(): void {
    const gfx = this.g();
    gfx.fillStyle(0x8B4513);
    gfx.fillRect(0, 0, 32, 32);
    gfx.fillStyle(0x2E8B2E);
    gfx.fillRect(0, 0, 32, 8);
    gfx.fillStyle(0x3DA83D);
    for (let i = 0; i < 32; i += 4) {
      gfx.fillRect(i, 0, 2, 4 + (i % 8 === 0 ? 2 : 0));
    }
    gfx.fillStyle(0x7A3B10);
    gfx.fillRect(4, 14, 3, 3);
    gfx.fillRect(15, 20, 4, 2);
    gfx.fillRect(24, 12, 3, 3);
    gfx.generateTexture('sol', 32, 32);
    gfx.destroy();
  }

  private genererNuage(): void {
    const gfx = this.g();
    gfx.fillStyle(0xFFFFFF, 0.85);
    gfx.fillCircle(25, 24, 16);
    gfx.fillCircle(40, 16, 18);
    gfx.fillCircle(55, 24, 14);
    gfx.generateTexture('nuage', 80, 44);
    gfx.destroy();
  }

  private genererDrapeau(): void {
    const gfx = this.g();
    gfx.fillStyle(0x888888);
    gfx.fillRect(14, 0, 4, 128);
    gfx.fillStyle(0xFFD700);
    gfx.fillCircle(16, 6, 6);
    gfx.fillStyle(0x00AA00);
    gfx.fillTriangle(14, 12, 14, 40, 0, 26);
    gfx.generateTexture('drapeau', 32, 128);
    gfx.destroy();
  }
}
