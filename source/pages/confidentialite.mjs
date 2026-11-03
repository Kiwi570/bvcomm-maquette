/* Politique de confidentialité : structure à compléter par BV Communications (Loi 25 du Québec). */
import { html } from '../../outils/gabarit.mjs';
import { pageLegale } from '../gabarits/legal.mjs';

export const page = { cle: 'confidentialite', fichier: 'confidentialite', imagePartage: 'grok/legal-confidentialite-1168.webp', sansAction: true };

export default (c) => pageLegale(c, {
  image: 'grok/legal-confidentialite', cadrage: '50% 60%', titre: c.t('legal.confidentialite.titre'), intro: c.t('legal.confidentialite.intro'),
  sections: ['responsable', 'recueil', 'usage', 'conservation', 'droits', 'stockage'].map((id) => ({ id, titre: c.t(`legal.confidentialite.${id}.titre`), corps: html`<p>${c.t(`legal.confidentialite.${id}.texte`)}</p>` })),
});
