# Noob LOL

Compagnon de jeu **League of Legends** pour débutants, en français. Application web installable (PWA) : elle s'ajoute à l'écran d'accueil du téléphone et fonctionne hors connexion.

## Fonctionnalités
- **Champions** : recherche, filtres (classe, mêlée/distance, difficulté, favoris), fiche complète avec passif et sorts (recharge, coût, portée), conseils pour le jouer et pour le contrer, stats, skins, histoire, notes perso.
- **Objets** : boutique de la Faille avec recherche, filtres (départ, bottes, AD, AP, critique…), recette et améliorations.
- **Runes** et **sorts d'invocateur** avec leurs descriptions et temps de recharge.
- **En partie** : horloge de jeu, timers (dragon, Nashor, buffs), suivi des sorts d'invocateur adverses avec accélération, bouton « Copier pour le chat » (ex. `Ahri Saut éclair 12:34`), alarme sonore/vibration, écran maintenu allumé.
- **Guide débutant** (bases, 5 rôles avec champions conseillés, farm, vision, objectifs, nouveautés 2026, erreurs fréquentes, mental, raccourcis) et **lexique** du jargon.

## Données
Les champions, objets, runes et sorts viennent de **Data Dragon**, les données publiques officielles de Riot Games, en français (`fr_FR`). L'appli charge toujours le dernier patch et garde les fichiers en cache pour le hors connexion.

## Fichiers
| Fichier | Rôle |
|---|---|
| `index.html` | Page de l'appli |
| `app.js` | Écrans et logique |
| `ddragon.js` | Chargement des données Riot |
| `guide.js` | Textes du guide, lexique, conseils, timers |
| `style.css` | Apparence |
| `sw.js` | Service worker (hors connexion, mises à jour) |
| `version.js` | Numéro de version + notes (à augmenter à chaque publication) |
| `manifest.webmanifest`, `icons/` | Installation sur l'écran d'accueil |

Voir [HEBERGER.md](HEBERGER.md) pour la mise en ligne.

---
Noob LOL n'est pas approuvé par Riot Games et ne reflète pas les opinions de Riot Games ou de quiconque officiellement impliqué dans la production ou la gestion des propriétés de Riot Games. Riot Games et toutes les propriétés associées sont des marques commerciales ou des marques déposées de Riot Games, Inc.
