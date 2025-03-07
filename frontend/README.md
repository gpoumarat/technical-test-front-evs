# Documentation Frontend

## Description du Projet

Ce projet est une application Angular (version 16.2.0) qui implémente une interface utilisateur pour la gestion d'examens.

## Technologies Utilisées

- Angular 16.2.0
- TailwindCSS 3.4.17
- Cypress 12.17.4 pour les tests E2E
- Karma/Jasmine pour les tests unitaires
- Docker pour le déploiement

## Prérequis

- Node.js (version 16 ou supérieure)
- npm (inclus avec Node.js)
- Docker (optionnel, pour le déploiement conteneurisé)

## Installation

### Installation locale

1. Cloner le projet
2. Se placer dans le dossier frontend :

```bash
cd frontend
```

3. Installer les dépendances :

```bash
npm install
```

### Installation avec Docker

Pour construire l'image Docker :

```bash
docker build -t exam-frontend .
```

## Lancement de l'Application

### En mode développement

```bash
npm start
```

L'application sera accessible sur `http://localhost:4200`

### Avec Docker Compose (Application complète avec Backend)

Pour lancer l'application complète avec le backend, placez-vous à la racine du projet global et exécutez :

```bash
docker-compose up
```

Cela va :

- Construire et lancer le frontend (accessible sur `http://localhost:4200`)
- Construire et lancer le backend (accessible sur `http://localhost:3000`)
- Configurer la communication entre les services

Pour arrêter l'application :

```bash
docker-compose down
```

## Tests

### Tests Unitaires

- Lancer les tests une fois :

```bash
npm test
```

- Lancer les tests en mode watch :

```bash
npm run test:watch
```

- Générer un rapport de couverture :

```bash
npm run test:coverage
```

### Tests d'Intégration

```bash
npm run test:integration
```

### Tests End-to-End (E2E)

- Lancer les tests E2E en mode headless :

```bash
npm run e2e
```

- Ouvrir Cypress pour les tests interactifs :

```bash
npm run e2e:open
```

### Lancer tous les tests

```bash
npm run test:all
```

## Structure du Projet

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/         # Composants de l'application
│   │   ├── services/          # Services
│   │   ├── models/           # Modèles de données
│   │   └── integration/      # Tests d'intégration
│   ├── environments/         # Configuration des environnements
│   └── assets/              # Ressources statiques
├── cypress/                 # Tests E2E
└── ...
```

## Points d'Amélioration Possibles

1. **Architecture et Structure**
   - Implémenter une architecture par modules (feature modules)
   - Ajouter un state management (NgRx/NGXS) pour une meilleure gestion d'état
   - Créer un module partagé pour les composants réutilisables

2. **Tests**
   - Augmenter la couverture des tests unitaires
   - Ajouter plus de tests d'intégration
   - Améliorer la documentation des tests

3. **Performance**
   - Implémenter le lazy loading pour les modules
   - Optimiser le chargement des assets
   - Ajouter du SSR (Server-Side Rendering) avec Angular Universal

4. **UX/UI**
   - Utiliser la bonne librairie d'icones
   - Utiliser la bonne font de la maquette
   - Améliorer l'accessibilité (WCAG)
   - Ajouter des animations pour une meilleure expérience utilisateur
   - Implémenter un système de thèmes

5. **DevOps**
   - Mettre en place un pipeline CI/CD plus complet
   - Ajouter des environnements de staging
   - Améliorer la configuration Docker pour le développement

6. **Sécurité**
   - Ajouter des tests de sécurité
   - Implémenter une authentification
   - Mettre en place un système de gestion des permissions

7. **Maintenance**
   - Mettre en place des outils d'analyse de code (SonarQube)
   - Implémenter un meilleur système de logging

8. **Internationalisation**
   - Ajouter le support multi-langues avec @ngx-translate

## Scripts NPM Disponibles

- `npm start` : Lance l'application en mode développement
- `npm run build` : Compile l'application pour la production
- `npm test` : Lance les tests unitaires
- `npm run e2e` : Lance les tests end-to-end
- `npm run test:integration` : Lance les tests d'intégration
- `npm run test:all` : Lance tous les tests
