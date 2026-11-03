/* Page 404 : « Ce numéro n'est pas en service », câble débranché, ligne plate d'oscilloscope. */
import { html } from '../../outils/gabarit.mjs';
import { fleche } from '../gabarits/elements.mjs';

export const page = { cle: '404', fichier: '404', langues: ['fr', 'en'], partage: false };

export default (c) => html`
<section class="page-hero page-hero--sombre introuvable" id="debut">
  ${c.media({ nom: 'grok/page-404', alt: c.s('introuvable.alt'), cadrage: '50% 40%', priorite: true, classe: 'page-hero-fond', sizes: '100vw' })}
  <div class="conteneur page-hero-texte">
    <p class="surtitre surtitre--mono" data-anime="gsap">404</p>
    <h1 class="page-hero-titre"><span class="ligne-masque"><span class="hero-ligne" data-anime="gsap">${c.t('introuvable.titre')}</span></span></h1>
    <p class="hero-intro" data-anime="gsap">${c.t('introuvable.texte')}</p>
    <svg class="oscillo" viewBox="0 0 600 60" preserveAspectRatio="none" aria-hidden="true" data-oscillo data-audit-ignorer><path d="M0 30 H600"/></svg>
    <p class="hero-actions" data-anime="gsap">${c.lien('accueil', { classe: 'bouton bouton--grand', texte: html`${c.t('introuvable.retour')} ${fleche}`, attrs: 'data-action-principale' })} ${c.lien('evaluation', { classe: 'bouton bouton--contour-clair', texte: c.t('introuvable.evaluation') })}</p>
  </div>
</section>
`;
