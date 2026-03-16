import Phaser from 'phaser';

/**
 * BootScene — génère toutes les textures via add.graphics() + generateTexture()
 * Approche la plus fiable cross-platform (iOS, Android, desktop)
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // Rien à charger — tout est généré par code
  }

  create(): void {
    this.creerTextures();
    this.creerAnimations();
    this.scene.start('TitleScene');
  }

  private creerTextures(): void {
    // ── MARIO (4 frames : idle, run1, run2, jump) ──────────────────────────
    const marioFrames = [
      { key: 'mario0', legLeft: [8, 40, 7, 6], legRight: [17, 40, 7, 6], armLeft: [3, 24, 5, 8], armRight: [24, 24, 5, 8], shoe: [[6,44,9,4],[17,44,9,4]] },
      { key: 'mario1', legLeft: [7, 40, 7, 6], legRight: [18, 40, 7, 6], armLeft: [3, 20, 5, 8], armRight: [24, 26, 5, 6], shoe: [[5,44,9,4],[16,44,9,4]] },
      { key: 'mario2', legLeft: [9, 40, 7, 6], legRight: [16, 40, 7, 6], armLeft: [3, 26, 5, 6], armRight: [24, 20, 5, 8], shoe: [[7,44,9,4],[15,44,9,4]] },
      { key: 'mario3', legLeft: [6, 40, 7, 6], legRight: [19, 40, 7, 6], armLeft: [3, 22, 5, 7], armRight: [24, 22, 5, 7], shoe: [[4,44,9,4],[19,44,9,4]] },
    ];

    for (const f of marioFrames) {
      const g = this.add.graphics();
      // Casquette
      g.fillStyle(0xE52521); g.fillRect(8,2,18,6); g.fillRect(6,6,22,4);
      // Visage
      g.fillStyle(0xFFB74D); g.fillRect(8,10,16,12);
      // Yeux
      g.fillStyle(0x000000); g.fillRect(12,13,3,3); g.fillRect(19,13,3,3);
      // Moustache
      g.fillStyle(0x5D4037); g.fillRect(11,18,12,2);
      // Corps
      g.fillStyle(0xE52521); g.fillRect(8,22,16,10);
      // Bras
      g.fillStyle(0xFFB74D);
      g.fillRect(f.armLeft[0],f.armLeft[1],f.armLeft[2],f.armLeft[3]);
      g.fillRect(f.armRight[0],f.armRight[1],f.armRight[2],f.armRight[3]);
      // Salopette
      g.fillStyle(0x0D47A1); g.fillRect(8,32,16,8);
      // Jambes
      g.fillStyle(0x0D47A1);
      g.fillRect(f.legLeft[0],f.legLeft[1],f.legLeft[2],f.legLeft[3]);
      g.fillRect(f.legRight[0],f.legRight[1],f.legRight[2],f.legRight[3]);
      // Chaussures
      g.fillStyle(0x3E1F00);
      g.fillRect(f.shoe[0][0],f.shoe[0][1],f.shoe[0][2],f.shoe[0][3]);
      g.fillRect(f.shoe[1][0],f.shoe[1][1],f.shoe[1][2],f.shoe[1][3]);

      g.generateTexture(f.key, 32, 48);
      g.setVisible(false);
      g.destroy();
    }

    // ── ENNEMI (2 frames) ──────────────────────────────────────────────────
    for (let f = 0; f < 2; f++) {
      const g = this.add.graphics();
      g.fillStyle(0x8B4513);
      g.fillCircle(16, 12, 14);
      g.fillRect(2,12,28,6);
      g.fillStyle(0xDEB887); g.fillRect(6,16,20,10);
      g.fillStyle(0x000000);
      g.fillRect(9,18,4,4); g.fillRect(19,18,4,4);
      g.fillRect(8,15,6,2); g.fillRect(18,15,6,2);
      g.fillStyle(0x000000);
      if (f === 0) { g.fillRect(4,26,10,6); g.fillRect(18,26,10,6); }
      else         { g.fillRect(6,26,10,6); g.fillRect(16,26,10,6); }
      g.generateTexture(`ennemi${f}`, 32, 32);
      g.setVisible(false);
      g.destroy();
    }

    // ── PIÈCE ──────────────────────────────────────────────────────────────
    {
      const g = this.add.graphics();
      g.fillStyle(0xFFD700); g.fillCircle(10,10,9);
      g.fillStyle(0xDAA520); g.fillCircle(10,10,6);
      g.fillStyle(0xFFD700); g.fillCircle(10,10,3);
      g.generateTexture('piece', 20, 20);
      g.setVisible(false);
      g.destroy();
    }

    // ── BLOC ───────────────────────────────────────────────────────────────
    {
      const g = this.add.graphics();
      g.fillStyle(0x8B6914); g.fillRect(0,0,32,32);
      g.fillStyle(0xA0782C);
      g.fillRect(1,1,14,7); g.fillRect(17,1,14,7);
      g.fillRect(1,10,7,7); g.fillRect(10,10,14,7); g.fillRect(26,10,5,7);
      g.fillRect(1,19,14,7); g.fillRect(17,19,14,7);
      g.lineStyle(1,0x6B4F0A,1); g.strokeRect(0,0,32,32);
      g.generateTexture('bloc', 32, 32);
      g.setVisible(false);
      g.destroy();
    }

    // ── SOL ────────────────────────────────────────────────────────────────
    {
      const g = this.add.graphics();
      g.fillStyle(0x8B4513); g.fillRect(0,0,32,32);
      g.fillStyle(0x2E8B2E); g.fillRect(0,0,32,8);
      g.fillStyle(0x3DA83D);
      for (let i = 0; i < 32; i += 4) g.fillRect(i,0,2,4+(i%8===0?2:0));
      g.fillStyle(0x7A3B10);
      g.fillRect(4,14,3,3); g.fillRect(15,20,4,2); g.fillRect(24,12,3,3);
      g.generateTexture('sol', 32, 32);
      g.setVisible(false);
      g.destroy();
    }

    // ── NUAGE ──────────────────────────────────────────────────────────────
    {
      const g = this.add.graphics();
      g.fillStyle(0xFFFFFF, 0.9);
      g.fillCircle(22,26,15); g.fillCircle(38,18,18); g.fillCircle(54,26,13);
      g.generateTexture('nuage', 80, 44);
      g.setVisible(false);
      g.destroy();
    }

    // ── DRAPEAU ────────────────────────────────────────────────────────────
    {
      const g = this.add.graphics();
      g.fillStyle(0x888888); g.fillRect(14,0,4,128);
      g.fillStyle(0xFFD700); g.fillCircle(16,6,6);
      g.fillStyle(0x00AA00);
      g.fillTriangle(14,12, 14,40, 0,26);
      g.generateTexture('drapeau', 32, 128);
      g.setVisible(false);
      g.destroy();
    }
  }

  private creerAnimations(): void {
    const A = this.anims;
    if (!A.exists('mario-idle'))
      A.create({ key:'mario-idle', frames:[{key:'mario0'}], frameRate:1 });
    if (!A.exists('mario-run'))
      A.create({ key:'mario-run', frames:[{key:'mario1'},{key:'mario2'}], frameRate:8, repeat:-1 });
    if (!A.exists('mario-jump'))
      A.create({ key:'mario-jump', frames:[{key:'mario3'}], frameRate:1 });
    if (!A.exists('ennemi-walk'))
      A.create({ key:'ennemi-walk', frames:[{key:'ennemi0'},{key:'ennemi1'}], frameRate:4, repeat:-1 });
    if (!A.exists('piece-spin'))
      A.create({ key:'piece-spin', frames:[{key:'piece'}], frameRate:8, repeat:-1 });
  }
}
