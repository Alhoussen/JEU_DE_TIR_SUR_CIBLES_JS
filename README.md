# Mini-Projet JavaScript 2018 - Jeu de Tir sur Cibles

Ce fichier décrit l'état de réalisation du projet et les fonctionnalités implémentées pour le jeu de tir sur cibles.

## Fonctionnalités

### Fonctionnalités de Base
- **Question 1 : Étude du code HTML**
  - Structure comprise (terrain, boutons, chrono, etc.).

- **Question 2 : Gestion du bouton "Une cible"**
  - Création et positionnement aléatoire des cibles.
  - Gestion du clic et disparition.

- **Question 3 : Gestion du chronomètre**
  - Mesure du temps en minutes:secondes:dixièmes.

- **Question 4 : Déroulement du jeu**
  - Boucle de jeu complète : Démarrage, création de cibles, fin de partie.

### Fonctionnalités Optionnelles
- **Niveaux de difficulté** : 
  - **Facile** : Terrain 900x550px, grandes cibles.
  - **Moyen** : Terrain 800x500px, cibles moyennes.
  - **Difficile** : Terrain 700x450px, petites cibles.

- **Hall of Fame** :
  - Sauvegarde des scores dans le `localStorage`.
  - Affichage des 10 meilleurs temps.

### Améliorations Supplémentaires
- **Design** : Thème sombre, dégradés, glassmorphisme.
- **UX** : Animations, feedback visuel, médailles.
- **Code** : Documentation JSDoc, structure claire.

## Structure des Fichiers

```text
jsEvaluation/
├── index.html                    # Fichier HTML principal
├── style/
│   └── style-project2018.css    # Feuille de style
├── scripts/
│   └── project2018.js           # Logique du jeu
└── lisezmoi.txt                 # Fichier de suivi original
```

## Instructions d'Utilisation

1. Ouvrir `index.html` dans un navigateur moderne.
2. **Mode Test** : Pour tester une cible unique, utiliser le bouton "Une cible".
3. **Mode Jeu** :
   - Sélectionner la difficulté (Facile, Moyen, Difficile).
   - Choisir le nombre de cibles (1-50).
   - Cliquer sur "Démarrer".
   - Détruire toutes les cibles le plus vite possible.
   - Entrer votre nom pour enregistrer votre score si vous atteignez le top 10.

## Technologies Utilisées

- HTML5
- CSS3 (Animations, Flexbox, Variables)
- JavaScript ES6+
- Google Fonts (Inter)
