/* Mentions légales : fiche des informations à fournir, éditeur, hébergeur, crédits, marques, langue. */
import { html } from '../../outils/gabarit.mjs';
import { pageLegale } from '../gabarits/legal.mjs';

export const page = { cle: 'mentions-legales', fichier: 'mentions-legales', imagePartage: 'grok/legal-mentions-1168.webp', sansAction: true };

export default (c) => {
  const s = (id) => ({ id, titre: c.t(`legal.mentions.${id}.titre`), corps: html`<p>${c.t(`legal.mentions.${id}.texte`)}</p>` });
  const fiche = { id: 'fiche', titre: c.t('legal.mentions.fiche.titre'), corps: html`<ul class="fiche">${c.s('legal.mentions.fiche.items').split(' · ').map((x) => html`<li>${x}</li>`)}</ul>` };
  return pageLegale(c, {
    image: 'grok/legal-mentions', titre: c.t('legal.mentions.titre'), intro: c.t('legal.mentions.intro'),
    sections: [fiche, s('editeur'), s('hebergeur'), s('credits'), s('marques'), s('langue')],
  });
};
