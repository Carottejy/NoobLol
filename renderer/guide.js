/* Contenu rédigé pour Noob LOL : guide débutant, lexique, conseils. (Le reste vient des données officielles de Riot.) */
var GUIDE = {
  /* Champions conseillés pour débuter, par rôle (identifiants Data Dragon). */
  beginners: {
    top: ['Garen', 'Malphite', 'Darius', 'Sett', 'Nasus'],
    jungle: ['Warwick', 'MasterYi', 'Amumu', 'Vi', 'Volibear'],
    mid: ['Annie', 'Lux', 'Malzahar', 'Veigar', 'Galio'],
    adc: ['Ashe', 'MissFortune', 'Caitlyn', 'Jinx', 'Sivir'],
    support: ['Soraka', 'Leona', 'Sona', 'Janna', 'Morgana'],
  },

  roles: [
    { id: 'top', icon: '🛡️', name: 'Top (voie du haut)', who: 'Combattants et tanks solides, souvent en duel.',
      todo: ['Farmer tranquillement et gagner tes duels 1 contre 1.', 'Surveiller ta tour : la voie du haut est longue et isolée, gare aux ganks.', 'Plus tard : te téléporter pour aider ton équipe ou pousser seul une voie (split push).'] },
    { id: 'jungle', icon: '🌲', name: 'Jungle', who: 'Le rôle qui se balade : il tue les monstres entre les voies.',
      todo: ['Faire tes camps de monstres (commence par un buff, rouge ou bleu).', 'Aider les voies (« gank ») quand l\'adversaire est trop avancé.', 'Prendre les objectifs : dragons, larves, Héraut, Nashor. C\'est TON travail de les surveiller.', 'Prends toujours le sort Châtiment (Smite).'] },
    { id: 'mid', icon: '✨', name: 'Mid (voie du milieu)', who: 'Mages et assassins qui font beaucoup de dégâts.',
      todo: ['Farmer et gêner ton adversaire avec tes sorts.', 'La voie est courte : tu peux aller aider le haut ou le bas (« roam »).', 'Quand ton adversaire disparaît, préviens tes alliés (ping « disparu »).'] },
    { id: 'adc', icon: '🏹', name: 'ADC / Bot (voie du bas)', who: 'Tireurs qui tapent de loin, fragiles mais très forts en fin de partie.',
      todo: ['Ta priorité : récupérer un maximum de sbires (CS). L\'or te rend fort.', 'Reste derrière tes alliés en combat et tape ce qui est à portée.', 'Ne meurs pas : tu es la principale source de dégâts de l\'équipe.'] },
    { id: 'support', icon: '💖', name: 'Support', who: 'Il protège son ADC, contrôle la carte et pose la vision.',
      todo: ['Ne prends PAS les sbires : laisse-les à ton ADC.', 'Pose des balises (wards) partout : la vision gagne les parties.', 'Soigne, protège, ou immobilise les ennemis pour ton équipe.', 'Achète l\'objet de support au début : il te donne de l\'or.'] },
  ],

  sections: [
    { id: 'bases', icon: '🎯', title: 'Le but du jeu', html: `
      <p>Deux équipes de 5 s'affrontent sur la <b>Faille de l'invocateur</b>. Pour gagner, il faut <b>détruire le Nexus</b> adverse, le gros cristal au fond de sa base.</p>
      <p>Pour l'atteindre, on avance sur <b>3 voies</b> (haut, milieu, bas) protégées par des <b>tours</b> et des <b>inhibiteurs</b>. Entre les voies se trouve la <b>jungle</b>, remplie de monstres neutres.</p>
      <ul>
        <li><b>Sbires (minions)</b> : petits soldats qui avancent tout seuls sur chaque voie. Les achever donne de l'or.</li>
        <li><b>Tours</b> : elles tirent très fort. Ne reste pas sous une tour ennemie sans tes sbires devant toi.</li>
        <li><b>Inhibiteur</b> : s'il tombe, l'adversaire subit des super-sbires sur cette voie.</li>
        <li><b>Or et expérience</b> : on gagne de l'or (pour acheter des objets) et de l'expérience (pour monter de niveau, jusqu'à 18).</li>
      </ul>` },
    { id: 'farm', icon: '🌾', title: 'Farmer : la base de tout', html: `
      <p>Le « <b>last hit</b> » consiste à donner le <b>dernier coup</b> à un sbire : c'est seulement là que tu touches l'or. Taper n'importe comment ne rapporte rien.</p>
      <ul>
        <li>Attends que la barre de vie du sbire soit basse, puis frappe-le d'une attaque de base.</li>
        <li>Les <b>CS</b> (creep score) comptent tes sbires achevés : visible en haut à droite.</li>
        <li>Objectif pour progresser : <b>5 à 6 CS par minute</b> au début, puis viser 7 ou plus.</li>
        <li>Entraîne-toi dans l'<b>Outil d'entraînement</b> du jeu : 10 minutes de last hit sans adversaire valent de l'or.</li>
      </ul>` },
    { id: 'vision', icon: '👁️', title: 'La vision', html: `
      <p>La carte est cachée par le « brouillard de guerre ». Une <b>balise (ward)</b> posée au sol révèle la zone autour pendant un moment.</p>
      <ul>
        <li><b>Trinket jaune</b> (touche <kbd>4</kbd>) : une balise gratuite qui se recharge. Utilise-la souvent !</li>
        <li><b>Balise de contrôle</b> (rose) : s'achète en boutique, révèle et désactive les balises ennemies. Garde-en une sur toi.</li>
        <li>Pose tes balises dans la rivière et les entrées de jungle pour voir arriver le jungler adverse.</li>
        <li>Pas de vision = danger. Si tu ne vois pas où sont les ennemis, recule.</li>
      </ul>` },
    { id: 'objectifs', icon: '🐉', title: 'Les objectifs', html: `
      <ul>
        <li><b>Dragons</b> : apparaissent dans la rivière du bas, puis réapparaissent régulièrement. Chaque dragon donne un bonus permanent à l'équipe. Au 4ᵉ dragon, l'équipe obtient l'<b>âme du dragon</b>, puis le <b>dragon ancestral</b> apparaît (très puissant).</li>
        <li><b>Larves du Néant</b> et <b>Héraut de la Faille</b> : dans la rivière du haut en début et milieu de partie. Ils aident à détruire les tours.</li>
        <li><b>Baron Nashor</b> : apparaît à <b>20:00</b> dans la rivière du haut. Son buff rend les sbires très forts et aide à finir la partie.</li>
        <li><b>Buffs rouge et bleu</b> : monstres de la jungle. Le bleu aide à la régénération de mana, le rouge ajoute des dégâts sur la durée et ralentit.</li>
      </ul>
      <p class="muted">Astuce : on se bat pour un objectif quand l'équipe adverse a <b>moins de joueurs</b> (morts ou loin). Regarde le tableau des scores (<kbd>Tab</kbd>).</p>` },
    { id: 's2026', icon: '🆕', title: 'Ce qui a changé en 2026', html: `
      <ul>
        <li>Les sbires arrivent plus tôt (<b>0:30</b>) et les camps de la jungle aussi : la partie démarre plus vite.</li>
        <li><b>Atakhan</b> a été retiré du jeu, ainsi que les « Exploits de force ».</li>
        <li>Le premier champion tué et la première tour détruite donnent un bonus d'or à l'équipe.</li>
        <li>Les tours gardent leurs <b>plaques</b> plus longtemps, et les tours intérieures en ont aussi.</li>
        <li><b>Quêtes de rôle</b> : chaque rôle a sa quête liée à sa voie, avec des récompenses (ex. téléportation gratuite pour le top, bottes et rappel plus rapide pour le mid, emplacement d'objet en plus pour l'ADC, emplacement de vision dédié pour le support).</li>
      </ul>
      <p class="muted">Riot ajuste ces règles à chaque patch : en cas de doute, les infos du jeu font foi.</p>` },
    { id: 'achats', icon: '🛒', title: 'Acheter ses objets', html: `
      <ul>
        <li>Rentre à la base avec <kbd>B</kbd> (8 secondes sans bouger ni être touché), puis ouvre la boutique avec <kbd>P</kbd>.</li>
        <li>Débutant ? Utilise l'onglet <b>Recommandés</b> de la boutique : le jeu te propose les bons objets pour ton champion.</li>
        <li>Achète des <b>bottes</b> tôt : se déplacer vite sauve des vies.</li>
        <li>Rentre quand tu as peu de vie ou assez d'or pour un objet : ne reste pas sur la voie à 10 % de vie.</li>
      </ul>` },
    { id: 'erreurs', icon: '⚠️', title: 'Les 10 erreurs de débutant', html: `
      <ol>
        <li><b>Ne jamais regarder la mini-carte.</b> Prends l'habitude d'y jeter un œil toutes les 5 secondes.</li>
        <li><b>Poursuivre un ennemi trop loin</b> (« chase ») et finir sous sa tour ou face à toute son équipe.</li>
        <li><b>Aller seul</b> dans la jungle adverse sans vision.</li>
        <li><b>Taper tous les sbires</b> au lieu d'attendre le dernier coup.</li>
        <li><b>Ne pas rentrer acheter</b> avec 3000 pièces d'or en poche.</li>
        <li><b>Ignorer les objectifs</b> (dragons, Nashor, tours) pour courir après des kills.</li>
        <li><b>Se battre à 4 contre 5.</b> Si un allié est mort, on recule.</li>
        <li><b>Jouer 15 champions différents.</b> Choisis-en 2 ou 3 et maîtrise-les.</li>
        <li><b>Répondre aux provocations dans le chat.</b> Coupe le chat, joue ta partie.</li>
        <li><b>Abandonner trop tôt.</b> Une partie de LoL se retourne souvent, surtout chez les débutants.</li>
      </ol>` },
    { id: 'mental', icon: '🧘', title: 'Garder un bon mental', html: `
      <ul>
        <li>Tape <code>/mute all</code> dans le chat pour couper tout le monde : tu restes concentré.</li>
        <li>Après 2 défaites d'affilée, fais une pause. Le « tilt » fait perdre bien plus que le niveau.</li>
        <li>Après une mort, demande-toi « qu'est-ce que j'aurais pu faire ? » plutôt que d'accuser l'équipe.</li>
        <li>Joue d'abord contre l'IA (mode « Coop vs IA ») puis en normal avant de lancer des parties classées.</li>
      </ul>` },
    { id: 'touches', icon: '⌨️', title: 'Raccourcis clavier utiles', html: `
      <table class="kbd">
        <tr><td><kbd>Q</kbd> <kbd>W</kbd> <kbd>E</kbd> <kbd>R</kbd></td><td>Sorts du champion (R = ultime)</td></tr>
        <tr><td><kbd>D</kbd> <kbd>F</kbd></td><td>Sorts d'invocateur (ex. Saut éclair)</td></tr>
        <tr><td><kbd>Ctrl</kbd> + <kbd>Q</kbd>/<kbd>W</kbd>/<kbd>E</kbd>/<kbd>R</kbd></td><td>Améliorer un sort au passage de niveau</td></tr>
        <tr><td><kbd>B</kbd></td><td>Rappel à la base</td></tr>
        <tr><td><kbd>P</kbd></td><td>Boutique</td></tr>
        <tr><td><kbd>4</kbd></td><td>Balise / trinket</td></tr>
        <tr><td><kbd>1</kbd> à <kbd>7</kbd></td><td>Objets utilisables</td></tr>
        <tr><td><kbd>Tab</kbd></td><td>Tableau des scores (objets, niveaux des ennemis)</td></tr>
        <tr><td><kbd>Espace</kbd> (maintenu)</td><td>Centrer la caméra sur ton champion</td></tr>
        <tr><td><kbd>Y</kbd></td><td>Verrouiller / déverrouiller la caméra</td></tr>
        <tr><td><kbd>Entrée</kbd></td><td>Chat d'équipe (<kbd>Maj</kbd>+<kbd>Entrée</kbd> : chat de tous)</td></tr>
      </table>` },
  ],

  lexicon: [
    ['AA', 'Auto-attaque : l\'attaque de base (clic droit sur un ennemi).'],
    ['AD', 'Attack Damage : dégâts physiques. Un « AD » est un champion qui tape physiquement.'],
    ['ADC', 'Attack Damage Carry : le tireur de la voie du bas.'],
    ['AP', 'Ability Power : puissance magique. Un « AP » est un champion à dégâts magiques.'],
    ['Aggro', 'Attirer l\'attention d\'une tour ou des sbires, qui se mettent à te taper.'],
    ['AoE', 'Area of Effect : un sort qui touche une zone.'],
    ['Back / Recall', 'Rentrer à la base (touche B).'],
    ['Backdoor', 'Détruire des structures sans sbires devant soi, souvent par surprise.'],
    ['Bait', 'Faire semblant d\'être une proie facile pour attirer l\'ennemi dans un piège.'],
    ['Blue / Red', 'Les buffs bleu et rouge de la jungle.'],
    ['Bot', 'La voie du bas (ADC + support).'],
    ['Buff', 'Un bonus temporaire (Nashor, rouge, bleu…). À l\'inverse, un « nerf » est un affaiblissement par Riot.'],
    ['Burst', 'Infliger énormément de dégâts en très peu de temps.'],
    ['Carry', 'Le joueur qui fait gagner l\'équipe par ses dégâts. « Carry la game ».'],
    ['CC', 'Crowd Control : contrôle de foule (étourdissement, ralentissement, projection…).'],
    ['CD', 'Cooldown : temps de recharge d\'un sort. « Flash en CD » = il ne l\'a plus.'],
    ['Champ select', 'L\'écran de sélection des champions avant la partie.'],
    ['Combo', 'Enchaînement de sorts dans le bon ordre pour un maximum d\'effet.'],
    ['Counter', 'Un champion fort contre un autre. « Counter pick » = choisir pour contrer.'],
    ['CS', 'Creep Score : nombre de sbires et monstres achevés.'],
    ['Dive', 'Aller tuer un ennemi sous sa propre tour.'],
    ['DPS', 'Dégâts par seconde, ou un champion qui fait des dégâts en continu.'],
    ['Engage', 'Lancer le combat (souvent le rôle des tanks).'],
    ['Farm', 'Récupérer de l\'or en achevant sbires et monstres.'],
    ['Feed', 'Mourir souvent, ce qui donne de l\'or à l\'adversaire.'],
    ['Flash', 'Saut éclair : sort d\'invocateur de téléportation courte. Le plus utilisé du jeu.'],
    ['Focus', 'Concentrer les attaques de l\'équipe sur une seule cible.'],
    ['Freeze', 'Garder la vague de sbires près de sa tour pour farmer en sécurité.'],
    ['Gank', 'Attaque surprise d\'une voie par un joueur venu d\'ailleurs (souvent le jungler).'],
    ['Gap closer', 'Un sort qui permet de se rapprocher d\'un coup (bond, ruée).'],
    ['GG', 'Good Game : « bien joué », dit en fin de partie.'],
    ['Ignite', 'Embrasement : sort d\'invocateur qui brûle et réduit les soins de la cible.'],
    ['Invade', 'Entrer dans la jungle adverse (pour voler des camps ou surprendre).'],
    ['Kite', 'Taper en reculant pour rester hors de portée d\'un ennemi au corps à corps.'],
    ['KS', 'Kill Steal : voler le kill d\'un allié au dernier moment.'],
    ['Last hit', 'Donner le dernier coup à un sbire pour gagner son or.'],
    ['Leash', 'Aider le jungler sur son premier camp au début de la partie.'],
    ['Main', 'Ton champion (ou rôle) principal.'],
    ['Meta', 'Les champions et stratégies les plus efficaces du moment.'],
    ['MIA / SS', 'Missing In Action : un ennemi a disparu de sa voie. Préviens avec un ping !'],
    ['Nashor / Baron', 'Le plus gros monstre neutre, dans la rivière du haut (dès 20:00).'],
    ['OOM', 'Out Of Mana : plus de mana.'],
    ['One-shot', 'Tuer quelqu\'un en un seul enchaînement.'],
    ['Peel', 'Protéger un allié en repoussant ou immobilisant ceux qui l\'attaquent.'],
    ['Ping', 'Signal sur la carte (danger, en route, disparu…). Alt + clic.'],
    ['Pink', 'La balise de contrôle (rose), qui révèle les balises ennemies.'],
    ['Poke', 'Harceler l\'ennemi de loin avec des sorts sans s\'engager.'],
    ['Push', 'Faire avancer sa vague de sbires vers la tour adverse.'],
    ['Roam', 'Quitter sa voie pour aller aider ailleurs.'],
    ['Scaling', 'Un champion qui « scale » devient très fort en fin de partie.'],
    ['Skillshot', 'Un sort qu\'il faut viser (il peut rater).'],
    ['Smite', 'Châtiment : sort d\'invocateur obligatoire pour le jungler.'],
    ['Snowball', 'Prendre de l\'avance et l\'agrandir comme une boule de neige.'],
    ['Split push', 'Pousser seul une voie loin de son équipe pour forcer l\'adversaire à réagir.'],
    ['Sustain', 'Capacité à se soigner / rester longtemps sur la voie.'],
    ['Tank', 'Champion très résistant qui encaisse les coups pour l\'équipe.'],
    ['Teamfight', 'Combat à 5 contre 5.'],
    ['Tilt', 'Être énervé au point de mal jouer.'],
    ['TP', 'Téléportation : sort d\'invocateur pour rejoindre une tour ou un allié.'],
    ['Trade', 'Échanger des coups avec l\'adversaire de voie.'],
    ['Ult', 'Le sort ultime (touche R).'],
    ['Ward', 'Balise de vision posée au sol.'],
    ['Wave', 'Vague de sbires.'],
    ['Zone / Zoning', 'Empêcher l\'adversaire d\'approcher (des sbires, d\'un objectif) par la menace.'],
  ],

  tips: [
    'Regarde ta mini-carte toutes les 5 secondes : c\'est le réflexe n°1 des bons joueurs.',
    'Pas de vision sur le jungler ennemi ? Joue prudemment, il est peut-être juste à côté.',
    'Un ennemi disparaît de ta voie ? Fais un ping « disparu » pour prévenir tes alliés.',
    'Le last hit rapporte l\'or, pas les coups : attends que le sbire soit presque mort.',
    'Rentre acheter quand tu as de quoi finir un objet, pas quand tu as 4000 d\'or.',
    'Garde toujours une balise de contrôle (rose) dans ton inventaire.',
    'Après avoir tué ton adversaire de voie : pousse la vague, prends des plaques de tour ou rentre acheter.',
    'Ne te bats pas à 4 contre 5. Si un allié vient de mourir, on recule.',
    'Coupe le chat avec /mute all si l\'ambiance se dégrade : ta concentration vaut plus que le dernier mot.',
    'Joue toujours les mêmes 2 ou 3 champions : c\'est le chemin le plus rapide pour progresser.',
    'Le Saut éclair adverse est utilisé ? Note-le dans l\'onglet « Partie » et préviens ton équipe : c\'est le moment d\'attaquer.',
    'Les dragons se prennent quand l\'adversaire est loin ou mort. Vérifie le tableau des scores avec Tab.',
    'Utilise les objets « Recommandés » de la boutique tant que tu ne connais pas encore bien les objets.',
    'Tes sorts ont des temps de recharge : après avoir lancé ton sort principal, c\'est souvent le moment de reculer.',
    'L\'Outil d\'entraînement du jeu est parfait pour tester les combos de ton champion sans pression.',
  ],

  /* Timers d'objectifs (temps de réapparition en secondes). Repères : Riot peut les ajuster selon les patchs. */
  timers: [
    { id: 'drake', icon: '🐉', name: 'Dragon', respawn: 300 },
    { id: 'baron', icon: '👾', name: 'Baron Nashor', respawn: 360 },
    { id: 'elder', icon: '🔥', name: 'Dragon ancestral', respawn: 360 },
    { id: 'blueA', icon: '🔵', name: 'Bleu allié', respawn: 300 },
    { id: 'redA', icon: '🔴', name: 'Rouge allié', respawn: 300 },
    { id: 'blueE', icon: '🔷', name: 'Bleu ennemi', respawn: 300 },
    { id: 'redE', icon: '🟥', name: 'Rouge ennemi', respawn: 300 },
  ],
};
