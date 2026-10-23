/* Numéro de version + notes de version (affichés dans Réglages). Le numéro « officiel » de l'appli PC est celui de package.json. */
var APP_VERSION = '2.7.1';
var APP_RELEASES = [
  { v: '2.7.1', date: '2026-10-23', notes: [
    'Infobulles détaillées partout : en gardant la souris plus d\'une seconde sur une icône d\'objet (prix, recette, effets, composants, améliorations), de rune (voie, ligne, effet complet), de voie de runes (runes clés) ou de sort d\'invocateur (recharge, effet).',
  ]},
  { v: '2.7.0', date: '2026-10-23', notes: [
    'Préparation : nouvel onglet « Mes builds » pour créer tes propres pages de runes (voie principale, secondaire, fragments, sorts d\'invocateur) et tes builds d\'objets (départ, objets principaux dans l\'ordre, bottes, situationnels). Chaque build est associé à un champion et à un ou plusieurs rôles.',
    'Sélection : tes pages de runes pour ton champion et ton rôle apparaissent en premier ; un clic les applique dans le client avec tes sorts d\'invocateur.',
    'En jeu : ton build d\'objets perso remplace le build conseillé (prochain objet, or manquant, objets déjà achetés cochés, annonce vocale).',
    'Fiche champion : tes builds pour ce champion, avec création rapide.',
  ]},
  { v: '2.6.0', date: '2026-10-22', notes: [
    'Clé Riot : détection de l\'expiration (refus de Riot + vérification toutes les 20 min). Un bandeau et une annonce vocale te préviennent, et un rappel apparaît quand une clé de développement approche des 24 h.',
    'Clé Riot : bouton « Renouveler ma clé ». Il ouvre le portail développeur de Riot dans une fenêtre de l\'appli (connexion mémorisée). Tu coches le captcha et tu cliques « Regenerate API Key » : Noob LOL récupère la nouvelle clé, la vérifie, l\'enregistre et relance le collecteur.',
    'Une clé encore valide après 25 h est reconnue comme permanente (« Personal ») : plus de rappel.',
  ]},
  { v: '2.5.0', date: '2026-10-22', notes: [
    'Fin de partie : l\'onglet En jeu affiche toutes les statistiques de la partie (API officielle match-v5 + chronologie), en onglets : Résumé, Ma partie (contre mon adversaire, courbe d\'or, conseils pour progresser), Dégâts, Or et farm, Vision, Builds.',
    'Mon compte : un clic sur une partie récente ouvre toutes ses statistiques.',
    'Rang et niveau des joueurs à côté de leur nom, en sélection (ton équipe ; les adversaires restent masqués en classée) et en jeu (les 10 joueurs).',
    'Sélection : runes, sorts et kit d\'objets classés selon le match-up et la composition de l\'équipe adverse.',
    'En jeu : carte « Mon build » avec le prochain objet à acheter et l\'or qui manque, les objets de début, les objets adaptés à l\'équipe adverse et l\'ordre des sorts.',
    'En jeu : annonces vocales à la place des alarmes (objectifs 30 s avant et à l\'apparition, objectifs pris, inhibiteurs, équipe éliminée, ta mort et ton temps de réapparition, or suffisant pour ton prochain objet). Réglages : voix, vitesse, volume, test.',
    'Toute l\'application s\'adapte à la taille de la fenêtre (grand écran, portable, fenêtre étroite).',
  ]},
  { v: '2.4.0', date: '2026-10-22', notes: [
    'Sélection : face-à-face par rôle (top, jungle, mid, support, adc) entre ton équipe et l\'équipe adverse. Les rôles adverses sont estimés d\'après les statistiques et la classe des champions. Un clic sur un ennemi le désigne comme ton adversaire de voie.',
    'Sélection : pourcentage AD / AP de chaque champion et de chaque équipe.',
    'Sélection : un clic sur une page de runes ou une paire de sorts d\'invocateur l\'applique directement dans le client du jeu.',
    'En jeu : plus aucun bouton. La mini-carte affiche une image fixe de la Faille hors partie et le zoom en direct uniquement pendant la partie.',
    'En jeu : tableau des objectifs (dragon, larves, Héraut, Nashor, dragon ancestral) avec le temps avant apparition et le nombre pris par chaque équipe, plus les tours et inhibiteurs. Alarme sonore quand un objectif apparaît.',
    'En jeu : le bandeau horloge / caler / nouvelle partie et le suivi manuel des sorts adverses sont retirés. Les options de la mini-carte et du son sont dans Réglages.',
  ]},
  { v: '2.3.0', date: '2026-10-22', notes: [
    'En jeu : nouvelle mise en page plein écran. La page utilise toute la largeur, la mini-carte est carrée et calée sur la hauteur de la fenêtre, tout le reste est à droite et tient sans défiler en 1080p.',
    'En jeu : bandeau compact (horloge, ton champion, or, boutons mini-carte / écran 2 / son), sorts adverses et objectifs côte à côte, timers sur une ligne.',
    'En jeu : s\'adapte à la taille de la fenêtre (1440p, 1080p, portable, demi-écran : la mini-carte passe au-dessus).',
    'Réglages : estimation corrigée du collecteur (environ 1 500 parties par heure avec une clé de développement).',
  ]},
  { v: '2.2.0', date: '2026-10-22', notes: [
    'Sélection : détection de ton champion (survolé ou verrouillé) et de ta lane (attribuée par le client, sinon déduite de ton champion).',
    'Sélection : runes et sorts conseillés, contre ton adversaire de voie quand il y a assez de parties, sinon en général.',
    'Sélection : kit d\'objets complet (départ, deux premiers objets contre ton adversaire, bottes, objets suivants classés selon l\'équipe adverse) et ordre des sorts.',
    'Sélection : encart « Contre cette équipe » (part de dégâts AD/AP, tanks, soigneurs) avec les objets à placer en 3e ou 4e (résistance magique, armure, anti-soins, pénétration).',
    'Collecteur : il récupère maintenant la chronologie des parties (ordre d\'achat, montée des sorts, équipe adverse). Une requête de plus par partie : environ 1 000 parties par jour avec une clé de développement.',
  ]},
  { v: '2.1.0', date: '2026-10-22', notes: [
    'En jeu : la mini-carte s\'affiche en grand directement dans la fenêtre (au moins un quart de l\'écran). Le bouton pour l\'afficher sur un deuxième écran reste disponible.',
    'En jeu : les 10 joueurs à côté de la mini-carte avec niveau, kills / morts / assistances, sbires, objets et temps de réapparition.',
    'Profil de dégâts AD / AP de chaque joueur (en %), estimé d\'après ses objets, et profil de l\'équipe adverse avec un conseil : armure ou résistance magique.',
  ]},
  { v: '2.0.0', date: '2026-10-22', notes: [
    'Noob LOL devient une application PC (Windows) en trois parties : Préparation, Sélection, En jeu.',
    'Connexion au client League of Legends (lecture seule) : détection de la file, de la sélection et du lancement de partie, avec changement d\'écran automatique.',
    'Sélection : équipes et bannissements en direct, champions conseillés selon ton rôle, ton adversaire de voie et tes maîtrises, runes, sorts et objets les plus joués, conseils pour contrer l\'adversaire.',
    'En jeu : horloge synchronisée, tableau des scores, valeur des objets par équipe, timers de dragon et Nashor lancés automatiquement, sorts d\'invocateur adverses remplis tout seuls, journal de la partie.',
    'Mini-carte agrandie sur un deuxième écran.',
    'Mon compte : rang, maîtrises et dernières parties (API officielle de Riot, avec ta clé).',
    'Collecteur de statistiques : analyse des parties classées de joueurs Maître et plus pour calculer runes, objets et match-ups, stockés sur ton PC. Nouvel onglet Méta.',
  ]},
  { v: '1.0.0', date: '2026-10-22', notes: ['Première version (application web) : champions, objets, runes, timers, guide et lexique.'] },
];
