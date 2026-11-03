/* Éléments réutilisés par les pages de BV Communications : le « 1 » tressé, les fils de l'intro,
   les prix, les témoignages, les liens externes, les icônes. */
import { html, brut } from '../../outils/gabarit.mjs';

/* Prix : 24,99 $ en français, $24.99 en anglais. Espace insécable entre le nombre et le symbole. */
export function prix(c, n) {
  const entier = Number.isInteger(n);
  if (c.l === 'fr') return (entier ? String(n) : n.toFixed(2).replace('.', ',')) + '\u00a0$';
  return '$' + (entier ? String(n) : n.toFixed(2));
}

/* Le « 1 » tressé par quatre fils (cuivre, fibre, gris, ivoire), calculé une fois à la génération.
   Repère 0 0 200 400 : la base du jambage est en (120, 384), le haut en (120, 22), le drapeau finit en (34, 104). */
const UN = [[120, 384], [120, 22], [34, 104]];
const MATIERES = ['cuivre', 'fibre', 'gris', 'ivoire'];
function echantillonner(points, pas) {
  const out = [];
  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1] = points[i], [x2, y2] = points[i + 1];
    const L = Math.hypot(x2 - x1, y2 - y1), n = Math.max(1, Math.round(L / pas));
    for (let k = 0; k < n; k++) out.push({ x: x1 + ((x2 - x1) * k) / n, y: y1 + ((y2 - y1) * k) / n, nx: -(y2 - y1) / L, ny: (x2 - x1) / L });
  }
  const [xf, yf] = points[points.length - 1], [xa, ya] = points[points.length - 2];
  const L = Math.hypot(xf - xa, yf - ya);
  out.push({ x: xf, y: yf, nx: -(yf - ya) / L, ny: (xf - xa) / L });
  return out;
}
const pts = echantillonner(UN, 4);
let cumul = 0;
pts.forEach((p, i) => { if (i) cumul += Math.hypot(p.x - pts[i - 1].x, p.y - pts[i - 1].y); p.s = cumul; });
const brin = (k) => {
  const phase = (k * Math.PI) / 2;
  return pts.map((p, i) => {
    /* L'amplitude s'ouvre vers la base : les quatre fils arrivent séparés, puis se tressent. */
    const ouverture = Math.max(0, 1 - p.s / 60);
    const a = 7 + ouverture * 18;
    const d = a * Math.sin(p.s / 15 + phase);
    return `${i ? 'L' : 'M'}${(p.x + p.nx * d).toFixed(1)} ${(p.y + p.ny * d).toFixed(1)}`;
  }).join('');
};
const CENTRE = `M${UN.map((p) => p.join(' ')).join('L')}`;
export const LONGUEUR_UN = Math.round(cumul + 40);

export function un(c, { classe = '', titre = '' } = {}) {
  return html`<svg class="un ${classe}"${brut(classe.includes('hero-un') ? ' data-boucle-css' : '')} viewBox="0 0 200 400" ${brut(titre ? `role="img" aria-label="${titre.replace(/"/g, '&quot;')}"` : 'aria-hidden="true"')} focusable="false">
  <path class="un-trace" d="${brut(CENTRE)}"/>
  ${MATIERES.map((m, k) => html`<path class="un-brin un-${m}" d="${brut(brin(k))}" pathLength="1000"/>`)}
  <path class="un-lumiere" d="${brut(CENTRE)}" pathLength="1000"/>
</svg>`;
}

/* Les quatre fils de l'intro : ils entrent par les bords et se rejoignent au centre de l'écran
   (repère étiré 0 0 1000 1000, trait d'épaisseur constante). */
export function fils(c) {
  const F = [
    { m: 'cuivre', cle: 'telephonie', d: 'M-20 520 C 180 540, 300 380, 420 470 S 470 520, 500 500' },
    { m: 'fibre', cle: 'internet', d: 'M470 -20 C 450 160, 600 260, 520 360 S 480 460, 500 500' },
    { m: 'gris', cle: 'cablage', d: 'M1020 450 C 820 430, 720 600, 600 520 S 530 490, 500 500' },
    { m: 'ivoire', cle: 'lignes', d: 'M540 1020 C 560 840, 400 760, 470 640 S 520 540, 500 500' },
  ];
  return html`<svg class="ouv-fils" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true" focusable="false">
  ${F.map((f) => html`<path class="ouv-fil ouv-${f.m}" d="${brut(f.d)}" pathLength="1000"/>`)}
</svg>
<ul class="ouv-etiquettes" aria-hidden="true">${F.map((f) => html`<li class="ouv-etiquette ouv-etiquette--${f.cle}">${c.t('commun.fils.' + f.cle)}</li>`)}</ul>`;
}

/* Lien externe : nouvel onglet, annoncé aux lecteurs d'écran. */
export function externe(c, href, contenu, classe = '') {
  return html`<a href="${href}" target="_blank" rel="noopener noreferrer"${classe ? brut(` class="${classe}"`) : ''}>${contenu}<span class="visuellement-cache"> ${c.t('commun.nouvelOnglet')}</span><svg class="icone-externe" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M6 3h7v7M13 3 4 12" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></a>`;
}

/* Logo d'une image du site actuel (alpha conservé), dimensions réelles. */
export function logo(src, alt, l, h, classe = '') {
  return html`<img class="${classe}" src="/assets/images/${src}.webp" alt="${alt}" width="${l}" height="${h}" loading="lazy" decoding="async">`;
}

export function temoignage(c, t, { classe = '' } = {}) {
  const ent = typeof t.entreprise === 'string' ? t.entreprise : t.entreprise;
  return html`<figure class="temoin ${classe}" id="temoin-${t.id}">
  <blockquote><p>${t.texte}</p></blockquote>
  <figcaption>
    <img src="/assets/images/${t.logo}.webp" alt="${'Logo ' + ent}" width="56" height="56" loading="lazy" decoding="async">
    <span><strong>${t.nom}</strong>${t.role ? html`, ${t.role}` : ''}<br><span class="temoin-ent">${ent}</span></span>
  </figcaption>
</figure>`;
}

/* Puce de vérification. */
export const coche = brut('<svg class="coche" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="2"/></svg>');
export const fleche = brut('<svg class="fleche" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M3 10h13M11 5l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>');

/* Données JSON lues par le JavaScript de la page (une seule source : donnees/). */
export function donneesJs(id, objet) {
  return brut(`<script type="application/json" id="${id}">${JSON.stringify(objet).replace(/</g, '\\u003c')}</script>`);
}
