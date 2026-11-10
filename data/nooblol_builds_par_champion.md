# Nooblol – 10 builds par champion (173 champions) et corrections en jeu

> **À lire par l'IA de Nooblol avant tout.** Pour chaque champion, ce fichier donne :
> 1. une **analyse de son kit** (ce qui le rend fort, ce sur quoi ses sorts montent) ;
> 2. **10 builds complets** répartis entre les catégories où ce champion est réellement pertinent (Dégâts, Combattant, Tank, Support enchanteur / engage / dégâts, Jungle), chacun rattaché aux voies où il se joue ;
> 3. des **corrections en jeu** propres à ce champion : adversaire AD / AP / assassin / tank très feed, soins, boucliers, contrôles, en avance, en retard.
>
> **Méthode.** Le kit de chaque champion est codé en 20 caractéristiques notées de 0 à 3, d'après l'analyse de ses compétences (ratios AP / AD, sorts qui montent avec les PV ou l'armure, dépendance aux attaques de base, effets à l'impact, critique, fréquence des sorts, mana, burst, dégâts sur la durée, zone, soins, boucliers aux alliés, engage, mobilité, ultime, résistance, poke). Un moteur de score croise ces caractéristiques avec les stats et les effets de chaque objet (110 objets du patch actuel), selon la catégorie et la situation visée, puis choisit le meilleur ensemble en respectant les règles du jeu. Aucun build n'est copié depuis un site de statistiques.
>
> **Garanties.** Les 1 730 builds respectent les groupes d'objets exclusifs (un seul objet par groupe, par exemple un seul objet Lame magique), une seule paire de bottes, un seul objet de support, pas d'objet « mana » pour un champion sans mana, pas de bottes pour Cassiopeia (vérification automatique).
>
> **Limites.** Ce sont des builds théoriques issus d'un modèle : ils sont cohérents avec le kit, mais pas validés par des statistiques de victoire. Les caractéristiques des champions sont à revalider après les gros patchs (surtout Locke, Zaahen, Yunara, Mel). Objets : LoL Wiki (Module:ItemData/data), consulté le 09/11/2026.

## 1. Mode d'emploi pour Nooblol

### 1.1 Au moment de la sélection

1. Lire la fiche du champion choisi.
2. Ne garder que les builds dont la colonne « Voies » contient la voie du joueur.
3. Les présenter **par catégorie**, par exemple « Dégâts », « Combattant » ou « Support ». Dans chaque catégorie, le build **Standard** est le choix par défaut.
4. Si la composition adverse est déjà connue, mettre en avant le build dont la variante correspond à la situation principale (section 1.3).

### 1.2 Pendant la partie

- Recalculer les situations à chaque achat (section 1.3), à partir des champions adverses, de leurs éliminations et de leurs objets.
- Si une situation forte apparaît, appliquer la **correction** de la fiche du champion : objet à acheter **en priorité au prochain retour**, et objet à remplacer.
- Ne jamais faire plus de 2 changements par rapport au build choisi, pour garder sa cohérence. Ne jamais casser une règle d'exclusivité.

### 1.3 Situations et définitions

```yaml
adversaire_tres_feed:   ≥ 3 éliminations d'avance sur sa mort la plus récente, OU 1 objet légendaire d'avance sur la moyenne de la partie, OU ≥ 2 000 or d'avance
  → acheter la correction correspondant à SON type (AD, AP, assassin, tank) AVANT le prochain objet offensif
  → si l'adversaire feed est dans votre voie : jouer prudemment sous la tour jusqu'à l'achat de la correction
vs_ad:          ≥ 3 adversaires AD, ou un adversaire AD très feed     → variante « Contre AD / assassins »
vs_ap:          ≥ 3 adversaires AP, ou un adversaire AP très feed     → variante « Contre AP »
vs_assassin:    un assassin adverse (Zed, Talon, Kha'Zix, Fizz, Akali, Evelynn, Katarina, LeBlanc, Qiyana, Naafiri, Rengar, Locke…) → correction « Assassin »
vs_tanks:       ≥ 2 tanks adverses, ou un tank très feed             → variante « Contre tanks »
vs_heal:        ≥ 2 champions qui se soignent, ou un soigneur feed (Soraka, Aatrox, Vladimir, Warwick, Dr. Mundo, Sylas, Swain, Yuumi, Briar…) → variante « Anti-soins » ou correction « Soins »
vs_shields:     ≥ 2 champions à boucliers (Lulu, Janna, Karma, Sett, Seraphine, Milio, Renata…) → Serpent's Fang (champions AD)
vs_cc:          ≥ 3 contrôles durs, ou une suppression (Malzahar, Warwick, Skarner, Urgot) → Mercury's Treads / Mercurial Scimitar / Sterak's Gage
en_avance:      écart d'or ≥ +1 500 (voie ou équipe) → variante « Boule de neige », sinon correction « En avance »
en_retard:      écart d'or ≤ −1 500 → correction « En retard » : objets abordables et résistants, composants défensifs d'abord
partie_longue:  > 30 min ou équipe qui monte mieux en puissance → variante « Partie longue »
priorité: [adversaire_tres_feed, vs_cc (suppression), vs_heal, vs_assassin, vs_ap, vs_ad, vs_tanks, vs_shields, en_retard, en_avance]
```

### 1.4 Lecture des fiches

- **Catégorie** : Dégâts (avec le type : AP burst, AP continu, AD critique, AD létalité, à l'impact), Combattant, Tank, Support enchanteur, Support engage, Support dégâts. « (jungle) » = build pour la jungle (ajouter le familier de jungle comme objet de départ).
- **Build** = variante : Standard, Contre tanks, Contre AD / assassins, Contre AP, Boule de neige, Accélération, Partie longue, Sustain, Poke, Engagement, Split push, Anti-soins, Alternative (même catégorie, sans l'objet indiqué, utile si l'adversaire le contre ou s'il est déjà pris dans l'équipe).
- **Objets** : dans l'ordre d'achat. Pour un support, l'objet de support (amélioration de la quête Bounty of Worlds) vient en premier, puis les bottes. Les noms sont les **noms anglais officiels** (identiques aux données Riot).
- **Coût** : total des objets (l'objet de support est gratuit via la quête).
- **Objets de départ conseillés** : mage → Doran's Ring ; combattant ou duelliste → Doran's Blade, ou Doran's Shield contre un adversaire à distance ; tank → Doran's Shield ; tireur → Doran's Blade ; support → objet de quête de support ; jungle → familier de jungle.

## 2. Fiches des champions

### Aatrox

- **Rôles** : Top · dégâts physiques · sans mana · mêlée
- **Kit** : sorts fréquents (accélération rentable), soins sur soi, burst, dégâts sur la durée, dégâts de zone.
- **Répartition des 10 builds** : Combattant (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant | Top | Standard | Mercury's Treads → Spear of Shojin → Death's Dance → Stridebreaker → Sundered Sky → Black Cleaver | 17050 |
| 2 | Combattant | Top | Contre AD / assassins | Plated Steelcaps → Spear of Shojin → Death's Dance → Randuin's Omen → Guardian Angel → Sterak's Gage | 16700 |
| 3 | Combattant | Top | Contre AP | Mercury's Treads → Spear of Shojin → Spirit Visage → Death's Dance → Maw of Malmortius → Kaenic Rookern | 16350 |
| 4 | Combattant | Top | Contre tanks | Mercury's Treads → Spear of Shojin → Black Cleaver → Death's Dance → Titanic Hydra → Sundered Sky | 17050 |
| 5 | Combattant | Top | Sustain | Mercury's Treads → Spear of Shojin → Death's Dance → Sundered Sky → Spirit Visage → Sterak's Gage | 16650 |
| 6 | Combattant | Top | Anti-soins | Mercury's Treads → Chempunk Chainsword → Spear of Shojin → Death's Dance → Stridebreaker → Sundered Sky | 17150 |
| 7 | Combattant | Top | Alternative (sans Spear of Shojin) | Mercury's Treads → Stridebreaker → Death's Dance → Sundered Sky → Black Cleaver → Sterak's Gage | 17150 |
| 8 | Combattant | Top | Alternative (sans Death's Dance) | Mercury's Treads → Spear of Shojin → Stridebreaker → Sundered Sky → Black Cleaver → Sterak's Gage | 16950 |
| 9 | Combattant | Top | Alternative (sans Sundered Sky) | Mercury's Treads → Spear of Shojin → Death's Dance → Stridebreaker → Black Cleaver → Sterak's Gage | 17150 |
| 10 | Combattant | Top | Alternative (sans Spear of Shojin, Death's Dance) | Mercury's Treads → Stridebreaker → Sundered Sky → Black Cleaver → Sterak's Gage → Spirit Visage | 16550 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Randuin's Omen** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Spirit Visage** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Titanic Hydra** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Titanic Hydra** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Ahri

- **Rôles** : Mid · dégâts magiques · mana · distance
- **Kit** : burst, très mobile, sorts fréquents (accélération rentable), gros besoin de mana, ultime décisif.
- **Répartition des 10 builds** : Dégâts AP burst (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP burst | Mid | Standard | Sorcerer's Shoes → Luden's Companion → Rabadon's Deathcap → Void Staff → Shadowflame → Stormsurge | 16350 |
| 2 | Dégâts AP burst | Mid | Contre tanks | Ionian Boots of Lucidity → Luden's Companion → Horizon Focus → Rabadon's Deathcap → Void Staff → Malignance | 15600 |
| 3 | Dégâts AP burst | Mid | Contre AD / assassins | Plated Steelcaps → Shadowflame → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Luden's Companion | 16900 |
| 4 | Dégâts AP burst | Mid | Contre AP | Mercury's Treads → Shadowflame → Banshee's Veil → Rabadon's Deathcap → Void Staff → Luden's Companion | 16700 |
| 5 | Dégâts AP burst | Mid | Partie longue | Sorcerer's Shoes → Archangel's Staff → Luden's Companion → Rabadon's Deathcap → Void Staff → Shadowflame | 16450 |
| 6 | Dégâts AP burst | Mid | Anti-soins | Sorcerer's Shoes → Shadowflame → Morellonomicon → Rabadon's Deathcap → Void Staff → Luden's Companion | 16400 |
| 7 | Dégâts AP burst | Mid | Alternative (sans Luden's Companion) | Sorcerer's Shoes → Shadowflame → Rabadon's Deathcap → Void Staff → Stormsurge → Horizon Focus | 16350 |
| 8 | Dégâts AP burst | Mid | Alternative (sans Rabadon's Deathcap) | Sorcerer's Shoes → Luden's Companion → Shadowflame → Void Staff → Stormsurge → Horizon Focus | 15600 |
| 9 | Dégâts AP burst | Mid | Alternative (sans Void Staff) | Sorcerer's Shoes → Luden's Companion → Shadowflame → Rabadon's Deathcap → Stormsurge → Horizon Focus | 16100 |
| 10 | Dégâts AP burst | Mid | Alternative (sans Shadowflame) | Sorcerer's Shoes → Luden's Companion → Rabadon's Deathcap → Void Staff → Stormsurge → Horizon Focus | 15900 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Horizon Focus** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Horizon Focus** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Akali

- **Rôles** : Mid, Top · dégâts mixtes · énergie · mêlée
- **Kit** : burst, très mobile, attaques entre les sorts, ultime décisif.
- **Répartition des 10 builds** : Dégâts AP burst (8), Combattant (2)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP burst | Mid, Top | Standard | Sorcerer's Shoes → Shadowflame → Rabadon's Deathcap → Void Staff → Stormsurge → Lich Bane | 16500 |
| 2 | Dégâts AP burst | Mid, Top | Contre tanks | Mercury's Treads → Lich Bane → Rabadon's Deathcap → Void Staff → Shadowflame → Horizon Focus | 16600 |
| 3 | Dégâts AP burst | Mid, Top | Contre AD / assassins | Plated Steelcaps → Shadowflame → Zhonya's Hourglass → Guardian Angel → Rabadon's Deathcap → Void Staff | 17350 |
| 4 | Dégâts AP burst | Mid, Top | Contre AP | Mercury's Treads → Shadowflame → Banshee's Veil → Rabadon's Deathcap → Void Staff → Stormsurge | 16750 |
| 5 | Dégâts AP burst | Mid, Top | Anti-soins | Sorcerer's Shoes → Shadowflame → Morellonomicon → Rabadon's Deathcap → Void Staff → Stormsurge | 16450 |
| 6 | Combattant | Mid, Top | Standard | Mercury's Treads → Shadowflame → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Banshee's Veil | 17200 |
| 7 | Combattant | Mid, Top | Contre AD / assassins | Plated Steelcaps → Zhonya's Hourglass → Randuin's Omen → Thornmail → Rabadon's Deathcap → Void Staff | 16100 |
| 8 | Dégâts AP burst | Mid, Top | Alternative (sans Shadowflame) | Sorcerer's Shoes → Stormsurge → Rabadon's Deathcap → Void Staff → Lich Bane → Horizon Focus | 16050 |
| 9 | Dégâts AP burst | Mid, Top | Alternative (sans Rabadon's Deathcap) | Sorcerer's Shoes → Shadowflame → Stormsurge → Void Staff → Lich Bane → Horizon Focus | 15750 |
| 10 | Dégâts AP burst | Mid, Top | Alternative (sans Void Staff) | Sorcerer's Shoes → Shadowflame → Stormsurge → Rabadon's Deathcap → Lich Bane → Cryptbloom | 16500 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Horizon Focus** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Horizon Focus** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Akshan

- **Rôles** : Mid, Top · dégâts physiques · mana · distance
- **Kit** : dépend des attaques de base, synergie coup critique, burst, très mobile.
- **Répartition des 10 builds** : Dégâts AD critique (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD critique | Mid, Top | Standard | Berserker's Greaves → Yun Tal Wildarrows → Kraken Slayer → Infinity Edge → Lord Dominik's Regards → Bloodthirster | 17050 |
| 2 | Dégâts AD critique | Mid, Top | Contre tanks | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Kraken Slayer → Lord Dominik's Regards → Blade of the Ruined King | 16850 |
| 3 | Dégâts AD critique | Mid, Top | Contre AD / assassins | Plated Steelcaps → Yun Tal Wildarrows → Guardian Angel → Death's Dance → Kraken Slayer → Infinity Edge | 17150 |
| 4 | Dégâts AD critique | Mid, Top | Contre AP | Berserker's Greaves → Yun Tal Wildarrows → Mercurial Scimitar → Kraken Slayer → Infinity Edge → Lord Dominik's Regards | 16850 |
| 5 | Dégâts AD critique | Mid, Top | Boule de neige | Berserker's Greaves → Yun Tal Wildarrows → The Collector → Infinity Edge → Kraken Slayer → Lord Dominik's Regards | 16650 |
| 6 | Dégâts AD critique | Mid, Top | Anti-soins | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Mortal Reminder → Kraken Slayer → Bloodthirster | 17250 |
| 7 | Dégâts AD critique | Mid, Top | Alternative (sans Yun Tal Wildarrows) | Berserker's Greaves → Kraken Slayer → Infinity Edge → Lord Dominik's Regards → Bloodthirster → Phantom Dancer | 16700 |
| 8 | Dégâts AD critique | Mid, Top | Alternative (sans Kraken Slayer) | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Bloodthirster → Phantom Dancer | 16700 |
| 9 | Dégâts AD critique | Mid, Top | Alternative (sans Infinity Edge) | Berserker's Greaves → Yun Tal Wildarrows → Kraken Slayer → Lord Dominik's Regards → Bloodthirster → Phantom Dancer | 16250 |
| 10 | Dégâts AD critique | Mid, Top | Alternative (sans Yun Tal Wildarrows, Kraken Slayer) | Berserker's Greaves → Essence Reaver → Infinity Edge → Bloodthirster → Lord Dominik's Regards → Phantom Dancer | 16600 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Guardian Angel (AD) / Maw of Malmortius ou Mercurial Scimitar (AP).
- **Tank** feed / 2 tanks ou plus : **Blade of the Ruined King** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Mortal Reminder** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Mercurial Scimitar.
- **En avance** : finir l'objet offensif principal, puis **The Collector** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Alistar

- **Rôles** : Support · dégâts magiques · mana · mêlée
- **Kit** : engage et contrôles, naturellement résistant, sorts fréquents (accélération rentable), soins / boucliers aux alliés, ultime décisif.
- **Répartition des 10 builds** : Support engage (7), Support enchanteur (3)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Support engage | Support | Standard | Celestial Opposition → Mercury's Treads → Zeke's Convergence → Locket of the Iron Solari → Vigilant Wardstone → Randuin's Omen | 10650 |
| 2 | Support engage | Support | Engagement | Solstice Sleigh → Mercury's Treads → Zeke's Convergence → Locket of the Iron Solari → Trailblazer → Vigilant Wardstone | 10350 |
| 3 | Support engage | Support | Contre AD / assassins | Celestial Opposition → Plated Steelcaps → Randuin's Omen → Frozen Heart → Thornmail → Zeke's Convergence | 11050 |
| 4 | Support engage | Support | Contre AP | Celestial Opposition → Mercury's Treads → Zeke's Convergence → Locket of the Iron Solari → Kaenic Rookern → Vigilant Wardstone | 10850 |
| 5 | Support engage | Support | Anti-soins | Celestial Opposition → Mercury's Treads → Thornmail → Zeke's Convergence → Locket of the Iron Solari → Vigilant Wardstone | 10400 |
| 6 | Support enchanteur | Support | Standard | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Locket of the Iron Solari → Ardent Censer → Redemption | 9900 |
| 7 | Support enchanteur | Support | Contre AD / assassins | Celestial Opposition → Plated Steelcaps → Frozen Heart → Locket of the Iron Solari → Mikael's Blessing → Zeke's Convergence | 10400 |
| 8 | Support enchanteur | Support | Accélération | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Locket of the Iron Solari → Redemption → Vigilant Wardstone | 10000 |
| 9 | Support engage | Support | Alternative (sans Zeke's Convergence) | Celestial Opposition → Mercury's Treads → Locket of the Iron Solari → Vigilant Wardstone → Randuin's Omen → Frozen Heart | 10950 |
| 10 | Support engage | Support | Alternative (sans Locket of the Iron Solari) | Celestial Opposition → Mercury's Treads → Zeke's Convergence → Vigilant Wardstone → Randuin's Omen → Frozen Heart | 10950 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Frozen Heart** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : protéger le carry visé (Knight's Vow, Locket of the Iron Solari) ; pour vous : Frozen Heart.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Thornmail** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : poser plus de balises de contrôle, jouer pour les objectifs ; objet d'équipe suivant : **Trailblazer**.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Frozen Heart**.

### Ambessa

- **Rôles** : Top, Jungle · dégâts physiques · énergie · mêlée
- **Kit** : sorts fréquents (accélération rentable), très mobile, burst, dégâts sur la durée, ultime décisif.
- **Répartition des 10 builds** : Dégâts AD (5), Combattant (3), Combattant (jungle) (2)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD | Top | Standard | Ionian Boots of Lucidity → Serylda's Grudge → Axiom Arc → Death's Dance → Spear of Shojin → Bloodthirster | 16450 |
| 2 | Dégâts AD | Top | Contre tanks | Ionian Boots of Lucidity → Serylda's Grudge → Death's Dance → Spear of Shojin → Bloodthirster → Maw of Malmortius | 16800 |
| 3 | Dégâts AD | Top | Contre AD / assassins | Plated Steelcaps → Bloodthirster → Death's Dance → Guardian Angel → Maw of Malmortius → Randuin's Omen | 16900 |
| 4 | Dégâts AD | Top | Contre AP | Mercury's Treads → Edge of Night → Maw of Malmortius → Serylda's Grudge → Mercurial Scimitar → Axiom Arc | 16300 |
| 5 | Dégâts AD | Top | Boule de neige | Ionian Boots of Lucidity → Hubris → Axiom Arc → Opportunity → Serylda's Grudge → Profane Hydra | 15200 |
| 6 | Combattant | Top | Standard | Mercury's Treads → Stridebreaker → Death's Dance → Spear of Shojin → Maw of Malmortius → Black Cleaver | 17050 |
| 7 | Combattant | Top | Contre AD / assassins | Plated Steelcaps → Spear of Shojin → Death's Dance → Randuin's Omen → Guardian Angel → Sterak's Gage | 16700 |
| 8 | Combattant | Top | Contre AP | Mercury's Treads → Spear of Shojin → Maw of Malmortius → Death's Dance → Kaenic Rookern → Jak'Sho, The Protean | 16850 |
| 9 | Combattant (jungle) | Jungle | Contre AP | Mercury's Treads → Spear of Shojin → Maw of Malmortius → Death's Dance → Kaenic Rookern → Spirit Visage | 16350 |
| 10 | Combattant (jungle) | Jungle | Contre tanks | Mercury's Treads → Serylda's Grudge → Death's Dance → Spear of Shojin → Maw of Malmortius → Titanic Hydra | 17050 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Maw of Malmortius** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Hubris** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Amumu

- **Rôles** : Jungle, Support · dégâts magiques · mana · mêlée
- **Kit** : dégâts de zone, engage et contrôles, ultime décisif, naturellement résistant, sorts fréquents (accélération rentable).
- **Répartition des 10 builds** : Tank (jungle) (6), Support engage (4)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Tank (jungle) | Jungle | Standard | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Sunfire Aegis → Abyssal Mask | 15900 |
| 2 | Tank (jungle) | Jungle | Contre AD / assassins | Plated Steelcaps → Randuin's Omen → Frozen Heart → Jak'Sho, The Protean → Heartsteel → Warmog's Armor | 15700 |
| 3 | Tank (jungle) | Jungle | Contre AP | Mercury's Treads → Jak'Sho, The Protean → Heartsteel → Warmog's Armor → Abyssal Mask → Kaenic Rookern | 16100 |
| 4 | Tank (jungle) | Jungle | Engagement | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Dead Man's Plate → Zeke's Convergence | 15650 |
| 5 | Tank (jungle) | Jungle | Anti-soins | Mercury's Treads → Heartsteel → Thornmail → Jak'Sho, The Protean → Warmog's Armor → Sunfire Aegis | 15700 |
| 6 | Support engage | Support | Standard | Celestial Opposition → Mercury's Treads → Zeke's Convergence → Locket of the Iron Solari → Vigilant Wardstone → Randuin's Omen | 10650 |
| 7 | Support engage | Support | Engagement | Solstice Sleigh → Mercury's Treads → Zeke's Convergence → Locket of the Iron Solari → Trailblazer → Vigilant Wardstone | 10350 |
| 8 | Support engage | Support | Contre AD / assassins | Celestial Opposition → Plated Steelcaps → Randuin's Omen → Frozen Heart → Thornmail → Zeke's Convergence | 11050 |
| 9 | Support engage | Support | Contre AP | Celestial Opposition → Mercury's Treads → Zeke's Convergence → Kaenic Rookern → Abyssal Mask → Locket of the Iron Solari | 11200 |
| 10 | Tank (jungle) | Jungle | Alternative (sans Heartsteel) | Mercury's Treads → Jak'Sho, The Protean → Sunfire Aegis → Abyssal Mask → Unending Despair → Warmog's Armor | 15700 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Randuin's Omen** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : protéger le carry visé (Knight's Vow, Locket of the Iron Solari) ; pour vous : Randuin's Omen.
- **Tank** feed / 2 tanks ou plus : **Randuin's Omen** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Thornmail** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : poser plus de balises de contrôle, jouer pour les objectifs ; objet d'équipe suivant : **Dead Man's Plate**.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Anivia

- **Rôles** : Mid, Support · dégâts magiques · mana · distance
- **Kit** : gros besoin de mana, dégâts sur la durée, dégâts de zone, sorts fréquents (accélération rentable), engage et contrôles.
- **Répartition des 10 builds** : Dégâts AP continu (6), Support dégâts AP continu (4)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP continu | Mid | Standard | Sorcerer's Shoes → Archangel's Staff → Blackfire Torch → Rabadon's Deathcap → Void Staff → Malignance | 16000 |
| 2 | Dégâts AP continu | Mid | Contre tanks | Ionian Boots of Lucidity → Archangel's Staff → Blackfire Torch → Rabadon's Deathcap → Void Staff → Malignance | 15800 |
| 3 | Dégâts AP continu | Mid | Contre AD / assassins | Plated Steelcaps → Archangel's Staff → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Blackfire Torch | 16650 |
| 4 | Dégâts AP continu | Mid | Contre AP | Mercury's Treads → Archangel's Staff → Banshee's Veil → Rabadon's Deathcap → Void Staff → Blackfire Torch | 16450 |
| 5 | Dégâts AP continu | Mid | Accélération | Ionian Boots of Lucidity → Archangel's Staff → Blackfire Torch → Rabadon's Deathcap → Horizon Focus → Malignance | 15550 |
| 6 | Dégâts AP continu | Mid | Anti-soins | Sorcerer's Shoes → Archangel's Staff → Morellonomicon → Rabadon's Deathcap → Void Staff → Blackfire Torch | 16150 |
| 7 | Support dégâts AP continu | Support | Standard | Zaz'Zak's Realmspike → Sorcerer's Shoes → Archangel's Staff → Blackfire Torch → Rabadon's Deathcap → Malignance | 13000 |
| 8 | Support dégâts AP continu | Support | Contre AD / assassins | Zaz'Zak's Realmspike → Plated Steelcaps → Malignance → Zhonya's Hourglass → Blackfire Torch → Rabadon's Deathcap | 13450 |
| 9 | Support dégâts AP continu | Support | Contre AP | Zaz'Zak's Realmspike → Mercury's Treads → Malignance → Banshee's Veil → Blackfire Torch → Rabadon's Deathcap | 13250 |
| 10 | Support dégâts AP continu | Support | Accélération | Zaz'Zak's Realmspike → Ionian Boots of Lucidity → Archangel's Staff → Blackfire Torch → Rabadon's Deathcap → Malignance | 12800 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Liandry's Torment** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Horizon Focus** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Annie

- **Rôles** : Mid, Support · dégâts magiques · mana · distance
- **Kit** : burst, ultime décisif, sorts fréquents (accélération rentable), dégâts de zone, engage et contrôles.
- **Répartition des 10 builds** : Dégâts AP burst (6), Support dégâts AP burst (4)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP burst | Mid | Standard | Sorcerer's Shoes → Shadowflame → Rabadon's Deathcap → Void Staff → Malignance → Luden's Companion | 16250 |
| 2 | Dégâts AP burst | Mid | Contre tanks | Ionian Boots of Lucidity → Malignance → Rabadon's Deathcap → Void Staff → Horizon Focus → Luden's Companion | 15600 |
| 3 | Dégâts AP burst | Mid | Contre AD / assassins | Plated Steelcaps → Shadowflame → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Malignance | 16850 |
| 4 | Dégâts AP burst | Mid | Contre AP | Mercury's Treads → Shadowflame → Banshee's Veil → Rabadon's Deathcap → Void Staff → Malignance | 16650 |
| 5 | Dégâts AP burst | Mid | Boule de neige | Sorcerer's Shoes → Shadowflame → Stormsurge → Rabadon's Deathcap → Luden's Companion → Void Staff | 16350 |
| 6 | Dégâts AP burst | Mid | Accélération | Ionian Boots of Lucidity → Malignance → Rabadon's Deathcap → Void Staff → Shadowflame → Luden's Companion | 16050 |
| 7 | Support dégâts AP burst | Support | Standard | Zaz'Zak's Realmspike → Sorcerer's Shoes → Malignance → Rabadon's Deathcap → Void Staff → Luden's Companion | 13050 |
| 8 | Support dégâts AP burst | Support | Contre AD / assassins | Zaz'Zak's Realmspike → Plated Steelcaps → Malignance → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff | 13650 |
| 9 | Support dégâts AP burst | Support | Contre AP | Zaz'Zak's Realmspike → Mercury's Treads → Malignance → Banshee's Veil → Rabadon's Deathcap → Void Staff | 13450 |
| 10 | Support dégâts AP burst | Support | Boule de neige | Zaz'Zak's Realmspike → Sorcerer's Shoes → Stormsurge → Shadowflame → Rabadon's Deathcap → Luden's Companion | 13350 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Horizon Focus** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Stormsurge** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Aphelios

- **Rôles** : ADC · dégâts physiques · mana · distance
- **Kit** : dépend des attaques de base, synergie coup critique, dégâts de zone, ultime décisif.
- **Répartition des 10 builds** : Dégâts AD critique (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD critique | ADC | Standard | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Kraken Slayer → Bloodthirster | 17050 |
| 2 | Dégâts AD critique | ADC | Contre AD / assassins | Plated Steelcaps → Yun Tal Wildarrows → Guardian Angel → Death's Dance → Infinity Edge → Lord Dominik's Regards | 17250 |
| 3 | Dégâts AD critique | ADC | Contre AP | Berserker's Greaves → Yun Tal Wildarrows → Mercurial Scimitar → Infinity Edge → Lord Dominik's Regards → Kraken Slayer | 16850 |
| 4 | Dégâts AD critique | ADC | Boule de neige | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Kraken Slayer → The Collector | 16650 |
| 5 | Dégâts AD critique | ADC | Anti-soins | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Mortal Reminder → Kraken Slayer → Bloodthirster | 17250 |
| 6 | Dégâts AD critique | ADC | Alternative (sans Yun Tal Wildarrows) | Berserker's Greaves → Essence Reaver → Infinity Edge → Kraken Slayer → Lord Dominik's Regards → Bloodthirster | 16950 |
| 7 | Dégâts AD critique | ADC | Alternative (sans Infinity Edge) | Berserker's Greaves → Yun Tal Wildarrows → Kraken Slayer → Lord Dominik's Regards → Bloodthirster → Essence Reaver | 16500 |
| 8 | Dégâts AD critique | ADC | Alternative (sans Kraken Slayer) | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Bloodthirster → Essence Reaver | 16950 |
| 9 | Dégâts AD critique | ADC | Alternative (sans Yun Tal Wildarrows, Infinity Edge) | Berserker's Greaves → Kraken Slayer → Bloodthirster → Lord Dominik's Regards → Essence Reaver → Statikk Shiv | 16200 |
| 10 | Dégâts AD critique | ADC | Alternative (sans Infinity Edge, Lord Dominik's Regards) | Berserker's Greaves → Yun Tal Wildarrows → Kraken Slayer → Mortal Reminder → Bloodthirster → Essence Reaver | 16700 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Guardian Angel (AD) / Maw of Malmortius ou Mercurial Scimitar (AP).
- **Tank** feed / 2 tanks ou plus : **Blade of the Ruined King** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Mortal Reminder** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Mercurial Scimitar.
- **En avance** : finir l'objet offensif principal, puis **The Collector** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Ashe

- **Rôles** : ADC, Support · dégâts physiques · mana · distance
- **Kit** : dépend des attaques de base, synergie coup critique, engage et contrôles, ultime décisif, poke à longue portée.
- **Répartition des 10 builds** : Dégâts AD critique (6), Support dégâts AD critique (4)
- **Particularité** : Support possible : profil ADC_CASTER avec objet de support (Zaz'Zak).

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD critique | ADC | Standard | Berserker's Greaves → Yun Tal Wildarrows → Kraken Slayer → Infinity Edge → Lord Dominik's Regards → Bloodthirster | 17050 |
| 2 | Dégâts AD critique | ADC | Contre tanks | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Kraken Slayer → Lord Dominik's Regards → Blade of the Ruined King | 16850 |
| 3 | Dégâts AD critique | ADC | Contre AD / assassins | Plated Steelcaps → Yun Tal Wildarrows → Guardian Angel → Death's Dance → Kraken Slayer → Infinity Edge | 17150 |
| 4 | Dégâts AD critique | ADC | Contre AP | Berserker's Greaves → Yun Tal Wildarrows → Mercurial Scimitar → Kraken Slayer → Infinity Edge → Lord Dominik's Regards | 16850 |
| 5 | Dégâts AD critique | ADC | Boule de neige | Berserker's Greaves → Yun Tal Wildarrows → Kraken Slayer → Infinity Edge → Lord Dominik's Regards → The Collector | 16650 |
| 6 | Dégâts AD critique | ADC | Poke | Berserker's Greaves → Yun Tal Wildarrows → Kraken Slayer → Infinity Edge → Lord Dominik's Regards → Essence Reaver | 16550 |
| 7 | Support dégâts AD critique | Support | Standard | Bloodsong → Berserker's Greaves → Yun Tal Wildarrows → Kraken Slayer → Phantom Dancer → Infinity Edge | 13200 |
| 8 | Support dégâts AD critique | Support | Contre AD / assassins | Bloodsong → Plated Steelcaps → Yun Tal Wildarrows → Guardian Angel → Death's Dance → Kraken Slayer | 13700 |
| 9 | Support dégâts AD critique | Support | Contre AP | Bloodsong → Berserker's Greaves → Yun Tal Wildarrows → Mercurial Scimitar → Kraken Slayer → Maw of Malmortius | 13400 |
| 10 | Support dégâts AD critique | Support | Anti-soins | Bloodsong → Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Mortal Reminder → Kraken Slayer | 13850 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Guardian Angel (AD) / Maw of Malmortius ou Mercurial Scimitar (AP).
- **Tank** feed / 2 tanks ou plus : **Blade of the Ruined King** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Mortal Reminder** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Mercurial Scimitar.
- **En avance** : finir l'objet offensif principal, puis **The Collector** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Aurelion Sol

- **Rôles** : Mid · dégâts magiques · mana · distance
- **Kit** : gros besoin de mana, dégâts sur la durée, dégâts de zone, sorts fréquents (accélération rentable), ultime décisif.
- **Répartition des 10 builds** : Dégâts AP continu (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP continu | Mid | Standard | Sorcerer's Shoes → Archangel's Staff → Blackfire Torch → Rabadon's Deathcap → Void Staff → Malignance | 16000 |
| 2 | Dégâts AP continu | Mid | Contre tanks | Ionian Boots of Lucidity → Archangel's Staff → Blackfire Torch → Rabadon's Deathcap → Void Staff → Malignance | 15800 |
| 3 | Dégâts AP continu | Mid | Contre AD / assassins | Plated Steelcaps → Archangel's Staff → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Blackfire Torch | 16650 |
| 4 | Dégâts AP continu | Mid | Contre AP | Mercury's Treads → Archangel's Staff → Banshee's Veil → Rabadon's Deathcap → Void Staff → Blackfire Torch | 16450 |
| 5 | Dégâts AP continu | Mid | Accélération | Ionian Boots of Lucidity → Archangel's Staff → Blackfire Torch → Rabadon's Deathcap → Horizon Focus → Malignance | 15550 |
| 6 | Dégâts AP continu | Mid | Anti-soins | Sorcerer's Shoes → Archangel's Staff → Morellonomicon → Rabadon's Deathcap → Void Staff → Blackfire Torch | 16150 |
| 7 | Dégâts AP continu | Mid | Alternative (sans Archangel's Staff) | Sorcerer's Shoes → Malignance → Blackfire Torch → Rabadon's Deathcap → Void Staff → Horizon Focus | 15850 |
| 8 | Dégâts AP continu | Mid | Alternative (sans Blackfire Torch) | Sorcerer's Shoes → Archangel's Staff → Malignance → Rabadon's Deathcap → Void Staff → Horizon Focus | 15950 |
| 9 | Dégâts AP continu | Mid | Alternative (sans Rabadon's Deathcap) | Sorcerer's Shoes → Archangel's Staff → Blackfire Torch → Void Staff → Horizon Focus → Malignance | 15250 |
| 10 | Dégâts AP continu | Mid | Alternative (sans Void Staff) | Sorcerer's Shoes → Archangel's Staff → Blackfire Torch → Rabadon's Deathcap → Horizon Focus → Malignance | 15750 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Liandry's Torment** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Horizon Focus** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Aurora

- **Rôles** : Mid, Top · dégâts magiques · mana · distance
- **Kit** : burst, très mobile, sorts fréquents (accélération rentable), dégâts de zone, ultime décisif.
- **Répartition des 10 builds** : Dégâts AP burst (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP burst | Mid, Top | Standard | Sorcerer's Shoes → Shadowflame → Rabadon's Deathcap → Void Staff → Luden's Companion → Stormsurge | 16350 |
| 2 | Dégâts AP burst | Mid, Top | Contre tanks | Ionian Boots of Lucidity → Malignance → Rabadon's Deathcap → Void Staff → Horizon Focus → Luden's Companion | 15600 |
| 3 | Dégâts AP burst | Mid, Top | Contre AD / assassins | Plated Steelcaps → Shadowflame → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Luden's Companion | 16900 |
| 4 | Dégâts AP burst | Mid, Top | Contre AP | Mercury's Treads → Shadowflame → Banshee's Veil → Rabadon's Deathcap → Void Staff → Luden's Companion | 16700 |
| 5 | Dégâts AP burst | Mid, Top | Accélération | Ionian Boots of Lucidity → Shadowflame → Rabadon's Deathcap → Void Staff → Luden's Companion → Malignance | 16050 |
| 6 | Dégâts AP burst | Mid, Top | Anti-soins | Sorcerer's Shoes → Shadowflame → Morellonomicon → Rabadon's Deathcap → Void Staff → Luden's Companion | 16400 |
| 7 | Dégâts AP burst | Mid, Top | Alternative (sans Shadowflame) | Sorcerer's Shoes → Luden's Companion → Rabadon's Deathcap → Void Staff → Stormsurge → Malignance | 15850 |
| 8 | Dégâts AP burst | Mid, Top | Alternative (sans Rabadon's Deathcap) | Sorcerer's Shoes → Shadowflame → Luden's Companion → Void Staff → Stormsurge → Malignance | 15550 |
| 9 | Dégâts AP burst | Mid, Top | Alternative (sans Void Staff) | Sorcerer's Shoes → Shadowflame → Luden's Companion → Rabadon's Deathcap → Stormsurge → Cryptbloom | 16350 |
| 10 | Dégâts AP burst | Mid, Top | Alternative (sans Luden's Companion) | Sorcerer's Shoes → Shadowflame → Rabadon's Deathcap → Void Staff → Stormsurge → Malignance | 16300 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Malignance** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Malignance** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Azir

- **Rôles** : Mid · dégâts magiques · mana · distance
- **Kit** : dégâts sur la durée, dépend des attaques de base, effets à l'impact, sorts fréquents (accélération rentable), gros besoin de mana.
- **Répartition des 10 builds** : Dégâts à l'impact (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts à l'impact | Mid | Standard | Berserker's Greaves → Nashor's Tooth → Rabadon's Deathcap → Void Staff → Horizon Focus → Blackfire Torch | 16050 |
| 2 | Dégâts à l'impact | Mid | Contre tanks | Berserker's Greaves → Nashor's Tooth → Rabadon's Deathcap → Void Staff → Liandry's Torment → Horizon Focus | 16250 |
| 3 | Dégâts à l'impact | Mid | Contre AD / assassins | Plated Steelcaps → Nashor's Tooth → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Horizon Focus | 16600 |
| 4 | Dégâts à l'impact | Mid | Contre AP | Mercury's Treads → Nashor's Tooth → Banshee's Veil → Rabadon's Deathcap → Void Staff → Horizon Focus | 16400 |
| 5 | Dégâts à l'impact | Mid | Partie longue | Berserker's Greaves → Archangel's Staff → Nashor's Tooth → Rabadon's Deathcap → Void Staff → Horizon Focus | 16150 |
| 6 | Dégâts à l'impact | Mid | Anti-soins | Berserker's Greaves → Nashor's Tooth → Morellonomicon → Rabadon's Deathcap → Void Staff → Horizon Focus | 16100 |
| 7 | Dégâts à l'impact | Mid | Alternative (sans Nashor's Tooth) | Berserker's Greaves → Malignance → Horizon Focus → Rabadon's Deathcap → Void Staff → Blackfire Torch | 15850 |
| 8 | Dégâts à l'impact | Mid | Alternative (sans Rabadon's Deathcap) | Berserker's Greaves → Nashor's Tooth → Horizon Focus → Void Staff → Blackfire Torch → Malignance | 15250 |
| 9 | Dégâts à l'impact | Mid | Alternative (sans Void Staff) | Berserker's Greaves → Nashor's Tooth → Horizon Focus → Rabadon's Deathcap → Blackfire Torch → Malignance | 15750 |
| 10 | Dégâts à l'impact | Mid | Alternative (sans Horizon Focus) | Berserker's Greaves → Nashor's Tooth → Rabadon's Deathcap → Void Staff → Blackfire Torch → Malignance | 16000 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Liandry's Torment** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Malignance** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Bard

- **Rôles** : Support · dégâts magiques · mana · distance
- **Kit** : engage et contrôles, sorts fréquents (accélération rentable), soins / boucliers aux alliés, très mobile, ultime décisif.
- **Répartition des 10 builds** : Support dégâts AP burst (7), Support enchanteur (3)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Support dégâts AP burst | Support | Standard | Zaz'Zak's Realmspike → Ionian Boots of Lucidity → Malignance → Horizon Focus → Rabadon's Deathcap → Void Staff | 12850 |
| 2 | Support dégâts AP burst | Support | Contre AD / assassins | Zaz'Zak's Realmspike → Plated Steelcaps → Zhonya's Hourglass → Horizon Focus → Thornmail → Randuin's Omen | 12350 |
| 3 | Support dégâts AP burst | Support | Contre AP | Zaz'Zak's Realmspike → Mercury's Treads → Banshee's Veil → Horizon Focus → Kaenic Rookern → Vigilant Wardstone | 12200 |
| 4 | Support dégâts AP burst | Support | Accélération | Zaz'Zak's Realmspike → Ionian Boots of Lucidity → Cryptbloom → Horizon Focus → Malignance → Rabadon's Deathcap | 12850 |
| 5 | Support dégâts AP burst | Support | Anti-soins | Zaz'Zak's Realmspike → Ionian Boots of Lucidity → Malignance → Morellonomicon → Horizon Focus → Rabadon's Deathcap | 12700 |
| 6 | Support enchanteur | Support | Standard | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Ardent Censer → Locket of the Iron Solari → Staff of Flowing Water | 9850 |
| 7 | Support enchanteur | Support | Contre AD / assassins | Celestial Opposition → Plated Steelcaps → Frozen Heart → Locket of the Iron Solari → Zeke's Convergence → Mikael's Blessing | 10400 |
| 8 | Support enchanteur | Support | Accélération | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Locket of the Iron Solari → Staff of Flowing Water → Redemption | 9950 |
| 9 | Support dégâts AP burst | Support | Alternative (sans Malignance) | Zaz'Zak's Realmspike → Ionian Boots of Lucidity → Shurelya's Battlesong → Horizon Focus → Rabadon's Deathcap → Void Staff | 12350 |
| 10 | Support dégâts AP burst | Support | Alternative (sans Horizon Focus) | Zaz'Zak's Realmspike → Ionian Boots of Lucidity → Malignance → Rabadon's Deathcap → Void Staff → Shurelya's Battlesong | 12300 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : protéger le carry visé (Knight's Vow, Locket of the Iron Solari) ; pour vous : Zhonya's Hourglass.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : poser plus de balises de contrôle, jouer pour les objectifs ; objet d'équipe suivant : **Zeke's Convergence**.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Thornmail**.

### Bel'Veth

- **Rôles** : Jungle · dégâts physiques · sans mana · mêlée
- **Kit** : dépend des attaques de base, effets à l'impact, dégâts sur la durée, très mobile, soins sur soi.
- **Répartition des 10 builds** : Combattant (jungle) (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant (jungle) | Jungle | Standard | Mercury's Treads → Stridebreaker → Wit's End → Death's Dance → Kraken Slayer → Experimental Hexplate | 16650 |
| 2 | Combattant (jungle) | Jungle | Contre AD / assassins | Plated Steelcaps → Stridebreaker → Randuin's Omen → Death's Dance → Thornmail → Wit's End | 15750 |
| 3 | Combattant (jungle) | Jungle | Contre AP | Mercury's Treads → Stridebreaker → Wit's End → Kaenic Rookern → Spirit Visage → Death's Dance | 16250 |
| 4 | Combattant (jungle) | Jungle | Contre tanks | Mercury's Treads → Stridebreaker → Blade of the Ruined King → Wit's End → Kraken Slayer → Death's Dance | 16850 |
| 5 | Combattant (jungle) | Jungle | Sustain | Mercury's Treads → Stridebreaker → Death's Dance → Spirit Visage → Sundered Sky → Sterak's Gage | 16850 |
| 6 | Combattant (jungle) | Jungle | Anti-soins | Mercury's Treads → Chempunk Chainsword → Stridebreaker → Wit's End → Death's Dance → Kraken Slayer | 16750 |
| 7 | Combattant (jungle) | Jungle | Alternative (sans Stridebreaker) | Mercury's Treads → Kraken Slayer → Wit's End → Death's Dance → Experimental Hexplate → Blade of the Ruined King | 16550 |
| 8 | Combattant (jungle) | Jungle | Alternative (sans Wit's End) | Mercury's Treads → Stridebreaker → Death's Dance → Kraken Slayer → Experimental Hexplate → Blade of the Ruined King | 17050 |
| 9 | Combattant (jungle) | Jungle | Alternative (sans Death's Dance) | Mercury's Treads → Stridebreaker → Wit's End → Kraken Slayer → Experimental Hexplate → Sterak's Gage | 16550 |
| 10 | Combattant (jungle) | Jungle | Alternative (sans Kraken Slayer) | Mercury's Treads → Stridebreaker → Wit's End → Death's Dance → Experimental Hexplate → Blade of the Ruined King | 16850 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Randuin's Omen** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Blade of the Ruined King** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Blade of the Ruined King** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Blitzcrank

- **Rôles** : Support · dégâts magiques · mana · mêlée
- **Kit** : engage et contrôles, sorts fréquents (accélération rentable), naturellement résistant.
- **Répartition des 10 builds** : Support engage (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Support engage | Support | Standard | Celestial Opposition → Mercury's Treads → Zeke's Convergence → Locket of the Iron Solari → Vigilant Wardstone → Randuin's Omen | 10650 |
| 2 | Support engage | Support | Engagement | Solstice Sleigh → Mercury's Treads → Zeke's Convergence → Locket of the Iron Solari → Trailblazer → Vigilant Wardstone | 10350 |
| 3 | Support engage | Support | Contre AD / assassins | Celestial Opposition → Plated Steelcaps → Frozen Heart → Randuin's Omen → Thornmail → Zeke's Convergence | 11050 |
| 4 | Support engage | Support | Contre AP | Celestial Opposition → Mercury's Treads → Zeke's Convergence → Kaenic Rookern → Locket of the Iron Solari → Vigilant Wardstone | 10850 |
| 5 | Support engage | Support | Anti-soins | Celestial Opposition → Mercury's Treads → Thornmail → Zeke's Convergence → Locket of the Iron Solari → Vigilant Wardstone | 10400 |
| 6 | Support engage | Support | Alternative (sans Zeke's Convergence) | Celestial Opposition → Mercury's Treads → Locket of the Iron Solari → Vigilant Wardstone → Randuin's Omen → Frozen Heart | 10950 |
| 7 | Support engage | Support | Alternative (sans Locket of the Iron Solari) | Celestial Opposition → Mercury's Treads → Zeke's Convergence → Vigilant Wardstone → Randuin's Omen → Frozen Heart | 10950 |
| 8 | Support engage | Support | Alternative (sans Vigilant Wardstone) | Celestial Opposition → Mercury's Treads → Zeke's Convergence → Locket of the Iron Solari → Randuin's Omen → Frozen Heart | 10850 |
| 9 | Support engage | Support | Alternative (sans Randuin's Omen) | Celestial Opposition → Mercury's Treads → Zeke's Convergence → Locket of the Iron Solari → Vigilant Wardstone → Frozen Heart | 10450 |
| 10 | Support engage | Support | Alternative (sans Zeke's Convergence, Locket of the Iron Solari) | Celestial Opposition → Mercury's Treads → Vigilant Wardstone → Randuin's Omen → Frozen Heart → Abyssal Mask | 11400 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Frozen Heart** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : protéger le carry visé (Knight's Vow, Locket of the Iron Solari) ; pour vous : Frozen Heart.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Thornmail** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : poser plus de balises de contrôle, jouer pour les objectifs ; objet d'équipe suivant : **Trailblazer**.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Frozen Heart**.

### Brand

- **Rôles** : Support, Mid, Jungle · dégâts magiques · mana · distance
- **Kit** : dégâts sur la durée, dégâts de zone, sorts fréquents (accélération rentable), gros besoin de mana, burst.
- **Répartition des 10 builds** : Dégâts AP continu (3), Dégâts AP continu (jungle) (2), Support dégâts AP continu (5)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP continu | Mid | Standard | Sorcerer's Shoes → Luden's Companion → Blackfire Torch → Rabadon's Deathcap → Void Staff → Horizon Focus | 15900 |
| 2 | Dégâts AP continu | Mid | Contre tanks | Ionian Boots of Lucidity → Blackfire Torch → Liandry's Torment → Rabadon's Deathcap → Void Staff → Horizon Focus | 15950 |
| 3 | Dégâts AP continu | Mid | Contre AD / assassins | Plated Steelcaps → Blackfire Torch → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Horizon Focus | 16500 |
| 4 | Dégâts AP continu (jungle) | Jungle | Contre AP | Mercury's Treads → Blackfire Torch → Banshee's Veil → Rabadon's Deathcap → Void Staff → Horizon Focus | 16300 |
| 5 | Dégâts AP continu (jungle) | Jungle | Boule de neige | Sorcerer's Shoes → Shadowflame → Stormsurge → Rabadon's Deathcap → Void Staff → Blackfire Torch | 16400 |
| 6 | Support dégâts AP continu | Support | Standard | Zaz'Zak's Realmspike → Sorcerer's Shoes → Blackfire Torch → Horizon Focus → Rabadon's Deathcap → Void Staff | 13150 |
| 7 | Support dégâts AP continu | Support | Contre AD / assassins | Zaz'Zak's Realmspike → Plated Steelcaps → Blackfire Torch → Zhonya's Hourglass → Rabadon's Deathcap → Horizon Focus | 13500 |
| 8 | Support dégâts AP continu | Support | Contre AP | Zaz'Zak's Realmspike → Mercury's Treads → Blackfire Torch → Banshee's Veil → Rabadon's Deathcap → Horizon Focus | 13300 |
| 9 | Support dégâts AP continu | Support | Boule de neige | Zaz'Zak's Realmspike → Sorcerer's Shoes → Stormsurge → Luden's Companion → Rabadon's Deathcap → Blackfire Torch | 12950 |
| 10 | Support dégâts AP continu | Support | Accélération | Zaz'Zak's Realmspike → Ionian Boots of Lucidity → Luden's Companion → Horizon Focus → Blackfire Torch → Rabadon's Deathcap | 12700 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Liandry's Torment** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Shadowflame** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Braum

- **Rôles** : Support · dégâts physiques · mana · mêlée
- **Kit** : soins / boucliers aux alliés, engage et contrôles, naturellement résistant, sorts fréquents (accélération rentable), ultime décisif.
- **Répartition des 10 builds** : Support enchanteur (7), Support engage (3)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Support enchanteur | Support | Standard | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Redemption → Locket of the Iron Solari → Staff of Flowing Water | 9950 |
| 2 | Support enchanteur | Support | Contre AD / assassins | Celestial Opposition → Plated Steelcaps → Mikael's Blessing → Locket of the Iron Solari → Redemption → Zeke's Convergence | 10200 |
| 3 | Support enchanteur | Support | Contre AP | Celestial Opposition → Mercury's Treads → Mikael's Blessing → Locket of the Iron Solari → Redemption → Zeke's Convergence | 10250 |
| 4 | Support engage | Support | Standard | Celestial Opposition → Mercury's Treads → Zeke's Convergence → Locket of the Iron Solari → Vigilant Wardstone → Randuin's Omen | 10650 |
| 5 | Support engage | Support | Engagement | Solstice Sleigh → Mercury's Treads → Zeke's Convergence → Locket of the Iron Solari → Trailblazer → Vigilant Wardstone | 10350 |
| 6 | Support engage | Support | Contre AD / assassins | Celestial Opposition → Plated Steelcaps → Randuin's Omen → Frozen Heart → Thornmail → Zeke's Convergence | 11050 |
| 7 | Support enchanteur | Support | Alternative (sans Mikael's Blessing) | Dream Maker → Ionian Boots of Lucidity → Redemption → Locket of the Iron Solari → Staff of Flowing Water → Zeke's Convergence | 9850 |
| 8 | Support enchanteur | Support | Alternative (sans Redemption) | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Locket of the Iron Solari → Staff of Flowing Water → Zeke's Convergence | 9850 |
| 9 | Support enchanteur | Support | Alternative (sans Locket of the Iron Solari) | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Redemption → Staff of Flowing Water → Zeke's Convergence | 9950 |
| 10 | Support enchanteur | Support | Alternative (sans Staff of Flowing Water) | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Redemption → Locket of the Iron Solari → Zeke's Convergence | 9900 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Frozen Heart** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Abyssal Mask** en objet suivant.
- **Assassin** feed qui vous cible : protéger le carry visé (Knight's Vow, Locket of the Iron Solari) ; pour vous : Frozen Heart.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : poser plus de balises de contrôle, jouer pour les objectifs ; objet d'équipe suivant : **Zeke's Convergence**.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Zeke's Convergence**.

### Briar

- **Rôles** : Jungle · dégâts physiques · sans mana · mêlée
- **Kit** : soins sur soi, très mobile, dépend des attaques de base, dégâts sur la durée, ultime décisif.
- **Répartition des 10 builds** : Combattant (jungle) (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant (jungle) | Jungle | Standard | Mercury's Treads → Stridebreaker → Death's Dance → Sundered Sky → Experimental Hexplate → Sterak's Gage | 17150 |
| 2 | Combattant (jungle) | Jungle | Contre AD / assassins | Plated Steelcaps → Stridebreaker → Death's Dance → Randuin's Omen → Guardian Angel → Sterak's Gage | 16900 |
| 3 | Combattant (jungle) | Jungle | Contre AP | Mercury's Treads → Stridebreaker → Spirit Visage → Death's Dance → Kaenic Rookern → Maw of Malmortius | 16550 |
| 4 | Combattant (jungle) | Jungle | Contre tanks | Mercury's Treads → Serylda's Grudge → Death's Dance → Stridebreaker → Sundered Sky → Experimental Hexplate | 16950 |
| 5 | Combattant (jungle) | Jungle | Sustain | Mercury's Treads → Ravenous Hydra → Death's Dance → Sundered Sky → Spirit Visage → Sterak's Gage | 16850 |
| 6 | Combattant (jungle) | Jungle | Anti-soins | Mercury's Treads → Chempunk Chainsword → Death's Dance → Stridebreaker → Sundered Sky → Experimental Hexplate | 17050 |
| 7 | Combattant (jungle) | Jungle | Alternative (sans Stridebreaker) | Mercury's Treads → Ravenous Hydra → Death's Dance → Sundered Sky → Experimental Hexplate → Sterak's Gage | 17150 |
| 8 | Combattant (jungle) | Jungle | Alternative (sans Death's Dance) | Mercury's Treads → Stridebreaker → Sundered Sky → Experimental Hexplate → Sterak's Gage → Spirit Visage | 16550 |
| 9 | Combattant (jungle) | Jungle | Alternative (sans Sundered Sky) | Mercury's Treads → Stridebreaker → Death's Dance → Experimental Hexplate → Sterak's Gage → Spirit Visage | 16750 |
| 10 | Combattant (jungle) | Jungle | Alternative (sans Experimental Hexplate) | Mercury's Treads → Stridebreaker → Death's Dance → Sundered Sky → Sterak's Gage → Spirit Visage | 16850 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Randuin's Omen** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Serylda's Grudge** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Bloodthirster** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Caitlyn

- **Rôles** : ADC · dégâts physiques · mana · distance
- **Kit** : dépend des attaques de base, synergie coup critique, poke à longue portée.
- **Répartition des 10 builds** : Dégâts AD critique (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD critique | ADC | Standard | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Kraken Slayer → Bloodthirster | 17050 |
| 2 | Dégâts AD critique | ADC | Contre AD / assassins | Plated Steelcaps → Yun Tal Wildarrows → Guardian Angel → Death's Dance → Infinity Edge → Lord Dominik's Regards | 17250 |
| 3 | Dégâts AD critique | ADC | Contre AP | Berserker's Greaves → Yun Tal Wildarrows → Mercurial Scimitar → Infinity Edge → Lord Dominik's Regards → Kraken Slayer | 16850 |
| 4 | Dégâts AD critique | ADC | Boule de neige | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → The Collector → Kraken Slayer | 16650 |
| 5 | Dégâts AD critique | ADC | Poke | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Kraken Slayer → Essence Reaver | 16550 |
| 6 | Dégâts AD critique | ADC | Anti-soins | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Mortal Reminder → Kraken Slayer → Bloodthirster | 17250 |
| 7 | Dégâts AD critique | ADC | Alternative (sans Yun Tal Wildarrows) | Berserker's Greaves → Essence Reaver → Infinity Edge → Kraken Slayer → Lord Dominik's Regards → Bloodthirster | 16950 |
| 8 | Dégâts AD critique | ADC | Alternative (sans Infinity Edge) | Berserker's Greaves → Yun Tal Wildarrows → Kraken Slayer → Lord Dominik's Regards → Bloodthirster → Essence Reaver | 16500 |
| 9 | Dégâts AD critique | ADC | Alternative (sans Kraken Slayer) | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Bloodthirster → Essence Reaver | 16950 |
| 10 | Dégâts AD critique | ADC | Alternative (sans Yun Tal Wildarrows, Infinity Edge) | Berserker's Greaves → Kraken Slayer → Bloodthirster → Lord Dominik's Regards → Essence Reaver → Phantom Dancer | 16150 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Guardian Angel (AD) / Maw of Malmortius ou Mercurial Scimitar (AP).
- **Tank** feed / 2 tanks ou plus : **Blade of the Ruined King** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Mortal Reminder** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Mercurial Scimitar.
- **En avance** : finir l'objet offensif principal, puis **The Collector** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Camille

- **Rôles** : Top · dégâts physiques · mana · mêlée
- **Kit** : attaques entre les sorts, très mobile, sorts fréquents (accélération rentable), burst, ultime décisif.
- **Répartition des 10 builds** : Dégâts AD (7), Combattant (3)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD | Top | Standard | Ionian Boots of Lucidity → Serylda's Grudge → Bloodthirster → Axiom Arc → Death's Dance → Trinity Force | 16683 |
| 2 | Dégâts AD | Top | Contre tanks | Ionian Boots of Lucidity → Serylda's Grudge → Bloodthirster → Death's Dance → Trinity Force → Maw of Malmortius | 17033 |
| 3 | Dégâts AD | Top | Contre AD / assassins | Plated Steelcaps → Bloodthirster → Death's Dance → Guardian Angel → Randuin's Omen → Maw of Malmortius | 16900 |
| 4 | Dégâts AD | Top | Contre AP | Mercury's Treads → Edge of Night → Maw of Malmortius → Mercurial Scimitar → Serylda's Grudge → Bloodthirster | 16950 |
| 5 | Dégâts AD | Top | Boule de neige | Ionian Boots of Lucidity → Hubris → Opportunity → Axiom Arc → Profane Hydra → Serylda's Grudge | 15200 |
| 6 | Dégâts AD | Top | Accélération | Ionian Boots of Lucidity → Axiom Arc → Spear of Shojin → Serylda's Grudge → Death's Dance → Trinity Force | 16383 |
| 7 | Dégâts AD | Top | Anti-soins | Ionian Boots of Lucidity → Bloodthirster → Axiom Arc → Mortal Reminder → Death's Dance → Trinity Force | 16983 |
| 8 | Combattant | Top | Standard | Mercury's Treads → Trinity Force → Death's Dance → Spear of Shojin → Maw of Malmortius → Black Cleaver | 17083 |
| 9 | Combattant | Top | Contre AD / assassins | Plated Steelcaps → Trinity Force → Death's Dance → Randuin's Omen → Frozen Heart → Sterak's Gage | 16233 |
| 10 | Combattant | Top | Contre AP | Mercury's Treads → Trinity Force → Maw of Malmortius → Death's Dance → Kaenic Rookern → Spear of Shojin | 16983 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Maw of Malmortius** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Hubris** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Cassiopeia

- **Rôles** : Mid, Top · dégâts magiques · mana · distance
- **Kit** : gros besoin de mana, dégâts sur la durée, sorts fréquents (accélération rentable), dégâts de zone, engage et contrôles.
- **Répartition des 10 builds** : Dégâts AP continu (10)
- **Particularité** : Ne peut pas acheter de bottes : remplacer les bottes par un objet légendaire (Rylai, Zhonya, Liandry selon la règle).

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP continu | Mid, Top | Standard | Archangel's Staff → Blackfire Torch → Rabadon's Deathcap → Void Staff → Horizon Focus → Malignance | 17650 |
| 2 | Dégâts AP continu | Mid, Top | Contre tanks | Archangel's Staff → Blackfire Torch → Rabadon's Deathcap → Void Staff → Liandry's Torment → Malignance | 17900 |
| 3 | Dégâts AP continu | Mid, Top | Contre AD / assassins | Archangel's Staff → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Blackfire Torch → Malignance | 18150 |
| 4 | Dégâts AP continu | Mid, Top | Contre AP | Archangel's Staff → Banshee's Veil → Rabadon's Deathcap → Void Staff → Blackfire Torch → Malignance | 17900 |
| 5 | Dégâts AP continu | Mid, Top | Anti-soins | Archangel's Staff → Morellonomicon → Rabadon's Deathcap → Void Staff → Blackfire Torch → Malignance | 17750 |
| 6 | Dégâts AP continu | Mid, Top | Alternative (sans Archangel's Staff) | Shadowflame → Blackfire Torch → Rabadon's Deathcap → Void Staff → Malignance → Horizon Focus | 17950 |
| 7 | Dégâts AP continu | Mid, Top | Alternative (sans Blackfire Torch) | Archangel's Staff → Malignance → Rabadon's Deathcap → Void Staff → Horizon Focus → Shadowflame | 18050 |
| 8 | Dégâts AP continu | Mid, Top | Alternative (sans Rabadon's Deathcap) | Archangel's Staff → Blackfire Torch → Void Staff → Horizon Focus → Malignance → Shadowflame | 17350 |
| 9 | Dégâts AP continu | Mid, Top | Alternative (sans Void Staff) | Archangel's Staff → Blackfire Torch → Rabadon's Deathcap → Horizon Focus → Malignance → Cryptbloom | 17650 |
| 10 | Dégâts AP continu | Mid, Top | Alternative (sans Archangel's Staff, Blackfire Torch) | Malignance → Rabadon's Deathcap → Void Staff → Horizon Focus → Shadowflame → Liandry's Torment | 18150 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Liandry's Torment** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Shadowflame** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Cho'Gath

- **Rôles** : Top, Mid · dégâts magiques · mana · mêlée
- **Kit** : sorts qui montent avec les PV, ultime décisif, naturellement résistant, sorts fréquents (accélération rentable), dégâts de zone.
- **Répartition des 10 builds** : Combattant (3), Tank (7)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant | Top, Mid | Standard | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Abyssal Mask → Randuin's Omen | 15900 |
| 2 | Combattant | Top, Mid | Contre AD / assassins | Plated Steelcaps → Heartsteel → Randuin's Omen → Warmog's Armor → Frozen Heart → Jak'Sho, The Protean | 15700 |
| 3 | Combattant | Top, Mid | Contre AP | Mercury's Treads → Heartsteel → Kaenic Rookern → Warmog's Armor → Jak'Sho, The Protean → Abyssal Mask | 16100 |
| 4 | Tank | Top | Standard | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Unending Despair → Randuin's Omen | 16050 |
| 5 | Tank | Top | Engagement | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Dead Man's Plate → Unending Despair | 16250 |
| 6 | Tank | Top | Accélération | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Unending Despair → Abyssal Mask | 16000 |
| 7 | Tank | Top | Anti-soins | Mercury's Treads → Heartsteel → Thornmail → Jak'Sho, The Protean → Warmog's Armor → Unending Despair | 15800 |
| 8 | Tank | Top | Alternative (sans Heartsteel) | Mercury's Treads → Jak'Sho, The Protean → Unending Despair → Randuin's Omen → Warmog's Armor → Sunfire Aegis | 15750 |
| 9 | Tank | Top | Alternative (sans Jak'Sho, The Protean) | Mercury's Treads → Heartsteel → Unending Despair → Warmog's Armor → Randuin's Omen → Sunfire Aegis | 15550 |
| 10 | Tank | Top | Alternative (sans Warmog's Armor) | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Unending Despair → Randuin's Omen → Sunfire Aegis | 15650 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Frozen Heart** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Unending Despair** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Unending Despair** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Frozen Heart**.

### Corki

- **Rôles** : Mid · dégâts mixtes · mana · distance
- **Kit** : attaques entre les sorts, poke à longue portée, dépend des attaques de base, sorts fréquents (accélération rentable), gros besoin de mana.
- **Répartition des 10 builds** : Dégâts AD (10)
- **Particularité** : Hybride : dégâts majoritairement magiques via son passif mais objets AD.

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD | Mid | Standard | Berserker's Greaves → Bloodthirster → Trinity Force → Serylda's Grudge → Kraken Slayer → Essence Reaver | 16733 |
| 2 | Dégâts AD | Mid | Contre tanks | Berserker's Greaves → Serylda's Grudge → Kraken Slayer → Bloodthirster → Trinity Force → Blade of the Ruined King | 17033 |
| 3 | Dégâts AD | Mid | Contre AD / assassins | Plated Steelcaps → Serylda's Grudge → Guardian Angel → Death's Dance → Bloodthirster → Trinity Force | 17433 |
| 4 | Dégâts AD | Mid | Contre AP | Mercury's Treads → Bloodthirster → Mercurial Scimitar → Edge of Night → Maw of Malmortius → Trinity Force | 17283 |
| 5 | Dégâts AD | Mid | Boule de neige | Berserker's Greaves → Hubris → Bloodthirster → Trinity Force → Serylda's Grudge → Opportunity | 16533 |
| 6 | Dégâts AD | Mid | Accélération | Ionian Boots of Lucidity → Trinity Force → Serylda's Grudge → Bloodthirster → Spear of Shojin → Essence Reaver | 16633 |
| 7 | Dégâts AD | Mid | Partie longue | Berserker's Greaves → Manamune → Serylda's Grudge → Bloodthirster → Trinity Force → Kraken Slayer | 16733 |
| 8 | Dégâts AD | Mid | Sustain | Berserker's Greaves → Bloodthirster → Ravenous Hydra → Trinity Force → Serylda's Grudge → Death's Dance | 17433 |
| 9 | Dégâts AD | Mid | Anti-soins | Berserker's Greaves → Bloodthirster → Trinity Force → Mortal Reminder → Kraken Slayer → Essence Reaver | 17033 |
| 10 | Dégâts AD | Mid | Alternative (sans Bloodthirster) | Berserker's Greaves → Trinity Force → Serylda's Grudge → Kraken Slayer → Essence Reaver → Eclipse | 16233 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Guardian Angel (AD) / Maw of Malmortius ou Mercurial Scimitar (AP).
- **Tank** feed / 2 tanks ou plus : **Blade of the Ruined King** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Mercurial Scimitar.
- **En avance** : finir l'objet offensif principal, puis **Hubris** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Darius

- **Rôles** : Top, Jungle · dégâts physiques · mana · mêlée
- **Kit** : dégâts sur la durée, ultime décisif, sorts fréquents (accélération rentable), dégâts de zone, soins sur soi.
- **Répartition des 10 builds** : Combattant (7), Combattant (jungle) (3)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant | Top | Standard | Mercury's Treads → Stridebreaker → Death's Dance → Spear of Shojin → Experimental Hexplate → Sterak's Gage | 17150 |
| 2 | Combattant | Top | Contre AD / assassins | Plated Steelcaps → Stridebreaker → Death's Dance → Randuin's Omen → Frozen Heart → Sterak's Gage | 16200 |
| 3 | Combattant | Top | Contre AP | Mercury's Treads → Stridebreaker → Maw of Malmortius → Death's Dance → Kaenic Rookern → Jak'Sho, The Protean | 17050 |
| 4 | Combattant | Top | Contre tanks | Mercury's Treads → Serylda's Grudge → Death's Dance → Stridebreaker → Spear of Shojin → Experimental Hexplate | 16950 |
| 5 | Combattant | Top | Sustain | Mercury's Treads → Ravenous Hydra → Death's Dance → Sundered Sky → Sterak's Gage → Spirit Visage | 16850 |
| 6 | Combattant | Top | Accélération | Mercury's Treads → Spear of Shojin → Death's Dance → Black Cleaver → Stridebreaker → Maw of Malmortius | 17050 |
| 7 | Combattant | Top | Anti-soins | Mercury's Treads → Chempunk Chainsword → Death's Dance → Stridebreaker → Spear of Shojin → Experimental Hexplate | 17050 |
| 8 | Combattant (jungle) | Jungle | Standard | Mercury's Treads → Stridebreaker → Death's Dance → Spear of Shojin → Sundered Sky → Experimental Hexplate | 17050 |
| 9 | Combattant (jungle) | Jungle | Contre AP | Mercury's Treads → Stridebreaker → Death's Dance → Maw of Malmortius → Spirit Visage → Kaenic Rookern | 16550 |
| 10 | Combattant (jungle) | Jungle | Contre tanks | Mercury's Treads → Serylda's Grudge → Death's Dance → Stridebreaker → Spear of Shojin → Sundered Sky | 17050 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Randuin's Omen** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Serylda's Grudge** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Black Cleaver** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Diana

- **Rôles** : Jungle, Mid · dégâts magiques · mana · mêlée
- **Kit** : burst, très mobile, effets à l'impact, dégâts de zone, ultime décisif.
- **Répartition des 10 builds** : Dégâts AP burst (4), Combattant (1), Combattant (jungle) (5)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP burst | Mid | Standard | Berserker's Greaves → Shadowflame → Rabadon's Deathcap → Void Staff → Nashor's Tooth → Stormsurge | 16500 |
| 2 | Dégâts AP burst | Mid | Contre tanks | Berserker's Greaves → Nashor's Tooth → Rabadon's Deathcap → Void Staff → Shadowflame → Malignance | 16400 |
| 3 | Dégâts AP burst | Mid | Contre AD / assassins | Plated Steelcaps → Shadowflame → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Nashor's Tooth | 17050 |
| 4 | Dégâts AP burst | Mid | Contre AP | Mercury's Treads → Shadowflame → Banshee's Veil → Rabadon's Deathcap → Void Staff → Nashor's Tooth | 16850 |
| 5 | Combattant | Mid | Standard | Mercury's Treads → Shadowflame → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Nashor's Tooth | 17100 |
| 6 | Combattant (jungle) | Jungle | Contre AD / assassins | Plated Steelcaps → Zhonya's Hourglass → Randuin's Omen → Frozen Heart → Rabadon's Deathcap → Void Staff | 16150 |
| 7 | Combattant (jungle) | Jungle | Contre AP | Mercury's Treads → Banshee's Veil → Kaenic Rookern → Jak'Sho, The Protean → Rabadon's Deathcap → Zhonya's Hourglass | 17100 |
| 8 | Combattant (jungle) | Jungle | Contre tanks | Mercury's Treads → Nashor's Tooth → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Banshee's Veil | 16900 |
| 9 | Combattant (jungle) | Jungle | Anti-soins | Mercury's Treads → Morellonomicon → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Shadowflame | 17050 |
| 10 | Combattant (jungle) | Jungle | Alternative (sans Rabadon's Deathcap) | Mercury's Treads → Shadowflame → Zhonya's Hourglass → Void Staff → Nashor's Tooth → Banshee's Veil | 16600 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Malignance** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Luden's Companion** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Dr. Mundo

- **Rôles** : Top, Jungle · dégâts physiques · sans mana · mêlée
- **Kit** : sorts qui montent avec les PV, soins sur soi, naturellement résistant, ultime décisif.
- **Répartition des 10 builds** : Tank (7), Tank (jungle) (3)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Tank | Top | Standard | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Unending Despair → Randuin's Omen | 16050 |
| 2 | Tank | Top | Contre AD / assassins | Plated Steelcaps → Heartsteel → Randuin's Omen → Warmog's Armor → Jak'Sho, The Protean → Thornmail | 15650 |
| 3 | Tank | Top | Contre AP | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Kaenic Rookern → Unending Despair | 16250 |
| 4 | Tank | Top | Partie longue | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Overlord's Bloodmail → Unending Despair | 16650 |
| 5 | Tank | Top | Anti-soins | Mercury's Treads → Heartsteel → Thornmail → Jak'Sho, The Protean → Warmog's Armor → Unending Despair | 15800 |
| 6 | Tank | Top | Alternative (sans Heartsteel) | Mercury's Treads → Jak'Sho, The Protean → Unending Despair → Randuin's Omen → Warmog's Armor → Overlord's Bloodmail | 16350 |
| 7 | Tank | Top | Alternative (sans Jak'Sho, The Protean) | Mercury's Treads → Heartsteel → Unending Despair → Warmog's Armor → Randuin's Omen → Overlord's Bloodmail | 16150 |
| 8 | Tank (jungle) | Jungle | Alternative (sans Heartsteel) | Mercury's Treads → Jak'Sho, The Protean → Unending Despair → Randuin's Omen → Warmog's Armor → Spirit Visage | 15750 |
| 9 | Tank (jungle) | Jungle | Alternative (sans Jak'Sho, The Protean) | Mercury's Treads → Heartsteel → Unending Despair → Warmog's Armor → Randuin's Omen → Spirit Visage | 15550 |
| 10 | Tank (jungle) | Jungle | Alternative (sans Warmog's Armor) | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Unending Despair → Randuin's Omen → Spirit Visage | 15650 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Thornmail** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : protéger le carry visé (Knight's Vow, Locket of the Iron Solari) ; pour vous : Thornmail.
- **Tank** feed / 2 tanks ou plus : **Overlord's Bloodmail** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Thornmail** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : poser plus de balises de contrôle, jouer pour les objectifs ; objet d'équipe suivant : **Overlord's Bloodmail**.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Thornmail**.

### Draven

- **Rôles** : ADC · dégâts physiques · mana · distance
- **Kit** : dépend des attaques de base, synergie coup critique, burst.
- **Répartition des 10 builds** : Dégâts AD critique (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD critique | ADC | Standard | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Kraken Slayer → Bloodthirster | 17050 |
| 2 | Dégâts AD critique | ADC | Contre AD / assassins | Plated Steelcaps → Yun Tal Wildarrows → Guardian Angel → Death's Dance → Infinity Edge → Lord Dominik's Regards | 17250 |
| 3 | Dégâts AD critique | ADC | Contre AP | Berserker's Greaves → Yun Tal Wildarrows → Mercurial Scimitar → Infinity Edge → Lord Dominik's Regards → Edge of Night | 16850 |
| 4 | Dégâts AD critique | ADC | Boule de neige | Berserker's Greaves → The Collector → Infinity Edge → Yun Tal Wildarrows → Lord Dominik's Regards → Kraken Slayer | 16650 |
| 5 | Dégâts AD critique | ADC | Anti-soins | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Mortal Reminder → Kraken Slayer → Bloodthirster | 17250 |
| 6 | Dégâts AD critique | ADC | Alternative (sans Yun Tal Wildarrows) | Berserker's Greaves → Essence Reaver → Infinity Edge → Kraken Slayer → Lord Dominik's Regards → Bloodthirster | 16950 |
| 7 | Dégâts AD critique | ADC | Alternative (sans Infinity Edge) | Berserker's Greaves → Yun Tal Wildarrows → Kraken Slayer → Lord Dominik's Regards → Bloodthirster → Essence Reaver | 16500 |
| 8 | Dégâts AD critique | ADC | Alternative (sans Kraken Slayer) | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Bloodthirster → Essence Reaver | 16950 |
| 9 | Dégâts AD critique | ADC | Alternative (sans Yun Tal Wildarrows, Infinity Edge) | Berserker's Greaves → Kraken Slayer → Bloodthirster → Lord Dominik's Regards → Essence Reaver → The Collector | 16500 |
| 10 | Dégâts AD critique | ADC | Alternative (sans Infinity Edge, Lord Dominik's Regards) | Berserker's Greaves → Yun Tal Wildarrows → Kraken Slayer → Mortal Reminder → Bloodthirster → Essence Reaver | 16700 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Guardian Angel (AD) / Maw of Malmortius ou Mercurial Scimitar (AP).
- **Tank** feed / 2 tanks ou plus : **Blade of the Ruined King** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Mortal Reminder** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Mercurial Scimitar.
- **En avance** : finir l'objet offensif principal, puis **The Collector** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Ekko

- **Rôles** : Jungle, Mid · dégâts magiques · mana · mêlée
- **Kit** : burst, très mobile, attaques entre les sorts, ultime décisif.
- **Répartition des 10 builds** : Dégâts AP burst (4), Combattant (1), Combattant (jungle) (5)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP burst | Mid | Standard | Sorcerer's Shoes → Shadowflame → Rabadon's Deathcap → Void Staff → Stormsurge → Lich Bane | 16500 |
| 2 | Dégâts AP burst | Mid | Contre tanks | Berserker's Greaves → Lich Bane → Rabadon's Deathcap → Void Staff → Shadowflame → Horizon Focus | 16450 |
| 3 | Dégâts AP burst | Mid | Contre AD / assassins | Plated Steelcaps → Shadowflame → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Stormsurge | 16950 |
| 4 | Dégâts AP burst | Mid | Contre AP | Mercury's Treads → Shadowflame → Banshee's Veil → Rabadon's Deathcap → Void Staff → Stormsurge | 16750 |
| 5 | Combattant | Mid | Standard | Mercury's Treads → Shadowflame → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Banshee's Veil | 17200 |
| 6 | Combattant (jungle) | Jungle | Contre AD / assassins | Plated Steelcaps → Zhonya's Hourglass → Randuin's Omen → Frozen Heart → Rabadon's Deathcap → Void Staff | 16150 |
| 7 | Combattant (jungle) | Jungle | Contre AP | Mercury's Treads → Banshee's Veil → Kaenic Rookern → Rabadon's Deathcap → Spirit Visage → Zhonya's Hourglass | 16600 |
| 8 | Combattant (jungle) | Jungle | Contre tanks | Mercury's Treads → Lich Bane → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Banshee's Veil | 16900 |
| 9 | Combattant (jungle) | Jungle | Anti-soins | Mercury's Treads → Morellonomicon → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Shadowflame | 17050 |
| 10 | Combattant (jungle) | Jungle | Alternative (sans Zhonya's Hourglass) | Mercury's Treads → Shadowflame → Rabadon's Deathcap → Void Staff → Banshee's Veil → Lich Bane | 16850 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Horizon Focus** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Luden's Companion** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Elise

- **Rôles** : Jungle, Support · dégâts magiques · mana · distance
- **Kit** : burst, très mobile.
- **Répartition des 10 builds** : Dégâts AP burst (jungle) (6), Support dégâts AP burst (4)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP burst (jungle) | Jungle | Standard | Sorcerer's Shoes → Shadowflame → Rabadon's Deathcap → Void Staff → Stormsurge → Luden's Companion | 16350 |
| 2 | Dégâts AP burst (jungle) | Jungle | Contre tanks | Sorcerer's Shoes → Shadowflame → Horizon Focus → Rabadon's Deathcap → Void Staff → Luden's Companion | 16300 |
| 3 | Dégâts AP burst (jungle) | Jungle | Contre AD / assassins | Plated Steelcaps → Shadowflame → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Stormsurge | 16950 |
| 4 | Dégâts AP burst (jungle) | Jungle | Contre AP | Mercury's Treads → Shadowflame → Banshee's Veil → Rabadon's Deathcap → Void Staff → Stormsurge | 16750 |
| 5 | Dégâts AP burst (jungle) | Jungle | Anti-soins | Sorcerer's Shoes → Shadowflame → Morellonomicon → Rabadon's Deathcap → Void Staff → Stormsurge | 16450 |
| 6 | Support dégâts AP burst | Support | Standard | Zaz'Zak's Realmspike → Sorcerer's Shoes → Stormsurge → Rabadon's Deathcap → Void Staff → Shadowflame | 13600 |
| 7 | Support dégâts AP burst | Support | Contre AD / assassins | Zaz'Zak's Realmspike → Plated Steelcaps → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Thornmail | 13400 |
| 8 | Support dégâts AP burst | Support | Contre AP | Zaz'Zak's Realmspike → Mercury's Treads → Stormsurge → Banshee's Veil → Rabadon's Deathcap → Void Staff | 13550 |
| 9 | Support dégâts AP burst | Support | Boule de neige | Zaz'Zak's Realmspike → Sorcerer's Shoes → Stormsurge → Shadowflame → Rabadon's Deathcap → Luden's Companion | 13350 |
| 10 | Dégâts AP burst (jungle) | Jungle | Alternative (sans Shadowflame) | Sorcerer's Shoes → Stormsurge → Rabadon's Deathcap → Void Staff → Luden's Companion → Horizon Focus | 15900 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Horizon Focus** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Horizon Focus** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Evelynn

- **Rôles** : Jungle · dégâts magiques · mana · mêlée
- **Kit** : burst, très mobile, ultime décisif.
- **Répartition des 10 builds** : Dégâts AP burst (jungle) (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP burst (jungle) | Jungle | Standard | Sorcerer's Shoes → Shadowflame → Rabadon's Deathcap → Void Staff → Stormsurge → Luden's Companion | 16350 |
| 2 | Dégâts AP burst (jungle) | Jungle | Contre tanks | Mercury's Treads → Shadowflame → Rabadon's Deathcap → Void Staff → Horizon Focus → Malignance | 16400 |
| 3 | Dégâts AP burst (jungle) | Jungle | Contre AD / assassins | Plated Steelcaps → Shadowflame → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Stormsurge | 16950 |
| 4 | Dégâts AP burst (jungle) | Jungle | Contre AP | Mercury's Treads → Shadowflame → Banshee's Veil → Rabadon's Deathcap → Void Staff → Stormsurge | 16750 |
| 5 | Dégâts AP burst (jungle) | Jungle | Anti-soins | Sorcerer's Shoes → Shadowflame → Morellonomicon → Rabadon's Deathcap → Void Staff → Stormsurge | 16450 |
| 6 | Dégâts AP burst (jungle) | Jungle | Alternative (sans Shadowflame) | Sorcerer's Shoes → Stormsurge → Rabadon's Deathcap → Void Staff → Luden's Companion → Horizon Focus | 15900 |
| 7 | Dégâts AP burst (jungle) | Jungle | Alternative (sans Rabadon's Deathcap) | Sorcerer's Shoes → Shadowflame → Stormsurge → Void Staff → Luden's Companion → Horizon Focus | 15600 |
| 8 | Dégâts AP burst (jungle) | Jungle | Alternative (sans Void Staff) | Sorcerer's Shoes → Shadowflame → Stormsurge → Rabadon's Deathcap → Luden's Companion → Cryptbloom | 16350 |
| 9 | Dégâts AP burst (jungle) | Jungle | Alternative (sans Stormsurge) | Sorcerer's Shoes → Shadowflame → Rabadon's Deathcap → Void Staff → Luden's Companion → Horizon Focus | 16300 |
| 10 | Dégâts AP burst (jungle) | Jungle | Alternative (sans Shadowflame, Rabadon's Deathcap) | Sorcerer's Shoes → Stormsurge → Luden's Companion → Void Staff → Horizon Focus → Malignance | 15100 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Horizon Focus** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Horizon Focus** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Ezreal

- **Rôles** : ADC · dégâts physiques · mana · distance
- **Kit** : sorts fréquents (accélération rentable), gros besoin de mana, attaques entre les sorts, poke à longue portée, dégâts sur la durée.
- **Répartition des 10 builds** : Dégâts AD (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD | ADC | Standard | Ionian Boots of Lucidity → Manamune → Serylda's Grudge → Bloodthirster → Essence Reaver → Trinity Force | 16433 |
| 2 | Dégâts AD | ADC | Contre AD / assassins | Plated Steelcaps → Manamune → Guardian Angel → Death's Dance → Bloodthirster → Serylda's Grudge | 17000 |
| 3 | Dégâts AD | ADC | Contre AP | Mercury's Treads → Manamune → Mercurial Scimitar → Maw of Malmortius → Edge of Night → Serylda's Grudge | 16450 |
| 4 | Dégâts AD | ADC | Accélération | Ionian Boots of Lucidity → Manamune → Spear of Shojin → Serylda's Grudge → Essence Reaver → Trinity Force | 16133 |
| 5 | Dégâts AD | ADC | Anti-soins | Ionian Boots of Lucidity → Manamune → Bloodthirster → Mortal Reminder → Essence Reaver → Trinity Force | 16733 |
| 6 | Dégâts AD | ADC | Alternative (sans Manamune) | Ionian Boots of Lucidity → Serylda's Grudge → Bloodthirster → Essence Reaver → Trinity Force → Spear of Shojin | 16633 |
| 7 | Dégâts AD | ADC | Alternative (sans Serylda's Grudge) | Ionian Boots of Lucidity → Manamune → Bloodthirster → Essence Reaver → Trinity Force → Spear of Shojin | 16533 |
| 8 | Dégâts AD | ADC | Alternative (sans Essence Reaver) | Ionian Boots of Lucidity → Manamune → Serylda's Grudge → Bloodthirster → Trinity Force → Spear of Shojin | 16633 |
| 9 | Dégâts AD | ADC | Alternative (sans Manamune, Serylda's Grudge) | Ionian Boots of Lucidity → Archangel's Staff → Bloodthirster → Essence Reaver → Trinity Force → Spear of Shojin | 16533 |
| 10 | Dégâts AD | ADC | Alternative (sans Serylda's Grudge, Bloodthirster) | Ionian Boots of Lucidity → Manamune → Essence Reaver → Trinity Force → Spear of Shojin → Death's Dance | 16433 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Guardian Angel (AD) / Maw of Malmortius ou Mercurial Scimitar (AP).
- **Tank** feed / 2 tanks ou plus : **Spear of Shojin** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Mercurial Scimitar.
- **En avance** : finir l'objet offensif principal, puis **Hubris** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Fiddlesticks

- **Rôles** : Jungle, Support · dégâts magiques · mana · distance
- **Kit** : dégâts de zone, ultime décisif, sorts fréquents (accélération rentable), dégâts sur la durée, engage et contrôles.
- **Répartition des 10 builds** : Dégâts AP continu (jungle) (6), Support dégâts AP continu (4)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP continu (jungle) | Jungle | Standard | Sorcerer's Shoes → Malignance → Rabadon's Deathcap → Void Staff → Horizon Focus → Blackfire Torch | 15850 |
| 2 | Dégâts AP continu (jungle) | Jungle | Contre tanks | Ionian Boots of Lucidity → Malignance → Rabadon's Deathcap → Void Staff → Liandry's Torment → Horizon Focus | 15850 |
| 3 | Dégâts AP continu (jungle) | Jungle | Contre AD / assassins | Plated Steelcaps → Malignance → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Horizon Focus | 16400 |
| 4 | Dégâts AP continu (jungle) | Jungle | Contre AP | Mercury's Treads → Malignance → Banshee's Veil → Rabadon's Deathcap → Void Staff → Horizon Focus | 16200 |
| 5 | Dégâts AP continu (jungle) | Jungle | Accélération | Ionian Boots of Lucidity → Malignance → Rabadon's Deathcap → Void Staff → Horizon Focus → Blackfire Torch | 15650 |
| 6 | Dégâts AP continu (jungle) | Jungle | Anti-soins | Sorcerer's Shoes → Malignance → Morellonomicon → Rabadon's Deathcap → Void Staff → Horizon Focus | 15900 |
| 7 | Support dégâts AP continu | Support | Standard | Zaz'Zak's Realmspike → Sorcerer's Shoes → Malignance → Rabadon's Deathcap → Void Staff → Horizon Focus | 13050 |
| 8 | Support dégâts AP continu | Support | Contre AD / assassins | Zaz'Zak's Realmspike → Plated Steelcaps → Malignance → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff | 13650 |
| 9 | Support dégâts AP continu | Support | Contre AP | Zaz'Zak's Realmspike → Mercury's Treads → Malignance → Banshee's Veil → Rabadon's Deathcap → Void Staff | 13450 |
| 10 | Support dégâts AP continu | Support | Accélération | Zaz'Zak's Realmspike → Ionian Boots of Lucidity → Malignance → Horizon Focus → Rabadon's Deathcap → Void Staff | 12850 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Liandry's Torment** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Shadowflame** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Fiora

- **Rôles** : Top · dégâts physiques · mana · mêlée
- **Kit** : dépend des attaques de base, sorts fréquents (accélération rentable), dégâts sur la durée, attaques entre les sorts, soins sur soi.
- **Répartition des 10 builds** : Combattant (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant | Top | Standard | Mercury's Treads → Stridebreaker → Death's Dance → Trinity Force → Spear of Shojin → Experimental Hexplate | 17283 |
| 2 | Combattant | Top | Contre AD / assassins | Plated Steelcaps → Trinity Force → Death's Dance → Randuin's Omen → Frozen Heart → Sterak's Gage | 16233 |
| 3 | Combattant | Top | Contre AP | Mercury's Treads → Trinity Force → Maw of Malmortius → Death's Dance → Kaenic Rookern → Spirit Visage | 16583 |
| 4 | Combattant | Top | Contre tanks | Mercury's Treads → Serylda's Grudge → Death's Dance → Trinity Force → Spear of Shojin → Stridebreaker | 17283 |
| 5 | Combattant | Top | Sustain | Mercury's Treads → Bloodthirster → Death's Dance → Sundered Sky → Sterak's Gage → Trinity Force | 17583 |
| 6 | Combattant | Top | Split push | Mercury's Treads → Stridebreaker → Death's Dance → Hullbreaker → Trinity Force → Spear of Shojin | 17283 |
| 7 | Combattant | Top | Accélération | Mercury's Treads → Trinity Force → Death's Dance → Spear of Shojin → Maw of Malmortius → Black Cleaver | 17083 |
| 8 | Combattant | Top | Anti-soins | Mercury's Treads → Chempunk Chainsword → Death's Dance → Trinity Force → Spear of Shojin → Stridebreaker | 17383 |
| 9 | Combattant | Top | Alternative (sans Stridebreaker) | Mercury's Treads → Trinity Force → Death's Dance → Spear of Shojin → Experimental Hexplate → Maw of Malmortius | 17083 |
| 10 | Combattant | Top | Alternative (sans Death's Dance) | Mercury's Treads → Trinity Force → Spear of Shojin → Stridebreaker → Experimental Hexplate → Maw of Malmortius | 17083 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Randuin's Omen** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Serylda's Grudge** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Maw of Malmortius** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Fizz

- **Rôles** : Mid · dégâts magiques · mana · mêlée
- **Kit** : burst, très mobile, ultime décisif.
- **Répartition des 10 builds** : Dégâts AP burst (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP burst | Mid | Standard | Sorcerer's Shoes → Shadowflame → Rabadon's Deathcap → Void Staff → Stormsurge → Luden's Companion | 16350 |
| 2 | Dégâts AP burst | Mid | Contre tanks | Berserker's Greaves → Shadowflame → Rabadon's Deathcap → Void Staff → Horizon Focus → Lich Bane | 16450 |
| 3 | Dégâts AP burst | Mid | Contre AD / assassins | Plated Steelcaps → Shadowflame → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Stormsurge | 16950 |
| 4 | Dégâts AP burst | Mid | Contre AP | Mercury's Treads → Shadowflame → Banshee's Veil → Rabadon's Deathcap → Void Staff → Stormsurge | 16750 |
| 5 | Dégâts AP burst | Mid | Anti-soins | Sorcerer's Shoes → Shadowflame → Morellonomicon → Rabadon's Deathcap → Void Staff → Stormsurge | 16450 |
| 6 | Dégâts AP burst | Mid | Alternative (sans Shadowflame) | Sorcerer's Shoes → Stormsurge → Rabadon's Deathcap → Void Staff → Luden's Companion → Lich Bane | 16050 |
| 7 | Dégâts AP burst | Mid | Alternative (sans Rabadon's Deathcap) | Sorcerer's Shoes → Shadowflame → Stormsurge → Void Staff → Luden's Companion → Lich Bane | 15750 |
| 8 | Dégâts AP burst | Mid | Alternative (sans Void Staff) | Sorcerer's Shoes → Shadowflame → Stormsurge → Rabadon's Deathcap → Luden's Companion → Cryptbloom | 16350 |
| 9 | Dégâts AP burst | Mid | Alternative (sans Stormsurge) | Sorcerer's Shoes → Shadowflame → Rabadon's Deathcap → Void Staff → Luden's Companion → Lich Bane | 16450 |
| 10 | Dégâts AP burst | Mid | Alternative (sans Shadowflame, Rabadon's Deathcap) | Sorcerer's Shoes → Stormsurge → Luden's Companion → Void Staff → Lich Bane → Horizon Focus | 15300 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Horizon Focus** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Lich Bane** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Galio

- **Rôles** : Mid, Support · dégâts magiques · mana · mêlée
- **Kit** : engage et contrôles, naturellement résistant, sorts fréquents (accélération rentable), dégâts de zone, ultime décisif.
- **Répartition des 10 builds** : Combattant (4), Support engage (6)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant | Mid | Standard | Mercury's Treads → Abyssal Mask → Jak'Sho, The Protean → Randuin's Omen → Sunfire Aegis → Kaenic Rookern | 15400 |
| 2 | Combattant | Mid | Contre AD / assassins | Plated Steelcaps → Zhonya's Hourglass → Randuin's Omen → Frozen Heart → Thornmail → Jak'Sho, The Protean | 15300 |
| 3 | Combattant | Mid | Accélération | Mercury's Treads → Hollow Radiance → Jak'Sho, The Protean → Frozen Heart → Abyssal Mask → Randuin's Omen | 15100 |
| 4 | Combattant | Mid | Anti-soins | Mercury's Treads → Morellonomicon → Jak'Sho, The Protean → Randuin's Omen → Sunfire Aegis → Abyssal Mask | 15350 |
| 5 | Support engage | Support | Standard | Celestial Opposition → Mercury's Treads → Zeke's Convergence → Locket of the Iron Solari → Randuin's Omen → Vigilant Wardstone | 10650 |
| 6 | Support engage | Support | Engagement | Solstice Sleigh → Mercury's Treads → Zeke's Convergence → Locket of the Iron Solari → Trailblazer → Randuin's Omen | 10750 |
| 7 | Support engage | Support | Contre AD / assassins | Celestial Opposition → Plated Steelcaps → Randuin's Omen → Frozen Heart → Thornmail → Zeke's Convergence | 11050 |
| 8 | Support engage | Support | Contre AP | Celestial Opposition → Mercury's Treads → Zeke's Convergence → Kaenic Rookern → Locket of the Iron Solari → Vigilant Wardstone | 10850 |
| 9 | Support engage | Support | Anti-soins | Celestial Opposition → Mercury's Treads → Thornmail → Zeke's Convergence → Locket of the Iron Solari → Randuin's Omen | 10800 |
| 10 | Support engage | Support | Alternative (sans Zeke's Convergence) | Celestial Opposition → Mercury's Treads → Locket of the Iron Solari → Randuin's Omen → Vigilant Wardstone → Frozen Heart | 10950 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Frozen Heart** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Frozen Heart** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Frozen Heart** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Frozen Heart**.

### Gangplank

- **Rôles** : Top · dégâts physiques · mana · mêlée
- **Kit** : synergie coup critique, burst, sorts fréquents (accélération rentable), gros besoin de mana, dégâts de zone.
- **Répartition des 10 builds** : Dégâts AD critique (10)
- **Particularité** : Utiliser le build « Sorts + critique (Gangplank) ».

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD critique | Top | Standard | Ionian Boots of Lucidity → The Collector → Infinity Edge → Essence Reaver → Lord Dominik's Regards → Profane Hydra | 16200 |
| 2 | Dégâts AD critique | Top | Contre tanks | Ionian Boots of Lucidity → Essence Reaver → Infinity Edge → Lord Dominik's Regards → Bloodthirster → Ravenous Hydra | 17050 |
| 3 | Dégâts AD critique | Top | Contre AD / assassins | Plated Steelcaps → Essence Reaver → Death's Dance → Guardian Angel → Infinity Edge → Lord Dominik's Regards | 17150 |
| 4 | Dégâts AD critique | Top | Contre AP | Mercury's Treads → Edge of Night → Maw of Malmortius → Infinity Edge → Lord Dominik's Regards → Essence Reaver | 16800 |
| 5 | Dégâts AD critique | Top | Boule de neige | Ionian Boots of Lucidity → The Collector → Infinity Edge → Profane Hydra → Hubris → Lord Dominik's Regards | 16300 |
| 6 | Dégâts AD critique | Top | Accélération | Ionian Boots of Lucidity → Essence Reaver → Infinity Edge → Lord Dominik's Regards → Profane Hydra → Axiom Arc | 15950 |
| 7 | Dégâts AD critique | Top | Anti-soins | Ionian Boots of Lucidity → The Collector → Infinity Edge → Essence Reaver → Mortal Reminder → Profane Hydra | 16400 |
| 8 | Dégâts AD critique | Top | Alternative (sans The Collector) | Ionian Boots of Lucidity → Essence Reaver → Infinity Edge → Lord Dominik's Regards → Profane Hydra → Bloodthirster | 16600 |
| 9 | Dégâts AD critique | Top | Alternative (sans Infinity Edge) | Ionian Boots of Lucidity → Essence Reaver → Profane Hydra → Lord Dominik's Regards → The Collector → Bloodthirster | 16150 |
| 10 | Dégâts AD critique | Top | Alternative (sans Essence Reaver) | Ionian Boots of Lucidity → The Collector → Infinity Edge → Profane Hydra → Lord Dominik's Regards → Bloodthirster | 16700 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Death's Dance** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Bloodthirster** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Hubris** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Garen

- **Rôles** : Top · dégâts physiques · sans mana · mêlée
- **Kit** : burst, dégâts sur la durée, soins sur soi, ultime décisif, naturellement résistant.
- **Répartition des 10 builds** : Combattant (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant | Top | Standard | Mercury's Treads → Stridebreaker → Death's Dance → Sterak's Gage → Spear of Shojin → Sundered Sky | 17250 |
| 2 | Combattant | Top | Contre AD / assassins | Plated Steelcaps → Stridebreaker → Death's Dance → Randuin's Omen → Guardian Angel → Sterak's Gage | 16900 |
| 3 | Combattant | Top | Contre AP | Mercury's Treads → Stridebreaker → Maw of Malmortius → Kaenic Rookern → Death's Dance → Jak'Sho, The Protean | 17050 |
| 4 | Combattant | Top | Contre tanks | Mercury's Treads → Serylda's Grudge → Death's Dance → Titanic Hydra → Sterak's Gage → Spear of Shojin | 17150 |
| 5 | Combattant | Top | Sustain | Mercury's Treads → Ravenous Hydra → Death's Dance → Sundered Sky → Sterak's Gage → Spirit Visage | 16850 |
| 6 | Combattant | Top | Anti-soins | Mercury's Treads → Chempunk Chainsword → Death's Dance → Stridebreaker → Sterak's Gage → Spear of Shojin | 17250 |
| 7 | Combattant | Top | Alternative (sans Stridebreaker) | Mercury's Treads → Spear of Shojin → Death's Dance → Sterak's Gage → Sundered Sky → Black Cleaver | 16950 |
| 8 | Combattant | Top | Alternative (sans Death's Dance) | Mercury's Treads → Stridebreaker → Sterak's Gage → Spear of Shojin → Sundered Sky → Black Cleaver | 16950 |
| 9 | Combattant | Top | Alternative (sans Sterak's Gage) | Mercury's Treads → Stridebreaker → Death's Dance → Maw of Malmortius → Spear of Shojin → Sundered Sky | 17150 |
| 10 | Combattant | Top | Alternative (sans Spear of Shojin) | Mercury's Treads → Stridebreaker → Death's Dance → Sterak's Gage → Sundered Sky → Black Cleaver | 17150 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Randuin's Omen** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Serylda's Grudge** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Maw of Malmortius** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Gnar

- **Rôles** : Top · dégâts physiques · sans mana · distance
- **Kit** : engage et contrôles, dépend des attaques de base, dégâts de zone, ultime décisif, naturellement résistant.
- **Répartition des 10 builds** : Dégâts AD (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD | Top | Standard | Berserker's Greaves → Kraken Slayer → Bloodthirster → Experimental Hexplate → Statikk Shiv → Serylda's Grudge | 16200 |
| 2 | Dégâts AD | Top | Contre tanks | Berserker's Greaves → Serylda's Grudge → Kraken Slayer → Blade of the Ruined King → Bloodthirster → Experimental Hexplate | 16700 |
| 3 | Dégâts AD | Top | Contre AD / assassins | Plated Steelcaps → Bloodthirster → Guardian Angel → Death's Dance → Kraken Slayer → Randuin's Omen | 16800 |
| 4 | Dégâts AD | Top | Contre AP | Mercury's Treads → Kraken Slayer → Mercurial Scimitar → Edge of Night → Maw of Malmortius → Kaenic Rookern | 16450 |
| 5 | Dégâts AD | Top | Boule de neige | Berserker's Greaves → Hubris → Kraken Slayer → Bloodthirster → Experimental Hexplate → Statikk Shiv | 16200 |
| 6 | Dégâts AD | Top | Sustain | Berserker's Greaves → Bloodthirster → Ravenous Hydra → Kraken Slayer → Death's Dance → Experimental Hexplate | 17100 |
| 7 | Dégâts AD | Top | Anti-soins | Berserker's Greaves → Kraken Slayer → Bloodthirster → Mortal Reminder → Experimental Hexplate → Statikk Shiv | 16500 |
| 8 | Dégâts AD | Top | Alternative (sans Kraken Slayer) | Berserker's Greaves → Bloodthirster → Experimental Hexplate → Statikk Shiv → Serylda's Grudge → Ravenous Hydra | 16500 |
| 9 | Dégâts AD | Top | Alternative (sans Bloodthirster) | Berserker's Greaves → Kraken Slayer → Experimental Hexplate → Statikk Shiv → Serylda's Grudge → Ravenous Hydra | 16100 |
| 10 | Dégâts AD | Top | Alternative (sans Experimental Hexplate) | Berserker's Greaves → Kraken Slayer → Bloodthirster → Statikk Shiv → Serylda's Grudge → Ravenous Hydra | 16500 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Guardian Angel (AD) / Maw of Malmortius ou Mercurial Scimitar (AP).
- **Tank** feed / 2 tanks ou plus : **Blade of the Ruined King** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Mercurial Scimitar.
- **En avance** : finir l'objet offensif principal, puis **Hubris** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Gragas

- **Rôles** : Jungle, Top, Support · dégâts magiques · mana · mêlée
- **Kit** : engage et contrôles, sorts fréquents (accélération rentable), burst, dégâts de zone, très mobile.
- **Répartition des 10 builds** : Combattant (3), Combattant (jungle) (3), Support dégâts AP burst (3), Support engage (1)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant | Top | Standard | Mercury's Treads → Zhonya's Hourglass → Jak'Sho, The Protean → Rabadon's Deathcap → Void Staff → Randuin's Omen | 16900 |
| 2 | Combattant | Top | Contre AD / assassins | Plated Steelcaps → Zhonya's Hourglass → Randuin's Omen → Frozen Heart → Rabadon's Deathcap → Jak'Sho, The Protean | 16350 |
| 3 | Combattant | Top | Contre AP | Mercury's Treads → Banshee's Veil → Kaenic Rookern → Jak'Sho, The Protean → Rabadon's Deathcap → Zhonya's Hourglass | 17100 |
| 4 | Combattant (jungle) | Jungle | Standard | Mercury's Treads → Riftmaker → Zhonya's Hourglass → Rabadon's Deathcap → Jak'Sho, The Protean → Void Staff | 17300 |
| 5 | Combattant (jungle) | Jungle | Accélération | Mercury's Treads → Cosmic Drive → Riftmaker → Rabadon's Deathcap → Abyssal Mask → Malignance | 16200 |
| 6 | Combattant (jungle) | Jungle | Anti-soins | Mercury's Treads → Morellonomicon → Zhonya's Hourglass → Rabadon's Deathcap → Riftmaker → Jak'Sho, The Protean | 17150 |
| 7 | Support dégâts AP burst | Support | Standard | Zaz'Zak's Realmspike → Sorcerer's Shoes → Malignance → Horizon Focus → Rabadon's Deathcap → Void Staff | 13050 |
| 8 | Support dégâts AP burst | Support | Contre AD / assassins | Zaz'Zak's Realmspike → Plated Steelcaps → Zhonya's Hourglass → Void Staff → Rabadon's Deathcap → Randuin's Omen | 13650 |
| 9 | Support dégâts AP burst | Support | Contre AP | Zaz'Zak's Realmspike → Mercury's Treads → Banshee's Veil → Rabadon's Deathcap → Void Staff → Horizon Focus | 13500 |
| 10 | Support engage | Support | Standard | Celestial Opposition → Mercury's Treads → Zeke's Convergence → Locket of the Iron Solari → Vigilant Wardstone → Randuin's Omen | 10650 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Frozen Heart** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Cosmic Drive** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Shadowflame** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Frozen Heart**.

### Graves

- **Rôles** : Jungle · dégâts physiques · mana · distance
- **Kit** : dépend des attaques de base, sorts fréquents (accélération rentable), burst, très mobile.
- **Répartition des 10 builds** : Dégâts AD (jungle) (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD (jungle) | Jungle | Standard | Berserker's Greaves → Bloodthirster → Serylda's Grudge → Ravenous Hydra → Kraken Slayer → Death's Dance | 17100 |
| 2 | Dégâts AD (jungle) | Jungle | Contre tanks | Berserker's Greaves → Serylda's Grudge → Kraken Slayer → Bloodthirster → Ravenous Hydra → Blade of the Ruined King | 17000 |
| 3 | Dégâts AD (jungle) | Jungle | Contre AD / assassins | Plated Steelcaps → Serylda's Grudge → Guardian Angel → Death's Dance → Bloodthirster → Ravenous Hydra | 17400 |
| 4 | Dégâts AD (jungle) | Jungle | Contre AP | Mercury's Treads → Serylda's Grudge → Mercurial Scimitar → Edge of Night → Maw of Malmortius → Bloodthirster | 16950 |
| 5 | Dégâts AD (jungle) | Jungle | Boule de neige | Berserker's Greaves → Hubris → Bloodthirster → Profane Hydra → Serylda's Grudge → Opportunity | 16050 |
| 6 | Dégâts AD (jungle) | Jungle | Accélération | Ionian Boots of Lucidity → Serylda's Grudge → Ravenous Hydra → Spear of Shojin → Bloodthirster → Death's Dance | 17000 |
| 7 | Dégâts AD (jungle) | Jungle | Anti-soins | Berserker's Greaves → Bloodthirster → Ravenous Hydra → Mortal Reminder → Kraken Slayer → Death's Dance | 17400 |
| 8 | Dégâts AD (jungle) | Jungle | Alternative (sans Bloodthirster) | Berserker's Greaves → Serylda's Grudge → Ravenous Hydra → Kraken Slayer → Death's Dance → Yun Tal Wildarrows | 16700 |
| 9 | Dégâts AD (jungle) | Jungle | Alternative (sans Serylda's Grudge) | Berserker's Greaves → Bloodthirster → Ravenous Hydra → Kraken Slayer → Death's Dance → Yun Tal Wildarrows | 17100 |
| 10 | Dégâts AD (jungle) | Jungle | Alternative (sans Ravenous Hydra) | Berserker's Greaves → Bloodthirster → Serylda's Grudge → Kraken Slayer → Profane Hydra → Death's Dance | 16650 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Guardian Angel (AD) / Maw of Malmortius ou Mercurial Scimitar (AP).
- **Tank** feed / 2 tanks ou plus : **Blade of the Ruined King** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Mercurial Scimitar.
- **En avance** : finir l'objet offensif principal, puis **Hubris** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Gwen

- **Rôles** : Top, Jungle · dégâts magiques · mana · mêlée
- **Kit** : effets à l'impact, dépend des attaques de base, dégâts sur la durée, soins sur soi, très mobile.
- **Répartition des 10 builds** : Combattant (7), Combattant (jungle) (3)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant | Top | Standard | Mercury's Treads → Nashor's Tooth → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Wit's End | 16700 |
| 2 | Combattant | Top | Contre AD / assassins | Plated Steelcaps → Nashor's Tooth → Zhonya's Hourglass → Randuin's Omen → Frozen Heart → Rabadon's Deathcap | 16050 |
| 3 | Combattant | Top | Contre AP | Mercury's Treads → Nashor's Tooth → Banshee's Veil → Rabadon's Deathcap → Wit's End → Kaenic Rookern | 16350 |
| 4 | Combattant | Top | Contre tanks | Mercury's Treads → Nashor's Tooth → Rabadon's Deathcap → Void Staff → Liandry's Torment → Wit's End | 16450 |
| 5 | Combattant | Top | Sustain | Mercury's Treads → Nashor's Tooth → Riftmaker → Rabadon's Deathcap → Spirit Visage → Zhonya's Hourglass | 16700 |
| 6 | Combattant | Top | Anti-soins | Mercury's Treads → Morellonomicon → Nashor's Tooth → Rabadon's Deathcap → Zhonya's Hourglass → Void Staff | 16750 |
| 7 | Combattant (jungle) | Jungle | Standard | Mercury's Treads → Nashor's Tooth → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Riftmaker | 17000 |
| 8 | Combattant | Top | Alternative (sans Nashor's Tooth) | Mercury's Treads → Riftmaker → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Wit's End | 16900 |
| 9 | Combattant (jungle) | Jungle | Alternative (sans Zhonya's Hourglass) | Mercury's Treads → Nashor's Tooth → Rabadon's Deathcap → Void Staff → Riftmaker → Wit's End | 16550 |
| 10 | Combattant (jungle) | Jungle | Alternative (sans Rabadon's Deathcap) | Mercury's Treads → Nashor's Tooth → Zhonya's Hourglass → Void Staff → Riftmaker → Wit's End | 16300 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Randuin's Omen** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Liandry's Torment** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Riftmaker** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Hecarim

- **Rôles** : Jungle · dégâts physiques · mana · mêlée
- **Kit** : engage et contrôles, très mobile, sorts fréquents (accélération rentable), dégâts de zone, ultime décisif.
- **Répartition des 10 builds** : Combattant (jungle) (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant (jungle) | Jungle | Standard | Mercury's Treads → Stridebreaker → Death's Dance → Spear of Shojin → Maw of Malmortius → Black Cleaver | 17050 |
| 2 | Combattant (jungle) | Jungle | Contre AD / assassins | Plated Steelcaps → Stridebreaker → Death's Dance → Randuin's Omen → Frozen Heart → Sterak's Gage | 16200 |
| 3 | Combattant (jungle) | Jungle | Contre AP | Mercury's Treads → Stridebreaker → Maw of Malmortius → Death's Dance → Kaenic Rookern → Spear of Shojin | 16950 |
| 4 | Combattant (jungle) | Jungle | Contre tanks | Mercury's Treads → Serylda's Grudge → Death's Dance → Titanic Hydra → Spear of Shojin → Maw of Malmortius | 17050 |
| 5 | Combattant (jungle) | Jungle | Accélération | Mercury's Treads → Spear of Shojin → Death's Dance → Maw of Malmortius → Black Cleaver → Ravenous Hydra | 17050 |
| 6 | Combattant (jungle) | Jungle | Anti-soins | Mercury's Treads → Chempunk Chainsword → Death's Dance → Stridebreaker → Spear of Shojin → Maw of Malmortius | 17150 |
| 7 | Combattant (jungle) | Jungle | Alternative (sans Stridebreaker) | Mercury's Treads → Spear of Shojin → Death's Dance → Titanic Hydra → Maw of Malmortius → Black Cleaver | 17050 |
| 8 | Combattant (jungle) | Jungle | Alternative (sans Death's Dance) | Mercury's Treads → Stridebreaker → Spear of Shojin → Maw of Malmortius → Black Cleaver → Sundered Sky | 16850 |
| 9 | Combattant (jungle) | Jungle | Alternative (sans Spear of Shojin) | Mercury's Treads → Stridebreaker → Death's Dance → Maw of Malmortius → Black Cleaver → Sundered Sky | 17050 |
| 10 | Combattant (jungle) | Jungle | Alternative (sans Maw of Malmortius) | Mercury's Treads → Stridebreaker → Death's Dance → Spear of Shojin → Sterak's Gage → Black Cleaver | 17150 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Randuin's Omen** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Titanic Hydra** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Titanic Hydra** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Heimerdinger

- **Rôles** : Mid, Top, Support · dégâts magiques · mana · distance
- **Kit** : dégâts sur la durée, sorts fréquents (accélération rentable), gros besoin de mana, dégâts de zone, poke à longue portée.
- **Répartition des 10 builds** : Dégâts AP continu (6), Support dégâts AP continu (4)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP continu | Mid, Top | Standard | Sorcerer's Shoes → Archangel's Staff → Blackfire Torch → Horizon Focus → Rabadon's Deathcap → Void Staff | 16050 |
| 2 | Dégâts AP continu | Mid, Top | Contre tanks | Ionian Boots of Lucidity → Blackfire Torch → Liandry's Torment → Rabadon's Deathcap → Void Staff → Horizon Focus | 15950 |
| 3 | Dégâts AP continu | Mid, Top | Contre AD / assassins | Plated Steelcaps → Blackfire Torch → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Horizon Focus | 16500 |
| 4 | Dégâts AP continu | Mid, Top | Contre AP | Mercury's Treads → Blackfire Torch → Banshee's Veil → Rabadon's Deathcap → Void Staff → Horizon Focus | 16300 |
| 5 | Dégâts AP continu | Mid, Top | Accélération | Ionian Boots of Lucidity → Archangel's Staff → Blackfire Torch → Horizon Focus → Rabadon's Deathcap → Void Staff | 15850 |
| 6 | Dégâts AP continu | Mid, Top | Anti-soins | Sorcerer's Shoes → Blackfire Torch → Morellonomicon → Rabadon's Deathcap → Void Staff → Horizon Focus | 16000 |
| 7 | Support dégâts AP continu | Support | Standard | Zaz'Zak's Realmspike → Sorcerer's Shoes → Blackfire Torch → Horizon Focus → Rabadon's Deathcap → Void Staff | 13150 |
| 8 | Support dégâts AP continu | Support | Contre AD / assassins | Zaz'Zak's Realmspike → Plated Steelcaps → Blackfire Torch → Zhonya's Hourglass → Horizon Focus → Rabadon's Deathcap | 13500 |
| 9 | Support dégâts AP continu | Support | Contre AP | Zaz'Zak's Realmspike → Mercury's Treads → Blackfire Torch → Banshee's Veil → Horizon Focus → Rabadon's Deathcap | 13300 |
| 10 | Support dégâts AP continu | Support | Accélération | Zaz'Zak's Realmspike → Ionian Boots of Lucidity → Archangel's Staff → Blackfire Torch → Horizon Focus → Rabadon's Deathcap | 12850 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Liandry's Torment** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Shadowflame** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Hwei

- **Rôles** : Mid, Support · dégâts magiques · mana · distance
- **Kit** : gros besoin de mana, poke à longue portée, sorts fréquents (accélération rentable), burst, dégâts de zone.
- **Répartition des 10 builds** : Dégâts AP burst (6), Support dégâts AP burst (4)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP burst | Mid | Standard | Sorcerer's Shoes → Archangel's Staff → Luden's Companion → Horizon Focus → Rabadon's Deathcap → Void Staff | 16000 |
| 2 | Dégâts AP burst | Mid | Contre tanks | Ionian Boots of Lucidity → Archangel's Staff → Malignance → Horizon Focus → Rabadon's Deathcap → Void Staff | 15750 |
| 3 | Dégâts AP burst | Mid | Contre AD / assassins | Plated Steelcaps → Archangel's Staff → Zhonya's Hourglass → Horizon Focus → Rabadon's Deathcap → Void Staff | 16600 |
| 4 | Dégâts AP burst | Mid | Contre AP | Mercury's Treads → Archangel's Staff → Banshee's Veil → Horizon Focus → Rabadon's Deathcap → Void Staff | 16400 |
| 5 | Dégâts AP burst | Mid | Boule de neige | Sorcerer's Shoes → Luden's Companion → Shadowflame → Rabadon's Deathcap → Stormsurge → Horizon Focus | 16100 |
| 6 | Dégâts AP burst | Mid | Accélération | Ionian Boots of Lucidity → Archangel's Staff → Malignance → Horizon Focus → Rabadon's Deathcap → Luden's Companion | 15500 |
| 7 | Support dégâts AP burst | Support | Standard | Zaz'Zak's Realmspike → Sorcerer's Shoes → Luden's Companion → Horizon Focus → Rabadon's Deathcap → Malignance | 12800 |
| 8 | Support dégâts AP burst | Support | Contre AD / assassins | Zaz'Zak's Realmspike → Plated Steelcaps → Luden's Companion → Zhonya's Hourglass → Horizon Focus → Rabadon's Deathcap | 13450 |
| 9 | Support dégâts AP burst | Support | Contre AP | Zaz'Zak's Realmspike → Mercury's Treads → Luden's Companion → Banshee's Veil → Horizon Focus → Rabadon's Deathcap | 13250 |
| 10 | Support dégâts AP burst | Support | Boule de neige | Zaz'Zak's Realmspike → Sorcerer's Shoes → Luden's Companion → Horizon Focus → Rabadon's Deathcap → Stormsurge | 12900 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Malignance** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Shadowflame** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Illaoi

- **Rôles** : Top · dégâts physiques · mana · mêlée
- **Kit** : sorts fréquents (accélération rentable), soins sur soi, ultime décisif, dégâts sur la durée, dégâts de zone.
- **Répartition des 10 builds** : Combattant (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant | Top | Standard | Mercury's Treads → Spear of Shojin → Death's Dance → Stridebreaker → Sundered Sky → Black Cleaver | 17050 |
| 2 | Combattant | Top | Contre AD / assassins | Plated Steelcaps → Spear of Shojin → Death's Dance → Randuin's Omen → Frozen Heart → Sterak's Gage | 16000 |
| 3 | Combattant | Top | Contre AP | Mercury's Treads → Spear of Shojin → Spirit Visage → Death's Dance → Maw of Malmortius → Kaenic Rookern | 16350 |
| 4 | Combattant | Top | Contre tanks | Mercury's Treads → Spear of Shojin → Black Cleaver → Death's Dance → Titanic Hydra → Sundered Sky | 17050 |
| 5 | Combattant | Top | Sustain | Mercury's Treads → Spear of Shojin → Death's Dance → Sundered Sky → Spirit Visage → Sterak's Gage | 16650 |
| 6 | Combattant | Top | Split push | Mercury's Treads → Hullbreaker → Spear of Shojin → Death's Dance → Stridebreaker → Sundered Sky | 17050 |
| 7 | Combattant | Top | Anti-soins | Mercury's Treads → Chempunk Chainsword → Spear of Shojin → Death's Dance → Stridebreaker → Sundered Sky | 17150 |
| 8 | Combattant | Top | Alternative (sans Spear of Shojin) | Mercury's Treads → Stridebreaker → Death's Dance → Sundered Sky → Black Cleaver → Experimental Hexplate | 16950 |
| 9 | Combattant | Top | Alternative (sans Death's Dance) | Mercury's Treads → Spear of Shojin → Stridebreaker → Sundered Sky → Black Cleaver → Experimental Hexplate | 16750 |
| 10 | Combattant | Top | Alternative (sans Sundered Sky) | Mercury's Treads → Spear of Shojin → Death's Dance → Stridebreaker → Black Cleaver → Experimental Hexplate | 16950 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Randuin's Omen** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Spirit Visage** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Titanic Hydra** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Titanic Hydra** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Irelia

- **Rôles** : Top, Mid · dégâts physiques · mana · mêlée
- **Kit** : dépend des attaques de base, effets à l'impact, très mobile, soins sur soi, ultime décisif.
- **Répartition des 10 builds** : Dégâts à l'impact (6), Combattant (4)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts à l'impact | Top, Mid | Standard | Berserker's Greaves → Kraken Slayer → Blade of the Ruined King → Bloodthirster → Guinsoo's Rageblade → Terminus | 16700 |
| 2 | Dégâts à l'impact | Top, Mid | Contre tanks | Berserker's Greaves → Blade of the Ruined King → Kraken Slayer → Serylda's Grudge → Guinsoo's Rageblade → Bloodthirster | 16700 |
| 3 | Dégâts à l'impact | Top, Mid | Contre AD / assassins | Plated Steelcaps → Bloodthirster → Guardian Angel → Death's Dance → Kraken Slayer → Blade of the Ruined King | 17300 |
| 4 | Dégâts à l'impact | Top, Mid | Contre AP | Mercury's Treads → Kraken Slayer → Wit's End → Maw of Malmortius → Blade of the Ruined King → Edge of Night | 16350 |
| 5 | Dégâts à l'impact | Top, Mid | Sustain | Berserker's Greaves → Blade of the Ruined King → Kraken Slayer → Bloodthirster → Death's Dance → Ravenous Hydra | 17300 |
| 6 | Dégâts à l'impact | Top, Mid | Anti-soins | Berserker's Greaves → Kraken Slayer → Blade of the Ruined King → Mortal Reminder → Bloodthirster → Guinsoo's Rageblade | 17000 |
| 7 | Combattant | Top, Mid | Standard | Mercury's Treads → Kraken Slayer → Death's Dance → Experimental Hexplate → Trinity Force → Stridebreaker | 17183 |
| 8 | Combattant | Top, Mid | Contre AD / assassins | Plated Steelcaps → Experimental Hexplate → Death's Dance → Randuin's Omen → Guardian Angel → Sterak's Gage | 16600 |
| 9 | Combattant | Top, Mid | Contre AP | Mercury's Treads → Experimental Hexplate → Wit's End → Maw of Malmortius → Death's Dance → Kaenic Rookern | 16350 |
| 10 | Combattant | Top, Mid | Contre tanks | Mercury's Treads → Blade of the Ruined King → Kraken Slayer → Death's Dance → Experimental Hexplate → Trinity Force | 17083 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Wit's End** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Trinity Force** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Trinity Force** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Ivern

- **Rôles** : Jungle · dégâts magiques · mana · distance
- **Kit** : soins / boucliers aux alliés, sorts fréquents (accélération rentable), engage et contrôles.
- **Répartition des 10 builds** : Dégâts AP burst (jungle) (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP burst (jungle) | Jungle | Standard | Sorcerer's Shoes → Shadowflame → Horizon Focus → Rabadon's Deathcap → Void Staff → Malignance | 16250 |
| 2 | Dégâts AP burst (jungle) | Jungle | Contre tanks | Ionian Boots of Lucidity → Malignance → Horizon Focus → Rabadon's Deathcap → Void Staff → Liandry's Torment | 15850 |
| 3 | Dégâts AP burst (jungle) | Jungle | Contre AD / assassins | Plated Steelcaps → Zhonya's Hourglass → Guardian Angel → Rabadon's Deathcap → Void Staff → Randuin's Omen | 16850 |
| 4 | Dégâts AP burst (jungle) | Jungle | Contre AP | Mercury's Treads → Banshee's Veil → Rabadon's Deathcap → Void Staff → Kaenic Rookern → Mercurial Scimitar | 16850 |
| 5 | Dégâts AP burst (jungle) | Jungle | Accélération | Ionian Boots of Lucidity → Shadowflame → Horizon Focus → Cryptbloom → Rabadon's Deathcap → Malignance | 16050 |
| 6 | Dégâts AP burst (jungle) | Jungle | Anti-soins | Sorcerer's Shoes → Shadowflame → Morellonomicon → Rabadon's Deathcap → Void Staff → Horizon Focus | 16400 |
| 7 | Dégâts AP burst (jungle) | Jungle | Alternative (sans Shadowflame) | Sorcerer's Shoes → Malignance → Horizon Focus → Rabadon's Deathcap → Void Staff → Zhonya's Hourglass | 16300 |
| 8 | Dégâts AP burst (jungle) | Jungle | Alternative (sans Horizon Focus) | Sorcerer's Shoes → Shadowflame → Rabadon's Deathcap → Void Staff → Malignance → Zhonya's Hourglass | 16750 |
| 9 | Dégâts AP burst (jungle) | Jungle | Alternative (sans Rabadon's Deathcap) | Sorcerer's Shoes → Shadowflame → Horizon Focus → Void Staff → Malignance → Zhonya's Hourglass | 16000 |
| 10 | Dégâts AP burst (jungle) | Jungle | Alternative (sans Void Staff) | Sorcerer's Shoes → Cryptbloom → Horizon Focus → Rabadon's Deathcap → Shadowflame → Malignance | 16250 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Liandry's Torment** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Stormsurge** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Janna

- **Rôles** : Support · dégâts magiques · mana · distance
- **Kit** : soins / boucliers aux alliés, sorts fréquents (accélération rentable), engage et contrôles, ultime décisif.
- **Répartition des 10 builds** : Support enchanteur (7), Support dégâts AP burst (3)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Support enchanteur | Support | Standard | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Ardent Censer → Dawncore → Staff of Flowing Water | 10150 |
| 2 | Support enchanteur | Support | Contre AD / assassins | Celestial Opposition → Plated Steelcaps → Mikael's Blessing → Ardent Censer → Frozen Heart → Locket of the Iron Solari | 10400 |
| 3 | Support enchanteur | Support | Accélération | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Staff of Flowing Water → Redemption → Ardent Censer | 9950 |
| 4 | Support enchanteur | Support | Anti-soins | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Ardent Censer → Morellonomicon → Dawncore | 10750 |
| 5 | Support enchanteur | Support | Contre AP | Celestial Opposition → Mercury's Treads → Mikael's Blessing → Ardent Censer → Locket of the Iron Solari → Dawncore | 10450 |
| 6 | Support dégâts AP burst | Support | Standard | Zaz'Zak's Realmspike → Ionian Boots of Lucidity → Malignance → Horizon Focus → Rabadon's Deathcap → Void Staff | 12850 |
| 7 | Support dégâts AP burst | Support | Contre AD / assassins | Zaz'Zak's Realmspike → Plated Steelcaps → Malignance → Zhonya's Hourglass → Thornmail → Randuin's Omen | 12300 |
| 8 | Support dégâts AP burst | Support | Contre AP | Zaz'Zak's Realmspike → Mercury's Treads → Malignance → Banshee's Veil → Kaenic Rookern → Vigilant Wardstone | 12150 |
| 9 | Support enchanteur | Support | Alternative (sans Mikael's Blessing) | Dream Maker → Ionian Boots of Lucidity → Ardent Censer → Dawncore → Staff of Flowing Water → Redemption | 10150 |
| 10 | Support enchanteur | Support | Alternative (sans Ardent Censer) | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Dawncore → Staff of Flowing Water → Redemption | 10250 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Frozen Heart** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Abyssal Mask** en objet suivant.
- **Assassin** feed qui vous cible : protéger le carry visé (Knight's Vow, Locket of the Iron Solari) ; pour vous : Frozen Heart.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : poser plus de balises de contrôle, jouer pour les objectifs ; objet d'équipe suivant : **Locket of the Iron Solari**.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Frozen Heart**.

### Jarvan IV

- **Rôles** : Jungle · dégâts physiques · mana · mêlée
- **Kit** : engage et contrôles, très mobile, ultime décisif, sorts fréquents (accélération rentable), burst.
- **Répartition des 10 builds** : Combattant (jungle) (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant (jungle) | Jungle | Standard | Mercury's Treads → Stridebreaker → Death's Dance → Spear of Shojin → Maw of Malmortius → Experimental Hexplate | 17050 |
| 2 | Combattant (jungle) | Jungle | Contre AD / assassins | Plated Steelcaps → Death's Dance → Randuin's Omen → Frozen Heart → Sterak's Gage → Guardian Angel | 16100 |
| 3 | Combattant (jungle) | Jungle | Contre AP | Mercury's Treads → Spear of Shojin → Maw of Malmortius → Death's Dance → Kaenic Rookern → Jak'Sho, The Protean | 16850 |
| 4 | Combattant (jungle) | Jungle | Contre tanks | Mercury's Treads → Serylda's Grudge → Death's Dance → Titanic Hydra → Spear of Shojin → Maw of Malmortius | 17050 |
| 5 | Combattant (jungle) | Jungle | Accélération | Mercury's Treads → Spear of Shojin → Death's Dance → Maw of Malmortius → Black Cleaver → Experimental Hexplate | 16750 |
| 6 | Combattant (jungle) | Jungle | Anti-soins | Mercury's Treads → Chempunk Chainsword → Death's Dance → Spear of Shojin → Stridebreaker → Maw of Malmortius | 17150 |
| 7 | Combattant (jungle) | Jungle | Alternative (sans Stridebreaker) | Mercury's Treads → Experimental Hexplate → Death's Dance → Spear of Shojin → Maw of Malmortius → Titanic Hydra | 17050 |
| 8 | Combattant (jungle) | Jungle | Alternative (sans Death's Dance) | Mercury's Treads → Spear of Shojin → Stridebreaker → Maw of Malmortius → Experimental Hexplate → Black Cleaver | 16750 |
| 9 | Combattant (jungle) | Jungle | Alternative (sans Spear of Shojin) | Mercury's Treads → Stridebreaker → Death's Dance → Maw of Malmortius → Experimental Hexplate → Black Cleaver | 16950 |
| 10 | Combattant (jungle) | Jungle | Alternative (sans Maw of Malmortius) | Mercury's Treads → Stridebreaker → Death's Dance → Spear of Shojin → Sterak's Gage → Experimental Hexplate | 17150 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Randuin's Omen** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Serylda's Grudge** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Black Cleaver** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Jax

- **Rôles** : Top, Jungle · dégâts physiques · mana · mêlée
- **Kit** : dépend des attaques de base, effets à l'impact, attaques entre les sorts, sorts fréquents (accélération rentable), dégâts sur la durée.
- **Répartition des 10 builds** : Dégâts à l'impact (5), Dégâts à l'impact (jungle) (5)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts à l'impact | Top | Standard | Berserker's Greaves → Trinity Force → Kraken Slayer → Blade of the Ruined King → Guinsoo's Rageblade → Nashor's Tooth | 16533 |
| 2 | Dégâts à l'impact | Top | Contre tanks | Berserker's Greaves → Blade of the Ruined King → Kraken Slayer → Trinity Force → Guinsoo's Rageblade → Terminus | 16633 |
| 3 | Dégâts à l'impact | Top | Contre AD / assassins | Plated Steelcaps → Kraken Slayer → Guardian Angel → Death's Dance → Trinity Force → Blade of the Ruined King | 17233 |
| 4 | Dégâts à l'impact | Top | Contre AP | Berserker's Greaves → Kraken Slayer → Wit's End → Trinity Force → Banshee's Veil → Blade of the Ruined King | 16433 |
| 5 | Dégâts à l'impact | Top | Accélération | Berserker's Greaves → Trinity Force → Kraken Slayer → Blade of the Ruined King → Nashor's Tooth → Spear of Shojin | 16633 |
| 6 | Dégâts à l'impact (jungle) | Jungle | Anti-soins | Berserker's Greaves → Trinity Force → Kraken Slayer → Mortal Reminder → Blade of the Ruined King → Guinsoo's Rageblade | 16933 |
| 7 | Dégâts à l'impact (jungle) | Jungle | Alternative (sans Trinity Force) | Berserker's Greaves → Kraken Slayer → Blade of the Ruined King → Guinsoo's Rageblade → Nashor's Tooth → Bloodthirster | 16600 |
| 8 | Dégâts à l'impact (jungle) | Jungle | Alternative (sans Kraken Slayer) | Berserker's Greaves → Trinity Force → Blade of the Ruined King → Guinsoo's Rageblade → Nashor's Tooth → Bloodthirster | 16933 |
| 9 | Dégâts à l'impact (jungle) | Jungle | Alternative (sans Blade of the Ruined King) | Berserker's Greaves → Trinity Force → Kraken Slayer → Guinsoo's Rageblade → Nashor's Tooth → Bloodthirster | 16733 |
| 10 | Dégâts à l'impact (jungle) | Jungle | Alternative (sans Trinity Force, Kraken Slayer) | Berserker's Greaves → Blade of the Ruined King → Guinsoo's Rageblade → Nashor's Tooth → Terminus → Bloodthirster | 16600 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Wit's End** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Terminus** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Terminus** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Jayce

- **Rôles** : Top, Mid · dégâts physiques · mana · distance
- **Kit** : burst, poke à longue portée, sorts fréquents (accélération rentable), gros besoin de mana.
- **Répartition des 10 builds** : Dégâts AD létalité (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD létalité | Top, Mid | Standard | Ionian Boots of Lucidity → Profane Hydra → Serylda's Grudge → Voltaic Cyclosword → Opportunity → Bloodthirster | 15850 |
| 2 | Dégâts AD létalité | Top, Mid | Contre tanks | Ionian Boots of Lucidity → Manamune → Serylda's Grudge → Bloodthirster → Eclipse → Death's Dance | 16400 |
| 3 | Dégâts AD létalité | Top, Mid | Contre AD / assassins | Plated Steelcaps → Bloodthirster → Guardian Angel → Death's Dance → Profane Hydra → Eclipse | 16850 |
| 4 | Dégâts AD létalité | Top, Mid | Contre AP | Mercury's Treads → Edge of Night → Mercurial Scimitar → Maw of Malmortius → Profane Hydra → Serylda's Grudge | 16400 |
| 5 | Dégâts AD létalité | Top, Mid | Boule de neige | Ionian Boots of Lucidity → Hubris → Opportunity → Profane Hydra → Voltaic Cyclosword → Youmuu's Ghostblade | 15250 |
| 6 | Dégâts AD létalité | Top, Mid | Accélération | Ionian Boots of Lucidity → Serylda's Grudge → Profane Hydra → Axiom Arc → Voltaic Cyclosword → Spear of Shojin | 15600 |
| 7 | Dégâts AD létalité | Top, Mid | Partie longue | Ionian Boots of Lucidity → Manamune → Serylda's Grudge → Profane Hydra → Voltaic Cyclosword → Opportunity | 15350 |
| 8 | Dégâts AD létalité | Top, Mid | Poke | Ionian Boots of Lucidity → Profane Hydra → Serylda's Grudge → Voltaic Cyclosword → Axiom Arc → Hubris | 15500 |
| 9 | Dégâts AD létalité | Top, Mid | Anti-soins | Ionian Boots of Lucidity → Profane Hydra → Voltaic Cyclosword → Mortal Reminder → Opportunity → Bloodthirster | 16150 |
| 10 | Dégâts AD létalité | Top, Mid | Alternative (sans Profane Hydra) | Ionian Boots of Lucidity → Serylda's Grudge → Voltaic Cyclosword → Opportunity → Bloodthirster → Hubris | 16000 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Guardian Angel (AD) / Maw of Malmortius ou Mercurial Scimitar (AP).
- **Tank** feed / 2 tanks ou plus : **Manamune** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Mercurial Scimitar.
- **En avance** : finir l'objet offensif principal, puis **Hubris** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Jhin

- **Rôles** : ADC · dégâts physiques · mana · distance
- **Kit** : synergie coup critique, burst, dépend des attaques de base, ultime décisif, poke à longue portée.
- **Répartition des 10 builds** : Dégâts AD critique (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD critique | ADC | Standard | Berserker's Greaves → The Collector → Infinity Edge → Lord Dominik's Regards → Essence Reaver → Bloodthirster | 16950 |
| 2 | Dégâts AD critique | ADC | Contre tanks | Berserker's Greaves → Essence Reaver → Infinity Edge → Kraken Slayer → Lord Dominik's Regards → Bloodthirster | 16950 |
| 3 | Dégâts AD critique | ADC | Contre AD / assassins | Plated Steelcaps → Bloodthirster → Guardian Angel → Death's Dance → Infinity Edge → Lord Dominik's Regards | 17650 |
| 4 | Dégâts AD critique | ADC | Contre AP | Mercury's Treads → Edge of Night → Mercurial Scimitar → Infinity Edge → Lord Dominik's Regards → Maw of Malmortius | 17100 |
| 5 | Dégâts AD critique | ADC | Boule de neige | Berserker's Greaves → The Collector → Infinity Edge → Lord Dominik's Regards → Hubris → Opportunity | 16350 |
| 6 | Dégâts AD critique | ADC | Anti-soins | Berserker's Greaves → The Collector → Infinity Edge → Mortal Reminder → Essence Reaver → Bloodthirster | 17150 |
| 7 | Dégâts AD critique | ADC | Alternative (sans The Collector) | Berserker's Greaves → Essence Reaver → Infinity Edge → Lord Dominik's Regards → Bloodthirster → Yun Tal Wildarrows | 16950 |
| 8 | Dégâts AD critique | ADC | Alternative (sans Infinity Edge) | Berserker's Greaves → The Collector → Essence Reaver → Lord Dominik's Regards → Bloodthirster → Yun Tal Wildarrows | 16500 |
| 9 | Dégâts AD critique | ADC | Alternative (sans Essence Reaver) | Berserker's Greaves → The Collector → Infinity Edge → Lord Dominik's Regards → Bloodthirster → Yun Tal Wildarrows | 17050 |
| 10 | Dégâts AD critique | ADC | Alternative (sans The Collector, Infinity Edge) | Berserker's Greaves → Essence Reaver → Bloodthirster → Lord Dominik's Regards → Yun Tal Wildarrows → Axiom Arc | 16250 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Guardian Angel (AD) / Maw of Malmortius ou Mercurial Scimitar (AP).
- **Tank** feed / 2 tanks ou plus : **Kraken Slayer** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Mortal Reminder** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Mercurial Scimitar.
- **En avance** : finir l'objet offensif principal, puis **Hubris** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Jinx

- **Rôles** : ADC · dégâts physiques · mana · distance
- **Kit** : dépend des attaques de base, synergie coup critique, dégâts de zone, poke à longue portée.
- **Répartition des 10 builds** : Dégâts AD critique (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD critique | ADC | Standard | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Kraken Slayer → Bloodthirster | 17050 |
| 2 | Dégâts AD critique | ADC | Contre AD / assassins | Plated Steelcaps → Yun Tal Wildarrows → Guardian Angel → Death's Dance → Infinity Edge → Lord Dominik's Regards | 17250 |
| 3 | Dégâts AD critique | ADC | Contre AP | Berserker's Greaves → Yun Tal Wildarrows → Mercurial Scimitar → Infinity Edge → Lord Dominik's Regards → Kraken Slayer | 16850 |
| 4 | Dégâts AD critique | ADC | Boule de neige | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Kraken Slayer → The Collector | 16650 |
| 5 | Dégâts AD critique | ADC | Poke | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Kraken Slayer → Essence Reaver | 16550 |
| 6 | Dégâts AD critique | ADC | Anti-soins | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Mortal Reminder → Kraken Slayer → Bloodthirster | 17250 |
| 7 | Dégâts AD critique | ADC | Alternative (sans Yun Tal Wildarrows) | Berserker's Greaves → Essence Reaver → Infinity Edge → Kraken Slayer → Lord Dominik's Regards → Bloodthirster | 16950 |
| 8 | Dégâts AD critique | ADC | Alternative (sans Infinity Edge) | Berserker's Greaves → Yun Tal Wildarrows → Kraken Slayer → Lord Dominik's Regards → Bloodthirster → Essence Reaver | 16500 |
| 9 | Dégâts AD critique | ADC | Alternative (sans Kraken Slayer) | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Bloodthirster → Essence Reaver | 16950 |
| 10 | Dégâts AD critique | ADC | Alternative (sans Yun Tal Wildarrows, Infinity Edge) | Berserker's Greaves → Kraken Slayer → Bloodthirster → Lord Dominik's Regards → Essence Reaver → Statikk Shiv | 16200 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Guardian Angel (AD) / Maw of Malmortius ou Mercurial Scimitar (AP).
- **Tank** feed / 2 tanks ou plus : **Blade of the Ruined King** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Mortal Reminder** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Mercurial Scimitar.
- **En avance** : finir l'objet offensif principal, puis **The Collector** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### K'Sante

- **Rôles** : Top · dégâts physiques · mana · mêlée
- **Kit** : engage et contrôles, naturellement résistant, sorts fréquents (accélération rentable), très mobile, ultime décisif.
- **Répartition des 10 builds** : Combattant (3), Tank (7)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant | Top | Standard | Mercury's Treads → Spear of Shojin → Jak'Sho, The Protean → Randuin's Omen → Death's Dance → Sterak's Gage | 16750 |
| 2 | Combattant | Top | Contre AD / assassins | Plated Steelcaps → Death's Dance → Randuin's Omen → Frozen Heart → Thornmail → Jak'Sho, The Protean | 15350 |
| 3 | Combattant | Top | Contre AP | Mercury's Treads → Death's Dance → Jak'Sho, The Protean → Kaenic Rookern → Abyssal Mask → Randuin's Omen | 16000 |
| 4 | Tank | Top | Standard | Mercury's Treads → Jak'Sho, The Protean → Heartsteel → Warmog's Armor → Randuin's Omen → Unending Despair | 16050 |
| 5 | Tank | Top | Contre AD / assassins | Plated Steelcaps → Randuin's Omen → Frozen Heart → Jak'Sho, The Protean → Heartsteel → Warmog's Armor | 15700 |
| 6 | Tank | Top | Contre AP | Mercury's Treads → Jak'Sho, The Protean → Kaenic Rookern → Abyssal Mask → Warmog's Armor → Heartsteel | 16100 |
| 7 | Tank | Top | Engagement | Mercury's Treads → Jak'Sho, The Protean → Dead Man's Plate → Zeke's Convergence → Heartsteel → Warmog's Armor | 15650 |
| 8 | Tank | Top | Accélération | Mercury's Treads → Jak'Sho, The Protean → Frozen Heart → Heartsteel → Warmog's Armor → Randuin's Omen | 15750 |
| 9 | Tank | Top | Anti-soins | Mercury's Treads → Thornmail → Jak'Sho, The Protean → Heartsteel → Warmog's Armor → Randuin's Omen | 15700 |
| 10 | Tank | Top | Alternative (sans Jak'Sho, The Protean) | Mercury's Treads → Heartsteel → Randuin's Omen → Warmog's Armor → Unending Despair → Sunfire Aegis | 15550 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Frozen Heart** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Frozen Heart** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Frozen Heart** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Frozen Heart**.

### Kai'Sa

- **Rôles** : ADC · dégâts mixtes · mana · distance
- **Kit** : dépend des attaques de base, effets à l'impact, burst, très mobile.
- **Répartition des 10 builds** : Dégâts à l'impact (10)
- **Particularité** : Hybride : ADC_ONHIT par défaut, ADC_CRIT ou build hybride AP selon la règle « ap_variant ».

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts à l'impact | ADC | Standard | Berserker's Greaves → Kraken Slayer → Blade of the Ruined King → Nashor's Tooth → Bloodthirster → Guinsoo's Rageblade | 16600 |
| 2 | Dégâts à l'impact | ADC | Contre tanks | Berserker's Greaves → Kraken Slayer → Blade of the Ruined King → Serylda's Grudge → Guinsoo's Rageblade → Nashor's Tooth | 16200 |
| 3 | Dégâts à l'impact | ADC | Contre AD / assassins | Plated Steelcaps → Bloodthirster → Guardian Angel → Death's Dance → Zhonya's Hourglass → Kraken Slayer | 17350 |
| 4 | Dégâts à l'impact | ADC | Contre AP | Berserker's Greaves → Kraken Slayer → Mercurial Scimitar → Banshee's Veil → Maw of Malmortius → Blade of the Ruined King | 16600 |
| 5 | Dégâts à l'impact | ADC | Anti-soins | Berserker's Greaves → Kraken Slayer → Blade of the Ruined King → Mortal Reminder → Nashor's Tooth → Bloodthirster | 16900 |
| 6 | Dégâts à l'impact | ADC | Alternative (sans Kraken Slayer) | Berserker's Greaves → Blade of the Ruined King → Nashor's Tooth → Bloodthirster → Guinsoo's Rageblade → Yun Tal Wildarrows | 16600 |
| 7 | Dégâts à l'impact | ADC | Alternative (sans Blade of the Ruined King) | Berserker's Greaves → Kraken Slayer → Nashor's Tooth → Bloodthirster → Guinsoo's Rageblade → Yun Tal Wildarrows | 16400 |
| 8 | Dégâts à l'impact | ADC | Alternative (sans Nashor's Tooth) | Berserker's Greaves → Kraken Slayer → Blade of the Ruined King → Bloodthirster → Guinsoo's Rageblade → Yun Tal Wildarrows | 16700 |
| 9 | Dégâts à l'impact | ADC | Alternative (sans Kraken Slayer, Blade of the Ruined King) | Berserker's Greaves → Nashor's Tooth → Bloodthirster → Guinsoo's Rageblade → Yun Tal Wildarrows → Terminus | 16400 |
| 10 | Dégâts à l'impact | ADC | Alternative (sans Blade of the Ruined King, Nashor's Tooth) | Berserker's Greaves → Kraken Slayer → Bloodthirster → Guinsoo's Rageblade → Yun Tal Wildarrows → Terminus | 16500 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Guardian Angel (AD) / Maw of Malmortius ou Mercurial Scimitar (AP).
- **Tank** feed / 2 tanks ou plus : **Serylda's Grudge** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Mercurial Scimitar.
- **En avance** : finir l'objet offensif principal, puis **Hubris** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Kalista

- **Rôles** : ADC · dégâts physiques · mana · distance
- **Kit** : dépend des attaques de base, effets à l'impact, dégâts sur la durée.
- **Répartition des 10 builds** : Dégâts à l'impact (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts à l'impact | ADC | Standard | Berserker's Greaves → Kraken Slayer → Blade of the Ruined King → Bloodthirster → Serylda's Grudge → Yun Tal Wildarrows | 16700 |
| 2 | Dégâts à l'impact | ADC | Contre tanks | Berserker's Greaves → Kraken Slayer → Blade of the Ruined King → Serylda's Grudge → Bloodthirster → Guinsoo's Rageblade | 16700 |
| 3 | Dégâts à l'impact | ADC | Contre AD / assassins | Plated Steelcaps → Bloodthirster → Guardian Angel → Death's Dance → Kraken Slayer → Blade of the Ruined King | 17300 |
| 4 | Dégâts à l'impact | ADC | Contre AP | Berserker's Greaves → Kraken Slayer → Mercurial Scimitar → Maw of Malmortius → Edge of Night → Blade of the Ruined King | 16600 |
| 5 | Dégâts à l'impact | ADC | Boule de neige | Berserker's Greaves → Kraken Slayer → Blade of the Ruined King → Bloodthirster → Hubris → Serylda's Grudge | 16700 |
| 6 | Dégâts à l'impact | ADC | Sustain | Berserker's Greaves → Kraken Slayer → Bloodthirster → Blade of the Ruined King → Ravenous Hydra → Serylda's Grudge | 17000 |
| 7 | Dégâts à l'impact | ADC | Anti-soins | Berserker's Greaves → Kraken Slayer → Blade of the Ruined King → Mortal Reminder → Bloodthirster → Yun Tal Wildarrows | 17000 |
| 8 | Dégâts à l'impact | ADC | Alternative (sans Kraken Slayer) | Berserker's Greaves → Blade of the Ruined King → Bloodthirster → Serylda's Grudge → Yun Tal Wildarrows → Statikk Shiv | 16400 |
| 9 | Dégâts à l'impact | ADC | Alternative (sans Blade of the Ruined King) | Berserker's Greaves → Kraken Slayer → Bloodthirster → Serylda's Grudge → Yun Tal Wildarrows → Statikk Shiv | 16200 |
| 10 | Dégâts à l'impact | ADC | Alternative (sans Bloodthirster) | Berserker's Greaves → Kraken Slayer → Blade of the Ruined King → Serylda's Grudge → Yun Tal Wildarrows → Statikk Shiv | 16000 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Guardian Angel (AD) / Maw of Malmortius ou Mercurial Scimitar (AP).
- **Tank** feed / 2 tanks ou plus : **Guinsoo's Rageblade** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Mercurial Scimitar.
- **En avance** : finir l'objet offensif principal, puis **Hubris** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Karma

- **Rôles** : Support, Mid, Top · dégâts magiques · mana · distance
- **Kit** : sorts fréquents (accélération rentable), soins / boucliers aux alliés, gros besoin de mana, poke à longue portée.
- **Répartition des 10 builds** : Dégâts AP burst (3), Support enchanteur (5), Support dégâts AP burst (2)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP burst | Mid, Top | Standard | Sorcerer's Shoes → Archangel's Staff → Shadowflame → Horizon Focus → Rabadon's Deathcap → Void Staff | 16450 |
| 2 | Dégâts AP burst | Mid, Top | Contre tanks | Ionian Boots of Lucidity → Archangel's Staff → Luden's Companion → Horizon Focus → Rabadon's Deathcap → Void Staff | 15800 |
| 3 | Dégâts AP burst | Mid, Top | Contre AD / assassins | Plated Steelcaps → Archangel's Staff → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Horizon Focus | 16600 |
| 4 | Support enchanteur | Support | Standard | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Ardent Censer → Staff of Flowing Water → Dawncore | 10150 |
| 5 | Support enchanteur | Support | Contre AD / assassins | Celestial Opposition → Plated Steelcaps → Frozen Heart → Mikael's Blessing → Ardent Censer → Staff of Flowing Water | 10450 |
| 6 | Support enchanteur | Support | Accélération | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Staff of Flowing Water → Redemption → Ardent Censer | 9950 |
| 7 | Support enchanteur | Support | Poke | Zaz'Zak's Realmspike → Ionian Boots of Lucidity → Mikael's Blessing → Ardent Censer → Staff of Flowing Water → Redemption | 9950 |
| 8 | Support enchanteur | Support | Anti-soins | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Ardent Censer → Morellonomicon → Staff of Flowing Water | 10500 |
| 9 | Support dégâts AP burst | Support | Standard | Zaz'Zak's Realmspike → Sorcerer's Shoes → Luden's Companion → Horizon Focus → Rabadon's Deathcap → Void Staff | 13100 |
| 10 | Support dégâts AP burst | Support | Contre AD / assassins | Zaz'Zak's Realmspike → Plated Steelcaps → Zhonya's Hourglass → Horizon Focus → Rabadon's Deathcap → Void Staff | 13700 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Luden's Companion** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Stormsurge** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Karthus

- **Rôles** : Jungle, Mid, ADC · dégâts magiques · mana · distance
- **Kit** : gros besoin de mana, dégâts sur la durée, dégâts de zone, ultime décisif, sorts fréquents (accélération rentable).
- **Répartition des 10 builds** : Dégâts AP continu (4), Dégâts AP continu (jungle) (6)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP continu | Mid, ADC | Standard | Sorcerer's Shoes → Archangel's Staff → Malignance → Rabadon's Deathcap → Void Staff → Blackfire Torch | 16000 |
| 2 | Dégâts AP continu | Mid, ADC | Contre tanks | Ionian Boots of Lucidity → Archangel's Staff → Malignance → Rabadon's Deathcap → Void Staff → Blackfire Torch | 15800 |
| 3 | Dégâts AP continu | Mid, ADC | Contre AD / assassins | Plated Steelcaps → Archangel's Staff → Zhonya's Hourglass → Rabadon's Deathcap → Malignance → Blackfire Torch | 16350 |
| 4 | Dégâts AP continu | Mid, ADC | Contre AP | Mercury's Treads → Archangel's Staff → Banshee's Veil → Rabadon's Deathcap → Malignance → Blackfire Torch | 16150 |
| 5 | Dégâts AP continu (jungle) | Jungle | Anti-soins | Sorcerer's Shoes → Archangel's Staff → Malignance → Rabadon's Deathcap → Blackfire Torch → Morellonomicon | 15850 |
| 6 | Dégâts AP continu (jungle) | Jungle | Alternative (sans Archangel's Staff) | Sorcerer's Shoes → Malignance → Blackfire Torch → Rabadon's Deathcap → Void Staff → Horizon Focus | 15850 |
| 7 | Dégâts AP continu (jungle) | Jungle | Alternative (sans Malignance) | Sorcerer's Shoes → Archangel's Staff → Blackfire Torch → Rabadon's Deathcap → Void Staff → Horizon Focus | 16050 |
| 8 | Dégâts AP continu (jungle) | Jungle | Alternative (sans Rabadon's Deathcap) | Sorcerer's Shoes → Archangel's Staff → Malignance → Void Staff → Horizon Focus → Blackfire Torch | 15250 |
| 9 | Dégâts AP continu (jungle) | Jungle | Alternative (sans Blackfire Torch) | Sorcerer's Shoes → Archangel's Staff → Malignance → Rabadon's Deathcap → Void Staff → Horizon Focus | 15950 |
| 10 | Dégâts AP continu (jungle) | Jungle | Alternative (sans Archangel's Staff, Malignance) | Sorcerer's Shoes → Shadowflame → Blackfire Torch → Rabadon's Deathcap → Void Staff → Horizon Focus | 16350 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Liandry's Torment** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Shadowflame** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Kassadin

- **Rôles** : Mid · dégâts magiques · mana · mêlée
- **Kit** : gros besoin de mana, burst, très mobile, sorts fréquents (accélération rentable), attaques entre les sorts.
- **Répartition des 10 builds** : Dégâts AP burst (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP burst | Mid | Standard | Sorcerer's Shoes → Archangel's Staff → Luden's Companion → Rabadon's Deathcap → Void Staff → Shadowflame | 16450 |
| 2 | Dégâts AP burst | Mid | Contre tanks | Ionian Boots of Lucidity → Archangel's Staff → Malignance → Rabadon's Deathcap → Void Staff → Luden's Companion | 15750 |
| 3 | Dégâts AP burst | Mid | Contre AD / assassins | Plated Steelcaps → Archangel's Staff → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Luden's Companion | 16600 |
| 4 | Dégâts AP burst | Mid | Contre AP | Mercury's Treads → Archangel's Staff → Banshee's Veil → Rabadon's Deathcap → Void Staff → Luden's Companion | 16400 |
| 5 | Dégâts AP burst | Mid | Boule de neige | Sorcerer's Shoes → Archangel's Staff → Shadowflame → Rabadon's Deathcap → Stormsurge → Luden's Companion | 16250 |
| 6 | Dégâts AP burst | Mid | Anti-soins | Sorcerer's Shoes → Archangel's Staff → Morellonomicon → Rabadon's Deathcap → Void Staff → Luden's Companion | 16100 |
| 7 | Dégâts AP burst | Mid | Alternative (sans Archangel's Staff) | Sorcerer's Shoes → Luden's Companion → Rabadon's Deathcap → Void Staff → Shadowflame → Malignance | 16250 |
| 8 | Dégâts AP burst | Mid | Alternative (sans Luden's Companion) | Sorcerer's Shoes → Archangel's Staff → Shadowflame → Rabadon's Deathcap → Void Staff → Malignance | 16400 |
| 9 | Dégâts AP burst | Mid | Alternative (sans Rabadon's Deathcap) | Sorcerer's Shoes → Archangel's Staff → Luden's Companion → Void Staff → Shadowflame → Malignance | 15650 |
| 10 | Dégâts AP burst | Mid | Alternative (sans Void Staff) | Sorcerer's Shoes → Archangel's Staff → Luden's Companion → Rabadon's Deathcap → Shadowflame → Malignance | 16150 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Malignance** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Stormsurge** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Katarina

- **Rôles** : Mid · dégâts mixtes · sans mana · mêlée
- **Kit** : burst, dégâts de zone, très mobile, effets à l'impact, ultime décisif.
- **Répartition des 10 builds** : Dégâts AP burst (10)
- **Particularité** : Hybride : AP_ASSASSIN, build « Hybride à l'impact » possible.

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP burst | Mid | Standard | Sorcerer's Shoes → Shadowflame → Rabadon's Deathcap → Void Staff → Stormsurge → Nashor's Tooth | 16500 |
| 2 | Dégâts AP burst | Mid | Contre tanks | Mercury's Treads → Nashor's Tooth → Rabadon's Deathcap → Void Staff → Shadowflame → Horizon Focus | 16600 |
| 3 | Dégâts AP burst | Mid | Contre AD / assassins | Plated Steelcaps → Shadowflame → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Guardian Angel | 17350 |
| 4 | Dégâts AP burst | Mid | Contre AP | Mercury's Treads → Shadowflame → Banshee's Veil → Rabadon's Deathcap → Void Staff → Stormsurge | 16750 |
| 5 | Dégâts AP burst | Mid | Anti-soins | Sorcerer's Shoes → Shadowflame → Morellonomicon → Rabadon's Deathcap → Void Staff → Stormsurge | 16450 |
| 6 | Dégâts AP burst | Mid | Alternative (sans Shadowflame) | Sorcerer's Shoes → Stormsurge → Rabadon's Deathcap → Void Staff → Nashor's Tooth → Horizon Focus | 16050 |
| 7 | Dégâts AP burst | Mid | Alternative (sans Rabadon's Deathcap) | Sorcerer's Shoes → Shadowflame → Stormsurge → Void Staff → Nashor's Tooth → Horizon Focus | 15750 |
| 8 | Dégâts AP burst | Mid | Alternative (sans Void Staff) | Sorcerer's Shoes → Shadowflame → Stormsurge → Rabadon's Deathcap → Nashor's Tooth → Cryptbloom | 16500 |
| 9 | Dégâts AP burst | Mid | Alternative (sans Stormsurge) | Sorcerer's Shoes → Shadowflame → Rabadon's Deathcap → Void Staff → Nashor's Tooth → Horizon Focus | 16450 |
| 10 | Dégâts AP burst | Mid | Alternative (sans Shadowflame, Rabadon's Deathcap) | Sorcerer's Shoes → Stormsurge → Nashor's Tooth → Void Staff → Horizon Focus → Zhonya's Hourglass | 15800 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Horizon Focus** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Horizon Focus** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Kayle

- **Rôles** : Top, Mid · dégâts mixtes · mana · distance
- **Kit** : dépend des attaques de base, effets à l'impact, dégâts de zone.
- **Répartition des 10 builds** : Dégâts à l'impact (10)
- **Particularité** : Montée en puissance : priorité Nashor + Rabadon ; à distance dès le niveau 6.

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts à l'impact | Top, Mid | Standard | Berserker's Greaves → Nashor's Tooth → Rabadon's Deathcap → Void Staff → Guinsoo's Rageblade → Kraken Slayer | 16500 |
| 2 | Dégâts à l'impact | Top, Mid | Contre tanks | Berserker's Greaves → Nashor's Tooth → Rabadon's Deathcap → Void Staff → Blade of the Ruined King → Guinsoo's Rageblade | 16700 |
| 3 | Dégâts à l'impact | Top, Mid | Contre AD / assassins | Plated Steelcaps → Nashor's Tooth → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Guardian Angel | 17050 |
| 4 | Dégâts à l'impact | Top, Mid | Contre AP | Berserker's Greaves → Nashor's Tooth → Banshee's Veil → Rabadon's Deathcap → Wit's End → Void Staff | 16300 |
| 5 | Dégâts à l'impact | Top, Mid | Boule de neige | Berserker's Greaves → Nashor's Tooth → Rabadon's Deathcap → Void Staff → Guinsoo's Rageblade → Shadowflame | 16700 |
| 6 | Dégâts à l'impact | Top, Mid | Anti-soins | Berserker's Greaves → Nashor's Tooth → Rabadon's Deathcap → Void Staff → Morellonomicon → Guinsoo's Rageblade | 16350 |
| 7 | Dégâts à l'impact | Top, Mid | Alternative (sans Nashor's Tooth) | Berserker's Greaves → Guinsoo's Rageblade → Rabadon's Deathcap → Void Staff → Kraken Slayer → Shadowflame | 16800 |
| 8 | Dégâts à l'impact | Top, Mid | Alternative (sans Rabadon's Deathcap) | Berserker's Greaves → Nashor's Tooth → Guinsoo's Rageblade → Void Staff → Kraken Slayer → Shadowflame | 16200 |
| 9 | Dégâts à l'impact | Top, Mid | Alternative (sans Void Staff) | Berserker's Greaves → Nashor's Tooth → Guinsoo's Rageblade → Rabadon's Deathcap → Kraken Slayer → Cryptbloom | 16500 |
| 10 | Dégâts à l'impact | Top, Mid | Alternative (sans Guinsoo's Rageblade) | Berserker's Greaves → Nashor's Tooth → Rabadon's Deathcap → Void Staff → Kraken Slayer → Shadowflame | 16700 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Blade of the Ruined King** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Shadowflame** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Kayn

- **Rôles** : Jungle · dégâts physiques · mana · mêlée
- **Kit** : burst, très mobile, sorts fréquents (accélération rentable), soins sur soi, ultime décisif.
- **Répartition des 10 builds** : Combattant (jungle) (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant (jungle) | Jungle | Standard | Mercury's Treads → Spear of Shojin → Death's Dance → Sundered Sky → Maw of Malmortius → Black Cleaver | 16850 |
| 2 | Combattant (jungle) | Jungle | Contre AD / assassins | Plated Steelcaps → Death's Dance → Randuin's Omen → Frozen Heart → Sterak's Gage → Guardian Angel | 16100 |
| 3 | Combattant (jungle) | Jungle | Contre AP | Mercury's Treads → Spear of Shojin → Death's Dance → Maw of Malmortius → Spirit Visage → Kaenic Rookern | 16350 |
| 4 | Combattant (jungle) | Jungle | Contre tanks | Mercury's Treads → Serylda's Grudge → Death's Dance → Spear of Shojin → Sundered Sky → Titanic Hydra | 17050 |
| 5 | Combattant (jungle) | Jungle | Sustain | Mercury's Treads → Ravenous Hydra → Death's Dance → Sundered Sky → Spirit Visage → Sterak's Gage | 16850 |
| 6 | Combattant (jungle) | Jungle | Anti-soins | Mercury's Treads → Chempunk Chainsword → Death's Dance → Spear of Shojin → Sundered Sky → Maw of Malmortius | 16950 |
| 7 | Combattant (jungle) | Jungle | Alternative (sans Spear of Shojin) | Mercury's Treads → Stridebreaker → Death's Dance → Sundered Sky → Maw of Malmortius → Black Cleaver | 17050 |
| 8 | Combattant (jungle) | Jungle | Alternative (sans Death's Dance) | Mercury's Treads → Spear of Shojin → Sundered Sky → Maw of Malmortius → Black Cleaver → Stridebreaker | 16850 |
| 9 | Combattant (jungle) | Jungle | Alternative (sans Sundered Sky) | Mercury's Treads → Stridebreaker → Death's Dance → Spear of Shojin → Maw of Malmortius → Black Cleaver | 17050 |
| 10 | Combattant (jungle) | Jungle | Alternative (sans Maw of Malmortius) | Mercury's Treads → Spear of Shojin → Death's Dance → Sundered Sky → Sterak's Gage → Black Cleaver | 16950 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Randuin's Omen** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Titanic Hydra** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Hubris** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Kennen

- **Rôles** : Top, Mid · dégâts magiques · énergie · distance
- **Kit** : dégâts de zone, engage et contrôles, ultime décisif, sorts fréquents (accélération rentable), burst.
- **Répartition des 10 builds** : Dégâts AP burst (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP burst | Top, Mid | Standard | Sorcerer's Shoes → Shadowflame → Rabadon's Deathcap → Void Staff → Stormsurge → Horizon Focus | 16350 |
| 2 | Dégâts AP burst | Top, Mid | Contre tanks | Ionian Boots of Lucidity → Shadowflame → Horizon Focus → Rabadon's Deathcap → Void Staff → Zhonya's Hourglass | 16600 |
| 3 | Dégâts AP burst | Top, Mid | Contre AD / assassins | Plated Steelcaps → Shadowflame → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Stormsurge | 16950 |
| 4 | Dégâts AP burst | Top, Mid | Contre AP | Mercury's Treads → Shadowflame → Banshee's Veil → Rabadon's Deathcap → Void Staff → Stormsurge | 16750 |
| 5 | Dégâts AP burst | Top, Mid | Accélération | Ionian Boots of Lucidity → Shadowflame → Horizon Focus → Rabadon's Deathcap → Void Staff → Stormsurge | 16150 |
| 6 | Dégâts AP burst | Top, Mid | Anti-soins | Sorcerer's Shoes → Shadowflame → Morellonomicon → Rabadon's Deathcap → Void Staff → Stormsurge | 16450 |
| 7 | Dégâts AP burst | Top, Mid | Alternative (sans Shadowflame) | Sorcerer's Shoes → Stormsurge → Rabadon's Deathcap → Void Staff → Horizon Focus → Zhonya's Hourglass | 16400 |
| 8 | Dégâts AP burst | Top, Mid | Alternative (sans Rabadon's Deathcap) | Sorcerer's Shoes → Shadowflame → Stormsurge → Void Staff → Horizon Focus → Zhonya's Hourglass | 16100 |
| 9 | Dégâts AP burst | Top, Mid | Alternative (sans Void Staff) | Sorcerer's Shoes → Shadowflame → Cryptbloom → Rabadon's Deathcap → Stormsurge → Horizon Focus | 16350 |
| 10 | Dégâts AP burst | Top, Mid | Alternative (sans Stormsurge) | Sorcerer's Shoes → Shadowflame → Rabadon's Deathcap → Void Staff → Horizon Focus → Zhonya's Hourglass | 16800 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Zhonya's Hourglass** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Hextech Rocketbelt** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Kha'Zix

- **Rôles** : Jungle · dégâts physiques · mana · mêlée
- **Kit** : burst, très mobile.
- **Répartition des 10 builds** : Dégâts AD létalité (jungle) (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD létalité (jungle) | Jungle | Standard | Mercury's Treads → Profane Hydra → Axiom Arc → Bloodthirster → Youmuu's Ghostblade → Serylda's Grudge | 16050 |
| 2 | Dégâts AD létalité (jungle) | Jungle | Contre tanks | Mercury's Treads → Serylda's Grudge → Bloodthirster → Death's Dance → Ravenous Hydra → Eclipse | 17150 |
| 3 | Dégâts AD létalité (jungle) | Jungle | Contre AD / assassins | Plated Steelcaps → Bloodthirster → Guardian Angel → Death's Dance → Profane Hydra → Eclipse | 16850 |
| 4 | Dégâts AD létalité (jungle) | Jungle | Contre AP | Mercury's Treads → Edge of Night → Maw of Malmortius → Profane Hydra → Axiom Arc → Mercurial Scimitar | 16150 |
| 5 | Dégâts AD létalité (jungle) | Jungle | Boule de neige | Mercury's Treads → Hubris → Opportunity → Profane Hydra → Youmuu's Ghostblade → Voltaic Cyclosword | 15600 |
| 6 | Dégâts AD létalité (jungle) | Jungle | Anti-soins | Mercury's Treads → Profane Hydra → Axiom Arc → Mortal Reminder → Bloodthirster → Youmuu's Ghostblade | 16350 |
| 7 | Dégâts AD létalité (jungle) | Jungle | Alternative (sans Profane Hydra) | Mercury's Treads → Axiom Arc → Bloodthirster → Youmuu's Ghostblade → Serylda's Grudge → Voltaic Cyclosword | 16200 |
| 8 | Dégâts AD létalité (jungle) | Jungle | Alternative (sans Axiom Arc) | Mercury's Treads → Profane Hydra → Bloodthirster → Youmuu's Ghostblade → Serylda's Grudge → Voltaic Cyclosword | 16300 |
| 9 | Dégâts AD létalité (jungle) | Jungle | Alternative (sans Bloodthirster) | Mercury's Treads → Profane Hydra → Axiom Arc → Youmuu's Ghostblade → Serylda's Grudge → Voltaic Cyclosword | 15650 |
| 10 | Dégâts AD létalité (jungle) | Jungle | Alternative (sans Youmuu's Ghostblade) | Mercury's Treads → Profane Hydra → Axiom Arc → Bloodthirster → Serylda's Grudge → Voltaic Cyclosword | 16250 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Death's Dance** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Hubris** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Kindred

- **Rôles** : Jungle · dégâts physiques · mana · distance
- **Kit** : dépend des attaques de base, synergie coup critique, dégâts sur la durée, très mobile, ultime décisif.
- **Répartition des 10 builds** : Dégâts AD critique (jungle) (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD critique (jungle) | Jungle | Standard | Berserker's Greaves → Kraken Slayer → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Bloodthirster | 17050 |
| 2 | Dégâts AD critique (jungle) | Jungle | Contre tanks | Berserker's Greaves → Kraken Slayer → Infinity Edge → Lord Dominik's Regards → Blade of the Ruined King → Yun Tal Wildarrows | 16850 |
| 3 | Dégâts AD critique (jungle) | Jungle | Contre AD / assassins | Plated Steelcaps → Bloodthirster → Guardian Angel → Death's Dance → Kraken Slayer → Yun Tal Wildarrows | 17100 |
| 4 | Dégâts AD critique (jungle) | Jungle | Contre AP | Berserker's Greaves → Yun Tal Wildarrows → Mercurial Scimitar → Kraken Slayer → Maw of Malmortius → Edge of Night | 16400 |
| 5 | Dégâts AD critique (jungle) | Jungle | Sustain | Berserker's Greaves → Bloodthirster → Kraken Slayer → Yun Tal Wildarrows → Ravenous Hydra → Infinity Edge | 17250 |
| 6 | Dégâts AD critique (jungle) | Jungle | Anti-soins | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Kraken Slayer → Mortal Reminder → Bloodthirster | 17250 |
| 7 | Dégâts AD critique (jungle) | Jungle | Alternative (sans Kraken Slayer) | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Bloodthirster → Blade of the Ruined King | 17250 |
| 8 | Dégâts AD critique (jungle) | Jungle | Alternative (sans Yun Tal Wildarrows) | Berserker's Greaves → Kraken Slayer → Infinity Edge → Lord Dominik's Regards → Bloodthirster → Blade of the Ruined King | 17250 |
| 9 | Dégâts AD critique (jungle) | Jungle | Alternative (sans Infinity Edge) | Berserker's Greaves → Kraken Slayer → Yun Tal Wildarrows → Lord Dominik's Regards → Bloodthirster → Blade of the Ruined King | 16800 |
| 10 | Dégâts AD critique (jungle) | Jungle | Alternative (sans Kraken Slayer, Yun Tal Wildarrows) | Berserker's Greaves → Bloodthirster → Infinity Edge → Lord Dominik's Regards → Blade of the Ruined King → Statikk Shiv | 16950 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Guardian Angel (AD) / Maw of Malmortius ou Mercurial Scimitar (AP).
- **Tank** feed / 2 tanks ou plus : **Blade of the Ruined King** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Mortal Reminder** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Mercurial Scimitar.
- **En avance** : finir l'objet offensif principal, puis **Hubris** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Kled

- **Rôles** : Top · dégâts physiques · sans mana · mêlée
- **Kit** : très mobile, sorts fréquents (accélération rentable), burst, engage et contrôles, ultime décisif.
- **Répartition des 10 builds** : Dégâts AD (8), Combattant (2)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD | Top | Standard | Ionian Boots of Lucidity → Serylda's Grudge → Bloodthirster → Axiom Arc → Death's Dance → Eclipse | 16250 |
| 2 | Dégâts AD | Top | Contre tanks | Ionian Boots of Lucidity → Serylda's Grudge → Bloodthirster → Death's Dance → Axiom Arc → Maw of Malmortius | 16450 |
| 3 | Dégâts AD | Top | Contre AD / assassins | Plated Steelcaps → Serylda's Grudge → Guardian Angel → Death's Dance → Bloodthirster → Maw of Malmortius | 17200 |
| 4 | Dégâts AD | Top | Contre AP | Mercury's Treads → Edge of Night → Maw of Malmortius → Mercurial Scimitar → Serylda's Grudge → Bloodthirster | 16950 |
| 5 | Dégâts AD | Top | Boule de neige | Ionian Boots of Lucidity → Hubris → Opportunity → Axiom Arc → Profane Hydra → Serylda's Grudge | 15200 |
| 6 | Dégâts AD | Top | Accélération | Ionian Boots of Lucidity → Axiom Arc → Serylda's Grudge → Spear of Shojin → Death's Dance → Bloodthirster | 16450 |
| 7 | Dégâts AD | Top | Anti-soins | Ionian Boots of Lucidity → Bloodthirster → Axiom Arc → Mortal Reminder → Death's Dance → Eclipse | 16550 |
| 8 | Combattant | Top | Standard | Mercury's Treads → Experimental Hexplate → Death's Dance → Spear of Shojin → Maw of Malmortius → Black Cleaver | 16750 |
| 9 | Combattant | Top | Contre AD / assassins | Plated Steelcaps → Spear of Shojin → Death's Dance → Randuin's Omen → Guardian Angel → Sterak's Gage | 16700 |
| 10 | Dégâts AD | Top | Alternative (sans Serylda's Grudge) | Ionian Boots of Lucidity → Bloodthirster → Axiom Arc → Death's Dance → Eclipse → Profane Hydra | 16100 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Maw of Malmortius** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Hubris** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Kog'Maw

- **Rôles** : ADC · dégâts mixtes · mana · distance
- **Kit** : dépend des attaques de base, effets à l'impact, dégâts sur la durée, poke à longue portée.
- **Répartition des 10 builds** : Dégâts à l'impact (10)
- **Particularité** : Hybride : ADC_ONHIT par défaut, build « Hybride AP » contre une équipe sans RM.

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts à l'impact | ADC | Standard | Berserker's Greaves → Nashor's Tooth → Kraken Slayer → Guinsoo's Rageblade → Blade of the Ruined King → Rabadon's Deathcap | 16700 |
| 2 | Dégâts à l'impact | ADC | Contre tanks | Berserker's Greaves → Blade of the Ruined King → Nashor's Tooth → Kraken Slayer → Guinsoo's Rageblade → Void Staff | 16200 |
| 3 | Dégâts à l'impact | ADC | Contre AD / assassins | Plated Steelcaps → Nashor's Tooth → Zhonya's Hourglass → Guardian Angel → Death's Dance → Kraken Slayer | 16850 |
| 4 | Dégâts à l'impact | ADC | Contre AP | Berserker's Greaves → Nashor's Tooth → Banshee's Veil → Wit's End → Mercurial Scimitar → Kraken Slayer | 16000 |
| 5 | Dégâts à l'impact | ADC | Sustain | Berserker's Greaves → Nashor's Tooth → Blade of the Ruined King → Kraken Slayer → Guinsoo's Rageblade → Bloodthirster | 16600 |
| 6 | Dégâts à l'impact | ADC | Poke | Berserker's Greaves → Nashor's Tooth → Kraken Slayer → Guinsoo's Rageblade → Blade of the Ruined King → Horizon Focus | 15950 |
| 7 | Dégâts à l'impact | ADC | Anti-soins | Berserker's Greaves → Nashor's Tooth → Kraken Slayer → Mortal Reminder → Guinsoo's Rageblade → Blade of the Ruined King | 16500 |
| 8 | Dégâts à l'impact | ADC | Alternative (sans Nashor's Tooth) | Berserker's Greaves → Kraken Slayer → Guinsoo's Rageblade → Blade of the Ruined King → Terminus → Bloodthirster | 16700 |
| 9 | Dégâts à l'impact | ADC | Alternative (sans Kraken Slayer) | Berserker's Greaves → Nashor's Tooth → Guinsoo's Rageblade → Blade of the Ruined King → Terminus → Rabadon's Deathcap | 16700 |
| 10 | Dégâts à l'impact | ADC | Alternative (sans Guinsoo's Rageblade) | Berserker's Greaves → Nashor's Tooth → Kraken Slayer → Blade of the Ruined King → Terminus → Rabadon's Deathcap | 16700 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Void Staff** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Terminus** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### LeBlanc

- **Rôles** : Mid · dégâts magiques · mana · distance
- **Kit** : burst, très mobile, sorts fréquents (accélération rentable).
- **Répartition des 10 builds** : Dégâts AP burst (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP burst | Mid | Standard | Sorcerer's Shoes → Shadowflame → Rabadon's Deathcap → Void Staff → Stormsurge → Luden's Companion | 16350 |
| 2 | Dégâts AP burst | Mid | Contre tanks | Ionian Boots of Lucidity → Shadowflame → Horizon Focus → Rabadon's Deathcap → Void Staff → Luden's Companion | 16100 |
| 3 | Dégâts AP burst | Mid | Contre AD / assassins | Plated Steelcaps → Shadowflame → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Stormsurge | 16950 |
| 4 | Dégâts AP burst | Mid | Contre AP | Mercury's Treads → Shadowflame → Banshee's Veil → Rabadon's Deathcap → Void Staff → Stormsurge | 16750 |
| 5 | Dégâts AP burst | Mid | Accélération | Ionian Boots of Lucidity → Shadowflame → Rabadon's Deathcap → Void Staff → Horizon Focus → Stormsurge | 16150 |
| 6 | Dégâts AP burst | Mid | Anti-soins | Sorcerer's Shoes → Shadowflame → Morellonomicon → Rabadon's Deathcap → Void Staff → Stormsurge | 16450 |
| 7 | Dégâts AP burst | Mid | Alternative (sans Shadowflame) | Sorcerer's Shoes → Stormsurge → Rabadon's Deathcap → Void Staff → Luden's Companion → Horizon Focus | 15900 |
| 8 | Dégâts AP burst | Mid | Alternative (sans Rabadon's Deathcap) | Sorcerer's Shoes → Shadowflame → Stormsurge → Void Staff → Luden's Companion → Horizon Focus | 15600 |
| 9 | Dégâts AP burst | Mid | Alternative (sans Void Staff) | Sorcerer's Shoes → Shadowflame → Stormsurge → Rabadon's Deathcap → Cryptbloom → Luden's Companion | 16350 |
| 10 | Dégâts AP burst | Mid | Alternative (sans Stormsurge) | Sorcerer's Shoes → Shadowflame → Rabadon's Deathcap → Void Staff → Luden's Companion → Horizon Focus | 16300 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Horizon Focus** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Horizon Focus** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Lee Sin

- **Rôles** : Jungle · dégâts physiques · énergie · mêlée
- **Kit** : très mobile, sorts fréquents (accélération rentable), burst, engage et contrôles, ultime décisif.
- **Répartition des 10 builds** : Combattant (jungle) (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant (jungle) | Jungle | Standard | Mercury's Treads → Stridebreaker → Death's Dance → Spear of Shojin → Maw of Malmortius → Black Cleaver | 17050 |
| 2 | Combattant (jungle) | Jungle | Contre AD / assassins | Plated Steelcaps → Spear of Shojin → Death's Dance → Randuin's Omen → Guardian Angel → Sterak's Gage | 16700 |
| 3 | Combattant (jungle) | Jungle | Contre AP | Mercury's Treads → Spear of Shojin → Maw of Malmortius → Death's Dance → Kaenic Rookern → Spirit Visage | 16350 |
| 4 | Combattant (jungle) | Jungle | Contre tanks | Mercury's Treads → Serylda's Grudge → Death's Dance → Spear of Shojin → Titanic Hydra → Maw of Malmortius | 17050 |
| 5 | Combattant (jungle) | Jungle | Accélération | Mercury's Treads → Spear of Shojin → Death's Dance → Maw of Malmortius → Black Cleaver → Sundered Sky | 16850 |
| 6 | Combattant (jungle) | Jungle | Anti-soins | Mercury's Treads → Chempunk Chainsword → Death's Dance → Spear of Shojin → Maw of Malmortius → Black Cleaver | 16850 |
| 7 | Combattant (jungle) | Jungle | Alternative (sans Death's Dance) | Mercury's Treads → Spear of Shojin → Maw of Malmortius → Black Cleaver → Stridebreaker → Sundered Sky | 16850 |
| 8 | Combattant (jungle) | Jungle | Alternative (sans Spear of Shojin) | Mercury's Treads → Stridebreaker → Death's Dance → Maw of Malmortius → Black Cleaver → Sundered Sky | 17050 |
| 9 | Combattant (jungle) | Jungle | Alternative (sans Maw of Malmortius) | Mercury's Treads → Stridebreaker → Death's Dance → Spear of Shojin → Sterak's Gage → Black Cleaver | 17150 |
| 10 | Combattant (jungle) | Jungle | Alternative (sans Stridebreaker, Death's Dance) | Mercury's Treads → Spear of Shojin → Maw of Malmortius → Black Cleaver → Sundered Sky → Titanic Hydra | 16850 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Randuin's Omen** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Titanic Hydra** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Hubris** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Leona

- **Rôles** : Support · dégâts magiques · mana · mêlée
- **Kit** : engage et contrôles, naturellement résistant, sorts fréquents (accélération rentable), ultime décisif.
- **Répartition des 10 builds** : Support engage (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Support engage | Support | Standard | Celestial Opposition → Mercury's Treads → Zeke's Convergence → Locket of the Iron Solari → Vigilant Wardstone → Randuin's Omen | 10650 |
| 2 | Support engage | Support | Engagement | Solstice Sleigh → Mercury's Treads → Zeke's Convergence → Locket of the Iron Solari → Trailblazer → Vigilant Wardstone | 10350 |
| 3 | Support engage | Support | Contre AD / assassins | Celestial Opposition → Plated Steelcaps → Randuin's Omen → Frozen Heart → Thornmail → Zeke's Convergence | 11050 |
| 4 | Support engage | Support | Contre AP | Celestial Opposition → Mercury's Treads → Zeke's Convergence → Kaenic Rookern → Locket of the Iron Solari → Vigilant Wardstone | 10850 |
| 5 | Support engage | Support | Anti-soins | Celestial Opposition → Mercury's Treads → Thornmail → Zeke's Convergence → Locket of the Iron Solari → Vigilant Wardstone | 10400 |
| 6 | Support engage | Support | Alternative (sans Zeke's Convergence) | Celestial Opposition → Mercury's Treads → Locket of the Iron Solari → Vigilant Wardstone → Randuin's Omen → Frozen Heart | 10950 |
| 7 | Support engage | Support | Alternative (sans Locket of the Iron Solari) | Celestial Opposition → Mercury's Treads → Zeke's Convergence → Vigilant Wardstone → Randuin's Omen → Frozen Heart | 10950 |
| 8 | Support engage | Support | Alternative (sans Vigilant Wardstone) | Celestial Opposition → Mercury's Treads → Zeke's Convergence → Locket of the Iron Solari → Randuin's Omen → Frozen Heart | 10850 |
| 9 | Support engage | Support | Alternative (sans Randuin's Omen) | Celestial Opposition → Mercury's Treads → Zeke's Convergence → Locket of the Iron Solari → Vigilant Wardstone → Frozen Heart | 10450 |
| 10 | Support engage | Support | Alternative (sans Zeke's Convergence, Locket of the Iron Solari) | Celestial Opposition → Mercury's Treads → Vigilant Wardstone → Randuin's Omen → Frozen Heart → Abyssal Mask | 11400 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Frozen Heart** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : protéger le carry visé (Knight's Vow, Locket of the Iron Solari) ; pour vous : Frozen Heart.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Thornmail** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : poser plus de balises de contrôle, jouer pour les objectifs ; objet d'équipe suivant : **Trailblazer**.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Frozen Heart**.

### Lillia

- **Rôles** : Jungle, Top · dégâts magiques · mana · mêlée
- **Kit** : dégâts sur la durée, dégâts de zone, sorts fréquents (accélération rentable), soins sur soi, très mobile.
- **Répartition des 10 builds** : Combattant (4), Combattant (jungle) (6)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant | Top | Standard | Mercury's Treads → Riftmaker → Liandry's Torment → Rabadon's Deathcap → Rylai's Crystal Scepter → Zhonya's Hourglass | 16700 |
| 2 | Combattant | Top | Contre AD / assassins | Plated Steelcaps → Riftmaker → Randuin's Omen → Zhonya's Hourglass → Frozen Heart → Rabadon's Deathcap | 16250 |
| 3 | Combattant | Top | Contre AP | Mercury's Treads → Riftmaker → Banshee's Veil → Kaenic Rookern → Spirit Visage → Rabadon's Deathcap | 16450 |
| 4 | Combattant | Top | Contre tanks | Mercury's Treads → Riftmaker → Liandry's Torment → Rabadon's Deathcap → Void Staff → Rylai's Crystal Scepter | 16450 |
| 5 | Combattant (jungle) | Jungle | Sustain | Mercury's Treads → Riftmaker → Spirit Visage → Rylai's Crystal Scepter → Rabadon's Deathcap → Liandry's Torment | 16150 |
| 6 | Combattant (jungle) | Jungle | Accélération | Mercury's Treads → Riftmaker → Cosmic Drive → Rabadon's Deathcap → Malignance → Blackfire Torch | 16350 |
| 7 | Combattant (jungle) | Jungle | Anti-soins | Mercury's Treads → Morellonomicon → Riftmaker → Rabadon's Deathcap → Rylai's Crystal Scepter → Liandry's Torment | 16300 |
| 8 | Combattant (jungle) | Jungle | Alternative (sans Riftmaker) | Mercury's Treads → Rylai's Crystal Scepter → Liandry's Torment → Rabadon's Deathcap → Zhonya's Hourglass → Void Staff | 16600 |
| 9 | Combattant (jungle) | Jungle | Alternative (sans Rylai's Crystal Scepter) | Mercury's Treads → Riftmaker → Liandry's Torment → Rabadon's Deathcap → Zhonya's Hourglass → Void Staff | 17100 |
| 10 | Combattant (jungle) | Jungle | Alternative (sans Rabadon's Deathcap) | Mercury's Treads → Riftmaker → Rylai's Crystal Scepter → Liandry's Torment → Zhonya's Hourglass → Void Staff | 16200 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Randuin's Omen** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Void Staff** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Void Staff** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Lissandra

- **Rôles** : Mid · dégâts magiques · mana · distance
- **Kit** : burst, engage et contrôles, sorts fréquents (accélération rentable), dégâts de zone, ultime décisif.
- **Répartition des 10 builds** : Dégâts AP burst (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP burst | Mid | Standard | Sorcerer's Shoes → Shadowflame → Rabadon's Deathcap → Void Staff → Stormsurge → Luden's Companion | 16350 |
| 2 | Dégâts AP burst | Mid | Contre tanks | Ionian Boots of Lucidity → Shadowflame → Horizon Focus → Rabadon's Deathcap → Void Staff → Malignance | 16050 |
| 3 | Dégâts AP burst | Mid | Contre AD / assassins | Plated Steelcaps → Shadowflame → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Stormsurge | 16950 |
| 4 | Dégâts AP burst | Mid | Contre AP | Mercury's Treads → Shadowflame → Banshee's Veil → Rabadon's Deathcap → Void Staff → Stormsurge | 16750 |
| 5 | Dégâts AP burst | Mid | Accélération | Ionian Boots of Lucidity → Shadowflame → Rabadon's Deathcap → Void Staff → Horizon Focus → Stormsurge | 16150 |
| 6 | Dégâts AP burst | Mid | Anti-soins | Sorcerer's Shoes → Shadowflame → Morellonomicon → Rabadon's Deathcap → Void Staff → Stormsurge | 16450 |
| 7 | Dégâts AP burst | Mid | Alternative (sans Shadowflame) | Sorcerer's Shoes → Stormsurge → Rabadon's Deathcap → Void Staff → Luden's Companion → Horizon Focus | 15900 |
| 8 | Dégâts AP burst | Mid | Alternative (sans Rabadon's Deathcap) | Sorcerer's Shoes → Shadowflame → Stormsurge → Void Staff → Luden's Companion → Horizon Focus | 15600 |
| 9 | Dégâts AP burst | Mid | Alternative (sans Void Staff) | Sorcerer's Shoes → Shadowflame → Stormsurge → Rabadon's Deathcap → Cryptbloom → Luden's Companion | 16350 |
| 10 | Dégâts AP burst | Mid | Alternative (sans Stormsurge) | Sorcerer's Shoes → Shadowflame → Rabadon's Deathcap → Void Staff → Luden's Companion → Horizon Focus | 16300 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Horizon Focus** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Horizon Focus** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Locke

- **Rôles** : Mid · dégâts magiques · mana · mêlée
- **Kit** : burst, très mobile, ultime décisif, dépend des attaques de base, effets à l'impact.
- **Répartition des 10 builds** : Dégâts à l'impact (7), Combattant (3)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts à l'impact | Mid | Standard | Berserker's Greaves → Nashor's Tooth → Rabadon's Deathcap → Void Staff → Shadowflame → Stormsurge | 16500 |
| 2 | Dégâts à l'impact | Mid | Contre tanks | Berserker's Greaves → Nashor's Tooth → Rabadon's Deathcap → Void Staff → Malignance → Shadowflame | 16400 |
| 3 | Dégâts à l'impact | Mid | Contre AD / assassins | Plated Steelcaps → Shadowflame → Zhonya's Hourglass → Nashor's Tooth → Rabadon's Deathcap → Void Staff | 17050 |
| 4 | Dégâts à l'impact | Mid | Contre AP | Mercury's Treads → Shadowflame → Banshee's Veil → Nashor's Tooth → Rabadon's Deathcap → Void Staff | 16850 |
| 5 | Dégâts à l'impact | Mid | Anti-soins | Berserker's Greaves → Nashor's Tooth → Morellonomicon → Rabadon's Deathcap → Void Staff → Shadowflame | 16550 |
| 6 | Combattant | Mid | Standard | Mercury's Treads → Nashor's Tooth → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Shadowflame | 17100 |
| 7 | Combattant | Mid | Contre AD / assassins | Plated Steelcaps → Nashor's Tooth → Zhonya's Hourglass → Randuin's Omen → Frozen Heart → Rabadon's Deathcap | 16050 |
| 8 | Combattant | Mid | Contre AP | Mercury's Treads → Nashor's Tooth → Banshee's Veil → Kaenic Rookern → Rabadon's Deathcap → Wit's End | 16350 |
| 9 | Dégâts à l'impact | Mid | Alternative (sans Nashor's Tooth) | Berserker's Greaves → Shadowflame → Rabadon's Deathcap → Void Staff → Stormsurge → Malignance | 16300 |
| 10 | Dégâts à l'impact | Mid | Alternative (sans Rabadon's Deathcap) | Berserker's Greaves → Nashor's Tooth → Shadowflame → Void Staff → Stormsurge → Malignance | 15700 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Malignance** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Luden's Companion** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Lucian

- **Rôles** : ADC, Mid · dégâts physiques · mana · distance
- **Kit** : dépend des attaques de base, sorts fréquents (accélération rentable), burst, attaques entre les sorts, très mobile.
- **Répartition des 10 builds** : Dégâts AD (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD | ADC, Mid | Standard | Berserker's Greaves → Bloodthirster → Serylda's Grudge → Kraken Slayer → Trinity Force → Yun Tal Wildarrows | 16833 |
| 2 | Dégâts AD | ADC, Mid | Contre tanks | Berserker's Greaves → Serylda's Grudge → Kraken Slayer → Bloodthirster → Blade of the Ruined King → Trinity Force | 17033 |
| 3 | Dégâts AD | ADC, Mid | Contre AD / assassins | Plated Steelcaps → Serylda's Grudge → Guardian Angel → Death's Dance → Bloodthirster → Maw of Malmortius | 17200 |
| 4 | Dégâts AD | ADC, Mid | Contre AP | Mercury's Treads → Serylda's Grudge → Mercurial Scimitar → Edge of Night → Maw of Malmortius → Bloodthirster | 16950 |
| 5 | Dégâts AD | ADC, Mid | Boule de neige | Berserker's Greaves → Hubris → Bloodthirster → Opportunity → Serylda's Grudge → The Collector | 16200 |
| 6 | Dégâts AD | ADC, Mid | Accélération | Ionian Boots of Lucidity → Serylda's Grudge → Bloodthirster → Spear of Shojin → Axiom Arc → Trinity Force | 16483 |
| 7 | Dégâts AD | ADC, Mid | Sustain | Berserker's Greaves → Bloodthirster → Ravenous Hydra → Death's Dance → Serylda's Grudge → Kraken Slayer | 17100 |
| 8 | Dégâts AD | ADC, Mid | Anti-soins | Berserker's Greaves → Bloodthirster → Kraken Slayer → Mortal Reminder → Trinity Force → Yun Tal Wildarrows | 17133 |
| 9 | Dégâts AD | ADC, Mid | Alternative (sans Bloodthirster) | Berserker's Greaves → Serylda's Grudge → Kraken Slayer → Trinity Force → Yun Tal Wildarrows → Axiom Arc | 16183 |
| 10 | Dégâts AD | ADC, Mid | Alternative (sans Serylda's Grudge) | Berserker's Greaves → Bloodthirster → Kraken Slayer → Trinity Force → Yun Tal Wildarrows → Axiom Arc | 16583 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Guardian Angel (AD) / Maw of Malmortius ou Mercurial Scimitar (AP).
- **Tank** feed / 2 tanks ou plus : **Blade of the Ruined King** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Mercurial Scimitar.
- **En avance** : finir l'objet offensif principal, puis **Hubris** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Lulu

- **Rôles** : Support · dégâts magiques · mana · distance
- **Kit** : soins / boucliers aux alliés, sorts fréquents (accélération rentable), engage et contrôles, ultime décisif.
- **Répartition des 10 builds** : Support enchanteur (7), Support dégâts AP burst (3)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Support enchanteur | Support | Standard | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Ardent Censer → Dawncore → Staff of Flowing Water | 10150 |
| 2 | Support enchanteur | Support | Contre AD / assassins | Celestial Opposition → Plated Steelcaps → Mikael's Blessing → Ardent Censer → Frozen Heart → Locket of the Iron Solari | 10400 |
| 3 | Support enchanteur | Support | Accélération | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Staff of Flowing Water → Redemption → Ardent Censer | 9950 |
| 4 | Support enchanteur | Support | Anti-soins | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Ardent Censer → Morellonomicon → Dawncore | 10750 |
| 5 | Support enchanteur | Support | Contre AP | Celestial Opposition → Mercury's Treads → Mikael's Blessing → Ardent Censer → Locket of the Iron Solari → Dawncore | 10450 |
| 6 | Support dégâts AP burst | Support | Standard | Zaz'Zak's Realmspike → Ionian Boots of Lucidity → Malignance → Horizon Focus → Rabadon's Deathcap → Void Staff | 12850 |
| 7 | Support dégâts AP burst | Support | Contre AD / assassins | Zaz'Zak's Realmspike → Plated Steelcaps → Malignance → Zhonya's Hourglass → Thornmail → Randuin's Omen | 12300 |
| 8 | Support dégâts AP burst | Support | Contre AP | Zaz'Zak's Realmspike → Mercury's Treads → Malignance → Banshee's Veil → Kaenic Rookern → Vigilant Wardstone | 12150 |
| 9 | Support enchanteur | Support | Alternative (sans Mikael's Blessing) | Dream Maker → Ionian Boots of Lucidity → Ardent Censer → Dawncore → Staff of Flowing Water → Redemption | 10150 |
| 10 | Support enchanteur | Support | Alternative (sans Ardent Censer) | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Dawncore → Staff of Flowing Water → Redemption | 10250 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Frozen Heart** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Abyssal Mask** en objet suivant.
- **Assassin** feed qui vous cible : protéger le carry visé (Knight's Vow, Locket of the Iron Solari) ; pour vous : Frozen Heart.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : poser plus de balises de contrôle, jouer pour les objectifs ; objet d'équipe suivant : **Locket of the Iron Solari**.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Frozen Heart**.

### Lux

- **Rôles** : Support, Mid · dégâts magiques · mana · distance
- **Kit** : burst, poke à longue portée, sorts fréquents (accélération rentable), dégâts de zone, engage et contrôles.
- **Répartition des 10 builds** : Dégâts AP burst (4), Support dégâts AP burst (6)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP burst | Mid | Standard | Sorcerer's Shoes → Shadowflame → Horizon Focus → Rabadon's Deathcap → Void Staff → Luden's Companion | 16300 |
| 2 | Dégâts AP burst | Mid | Contre tanks | Ionian Boots of Lucidity → Shadowflame → Horizon Focus → Rabadon's Deathcap → Void Staff → Luden's Companion | 16100 |
| 3 | Dégâts AP burst | Mid | Contre AD / assassins | Plated Steelcaps → Shadowflame → Zhonya's Hourglass → Horizon Focus → Rabadon's Deathcap → Void Staff | 16900 |
| 4 | Dégâts AP burst | Mid | Contre AP | Mercury's Treads → Shadowflame → Banshee's Veil → Horizon Focus → Rabadon's Deathcap → Void Staff | 16700 |
| 5 | Support dégâts AP burst | Support | Standard | Zaz'Zak's Realmspike → Sorcerer's Shoes → Luden's Companion → Horizon Focus → Rabadon's Deathcap → Void Staff | 13100 |
| 6 | Support dégâts AP burst | Support | Contre AD / assassins | Zaz'Zak's Realmspike → Plated Steelcaps → Luden's Companion → Zhonya's Hourglass → Horizon Focus → Rabadon's Deathcap | 13450 |
| 7 | Support dégâts AP burst | Support | Contre AP | Zaz'Zak's Realmspike → Mercury's Treads → Luden's Companion → Banshee's Veil → Horizon Focus → Rabadon's Deathcap | 13250 |
| 8 | Support dégâts AP burst | Support | Boule de neige | Zaz'Zak's Realmspike → Sorcerer's Shoes → Stormsurge → Luden's Companion → Rabadon's Deathcap → Horizon Focus | 12900 |
| 9 | Support dégâts AP burst | Support | Accélération | Zaz'Zak's Realmspike → Ionian Boots of Lucidity → Luden's Companion → Horizon Focus → Rabadon's Deathcap → Void Staff | 12900 |
| 10 | Support dégâts AP burst | Support | Anti-soins | Zaz'Zak's Realmspike → Sorcerer's Shoes → Luden's Companion → Morellonomicon → Horizon Focus → Rabadon's Deathcap | 12950 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Hextech Rocketbelt** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Stormsurge** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Malphite

- **Rôles** : Top, Support, Mid · dégâts magiques · mana · mêlée
- **Kit** : engage et contrôles, ultime décisif, naturellement résistant, sorts qui montent avec l'armure / la RM, sorts fréquents (accélération rentable).
- **Répartition des 10 builds** : Combattant (2), Tank (5), Support engage (3)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant | Top, Mid | Standard | Mercury's Treads → Abyssal Mask → Jak'Sho, The Protean → Randuin's Omen → Frozen Heart → Kaenic Rookern | 15200 |
| 2 | Combattant | Top, Mid | Contre AD / assassins | Plated Steelcaps → Zhonya's Hourglass → Randuin's Omen → Frozen Heart → Thornmail → Jak'Sho, The Protean | 15300 |
| 3 | Tank | Top | Standard | Mercury's Treads → Jak'Sho, The Protean → Randuin's Omen → Heartsteel → Warmog's Armor → Sunfire Aegis | 15950 |
| 4 | Tank | Top | Contre AD / assassins | Plated Steelcaps → Randuin's Omen → Frozen Heart → Jak'Sho, The Protean → Heartsteel → Warmog's Armor | 15700 |
| 5 | Tank | Top | Contre AP | Mercury's Treads → Jak'Sho, The Protean → Kaenic Rookern → Abyssal Mask → Warmog's Armor → Randuin's Omen | 15800 |
| 6 | Tank | Top | Engagement | Mercury's Treads → Jak'Sho, The Protean → Dead Man's Plate → Randuin's Omen → Heartsteel → Warmog's Armor | 16150 |
| 7 | Tank | Top | Accélération | Mercury's Treads → Jak'Sho, The Protean → Frozen Heart → Randuin's Omen → Heartsteel → Warmog's Armor | 15750 |
| 8 | Support engage | Support | Standard | Celestial Opposition → Mercury's Treads → Zeke's Convergence → Randuin's Omen → Locket of the Iron Solari → Frozen Heart | 10850 |
| 9 | Support engage | Support | Engagement | Solstice Sleigh → Mercury's Treads → Zeke's Convergence → Locket of the Iron Solari → Trailblazer → Randuin's Omen | 10750 |
| 10 | Support engage | Support | Contre AD / assassins | Celestial Opposition → Plated Steelcaps → Randuin's Omen → Frozen Heart → Thornmail → Zeke's Convergence | 11050 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Thornmail** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Sunfire Aegis** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Sunfire Aegis** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Thornmail**.

### Malzahar

- **Rôles** : Mid · dégâts magiques · mana · distance
- **Kit** : dégâts sur la durée, sorts fréquents (accélération rentable), gros besoin de mana, dégâts de zone, engage et contrôles.
- **Répartition des 10 builds** : Dégâts AP continu (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP continu | Mid | Standard | Sorcerer's Shoes → Archangel's Staff → Blackfire Torch → Rabadon's Deathcap → Void Staff → Malignance | 16000 |
| 2 | Dégâts AP continu | Mid | Contre tanks | Ionian Boots of Lucidity → Malignance → Liandry's Torment → Rabadon's Deathcap → Void Staff → Blackfire Torch | 15900 |
| 3 | Dégâts AP continu | Mid | Contre AD / assassins | Plated Steelcaps → Malignance → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Blackfire Torch | 16450 |
| 4 | Dégâts AP continu | Mid | Contre AP | Mercury's Treads → Malignance → Banshee's Veil → Rabadon's Deathcap → Void Staff → Blackfire Torch | 16250 |
| 5 | Dégâts AP continu | Mid | Accélération | Ionian Boots of Lucidity → Archangel's Staff → Blackfire Torch → Rabadon's Deathcap → Void Staff → Malignance | 15800 |
| 6 | Dégâts AP continu | Mid | Anti-soins | Sorcerer's Shoes → Malignance → Morellonomicon → Rabadon's Deathcap → Void Staff → Blackfire Torch | 15950 |
| 7 | Dégâts AP continu | Mid | Alternative (sans Archangel's Staff) | Sorcerer's Shoes → Malignance → Blackfire Torch → Rabadon's Deathcap → Void Staff → Horizon Focus | 15850 |
| 8 | Dégâts AP continu | Mid | Alternative (sans Blackfire Torch) | Sorcerer's Shoes → Archangel's Staff → Malignance → Rabadon's Deathcap → Void Staff → Horizon Focus | 15950 |
| 9 | Dégâts AP continu | Mid | Alternative (sans Rabadon's Deathcap) | Sorcerer's Shoes → Archangel's Staff → Blackfire Torch → Void Staff → Horizon Focus → Malignance | 15250 |
| 10 | Dégâts AP continu | Mid | Alternative (sans Void Staff) | Sorcerer's Shoes → Archangel's Staff → Blackfire Torch → Rabadon's Deathcap → Malignance → Cryptbloom | 16000 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Liandry's Torment** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Shadowflame** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Maokai

- **Rôles** : Support, Jungle, Top · dégâts magiques · mana · mêlée
- **Kit** : engage et contrôles, naturellement résistant, sorts fréquents (accélération rentable), dégâts de zone, ultime décisif.
- **Répartition des 10 builds** : Combattant (1), Tank (2), Tank (jungle) (2), Support engage (5)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant | Top | Standard | Mercury's Treads → Abyssal Mask → Jak'Sho, The Protean → Randuin's Omen → Unending Despair → Sunfire Aegis | 15300 |
| 2 | Tank | Top | Standard | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Unending Despair → Randuin's Omen | 16050 |
| 3 | Tank | Top | Contre AD / assassins | Plated Steelcaps → Randuin's Omen → Frozen Heart → Jak'Sho, The Protean → Heartsteel → Warmog's Armor | 15700 |
| 4 | Tank (jungle) | Jungle | Standard | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Unending Despair → Sunfire Aegis | 16050 |
| 5 | Tank (jungle) | Jungle | Contre AP | Mercury's Treads → Jak'Sho, The Protean → Heartsteel → Warmog's Armor → Abyssal Mask → Kaenic Rookern | 16100 |
| 6 | Support engage | Support | Standard | Celestial Opposition → Mercury's Treads → Zeke's Convergence → Locket of the Iron Solari → Vigilant Wardstone → Randuin's Omen | 10650 |
| 7 | Support engage | Support | Engagement | Solstice Sleigh → Mercury's Treads → Zeke's Convergence → Locket of the Iron Solari → Trailblazer → Vigilant Wardstone | 10350 |
| 8 | Support engage | Support | Contre AD / assassins | Celestial Opposition → Plated Steelcaps → Randuin's Omen → Frozen Heart → Thornmail → Zeke's Convergence | 11050 |
| 9 | Support engage | Support | Contre AP | Celestial Opposition → Mercury's Treads → Zeke's Convergence → Kaenic Rookern → Abyssal Mask → Locket of the Iron Solari | 11200 |
| 10 | Support engage | Support | Anti-soins | Celestial Opposition → Mercury's Treads → Thornmail → Zeke's Convergence → Locket of the Iron Solari → Vigilant Wardstone | 10400 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Frozen Heart** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Kaenic Rookern** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Kaenic Rookern** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Frozen Heart**.

### Master Yi

- **Rôles** : Jungle · dégâts physiques · mana · mêlée
- **Kit** : dépend des attaques de base, effets à l'impact, très mobile, dégâts sur la durée, soins sur soi.
- **Répartition des 10 builds** : Combattant (jungle) (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant (jungle) | Jungle | Standard | Mercury's Treads → Stridebreaker → Death's Dance → Kraken Slayer → Wit's End → Blade of the Ruined King | 16850 |
| 2 | Combattant (jungle) | Jungle | Contre AD / assassins | Plated Steelcaps → Stridebreaker → Death's Dance → Randuin's Omen → Guardian Angel → Sterak's Gage | 16900 |
| 3 | Combattant (jungle) | Jungle | Contre AP | Mercury's Treads → Stridebreaker → Wit's End → Death's Dance → Maw of Malmortius → Kaenic Rookern | 16650 |
| 4 | Combattant (jungle) | Jungle | Contre tanks | Mercury's Treads → Blade of the Ruined King → Stridebreaker → Kraken Slayer → Death's Dance → Serylda's Grudge | 17050 |
| 5 | Combattant (jungle) | Jungle | Sustain | Mercury's Treads → Bloodthirster → Death's Dance → Stridebreaker → Sundered Sky → Sterak's Gage | 17550 |
| 6 | Combattant (jungle) | Jungle | Anti-soins | Mercury's Treads → Chempunk Chainsword → Stridebreaker → Death's Dance → Kraken Slayer → Wit's End | 16750 |
| 7 | Combattant (jungle) | Jungle | Alternative (sans Stridebreaker) | Mercury's Treads → Kraken Slayer → Death's Dance → Wit's End → Blade of the Ruined King → Trinity Force | 16883 |
| 8 | Combattant (jungle) | Jungle | Alternative (sans Death's Dance) | Mercury's Treads → Stridebreaker → Kraken Slayer → Wit's End → Blade of the Ruined King → Sterak's Gage | 16750 |
| 9 | Combattant (jungle) | Jungle | Alternative (sans Kraken Slayer) | Mercury's Treads → Stridebreaker → Death's Dance → Wit's End → Blade of the Ruined King → Trinity Force | 17183 |
| 10 | Combattant (jungle) | Jungle | Alternative (sans Wit's End) | Mercury's Treads → Stridebreaker → Death's Dance → Kraken Slayer → Blade of the Ruined King → Trinity Force | 17383 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Randuin's Omen** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Serylda's Grudge** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Trinity Force** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Mel

- **Rôles** : Mid, Support · dégâts magiques · mana · distance
- **Kit** : poke à longue portée, sorts fréquents (accélération rentable), gros besoin de mana, burst, dégâts de zone.
- **Répartition des 10 builds** : Dégâts AP burst (6), Support dégâts AP burst (4)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP burst | Mid | Standard | Sorcerer's Shoes → Shadowflame → Horizon Focus → Rabadon's Deathcap → Void Staff → Luden's Companion | 16300 |
| 2 | Dégâts AP burst | Mid | Contre tanks | Ionian Boots of Lucidity → Luden's Companion → Horizon Focus → Rabadon's Deathcap → Void Staff → Malignance | 15600 |
| 3 | Dégâts AP burst | Mid | Contre AD / assassins | Plated Steelcaps → Luden's Companion → Zhonya's Hourglass → Horizon Focus → Rabadon's Deathcap → Void Staff | 16450 |
| 4 | Dégâts AP burst | Mid | Contre AP | Mercury's Treads → Luden's Companion → Banshee's Veil → Horizon Focus → Rabadon's Deathcap → Void Staff | 16250 |
| 5 | Dégâts AP burst | Mid | Boule de neige | Sorcerer's Shoes → Shadowflame → Stormsurge → Rabadon's Deathcap → Horizon Focus → Luden's Companion | 16100 |
| 6 | Dégâts AP burst | Mid | Partie longue | Sorcerer's Shoes → Archangel's Staff → Luden's Companion → Horizon Focus → Rabadon's Deathcap → Void Staff | 16000 |
| 7 | Support dégâts AP burst | Support | Standard | Zaz'Zak's Realmspike → Sorcerer's Shoes → Luden's Companion → Horizon Focus → Rabadon's Deathcap → Malignance | 12800 |
| 8 | Support dégâts AP burst | Support | Contre AD / assassins | Zaz'Zak's Realmspike → Plated Steelcaps → Luden's Companion → Zhonya's Hourglass → Horizon Focus → Rabadon's Deathcap | 13450 |
| 9 | Support dégâts AP burst | Support | Contre AP | Zaz'Zak's Realmspike → Mercury's Treads → Luden's Companion → Banshee's Veil → Horizon Focus → Rabadon's Deathcap | 13250 |
| 10 | Support dégâts AP burst | Support | Boule de neige | Zaz'Zak's Realmspike → Sorcerer's Shoes → Stormsurge → Horizon Focus → Luden's Companion → Rabadon's Deathcap | 12900 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Malignance** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Stormsurge** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Milio

- **Rôles** : Support · dégâts magiques · mana · distance
- **Kit** : soins / boucliers aux alliés, sorts fréquents (accélération rentable).
- **Répartition des 10 builds** : Support enchanteur (7), Support dégâts AP burst (3)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Support enchanteur | Support | Standard | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Ardent Censer → Dawncore → Staff of Flowing Water | 10150 |
| 2 | Support enchanteur | Support | Contre AD / assassins | Celestial Opposition → Plated Steelcaps → Mikael's Blessing → Ardent Censer → Frozen Heart → Locket of the Iron Solari | 10400 |
| 3 | Support enchanteur | Support | Accélération | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Staff of Flowing Water → Redemption → Ardent Censer | 9950 |
| 4 | Support enchanteur | Support | Anti-soins | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Ardent Censer → Morellonomicon → Dawncore | 10750 |
| 5 | Support enchanteur | Support | Contre AP | Celestial Opposition → Mercury's Treads → Mikael's Blessing → Ardent Censer → Locket of the Iron Solari → Dawncore | 10450 |
| 6 | Support dégâts AP burst | Support | Standard | Zaz'Zak's Realmspike → Ionian Boots of Lucidity → Archangel's Staff → Horizon Focus → Rabadon's Deathcap → Void Staff | 13050 |
| 7 | Support dégâts AP burst | Support | Contre AD / assassins | Zaz'Zak's Realmspike → Plated Steelcaps → Zhonya's Hourglass → Horizon Focus → Thornmail → Randuin's Omen | 12350 |
| 8 | Support dégâts AP burst | Support | Contre AP | Zaz'Zak's Realmspike → Mercury's Treads → Banshee's Veil → Horizon Focus → Kaenic Rookern → Vigilant Wardstone | 12200 |
| 9 | Support enchanteur | Support | Alternative (sans Mikael's Blessing) | Dream Maker → Ionian Boots of Lucidity → Ardent Censer → Dawncore → Staff of Flowing Water → Redemption | 10150 |
| 10 | Support enchanteur | Support | Alternative (sans Ardent Censer) | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Dawncore → Staff of Flowing Water → Redemption | 10250 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Frozen Heart** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Abyssal Mask** en objet suivant.
- **Assassin** feed qui vous cible : protéger le carry visé (Knight's Vow, Locket of the Iron Solari) ; pour vous : Frozen Heart.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : poser plus de balises de contrôle, jouer pour les objectifs ; objet d'équipe suivant : **Locket of the Iron Solari**.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Frozen Heart**.

### Miss Fortune

- **Rôles** : ADC · dégâts physiques · mana · distance
- **Kit** : dégâts de zone, ultime décisif, dépend des attaques de base, synergie coup critique, burst.
- **Répartition des 10 builds** : Dégâts AD critique (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD critique | ADC | Standard | Berserker's Greaves → Bloodthirster → Infinity Edge → Lord Dominik's Regards → Yun Tal Wildarrows → Kraken Slayer | 17050 |
| 2 | Dégâts AD critique | ADC | Contre AD / assassins | Plated Steelcaps → Bloodthirster → Guardian Angel → Death's Dance → Infinity Edge → Lord Dominik's Regards | 17650 |
| 3 | Dégâts AD critique | ADC | Contre AP | Mercury's Treads → Edge of Night → Mercurial Scimitar → Maw of Malmortius → Infinity Edge → Lord Dominik's Regards | 17100 |
| 4 | Dégâts AD critique | ADC | Boule de neige | Berserker's Greaves → The Collector → Infinity Edge → Hubris → Lord Dominik's Regards → Bloodthirster | 17050 |
| 5 | Dégâts AD critique | ADC | Sustain | Berserker's Greaves → Bloodthirster → Ravenous Hydra → Infinity Edge → Lord Dominik's Regards → Death's Dance | 17650 |
| 6 | Dégâts AD critique | ADC | Poke | Berserker's Greaves → Bloodthirster → Infinity Edge → Lord Dominik's Regards → Axiom Arc → Ravenous Hydra | 17100 |
| 7 | Dégâts AD critique | ADC | Anti-soins | Berserker's Greaves → Bloodthirster → Infinity Edge → Mortal Reminder → Yun Tal Wildarrows → Kraken Slayer | 17250 |
| 8 | Dégâts AD critique | ADC | Alternative (sans Bloodthirster) | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Kraken Slayer → Axiom Arc | 16400 |
| 9 | Dégâts AD critique | ADC | Alternative (sans Infinity Edge) | Berserker's Greaves → Bloodthirster → Yun Tal Wildarrows → Lord Dominik's Regards → Kraken Slayer → Axiom Arc | 16350 |
| 10 | Dégâts AD critique | ADC | Alternative (sans Yun Tal Wildarrows) | Berserker's Greaves → Bloodthirster → Infinity Edge → Lord Dominik's Regards → Kraken Slayer → Axiom Arc | 16800 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Guardian Angel (AD) / Maw of Malmortius ou Mercurial Scimitar (AP).
- **Tank** feed / 2 tanks ou plus : **Ravenous Hydra** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Mortal Reminder** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Mercurial Scimitar.
- **En avance** : finir l'objet offensif principal, puis **The Collector** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Mordekaiser

- **Rôles** : Top, Jungle · dégâts magiques · sans mana · mêlée
- **Kit** : dégâts sur la durée, sorts fréquents (accélération rentable), dégâts de zone, soins sur soi, ultime décisif.
- **Répartition des 10 builds** : Combattant (7), Combattant (jungle) (3)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant | Top | Standard | Mercury's Treads → Riftmaker → Liandry's Torment → Rabadon's Deathcap → Rylai's Crystal Scepter → Zhonya's Hourglass | 16700 |
| 2 | Combattant | Top | Contre AD / assassins | Plated Steelcaps → Riftmaker → Randuin's Omen → Zhonya's Hourglass → Thornmail → Rabadon's Deathcap | 16200 |
| 3 | Combattant | Top | Contre AP | Mercury's Treads → Riftmaker → Banshee's Veil → Kaenic Rookern → Jak'Sho, The Protean → Rabadon's Deathcap | 16950 |
| 4 | Combattant | Top | Contre tanks | Mercury's Treads → Riftmaker → Liandry's Torment → Void Staff → Rabadon's Deathcap → Rylai's Crystal Scepter | 16450 |
| 5 | Combattant | Top | Sustain | Mercury's Treads → Riftmaker → Spirit Visage → Unending Despair → Liandry's Torment → Rabadon's Deathcap | 16350 |
| 6 | Combattant | Top | Accélération | Mercury's Treads → Riftmaker → Cosmic Drive → Rabadon's Deathcap → Liandry's Torment → Horizon Focus | 16600 |
| 7 | Combattant | Top | Anti-soins | Mercury's Treads → Morellonomicon → Riftmaker → Rabadon's Deathcap → Liandry's Torment → Rylai's Crystal Scepter | 16300 |
| 8 | Combattant (jungle) | Jungle | Standard | Mercury's Treads → Riftmaker → Liandry's Torment → Rabadon's Deathcap → Rylai's Crystal Scepter → Spirit Visage | 16150 |
| 9 | Combattant (jungle) | Jungle | Contre AP | Mercury's Treads → Riftmaker → Banshee's Veil → Spirit Visage → Kaenic Rookern → Rabadon's Deathcap | 16450 |
| 10 | Combattant (jungle) | Jungle | Accélération | Mercury's Treads → Riftmaker → Cosmic Drive → Rabadon's Deathcap → Spirit Visage → Abyssal Mask | 16200 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Randuin's Omen** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Void Staff** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Jak'Sho, The Protean** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Morgana

- **Rôles** : Support, Mid, Jungle · dégâts magiques · mana · distance
- **Kit** : engage et contrôles, sorts fréquents (accélération rentable), dégâts sur la durée, dégâts de zone, soins / boucliers aux alliés.
- **Répartition des 10 builds** : Dégâts AP continu (2), Dégâts AP continu (jungle) (2), Support dégâts AP continu (4), Support enchanteur (2)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP continu | Mid | Standard | Sorcerer's Shoes → Shadowflame → Horizon Focus → Rabadon's Deathcap → Void Staff → Malignance | 16250 |
| 2 | Dégâts AP continu | Mid | Contre tanks | Ionian Boots of Lucidity → Malignance → Liandry's Torment → Rabadon's Deathcap → Void Staff → Horizon Focus | 15850 |
| 3 | Dégâts AP continu (jungle) | Jungle | Contre AD / assassins | Plated Steelcaps → Malignance → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Horizon Focus | 16400 |
| 4 | Dégâts AP continu (jungle) | Jungle | Contre AP | Mercury's Treads → Malignance → Banshee's Veil → Rabadon's Deathcap → Void Staff → Horizon Focus | 16200 |
| 5 | Support dégâts AP continu | Support | Standard | Zaz'Zak's Realmspike → Sorcerer's Shoes → Malignance → Horizon Focus → Rabadon's Deathcap → Void Staff | 13050 |
| 6 | Support dégâts AP continu | Support | Contre AD / assassins | Zaz'Zak's Realmspike → Plated Steelcaps → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Thornmail | 13400 |
| 7 | Support dégâts AP continu | Support | Contre AP | Zaz'Zak's Realmspike → Mercury's Treads → Banshee's Veil → Rabadon's Deathcap → Void Staff → Horizon Focus | 13500 |
| 8 | Support dégâts AP continu | Support | Accélération | Zaz'Zak's Realmspike → Ionian Boots of Lucidity → Malignance → Horizon Focus → Rabadon's Deathcap → Void Staff | 12850 |
| 9 | Support enchanteur | Support | Standard | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Ardent Censer → Locket of the Iron Solari → Staff of Flowing Water | 9850 |
| 10 | Support enchanteur | Support | Contre AD / assassins | Celestial Opposition → Plated Steelcaps → Frozen Heart → Locket of the Iron Solari → Zeke's Convergence → Mikael's Blessing | 10400 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Liandry's Torment** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Stormsurge** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Naafiri

- **Rôles** : Mid · dégâts physiques · sans mana · mêlée
- **Kit** : burst, très mobile, sorts fréquents (accélération rentable), ultime décisif.
- **Répartition des 10 builds** : Dégâts AD létalité (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD létalité | Mid | Standard | Ionian Boots of Lucidity → Axiom Arc → Profane Hydra → Serylda's Grudge → Bloodthirster → Voltaic Cyclosword | 15900 |
| 2 | Dégâts AD létalité | Mid | Contre tanks | Ionian Boots of Lucidity → Serylda's Grudge → Bloodthirster → Axiom Arc → Death's Dance → Eclipse | 16250 |
| 3 | Dégâts AD létalité | Mid | Contre AD / assassins | Plated Steelcaps → Bloodthirster → Guardian Angel → Death's Dance → Axiom Arc → Eclipse | 16750 |
| 4 | Dégâts AD létalité | Mid | Contre AP | Mercury's Treads → Edge of Night → Maw of Malmortius → Axiom Arc → Profane Hydra → Serylda's Grudge | 15950 |
| 5 | Dégâts AD létalité | Mid | Boule de neige | Ionian Boots of Lucidity → Hubris → Opportunity → Axiom Arc → Profane Hydra → Voltaic Cyclosword | 15200 |
| 6 | Dégâts AD létalité | Mid | Accélération | Ionian Boots of Lucidity → Axiom Arc → Serylda's Grudge → Profane Hydra → Voltaic Cyclosword → Eclipse | 15400 |
| 7 | Dégâts AD létalité | Mid | Anti-soins | Ionian Boots of Lucidity → Axiom Arc → Profane Hydra → Mortal Reminder → Bloodthirster → Voltaic Cyclosword | 16200 |
| 8 | Dégâts AD létalité | Mid | Alternative (sans Axiom Arc) | Ionian Boots of Lucidity → Profane Hydra → Serylda's Grudge → Bloodthirster → Voltaic Cyclosword → Youmuu's Ghostblade | 15950 |
| 9 | Dégâts AD létalité | Mid | Alternative (sans Profane Hydra) | Ionian Boots of Lucidity → Axiom Arc → Serylda's Grudge → Bloodthirster → Voltaic Cyclosword → Youmuu's Ghostblade | 15850 |
| 10 | Dégâts AD létalité | Mid | Alternative (sans Serylda's Grudge) | Ionian Boots of Lucidity → Axiom Arc → Profane Hydra → Bloodthirster → Voltaic Cyclosword → Youmuu's Ghostblade | 15700 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Death's Dance** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Hubris** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Nami

- **Rôles** : Support · dégâts magiques · mana · distance
- **Kit** : soins / boucliers aux alliés, sorts fréquents (accélération rentable), engage et contrôles, ultime décisif.
- **Répartition des 10 builds** : Support enchanteur (7), Support dégâts AP burst (3)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Support enchanteur | Support | Standard | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Ardent Censer → Dawncore → Staff of Flowing Water | 10150 |
| 2 | Support enchanteur | Support | Contre AD / assassins | Celestial Opposition → Plated Steelcaps → Mikael's Blessing → Ardent Censer → Frozen Heart → Locket of the Iron Solari | 10400 |
| 3 | Support enchanteur | Support | Accélération | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Staff of Flowing Water → Redemption → Ardent Censer | 9950 |
| 4 | Support enchanteur | Support | Anti-soins | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Ardent Censer → Morellonomicon → Dawncore | 10750 |
| 5 | Support enchanteur | Support | Contre AP | Celestial Opposition → Mercury's Treads → Mikael's Blessing → Ardent Censer → Locket of the Iron Solari → Dawncore | 10450 |
| 6 | Support dégâts AP burst | Support | Standard | Zaz'Zak's Realmspike → Ionian Boots of Lucidity → Malignance → Rabadon's Deathcap → Void Staff → Horizon Focus | 12850 |
| 7 | Support dégâts AP burst | Support | Contre AD / assassins | Zaz'Zak's Realmspike → Plated Steelcaps → Malignance → Zhonya's Hourglass → Thornmail → Randuin's Omen | 12300 |
| 8 | Support dégâts AP burst | Support | Contre AP | Zaz'Zak's Realmspike → Mercury's Treads → Malignance → Banshee's Veil → Kaenic Rookern → Vigilant Wardstone | 12150 |
| 9 | Support enchanteur | Support | Alternative (sans Mikael's Blessing) | Dream Maker → Ionian Boots of Lucidity → Ardent Censer → Dawncore → Staff of Flowing Water → Redemption | 10150 |
| 10 | Support enchanteur | Support | Alternative (sans Ardent Censer) | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Dawncore → Staff of Flowing Water → Redemption | 10250 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Frozen Heart** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Abyssal Mask** en objet suivant.
- **Assassin** feed qui vous cible : protéger le carry visé (Knight's Vow, Locket of the Iron Solari) ; pour vous : Frozen Heart.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : poser plus de balises de contrôle, jouer pour les objectifs ; objet d'équipe suivant : **Locket of the Iron Solari**.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Frozen Heart**.

### Nasus

- **Rôles** : Top · dégâts physiques · mana · mêlée
- **Kit** : sorts fréquents (accélération rentable), dépend des attaques de base, dégâts sur la durée, soins sur soi, ultime décisif.
- **Répartition des 10 builds** : Combattant (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant | Top | Standard | Mercury's Treads → Stridebreaker → Death's Dance → Spear of Shojin → Experimental Hexplate → Maw of Malmortius | 17050 |
| 2 | Combattant | Top | Contre AD / assassins | Plated Steelcaps → Spear of Shojin → Death's Dance → Randuin's Omen → Frozen Heart → Sterak's Gage | 16000 |
| 3 | Combattant | Top | Contre AP | Mercury's Treads → Spear of Shojin → Maw of Malmortius → Death's Dance → Kaenic Rookern → Jak'Sho, The Protean | 16850 |
| 4 | Combattant | Top | Contre tanks | Mercury's Treads → Serylda's Grudge → Death's Dance → Spear of Shojin → Stridebreaker → Experimental Hexplate | 16950 |
| 5 | Combattant | Top | Sustain | Mercury's Treads → Spear of Shojin → Death's Dance → Sundered Sky → Sterak's Gage → Spirit Visage | 16650 |
| 6 | Combattant | Top | Split push | Mercury's Treads → Hullbreaker → Death's Dance → Spear of Shojin → Stridebreaker → Experimental Hexplate | 16950 |
| 7 | Combattant | Top | Accélération | Mercury's Treads → Spear of Shojin → Death's Dance → Black Cleaver → Maw of Malmortius → Experimental Hexplate | 16750 |
| 8 | Combattant | Top | Anti-soins | Mercury's Treads → Chempunk Chainsword → Death's Dance → Spear of Shojin → Stridebreaker → Experimental Hexplate | 17050 |
| 9 | Combattant | Top | Alternative (sans Death's Dance) | Mercury's Treads → Spear of Shojin → Stridebreaker → Experimental Hexplate → Maw of Malmortius → Black Cleaver | 16750 |
| 10 | Combattant | Top | Alternative (sans Spear of Shojin) | Mercury's Treads → Stridebreaker → Death's Dance → Experimental Hexplate → Maw of Malmortius → Black Cleaver | 16950 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Randuin's Omen** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Serylda's Grudge** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Black Cleaver** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Nautilus

- **Rôles** : Support · dégâts magiques · mana · mêlée
- **Kit** : engage et contrôles, naturellement résistant, sorts fréquents (accélération rentable), ultime décisif.
- **Répartition des 10 builds** : Support engage (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Support engage | Support | Standard | Celestial Opposition → Mercury's Treads → Zeke's Convergence → Locket of the Iron Solari → Vigilant Wardstone → Randuin's Omen | 10650 |
| 2 | Support engage | Support | Engagement | Solstice Sleigh → Mercury's Treads → Zeke's Convergence → Locket of the Iron Solari → Trailblazer → Vigilant Wardstone | 10350 |
| 3 | Support engage | Support | Contre AD / assassins | Celestial Opposition → Plated Steelcaps → Randuin's Omen → Frozen Heart → Thornmail → Zeke's Convergence | 11050 |
| 4 | Support engage | Support | Contre AP | Celestial Opposition → Mercury's Treads → Zeke's Convergence → Kaenic Rookern → Locket of the Iron Solari → Vigilant Wardstone | 10850 |
| 5 | Support engage | Support | Anti-soins | Celestial Opposition → Mercury's Treads → Thornmail → Zeke's Convergence → Locket of the Iron Solari → Vigilant Wardstone | 10400 |
| 6 | Support engage | Support | Alternative (sans Zeke's Convergence) | Celestial Opposition → Mercury's Treads → Locket of the Iron Solari → Vigilant Wardstone → Randuin's Omen → Frozen Heart | 10950 |
| 7 | Support engage | Support | Alternative (sans Locket of the Iron Solari) | Celestial Opposition → Mercury's Treads → Zeke's Convergence → Vigilant Wardstone → Randuin's Omen → Frozen Heart | 10950 |
| 8 | Support engage | Support | Alternative (sans Vigilant Wardstone) | Celestial Opposition → Mercury's Treads → Zeke's Convergence → Locket of the Iron Solari → Randuin's Omen → Frozen Heart | 10850 |
| 9 | Support engage | Support | Alternative (sans Randuin's Omen) | Celestial Opposition → Mercury's Treads → Zeke's Convergence → Locket of the Iron Solari → Vigilant Wardstone → Frozen Heart | 10450 |
| 10 | Support engage | Support | Alternative (sans Zeke's Convergence, Locket of the Iron Solari) | Celestial Opposition → Mercury's Treads → Vigilant Wardstone → Randuin's Omen → Frozen Heart → Abyssal Mask | 11400 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Frozen Heart** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : protéger le carry visé (Knight's Vow, Locket of the Iron Solari) ; pour vous : Frozen Heart.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Thornmail** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : poser plus de balises de contrôle, jouer pour les objectifs ; objet d'équipe suivant : **Trailblazer**.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Frozen Heart**.

### Neeko

- **Rôles** : Mid, Support · dégâts magiques · mana · distance
- **Kit** : burst, dégâts de zone, engage et contrôles, ultime décisif, sorts fréquents (accélération rentable).
- **Répartition des 10 builds** : Dégâts AP burst (6), Support dégâts AP burst (4)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP burst | Mid | Standard | Sorcerer's Shoes → Shadowflame → Rabadon's Deathcap → Void Staff → Malignance → Stormsurge | 16300 |
| 2 | Dégâts AP burst | Mid | Contre tanks | Ionian Boots of Lucidity → Malignance → Rabadon's Deathcap → Void Staff → Horizon Focus → Shadowflame | 16050 |
| 3 | Dégâts AP burst | Mid | Contre AD / assassins | Plated Steelcaps → Shadowflame → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Malignance | 16850 |
| 4 | Dégâts AP burst | Mid | Contre AP | Mercury's Treads → Shadowflame → Banshee's Veil → Rabadon's Deathcap → Void Staff → Malignance | 16650 |
| 5 | Dégâts AP burst | Mid | Boule de neige | Sorcerer's Shoes → Shadowflame → Stormsurge → Rabadon's Deathcap → Void Staff → Luden's Companion | 16350 |
| 6 | Dégâts AP burst | Mid | Anti-soins | Sorcerer's Shoes → Shadowflame → Morellonomicon → Rabadon's Deathcap → Void Staff → Malignance | 16350 |
| 7 | Support dégâts AP burst | Support | Standard | Zaz'Zak's Realmspike → Sorcerer's Shoes → Malignance → Rabadon's Deathcap → Void Staff → Stormsurge | 13100 |
| 8 | Support dégâts AP burst | Support | Contre AD / assassins | Zaz'Zak's Realmspike → Plated Steelcaps → Malignance → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff | 13650 |
| 9 | Support dégâts AP burst | Support | Contre AP | Zaz'Zak's Realmspike → Mercury's Treads → Malignance → Banshee's Veil → Rabadon's Deathcap → Void Staff | 13450 |
| 10 | Support dégâts AP burst | Support | Boule de neige | Zaz'Zak's Realmspike → Sorcerer's Shoes → Stormsurge → Shadowflame → Rabadon's Deathcap → Luden's Companion | 13350 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Horizon Focus** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Luden's Companion** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Nidalee

- **Rôles** : Jungle · dégâts magiques · mana · distance
- **Kit** : burst, poke à longue portée, très mobile.
- **Répartition des 10 builds** : Dégâts AP burst (jungle) (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP burst (jungle) | Jungle | Standard | Sorcerer's Shoes → Shadowflame → Horizon Focus → Rabadon's Deathcap → Void Staff → Stormsurge | 16350 |
| 2 | Dégâts AP burst (jungle) | Jungle | Contre tanks | Ionian Boots of Lucidity → Shadowflame → Horizon Focus → Rabadon's Deathcap → Void Staff → Luden's Companion | 16100 |
| 3 | Dégâts AP burst (jungle) | Jungle | Contre AD / assassins | Plated Steelcaps → Shadowflame → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Horizon Focus | 16900 |
| 4 | Dégâts AP burst (jungle) | Jungle | Contre AP | Mercury's Treads → Shadowflame → Banshee's Veil → Rabadon's Deathcap → Void Staff → Horizon Focus | 16700 |
| 5 | Dégâts AP burst (jungle) | Jungle | Boule de neige | Sorcerer's Shoes → Shadowflame → Stormsurge → Rabadon's Deathcap → Void Staff → Luden's Companion | 16350 |
| 6 | Dégâts AP burst (jungle) | Jungle | Poke | Sorcerer's Shoes → Shadowflame → Horizon Focus → Rabadon's Deathcap → Void Staff → Luden's Companion | 16300 |
| 7 | Dégâts AP burst (jungle) | Jungle | Anti-soins | Sorcerer's Shoes → Shadowflame → Morellonomicon → Rabadon's Deathcap → Void Staff → Horizon Focus | 16400 |
| 8 | Dégâts AP burst (jungle) | Jungle | Alternative (sans Shadowflame) | Sorcerer's Shoes → Stormsurge → Horizon Focus → Rabadon's Deathcap → Void Staff → Luden's Companion | 15900 |
| 9 | Dégâts AP burst (jungle) | Jungle | Alternative (sans Rabadon's Deathcap) | Sorcerer's Shoes → Shadowflame → Horizon Focus → Void Staff → Stormsurge → Luden's Companion | 15600 |
| 10 | Dégâts AP burst (jungle) | Jungle | Alternative (sans Void Staff) | Sorcerer's Shoes → Shadowflame → Horizon Focus → Rabadon's Deathcap → Stormsurge → Luden's Companion | 16100 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Luden's Companion** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Luden's Companion** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Nilah

- **Rôles** : ADC · dégâts physiques · mana · mêlée
- **Kit** : dépend des attaques de base, synergie coup critique, dégâts de zone, soins sur soi, très mobile.
- **Répartition des 10 builds** : Dégâts AD critique (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD critique | ADC | Standard | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Kraken Slayer → Bloodthirster | 17050 |
| 2 | Dégâts AD critique | ADC | Contre AD / assassins | Plated Steelcaps → Yun Tal Wildarrows → Guardian Angel → Death's Dance → Bloodthirster → Infinity Edge | 17550 |
| 3 | Dégâts AD critique | ADC | Contre AP | Mercury's Treads → Yun Tal Wildarrows → Maw of Malmortius → Infinity Edge → Lord Dominik's Regards → Kraken Slayer | 16900 |
| 4 | Dégâts AD critique | ADC | Boule de neige | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Kraken Slayer → The Collector | 16650 |
| 5 | Dégâts AD critique | ADC | Sustain | Berserker's Greaves → Bloodthirster → Ravenous Hydra → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards | 17350 |
| 6 | Dégâts AD critique | ADC | Anti-soins | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Mortal Reminder → Kraken Slayer → Bloodthirster | 17250 |
| 7 | Dégâts AD critique | ADC | Alternative (sans Yun Tal Wildarrows) | Berserker's Greaves → Bloodthirster → Infinity Edge → Kraken Slayer → Lord Dominik's Regards → Ravenous Hydra | 17350 |
| 8 | Dégâts AD critique | ADC | Alternative (sans Infinity Edge) | Berserker's Greaves → Yun Tal Wildarrows → Kraken Slayer → Lord Dominik's Regards → Bloodthirster → Ravenous Hydra | 16900 |
| 9 | Dégâts AD critique | ADC | Alternative (sans Yun Tal Wildarrows, Infinity Edge) | Berserker's Greaves → Kraken Slayer → Bloodthirster → Lord Dominik's Regards → Ravenous Hydra → Essence Reaver | 16800 |
| 10 | Dégâts AD critique | ADC | Alternative (sans Infinity Edge, Lord Dominik's Regards) | Berserker's Greaves → Yun Tal Wildarrows → Kraken Slayer → Mortal Reminder → Bloodthirster → Ravenous Hydra | 17100 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Blade of the Ruined King** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **The Collector** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Nocturne

- **Rôles** : Jungle · dégâts physiques · mana · mêlée
- **Kit** : très mobile, ultime décisif, dépend des attaques de base, sorts fréquents (accélération rentable).
- **Répartition des 10 builds** : Combattant (jungle) (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant (jungle) | Jungle | Standard | Mercury's Treads → Stridebreaker → Death's Dance → Experimental Hexplate → Spear of Shojin → Maw of Malmortius | 17050 |
| 2 | Combattant (jungle) | Jungle | Contre AD / assassins | Plated Steelcaps → Experimental Hexplate → Death's Dance → Randuin's Omen → Frozen Heart → Sterak's Gage | 15900 |
| 3 | Combattant (jungle) | Jungle | Contre AP | Mercury's Treads → Stridebreaker → Maw of Malmortius → Death's Dance → Kaenic Rookern → Experimental Hexplate | 16850 |
| 4 | Combattant (jungle) | Jungle | Contre tanks | Mercury's Treads → Serylda's Grudge → Death's Dance → Experimental Hexplate → Stridebreaker → Spear of Shojin | 16950 |
| 5 | Combattant (jungle) | Jungle | Sustain | Mercury's Treads → Bloodthirster → Death's Dance → Sundered Sky → Ravenous Hydra → Sterak's Gage | 17550 |
| 6 | Combattant (jungle) | Jungle | Accélération | Mercury's Treads → Experimental Hexplate → Death's Dance → Spear of Shojin → Maw of Malmortius → Black Cleaver | 16750 |
| 7 | Combattant (jungle) | Jungle | Anti-soins | Mercury's Treads → Chempunk Chainsword → Death's Dance → Experimental Hexplate → Stridebreaker → Spear of Shojin | 17050 |
| 8 | Combattant (jungle) | Jungle | Alternative (sans Death's Dance) | Mercury's Treads → Experimental Hexplate → Stridebreaker → Spear of Shojin → Maw of Malmortius → Black Cleaver | 16750 |
| 9 | Combattant (jungle) | Jungle | Alternative (sans Experimental Hexplate) | Mercury's Treads → Stridebreaker → Death's Dance → Spear of Shojin → Maw of Malmortius → Black Cleaver | 17050 |
| 10 | Combattant (jungle) | Jungle | Alternative (sans Spear of Shojin) | Mercury's Treads → Stridebreaker → Death's Dance → Experimental Hexplate → Maw of Malmortius → Black Cleaver | 16950 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Randuin's Omen** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Serylda's Grudge** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Black Cleaver** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Nunu & Willump

- **Rôles** : Jungle · dégâts magiques · mana · mêlée
- **Kit** : engage et contrôles, naturellement résistant, sorts fréquents (accélération rentable), dégâts de zone, soins sur soi.
- **Répartition des 10 builds** : Tank (jungle) (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Tank (jungle) | Jungle | Standard | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Unending Despair → Sunfire Aegis | 16050 |
| 2 | Tank (jungle) | Jungle | Contre AD / assassins | Plated Steelcaps → Randuin's Omen → Frozen Heart → Jak'Sho, The Protean → Heartsteel → Warmog's Armor | 15700 |
| 3 | Tank (jungle) | Jungle | Contre AP | Mercury's Treads → Jak'Sho, The Protean → Heartsteel → Warmog's Armor → Unending Despair → Abyssal Mask | 16000 |
| 4 | Tank (jungle) | Jungle | Engagement | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Dead Man's Plate → Unending Despair | 16250 |
| 5 | Tank (jungle) | Jungle | Anti-soins | Mercury's Treads → Heartsteel → Thornmail → Jak'Sho, The Protean → Warmog's Armor → Unending Despair | 15800 |
| 6 | Tank (jungle) | Jungle | Alternative (sans Heartsteel) | Mercury's Treads → Jak'Sho, The Protean → Unending Despair → Sunfire Aegis → Warmog's Armor → Abyssal Mask | 15700 |
| 7 | Tank (jungle) | Jungle | Alternative (sans Jak'Sho, The Protean) | Mercury's Treads → Heartsteel → Unending Despair → Warmog's Armor → Sunfire Aegis → Abyssal Mask | 15500 |
| 8 | Tank (jungle) | Jungle | Alternative (sans Warmog's Armor) | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Unending Despair → Sunfire Aegis → Abyssal Mask | 15600 |
| 9 | Tank (jungle) | Jungle | Alternative (sans Unending Despair) | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Sunfire Aegis → Abyssal Mask | 15900 |
| 10 | Tank (jungle) | Jungle | Alternative (sans Heartsteel, Jak'Sho, The Protean) | Mercury's Treads → Unending Despair → Sunfire Aegis → Abyssal Mask → Warmog's Armor → Randuin's Omen | 15200 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Randuin's Omen** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : protéger le carry visé (Knight's Vow, Locket of the Iron Solari) ; pour vous : Randuin's Omen.
- **Tank** feed / 2 tanks ou plus : **Randuin's Omen** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Thornmail** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : poser plus de balises de contrôle, jouer pour les objectifs ; objet d'équipe suivant : **Dead Man's Plate**.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Olaf

- **Rôles** : Jungle, Top · dégâts physiques · mana · mêlée
- **Kit** : soins sur soi, dépend des attaques de base, dégâts sur la durée, très mobile.
- **Répartition des 10 builds** : Combattant (4), Combattant (jungle) (6)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant | Top | Standard | Mercury's Treads → Bloodthirster → Death's Dance → Stridebreaker → Sterak's Gage → Sundered Sky | 17550 |
| 2 | Combattant | Top | Contre AD / assassins | Plated Steelcaps → Stridebreaker → Death's Dance → Randuin's Omen → Guardian Angel → Sterak's Gage | 16900 |
| 3 | Combattant | Top | Contre AP | Mercury's Treads → Stridebreaker → Death's Dance → Kaenic Rookern → Maw of Malmortius → Spirit Visage | 16550 |
| 4 | Combattant | Top | Contre tanks | Mercury's Treads → Serylda's Grudge → Death's Dance → Stridebreaker → Sterak's Gage → Sundered Sky | 17150 |
| 5 | Combattant (jungle) | Jungle | Standard | Mercury's Treads → Stridebreaker → Death's Dance → Sundered Sky → Sterak's Gage → Spirit Visage | 16850 |
| 6 | Combattant (jungle) | Jungle | Sustain | Mercury's Treads → Ravenous Hydra → Death's Dance → Sundered Sky → Spirit Visage → Sterak's Gage | 16850 |
| 7 | Combattant (jungle) | Jungle | Anti-soins | Mercury's Treads → Chempunk Chainsword → Death's Dance → Stridebreaker → Sundered Sky → Sterak's Gage | 17250 |
| 8 | Combattant (jungle) | Jungle | Alternative (sans Death's Dance) | Mercury's Treads → Stridebreaker → Sundered Sky → Sterak's Gage → Spirit Visage → Bloodthirster | 16950 |
| 9 | Combattant (jungle) | Jungle | Alternative (sans Sundered Sky) | Mercury's Treads → Bloodthirster → Death's Dance → Stridebreaker → Sterak's Gage → Spirit Visage | 17150 |
| 10 | Combattant (jungle) | Jungle | Alternative (sans Sterak's Gage) | Mercury's Treads → Stridebreaker → Death's Dance → Sundered Sky → Spirit Visage → Maw of Malmortius | 16750 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Randuin's Omen** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Serylda's Grudge** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Guardian Angel** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Orianna

- **Rôles** : Mid · dégâts magiques · mana · distance
- **Kit** : dégâts de zone, ultime décisif, sorts fréquents (accélération rentable), gros besoin de mana, burst.
- **Répartition des 10 builds** : Dégâts AP burst (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP burst | Mid | Standard | Sorcerer's Shoes → Malignance → Rabadon's Deathcap → Void Staff → Shadowflame → Luden's Companion | 16250 |
| 2 | Dégâts AP burst | Mid | Contre tanks | Ionian Boots of Lucidity → Archangel's Staff → Malignance → Rabadon's Deathcap → Void Staff → Horizon Focus | 15750 |
| 3 | Dégâts AP burst | Mid | Contre AD / assassins | Plated Steelcaps → Shadowflame → Zhonya's Hourglass → Malignance → Rabadon's Deathcap → Void Staff | 16850 |
| 4 | Dégâts AP burst | Mid | Contre AP | Mercury's Treads → Shadowflame → Banshee's Veil → Malignance → Rabadon's Deathcap → Void Staff | 16650 |
| 5 | Dégâts AP burst | Mid | Boule de neige | Sorcerer's Shoes → Shadowflame → Stormsurge → Rabadon's Deathcap → Malignance → Void Staff | 16300 |
| 6 | Dégâts AP burst | Mid | Partie longue | Sorcerer's Shoes → Archangel's Staff → Malignance → Rabadon's Deathcap → Void Staff → Shadowflame | 16400 |
| 7 | Dégâts AP burst | Mid | Anti-soins | Sorcerer's Shoes → Shadowflame → Morellonomicon → Malignance → Rabadon's Deathcap → Void Staff | 16350 |
| 8 | Dégâts AP burst | Mid | Alternative (sans Malignance) | Sorcerer's Shoes → Shadowflame → Rabadon's Deathcap → Void Staff → Luden's Companion → Horizon Focus | 16300 |
| 9 | Dégâts AP burst | Mid | Alternative (sans Rabadon's Deathcap) | Sorcerer's Shoes → Malignance → Shadowflame → Void Staff → Luden's Companion → Horizon Focus | 15500 |
| 10 | Dégâts AP burst | Mid | Alternative (sans Void Staff) | Sorcerer's Shoes → Malignance → Shadowflame → Rabadon's Deathcap → Luden's Companion → Horizon Focus | 16000 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Horizon Focus** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Stormsurge** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Ornn

- **Rôles** : Top · dégâts mixtes · mana · mêlée
- **Kit** : engage et contrôles, ultime décisif, naturellement résistant, sorts fréquents (accélération rentable), dégâts de zone.
- **Répartition des 10 builds** : Tank (10)
- **Particularité** : Améliore les objets de son équipe ; privilégier des objets améliorables.

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Tank | Top | Standard | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Randuin's Omen → Unending Despair | 16050 |
| 2 | Tank | Top | Contre AD / assassins | Plated Steelcaps → Randuin's Omen → Frozen Heart → Jak'Sho, The Protean → Heartsteel → Warmog's Armor | 15700 |
| 3 | Tank | Top | Contre AP | Mercury's Treads → Jak'Sho, The Protean → Heartsteel → Warmog's Armor → Kaenic Rookern → Abyssal Mask | 16100 |
| 4 | Tank | Top | Engagement | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Dead Man's Plate → Zeke's Convergence | 15650 |
| 5 | Tank | Top | Accélération | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Abyssal Mask → Unending Despair | 16000 |
| 6 | Tank | Top | Anti-soins | Mercury's Treads → Thornmail → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Randuin's Omen | 15700 |
| 7 | Tank | Top | Alternative (sans Heartsteel) | Mercury's Treads → Jak'Sho, The Protean → Randuin's Omen → Unending Despair → Warmog's Armor → Sunfire Aegis | 15750 |
| 8 | Tank | Top | Alternative (sans Jak'Sho, The Protean) | Mercury's Treads → Heartsteel → Randuin's Omen → Warmog's Armor → Unending Despair → Sunfire Aegis | 15550 |
| 9 | Tank | Top | Alternative (sans Warmog's Armor) | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Randuin's Omen → Unending Despair → Sunfire Aegis | 15650 |
| 10 | Tank | Top | Alternative (sans Randuin's Omen) | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Unending Despair → Sunfire Aegis | 16050 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Frozen Heart** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : protéger le carry visé (Knight's Vow, Locket of the Iron Solari) ; pour vous : Frozen Heart.
- **Tank** feed / 2 tanks ou plus : **Sunfire Aegis** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Thornmail** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : poser plus de balises de contrôle, jouer pour les objectifs ; objet d'équipe suivant : **Dead Man's Plate**.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Frozen Heart**.

### Pantheon

- **Rôles** : Support, Mid, Top, Jungle · dégâts physiques · mana · mêlée
- **Kit** : burst, sorts fréquents (accélération rentable), engage et contrôles, très mobile.
- **Répartition des 10 builds** : Dégâts AD létalité (3), Dégâts AD létalité (jungle) (2), Support dégâts AD létalité (5)
- **Particularité** : Support : profil AD_ASSASSIN avec Bloodsong en 1er objet.

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD létalité | Mid, Top | Standard | Ionian Boots of Lucidity → Axiom Arc → Profane Hydra → Serylda's Grudge → Bloodthirster → Voltaic Cyclosword | 15900 |
| 2 | Dégâts AD létalité | Mid, Top | Contre tanks | Ionian Boots of Lucidity → Serylda's Grudge → Bloodthirster → Death's Dance → Axiom Arc → Eclipse | 16250 |
| 3 | Dégâts AD létalité | Mid, Top | Contre AD / assassins | Plated Steelcaps → Bloodthirster → Guardian Angel → Death's Dance → Eclipse → Axiom Arc | 16750 |
| 4 | Dégâts AD létalité (jungle) | Jungle | Contre tanks | Ionian Boots of Lucidity → Serylda's Grudge → Bloodthirster → Death's Dance → Ravenous Hydra → Axiom Arc | 16650 |
| 5 | Dégâts AD létalité (jungle) | Jungle | Contre AD / assassins | Plated Steelcaps → Bloodthirster → Death's Dance → Guardian Angel → Profane Hydra → Eclipse | 16850 |
| 6 | Support dégâts AD létalité | Support | Standard | Bloodsong → Ionian Boots of Lucidity → Axiom Arc → Profane Hydra → Opportunity → Youmuu's Ghostblade | 12000 |
| 7 | Support dégâts AD létalité | Support | Contre AD / assassins | Bloodsong → Plated Steelcaps → Axiom Arc → Guardian Angel → Death's Dance → Thornmail | 12900 |
| 8 | Support dégâts AD létalité | Support | Contre AP | Bloodsong → Mercury's Treads → Edge of Night → Maw of Malmortius → Axiom Arc → Profane Hydra | 12950 |
| 9 | Support dégâts AD létalité | Support | Boule de neige | Bloodsong → Ionian Boots of Lucidity → Opportunity → Hubris → Profane Hydra → Axiom Arc | 12200 |
| 10 | Support dégâts AD létalité | Support | Accélération | Bloodsong → Ionian Boots of Lucidity → Axiom Arc → Profane Hydra → Serylda's Grudge → Eclipse | 12400 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Death's Dance** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Hubris** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Poppy

- **Rôles** : Top, Jungle, Support · dégâts physiques · mana · mêlée
- **Kit** : engage et contrôles, naturellement résistant, sorts fréquents (accélération rentable), très mobile, ultime décisif.
- **Répartition des 10 builds** : Combattant (2), Tank (4), Tank (jungle) (2), Support engage (2)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant | Top | Standard | Mercury's Treads → Spear of Shojin → Jak'Sho, The Protean → Death's Dance → Sterak's Gage → Randuin's Omen | 16750 |
| 2 | Combattant | Top | Contre AD / assassins | Plated Steelcaps → Death's Dance → Randuin's Omen → Frozen Heart → Sterak's Gage → Jak'Sho, The Protean | 16100 |
| 3 | Tank | Top | Standard | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Randuin's Omen → Unending Despair | 16050 |
| 4 | Tank | Top | Contre AD / assassins | Plated Steelcaps → Randuin's Omen → Frozen Heart → Jak'Sho, The Protean → Heartsteel → Warmog's Armor | 15700 |
| 5 | Tank | Top | Contre AP | Mercury's Treads → Jak'Sho, The Protean → Kaenic Rookern → Heartsteel → Warmog's Armor → Abyssal Mask | 16100 |
| 6 | Tank | Top | Engagement | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Dead Man's Plate → Zeke's Convergence | 15650 |
| 7 | Tank (jungle) | Jungle | Accélération | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Unending Despair → Abyssal Mask | 16000 |
| 8 | Tank (jungle) | Jungle | Anti-soins | Mercury's Treads → Thornmail → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Unending Despair | 15800 |
| 9 | Support engage | Support | Standard | Celestial Opposition → Mercury's Treads → Zeke's Convergence → Locket of the Iron Solari → Vigilant Wardstone → Randuin's Omen | 10650 |
| 10 | Support engage | Support | Engagement | Solstice Sleigh → Mercury's Treads → Zeke's Convergence → Locket of the Iron Solari → Trailblazer → Vigilant Wardstone | 10350 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Frozen Heart** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Black Cleaver** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Abyssal Mask** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Frozen Heart**.

### Pyke

- **Rôles** : Support · dégâts physiques · mana · mêlée
- **Kit** : burst, engage et contrôles, ultime décisif, sorts fréquents (accélération rentable), très mobile.
- **Répartition des 10 builds** : Support dégâts AD létalité (10)
- **Particularité** : Support : le 1er emplacement devient Bloodsong ; ne gagne pas de PV via objets (PV bonus convertis en AD).

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Support dégâts AD létalité | Support | Standard | Bloodsong → Ionian Boots of Lucidity → Axiom Arc → Profane Hydra → Opportunity → Youmuu's Ghostblade | 12000 |
| 2 | Support dégâts AD létalité | Support | Contre AD / assassins | Bloodsong → Plated Steelcaps → Axiom Arc → Guardian Angel → Death's Dance → Thornmail | 12900 |
| 3 | Support dégâts AD létalité | Support | Contre AP | Bloodsong → Mercury's Treads → Edge of Night → Axiom Arc → Maw of Malmortius → Profane Hydra | 12950 |
| 4 | Support dégâts AD létalité | Support | Boule de neige | Bloodsong → Ionian Boots of Lucidity → Axiom Arc → Opportunity → Hubris → Profane Hydra | 12200 |
| 5 | Support dégâts AD létalité | Support | Accélération | Bloodsong → Ionian Boots of Lucidity → Axiom Arc → Profane Hydra → Serylda's Grudge → Eclipse | 12400 |
| 6 | Support dégâts AD létalité | Support | Anti-soins | Bloodsong → Ionian Boots of Lucidity → Axiom Arc → Profane Hydra → Mortal Reminder → Opportunity | 12500 |
| 7 | Support dégâts AD létalité | Support | Alternative (sans Axiom Arc) | Bloodsong → Ionian Boots of Lucidity → Profane Hydra → Opportunity → Youmuu's Ghostblade → Umbral Glaive | 11750 |
| 8 | Support dégâts AD létalité | Support | Alternative (sans Profane Hydra) | Bloodsong → Ionian Boots of Lucidity → Axiom Arc → Opportunity → Youmuu's Ghostblade → Umbral Glaive | 11650 |
| 9 | Support dégâts AD létalité | Support | Alternative (sans Opportunity) | Bloodsong → Ionian Boots of Lucidity → Axiom Arc → Profane Hydra → Youmuu's Ghostblade → Umbral Glaive | 11800 |
| 10 | Support dégâts AD létalité | Support | Alternative (sans Youmuu's Ghostblade) | Bloodsong → Ionian Boots of Lucidity → Axiom Arc → Profane Hydra → Opportunity → Umbral Glaive | 11700 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : protéger le carry visé (Knight's Vow, Locket of the Iron Solari) ; pour vous : Guardian Angel.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Executioner's Calling (composant) → Mortal Reminder ou Chempunk Chainsword d'un allié** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : poser plus de balises de contrôle, jouer pour les objectifs ; objet d'équipe suivant : **Umbral Glaive**.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Thornmail**.

### Qiyana

- **Rôles** : Mid, Jungle · dégâts physiques · mana · mêlée
- **Kit** : burst, très mobile, ultime décisif, sorts fréquents (accélération rentable), dégâts de zone.
- **Répartition des 10 builds** : Dégâts AD létalité (7), Dégâts AD létalité (jungle) (3)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD létalité | Mid | Standard | Ionian Boots of Lucidity → Axiom Arc → Profane Hydra → Serylda's Grudge → Bloodthirster → Voltaic Cyclosword | 15900 |
| 2 | Dégâts AD létalité | Mid | Contre tanks | Ionian Boots of Lucidity → Serylda's Grudge → Axiom Arc → Bloodthirster → Profane Hydra → Death's Dance | 16200 |
| 3 | Dégâts AD létalité | Mid | Contre AD / assassins | Plated Steelcaps → Bloodthirster → Guardian Angel → Death's Dance → Axiom Arc → Profane Hydra | 16700 |
| 4 | Dégâts AD létalité | Mid | Contre AP | Mercury's Treads → Edge of Night → Maw of Malmortius → Axiom Arc → Profane Hydra → Serylda's Grudge | 15950 |
| 5 | Dégâts AD létalité | Mid | Boule de neige | Ionian Boots of Lucidity → Profane Hydra → Hubris → Axiom Arc → Opportunity → Voltaic Cyclosword | 15200 |
| 6 | Dégâts AD létalité | Mid | Accélération | Ionian Boots of Lucidity → Axiom Arc → Profane Hydra → Serylda's Grudge → Voltaic Cyclosword → Eclipse | 15400 |
| 7 | Dégâts AD létalité | Mid | Anti-soins | Ionian Boots of Lucidity → Axiom Arc → Profane Hydra → Mortal Reminder → Bloodthirster → Voltaic Cyclosword | 16200 |
| 8 | Dégâts AD létalité (jungle) | Jungle | Contre tanks | Ionian Boots of Lucidity → Serylda's Grudge → Axiom Arc → Ravenous Hydra → Bloodthirster → Death's Dance | 16650 |
| 9 | Dégâts AD létalité (jungle) | Jungle | Alternative (sans Serylda's Grudge) | Ionian Boots of Lucidity → Profane Hydra → Axiom Arc → Bloodthirster → Voltaic Cyclosword → Youmuu's Ghostblade | 15700 |
| 10 | Dégâts AD létalité (jungle) | Jungle | Alternative (sans Axiom Arc) | Ionian Boots of Lucidity → Profane Hydra → Serylda's Grudge → Bloodthirster → Voltaic Cyclosword → Youmuu's Ghostblade | 15950 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Death's Dance** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Hubris** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Quinn

- **Rôles** : Top · dégâts physiques · mana · distance
- **Kit** : dépend des attaques de base, burst, très mobile.
- **Répartition des 10 builds** : Dégâts AD (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD | Top | Standard | Berserker's Greaves → Kraken Slayer → Bloodthirster → Yun Tal Wildarrows → Serylda's Grudge → Statikk Shiv | 16200 |
| 2 | Dégâts AD | Top | Contre tanks | Berserker's Greaves → Serylda's Grudge → Kraken Slayer → Bloodthirster → Blade of the Ruined King → Yun Tal Wildarrows | 16700 |
| 3 | Dégâts AD | Top | Contre AD / assassins | Plated Steelcaps → Bloodthirster → Guardian Angel → Death's Dance → Kraken Slayer → Yun Tal Wildarrows | 17100 |
| 4 | Dégâts AD | Top | Contre AP | Berserker's Greaves → Bloodthirster → Mercurial Scimitar → Edge of Night → Kraken Slayer → Maw of Malmortius | 16800 |
| 5 | Dégâts AD | Top | Boule de neige | Berserker's Greaves → Kraken Slayer → Bloodthirster → Hubris → Yun Tal Wildarrows → Opportunity | 16200 |
| 6 | Dégâts AD | Top | Sustain | Berserker's Greaves → Bloodthirster → Kraken Slayer → Ravenous Hydra → Yun Tal Wildarrows → Death's Dance | 17100 |
| 7 | Dégâts AD | Top | Anti-soins | Berserker's Greaves → Kraken Slayer → Bloodthirster → Mortal Reminder → Yun Tal Wildarrows → Infinity Edge | 17250 |
| 8 | Dégâts AD | Top | Alternative (sans Kraken Slayer) | Berserker's Greaves → Bloodthirster → Yun Tal Wildarrows → Serylda's Grudge → Statikk Shiv → Blade of the Ruined King | 16400 |
| 9 | Dégâts AD | Top | Alternative (sans Bloodthirster) | Berserker's Greaves → Kraken Slayer → Yun Tal Wildarrows → Serylda's Grudge → Statikk Shiv → Blade of the Ruined King | 16000 |
| 10 | Dégâts AD | Top | Alternative (sans Yun Tal Wildarrows) | Berserker's Greaves → Kraken Slayer → Bloodthirster → Serylda's Grudge → Statikk Shiv → Blade of the Ruined King | 16400 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Guardian Angel (AD) / Maw of Malmortius ou Mercurial Scimitar (AP).
- **Tank** feed / 2 tanks ou plus : **Blade of the Ruined King** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Mercurial Scimitar.
- **En avance** : finir l'objet offensif principal, puis **Hubris** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Rakan

- **Rôles** : Support · dégâts magiques · mana · mêlée
- **Kit** : engage et contrôles, très mobile, sorts fréquents (accélération rentable), soins / boucliers aux alliés, ultime décisif.
- **Répartition des 10 builds** : Support dégâts AP burst (7), Support enchanteur (3)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Support dégâts AP burst | Support | Standard | Zaz'Zak's Realmspike → Ionian Boots of Lucidity → Malignance → Rabadon's Deathcap → Void Staff → Horizon Focus | 12850 |
| 2 | Support dégâts AP burst | Support | Contre AD / assassins | Zaz'Zak's Realmspike → Plated Steelcaps → Malignance → Zhonya's Hourglass → Thornmail → Randuin's Omen | 12300 |
| 3 | Support dégâts AP burst | Support | Contre AP | Zaz'Zak's Realmspike → Mercury's Treads → Malignance → Banshee's Veil → Kaenic Rookern → Vigilant Wardstone | 12150 |
| 4 | Support dégâts AP burst | Support | Accélération | Zaz'Zak's Realmspike → Ionian Boots of Lucidity → Cryptbloom → Horizon Focus → Malignance → Rabadon's Deathcap | 12850 |
| 5 | Support dégâts AP burst | Support | Anti-soins | Zaz'Zak's Realmspike → Ionian Boots of Lucidity → Malignance → Morellonomicon → Void Staff → Rabadon's Deathcap | 12950 |
| 6 | Support enchanteur | Support | Standard | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Ardent Censer → Locket of the Iron Solari → Staff of Flowing Water | 9850 |
| 7 | Support enchanteur | Support | Contre AD / assassins | Celestial Opposition → Plated Steelcaps → Frozen Heart → Locket of the Iron Solari → Zeke's Convergence → Mikael's Blessing | 10400 |
| 8 | Support enchanteur | Support | Accélération | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Locket of the Iron Solari → Staff of Flowing Water → Redemption | 9950 |
| 9 | Support dégâts AP burst | Support | Alternative (sans Malignance) | Zaz'Zak's Realmspike → Ionian Boots of Lucidity → Shurelya's Battlesong → Horizon Focus → Rabadon's Deathcap → Void Staff | 12350 |
| 10 | Support dégâts AP burst | Support | Alternative (sans Rabadon's Deathcap) | Zaz'Zak's Realmspike → Ionian Boots of Lucidity → Malignance → Horizon Focus → Void Staff → Shurelya's Battlesong | 11550 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : protéger le carry visé (Knight's Vow, Locket of the Iron Solari) ; pour vous : Zhonya's Hourglass.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : poser plus de balises de contrôle, jouer pour les objectifs ; objet d'équipe suivant : **Zeke's Convergence**.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Thornmail**.

### Rammus

- **Rôles** : Jungle · dégâts mixtes · mana · mêlée
- **Kit** : engage et contrôles, naturellement résistant, sorts qui montent avec l'armure / la RM, sorts fréquents (accélération rentable), très mobile.
- **Répartition des 10 builds** : Tank (jungle) (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Tank (jungle) | Jungle | Standard | Mercury's Treads → Jak'Sho, The Protean → Randuin's Omen → Heartsteel → Warmog's Armor → Unending Despair | 16050 |
| 2 | Tank (jungle) | Jungle | Contre AD / assassins | Plated Steelcaps → Randuin's Omen → Frozen Heart → Jak'Sho, The Protean → Heartsteel → Warmog's Armor | 15700 |
| 3 | Tank (jungle) | Jungle | Contre AP | Mercury's Treads → Jak'Sho, The Protean → Kaenic Rookern → Abyssal Mask → Warmog's Armor → Randuin's Omen | 15800 |
| 4 | Tank (jungle) | Jungle | Engagement | Mercury's Treads → Jak'Sho, The Protean → Dead Man's Plate → Randuin's Omen → Heartsteel → Warmog's Armor | 16150 |
| 5 | Tank (jungle) | Jungle | Accélération | Mercury's Treads → Jak'Sho, The Protean → Frozen Heart → Randuin's Omen → Heartsteel → Warmog's Armor | 15750 |
| 6 | Tank (jungle) | Jungle | Anti-soins | Mercury's Treads → Thornmail → Jak'Sho, The Protean → Randuin's Omen → Heartsteel → Warmog's Armor | 15700 |
| 7 | Tank (jungle) | Jungle | Alternative (sans Jak'Sho, The Protean) | Mercury's Treads → Randuin's Omen → Heartsteel → Warmog's Armor → Unending Despair → Sunfire Aegis | 15550 |
| 8 | Tank (jungle) | Jungle | Alternative (sans Randuin's Omen) | Mercury's Treads → Jak'Sho, The Protean → Heartsteel → Warmog's Armor → Unending Despair → Sunfire Aegis | 16050 |
| 9 | Tank (jungle) | Jungle | Alternative (sans Heartsteel) | Mercury's Treads → Jak'Sho, The Protean → Randuin's Omen → Unending Despair → Warmog's Armor → Sunfire Aegis | 15750 |
| 10 | Tank (jungle) | Jungle | Alternative (sans Warmog's Armor) | Mercury's Treads → Jak'Sho, The Protean → Randuin's Omen → Heartsteel → Unending Despair → Sunfire Aegis | 15650 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Frozen Heart** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : protéger le carry visé (Knight's Vow, Locket of the Iron Solari) ; pour vous : Frozen Heart.
- **Tank** feed / 2 tanks ou plus : **Frozen Heart** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Thornmail** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : poser plus de balises de contrôle, jouer pour les objectifs ; objet d'équipe suivant : **Dead Man's Plate**.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Frozen Heart**.

### Rek'Sai

- **Rôles** : Jungle · dégâts physiques · sans mana · mêlée
- **Kit** : très mobile, burst, ultime décisif.
- **Répartition des 10 builds** : Combattant (jungle) (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant (jungle) | Jungle | Standard | Mercury's Treads → Stridebreaker → Death's Dance → Sterak's Gage → Spear of Shojin → Sundered Sky | 17250 |
| 2 | Combattant (jungle) | Jungle | Contre AD / assassins | Plated Steelcaps → Stridebreaker → Death's Dance → Randuin's Omen → Guardian Angel → Sterak's Gage | 16900 |
| 3 | Combattant (jungle) | Jungle | Contre AP | Mercury's Treads → Edge of Night → Maw of Malmortius → Death's Dance → Kaenic Rookern → Jak'Sho, The Protean | 16750 |
| 4 | Combattant (jungle) | Jungle | Contre tanks | Mercury's Treads → Serylda's Grudge → Death's Dance → Titanic Hydra → Sterak's Gage → Spear of Shojin | 17150 |
| 5 | Combattant (jungle) | Jungle | Anti-soins | Mercury's Treads → Chempunk Chainsword → Death's Dance → Sterak's Gage → Stridebreaker → Spear of Shojin | 17250 |
| 6 | Combattant (jungle) | Jungle | Alternative (sans Stridebreaker) | Mercury's Treads → Spear of Shojin → Death's Dance → Sterak's Gage → Titanic Hydra → Sundered Sky | 17250 |
| 7 | Combattant (jungle) | Jungle | Alternative (sans Death's Dance) | Mercury's Treads → Stridebreaker → Sterak's Gage → Spear of Shojin → Sundered Sky → Black Cleaver | 16950 |
| 8 | Combattant (jungle) | Jungle | Alternative (sans Sterak's Gage) | Mercury's Treads → Stridebreaker → Death's Dance → Maw of Malmortius → Spear of Shojin → Sundered Sky | 17150 |
| 9 | Combattant (jungle) | Jungle | Alternative (sans Spear of Shojin) | Mercury's Treads → Stridebreaker → Death's Dance → Sterak's Gage → Sundered Sky → Black Cleaver | 17150 |
| 10 | Combattant (jungle) | Jungle | Alternative (sans Stridebreaker, Death's Dance) | Mercury's Treads → Spear of Shojin → Sterak's Gage → Titanic Hydra → Sundered Sky → Black Cleaver | 16950 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Randuin's Omen** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Serylda's Grudge** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Maw of Malmortius** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Rell

- **Rôles** : Support · dégâts magiques · mana · mêlée
- **Kit** : engage et contrôles, ultime décisif, naturellement résistant, sorts fréquents (accélération rentable), dégâts de zone.
- **Répartition des 10 builds** : Support engage (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Support engage | Support | Standard | Celestial Opposition → Mercury's Treads → Zeke's Convergence → Locket of the Iron Solari → Vigilant Wardstone → Randuin's Omen | 10650 |
| 2 | Support engage | Support | Engagement | Solstice Sleigh → Mercury's Treads → Zeke's Convergence → Locket of the Iron Solari → Trailblazer → Vigilant Wardstone | 10350 |
| 3 | Support engage | Support | Contre AD / assassins | Celestial Opposition → Plated Steelcaps → Randuin's Omen → Frozen Heart → Thornmail → Zeke's Convergence | 11050 |
| 4 | Support engage | Support | Contre AP | Celestial Opposition → Mercury's Treads → Zeke's Convergence → Kaenic Rookern → Locket of the Iron Solari → Vigilant Wardstone | 10850 |
| 5 | Support engage | Support | Anti-soins | Celestial Opposition → Mercury's Treads → Thornmail → Zeke's Convergence → Locket of the Iron Solari → Vigilant Wardstone | 10400 |
| 6 | Support engage | Support | Alternative (sans Zeke's Convergence) | Celestial Opposition → Mercury's Treads → Locket of the Iron Solari → Vigilant Wardstone → Randuin's Omen → Abyssal Mask | 11100 |
| 7 | Support engage | Support | Alternative (sans Locket of the Iron Solari) | Celestial Opposition → Mercury's Treads → Zeke's Convergence → Vigilant Wardstone → Randuin's Omen → Abyssal Mask | 11100 |
| 8 | Support engage | Support | Alternative (sans Vigilant Wardstone) | Celestial Opposition → Mercury's Treads → Zeke's Convergence → Locket of the Iron Solari → Randuin's Omen → Abyssal Mask | 11000 |
| 9 | Support engage | Support | Alternative (sans Randuin's Omen) | Celestial Opposition → Mercury's Treads → Zeke's Convergence → Locket of the Iron Solari → Vigilant Wardstone → Abyssal Mask | 10600 |
| 10 | Support engage | Support | Alternative (sans Zeke's Convergence, Locket of the Iron Solari) | Celestial Opposition → Mercury's Treads → Vigilant Wardstone → Randuin's Omen → Abyssal Mask → Frozen Heart | 11400 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Frozen Heart** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : protéger le carry visé (Knight's Vow, Locket of the Iron Solari) ; pour vous : Frozen Heart.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Thornmail** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : poser plus de balises de contrôle, jouer pour les objectifs ; objet d'équipe suivant : **Trailblazer**.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Frozen Heart**.

### Renata Glasc

- **Rôles** : Support · dégâts magiques · mana · distance
- **Kit** : soins / boucliers aux alliés, engage et contrôles, ultime décisif, sorts fréquents (accélération rentable).
- **Répartition des 10 builds** : Support enchanteur (7), Support dégâts AP burst (3)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Support enchanteur | Support | Standard | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Ardent Censer → Dawncore → Staff of Flowing Water | 10150 |
| 2 | Support enchanteur | Support | Contre AD / assassins | Celestial Opposition → Plated Steelcaps → Mikael's Blessing → Ardent Censer → Frozen Heart → Locket of the Iron Solari | 10400 |
| 3 | Support enchanteur | Support | Accélération | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Staff of Flowing Water → Redemption → Ardent Censer | 9950 |
| 4 | Support enchanteur | Support | Anti-soins | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Ardent Censer → Morellonomicon → Dawncore | 10750 |
| 5 | Support enchanteur | Support | Contre AP | Celestial Opposition → Mercury's Treads → Mikael's Blessing → Ardent Censer → Locket of the Iron Solari → Dawncore | 10450 |
| 6 | Support dégâts AP burst | Support | Standard | Zaz'Zak's Realmspike → Ionian Boots of Lucidity → Malignance → Rabadon's Deathcap → Void Staff → Horizon Focus | 12850 |
| 7 | Support dégâts AP burst | Support | Contre AD / assassins | Zaz'Zak's Realmspike → Plated Steelcaps → Malignance → Zhonya's Hourglass → Thornmail → Randuin's Omen | 12300 |
| 8 | Support dégâts AP burst | Support | Contre AP | Zaz'Zak's Realmspike → Mercury's Treads → Malignance → Banshee's Veil → Kaenic Rookern → Locket of the Iron Solari | 12050 |
| 9 | Support enchanteur | Support | Alternative (sans Mikael's Blessing) | Dream Maker → Ionian Boots of Lucidity → Ardent Censer → Dawncore → Staff of Flowing Water → Redemption | 10150 |
| 10 | Support enchanteur | Support | Alternative (sans Ardent Censer) | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Dawncore → Staff of Flowing Water → Redemption | 10250 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Frozen Heart** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Abyssal Mask** en objet suivant.
- **Assassin** feed qui vous cible : protéger le carry visé (Knight's Vow, Locket of the Iron Solari) ; pour vous : Frozen Heart.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : poser plus de balises de contrôle, jouer pour les objectifs ; objet d'équipe suivant : **Locket of the Iron Solari**.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Frozen Heart**.

### Renekton

- **Rôles** : Top · dégâts physiques · sans mana · mêlée
- **Kit** : sorts fréquents (accélération rentable), burst, soins sur soi, très mobile, ultime décisif.
- **Répartition des 10 builds** : Combattant (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant | Top | Standard | Mercury's Treads → Spear of Shojin → Death's Dance → Sterak's Gage → Black Cleaver → Sundered Sky | 16950 |
| 2 | Combattant | Top | Contre AD / assassins | Plated Steelcaps → Spear of Shojin → Death's Dance → Randuin's Omen → Guardian Angel → Sterak's Gage | 16700 |
| 3 | Combattant | Top | Contre AP | Mercury's Treads → Spear of Shojin → Maw of Malmortius → Death's Dance → Kaenic Rookern → Jak'Sho, The Protean | 16850 |
| 4 | Combattant | Top | Contre tanks | Mercury's Treads → Spear of Shojin → Death's Dance → Black Cleaver → Sterak's Gage → Titanic Hydra | 17150 |
| 5 | Combattant | Top | Sustain | Mercury's Treads → Spear of Shojin → Death's Dance → Sundered Sky → Sterak's Gage → Spirit Visage | 16650 |
| 6 | Combattant | Top | Accélération | Mercury's Treads → Spear of Shojin → Death's Dance → Black Cleaver → Maw of Malmortius → Sundered Sky | 16850 |
| 7 | Combattant | Top | Anti-soins | Mercury's Treads → Chempunk Chainsword → Death's Dance → Spear of Shojin → Sterak's Gage → Black Cleaver | 16950 |
| 8 | Combattant | Top | Alternative (sans Spear of Shojin) | Mercury's Treads → Experimental Hexplate → Death's Dance → Sterak's Gage → Black Cleaver → Sundered Sky | 16850 |
| 9 | Combattant | Top | Alternative (sans Death's Dance) | Mercury's Treads → Spear of Shojin → Sterak's Gage → Black Cleaver → Sundered Sky → Experimental Hexplate | 16650 |
| 10 | Combattant | Top | Alternative (sans Black Cleaver) | Mercury's Treads → Experimental Hexplate → Death's Dance → Spear of Shojin → Sterak's Gage → Sundered Sky | 16950 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Randuin's Omen** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Maw of Malmortius** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Maw of Malmortius** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Rengar

- **Rôles** : Jungle, Top · dégâts physiques · sans mana · mêlée
- **Kit** : burst, très mobile, dépend des attaques de base, ultime décisif.
- **Répartition des 10 builds** : Dégâts AD (4), Dégâts AD (jungle) (6)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD | Top | Standard | Berserker's Greaves → Bloodthirster → Axiom Arc → Kraken Slayer → Serylda's Grudge → Profane Hydra | 16100 |
| 2 | Dégâts AD | Top | Contre tanks | Berserker's Greaves → Serylda's Grudge → Kraken Slayer → Bloodthirster → Blade of the Ruined King → Axiom Arc | 16450 |
| 3 | Dégâts AD | Top | Contre AD / assassins | Plated Steelcaps → Bloodthirster → Guardian Angel → Death's Dance → Eclipse → Axiom Arc | 16750 |
| 4 | Dégâts AD | Top | Contre AP | Mercury's Treads → Edge of Night → Maw of Malmortius → Bloodthirster → Mercurial Scimitar → Axiom Arc | 16700 |
| 5 | Dégâts AD (jungle) | Jungle | Contre tanks | Berserker's Greaves → Serylda's Grudge → Kraken Slayer → Bloodthirster → Blade of the Ruined King → Ravenous Hydra | 17000 |
| 6 | Dégâts AD (jungle) | Jungle | Boule de neige | Berserker's Greaves → Hubris → Opportunity → Profane Hydra → Bloodthirster → Axiom Arc | 15800 |
| 7 | Dégâts AD (jungle) | Jungle | Sustain | Berserker's Greaves → Bloodthirster → Ravenous Hydra → Death's Dance → Axiom Arc → Kraken Slayer | 16850 |
| 8 | Dégâts AD (jungle) | Jungle | Anti-soins | Berserker's Greaves → Bloodthirster → Axiom Arc → Mortal Reminder → Profane Hydra → Kraken Slayer | 16400 |
| 9 | Dégâts AD (jungle) | Jungle | Alternative (sans Serylda's Grudge) | Berserker's Greaves → Bloodthirster → Axiom Arc → Profane Hydra → Kraken Slayer → Eclipse | 16000 |
| 10 | Dégâts AD (jungle) | Jungle | Alternative (sans Kraken Slayer) | Berserker's Greaves → Bloodthirster → Axiom Arc → Profane Hydra → Serylda's Grudge → Eclipse | 16000 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Blade of the Ruined King** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Hubris** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Riven

- **Rôles** : Top · dégâts physiques · sans mana · mêlée
- **Kit** : sorts fréquents (accélération rentable), burst, très mobile, ultime décisif.
- **Répartition des 10 builds** : Dégâts AD létalité (8), Combattant (2)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD létalité | Top | Standard | Ionian Boots of Lucidity → Axiom Arc → Profane Hydra → Serylda's Grudge → Bloodthirster → Eclipse | 15800 |
| 2 | Dégâts AD létalité | Top | Contre tanks | Ionian Boots of Lucidity → Serylda's Grudge → Axiom Arc → Bloodthirster → Spear of Shojin → Death's Dance | 16450 |
| 3 | Dégâts AD létalité | Top | Contre AD / assassins | Plated Steelcaps → Bloodthirster → Death's Dance → Guardian Angel → Axiom Arc → Profane Hydra | 16700 |
| 4 | Dégâts AD létalité | Top | Contre AP | Mercury's Treads → Edge of Night → Maw of Malmortius → Axiom Arc → Profane Hydra → Serylda's Grudge | 15950 |
| 5 | Dégâts AD létalité | Top | Boule de neige | Ionian Boots of Lucidity → Hubris → Profane Hydra → Axiom Arc → Opportunity → Voltaic Cyclosword | 15200 |
| 6 | Dégâts AD létalité | Top | Accélération | Ionian Boots of Lucidity → Axiom Arc → Spear of Shojin → Serylda's Grudge → Profane Hydra → Eclipse | 15500 |
| 7 | Dégâts AD létalité | Top | Anti-soins | Ionian Boots of Lucidity → Axiom Arc → Profane Hydra → Mortal Reminder → Bloodthirster → Eclipse | 16100 |
| 8 | Combattant | Top | Standard | Mercury's Treads → Spear of Shojin → Death's Dance → Maw of Malmortius → Black Cleaver → Stridebreaker | 17050 |
| 9 | Combattant | Top | Contre AD / assassins | Plated Steelcaps → Spear of Shojin → Death's Dance → Randuin's Omen → Guardian Angel → Sterak's Gage | 16700 |
| 10 | Dégâts AD létalité | Top | Alternative (sans Axiom Arc) | Ionian Boots of Lucidity → Profane Hydra → Serylda's Grudge → Bloodthirster → Eclipse → Voltaic Cyclosword | 16050 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Death's Dance** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Spear of Shojin** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Hubris** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Rumble

- **Rôles** : Top, Mid, Jungle · dégâts magiques · sans mana · mêlée
- **Kit** : dégâts sur la durée, dégâts de zone, ultime décisif.
- **Répartition des 10 builds** : Dégâts AP continu (7), Dégâts AP continu (jungle) (3)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP continu | Top, Mid | Standard | Sorcerer's Shoes → Shadowflame → Liandry's Torment → Rabadon's Deathcap → Void Staff → Horizon Focus | 16550 |
| 2 | Dégâts AP continu | Top, Mid | Contre tanks | Mercury's Treads → Rylai's Crystal Scepter → Liandry's Torment → Rabadon's Deathcap → Void Staff → Horizon Focus | 16100 |
| 3 | Dégâts AP continu | Top, Mid | Contre AD / assassins | Plated Steelcaps → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Randuin's Omen → Guardian Angel | 16850 |
| 4 | Dégâts AP continu | Top, Mid | Contre AP | Mercury's Treads → Shadowflame → Banshee's Veil → Rabadon's Deathcap → Void Staff → Liandry's Torment | 16950 |
| 5 | Dégâts AP continu | Top, Mid | Anti-soins | Sorcerer's Shoes → Shadowflame → Morellonomicon → Rabadon's Deathcap → Void Staff → Liandry's Torment | 16650 |
| 6 | Dégâts AP continu | Top, Mid | Alternative (sans Shadowflame) | Sorcerer's Shoes → Rylai's Crystal Scepter → Liandry's Torment → Rabadon's Deathcap → Void Staff → Horizon Focus | 15950 |
| 7 | Dégâts AP continu | Top, Mid | Alternative (sans Liandry's Torment) | Sorcerer's Shoes → Shadowflame → Rabadon's Deathcap → Void Staff → Horizon Focus → Rylai's Crystal Scepter | 16150 |
| 8 | Dégâts AP continu (jungle) | Jungle | Alternative (sans Rabadon's Deathcap) | Sorcerer's Shoes → Shadowflame → Liandry's Torment → Void Staff → Horizon Focus → Rylai's Crystal Scepter | 15650 |
| 9 | Dégâts AP continu (jungle) | Jungle | Alternative (sans Void Staff) | Sorcerer's Shoes → Cryptbloom → Liandry's Torment → Rabadon's Deathcap → Shadowflame → Horizon Focus | 16550 |
| 10 | Dégâts AP continu (jungle) | Jungle | Alternative (sans Shadowflame, Liandry's Torment) | Sorcerer's Shoes → Riftmaker → Horizon Focus → Rabadon's Deathcap → Void Staff → Rylai's Crystal Scepter | 16050 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Rylai's Crystal Scepter** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Stormsurge** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Ryze

- **Rôles** : Mid, Top · dégâts magiques · mana · distance
- **Kit** : sorts fréquents (accélération rentable), gros besoin de mana, dégâts sur la durée, dégâts de zone.
- **Répartition des 10 builds** : Dégâts AP continu (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP continu | Mid, Top | Standard | Sorcerer's Shoes → Archangel's Staff → Blackfire Torch → Rabadon's Deathcap → Void Staff → Malignance | 16000 |
| 2 | Dégâts AP continu | Mid, Top | Contre tanks | Ionian Boots of Lucidity → Archangel's Staff → Blackfire Torch → Rabadon's Deathcap → Void Staff → Malignance | 15800 |
| 3 | Dégâts AP continu | Mid, Top | Contre AD / assassins | Plated Steelcaps → Archangel's Staff → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Blackfire Torch | 16650 |
| 4 | Dégâts AP continu | Mid, Top | Contre AP | Mercury's Treads → Archangel's Staff → Banshee's Veil → Rabadon's Deathcap → Void Staff → Blackfire Torch | 16450 |
| 5 | Dégâts AP continu | Mid, Top | Anti-soins | Sorcerer's Shoes → Archangel's Staff → Morellonomicon → Rabadon's Deathcap → Void Staff → Blackfire Torch | 16150 |
| 6 | Dégâts AP continu | Mid, Top | Alternative (sans Archangel's Staff) | Sorcerer's Shoes → Malignance → Blackfire Torch → Rabadon's Deathcap → Void Staff → Horizon Focus | 15850 |
| 7 | Dégâts AP continu | Mid, Top | Alternative (sans Blackfire Torch) | Sorcerer's Shoes → Archangel's Staff → Malignance → Rabadon's Deathcap → Void Staff → Horizon Focus | 15950 |
| 8 | Dégâts AP continu | Mid, Top | Alternative (sans Rabadon's Deathcap) | Sorcerer's Shoes → Archangel's Staff → Blackfire Torch → Void Staff → Horizon Focus → Malignance | 15250 |
| 9 | Dégâts AP continu | Mid, Top | Alternative (sans Void Staff) | Sorcerer's Shoes → Archangel's Staff → Blackfire Torch → Rabadon's Deathcap → Malignance → Cryptbloom | 16000 |
| 10 | Dégâts AP continu | Mid, Top | Alternative (sans Archangel's Staff, Blackfire Torch) | Sorcerer's Shoes → Malignance → Rabadon's Deathcap → Void Staff → Horizon Focus → Shadowflame | 16250 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Horizon Focus** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Shadowflame** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Samira

- **Rôles** : ADC · dégâts physiques · mana · distance
- **Kit** : dépend des attaques de base, synergie coup critique, burst, dégâts de zone, très mobile.
- **Répartition des 10 builds** : Dégâts AD critique (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD critique | ADC | Standard | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Kraken Slayer → Bloodthirster | 17050 |
| 2 | Dégâts AD critique | ADC | Contre AD / assassins | Plated Steelcaps → Yun Tal Wildarrows → Guardian Angel → Death's Dance → Infinity Edge → Lord Dominik's Regards | 17250 |
| 3 | Dégâts AD critique | ADC | Contre AP | Berserker's Greaves → Yun Tal Wildarrows → Mercurial Scimitar → Edge of Night → Infinity Edge → Lord Dominik's Regards | 16850 |
| 4 | Dégâts AD critique | ADC | Boule de neige | Berserker's Greaves → The Collector → Infinity Edge → Yun Tal Wildarrows → Lord Dominik's Regards → Kraken Slayer | 16650 |
| 5 | Dégâts AD critique | ADC | Anti-soins | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Mortal Reminder → Kraken Slayer → Bloodthirster | 17250 |
| 6 | Dégâts AD critique | ADC | Alternative (sans Yun Tal Wildarrows) | Berserker's Greaves → Essence Reaver → Infinity Edge → Kraken Slayer → Lord Dominik's Regards → Bloodthirster | 16950 |
| 7 | Dégâts AD critique | ADC | Alternative (sans Infinity Edge) | Berserker's Greaves → Yun Tal Wildarrows → Kraken Slayer → Lord Dominik's Regards → Bloodthirster → Essence Reaver | 16500 |
| 8 | Dégâts AD critique | ADC | Alternative (sans Kraken Slayer) | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Bloodthirster → Essence Reaver | 16950 |
| 9 | Dégâts AD critique | ADC | Alternative (sans Yun Tal Wildarrows, Infinity Edge) | Berserker's Greaves → Kraken Slayer → Bloodthirster → Lord Dominik's Regards → Essence Reaver → The Collector | 16500 |
| 10 | Dégâts AD critique | ADC | Alternative (sans Infinity Edge, Lord Dominik's Regards) | Berserker's Greaves → Yun Tal Wildarrows → Kraken Slayer → Mortal Reminder → Bloodthirster → Essence Reaver | 16700 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Guardian Angel (AD) / Maw of Malmortius ou Mercurial Scimitar (AP).
- **Tank** feed / 2 tanks ou plus : **Blade of the Ruined King** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Mortal Reminder** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Mercurial Scimitar.
- **En avance** : finir l'objet offensif principal, puis **The Collector** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Sejuani

- **Rôles** : Jungle · dégâts magiques · mana · mêlée
- **Kit** : engage et contrôles, ultime décisif, naturellement résistant, sorts fréquents (accélération rentable), dégâts de zone.
- **Répartition des 10 builds** : Tank (jungle) (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Tank (jungle) | Jungle | Standard | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Unending Despair → Sunfire Aegis | 16050 |
| 2 | Tank (jungle) | Jungle | Contre AD / assassins | Plated Steelcaps → Randuin's Omen → Frozen Heart → Jak'Sho, The Protean → Heartsteel → Warmog's Armor | 15700 |
| 3 | Tank (jungle) | Jungle | Contre AP | Mercury's Treads → Jak'Sho, The Protean → Abyssal Mask → Kaenic Rookern → Warmog's Armor → Heartsteel | 16100 |
| 4 | Tank (jungle) | Jungle | Engagement | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Dead Man's Plate → Zeke's Convergence | 15650 |
| 5 | Tank (jungle) | Jungle | Accélération | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Abyssal Mask → Unending Despair | 16000 |
| 6 | Tank (jungle) | Jungle | Anti-soins | Mercury's Treads → Thornmail → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Unending Despair | 15800 |
| 7 | Tank (jungle) | Jungle | Alternative (sans Heartsteel) | Mercury's Treads → Jak'Sho, The Protean → Unending Despair → Sunfire Aegis → Warmog's Armor → Abyssal Mask | 15700 |
| 8 | Tank (jungle) | Jungle | Alternative (sans Jak'Sho, The Protean) | Mercury's Treads → Heartsteel → Unending Despair → Warmog's Armor → Sunfire Aegis → Abyssal Mask | 15500 |
| 9 | Tank (jungle) | Jungle | Alternative (sans Warmog's Armor) | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Unending Despair → Sunfire Aegis → Abyssal Mask | 15600 |
| 10 | Tank (jungle) | Jungle | Alternative (sans Unending Despair) | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Sunfire Aegis → Abyssal Mask | 15900 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Randuin's Omen** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : protéger le carry visé (Knight's Vow, Locket of the Iron Solari) ; pour vous : Randuin's Omen.
- **Tank** feed / 2 tanks ou plus : **Randuin's Omen** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Thornmail** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : poser plus de balises de contrôle, jouer pour les objectifs ; objet d'équipe suivant : **Dead Man's Plate**.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Senna

- **Rôles** : Support, ADC · dégâts physiques · mana · distance
- **Kit** : poke à longue portée, dépend des attaques de base, synergie coup critique, soins / boucliers aux alliés.
- **Répartition des 10 builds** : Dégâts AD critique (3), Support enchanteur (5), Support dégâts AD critique (2)
- **Particularité** : Support : remplacer les bottes de l'ADC_CASTER par l'objet de support Zaz'Zak ou Bloodsong + bottes de lucidité.

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD critique | ADC | Standard | Berserker's Greaves → Bloodthirster → Infinity Edge → Lord Dominik's Regards → Yun Tal Wildarrows → Kraken Slayer | 17050 |
| 2 | Dégâts AD critique | ADC | Contre AD / assassins | Plated Steelcaps → Bloodthirster → Guardian Angel → Death's Dance → Infinity Edge → Lord Dominik's Regards | 17650 |
| 3 | Dégâts AD critique | ADC | Contre AP | Mercury's Treads → Edge of Night → Mercurial Scimitar → Maw of Malmortius → Infinity Edge → Lord Dominik's Regards | 17100 |
| 4 | Support enchanteur | Support | Standard | Dream Maker → Plated Steelcaps → Mikael's Blessing → Locket of the Iron Solari → Redemption → Staff of Flowing Water | 10250 |
| 5 | Support enchanteur | Support | Contre AD / assassins | Celestial Opposition → Plated Steelcaps → Frozen Heart → Locket of the Iron Solari → Thornmail → Mikael's Blessing | 10650 |
| 6 | Support enchanteur | Support | Poke | Zaz'Zak's Realmspike → Ionian Boots of Lucidity → Mikael's Blessing → Locket of the Iron Solari → Redemption → Staff of Flowing Water | 9950 |
| 7 | Support enchanteur | Support | Anti-soins | Dream Maker → Plated Steelcaps → Chempunk Chainsword → Mikael's Blessing → Locket of the Iron Solari → Redemption | 11100 |
| 8 | Support enchanteur | Support | Contre AP | Celestial Opposition → Mercury's Treads → Locket of the Iron Solari → Mikael's Blessing → Vigilant Wardstone → Zeke's Convergence | 10250 |
| 9 | Support dégâts AD critique | Support | Standard | Bloodsong → Berserker's Greaves → Essence Reaver → Infinity Edge → Lord Dominik's Regards → Yun Tal Wildarrows | 13550 |
| 10 | Support dégâts AD critique | Support | Contre AD / assassins | Bloodsong → Plated Steelcaps → Death's Dance → Guardian Angel → Lord Dominik's Regards → Thornmail | 13250 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Guardian Angel (AD) / Maw of Malmortius ou Mercurial Scimitar (AP).
- **Tank** feed / 2 tanks ou plus : **Essence Reaver** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Mortal Reminder** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Mercurial Scimitar.
- **En avance** : finir l'objet offensif principal, puis **Hubris** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Seraphine

- **Rôles** : Support, Mid, ADC · dégâts magiques · mana · distance
- **Kit** : sorts fréquents (accélération rentable), gros besoin de mana, dégâts de zone, soins / boucliers aux alliés, engage et contrôles.
- **Répartition des 10 builds** : Dégâts AP burst (3), Support enchanteur (5), Support dégâts AP burst (2)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP burst | Mid, ADC | Standard | Sorcerer's Shoes → Archangel's Staff → Malignance → Horizon Focus → Rabadon's Deathcap → Void Staff | 15950 |
| 2 | Dégâts AP burst | Mid, ADC | Contre tanks | Ionian Boots of Lucidity → Archangel's Staff → Malignance → Horizon Focus → Rabadon's Deathcap → Void Staff | 15750 |
| 3 | Dégâts AP burst | Mid, ADC | Contre AD / assassins | Plated Steelcaps → Malignance → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Horizon Focus | 16400 |
| 4 | Support enchanteur | Support | Standard | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Ardent Censer → Locket of the Iron Solari → Staff of Flowing Water | 9850 |
| 5 | Support enchanteur | Support | Contre AD / assassins | Celestial Opposition → Plated Steelcaps → Frozen Heart → Locket of the Iron Solari → Mikael's Blessing → Ardent Censer | 10400 |
| 6 | Support enchanteur | Support | Accélération | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Staff of Flowing Water → Malignance → Locket of the Iron Solari | 10350 |
| 7 | Support enchanteur | Support | Poke | Zaz'Zak's Realmspike → Ionian Boots of Lucidity → Mikael's Blessing → Ardent Censer → Locket of the Iron Solari → Staff of Flowing Water | 9850 |
| 8 | Support enchanteur | Support | Anti-soins | Dream Maker → Ionian Boots of Lucidity → Morellonomicon → Mikael's Blessing → Ardent Censer → Locket of the Iron Solari | 10450 |
| 9 | Support dégâts AP burst | Support | Standard | Zaz'Zak's Realmspike → Sorcerer's Shoes → Malignance → Horizon Focus → Rabadon's Deathcap → Void Staff | 13050 |
| 10 | Support dégâts AP burst | Support | Contre AD / assassins | Zaz'Zak's Realmspike → Plated Steelcaps → Malignance → Zhonya's Hourglass → Horizon Focus → Rabadon's Deathcap | 13400 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Luden's Companion** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Shadowflame** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Sett

- **Rôles** : Top, Support · dégâts physiques · sans mana · mêlée
- **Kit** : sorts qui montent avec les PV, burst, dégâts de zone, engage et contrôles, ultime décisif.
- **Répartition des 10 builds** : Dégâts AD (6), Support dégâts AD (3), Support engage (1)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD | Top | Standard | Berserker's Greaves → Bloodthirster → Serylda's Grudge → Ravenous Hydra → Death's Dance → Axiom Arc | 16850 |
| 2 | Dégâts AD | Top | Contre tanks | Berserker's Greaves → Serylda's Grudge → Titanic Hydra → Bloodthirster → Death's Dance → Maw of Malmortius | 17200 |
| 3 | Dégâts AD | Top | Contre AD / assassins | Plated Steelcaps → Bloodthirster → Guardian Angel → Death's Dance → Sterak's Gage → Randuin's Omen | 17000 |
| 4 | Dégâts AD | Top | Contre AP | Mercury's Treads → Edge of Night → Maw of Malmortius → Mercurial Scimitar → Bloodthirster → Serylda's Grudge | 16950 |
| 5 | Dégâts AD | Top | Boule de neige | Berserker's Greaves → Hubris → Profane Hydra → Bloodthirster → Serylda's Grudge → Opportunity | 16050 |
| 6 | Dégâts AD | Top | Partie longue | Berserker's Greaves → Serylda's Grudge → Bloodthirster → Titanic Hydra → Death's Dance → Axiom Arc | 16850 |
| 7 | Support dégâts AD | Support | Standard | Bloodsong → Berserker's Greaves → Profane Hydra → Serylda's Grudge → Axiom Arc → Eclipse | 12600 |
| 8 | Support dégâts AD | Support | Contre AD / assassins | Bloodsong → Plated Steelcaps → Profane Hydra → Guardian Angel → Death's Dance → Randuin's Omen | 13250 |
| 9 | Support dégâts AD | Support | Contre AP | Bloodsong → Mercury's Treads → Edge of Night → Maw of Malmortius → Profane Hydra → Serylda's Grudge | 13200 |
| 10 | Support engage | Support | Standard | Celestial Opposition → Mercury's Treads → Heartsteel → Zeke's Convergence → Randuin's Omen → Locket of the Iron Solari | 11350 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Maw of Malmortius** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Hubris** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Shaco

- **Rôles** : Jungle, Support · dégâts physiques · mana · mêlée
- **Kit** : burst, synergie coup critique, très mobile.
- **Répartition des 10 builds** : Dégâts AD critique (jungle) (6), Support dégâts AD critique (4)
- **Particularité** : Support : profil AP (SUPPORT_MAGE) avec boîtes ; jungle : AD_ASSASSIN.

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD critique (jungle) | Jungle | Standard | Sorcerer's Shoes → The Collector → Infinity Edge → Profane Hydra → Lord Dominik's Regards → Bloodthirster | 16900 |
| 2 | Dégâts AD critique (jungle) | Jungle | Contre tanks | Mercury's Treads → Essence Reaver → Infinity Edge → Void Staff → Lord Dominik's Regards → Bloodthirster | 17100 |
| 3 | Dégâts AD critique (jungle) | Jungle | Contre AD / assassins | Plated Steelcaps → Bloodthirster → Guardian Angel → Death's Dance → Zhonya's Hourglass → Infinity Edge | 17800 |
| 4 | Dégâts AD critique (jungle) | Jungle | Contre AP | Mercury's Treads → Edge of Night → Maw of Malmortius → Infinity Edge → Lord Dominik's Regards → Profane Hydra | 16750 |
| 5 | Dégâts AD critique (jungle) | Jungle | Boule de neige | Sorcerer's Shoes → The Collector → Hubris → Opportunity → Profane Hydra → Youmuu's Ghostblade | 15450 |
| 6 | Dégâts AD critique (jungle) | Jungle | Anti-soins | Sorcerer's Shoes → The Collector → Infinity Edge → Profane Hydra → Mortal Reminder → Bloodthirster | 17100 |
| 7 | Support dégâts AD critique | Support | Standard | Bloodsong → Sorcerer's Shoes → Opportunity → Profane Hydra → Lord Dominik's Regards → Youmuu's Ghostblade | 12550 |
| 8 | Support dégâts AD critique | Support | Contre AD / assassins | Bloodsong → Plated Steelcaps → Death's Dance → Guardian Angel → Zhonya's Hourglass → Thornmail | 13400 |
| 9 | Support dégâts AD critique | Support | Contre AP | Bloodsong → Mercury's Treads → Edge of Night → Maw of Malmortius → Opportunity → Lord Dominik's Regards | 13150 |
| 10 | Support dégâts AD critique | Support | Boule de neige | Bloodsong → Sorcerer's Shoes → Opportunity → The Collector → Hubris → Profane Hydra | 12650 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Void Staff** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Hubris** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Shen

- **Rôles** : Top, Support · dégâts physiques · énergie · mêlée
- **Kit** : ultime décisif, naturellement résistant, sorts fréquents (accélération rentable), soins / boucliers aux alliés, engage et contrôles.
- **Répartition des 10 builds** : Tank (6), Support enchanteur (3), Support engage (1)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Tank | Top | Standard | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Randuin's Omen → Unending Despair | 16050 |
| 2 | Tank | Top | Contre AD / assassins | Plated Steelcaps → Randuin's Omen → Jak'Sho, The Protean → Heartsteel → Warmog's Armor → Thornmail | 15650 |
| 3 | Tank | Top | Contre AP | Mercury's Treads → Jak'Sho, The Protean → Heartsteel → Warmog's Armor → Kaenic Rookern → Abyssal Mask | 16100 |
| 4 | Tank | Top | Engagement | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Dead Man's Plate → Zeke's Convergence | 15650 |
| 5 | Tank | Top | Accélération | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Unending Despair → Abyssal Mask | 16000 |
| 6 | Tank | Top | Anti-soins | Mercury's Treads → Heartsteel → Thornmail → Jak'Sho, The Protean → Warmog's Armor → Randuin's Omen | 15700 |
| 7 | Support enchanteur | Support | Standard | Dream Maker → Ionian Boots of Lucidity → Locket of the Iron Solari → Zeke's Convergence → Vigilant Wardstone → Echoes of Helia | 9800 |
| 8 | Support enchanteur | Support | Contre AD / assassins | Celestial Opposition → Plated Steelcaps → Locket of the Iron Solari → Zeke's Convergence → Randuin's Omen → Vigilant Wardstone | 10600 |
| 9 | Support enchanteur | Support | Anti-soins | Dream Maker → Ionian Boots of Lucidity → Chempunk Chainsword → Locket of the Iron Solari → Zeke's Convergence → Vigilant Wardstone | 10700 |
| 10 | Support engage | Support | Standard | Celestial Opposition → Mercury's Treads → Zeke's Convergence → Locket of the Iron Solari → Vigilant Wardstone → Randuin's Omen | 10650 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Thornmail** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : protéger le carry visé (Knight's Vow, Locket of the Iron Solari) ; pour vous : Thornmail.
- **Tank** feed / 2 tanks ou plus : **Sunfire Aegis** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Thornmail** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : poser plus de balises de contrôle, jouer pour les objectifs ; objet d'équipe suivant : **Dead Man's Plate**.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Thornmail**.

### Shyvana

- **Rôles** : Jungle · dégâts mixtes · sans mana · mêlée
- **Kit** : dépend des attaques de base, effets à l'impact, dégâts sur la durée, dégâts de zone, très mobile.
- **Répartition des 10 builds** : Combattant (jungle) (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant (jungle) | Jungle | Standard | Mercury's Treads → Stridebreaker → Experimental Hexplate → Sterak's Gage → Jak'Sho, The Protean → Death's Dance | 17250 |
| 2 | Combattant (jungle) | Jungle | Contre AD / assassins | Plated Steelcaps → Stridebreaker → Randuin's Omen → Death's Dance → Thornmail → Sterak's Gage | 16150 |
| 3 | Combattant (jungle) | Jungle | Contre AP | Mercury's Treads → Stridebreaker → Kaenic Rookern → Jak'Sho, The Protean → Banshee's Veil → Experimental Hexplate | 16650 |
| 4 | Combattant (jungle) | Jungle | Contre tanks | Mercury's Treads → Stridebreaker → Experimental Hexplate → Liandry's Torment → Sterak's Gage → Jak'Sho, The Protean | 16950 |
| 5 | Combattant (jungle) | Jungle | Sustain | Mercury's Treads → Stridebreaker → Death's Dance → Sterak's Gage → Spirit Visage → Experimental Hexplate | 16750 |
| 6 | Combattant (jungle) | Jungle | Anti-soins | Mercury's Treads → Chempunk Chainsword → Stridebreaker → Experimental Hexplate → Sterak's Gage → Jak'Sho, The Protean | 17050 |
| 7 | Combattant (jungle) | Jungle | Alternative (sans Stridebreaker) | Mercury's Treads → Experimental Hexplate → Titanic Hydra → Sterak's Gage → Jak'Sho, The Protean → Death's Dance | 17250 |
| 8 | Combattant (jungle) | Jungle | Alternative (sans Experimental Hexplate) | Mercury's Treads → Stridebreaker → Sterak's Gage → Jak'Sho, The Protean → Death's Dance → Randuin's Omen | 16950 |
| 9 | Combattant (jungle) | Jungle | Alternative (sans Sterak's Gage) | Mercury's Treads → Stridebreaker → Experimental Hexplate → Jak'Sho, The Protean → Death's Dance → Randuin's Omen | 16750 |
| 10 | Combattant (jungle) | Jungle | Alternative (sans Jak'Sho, The Protean) | Mercury's Treads → Stridebreaker → Experimental Hexplate → Sterak's Gage → Death's Dance → Randuin's Omen | 16750 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Randuin's Omen** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Liandry's Torment** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Randuin's Omen** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Singed

- **Rôles** : Top · dégâts magiques · mana · mêlée
- **Kit** : dégâts sur la durée, naturellement résistant, gros besoin de mana, dégâts de zone, très mobile.
- **Répartition des 10 builds** : Combattant (3), Tank (7)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant | Top | Standard | Mercury's Treads → Liandry's Torment → Jak'Sho, The Protean → Randuin's Omen → Abyssal Mask → Frozen Heart | 15300 |
| 2 | Combattant | Top | Contre AD / assassins | Plated Steelcaps → Zhonya's Hourglass → Randuin's Omen → Frozen Heart → Thornmail → Jak'Sho, The Protean | 15300 |
| 3 | Combattant | Top | Contre AP | Mercury's Treads → Banshee's Veil → Jak'Sho, The Protean → Kaenic Rookern → Abyssal Mask → Randuin's Omen | 15700 |
| 4 | Tank | Top | Standard | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Randuin's Omen → Unending Despair | 16050 |
| 5 | Tank | Top | Contre AD / assassins | Plated Steelcaps → Randuin's Omen → Frozen Heart → Jak'Sho, The Protean → Heartsteel → Warmog's Armor | 15700 |
| 6 | Tank | Top | Contre AP | Mercury's Treads → Jak'Sho, The Protean → Kaenic Rookern → Heartsteel → Warmog's Armor → Abyssal Mask | 16100 |
| 7 | Tank | Top | Engagement | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Randuin's Omen → Dead Man's Plate | 16150 |
| 8 | Tank | Top | Anti-soins | Mercury's Treads → Thornmail → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Randuin's Omen | 15700 |
| 9 | Tank | Top | Alternative (sans Heartsteel) | Mercury's Treads → Jak'Sho, The Protean → Randuin's Omen → Unending Despair → Warmog's Armor → Sunfire Aegis | 15750 |
| 10 | Tank | Top | Alternative (sans Jak'Sho, The Protean) | Mercury's Treads → Heartsteel → Randuin's Omen → Warmog's Armor → Unending Despair → Sunfire Aegis | 15550 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Thornmail** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Sunfire Aegis** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Sunfire Aegis** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Thornmail**.

### Sion

- **Rôles** : Top · dégâts physiques · mana · mêlée
- **Kit** : sorts qui montent avec les PV, engage et contrôles, naturellement résistant, sorts fréquents (accélération rentable), dégâts de zone.
- **Répartition des 10 builds** : Combattant (3), Tank (7)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant | Top | Standard | Mercury's Treads → Spear of Shojin → Heartsteel → Titanic Hydra → Warmog's Armor → Overlord's Bloodmail | 17050 |
| 2 | Combattant | Top | Contre AD / assassins | Plated Steelcaps → Heartsteel → Randuin's Omen → Warmog's Armor → Frozen Heart → Jak'Sho, The Protean | 15700 |
| 3 | Combattant | Top | Contre AP | Mercury's Treads → Titanic Hydra → Heartsteel → Kaenic Rookern → Warmog's Armor → Jak'Sho, The Protean | 16750 |
| 4 | Tank | Top | Standard | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Randuin's Omen → Unending Despair | 16050 |
| 5 | Tank | Top | Contre AP | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Kaenic Rookern → Abyssal Mask | 16100 |
| 6 | Tank | Top | Engagement | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Dead Man's Plate → Zeke's Convergence | 15650 |
| 7 | Tank | Top | Partie longue | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Overlord's Bloodmail → Randuin's Omen | 16550 |
| 8 | Tank | Top | Accélération | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Abyssal Mask → Unending Despair | 16000 |
| 9 | Tank | Top | Anti-soins | Mercury's Treads → Heartsteel → Chempunk Chainsword → Warmog's Armor → Jak'Sho, The Protean → Randuin's Omen | 16350 |
| 10 | Tank | Top | Alternative (sans Heartsteel) | Mercury's Treads → Jak'Sho, The Protean → Randuin's Omen → Unending Despair → Warmog's Armor → Sunfire Aegis | 15750 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Randuin's Omen** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Black Cleaver** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Jak'Sho, The Protean** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Sivir

- **Rôles** : ADC · dégâts physiques · mana · distance
- **Kit** : dépend des attaques de base, synergie coup critique, dégâts de zone, ultime décisif.
- **Répartition des 10 builds** : Dégâts AD critique (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD critique | ADC | Standard | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Kraken Slayer → Bloodthirster | 17050 |
| 2 | Dégâts AD critique | ADC | Contre AD / assassins | Plated Steelcaps → Yun Tal Wildarrows → Guardian Angel → Death's Dance → Infinity Edge → Lord Dominik's Regards | 17250 |
| 3 | Dégâts AD critique | ADC | Contre AP | Berserker's Greaves → Yun Tal Wildarrows → Mercurial Scimitar → Infinity Edge → Lord Dominik's Regards → Kraken Slayer | 16850 |
| 4 | Dégâts AD critique | ADC | Boule de neige | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Kraken Slayer → The Collector | 16650 |
| 5 | Dégâts AD critique | ADC | Anti-soins | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Mortal Reminder → Kraken Slayer → Bloodthirster | 17250 |
| 6 | Dégâts AD critique | ADC | Alternative (sans Yun Tal Wildarrows) | Berserker's Greaves → Bloodthirster → Infinity Edge → Kraken Slayer → Lord Dominik's Regards → Statikk Shiv | 16750 |
| 7 | Dégâts AD critique | ADC | Alternative (sans Infinity Edge) | Berserker's Greaves → Yun Tal Wildarrows → Kraken Slayer → Lord Dominik's Regards → Bloodthirster → Statikk Shiv | 16300 |
| 8 | Dégâts AD critique | ADC | Alternative (sans Kraken Slayer) | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Bloodthirster → Statikk Shiv | 16750 |
| 9 | Dégâts AD critique | ADC | Alternative (sans Yun Tal Wildarrows, Infinity Edge) | Berserker's Greaves → Kraken Slayer → Bloodthirster → Lord Dominik's Regards → Statikk Shiv → Essence Reaver | 16200 |
| 10 | Dégâts AD critique | ADC | Alternative (sans Infinity Edge, Lord Dominik's Regards) | Berserker's Greaves → Yun Tal Wildarrows → Kraken Slayer → Mortal Reminder → Bloodthirster → Statikk Shiv | 16500 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Guardian Angel (AD) / Maw of Malmortius ou Mercurial Scimitar (AP).
- **Tank** feed / 2 tanks ou plus : **Blade of the Ruined King** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Mortal Reminder** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Mercurial Scimitar.
- **En avance** : finir l'objet offensif principal, puis **The Collector** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Skarner

- **Rôles** : Jungle, Top · dégâts physiques · mana · mêlée
- **Kit** : engage et contrôles, ultime décisif, naturellement résistant, sorts fréquents (accélération rentable), très mobile.
- **Répartition des 10 builds** : Tank (4), Tank (jungle) (6)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Tank | Top | Standard | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Randuin's Omen → Unending Despair | 16050 |
| 2 | Tank | Top | Contre AD / assassins | Plated Steelcaps → Randuin's Omen → Frozen Heart → Jak'Sho, The Protean → Heartsteel → Warmog's Armor | 15700 |
| 3 | Tank | Top | Contre AP | Mercury's Treads → Jak'Sho, The Protean → Kaenic Rookern → Heartsteel → Warmog's Armor → Abyssal Mask | 16100 |
| 4 | Tank | Top | Engagement | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Dead Man's Plate → Zeke's Convergence | 15650 |
| 5 | Tank (jungle) | Jungle | Accélération | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Unending Despair → Abyssal Mask | 16000 |
| 6 | Tank (jungle) | Jungle | Anti-soins | Mercury's Treads → Thornmail → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Unending Despair | 15800 |
| 7 | Tank (jungle) | Jungle | Alternative (sans Heartsteel) | Mercury's Treads → Jak'Sho, The Protean → Unending Despair → Randuin's Omen → Warmog's Armor → Sunfire Aegis | 15750 |
| 8 | Tank (jungle) | Jungle | Alternative (sans Jak'Sho, The Protean) | Mercury's Treads → Heartsteel → Unending Despair → Warmog's Armor → Randuin's Omen → Sunfire Aegis | 15550 |
| 9 | Tank (jungle) | Jungle | Alternative (sans Warmog's Armor) | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Unending Despair → Randuin's Omen → Sunfire Aegis | 15650 |
| 10 | Tank (jungle) | Jungle | Alternative (sans Unending Despair) | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Randuin's Omen → Sunfire Aegis | 15950 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Frozen Heart** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : protéger le carry visé (Knight's Vow, Locket of the Iron Solari) ; pour vous : Frozen Heart.
- **Tank** feed / 2 tanks ou plus : **Sunfire Aegis** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Thornmail** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : poser plus de balises de contrôle, jouer pour les objectifs ; objet d'équipe suivant : **Dead Man's Plate**.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Frozen Heart**.

### Smolder

- **Rôles** : ADC, Mid · dégâts physiques · mana · distance
- **Kit** : sorts fréquents (accélération rentable), synergie coup critique, gros besoin de mana, dégâts sur la durée, dégâts de zone.
- **Répartition des 10 builds** : Dégâts AD critique (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD critique | ADC, Mid | Standard | Ionian Boots of Lucidity → Serylda's Grudge → Infinity Edge → Essence Reaver → Bloodthirster → Spear of Shojin | 16750 |
| 2 | Dégâts AD critique | ADC, Mid | Contre tanks | Ionian Boots of Lucidity → Essence Reaver → Infinity Edge → Lord Dominik's Regards → Bloodthirster → Spear of Shojin | 16850 |
| 3 | Dégâts AD critique | ADC, Mid | Contre AD / assassins | Plated Steelcaps → Serylda's Grudge → Guardian Angel → Death's Dance → Infinity Edge → Bloodthirster | 17550 |
| 4 | Dégâts AD critique | ADC, Mid | Contre AP | Mercury's Treads → Serylda's Grudge → Mercurial Scimitar → Maw of Malmortius → Edge of Night → Infinity Edge | 17000 |
| 5 | Dégâts AD critique | ADC, Mid | Accélération | Ionian Boots of Lucidity → Serylda's Grudge → Spear of Shojin → Essence Reaver → Infinity Edge → Ravenous Hydra | 16650 |
| 6 | Dégâts AD critique | ADC, Mid | Partie longue | Ionian Boots of Lucidity → Manamune → Essence Reaver → Infinity Edge → Lord Dominik's Regards → Bloodthirster | 16650 |
| 7 | Dégâts AD critique | ADC, Mid | Anti-soins | Ionian Boots of Lucidity → Essence Reaver → Infinity Edge → Mortal Reminder → Bloodthirster → Spear of Shojin | 17050 |
| 8 | Dégâts AD critique | ADC, Mid | Alternative (sans Infinity Edge) | Ionian Boots of Lucidity → Serylda's Grudge → Essence Reaver → Bloodthirster → Spear of Shojin → Ravenous Hydra | 16600 |
| 9 | Dégâts AD critique | ADC, Mid | Alternative (sans Essence Reaver) | Ionian Boots of Lucidity → Serylda's Grudge → Infinity Edge → Bloodthirster → Spear of Shojin → Ravenous Hydra | 17150 |
| 10 | Dégâts AD critique | ADC, Mid | Alternative (sans Serylda's Grudge, Infinity Edge) | Ionian Boots of Lucidity → Essence Reaver → Bloodthirster → Lord Dominik's Regards → Spear of Shojin → Ravenous Hydra | 16700 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Guardian Angel (AD) / Maw of Malmortius ou Mercurial Scimitar (AP).
- **Tank** feed / 2 tanks ou plus : **Ravenous Hydra** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Mortal Reminder** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Mercurial Scimitar.
- **En avance** : finir l'objet offensif principal, puis **Hubris** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Sona

- **Rôles** : Support · dégâts magiques · mana · distance
- **Kit** : sorts fréquents (accélération rentable), soins / boucliers aux alliés, gros besoin de mana, ultime décisif, poke à longue portée.
- **Répartition des 10 builds** : Support enchanteur (7), Support dégâts AP burst (3)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Support enchanteur | Support | Standard | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Ardent Censer → Staff of Flowing Water → Redemption | 9950 |
| 2 | Support enchanteur | Support | Contre AD / assassins | Celestial Opposition → Plated Steelcaps → Frozen Heart → Mikael's Blessing → Ardent Censer → Locket of the Iron Solari | 10400 |
| 3 | Support enchanteur | Support | Poke | Zaz'Zak's Realmspike → Ionian Boots of Lucidity → Mikael's Blessing → Ardent Censer → Staff of Flowing Water → Redemption | 9950 |
| 4 | Support enchanteur | Support | Anti-soins | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Ardent Censer → Morellonomicon → Staff of Flowing Water | 10500 |
| 5 | Support enchanteur | Support | Contre AP | Celestial Opposition → Mercury's Treads → Mikael's Blessing → Ardent Censer → Locket of the Iron Solari → Staff of Flowing Water | 10200 |
| 6 | Support dégâts AP burst | Support | Standard | Zaz'Zak's Realmspike → Ionian Boots of Lucidity → Archangel's Staff → Malignance → Horizon Focus → Rabadon's Deathcap | 12750 |
| 7 | Support dégâts AP burst | Support | Contre AD / assassins | Zaz'Zak's Realmspike → Plated Steelcaps → Malignance → Zhonya's Hourglass → Thornmail → Randuin's Omen | 12300 |
| 8 | Support dégâts AP burst | Support | Contre AP | Zaz'Zak's Realmspike → Mercury's Treads → Archangel's Staff → Banshee's Veil → Horizon Focus → Malignance | 12600 |
| 9 | Support enchanteur | Support | Alternative (sans Mikael's Blessing) | Dream Maker → Ionian Boots of Lucidity → Ardent Censer → Staff of Flowing Water → Redemption → Dawncore | 10150 |
| 10 | Support enchanteur | Support | Alternative (sans Ardent Censer) | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Staff of Flowing Water → Redemption → Dawncore | 10250 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Frozen Heart** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Abyssal Mask** en objet suivant.
- **Assassin** feed qui vous cible : protéger le carry visé (Knight's Vow, Locket of the Iron Solari) ; pour vous : Frozen Heart.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : poser plus de balises de contrôle, jouer pour les objectifs ; objet d'équipe suivant : **Locket of the Iron Solari**.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Frozen Heart**.

### Soraka

- **Rôles** : Support · dégâts magiques · mana · distance
- **Kit** : soins / boucliers aux alliés, sorts fréquents (accélération rentable), gros besoin de mana.
- **Répartition des 10 builds** : Support enchanteur (7), Support dégâts AP burst (3)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Support enchanteur | Support | Standard | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Ardent Censer → Dawncore → Staff of Flowing Water | 10150 |
| 2 | Support enchanteur | Support | Contre AD / assassins | Celestial Opposition → Plated Steelcaps → Frozen Heart → Mikael's Blessing → Ardent Censer → Locket of the Iron Solari | 10400 |
| 3 | Support enchanteur | Support | Accélération | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Staff of Flowing Water → Redemption → Ardent Censer | 9950 |
| 4 | Support enchanteur | Support | Anti-soins | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Ardent Censer → Morellonomicon → Dawncore | 10750 |
| 5 | Support enchanteur | Support | Contre AP | Celestial Opposition → Mercury's Treads → Mikael's Blessing → Ardent Censer → Locket of the Iron Solari → Dawncore | 10450 |
| 6 | Support dégâts AP burst | Support | Standard | Zaz'Zak's Realmspike → Ionian Boots of Lucidity → Archangel's Staff → Horizon Focus → Rabadon's Deathcap → Void Staff | 13050 |
| 7 | Support dégâts AP burst | Support | Contre AD / assassins | Zaz'Zak's Realmspike → Plated Steelcaps → Archangel's Staff → Zhonya's Hourglass → Thornmail → Randuin's Omen | 12500 |
| 8 | Support dégâts AP burst | Support | Contre AP | Zaz'Zak's Realmspike → Mercury's Treads → Archangel's Staff → Banshee's Veil → Kaenic Rookern → Vigilant Wardstone | 12350 |
| 9 | Support enchanteur | Support | Alternative (sans Mikael's Blessing) | Dream Maker → Ionian Boots of Lucidity → Ardent Censer → Dawncore → Staff of Flowing Water → Redemption | 10150 |
| 10 | Support enchanteur | Support | Alternative (sans Ardent Censer) | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Dawncore → Staff of Flowing Water → Redemption | 10250 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Frozen Heart** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Abyssal Mask** en objet suivant.
- **Assassin** feed qui vous cible : protéger le carry visé (Knight's Vow, Locket of the Iron Solari) ; pour vous : Frozen Heart.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : poser plus de balises de contrôle, jouer pour les objectifs ; objet d'équipe suivant : **Locket of the Iron Solari**.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Frozen Heart**.

### Swain

- **Rôles** : Top, Mid, Support, ADC · dégâts magiques · mana · distance
- **Kit** : sorts fréquents (accélération rentable), dégâts sur la durée, dégâts de zone, soins sur soi, ultime décisif.
- **Répartition des 10 builds** : Dégâts AP continu (5), Combattant (2), Support dégâts AP continu (2), Support engage (1)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP continu | Top, Mid, ADC | Standard | Sorcerer's Shoes → Malignance → Blackfire Torch → Rabadon's Deathcap → Void Staff → Horizon Focus | 15850 |
| 2 | Dégâts AP continu | Top, Mid, ADC | Contre tanks | Ionian Boots of Lucidity → Malignance → Liandry's Torment → Rabadon's Deathcap → Void Staff → Blackfire Torch | 15900 |
| 3 | Dégâts AP continu | Top, Mid, ADC | Contre AD / assassins | Plated Steelcaps → Malignance → Zhonya's Hourglass → Rabadon's Deathcap → Blackfire Torch → Void Staff | 16450 |
| 4 | Dégâts AP continu | Top, Mid, ADC | Contre AP | Mercury's Treads → Malignance → Banshee's Veil → Rabadon's Deathcap → Blackfire Torch → Void Staff | 16250 |
| 5 | Dégâts AP continu | Top, Mid, ADC | Accélération | Ionian Boots of Lucidity → Archangel's Staff → Malignance → Rabadon's Deathcap → Horizon Focus → Blackfire Torch | 15550 |
| 6 | Combattant | Top, Mid | Standard | Mercury's Treads → Riftmaker → Heartsteel → Malignance → Rabadon's Deathcap → Spirit Visage | 16250 |
| 7 | Combattant | Top, Mid | Contre AD / assassins | Plated Steelcaps → Riftmaker → Randuin's Omen → Frozen Heart → Zhonya's Hourglass → Heartsteel | 15750 |
| 8 | Support dégâts AP continu | Support | Standard | Zaz'Zak's Realmspike → Sorcerer's Shoes → Malignance → Blackfire Torch → Rabadon's Deathcap → Void Staff | 13100 |
| 9 | Support dégâts AP continu | Support | Contre AD / assassins | Zaz'Zak's Realmspike → Plated Steelcaps → Malignance → Zhonya's Hourglass → Rabadon's Deathcap → Blackfire Torch | 13450 |
| 10 | Support engage | Support | Standard | Celestial Opposition → Plated Steelcaps → Heartsteel → Zeke's Convergence → Spirit Visage → Vigilant Wardstone | 11400 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Cryptbloom** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Shadowflame** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Sylas

- **Rôles** : Mid, Jungle, Top · dégâts magiques · mana · mêlée
- **Kit** : burst, soins sur soi, ultime décisif, attaques entre les sorts, très mobile.
- **Répartition des 10 builds** : Dégâts AP burst (5), Combattant (3), Combattant (jungle) (2)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP burst | Mid, Top | Standard | Sorcerer's Shoes → Shadowflame → Rabadon's Deathcap → Void Staff → Stormsurge → Lich Bane | 16500 |
| 2 | Dégâts AP burst | Mid, Top | Contre tanks | Mercury's Treads → Lich Bane → Rabadon's Deathcap → Void Staff → Malignance → Shadowflame | 16550 |
| 3 | Dégâts AP burst | Mid, Top | Contre AD / assassins | Plated Steelcaps → Shadowflame → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Randuin's Omen | 16850 |
| 4 | Dégâts AP burst | Mid, Top | Contre AP | Mercury's Treads → Shadowflame → Banshee's Veil → Rabadon's Deathcap → Void Staff → Stormsurge | 16750 |
| 5 | Dégâts AP burst | Mid, Top | Anti-soins | Sorcerer's Shoes → Shadowflame → Morellonomicon → Rabadon's Deathcap → Void Staff → Stormsurge | 16450 |
| 6 | Combattant | Mid, Top | Standard | Mercury's Treads → Shadowflame → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Malignance | 16900 |
| 7 | Combattant | Mid, Top | Contre AD / assassins | Plated Steelcaps → Zhonya's Hourglass → Randuin's Omen → Frozen Heart → Rabadon's Deathcap → Void Staff | 16150 |
| 8 | Combattant | Mid, Top | Contre AP | Mercury's Treads → Banshee's Veil → Kaenic Rookern → Spirit Visage → Rabadon's Deathcap → Zhonya's Hourglass | 16600 |
| 9 | Combattant (jungle) | Jungle | Standard | Mercury's Treads → Malignance → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Spirit Visage | 16400 |
| 10 | Combattant (jungle) | Jungle | Sustain | Mercury's Treads → Riftmaker → Spirit Visage → Rabadon's Deathcap → Zhonya's Hourglass → Void Staff | 16800 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Malignance** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Luden's Companion** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Syndra

- **Rôles** : Mid · dégâts magiques · mana · distance
- **Kit** : burst, ultime décisif, sorts fréquents (accélération rentable), gros besoin de mana.
- **Répartition des 10 builds** : Dégâts AP burst (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP burst | Mid | Standard | Sorcerer's Shoes → Malignance → Rabadon's Deathcap → Void Staff → Shadowflame → Luden's Companion | 16250 |
| 2 | Dégâts AP burst | Mid | Contre tanks | Ionian Boots of Lucidity → Archangel's Staff → Malignance → Rabadon's Deathcap → Void Staff → Luden's Companion | 15750 |
| 3 | Dégâts AP burst | Mid | Contre AD / assassins | Plated Steelcaps → Shadowflame → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Malignance | 16850 |
| 4 | Dégâts AP burst | Mid | Contre AP | Mercury's Treads → Shadowflame → Banshee's Veil → Rabadon's Deathcap → Void Staff → Malignance | 16650 |
| 5 | Dégâts AP burst | Mid | Boule de neige | Sorcerer's Shoes → Shadowflame → Stormsurge → Rabadon's Deathcap → Luden's Companion → Void Staff | 16350 |
| 6 | Dégâts AP burst | Mid | Accélération | Ionian Boots of Lucidity → Malignance → Rabadon's Deathcap → Void Staff → Luden's Companion → Shadowflame | 16050 |
| 7 | Dégâts AP burst | Mid | Partie longue | Sorcerer's Shoes → Archangel's Staff → Malignance → Rabadon's Deathcap → Void Staff → Shadowflame | 16400 |
| 8 | Dégâts AP burst | Mid | Anti-soins | Sorcerer's Shoes → Shadowflame → Morellonomicon → Rabadon's Deathcap → Void Staff → Malignance | 16350 |
| 9 | Dégâts AP burst | Mid | Alternative (sans Rabadon's Deathcap) | Sorcerer's Shoes → Malignance → Shadowflame → Void Staff → Luden's Companion → Stormsurge | 15550 |
| 10 | Dégâts AP burst | Mid | Alternative (sans Void Staff) | Sorcerer's Shoes → Malignance → Shadowflame → Rabadon's Deathcap → Luden's Companion → Stormsurge | 16050 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Archangel's Staff** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Stormsurge** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Tahm Kench

- **Rôles** : Top, Support · dégâts magiques · mana · mêlée
- **Kit** : sorts qui montent avec les PV, naturellement résistant, soins sur soi, engage et contrôles.
- **Répartition des 10 builds** : Tank (6), Support engage (4)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Tank | Top | Standard | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Unending Despair → Randuin's Omen | 16050 |
| 2 | Tank | Top | Contre AD / assassins | Plated Steelcaps → Heartsteel → Randuin's Omen → Warmog's Armor → Jak'Sho, The Protean → Thornmail | 15650 |
| 3 | Tank | Top | Contre AP | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Kaenic Rookern → Unending Despair | 16250 |
| 4 | Tank | Top | Engagement | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Dead Man's Plate → Unending Despair | 16250 |
| 5 | Tank | Top | Anti-soins | Mercury's Treads → Heartsteel → Thornmail → Jak'Sho, The Protean → Warmog's Armor → Unending Despair | 15800 |
| 6 | Support engage | Support | Standard | Celestial Opposition → Mercury's Treads → Heartsteel → Zeke's Convergence → Warmog's Armor → Randuin's Omen | 12250 |
| 7 | Support engage | Support | Engagement | Solstice Sleigh → Mercury's Treads → Heartsteel → Zeke's Convergence → Warmog's Armor → Locket of the Iron Solari | 11750 |
| 8 | Support engage | Support | Contre AD / assassins | Celestial Opposition → Plated Steelcaps → Randuin's Omen → Heartsteel → Warmog's Armor → Thornmail | 12450 |
| 9 | Support engage | Support | Contre AP | Celestial Opposition → Mercury's Treads → Heartsteel → Kaenic Rookern → Warmog's Armor → Zeke's Convergence | 12450 |
| 10 | Tank | Top | Alternative (sans Heartsteel) | Mercury's Treads → Jak'Sho, The Protean → Unending Despair → Randuin's Omen → Warmog's Armor → Sunfire Aegis | 15750 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Thornmail** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : protéger le carry visé (Knight's Vow, Locket of the Iron Solari) ; pour vous : Thornmail.
- **Tank** feed / 2 tanks ou plus : **Sunfire Aegis** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Thornmail** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : poser plus de balises de contrôle, jouer pour les objectifs ; objet d'équipe suivant : **Dead Man's Plate**.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Thornmail**.

### Taliyah

- **Rôles** : Jungle, Mid · dégâts magiques · mana · distance
- **Kit** : dégâts de zone, sorts fréquents (accélération rentable), gros besoin de mana, burst, engage et contrôles.
- **Répartition des 10 builds** : Dégâts AP burst (4), Dégâts AP burst (jungle) (6)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP burst | Mid | Standard | Sorcerer's Shoes → Archangel's Staff → Shadowflame → Rabadon's Deathcap → Void Staff → Luden's Companion | 16450 |
| 2 | Dégâts AP burst | Mid | Contre tanks | Ionian Boots of Lucidity → Archangel's Staff → Malignance → Rabadon's Deathcap → Void Staff → Horizon Focus | 15750 |
| 3 | Dégâts AP burst | Mid | Contre AD / assassins | Plated Steelcaps → Shadowflame → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Luden's Companion | 16900 |
| 4 | Dégâts AP burst | Mid | Contre AP | Mercury's Treads → Shadowflame → Banshee's Veil → Rabadon's Deathcap → Void Staff → Luden's Companion | 16700 |
| 5 | Dégâts AP burst (jungle) | Jungle | Standard | Sorcerer's Shoes → Shadowflame → Rabadon's Deathcap → Void Staff → Luden's Companion → Malignance | 16250 |
| 6 | Dégâts AP burst (jungle) | Jungle | Boule de neige | Sorcerer's Shoes → Shadowflame → Stormsurge → Rabadon's Deathcap → Void Staff → Luden's Companion | 16350 |
| 7 | Dégâts AP burst (jungle) | Jungle | Anti-soins | Sorcerer's Shoes → Shadowflame → Morellonomicon → Rabadon's Deathcap → Void Staff → Luden's Companion | 16400 |
| 8 | Dégâts AP burst (jungle) | Jungle | Alternative (sans Shadowflame) | Sorcerer's Shoes → Archangel's Staff → Luden's Companion → Rabadon's Deathcap → Void Staff → Malignance | 15950 |
| 9 | Dégâts AP burst (jungle) | Jungle | Alternative (sans Rabadon's Deathcap) | Sorcerer's Shoes → Archangel's Staff → Shadowflame → Void Staff → Luden's Companion → Malignance | 15650 |
| 10 | Dégâts AP burst (jungle) | Jungle | Alternative (sans Void Staff) | Sorcerer's Shoes → Shadowflame → Luden's Companion → Rabadon's Deathcap → Cryptbloom → Malignance | 16250 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Malignance** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Stormsurge** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Talon

- **Rôles** : Mid, Jungle · dégâts physiques · mana · mêlée
- **Kit** : burst, très mobile, sorts fréquents (accélération rentable), ultime décisif.
- **Répartition des 10 builds** : Dégâts AD létalité (7), Dégâts AD létalité (jungle) (3)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD létalité | Mid | Standard | Ionian Boots of Lucidity → Axiom Arc → Profane Hydra → Serylda's Grudge → Bloodthirster → Voltaic Cyclosword | 15900 |
| 2 | Dégâts AD létalité | Mid | Contre tanks | Ionian Boots of Lucidity → Serylda's Grudge → Bloodthirster → Axiom Arc → Death's Dance → Profane Hydra | 16200 |
| 3 | Dégâts AD létalité | Mid | Contre AD / assassins | Plated Steelcaps → Bloodthirster → Guardian Angel → Death's Dance → Axiom Arc → Profane Hydra | 16700 |
| 4 | Dégâts AD létalité | Mid | Contre AP | Mercury's Treads → Edge of Night → Maw of Malmortius → Axiom Arc → Profane Hydra → Serylda's Grudge | 15950 |
| 5 | Dégâts AD létalité | Mid | Boule de neige | Ionian Boots of Lucidity → Hubris → Profane Hydra → Opportunity → Axiom Arc → Voltaic Cyclosword | 15200 |
| 6 | Dégâts AD létalité | Mid | Accélération | Ionian Boots of Lucidity → Axiom Arc → Profane Hydra → Serylda's Grudge → Voltaic Cyclosword → Eclipse | 15400 |
| 7 | Dégâts AD létalité | Mid | Anti-soins | Ionian Boots of Lucidity → Axiom Arc → Profane Hydra → Mortal Reminder → Bloodthirster → Voltaic Cyclosword | 16200 |
| 8 | Dégâts AD létalité (jungle) | Jungle | Contre tanks | Ionian Boots of Lucidity → Serylda's Grudge → Ravenous Hydra → Bloodthirster → Axiom Arc → Death's Dance | 16650 |
| 9 | Dégâts AD létalité (jungle) | Jungle | Alternative (sans Serylda's Grudge) | Ionian Boots of Lucidity → Profane Hydra → Axiom Arc → Bloodthirster → Voltaic Cyclosword → Youmuu's Ghostblade | 15700 |
| 10 | Dégâts AD létalité (jungle) | Jungle | Alternative (sans Bloodthirster) | Ionian Boots of Lucidity → Profane Hydra → Axiom Arc → Serylda's Grudge → Voltaic Cyclosword → Youmuu's Ghostblade | 15300 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Death's Dance** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Hubris** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Taric

- **Rôles** : Support · dégâts magiques · mana · mêlée
- **Kit** : sorts fréquents (accélération rentable), soins / boucliers aux alliés, ultime décisif, engage et contrôles, naturellement résistant.
- **Répartition des 10 builds** : Support enchanteur (7), Support engage (3)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Support enchanteur | Support | Standard | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Locket of the Iron Solari → Ardent Censer → Redemption | 9900 |
| 2 | Support enchanteur | Support | Contre AD / assassins | Celestial Opposition → Plated Steelcaps → Frozen Heart → Locket of the Iron Solari → Mikael's Blessing → Zeke's Convergence | 10400 |
| 3 | Support enchanteur | Support | Accélération | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Redemption → Locket of the Iron Solari → Staff of Flowing Water | 9950 |
| 4 | Support enchanteur | Support | Contre AP | Celestial Opposition → Mercury's Treads → Locket of the Iron Solari → Mikael's Blessing → Vigilant Wardstone → Ardent Censer | 10250 |
| 5 | Support engage | Support | Standard | Celestial Opposition → Mercury's Treads → Zeke's Convergence → Locket of the Iron Solari → Vigilant Wardstone → Randuin's Omen | 10650 |
| 6 | Support engage | Support | Engagement | Solstice Sleigh → Mercury's Treads → Zeke's Convergence → Locket of the Iron Solari → Trailblazer → Vigilant Wardstone | 10350 |
| 7 | Support engage | Support | Contre AD / assassins | Celestial Opposition → Plated Steelcaps → Frozen Heart → Randuin's Omen → Thornmail → Zeke's Convergence | 11050 |
| 8 | Support enchanteur | Support | Alternative (sans Mikael's Blessing) | Dream Maker → Ionian Boots of Lucidity → Locket of the Iron Solari → Ardent Censer → Redemption → Staff of Flowing Water | 9850 |
| 9 | Support enchanteur | Support | Alternative (sans Locket of the Iron Solari) | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Ardent Censer → Redemption → Staff of Flowing Water | 9950 |
| 10 | Support enchanteur | Support | Alternative (sans Redemption) | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Locket of the Iron Solari → Ardent Censer → Staff of Flowing Water | 9850 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Frozen Heart** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Abyssal Mask** en objet suivant.
- **Assassin** feed qui vous cible : protéger le carry visé (Knight's Vow, Locket of the Iron Solari) ; pour vous : Frozen Heart.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : poser plus de balises de contrôle, jouer pour les objectifs ; objet d'équipe suivant : **Zeke's Convergence**.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Frozen Heart**.

### Teemo

- **Rôles** : Top · dégâts magiques · mana · distance
- **Kit** : effets à l'impact, dégâts sur la durée, dépend des attaques de base, poke à longue portée.
- **Répartition des 10 builds** : Dégâts à l'impact (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts à l'impact | Top | Standard | Berserker's Greaves → Nashor's Tooth → Rabadon's Deathcap → Void Staff → Horizon Focus → Shadowflame | 16450 |
| 2 | Dégâts à l'impact | Top | Contre tanks | Berserker's Greaves → Nashor's Tooth → Rabadon's Deathcap → Void Staff → Liandry's Torment → Horizon Focus | 16250 |
| 3 | Dégâts à l'impact | Top | Contre AD / assassins | Plated Steelcaps → Nashor's Tooth → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Horizon Focus | 16600 |
| 4 | Dégâts à l'impact | Top | Contre AP | Berserker's Greaves → Nashor's Tooth → Banshee's Veil → Rabadon's Deathcap → Void Staff → Wit's End | 16300 |
| 5 | Dégâts à l'impact | Top | Anti-soins | Berserker's Greaves → Nashor's Tooth → Rabadon's Deathcap → Void Staff → Morellonomicon → Horizon Focus | 16100 |
| 6 | Dégâts à l'impact | Top | Alternative (sans Nashor's Tooth) | Berserker's Greaves → Shadowflame → Horizon Focus → Rabadon's Deathcap → Void Staff → Liandry's Torment | 16550 |
| 7 | Dégâts à l'impact | Top | Alternative (sans Rabadon's Deathcap) | Berserker's Greaves → Nashor's Tooth → Horizon Focus → Void Staff → Shadowflame → Liandry's Torment | 15950 |
| 8 | Dégâts à l'impact | Top | Alternative (sans Void Staff) | Berserker's Greaves → Nashor's Tooth → Horizon Focus → Rabadon's Deathcap → Cryptbloom → Shadowflame | 16450 |
| 9 | Dégâts à l'impact | Top | Alternative (sans Horizon Focus) | Berserker's Greaves → Nashor's Tooth → Rabadon's Deathcap → Void Staff → Shadowflame → Liandry's Torment | 16700 |
| 10 | Dégâts à l'impact | Top | Alternative (sans Nashor's Tooth, Rabadon's Deathcap) | Berserker's Greaves → Shadowflame → Horizon Focus → Void Staff → Liandry's Torment → Blackfire Torch | 15850 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Liandry's Torment** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Stormsurge** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Thresh

- **Rôles** : Support · dégâts magiques · mana · distance
- **Kit** : engage et contrôles, sorts fréquents (accélération rentable), soins / boucliers aux alliés, naturellement résistant.
- **Répartition des 10 builds** : Support engage (7), Support enchanteur (3)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Support engage | Support | Standard | Celestial Opposition → Plated Steelcaps → Zeke's Convergence → Locket of the Iron Solari → Vigilant Wardstone → Randuin's Omen | 10600 |
| 2 | Support engage | Support | Engagement | Solstice Sleigh → Plated Steelcaps → Zeke's Convergence → Locket of the Iron Solari → Trailblazer → Vigilant Wardstone | 10300 |
| 3 | Support engage | Support | Contre AD / assassins | Celestial Opposition → Plated Steelcaps → Randuin's Omen → Frozen Heart → Thornmail → Zeke's Convergence | 11050 |
| 4 | Support engage | Support | Contre AP | Celestial Opposition → Mercury's Treads → Zeke's Convergence → Locket of the Iron Solari → Vigilant Wardstone → Kaenic Rookern | 10850 |
| 5 | Support engage | Support | Anti-soins | Celestial Opposition → Plated Steelcaps → Thornmail → Zeke's Convergence → Locket of the Iron Solari → Vigilant Wardstone | 10350 |
| 6 | Support enchanteur | Support | Standard | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Locket of the Iron Solari → Ardent Censer → Zeke's Convergence | 9800 |
| 7 | Support enchanteur | Support | Contre AD / assassins | Celestial Opposition → Plated Steelcaps → Frozen Heart → Locket of the Iron Solari → Zeke's Convergence → Mikael's Blessing | 10400 |
| 8 | Support enchanteur | Support | Accélération | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Locket of the Iron Solari → Redemption → Vigilant Wardstone | 10000 |
| 9 | Support engage | Support | Alternative (sans Zeke's Convergence) | Celestial Opposition → Plated Steelcaps → Locket of the Iron Solari → Vigilant Wardstone → Randuin's Omen → Trailblazer | 10800 |
| 10 | Support engage | Support | Alternative (sans Locket of the Iron Solari) | Celestial Opposition → Plated Steelcaps → Zeke's Convergence → Vigilant Wardstone → Randuin's Omen → Trailblazer | 10800 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Frozen Heart** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : protéger le carry visé (Knight's Vow, Locket of the Iron Solari) ; pour vous : Frozen Heart.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Thornmail** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : poser plus de balises de contrôle, jouer pour les objectifs ; objet d'équipe suivant : **Trailblazer**.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Frozen Heart**.

### Tristana

- **Rôles** : ADC, Mid · dégâts physiques · mana · distance
- **Kit** : dépend des attaques de base, synergie coup critique, burst, très mobile.
- **Répartition des 10 builds** : Dégâts AD critique (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD critique | ADC, Mid | Standard | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Kraken Slayer → Bloodthirster | 17050 |
| 2 | Dégâts AD critique | ADC, Mid | Contre AD / assassins | Plated Steelcaps → Yun Tal Wildarrows → Guardian Angel → Death's Dance → Infinity Edge → Lord Dominik's Regards | 17250 |
| 3 | Dégâts AD critique | ADC, Mid | Contre AP | Berserker's Greaves → Yun Tal Wildarrows → Mercurial Scimitar → Infinity Edge → Lord Dominik's Regards → Edge of Night | 16850 |
| 4 | Dégâts AD critique | ADC, Mid | Boule de neige | Berserker's Greaves → The Collector → Infinity Edge → Yun Tal Wildarrows → Lord Dominik's Regards → Kraken Slayer | 16650 |
| 5 | Dégâts AD critique | ADC, Mid | Anti-soins | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Mortal Reminder → Kraken Slayer → Bloodthirster | 17250 |
| 6 | Dégâts AD critique | ADC, Mid | Alternative (sans Yun Tal Wildarrows) | Berserker's Greaves → Essence Reaver → Infinity Edge → Kraken Slayer → Lord Dominik's Regards → Bloodthirster | 16950 |
| 7 | Dégâts AD critique | ADC, Mid | Alternative (sans Infinity Edge) | Berserker's Greaves → Yun Tal Wildarrows → Kraken Slayer → Lord Dominik's Regards → Bloodthirster → Essence Reaver | 16500 |
| 8 | Dégâts AD critique | ADC, Mid | Alternative (sans Kraken Slayer) | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Bloodthirster → Essence Reaver | 16950 |
| 9 | Dégâts AD critique | ADC, Mid | Alternative (sans Yun Tal Wildarrows, Infinity Edge) | Berserker's Greaves → Kraken Slayer → Bloodthirster → Lord Dominik's Regards → Essence Reaver → Phantom Dancer | 16150 |
| 10 | Dégâts AD critique | ADC, Mid | Alternative (sans Infinity Edge, Lord Dominik's Regards) | Berserker's Greaves → Yun Tal Wildarrows → Kraken Slayer → Mortal Reminder → Bloodthirster → Essence Reaver | 16700 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Guardian Angel (AD) / Maw of Malmortius ou Mercurial Scimitar (AP).
- **Tank** feed / 2 tanks ou plus : **Blade of the Ruined King** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Mortal Reminder** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Mercurial Scimitar.
- **En avance** : finir l'objet offensif principal, puis **The Collector** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Trundle

- **Rôles** : Top, Jungle · dégâts physiques · mana · mêlée
- **Kit** : dépend des attaques de base, dégâts sur la durée, soins sur soi, ultime décisif, naturellement résistant.
- **Répartition des 10 builds** : Combattant (7), Combattant (jungle) (3)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant | Top | Standard | Mercury's Treads → Stridebreaker → Death's Dance → Experimental Hexplate → Sterak's Gage → Spear of Shojin | 17150 |
| 2 | Combattant | Top | Contre AD / assassins | Plated Steelcaps → Stridebreaker → Death's Dance → Randuin's Omen → Frozen Heart → Sterak's Gage | 16200 |
| 3 | Combattant | Top | Contre AP | Mercury's Treads → Stridebreaker → Maw of Malmortius → Kaenic Rookern → Death's Dance → Jak'Sho, The Protean | 17050 |
| 4 | Combattant | Top | Contre tanks | Mercury's Treads → Serylda's Grudge → Death's Dance → Stridebreaker → Experimental Hexplate → Sterak's Gage | 17050 |
| 5 | Combattant | Top | Sustain | Mercury's Treads → Bloodthirster → Death's Dance → Sterak's Gage → Sundered Sky → Stridebreaker | 17550 |
| 6 | Combattant | Top | Split push | Mercury's Treads → Hullbreaker → Death's Dance → Stridebreaker → Experimental Hexplate → Sterak's Gage | 17050 |
| 7 | Combattant | Top | Anti-soins | Mercury's Treads → Chempunk Chainsword → Death's Dance → Stridebreaker → Experimental Hexplate → Sterak's Gage | 17150 |
| 8 | Combattant (jungle) | Jungle | Standard | Mercury's Treads → Stridebreaker → Death's Dance → Experimental Hexplate → Sterak's Gage → Sundered Sky | 17150 |
| 9 | Combattant (jungle) | Jungle | Contre AP | Mercury's Treads → Stridebreaker → Death's Dance → Maw of Malmortius → Kaenic Rookern → Spirit Visage | 16550 |
| 10 | Combattant (jungle) | Jungle | Sustain | Mercury's Treads → Ravenous Hydra → Death's Dance → Sundered Sky → Sterak's Gage → Spirit Visage | 16850 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Randuin's Omen** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Serylda's Grudge** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Black Cleaver** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Tryndamere

- **Rôles** : Top · dégâts physiques · sans mana · mêlée
- **Kit** : dépend des attaques de base, synergie coup critique, soins sur soi, très mobile.
- **Répartition des 10 builds** : Dégâts AD critique (8), Combattant (2)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD critique | Top | Standard | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Kraken Slayer → Bloodthirster | 17050 |
| 2 | Dégâts AD critique | Top | Contre AD / assassins | Plated Steelcaps → Yun Tal Wildarrows → Guardian Angel → Death's Dance → Bloodthirster → Infinity Edge | 17550 |
| 3 | Dégâts AD critique | Top | Contre AP | Mercury's Treads → Yun Tal Wildarrows → Maw of Malmortius → Infinity Edge → Lord Dominik's Regards → Kraken Slayer | 16900 |
| 4 | Dégâts AD critique | Top | Boule de neige | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Kraken Slayer → The Collector | 16650 |
| 5 | Dégâts AD critique | Top | Anti-soins | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Mortal Reminder → Kraken Slayer → Bloodthirster | 17250 |
| 6 | Combattant | Top | Standard | Mercury's Treads → Yun Tal Wildarrows → Death's Dance → Infinity Edge → Stridebreaker → Lord Dominik's Regards | 17400 |
| 7 | Combattant | Top | Contre AD / assassins | Plated Steelcaps → Death's Dance → Randuin's Omen → Guardian Angel → Sterak's Gage → Infinity Edge | 17050 |
| 8 | Dégâts AD critique | Top | Alternative (sans Yun Tal Wildarrows) | Berserker's Greaves → Bloodthirster → Infinity Edge → Kraken Slayer → Lord Dominik's Regards → Phantom Dancer | 16700 |
| 9 | Dégâts AD critique | Top | Alternative (sans Infinity Edge) | Berserker's Greaves → Yun Tal Wildarrows → Kraken Slayer → Lord Dominik's Regards → Bloodthirster → Phantom Dancer | 16250 |
| 10 | Dégâts AD critique | Top | Alternative (sans Kraken Slayer) | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Bloodthirster → Phantom Dancer | 16700 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Blade of the Ruined King** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **The Collector** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Twisted Fate

- **Rôles** : Mid · dégâts magiques · mana · distance
- **Kit** : burst, attaques entre les sorts, engage et contrôles.
- **Répartition des 10 builds** : Dégâts AP burst (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP burst | Mid | Standard | Sorcerer's Shoes → Shadowflame → Rabadon's Deathcap → Void Staff → Stormsurge → Lich Bane | 16500 |
| 2 | Dégâts AP burst | Mid | Contre tanks | Berserker's Greaves → Lich Bane → Rabadon's Deathcap → Void Staff → Shadowflame → Horizon Focus | 16450 |
| 3 | Dégâts AP burst | Mid | Contre AD / assassins | Plated Steelcaps → Shadowflame → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Stormsurge | 16950 |
| 4 | Dégâts AP burst | Mid | Contre AP | Mercury's Treads → Shadowflame → Banshee's Veil → Rabadon's Deathcap → Void Staff → Stormsurge | 16750 |
| 5 | Dégâts AP burst | Mid | Boule de neige | Sorcerer's Shoes → Shadowflame → Stormsurge → Rabadon's Deathcap → Void Staff → Luden's Companion | 16350 |
| 6 | Dégâts AP burst | Mid | Anti-soins | Sorcerer's Shoes → Shadowflame → Morellonomicon → Rabadon's Deathcap → Void Staff → Stormsurge | 16450 |
| 7 | Dégâts AP burst | Mid | Alternative (sans Shadowflame) | Sorcerer's Shoes → Stormsurge → Rabadon's Deathcap → Void Staff → Lich Bane → Luden's Companion | 16050 |
| 8 | Dégâts AP burst | Mid | Alternative (sans Rabadon's Deathcap) | Sorcerer's Shoes → Shadowflame → Stormsurge → Void Staff → Lich Bane → Luden's Companion | 15750 |
| 9 | Dégâts AP burst | Mid | Alternative (sans Void Staff) | Sorcerer's Shoes → Shadowflame → Stormsurge → Rabadon's Deathcap → Lich Bane → Luden's Companion | 16250 |
| 10 | Dégâts AP burst | Mid | Alternative (sans Stormsurge) | Sorcerer's Shoes → Shadowflame → Rabadon's Deathcap → Void Staff → Lich Bane → Luden's Companion | 16450 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Horizon Focus** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Luden's Companion** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Twitch

- **Rôles** : ADC · dégâts mixtes · mana · distance
- **Kit** : dépend des attaques de base, synergie coup critique, dégâts sur la durée, dégâts de zone.
- **Répartition des 10 builds** : Dégâts AD critique (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD critique | ADC | Standard | Berserker's Greaves → Yun Tal Wildarrows → Kraken Slayer → Infinity Edge → Lord Dominik's Regards → Bloodthirster | 17050 |
| 2 | Dégâts AD critique | ADC | Contre tanks | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Kraken Slayer → Lord Dominik's Regards → Blade of the Ruined King | 16850 |
| 3 | Dégâts AD critique | ADC | Contre AD / assassins | Plated Steelcaps → Yun Tal Wildarrows → Guardian Angel → Death's Dance → Kraken Slayer → Infinity Edge | 17150 |
| 4 | Dégâts AD critique | ADC | Contre AP | Berserker's Greaves → Yun Tal Wildarrows → Mercurial Scimitar → Kraken Slayer → Infinity Edge → Lord Dominik's Regards | 16850 |
| 5 | Dégâts AD critique | ADC | Boule de neige | Berserker's Greaves → Yun Tal Wildarrows → Kraken Slayer → Infinity Edge → Lord Dominik's Regards → The Collector | 16650 |
| 6 | Dégâts AD critique | ADC | Anti-soins | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Mortal Reminder → Kraken Slayer → Bloodthirster | 17250 |
| 7 | Dégâts AD critique | ADC | Alternative (sans Yun Tal Wildarrows) | Berserker's Greaves → Kraken Slayer → Infinity Edge → Lord Dominik's Regards → Bloodthirster → Phantom Dancer | 16700 |
| 8 | Dégâts AD critique | ADC | Alternative (sans Kraken Slayer) | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Bloodthirster → Phantom Dancer | 16700 |
| 9 | Dégâts AD critique | ADC | Alternative (sans Infinity Edge) | Berserker's Greaves → Yun Tal Wildarrows → Kraken Slayer → Lord Dominik's Regards → Bloodthirster → Phantom Dancer | 16250 |
| 10 | Dégâts AD critique | ADC | Alternative (sans Yun Tal Wildarrows, Kraken Slayer) | Berserker's Greaves → Essence Reaver → Infinity Edge → Bloodthirster → Lord Dominik's Regards → Phantom Dancer | 16600 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Guardian Angel (AD) / Maw of Malmortius ou Mercurial Scimitar (AP).
- **Tank** feed / 2 tanks ou plus : **Blade of the Ruined King** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Mortal Reminder** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Mercurial Scimitar.
- **En avance** : finir l'objet offensif principal, puis **The Collector** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Udyr

- **Rôles** : Jungle, Top · dégâts mixtes · mana · mêlée
- **Kit** : dépend des attaques de base, effets à l'impact, sorts fréquents (accélération rentable), dégâts sur la durée, naturellement résistant.
- **Répartition des 10 builds** : Combattant (3), Combattant (jungle) (7)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant | Top | Standard | Mercury's Treads → Stridebreaker → Death's Dance → Spear of Shojin → Sterak's Gage → Jak'Sho, The Protean | 17350 |
| 2 | Combattant | Top | Contre AD / assassins | Plated Steelcaps → Stridebreaker → Randuin's Omen → Frozen Heart → Death's Dance → Sterak's Gage | 16200 |
| 3 | Combattant (jungle) | Jungle | Contre AP | Mercury's Treads → Stridebreaker → Kaenic Rookern → Jak'Sho, The Protean → Spirit Visage → Death's Dance | 16650 |
| 4 | Combattant (jungle) | Jungle | Contre tanks | Mercury's Treads → Stridebreaker → Death's Dance → Black Cleaver → Spear of Shojin → Liandry's Torment | 16950 |
| 5 | Combattant (jungle) | Jungle | Sustain | Mercury's Treads → Stridebreaker → Death's Dance → Spirit Visage → Sterak's Gage → Sundered Sky | 16850 |
| 6 | Combattant (jungle) | Jungle | Accélération | Mercury's Treads → Spear of Shojin → Death's Dance → Stridebreaker → Trinity Force → Nashor's Tooth | 17183 |
| 7 | Combattant (jungle) | Jungle | Anti-soins | Mercury's Treads → Chempunk Chainsword → Stridebreaker → Death's Dance → Spear of Shojin → Sterak's Gage | 17250 |
| 8 | Combattant (jungle) | Jungle | Alternative (sans Stridebreaker) | Mercury's Treads → Spear of Shojin → Death's Dance → Sterak's Gage → Jak'Sho, The Protean → Randuin's Omen | 16750 |
| 9 | Combattant (jungle) | Jungle | Alternative (sans Jak'Sho, The Protean) | Mercury's Treads → Stridebreaker → Death's Dance → Spear of Shojin → Sterak's Gage → Randuin's Omen | 16850 |
| 10 | Combattant | Top | Alternative (sans Death's Dance) | Mercury's Treads → Stridebreaker → Spear of Shojin → Sterak's Gage → Jak'Sho, The Protean → Randuin's Omen | 16750 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Randuin's Omen** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Black Cleaver** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Randuin's Omen** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Urgot

- **Rôles** : Top · dégâts physiques · mana · distance
- **Kit** : sorts fréquents (accélération rentable), dégâts sur la durée, engage et contrôles, ultime décisif, naturellement résistant.
- **Répartition des 10 builds** : Dégâts AD (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD | Top | Standard | Ionian Boots of Lucidity → Serylda's Grudge → Bloodthirster → Spear of Shojin → Death's Dance → Maw of Malmortius | 16800 |
| 2 | Dégâts AD | Top | Contre AD / assassins | Plated Steelcaps → Serylda's Grudge → Guardian Angel → Death's Dance → Bloodthirster → Randuin's Omen | 16800 |
| 3 | Dégâts AD | Top | Contre AP | Mercury's Treads → Serylda's Grudge → Mercurial Scimitar → Maw of Malmortius → Edge of Night → Bloodthirster | 16950 |
| 4 | Dégâts AD | Top | Anti-soins | Ionian Boots of Lucidity → Bloodthirster → Spear of Shojin → Mortal Reminder → Death's Dance → Maw of Malmortius | 17100 |
| 5 | Dégâts AD | Top | Alternative (sans Serylda's Grudge) | Ionian Boots of Lucidity → Bloodthirster → Spear of Shojin → Death's Dance → Lord Dominik's Regards → Maw of Malmortius | 16900 |
| 6 | Dégâts AD | Top | Alternative (sans Bloodthirster) | Ionian Boots of Lucidity → Serylda's Grudge → Spear of Shojin → Death's Dance → Maw of Malmortius → Ravenous Hydra | 16700 |
| 7 | Dégâts AD | Top | Alternative (sans Spear of Shojin) | Ionian Boots of Lucidity → Serylda's Grudge → Bloodthirster → Death's Dance → Maw of Malmortius → Ravenous Hydra | 17000 |
| 8 | Dégâts AD | Top | Alternative (sans Death's Dance) | Ionian Boots of Lucidity → Serylda's Grudge → Bloodthirster → Spear of Shojin → Maw of Malmortius → Ravenous Hydra | 16800 |
| 9 | Dégâts AD | Top | Alternative (sans Serylda's Grudge, Bloodthirster) | Ionian Boots of Lucidity → Ravenous Hydra → Spear of Shojin → Death's Dance → Lord Dominik's Regards → Maw of Malmortius | 16800 |
| 10 | Dégâts AD | Top | Alternative (sans Bloodthirster, Spear of Shojin) | Ionian Boots of Lucidity → Serylda's Grudge → Death's Dance → Maw of Malmortius → Ravenous Hydra → Eclipse | 16500 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Guardian Angel (AD) / Maw of Malmortius ou Mercurial Scimitar (AP).
- **Tank** feed / 2 tanks ou plus : **Ravenous Hydra** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Mercurial Scimitar.
- **En avance** : finir l'objet offensif principal, puis **Hubris** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Varus

- **Rôles** : ADC, Mid · dégâts physiques · mana · distance
- **Kit** : poke à longue portée, dépend des attaques de base, effets à l'impact, sorts fréquents (accélération rentable), burst.
- **Répartition des 10 builds** : Dégâts à l'impact (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts à l'impact | ADC, Mid | Standard | Berserker's Greaves → Bloodthirster → Kraken Slayer → Serylda's Grudge → Blade of the Ruined King → Guinsoo's Rageblade | 16700 |
| 2 | Dégâts à l'impact | ADC, Mid | Contre AD / assassins | Plated Steelcaps → Serylda's Grudge → Guardian Angel → Death's Dance → Bloodthirster → Kraken Slayer | 17100 |
| 3 | Dégâts à l'impact | ADC, Mid | Contre AP | Mercury's Treads → Bloodthirster → Mercurial Scimitar → Edge of Night → Maw of Malmortius → Kraken Slayer | 16950 |
| 4 | Dégâts à l'impact | ADC, Mid | Boule de neige | Berserker's Greaves → Hubris → Bloodthirster → Kraken Slayer → Opportunity → Serylda's Grudge | 16200 |
| 5 | Dégâts à l'impact | ADC, Mid | Accélération | Berserker's Greaves → Serylda's Grudge → Bloodthirster → Kraken Slayer → Spear of Shojin → Blade of the Ruined King | 16800 |
| 6 | Dégâts à l'impact | ADC, Mid | Sustain | Berserker's Greaves → Bloodthirster → Ravenous Hydra → Blade of the Ruined King → Kraken Slayer → Death's Dance | 17300 |
| 7 | Dégâts à l'impact | ADC, Mid | Poke | Berserker's Greaves → Serylda's Grudge → Bloodthirster → Kraken Slayer → Blade of the Ruined King → Eclipse | 16600 |
| 8 | Dégâts à l'impact | ADC, Mid | Anti-soins | Berserker's Greaves → Bloodthirster → Kraken Slayer → Mortal Reminder → Blade of the Ruined King → Guinsoo's Rageblade | 17000 |
| 9 | Dégâts à l'impact | ADC, Mid | Alternative (sans Bloodthirster) | Berserker's Greaves → Kraken Slayer → Serylda's Grudge → Blade of the Ruined King → Guinsoo's Rageblade → Eclipse | 16200 |
| 10 | Dégâts à l'impact | ADC, Mid | Alternative (sans Kraken Slayer) | Berserker's Greaves → Bloodthirster → Serylda's Grudge → Blade of the Ruined King → Guinsoo's Rageblade → Eclipse | 16600 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Guardian Angel (AD) / Maw of Malmortius ou Mercurial Scimitar (AP).
- **Tank** feed / 2 tanks ou plus : **Yun Tal Wildarrows** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Mercurial Scimitar.
- **En avance** : finir l'objet offensif principal, puis **Hubris** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Vayne

- **Rôles** : ADC, Top · dégâts physiques · mana · distance
- **Kit** : dépend des attaques de base, effets à l'impact, dégâts sur la durée, très mobile.
- **Répartition des 10 builds** : Dégâts à l'impact (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts à l'impact | ADC, Top | Standard | Berserker's Greaves → Kraken Slayer → Blade of the Ruined King → Yun Tal Wildarrows → Bloodthirster → Guinsoo's Rageblade | 16700 |
| 2 | Dégâts à l'impact | ADC, Top | Contre tanks | Berserker's Greaves → Blade of the Ruined King → Kraken Slayer → Serylda's Grudge → Guinsoo's Rageblade → Yun Tal Wildarrows | 16300 |
| 3 | Dégâts à l'impact | ADC, Top | Contre AD / assassins | Plated Steelcaps → Bloodthirster → Guardian Angel → Death's Dance → Kraken Slayer → Blade of the Ruined King | 17300 |
| 4 | Dégâts à l'impact | ADC, Top | Contre AP | Berserker's Greaves → Kraken Slayer → Mercurial Scimitar → Blade of the Ruined King → Wit's End → Maw of Malmortius | 16400 |
| 5 | Dégâts à l'impact | ADC, Top | Partie longue | Berserker's Greaves → Kraken Slayer → Blade of the Ruined King → Yun Tal Wildarrows → Serylda's Grudge → Bloodthirster | 16700 |
| 6 | Dégâts à l'impact | ADC, Top | Anti-soins | Berserker's Greaves → Kraken Slayer → Blade of the Ruined King → Mortal Reminder → Yun Tal Wildarrows → Bloodthirster | 17000 |
| 7 | Dégâts à l'impact | ADC, Top | Alternative (sans Kraken Slayer) | Berserker's Greaves → Blade of the Ruined King → Yun Tal Wildarrows → Bloodthirster → Guinsoo's Rageblade → Terminus | 16700 |
| 8 | Dégâts à l'impact | ADC, Top | Alternative (sans Blade of the Ruined King) | Berserker's Greaves → Kraken Slayer → Yun Tal Wildarrows → Bloodthirster → Guinsoo's Rageblade → Terminus | 16500 |
| 9 | Dégâts à l'impact | ADC, Top | Alternative (sans Yun Tal Wildarrows) | Berserker's Greaves → Kraken Slayer → Blade of the Ruined King → Bloodthirster → Guinsoo's Rageblade → Terminus | 16700 |
| 10 | Dégâts à l'impact | ADC, Top | Alternative (sans Kraken Slayer, Blade of the Ruined King) | Berserker's Greaves → Yun Tal Wildarrows → Bloodthirster → Guinsoo's Rageblade → Terminus → Statikk Shiv | 16200 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Wit's End** en objet suivant.
- **Assassin** feed qui vous cible : Guardian Angel (AD) / Maw of Malmortius ou Mercurial Scimitar (AP).
- **Tank** feed / 2 tanks ou plus : **Serylda's Grudge** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Mercurial Scimitar.
- **En avance** : finir l'objet offensif principal, puis **Terminus** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Veigar

- **Rôles** : Mid, Support · dégâts magiques · mana · distance
- **Kit** : burst, sorts fréquents (accélération rentable), gros besoin de mana, engage et contrôles, ultime décisif.
- **Répartition des 10 builds** : Dégâts AP burst (6), Support dégâts AP burst (4)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP burst | Mid | Standard | Sorcerer's Shoes → Shadowflame → Rabadon's Deathcap → Void Staff → Luden's Companion → Stormsurge | 16350 |
| 2 | Dégâts AP burst | Mid | Contre tanks | Ionian Boots of Lucidity → Archangel's Staff → Malignance → Rabadon's Deathcap → Void Staff → Luden's Companion | 15750 |
| 3 | Dégâts AP burst | Mid | Contre AD / assassins | Plated Steelcaps → Shadowflame → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Luden's Companion | 16900 |
| 4 | Dégâts AP burst | Mid | Contre AP | Mercury's Treads → Shadowflame → Banshee's Veil → Rabadon's Deathcap → Void Staff → Luden's Companion | 16700 |
| 5 | Dégâts AP burst | Mid | Accélération | Ionian Boots of Lucidity → Archangel's Staff → Luden's Companion → Rabadon's Deathcap → Void Staff → Shadowflame | 16250 |
| 6 | Dégâts AP burst | Mid | Partie longue | Sorcerer's Shoes → Archangel's Staff → Shadowflame → Rabadon's Deathcap → Void Staff → Luden's Companion | 16450 |
| 7 | Support dégâts AP burst | Support | Standard | Zaz'Zak's Realmspike → Sorcerer's Shoes → Luden's Companion → Rabadon's Deathcap → Void Staff → Malignance | 13050 |
| 8 | Support dégâts AP burst | Support | Contre AD / assassins | Zaz'Zak's Realmspike → Plated Steelcaps → Luden's Companion → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff | 13700 |
| 9 | Support dégâts AP burst | Support | Contre AP | Zaz'Zak's Realmspike → Mercury's Treads → Luden's Companion → Banshee's Veil → Rabadon's Deathcap → Void Staff | 13500 |
| 10 | Support dégâts AP burst | Support | Boule de neige | Zaz'Zak's Realmspike → Sorcerer's Shoes → Stormsurge → Luden's Companion → Rabadon's Deathcap → Shadowflame | 13350 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Malignance** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Malignance** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Vel'Koz

- **Rôles** : Support, Mid · dégâts magiques · mana · distance
- **Kit** : poke à longue portée, sorts fréquents (accélération rentable), gros besoin de mana, burst, dégâts sur la durée.
- **Répartition des 10 builds** : Dégâts AP burst (4), Support dégâts AP burst (6)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP burst | Mid | Standard | Sorcerer's Shoes → Shadowflame → Horizon Focus → Rabadon's Deathcap → Void Staff → Luden's Companion | 16300 |
| 2 | Dégâts AP burst | Mid | Contre tanks | Ionian Boots of Lucidity → Archangel's Staff → Luden's Companion → Horizon Focus → Rabadon's Deathcap → Void Staff | 15800 |
| 3 | Dégâts AP burst | Mid | Contre AD / assassins | Plated Steelcaps → Luden's Companion → Zhonya's Hourglass → Horizon Focus → Rabadon's Deathcap → Void Staff | 16450 |
| 4 | Dégâts AP burst | Mid | Contre AP | Mercury's Treads → Luden's Companion → Banshee's Veil → Horizon Focus → Rabadon's Deathcap → Void Staff | 16250 |
| 5 | Support dégâts AP burst | Support | Standard | Zaz'Zak's Realmspike → Sorcerer's Shoes → Luden's Companion → Horizon Focus → Rabadon's Deathcap → Void Staff | 13100 |
| 6 | Support dégâts AP burst | Support | Contre AD / assassins | Zaz'Zak's Realmspike → Plated Steelcaps → Luden's Companion → Zhonya's Hourglass → Horizon Focus → Rabadon's Deathcap | 13450 |
| 7 | Support dégâts AP burst | Support | Contre AP | Zaz'Zak's Realmspike → Mercury's Treads → Luden's Companion → Banshee's Veil → Horizon Focus → Rabadon's Deathcap | 13250 |
| 8 | Support dégâts AP burst | Support | Boule de neige | Zaz'Zak's Realmspike → Sorcerer's Shoes → Stormsurge → Horizon Focus → Luden's Companion → Rabadon's Deathcap | 12900 |
| 9 | Support dégâts AP burst | Support | Accélération | Zaz'Zak's Realmspike → Ionian Boots of Lucidity → Archangel's Staff → Luden's Companion → Horizon Focus → Rabadon's Deathcap | 12800 |
| 10 | Support dégâts AP burst | Support | Poke | Zaz'Zak's Realmspike → Ionian Boots of Lucidity → Luden's Companion → Horizon Focus → Rabadon's Deathcap → Void Staff | 12900 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Archangel's Staff** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Stormsurge** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Vex

- **Rôles** : Mid · dégâts magiques · mana · distance
- **Kit** : burst, sorts fréquents (accélération rentable), dégâts de zone, engage et contrôles, très mobile.
- **Répartition des 10 builds** : Dégâts AP burst (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP burst | Mid | Standard | Sorcerer's Shoes → Shadowflame → Rabadon's Deathcap → Void Staff → Stormsurge → Luden's Companion | 16350 |
| 2 | Dégâts AP burst | Mid | Contre tanks | Ionian Boots of Lucidity → Shadowflame → Horizon Focus → Rabadon's Deathcap → Void Staff → Malignance | 16050 |
| 3 | Dégâts AP burst | Mid | Contre AD / assassins | Plated Steelcaps → Shadowflame → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Stormsurge | 16950 |
| 4 | Dégâts AP burst | Mid | Contre AP | Mercury's Treads → Shadowflame → Banshee's Veil → Rabadon's Deathcap → Void Staff → Stormsurge | 16750 |
| 5 | Dégâts AP burst | Mid | Accélération | Ionian Boots of Lucidity → Shadowflame → Rabadon's Deathcap → Void Staff → Horizon Focus → Stormsurge | 16150 |
| 6 | Dégâts AP burst | Mid | Anti-soins | Sorcerer's Shoes → Shadowflame → Morellonomicon → Rabadon's Deathcap → Void Staff → Stormsurge | 16450 |
| 7 | Dégâts AP burst | Mid | Alternative (sans Shadowflame) | Sorcerer's Shoes → Stormsurge → Rabadon's Deathcap → Void Staff → Luden's Companion → Horizon Focus | 15900 |
| 8 | Dégâts AP burst | Mid | Alternative (sans Rabadon's Deathcap) | Sorcerer's Shoes → Shadowflame → Stormsurge → Void Staff → Luden's Companion → Horizon Focus | 15600 |
| 9 | Dégâts AP burst | Mid | Alternative (sans Void Staff) | Sorcerer's Shoes → Shadowflame → Stormsurge → Rabadon's Deathcap → Cryptbloom → Luden's Companion | 16350 |
| 10 | Dégâts AP burst | Mid | Alternative (sans Stormsurge) | Sorcerer's Shoes → Shadowflame → Rabadon's Deathcap → Void Staff → Luden's Companion → Horizon Focus | 16300 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Horizon Focus** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Horizon Focus** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Vi

- **Rôles** : Jungle · dégâts physiques · mana · mêlée
- **Kit** : engage et contrôles, très mobile, ultime décisif, sorts fréquents (accélération rentable), burst.
- **Répartition des 10 builds** : Combattant (jungle) (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant (jungle) | Jungle | Standard | Mercury's Treads → Experimental Hexplate → Death's Dance → Spear of Shojin → Maw of Malmortius → Black Cleaver | 16750 |
| 2 | Combattant (jungle) | Jungle | Contre AD / assassins | Plated Steelcaps → Death's Dance → Randuin's Omen → Frozen Heart → Sterak's Gage → Guardian Angel | 16100 |
| 3 | Combattant (jungle) | Jungle | Contre AP | Mercury's Treads → Spear of Shojin → Maw of Malmortius → Death's Dance → Kaenic Rookern → Jak'Sho, The Protean | 16850 |
| 4 | Combattant (jungle) | Jungle | Contre tanks | Mercury's Treads → Serylda's Grudge → Death's Dance → Spear of Shojin → Titanic Hydra → Maw of Malmortius | 17050 |
| 5 | Combattant (jungle) | Jungle | Anti-soins | Mercury's Treads → Chempunk Chainsword → Death's Dance → Spear of Shojin → Maw of Malmortius → Experimental Hexplate | 16850 |
| 6 | Combattant (jungle) | Jungle | Alternative (sans Experimental Hexplate) | Mercury's Treads → Stridebreaker → Death's Dance → Spear of Shojin → Maw of Malmortius → Black Cleaver | 17050 |
| 7 | Combattant (jungle) | Jungle | Alternative (sans Death's Dance) | Mercury's Treads → Spear of Shojin → Maw of Malmortius → Experimental Hexplate → Black Cleaver → Stridebreaker | 16750 |
| 8 | Combattant (jungle) | Jungle | Alternative (sans Spear of Shojin) | Mercury's Treads → Stridebreaker → Death's Dance → Maw of Malmortius → Experimental Hexplate → Black Cleaver | 16950 |
| 9 | Combattant (jungle) | Jungle | Alternative (sans Maw of Malmortius) | Mercury's Treads → Experimental Hexplate → Death's Dance → Spear of Shojin → Sterak's Gage → Black Cleaver | 16850 |
| 10 | Combattant (jungle) | Jungle | Alternative (sans Experimental Hexplate, Death's Dance) | Mercury's Treads → Spear of Shojin → Maw of Malmortius → Black Cleaver → Stridebreaker → Guardian Angel | 16950 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Randuin's Omen** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Titanic Hydra** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Hubris** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Viego

- **Rôles** : Jungle · dégâts physiques · sans mana · mêlée
- **Kit** : dépend des attaques de base, effets à l'impact, soins sur soi, très mobile.
- **Répartition des 10 builds** : Combattant (jungle) (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant (jungle) | Jungle | Standard | Mercury's Treads → Kraken Slayer → Death's Dance → Stridebreaker → Experimental Hexplate → Sterak's Gage | 17050 |
| 2 | Combattant (jungle) | Jungle | Contre AD / assassins | Plated Steelcaps → Stridebreaker → Death's Dance → Randuin's Omen → Guardian Angel → Sterak's Gage | 16900 |
| 3 | Combattant (jungle) | Jungle | Contre AP | Mercury's Treads → Stridebreaker → Death's Dance → Maw of Malmortius → Wit's End → Kaenic Rookern | 16650 |
| 4 | Combattant (jungle) | Jungle | Contre tanks | Mercury's Treads → Serylda's Grudge → Death's Dance → Stridebreaker → Kraken Slayer → Blade of the Ruined King | 17050 |
| 5 | Combattant (jungle) | Jungle | Sustain | Mercury's Treads → Bloodthirster → Death's Dance → Sundered Sky → Ravenous Hydra → Sterak's Gage | 17550 |
| 6 | Combattant (jungle) | Jungle | Anti-soins | Mercury's Treads → Chempunk Chainsword → Death's Dance → Stridebreaker → Kraken Slayer → Experimental Hexplate | 16950 |
| 7 | Combattant (jungle) | Jungle | Alternative (sans Kraken Slayer) | Mercury's Treads → Bloodthirster → Death's Dance → Stridebreaker → Experimental Hexplate → Sterak's Gage | 17450 |
| 8 | Combattant (jungle) | Jungle | Alternative (sans Death's Dance) | Mercury's Treads → Stridebreaker → Kraken Slayer → Experimental Hexplate → Sterak's Gage → Bloodthirster | 17150 |
| 9 | Combattant (jungle) | Jungle | Alternative (sans Stridebreaker) | Mercury's Treads → Bloodthirster → Death's Dance → Kraken Slayer → Experimental Hexplate → Sterak's Gage | 17150 |
| 10 | Combattant (jungle) | Jungle | Alternative (sans Experimental Hexplate) | Mercury's Treads → Bloodthirster → Death's Dance → Stridebreaker → Kraken Slayer → Sterak's Gage | 17450 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Randuin's Omen** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Wit's End** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Blade of the Ruined King** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Bloodthirster** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Viktor

- **Rôles** : Mid · dégâts magiques · mana · distance
- **Kit** : dégâts de zone, sorts fréquents (accélération rentable), gros besoin de mana, burst, dégâts sur la durée.
- **Répartition des 10 builds** : Dégâts AP burst (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP burst | Mid | Standard | Sorcerer's Shoes → Luden's Companion → Horizon Focus → Rabadon's Deathcap → Void Staff → Malignance | 15800 |
| 2 | Dégâts AP burst | Mid | Contre tanks | Ionian Boots of Lucidity → Malignance → Horizon Focus → Rabadon's Deathcap → Void Staff → Blackfire Torch | 15650 |
| 3 | Dégâts AP burst | Mid | Contre AD / assassins | Plated Steelcaps → Malignance → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Horizon Focus | 16400 |
| 4 | Dégâts AP burst | Mid | Contre AP | Mercury's Treads → Malignance → Banshee's Veil → Rabadon's Deathcap → Void Staff → Horizon Focus | 16200 |
| 5 | Dégâts AP burst | Mid | Boule de neige | Sorcerer's Shoes → Shadowflame → Stormsurge → Rabadon's Deathcap → Void Staff → Luden's Companion | 16350 |
| 6 | Dégâts AP burst | Mid | Partie longue | Sorcerer's Shoes → Archangel's Staff → Malignance → Rabadon's Deathcap → Void Staff → Horizon Focus | 15950 |
| 7 | Dégâts AP burst | Mid | Poke | Ionian Boots of Lucidity → Luden's Companion → Horizon Focus → Rabadon's Deathcap → Void Staff → Malignance | 15600 |
| 8 | Dégâts AP burst | Mid | Anti-soins | Sorcerer's Shoes → Malignance → Morellonomicon → Rabadon's Deathcap → Void Staff → Horizon Focus | 15900 |
| 9 | Dégâts AP burst | Mid | Alternative (sans Luden's Companion) | Sorcerer's Shoes → Shadowflame → Horizon Focus → Rabadon's Deathcap → Void Staff → Malignance | 16250 |
| 10 | Dégâts AP burst | Mid | Alternative (sans Horizon Focus) | Sorcerer's Shoes → Malignance → Rabadon's Deathcap → Void Staff → Luden's Companion → Shadowflame | 16250 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Blackfire Torch** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Shadowflame** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Vladimir

- **Rôles** : Mid, Top · dégâts magiques · sans mana · distance
- **Kit** : dégâts de zone, soins sur soi, sorts qui montent avec les PV, sorts fréquents (accélération rentable), dégâts sur la durée.
- **Répartition des 10 builds** : Dégâts AP continu (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP continu | Mid, Top | Standard | Sorcerer's Shoes → Shadowflame → Horizon Focus → Rabadon's Deathcap → Void Staff → Riftmaker | 16650 |
| 2 | Dégâts AP continu | Mid, Top | Contre tanks | Ionian Boots of Lucidity → Riftmaker → Liandry's Torment → Rabadon's Deathcap → Void Staff → Horizon Focus | 16250 |
| 3 | Dégâts AP continu | Mid, Top | Contre AD / assassins | Plated Steelcaps → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Randuin's Omen → Thornmail | 16100 |
| 4 | Dégâts AP continu | Mid, Top | Contre AP | Mercury's Treads → Riftmaker → Banshee's Veil → Rabadon's Deathcap → Void Staff → Horizon Focus | 16600 |
| 5 | Dégâts AP continu | Mid, Top | Accélération | Ionian Boots of Lucidity → Riftmaker → Horizon Focus → Rabadon's Deathcap → Void Staff → Cosmic Drive | 16250 |
| 6 | Dégâts AP continu | Mid, Top | Anti-soins | Sorcerer's Shoes → Morellonomicon → Rabadon's Deathcap → Void Staff → Horizon Focus → Riftmaker | 16300 |
| 7 | Dégâts AP continu | Mid, Top | Alternative (sans Shadowflame) | Sorcerer's Shoes → Riftmaker → Horizon Focus → Rabadon's Deathcap → Void Staff → Liandry's Torment | 16450 |
| 8 | Dégâts AP continu | Mid, Top | Alternative (sans Horizon Focus) | Sorcerer's Shoes → Shadowflame → Riftmaker → Rabadon's Deathcap → Void Staff → Liandry's Torment | 16900 |
| 9 | Dégâts AP continu | Mid, Top | Alternative (sans Rabadon's Deathcap) | Sorcerer's Shoes → Shadowflame → Horizon Focus → Riftmaker → Void Staff → Liandry's Torment | 16150 |
| 10 | Dégâts AP continu | Mid, Top | Alternative (sans Void Staff) | Sorcerer's Shoes → Cryptbloom → Horizon Focus → Rabadon's Deathcap → Riftmaker → Shadowflame | 16650 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Liandry's Torment** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Stormsurge** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Volibear

- **Rôles** : Top, Jungle · dégâts mixtes · mana · mêlée
- **Kit** : sorts qui montent avec les PV, dépend des attaques de base, soins sur soi, engage et contrôles, très mobile.
- **Répartition des 10 builds** : Combattant (6), Combattant (jungle) (4)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant | Top | Standard | Mercury's Treads → Stridebreaker → Heartsteel → Experimental Hexplate → Sterak's Gage → Overlord's Bloodmail | 17050 |
| 2 | Combattant | Top | Contre AD / assassins | Plated Steelcaps → Death's Dance → Randuin's Omen → Heartsteel → Frozen Heart → Sterak's Gage | 15900 |
| 3 | Combattant | Top | Contre AP | Mercury's Treads → Stridebreaker → Heartsteel → Kaenic Rookern → Jak'Sho, The Protean → Spirit Visage | 16350 |
| 4 | Combattant | Top | Contre tanks | Mercury's Treads → Experimental Hexplate → Heartsteel → Titanic Hydra → Sterak's Gage → Overlord's Bloodmail | 17050 |
| 5 | Combattant | Top | Sustain | Mercury's Treads → Sundered Sky → Heartsteel → Sterak's Gage → Spirit Visage → Death's Dance | 16550 |
| 6 | Combattant | Top | Anti-soins | Mercury's Treads → Chempunk Chainsword → Heartsteel → Stridebreaker → Experimental Hexplate → Sterak's Gage | 16850 |
| 7 | Combattant (jungle) | Jungle | Alternative (sans Heartsteel) | Mercury's Treads → Stridebreaker → Experimental Hexplate → Sterak's Gage → Overlord's Bloodmail → Jak'Sho, The Protean | 17250 |
| 8 | Combattant (jungle) | Jungle | Alternative (sans Experimental Hexplate) | Mercury's Treads → Stridebreaker → Heartsteel → Sterak's Gage → Overlord's Bloodmail → Jak'Sho, The Protean | 17250 |
| 9 | Combattant (jungle) | Jungle | Alternative (sans Sterak's Gage) | Mercury's Treads → Stridebreaker → Heartsteel → Experimental Hexplate → Overlord's Bloodmail → Jak'Sho, The Protean | 17050 |
| 10 | Combattant (jungle) | Jungle | Alternative (sans Stridebreaker, Heartsteel) | Mercury's Treads → Titanic Hydra → Experimental Hexplate → Sterak's Gage → Overlord's Bloodmail → Jak'Sho, The Protean | 17250 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Randuin's Omen** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Jak'Sho, The Protean** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Jak'Sho, The Protean** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Warwick

- **Rôles** : Jungle, Top · dégâts physiques · mana · mêlée
- **Kit** : dépend des attaques de base, soins sur soi, effets à l'impact, dégâts sur la durée, engage et contrôles.
- **Répartition des 10 builds** : Dégâts à l'impact (2), Combattant (3), Combattant (jungle) (5)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts à l'impact | Top | Standard | Berserker's Greaves → Kraken Slayer → Blade of the Ruined King → Experimental Hexplate → Guinsoo's Rageblade → Stridebreaker | 16600 |
| 2 | Dégâts à l'impact | Top | Contre tanks | Berserker's Greaves → Blade of the Ruined King → Kraken Slayer → Guinsoo's Rageblade → Experimental Hexplate → Wit's End | 16100 |
| 3 | Combattant | Top | Standard | Mercury's Treads → Stridebreaker → Experimental Hexplate → Death's Dance → Wit's End → Sterak's Gage | 16850 |
| 4 | Combattant | Top | Contre AD / assassins | Plated Steelcaps → Stridebreaker → Randuin's Omen → Death's Dance → Frozen Heart → Sterak's Gage | 16200 |
| 5 | Combattant | Top | Contre AP | Mercury's Treads → Stridebreaker → Kaenic Rookern → Wit's End → Spirit Visage → Experimental Hexplate | 15950 |
| 6 | Combattant (jungle) | Jungle | Standard | Mercury's Treads → Stridebreaker → Experimental Hexplate → Death's Dance → Spirit Visage → Sundered Sky | 16650 |
| 7 | Combattant (jungle) | Jungle | Contre tanks | Mercury's Treads → Stridebreaker → Experimental Hexplate → Blade of the Ruined King → Death's Dance → Kraken Slayer | 17050 |
| 8 | Combattant (jungle) | Jungle | Sustain | Mercury's Treads → Stridebreaker → Spirit Visage → Sundered Sky → Death's Dance → Sterak's Gage | 16850 |
| 9 | Combattant (jungle) | Jungle | Anti-soins | Mercury's Treads → Chempunk Chainsword → Stridebreaker → Experimental Hexplate → Death's Dance → Spirit Visage | 16650 |
| 10 | Combattant (jungle) | Jungle | Alternative (sans Stridebreaker) | Mercury's Treads → Experimental Hexplate → Death's Dance → Spirit Visage → Sundered Sky → Wit's End | 16150 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Wit's End** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Wit's End** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Wit's End** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Wukong

- **Rôles** : Jungle, Top · dégâts physiques · mana · mêlée
- **Kit** : engage et contrôles, ultime décisif, sorts fréquents (accélération rentable), burst, dégâts de zone.
- **Répartition des 10 builds** : Dégâts AD (6), Dégâts AD (jungle) (4)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD | Top | Standard | Ionian Boots of Lucidity → Axiom Arc → Profane Hydra → Serylda's Grudge → Bloodthirster → Death's Dance | 16200 |
| 2 | Dégâts AD | Top | Contre tanks | Ionian Boots of Lucidity → Serylda's Grudge → Bloodthirster → Ravenous Hydra → Axiom Arc → Death's Dance | 16650 |
| 3 | Dégâts AD | Top | Contre AD / assassins | Plated Steelcaps → Bloodthirster → Guardian Angel → Death's Dance → Axiom Arc → Profane Hydra | 16700 |
| 4 | Dégâts AD | Top | Contre AP | Mercury's Treads → Edge of Night → Maw of Malmortius → Axiom Arc → Profane Hydra → Serylda's Grudge | 15950 |
| 5 | Dégâts AD (jungle) | Jungle | Boule de neige | Ionian Boots of Lucidity → Profane Hydra → Hubris → Axiom Arc → Opportunity → Serylda's Grudge | 15200 |
| 6 | Dégâts AD (jungle) | Jungle | Accélération | Ionian Boots of Lucidity → Axiom Arc → Profane Hydra → Serylda's Grudge → Spear of Shojin → Death's Dance | 15900 |
| 7 | Dégâts AD (jungle) | Jungle | Anti-soins | Ionian Boots of Lucidity → Profane Hydra → Axiom Arc → Mortal Reminder → Bloodthirster → Death's Dance | 16500 |
| 8 | Dégâts AD (jungle) | Jungle | Alternative (sans Axiom Arc) | Ionian Boots of Lucidity → Profane Hydra → Serylda's Grudge → Bloodthirster → Death's Dance → Eclipse | 16350 |
| 9 | Dégâts AD | Top | Alternative (sans Serylda's Grudge) | Ionian Boots of Lucidity → Axiom Arc → Profane Hydra → Bloodthirster → Death's Dance → Eclipse | 16100 |
| 10 | Dégâts AD | Top | Alternative (sans Bloodthirster) | Ionian Boots of Lucidity → Axiom Arc → Profane Hydra → Serylda's Grudge → Death's Dance → Eclipse | 15700 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Maw of Malmortius** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Hubris** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Xayah

- **Rôles** : ADC · dégâts physiques · mana · distance
- **Kit** : dépend des attaques de base, synergie coup critique, dégâts de zone.
- **Répartition des 10 builds** : Dégâts AD critique (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD critique | ADC | Standard | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Kraken Slayer → Bloodthirster | 17050 |
| 2 | Dégâts AD critique | ADC | Contre AD / assassins | Plated Steelcaps → Yun Tal Wildarrows → Guardian Angel → Death's Dance → Infinity Edge → Lord Dominik's Regards | 17250 |
| 3 | Dégâts AD critique | ADC | Contre AP | Berserker's Greaves → Yun Tal Wildarrows → Mercurial Scimitar → Infinity Edge → Lord Dominik's Regards → Kraken Slayer | 16850 |
| 4 | Dégâts AD critique | ADC | Boule de neige | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Kraken Slayer → The Collector | 16650 |
| 5 | Dégâts AD critique | ADC | Anti-soins | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Mortal Reminder → Kraken Slayer → Bloodthirster | 17250 |
| 6 | Dégâts AD critique | ADC | Alternative (sans Yun Tal Wildarrows) | Berserker's Greaves → Essence Reaver → Infinity Edge → Kraken Slayer → Lord Dominik's Regards → Bloodthirster | 16950 |
| 7 | Dégâts AD critique | ADC | Alternative (sans Infinity Edge) | Berserker's Greaves → Yun Tal Wildarrows → Kraken Slayer → Lord Dominik's Regards → Bloodthirster → Essence Reaver | 16500 |
| 8 | Dégâts AD critique | ADC | Alternative (sans Kraken Slayer) | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Bloodthirster → Essence Reaver | 16950 |
| 9 | Dégâts AD critique | ADC | Alternative (sans Yun Tal Wildarrows, Infinity Edge) | Berserker's Greaves → Kraken Slayer → Bloodthirster → Lord Dominik's Regards → Essence Reaver → Statikk Shiv | 16200 |
| 10 | Dégâts AD critique | ADC | Alternative (sans Infinity Edge, Lord Dominik's Regards) | Berserker's Greaves → Yun Tal Wildarrows → Kraken Slayer → Mortal Reminder → Bloodthirster → Essence Reaver | 16700 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Guardian Angel (AD) / Maw of Malmortius ou Mercurial Scimitar (AP).
- **Tank** feed / 2 tanks ou plus : **Blade of the Ruined King** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Mortal Reminder** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Mercurial Scimitar.
- **En avance** : finir l'objet offensif principal, puis **The Collector** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Xerath

- **Rôles** : Mid, Support · dégâts magiques · mana · distance
- **Kit** : gros besoin de mana, poke à longue portée, sorts fréquents (accélération rentable), burst.
- **Répartition des 10 builds** : Dégâts AP burst (6), Support dégâts AP burst (4)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP burst | Mid | Standard | Sorcerer's Shoes → Archangel's Staff → Luden's Companion → Horizon Focus → Rabadon's Deathcap → Void Staff | 16000 |
| 2 | Dégâts AP burst | Mid | Contre tanks | Ionian Boots of Lucidity → Archangel's Staff → Luden's Companion → Horizon Focus → Rabadon's Deathcap → Void Staff | 15800 |
| 3 | Dégâts AP burst | Mid | Contre AD / assassins | Plated Steelcaps → Archangel's Staff → Zhonya's Hourglass → Horizon Focus → Rabadon's Deathcap → Void Staff | 16600 |
| 4 | Dégâts AP burst | Mid | Contre AP | Mercury's Treads → Archangel's Staff → Banshee's Veil → Horizon Focus → Rabadon's Deathcap → Void Staff | 16400 |
| 5 | Dégâts AP burst | Mid | Boule de neige | Sorcerer's Shoes → Luden's Companion → Shadowflame → Rabadon's Deathcap → Stormsurge → Horizon Focus | 16100 |
| 6 | Dégâts AP burst | Mid | Anti-soins | Sorcerer's Shoes → Archangel's Staff → Morellonomicon → Horizon Focus → Rabadon's Deathcap → Void Staff | 16100 |
| 7 | Support dégâts AP burst | Support | Standard | Zaz'Zak's Realmspike → Sorcerer's Shoes → Archangel's Staff → Luden's Companion → Horizon Focus → Rabadon's Deathcap | 13000 |
| 8 | Support dégâts AP burst | Support | Contre AD / assassins | Zaz'Zak's Realmspike → Plated Steelcaps → Luden's Companion → Zhonya's Hourglass → Horizon Focus → Rabadon's Deathcap | 13450 |
| 9 | Support dégâts AP burst | Support | Contre AP | Zaz'Zak's Realmspike → Mercury's Treads → Luden's Companion → Banshee's Veil → Horizon Focus → Rabadon's Deathcap | 13250 |
| 10 | Support dégâts AP burst | Support | Boule de neige | Zaz'Zak's Realmspike → Sorcerer's Shoes → Luden's Companion → Horizon Focus → Rabadon's Deathcap → Stormsurge | 12900 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Malignance** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Shadowflame** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Xin Zhao

- **Rôles** : Jungle · dégâts physiques · mana · mêlée
- **Kit** : dépend des attaques de base, très mobile, dégâts sur la durée, soins sur soi, ultime décisif.
- **Répartition des 10 builds** : Combattant (jungle) (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant (jungle) | Jungle | Standard | Mercury's Treads → Stridebreaker → Death's Dance → Experimental Hexplate → Sterak's Gage → Kraken Slayer | 17050 |
| 2 | Combattant (jungle) | Jungle | Contre AD / assassins | Plated Steelcaps → Stridebreaker → Death's Dance → Randuin's Omen → Guardian Angel → Sterak's Gage | 16900 |
| 3 | Combattant (jungle) | Jungle | Contre AP | Mercury's Treads → Stridebreaker → Death's Dance → Kaenic Rookern → Maw of Malmortius → Spirit Visage | 16550 |
| 4 | Combattant (jungle) | Jungle | Contre tanks | Mercury's Treads → Stridebreaker → Death's Dance → Serylda's Grudge → Experimental Hexplate → Kraken Slayer | 16850 |
| 5 | Combattant (jungle) | Jungle | Sustain | Mercury's Treads → Bloodthirster → Death's Dance → Sundered Sky → Stridebreaker → Sterak's Gage | 17550 |
| 6 | Combattant (jungle) | Jungle | Anti-soins | Mercury's Treads → Chempunk Chainsword → Stridebreaker → Death's Dance → Experimental Hexplate → Sterak's Gage | 17150 |
| 7 | Combattant (jungle) | Jungle | Alternative (sans Stridebreaker) | Mercury's Treads → Kraken Slayer → Death's Dance → Experimental Hexplate → Sterak's Gage → Sundered Sky | 16850 |
| 8 | Combattant (jungle) | Jungle | Alternative (sans Death's Dance) | Mercury's Treads → Stridebreaker → Experimental Hexplate → Sterak's Gage → Kraken Slayer → Sundered Sky | 16850 |
| 9 | Combattant (jungle) | Jungle | Alternative (sans Experimental Hexplate) | Mercury's Treads → Stridebreaker → Death's Dance → Sterak's Gage → Kraken Slayer → Sundered Sky | 17150 |
| 10 | Combattant (jungle) | Jungle | Alternative (sans Sterak's Gage) | Mercury's Treads → Stridebreaker → Death's Dance → Experimental Hexplate → Kraken Slayer → Sundered Sky | 16950 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Randuin's Omen** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Serylda's Grudge** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Bloodthirster** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Yasuo

- **Rôles** : Mid, Top, ADC · dégâts physiques · sans mana · mêlée
- **Kit** : dépend des attaques de base, synergie coup critique, très mobile, dégâts de zone, ultime décisif.
- **Répartition des 10 builds** : Dégâts AD critique (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD critique | Mid, Top, ADC | Standard | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Kraken Slayer → Bloodthirster | 17050 |
| 2 | Dégâts AD critique | Mid, Top, ADC | Contre AD / assassins | Plated Steelcaps → Yun Tal Wildarrows → Guardian Angel → Death's Dance → Bloodthirster → Infinity Edge | 17550 |
| 3 | Dégâts AD critique | Mid, Top, ADC | Contre AP | Mercury's Treads → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Kraken Slayer → Maw of Malmortius | 16900 |
| 4 | Dégâts AD critique | Mid, Top, ADC | Boule de neige | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Kraken Slayer → The Collector | 16650 |
| 5 | Dégâts AD critique | Mid, Top, ADC | Sustain | Berserker's Greaves → Bloodthirster → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Ravenous Hydra | 17350 |
| 6 | Dégâts AD critique | Mid, Top, ADC | Anti-soins | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Mortal Reminder → Kraken Slayer → Bloodthirster | 17250 |
| 7 | Dégâts AD critique | Mid, Top, ADC | Alternative (sans Yun Tal Wildarrows) | Berserker's Greaves → Bloodthirster → Infinity Edge → Kraken Slayer → Lord Dominik's Regards → Ravenous Hydra | 17350 |
| 8 | Dégâts AD critique | Mid, Top, ADC | Alternative (sans Infinity Edge) | Berserker's Greaves → Yun Tal Wildarrows → Kraken Slayer → Lord Dominik's Regards → Bloodthirster → Ravenous Hydra | 16900 |
| 9 | Dégâts AD critique | Mid, Top, ADC | Alternative (sans Yun Tal Wildarrows, Infinity Edge) | Berserker's Greaves → Kraken Slayer → Bloodthirster → Lord Dominik's Regards → Ravenous Hydra → Statikk Shiv | 16600 |
| 10 | Dégâts AD critique | Mid, Top, ADC | Alternative (sans Infinity Edge, Lord Dominik's Regards) | Berserker's Greaves → Yun Tal Wildarrows → Kraken Slayer → Mortal Reminder → Bloodthirster → Ravenous Hydra | 17100 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Blade of the Ruined King** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **The Collector** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Yone

- **Rôles** : Mid, Top · dégâts mixtes · sans mana · mêlée
- **Kit** : dépend des attaques de base, synergie coup critique, très mobile, burst, dégâts de zone.
- **Répartition des 10 builds** : Dégâts AD critique (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD critique | Mid, Top | Standard | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Kraken Slayer → Bloodthirster | 17050 |
| 2 | Dégâts AD critique | Mid, Top | Contre AD / assassins | Plated Steelcaps → Yun Tal Wildarrows → Guardian Angel → Death's Dance → Bloodthirster → Infinity Edge | 17550 |
| 3 | Dégâts AD critique | Mid, Top | Contre AP | Mercury's Treads → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Edge of Night → Kraken Slayer | 16800 |
| 4 | Dégâts AD critique | Mid, Top | Boule de neige | Berserker's Greaves → The Collector → Infinity Edge → Yun Tal Wildarrows → Lord Dominik's Regards → Kraken Slayer | 16650 |
| 5 | Dégâts AD critique | Mid, Top | Sustain | Berserker's Greaves → Bloodthirster → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Ravenous Hydra | 17350 |
| 6 | Dégâts AD critique | Mid, Top | Anti-soins | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Mortal Reminder → Kraken Slayer → Bloodthirster | 17250 |
| 7 | Dégâts AD critique | Mid, Top | Alternative (sans Yun Tal Wildarrows) | Berserker's Greaves → Bloodthirster → Infinity Edge → Kraken Slayer → Lord Dominik's Regards → Ravenous Hydra | 17350 |
| 8 | Dégâts AD critique | Mid, Top | Alternative (sans Infinity Edge) | Berserker's Greaves → Yun Tal Wildarrows → Kraken Slayer → Lord Dominik's Regards → Bloodthirster → Ravenous Hydra | 16900 |
| 9 | Dégâts AD critique | Mid, Top | Alternative (sans Yun Tal Wildarrows, Infinity Edge) | Berserker's Greaves → Kraken Slayer → Bloodthirster → Lord Dominik's Regards → Ravenous Hydra → Statikk Shiv | 16600 |
| 10 | Dégâts AD critique | Mid, Top | Alternative (sans Infinity Edge, Lord Dominik's Regards) | Berserker's Greaves → Yun Tal Wildarrows → Kraken Slayer → Mortal Reminder → Bloodthirster → Ravenous Hydra | 17100 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Blade of the Ruined King** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **The Collector** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Yorick

- **Rôles** : Top · dégâts physiques · mana · mêlée
- **Kit** : dépend des attaques de base, sorts fréquents (accélération rentable), dégâts sur la durée, ultime décisif, naturellement résistant.
- **Répartition des 10 builds** : Combattant (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant | Top | Standard | Mercury's Treads → Stridebreaker → Death's Dance → Spear of Shojin → Experimental Hexplate → Sterak's Gage | 17150 |
| 2 | Combattant | Top | Contre AD / assassins | Plated Steelcaps → Spear of Shojin → Death's Dance → Randuin's Omen → Frozen Heart → Sterak's Gage | 16000 |
| 3 | Combattant | Top | Contre AP | Mercury's Treads → Spear of Shojin → Maw of Malmortius → Kaenic Rookern → Death's Dance → Jak'Sho, The Protean | 16850 |
| 4 | Combattant | Top | Contre tanks | Mercury's Treads → Serylda's Grudge → Death's Dance → Spear of Shojin → Stridebreaker → Experimental Hexplate | 16950 |
| 5 | Combattant | Top | Sustain | Mercury's Treads → Bloodthirster → Death's Dance → Sterak's Gage → Sundered Sky → Spear of Shojin | 17350 |
| 6 | Combattant | Top | Split push | Mercury's Treads → Hullbreaker → Death's Dance → Spear of Shojin → Stridebreaker → Experimental Hexplate | 16950 |
| 7 | Combattant | Top | Accélération | Mercury's Treads → Spear of Shojin → Death's Dance → Black Cleaver → Maw of Malmortius → Experimental Hexplate | 16750 |
| 8 | Combattant | Top | Anti-soins | Mercury's Treads → Chempunk Chainsword → Death's Dance → Spear of Shojin → Stridebreaker → Experimental Hexplate | 17050 |
| 9 | Combattant | Top | Alternative (sans Stridebreaker) | Mercury's Treads → Experimental Hexplate → Death's Dance → Spear of Shojin → Sterak's Gage → Black Cleaver | 16850 |
| 10 | Combattant | Top | Alternative (sans Death's Dance) | Mercury's Treads → Spear of Shojin → Stridebreaker → Experimental Hexplate → Sterak's Gage → Black Cleaver | 16850 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Randuin's Omen** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Serylda's Grudge** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Black Cleaver** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Yunara

- **Rôles** : ADC · dégâts physiques · mana · distance
- **Kit** : dépend des attaques de base, synergie coup critique, effets à l'impact, dégâts de zone, très mobile.
- **Répartition des 10 builds** : Dégâts à l'impact (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts à l'impact | ADC | Standard | Berserker's Greaves → Yun Tal Wildarrows → Kraken Slayer → Infinity Edge → Lord Dominik's Regards → Phantom Dancer | 16300 |
| 2 | Dégâts à l'impact | ADC | Contre tanks | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Kraken Slayer → Lord Dominik's Regards → Blade of the Ruined King | 16850 |
| 3 | Dégâts à l'impact | ADC | Contre AD / assassins | Plated Steelcaps → Yun Tal Wildarrows → Guardian Angel → Death's Dance → Kraken Slayer → Infinity Edge | 17150 |
| 4 | Dégâts à l'impact | ADC | Contre AP | Berserker's Greaves → Yun Tal Wildarrows → Mercurial Scimitar → Kraken Slayer → Infinity Edge → Lord Dominik's Regards | 16850 |
| 5 | Dégâts à l'impact | ADC | Sustain | Berserker's Greaves → Yun Tal Wildarrows → Kraken Slayer → Bloodthirster → Infinity Edge → Lord Dominik's Regards | 17050 |
| 6 | Dégâts à l'impact | ADC | Anti-soins | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Mortal Reminder → Kraken Slayer → Phantom Dancer | 16500 |
| 7 | Dégâts à l'impact | ADC | Alternative (sans Yun Tal Wildarrows) | Berserker's Greaves → Kraken Slayer → Infinity Edge → Lord Dominik's Regards → Phantom Dancer → Blade of the Ruined King | 16500 |
| 8 | Dégâts à l'impact | ADC | Alternative (sans Kraken Slayer) | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Phantom Dancer → Blade of the Ruined King | 16500 |
| 9 | Dégâts à l'impact | ADC | Alternative (sans Infinity Edge) | Berserker's Greaves → Yun Tal Wildarrows → Kraken Slayer → Lord Dominik's Regards → Phantom Dancer → Bloodthirster | 16250 |
| 10 | Dégâts à l'impact | ADC | Alternative (sans Yun Tal Wildarrows, Kraken Slayer) | Berserker's Greaves → Bloodthirster → Infinity Edge → Phantom Dancer → Lord Dominik's Regards → Blade of the Ruined King | 16900 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Guardian Angel (AD) / Maw of Malmortius ou Mercurial Scimitar (AP).
- **Tank** feed / 2 tanks ou plus : **Blade of the Ruined King** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Mortal Reminder** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Mercurial Scimitar.
- **En avance** : finir l'objet offensif principal, puis **The Collector** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Yuumi

- **Rôles** : Support · dégâts magiques · mana · distance
- **Kit** : soins / boucliers aux alliés, sorts fréquents (accélération rentable), gros besoin de mana.
- **Répartition des 10 builds** : Support enchanteur (7), Support dégâts AP burst (3)
- **Particularité** : Attachée à un allié : bottes de lucidité ioniennes ou Mercure ; jamais d'objet de mêlée.

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Support enchanteur | Support | Standard | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Ardent Censer → Dawncore → Staff of Flowing Water | 10150 |
| 2 | Support enchanteur | Support | Contre AD / assassins | Celestial Opposition → Plated Steelcaps → Frozen Heart → Mikael's Blessing → Ardent Censer → Locket of the Iron Solari | 10400 |
| 3 | Support enchanteur | Support | Accélération | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Staff of Flowing Water → Redemption → Ardent Censer | 9950 |
| 4 | Support enchanteur | Support | Anti-soins | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Ardent Censer → Morellonomicon → Dawncore | 10750 |
| 5 | Support enchanteur | Support | Contre AP | Celestial Opposition → Mercury's Treads → Mikael's Blessing → Ardent Censer → Locket of the Iron Solari → Dawncore | 10450 |
| 6 | Support dégâts AP burst | Support | Standard | Zaz'Zak's Realmspike → Ionian Boots of Lucidity → Archangel's Staff → Rabadon's Deathcap → Void Staff → Horizon Focus | 13050 |
| 7 | Support dégâts AP burst | Support | Contre AD / assassins | Zaz'Zak's Realmspike → Plated Steelcaps → Archangel's Staff → Zhonya's Hourglass → Thornmail → Randuin's Omen | 12500 |
| 8 | Support dégâts AP burst | Support | Contre AP | Zaz'Zak's Realmspike → Mercury's Treads → Archangel's Staff → Banshee's Veil → Kaenic Rookern → Vigilant Wardstone | 12350 |
| 9 | Support enchanteur | Support | Alternative (sans Mikael's Blessing) | Dream Maker → Ionian Boots of Lucidity → Ardent Censer → Dawncore → Staff of Flowing Water → Redemption | 10150 |
| 10 | Support enchanteur | Support | Alternative (sans Ardent Censer) | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Dawncore → Staff of Flowing Water → Redemption | 10250 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Frozen Heart** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Abyssal Mask** en objet suivant.
- **Assassin** feed qui vous cible : protéger le carry visé (Knight's Vow, Locket of the Iron Solari) ; pour vous : Frozen Heart.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : poser plus de balises de contrôle, jouer pour les objectifs ; objet d'équipe suivant : **Locket of the Iron Solari**.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Frozen Heart**.

### Zaahen

- **Rôles** : Top, Jungle · dégâts physiques · mana · mêlée
- **Kit** : soins sur soi, très mobile, dépend des attaques de base, sorts fréquents (accélération rentable), dégâts sur la durée.
- **Répartition des 10 builds** : Combattant (7), Combattant (jungle) (3)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant | Top | Standard | Mercury's Treads → Stridebreaker → Death's Dance → Spear of Shojin → Experimental Hexplate → Sundered Sky | 17050 |
| 2 | Combattant | Top | Contre AD / assassins | Plated Steelcaps → Spear of Shojin → Death's Dance → Randuin's Omen → Frozen Heart → Sterak's Gage | 16000 |
| 3 | Combattant | Top | Contre AP | Mercury's Treads → Spear of Shojin → Death's Dance → Maw of Malmortius → Spirit Visage → Kaenic Rookern | 16350 |
| 4 | Combattant | Top | Contre tanks | Mercury's Treads → Serylda's Grudge → Death's Dance → Spear of Shojin → Stridebreaker → Experimental Hexplate | 16950 |
| 5 | Combattant | Top | Sustain | Mercury's Treads → Bloodthirster → Death's Dance → Sundered Sky → Spirit Visage → Sterak's Gage | 16950 |
| 6 | Combattant | Top | Accélération | Mercury's Treads → Experimental Hexplate → Death's Dance → Spear of Shojin → Black Cleaver → Maw of Malmortius | 16750 |
| 7 | Combattant | Top | Anti-soins | Mercury's Treads → Chempunk Chainsword → Death's Dance → Spear of Shojin → Stridebreaker → Experimental Hexplate | 17050 |
| 8 | Combattant (jungle) | Jungle | Contre AD / assassins | Plated Steelcaps → Stridebreaker → Death's Dance → Randuin's Omen → Frozen Heart → Sterak's Gage | 16200 |
| 9 | Combattant (jungle) | Jungle | Contre AP | Mercury's Treads → Stridebreaker → Spirit Visage → Death's Dance → Maw of Malmortius → Kaenic Rookern | 16550 |
| 10 | Combattant (jungle) | Jungle | Contre tanks | Mercury's Treads → Serylda's Grudge → Death's Dance → Stridebreaker → Sundered Sky → Spear of Shojin | 17050 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Randuin's Omen** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Serylda's Grudge** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Sterak's Gage** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Zac

- **Rôles** : Jungle, Top, Support · dégâts magiques · sans mana · mêlée
- **Kit** : sorts qui montent avec les PV, engage et contrôles, très mobile, naturellement résistant, sorts fréquents (accélération rentable).
- **Répartition des 10 builds** : Combattant (3), Tank (2), Tank (jungle) (3), Support engage (2)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Combattant | Top | Standard | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Unending Despair → Abyssal Mask | 16000 |
| 2 | Combattant | Top | Contre AD / assassins | Plated Steelcaps → Heartsteel → Randuin's Omen → Warmog's Armor → Jak'Sho, The Protean → Thornmail | 15650 |
| 3 | Combattant | Top | Contre AP | Mercury's Treads → Heartsteel → Kaenic Rookern → Warmog's Armor → Jak'Sho, The Protean → Spirit Visage | 16150 |
| 4 | Tank | Top | Standard | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Unending Despair → Randuin's Omen | 16050 |
| 5 | Tank | Top | Contre AP | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Kaenic Rookern → Unending Despair | 16250 |
| 6 | Tank (jungle) | Jungle | Standard | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Unending Despair → Sunfire Aegis | 16050 |
| 7 | Tank (jungle) | Jungle | Engagement | Mercury's Treads → Heartsteel → Jak'Sho, The Protean → Warmog's Armor → Dead Man's Plate → Unending Despair | 16250 |
| 8 | Tank (jungle) | Jungle | Anti-soins | Mercury's Treads → Heartsteel → Thornmail → Jak'Sho, The Protean → Warmog's Armor → Unending Despair | 15800 |
| 9 | Support engage | Support | Standard | Celestial Opposition → Mercury's Treads → Heartsteel → Zeke's Convergence → Warmog's Armor → Locket of the Iron Solari | 11750 |
| 10 | Support engage | Support | Engagement | Solstice Sleigh → Mercury's Treads → Zeke's Convergence → Heartsteel → Warmog's Armor → Locket of the Iron Solari | 11750 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Randuin's Omen** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Kaenic Rookern** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Randuin's Omen** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Randuin's Omen** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Zed

- **Rôles** : Mid, Jungle · dégâts physiques · énergie · mêlée
- **Kit** : sorts fréquents (accélération rentable), burst, très mobile, ultime décisif.
- **Répartition des 10 builds** : Dégâts AD létalité (7), Dégâts AD létalité (jungle) (3)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD létalité | Mid | Standard | Ionian Boots of Lucidity → Axiom Arc → Profane Hydra → Serylda's Grudge → Voltaic Cyclosword → Bloodthirster | 15900 |
| 2 | Dégâts AD létalité | Mid | Contre tanks | Ionian Boots of Lucidity → Serylda's Grudge → Axiom Arc → Bloodthirster → Death's Dance → Spear of Shojin | 16450 |
| 3 | Dégâts AD létalité | Mid | Contre AD / assassins | Plated Steelcaps → Bloodthirster → Death's Dance → Guardian Angel → Axiom Arc → Eclipse | 16750 |
| 4 | Dégâts AD létalité | Mid | Contre AP | Mercury's Treads → Edge of Night → Maw of Malmortius → Axiom Arc → Profane Hydra → Serylda's Grudge | 15950 |
| 5 | Dégâts AD létalité | Mid | Boule de neige | Ionian Boots of Lucidity → Hubris → Axiom Arc → Opportunity → Profane Hydra → Voltaic Cyclosword | 15200 |
| 6 | Dégâts AD létalité | Mid | Accélération | Ionian Boots of Lucidity → Axiom Arc → Spear of Shojin → Serylda's Grudge → Profane Hydra → Voltaic Cyclosword | 15600 |
| 7 | Dégâts AD létalité | Mid | Anti-soins | Ionian Boots of Lucidity → Axiom Arc → Profane Hydra → Mortal Reminder → Voltaic Cyclosword → Bloodthirster | 16200 |
| 8 | Dégâts AD létalité (jungle) | Jungle | Contre tanks | Ionian Boots of Lucidity → Serylda's Grudge → Axiom Arc → Bloodthirster → Death's Dance → Ravenous Hydra | 16650 |
| 9 | Dégâts AD létalité (jungle) | Jungle | Contre AD / assassins | Plated Steelcaps → Bloodthirster → Death's Dance → Guardian Angel → Axiom Arc → Profane Hydra | 16700 |
| 10 | Dégâts AD létalité (jungle) | Jungle | Alternative (sans Serylda's Grudge) | Ionian Boots of Lucidity → Axiom Arc → Profane Hydra → Voltaic Cyclosword → Bloodthirster → Youmuu's Ghostblade | 15700 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Death's Dance** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Death's Dance (AD) / Maw of Malmortius ou Edge of Night (AP).
- **Tank** feed / 2 tanks ou plus : **Death's Dance** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Chempunk Chainsword** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Sterak's Gage.
- **En avance** : finir l'objet offensif principal, puis **Hubris** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Zeri

- **Rôles** : ADC · dégâts physiques · mana · distance
- **Kit** : dépend des attaques de base, synergie coup critique, très mobile, ultime décisif.
- **Répartition des 10 builds** : Dégâts AD critique (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AD critique | ADC | Standard | Berserker's Greaves → Yun Tal Wildarrows → Kraken Slayer → Infinity Edge → Lord Dominik's Regards → Bloodthirster | 17050 |
| 2 | Dégâts AD critique | ADC | Contre tanks | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Kraken Slayer → Lord Dominik's Regards → Blade of the Ruined King | 16850 |
| 3 | Dégâts AD critique | ADC | Contre AD / assassins | Plated Steelcaps → Yun Tal Wildarrows → Guardian Angel → Death's Dance → Kraken Slayer → Infinity Edge | 17150 |
| 4 | Dégâts AD critique | ADC | Contre AP | Berserker's Greaves → Yun Tal Wildarrows → Mercurial Scimitar → Kraken Slayer → Infinity Edge → Lord Dominik's Regards | 16850 |
| 5 | Dégâts AD critique | ADC | Boule de neige | Berserker's Greaves → Yun Tal Wildarrows → Kraken Slayer → Infinity Edge → Lord Dominik's Regards → The Collector | 16650 |
| 6 | Dégâts AD critique | ADC | Anti-soins | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Mortal Reminder → Kraken Slayer → Bloodthirster | 17250 |
| 7 | Dégâts AD critique | ADC | Alternative (sans Yun Tal Wildarrows) | Berserker's Greaves → Kraken Slayer → Infinity Edge → Lord Dominik's Regards → Bloodthirster → Phantom Dancer | 16700 |
| 8 | Dégâts AD critique | ADC | Alternative (sans Kraken Slayer) | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Bloodthirster → Phantom Dancer | 16700 |
| 9 | Dégâts AD critique | ADC | Alternative (sans Infinity Edge) | Berserker's Greaves → Yun Tal Wildarrows → Kraken Slayer → Lord Dominik's Regards → Bloodthirster → Phantom Dancer | 16250 |
| 10 | Dégâts AD critique | ADC | Alternative (sans Yun Tal Wildarrows, Kraken Slayer) | Berserker's Greaves → Essence Reaver → Infinity Edge → Bloodthirster → Lord Dominik's Regards → Phantom Dancer | 16600 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Guardian Angel** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Maw of Malmortius** en objet suivant.
- **Assassin** feed qui vous cible : Guardian Angel (AD) / Maw of Malmortius ou Mercurial Scimitar (AP).
- **Tank** feed / 2 tanks ou plus : **Blade of the Ruined King** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Mortal Reminder** (composant tôt).
- **Boucliers** adverses (Lulu, Janna, Karma, Sett…) : **Serpent's Fang**.
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads, Mercurial Scimitar.
- **En avance** : finir l'objet offensif principal, puis **The Collector** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Ziggs

- **Rôles** : Mid, ADC · dégâts magiques · mana · distance
- **Kit** : dégâts de zone, poke à longue portée, sorts fréquents (accélération rentable), gros besoin de mana, burst.
- **Répartition des 10 builds** : Dégâts AP burst (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP burst | Mid, ADC | Standard | Sorcerer's Shoes → Shadowflame → Horizon Focus → Rabadon's Deathcap → Void Staff → Luden's Companion | 16300 |
| 2 | Dégâts AP burst | Mid, ADC | Contre tanks | Ionian Boots of Lucidity → Archangel's Staff → Luden's Companion → Horizon Focus → Rabadon's Deathcap → Void Staff | 15800 |
| 3 | Dégâts AP burst | Mid, ADC | Contre AD / assassins | Plated Steelcaps → Luden's Companion → Zhonya's Hourglass → Horizon Focus → Rabadon's Deathcap → Void Staff | 16450 |
| 4 | Dégâts AP burst | Mid, ADC | Contre AP | Mercury's Treads → Luden's Companion → Banshee's Veil → Horizon Focus → Rabadon's Deathcap → Void Staff | 16250 |
| 5 | Dégâts AP burst | Mid, ADC | Boule de neige | Sorcerer's Shoes → Shadowflame → Stormsurge → Rabadon's Deathcap → Horizon Focus → Luden's Companion | 16100 |
| 6 | Dégâts AP burst | Mid, ADC | Partie longue | Sorcerer's Shoes → Archangel's Staff → Luden's Companion → Horizon Focus → Rabadon's Deathcap → Void Staff | 16000 |
| 7 | Dégâts AP burst | Mid, ADC | Poke | Ionian Boots of Lucidity → Shadowflame → Horizon Focus → Luden's Companion → Rabadon's Deathcap → Void Staff | 16100 |
| 8 | Dégâts AP burst | Mid, ADC | Anti-soins | Sorcerer's Shoes → Luden's Companion → Morellonomicon → Horizon Focus → Rabadon's Deathcap → Void Staff | 15950 |
| 9 | Dégâts AP burst | Mid, ADC | Alternative (sans Horizon Focus) | Sorcerer's Shoes → Archangel's Staff → Luden's Companion → Rabadon's Deathcap → Void Staff → Shadowflame | 16450 |
| 10 | Dégâts AP burst | Mid, ADC | Alternative (sans Rabadon's Deathcap) | Sorcerer's Shoes → Archangel's Staff → Luden's Companion → Horizon Focus → Void Staff → Shadowflame | 15700 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Archangel's Staff** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Stormsurge** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Zilean

- **Rôles** : Support, Mid · dégâts magiques · mana · distance
- **Kit** : sorts fréquents (accélération rentable), soins / boucliers aux alliés, ultime décisif, gros besoin de mana, engage et contrôles.
- **Répartition des 10 builds** : Dégâts AP burst (2), Support enchanteur (6), Support dégâts AP burst (2)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP burst | Mid | Standard | Ionian Boots of Lucidity → Archangel's Staff → Malignance → Rabadon's Deathcap → Void Staff → Horizon Focus | 15750 |
| 2 | Dégâts AP burst | Mid | Contre AD / assassins | Plated Steelcaps → Malignance → Zhonya's Hourglass → Rabadon's Deathcap → Guardian Angel → Randuin's Omen | 16550 |
| 3 | Support enchanteur | Support | Standard | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Ardent Censer → Staff of Flowing Water → Redemption | 9950 |
| 4 | Support enchanteur | Support | Contre AD / assassins | Celestial Opposition → Plated Steelcaps → Frozen Heart → Mikael's Blessing → Ardent Censer → Locket of the Iron Solari | 10400 |
| 5 | Support enchanteur | Support | Anti-soins | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Ardent Censer → Morellonomicon → Staff of Flowing Water | 10500 |
| 6 | Support enchanteur | Support | Contre AP | Celestial Opposition → Mercury's Treads → Mikael's Blessing → Ardent Censer → Locket of the Iron Solari → Staff of Flowing Water | 10200 |
| 7 | Support dégâts AP burst | Support | Standard | Zaz'Zak's Realmspike → Ionian Boots of Lucidity → Archangel's Staff → Malignance → Horizon Focus → Rabadon's Deathcap | 12750 |
| 8 | Support dégâts AP burst | Support | Contre AD / assassins | Zaz'Zak's Realmspike → Plated Steelcaps → Malignance → Zhonya's Hourglass → Thornmail → Randuin's Omen | 12300 |
| 9 | Support enchanteur | Support | Alternative (sans Mikael's Blessing) | Dream Maker → Ionian Boots of Lucidity → Ardent Censer → Staff of Flowing Water → Redemption → Dawncore | 10150 |
| 10 | Support enchanteur | Support | Alternative (sans Ardent Censer) | Dream Maker → Ionian Boots of Lucidity → Mikael's Blessing → Staff of Flowing Water → Redemption → Dawncore | 10250 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Luden's Companion** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Shadowflame** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Zoe

- **Rôles** : Mid · dégâts magiques · mana · distance
- **Kit** : burst, poke à longue portée, sorts fréquents (accélération rentable), gros besoin de mana, engage et contrôles.
- **Répartition des 10 builds** : Dégâts AP burst (10)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP burst | Mid | Standard | Sorcerer's Shoes → Shadowflame → Horizon Focus → Luden's Companion → Rabadon's Deathcap → Void Staff | 16300 |
| 2 | Dégâts AP burst | Mid | Contre tanks | Ionian Boots of Lucidity → Archangel's Staff → Luden's Companion → Horizon Focus → Rabadon's Deathcap → Void Staff | 15800 |
| 3 | Dégâts AP burst | Mid | Contre AD / assassins | Plated Steelcaps → Luden's Companion → Zhonya's Hourglass → Horizon Focus → Rabadon's Deathcap → Void Staff | 16450 |
| 4 | Dégâts AP burst | Mid | Contre AP | Mercury's Treads → Luden's Companion → Banshee's Veil → Horizon Focus → Rabadon's Deathcap → Void Staff | 16250 |
| 5 | Dégâts AP burst | Mid | Boule de neige | Sorcerer's Shoes → Shadowflame → Stormsurge → Rabadon's Deathcap → Luden's Companion → Horizon Focus | 16100 |
| 6 | Dégâts AP burst | Mid | Accélération | Ionian Boots of Lucidity → Shadowflame → Horizon Focus → Luden's Companion → Rabadon's Deathcap → Void Staff | 16100 |
| 7 | Dégâts AP burst | Mid | Anti-soins | Sorcerer's Shoes → Luden's Companion → Morellonomicon → Horizon Focus → Rabadon's Deathcap → Void Staff | 15950 |
| 8 | Dégâts AP burst | Mid | Alternative (sans Shadowflame) | Sorcerer's Shoes → Stormsurge → Horizon Focus → Luden's Companion → Rabadon's Deathcap → Void Staff | 15900 |
| 9 | Dégâts AP burst | Mid | Alternative (sans Horizon Focus) | Sorcerer's Shoes → Luden's Companion → Rabadon's Deathcap → Void Staff → Shadowflame → Stormsurge | 16350 |
| 10 | Dégâts AP burst | Mid | Alternative (sans Luden's Companion) | Sorcerer's Shoes → Shadowflame → Horizon Focus → Rabadon's Deathcap → Void Staff → Stormsurge | 16350 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Archangel's Staff** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Stormsurge** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

### Zyra

- **Rôles** : Support, Jungle · dégâts magiques · mana · distance
- **Kit** : dégâts de zone, sorts fréquents (accélération rentable), gros besoin de mana, dégâts sur la durée, engage et contrôles.
- **Répartition des 10 builds** : Dégâts AP continu (jungle) (3), Support dégâts AP continu (7)

| # | Catégorie | Voies | Build | Objets (ordre d'achat) | Coût |
|---|---|---|---|---|---|
| 1 | Dégâts AP continu (jungle) | Jungle | Standard | Sorcerer's Shoes → Archangel's Staff → Blackfire Torch → Horizon Focus → Rabadon's Deathcap → Void Staff | 16050 |
| 2 | Dégâts AP continu (jungle) | Jungle | Contre tanks | Ionian Boots of Lucidity → Archangel's Staff → Blackfire Torch → Horizon Focus → Rabadon's Deathcap → Void Staff | 15850 |
| 3 | Dégâts AP continu (jungle) | Jungle | Contre AD / assassins | Plated Steelcaps → Blackfire Torch → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Horizon Focus | 16500 |
| 4 | Support dégâts AP continu | Support | Standard | Zaz'Zak's Realmspike → Sorcerer's Shoes → Blackfire Torch → Horizon Focus → Rabadon's Deathcap → Void Staff | 13150 |
| 5 | Support dégâts AP continu | Support | Contre AD / assassins | Zaz'Zak's Realmspike → Plated Steelcaps → Zhonya's Hourglass → Horizon Focus → Rabadon's Deathcap → Void Staff | 13700 |
| 6 | Support dégâts AP continu | Support | Contre AP | Zaz'Zak's Realmspike → Mercury's Treads → Banshee's Veil → Horizon Focus → Rabadon's Deathcap → Void Staff | 13500 |
| 7 | Support dégâts AP continu | Support | Accélération | Zaz'Zak's Realmspike → Ionian Boots of Lucidity → Archangel's Staff → Blackfire Torch → Horizon Focus → Rabadon's Deathcap | 12850 |
| 8 | Support dégâts AP continu | Support | Poke | Zaz'Zak's Realmspike → Ionian Boots of Lucidity → Blackfire Torch → Horizon Focus → Rabadon's Deathcap → Void Staff | 12950 |
| 9 | Support dégâts AP continu | Support | Anti-soins | Zaz'Zak's Realmspike → Sorcerer's Shoes → Morellonomicon → Horizon Focus → Rabadon's Deathcap → Void Staff | 13200 |
| 10 | Support dégâts AP continu | Support | Alternative (sans Blackfire Torch) | Zaz'Zak's Realmspike → Sorcerer's Shoes → Archangel's Staff → Horizon Focus → Rabadon's Deathcap → Void Staff | 13250 |

**Corrections en jeu**

- Adversaire **AD** très feed : Plated Steelcaps + **Zhonya's Hourglass** en objet suivant.
- Adversaire **AP** très feed : Mercury's Treads + **Banshee's Veil** en objet suivant.
- **Assassin** feed qui vous cible : Zhonya's Hourglass (AD) / Banshee's Veil (AP).
- **Tank** feed / 2 tanks ou plus : **Liandry's Torment** remplace l'objet le moins utile.
- **Soins** adverses (≥ 2 ou soigneur feed) : **Morellonomicon** (composant tôt).
- **Contrôles / suppression** (Malzahar, Warwick, Skarner, Urgot) : Mercury's Treads.
- **En avance** : finir l'objet offensif principal, puis **Shadowflame** ; prendre le build « Boule de neige » s'il existe.
- **En retard** : build « Contre AD / AP » de la même catégorie ; objet abordable conseillé : **Randuin's Omen**.

## 3. Sources

- LoL Wiki – Module:ItemData/data (objets, prix, groupes exclusifs) : https://wiki.leagueoflegends.com/en-us/Module:ItemData/data
- dodge.gg – Guide des bottes 2026 : https://www.dodge.gg/lol/news/boots-guide-2026
- Strafe – Liste des 173 champions et classes : https://www.strafe.com/articles/read/every-league-of-legends-champion-release-date/
- Sheep Esports – Locke : https://www.sheepesports.com/us/articles/all-locke-abilities-explained/en
- MetaSrc – Zaahen : https://www.metasrc.com/lol/champions/zaahen/jungle/info
- LoL Wiki – Yunara : https://wiki.leagueoflegends.com/Yunara
