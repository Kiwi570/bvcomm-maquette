/* Image de partage 1200×630 de chaque page : panneau bleu nuit avec le logo et l'accroche, photo de la page,
   le fil cuivre et fibre qui relie les deux. outils/images-partage.mjs photographie ces pages
   et écrit assets/partage/<page>-<langue>.jpg. */
import { html, brut } from '../../outils/gabarit.mjs';

export function page(c) {
  const cle = c.page.cle;
  const image = c.page.imagePartage || c.site.imagePartage;
  return html`<!doctype html>
<html lang="${c.l}"><head><meta charset="utf-8">
<link rel="stylesheet" href="/assets/css/socle.css"><link rel="stylesheet" href="/assets/css/site.css">
<style>${brut(`html,body{margin:0;width:1200px;height:630px;overflow:hidden;background:#0e1720;color:#f2f0eb}
.carte{position:relative;display:grid;grid-template-columns:600px 600px;width:1200px;height:630px}
.carte-texte{display:flex;flex-direction:column;justify-content:space-between;padding:56px 56px 52px;background:#0e1720}
.carte-texte img{width:184px;height:auto}
.carte-titre{font-family:var(--police-titres);font-weight:620;font-stretch:84%;font-size:64px;line-height:1;letter-spacing:-.02em;margin:0;text-wrap:balance;color:#f2f0eb}
.carte-nom{font:500 20px/1.3 var(--police-mono);letter-spacing:.06em;text-transform:uppercase;margin:0;color:#aeb7c1}
.carte-image{background:70% 50%/cover no-repeat}
.carte-fil{position:absolute;left:0;right:0;bottom:118px;height:4px;background:linear-gradient(90deg,#c26a35 0%,#c26a35 30%,#4fb3f0 60%,#4fb3f0 100%)}`)}</style>
</head><body>
<div class="carte">
  <div class="carte-texte">
    <img src="/assets/images/logo-clair.png" alt="">
    <p class="carte-titre">${c.t(`pages.${cle}.accroche`)}</p>
    <p class="carte-nom">${c.t('commun.depuis')}</p>
  </div>
  <div class="carte-image" style="background-image:url('/assets/images/${image}')"></div>
  <span class="carte-fil"></span>
</div>
</body></html>`;
}
