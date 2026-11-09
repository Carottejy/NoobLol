# Nooblol – Base de builds League of Legends (173 champions, 19 profils, 190 builds complets)

> **À lire par l'IA de Nooblol avant tout.** Ce fichier est une base de connaissances pour proposer un build complet, ou ajuster un build, selon le champion joué, son rôle, le matchup de voie, l'équipe adverse et le déroulé de la partie.
>
> - **Clés** : les objets sont identifiés par leur **nom anglais officiel** (identique aux données Riot / Data Dragon). Les noms français sont indicatifs.
> - **Données objets** : LoL Wiki, Module:ItemData/data, consulté le 09/11/2026 (patch 26.22 environ). Bottes : dodge.gg (guide des bottes 2026). Roster : 173 champions, le dernier étant Locke (patch 26.13).
> - **Méthode** : les builds sont construits par **règles de conception** (stats et effets des objets adaptés au profil du champion), pas copiés depuis des sites de statistiques. Le coût et les stats totales de chaque build sont **calculés**. Un champion (Swain) a en plus un **calcul détaillé par simulation** (section 7). Les autres champions pourront être calculés de la même façon, par lots.
> - **Validité** : les 190 builds respectent les groupes d'objets exclusifs (un seul objet par groupe) et les limites de bottes et d'objets de support (vérification automatique).
> - **Limites** : les profils et les tags de menace sont attribués par analyse du kit de chaque champion. Ils doivent être revalidés après les gros patchs. Les objets peuvent changer à chaque patch : mettre à jour la section 2 en priorité.

## 0. Sommaire

1. Comment Nooblol doit utiliser ce fichier
2. Catalogue des objets (bottes, support, légendaires) et groupes exclusifs
3. Les 19 profils et leurs 10 builds complets
4. Moteur de règles (situations, ajustements, déroulé, matchup de voie)
5. Exemples de raisonnement
6. Les 173 champions : rôles, profil par rôle, ressource, tags de menace
7. Calcul détaillé : Swain (10 builds complets simulés)
8. Annexe : données machine (JSON)

## 1. Comment Nooblol doit utiliser ce fichier

- **Entrée minimale** : champion joué + rôle. **Entrées utiles** : les 5 champions adverses, l'adversaire direct, l'état de la partie (minute, écart d'or, objets déjà achetés).
- **Sortie attendue** : un build complet (6 emplacements, ordre d'achat), le nom du build de base, et une justification courte (situations détectées et ajustements appliqués). En cours de partie : le prochain objet à acheter et, si besoin, un objet à remplacer.
- **Format d'un build** : `[bottes ou objet de support, objet 1, objet 2, …]` dans l'ordre d'achat conseillé. Pour les supports : l'objet de support (amélioration de la quête Bounty of Worlds) occupe le 1er emplacement, puis les bottes.
- **Ne jamais** : proposer deux objets d'un même groupe exclusif, un objet « mana uniquement » à un champion sans mana, ou des bottes à Cassiopeia.

## 2. Catalogue des objets

### 2.1 Objets (clé anglaise, nom FR indicatif, coût, stats, effet)

Légende : « mana » = utile uniquement aux champions à mana. Groupe = groupe exclusif.

#### Bottes

| Clé (EN) | Nom FR | Coût | Stats | Groupe | Mana | Effet |
|---|---|---|---|---|---|---|
| Berserker's Greaves | Jambières du berserker | 1100 | VA % 35, VD 45 | — |  | — |
| Boots of Swiftness | Bottes de rapidité | 1000 | VD 55 | — |  | -25 % d'efficacité des ralentissements. |
| Ionian Boots of Lucidity | Bottes de lucidité ioniennes | 900 | Accél. 15, VD 45 | — |  | +10 accél. des sorts d'invocateur. |
| Mercury's Treads | Sandales de Mercure | 1250 | RM 20, VD 45, Ténacité % 30 | — |  | — |
| Plated Steelcaps | Coques en acier renforcé | 1200 | Armure 25, VD 45 | — |  | -12 % de dégâts des attaques de base subies. |
| Sorcerer's Shoes | Chaussures du sorcier | 1100 | Pén. magique fixe 12, VD 45 | — |  | — |

#### Objets de support (quête Bounty of Worlds, coût inclus dans la quête)

| Clé (EN) | Nom FR | Coût | Stats | Groupe | Mana | Effet |
|---|---|---|---|---|---|---|
| Bloodsong | Chant de sang | 0 | PV 200 | Support |  | Lame magique : attaque après un sort = +100 % AD de base, cible subit +8 % de dégâts 4 s. Balises (4 charges), 5 or/10 s. |
| Celestial Opposition | Opposition céleste | 0 | PV 200 | Support |  | Réduit de 35 % les dégâts de champion subis pendant 2 s, puis ralentit de 50 % autour (CD 18 s). Balises (4 charges), 5 or/10 s. |
| Dream Maker | Faiseur de rêves | 0 | PV 200 | Support |  | Soigner/protéger un allié lui donne une bulle : -75–255 dégâts subis ou +50–170 dégâts magiques à l'impact. Balises (4 charges), 5 or/10 s. |
| Solstice Sleigh | Traîneau du solstice | 0 | PV 200 | Support |  | Ralentir/immobiliser un ennemi : +20 % VD et 50–230 PV bonus pendant 2,5 s (CD 30 s). Balises (4 charges), 5 or/10 s. |
| Zaz'Zak's Realmspike | Pointe du royaume de Zaz'Zak | 0 | PV 200 | Support |  | Dégâts de sort sur champion : explosion 10 (+15 % AP) + 3 % PV max (CD 10 s). Balises (4 charges), 5 or/10 s. |

#### Objets légendaires

| Clé (EN) | Nom FR | Coût | Stats | Groupe | Mana | Effet |
|---|---|---|---|---|---|---|
| Abyssal Mask | Masque abyssal | 2650 | PV 350, RM 45, Accél. 15 | Blight |  | Ennemis à 700 unités : +12 % de dégâts magiques subis. |
| Archangel's Staff | Bâton de l'archange | 2900 | PA 70, Accél. 25, Mana 600 | Manaflow + Lifeline | oui | PA = 1 % du mana bonus. Se transforme en Étreinte du séraphin à 360 mana bonus. |
| Ardent Censer | Encensoir ardent | 2200 | PA 45, VD 4, Soins/boucliers % 10 | — |  | Soigner/protéger un allié : vous deux +25 % VA et 20 dégâts magiques à l'impact (6 s). |
| Axiom Arc | Arc axiomatique | 2750 | AD 55, Accél. 20, Létalité 18 | — |  | Élimination dans les 3 s : rembourse 15 % (+0,15 %/létalité) du CD de l'ultime. |
| Banshee's Veil | Voile de la banshee | 3000 | PA 105, RM 40 | Annul |  | Bouclier anti-sort (CD 40 s). |
| Black Cleaver | Couperet noir | 3000 | AD 40, PV 400, Accél. 20 | Fatality |  | Dégâts physiques : -6 % d'armure par cumul (max -30 %), +20 VD. |
| Blackfire Torch | Torche de feu noir | 2800 | PA 80, Accél. 20, Mana 600 | — | oui | Sorts : brûlure 60 (+6 % PA) sur 3 s ; +4 % PA par cible en feu. |
| Blade of the Ruined King | Lame du roi déchu | 3200 | AD 40, VA % 25, Vol de vie % 10 | — |  | Attaques : +9 % PV actuels (6 % à distance) ; ralentissement. |
| Bloodletter's Curse | Malédiction sanglante | 2900 | PA 65, PV 400, Accél. 15 | Blight |  | Sorts : -7,5 % RM par cumul (max -30 %). |
| Bloodthirster | Soif-de-sang | 3400 | AD 80, Vol de vie % 15 | — |  | Vol de vie en excès → bouclier 165–315. |
| Chempunk Chainsword | Tronçonneuse chimtech | 3100 | AD 45, PV 450, Accél. 15 | — |  | Blessures graves sur dégâts physiques. |
| Cosmic Drive | Propulseur cosmique | 3000 | PA 70, PV 350, Accél. 25, VD 4 | — |  | Dégâts magiques/bruts sur champion : +20 VD (4 s). |
| Cryptbloom | Floraison funèbre | 3000 | PA 75, Accél. 20, Pén. magique % 30 | Blight |  | Élimination : soigne alliés 100 (+20 % PA) (CD 60 s). |
| Dawncore | Cœur de l'aube | 2500 | PA 45, Soins/boucliers % 16 | — | oui | +2 % soins/boucliers et +10 PA par 100 % de régén mana de base. |
| Dead Man's Plate | Plaque du mort | 2900 | PV 350, Armure 55, VD 4 | Momentum |  | Élan : jusqu'à +20 VD, attaque chargée bonus. |
| Death's Dance | Danse de la mort | 3300 | AD 60, Armure 50, Accél. 15 | — |  | 30 % des dégâts subis étalés sur 3 s ; élimination : soin. |
| Echoes of Helia | Échos d'Hélia | 2200 | PA 35, PV 200, Accél. 20 | — |  | Fragments : soigner un allié = 65 soin + 50 dégâts au champion proche. |
| Eclipse | Éclipse | 2900 | AD 60, Accél. 15 | — |  | 2 coups en 2 s : +6 % PV max (4 % à distance) + bouclier (CD 6 s). |
| Edge of Night | Lisière de la nuit | 3000 | AD 50, PV 250, Létalité 15 | Annul |  | Bouclier anti-sort (CD 40 s). |
| Endless Hunger | Faim insatiable | 3000 | AD 60, Omnivamp. % 5, Ténacité % 20 | — |  | (source tierce, effet à vérifier) |
| Essence Reaver | Faucheuse d'essence | 2900 | AD 60, Accél. 15, Crit % 25 | — | oui | Attaques : rendent 15 (+10 % AD bonus) mana. |
| Experimental Hexplate | Hexplaque expérimentale | 3000 | AD 40, PV 450, VA % 20, Accél. ultime 30 | — |  | Ultime : +50 % VA et +20 % VD 8 s (CD 30 s). |
| Force of Nature | Force de la nature | 2800 | PV 400, RM 55, VD 4 | — |  | Cumuls sur dégâts magiques subis : +70 RM et +6 % VD au max. |
| Frozen Heart | Cœur gelé | 2500 | Armure 75, Accél. 20, Mana 400 | — | oui | -20 % VA des ennemis à 700 unités. |
| Guardian Angel | Ange gardien | 3200 | AD 55, Armure 45 | — |  | Résurrection (CD 300 s). |
| Guinsoo's Rageblade | Lame enragée de Guinsoo | 3000 | PA 30, AD 30, VA % 25 | — |  | +30 dégâts magiques à l'impact ; cumuls de VA ; coup fantôme toutes les 3 attaques. |
| Heartsteel | Cœur d'acier | 3000 | PV 900 | — |  | Attaque chargée : 70 + 6 % PV max, gagne des PV permanents. |
| Hextech Rocketbelt | Ceinture-roquette Hextech | 2650 | PA 70, PV 300, Accél. 20 | — |  | Actif : ruée + 100 (+10 % PA) (CD 40 s). |
| Hollow Radiance | Rayonnement creux | 2800 | PV 400, RM 40, Accél. 10 | Immolate |  | Embrasement magique 15 + 1 % PV bonus/s ; explosion à l'élimination. |
| Horizon Focus | Focalisateur d'horizon | 2750 | PA 125, Accél. 25 | — |  | Dégâts à +600 unités : révèle la cible. |
| Hubris | Orgueil | 3000 | AD 60, Accél. 10, Létalité 18 | — |  | Élimination : AD permanent (cumuls). |
| Hullbreaker | Brise-coque | 3000 | AD 40, PV 500, VD 4 | — |  | Seul : attaque chargée 120 % AD de base + 5 % PV max ; renforce les sbires de siège. |
| Iceborn Gauntlet | Gantelet de glace | 2900 | PV 300, Armure 50, Accél. 15 | Spellblade |  | Lame magique : 150 % AD de base + zone ralentissante. |
| Imperial Mandate | Mandat impérial | 2250 | PA 60, Accél. 20 | — | oui | Ralentir/immobiliser marque la cible ; allié : +10 % PV actuels. |
| Infinity Edge | Lame d'infini | 3450 | AD 65, Crit % 25 | — |  | +40 % de dégâts critiques. |
| Jak'Sho, The Protean | Jak'Sho le Protéiforme | 3200 | PV 350, Armure 45, RM 45 | — |  | Après 5 s de combat : +30 % armure et RM bonus. |
| Kaenic Rookern | Rookern de Kaenic | 2900 | PV 400, RM 80 | — |  | Bouclier magique = 15 % PV max après 15 s sans dégâts magiques. |
| Knight's Vow | Serment du chevalier | 2300 | PV 200, Armure 40, Accél. 10 | — |  | Lie un allié : encaisse 12 % de ses dégâts. |
| Kraken Slayer | Tueur de krakens | 3000 | AD 45, VA % 40, VD 4 | — |  | Toutes les 3 attaques : 150–200 + jusqu'à 75 % selon PV manquants. |
| Liandry's Torment | Tourment de Liandry | 3000 | PA 60, PV 300 | — |  | Sorts : brûlure 1 % PV max / 0,5 s (3 s) ; +2 % dégâts/s en combat (max 6 %). |
| Lich Bane | Fléau de liche | 2900 | PA 100, Accél. 10, VD 4 | Spellblade |  | Lame magique : 75 % AD de base + 40 % PA en dégâts magiques. |
| Locket of the Iron Solari | Médaillon de l'Iron Solari | 2200 | PV 200, Armure 25, RM 25, Accél. 10 | — |  | Bouclier de zone 200–360 (CD 90 s). |
| Lord Dominik's Regards | Salutations de Lord Dominik | 3100 | AD 35, Crit % 25, Pén. armure % 40 | Fatality |  | — |
| Luden's Companion | Compagnon de Luden | 2750 | PA 100, Accél. 10, Mana 600 | — | oui | 6 charges : 75 (+5 % PA) au sort qui touche (CD 12 s). |
| Malignance | Malignance | 2700 | PA 90, Accél. 15, Mana 600, Accél. ultime 20 | — | oui | Ultime : zone 180 (+15 % PA) sur 3 s, -10 RM. |
| Manamune | Manamune | 2900 | AD 35, Accél. 15, Mana 500 | Manaflow | oui | AD = 2 % mana max ; devient Muramana à 360 mana bonus. |
| Maw of Malmortius | Gueule de Malmortius | 3100 | AD 60, RM 40, Accél. 15 | Lifeline |  | Sous 30 % PV : bouclier magique 200 (+150 % AD bonus) + 10 % omnivampirisme. |
| Mejai's Soulstealer | Voleur d'âmes de Mejai | 1500 | PA 20, PV 100 | Glory |  | +5 PA par cumul (max 25), en perd 10 à la mort. |
| Mercurial Scimitar | Cimeterre mercuriel | 3200 | AD 50, RM 35, Vol de vie % 10 | Quicksilver |  | Actif : purge les contrôles (CD 90 s). |
| Mikael's Blessing | Bénédiction de Mikael | 2300 | PV 250, Accél. 15, Soins/boucliers % 12 | — | oui | Actif : purge et soigne un allié 100–250 (CD 120 s). |
| Moonstone Renewer | Renouveau de pierre de lune | 2200 | PA 25, PV 200, Accél. 20 | — | oui | Soins/boucliers rebondissent sur un 2e allié (30 %/35 %). |
| Morellonomicon | Morellonomicon | 2850 | PA 75, PV 350, Accél. 15 | — |  | Blessures graves sur dégâts magiques. |
| Mortal Reminder | Rappel mortel | 3300 | AD 35, Crit % 25, Pén. armure % 35 | Fatality |  | Blessures graves sur dégâts physiques. |
| Nashor's Tooth | Dent de Nashor | 2900 | PA 80, Accél. 15, VA % 50 | — |  | Attaques : +15 (+15 % PA) magiques. |
| Navori Flickerblade | Lame scintillante de Navori | 2650 | VA % 40, Crit % 25, VD 4 | — |  | Attaques : -15 % du CD restant des sorts de base. |
| Opportunity | Opportunité | 2700 | AD 55, Létalité 18 | — |  | Hors combat 8 s : +11 létalité ; élimination : +200 VD. |
| Overlord's Bloodmail | Cotte du suzerain | 3300 | AD 30, PV 550 | — |  | AD = 2,5 % PV bonus ; +AD selon PV manquants. |
| Phantom Dancer | Danseur fantôme | 2650 | VA % 65, Crit % 25, VD 10 | — |  | Fantôme permanent. |
| Profane Hydra | Hydre profane | 2850 | AD 55, Accél. 10, Létalité 18 | Hydra |  | Fendoir ; actif de zone 80 % AD. |
| Rabadon's Deathcap | Coiffe de Rabadon | 3500 | PA 130 | — |  | +30 % PA. |
| Randuin's Omen | Présage de Randuin | 2700 | PV 350, Armure 75 | — |  | -30 % dégâts critiques subis ; actif : ralentit 70 % (CD 90 s). |
| Rapid Firecannon | Canon ultrarapide | 2650 | VA % 35, Crit % 25, VD 4 | — |  | Attaque chargée : +40 magiques, +35 % de portée. |
| Ravenous Hydra | Hydre vorace | 3300 | AD 65, Accél. 15, Vol de vie % 12 | Hydra |  | Fendoir ; actif de zone 80 % AD, vol de vie. |
| Redemption | Rédemption | 2300 | PV 200, Accél. 15, Soins/boucliers % 10 | — | oui | Actif : soin de zone 150–350 + 10 % PV max bruts aux ennemis (CD 90 s). |
| Riftmaker | Faiseur de failles | 3100 | PA 70, PV 350, Accél. 15 | — |  | +2 % dégâts/s en combat (max 8 %) puis 6 % omnivampirisme ; PA = 2 % PV bonus. |
| Rod of Ages | Bâton séculaire | 2600 | PA 45, PV 350, Mana 500 | Eternity | oui | +3 PA, +10 PV, +30 mana par minute (10 fois) ; soigne 25 % du mana dépensé. |
| Runaan's Hurricane | Ouragan de Runaan | 2650 | VA % 40, Crit % 25, VD 4 | — |  | À distance : 2 projectiles bonus à 55 % AD. |
| Rylai's Crystal Scepter | Sceptre de cristal de Rylai | 2600 | PA 65, PV 400 | — |  | Sorts : ralentissent de 30 % (1 s). |
| Serpent's Fang | Croc du serpent | 2500 | AD 55, Létalité 15 | — |  | -50 % boucliers (35 % à distance). |
| Serylda's Grudge | Rancune de Serylda | 3000 | AD 45, Accél. 15, Pén. armure % 35 | Fatality |  | Sorts sur cible <50 % PV : ralentissent 30 %. |
| Shadowflame | Flamme d'ombre | 3200 | PA 110, Pén. magique fixe 15 | — |  | Dégâts magiques/bruts : critique 120 % sur cible <40 % PV. |
| Shurelya's Battlesong | Chant de bataille de Shurelya | 2200 | PA 50, Accél. 15, VD 4 | — | oui | Actif : +30 % VD aux alliés (CD 75 s). |
| Spear of Shojin | Lance de Shojin | 3100 | AD 45, PV 450, Accél. 25 | — |  | Sorts : +3 % dégâts des sorts par cumul (max 12 %). |
| Spirit Visage | Visage spirituel | 2700 | PV 400, RM 50, Accél. 10 | — |  | +25 % soins et boucliers reçus. |
| Staff of Flowing Water | Bâton des flots | 2250 | PA 35, Accél. 15, Soins/boucliers % 10 | — | oui | Soigner/protéger un allié : vous deux +45 PA (6 s). |
| Statikk Shiv | Shiv statikk | 2700 | AD 45, VA % 30, VD 4 | — |  | 3 attaques : éclair 60 magiques rebondissant sur 5 cibles. |
| Sterak's Gage | Gage de Sterak | 3200 | PV 400, Ténacité % 20 | Lifeline |  | +45 % AD de base ; sous 30 % PV : bouclier 60 % PV bonus. |
| Stormsurge | Choc de tempête | 2800 | PA 90, Pén. magique fixe 15, VD 6 | — |  | 25 % des PV d'un champion en 2,5 s : 125 (+10 % PA) après 2 s (CD 30 s). |
| Stridebreaker | Briseur de foulées | 3300 | AD 40, PV 450, VA % 25 | Hydra |  | Actif : onde 80 % AD, ralentit 35 % (CD 15 s). |
| Sundered Sky | Ciel fendu | 3100 | AD 40, PV 400, Accél. 10 | — |  | 1re attaque sur un champion : critique + soin 100 % AD de base + 6 % PV manquants (CD 8 s). |
| Sunfire Aegis | Égide du feu solaire | 2700 | PV 350, Armure 50, Accél. 10 | Immolate |  | Embrasement 20 + 1 % PV bonus/s. |
| Terminus | Terminus | 3000 | AD 30, VA % 35 | Fatality + Blight |  | +30 magiques à l'impact ; alternance : résistances ou pénétration (jusqu'à 30 %). (Aussi groupe Fléau.) |
| The Collector | Le Collecteur | 3000 | AD 50, Crit % 25, Létalité 10 | — |  | Exécute sous 5 % PV ; +25 or par élimination. |
| Thornmail | Cotte épineuse | 2450 | PV 150, Armure 75 | — |  | Frappé par une attaque : dégâts + Blessures graves à l'attaquant. |
| Titanic Hydra | Hydre titanesque | 3300 | AD 40, PV 600 | Hydra |  | Attaques : +1 % PV max (+3 % en cône) ; actif renforcé. |
| Trailblazer | Éclaireur | 2400 | PV 250, Armure 40, VD 4 | Momentum |  | Élan : +20 VD, laisse une traînée +15 % VD aux alliés. |
| Trinity Force | Force de la trinité | 3333 | AD 36, PV 333, Accél. 15, VA % 30 | Spellblade |  | Lame magique : 200 % AD de base ; +20 VD à l'impact. |
| Umbral Glaive | Glaive de l'ombre | 2500 | AD 55, Accél. 10, Létalité 15 | — |  | Repéré par une balise : désactive les balises proches. |
| Unending Despair | Désespoir éternel | 2800 | PV 400, Armure 25, RM 25, Accél. 10 | — |  | Toutes les 4 s en combat : 3 % PV bonus en dégâts, soigne 250 % de ces dégâts. |
| Vigilant Wardstone | Pierre de garde vigilante | 2300 | PV 250, Armure 25, RM 30, Accél. 20 | — |  | Balises de contrôle : +1 capacité, pose à distance. |
| Void Staff | Bâton du vide | 3000 | PA 95, Pén. magique % 40 | Blight |  | — |
| Voltaic Cyclosword | Cyclo-épée voltaïque | 3000 | AD 55, Accél. 10, Létalité 18 | — |  | Attaque chargée : +100 et ralentissement. |
| Warmog's Armor | Armure de Warmog | 3100 | PV 1120 | — |  | Avec 2 000 PV bonus : régénère 15 % PV / 5 s hors dégâts 8 s. |
| Winter's Approach | Approche hivernale | 2400 | PV 550, Accél. 15, Mana 500 | Manaflow | oui | PV = 15 % mana bonus ; devient Fimbulwinter (bouclier sur contrôle). |
| Wit's End | Fin de l'esprit | 2800 | RM 45, VA % 50, Ténacité % 20 | — |  | +45 magiques à l'impact. |
| Youmuu's Ghostblade | Lame spectrale de Youmuu | 2800 | AD 55, Létalité 18, VD 4 | — |  | Actif : +20 % VD et fantôme 6 s (CD 45 s). |
| Yun Tal Wildarrows | Flèches sauvages de Yun Tal | 3000 | AD 55, VA % 35 | — |  | Gagne du critique en attaquant (max 25 %) ; actif passif : +30 % VA (CD 30 s). |
| Zeke's Convergence | Convergence de Zeke | 2200 | PV 300, Armure 25, RM 25, Accél. 10 | — |  | Ultime : tempête 5 s, 150 dégâts magiques et 30 % de ralentissement autour. |
| Zhonya's Hourglass | Sablier de Zhonya | 3250 | PA 105, Armure 50 | Stasis |  | Actif : stase 2,5 s (CD 120 s). |

### 2.2 Groupes exclusifs (un seul objet par groupe dans un build)

- **Annul** : Banshee's Veil, Edge of Night
- **Blight** : Abyssal Mask, Bloodletter's Curse, Cryptbloom, Terminus, Void Staff
- **Eternity** : Rod of Ages
- **Fatality** : Black Cleaver, Lord Dominik's Regards, Mortal Reminder, Serylda's Grudge, Terminus
- **Glory** : Mejai's Soulstealer
- **Hydra** : Profane Hydra, Ravenous Hydra, Stridebreaker, Titanic Hydra
- **Immolate** : Hollow Radiance, Sunfire Aegis
- **Lifeline** : Archangel's Staff, Maw of Malmortius, Sterak's Gage
- **Manaflow** : Archangel's Staff, Manamune, Winter's Approach
- **Momentum** : Dead Man's Plate, Trailblazer
- **Quicksilver** : Mercurial Scimitar
- **Spellblade** : Iceborn Gauntlet, Lich Bane, Trinity Force
- **Stasis** : Zhonya's Hourglass
- **Support** : Bloodsong, Celestial Opposition, Dream Maker, Solstice Sleigh, Zaz'Zak's Realmspike

Autres règles : une seule paire de bottes, un seul objet de support. Objets transformés (non achetables directement) : Seraph's Embrace (Archangel's Staff), Muramana (Manamune), Fimbulwinter (Winter's Approach). Composants utiles en retard ou pour une réponse rapide : Oblivion Orb (anti-soins AP), Executioner's Calling (anti-soins AD), Bramble Vest (anti-soins tank), Seeker's Armguard (vers Zhonya), Hexdrinker (vers Gueule de Malmortius), Null-Magic Mantle, Cloth Armor.

## 3. Les 19 profils et leurs 10 builds complets

Pour chaque build : nom, situations (`tags`) où il est conseillé, objets dans l'ordre d'achat, coût total et stats totales des objets (hors champion, hors runes, sans les bonus en % comme les +30 % de PA de la Coiffe de Rabadon). « ⚠️mana » = le build contient un objet utile seulement aux champions à mana : pour un champion sans mana, appliquer la règle `champion_sans_mana` (section 4.3).

### MAGE_BURST — Mage de burst

Gros dégâts instantanés avec ses sorts, peu de mobilité.

**Champions** : Ahri (MID), Annie (MID), Kennen (TOP), Kennen (MID), LeBlanc (MID), Lissandra (MID), Neeko (MID), Orianna (MID), Seraphine (MID), Syndra (MID), Twisted Fate (MID), Veigar (MID), Vex (MID), Zoe (MID)

| # | Build | Tags | Objets (ordre d'achat) | Coût | Stats totales |
|---|---|---|---|---|---|
| 1 | Standard ⚠️mana | default | Sorcerer's Shoes → Luden's Companion → Shadowflame → Rabadon's Deathcap → Void Staff → Zhonya's Hourglass | 16800 | PA 540, Armure 50, Accél. 10, Pén. magique % 40, Pén. magique fixe 27 |
| 2 | Contre AD / assassins ⚠️mana | vs_ad, vs_assassin | Plated Steelcaps → Luden's Companion → Zhonya's Hourglass → Shadowflame → Rabadon's Deathcap → Void Staff | 16900 | PA 540, Armure 75, Accél. 10, Pén. magique % 40, Pén. magique fixe 15 |
| 3 | Contre AP / burst magique ⚠️mana | vs_ap | Mercury's Treads → Luden's Companion → Banshee's Veil → Shadowflame → Rabadon's Deathcap → Void Staff | 16700 | PA 540, RM 60, Accél. 10, Pén. magique % 40, Pén. magique fixe 15, Ténacité % 30 |
| 4 | Contre tanks ⚠️mana | vs_tanks | Sorcerer's Shoes → Luden's Companion → Liandry's Torment → Void Staff → Rabadon's Deathcap → Zhonya's Hourglass | 16600 | PA 490, PV 300, Armure 50, Accél. 10, Pén. magique % 40, Pén. magique fixe 12 |
| 5 | Boule de neige | ahead, vs_squishy | Sorcerer's Shoes → Stormsurge → Shadowflame → Rabadon's Deathcap → Void Staff → Zhonya's Hourglass | 16850 | PA 530, Armure 50, Pén. magique % 40, Pén. magique fixe 42 |
| 6 | Accélération / poke ⚠️mana | poke, long_game | Ionian Boots of Lucidity → Malignance → Horizon Focus → Shadowflame → Rabadon's Deathcap → Void Staff | 16050 | PA 550, Accél. 55, Pén. magique % 40, Pén. magique fixe 15 |
| 7 | Anti-soins ⚠️mana | vs_heal | Sorcerer's Shoes → Luden's Companion → Morellonomicon → Shadowflame → Rabadon's Deathcap → Void Staff | 16400 | PA 510, PV 350, Accél. 25, Pén. magique % 40, Pén. magique fixe 27 |
| 8 | En retard / défensif ⚠️mana | behind, vs_assassin | Mercury's Treads → Luden's Companion → Zhonya's Hourglass → Banshee's Veil → Rabadon's Deathcap → Void Staff | 16750 | PA 535, Armure 50, RM 60, Accél. 10, Pén. magique % 40, Ténacité % 30 |
| 9 | Lame magique (attaques entre les sorts) | melee_weave | Sorcerer's Shoes → Lich Bane → Shadowflame → Rabadon's Deathcap → Void Staff → Zhonya's Hourglass | 16950 | PA 540, Armure 50, Accél. 10, Pén. magique % 40, Pén. magique fixe 27 |
| 10 | Partie longue ⚠️mana | long_game | Sorcerer's Shoes → Luden's Companion → Rabadon's Deathcap → Void Staff → Zhonya's Hourglass → Banshee's Veil | 16600 | PA 535, Armure 50, RM 40, Accél. 10, Pén. magique % 40, Pén. magique fixe 12 |

### MAGE_BATTLE — Mage de combat / contrôle

Dégâts continus en zone, combats prolongés au cœur de la mêlée.

**Champions** : Anivia (MID), Aurelion Sol (MID), Brand (MID), Brand (JGL), Cassiopeia (MID), Cassiopeia (TOP), Fiddlesticks (JGL), Heimerdinger (MID), Heimerdinger (TOP), Karthus (JGL), Karthus (MID), Karthus (ADC), Malzahar (MID), Morgana (MID), Morgana (JGL), Rumble (TOP), Rumble (MID), Rumble (JGL), Ryze (MID), Ryze (TOP), Seraphine (ADC), Swain (TOP), Swain (MID), Swain (ADC), Taliyah (JGL), Taliyah (MID), Viktor (MID), Vladimir (MID), Vladimir (TOP), Zyra (JGL)

| # | Build | Tags | Objets (ordre d'achat) | Coût | Stats totales |
|---|---|---|---|---|---|
| 1 | Standard | default | Sorcerer's Shoes → Liandry's Torment → Rylai's Crystal Scepter → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff | 16450 | PA 455, PV 700, Armure 50, Pén. magique % 40, Pén. magique fixe 12 |
| 2 | Brûlure / teamfight ⚠️mana | teamfight | Sorcerer's Shoes → Blackfire Torch → Liandry's Torment → Rylai's Crystal Scepter → Rabadon's Deathcap → Void Staff | 16000 | PA 430, PV 700, Accél. 20, Pén. magique % 40, Pén. magique fixe 12 |
| 3 | Mana / montée en puissance ⚠️mana | long_game, mana_scaler | Ionian Boots of Lucidity → Archangel's Staff → Rod of Ages → Rabadon's Deathcap → Void Staff → Zhonya's Hourglass | 16150 | PA 445, PV 350, Armure 50, Accél. 40, Pén. magique % 40 |
| 4 | Contre tanks | vs_tanks | Sorcerer's Shoes → Liandry's Torment → Bloodletter's Curse → Rylai's Crystal Scepter → Rabadon's Deathcap → Zhonya's Hourglass | 16350 | PA 425, PV 1100, Armure 50, Accél. 15, Pén. magique fixe 12 |
| 5 | Contre AD / plongeurs | vs_ad, vs_dive | Plated Steelcaps → Liandry's Torment → Zhonya's Hourglass → Rylai's Crystal Scepter → Rabadon's Deathcap → Void Staff | 16550 | PA 455, PV 700, Armure 75, Pén. magique % 40 |
| 6 | Contre AP | vs_ap | Mercury's Treads → Liandry's Torment → Banshee's Veil → Rylai's Crystal Scepter → Rabadon's Deathcap → Void Staff | 16350 | PA 455, PV 700, RM 60, Pén. magique % 40, Ténacité % 30 |
| 7 | Anti-soins | vs_heal | Sorcerer's Shoes → Liandry's Torment → Morellonomicon → Rylai's Crystal Scepter → Rabadon's Deathcap → Void Staff | 16050 | PA 425, PV 1050, Accél. 15, Pén. magique % 40, Pén. magique fixe 12 |
| 8 | Ultime fréquent ⚠️mana | ult_centric | Sorcerer's Shoes → Malignance → Liandry's Torment → Rabadon's Deathcap → Void Staff → Zhonya's Hourglass | 16550 | PA 480, PV 300, Armure 50, Accél. 15, Pén. magique % 40, Pén. magique fixe 12 |
| 9 | Mage de première ligne | frontline, vs_dive | Mercury's Treads → Riftmaker → Liandry's Torment → Rylai's Crystal Scepter → Spirit Visage → Zhonya's Hourglass | 15900 | PA 300, PV 1450, Armure 50, RM 70, Accél. 25, Ténacité % 30 |
| 10 | En retard | behind | Mercury's Treads → Rylai's Crystal Scepter → Zhonya's Hourglass → Banshee's Veil → Liandry's Torment → Void Staff | 16100 | PA 430, PV 700, Armure 50, RM 60, Pén. magique % 40, Ténacité % 30 |

### MAGE_ARTILLERY — Mage artilleur

Poke à très longue portée.

**Champions** : Hwei (MID), Karma (MID), Karma (TOP), Lux (MID), Mel (MID), Vel'Koz (MID), Xerath (MID), Ziggs (MID), Ziggs (ADC), Zilean (MID)

| # | Build | Tags | Objets (ordre d'achat) | Coût | Stats totales |
|---|---|---|---|---|---|
| 1 | Standard ⚠️mana | default | Sorcerer's Shoes → Luden's Companion → Shadowflame → Rabadon's Deathcap → Void Staff → Zhonya's Hourglass | 16800 | PA 540, Armure 50, Accél. 10, Pén. magique % 40, Pén. magique fixe 27 |
| 2 | Poke / accélération ⚠️mana | poke | Ionian Boots of Lucidity → Malignance → Horizon Focus → Rabadon's Deathcap → Void Staff → Shadowflame | 16050 | PA 550, Accél. 55, Pén. magique % 40, Pén. magique fixe 15 |
| 3 | Brûlure ⚠️mana | teamfight | Sorcerer's Shoes → Blackfire Torch → Shadowflame → Rabadon's Deathcap → Void Staff → Zhonya's Hourglass | 16850 | PA 520, Armure 50, Accél. 20, Pén. magique % 40, Pén. magique fixe 27 |
| 4 | Contre tanks | vs_tanks | Sorcerer's Shoes → Liandry's Torment → Rabadon's Deathcap → Void Staff → Horizon Focus → Zhonya's Hourglass | 16600 | PA 515, PV 300, Armure 50, Accél. 25, Pén. magique % 40, Pén. magique fixe 12 |
| 5 | Mana / partie longue ⚠️mana | long_game, mana_scaler | Sorcerer's Shoes → Archangel's Staff → Luden's Companion → Rabadon's Deathcap → Void Staff → Zhonya's Hourglass | 16500 | PA 500, Armure 50, Accél. 35, Pén. magique % 40, Pén. magique fixe 12 |
| 6 | Contre assassins ⚠️mana | vs_assassin, vs_ad | Plated Steelcaps → Luden's Companion → Zhonya's Hourglass → Shadowflame → Rabadon's Deathcap → Void Staff | 16900 | PA 540, Armure 75, Accél. 10, Pén. magique % 40, Pén. magique fixe 15 |
| 7 | Contre AP ⚠️mana | vs_ap | Mercury's Treads → Luden's Companion → Banshee's Veil → Rabadon's Deathcap → Void Staff → Shadowflame | 16700 | PA 540, RM 60, Accél. 10, Pén. magique % 40, Pén. magique fixe 15, Ténacité % 30 |
| 8 | Anti-soins ⚠️mana | vs_heal | Sorcerer's Shoes → Luden's Companion → Morellonomicon → Rabadon's Deathcap → Void Staff → Horizon Focus | 15950 | PA 525, PV 350, Accél. 50, Pén. magique % 40, Pén. magique fixe 12 |
| 9 | Boule de neige ⚠️mana | ahead | Sorcerer's Shoes → Luden's Companion → Stormsurge → Rabadon's Deathcap → Shadowflame → Void Staff | 16350 | PA 525, Accél. 10, Pén. magique % 40, Pén. magique fixe 42 |
| 10 | Contrôle / soutien de l'équipe ⚠️mana | utility, vs_dive | Ionian Boots of Lucidity → Malignance → Rylai's Crystal Scepter → Rabadon's Deathcap → Void Staff → Zhonya's Hourglass | 15950 | PA 485, PV 400, Armure 50, Accél. 30, Pén. magique % 40 |

### AP_ASSASSIN — Assassin AP

Mobilité et burst magique sur cible isolée.

**Champions** : Akali (MID), Akali (TOP), Aurora (MID), Aurora (TOP), Diana (MID), Ekko (JGL), Ekko (MID), Elise (JGL), Evelynn (JGL), Fizz (MID), Kassadin (MID), Katarina (MID), Locke (MID), Nidalee (JGL)

| # | Build | Tags | Objets (ordre d'achat) | Coût | Stats totales |
|---|---|---|---|---|---|
| 1 | Standard | default | Sorcerer's Shoes → Stormsurge → Shadowflame → Rabadon's Deathcap → Void Staff → Zhonya's Hourglass | 16850 | PA 530, Armure 50, Pén. magique % 40, Pén. magique fixe 42 |
| 2 | Lame magique | melee_weave | Sorcerer's Shoes → Lich Bane → Shadowflame → Rabadon's Deathcap → Void Staff → Zhonya's Hourglass | 16950 | PA 540, Armure 50, Accél. 10, Pén. magique % 40, Pén. magique fixe 27 |
| 3 | Engagement (ceinture) | gap_close | Sorcerer's Shoes → Hextech Rocketbelt → Shadowflame → Rabadon's Deathcap → Void Staff → Zhonya's Hourglass | 16700 | PA 510, PV 300, Armure 50, Accél. 20, Pén. magique % 40, Pén. magique fixe 27 |
| 4 | Combat prolongé | teamfight, skirmish | Sorcerer's Shoes → Riftmaker → Zhonya's Hourglass → Shadowflame → Rabadon's Deathcap → Void Staff | 17150 | PA 510, PV 350, Armure 50, Accél. 15, Pén. magique % 40, Pén. magique fixe 27 |
| 5 | Contre AP | vs_ap | Mercury's Treads → Stormsurge → Banshee's Veil → Shadowflame → Rabadon's Deathcap → Void Staff | 16750 | PA 530, RM 60, Pén. magique % 40, Pén. magique fixe 30, Ténacité % 30 |
| 6 | Contre AD | vs_ad | Plated Steelcaps → Stormsurge → Zhonya's Hourglass → Shadowflame → Rabadon's Deathcap → Void Staff | 16950 | PA 530, Armure 75, Pén. magique % 40, Pén. magique fixe 30 |
| 7 | Contre tanks | vs_tanks | Sorcerer's Shoes → Riftmaker → Liandry's Torment → Rabadon's Deathcap → Void Staff → Zhonya's Hourglass | 16950 | PA 460, PV 650, Armure 50, Accél. 15, Pén. magique % 40, Pén. magique fixe 12 |
| 8 | Anti-soins | vs_heal | Sorcerer's Shoes → Stormsurge → Morellonomicon → Shadowflame → Rabadon's Deathcap → Void Staff | 16450 | PA 500, PV 350, Accél. 15, Pén. magique % 40, Pén. magique fixe 42 |
| 9 | Boule de neige | ahead | Sorcerer's Shoes → Stormsurge → Shadowflame → Mejai's Soulstealer → Rabadon's Deathcap → Void Staff | 15100 | PA 445, PV 100, Pén. magique % 40, Pén. magique fixe 42 |
| 10 | Hybride à l'impact | onhit | Sorcerer's Shoes → Nashor's Tooth → Lich Bane → Shadowflame → Rabadon's Deathcap → Void Staff | 16600 | PA 515, Accél. 25, VA % 50, Pén. magique % 40, Pén. magique fixe 27 |

### AP_BRUISER — Combattant AP

Mêlée, dégâts magiques continus et résistance.

**Champions** : Diana (JGL), Gragas (JGL), Gragas (TOP), Lillia (JGL), Lillia (TOP), Mordekaiser (TOP), Mordekaiser (JGL), Sylas (MID), Sylas (JGL), Sylas (TOP)

| # | Build | Tags | Objets (ordre d'achat) | Coût | Stats totales |
|---|---|---|---|---|---|
| 1 | Standard | default | Mercury's Treads → Riftmaker → Liandry's Torment → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff | 17100 | PA 460, PV 650, Armure 50, RM 20, Accél. 15, Pén. magique % 40, Ténacité % 30 |
| 2 | Résistant | frontline | Mercury's Treads → Riftmaker → Liandry's Torment → Spirit Visage → Force of Nature → Zhonya's Hourglass | 16100 | PA 235, PV 1450, Armure 50, RM 125, Accél. 25, Ténacité % 30 |
| 3 | Contre AD | vs_ad | Plated Steelcaps → Riftmaker → Zhonya's Hourglass → Liandry's Torment → Randuin's Omen → Rabadon's Deathcap | 16750 | PA 365, PV 1000, Armure 150, Accél. 15 |
| 4 | Contre AP | vs_ap | Mercury's Treads → Riftmaker → Banshee's Veil → Liandry's Torment → Force of Nature → Kaenic Rookern | 16050 | PA 235, PV 1450, RM 195, Accél. 15, Ténacité % 30 |
| 5 | Anti-soins | vs_heal | Mercury's Treads → Riftmaker → Morellonomicon → Liandry's Torment → Zhonya's Hourglass → Void Staff | 16450 | PA 405, PV 1000, Armure 50, RM 20, Accél. 30, Pén. magique % 40, Ténacité % 30 |
| 6 | Contre tanks | vs_tanks | Mercury's Treads → Liandry's Torment → Riftmaker → Bloodletter's Curse → Rabadon's Deathcap → Zhonya's Hourglass | 17000 | PA 430, PV 1050, Armure 50, RM 20, Accél. 30, Ténacité % 30 |
| 7 | Burst | ahead, vs_squishy | Sorcerer's Shoes → Riftmaker → Shadowflame → Rabadon's Deathcap → Void Staff → Zhonya's Hourglass | 17150 | PA 510, PV 350, Armure 50, Accél. 15, Pén. magique % 40, Pén. magique fixe 27 |
| 8 | Soins personnels | self_heal | Mercury's Treads → Riftmaker → Cosmic Drive → Spirit Visage → Rabadon's Deathcap → Void Staff | 16550 | PA 365, PV 1100, RM 70, Accél. 50, Pén. magique % 40, Ténacité % 30 |
| 9 | Teamfight (zone) | teamfight | Mercury's Treads → Liandry's Torment → Rylai's Crystal Scepter → Riftmaker → Zhonya's Hourglass → Abyssal Mask | 15850 | PA 300, PV 1400, Armure 50, RM 65, Accél. 30, Ténacité % 30 |
| 10 | En retard | behind | Mercury's Treads → Rylai's Crystal Scepter → Zhonya's Hourglass → Spirit Visage → Riftmaker → Force of Nature | 15700 | PA 240, PV 1550, Armure 50, RM 125, Accél. 25, Ténacité % 30 |

### AP_ONHIT — AP à l'impact

Dégâts magiques portés par les attaques de base.

**Champions** : Azir (MID), Gwen (TOP), Gwen (JGL), Kayle (TOP), Kayle (MID), Teemo (TOP)

| # | Build | Tags | Objets (ordre d'achat) | Coût | Stats totales |
|---|---|---|---|---|---|
| 1 | Standard | default | Berserker's Greaves → Nashor's Tooth → Guinsoo's Rageblade → Rabadon's Deathcap → Void Staff → Zhonya's Hourglass | 16750 | PA 440, AD 30, Armure 50, Accél. 15, VA % 110, Pén. magique % 40 |
| 2 | Combat prolongé | skirmish | Sorcerer's Shoes → Nashor's Tooth → Riftmaker → Rabadon's Deathcap → Void Staff → Zhonya's Hourglass | 16850 | PA 480, PV 350, Armure 50, Accél. 30, VA % 50, Pén. magique % 40, Pén. magique fixe 12 |
| 3 | Burst à l'impact | melee_weave | Sorcerer's Shoes → Nashor's Tooth → Lich Bane → Rabadon's Deathcap → Void Staff → Shadowflame | 16600 | PA 515, Accél. 25, VA % 50, Pén. magique % 40, Pén. magique fixe 27 |
| 4 | Contre tanks | vs_tanks | Berserker's Greaves → Nashor's Tooth → Guinsoo's Rageblade → Liandry's Torment → Void Staff → Rabadon's Deathcap | 16500 | PA 395, AD 30, PV 300, Accél. 15, VA % 110, Pén. magique % 40 |
| 5 | Contre AD | vs_ad | Plated Steelcaps → Nashor's Tooth → Guinsoo's Rageblade → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff | 16850 | PA 440, AD 30, Armure 75, Accél. 15, VA % 75, Pén. magique % 40 |
| 6 | Contre AP | vs_ap | Mercury's Treads → Nashor's Tooth → Guinsoo's Rageblade → Wit's End → Rabadon's Deathcap → Void Staff | 16450 | PA 335, AD 30, RM 65, Accél. 15, VA % 125, Pén. magique % 40, Ténacité % 50 |
| 7 | Anti-soins | vs_heal | Berserker's Greaves → Nashor's Tooth → Guinsoo's Rageblade → Morellonomicon → Rabadon's Deathcap → Void Staff | 16350 | PA 410, AD 30, PV 350, Accél. 30, VA % 110, Pén. magique % 40 |
| 8 | Brûlure / kite | poke, kite | Sorcerer's Shoes → Liandry's Torment → Nashor's Tooth → Rylai's Crystal Scepter → Rabadon's Deathcap → Void Staff | 16100 | PA 430, PV 700, Accél. 15, VA % 50, Pén. magique % 40, Pén. magique fixe 12 |
| 9 | Boule de neige | ahead | Berserker's Greaves → Nashor's Tooth → Guinsoo's Rageblade → Shadowflame → Rabadon's Deathcap → Void Staff | 16700 | PA 445, AD 30, Accél. 15, VA % 110, Pén. magique % 40, Pén. magique fixe 15 |
| 10 | En retard | behind | Mercury's Treads → Nashor's Tooth → Zhonya's Hourglass → Banshee's Veil → Rabadon's Deathcap → Void Staff | 16900 | PA 515, Armure 50, RM 60, Accél. 15, VA % 50, Pén. magique % 40, Ténacité % 30 |

### AP_TANK — Tank AP

Tank dont les sorts font des dégâts magiques.

**Champions** : Amumu (JGL), Cho'Gath (MID), Galio (MID), Malphite (MID), Maokai (JGL), Nunu & Willump (JGL), Singed (TOP), Zac (JGL), Zac (TOP)

| # | Build | Tags | Objets (ordre d'achat) | Coût | Stats totales |
|---|---|---|---|---|---|
| 1 | Standard | default | Mercury's Treads → Liandry's Torment → Hollow Radiance → Jak'Sho, The Protean → Force of Nature → Abyssal Mask | 15700 | PA 60, PV 1800, Armure 45, RM 205, Accél. 25, Ténacité % 30 |
| 2 | Contre AD | vs_ad | Plated Steelcaps → Liandry's Torment → Sunfire Aegis → Thornmail → Randuin's Omen → Jak'Sho, The Protean | 15250 | PA 60, PV 1500, Armure 270, RM 45, Accél. 10 |
| 3 | Contre AP | vs_ap | Mercury's Treads → Liandry's Torment → Hollow Radiance → Force of Nature → Kaenic Rookern → Spirit Visage | 15450 | PA 60, PV 1900, RM 245, Accél. 20, Ténacité % 30 |
| 4 | Combattant | skirmish | Mercury's Treads → Riftmaker → Liandry's Torment → Rylai's Crystal Scepter → Jak'Sho, The Protean → Spirit Visage | 15850 | PA 195, PV 1800, Armure 45, RM 115, Accél. 25, Ténacité % 30 |
| 5 | Ralentissements ⚠️mana | kite, mana_scaler | Boots of Swiftness → Rod of Ages → Rylai's Crystal Scepter → Liandry's Torment → Spirit Visage → Jak'Sho, The Protean | 15100 | PA 170, PV 1800, Armure 45, RM 95, Accél. 10 |
| 6 | Teamfight | teamfight | Mercury's Treads → Hollow Radiance → Jak'Sho, The Protean → Unending Despair → Abyssal Mask → Thornmail | 15150 | PV 1650, Armure 145, RM 175, Accél. 35, Ténacité % 30 |
| 7 | Anti-soins contre AD | vs_heal, vs_ad | Plated Steelcaps → Sunfire Aegis → Thornmail → Jak'Sho, The Protean → Unending Despair → Force of Nature | 15150 | PV 1650, Armure 220, RM 125, Accél. 20 |
| 8 | Full AP (burst) ⚠️mana | ahead, vs_squishy | Sorcerer's Shoes → Luden's Companion → Zhonya's Hourglass → Rabadon's Deathcap → Void Staff → Shadowflame | 16800 | PA 540, Armure 50, Accél. 10, Pén. magique % 40, Pén. magique fixe 27 |
| 9 | Accumulation de PV | long_game, split | Mercury's Treads → Heartsteel → Hollow Radiance → Spirit Visage → Warmog's Armor → Jak'Sho, The Protean | 16050 | PV 3170, Armure 45, RM 155, Accél. 20, Ténacité % 30 |
| 10 | En retard | behind | Mercury's Treads → Sunfire Aegis → Unending Despair → Force of Nature → Randuin's Omen → Thornmail | 14700 | PV 1650, Armure 225, RM 100, Accél. 20, Ténacité % 30 |

### TANK — Tank (top / jungle)

Encaisse, engage et protège.

**Champions** : Cho'Gath (TOP), Dr. Mundo (TOP), Dr. Mundo (JGL), K'Sante (TOP), Malphite (TOP), Maokai (TOP), Ornn (TOP), Poppy (TOP), Poppy (JGL), Rammus (JGL), Sejuani (JGL), Shen (TOP), Sion (TOP), Skarner (JGL), Skarner (TOP), Tahm Kench (TOP)

| # | Build | Tags | Objets (ordre d'achat) | Coût | Stats totales |
|---|---|---|---|---|---|
| 1 | Standard | default | Mercury's Treads → Sunfire Aegis → Jak'Sho, The Protean → Thornmail → Force of Nature → Unending Despair | 15200 | PV 1650, Armure 195, RM 145, Accél. 20, Ténacité % 30 |
| 2 | Contre AD ⚠️mana | vs_ad, vs_autoattack | Plated Steelcaps → Sunfire Aegis → Thornmail → Randuin's Omen → Frozen Heart → Dead Man's Plate | 14450 | PV 1200, Armure 355, Accél. 30 |
| 3 | Contre AP | vs_ap | Mercury's Treads → Hollow Radiance → Kaenic Rookern → Force of Nature → Spirit Visage → Jak'Sho, The Protean | 15650 | PV 1950, Armure 45, RM 290, Accél. 20, Ténacité % 30 |
| 4 | Accumulation de PV | long_game | Mercury's Treads → Heartsteel → Warmog's Armor → Spirit Visage → Jak'Sho, The Protean → Thornmail | 15700 | PV 2920, Armure 120, RM 115, Accél. 10, Ténacité % 30 |
| 5 | Engagement / roam | engage | Boots of Swiftness → Dead Man's Plate → Sunfire Aegis → Jak'Sho, The Protean → Force of Nature → Randuin's Omen | 15300 | PV 1800, Armure 225, RM 100, Accél. 10 |
| 6 | Anti-soins | vs_heal | Plated Steelcaps → Sunfire Aegis → Thornmail → Jak'Sho, The Protean → Unending Despair → Kaenic Rookern | 15250 | PV 1650, Armure 220, RM 150, Accél. 20 |
| 7 | Teamfight (zone) | teamfight | Mercury's Treads → Hollow Radiance → Unending Despair → Jak'Sho, The Protean → Abyssal Mask → Randuin's Omen | 15400 | PV 1850, Armure 145, RM 175, Accél. 35, Ténacité % 30 |
| 8 | Duel / split | split | Mercury's Treads → Heartsteel → Sunfire Aegis → Jak'Sho, The Protean → Spirit Visage → Thornmail | 15300 | PV 2150, Armure 170, RM 115, Accél. 20, Ténacité % 30 |
| 9 | Accélération / utilité | utility | Ionian Boots of Lucidity → Hollow Radiance → Iceborn Gauntlet → Jak'Sho, The Protean → Unending Despair → Force of Nature | 15400 | PV 1850, Armure 120, RM 165, Accél. 50 |
| 10 | En retard | behind | Mercury's Treads → Unending Despair → Randuin's Omen → Force of Nature → Thornmail → Kaenic Rookern | 14900 | PV 1700, Armure 175, RM 180, Accél. 10, Ténacité % 30 |

### TANK_SUPPORT — Support tank / engage

Engage, contrôles, protège ses carries.

**Champions** : Alistar (SUP), Amumu (SUP), Blitzcrank (SUP), Braum (SUP), Galio (SUP), Gragas (SUP), Leona (SUP), Malphite (SUP), Maokai (SUP), Nautilus (SUP), Poppy (SUP), Rell (SUP), Sett (SUP), Shen (SUP), Tahm Kench (SUP), Taric (SUP), Thresh (SUP), Zac (SUP)

| # | Build | Tags | Objets (ordre d'achat) | Coût | Stats totales |
|---|---|---|---|---|---|
| 1 | Standard ⚠️mana | default | Celestial Opposition → Mercury's Treads → Locket of the Iron Solari → Zeke's Convergence → Knight's Vow → Redemption | 10250 | PV 1100, Armure 90, RM 70, Accél. 45, Soins/boucliers % 10, Ténacité % 30 |
| 2 | Contre AD ⚠️mana | vs_ad | Celestial Opposition → Plated Steelcaps → Locket of the Iron Solari → Thornmail → Randuin's Omen → Frozen Heart | 11050 | PV 900, Armure 275, RM 25, Accél. 30 |
| 3 | Contre AP | vs_ap | Celestial Opposition → Mercury's Treads → Locket of the Iron Solari → Force of Nature → Abyssal Mask → Kaenic Rookern | 11800 | PV 1550, Armure 25, RM 225, Accél. 25, Ténacité % 30 |
| 4 | Engagement / roam | engage, ahead | Solstice Sleigh → Boots of Swiftness → Locket of the Iron Solari → Zeke's Convergence → Dead Man's Plate → Jak'Sho, The Protean | 11500 | PV 1400, Armure 150, RM 95, Accél. 20 |
| 5 | Vision | vision | Celestial Opposition → Ionian Boots of Lucidity → Locket of the Iron Solari → Vigilant Wardstone → Zeke's Convergence → Knight's Vow | 9900 | PV 1150, Armure 115, RM 80, Accél. 65 |
| 6 | Anti-soins | vs_heal | Celestial Opposition → Plated Steelcaps → Locket of the Iron Solari → Thornmail → Zeke's Convergence → Knight's Vow | 10350 | PV 1050, Armure 190, RM 50, Accél. 30 |
| 7 | Protection d'un carry ⚠️mana | peel, protect_carry | Celestial Opposition → Ionian Boots of Lucidity → Locket of the Iron Solari → Redemption → Knight's Vow → Mikael's Blessing | 10000 | PV 1050, Armure 65, RM 25, Accél. 65, Soins/boucliers % 22 |
| 8 | Dégâts (boule de neige) | ahead | Bloodsong → Mercury's Treads → Locket of the Iron Solari → Zeke's Convergence → Sunfire Aegis → Jak'Sho, The Protean | 11550 | PV 1400, Armure 145, RM 115, Accél. 30, Ténacité % 30 |
| 9 | Teamfight ⚠️mana | teamfight | Celestial Opposition → Mercury's Treads → Locket of the Iron Solari → Zeke's Convergence → Abyssal Mask → Redemption | 10600 | PV 1250, Armure 50, RM 115, Accél. 50, Soins/boucliers % 10, Ténacité % 30 |
| 10 | En retard | behind | Celestial Opposition → Mercury's Treads → Locket of the Iron Solari → Knight's Vow → Randuin's Omen → Force of Nature | 11250 | PV 1350, Armure 140, RM 100, Accél. 20, Ténacité % 30 |

### ENCHANTER — Enchanteur

Soins, boucliers et renforcements pour ses alliés.

**Champions** : Bard (SUP), Ivern (JGL), Janna (SUP), Karma (SUP), Lulu (SUP), Milio (SUP), Nami (SUP), Rakan (SUP), Renata Glasc (SUP), Seraphine (SUP), Sona (SUP), Soraka (SUP), Yuumi (SUP)

| # | Build | Tags | Objets (ordre d'achat) | Coût | Stats totales |
|---|---|---|---|---|---|
| 1 | Standard ⚠️mana | default | Dream Maker → Ionian Boots of Lucidity → Moonstone Renewer → Ardent Censer → Redemption → Mikael's Blessing | 9900 | PA 70, PV 850, Accél. 65, Soins/boucliers % 32 |
| 2 | Soins / boucliers max ⚠️mana | protect_carry | Dream Maker → Ionian Boots of Lucidity → Echoes of Helia → Ardent Censer → Staff of Flowing Water → Redemption | 9850 | PA 115, PV 600, Accél. 65, Soins/boucliers % 30 |
| 3 | Contre plongeurs ⚠️mana | vs_dive, vs_assassin | Celestial Opposition → Mercury's Treads → Locket of the Iron Solari → Mikael's Blessing → Redemption → Moonstone Renewer | 10250 | PA 25, PV 1050, Armure 25, RM 45, Accél. 60, Soins/boucliers % 22, Ténacité % 30 |
| 4 | Contre contrôles ⚠️mana | vs_cc | Dream Maker → Mercury's Treads → Mikael's Blessing → Moonstone Renewer → Redemption → Locket of the Iron Solari | 10250 | PA 25, PV 1050, Armure 25, RM 45, Accél. 60, Soins/boucliers % 22, Ténacité % 30 |
| 5 | Poke / mandat ⚠️mana | poke | Zaz'Zak's Realmspike → Ionian Boots of Lucidity → Imperial Mandate → Shurelya's Battlesong → Moonstone Renewer → Redemption | 9850 | PA 135, PV 600, Accél. 85, Soins/boucliers % 10 |
| 6 | Hypercarry (ADC à l'impact) ⚠️mana | protect_carry, onhit_carry | Dream Maker → Ionian Boots of Lucidity → Ardent Censer → Staff of Flowing Water → Moonstone Renewer → Redemption | 9850 | PA 105, PV 600, Accél. 65, Soins/boucliers % 30 |
| 7 | Anti-soins ⚠️mana | vs_heal | Dream Maker → Ionian Boots of Lucidity → Moonstone Renewer → Morellonomicon → Redemption → Mikael's Blessing | 10550 | PA 100, PV 1200, Accél. 80, Soins/boucliers % 22 |
| 8 | Engagement / roam ⚠️mana | engage | Solstice Sleigh → Boots of Swiftness → Shurelya's Battlesong → Locket of the Iron Solari → Redemption → Mikael's Blessing | 10000 | PA 50, PV 850, Armure 25, RM 25, Accél. 55, Soins/boucliers % 22 |
| 9 | Mana / combats longs ⚠️mana | long_game | Dream Maker → Ionian Boots of Lucidity → Dawncore → Moonstone Renewer → Redemption → Ardent Censer | 10100 | PA 115, PV 600, Accél. 50, Soins/boucliers % 36 |
| 10 | En retard / défensif ⚠️mana | behind | Celestial Opposition → Mercury's Treads → Locket of the Iron Solari → Mikael's Blessing → Redemption → Knight's Vow | 10350 | PV 1050, Armure 65, RM 45, Accél. 50, Soins/boucliers % 22, Ténacité % 30 |

### SUPPORT_MAGE — Support mage

Dégâts et contrôles depuis le rôle de support.

**Champions** : Anivia (SUP), Annie (SUP), Brand (SUP), Elise (SUP), Fiddlesticks (SUP), Heimerdinger (SUP), Hwei (SUP), Lux (SUP), Mel (SUP), Morgana (SUP), Neeko (SUP), Shaco (SUP), Swain (SUP), Veigar (SUP), Vel'Koz (SUP), Xerath (SUP), Zilean (SUP), Zyra (SUP)

| # | Build | Tags | Objets (ordre d'achat) | Coût | Stats totales |
|---|---|---|---|---|---|
| 1 | Standard | default | Zaz'Zak's Realmspike → Sorcerer's Shoes → Liandry's Torment → Rylai's Crystal Scepter → Zhonya's Hourglass → Void Staff | 12950 | PA 325, PV 900, Armure 50, Pén. magique % 40, Pén. magique fixe 12 |
| 2 | Burst ⚠️mana | ahead, vs_squishy | Zaz'Zak's Realmspike → Sorcerer's Shoes → Luden's Companion → Shadowflame → Rabadon's Deathcap → Void Staff | 13550 | PA 435, PV 200, Accél. 10, Pén. magique % 40, Pén. magique fixe 27 |
| 3 | Utilité ⚠️mana | utility | Zaz'Zak's Realmspike → Ionian Boots of Lucidity → Imperial Mandate → Malignance → Rylai's Crystal Scepter → Zhonya's Hourglass | 11700 | PA 320, PV 600, Armure 50, Accél. 50 |
| 4 | Contre AD / plongeurs | vs_ad, vs_dive | Zaz'Zak's Realmspike → Plated Steelcaps → Liandry's Torment → Zhonya's Hourglass → Rylai's Crystal Scepter → Void Staff | 13050 | PA 325, PV 900, Armure 75, Pén. magique % 40 |
| 5 | Contre AP | vs_ap | Zaz'Zak's Realmspike → Mercury's Treads → Liandry's Torment → Banshee's Veil → Rylai's Crystal Scepter → Void Staff | 12850 | PA 325, PV 900, RM 60, Pén. magique % 40, Ténacité % 30 |
| 6 | Anti-soins | vs_heal | Zaz'Zak's Realmspike → Sorcerer's Shoes → Liandry's Torment → Morellonomicon → Rylai's Crystal Scepter → Zhonya's Hourglass | 12800 | PA 305, PV 1250, Armure 50, Accél. 15, Pén. magique fixe 12 |
| 7 | Brûlure ⚠️mana | teamfight | Zaz'Zak's Realmspike → Sorcerer's Shoes → Blackfire Torch → Liandry's Torment → Rylai's Crystal Scepter → Void Staff | 12500 | PA 300, PV 900, Accél. 20, Pén. magique % 40, Pén. magique fixe 12 |
| 8 | Mage résistant | frontline | Zaz'Zak's Realmspike → Mercury's Treads → Liandry's Torment → Rylai's Crystal Scepter → Zhonya's Hourglass → Spirit Visage | 12800 | PA 230, PV 1300, Armure 50, RM 70, Accél. 10, Ténacité % 30 |
| 9 | Poke ⚠️mana | poke | Zaz'Zak's Realmspike → Ionian Boots of Lucidity → Luden's Companion → Horizon Focus → Malignance → Rabadon's Deathcap | 12600 | PA 445, PV 200, Accél. 65 |
| 10 | En retard | behind | Celestial Opposition → Mercury's Treads → Zhonya's Hourglass → Rylai's Crystal Scepter → Liandry's Torment → Banshee's Veil | 13100 | PA 335, PV 900, Armure 50, RM 60, Ténacité % 30 |

### AD_JUGGERNAUT — Mastodonte AD

Mêlée, très résistant, peu mobile, gros dégâts en combat prolongé.

**Champions** : Aatrox (TOP), Darius (TOP), Darius (JGL), Garen (TOP), Illaoi (TOP), Nasus (TOP), Olaf (JGL), Olaf (TOP), Sett (TOP), Shyvana (JGL), Trundle (TOP), Trundle (JGL), Udyr (JGL), Udyr (TOP), Urgot (TOP), Volibear (TOP), Volibear (JGL), Warwick (JGL), Warwick (TOP), Yorick (TOP)

| # | Build | Tags | Objets (ordre d'achat) | Coût | Stats totales |
|---|---|---|---|---|---|
| 1 | Standard | default | Plated Steelcaps → Sundered Sky → Black Cleaver → Sterak's Gage → Death's Dance → Spirit Visage | 16500 | AD 140, PV 1600, Armure 75, RM 50, Accél. 55, Ténacité % 20 |
| 2 | Briseur de foulées | kite, teamfight | Plated Steelcaps → Stridebreaker → Sterak's Gage → Death's Dance → Spirit Visage → Jak'Sho, The Protean | 16900 | AD 100, PV 1600, Armure 120, RM 95, Accél. 25, VA % 25, Ténacité % 20 |
| 3 | Contre AP | vs_ap | Mercury's Treads → Black Cleaver → Sterak's Gage → Spirit Visage → Force of Nature → Kaenic Rookern | 15850 | AD 40, PV 2000, RM 205, Accél. 30, Ténacité % 50 |
| 4 | Contre AD | vs_ad | Plated Steelcaps → Black Cleaver → Death's Dance → Randuin's Omen → Sterak's Gage → Thornmail | 15850 | AD 100, PV 1300, Armure 225, Accél. 35, Ténacité % 20 |
| 5 | Anti-soins | vs_heal | Plated Steelcaps → Black Cleaver → Chempunk Chainsword → Sterak's Gage → Death's Dance → Spirit Visage | 16500 | AD 145, PV 1650, Armure 75, RM 50, Accél. 60, Ténacité % 20 |
| 6 | Accumulation de PV | long_game, frontline | Mercury's Treads → Heartsteel → Overlord's Bloodmail → Sterak's Gage → Spirit Visage → Jak'Sho, The Protean | 16650 | AD 30, PV 2600, Armure 45, RM 115, Accél. 10, Ténacité % 50 |
| 7 | Split push | split | Plated Steelcaps → Trinity Force → Hullbreaker → Titanic Hydra → Sterak's Gage → Death's Dance | 17333 | AD 176, PV 1833, Armure 75, Accél. 30, VA % 30, Ténacité % 20 |
| 8 | Contre tanks | vs_tanks | Plated Steelcaps → Black Cleaver → Titanic Hydra → Sundered Sky → Sterak's Gage → Spirit Visage | 16500 | AD 120, PV 2200, Armure 25, RM 50, Accél. 40, Ténacité % 20 |
| 9 | Soins personnels | self_heal | Plated Steelcaps → Eclipse → Sundered Sky → Sterak's Gage → Death's Dance → Spirit Visage | 16400 | AD 160, PV 1200, Armure 75, RM 50, Accél. 50, Ténacité % 20 |
| 10 | En retard / première ligne | behind | Mercury's Treads → Spirit Visage → Death's Dance → Sterak's Gage → Jak'Sho, The Protean → Randuin's Omen | 16350 | AD 60, PV 1500, Armure 170, RM 115, Accél. 25, Ténacité % 50 |

### AD_DIVER — Plongeur AD

Mobile, plonge sur les carries adverses.

**Champions** : Ambessa (TOP), Ambessa (JGL), Briar (JGL), Camille (TOP), Gnar (TOP), Hecarim (JGL), Jarvan IV (JGL), Kled (TOP), Lee Sin (JGL), Nocturne (JGL), Pantheon (TOP), Pantheon (JGL), Rek'Sai (JGL), Renekton (TOP), Riven (TOP), Vi (JGL), Wukong (JGL), Wukong (TOP), Xin Zhao (JGL), Zaahen (TOP), Zaahen (JGL)

| # | Build | Tags | Objets (ordre d'achat) | Coût | Stats totales |
|---|---|---|---|---|---|
| 1 | Standard | default | Plated Steelcaps → Trinity Force → Sterak's Gage → Black Cleaver → Death's Dance → Spirit Visage | 16733 | AD 136, PV 1533, Armure 75, RM 50, Accél. 60, VA % 30, Ténacité % 20 |
| 2 | Hexplaque (ultime fréquent) | ult_centric | Plated Steelcaps → Experimental Hexplate → Black Cleaver → Sterak's Gage → Death's Dance → Guardian Angel | 16900 | AD 195, PV 1250, Armure 120, Accél. 35, VA % 20, Ténacité % 20 |
| 3 | Burst | ahead, vs_squishy | Ionian Boots of Lucidity → Eclipse → Black Cleaver → Sterak's Gage → Death's Dance → Edge of Night | 16300 | AD 210, PV 1050, Armure 50, Accél. 65, Létalité 15, Ténacité % 20 |
| 4 | Contre AP | vs_ap | Mercury's Treads → Black Cleaver → Sterak's Gage → Spirit Visage → Force of Nature → Death's Dance | 16250 | AD 100, PV 1600, Armure 50, RM 125, Accél. 45, Ténacité % 50 |
| 5 | Contre AD | vs_ad | Plated Steelcaps → Black Cleaver → Death's Dance → Randuin's Omen → Sterak's Gage → Jak'Sho, The Protean | 16600 | AD 100, PV 1500, Armure 195, RM 45, Accél. 35, Ténacité % 20 |
| 6 | Anti-soins | vs_heal | Plated Steelcaps → Black Cleaver → Chempunk Chainsword → Sterak's Gage → Death's Dance → Spirit Visage | 16500 | AD 145, PV 1650, Armure 75, RM 50, Accél. 60, Ténacité % 20 |
| 7 | Sorts (Shojin) | spell_heavy | Ionian Boots of Lucidity → Spear of Shojin → Black Cleaver → Sterak's Gage → Death's Dance → Sundered Sky | 16600 | AD 185, PV 1650, Armure 50, Accél. 85, Ténacité % 20 |
| 8 | Contre tanks | vs_tanks | Plated Steelcaps → Trinity Force → Blade of the Ruined King → Black Cleaver → Sterak's Gage → Death's Dance | 17233 | AD 176, PV 1133, Armure 75, Accél. 50, VA % 55, Vol de vie % 10, Ténacité % 20 |
| 9 | Engagement en équipe | engage, teamfight | Boots of Swiftness → Trailblazer → Black Cleaver → Sterak's Gage → Death's Dance → Spirit Visage | 15600 | AD 100, PV 1450, Armure 90, RM 50, Accél. 45, Ténacité % 20 |
| 10 | En retard | behind | Mercury's Treads → Sterak's Gage → Death's Dance → Spirit Visage → Jak'Sho, The Protean → Randuin's Omen | 16350 | AD 60, PV 1500, Armure 170, RM 115, Accél. 25, Ténacité % 50 |

### AD_SKIRMISHER — Duelliste AD

Gagne les 1v1 et le split push sur la durée.

**Champions** : Bel'Veth (JGL), Fiora (TOP), Irelia (TOP), Irelia (MID), Jax (TOP), Jax (JGL), Master Yi (JGL), Viego (JGL)

| # | Build | Tags | Objets (ordre d'achat) | Coût | Stats totales |
|---|---|---|---|---|---|
| 1 | Standard | default | Plated Steelcaps → Ravenous Hydra → Trinity Force → Sterak's Gage → Death's Dance → Guardian Angel | 17533 | AD 216, PV 733, Armure 120, Accél. 45, VA % 30, Vol de vie % 12, Ténacité % 20 |
| 2 | À l'impact | onhit | Berserker's Greaves → Blade of the Ruined King → Guinsoo's Rageblade → Wit's End → Terminus → Sterak's Gage | 16300 | PA 30, AD 100, PV 400, RM 45, VA % 170, Vol de vie % 10, Ténacité % 40 |
| 3 | Contre AP | vs_ap | Mercury's Treads → Blade of the Ruined King → Trinity Force → Wit's End → Maw of Malmortius → Death's Dance | 16983 | AD 196, PV 333, Armure 50, RM 105, Accél. 45, VA % 105, Vol de vie % 10, Ténacité % 50 |
| 4 | Contre AD | vs_ad | Plated Steelcaps → Blade of the Ruined King → Trinity Force → Death's Dance → Randuin's Omen → Sterak's Gage | 16933 | AD 136, PV 1083, Armure 150, Accél. 30, VA % 55, Vol de vie % 10, Ténacité % 20 |
| 5 | Split push | split | Plated Steelcaps → Trinity Force → Hullbreaker → Ravenous Hydra → Death's Dance → Sterak's Gage | 17333 | AD 201, PV 1233, Armure 75, Accél. 45, VA % 30, Vol de vie % 12, Ténacité % 20 |
| 6 | Contre tanks | vs_tanks | Berserker's Greaves → Blade of the Ruined King → Terminus → Trinity Force → Sterak's Gage → Death's Dance | 17133 | AD 166, PV 733, Armure 50, Accél. 30, VA % 125, Vol de vie % 10, Ténacité % 20 |
| 7 | Anti-soins | vs_heal | Plated Steelcaps → Trinity Force → Chempunk Chainsword → Ravenous Hydra → Death's Dance → Sterak's Gage | 17433 | AD 206, PV 1183, Armure 75, Accél. 60, VA % 30, Vol de vie % 12, Ténacité % 20 |
| 8 | Boule de neige | ahead | Plated Steelcaps → Eclipse → Ravenous Hydra → Hubris → Sterak's Gage → Guardian Angel | 16800 | AD 240, PV 400, Armure 70, Accél. 40, Létalité 18, Vol de vie % 12, Ténacité % 20 |
| 9 | Kraken (attaques rapides) | onhit, ahead | Berserker's Greaves → Kraken Slayer → Blade of the Ruined King → Guinsoo's Rageblade → Death's Dance → Guardian Angel | 16800 | PA 30, AD 230, Armure 95, Accél. 15, VA % 125, Vol de vie % 10 |
| 10 | En retard | behind | Mercury's Treads → Trinity Force → Sterak's Gage → Death's Dance → Spirit Visage → Jak'Sho, The Protean | 16983 | AD 96, PV 1483, Armure 95, RM 115, Accél. 40, VA % 30, Ténacité % 50 |

### AD_CRIT_SKIRMISHER — Duelliste critique (mêlée)

Combattant mêlée qui monte le coup critique.

**Champions** : Gangplank (TOP), Nilah (ADC), Tryndamere (TOP), Yasuo (MID), Yasuo (TOP), Yasuo (ADC), Yone (MID), Yone (TOP)

| # | Build | Tags | Objets (ordre d'achat) | Coût | Stats totales |
|---|---|---|---|---|---|
| 1 | Standard | default | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Bloodthirster → Death's Dance → Guardian Angel | 17450 | AD 315, Armure 95, Accél. 15, VA % 70, Crit % 25, Vol de vie % 15 |
| 2 | Navori (sorts) | spell_heavy | Berserker's Greaves → Navori Flickerblade → Infinity Edge → Bloodthirster → Death's Dance → Guardian Angel | 17100 | AD 260, Armure 95, Accél. 15, VA % 75, Crit % 50, Vol de vie % 15 |
| 3 | Contre tanks | vs_tanks | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Blade of the Ruined King → Guardian Angel | 17050 | AD 250, Armure 45, VA % 95, Crit % 50, Pén. armure % 40, Vol de vie % 10 |
| 4 | Contre AP | vs_ap | Mercury's Treads → Yun Tal Wildarrows → Infinity Edge → Wit's End → Maw of Malmortius → Bloodthirster | 17000 | AD 260, RM 105, Accél. 15, VA % 85, Crit % 25, Vol de vie % 15, Ténacité % 50 |
| 5 | Contre AD | vs_ad | Plated Steelcaps → Yun Tal Wildarrows → Infinity Edge → Death's Dance → Randuin's Omen → Guardian Angel | 16850 | AD 235, PV 350, Armure 195, Accél. 15, VA % 35, Crit % 25 |
| 6 | Anti-soins | vs_heal | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Mortal Reminder → Death's Dance → Guardian Angel | 17350 | AD 270, Armure 95, Accél. 15, VA % 70, Crit % 50, Pén. armure % 35 |
| 7 | Boule de neige | ahead | Berserker's Greaves → The Collector → Infinity Edge → Yun Tal Wildarrows → Bloodthirster → Guardian Angel | 17150 | AD 305, Armure 45, VA % 70, Crit % 50, Létalité 10, Vol de vie % 15 |
| 8 | Sorts + critique (Gangplank) ⚠️mana | spell_heavy, mana_scaler | Ionian Boots of Lucidity → Trinity Force → Essence Reaver → Infinity Edge → Navori Flickerblade → Lord Dominik's Regards | 16333 | AD 196, PV 333, Accél. 45, VA % 70, Crit % 100, Pén. armure % 40 |
| 9 | Teamfight (Statikk) | teamfight | Berserker's Greaves → Statikk Shiv → Infinity Edge → Navori Flickerblade → Bloodthirster → Death's Dance | 16600 | AD 250, Armure 50, Accél. 15, VA % 105, Crit % 50, Vol de vie % 15 |
| 10 | En retard | behind | Mercury's Treads → Yun Tal Wildarrows → Infinity Edge → Death's Dance → Sterak's Gage → Guardian Angel | 17400 | AD 235, PV 400, Armure 95, RM 20, Accél. 15, VA % 35, Crit % 25, Ténacité % 50 |

### AD_ASSASSIN — Assassin AD (létalité)

Burst physique sur cible isolée.

**Champions** : Kayn (JGL), Kha'Zix (JGL), Naafiri (MID), Pantheon (SUP), Pantheon (MID), Pyke (SUP), Qiyana (MID), Qiyana (JGL), Rengar (JGL), Rengar (TOP), Shaco (JGL), Talon (MID), Talon (JGL), Zed (MID), Zed (JGL)

| # | Build | Tags | Objets (ordre d'achat) | Coût | Stats totales |
|---|---|---|---|---|---|
| 1 | Standard | default | Ionian Boots of Lucidity → Profane Hydra → Youmuu's Ghostblade → Edge of Night → Serylda's Grudge → Guardian Angel | 15750 | AD 260, PV 250, Armure 45, Accél. 40, Létalité 51, Pén. armure % 35 |
| 2 | Boule de neige | ahead | Ionian Boots of Lucidity → Hubris → Profane Hydra → Opportunity → Serylda's Grudge → Guardian Angel | 15650 | AD 270, Armure 45, Accél. 50, Létalité 54, Pén. armure % 35 |
| 3 | Contre armure | vs_tanks, vs_armor | Ionian Boots of Lucidity → Profane Hydra → Voltaic Cyclosword → Serylda's Grudge → Axiom Arc → Guardian Angel | 15700 | AD 265, Armure 45, Accél. 70, Létalité 54, Pén. armure % 35 |
| 4 | Contre boucliers | vs_shields | Ionian Boots of Lucidity → Profane Hydra → Serpent's Fang → Youmuu's Ghostblade → Serylda's Grudge → Edge of Night | 15050 | AD 260, PV 250, Accél. 40, Létalité 66, Pén. armure % 35 |
| 5 | Contre AP | vs_ap | Mercury's Treads → Profane Hydra → Youmuu's Ghostblade → Edge of Night → Maw of Malmortius → Serylda's Grudge | 16000 | AD 265, PV 250, RM 60, Accél. 40, Létalité 51, Pén. armure % 35, Ténacité % 30 |
| 6 | Contre AD | vs_ad | Plated Steelcaps → Profane Hydra → Youmuu's Ghostblade → Death's Dance → Serylda's Grudge → Guardian Angel | 16350 | AD 270, Armure 120, Accél. 40, Létalité 36, Pén. armure % 35 |
| 7 | Anti-soins | vs_heal | Ionian Boots of Lucidity → Profane Hydra → Youmuu's Ghostblade → Chempunk Chainsword → Serylda's Grudge → Edge of Night | 15650 | AD 250, PV 700, Accél. 55, Létalité 51, Pén. armure % 35 |
| 8 | Réinitialisations (ultime) | ult_centric, teamfight | Ionian Boots of Lucidity → Axiom Arc → Profane Hydra → Opportunity → Serylda's Grudge → Edge of Night | 15200 | AD 260, PV 250, Accél. 60, Létalité 69, Pén. armure % 35 |
| 9 | Assassin-combattant | skirmish, frontline | Ionian Boots of Lucidity → Eclipse → Profane Hydra → Black Cleaver → Death's Dance → Sterak's Gage | 16150 | AD 215, PV 800, Armure 50, Accél. 75, Létalité 18, Ténacité % 20 |
| 10 | En retard | behind | Plated Steelcaps → Youmuu's Ghostblade → Edge of Night → Death's Dance → Guardian Angel → Maw of Malmortius | 16600 | AD 280, PV 250, Armure 120, RM 40, Accél. 30, Létalité 33 |

### ADC_CRIT — Tireur critique

Dégâts physiques continus à distance.

**Champions** : Akshan (MID), Akshan (TOP), Aphelios (ADC), Ashe (ADC), Caitlyn (ADC), Draven (ADC), Jinx (ADC), Kindred (JGL), Miss Fortune (ADC), Samira (ADC), Senna (ADC), Sivir (ADC), Tristana (ADC), Tristana (MID), Twitch (ADC), Xayah (ADC), Zeri (ADC)

| # | Build | Tags | Objets (ordre d'achat) | Coût | Stats totales |
|---|---|---|---|---|---|
| 1 | Standard | default | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Phantom Dancer → Lord Dominik's Regards → Bloodthirster | 16700 | AD 235, VA % 135, Crit % 75, Pén. armure % 40, Vol de vie % 15 |
| 2 | Kraken | skirmish | Berserker's Greaves → Kraken Slayer → Infinity Edge → Phantom Dancer → Lord Dominik's Regards → Bloodthirster | 16700 | AD 225, VA % 140, Crit % 75, Pén. armure % 40, Vol de vie % 15 |
| 3 | Portée | poke, kite | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Rapid Firecannon → Lord Dominik's Regards → Bloodthirster | 16700 | AD 235, VA % 105, Crit % 75, Pén. armure % 40, Vol de vie % 15 |
| 4 | Contre tanks | vs_tanks | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Lord Dominik's Regards → Blade of the Ruined King → Bloodthirster | 17250 | AD 275, VA % 95, Crit % 50, Pén. armure % 40, Vol de vie % 25 |
| 5 | Contre assassins / plongeurs | vs_assassin, vs_dive, vs_ad | Plated Steelcaps → Yun Tal Wildarrows → Infinity Edge → Phantom Dancer → Guardian Angel → Bloodthirster | 16900 | AD 255, Armure 70, VA % 100, Crit % 50, Vol de vie % 15 |
| 6 | Contre AP | vs_ap | Mercury's Treads → Yun Tal Wildarrows → Infinity Edge → Phantom Dancer → Mercurial Scimitar → Bloodthirster | 16950 | AD 250, RM 55, VA % 100, Crit % 50, Vol de vie % 25, Ténacité % 30 |
| 7 | Anti-soins | vs_heal | Berserker's Greaves → Yun Tal Wildarrows → Infinity Edge → Mortal Reminder → Phantom Dancer → Bloodthirster | 16900 | AD 235, VA % 135, Crit % 75, Pén. armure % 35, Vol de vie % 15 |
| 8 | Teamfight (zone) | teamfight | Berserker's Greaves → Statikk Shiv → Infinity Edge → Runaan's Hurricane → Lord Dominik's Regards → Bloodthirster | 16400 | AD 225, VA % 105, Crit % 75, Pén. armure % 40, Vol de vie % 15 |
| 9 | Boule de neige | ahead | Berserker's Greaves → The Collector → Infinity Edge → Phantom Dancer → Lord Dominik's Regards → Bloodthirster | 16700 | AD 230, VA % 100, Crit % 100, Létalité 10, Pén. armure % 40, Vol de vie % 15 |
| 10 | Contre contrôles / suppression | vs_cc, vs_suppression | Mercury's Treads → Yun Tal Wildarrows → Infinity Edge → Mercurial Scimitar → Lord Dominik's Regards → Guardian Angel | 17200 | AD 260, Armure 45, RM 55, VA % 35, Crit % 50, Pén. armure % 40, Vol de vie % 10, Ténacité % 30 |

### ADC_ONHIT — Tireur à l'impact

Dégâts portés par la vitesse d'attaque et les effets à l'impact.

**Champions** : Kai'Sa (ADC), Kalista (ADC), Kog'Maw (ADC), Vayne (ADC), Vayne (TOP), Yunara (ADC)

| # | Build | Tags | Objets (ordre d'achat) | Coût | Stats totales |
|---|---|---|---|---|---|
| 1 | Standard | default | Berserker's Greaves → Blade of the Ruined King → Guinsoo's Rageblade → Wit's End → Terminus → Guardian Angel | 16300 | PA 30, AD 155, Armure 45, RM 45, VA % 170, Vol de vie % 10, Ténacité % 20 |
| 2 | Kraken | skirmish | Berserker's Greaves → Kraken Slayer → Blade of the Ruined King → Guinsoo's Rageblade → Terminus → Guardian Angel | 16500 | PA 30, AD 200, Armure 45, VA % 160, Vol de vie % 10 |
| 3 | Contre AP | vs_ap | Mercury's Treads → Blade of the Ruined King → Guinsoo's Rageblade → Wit's End → Maw of Malmortius → Terminus | 16350 | PA 30, AD 160, RM 105, Accél. 15, VA % 135, Vol de vie % 10, Ténacité % 50 |
| 4 | Contre AD | vs_ad, vs_dive | Plated Steelcaps → Blade of the Ruined King → Guinsoo's Rageblade → Terminus → Guardian Angel → Bloodthirster | 17000 | PA 30, AD 235, Armure 70, VA % 85, Vol de vie % 25 |
| 5 | Contre tanks | vs_tanks | Berserker's Greaves → Blade of the Ruined King → Guinsoo's Rageblade → Terminus → Kraken Slayer → Wit's End | 16100 | PA 30, AD 145, RM 45, VA % 210, Vol de vie % 10, Ténacité % 20 |
| 6 | Anti-soins | vs_heal | Berserker's Greaves → Blade of the Ruined King → Guinsoo's Rageblade → Mortal Reminder → Wit's End → Guardian Angel | 16600 | PA 30, AD 160, Armure 45, RM 45, VA % 135, Crit % 25, Pén. armure % 35, Vol de vie % 10, Ténacité % 20 |
| 7 | Hybride AP | ap_variant | Berserker's Greaves → Nashor's Tooth → Guinsoo's Rageblade → Rabadon's Deathcap → Void Staff → Zhonya's Hourglass | 16750 | PA 440, AD 30, Armure 50, Accél. 15, VA % 110, Pén. magique % 40 |
| 8 | Boule de neige | ahead | Berserker's Greaves → Kraken Slayer → Guinsoo's Rageblade → Blade of the Ruined King → Lord Dominik's Regards → Bloodthirster | 16800 | PA 30, AD 230, VA % 125, Crit % 25, Pén. armure % 40, Vol de vie % 25 |
| 9 | Contre contrôles / suppression | vs_cc, vs_suppression | Mercury's Treads → Blade of the Ruined King → Guinsoo's Rageblade → Mercurial Scimitar → Wit's End → Guardian Angel | 16650 | PA 30, AD 175, Armure 45, RM 100, VA % 100, Vol de vie % 20, Ténacité % 50 |
| 10 | En retard | behind | Plated Steelcaps → Blade of the Ruined King → Wit's End → Guardian Angel → Mercurial Scimitar → Guinsoo's Rageblade | 16600 | PA 30, AD 175, Armure 70, RM 80, VA % 100, Vol de vie % 20, Ténacité % 20 |

### ADC_CASTER — Tireur à sorts / létalité

Tireur qui fait ses dégâts avec ses sorts.

**Champions** : Ashe (SUP), Corki (MID), Ezreal (ADC), Graves (JGL), Jayce (TOP), Jayce (MID), Jhin (ADC), Lucian (ADC), Lucian (MID), Quinn (TOP), Senna (SUP), Smolder (ADC), Smolder (MID), Varus (ADC), Varus (MID)

| # | Build | Tags | Objets (ordre d'achat) | Coût | Stats totales |
|---|---|---|---|---|---|
| 1 | Standard (mana) ⚠️mana | default, mana_scaler | Ionian Boots of Lucidity → Manamune → Trinity Force → Serylda's Grudge → Spear of Shojin → Guardian Angel | 16433 | AD 216, PV 783, Armure 45, Accél. 85, VA % 30, Pén. armure % 35 |
| 2 | Létalité | vs_squishy | Ionian Boots of Lucidity → Youmuu's Ghostblade → Opportunity → Axiom Arc → Serylda's Grudge → Edge of Night | 15150 | AD 260, PV 250, Accél. 50, Létalité 69, Pén. armure % 35 |
| 3 | Critique + sorts ⚠️mana | spell_heavy | Ionian Boots of Lucidity → Essence Reaver → Navori Flickerblade → Infinity Edge → Lord Dominik's Regards → Bloodthirster | 16400 | AD 240, Accél. 30, VA % 40, Crit % 100, Pén. armure % 40, Vol de vie % 15 |
| 4 | Contre tanks ⚠️mana | vs_tanks | Ionian Boots of Lucidity → Manamune → Trinity Force → Blade of the Ruined King → Lord Dominik's Regards → Guardian Angel | 16633 | AD 201, PV 333, Armure 45, Accél. 45, VA % 55, Crit % 25, Pén. armure % 40, Vol de vie % 10 |
| 5 | Contre AD / plongeurs ⚠️mana | vs_ad, vs_dive | Plated Steelcaps → Manamune → Trinity Force → Serylda's Grudge → Guardian Angel → Death's Dance | 16933 | AD 231, PV 333, Armure 120, Accél. 60, VA % 30, Pén. armure % 35 |
| 6 | Contre AP ⚠️mana | vs_ap | Mercury's Treads → Manamune → Trinity Force → Maw of Malmortius → Serylda's Grudge → Mercurial Scimitar | 16783 | AD 226, PV 333, RM 95, Accél. 60, VA % 30, Pén. armure % 35, Vol de vie % 10, Ténacité % 30 |
| 7 | Anti-soins ⚠️mana | vs_heal | Ionian Boots of Lucidity → Manamune → Trinity Force → Mortal Reminder → Spear of Shojin → Guardian Angel | 16733 | AD 206, PV 783, Armure 45, Accél. 70, VA % 30, Crit % 25, Pén. armure % 35 |
| 8 | Boule de neige | ahead | Ionian Boots of Lucidity → The Collector → Youmuu's Ghostblade → Infinity Edge → Serylda's Grudge → Edge of Night | 16150 | AD 265, PV 250, Accél. 30, Crit % 50, Létalité 43, Pén. armure % 35 |
| 9 | Poke ⚠️mana | poke | Ionian Boots of Lucidity → Manamune → Eclipse → Spear of Shojin → Serylda's Grudge → Axiom Arc | 15550 | AD 240, PV 450, Accél. 105, Létalité 18, Pén. armure % 35 |
| 10 | En retard ⚠️mana | behind | Mercury's Treads → Manamune → Trinity Force → Maw of Malmortius → Guardian Angel → Edge of Night | 16783 | AD 236, PV 583, Armure 45, RM 60, Accél. 45, VA % 30, Létalité 15, Ténacité % 30 |


## 4. Moteur de règles : choisir et ajuster le build

### 4.1 Algorithme (à suivre dans cet ordre)

1. **Identifier le profil** du champion joué pour son rôle (table des champions, section 6). Si le rôle n'est pas listé, prendre le premier profil du champion.
2. **Analyser l'équipe adverse** : compter les tags des 5 champions adverses (section 4.2) et déduire les « situations » actives.
3. **Choisir le build de base** : parmi les 10 builds du profil, prendre celui dont les `tags` correspondent au plus grand nombre de situations actives (priorité dans l'ordre de la section 4.2). S'il n'y a aucune correspondance, prendre `default`.
4. **Appliquer les ajustements** de la section 4.3 (remplacements objet par objet), au maximum 2 changements par build pour garder sa cohérence.
5. **Adapter au déroulé de la partie** (section 4.4) : ordre d'achat, objet suivant, revente.
6. **Valider** : un seul objet par groupe exclusif (section 2.2), pas d'objet « mana uniquement » si la ressource du champion n'est pas MANA, une seule paire de bottes, un seul objet de support.

### 4.2 Situations détectées à partir de l'équipe adverse

```yaml
# n(tag) = nombre de champions adverses portant ce tag ; dmg = type de dégâts des adversaires
situations:
  vs_heal:        n(heal) >= 2  OR  un adversaire parmi [Soraka, Aatrox, Vladimir, Warwick, Dr. Mundo, Yuumi, Sylas, Swain, Briar]
  vs_shields:     n(shield) >= 2
  vs_ad:          nombre d'adversaires dmg=AD >= 3
  vs_ap:          nombre d'adversaires dmg=AP >= 3
  vs_tanks:       n(tank) >= 2
  vs_squishy:     n(tank) == 0
  vs_assassin:    n(assassin) >= 1   (priorité haute si l'assassin est dans la même voie ou en jungle)
  vs_dive:        n(dive) + n(engage) >= 2
  vs_autoattack:  n(aa) >= 2
  vs_cc:          n(cc) >= 3
  vs_suppression: n(suppression) >= 1   → Cimeterre mercuriel (ADC / duellistes) ou Sandales de Mercure (autres)
  vs_stealth:     n(stealth) >= 1        → pas d'objet : Balises de contrôle + Lentille d'oracle (à rappeler au joueur)
  vs_poke:        n(poke) >= 2           → objets de régénération / bouclier magique (Kaenic, Visage spirituel), engager vite
  vs_true:        n(true) >= 2           → privilégier les PV aux résistances
priorité: [vs_suppression, vs_heal, vs_assassin, vs_ap, vs_ad, vs_tanks, vs_shields, vs_cc, vs_dive, vs_autoattack, vs_squishy]
```

### 4.3 Ajustements objet par objet

```yaml
anti_soins:          # contre vs_heal : un seul objet de Blessures graves suffit, à acheter en 2e/3e objet
  MAGES_AP:          Morellonomicon (composant : Orbe d'oubli, à acheter tôt)
  AD_COMBATTANTS:    Tronçonneuse chimtech
  TIREURS:           Rappel mortel (composant : Appel du bourreau)
  TANKS:             Cotte épineuse (contre AD) ; sinon Rayonnement creux + composant Ronces
  SUPPORTS:          l'équipier le plus adapté l'achète ; sinon Cotte épineuse (tank) / Morellonomicon (mage)
contre_AD:           # remplacer d'abord l'objet le moins utile au profil
  bottes:            Coques en acier renforcé
  MAGES:             Sablier de Zhonya
  TIREURS:           Ange gardien, puis Soif-de-sang (bouclier)
  COMBATTANTS:       Danse de la mort, Présage de Randuin
  TANKS:             Cotte épineuse, Présage de Randuin, Cœur gelé (si mana)
contre_AP:
  bottes:            Sandales de Mercure
  MAGES:             Voile de la banshee
  TIREURS:           Cimeterre mercuriel ou Gueule de Malmortius
  COMBATTANTS:       Visage spirituel, Gueule de Malmortius (pas avec Gage de Sterak), Force de la nature
  TANKS:             Force de la nature, Rookern de Kaenic, Visage spirituel
contre_tanks:
  MAGES:             Tourment de Liandry + Bâton du vide (ou Malédiction sanglante si pas de Bâton du vide)
  TIREURS:           Salutations de Lord Dominik, Lame du roi déchu, Tueur de krakens
  COMBATTANTS:       Couperet noir, Lame du roi déchu, Hydre titanesque
  ASSASSINS_AD:      Rancune de Serylda (ou changer pour un profil combattant)
contre_boucliers:    Croc du serpent (AD) ; contre Lulu / Janna / Karma / Sett : à acheter en 2e objet
contre_assassins:    Sablier de Zhonya (AP), Ange gardien (AD à distance), Lisière de la nuit (AD contre burst magique), Coques en acier
contre_controles:    Sandales de Mercure ; Gage de Sterak (combattants) ; Cimeterre mercuriel (tireurs) ; Fin de l'esprit (à l'impact)
contre_attaques:     Cœur gelé, Présage de Randuin, Coques en acier ; contre Master Yi / Tryndamere : Sablier de Zhonya ou Cotte épineuse
contre_poke:         Rookern de Kaenic (contre poke AP), Visage spirituel, Sceptre de cristal de Rylai pour le kite ; engager plutôt que subir
champion_sans_mana:  retirer Manamune, Bâton de l'archange, Luden, Malignance, Torche de feu noir, Bâton séculaire, Approche hivernale, Cœur gelé, Faucheuse d'essence
                     → remplacer par l'objet équivalent sans mana (Luden → Choc de tempête ; Malignance → Tourment de Liandry ; Torche → Faiseur de failles ; Cœur gelé → Présage de Randuin)
```

### 4.4 Déroulé de la partie

```yaml
debut_de_partie:
  objet_de_depart:   mage → Anneau de Doran ; combattant AD → Lame de Doran ou Bouclier de Doran (contre distance) ; tank → Bouclier de Doran ; support → objet de quête (Runic Compass / World Atlas) ; jungle → familier de jungle
  voie_contre_AP:    acheter un Manteau anti-magie / Sandales de Mercure tôt
  voie_contre_AD:    acheter une Cotte de mailles / Coques tôt
  voie_contre_heal:  composant anti-soins (Orbe d'oubli / Appel du bourreau / Ronces) avant le 1er objet si l'adversaire de voie se soigne
en_avance (ahead):   # écart d'or > +1 500 ou au moins 2 éliminations d'avance en voie
  - prendre le build tagué « ahead » (Boule de neige) du profil
  - finir l'objet offensif en premier ; Voleur d'âmes de Mejai possible si le champion survit facilement
en_retard (behind):  # écart d'or < -1 500
  - prendre le build tagué « behind » ; acheter des composants défensifs (Brassard du chercheur, Hexdrinker, Cotte de mailles) avant les gros objets
  - viser les objets bon marché (< 2 600 or) qui donnent des résistances
partie_longue (long_game):  # > 30 min ou équipe qui monte mieux en puissance
  - objets à multiplicateur (Coiffe de Rabadon, Lame d'infini, Cœur d'acier) ; vendre l'objet de départ ; 6e objet défensif
split_push:          build tagué « split » ; Brise-coque pour les duellistes
teamfight:           objets de zone (Liandry, Rayonnement creux, Convergence de Zeke, Médaillon, Rédemption)
6e_emplacement_tardif: à 6 objets, remplacer les bottes de base par une version tier 3 (quête de rôle) ou revendre l'objet le moins utile contre l'objet situationnel manquant
```

### 4.5 Matchup de voie (adversaire direct)

```yaml
si adversaire direct tag "poke" et vous êtes mêlée:   Bouclier de Doran, Second souffle (runes), objets avec PV tôt
si adversaire direct tag "assassin":                  composant défensif tôt (Brassard du chercheur pour AP, Cotte de mailles pour AD)
si adversaire direct tag "tank" et vous faites des dégâts: pénétration en % tôt (Bâton du vide, Couperet noir, Lame du roi déchu)
si adversaire direct tag "heal":                      anti-soins en composant avant le 1er objet
si adversaire direct tag "split":                     Brise-coque / Hydre titanesque pour le contrer côté AD, ou téléportation
si adversaire direct tag "suppression":               garder Purge / Sandales de Mercure, Cimeterre mercuriel pour les tireurs
```

## 5. Exemples de raisonnement attendus

**Exemple 1 – Swain top contre Darius.** Équipe adverse : Darius (top), Lee Sin, Ahri, Jinx, Leona.
- Profil : Swain TOP → `MAGE_BATTLE`.
- Situations : 3 adversaires AD (Darius, Lee Sin, Jinx) → `vs_ad` ; Ahri a le tag `assassin` → `vs_assassin` ; `heal` = 1 seul, et Darius n'est pas dans la liste prioritaire → pas d'anti-soins obligatoire.
- Build de base : « Contre AD / plongeurs » → Plated Steelcaps → Liandry's Torment → Zhonya's Hourglass → Rylai's Crystal Scepter → Rabadon's Deathcap → Void Staff.
- Voie (4.5) : Darius a le tag `heal` → acheter un Oblivion Orb (composant anti-soins) au 1er retour si les échanges sont longs.

**Exemple 2 – Jinx ADC.** Équipe adverse : Malzahar, Zed, Soraka, Sejuani, Garen.
- Profil : `ADC_CRIT`. Situations, par priorité : `vs_suppression` (Malzahar), `vs_heal` (Soraka est dans la liste prioritaire), `vs_assassin` (Zed), `vs_ap` (Malzahar, Soraka, Sejuani), `vs_tanks` (Sejuani, Garen). Plusieurs builds correspondent à une seule situation : on départage par la priorité, donc `vs_suppression` l'emporte.
- `vs_ap` est déjà couvert par les Sandales de Mercure et le Cimeterre mercuriel. `vs_tanks` reste couvert par l'objet de pénétration d'armure.
- Build de base : « Contre contrôles / suppression » → Mercury's Treads → Yun Tal Wildarrows → Infinity Edge → Mercurial Scimitar → Lord Dominik's Regards → Guardian Angel.
- Ajustement anti-soins (tireur) : Mortal Reminder remplace Lord Dominik's Regards, car les deux sont du groupe Fatality et ne peuvent pas être combinés. Mortal Reminder garde 35 % de pénétration d'armure, donc l'effet contre les tanks est conservé.
- Build final : Mercury's Treads → Yun Tal Wildarrows → Infinity Edge → Mortal Reminder → Mercurial Scimitar → Guardian Angel.

**Exemple 3 – Ajustement en cours de partie.** Garen top, minute 18, −2 000 or, l'équipe adverse a 3 dégâts AP.
- Profil `AD_JUGGERNAUT`, situations `behind` + `vs_ap` → build « Contre AP » : Mercury's Treads → Black Cleaver → Sterak's Gage → Spirit Visage → Force of Nature → Kaenic Rookern.
- Règle « en retard » : acheter d'abord des composants défensifs bon marché (Null-Magic Mantle → Force of Nature) avant de finir le Couperet noir.
- Règle « champion sans mana » : Garen n'a pas de mana, et le build n'a aucun objet de mana → rien à retirer.

## 6. Les 173 champions

Ressource : MANA / NONE (sans mana : énergie de rage, sang, chaleur… → pas d'objets « mana ») / ENERGY. Portée : M = mêlée, R = distance. Tags = menaces qu'il représente quand il est **adverse** (utilisés par la section 4.2).

| Champion | Rôles → profil | Dégâts | Ressource | Portée | Tags de menace |
|---|---|---|---|---|---|
| Aatrox | TOP → AD_JUGGERNAUT | AD | NONE | M | heal dive |
| Ahri | MID → MAGE_BURST | AP | MANA | R | burst cc assassin |
| Akali | MID → AP_ASSASSIN, TOP → AP_ASSASSIN | HYB | ENERGY | M | assassin burst stealth |
| Akshan | MID → ADC_CRIT, TOP → ADC_CRIT | AD | MANA | R | aa assassin stealth |
| Alistar | SUP → TANK_SUPPORT | AP | MANA | M | cc engage tank heal |
| Ambessa | TOP → AD_DIVER, JGL → AD_DIVER | AD | ENERGY | M | dive shield |
| Amumu | JGL → AP_TANK, SUP → TANK_SUPPORT | AP | MANA | M | cc engage tank |
| Anivia | MID → MAGE_BATTLE, SUP → SUPPORT_MAGE | AP | MANA | R | cc poke |
| Annie | MID → MAGE_BURST, SUP → SUPPORT_MAGE | AP | MANA | R | burst cc engage shield |
| Aphelios | ADC → ADC_CRIT | AD | MANA | R | aa |
| Ashe | ADC → ADC_CRIT, SUP → ADC_CASTER | AD | MANA | R | aa cc poke |
| Aurelion Sol | MID → MAGE_BATTLE | AP | MANA | R | poke cc |
| Aurora | MID → AP_ASSASSIN, TOP → AP_ASSASSIN | AP | MANA | R | burst assassin |
| Azir | MID → AP_ONHIT | AP | MANA | R | poke cc |
| Bard | SUP → ENCHANTER | AP | MANA | R | cc heal |
| Bel'Veth | JGL → AD_SKIRMISHER | AD | NONE | M | aa true |
| Blitzcrank | SUP → TANK_SUPPORT | AP | MANA | M | cc engage shield |
| Brand | SUP → SUPPORT_MAGE, MID → MAGE_BATTLE, JGL → MAGE_BATTLE | AP | MANA | R | pct_hp poke burst |
| Braum | SUP → TANK_SUPPORT | AD | MANA | M | cc shield tank |
| Briar | JGL → AD_DIVER | AD | NONE | M | heal dive |
| Caitlyn | ADC → ADC_CRIT | AD | MANA | R | aa poke |
| Camille | TOP → AD_DIVER | AD | MANA | M | dive true split shield |
| Cassiopeia | MID → MAGE_BATTLE, TOP → MAGE_BATTLE | AP | MANA | R | cc heal |
| Cho'Gath | TOP → TANK, MID → AP_TANK | AP | MANA | M | tank cc true pct_hp |
| Corki | MID → ADC_CASTER | HYB | MANA | R | poke true |
| Darius | TOP → AD_JUGGERNAUT, JGL → AD_JUGGERNAUT | AD | MANA | M | heal true |
| Diana | JGL → AP_BRUISER, MID → AP_ASSASSIN | AP | MANA | M | dive burst shield |
| Dr. Mundo | TOP → TANK, JGL → TANK | AD | NONE | M | heal tank pct_hp |
| Draven | ADC → ADC_CRIT | AD | MANA | R | aa burst |
| Ekko | JGL → AP_ASSASSIN, MID → AP_ASSASSIN | AP | MANA | M | assassin burst heal |
| Elise | JGL → AP_ASSASSIN, SUP → SUPPORT_MAGE | AP | MANA | R | assassin cc pct_hp |
| Evelynn | JGL → AP_ASSASSIN | AP | MANA | M | assassin stealth burst |
| Ezreal | ADC → ADC_CASTER | AD | MANA | R | poke |
| Fiddlesticks | JGL → MAGE_BATTLE, SUP → SUPPORT_MAGE | AP | MANA | R | cc heal burst |
| Fiora | TOP → AD_SKIRMISHER | AD | MANA | M | true split heal |
| Fizz | MID → AP_ASSASSIN | AP | MANA | M | assassin burst |
| Galio | MID → AP_TANK, SUP → TANK_SUPPORT | AP | MANA | M | cc engage tank shield |
| Gangplank | TOP → AD_CRIT_SKIRMISHER | AD | MANA | M | poke true split |
| Garen | TOP → AD_JUGGERNAUT | AD | NONE | M | true tank shield |
| Gnar | TOP → AD_DIVER | AD | NONE | R | cc pct_hp tank |
| Gragas | JGL → AP_BRUISER, TOP → AP_BRUISER, SUP → TANK_SUPPORT | AP | MANA | M | cc engage heal |
| Graves | JGL → ADC_CASTER | AD | MANA | R | burst |
| Gwen | TOP → AP_ONHIT, JGL → AP_ONHIT | AP | MANA | M | true heal split |
| Hecarim | JGL → AD_DIVER | AD | MANA | M | engage dive heal |
| Heimerdinger | MID → MAGE_BATTLE, TOP → MAGE_BATTLE, SUP → SUPPORT_MAGE | AP | MANA | R | poke cc |
| Hwei | MID → MAGE_ARTILLERY, SUP → SUPPORT_MAGE | AP | MANA | R | poke cc |
| Illaoi | TOP → AD_JUGGERNAUT | AD | MANA | M | heal split |
| Irelia | TOP → AD_SKIRMISHER, MID → AD_SKIRMISHER | AD | MANA | M | dive heal true |
| Ivern | JGL → ENCHANTER | AP | MANA | R | shield cc |
| Janna | SUP → ENCHANTER | AP | MANA | R | shield cc heal |
| Jarvan IV | JGL → AD_DIVER | AD | MANA | M | engage cc |
| Jax | TOP → AD_SKIRMISHER, JGL → AD_SKIRMISHER | AD | MANA | M | aa split dive |
| Jayce | TOP → ADC_CASTER, MID → ADC_CASTER | AD | MANA | R | poke burst |
| Jhin | ADC → ADC_CASTER | AD | MANA | R | poke burst |
| Jinx | ADC → ADC_CRIT | AD | MANA | R | aa |
| K'Sante | TOP → TANK | AD | MANA | M | tank cc true |
| Kai'Sa | ADC → ADC_ONHIT | HYB | MANA | R | aa burst |
| Kalista | ADC → ADC_ONHIT | AD | MANA | R | aa |
| Karma | SUP → ENCHANTER, MID → MAGE_ARTILLERY, TOP → MAGE_ARTILLERY | AP | MANA | R | shield poke |
| Karthus | JGL → MAGE_BATTLE, MID → MAGE_BATTLE, ADC → MAGE_BATTLE | AP | MANA | R | burst |
| Kassadin | MID → AP_ASSASSIN | AP | MANA | M | assassin burst |
| Katarina | MID → AP_ASSASSIN | HYB | NONE | M | assassin burst |
| Kayle | TOP → AP_ONHIT, MID → AP_ONHIT | HYB | MANA | R | aa true heal |
| Kayn | JGL → AD_ASSASSIN | AD | MANA | M | assassin dive heal |
| Kennen | TOP → MAGE_BURST, MID → MAGE_BURST | AP | ENERGY | R | cc engage burst |
| Kha'Zix | JGL → AD_ASSASSIN | AD | MANA | M | assassin stealth burst |
| Kindred | JGL → ADC_CRIT | AD | MANA | R | aa pct_hp |
| Kled | TOP → AD_DIVER | AD | NONE | M | engage dive |
| Kog'Maw | ADC → ADC_ONHIT | HYB | MANA | R | aa pct_hp poke |
| LeBlanc | MID → MAGE_BURST | AP | MANA | R | assassin burst cc |
| Lee Sin | JGL → AD_DIVER | AD | ENERGY | M | dive shield |
| Leona | SUP → TANK_SUPPORT | AP | MANA | M | cc engage tank |
| Lillia | JGL → AP_BRUISER, TOP → AP_BRUISER | AP | MANA | M | cc pct_hp heal |
| Lissandra | MID → MAGE_BURST | AP | MANA | R | cc engage burst |
| Locke | MID → AP_ASSASSIN | AP | MANA | M | assassin burst heal |
| Lucian | ADC → ADC_CASTER, MID → ADC_CASTER | AD | MANA | R | burst dive |
| Lulu | SUP → ENCHANTER | AP | MANA | R | shield cc |
| Lux | SUP → SUPPORT_MAGE, MID → MAGE_ARTILLERY | AP | MANA | R | poke burst cc shield |
| Malphite | TOP → TANK, SUP → TANK_SUPPORT, MID → AP_TANK | AP | MANA | M | engage cc tank burst |
| Malzahar | MID → MAGE_BATTLE | AP | MANA | R | suppression |
| Maokai | SUP → TANK_SUPPORT, JGL → AP_TANK, TOP → TANK | AP | MANA | M | cc engage tank heal |
| Master Yi | JGL → AD_SKIRMISHER | AD | MANA | M | aa true heal |
| Mel | MID → MAGE_ARTILLERY, SUP → SUPPORT_MAGE | AP | MANA | R | poke burst |
| Milio | SUP → ENCHANTER | AP | MANA | R | heal shield |
| Miss Fortune | ADC → ADC_CRIT | AD | MANA | R | poke burst |
| Mordekaiser | TOP → AP_BRUISER, JGL → AP_BRUISER | AP | NONE | M | shield heal |
| Morgana | SUP → SUPPORT_MAGE, MID → MAGE_BATTLE, JGL → MAGE_BATTLE | AP | MANA | R | cc shield |
| Naafiri | MID → AD_ASSASSIN | AD | NONE | M | assassin burst |
| Nami | SUP → ENCHANTER | AP | MANA | R | heal cc |
| Nasus | TOP → AD_JUGGERNAUT | AD | MANA | M | heal split tank |
| Nautilus | SUP → TANK_SUPPORT | AP | MANA | M | cc engage tank shield |
| Neeko | MID → MAGE_BURST, SUP → SUPPORT_MAGE | AP | MANA | R | cc burst engage |
| Nidalee | JGL → AP_ASSASSIN | AP | MANA | R | poke assassin heal |
| Nilah | ADC → AD_CRIT_SKIRMISHER | AD | MANA | M | aa heal |
| Nocturne | JGL → AD_DIVER | AD | MANA | M | dive assassin |
| Nunu & Willump | JGL → AP_TANK | AP | MANA | M | cc engage tank heal |
| Olaf | JGL → AD_JUGGERNAUT, TOP → AD_JUGGERNAUT | AD | MANA | M | heal true dive |
| Orianna | MID → MAGE_BURST | AP | MANA | R | cc shield |
| Ornn | TOP → TANK | HYB | MANA | M | tank cc engage |
| Pantheon | SUP → AD_ASSASSIN, MID → AD_ASSASSIN, TOP → AD_DIVER, JGL → AD_DIVER | AD | MANA | M | burst dive |
| Poppy | TOP → TANK, JGL → TANK, SUP → TANK_SUPPORT | AD | MANA | M | cc tank |
| Pyke | SUP → AD_ASSASSIN | AD | MANA | M | cc assassin true heal |
| Qiyana | MID → AD_ASSASSIN, JGL → AD_ASSASSIN | AD | MANA | M | assassin burst cc |
| Quinn | TOP → ADC_CASTER | AD | MANA | R | aa split |
| Rakan | SUP → ENCHANTER | AP | MANA | M | cc engage heal |
| Rammus | JGL → TANK | HYB | MANA | M | tank cc engage |
| Rek'Sai | JGL → AD_DIVER | AD | NONE | M | dive true |
| Rell | SUP → TANK_SUPPORT | AP | MANA | M | cc engage tank |
| Renata Glasc | SUP → ENCHANTER | AP | MANA | R | shield cc |
| Renekton | TOP → AD_DIVER | AD | NONE | M | heal dive |
| Rengar | JGL → AD_ASSASSIN, TOP → AD_ASSASSIN | AD | NONE | M | assassin stealth burst |
| Riven | TOP → AD_DIVER | AD | NONE | M | dive shield burst |
| Rumble | TOP → MAGE_BATTLE, MID → MAGE_BATTLE, JGL → MAGE_BATTLE | AP | NONE | M | burst sustain_ap |
| Ryze | MID → MAGE_BATTLE, TOP → MAGE_BATTLE | AP | MANA | R | shield |
| Samira | ADC → ADC_CRIT | AD | MANA | R | aa heal burst |
| Sejuani | JGL → TANK | AP | MANA | M | cc engage tank |
| Senna | SUP → ADC_CASTER, ADC → ADC_CRIT | AD | MANA | R | heal shield poke |
| Seraphine | SUP → ENCHANTER, MID → MAGE_BURST, ADC → MAGE_BATTLE | AP | MANA | R | heal shield cc |
| Sett | TOP → AD_JUGGERNAUT, SUP → TANK_SUPPORT | AD | NONE | M | shield true |
| Shaco | JGL → AD_ASSASSIN, SUP → SUPPORT_MAGE | AD | MANA | M | assassin stealth |
| Shen | TOP → TANK, SUP → TANK_SUPPORT | AD | ENERGY | M | tank shield engage split |
| Shyvana | JGL → AD_JUGGERNAUT | HYB | NONE | M | dive |
| Singed | TOP → AP_TANK | AP | MANA | M | tank |
| Sion | TOP → TANK | AD | MANA | M | tank engage shield |
| Sivir | ADC → ADC_CRIT | AD | MANA | R | aa shield |
| Skarner | JGL → TANK, TOP → TANK | AD | MANA | M | suppression tank engage |
| Smolder | ADC → ADC_CASTER, MID → ADC_CASTER | AD | MANA | R | poke |
| Sona | SUP → ENCHANTER | AP | MANA | R | heal poke |
| Soraka | SUP → ENCHANTER | AP | MANA | R | heal |
| Swain | TOP → MAGE_BATTLE, MID → MAGE_BATTLE, SUP → SUPPORT_MAGE, ADC → MAGE_BATTLE | AP | MANA | R | heal cc sustain_ap |
| Sylas | MID → AP_BRUISER, JGL → AP_BRUISER, TOP → AP_BRUISER | AP | MANA | M | heal burst |
| Syndra | MID → MAGE_BURST | AP | MANA | R | burst cc |
| Tahm Kench | TOP → TANK, SUP → TANK_SUPPORT | AP | MANA | M | tank shield heal |
| Taliyah | JGL → MAGE_BATTLE, MID → MAGE_BATTLE | AP | MANA | R | cc burst |
| Talon | MID → AD_ASSASSIN, JGL → AD_ASSASSIN | AD | MANA | M | assassin burst |
| Taric | SUP → TANK_SUPPORT | AP | MANA | M | heal shield cc |
| Teemo | TOP → AP_ONHIT | AP | MANA | R | poke stealth |
| Thresh | SUP → TANK_SUPPORT | AP | MANA | R | cc engage shield |
| Tristana | ADC → ADC_CRIT, MID → ADC_CRIT | AD | MANA | R | aa burst |
| Trundle | TOP → AD_JUGGERNAUT, JGL → AD_JUGGERNAUT | AD | MANA | M | heal split pct_hp |
| Tryndamere | TOP → AD_CRIT_SKIRMISHER | AD | NONE | M | aa split heal |
| Twisted Fate | MID → MAGE_BURST | AP | MANA | R | cc burst |
| Twitch | ADC → ADC_CRIT | HYB | MANA | R | aa stealth |
| Udyr | JGL → AD_JUGGERNAUT, TOP → AD_JUGGERNAUT | HYB | MANA | M | shield |
| Urgot | TOP → AD_JUGGERNAUT | AD | MANA | R | suppression shield pct_hp |
| Varus | ADC → ADC_CASTER, MID → ADC_CASTER | AD | MANA | R | poke cc pct_hp |
| Vayne | ADC → ADC_ONHIT, TOP → ADC_ONHIT | AD | MANA | R | aa true stealth |
| Veigar | MID → MAGE_BURST, SUP → SUPPORT_MAGE | AP | MANA | R | burst cc |
| Vel'Koz | SUP → SUPPORT_MAGE, MID → MAGE_ARTILLERY | AP | MANA | R | poke true |
| Vex | MID → MAGE_BURST | AP | MANA | R | burst cc |
| Vi | JGL → AD_DIVER | AD | MANA | M | dive cc engage shield |
| Viego | JGL → AD_SKIRMISHER | AD | NONE | M | aa heal |
| Viktor | MID → MAGE_BATTLE | AP | MANA | R | poke shield |
| Vladimir | MID → MAGE_BATTLE, TOP → MAGE_BATTLE | AP | NONE | R | heal sustain_ap |
| Volibear | TOP → AD_JUGGERNAUT, JGL → AD_JUGGERNAUT | HYB | MANA | M | dive heal shield tank |
| Warwick | JGL → AD_JUGGERNAUT, TOP → AD_JUGGERNAUT | AD | MANA | M | heal suppression dive |
| Wukong | JGL → AD_DIVER, TOP → AD_DIVER | AD | MANA | M | engage cc stealth |
| Xayah | ADC → ADC_CRIT | AD | MANA | R | aa |
| Xerath | MID → MAGE_ARTILLERY, SUP → SUPPORT_MAGE | AP | MANA | R | poke |
| Xin Zhao | JGL → AD_DIVER | AD | MANA | M | dive heal |
| Yasuo | MID → AD_CRIT_SKIRMISHER, TOP → AD_CRIT_SKIRMISHER, ADC → AD_CRIT_SKIRMISHER | AD | NONE | M | aa shield |
| Yone | MID → AD_CRIT_SKIRMISHER, TOP → AD_CRIT_SKIRMISHER | HYB | NONE | M | aa shield dive |
| Yorick | TOP → AD_JUGGERNAUT | AD | MANA | M | split |
| Yunara | ADC → ADC_ONHIT | AD | MANA | R | aa |
| Yuumi | SUP → ENCHANTER | AP | MANA | R | heal |
| Zaahen | TOP → AD_DIVER, JGL → AD_DIVER | AD | MANA | M | heal dive |
| Zac | JGL → AP_TANK, TOP → AP_TANK, SUP → TANK_SUPPORT | AP | NONE | M | cc engage tank heal |
| Zed | MID → AD_ASSASSIN, JGL → AD_ASSASSIN | AD | ENERGY | M | assassin burst |
| Zeri | ADC → ADC_CRIT | AD | MANA | R | aa shield |
| Ziggs | MID → MAGE_ARTILLERY, ADC → MAGE_ARTILLERY | AP | MANA | R | poke |
| Zilean | SUP → SUPPORT_MAGE, MID → MAGE_ARTILLERY | AP | MANA | R | cc |
| Zoe | MID → MAGE_BURST | AP | MANA | R | burst poke cc |
| Zyra | SUP → SUPPORT_MAGE, JGL → MAGE_BATTLE | AP | MANA | R | poke cc |

### Cas particuliers

- **Cassiopeia** : Ne peut pas acheter de bottes : remplacer les bottes par un objet légendaire (Rylai, Zhonya, Liandry selon la règle).
- **Yuumi** : Attachée à un allié : bottes de lucidité ioniennes ou Mercure ; jamais d'objet de mêlée.
- **Kayle** : Montée en puissance : priorité Nashor + Rabadon ; à distance dès le niveau 6.
- **Senna** : Support : remplacer les bottes de l'ADC_CASTER par l'objet de support Zaz'Zak ou Bloodsong + bottes de lucidité.
- **Pyke** : Support : le 1er emplacement devient Bloodsong ; ne gagne pas de PV via objets (PV bonus convertis en AD).
- **Pantheon** : Support : profil AD_ASSASSIN avec Bloodsong en 1er objet.
- **Shaco** : Support : profil AP (SUPPORT_MAGE) avec boîtes ; jungle : AD_ASSASSIN.
- **Kai'Sa** : Hybride : ADC_ONHIT par défaut, ADC_CRIT ou build hybride AP selon la règle « ap_variant ».
- **Kog'Maw** : Hybride : ADC_ONHIT par défaut, build « Hybride AP » contre une équipe sans RM.
- **Katarina** : Hybride : AP_ASSASSIN, build « Hybride à l'impact » possible.
- **Corki** : Hybride : dégâts majoritairement magiques via son passif mais objets AD.
- **Ornn** : Améliore les objets de son équipe ; privilégier des objets améliorables.
- **Gangplank** : Utiliser le build « Sorts + critique (Gangplank) ».
- **Ashe** : Support possible : profil ADC_CASTER avec objet de support (Zaz'Zak).


## 7. Calcul détaillé : Swain (10 builds complets simulés)

Méthode : simulation des sorts de Swain (ratios du LoL Wiki) au **niveau 18**, sur un combat de 30 s contre un toplaner type avec objets (+1 200 PV, +90 armure, +75 RM). Runes : Conquérant, Présence d'esprit, Légende : hâte, Coup de grâce, Bande de flux de mana, Transcendance, éclats accélération / force adaptative / PV évolutifs. Toutes les combinaisons de 5 objets parmi les 24 meilleurs, avec 4 bottes possibles, ont été testées en respectant les groupes exclusifs. Les 10 builds retenus diffèrent d'au moins 2 objets entre eux. Score = dégâts + soins sur 30 s. Ces builds maximisent les dégâts et les soins : la survie n'est pas dans le score. Pour un Swain plus résistant, appliquer les règles de la section 4 (profil MAGE_BATTLE).

| # | Bottes | Objets | Coût | PA | PV | Accél. | Q par lancer | R sur 10 s | Dégâts / 30 s | Soins / 30 s | Score |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Sorcerer's Shoes | Void Staff + Lich Bane + Blackfire Torch + Shadowflame + Rabadon's Deathcap | 16500 | 766 | 2458 | 48 | 740 | 1551 | 24918 | 3355 | 28273 |
| 2 | Sorcerer's Shoes | Void Staff + Lich Bane + Rabadon's Deathcap + Archangel's Staff + Riftmaker | 16500 | 703 | 2808 | 68 | 639 | 1355 | 22854 | 5149 | 28003 |
| 3 | Ionian Boots of Lucidity | Void Staff + Lich Bane + Blackfire Torch + Rabadon's Deathcap + Riftmaker | 16200 | 727 | 2808 | 78 | 611 | 1289 | 22646 | 5091 | 27737 |
| 4 | Ionian Boots of Lucidity | Void Staff + Lich Bane + Shadowflame + Rabadon's Deathcap + Archangel's Staff | 16400 | 742 | 2458 | 68 | 673 | 1417 | 24062 | 3595 | 27657 |
| 5 | Sorcerer's Shoes | Void Staff + Lich Bane + Malignance + Shadowflame + Riftmaker | 16000 | 533 | 2808 | 58 | 639 | 1408 | 22530 | 4859 | 27390 |
| 6 | Sorcerer's Shoes | Lich Bane + Blackfire Torch + Bloodletter's Curse + Rabadon's Deathcap + Riftmaker | 16300 | 698 | 3208 | 78 | 588 | 1248 | 21803 | 5277 | 27080 |
| 7 | Sorcerer's Shoes | Void Staff + Lich Bane + Malignance + Rabadon's Deathcap + Nashor's Tooth | 16100 | 718 | 2458 | 58 | 600 | 1268 | 23657 | 3415 | 27072 |
| 8 | Sorcerer's Shoes | Lich Bane + Bloodletter's Curse + Shadowflame + Rabadon's Deathcap + Archangel's Staff | 16500 | 703 | 2858 | 68 | 642 | 1361 | 22943 | 3819 | 26762 |
| 9 | Sorcerer's Shoes | Lich Bane + Malignance + Cryptbloom + Rabadon's Deathcap + Riftmaker | 16300 | 692 | 2808 | 78 | 585 | 1243 | 21771 | 4978 | 26748 |
| 10 | Ionian Boots of Lucidity | Lich Bane + Blackfire Torch + Bloodletter's Curse + Shadowflame + Rabadon's Deathcap | 16200 | 726 | 2858 | 78 | 613 | 1294 | 22727 | 3773 | 26500 |

Remarques : le Fléau de liche (un proc à chaque sort) est présent dans 10 builds sur 10, la Coiffe de Rabadon dans 9, le Bâton du vide (40 % de pénétration magique) dans 6. Les Chaussures du sorcier sont les bottes les plus rentables en dégâts. L'ordre affiché suit la contribution des objets, pas forcément l'ordre d'achat : pour l'ordre d'achat optimal des 3 premiers objets, voir l'analyse Swain par trio (Malignance → Fléau de liche → Malédiction sanglante, ou Torche de feu noir → Fléau de liche → Bâton du vide).


## 8. Annexe : données machine (JSON)

Même contenu que les sections 2, 3 et 6, au format JSON compact, pour un import direct dans Nooblol. `items` : clé = nom anglais ; `archetypes` : 10 builds par profil ; `champions` : rôles → profil, dégâts, ressource, portée, tags.

```json
{"version":"2026-11-09","items":{"Berserker's Greaves":{"fr":"Jambières du berserker","cost":1100,"cat":"boots","groups":[],"mana_only":false,"stats":{"ms":45,"as":35}},"Sorcerer's Shoes":{"fr":"Chaussures du sorcier","cost":1100,"cat":"boots","groups":[],"mana_only":false,"stats":{"ms":45,"fpen":12}},"Plated Steelcaps":{"fr":"Coques en acier renforcé","cost":1200,"cat":"boots","groups":[],"mana_only":false,"stats":{"ms":45,"arm":25}},"Mercury's Treads":{"fr":"Sandales de Mercure","cost":1250,"cat":"boots","groups":[],"mana_only":false,"stats":{"ms":45,"mr":20,"ten":30}},"Ionian Boots of Lucidity":{"fr":"Bottes de lucidité ioniennes","cost":900,"cat":"boots","groups":[],"mana_only":false,"stats":{"ms":45,"ah":15}},"Boots of Swiftness":{"fr":"Bottes de rapidité","cost":1000,"cat":"boots","groups":[],"mana_only":false,"stats":{"ms":55}},"Celestial Opposition":{"fr":"Opposition céleste","cost":0,"cat":"support","groups":["Support"],"mana_only":false,"stats":{"hp":200,"hp5":75,"mp5":75}},"Solstice Sleigh":{"fr":"Traîneau du solstice","cost":0,"cat":"support","groups":["Support"],"mana_only":false,"stats":{"hp":200,"hp5":75,"mp5":75}},"Bloodsong":{"fr":"Chant de sang","cost":0,"cat":"support","groups":["Support"],"mana_only":false,"stats":{"hp":200,"hp5":75,"mp5":75}},"Dream Maker":{"fr":"Faiseur de rêves","cost":0,"cat":"support","groups":["Support"],"mana_only":false,"stats":{"hp":200,"hp5":75,"mp5":75}},"Zaz'Zak's Realmspike":{"fr":"Pointe du royaume de Zaz'Zak","cost":0,"cat":"support","groups":["Support"],"mana_only":false,"stats":{"hp":200,"hp5":75,"mp5":75}},"Abyssal Mask":{"fr":"Masque abyssal","cost":2650,"cat":"legendary","groups":["Blight"],"mana_only":false,"stats":{"ah":15,"hp":350,"mr":45}},"Archangel's Staff":{"fr":"Bâton de l'archange","cost":2900,"cat":"legendary","groups":["Manaflow","Lifeline"],"mana_only":true,"stats":{"ap":70,"ah":25,"mana":600}},"Ardent Censer":{"fr":"Encensoir ardent","cost":2200,"cat":"legendary","groups":[],"mana_only":false,"stats":{"ap":45,"hsp":10,"mp5":125,"ms":4}},"Axiom Arc":{"fr":"Arc axiomatique","cost":2750,"cat":"legendary","groups":[],"mana_only":false,"stats":{"ad":55,"ah":20,"leth":18}},"Banshee's Veil":{"fr":"Voile de la banshee","cost":3000,"cat":"legendary","groups":["Annul"],"mana_only":false,"stats":{"ap":105,"mr":40}},"Black Cleaver":{"fr":"Couperet noir","cost":3000,"cat":"legendary","groups":["Fatality"],"mana_only":false,"stats":{"ad":40,"ah":20,"hp":400}},"Blackfire Torch":{"fr":"Torche de feu noir","cost":2800,"cat":"legendary","groups":[],"mana_only":true,"stats":{"ap":80,"ah":20,"mana":600}},"Blade of the Ruined King":{"fr":"Lame du roi déchu","cost":3200,"cat":"legendary","groups":[],"mana_only":false,"stats":{"ad":40,"ls":10,"as":25}},"Bloodletter's Curse":{"fr":"Malédiction sanglante","cost":2900,"cat":"legendary","groups":["Blight"],"mana_only":false,"stats":{"ap":65,"hp":400,"ah":15}},"Bloodthirster":{"fr":"Soif-de-sang","cost":3400,"cat":"legendary","groups":[],"mana_only":false,"stats":{"ad":80,"ls":15}},"Cosmic Drive":{"fr":"Propulseur cosmique","cost":3000,"cat":"legendary","groups":[],"mana_only":false,"stats":{"hp":350,"ah":25,"ap":70,"ms":4}},"Cryptbloom":{"fr":"Floraison funèbre","cost":3000,"cat":"legendary","groups":["Blight"],"mana_only":false,"stats":{"ap":75,"ah":20,"mpen":30}},"Chempunk Chainsword":{"fr":"Tronçonneuse chimtech","cost":3100,"cat":"legendary","groups":[],"mana_only":false,"stats":{"ad":45,"ah":15,"hp":450}},"Dawncore":{"fr":"Cœur de l'aube","cost":2500,"cat":"legendary","groups":[],"mana_only":true,"stats":{"ap":45,"hsp":16,"mp5":100}},"Dead Man's Plate":{"fr":"Plaque du mort","cost":2900,"cat":"legendary","groups":["Momentum"],"mana_only":false,"stats":{"arm":55,"hp":350,"ms":4}},"Death's Dance":{"fr":"Danse de la mort","cost":3300,"cat":"legendary","groups":[],"mana_only":false,"stats":{"ad":60,"ah":15,"arm":50}},"Echoes of Helia":{"fr":"Échos d'Hélia","cost":2200,"cat":"legendary","groups":[],"mana_only":false,"stats":{"ah":20,"ap":35,"hp":200,"mp5":125}},"Eclipse":{"fr":"Éclipse","cost":2900,"cat":"legendary","groups":[],"mana_only":false,"stats":{"ad":60,"ah":15}},"Edge of Night":{"fr":"Lisière de la nuit","cost":3000,"cat":"legendary","groups":["Annul"],"mana_only":false,"stats":{"ad":50,"hp":250,"leth":15}},"Endless Hunger":{"fr":"Faim insatiable","cost":3000,"cat":"legendary","groups":[],"mana_only":false,"stats":{"ad":60,"omni":5,"ten":20}},"Essence Reaver":{"fr":"Faucheuse d'essence","cost":2900,"cat":"legendary","groups":[],"mana_only":true,"stats":{"ad":60,"ah":15,"crit":25}},"Experimental Hexplate":{"fr":"Hexplaque expérimentale","cost":3000,"cat":"legendary","groups":[],"mana_only":false,"stats":{"hp":450,"ad":40,"uh":30,"as":20}},"Force of Nature":{"fr":"Force de la nature","cost":2800,"cat":"legendary","groups":[],"mana_only":false,"stats":{"hp":400,"mr":55,"ms":4}},"Frozen Heart":{"fr":"Cœur gelé","cost":2500,"cat":"legendary","groups":[],"mana_only":true,"stats":{"ah":20,"arm":75,"mana":400}},"Guardian Angel":{"fr":"Ange gardien","cost":3200,"cat":"legendary","groups":[],"mana_only":false,"stats":{"ad":55,"arm":45}},"Guinsoo's Rageblade":{"fr":"Lame enragée de Guinsoo","cost":3000,"cat":"legendary","groups":[],"mana_only":false,"stats":{"ad":30,"ap":30,"as":25}},"Heartsteel":{"fr":"Cœur d'acier","cost":3000,"cat":"legendary","groups":[],"mana_only":false,"stats":{"hp":900,"hp5":100}},"Hextech Rocketbelt":{"fr":"Ceinture-roquette Hextech","cost":2650,"cat":"legendary","groups":[],"mana_only":false,"stats":{"ah":20,"ap":70,"hp":300}},"Hollow Radiance":{"fr":"Rayonnement creux","cost":2800,"cat":"legendary","groups":["Immolate"],"mana_only":false,"stats":{"ah":10,"hp":400,"mr":40,"hp5":100}},"Horizon Focus":{"fr":"Focalisateur d'horizon","cost":2750,"cat":"legendary","groups":[],"mana_only":false,"stats":{"ap":125,"ah":25}},"Hubris":{"fr":"Orgueil","cost":3000,"cat":"legendary","groups":[],"mana_only":false,"stats":{"ad":60,"ah":10,"leth":18}},"Hullbreaker":{"fr":"Brise-coque","cost":3000,"cat":"legendary","groups":[],"mana_only":false,"stats":{"ad":40,"hp":500,"ms":4}},"Iceborn Gauntlet":{"fr":"Gantelet de glace","cost":2900,"cat":"legendary","groups":["Spellblade"],"mana_only":false,"stats":{"ah":15,"arm":50,"hp":300}},"Imperial Mandate":{"fr":"Mandat impérial","cost":2250,"cat":"legendary","groups":[],"mana_only":true,"stats":{"ah":20,"ap":60,"mp5":125}},"Infinity Edge":{"fr":"Lame d'infini","cost":3450,"cat":"legendary","groups":[],"mana_only":false,"stats":{"ad":65,"crit":25}},"Jak'Sho, The Protean":{"fr":"Jak'Sho le Protéiforme","cost":3200,"cat":"legendary","groups":[],"mana_only":false,"stats":{"arm":45,"mr":45,"hp":350}},"Kaenic Rookern":{"fr":"Rookern de Kaenic","cost":2900,"cat":"legendary","groups":[],"mana_only":false,"stats":{"hp":400,"mr":80,"hp5":100}},"Knight's Vow":{"fr":"Serment du chevalier","cost":2300,"cat":"legendary","groups":[],"mana_only":false,"stats":{"ah":10,"arm":40,"hp":200,"hp5":100}},"Kraken Slayer":{"fr":"Tueur de krakens","cost":3000,"cat":"legendary","groups":[],"mana_only":false,"stats":{"ad":45,"ms":4,"as":40}},"Liandry's Torment":{"fr":"Tourment de Liandry","cost":3000,"cat":"legendary","groups":[],"mana_only":false,"stats":{"ap":60,"hp":300}},"Lich Bane":{"fr":"Fléau de liche","cost":2900,"cat":"legendary","groups":["Spellblade"],"mana_only":false,"stats":{"ap":100,"ah":10,"ms":4}},"Locket of the Iron Solari":{"fr":"Médaillon de l'Iron Solari","cost":2200,"cat":"legendary","groups":[],"mana_only":false,"stats":{"arm":25,"mr":25,"hp":200,"ah":10}},"Lord Dominik's Regards":{"fr":"Salutations de Lord Dominik","cost":3100,"cat":"legendary","groups":["Fatality"],"mana_only":false,"stats":{"ad":35,"crit":25,"apen":40}},"Luden's Companion":{"fr":"Compagnon de Luden","cost":2750,"cat":"legendary","groups":[],"mana_only":true,"stats":{"ap":100,"ah":10,"mana":600}},"Malignance":{"fr":"Malignance","cost":2700,"cat":"legendary","groups":[],"mana_only":true,"stats":{"ap":90,"ah":15,"mana":600,"uh":20}},"Manamune":{"fr":"Manamune","cost":2900,"cat":"legendary","groups":["Manaflow"],"mana_only":true,"stats":{"ad":35,"ah":15,"mana":500}},"Maw of Malmortius":{"fr":"Gueule de Malmortius","cost":3100,"cat":"legendary","groups":["Lifeline"],"mana_only":false,"stats":{"ah":15,"ad":60,"mr":40}},"Mejai's Soulstealer":{"fr":"Voleur d'âmes de Mejai","cost":1500,"cat":"legendary","groups":["Glory"],"mana_only":false,"stats":{"ap":20,"hp":100}},"Mercurial Scimitar":{"fr":"Cimeterre mercuriel","cost":3200,"cat":"legendary","groups":["Quicksilver"],"mana_only":false,"stats":{"ad":50,"ls":10,"mr":35}},"Mikael's Blessing":{"fr":"Bénédiction de Mikael","cost":2300,"cat":"legendary","groups":[],"mana_only":true,"stats":{"hp":250,"ah":15,"hsp":12,"mp5":100}},"Moonstone Renewer":{"fr":"Renouveau de pierre de lune","cost":2200,"cat":"legendary","groups":[],"mana_only":true,"stats":{"ah":20,"ap":25,"hp":200,"mp5":125}},"Morellonomicon":{"fr":"Morellonomicon","cost":2850,"cat":"legendary","groups":[],"mana_only":false,"stats":{"ap":75,"ah":15,"hp":350}},"Mortal Reminder":{"fr":"Rappel mortel","cost":3300,"cat":"legendary","groups":["Fatality"],"mana_only":false,"stats":{"ad":35,"apen":35,"crit":25}},"Nashor's Tooth":{"fr":"Dent de Nashor","cost":2900,"cat":"legendary","groups":[],"mana_only":false,"stats":{"ah":15,"ap":80,"as":50}},"Navori Flickerblade":{"fr":"Lame scintillante de Navori","cost":2650,"cat":"legendary","groups":[],"mana_only":false,"stats":{"crit":25,"ms":4,"as":40}},"Opportunity":{"fr":"Opportunité","cost":2700,"cat":"legendary","groups":[],"mana_only":false,"stats":{"ad":55,"leth":18}},"Overlord's Bloodmail":{"fr":"Cotte du suzerain","cost":3300,"cat":"legendary","groups":[],"mana_only":false,"stats":{"hp":550,"ad":30}},"Phantom Dancer":{"fr":"Danseur fantôme","cost":2650,"cat":"legendary","groups":[],"mana_only":false,"stats":{"crit":25,"ms":10,"as":65}},"Profane Hydra":{"fr":"Hydre profane","cost":2850,"cat":"legendary","groups":["Hydra"],"mana_only":false,"stats":{"ad":55,"ah":10,"leth":18}},"Rabadon's Deathcap":{"fr":"Coiffe de Rabadon","cost":3500,"cat":"legendary","groups":[],"mana_only":false,"stats":{"ap":130}},"Randuin's Omen":{"fr":"Présage de Randuin","cost":2700,"cat":"legendary","groups":[],"mana_only":false,"stats":{"arm":75,"hp":350}},"Rapid Firecannon":{"fr":"Canon ultrarapide","cost":2650,"cat":"legendary","groups":[],"mana_only":false,"stats":{"crit":25,"ms":4,"as":35}},"Ravenous Hydra":{"fr":"Hydre vorace","cost":3300,"cat":"legendary","groups":["Hydra"],"mana_only":false,"stats":{"ad":65,"ah":15,"ls":12}},"Redemption":{"fr":"Rédemption","cost":2300,"cat":"legendary","groups":[],"mana_only":true,"stats":{"hp":200,"ah":15,"hsp":10,"mp5":100}},"Riftmaker":{"fr":"Faiseur de failles","cost":3100,"cat":"legendary","groups":[],"mana_only":false,"stats":{"ah":15,"ap":70,"hp":350}},"Rod of Ages":{"fr":"Bâton séculaire","cost":2600,"cat":"legendary","groups":["Eternity"],"mana_only":true,"stats":{"ap":45,"hp":350,"mana":500}},"Runaan's Hurricane":{"fr":"Ouragan de Runaan","cost":2650,"cat":"legendary","groups":[],"mana_only":false,"stats":{"crit":25,"ms":4,"as":40}},"Rylai's Crystal Scepter":{"fr":"Sceptre de cristal de Rylai","cost":2600,"cat":"legendary","groups":[],"mana_only":false,"stats":{"ap":65,"hp":400}},"Serpent's Fang":{"fr":"Croc du serpent","cost":2500,"cat":"legendary","groups":[],"mana_only":false,"stats":{"ad":55,"leth":15}},"Serylda's Grudge":{"fr":"Rancune de Serylda","cost":3000,"cat":"legendary","groups":["Fatality"],"mana_only":false,"stats":{"ad":45,"ah":15,"apen":35}},"Shadowflame":{"fr":"Flamme d'ombre","cost":3200,"cat":"legendary","groups":[],"mana_only":false,"stats":{"ap":110,"fpen":15}},"Shurelya's Battlesong":{"fr":"Chant de bataille de Shurelya","cost":2200,"cat":"legendary","groups":[],"mana_only":true,"stats":{"ap":50,"ah":15,"mp5":125,"ms":4}},"Spear of Shojin":{"fr":"Lance de Shojin","cost":3100,"cat":"legendary","groups":[],"mana_only":false,"stats":{"ad":45,"hp":450,"ah":25}},"Spirit Visage":{"fr":"Visage spirituel","cost":2700,"cat":"legendary","groups":[],"mana_only":false,"stats":{"hp":400,"hp5":100,"mr":50,"ah":10}},"Staff of Flowing Water":{"fr":"Bâton des flots","cost":2250,"cat":"legendary","groups":[],"mana_only":true,"stats":{"ap":35,"ah":15,"mp5":125,"hsp":10}},"Statikk Shiv":{"fr":"Shiv statikk","cost":2700,"cat":"legendary","groups":[],"mana_only":false,"stats":{"ad":45,"ms":4,"as":30}},"Stormsurge":{"fr":"Choc de tempête","cost":2800,"cat":"legendary","groups":[],"mana_only":false,"stats":{"ap":90,"fpen":15,"ms":6}},"Stridebreaker":{"fr":"Briseur de foulées","cost":3300,"cat":"legendary","groups":["Hydra"],"mana_only":false,"stats":{"ad":40,"hp":450,"as":25}},"Sundered Sky":{"fr":"Ciel fendu","cost":3100,"cat":"legendary","groups":[],"mana_only":false,"stats":{"hp":400,"ad":40,"ah":10}},"Sunfire Aegis":{"fr":"Égide du feu solaire","cost":2700,"cat":"legendary","groups":["Immolate"],"mana_only":false,"stats":{"hp":350,"arm":50,"ah":10}},"Sterak's Gage":{"fr":"Gage de Sterak","cost":3200,"cat":"legendary","groups":["Lifeline"],"mana_only":false,"stats":{"hp":400,"ten":20}},"Thornmail":{"fr":"Cotte épineuse","cost":2450,"cat":"legendary","groups":[],"mana_only":false,"stats":{"hp":150,"arm":75}},"Titanic Hydra":{"fr":"Hydre titanesque","cost":3300,"cat":"legendary","groups":["Hydra"],"mana_only":false,"stats":{"ad":40,"hp":600}},"Trailblazer":{"fr":"Éclaireur","cost":2400,"cat":"legendary","groups":["Momentum"],"mana_only":false,"stats":{"hp":250,"arm":40,"ms":4}},"Trinity Force":{"fr":"Force de la trinité","cost":3333,"cat":"legendary","groups":["Spellblade"],"mana_only":false,"stats":{"ad":36,"ah":15,"hp":333,"as":30}},"Umbral Glaive":{"fr":"Glaive de l'ombre","cost":2500,"cat":"legendary","groups":[],"mana_only":false,"stats":{"ad":55,"ah":10,"leth":15}},"The Collector":{"fr":"Le Collecteur","cost":3000,"cat":"legendary","groups":[],"mana_only":false,"stats":{"ad":50,"crit":25,"leth":10}},"Terminus":{"fr":"Terminus","cost":3000,"cat":"legendary","groups":["Fatality","Blight"],"mana_only":false,"stats":{"ad":30,"as":35}},"Void Staff":{"fr":"Bâton du vide","cost":3000,"cat":"legendary","groups":["Blight"],"mana_only":false,"stats":{"ap":95,"mpen":40}},"Voltaic Cyclosword":{"fr":"Cyclo-épée voltaïque","cost":3000,"cat":"legendary","groups":[],"mana_only":false,"stats":{"ad":55,"ah":10,"leth":18}},"Warmog's Armor":{"fr":"Armure de Warmog","cost":3100,"cat":"legendary","groups":[],"mana_only":false,"stats":{"hp":1120,"hp5":100}},"Winter's Approach":{"fr":"Approche hivernale","cost":2400,"cat":"legendary","groups":["Manaflow"],"mana_only":true,"stats":{"hp":550,"ah":15,"mana":500}},"Wit's End":{"fr":"Fin de l'esprit","cost":2800,"cat":"legendary","groups":[],"mana_only":false,"stats":{"mr":45,"ten":20,"as":50}},"Youmuu's Ghostblade":{"fr":"Lame spectrale de Youmuu","cost":2800,"cat":"legendary","groups":[],"mana_only":false,"stats":{"ad":55,"leth":18,"ms":4}},"Yun Tal Wildarrows":{"fr":"Flèches sauvages de Yun Tal","cost":3000,"cat":"legendary","groups":[],"mana_only":false,"stats":{"ad":55,"as":35}},"Zeke's Convergence":{"fr":"Convergence de Zeke","cost":2200,"cat":"legendary","groups":[],"mana_only":false,"stats":{"hp":300,"arm":25,"mr":25,"ah":10}},"Zhonya's Hourglass":{"fr":"Sablier de Zhonya","cost":3250,"cat":"legendary","groups":["Stasis"],"mana_only":false,"stats":{"ap":105,"arm":50}},"Vigilant Wardstone":{"fr":"Pierre de garde vigilante","cost":2300,"cat":"legendary","groups":[],"mana_only":false,"stats":{"hp":250,"arm":25,"mr":30,"ah":20}},"Unending Despair":{"fr":"Désespoir éternel","cost":2800,"cat":"legendary","groups":[],"mana_only":false,"stats":{"hp":400,"arm":25,"mr":25,"ah":10}}},"archetypes":{"MAGE_BURST":{"label":"Mage de burst","builds":[{"name":"Standard","tags":["default"],"items":["Sorcerer's Shoes","Luden's Companion","Shadowflame","Rabadon's Deathcap","Void Staff","Zhonya's Hourglass"]},{"name":"Contre AD / assassins","tags":["vs_ad","vs_assassin"],"items":["Plated Steelcaps","Luden's Companion","Zhonya's Hourglass","Shadowflame","Rabadon's Deathcap","Void Staff"]},{"name":"Contre AP / burst magique","tags":["vs_ap"],"items":["Mercury's Treads","Luden's Companion","Banshee's Veil","Shadowflame","Rabadon's Deathcap","Void Staff"]},{"name":"Contre tanks","tags":["vs_tanks"],"items":["Sorcerer's Shoes","Luden's Companion","Liandry's Torment","Void Staff","Rabadon's Deathcap","Zhonya's Hourglass"]},{"name":"Boule de neige","tags":["ahead","vs_squishy"],"items":["Sorcerer's Shoes","Stormsurge","Shadowflame","Rabadon's Deathcap","Void Staff","Zhonya's Hourglass"]},{"name":"Accélération / poke","tags":["poke","long_game"],"items":["Ionian Boots of Lucidity","Malignance","Horizon Focus","Shadowflame","Rabadon's Deathcap","Void Staff"]},{"name":"Anti-soins","tags":["vs_heal"],"items":["Sorcerer's Shoes","Luden's Companion","Morellonomicon","Shadowflame","Rabadon's Deathcap","Void Staff"]},{"name":"En retard / défensif","tags":["behind","vs_assassin"],"items":["Mercury's Treads","Luden's Companion","Zhonya's Hourglass","Banshee's Veil","Rabadon's Deathcap","Void Staff"]},{"name":"Lame magique (attaques entre les sorts)","tags":["melee_weave"],"items":["Sorcerer's Shoes","Lich Bane","Shadowflame","Rabadon's Deathcap","Void Staff","Zhonya's Hourglass"]},{"name":"Partie longue","tags":["long_game"],"items":["Sorcerer's Shoes","Luden's Companion","Rabadon's Deathcap","Void Staff","Zhonya's Hourglass","Banshee's Veil"]}]},"MAGE_BATTLE":{"label":"Mage de combat / contrôle","builds":[{"name":"Standard","tags":["default"],"items":["Sorcerer's Shoes","Liandry's Torment","Rylai's Crystal Scepter","Zhonya's Hourglass","Rabadon's Deathcap","Void Staff"]},{"name":"Brûlure / teamfight","tags":["teamfight"],"items":["Sorcerer's Shoes","Blackfire Torch","Liandry's Torment","Rylai's Crystal Scepter","Rabadon's Deathcap","Void Staff"]},{"name":"Mana / montée en puissance","tags":["long_game","mana_scaler"],"items":["Ionian Boots of Lucidity","Archangel's Staff","Rod of Ages","Rabadon's Deathcap","Void Staff","Zhonya's Hourglass"]},{"name":"Contre tanks","tags":["vs_tanks"],"items":["Sorcerer's Shoes","Liandry's Torment","Bloodletter's Curse","Rylai's Crystal Scepter","Rabadon's Deathcap","Zhonya's Hourglass"]},{"name":"Contre AD / plongeurs","tags":["vs_ad","vs_dive"],"items":["Plated Steelcaps","Liandry's Torment","Zhonya's Hourglass","Rylai's Crystal Scepter","Rabadon's Deathcap","Void Staff"]},{"name":"Contre AP","tags":["vs_ap"],"items":["Mercury's Treads","Liandry's Torment","Banshee's Veil","Rylai's Crystal Scepter","Rabadon's Deathcap","Void Staff"]},{"name":"Anti-soins","tags":["vs_heal"],"items":["Sorcerer's Shoes","Liandry's Torment","Morellonomicon","Rylai's Crystal Scepter","Rabadon's Deathcap","Void Staff"]},{"name":"Ultime fréquent","tags":["ult_centric"],"items":["Sorcerer's Shoes","Malignance","Liandry's Torment","Rabadon's Deathcap","Void Staff","Zhonya's Hourglass"]},{"name":"Mage de première ligne","tags":["frontline","vs_dive"],"items":["Mercury's Treads","Riftmaker","Liandry's Torment","Rylai's Crystal Scepter","Spirit Visage","Zhonya's Hourglass"]},{"name":"En retard","tags":["behind"],"items":["Mercury's Treads","Rylai's Crystal Scepter","Zhonya's Hourglass","Banshee's Veil","Liandry's Torment","Void Staff"]}]},"MAGE_ARTILLERY":{"label":"Mage artilleur","builds":[{"name":"Standard","tags":["default"],"items":["Sorcerer's Shoes","Luden's Companion","Shadowflame","Rabadon's Deathcap","Void Staff","Zhonya's Hourglass"]},{"name":"Poke / accélération","tags":["poke"],"items":["Ionian Boots of Lucidity","Malignance","Horizon Focus","Rabadon's Deathcap","Void Staff","Shadowflame"]},{"name":"Brûlure","tags":["teamfight"],"items":["Sorcerer's Shoes","Blackfire Torch","Shadowflame","Rabadon's Deathcap","Void Staff","Zhonya's Hourglass"]},{"name":"Contre tanks","tags":["vs_tanks"],"items":["Sorcerer's Shoes","Liandry's Torment","Rabadon's Deathcap","Void Staff","Horizon Focus","Zhonya's Hourglass"]},{"name":"Mana / partie longue","tags":["long_game","mana_scaler"],"items":["Sorcerer's Shoes","Archangel's Staff","Luden's Companion","Rabadon's Deathcap","Void Staff","Zhonya's Hourglass"]},{"name":"Contre assassins","tags":["vs_assassin","vs_ad"],"items":["Plated Steelcaps","Luden's Companion","Zhonya's Hourglass","Shadowflame","Rabadon's Deathcap","Void Staff"]},{"name":"Contre AP","tags":["vs_ap"],"items":["Mercury's Treads","Luden's Companion","Banshee's Veil","Rabadon's Deathcap","Void Staff","Shadowflame"]},{"name":"Anti-soins","tags":["vs_heal"],"items":["Sorcerer's Shoes","Luden's Companion","Morellonomicon","Rabadon's Deathcap","Void Staff","Horizon Focus"]},{"name":"Boule de neige","tags":["ahead"],"items":["Sorcerer's Shoes","Luden's Companion","Stormsurge","Rabadon's Deathcap","Shadowflame","Void Staff"]},{"name":"Contrôle / soutien de l'équipe","tags":["utility","vs_dive"],"items":["Ionian Boots of Lucidity","Malignance","Rylai's Crystal Scepter","Rabadon's Deathcap","Void Staff","Zhonya's Hourglass"]}]},"AP_ASSASSIN":{"label":"Assassin AP","builds":[{"name":"Standard","tags":["default"],"items":["Sorcerer's Shoes","Stormsurge","Shadowflame","Rabadon's Deathcap","Void Staff","Zhonya's Hourglass"]},{"name":"Lame magique","tags":["melee_weave"],"items":["Sorcerer's Shoes","Lich Bane","Shadowflame","Rabadon's Deathcap","Void Staff","Zhonya's Hourglass"]},{"name":"Engagement (ceinture)","tags":["gap_close"],"items":["Sorcerer's Shoes","Hextech Rocketbelt","Shadowflame","Rabadon's Deathcap","Void Staff","Zhonya's Hourglass"]},{"name":"Combat prolongé","tags":["teamfight","skirmish"],"items":["Sorcerer's Shoes","Riftmaker","Zhonya's Hourglass","Shadowflame","Rabadon's Deathcap","Void Staff"]},{"name":"Contre AP","tags":["vs_ap"],"items":["Mercury's Treads","Stormsurge","Banshee's Veil","Shadowflame","Rabadon's Deathcap","Void Staff"]},{"name":"Contre AD","tags":["vs_ad"],"items":["Plated Steelcaps","Stormsurge","Zhonya's Hourglass","Shadowflame","Rabadon's Deathcap","Void Staff"]},{"name":"Contre tanks","tags":["vs_tanks"],"items":["Sorcerer's Shoes","Riftmaker","Liandry's Torment","Rabadon's Deathcap","Void Staff","Zhonya's Hourglass"]},{"name":"Anti-soins","tags":["vs_heal"],"items":["Sorcerer's Shoes","Stormsurge","Morellonomicon","Shadowflame","Rabadon's Deathcap","Void Staff"]},{"name":"Boule de neige","tags":["ahead"],"items":["Sorcerer's Shoes","Stormsurge","Shadowflame","Mejai's Soulstealer","Rabadon's Deathcap","Void Staff"]},{"name":"Hybride à l'impact","tags":["onhit"],"items":["Sorcerer's Shoes","Nashor's Tooth","Lich Bane","Shadowflame","Rabadon's Deathcap","Void Staff"]}]},"AP_BRUISER":{"label":"Combattant AP","builds":[{"name":"Standard","tags":["default"],"items":["Mercury's Treads","Riftmaker","Liandry's Torment","Zhonya's Hourglass","Rabadon's Deathcap","Void Staff"]},{"name":"Résistant","tags":["frontline"],"items":["Mercury's Treads","Riftmaker","Liandry's Torment","Spirit Visage","Force of Nature","Zhonya's Hourglass"]},{"name":"Contre AD","tags":["vs_ad"],"items":["Plated Steelcaps","Riftmaker","Zhonya's Hourglass","Liandry's Torment","Randuin's Omen","Rabadon's Deathcap"]},{"name":"Contre AP","tags":["vs_ap"],"items":["Mercury's Treads","Riftmaker","Banshee's Veil","Liandry's Torment","Force of Nature","Kaenic Rookern"]},{"name":"Anti-soins","tags":["vs_heal"],"items":["Mercury's Treads","Riftmaker","Morellonomicon","Liandry's Torment","Zhonya's Hourglass","Void Staff"]},{"name":"Contre tanks","tags":["vs_tanks"],"items":["Mercury's Treads","Liandry's Torment","Riftmaker","Bloodletter's Curse","Rabadon's Deathcap","Zhonya's Hourglass"]},{"name":"Burst","tags":["ahead","vs_squishy"],"items":["Sorcerer's Shoes","Riftmaker","Shadowflame","Rabadon's Deathcap","Void Staff","Zhonya's Hourglass"]},{"name":"Soins personnels","tags":["self_heal"],"items":["Mercury's Treads","Riftmaker","Cosmic Drive","Spirit Visage","Rabadon's Deathcap","Void Staff"]},{"name":"Teamfight (zone)","tags":["teamfight"],"items":["Mercury's Treads","Liandry's Torment","Rylai's Crystal Scepter","Riftmaker","Zhonya's Hourglass","Abyssal Mask"]},{"name":"En retard","tags":["behind"],"items":["Mercury's Treads","Rylai's Crystal Scepter","Zhonya's Hourglass","Spirit Visage","Riftmaker","Force of Nature"]}]},"AP_ONHIT":{"label":"AP à l'impact","builds":[{"name":"Standard","tags":["default"],"items":["Berserker's Greaves","Nashor's Tooth","Guinsoo's Rageblade","Rabadon's Deathcap","Void Staff","Zhonya's Hourglass"]},{"name":"Combat prolongé","tags":["skirmish"],"items":["Sorcerer's Shoes","Nashor's Tooth","Riftmaker","Rabadon's Deathcap","Void Staff","Zhonya's Hourglass"]},{"name":"Burst à l'impact","tags":["melee_weave"],"items":["Sorcerer's Shoes","Nashor's Tooth","Lich Bane","Rabadon's Deathcap","Void Staff","Shadowflame"]},{"name":"Contre tanks","tags":["vs_tanks"],"items":["Berserker's Greaves","Nashor's Tooth","Guinsoo's Rageblade","Liandry's Torment","Void Staff","Rabadon's Deathcap"]},{"name":"Contre AD","tags":["vs_ad"],"items":["Plated Steelcaps","Nashor's Tooth","Guinsoo's Rageblade","Zhonya's Hourglass","Rabadon's Deathcap","Void Staff"]},{"name":"Contre AP","tags":["vs_ap"],"items":["Mercury's Treads","Nashor's Tooth","Guinsoo's Rageblade","Wit's End","Rabadon's Deathcap","Void Staff"]},{"name":"Anti-soins","tags":["vs_heal"],"items":["Berserker's Greaves","Nashor's Tooth","Guinsoo's Rageblade","Morellonomicon","Rabadon's Deathcap","Void Staff"]},{"name":"Brûlure / kite","tags":["poke","kite"],"items":["Sorcerer's Shoes","Liandry's Torment","Nashor's Tooth","Rylai's Crystal Scepter","Rabadon's Deathcap","Void Staff"]},{"name":"Boule de neige","tags":["ahead"],"items":["Berserker's Greaves","Nashor's Tooth","Guinsoo's Rageblade","Shadowflame","Rabadon's Deathcap","Void Staff"]},{"name":"En retard","tags":["behind"],"items":["Mercury's Treads","Nashor's Tooth","Zhonya's Hourglass","Banshee's Veil","Rabadon's Deathcap","Void Staff"]}]},"AP_TANK":{"label":"Tank AP","builds":[{"name":"Standard","tags":["default"],"items":["Mercury's Treads","Liandry's Torment","Hollow Radiance","Jak'Sho, The Protean","Force of Nature","Abyssal Mask"]},{"name":"Contre AD","tags":["vs_ad"],"items":["Plated Steelcaps","Liandry's Torment","Sunfire Aegis","Thornmail","Randuin's Omen","Jak'Sho, The Protean"]},{"name":"Contre AP","tags":["vs_ap"],"items":["Mercury's Treads","Liandry's Torment","Hollow Radiance","Force of Nature","Kaenic Rookern","Spirit Visage"]},{"name":"Combattant","tags":["skirmish"],"items":["Mercury's Treads","Riftmaker","Liandry's Torment","Rylai's Crystal Scepter","Jak'Sho, The Protean","Spirit Visage"]},{"name":"Ralentissements","tags":["kite","mana_scaler"],"items":["Boots of Swiftness","Rod of Ages","Rylai's Crystal Scepter","Liandry's Torment","Spirit Visage","Jak'Sho, The Protean"]},{"name":"Teamfight","tags":["teamfight"],"items":["Mercury's Treads","Hollow Radiance","Jak'Sho, The Protean","Unending Despair","Abyssal Mask","Thornmail"]},{"name":"Anti-soins contre AD","tags":["vs_heal","vs_ad"],"items":["Plated Steelcaps","Sunfire Aegis","Thornmail","Jak'Sho, The Protean","Unending Despair","Force of Nature"]},{"name":"Full AP (burst)","tags":["ahead","vs_squishy"],"items":["Sorcerer's Shoes","Luden's Companion","Zhonya's Hourglass","Rabadon's Deathcap","Void Staff","Shadowflame"]},{"name":"Accumulation de PV","tags":["long_game","split"],"items":["Mercury's Treads","Heartsteel","Hollow Radiance","Spirit Visage","Warmog's Armor","Jak'Sho, The Protean"]},{"name":"En retard","tags":["behind"],"items":["Mercury's Treads","Sunfire Aegis","Unending Despair","Force of Nature","Randuin's Omen","Thornmail"]}]},"TANK":{"label":"Tank (top / jungle)","builds":[{"name":"Standard","tags":["default"],"items":["Mercury's Treads","Sunfire Aegis","Jak'Sho, The Protean","Thornmail","Force of Nature","Unending Despair"]},{"name":"Contre AD","tags":["vs_ad","vs_autoattack"],"items":["Plated Steelcaps","Sunfire Aegis","Thornmail","Randuin's Omen","Frozen Heart","Dead Man's Plate"]},{"name":"Contre AP","tags":["vs_ap"],"items":["Mercury's Treads","Hollow Radiance","Kaenic Rookern","Force of Nature","Spirit Visage","Jak'Sho, The Protean"]},{"name":"Accumulation de PV","tags":["long_game"],"items":["Mercury's Treads","Heartsteel","Warmog's Armor","Spirit Visage","Jak'Sho, The Protean","Thornmail"]},{"name":"Engagement / roam","tags":["engage"],"items":["Boots of Swiftness","Dead Man's Plate","Sunfire Aegis","Jak'Sho, The Protean","Force of Nature","Randuin's Omen"]},{"name":"Anti-soins","tags":["vs_heal"],"items":["Plated Steelcaps","Sunfire Aegis","Thornmail","Jak'Sho, The Protean","Unending Despair","Kaenic Rookern"]},{"name":"Teamfight (zone)","tags":["teamfight"],"items":["Mercury's Treads","Hollow Radiance","Unending Despair","Jak'Sho, The Protean","Abyssal Mask","Randuin's Omen"]},{"name":"Duel / split","tags":["split"],"items":["Mercury's Treads","Heartsteel","Sunfire Aegis","Jak'Sho, The Protean","Spirit Visage","Thornmail"]},{"name":"Accélération / utilité","tags":["utility"],"items":["Ionian Boots of Lucidity","Hollow Radiance","Iceborn Gauntlet","Jak'Sho, The Protean","Unending Despair","Force of Nature"]},{"name":"En retard","tags":["behind"],"items":["Mercury's Treads","Unending Despair","Randuin's Omen","Force of Nature","Thornmail","Kaenic Rookern"]}]},"TANK_SUPPORT":{"label":"Support tank / engage","builds":[{"name":"Standard","tags":["default"],"items":["Celestial Opposition","Mercury's Treads","Locket of the Iron Solari","Zeke's Convergence","Knight's Vow","Redemption"]},{"name":"Contre AD","tags":["vs_ad"],"items":["Celestial Opposition","Plated Steelcaps","Locket of the Iron Solari","Thornmail","Randuin's Omen","Frozen Heart"]},{"name":"Contre AP","tags":["vs_ap"],"items":["Celestial Opposition","Mercury's Treads","Locket of the Iron Solari","Force of Nature","Abyssal Mask","Kaenic Rookern"]},{"name":"Engagement / roam","tags":["engage","ahead"],"items":["Solstice Sleigh","Boots of Swiftness","Locket of the Iron Solari","Zeke's Convergence","Dead Man's Plate","Jak'Sho, The Protean"]},{"name":"Vision","tags":["vision"],"items":["Celestial Opposition","Ionian Boots of Lucidity","Locket of the Iron Solari","Vigilant Wardstone","Zeke's Convergence","Knight's Vow"]},{"name":"Anti-soins","tags":["vs_heal"],"items":["Celestial Opposition","Plated Steelcaps","Locket of the Iron Solari","Thornmail","Zeke's Convergence","Knight's Vow"]},{"name":"Protection d'un carry","tags":["peel","protect_carry"],"items":["Celestial Opposition","Ionian Boots of Lucidity","Locket of the Iron Solari","Redemption","Knight's Vow","Mikael's Blessing"]},{"name":"Dégâts (boule de neige)","tags":["ahead"],"items":["Bloodsong","Mercury's Treads","Locket of the Iron Solari","Zeke's Convergence","Sunfire Aegis","Jak'Sho, The Protean"]},{"name":"Teamfight","tags":["teamfight"],"items":["Celestial Opposition","Mercury's Treads","Locket of the Iron Solari","Zeke's Convergence","Abyssal Mask","Redemption"]},{"name":"En retard","tags":["behind"],"items":["Celestial Opposition","Mercury's Treads","Locket of the Iron Solari","Knight's Vow","Randuin's Omen","Force of Nature"]}]},"ENCHANTER":{"label":"Enchanteur","builds":[{"name":"Standard","tags":["default"],"items":["Dream Maker","Ionian Boots of Lucidity","Moonstone Renewer","Ardent Censer","Redemption","Mikael's Blessing"]},{"name":"Soins / boucliers max","tags":["protect_carry"],"items":["Dream Maker","Ionian Boots of Lucidity","Echoes of Helia","Ardent Censer","Staff of Flowing Water","Redemption"]},{"name":"Contre plongeurs","tags":["vs_dive","vs_assassin"],"items":["Celestial Opposition","Mercury's Treads","Locket of the Iron Solari","Mikael's Blessing","Redemption","Moonstone Renewer"]},{"name":"Contre contrôles","tags":["vs_cc"],"items":["Dream Maker","Mercury's Treads","Mikael's Blessing","Moonstone Renewer","Redemption","Locket of the Iron Solari"]},{"name":"Poke / mandat","tags":["poke"],"items":["Zaz'Zak's Realmspike","Ionian Boots of Lucidity","Imperial Mandate","Shurelya's Battlesong","Moonstone Renewer","Redemption"]},{"name":"Hypercarry (ADC à l'impact)","tags":["protect_carry","onhit_carry"],"items":["Dream Maker","Ionian Boots of Lucidity","Ardent Censer","Staff of Flowing Water","Moonstone Renewer","Redemption"]},{"name":"Anti-soins","tags":["vs_heal"],"items":["Dream Maker","Ionian Boots of Lucidity","Moonstone Renewer","Morellonomicon","Redemption","Mikael's Blessing"]},{"name":"Engagement / roam","tags":["engage"],"items":["Solstice Sleigh","Boots of Swiftness","Shurelya's Battlesong","Locket of the Iron Solari","Redemption","Mikael's Blessing"]},{"name":"Mana / combats longs","tags":["long_game"],"items":["Dream Maker","Ionian Boots of Lucidity","Dawncore","Moonstone Renewer","Redemption","Ardent Censer"]},{"name":"En retard / défensif","tags":["behind"],"items":["Celestial Opposition","Mercury's Treads","Locket of the Iron Solari","Mikael's Blessing","Redemption","Knight's Vow"]}]},"SUPPORT_MAGE":{"label":"Support mage","builds":[{"name":"Standard","tags":["default"],"items":["Zaz'Zak's Realmspike","Sorcerer's Shoes","Liandry's Torment","Rylai's Crystal Scepter","Zhonya's Hourglass","Void Staff"]},{"name":"Burst","tags":["ahead","vs_squishy"],"items":["Zaz'Zak's Realmspike","Sorcerer's Shoes","Luden's Companion","Shadowflame","Rabadon's Deathcap","Void Staff"]},{"name":"Utilité","tags":["utility"],"items":["Zaz'Zak's Realmspike","Ionian Boots of Lucidity","Imperial Mandate","Malignance","Rylai's Crystal Scepter","Zhonya's Hourglass"]},{"name":"Contre AD / plongeurs","tags":["vs_ad","vs_dive"],"items":["Zaz'Zak's Realmspike","Plated Steelcaps","Liandry's Torment","Zhonya's Hourglass","Rylai's Crystal Scepter","Void Staff"]},{"name":"Contre AP","tags":["vs_ap"],"items":["Zaz'Zak's Realmspike","Mercury's Treads","Liandry's Torment","Banshee's Veil","Rylai's Crystal Scepter","Void Staff"]},{"name":"Anti-soins","tags":["vs_heal"],"items":["Zaz'Zak's Realmspike","Sorcerer's Shoes","Liandry's Torment","Morellonomicon","Rylai's Crystal Scepter","Zhonya's Hourglass"]},{"name":"Brûlure","tags":["teamfight"],"items":["Zaz'Zak's Realmspike","Sorcerer's Shoes","Blackfire Torch","Liandry's Torment","Rylai's Crystal Scepter","Void Staff"]},{"name":"Mage résistant","tags":["frontline"],"items":["Zaz'Zak's Realmspike","Mercury's Treads","Liandry's Torment","Rylai's Crystal Scepter","Zhonya's Hourglass","Spirit Visage"]},{"name":"Poke","tags":["poke"],"items":["Zaz'Zak's Realmspike","Ionian Boots of Lucidity","Luden's Companion","Horizon Focus","Malignance","Rabadon's Deathcap"]},{"name":"En retard","tags":["behind"],"items":["Celestial Opposition","Mercury's Treads","Zhonya's Hourglass","Rylai's Crystal Scepter","Liandry's Torment","Banshee's Veil"]}]},"AD_JUGGERNAUT":{"label":"Mastodonte AD","builds":[{"name":"Standard","tags":["default"],"items":["Plated Steelcaps","Sundered Sky","Black Cleaver","Sterak's Gage","Death's Dance","Spirit Visage"]},{"name":"Briseur de foulées","tags":["kite","teamfight"],"items":["Plated Steelcaps","Stridebreaker","Sterak's Gage","Death's Dance","Spirit Visage","Jak'Sho, The Protean"]},{"name":"Contre AP","tags":["vs_ap"],"items":["Mercury's Treads","Black Cleaver","Sterak's Gage","Spirit Visage","Force of Nature","Kaenic Rookern"]},{"name":"Contre AD","tags":["vs_ad"],"items":["Plated Steelcaps","Black Cleaver","Death's Dance","Randuin's Omen","Sterak's Gage","Thornmail"]},{"name":"Anti-soins","tags":["vs_heal"],"items":["Plated Steelcaps","Black Cleaver","Chempunk Chainsword","Sterak's Gage","Death's Dance","Spirit Visage"]},{"name":"Accumulation de PV","tags":["long_game","frontline"],"items":["Mercury's Treads","Heartsteel","Overlord's Bloodmail","Sterak's Gage","Spirit Visage","Jak'Sho, The Protean"]},{"name":"Split push","tags":["split"],"items":["Plated Steelcaps","Trinity Force","Hullbreaker","Titanic Hydra","Sterak's Gage","Death's Dance"]},{"name":"Contre tanks","tags":["vs_tanks"],"items":["Plated Steelcaps","Black Cleaver","Titanic Hydra","Sundered Sky","Sterak's Gage","Spirit Visage"]},{"name":"Soins personnels","tags":["self_heal"],"items":["Plated Steelcaps","Eclipse","Sundered Sky","Sterak's Gage","Death's Dance","Spirit Visage"]},{"name":"En retard / première ligne","tags":["behind"],"items":["Mercury's Treads","Spirit Visage","Death's Dance","Sterak's Gage","Jak'Sho, The Protean","Randuin's Omen"]}]},"AD_DIVER":{"label":"Plongeur AD","builds":[{"name":"Standard","tags":["default"],"items":["Plated Steelcaps","Trinity Force","Sterak's Gage","Black Cleaver","Death's Dance","Spirit Visage"]},{"name":"Hexplaque (ultime fréquent)","tags":["ult_centric"],"items":["Plated Steelcaps","Experimental Hexplate","Black Cleaver","Sterak's Gage","Death's Dance","Guardian Angel"]},{"name":"Burst","tags":["ahead","vs_squishy"],"items":["Ionian Boots of Lucidity","Eclipse","Black Cleaver","Sterak's Gage","Death's Dance","Edge of Night"]},{"name":"Contre AP","tags":["vs_ap"],"items":["Mercury's Treads","Black Cleaver","Sterak's Gage","Spirit Visage","Force of Nature","Death's Dance"]},{"name":"Contre AD","tags":["vs_ad"],"items":["Plated Steelcaps","Black Cleaver","Death's Dance","Randuin's Omen","Sterak's Gage","Jak'Sho, The Protean"]},{"name":"Anti-soins","tags":["vs_heal"],"items":["Plated Steelcaps","Black Cleaver","Chempunk Chainsword","Sterak's Gage","Death's Dance","Spirit Visage"]},{"name":"Sorts (Shojin)","tags":["spell_heavy"],"items":["Ionian Boots of Lucidity","Spear of Shojin","Black Cleaver","Sterak's Gage","Death's Dance","Sundered Sky"]},{"name":"Contre tanks","tags":["vs_tanks"],"items":["Plated Steelcaps","Trinity Force","Blade of the Ruined King","Black Cleaver","Sterak's Gage","Death's Dance"]},{"name":"Engagement en équipe","tags":["engage","teamfight"],"items":["Boots of Swiftness","Trailblazer","Black Cleaver","Sterak's Gage","Death's Dance","Spirit Visage"]},{"name":"En retard","tags":["behind"],"items":["Mercury's Treads","Sterak's Gage","Death's Dance","Spirit Visage","Jak'Sho, The Protean","Randuin's Omen"]}]},"AD_SKIRMISHER":{"label":"Duelliste AD","builds":[{"name":"Standard","tags":["default"],"items":["Plated Steelcaps","Ravenous Hydra","Trinity Force","Sterak's Gage","Death's Dance","Guardian Angel"]},{"name":"À l'impact","tags":["onhit"],"items":["Berserker's Greaves","Blade of the Ruined King","Guinsoo's Rageblade","Wit's End","Terminus","Sterak's Gage"]},{"name":"Contre AP","tags":["vs_ap"],"items":["Mercury's Treads","Blade of the Ruined King","Trinity Force","Wit's End","Maw of Malmortius","Death's Dance"]},{"name":"Contre AD","tags":["vs_ad"],"items":["Plated Steelcaps","Blade of the Ruined King","Trinity Force","Death's Dance","Randuin's Omen","Sterak's Gage"]},{"name":"Split push","tags":["split"],"items":["Plated Steelcaps","Trinity Force","Hullbreaker","Ravenous Hydra","Death's Dance","Sterak's Gage"]},{"name":"Contre tanks","tags":["vs_tanks"],"items":["Berserker's Greaves","Blade of the Ruined King","Terminus","Trinity Force","Sterak's Gage","Death's Dance"]},{"name":"Anti-soins","tags":["vs_heal"],"items":["Plated Steelcaps","Trinity Force","Chempunk Chainsword","Ravenous Hydra","Death's Dance","Sterak's Gage"]},{"name":"Boule de neige","tags":["ahead"],"items":["Plated Steelcaps","Eclipse","Ravenous Hydra","Hubris","Sterak's Gage","Guardian Angel"]},{"name":"Kraken (attaques rapides)","tags":["onhit","ahead"],"items":["Berserker's Greaves","Kraken Slayer","Blade of the Ruined King","Guinsoo's Rageblade","Death's Dance","Guardian Angel"]},{"name":"En retard","tags":["behind"],"items":["Mercury's Treads","Trinity Force","Sterak's Gage","Death's Dance","Spirit Visage","Jak'Sho, The Protean"]}]},"AD_CRIT_SKIRMISHER":{"label":"Duelliste critique (mêlée)","builds":[{"name":"Standard","tags":["default"],"items":["Berserker's Greaves","Yun Tal Wildarrows","Infinity Edge","Bloodthirster","Death's Dance","Guardian Angel"]},{"name":"Navori (sorts)","tags":["spell_heavy"],"items":["Berserker's Greaves","Navori Flickerblade","Infinity Edge","Bloodthirster","Death's Dance","Guardian Angel"]},{"name":"Contre tanks","tags":["vs_tanks"],"items":["Berserker's Greaves","Yun Tal Wildarrows","Infinity Edge","Lord Dominik's Regards","Blade of the Ruined King","Guardian Angel"]},{"name":"Contre AP","tags":["vs_ap"],"items":["Mercury's Treads","Yun Tal Wildarrows","Infinity Edge","Wit's End","Maw of Malmortius","Bloodthirster"]},{"name":"Contre AD","tags":["vs_ad"],"items":["Plated Steelcaps","Yun Tal Wildarrows","Infinity Edge","Death's Dance","Randuin's Omen","Guardian Angel"]},{"name":"Anti-soins","tags":["vs_heal"],"items":["Berserker's Greaves","Yun Tal Wildarrows","Infinity Edge","Mortal Reminder","Death's Dance","Guardian Angel"]},{"name":"Boule de neige","tags":["ahead"],"items":["Berserker's Greaves","The Collector","Infinity Edge","Yun Tal Wildarrows","Bloodthirster","Guardian Angel"]},{"name":"Sorts + critique (Gangplank)","tags":["spell_heavy","mana_scaler"],"items":["Ionian Boots of Lucidity","Trinity Force","Essence Reaver","Infinity Edge","Navori Flickerblade","Lord Dominik's Regards"]},{"name":"Teamfight (Statikk)","tags":["teamfight"],"items":["Berserker's Greaves","Statikk Shiv","Infinity Edge","Navori Flickerblade","Bloodthirster","Death's Dance"]},{"name":"En retard","tags":["behind"],"items":["Mercury's Treads","Yun Tal Wildarrows","Infinity Edge","Death's Dance","Sterak's Gage","Guardian Angel"]}]},"AD_ASSASSIN":{"label":"Assassin AD (létalité)","builds":[{"name":"Standard","tags":["default"],"items":["Ionian Boots of Lucidity","Profane Hydra","Youmuu's Ghostblade","Edge of Night","Serylda's Grudge","Guardian Angel"]},{"name":"Boule de neige","tags":["ahead"],"items":["Ionian Boots of Lucidity","Hubris","Profane Hydra","Opportunity","Serylda's Grudge","Guardian Angel"]},{"name":"Contre armure","tags":["vs_tanks","vs_armor"],"items":["Ionian Boots of Lucidity","Profane Hydra","Voltaic Cyclosword","Serylda's Grudge","Axiom Arc","Guardian Angel"]},{"name":"Contre boucliers","tags":["vs_shields"],"items":["Ionian Boots of Lucidity","Profane Hydra","Serpent's Fang","Youmuu's Ghostblade","Serylda's Grudge","Edge of Night"]},{"name":"Contre AP","tags":["vs_ap"],"items":["Mercury's Treads","Profane Hydra","Youmuu's Ghostblade","Edge of Night","Maw of Malmortius","Serylda's Grudge"]},{"name":"Contre AD","tags":["vs_ad"],"items":["Plated Steelcaps","Profane Hydra","Youmuu's Ghostblade","Death's Dance","Serylda's Grudge","Guardian Angel"]},{"name":"Anti-soins","tags":["vs_heal"],"items":["Ionian Boots of Lucidity","Profane Hydra","Youmuu's Ghostblade","Chempunk Chainsword","Serylda's Grudge","Edge of Night"]},{"name":"Réinitialisations (ultime)","tags":["ult_centric","teamfight"],"items":["Ionian Boots of Lucidity","Axiom Arc","Profane Hydra","Opportunity","Serylda's Grudge","Edge of Night"]},{"name":"Assassin-combattant","tags":["skirmish","frontline"],"items":["Ionian Boots of Lucidity","Eclipse","Profane Hydra","Black Cleaver","Death's Dance","Sterak's Gage"]},{"name":"En retard","tags":["behind"],"items":["Plated Steelcaps","Youmuu's Ghostblade","Edge of Night","Death's Dance","Guardian Angel","Maw of Malmortius"]}]},"ADC_CRIT":{"label":"Tireur critique","builds":[{"name":"Standard","tags":["default"],"items":["Berserker's Greaves","Yun Tal Wildarrows","Infinity Edge","Phantom Dancer","Lord Dominik's Regards","Bloodthirster"]},{"name":"Kraken","tags":["skirmish"],"items":["Berserker's Greaves","Kraken Slayer","Infinity Edge","Phantom Dancer","Lord Dominik's Regards","Bloodthirster"]},{"name":"Portée","tags":["poke","kite"],"items":["Berserker's Greaves","Yun Tal Wildarrows","Infinity Edge","Rapid Firecannon","Lord Dominik's Regards","Bloodthirster"]},{"name":"Contre tanks","tags":["vs_tanks"],"items":["Berserker's Greaves","Yun Tal Wildarrows","Infinity Edge","Lord Dominik's Regards","Blade of the Ruined King","Bloodthirster"]},{"name":"Contre assassins / plongeurs","tags":["vs_assassin","vs_dive","vs_ad"],"items":["Plated Steelcaps","Yun Tal Wildarrows","Infinity Edge","Phantom Dancer","Guardian Angel","Bloodthirster"]},{"name":"Contre AP","tags":["vs_ap"],"items":["Mercury's Treads","Yun Tal Wildarrows","Infinity Edge","Phantom Dancer","Mercurial Scimitar","Bloodthirster"]},{"name":"Anti-soins","tags":["vs_heal"],"items":["Berserker's Greaves","Yun Tal Wildarrows","Infinity Edge","Mortal Reminder","Phantom Dancer","Bloodthirster"]},{"name":"Teamfight (zone)","tags":["teamfight"],"items":["Berserker's Greaves","Statikk Shiv","Infinity Edge","Runaan's Hurricane","Lord Dominik's Regards","Bloodthirster"]},{"name":"Boule de neige","tags":["ahead"],"items":["Berserker's Greaves","The Collector","Infinity Edge","Phantom Dancer","Lord Dominik's Regards","Bloodthirster"]},{"name":"Contre contrôles / suppression","tags":["vs_cc","vs_suppression"],"items":["Mercury's Treads","Yun Tal Wildarrows","Infinity Edge","Mercurial Scimitar","Lord Dominik's Regards","Guardian Angel"]}]},"ADC_ONHIT":{"label":"Tireur à l'impact","builds":[{"name":"Standard","tags":["default"],"items":["Berserker's Greaves","Blade of the Ruined King","Guinsoo's Rageblade","Wit's End","Terminus","Guardian Angel"]},{"name":"Kraken","tags":["skirmish"],"items":["Berserker's Greaves","Kraken Slayer","Blade of the Ruined King","Guinsoo's Rageblade","Terminus","Guardian Angel"]},{"name":"Contre AP","tags":["vs_ap"],"items":["Mercury's Treads","Blade of the Ruined King","Guinsoo's Rageblade","Wit's End","Maw of Malmortius","Terminus"]},{"name":"Contre AD","tags":["vs_ad","vs_dive"],"items":["Plated Steelcaps","Blade of the Ruined King","Guinsoo's Rageblade","Terminus","Guardian Angel","Bloodthirster"]},{"name":"Contre tanks","tags":["vs_tanks"],"items":["Berserker's Greaves","Blade of the Ruined King","Guinsoo's Rageblade","Terminus","Kraken Slayer","Wit's End"]},{"name":"Anti-soins","tags":["vs_heal"],"items":["Berserker's Greaves","Blade of the Ruined King","Guinsoo's Rageblade","Mortal Reminder","Wit's End","Guardian Angel"]},{"name":"Hybride AP","tags":["ap_variant"],"items":["Berserker's Greaves","Nashor's Tooth","Guinsoo's Rageblade","Rabadon's Deathcap","Void Staff","Zhonya's Hourglass"]},{"name":"Boule de neige","tags":["ahead"],"items":["Berserker's Greaves","Kraken Slayer","Guinsoo's Rageblade","Blade of the Ruined King","Lord Dominik's Regards","Bloodthirster"]},{"name":"Contre contrôles / suppression","tags":["vs_cc","vs_suppression"],"items":["Mercury's Treads","Blade of the Ruined King","Guinsoo's Rageblade","Mercurial Scimitar","Wit's End","Guardian Angel"]},{"name":"En retard","tags":["behind"],"items":["Plated Steelcaps","Blade of the Ruined King","Wit's End","Guardian Angel","Mercurial Scimitar","Guinsoo's Rageblade"]}]},"ADC_CASTER":{"label":"Tireur à sorts / létalité","builds":[{"name":"Standard (mana)","tags":["default","mana_scaler"],"items":["Ionian Boots of Lucidity","Manamune","Trinity Force","Serylda's Grudge","Spear of Shojin","Guardian Angel"]},{"name":"Létalité","tags":["vs_squishy"],"items":["Ionian Boots of Lucidity","Youmuu's Ghostblade","Opportunity","Axiom Arc","Serylda's Grudge","Edge of Night"]},{"name":"Critique + sorts","tags":["spell_heavy"],"items":["Ionian Boots of Lucidity","Essence Reaver","Navori Flickerblade","Infinity Edge","Lord Dominik's Regards","Bloodthirster"]},{"name":"Contre tanks","tags":["vs_tanks"],"items":["Ionian Boots of Lucidity","Manamune","Trinity Force","Blade of the Ruined King","Lord Dominik's Regards","Guardian Angel"]},{"name":"Contre AD / plongeurs","tags":["vs_ad","vs_dive"],"items":["Plated Steelcaps","Manamune","Trinity Force","Serylda's Grudge","Guardian Angel","Death's Dance"]},{"name":"Contre AP","tags":["vs_ap"],"items":["Mercury's Treads","Manamune","Trinity Force","Maw of Malmortius","Serylda's Grudge","Mercurial Scimitar"]},{"name":"Anti-soins","tags":["vs_heal"],"items":["Ionian Boots of Lucidity","Manamune","Trinity Force","Mortal Reminder","Spear of Shojin","Guardian Angel"]},{"name":"Boule de neige","tags":["ahead"],"items":["Ionian Boots of Lucidity","The Collector","Youmuu's Ghostblade","Infinity Edge","Serylda's Grudge","Edge of Night"]},{"name":"Poke","tags":["poke"],"items":["Ionian Boots of Lucidity","Manamune","Eclipse","Spear of Shojin","Serylda's Grudge","Axiom Arc"]},{"name":"En retard","tags":["behind"],"items":["Mercury's Treads","Manamune","Trinity Force","Maw of Malmortius","Guardian Angel","Edge of Night"]}]}},"champions":{"Aatrox":{"roles":{"TOP":"AD_JUGGERNAUT"},"dmg":"AD","res":"NONE","range":"M","tags":["heal","dive"]},"Ahri":{"roles":{"MID":"MAGE_BURST"},"dmg":"AP","res":"MANA","range":"R","tags":["burst","cc","assassin"]},"Akali":{"roles":{"MID":"AP_ASSASSIN","TOP":"AP_ASSASSIN"},"dmg":"HYB","res":"ENERGY","range":"M","tags":["assassin","burst","stealth"]},"Akshan":{"roles":{"MID":"ADC_CRIT","TOP":"ADC_CRIT"},"dmg":"AD","res":"MANA","range":"R","tags":["aa","assassin","stealth"]},"Alistar":{"roles":{"SUP":"TANK_SUPPORT"},"dmg":"AP","res":"MANA","range":"M","tags":["cc","engage","tank","heal"]},"Ambessa":{"roles":{"TOP":"AD_DIVER","JGL":"AD_DIVER"},"dmg":"AD","res":"ENERGY","range":"M","tags":["dive","shield"]},"Amumu":{"roles":{"JGL":"AP_TANK","SUP":"TANK_SUPPORT"},"dmg":"AP","res":"MANA","range":"M","tags":["cc","engage","tank"]},"Anivia":{"roles":{"MID":"MAGE_BATTLE","SUP":"SUPPORT_MAGE"},"dmg":"AP","res":"MANA","range":"R","tags":["cc","poke"]},"Annie":{"roles":{"MID":"MAGE_BURST","SUP":"SUPPORT_MAGE"},"dmg":"AP","res":"MANA","range":"R","tags":["burst","cc","engage","shield"]},"Aphelios":{"roles":{"ADC":"ADC_CRIT"},"dmg":"AD","res":"MANA","range":"R","tags":["aa"]},"Ashe":{"roles":{"ADC":"ADC_CRIT","SUP":"ADC_CASTER"},"dmg":"AD","res":"MANA","range":"R","tags":["aa","cc","poke"]},"Aurelion Sol":{"roles":{"MID":"MAGE_BATTLE"},"dmg":"AP","res":"MANA","range":"R","tags":["poke","cc"]},"Aurora":{"roles":{"MID":"AP_ASSASSIN","TOP":"AP_ASSASSIN"},"dmg":"AP","res":"MANA","range":"R","tags":["burst","assassin"]},"Azir":{"roles":{"MID":"AP_ONHIT"},"dmg":"AP","res":"MANA","range":"R","tags":["poke","cc"]},"Bard":{"roles":{"SUP":"ENCHANTER"},"dmg":"AP","res":"MANA","range":"R","tags":["cc","heal"]},"Bel'Veth":{"roles":{"JGL":"AD_SKIRMISHER"},"dmg":"AD","res":"NONE","range":"M","tags":["aa","true"]},"Blitzcrank":{"roles":{"SUP":"TANK_SUPPORT"},"dmg":"AP","res":"MANA","range":"M","tags":["cc","engage","shield"]},"Brand":{"roles":{"SUP":"SUPPORT_MAGE","MID":"MAGE_BATTLE","JGL":"MAGE_BATTLE"},"dmg":"AP","res":"MANA","range":"R","tags":["pct_hp","poke","burst"]},"Braum":{"roles":{"SUP":"TANK_SUPPORT"},"dmg":"AD","res":"MANA","range":"M","tags":["cc","shield","tank"]},"Briar":{"roles":{"JGL":"AD_DIVER"},"dmg":"AD","res":"NONE","range":"M","tags":["heal","dive"]},"Caitlyn":{"roles":{"ADC":"ADC_CRIT"},"dmg":"AD","res":"MANA","range":"R","tags":["aa","poke"]},"Camille":{"roles":{"TOP":"AD_DIVER"},"dmg":"AD","res":"MANA","range":"M","tags":["dive","true","split","shield"]},"Cassiopeia":{"roles":{"MID":"MAGE_BATTLE","TOP":"MAGE_BATTLE"},"dmg":"AP","res":"MANA","range":"R","tags":["cc","heal"]},"Cho'Gath":{"roles":{"TOP":"TANK","MID":"AP_TANK"},"dmg":"AP","res":"MANA","range":"M","tags":["tank","cc","true","pct_hp"]},"Corki":{"roles":{"MID":"ADC_CASTER"},"dmg":"HYB","res":"MANA","range":"R","tags":["poke","true"]},"Darius":{"roles":{"TOP":"AD_JUGGERNAUT","JGL":"AD_JUGGERNAUT"},"dmg":"AD","res":"MANA","range":"M","tags":["heal","true"]},"Diana":{"roles":{"JGL":"AP_BRUISER","MID":"AP_ASSASSIN"},"dmg":"AP","res":"MANA","range":"M","tags":["dive","burst","shield"]},"Dr. Mundo":{"roles":{"TOP":"TANK","JGL":"TANK"},"dmg":"AD","res":"NONE","range":"M","tags":["heal","tank","pct_hp"]},"Draven":{"roles":{"ADC":"ADC_CRIT"},"dmg":"AD","res":"MANA","range":"R","tags":["aa","burst"]},"Ekko":{"roles":{"JGL":"AP_ASSASSIN","MID":"AP_ASSASSIN"},"dmg":"AP","res":"MANA","range":"M","tags":["assassin","burst","heal"]},"Elise":{"roles":{"JGL":"AP_ASSASSIN","SUP":"SUPPORT_MAGE"},"dmg":"AP","res":"MANA","range":"R","tags":["assassin","cc","pct_hp"]},"Evelynn":{"roles":{"JGL":"AP_ASSASSIN"},"dmg":"AP","res":"MANA","range":"M","tags":["assassin","stealth","burst"]},"Ezreal":{"roles":{"ADC":"ADC_CASTER"},"dmg":"AD","res":"MANA","range":"R","tags":["poke"]},"Fiddlesticks":{"roles":{"JGL":"MAGE_BATTLE","SUP":"SUPPORT_MAGE"},"dmg":"AP","res":"MANA","range":"R","tags":["cc","heal","burst"]},"Fiora":{"roles":{"TOP":"AD_SKIRMISHER"},"dmg":"AD","res":"MANA","range":"M","tags":["true","split","heal"]},"Fizz":{"roles":{"MID":"AP_ASSASSIN"},"dmg":"AP","res":"MANA","range":"M","tags":["assassin","burst"]},"Galio":{"roles":{"MID":"AP_TANK","SUP":"TANK_SUPPORT"},"dmg":"AP","res":"MANA","range":"M","tags":["cc","engage","tank","shield"]},"Gangplank":{"roles":{"TOP":"AD_CRIT_SKIRMISHER"},"dmg":"AD","res":"MANA","range":"M","tags":["poke","true","split"]},"Garen":{"roles":{"TOP":"AD_JUGGERNAUT"},"dmg":"AD","res":"NONE","range":"M","tags":["true","tank","shield"]},"Gnar":{"roles":{"TOP":"AD_DIVER"},"dmg":"AD","res":"NONE","range":"R","tags":["cc","pct_hp","tank"]},"Gragas":{"roles":{"JGL":"AP_BRUISER","TOP":"AP_BRUISER","SUP":"TANK_SUPPORT"},"dmg":"AP","res":"MANA","range":"M","tags":["cc","engage","heal"]},"Graves":{"roles":{"JGL":"ADC_CASTER"},"dmg":"AD","res":"MANA","range":"R","tags":["burst"]},"Gwen":{"roles":{"TOP":"AP_ONHIT","JGL":"AP_ONHIT"},"dmg":"AP","res":"MANA","range":"M","tags":["true","heal","split"]},"Hecarim":{"roles":{"JGL":"AD_DIVER"},"dmg":"AD","res":"MANA","range":"M","tags":["engage","dive","heal"]},"Heimerdinger":{"roles":{"MID":"MAGE_BATTLE","TOP":"MAGE_BATTLE","SUP":"SUPPORT_MAGE"},"dmg":"AP","res":"MANA","range":"R","tags":["poke","cc"]},"Hwei":{"roles":{"MID":"MAGE_ARTILLERY","SUP":"SUPPORT_MAGE"},"dmg":"AP","res":"MANA","range":"R","tags":["poke","cc"]},"Illaoi":{"roles":{"TOP":"AD_JUGGERNAUT"},"dmg":"AD","res":"MANA","range":"M","tags":["heal","split"]},"Irelia":{"roles":{"TOP":"AD_SKIRMISHER","MID":"AD_SKIRMISHER"},"dmg":"AD","res":"MANA","range":"M","tags":["dive","heal","true"]},"Ivern":{"roles":{"JGL":"ENCHANTER"},"dmg":"AP","res":"MANA","range":"R","tags":["shield","cc"]},"Janna":{"roles":{"SUP":"ENCHANTER"},"dmg":"AP","res":"MANA","range":"R","tags":["shield","cc","heal"]},"Jarvan IV":{"roles":{"JGL":"AD_DIVER"},"dmg":"AD","res":"MANA","range":"M","tags":["engage","cc"]},"Jax":{"roles":{"TOP":"AD_SKIRMISHER","JGL":"AD_SKIRMISHER"},"dmg":"AD","res":"MANA","range":"M","tags":["aa","split","dive"]},"Jayce":{"roles":{"TOP":"ADC_CASTER","MID":"ADC_CASTER"},"dmg":"AD","res":"MANA","range":"R","tags":["poke","burst"]},"Jhin":{"roles":{"ADC":"ADC_CASTER"},"dmg":"AD","res":"MANA","range":"R","tags":["poke","burst"]},"Jinx":{"roles":{"ADC":"ADC_CRIT"},"dmg":"AD","res":"MANA","range":"R","tags":["aa"]},"K'Sante":{"roles":{"TOP":"TANK"},"dmg":"AD","res":"MANA","range":"M","tags":["tank","cc","true"]},"Kai'Sa":{"roles":{"ADC":"ADC_ONHIT"},"dmg":"HYB","res":"MANA","range":"R","tags":["aa","burst"]},"Kalista":{"roles":{"ADC":"ADC_ONHIT"},"dmg":"AD","res":"MANA","range":"R","tags":["aa"]},"Karma":{"roles":{"SUP":"ENCHANTER","MID":"MAGE_ARTILLERY","TOP":"MAGE_ARTILLERY"},"dmg":"AP","res":"MANA","range":"R","tags":["shield","poke"]},"Karthus":{"roles":{"JGL":"MAGE_BATTLE","MID":"MAGE_BATTLE","ADC":"MAGE_BATTLE"},"dmg":"AP","res":"MANA","range":"R","tags":["burst"]},"Kassadin":{"roles":{"MID":"AP_ASSASSIN"},"dmg":"AP","res":"MANA","range":"M","tags":["assassin","burst"]},"Katarina":{"roles":{"MID":"AP_ASSASSIN"},"dmg":"HYB","res":"NONE","range":"M","tags":["assassin","burst"]},"Kayle":{"roles":{"TOP":"AP_ONHIT","MID":"AP_ONHIT"},"dmg":"HYB","res":"MANA","range":"R","tags":["aa","true","heal"]},"Kayn":{"roles":{"JGL":"AD_ASSASSIN"},"dmg":"AD","res":"MANA","range":"M","tags":["assassin","dive","heal"]},"Kennen":{"roles":{"TOP":"MAGE_BURST","MID":"MAGE_BURST"},"dmg":"AP","res":"ENERGY","range":"R","tags":["cc","engage","burst"]},"Kha'Zix":{"roles":{"JGL":"AD_ASSASSIN"},"dmg":"AD","res":"MANA","range":"M","tags":["assassin","stealth","burst"]},"Kindred":{"roles":{"JGL":"ADC_CRIT"},"dmg":"AD","res":"MANA","range":"R","tags":["aa","pct_hp"]},"Kled":{"roles":{"TOP":"AD_DIVER"},"dmg":"AD","res":"NONE","range":"M","tags":["engage","dive"]},"Kog'Maw":{"roles":{"ADC":"ADC_ONHIT"},"dmg":"HYB","res":"MANA","range":"R","tags":["aa","pct_hp","poke"]},"LeBlanc":{"roles":{"MID":"MAGE_BURST"},"dmg":"AP","res":"MANA","range":"R","tags":["assassin","burst","cc"]},"Lee Sin":{"roles":{"JGL":"AD_DIVER"},"dmg":"AD","res":"ENERGY","range":"M","tags":["dive","shield"]},"Leona":{"roles":{"SUP":"TANK_SUPPORT"},"dmg":"AP","res":"MANA","range":"M","tags":["cc","engage","tank"]},"Lillia":{"roles":{"JGL":"AP_BRUISER","TOP":"AP_BRUISER"},"dmg":"AP","res":"MANA","range":"M","tags":["cc","pct_hp","heal"]},"Lissandra":{"roles":{"MID":"MAGE_BURST"},"dmg":"AP","res":"MANA","range":"R","tags":["cc","engage","burst"]},"Locke":{"roles":{"MID":"AP_ASSASSIN"},"dmg":"AP","res":"MANA","range":"M","tags":["assassin","burst","heal"]},"Lucian":{"roles":{"ADC":"ADC_CASTER","MID":"ADC_CASTER"},"dmg":"AD","res":"MANA","range":"R","tags":["burst","dive"]},"Lulu":{"roles":{"SUP":"ENCHANTER"},"dmg":"AP","res":"MANA","range":"R","tags":["shield","cc"]},"Lux":{"roles":{"SUP":"SUPPORT_MAGE","MID":"MAGE_ARTILLERY"},"dmg":"AP","res":"MANA","range":"R","tags":["poke","burst","cc","shield"]},"Malphite":{"roles":{"TOP":"TANK","SUP":"TANK_SUPPORT","MID":"AP_TANK"},"dmg":"AP","res":"MANA","range":"M","tags":["engage","cc","tank","burst"]},"Malzahar":{"roles":{"MID":"MAGE_BATTLE"},"dmg":"AP","res":"MANA","range":"R","tags":["suppression"]},"Maokai":{"roles":{"SUP":"TANK_SUPPORT","JGL":"AP_TANK","TOP":"TANK"},"dmg":"AP","res":"MANA","range":"M","tags":["cc","engage","tank","heal"]},"Master Yi":{"roles":{"JGL":"AD_SKIRMISHER"},"dmg":"AD","res":"MANA","range":"M","tags":["aa","true","heal"]},"Mel":{"roles":{"MID":"MAGE_ARTILLERY","SUP":"SUPPORT_MAGE"},"dmg":"AP","res":"MANA","range":"R","tags":["poke","burst"]},"Milio":{"roles":{"SUP":"ENCHANTER"},"dmg":"AP","res":"MANA","range":"R","tags":["heal","shield"]},"Miss Fortune":{"roles":{"ADC":"ADC_CRIT"},"dmg":"AD","res":"MANA","range":"R","tags":["poke","burst"]},"Mordekaiser":{"roles":{"TOP":"AP_BRUISER","JGL":"AP_BRUISER"},"dmg":"AP","res":"NONE","range":"M","tags":["shield","heal"]},"Morgana":{"roles":{"SUP":"SUPPORT_MAGE","MID":"MAGE_BATTLE","JGL":"MAGE_BATTLE"},"dmg":"AP","res":"MANA","range":"R","tags":["cc","shield"]},"Naafiri":{"roles":{"MID":"AD_ASSASSIN"},"dmg":"AD","res":"NONE","range":"M","tags":["assassin","burst"]},"Nami":{"roles":{"SUP":"ENCHANTER"},"dmg":"AP","res":"MANA","range":"R","tags":["heal","cc"]},"Nasus":{"roles":{"TOP":"AD_JUGGERNAUT"},"dmg":"AD","res":"MANA","range":"M","tags":["heal","split","tank"]},"Nautilus":{"roles":{"SUP":"TANK_SUPPORT"},"dmg":"AP","res":"MANA","range":"M","tags":["cc","engage","tank","shield"]},"Neeko":{"roles":{"MID":"MAGE_BURST","SUP":"SUPPORT_MAGE"},"dmg":"AP","res":"MANA","range":"R","tags":["cc","burst","engage"]},"Nidalee":{"roles":{"JGL":"AP_ASSASSIN"},"dmg":"AP","res":"MANA","range":"R","tags":["poke","assassin","heal"]},"Nilah":{"roles":{"ADC":"AD_CRIT_SKIRMISHER"},"dmg":"AD","res":"MANA","range":"M","tags":["aa","heal"]},"Nocturne":{"roles":{"JGL":"AD_DIVER"},"dmg":"AD","res":"MANA","range":"M","tags":["dive","assassin"]},"Nunu & Willump":{"roles":{"JGL":"AP_TANK"},"dmg":"AP","res":"MANA","range":"M","tags":["cc","engage","tank","heal"]},"Olaf":{"roles":{"JGL":"AD_JUGGERNAUT","TOP":"AD_JUGGERNAUT"},"dmg":"AD","res":"MANA","range":"M","tags":["heal","true","dive"]},"Orianna":{"roles":{"MID":"MAGE_BURST"},"dmg":"AP","res":"MANA","range":"R","tags":["cc","shield"]},"Ornn":{"roles":{"TOP":"TANK"},"dmg":"HYB","res":"MANA","range":"M","tags":["tank","cc","engage"]},"Pantheon":{"roles":{"SUP":"AD_ASSASSIN","MID":"AD_ASSASSIN","TOP":"AD_DIVER","JGL":"AD_DIVER"},"dmg":"AD","res":"MANA","range":"M","tags":["burst","dive"]},"Poppy":{"roles":{"TOP":"TANK","JGL":"TANK","SUP":"TANK_SUPPORT"},"dmg":"AD","res":"MANA","range":"M","tags":["cc","tank"]},"Pyke":{"roles":{"SUP":"AD_ASSASSIN"},"dmg":"AD","res":"MANA","range":"M","tags":["cc","assassin","true","heal"]},"Qiyana":{"roles":{"MID":"AD_ASSASSIN","JGL":"AD_ASSASSIN"},"dmg":"AD","res":"MANA","range":"M","tags":["assassin","burst","cc"]},"Quinn":{"roles":{"TOP":"ADC_CASTER"},"dmg":"AD","res":"MANA","range":"R","tags":["aa","split"]},"Rakan":{"roles":{"SUP":"ENCHANTER"},"dmg":"AP","res":"MANA","range":"M","tags":["cc","engage","heal"]},"Rammus":{"roles":{"JGL":"TANK"},"dmg":"HYB","res":"MANA","range":"M","tags":["tank","cc","engage"]},"Rek'Sai":{"roles":{"JGL":"AD_DIVER"},"dmg":"AD","res":"NONE","range":"M","tags":["dive","true"]},"Rell":{"roles":{"SUP":"TANK_SUPPORT"},"dmg":"AP","res":"MANA","range":"M","tags":["cc","engage","tank"]},"Renata Glasc":{"roles":{"SUP":"ENCHANTER"},"dmg":"AP","res":"MANA","range":"R","tags":["shield","cc"]},"Renekton":{"roles":{"TOP":"AD_DIVER"},"dmg":"AD","res":"NONE","range":"M","tags":["heal","dive"]},"Rengar":{"roles":{"JGL":"AD_ASSASSIN","TOP":"AD_ASSASSIN"},"dmg":"AD","res":"NONE","range":"M","tags":["assassin","stealth","burst"]},"Riven":{"roles":{"TOP":"AD_DIVER"},"dmg":"AD","res":"NONE","range":"M","tags":["dive","shield","burst"]},"Rumble":{"roles":{"TOP":"MAGE_BATTLE","MID":"MAGE_BATTLE","JGL":"MAGE_BATTLE"},"dmg":"AP","res":"NONE","range":"M","tags":["burst","sustain_ap"]},"Ryze":{"roles":{"MID":"MAGE_BATTLE","TOP":"MAGE_BATTLE"},"dmg":"AP","res":"MANA","range":"R","tags":["shield"]},"Samira":{"roles":{"ADC":"ADC_CRIT"},"dmg":"AD","res":"MANA","range":"R","tags":["aa","heal","burst"]},"Sejuani":{"roles":{"JGL":"TANK"},"dmg":"AP","res":"MANA","range":"M","tags":["cc","engage","tank"]},"Senna":{"roles":{"SUP":"ADC_CASTER","ADC":"ADC_CRIT"},"dmg":"AD","res":"MANA","range":"R","tags":["heal","shield","poke"]},"Seraphine":{"roles":{"SUP":"ENCHANTER","MID":"MAGE_BURST","ADC":"MAGE_BATTLE"},"dmg":"AP","res":"MANA","range":"R","tags":["heal","shield","cc"]},"Sett":{"roles":{"TOP":"AD_JUGGERNAUT","SUP":"TANK_SUPPORT"},"dmg":"AD","res":"NONE","range":"M","tags":["shield","true"]},"Shaco":{"roles":{"JGL":"AD_ASSASSIN","SUP":"SUPPORT_MAGE"},"dmg":"AD","res":"MANA","range":"M","tags":["assassin","stealth"]},"Shen":{"roles":{"TOP":"TANK","SUP":"TANK_SUPPORT"},"dmg":"AD","res":"ENERGY","range":"M","tags":["tank","shield","engage","split"]},"Shyvana":{"roles":{"JGL":"AD_JUGGERNAUT"},"dmg":"HYB","res":"NONE","range":"M","tags":["dive"]},"Singed":{"roles":{"TOP":"AP_TANK"},"dmg":"AP","res":"MANA","range":"M","tags":["tank"]},"Sion":{"roles":{"TOP":"TANK"},"dmg":"AD","res":"MANA","range":"M","tags":["tank","engage","shield"]},"Sivir":{"roles":{"ADC":"ADC_CRIT"},"dmg":"AD","res":"MANA","range":"R","tags":["aa","shield"]},"Skarner":{"roles":{"JGL":"TANK","TOP":"TANK"},"dmg":"AD","res":"MANA","range":"M","tags":["suppression","tank","engage"]},"Smolder":{"roles":{"ADC":"ADC_CASTER","MID":"ADC_CASTER"},"dmg":"AD","res":"MANA","range":"R","tags":["poke"]},"Sona":{"roles":{"SUP":"ENCHANTER"},"dmg":"AP","res":"MANA","range":"R","tags":["heal","poke"]},"Soraka":{"roles":{"SUP":"ENCHANTER"},"dmg":"AP","res":"MANA","range":"R","tags":["heal"]},"Swain":{"roles":{"TOP":"MAGE_BATTLE","MID":"MAGE_BATTLE","SUP":"SUPPORT_MAGE","ADC":"MAGE_BATTLE"},"dmg":"AP","res":"MANA","range":"R","tags":["heal","cc","sustain_ap"]},"Sylas":{"roles":{"MID":"AP_BRUISER","JGL":"AP_BRUISER","TOP":"AP_BRUISER"},"dmg":"AP","res":"MANA","range":"M","tags":["heal","burst"]},"Syndra":{"roles":{"MID":"MAGE_BURST"},"dmg":"AP","res":"MANA","range":"R","tags":["burst","cc"]},"Tahm Kench":{"roles":{"TOP":"TANK","SUP":"TANK_SUPPORT"},"dmg":"AP","res":"MANA","range":"M","tags":["tank","shield","heal"]},"Taliyah":{"roles":{"JGL":"MAGE_BATTLE","MID":"MAGE_BATTLE"},"dmg":"AP","res":"MANA","range":"R","tags":["cc","burst"]},"Talon":{"roles":{"MID":"AD_ASSASSIN","JGL":"AD_ASSASSIN"},"dmg":"AD","res":"MANA","range":"M","tags":["assassin","burst"]},"Taric":{"roles":{"SUP":"TANK_SUPPORT"},"dmg":"AP","res":"MANA","range":"M","tags":["heal","shield","cc"]},"Teemo":{"roles":{"TOP":"AP_ONHIT"},"dmg":"AP","res":"MANA","range":"R","tags":["poke","stealth"]},"Thresh":{"roles":{"SUP":"TANK_SUPPORT"},"dmg":"AP","res":"MANA","range":"R","tags":["cc","engage","shield"]},"Tristana":{"roles":{"ADC":"ADC_CRIT","MID":"ADC_CRIT"},"dmg":"AD","res":"MANA","range":"R","tags":["aa","burst"]},"Trundle":{"roles":{"TOP":"AD_JUGGERNAUT","JGL":"AD_JUGGERNAUT"},"dmg":"AD","res":"MANA","range":"M","tags":["heal","split","pct_hp"]},"Tryndamere":{"roles":{"TOP":"AD_CRIT_SKIRMISHER"},"dmg":"AD","res":"NONE","range":"M","tags":["aa","split","heal"]},"Twisted Fate":{"roles":{"MID":"MAGE_BURST"},"dmg":"AP","res":"MANA","range":"R","tags":["cc","burst"]},"Twitch":{"roles":{"ADC":"ADC_CRIT"},"dmg":"HYB","res":"MANA","range":"R","tags":["aa","stealth"]},"Udyr":{"roles":{"JGL":"AD_JUGGERNAUT","TOP":"AD_JUGGERNAUT"},"dmg":"HYB","res":"MANA","range":"M","tags":["shield"]},"Urgot":{"roles":{"TOP":"AD_JUGGERNAUT"},"dmg":"AD","res":"MANA","range":"R","tags":["suppression","shield","pct_hp"]},"Varus":{"roles":{"ADC":"ADC_CASTER","MID":"ADC_CASTER"},"dmg":"AD","res":"MANA","range":"R","tags":["poke","cc","pct_hp"]},"Vayne":{"roles":{"ADC":"ADC_ONHIT","TOP":"ADC_ONHIT"},"dmg":"AD","res":"MANA","range":"R","tags":["aa","true","stealth"]},"Veigar":{"roles":{"MID":"MAGE_BURST","SUP":"SUPPORT_MAGE"},"dmg":"AP","res":"MANA","range":"R","tags":["burst","cc"]},"Vel'Koz":{"roles":{"SUP":"SUPPORT_MAGE","MID":"MAGE_ARTILLERY"},"dmg":"AP","res":"MANA","range":"R","tags":["poke","true"]},"Vex":{"roles":{"MID":"MAGE_BURST"},"dmg":"AP","res":"MANA","range":"R","tags":["burst","cc"]},"Vi":{"roles":{"JGL":"AD_DIVER"},"dmg":"AD","res":"MANA","range":"M","tags":["dive","cc","engage","shield"]},"Viego":{"roles":{"JGL":"AD_SKIRMISHER"},"dmg":"AD","res":"NONE","range":"M","tags":["aa","heal"]},"Viktor":{"roles":{"MID":"MAGE_BATTLE"},"dmg":"AP","res":"MANA","range":"R","tags":["poke","shield"]},"Vladimir":{"roles":{"MID":"MAGE_BATTLE","TOP":"MAGE_BATTLE"},"dmg":"AP","res":"NONE","range":"R","tags":["heal","sustain_ap"]},"Volibear":{"roles":{"TOP":"AD_JUGGERNAUT","JGL":"AD_JUGGERNAUT"},"dmg":"HYB","res":"MANA","range":"M","tags":["dive","heal","shield","tank"]},"Warwick":{"roles":{"JGL":"AD_JUGGERNAUT","TOP":"AD_JUGGERNAUT"},"dmg":"AD","res":"MANA","range":"M","tags":["heal","suppression","dive"]},"Wukong":{"roles":{"JGL":"AD_DIVER","TOP":"AD_DIVER"},"dmg":"AD","res":"MANA","range":"M","tags":["engage","cc","stealth"]},"Xayah":{"roles":{"ADC":"ADC_CRIT"},"dmg":"AD","res":"MANA","range":"R","tags":["aa"]},"Xerath":{"roles":{"MID":"MAGE_ARTILLERY","SUP":"SUPPORT_MAGE"},"dmg":"AP","res":"MANA","range":"R","tags":["poke"]},"Xin Zhao":{"roles":{"JGL":"AD_DIVER"},"dmg":"AD","res":"MANA","range":"M","tags":["dive","heal"]},"Yasuo":{"roles":{"MID":"AD_CRIT_SKIRMISHER","TOP":"AD_CRIT_SKIRMISHER","ADC":"AD_CRIT_SKIRMISHER"},"dmg":"AD","res":"NONE","range":"M","tags":["aa","shield"]},"Yone":{"roles":{"MID":"AD_CRIT_SKIRMISHER","TOP":"AD_CRIT_SKIRMISHER"},"dmg":"HYB","res":"NONE","range":"M","tags":["aa","shield","dive"]},"Yorick":{"roles":{"TOP":"AD_JUGGERNAUT"},"dmg":"AD","res":"MANA","range":"M","tags":["split"]},"Yunara":{"roles":{"ADC":"ADC_ONHIT"},"dmg":"AD","res":"MANA","range":"R","tags":["aa"]},"Yuumi":{"roles":{"SUP":"ENCHANTER"},"dmg":"AP","res":"MANA","range":"R","tags":["heal"]},"Zaahen":{"roles":{"TOP":"AD_DIVER","JGL":"AD_DIVER"},"dmg":"AD","res":"MANA","range":"M","tags":["heal","dive"]},"Zac":{"roles":{"JGL":"AP_TANK","TOP":"AP_TANK","SUP":"TANK_SUPPORT"},"dmg":"AP","res":"NONE","range":"M","tags":["cc","engage","tank","heal"]},"Zed":{"roles":{"MID":"AD_ASSASSIN","JGL":"AD_ASSASSIN"},"dmg":"AD","res":"ENERGY","range":"M","tags":["assassin","burst"]},"Zeri":{"roles":{"ADC":"ADC_CRIT"},"dmg":"AD","res":"MANA","range":"R","tags":["aa","shield"]},"Ziggs":{"roles":{"MID":"MAGE_ARTILLERY","ADC":"MAGE_ARTILLERY"},"dmg":"AP","res":"MANA","range":"R","tags":["poke"]},"Zilean":{"roles":{"SUP":"SUPPORT_MAGE","MID":"MAGE_ARTILLERY"},"dmg":"AP","res":"MANA","range":"R","tags":["cc"]},"Zoe":{"roles":{"MID":"MAGE_BURST"},"dmg":"AP","res":"MANA","range":"R","tags":["burst","poke","cc"]},"Zyra":{"roles":{"SUP":"SUPPORT_MAGE","JGL":"MAGE_BATTLE"},"dmg":"AP","res":"MANA","range":"R","tags":["poke","cc"]}}}
```


## Sources

- LoL Wiki – Module:ItemData/data (objets, groupes exclusifs) : https://wiki.leagueoflegends.com/en-us/Module:ItemData/data
- LoL Wiki – Swain : https://wiki.leagueoflegends.com/Swain
- dodge.gg – Guide des bottes 2026 : https://www.dodge.gg/lol/news/boots-guide-2026
- Strafe – Liste des champions et classes : https://www.strafe.com/articles/read/every-league-of-legends-champion-release-date/
- Sheep Esports – Locke : https://www.sheepesports.com/us/articles/all-locke-abilities-explained/en
- MetaSrc – Zaahen : https://www.metasrc.com/lol/champions/zaahen/jungle/info
