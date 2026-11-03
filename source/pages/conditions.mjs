/* Conditions générales : les 16 articles du site actuel (traduction de travail en français). */
import { html } from '../../outils/gabarit.mjs';
import { pageLegale } from '../gabarits/legal.mjs';

export const page = { cle: 'conditions', fichier: 'conditions', imagePartage: 'grok/legal-conditions-1168.webp', sansAction: true };

const corps = (a) => (Array.isArray(a)
  ? html`<p>${a.map((x) => (typeof x === 'string' ? html`${x} ` : html`<span lang="${x.lang}" data-typo-ignorer>${x.texte}</span>`))}</p>`
  : html`<p>${a}</p>`);

export default (c) => pageLegale(c, {
  image: 'grok/legal-conditions', cadrage: '55% 60%', titre: c.t('legal.conditions.titre'), intro: c.t('legal.conditions.intro'),
  avertissement: c.t('legal.conditions.avertissement'),
  sections: c.donnees.conditions.map((a, i) => ({ id: `article-${i + 1}`, court: String(i + 1), titre: c.t('legal.conditions.article', { n: i + 1 }), corps: corps(a) })),
});
