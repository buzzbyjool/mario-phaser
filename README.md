# Mario Phaser

Un jeu Mario-like jouable dans le navigateur, développé avec Phaser 3 et TypeScript.

Projet Easylab AI — construit pour Artur.

---

## Jouer en ligne

> Lien Netlify à venir après le premier déploiement.

---

## Jouer en local

### Prérequis

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/buzzbyjool/mario-phaser.git
cd mario-phaser
npm install
npm run dev
```

Ouvre [http://localhost:5173](http://localhost:5173) dans ton navigateur.

---

## Contrôles

| Touche | Action |
|--------|--------|
| Flèche gauche / droite | Se déplacer |
| Barre espace ou Flèche haut | Sauter |
| Espace (x2) | Double saut |

---

## Objectif

Collecte toutes les pièces et atteins la fin du niveau sans perdre tes 3 vies.

- Saute sur les ennemis pour les éliminer
- Toucher un ennemi de côté = perte d'une vie
- 0 vies = Game Over

---

## Stack technique

| Outil | Rôle |
|-------|------|
| [Phaser 3](https://phaser.io/) | Moteur de jeu |
| TypeScript | Langage principal |
| [Vite](https://vitejs.dev/) | Build & dev server |
| [Netlify](https://netlify.com/) | Déploiement |

---

## Structure du projet

```
mario-phaser/
├── src/
│   ├── main.ts              # Point d'entrée, config Phaser
│   ├── scenes/
│   │   ├── BootScene.ts     # Chargement des assets
│   │   ├── TitleScene.ts    # Écran titre
│   │   ├── GameScene.ts     # Scène de jeu principale
│   │   └── GameOverScene.ts # Écran Game Over / Victoire
│   └── objects/
│       ├── Player.ts        # Personnage jouable
│       ├── Enemy.ts         # Ennemis
│       └── Coin.ts          # Pièces collectibles
├── public/
│   └── assets/              # Sprites, sons
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── netlify.toml
```

---

## Build & déploiement

```bash
npm run build   # Génère le dossier dist/
```

Le projet est configuré pour un déploiement automatique sur Netlify via `netlify.toml`.

---

## Développé par

**Easylab AI** — [easylab.ai](https://easylab.ai)

Moteur : Phaser 3 | Build : Vite | Langage : TypeScript
