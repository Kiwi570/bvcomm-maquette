/* Gabarit commun : head, en-tête, menu, pied de page, barre fixe du téléphone, voile, panneau d'ouverture.
   Les conventions data-* sont celles que lisent le socle JavaScript et l'audit (voir le README). */
import { html, brut } from '../../outils/gabarit.mjs';
import { un, fils } from './elements.mjs';

const visible = (c, cle) => c.pages[cle] && (c.pages[cle].langues || c.langues).includes(c.l);
const navigation = (c) => c.site.navigation.filter((n) => visible(c, n.page));
const lienNav = (c, n, classe = '') => c.lien(n.page, { ancre: n.ancre || '', texte: n.texte ? c.t(n.texte) : undefined, classe });

function tete(c) {
  const p = c.page, cle = p.cle;
  const titre = c.s(`pages.${cle}.titre`), description = c.s(`pages.${cle}.description`);
  const ici = c.abs(c.url(cle));
  const imagePartage = c.abs(`/assets/partage/${p.partage === false ? 'accueil' : cle}-${c.l}.jpg`);
  const autres = c.alternatives(cle);
  const structure = c.donnees.structure ? JSON.stringify(c.donnees.structure).replace(/</g, '\\u003c') : '';
  return html`<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${titre}</title>
<meta name="description" content="${description}">
<meta name="robots" content="noindex, nofollow">
<link rel="canonical" href="${ici}">
${autres.length > 1 ? autres.map((a) => html`<link rel="alternate" hreflang="${a.l}" href="${c.abs(a.url)}">\n`) : ''}${autres.length > 1 ? html`<link rel="alternate" hreflang="x-default" href="${c.abs(c.alternatives(cle)[0].url)}">` : ''}
<style>${brut(c.critique.css)}</style>
<script>${brut(c.critique.js)}</script>
${(c.site.polices || []).map((f) => html`<link rel="preload" href="${f}" as="font" type="font/woff2" crossorigin>\n`)}<link rel="stylesheet" href="${c.asset('css/socle.css')}">
<link rel="stylesheet" href="${c.asset('css/site.css')}">
<link rel="modulepreload" href="${c.asset('js/site.js')}">
<link rel="modulepreload" href="${c.asset('js/socle/index.js')}">
<script src="/assets/vendor/gsap.min.js" defer></script>
<script src="/assets/vendor/ScrollTrigger.min.js" defer></script>
<script src="/assets/vendor/SplitText.min.js" defer></script>
<script type="module" src="${c.asset('js/site.js')}"></script>
<meta name="theme-color" content="${c.site.couleurs.theme || c.site.couleurs.fond}">
<link rel="icon" href="/assets/images/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/assets/images/favicon.png" type="image/png" sizes="64x64">
<link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${c.site.nom}">
<meta property="og:locale" content="${c.l === 'fr' ? 'fr_CA' : 'en_CA'}">
<meta property="og:title" content="${titre}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${ici}">
<meta property="og:image" content="${imagePartage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${c.s(`pages.${p.partage === false ? 'accueil' : cle}.partageAlt`)}">
<meta name="twitter:card" content="summary_large_image">
${structure ? html`<script type="application/ld+json">${brut(structure)}</script>` : ''}
</head>`;
}

function lienLangue(c, a, { menu = false } = {}) {
  return html`<a class="entete-langue" href="${a.url}" hreflang="${a.l}" lang="${a.l}" data-langue="${a.l}"${menu ? '' : brut(` aria-label="${c.s('commun.langueAutre')}"`)}>${menu ? c.t('commun.langueAutre') : c.t('commun.langueCourte')}</a>`;
}

function entete(c) {
  const autreLangue = c.alternatives(c.page.cle).filter((a) => a.l !== c.l);
  const a = c.site.actionEntete;
  return html`<header data-entete>
  <div class="entete-rangee">
    <a class="entete-logo" href="${c.url('accueil')}" aria-label="${c.s('commun.logoAlt')}" data-libelle="${c.libelle('accueil')}"${c.page.cle === 'accueil' ? brut(' aria-current="page"') : ''}>
      <img src="/assets/images/logo.webp" alt="" width="102" height="40">
    </a>
    <nav data-nav aria-label="${c.s('commun.navigation')}">
      <ul>${navigation(c).map((n) => html`<li>${lienNav(c, n)}</li>`)}</ul>
    </nav>
    <div class="entete-actions">
      ${autreLangue.map((x) => lienLangue(c, x))}
      ${a ? html`<a class="bouton bouton--entete" href="${c.url(a.page)}" data-libelle="${c.libelle(a.page)}"${c.page.cle === a.page ? brut(' aria-current="page"') : ''}>${c.t('commun.actionEntete')}</a>` : ''}
      <button type="button" data-menu-bouton aria-controls="menu" aria-expanded="false" data-libelle-ouvrir="${c.s('commun.menu')}" data-libelle-fermer="${c.s('commun.fermer')}"><span class="menu-icone" aria-hidden="true"><i></i><i></i></span><span data-libelle-bouton>${c.t('commun.menu')}</span></button>
    </div>
  </div>
</header>
<div id="menu" data-menu role="dialog" aria-modal="true" aria-label="${c.s('commun.menu')}">
  <div class="menu-grille">
    <ul class="menu-liens">
      <li style="--i:0">${c.lien('accueil', { classe: 'menu-lien' })}</li>
      ${navigation(c).map((n, i) => html`<li style="--i:${i + 1}">${lienNav(c, n, 'menu-lien')}</li>`)}
      <li style="--i:${navigation(c).length + 1}">${c.lien('evaluation', { classe: 'menu-lien' })}</li>
    </ul>
    <div class="menu-contact">
      <p><a class="bouton" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')} ${c.site.contact.telephone}</a></p>
      <p>${c.t('commun.adresseCourte')}<br>${c.t('commun.bureau')}</p>
      ${autreLangue.map((x) => html`<p>${lienLangue(c, x, { menu: true })}</p>`)}
      <p><button type="button" class="lien" data-calme-bascule data-libelle-reduire="${c.s('commun.calmeReduire')}" data-libelle-retablir="${c.s('commun.calmeRetablir')}" data-libelle-systeme="${c.s('commun.calmeSysteme')}"><span data-libelle-bouton>${c.t('commun.calmeReduire')}</span></button></p>
    </div>
  </div>
</div>`;
}

function pied(c) {
  const k = c.site.contact;
  return html`<footer class="pied" id="pied">
  <div class="conteneur pied-tete">
    <img src="/assets/images/logo-clair.webp" alt="BV Communications" width="153" height="60" loading="lazy" decoding="async">
    <p class="pied-devise">${c.t('commun.introLigne')}</p>
  </div>
  <div class="conteneur pied-grille">
    <div>
      <p class="pied-titre">${c.t('commun.contact')}</p>
      <p><a href="tel:${k.telephoneLien}">${k.telephone}</a><br>${c.t('commun.sansFrais')} <a href="tel:${k.sansFraisLien}">${k.sansFrais}</a><br><a href="mailto:${k.email}">${k.email}</a></p>
      <p>${c.t('commun.adresse')}</p>
      <p>${c.t('commun.bureau')}<br>${c.t('commun.soutien')}</p>
    </div>
    <nav aria-label="${c.s('commun.sommaire')}">
      <p class="pied-titre">${c.t('commun.sommaire')}</p>
      <ul>
        <li>${c.lien('accueil')}</li>
        ${navigation(c).map((n) => html`<li>${lienNav(c, n)}</li>`)}
        <li>${c.lien('evaluation')}</li>
      </ul>
    </nav>
    <nav aria-label="${c.s('commun.legal')}">
      <p class="pied-titre">${c.t('commun.legal')}</p>
      <ul>${c.site.legal.filter((cle) => visible(c, cle)).map((cle) => html`<li>${c.lien(cle)}</li>`)}</ul>
    </nav>
    <div>
      <p class="pied-titre">${c.t('commun.confort')}</p>
      <ul>
        <li><button type="button" class="lien" data-calme-bascule data-libelle-reduire="${c.s('commun.calmeReduire')}" data-libelle-retablir="${c.s('commun.calmeRetablir')}" data-libelle-systeme="${c.s('commun.calmeSysteme')}"><span data-libelle-bouton>${c.t('commun.calmeReduire')}</span></button></li>
        <li><a href="#haut" data-sans-transition>${c.t('commun.retourHaut')}</a></li>
        ${c.alternatives(c.page.cle).filter((a) => a.l !== c.l).map((a) => html`<li>${lienLangue(c, a, { menu: true })}</li>`)}
      </ul>
    </div>
  </div>
  <div class="conteneur pied-bas"><p>${c.t('commun.maquette')}</p><p>© ${c.site.nom} · ${c.t('commun.depuis')}</p></div>
</footer>`;
}

function barre(c) {
  const a = c.site.actionEntete;
  return html`<div data-barre-fixe>
  <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')}</a>
  ${a && c.page.cle !== a.page ? html`<a class="bouton" href="${c.url(a.page)}" data-libelle="${c.libelle(a.page)}">${c.t('commun.actionEntete')}</a>` : ''}
</div>`;
}

function voile(c) {
  return html`<div data-voile aria-hidden="true"><div class="voile-contenu"><img src="/assets/images/logo-clair.webp" alt="" width="153" height="60"><span class="voile-fil" aria-hidden="true"></span><span data-voile-libelle>${c.libelle(c.page.cle)}</span></div></div>`;
}

/* Panneau d'ouverture : quatre fils entrent par les bords et se rejoignent. Sur l'accueil, ils tressent le « 1 »
   qui rejoint sa place dans le premier écran ; ailleurs, ils se rejoignent sur le logo. Le « 1 » pâle et le logo
   sont visibles dès la première image. */
function ouverture(c) {
  const accueil = c.page.cle === 'accueil';
  return html`<div class="ouverture-panneau${accueil ? ' ouverture--un' : ''}" data-ouverture aria-hidden="true">
  ${fils(c)}
  ${accueil ? un(c, { classe: 'ouv-un' }) : ''}
  <img class="ouverture-logo" src="/assets/images/logo-clair.webp" alt="" width="153" height="60">
  <p class="ouverture-ligne">${c.t('commun.introLigne')}</p>
</div>`;
}

export function page(c, contenu) {
  return html`<!doctype html>
<html lang="${c.l}" data-v="${c.v}" data-gabarit="${c.page.gabarit || c.page.cle}" data-page="${c.page.cle}"${c.site.curseur ? brut(' data-curseur') : ''}>
${tete(c)}
<body id="haut">
${voile(c)}
${ouverture(c)}
<a class="evitement" href="#contenu">${c.t('commun.evitement')}</a>
${entete(c)}
<main id="contenu" tabindex="-1"${c.page.sansAction ? brut(' data-sans-action') : ''}>
${contenu}
</main>
${pied(c)}
${barre(c)}
</body>
</html>`;
}
