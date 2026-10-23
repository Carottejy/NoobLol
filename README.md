# Noob LOL

Compagnon de jeu **League of Legends** pour débutants, en français. Application **Windows** (Electron) en trois parties :

| Partie | Ce qu'elle fait |
|---|---|
| 📚 **Préparation** | Accueil, **Mon compte** (rang, maîtrises, dernières parties, progression sur 20 parties avec objectif, champions à travailler), **Champions** (sorts, conseils pour jouer et contrer, statistiques Noob LOL : runes, sorts, objets, match-ups), **Méta** (tier list maison par rôle), **Objets** (filtres combinables), **Runes**, **Mes builds** (tes pages de runes et builds d'objets par champion et par rôle), **Guide** débutant, **Lexique**. |
| 🎯 **Sélection** | S'ouvre toute seule quand la sélection commence : équipes et bannissements en direct, ton rôle, ton adversaire de voie (deviné ou choisi), **champions conseillés** (statistiques + tes maîtrises + champions faciles), **runes, sorts et objets** du champion survolé, conseils pour contrer l'adversaire. *C'est toujours toi qui cliques dans le client.* |
| ⚔️ **En jeu** | S'ouvre toute seule au lancement de la partie, sans aucun bouton : mini-carte en direct, les 10 joueurs **face à face par voie** (rang, niveau, K/D/A, objets, AD/AP, or gagné, qui domine la voie), objectifs avec temps avant apparition et score, **Mon build** (prochain objet, or manquant), **encart déplaçable par-dessus le jeu** avec ton build perso, **annonces vocales**. À la fin de la partie : **toutes les statistiques en onglets** (Résumé, Équipe, Ma partie, Mes morts, Carte, Dégâts, Or et farm, Vision, Builds). |
| ⚙️ **Réglages** | Clé Riot (chiffrée par Windows), serveur, Riot ID, collecteur de statistiques, réglage de la mini-carte. |

## D'où viennent les données (uniquement des sources officielles ou publiques)
- **Data Dragon** (Riot) : champions, sorts, objets, runes, en français, toujours au dernier patch.
- **API officielle de Riot** (avec ta clé gratuite de [developer.riotgames.com](https://developer.riotgames.com)) : ton compte, tes maîtrises, tes parties, et le **collecteur** de statistiques.
- **Live Client Data** (API officielle du jeu, `127.0.0.1:2999`) : données de la partie en cours visibles par le joueur.
- **API locale du client LoL** (lecture seule) : phase de jeu, sélection des champions. Noob LOL ne clique jamais à ta place.
- **Mini-carte** : capture de la zone de l'écran déjà visible (aucune donnée cachée du jeu).

### Le collecteur de statistiques
Il récupère des parties classées solo/duo récentes de joueurs **Maître, Grand maître et Challenger** de ton serveur (`league-v4` → `match-v5`), puis enregistre pour chaque joueur : champion, rôle, victoire, adversaire de voie, runes, objets de fin de partie, sorts. Les statistiques (taux de victoire, runes les plus jouées, match-ups…) sont calculées dans une base **SQLite locale** (`%APPDATA%\Noob LOL\stats.sqlite`). Il récupère aussi la **chronologie** de chaque partie (`match-v5 timeline`) : ordre des achats, objets de départ, montée des sorts, composition adverse. C'est ce qui permet de conseiller les deux premiers objets contre un adversaire précis et les objets adaptés à l'équipe adverse. Avec une clé de développement (100 requêtes / 2 min, 2 requêtes par partie), compte environ 1 500 parties par heure tant que la clé est valide (elle expire au bout de 24 h).

## Installer
Voir [INSTALLER.md](INSTALLER.md).

## Développer
```bash
npm install
npm start        # lance l'appli
npm test         # tests des modules (base, collecteur, API, client LoL, données en jeu)
npm run dist     # fabrique l'installeur Windows dans dist/
```

| Dossier | Contenu |
|---|---|
| `main/` | Processus principal : `main.js` (fenêtres, IPC), `preload.js` (pont sécurisé), `lcu.js` (client LoL), `live.js` (données en jeu), `riotapi.js` (API Riot + limiteur), `collector.js`, `db.js` (SQLite), `config.js` |
| `renderer/` | Interface : `app.js` (3 parties + réglages), `ddragon.js`, `guide.js` (textes), `style.css`, `minimap.html/js`, `overlay.html/js` (encart par-dessus le jeu) |
| `test/` | Tests Node (`node --test`) |

Pour publier une mise à jour : augmenter `version` dans `package.json` (et les notes dans `renderer/version.js`), puis lancer le workflow « Installeur Windows » (onglet Actions → Run workflow) ou pousser un tag `vX.Y.Z`. GitHub Actions fabrique l'installeur et publie la Release ; les PC équipés se mettent à jour tout seuls.

---
Noob LOL n'est pas approuvé par Riot Games et ne reflète pas les opinions de Riot Games ou de quiconque officiellement impliqué dans la production ou la gestion des propriétés de Riot Games. Riot Games et toutes les propriétés associées sont des marques commerciales ou des marques déposées de Riot Games, Inc.
