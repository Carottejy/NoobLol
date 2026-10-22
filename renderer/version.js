/* Numéro de version + notes de version (affichés dans Réglages). Le numéro « officiel » de l'appli PC est celui de package.json. */
var APP_VERSION = '2.2.0';
var APP_RELEASES = [
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
