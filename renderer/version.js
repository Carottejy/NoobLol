/* Numéro de version + notes de version (affichés dans Réglages). Le numéro « officiel » de l'appli PC est celui de package.json. */
var APP_VERSION = '3.12.0';
var APP_RELEASES = [
  { v: '3.12.0', date: '2026-10-30', notes: [
    'Écran « En jeu » réorganisé en 3 colonnes pour tout voir d\'un coup d\'œil : conseils à gauche, joueurs au centre, objectifs, build, ordre des sorts et journal à droite.',
    'En jeu : les builds conseillés du chargement (contre ton match-up et contre toute l\'équipe adverse) sont aussi affichés, avec le bouton ⭐ pour les suivre dans l\'encart.',
    'Conseils résumés avec des symboles (texte complet au survol), objectifs en tuiles compactes.',
    'Nouveau : ordre des sorts pour ton champion et ton rôle (d\'après le collecteur), sur une grille des niveaux 1 à 18. En jeu, le niveau actuel est entouré et l\'appli te dit quel sort monter quand tu as un point à dépenser. Aussi affiché au chargement.',
  ]},
  { v: '3.11.3', date: '2026-10-30', notes: [
    'Encart « Ma progression » : des symboles à la place des textes (sbire pour le CS/min, pièce d\'or pour l\'or, œil pour la vision, poignée de main pour la participation, crâne pour les morts, épées pour le KDA) et une largeur réduite à celle d\'une mini-carte (280 pixels).',
  ]},
  { v: '3.11.2', date: '2026-10-30', notes: [
    'Encart « Ma progression » : CS/min à la place du nombre de sbires, et encart deux fois plus grand (texte doublé).',
  ]},
  { v: '3.11.1', date: '2026-10-30', notes: [
    'Réglages : chaque indicateur de l\'encart « Ma progression » (sbires, or gagné, score de vision, participation aux kills, morts, KDA) peut être affiché ou masqué. L\'encart s\'ajuste à la hauteur des indicateurs gardés.',
  ]},
  { v: '3.11.0', date: '2026-10-30', notes: [
    'En jeu : nouvel encart « Ma progression » par-dessus le jeu. Il compare, à la minute où tu es, tes sbires, ton or gagné, ton score de vision, ta participation aux kills, tes morts et ton KDA à la cible de ton rang visé et de ton rôle (vert : atteint, orange : presque, rouge : en retard).',
    'Il se déplace en le faisant glisser, sa position est retenue ; on peut le désactiver ou le replacer dans Réglages.',
  ]},
  { v: '3.10.0', date: '2026-10-30', notes: [
    'Écran de chargement : les incrustations sont toujours dans l\'ordre top, jungle, mid, support, ADC (le client ne donne pas toujours les joueurs dans cet ordre). Même ordre dans l\'appli.',
    'Chargement : nouveau « Build contre toute l\'équipe adverse », en plus du build pour ton match-up. Les objets qui contrent leur composition (anti-soins, anti-burst, résistances, pénétration) passent dans les principaux, et les bottes suivent leurs dégâts. Il peut être suivi dans l\'encart en jeu.',
    'Annonces vocales : plus de rappel pour acheter une balise de contrôle.',
  ]},
  { v: '3.9.0', date: '2026-10-30', notes: [
    'Annonces vocales : plus d\'annonce sur ton adversaire de voie (avance de niveau, objets terminés) après 15 minutes de jeu.',
    'Statistiques fournies avec l\'appli (51 640 parties, 506 634 lignes, patchs 16.20 et 16.21) : à la première ouverture de cette version, si ta base contient moins de lignes, elle est remplacée par celle-ci. L\'ancienne est gardée à côté (stats.sqlite.avant-maj.bak).',
  ]},
  { v: '3.8.0', date: '2026-10-29', notes: [
    'En jeu : nouvelle carte « ⚡ Achats adaptés à la partie ». Noob LOL lit le tableau des scores (le même que la touche Tab) : objets achetés, kills/morts et or de chaque adversaire, et repère les plus dangereux.',
    'Les conseils d\'achat s\'adaptent : armure ou résistance magique selon ce qui fait vraiment mal en face (pondéré par l\'avance de chaque joueur), anti-soins s\'ils achètent du vol de vie, pénétration s\'ils empilent l\'armure ou la RM, protection anti-burst si un assassin est en avance, dégâts selon les PV max contre les tanks. Chaque conseil explique pourquoi.',
    'Le conseil le plus utile s\'affiche aussi dans « Mon build », dans l\'encart par-dessus le jeu, et peut être annoncé à voix haute (catégorie « Objets adaptés » du coaching).',
  ]},
  { v: '3.7.0', date: '2026-10-28', notes: [
    'En jeu : la mini-carte intégrée est remplacée par les conseils pour ton match-up et face à l\'équipe adverse (les mêmes qu\'au chargement, avec les images des objets conseillés). La mini-carte sur un deuxième écran reste disponible dans Réglages.',
    'Annonces vocales : plus d\'annonce quand tu termines un objet.',
  ]},
  { v: '3.6.5', date: '2026-10-26', notes: [
    'Annonces vocales : plus d\'annonce quand tu meurs.',
  ]},
  { v: '3.6.4', date: '2026-10-24', notes: [
    'Encart « Mon build » en jeu : de nouveau déplaçable directement à la souris (c\'est la seule action possible dessus : aucun clic sur les objets). Le bouton « Déplacer l\'encart (30 s) » est supprimé.',
  ]},
  { v: '3.6.3', date: '2026-10-24', notes: [
    'Écran de chargement : les infos par-dessus le jeu n\'apparaissent plus pendant le lancement du jeu (écran noir), mais une fois le jeu lancé ; et elles restent jusqu\'au vrai début de la partie (le jeu répond déjà pendant le chargement avec un chrono à 0 : ce n\'est plus pris pour le début de la partie). L\'écran « Chargement » de l\'appli reste affiché jusqu\'au début de la partie.',
    'Encart « Mon build » en jeu : plus aucun clic, la souris le traverse. Pour le placer : Réglages → « 🖐️ Déplacer l\'encart (30 s) », il se verrouille tout seul ensuite. Il n\'apparaît qu\'une fois la partie commencée.',
    'Simulateur : séquence de lancement réaliste (lancement du jeu, puis jeu qui répond avec un chrono à 0 pendant le chargement, puis début de la partie).',
  ]},
  { v: '3.6.2', date: '2026-10-24', notes: [
    'Écran de chargement : calage corrigé. L\'encart couvre désormais tout l\'écran du jeu (Windows le réduisait à la zone sans barre des tâches, ce qui décalait et rétrécissait tout) et les positions sont calculées sur la taille réelle de l\'écran. Disposition re-mesurée sur le vrai client, centrage compris.',
    'Réglages de l\'encart de chargement simplifiés à 5 curseurs : centrer les cartes, largeur, écart, rangée du haut, rangée du bas (valeurs en pixels pour un écran de 1080 px de haut). La hauteur des cartes suit leur largeur.',
  ]},
  { v: '3.6.1', date: '2026-10-24', notes: [
    'Écran de chargement : disposition mesurée sur le vrai client (2 rangées de 5 cartes, taille proportionnelle à la hauteur de l\'écran, donc juste à toutes les résolutions). Les infos de chaque joueur sont posées en bas de l\'image du champion, juste au-dessus de son nom, sans cacher les runes, les sorts ni le pseudo ; la taille du texte suit celle des cartes.',
    'Réglages : nouveau curseur « Position du nom du champion », et l\'aperçu trace une ligne sur le nom pour vérifier le calage.',
    'Simulateur : cartes de chargement dessinées comme celles du jeu (illustration, nom du champion, plaque des sorts, pseudo).',
  ]},
  { v: '3.6.0', date: '2026-10-24', notes: [
    'Partager les statistiques du collecteur : Réglages → Collecteur → « 📤 Exporter mes statistiques » crée un fichier .nooblolstats (compressé) à donner à un ami.',
    'Chez l\'ami, un double-clic sur ce fichier ouvre Noob LOL qui propose de l\'importer (ou « 📥 Importer des statistiques »). Les parties sont ajoutées aux siennes, sans doublon : rien n\'est effacé.',
    'Le fichier ne contient que les statistiques du collecteur : ni clé Riot, ni builds, ni compte.',
  ]},
  { v: '3.5.1', date: '2026-10-23', notes: [
    'Écran de chargement : les infos de chaque joueur sont maintenant posées SUR la carte de son champion (même disposition que le jeu : 2 rangées de 5 cartes, taille selon la hauteur de l\'écran). Réglage fin dans Réglages → « Placer les infos sur les cartes du chargement », avec un aperçu qui dessine le contour des cartes sur l\'écran du jeu.',
    'Type de dégâts officiel de Riot (AD, AP ou Mixte) au lieu d\'un pourcentage estimé : Séraphine est bien AP. Il vient des données du client LoL (sinon de leur copie publique) et sert aussi en sélection et pour les profils d\'équipe.',
    'Build conseillé complet : départ, objets principaux, bottes, puis objets suivants (d\'abord ceux qui répondent à l\'équipe adverse). Les objets cités dans les conseils sont exactement ceux du build.',
    'Conseils : l\'image et le nom de chaque objet conseillé (un clic ouvre sa fiche).',
    'Simulateur : écran de chargement plein écran avec la même disposition que le jeu, pour vérifier le calage de l\'encart.',
  ]},
  { v: '3.5.0', date: '2026-10-23', notes: [
    'Écran de chargement, par-dessus le jeu : pour chaque joueur, son rang, son niveau, ses victoires et son KDA moyen sur ses 10 dernières parties, et le type de dégâts (AD/AP) de son champion. Une bande en haut pour l\'équipe bleue, une en bas pour l\'équipe rouge ; elle disparaît dès que la partie commence et laisse passer les clics. Désactivable dans Réglages.',
    'Dans l\'appli, nouvel écran « Chargement de la partie » (onglet En jeu) : les mêmes infos pour les 10 joueurs (🔥 pour ceux qui sont en forme), et un clic sur un adversaire le désigne comme ton adversaire de voie.',
    'Build conseillé pour cette partie : objets de départ pour ton match-up, objets principaux, bottes et objets contre l\'équipe adverse (statistiques du collecteur si disponibles, sinon règles générales). Bouton « Suivre ce build dans l\'encart en jeu ».',
    'Conseils pour ton match-up (portée, type de dégâts, style du champion, ultime, conseils officiels de Riot, taux de victoire du match-up, forme de ton adversaire) et face à l\'équipe adverse (armure ou résistance magique, assassins, engage, poke, tanks, soins, champions forts en fin de partie, joueurs en forme, joueur le plus dangereux).',
    'Les victoires et le KDA viennent de l\'historique du client LoL (sans clé Riot), sinon de l\'API Riot sur 5 parties.',
    'Simulateur : historique de parties pour chaque joueur et rôles dans la session de partie, pour tester tout cela.',
  ]},
  { v: '3.4.1', date: '2026-10-23', notes: [
    'Simulateur : l\'écran de chargement reste affiché tant que tu ne cliques pas sur « Lancer la partie », même quand tout le monde est prêt. « Terminer le chargement » remplit les barres sans lancer la partie.',
  ]},
  { v: '3.4.0', date: '2026-10-23', notes: [
    'Nouveau : Simulateur de partie (Réglages → 🧪 Simulateur de partie). Une fenêtre joue le rôle du client League of Legends et du jeu : Noob LOL s\'y connecte comme au vrai client, ce qui permet de tout tester sans lancer de partie.',
    '• Salon : ton nom, ton rang, ton rôle, la file (classée, normale draft ou aveugle), les rôles fournis ou non, et le format des noms dans les événements du jeu (ancien nom d\'invocateur, nom de jeu ou Riot ID).',
    '• Sélection des champions : bannissements, survol et verrouillage pour chaque joueur, picks automatiques dans l\'ordre officiel, chrono. Les pages de runes et les sorts appliqués par Noob LOL s\'affichent dans le simulateur.',
    '• Écran de chargement : les 10 cartes avec leur progression (Noob LOL voit la phase « partie trouvée »).',
    '• Partie : temps accéléré (×1 à ×30, +1 min, +5 min), progression réaliste (sbires, niveaux, or, achats), événements automatiques, et boutons pour déclencher kills, dragon, larves, Héraut, Nashor, tours, inhibiteurs, vie ou mana basses, or, mort, adversaire de voie qui prend des niveaux ou finit un objet.',
    '• Fin de partie : Noob LOL affiche l\'état final. Fermer la fenêtre du simulateur rebranche Noob LOL sur le vrai client.',
  ]},
  { v: '3.3.0', date: '2026-10-23', notes: [
    'Ma progression : objectif selon ton rang. Noob LOL affiche ton rang actuel et le rang cible (par défaut le rang au-dessus : Fer → Bronze, Argent → Or…), que tu peux changer.',
    'Les objectifs prennent par défaut le repère du rang cible pour ton rôle (CS/min, morts, vision/min, participation, KDA, or/min). Avec − et +, tu passes en valeur personnalisée ; « ↺ repère » revient au repère du rang.',
    'Sous chaque indicateur, le repère du rang cible, coché ✓ quand ta moyenne l\'atteint.',
    'En jeu, le point farm à 10 et 20 min compare tes CS/min au repère de ton rang cible.',
    'Les repères sont des estimations de valeurs typiques par rang et par rôle (Riot ne publie pas de moyennes par rang).',
  ]},
  { v: '3.2.0', date: '2026-10-23', notes: [
    'Ma progression par rôle : un filtre (Tous les rôles, Top, Jungle, Mid, ADC, Support, avec le nombre de parties) change les indicateurs, la courbe et l\'objectif.',
    'Un objectif différent pour chaque rôle (par défaut : vision/min en support, participation en jungle, CS/min ailleurs). En jeu, le point farm utilise l\'objectif CS/min du rôle que tu joues.',
    'Nouveau tableau « Mes rôles comparés » : parties, victoires, CS/min, morts, vision/min, participation, KDA et or/min par rôle, avec ton meilleur rôle en jaune pour chaque indicateur.',
    'L\'historique passe à tes 40 dernières parties sur la Faille, pour avoir assez de parties dans chaque rôle.',
  ]},
  { v: '3.1.1', date: '2026-10-23', notes: [
    'Coaching « Moment pour rentrer » : alerte aussi quand il te reste moins de 10 % de mana (champions à mana seulement).',
  ]},
  { v: '3.1.0', date: '2026-10-23', notes: [
    'Coaching en direct pendant la partie (annonce vocale + ligne 💡 dans le journal), d\'après tes propres données et ce que tout joueur voit dans le tableau des scores :',
    '• Moment pour rentrer : moins de 20 % de vie et au moins 1 800 po.',
    '• Ton adversaire de voie : quand il atteint le niveau 6 avant toi, quand il a 2 niveaux d\'avance, quand il termine un objet ; et quand toi tu termines un objet.',
    '• Plusieurs adversaires morts en même temps : pendant combien de secondes, et quoi faire (Nashor, dragon, Héraut ou pousser une tour).',
    '• Objets contre l\'équipe adverse : anti-soins si elle se soigne beaucoup, pénétration d\'armure ou magique si elle empile les résistances.',
    '• Point farm à 10 et 20 min par rapport à ton objectif de CS/min, et rappel des plaques des tours à 13:30.',
    'Chaque type de coaching se désactive dans Réglages → Voix.',
  ]},
  { v: '3.0.0', date: '2026-10-23', notes: [
    'Mon compte → Ma progression : tes 20 dernières parties sur la Faille (CS/min, morts, vision/min, participation, KDA, or/min), avec la moyenne des 5 dernières comparée aux 5 d\'avant, et une courbe partie par partie.',
    'Mon compte → Mon objectif : choisis un indicateur et une valeur à atteindre (ex. 6 CS/min). Noob LOL te montre ta moyenne actuelle et combien de fois tu l\'as atteint sur tes 10 dernières parties.',
    'Mon compte → Mes champions : taux de victoire, KDA et CS/min par champion sur tes 20 dernières parties, les 2 ou 3 champions à travailler en priorité et ceux à mettre de côté pour l\'instant.',
    'Fin de partie → nouvel onglet « Mes morts » : chaque mort sur la carte avec la minute, la zone (voie, rivière, jungle…), qui t\'a tué et combien d\'ennemis étaient là, l\'écart de niveau, et les habitudes à corriger.',
    'En jeu : rappels vocaux (ultime aux niveaux 6, 11 et 16, balise de contrôle après un achat si tu n\'en as pas, Lentille d\'oracle pour les supports). Désactivables dans Réglages → Voix.',
    'Accueil : ce qui change au nouveau patch pour tes champions (favoris, meilleures maîtrises, champions joués récemment) : statistiques, recharges, coûts, portées et descriptions des compétences, avec ▲ amélioration / ▼ affaiblissement.',
    'Objets : filtres combinables (type, plusieurs statistiques à la fois avec « toutes » ou « au moins une », tranche de prix) et tri par prix ou par nom.',
  ]},
  { v: '2.9.3', date: '2026-10-23', notes: [
    'Mes builds : ajout du build « Claude Lillia Support » (runes Comète arcanique / Inspiration, Saut éclair + Fatigue ; Atlas du monde → Pointe-de-royaume de Zaz\'Zak, Tourment de Liandry, Sceptre de Rylai, Bottes ioniennes).',
    'L\'application s\'ouvre en plein écran (fenêtre agrandie).',
    'En changeant d\'onglet, les champs de recherche (champions, objets, lexique, éditeur de build) sont vidés.',
  ]},
  { v: '2.9.2', date: '2026-10-23', notes: [
    'Correction : en jeu, les compteurs de tours et d\'inhibiteurs détruits fonctionnent (le nom de la structure est reconnu sous plusieurs formats, sinon on regarde qui l\'a détruite). Le journal dit maintenant « Tour ennemie détruite » ou « Nous avons perdu une tour ».',
    'En jeu : la carte « Mon build » est plus compacte et montre tous les objets visés (départ, principaux, bottes, selon la partie). Le prochain objet est entouré, ceux déjà achetés sont cochés. Un clic sur un objet ouvre sa fiche boutique (le bouton « Retour » ramène à la partie).',
    'Encart par-dessus le jeu : tous les objets visés aussi, et un clic sur un objet ouvre sa fiche dans Noob LOL.',
    'Réglages : bouton « Dossier de l\'appli (diagnostic) ». À la fin de chaque partie, Noob LOL y enregistre les événements bruts du jeu (diagnostic-evenements.json) pour comprendre un compteur qui ne marcherait pas.',
  ]},
  { v: '2.9.1', date: '2026-10-23', notes: [
    'Réglages : bouton « Vérifier les mises à jour » avec l\'état en direct (recherche, téléchargement en %, dernière version installée, prête à installer) et bouton « Redémarrer et installer ».',
  ]},
  { v: '2.9.0', date: '2026-10-23', notes: [
    'Correction : en jeu, les objectifs (dragons, larves, Héraut, Nashor) sont de nouveau comptés pour la bonne équipe, et l\'annonce vocale ne dit plus « l\'ennemi » à tort. Le jeu nomme parfois les joueurs par leur ancien nom d\'invocateur dans ses événements : Noob LOL reconnaît maintenant tous les noms (Riot ID, nom de jeu, ancien nom, et ceux du client LoL), puis les joueurs qui ont aidé. Si l\'équipe reste inconnue, l\'annonce ne dit pas qui.',
    'Correction : dans l\'historique des parties, ton équipe et les adversaires ne sont plus inversés (tu es retrouvé par ton compte, sinon par ton Riot ID).',
    'Fin de partie : nouvel onglet « Équipe » (plus grande avance et plus grand retard, kills, or et dégâts par minute, plaques, 16 comparaisons équipe contre équipe, les « premiers » : premier sang, première tour, premier dragon…, répartition des dégâts, de l\'or et des dégâts subis par joueur, courbes des kills, de l\'or, des écarts d\'or et d\'expérience, frise des objectifs).',
    'Fin de partie : nouvel onglet « Carte » (toutes les éliminations sur la carte, tes kills, morts et assistances, et la liste de tes actions dans le temps).',
    'Ma partie : 20 indicateurs (dégâts/min, part de l\'or, vision/min, dégâts pour 1 000 po, kills en solo, plaques, CS à 10 min, avance max. en CS et en niveaux, sorts touchés et esquivés, soins utiles, temps mort, plus longue survie, premier sang), un radar « Mon profil » contre ton adversaire et 3 courbes minute par minute (sbires, expérience, dégâts).',
    'Résumé : frise des objectifs de la partie.',
  ]},
  { v: '2.8.1', date: '2026-10-23', notes: [
    'Sbires : partout dans l\'application (en jeu, fin de partie, Mon compte), les sbires sont affichés en CS par minute au lieu du total (le total reste visible au survol).',
  ]},
  { v: '2.8.0', date: '2026-10-23', notes: [
    'En jeu : les joueurs sont rangés par voie (top, jungle, mid, support, adc) et placés face à face, ton équipe à gauche, l\'adversaire à droite.',
    'En jeu : or gagné de chaque joueur (exact pour toi, estimé pour les autres car le jeu ne publie que le tien) et indicateur de domination de chaque voie (égalité, avantage, domine) d\'après l\'écart d\'or et de niveau.',
    'En jeu : nouvel encart « Mon build » par-dessus le jeu, en bas entre tes compétences et la mini-carte : prochain objet, or manquant, objets achetés cochés. Il se déplace à la souris et sa position est retenue (Réglages pour le désactiver ou le replacer).',
    'Sélection : choix du build d\'objets que Noob LOL suivra en partie quand tu en as plusieurs pour ton champion.',
    'Annonces vocales : plus d\'annonce pour le premier sang ni pour les éliminations.',
  ]},
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
