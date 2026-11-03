/* Accueil : promesse « un fournisseur », jeu du blâme, quatre services, comparateur, estimateur,
   parcours, preuves, contact. L'ordre suit ce que cherche le visiteur : quoi, pour moi, combien, preuves, comment, contact. */
import { html, brut } from '../../outils/gabarit.mjs';
import { un, prix, temoignage, coche, fleche, logo, donneesJs } from '../gabarits/elements.mjs';

export const page = { cle: 'accueil', fichier: 'index', imagePartage: 'grok/accueil-ouverture-1168.webp' };

const ligneTitre = (c, cle, n) => {
  const t = c.s(cle), i = t.indexOf(' ');
  return html`<span class="ligne-masque"><span class="hero-ligne" data-anime="gsap"><span class="mot-un mot-un--${n}">${t.slice(0, i)}</span> ${t.slice(i + 1)}</span></span>`;
};

/* Estimation par défaut, écrite dans la page (lisible sans JavaScript) : Voxfon 10 utilisateurs + FTTN. */
function factureDefaut(c, T) {
  const palier = T.voxfon.find((p) => 10 >= p.min && (p.max == null || 10 <= p.max));
  const lignes = [
    { lib: c.s('accueil.estimateur.ligneVoxfon', { n: 10, p: prix(c, palier.prix) }), v: 10 * palier.prix },
    { lib: c.s('accueil.estimateur.ligneInternet', { nom: c.s('accueil.estimateur.fttn') }), v: T.internet[0].prix },
  ];
  return { lignes, total: Math.round(lignes.reduce((a, l) => a + l.v, 0) * 100) / 100 };
}

const pas = (c, nom, min, max, val, libelle, id) => html`<div class="pas" data-pas>
  <span class="pas-libelle" id="${id}-lib">${libelle}</span>
  <div class="pas-controle">
    <button type="button" class="pas-bouton" data-pas-moins aria-label="${c.s('accueil.estimateur.moins')}" aria-controls="${id}">−</button>
    <input id="${id}" name="${nom}" type="number" inputmode="numeric" min="${min}" max="${max}" value="${val}" aria-labelledby="${id}-lib">
    <button type="button" class="pas-bouton" data-pas-plus aria-label="${c.s('accueil.estimateur.plus')}" aria-controls="${id}">+</button>
  </div>
</div>`;

const choix = (nom, valeur, libelle, coche = false, attrs = '') => html`<label class="choix"><input type="radio" name="${nom}" value="${valeur}"${coche ? brut(' checked') : ''}${brut(attrs ? ' ' + attrs : '')}><span>${libelle}</span></label>`;

export default (c) => {
  const A = c.donnees.accueil, T = c.donnees.tarifs;
  const annees = new Date().getFullYear() - c.site.fondation;
  const defaut = factureDefaut(c, T);
  const ev = (params) => c.url('evaluation', '', params);
  return html`
<section class="hero" id="debut">
  ${c.media({ nom: 'grok/accueil-ouverture', alt: c.s('accueil.hero.alt'), cadrage: '72% 50%', cadrageMobile: '50% 80%', priorite: true, classe: 'hero-fond', sizes: '100vw' })}
  <canvas class="hero-gl" width="16" height="9" aria-hidden="true" data-audit-ignorer></canvas>
  <div class="hero-grille conteneur">
    <div class="hero-texte">
      <p class="surtitre" data-anime="gsap">${c.t('accueil.hero.surtitre')}</p>
      <h1 class="hero-titre" data-superpose>${ligneTitre(c, 'accueil.hero.titre1', 1)}${ligneTitre(c, 'accueil.hero.titre2', 2)}${ligneTitre(c, 'accueil.hero.titre3', 3)}</h1>
      <p class="hero-intro" data-anime="gsap">${c.t('accueil.hero.texte')}</p>
      <p class="hero-actions" data-anime="gsap">
        ${c.lien('evaluation', { classe: 'bouton bouton--grand', texte: html`${c.t('accueil.hero.action')} ${fleche}`, attrs: 'data-action-principale' })}
        <a class="hero-tel" href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a>
      </p>
      <p class="hero-info" data-info-cle data-anime="gsap">${c.t('accueil.hero.info')}</p>
    </div>
    <div class="hero-un-zone">${un(c, { classe: 'hero-un', titre: c.s('accueil.hero.un') })}</div>
  </div>
</section>

<section class="blame conteneur" id="un-seul-fournisseur">
  ${c.media({ nom: 'grok/accueil-blame', alt: c.s('accueil.blame.alt'), cadrage: '40% 45%', classe: 'blame-media', sizes: '(max-width: 760px) 100vw, 34vw' })}
  <div class="blame-texte">
    <h2 class="titre-onde">${c.t('accueil.blame.titre')}</h2>
    <p data-anime>${c.t('accueil.blame.texte')}</p>
    <div class="blame-schema" data-blame data-visuel role="img" aria-label="${c.s('accueil.blame.schema')}">
      <svg class="blame-liens" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path class="blame-lien" d="M70 50 L200 150 M330 50 L200 150 M70 250 L200 150 M330 250 L200 150"/>
        <path class="blame-renvoi" d="M70 50 L330 50 L330 250 L70 250 Z"/>
        <circle class="blame-point" r="9" cx="70" cy="50"/>
      </svg>
      <span class="blame-noeud blame-noeud--a" aria-hidden="true">${c.t('accueil.blame.a')}</span>
      <span class="blame-noeud blame-noeud--b" aria-hidden="true">${c.t('accueil.blame.b')}</span>
      <span class="blame-noeud blame-noeud--c" aria-hidden="true">${c.t('accueil.blame.c')}</span>
      <span class="blame-noeud blame-noeud--d" aria-hidden="true">${c.t('accueil.blame.d')}</span>
      <span class="blame-question" aria-hidden="true">${c.t('accueil.blame.question')}</span>
      <span class="blame-centre" aria-hidden="true"><img src="/assets/images/logo.webp" alt="" width="92" height="36"><span>${c.t('accueil.blame.reponse')}</span></span>
    </div>
  </div>
</section>

<section class="services" id="services">
  <div class="conteneur services-grille">
    <div class="services-tete">
      <div class="services-colle">
        <h2 class="titre-onde">${c.t('accueil.services.titre')}</h2>
        <p data-anime>${c.t('accueil.services.texte')}</p>
        <ol class="services-index" aria-label="${c.s('accueil.services.indicateur')}">
          ${A.services.map((s, i) => html`<li data-index="${s.id}" class="matiere-${s.matiere}"><a href="#${s.id}"><span class="index-num">0${i + 1}</span> ${s.titre}</a></li>`)}
        </ol>
        <p class="services-division">${logo('site/sti-telecom', 'STI Telecom', 166, 45, 'services-sti')}<span>${c.t('commun.division')}</span></p>
      </div>
    </div>
    <div class="services-liste">
      ${A.services.map((s, i) => html`<article class="service matiere-${s.matiere}" id="${s.id}" data-service>
        ${c.media({ nom: s.image, alt: s.titre, cadrage: s.cadrage, classe: 'service-media', sizes: '(max-width: 760px) 100vw, 26vw' })}
        <div class="service-corps">
          <p class="service-num" aria-hidden="true">0${i + 1}</p>
          <h3>${s.titre}</h3>
          <p>${s.texte}</p>
          <p class="service-prix"><strong data-prix>${s.prix}</strong><span>${s.note}</span></p>
          <ul class="liste-coche">${s.faits.map((f) => html`<li>${coche}${f}</li>`)}</ul>
          ${c.lien(s.lien.page, { params: s.lien.params || '', classe: 'bouton bouton--contour', texte: html`${s.lien.texte} ${fleche}` })}
        </div>
      </article>`)}
    </div>
  </div>
</section>

<section class="comparateur conteneur" id="comparateur" data-comparateur>
  <div class="comparateur-tete">
    <div>
      <h2 class="titre-onde">${c.t('accueil.comparateur.titre')}</h2>
      <p data-anime>${c.t('accueil.comparateur.texte')}</p>
      <div class="comparateur-questions">
        <fieldset class="segments"><legend>${c.t('accueil.comparateur.q1')}</legend>
          ${choix('taille', '1', c.t('accueil.comparateur.t1'))}${choix('taille', '2', c.t('accueil.comparateur.t2'), true)}${choix('taille', '3', c.t('accueil.comparateur.t3'))}
        </fieldset>
        <fieldset class="segments segments--besoin"><legend>${c.t('accueil.comparateur.q2')}</legend>
          ${choix('besoin', 'heberge', c.t('accueil.comparateur.b1'), true)}${choix('besoin', 'garder', c.t('accueil.comparateur.b2'))}${choix('besoin', 'teams', c.t('accueil.comparateur.b3'))}
        </fieldset>
      </div>
    </div>
    ${c.media({ nom: 'grok/comparateur-fond', alt: c.s('accueil.comparateur.alt'), cadrage: '35% 50%', classe: 'comparateur-media', sizes: '(max-width: 760px) 100vw, 40vw' })}
  </div>
  <div class="solutions" aria-live="polite">
    ${[['voxfon', 'voxfon', T.voxfon[1].prix], ['3cx', 'troiscx', null], ['sip', 'sip', T.sip[1].prix]].map(([id, k, p]) => html`<article class="solution${id === 'voxfon' ? ' est-recommandee' : ''}" data-solution="${id}">
      <p class="solution-voyant"><span class="voyant" aria-hidden="true"></span><span class="solution-reco">${c.t('accueil.comparateur.recommande')}</span></p>
      <h3>${c.t(`accueil.comparateur.${k}Titre`)}</h3>
      <p>${c.t(`accueil.comparateur.${k}Texte`)}</p>
      <p class="solution-prix" data-prix>${p ? html`<strong data-prix-solution>${prix(c, p)}</strong> <span>${c.t('commun.parUtilisateur')}</span>` : html`<strong>${c.t('commun.surSoumission')}</strong>`}</p>
      <p class="solution-note">${c.t(`accueil.comparateur.${k}Note`)}</p>
      ${c.lien('telephonie', { ancre: id === 'voxfon' ? 'voxfon' : id === '3cx' ? 'plateforme-3cx' : 'lignes-sip', classe: 'lien-fleche', texte: html`${c.t('accueil.comparateur.detail')} ${fleche}` })}
    </article>`)}
  </div>
  <p class="note">${c.t('accueil.comparateur.note')}</p>
</section>

<section class="estimateur" id="estimateur" data-estimateur>
  ${donneesJs('tarifs-donnees', T)}
  <div class="conteneur">
    <div class="estimateur-tete">
      <div>
        <h2 class="titre-onde">${c.t('accueil.estimateur.titre')}</h2>
        <p data-anime>${c.t('accueil.estimateur.texte')}</p>
      </div>
      ${c.media({ nom: 'grok/estimateur-matiere', alt: c.s('accueil.estimateur.alt'), cadrage: '22% 40%', classe: 'estimateur-media', sizes: '(max-width: 760px) 100vw, 30vw' })}
    </div>
    <div class="estimateur-grille">
      <div class="estimateur-choix">
        <fieldset><legend>${c.t('accueil.estimateur.telephonie')}</legend>
          <div class="segments segments--colonne">
            ${choix('tel', 'aucune', c.t('accueil.estimateur.aucune'))}${choix('tel', 'voxfon', c.t('accueil.estimateur.voxfon'), true)}${choix('tel', 'sip', c.t('accueil.estimateur.sip'))}${choix('tel', '3cx', c.t('accueil.estimateur.troiscx'))}
          </div>
          <div data-si="voxfon sip 3cx">${pas(c, 'utilisateurs', 1, 500, 10, c.t('accueil.estimateur.utilisateurs'), 'est-utilisateurs')}</div>
          <p class="estimateur-palier" data-si="voxfon" data-palier aria-live="polite">${c.t('accueil.estimateur.engagementVoxfon', { n: 3 })}</p>
          <fieldset class="segments" data-si="sip"><legend>${c.t('accueil.estimateur.duree')}</legend>
            ${choix('duree', 'mensuel', c.t('accueil.estimateur.mensuel'))}${choix('duree', '1an', c.t('accueil.estimateur.unAn'), true)}${choix('duree', '3ans', c.t('accueil.estimateur.troisAns'))}
          </fieldset>
        </fieldset>
        <fieldset><legend>${c.t('accueil.estimateur.internet')}</legend>
          <div class="segments">
            ${choix('net', 'aucun', c.t('accueil.estimateur.aucun'))}${['fttn', 'cable', 'sansfil', 'fibre'].map((k, i) => choix('net', k, html`${c.t('accueil.estimateur.' + k)} <small>${prix(c, T.internet[i].prix)}</small>`, k === 'fttn'))}
          </div>
        </fieldset>
        <fieldset><legend>${c.t('accueil.estimateur.lignes')}</legend>
          ${pas(c, 'lignes', 0, 100, 0, c.t('accueil.estimateur.nbLignes'), 'est-lignes')}
          <label class="case" data-si-lignes><input type="checkbox" name="sansEngagement"><span>${c.t('accueil.estimateur.sansEngagement')}</span></label>
          <label class="case"><input type="checkbox" name="pri"><span>${c.t('accueil.estimateur.pri')}</span></label>
          ${pas(c, 'sansFrais', 0, 50, 0, c.t('accueil.estimateur.sansFrais'), 'est-sansfrais')}
          <label class="case"><input type="checkbox" name="cablage"><span>${c.t('accueil.estimateur.cablage')}</span></label>
        </fieldset>
        <p class="estimateur-total-mobile" aria-hidden="true"><span>${c.t('accueil.estimateur.total')}</span><output data-total-mobile data-prix>${prix(c, defaut.total)}</output></p>
      </div>
      <aside class="facture" aria-labelledby="facture-titre">
        <div class="facture-papier">
          <p class="facture-tete"><img src="/assets/images/logo.webp" alt="" width="77" height="30"><span><strong id="facture-titre">${c.t('accueil.estimateur.facture')}</strong><br>${c.t('accueil.estimateur.factureSous')}</span></p>
          <ul class="facture-lignes" data-facture-lignes aria-live="polite">
            ${defaut.lignes.map((l) => html`<li data-ligne-prix="${l.v.toFixed(2)}"><span>${l.lib}</span><span>${prix(c, Math.round(l.v * 100) / 100)}</span></li>`)}
          </ul>
          <p class="facture-total"><span>${c.t('accueil.estimateur.total')}<br><small>${c.t('accueil.estimateur.aPartirDe')}</small></span><output data-total="${defaut.total.toFixed(2)}" data-prix>${prix(c, defaut.total)}</output></p>
          <p class="facture-pied" id="facture-pied">${c.t('accueil.estimateur.piedFacture')}</p>
          ${c.lien('evaluation', { params: 's_telephonie=oui&s_internet=oui&solution=voxfon&utilisateurs=u2', classe: 'bouton bouton--plein', texte: html`${c.t('accueil.estimateur.action')} ${fleche}`, attrs: 'data-estimateur-lien' })}
        </div>
      </aside>
    </div>
  </div>
</section>

<section class="parcours ecran epingle" id="parcours" data-entete-cache>
  <div class="conteneur parcours-tete">
    <h2>${c.t('accueil.parcours.titre')}</h2>
    <p>${c.t('accueil.parcours.texte')} <span class="glisser">${c.t('accueil.parcours.glisser')}</span></p>
  </div>
  <div class="piste parcours-piste" data-galerie tabindex="0" role="region" aria-label="${c.s('accueil.parcours.region')}">
    ${A.parcours.map((e, i) => html`<article class="etape" id="etape-${i + 1}">
      ${c.media({ nom: e.image, alt: e.titre, cadrage: e.cadrage, classe: 'etape-media', sizes: '(max-width: 760px) 80vw, 30vw' })}
      <p class="etape-num" aria-hidden="true">0${i + 1}</p>
      <h3>${e.titre}</h3>
      <p>${e.texte}</p>
    </article>`)}
  </div>
  <div class="parcours-fil" aria-hidden="true"><span></span></div>
</section>

<section class="preuves" id="preuves">
  <div class="conteneur preuves-grille">
    <div class="preuves-texte">
      <h2 class="preuves-titre"><span class="palettes" data-palettes="${c.site.fondation}">${c.t('accueil.preuves.titre')}</span></h2>
      <p data-anime data-annees="${c.site.fondation}">${c.t('accueil.preuves.texte', { annees: annees })}</p>
      <ul class="piliers">${A.piliers.map((p) => html`<li data-anime><h3>${p.titre}</h3><p>${p.texte}</p></li>`)}</ul>
      <p class="partenaire" data-anime><img src="/assets/images/site/3cx-platinum.webp" alt="${c.s('accueil.preuves.badgeAlt')}" width="96" height="96" loading="lazy" decoding="async"><span>${c.t('accueil.preuves.partenaire')}</span></p>
    </div>
    ${c.media({ nom: 'grok/preuves-fond', alt: c.s('accueil.preuves.alt'), cadrage: '72% 55%', classe: 'preuves-media', sizes: '(max-width: 760px) 100vw, 45vw' })}
  </div>
  <div class="clients">
    <h3 class="conteneur clients-titre">${c.t('accueil.preuves.clients')}</h3>
    <div class="ruban-section">
      <div class="ruban" id="ruban-clients" data-boucle-css data-ruban role="region" tabindex="0" aria-label="${c.s('accueil.preuves.ruban')}">
        <ul class="ruban-piste">${[0, 1].map((k) => c.donnees.clients.map((cl) => html`<li${k ? brut(' aria-hidden="true"') : ''}>${logo(cl.logo, k ? '' : cl.nom, cl.l, cl.h, 'client-logo' + (cl.carre ? ' client-logo--carre' : ''))}</li>`))}</ul>
      </div>
      <button type="button" class="ruban-pause" data-pause-pour="ruban-clients" data-libelle-pause="${c.s('commun.pause')}" data-libelle-lecture="${c.s('commun.lecture')}"><span data-libelle-bouton>${c.t('commun.pause')}</span></button>
    </div>
  </div>
  <div class="conteneur temoins">
    <h3 class="temoins-titre">${c.t('accueil.preuves.temoignages')}</h3>
    <div class="temoins-grille">${c.donnees.temoignages.filter((t) => t.accueil).map((t) => temoignage(c, t))}</div>
    ${c.l === 'fr' ? html`<p class="note">${c.t('commun.temoignagesTraduits')}</p>` : ''}
  </div>
</section>

<section class="fin" id="contact">
  ${c.media({ nom: 'grok/contact-final', alt: c.s('accueil.fin.alt'), cadrage: '50% 50%', cadrageMobile: '60% 60%', classe: 'fin-fond', sizes: '100vw' })}
  <div class="conteneur fin-grille">
    <div class="fin-texte">
      <h2 class="titre-onde">${c.t('accueil.fin.titre')}</h2>
      <p data-anime>${c.t('accueil.fin.texte')}</p>
      <p class="fin-actions" data-anime>
        ${c.lien('evaluation', { classe: 'bouton bouton--grand', texte: html`${c.t('accueil.fin.action')} ${fleche}`, attrs: 'data-fil-prise' })}
        <a class="bouton bouton--contour-clair" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')} ${c.site.contact.telephone}</a>
      </p>
    </div>
    <p class="fin-infos" data-anime>${c.t('commun.adresseCourte')}<br>${c.t('commun.bureau')}<br><a href="${c.site.contact.carte}" target="_blank" rel="noopener noreferrer">${c.t('commun.carte')}<span class="visuellement-cache"> ${c.t('commun.nouvelOnglet')}</span></a></p>
  </div>
</section>
`;
};
