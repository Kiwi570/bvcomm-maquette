/* Mise en page commune des pages légales : en-tête court avec image, sommaire qui suit la lecture,
   barre de lecture, sections de texte (dispensées d'image par section). */
import { html } from '../../outils/gabarit.mjs';

export function pageLegale(c, { image, cadrage = '50% 50%', titre, intro, avertissement, sections, apres = '' }) {
  return html`
<div data-barre-lecture aria-hidden="true"></div>
<section class="page-tete legal-tete conteneur" id="debut">
  <div>
    <h1>${titre}</h1>
    <p class="legal-intro">${intro}</p>
    ${avertissement ? html`<p class="legal-avertissement">${avertissement}</p>` : ''}
    <nav data-sommaire aria-label="${c.s('commun.sommaire')}"><ul>${sections.map((s) => html`<li><a href="#${s.id}">${s.court || s.titre}</a></li>`)}</ul></nav>
  </div>
  ${c.media({ nom: image, alt: '', cadrage, priorite: true, classe: 'page-tete-media', sizes: '(max-width: 760px) 100vw, 40vw' })}
</section>
<div class="texte-long conteneur" data-sans-visuel>
  ${sections.map((s) => html`<section id="${s.id}" data-sans-visuel><h2>${s.titre}</h2>${s.corps}</section>`)}
  ${apres}
</div>
`;
}
