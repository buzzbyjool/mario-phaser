# Super Mario - Phaser 3

## Installation

```bash
npm install
```

## Lancer le jeu en local

```bash
npm run dev
```

Ouvrir le navigateur sur l'URL affichée (par défaut http://localhost:5173).

## Compiler pour production

```bash
npm run build
```

Les fichiers compilés sont dans le dossier `dist/`.

## Contrôles

| Touche | Action |
|--------|--------|
| Flèche gauche | Aller à gauche |
| Flèche droite | Aller à droite |
| Flèche haut / Espace | Sauter |
| Double appui Espace/Haut | Double saut |

## Règles du jeu

- Collecte des pièces pour augmenter ton score
- Saute sur les ennemis pour les éliminer (+5 points)
- Contact latéral avec un ennemi = perte d'une vie
- Tu commences avec 3 vies
- Atteins le drapeau à droite pour gagner
- Attention aux trous dans le sol !

## Déploiement Netlify

Le fichier `netlify.toml` est configuré. Il suffit de connecter le dépôt à Netlify — la commande de build est `npm run build` et le dossier de publication est `dist/`.
