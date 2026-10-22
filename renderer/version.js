/* Numéro de version + notes de version (affichés dans Réglages). Le numéro « officiel » de l'appli PC est celui de package.json. */
var APP_VERSION = '2.0.0';
var APP_RELEASES = [
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
