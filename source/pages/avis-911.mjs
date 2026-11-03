/* Avis 9-1-1 en téléphonie IP : exigence du CRTC, texte à fournir par BV Communications. */
import { html } from '../../outils/gabarit.mjs';
import { pageLegale } from '../gabarits/legal.mjs';

export const page = { cle: 'avis-911', fichier: 'avis-911', imagePartage: 'grok/legal-avis-911-1168.webp', sansAction: true };

export default (c) => pageLegale(c, {
  image: 'grok/legal-avis-911', cadrage: '55% 50%', titre: c.t('legal.avis911.titre'), intro: c.t('legal.avis911.intro'),
  sections: [['pourquoi', 'pourquoi'], ['a-preciser', 'contenu'], ['voxfon', 'voxfon']].map(([id, k]) => ({ id, titre: c.t(`legal.avis911.${k}.titre`), corps: html`<p>${c.t(`legal.avis911.${k}.texte`)}</p>` })),
});
