/* Téléphonie IP : quelle solution pour quelle taille. Voxfon (PME), 3CX (pour grandir), lignes SIP (garder son système),
   téléphones et casques, questions fréquentes. Barre de sections qui reste visible. */
import { html, brut } from '../../outils/gabarit.mjs';
import { prix, temoignage, coche, fleche, externe, logo } from '../gabarits/elements.mjs';

export const page = { cle: 'telephonie', fichier: 'telephonie', imagePartage: 'grok/telephonie-ouverture-1168.webp' };

const sections = [['voxfon', 'Voxfon'], ['plateforme-3cx', '3CX'], ['lignes-sip', 'SIP'], ['appareils', null], ['questions', null]];

export default (c) => {
  const D = c.donnees.telephonie, T = c.donnees.tarifs;
  const temoins = (sol) => c.donnees.temoignages.filter((t) => t.solution === sol).map((t) => temoignage(c, t));
  const libSection = (id, court) => court || (id === 'appareils' ? c.s('telephonie.appareils.titre') : c.s('telephonie.faq.titre'));
  return html`
<section class="page-hero page-hero--sombre" id="debut">
  ${c.media({ nom: 'grok/telephonie-ouverture', alt: c.s('telephonie.hero.alt'), cadrage: '80% 45%', cadrageMobile: '62% 78%', priorite: true, classe: 'page-hero-fond', sizes: '100vw' })}
  <div class="conteneur page-hero-texte">
    <p class="surtitre" data-anime="gsap">${c.t('telephonie.hero.surtitre')}</p>
    <h1 class="page-hero-titre"><span class="ligne-masque"><span class="hero-ligne" data-anime="gsap">${c.t('telephonie.hero.titre')}</span></span></h1>
    <p class="hero-intro" data-anime="gsap">${c.t('telephonie.hero.texte')}</p>
    <p class="hero-actions" data-anime="gsap">
      ${c.lien('evaluation', { params: 's_telephonie=oui', classe: 'bouton bouton--grand', texte: html`${c.t('telephonie.hero.action')} ${fleche}`, attrs: 'data-action-principale' })}
      <a class="lien-fleche lien-fleche--clair" href="#voxfon">${c.t('telephonie.hero.comparer')} ${fleche}</a>
    </p>
    <p class="hero-info" data-info-cle data-anime="gsap"><strong data-prix>${c.t('telephonie.hero.info')}</strong></p>
  </div>
</section>

<section class="voip conteneur" id="voip">
  <div class="voip-texte">
    <h2 class="titre-onde">${c.t('telephonie.voip.titre')}</h2>
    <p data-anime>${c.t('telephonie.voip.texte')}</p>
    <h3 class="voip-pourquoi" data-anime>${c.t('telephonie.voip.pourquoi')}</h3>
    <ol class="raisons">${D.raisons.map((r, i) => html`<li data-anime><span class="raison-num" aria-hidden="true">0${i + 1}</span><span><strong>${r.titre}.</strong> ${r.texte}</span></li>`)}</ol>
  </div>
  ${c.media({ nom: 'grok/telephonie-pourquoi', alt: c.s('telephonie.voip.alt'), cadrage: '40% 55%', classe: 'voip-media', sizes: '(max-width: 760px) 100vw, 36vw' })}
</section>

<nav class="sous-nav" aria-label="${c.s('telephonie.sousnav')}" data-sous-nav>
  <ul class="conteneur">${sections.map(([id, court]) => html`<li><a href="#${id}">${libSection(id, court)}</a></li>`)}</ul>
</nav>

<section class="offre offre--voxfon" id="voxfon">
  <div class="conteneur offre-grille">
    <div class="offre-tete">
      ${logo('site/voxfon', c.s('telephonie.voxfon.logoAlt'), 153, 51, 'offre-logo')}
      <h2 class="titre-onde">${c.t('telephonie.voxfon.titre')}</h2>
      <p data-anime>${c.t('telephonie.voxfon.texte')}</p>
    </div>
    ${c.media({ nom: 'grok/telephonie-voxfon', alt: c.s('telephonie.voxfon.alt'), cadrage: '50% 0%', classe: 'offre-media offre-media--paysage', sizes: '(max-width: 760px) 100vw, 30vw' })}
  </div>
  <div class="conteneur">
    <h3 class="sous-titre">${c.t('telephonie.voxfon.tarifs')}</h3>
    <ol class="paliers">${T.voxfon.map((p, i) => html`<li class="palier" data-anime>
      <p class="palier-taille">${c.t('telephonie.voxfon.palier' + (i + 1))}</p>
      <p class="palier-prix" data-prix><strong>${prix(c, p.prix)}</strong> <span>${c.t('commun.parUtilisateur')}</span></p>
      <p class="palier-detail">${p.engagement === 1 ? c.t('telephonie.voxfon.engagement1') : c.t('telephonie.voxfon.engagement', { n: p.engagement })}<br>${c.t('telephonie.voxfon.remise', { n: p.remise })}</p>
    </li>`)}</ol>
    <h3 class="sous-titre">${c.t('telephonie.voxfon.fonctions')}</h3>
    <div class="fonctions">${D.voxfonFonctions.map((g) => html`<div class="fonctions-groupe" data-anime><h4>${g.groupe}</h4><ul class="puces">${g.items.map((f) => html`<li>${f}</li>`)}</ul></div>`)}</div>
    <p class="offre-action">${c.lien('evaluation', { params: 's_telephonie=oui&solution=voxfon', classe: 'bouton', texte: html`${c.t('telephonie.voxfon.action')} ${fleche}` })} ${c.lien('avis-911', { classe: 'lien-discret' })}</p>
    <div class="temoins-grille temoins-grille--offre">${temoins('voxfon')}</div>
  </div>
</section>

<section class="offre offre--3cx" id="plateforme-3cx">
  <div class="conteneur offre-grille offre-grille--inverse">
    <div class="offre-tete">
      <p class="offre-badge"><img src="/assets/images/site/3cx-platinum.webp" alt="" width="72" height="72" loading="lazy" decoding="async"><span>${c.t('telephonie.troiscx.partenaire')}</span></p>
      <h2 class="titre-onde">${c.t('telephonie.troiscx.titre')}</h2>
      <p data-anime>${c.t('telephonie.troiscx.texte')}</p>
      <p class="offre-prix" data-prix data-anime>${c.t('telephonie.troiscx.prix')}</p>
    </div>
    ${c.media({ nom: 'grok/telephonie-3cx', alt: c.s('telephonie.troiscx.alt'), cadrage: '50% 40%', classe: 'offre-media', sizes: '(max-width: 760px) 100vw, 30vw' })}
  </div>
  <div class="conteneur">
    <ul class="atouts">${D.atouts3cx.map((a) => html`<li data-anime><h3>${a.titre}</h3><p>${a.texte}</p></li>`)}</ul>
    <div class="troiscx-captures">
      <figure class="capture" data-anime><img src="/assets/images/site/3cx-application-475.webp" alt="${c.s('telephonie.troiscx.captureApp')}" width="475" height="283" loading="lazy" decoding="async"></figure>
      <div class="teams" data-anime>
        <h3>${c.t('telephonie.troiscx.teams')}</h3>
        <ul class="liste-coche">${D.teams.map((t) => html`<li>${coche}${t}</li>`)}</ul>
      </div>
    </div>
    <div class="troiscx-bas">
      <div class="fonctions-groupe" data-anime><h3>${c.t('telephonie.troiscx.fonctions')}</h3><ul class="puces puces--colonnes">${D.fonctions3cx.map((f) => html`<li>${f}</li>`)}</ul></div>
      <figure class="capture capture--chat" data-anime><img src="/assets/images/site/3cx-clavardage-499.webp" alt="${c.s('telephonie.troiscx.captureChat')}" width="499" height="400" loading="lazy" decoding="async"></figure>
    </div>
    <h3 class="sous-titre">${c.t('telephonie.troiscx.usages')}</h3>
    <ul class="usages">${D.usages3cx.map((u) => html`<li data-anime><h4>${u.titre}</h4><p>${u.texte}</p></li>`)}</ul>
    <p class="offre-action">${c.lien('evaluation', { params: 's_telephonie=oui&solution=3cx', classe: 'bouton', texte: html`${c.t('telephonie.troiscx.action')} ${fleche}` })} ${externe(c, 'https://www.3cx.com/phone-system/download-phone-system/?resellerId=211077', c.t('telephonie.troiscx.essai'), 'lien-discret')}</p>
    <div class="temoins-grille temoins-grille--offre">${temoins('3cx')}</div>
  </div>
</section>

<section class="offre offre--sip" id="lignes-sip">
  <div class="conteneur offre-grille">
    <div class="offre-tete">
      <h2 class="titre-onde">${c.t('telephonie.sip.titre')}</h2>
      <p data-anime>${c.t('telephonie.sip.texte')}</p>
    </div>
    ${c.media({ nom: 'grok/telephonie-sip', alt: c.s('telephonie.sip.alt'), cadrage: '50% 50%', classe: 'offre-media', sizes: '(max-width: 760px) 100vw, 30vw' })}
  </div>
  <div class="conteneur">
    <ul class="atouts atouts--trois">${D.sipAvantages.map((a) => html`<li data-anime><h3>${a.titre}</h3><p>${a.texte}</p></li>`)}</ul>
    <div class="sip-bas">
      <div data-anime><h3 class="sous-titre">${c.t('telephonie.sip.caracteristiques')}</h3><ul class="liste-coche">${D.sipCaracteristiques.map((f) => html`<li>${coche}${f}</li>`)}</ul></div>
      <div><h3 class="sous-titre">${c.t('telephonie.sip.tarifs')}</h3>
        <ol class="paliers paliers--sip">${T.sip.map((p, i) => html`<li class="palier" data-anime>
          <p class="palier-taille">${c.t('telephonie.sip.' + ['mensuel', 'unAn', 'troisAns'][i])}</p>
          <p class="palier-prix" data-prix><strong>${prix(c, p.prix)}</strong> <span>${c.t('commun.parUtilisateur')}</span></p>
        </li>`)}</ol>
      </div>
    </div>
    <p class="offre-action">${c.lien('evaluation', { params: 's_telephonie=oui&solution=sip', classe: 'bouton', texte: html`${c.t('telephonie.sip.action')} ${fleche}` })}</p>
    <div class="temoins-grille temoins-grille--offre">${temoins('sip')}</div>
    ${c.l === 'fr' ? html`<p class="note">${c.t('commun.temoignagesTraduits')}</p>` : ''}
  </div>
</section>

<section class="appareils" id="appareils">
  ${c.media({ nom: 'grok/telephonie-appareils-fond', alt: c.s('telephonie.appareils.alt'), cadrage: '12% 15%', classe: 'appareils-fond', sizes: '100vw' })}
  <div class="conteneur appareils-contenu">
    <h2 class="titre-onde">${c.t('telephonie.appareils.titre')}</h2>
    <p data-anime>${c.t('telephonie.appareils.texte')}</p>
    <ul class="appareils-liste">${D.appareils.map((a) => html`<li class="appareil${a.image ? '' : ' appareil--typo'}" data-anime data-incline>
      ${a.image ? html`<img class="appareil-photo${a.detoure ? ' appareil-photo--detoure' : ''}" src="/assets/images/${a.image}-${a.detoure ? 400 : 640}.webp" alt="${a.alt}" width="${a.detoure ? 400 : 640}" height="${a.detoure ? 348 : 388}" loading="lazy" decoding="async">`
        : html`<span class="appareil-dessin" data-visuel><svg viewBox="0 0 160 120" aria-hidden="true" focusable="false">${a.type === 'Casques' || a.type === 'Headsets'
          ? brut('<path d="M50 74 V62 a30 30 0 0 1 60 0 V74"/><rect x="40" y="68" width="16" height="26" rx="6"/><rect x="104" y="68" width="16" height="26" rx="6"/><path d="M48 94 q4 14 26 14 h6"/><circle cx="84" cy="108" r="3"/>')
          : brut('<rect x="30" y="30" width="100" height="62" rx="6"/><rect x="62" y="38" width="58" height="22" rx="2"/><path d="M38 36 q-10 26 0 50"/><path d="M62 70 h6 M74 70 h6 M86 70 h6 M62 78 h6 M74 78 h6 M86 78 h6 M100 70 h14 M100 78 h14"/>')}</svg><span>${c.t('telephonie.appareils.photo')}</span></span>`}
      <h3>${a.marque}</h3>
      <p>${a.type}</p>
      ${externe(c, a.url, c.t('telephonie.appareils.voir', { marque: a.marque.split(' ')[0] }), 'lien-fleche')}
    </li>`)}</ul>
  </div>
</section>

<section class="faq conteneur" id="questions">
  <div>
    <h2 class="titre-onde">${c.t('telephonie.faq.titre')}</h2>
    ${D.faq.map((f) => html`<details class="faq-item" data-anime><summary>${f.q}</summary><div class="faq-reponse"><p>${f.r}</p></div></details>`)}
    <div class="appel" id="soumission">
      <h3 class="appel-titre">${c.t('telephonie.fin.titre')}</h3>
      <p data-anime>${c.t('telephonie.fin.texte')}</p>
      <p data-anime>${c.lien('evaluation', { params: 's_telephonie=oui', classe: 'bouton bouton--grand', texte: html`${c.t('telephonie.fin.action')} ${fleche}` })} <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')} ${c.site.contact.telephone}</a></p>
    </div>
  </div>
  ${c.media({ nom: 'grok/telephonie-faq', alt: c.s('telephonie.faq.alt'), cadrage: '50% 50%', classe: 'faq-media', sizes: '(max-width: 760px) 100vw, 32vw' })}
</section>


`;
};
