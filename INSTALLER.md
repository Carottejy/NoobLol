# Installer Noob LOL sur ton PC

## 1. Récupérer l'installeur
**Le plus simple** : sur la page du dépôt GitHub, colonne de droite → **Releases** → dernière version → télécharge `Noob-LOL-Setup-x.y.z.exe`.

> Pas encore de Release ? Onglet **Actions** → « Installeur Windows » → **Run workflow**. Après ~5 minutes, ouvre l'exécution terminée et télécharge l'artefact **Noob-LOL-installeur** (un .zip qui contient le .exe).

Windows peut afficher « Windows a protégé votre ordinateur » (l'appli n'est pas signée par un certificat payant) : **Informations complémentaires → Exécuter quand même**.

## 2. Premier lancement
1. **Réglages → Clé API Riot** : connecte-toi sur [developer.riotgames.com](https://developer.riotgames.com) avec ton compte Riot, copie la *Development API Key* et colle-la. Elle expire toutes les 24 h ; pour éviter ça, demande une clé **Personal** (formulaire « Register product » sur le même site, gratuit).
2. **Réglages → Mon compte** : choisis ton serveur (EUW…). Ton Riot ID se remplit tout seul dès que le client LoL est ouvert.
3. **Réglages → Collecteur** : clique **Démarrer** (et « Démarrer avec l'appli » si tu veux qu'il tourne toujours). Les statistiques se remplissent au fil des heures.
4. **Réglages → Mini-carte** : règle LoL en **Fenêtré sans bordure** (Paramètres → Vidéo → Mode fenêtre), lance une partie d'entraînement, clique **Prendre une capture** et trace un rectangle autour de la mini-carte, puis **Enregistrer la zone**. Choisis sur quel écran l'afficher.

## 3. En partie
Rien à faire : Noob LOL passe tout seul sur **Sélection** pendant le choix des champions, puis sur **En jeu** au lancement. Le bouton **🗺️ Mini-carte sur l'écran 2** ouvre la carte agrandie (survole-la pour le bouton plein écran / fermer, ou Échap).

## Mises à jour
L'appli vérifie les nouvelles versions au démarrage puis toutes les heures. Quand une version est prête, un bandeau propose **Redémarrer et mettre à jour**.

## Tes données
Tout reste sur ton PC, dans `%APPDATA%\Noob LOL\` : `config.json` (réglages ; la clé y est chiffrée par Windows) et `stats.sqlite` (statistiques). Les favoris et notes sont dans le stockage de l'appli.
