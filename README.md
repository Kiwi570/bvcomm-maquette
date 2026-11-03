# BV Communications : maquette « Le fil unique »

Maquette du nouveau site de BV Communications (bvcomm.com), en français et en anglais.
Adresse prévue : https://bvcomm-maquette.vercel.app

## Pages

| Page | Français | Anglais |
|---|---|---|
| Accueil : promesse, jeu du blâme, 4 services, comparateur, estimateur, parcours, preuves, contact | `/` | `/en` |
| Téléphonie IP : Voxfon, 3CX, lignes SIP, téléphones et casques, questions | `/telephonie` | `/en/telephonie` |
| Évaluation gratuite : formulaire en 5 étapes, coordonnées | `/evaluation` | `/en/evaluation` |
| Mentions légales, conditions générales, confidentialité, plaintes, avis 9-1-1 | `/mentions-legales`… | `/en/mentions-legales`… |
| Page introuvable | `/404` | `/en/404` |

Internet, câblage et lignes traditionnelles sont présentés sur l'accueil (le périmètre retenu : accueil et deux pages types).

## Travailler sur la maquette

- Textes : `donnees/textes/fr.json` et `donnees/textes/en.json`. Données : `donnees/*.json` (tarifs, témoignages, clients, téléphonie, conditions…). Une seule source par information : les prix de l'estimateur, du comparateur et de la page Téléphonie viennent tous de `donnees/tarifs.json`.
- Pages : `source/pages/*.mjs`. Style : `assets/css/site.css`. Effets : `assets/js/site.js`. Le socle (`assets/js/socle/`) ne se modifie pas.
- Après toute modification : `node outils/generer.mjs`, puis `node outils/images-partage.mjs`, puis `node _audit/audit.mjs`.
- Images : `python3 outils/images.py recu/lot.json` (originaux dans `recu/`, non mis en ligne).

## À retirer à la mise en ligne définitive

- La consigne `noindex` : balise robots dans `source/gabarits/commun.mjs` et en-tête `X-Robots-Tag` dans `vercel.json`.
- Le formulaire simulé (rien n'est envoyé) : à brancher sur un vrai envoi.
- Les mentions « à compléter » et « à confirmer » (fiche dans les mentions légales).
- La mention « Recommandation indicative » et « Estimation indicative » seulement si BV Communications le souhaite : elles protègent tant que les prix ne sont pas confirmés.

## À garder

- La mention « Illustration générée » sur chaque image créée par IA (dossier `assets/images/grok/`), tant que ces images restent en place.

## À fournir par BV Communications

Raison sociale, NEQ, responsable de la protection des renseignements personnels (Loi 25), horaires et soutien 24/7 confirmés, devise et taxes des prix, tarification SIP (par utilisateur ou par canal), remises Voxfon, statut 3CX à jour, autorisation d'afficher les logos clients, nom complet de l'entreprise « Wi », logo vectoriel, vraies photos (équipe, bureau, chantiers), texte de l'avis 9-1-1, version française des conditions validée par un juriste.
