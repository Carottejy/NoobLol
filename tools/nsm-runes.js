/* Ajoute à data/nooblol_builds_par_champion.md une page de runes optimisée pour CHAQUE build de CHAQUE champion.
   Méthode : chaque rune (patch actuel, runesReforged) est décrite par ses effets (dégâts en rafale, dégâts sur la durée,
   attaques de base, harcèlement, mobilité, engagement, résistance, soins aux alliés, mana, accélération, fin de partie…).
   Chaque build reçoit un profil de besoins calculé depuis le kit du champion, la catégorie du build, sa variante et
   les statistiques de ses 6 objets (dont l'équilibre du mana : besoin du kit face au mana apporté par les objets).
   Toutes les pages valides sont évaluées (rune clé + 1 rune par ligne, 2 runes secondaires de lignes différentes,
   3 fragments) et la meilleure est retenue.
   Utilisation : node tools/nsm-runes.js   (réécrit le fichier .md, puis lancer node tools/nsm-update.js) */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const MD = path.join(ROOT, 'data', 'nooblol_builds_par_champion.md');
const ITEMS = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'nsm-items.json'), 'utf8'));

/* ---------- Les runes : identifiant, nom français, ligne, et note selon le profil de besoins N ---------- */
const R = {};
function rune(id, tree, row, fr, score, why) { R[id] = { id, tree, row, fr, score, why }; }
const TREES = { 8000: 'Précision', 8100: 'Domination', 8200: 'Sorcellerie', 8300: 'Inspiration', 8400: 'Volonté' };
/* Précision */
rune(8005, 8000, 0, 'Attaque soutenue', (N) => N.aa * 2 + N.burst * 0.8 + N.lanebully * 0.8 - N.support * 1.5, 'gros dégâts après 3 coups, idéal pour les attaques de base en rafale');
rune(8008, 8000, 0, 'Tempo mortel', (N) => N.aa * 2.6 + N.asItems * 1.8 + N.dps * 0.8 - N.burst * 0.6 - N.support * 2, 'vitesse d\'attaque cumulée : multiplie les dégâts de tes objets d\'attaque');
rune(8021, 8000, 0, 'Jeu de jambes', (N) => N.aa * 1.4 + N.sustain * 1.6 + N.ranged * 0.4 + N.vsPoke * 0.6 - N.support * 1.5, 'soin et vitesse en attaquant : tenir la voie face au harcèlement');
rune(8010, 8000, 0, 'Conquérant', (N) => N.dps * 2.2 + N.aa * 0.8 + N.fighter * 1.0 + N.melee * 0.8 * Math.min(1, N.dps + N.aa) + N.selfheal * 0.8 + N.often * 0.4 - N.burst * 0.6 - N.support * 2 - N.poke * 0.8 - N.tanky * 0.5, 'force qui monte en combat long, puis soins sur tes dégâts');
rune(9101, 8000, 1, 'Absorption vitale', (N) => N.sustain * 1.2 + N.melee * 0.4 + N.jungle * 0.4, 'soins à chaque élimination');
rune(9111, 8000, 1, 'Triomphe', (N) => 0.9 + N.fighter * 0.6 + N.burst * 0.4 + N.melee * 0.3 - N.support * 0.6, 'soins et or sur les éliminations');
rune(8009, 8000, 1, 'Présence d\'esprit', (N) => N.manaDeficit * 2.4 + N.energy * 1.5 + N.aa * 0.5 + N.often * 0.4, 'rend du mana ou de l\'énergie en combat : ne plus tomber à sec');
rune(9104, 8000, 2, 'Légende : alacrité', (N) => N.aa * 1.6 + N.asItems * 1.0, 'vitesse d\'attaque permanente');
rune(9105, 8000, 2, 'Légende : accélération', (N) => N.haste * 1.6 + N.often * 0.8, 'accélération des compétences permanente');
rune(9103, 8000, 2, 'Légende : sangsue', (N) => N.aa * 0.8 + N.long * 1.4 + N.lifesteal * 1.0 + N.sustain * 0.4, 'vol de vie qui monte en fin de partie');
rune(8014, 8000, 3, 'Coup de grâce', (N) => N.burst * 1.2 + N.ranged * 0.5 + N.aa * 0.4 + 0.2, 'plus de dégâts sur les cibles basses en vie');
rune(8017, 8000, 3, 'Abattage', (N) => N.vsTank * 3 + N.dps * 0.6 + N.aa * 0.4, 'plus de dégâts sur les cibles à beaucoup de PV');
rune(8299, 8000, 3, 'Baroud d\'honneur', (N) => N.melee * 0.9 + N.fighter * 0.9 + N.selfheal * 0.4, 'plus de dégâts quand tu es bas en vie');
/* Domination */
rune(8112, 8100, 0, 'Électrocution', (N) => N.burst * 3 + N.lethality * 1.2 + N.poke * 0.3 - N.aa * 0.8 - N.dps * 0.6 - N.support * 0.6, 'pic de dégâts sur ton combo');
rune(8128, 8100, 0, 'Moisson noire', (N) => N.burst * 1.8 + N.jungle * 1.0 + N.snowball * 1.2 + N.lethality * 0.6 - N.support * 1.5, 'achève les cibles basses et grandit à chaque âme');
rune(9923, 8100, 0, 'Déluge de lames', (N) => N.aa * 1.2 + N.burst * 1.2 + N.engage * 0.6 * N.adSup + N.lethality * 0.5 - N.dps * 0.8, 'rafale d\'attaques en début de combat');
rune(8126, 8100, 1, 'Coup bas', (N) => N.cc * 1.4 + N.engage * 0.6, 'dégâts bruts sur les cibles immobilisées');
rune(8139, 8100, 1, 'Goût du sang', (N) => N.lanebully * 0.6 + N.sustain * 0.8 + N.burst * 0.4 + 0.3, 'soins en touchant un champion');
rune(8143, 8100, 1, 'Ruée offensive', (N) => N.mobility * 2 + N.lethality * 0.8, 'dégâts bruts après une ruée ou un saut');
rune(8137, 8100, 2, 'Sixième sens', (N) => N.support * 0.9 + N.jungle * 0.6 + 0.2, 'repère les balises ennemies');
rune(8140, 8100, 2, 'Souvenirs épouvantables', (N) => 0.6 + N.burst * 0.3 + N.roam * 0.4, 'balise plus souvent grâce aux éliminations');
rune(8141, 8100, 2, 'Balise de profondeur', (N) => N.jungle * 0.8 + N.support * 0.8, 'balises plus solides dans la jungle ennemie');
rune(8135, 8100, 3, 'Chasseur de trésors', (N) => N.snowball * 2 + N.burst * 0.5 + 0.4, 'or bonus sur les éliminations');
rune(8105, 8100, 3, 'Chasseur acharné', (N) => N.roam * 1.6 + N.jungle * 0.6 + N.support * 0.6, 'vitesse hors combat pour rôder');
rune(8106, 8100, 3, 'Chasseur ultime', (N) => N.ult * 2.2, 'ultime disponible plus souvent');
/* Sorcellerie */
rune(8214, 8200, 0, 'Invocation d\'Aery', (N) => N.allies * 2.2 + N.poke * 1.0 + N.support * 1.0 + N.often * 0.4 + N.ranged * 0.4 - N.melee * 1.0, 'dégâts de harcèlement ou boucliers sur tes alliés');
rune(8229, 8200, 0, 'Comète arcanique', (N) => N.poke * 2.8 + N.mage * 0.8 + N.cc * 0.4 + N.ranged * 0.6 - N.aa * 1.0 - N.melee * 1.0, 'comète sur chaque sort qui touche : harcèlement à distance');
rune(8230, 8200, 0, 'Assaut du maraudeur', (N) => N.mobility * 1.6 + N.dps * 0.6 + N.kite * 1.0 + N.mage * 0.3, 'vitesse en rafale pour entrer ou fuir après ton combo');
rune(8992, 8200, 0, 'Toucher de feu mortel', (N) => N.dps * 1.6 + N.aoe * 1.0 + N.mage * 1.0 + N.often * 0.6 - N.aa * 1.0, 'brûlure sur chaque sort : idéal pour les dégâts sur la durée');
rune(8224, 8200, 1, 'Arcaniste axiomatique', (N) => N.ult * 1.6 + N.mage * 0.4, 'ultime plus fort et rechargé sur les éliminations');
rune(8226, 8200, 1, 'Ruban de mana', (N) => N.manaDeficit * 2.6 + N.mana * 0.4 + N.poke * 0.6 + N.often * 0.4, 'jusqu\'à 250 mana en plus puis régénération : ne plus tomber à sec');
rune(8275, 8200, 1, 'Manteau nuageux', (N) => N.mobility * 0.8 + N.kite * 0.8 + 0.2, 'vitesse après tes sorts d\'invocateur');
rune(8210, 8200, 2, 'Transcendance', (N) => N.haste * 1.4 + N.often * 0.8 + N.mage * 0.3, 'accélération des compétences, recharge sur les éliminations');
rune(8234, 8200, 2, 'Célérité', (N) => N.mobility * 1.0 + N.engage * 0.8 + N.roam * 0.4, 'bonus de vitesse plus efficaces');
rune(8233, 8200, 2, 'Concentration absolue', (N) => N.poke * 1.4 + N.ranged * 0.6 + N.mage * 0.3, 'dégâts en plus tant que tu es en bonne santé');
rune(8237, 8200, 3, 'Brûlure', (N) => N.poke * 1.2 + N.lane * 0.6 + N.support * 0.6 + 0.2, 'brûlure en début de partie sur ton premier sort');
rune(8232, 8200, 3, 'Marche sur l\'eau', (N) => N.jungle * 1.2 + N.roam * 0.8, 'vitesse et dégâts dans la rivière');
rune(8236, 8200, 3, 'Tempête menaçante', (N) => N.long * 2.0 + N.mage * 0.5 + N.scaling * 0.6, 'dégâts qui augmentent à chaque minute');
/* Volonté */
rune(8437, 8400, 0, 'Poigne de l\'immortel', (N) => N.tanky * 2.2 + N.melee * 1.2 + N.top * 1.0 + N.aa * 0.4 - N.jungle * 2 - N.support * 1.2 - N.burst * 0.6, 'échanges courts gagnants et PV permanents');
rune(8439, 8400, 0, 'Après-coup', (N) => N.engage * 2.6 + N.tanky * 1.4 + N.cc * 0.6 - N.burst * 0.4, 'très résistant après ton engagement, puis explosion de dégâts');
rune(8465, 8400, 0, 'Gardien', (N) => N.allies * 1.6 + N.support * 1.2 + N.peel * 1.0, 'bouclier sur l\'allié que tu protèges');
rune(8446, 8400, 1, 'Démolition', (N) => N.split * 2.2 + N.top * 0.6 + N.tanky * 0.3, 'tours détruites plus vite');
rune(8463, 8400, 1, 'Fontaine de vie', (N) => N.cc * 1.2 + N.support * 0.8 + N.engage * 0.6, 'soigne tes alliés quand tu immobilises');
rune(8401, 8400, 1, 'Coup de bouclier', (N) => N.shieldSelf * 1.6 + N.allies * 0.4, 'dégâts en plus après un bouclier');
rune(8429, 8400, 2, 'Conditionnement', (N) => N.tanky * 1.0 + N.long * 0.8 + N.jungle * 0.4, 'armure et résistance après 12 minutes');
rune(8444, 8400, 2, 'Second souffle', (N) => N.lane * N.melee * 1.2 + N.vsAP * 1.6 + N.vsPoke * 1.0 + N.sustain * 0.6, 'soins après avoir subi des dégâts : contre le harcèlement');
rune(8473, 8400, 2, 'Plaque d\'os', (N) => N.vsBurstAD * 2.2 + N.melee * 0.6 + N.engage * 0.4, 'réduit le burst des combos adverses');
rune(8451, 8400, 3, 'Surcroissance', (N) => N.tanky * 1.6 + N.scaling * 0.6, 'PV permanents qui grandissent');
rune(8453, 8400, 3, 'Revitalisation', (N) => N.allies * 1.8 + N.selfheal * 1.0, 'soins et boucliers plus puissants');
rune(8242, 8400, 3, 'Inébranlable', (N) => N.melee * 0.8 + N.engage * 0.8 + N.vsBurstAD * 0.4 + N.vsAP * 0.4, 'résistances en plus quand tu es contrôlé');
/* Inspiration */
rune(8351, 8300, 0, 'Optimisation glaciale', (N) => N.engage * 1.4 + N.cc * 1.2 + N.support * 0.6 - N.burst * 0.6, 'ralentit et affaiblit après tes contrôles');
rune(8360, 8300, 0, 'Grimoire déchaîné', () => 0.3, 'change de sorts d\'invocateur');
rune(8369, 8300, 0, 'Premier coup', (N) => N.poke * 1.4 + N.burst * 1.0 + N.ranged * 0.5 + N.snowball * 0.4 - N.support * 0.8, 'dégâts et or quand tu ouvres l\'échange');
rune(8306, 8300, 1, 'Canaliportation Hextech', (N) => N.engage * 1.2 + N.tanky * 0.4, 'second Saut éclair pour engager');
rune(8304, 8300, 1, 'Chaussures magiques', (N) => 0.6 + N.ranged * 0.4 - N.jungle * 0.6 - N.melee * 0.2, 'bottes gratuites, or économisé');
rune(8321, 8300, 1, 'Remise immédiate', (N) => 0.5 + N.expensive * 0.8, 'or rendu sur les objets légendaires');
rune(8313, 8300, 2, 'Triple tonique', (N) => 0.5 + N.snowball * 0.6 + N.lanebully * 0.4, 'élixirs gratuits aux niveaux 3, 6, 9');
rune(8352, 8300, 2, 'Philtre de chronodistorsion', (N) => 0.4 + N.lane * 0.3, 'potions plus efficaces');
rune(8345, 8300, 2, 'Livraison de biscuits', (N) => 0.6 + N.lane * 0.4 + N.manaDeficit * 1.0 + N.support * 0.3, 'biscuits : PV permanents et mana rendu en voie');
rune(8347, 8300, 3, 'Savoir cosmique', (N) => 0.8 + N.haste * 0.4, 'sorts d\'invocateur et objets rechargés plus vite');
rune(8410, 8300, 3, 'Vitesse d\'approche', (N) => N.engage * 1.4 + N.cc * 0.8 + N.melee * 0.4, 'vitesse vers les cibles que tu immobilises');
rune(8316, 8300, 3, 'Polyvalence', (N) => N.diverse * 1.4, 'accélération et force selon la variété de tes statistiques');

const SHARDS = { 5008: 'Force adaptative', 5005: 'Vitesse d\'attaque', 5007: 'Accélération de compétence', 5010: 'Vitesse de déplacement', 5001: 'PV selon le niveau', 5011: 'PV', 5013: 'Ténacité' };
const SHARD_ROWS = [[5008, 5005, 5007], [5008, 5010, 5001], [5011, 5013, 5001]];

/* ---------- Profil de besoins d'un build ---------- */
function needs(ch, b) {
  const k = (w) => ch.kit.some((x) => x.includes(w)) ? 1 : 0;
  const cat = b.cat, v = b.variant;
  const st = {}; b.items.forEach((n, i) => { const s = (ITEMS[n] || {}).stats || {}; const w = i < 4 ? 1 : 0.6; Object.keys(s).forEach((x) => { st[x] = (st[x] || 0) + s[x] * w; }); });
  const jungle = /\(jungle\)/.test(cat) ? 1 : 0, support = /^Support/.test(cat) ? 1 : 0;
  const lanes = b.lanes || [];
  const N = {
    burst: (/burst|létalité/.test(cat) ? 1 : 0) * 0.8 + k('burst') * 0.5,
    lethality: /létalité/.test(cat) ? 1 : Math.min(1, (st.leth || 0) / 40),
    dps: (/continu|Combattant/.test(cat) ? 0.8 : 0) + k('dégâts sur la durée') * 0.5,
    aa: k('dépend des attaques de base') * 0.7 + (/critique|impact/.test(cat) ? 0.6 : 0) + k('attaques entre les sorts') * 0.3,
    asItems: Math.min(1, (st.as || 0) / 90), crit: Math.min(1, (st.crit || 0) / 50),
    poke: k('poke à longue portée') * 1 + (v === 'Poke' ? 0.8 : 0),
    mobility: k('très mobile'), engage: k('engage et contrôles') * 0.8 + (v === 'Engagement' ? 0.5 : 0) + (/engage/.test(cat) ? 0.6 : 0),
    cc: k('engage et contrôles') * 0.7, tanky: k('naturellement résistant') * 0.6 + (/^Tank/.test(cat) ? 1 : 0) + Math.min(0.6, ((st.hp || 0) / 2500 + (st.arm || 0) / 200 + (st.mr || 0) / 200) * 0.4),
    selfheal: k('soins sur soi'), allies: k('soins / boucliers aux alliés') * 0.8 + (/enchanteur/.test(cat) ? 1 : 0), often: k('sorts fréquents'),
    ult: k('ultime décisif'), aoe: k('dégâts de zone'), haste: Math.min(1, (st.ah || 0) / 60) + (v === 'Accélération' ? 0.8 : 0) + k('sorts fréquents') * 0.3,
    melee: ch.range === 'M' ? 1 : 0, ranged: ch.range === 'R' ? 1 : 0, jungle, support, top: lanes.includes('top') && !jungle && !support ? 1 : 0,
    lane: jungle ? 0 : 1, roam: (jungle || support) ? 0.6 : 0.2 + k('très mobile') * 0.3,
    mage: /AP/.test(cat) ? 1 : 0, fighter: /^Combattant/.test(cat) ? 1 : 0, adSup: /Support dégâts AD/.test(cat) ? 1 : 0,
    peel: support && !/engage/.test(cat) ? 0.6 : 0, kite: ch.range === 'R' && k('très mobile') ? 0.6 : 0,
    lanebully: !jungle && !support ? 0.4 : 0, lifesteal: Math.min(1, (st.ls || 0) / 15),
    shieldSelf: 0, split: v === 'Split push' ? 1 : 0, scaling: v === 'Partie longue' ? 1 : 0.3,
    snowball: v === 'Boule de neige' ? 1 : 0, long: v === 'Partie longue' ? 1 : 0, sustain: v === 'Sustain' ? 1 : (lanes.includes('top') && ch.range === 'M' ? 0.3 : 0),
    vsBurstAD: /^Contre AD/.test(v) ? 1 : 0, vsAP: v === 'Contre AP' ? 1 : 0, vsTank: v === 'Contre tanks' ? 1 : 0, vsPoke: v === 'Contre AP' ? 0.3 : 0,
    energy: ch.res === 'ENERGY' ? 1 : 0, mana: ch.res === 'MANA' ? 1 : 0,
    expensive: b.cost >= 17000 ? 1 : 0, diverse: Object.keys(st).length >= 9 ? 1 : 0,
  };
  /* Mana : besoin du kit face au mana apporté par les objets (les 3 premiers comptent le plus) */
  const manaNeed = ch.res !== 'MANA' ? 0 : k('gros besoin de mana') ? 1 : k('sorts fréquents') ? 0.55 : 0.3;
  let supply = 0; b.items.slice(0, 3).forEach((n) => { const s = (ITEMS[n] || {}).stats || {}; supply += (s.mana || 0) / 600 + (s.mp5 || 0) / 100; });
  N.manaNeed = manaNeed; N.manaSupply = supply;
  /* au-delà d'un petit manque normal (géré avec les potions et le retour à la base) */
  N.manaDeficit = Math.max(0, manaNeed - supply * 0.7 - 0.25);
  return N;
}

/* ---------- Meilleure page ---------- */
function best(ch, b) {
  const N = needs(ch, b);
  const sc = (id) => R[id].score(N);
  const byTree = {};
  Object.values(R).forEach((r) => { (byTree[r.tree] = byTree[r.tree] || [[], [], [], []])[r.row].push(r.id); });
  let top = null;
  for (const pt of Object.keys(byTree).map(Number)) {
    const rows = byTree[pt];
    const pick = rows.map((ids) => ids.slice().sort((a, c) => sc(c) - sc(a))[0]);
    const priScore = sc(pick[0]) * 2.2 + sc(pick[1]) + sc(pick[2]) + sc(pick[3]);
    /* une seule rune de mana suffit le plus souvent : la voie secondaire est notée avec le manque restant */
    const hasMana = pick.some((id) => id === 8226 || id === 8009 || id === 8345);
    const N2 = Object.assign({}, N, { manaDeficit: hasMana ? Math.max(0, N.manaDeficit - 0.5) : N.manaDeficit });
    const sc2 = (id) => R[id].score(N2);
    for (const st of Object.keys(byTree).map(Number)) {
      if (st === pt) continue;
      const cand = [];
      for (let r1 = 1; r1 <= 3; r1++) for (let r2 = r1 + 1; r2 <= 3; r2++) {
        const a = byTree[st][r1].slice().sort((x, y) => sc2(y) - sc2(x))[0], c = byTree[st][r2].slice().sort((x, y) => sc2(y) - sc2(x))[0];
        cand.push([a, c, sc2(a) + sc2(c)]);
      }
      cand.sort((x, y) => y[2] - x[2]);
      const total = priScore + cand[0][2] * 0.85;
      if (!top || total > top.total) top = { total, pri: pick, pt, st, sec: cand[0].slice(0, 2) };
    }
  }
  /* Fragments */
  const o = N.aa + N.asItems > 1.1 ? 5005 : N.haste >= 0.9 || N.allies > 0.5 || (N.engage > 0.9 && N.support) ? 5007 : 5008;
  const f = N.tanky >= 1.2 || (N.engage > 0.9 && N.support) ? 5001 : N.kite > 0 && N.poke > 0 ? 5010 : 5008;
  const d = N.long || N.tanky >= 1.2 ? 5001 : 5011;
  const why = [`${R[top.pri[0]].fr} : ${R[top.pri[0]].why}`];
  const mr = [top.pri[1], ...top.sec].find((id) => id === 8226 || id === 8009 || id === 8345);
  if (N.manaDeficit >= 0.3) why.push(mr ? `mana : ${R[mr].fr} compense un build qui en apporte peu` : 'mana : build pauvre en mana, joue économe (sorts sur les cibles utiles)');
  const keyMinor = [top.pri[3], ...top.sec].map((id) => R[id]).filter((r) => r.score(N) >= 1.5).slice(0, 1);
  keyMinor.forEach((r) => why.push(`${r.fr} : ${r.why}`));
  return { pt: top.pt, pri: top.pri, st: top.st, sec: top.sec, sh: [o, f, d], why: why.join(' · '), N };
}

/* ---------- Lecture du fichier, ajout des tableaux « Runes par build » ---------- */
const LANE = { Top: 'top', Jungle: 'jungle', Mid: 'mid', ADC: 'adc', Support: 'support' };
let text = fs.readFileSync(MD, 'utf8');
/* idempotent : on retire les anciens tableaux de runes et la section d'explication */
text = text.replace(/\n\*\*Runes par build\*\*[\s\S]*?(?=\n\*\*Corrections en jeu\*\*)/g, '\n');
text = text.replace(/\n## 0\. Runes : comment elles ont été choisies[\s\S]*?(?=\n## )/, '\n');
const lines = text.split('\n');
const out = [];
let ch = null, builds = [], stats = { n: 0, mana: 0 };
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  let m = l.match(/^### (.+)$/);
  if (m && !/^\d/.test(m[1])) { ch = { name: m[1].trim(), kit: [], range: 'M', res: 'MANA' }; builds = []; }
  if (ch) {
    m = l.match(/^- \*\*Rôles\*\* : (.+)$/);
    if (m) { ch.res = /sans mana/.test(m[1]) ? 'NONE' : /énergie/.test(m[1]) ? 'ENERGY' : 'MANA'; ch.range = /distance/.test(m[1]) ? 'R' : 'M'; }
    m = l.match(/^- \*\*Kit\*\* : (.+?)\.?$/);
    if (m) ch.kit = m[1].split(/,\s*/);
    m = l.match(/^\| (\d+) \| (.+?) \| (.+?) \| (.+?) \| (.+?) \| (\d+) \|$/);
    if (m) builds.push({ n: +m[1], cat: m[2].trim(), lanes: m[3].split(/,\s*/).map((x) => LANE[x.trim()]), variant: m[4].trim(), items: m[5].split(' → ').map((x) => x.trim()), cost: +m[6] });
    if (/^\*\*Corrections en jeu\*\*/.test(l) && builds.length) {
      out.push('**Runes par build** (une page optimisée pour chaque build ; code : voie principale:runes|voie secondaire:runes|fragments)', '');
      out.push('| # | Build | Rune clé | Principale | Secondaire | Fragments | Pourquoi | Code |', '|---|---|---|---|---|---|---|---|');
      builds.forEach((b) => {
        const p = best(ch, b);
        stats.n++; if (p.N.manaDeficit >= 0.3) stats.mana++;
        out.push(`| ${b.n} | ${b.variant} | ${R[p.pri[0]].fr} | ${TREES[p.pt]} : ${p.pri.slice(1).map((id) => R[id].fr).join(', ')} | ${TREES[p.st]} : ${p.sec.map((id) => R[id].fr).join(', ')} | ${p.sh.map((s) => SHARDS[s]).join(', ')} | ${p.why} | \`${p.pt}:${p.pri.join(',')}|${p.st}:${p.sec.join(',')}|${p.sh.join(',')}\` |`);
      });
      out.push('');
    }
  }
  out.push(l);
}
/* Section d'explication, avant la première section numérotée après le titre */
const doc = out.join('\n');
const idx = doc.indexOf('\n## ');
const expl = `
## 0. Runes : comment elles ont été choisies

Chaque build de chaque champion a sa page de runes (tableau « Runes par build » de la fiche, même numéro et même nom que le build).

- **Effets des runes** : chaque rune du patch actuel est décrite par ce qu'elle apporte (rafale de dégâts, dégâts sur la durée, attaques de base, harcèlement, mobilité, engagement, résistance, soins et boucliers aux alliés, mana, accélération, or, fin de partie).
- **Besoins du build** : calculés depuis le kit du champion, la catégorie du build, sa variante (Contre AD / assassins → Plaque d'os, Contre AP → Second souffle, Contre tanks → Abattage, Boule de neige → Chasseur de trésors, Partie longue → Tempête menaçante…) et les statistiques de ses 6 objets.
- **Mana** : le besoin en mana du kit (« gros besoin de mana », « sorts fréquents ») est comparé au mana apporté par les 3 premiers objets. S'il manque du mana, les runes qui en rendent (Ruban de mana, Présence d'esprit, Livraison de biscuits) passent devant, pour ne pas tomber à sec ; sinon la colonne « Pourquoi » conseille de jouer économe.
- **Choix** : toutes les pages valides sont comparées (rune clé, une rune par ligne, 2 runes secondaires de lignes différentes, 3 fragments) et la meilleure est retenue.
- **Pour l'appli** : la colonne « Code » donne les identifiants Riot (voie principale:4 runes | voie secondaire:2 runes | 3 fragments), prêts à être appliqués dans le client.

Ce sont des runes théoriques, cohérentes avec les objets et le kit, mais pas validées par des taux de victoire.
`;
fs.writeFileSync(MD, idx > 0 ? doc.slice(0, idx) + '\n' + expl + doc.slice(idx) : doc + expl);
console.log(`Runes : ${stats.n} pages écrites, dont ${stats.mana} builds où le mana manque (runes de mana privilégiées).`);
