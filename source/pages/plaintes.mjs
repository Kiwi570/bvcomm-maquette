/* Plaintes : contact de BV Communications, puis recours auprès de la CPRST et du CRTC (contenu du site actuel). */
import { html } from '../../outils/gabarit.mjs';
import { pageLegale } from '../gabarits/legal.mjs';
import { externe } from '../gabarits/elements.mjs';

export const page = { cle: 'plaintes', fichier: 'plaintes', imagePartage: 'grok/legal-plaintes-1168.webp', sansAction: true };

export default (c) => pageLegale(c, {
  image: 'grok/legal-plaintes', cadrage: '60% 55%', titre: c.t('legal.plaintes.titre'), intro: c.t('legal.plaintes.intro'),
  sections: [
    { id: 'deposer', titre: c.t('legal.plaintes.deposer.titre'), corps: html`<p>${c.t('legal.plaintes.deposer.texte')}</p>` },
    { id: 'cprst', court: c.l === 'fr' ? 'CPRST' : 'CCTS', titre: c.t('legal.plaintes.cprst.titre'), corps: html`${c.l === 'en' ? html`<p class="legal-logo"><img src="/assets/images/site/ccts.webp" alt="${c.s('legal.plaintes.logoAlt')}" width="170" height="60" loading="lazy" decoding="async"></p>` : ''}<p>${c.t('legal.plaintes.cprst.texte')}</p><p>${externe(c, 'https://www.ccts-cprst.ca/', c.t('legal.plaintes.cprst.lien'), 'lien-fleche')}</p>` },
    { id: 'crtc', court: 'CRTC', titre: c.t('legal.plaintes.crtc.titre'), corps: html`<p>${c.t('legal.plaintes.crtc.texte')}</p><p>${externe(c, c.l === 'fr' ? 'https://crtc.gc.ca/fra/home-accueil.htm' : 'https://crtc.gc.ca/eng/home-accueil.htm', c.t('legal.plaintes.crtc.lien'), 'lien-fleche')}</p>` },
  ],
});
