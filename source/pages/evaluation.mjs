/* Évaluation gratuite : formulaire simulé en 5 étapes, récapitulatif en direct, choix préremplis
   par l'adresse (?s_internet=oui, ?solution=3cx, ?estimation=…), coordonnées. Sans JavaScript, toutes les étapes
   s'affichent l'une sous l'autre et le formulaire reste utilisable. */
import { html, brut } from '../../outils/gabarit.mjs';
import { fleche } from '../gabarits/elements.mjs';

export const page = { cle: 'evaluation', fichier: 'evaluation', imagePartage: 'grok/evaluation-ouverture-1168.webp' };

const radio = (nom, valeur, libelle, attrs = '') => html`<label class="choix choix--carte"><input type="radio" name="${nom}" value="${valeur}"${brut(attrs ? ' ' + attrs : '')}><span>${libelle}</span></label>`;
const caseService = (nom, libelle) => html`<label class="choix choix--carte"><input type="checkbox" name="${nom}" value="oui"><span>${libelle}</span></label>`;

export default (c) => {
  const f = (k) => c.t('evaluation.form.' + k);
  const sf = (k) => c.s('evaluation.form.' + k);
  const k = c.site.contact;
  const services = [['s_telephonie', 'accueil.services'], ['s_internet'], ['s_cablage'], ['s_lignes']];
  const nomsServices = c.donnees.accueil.services.map((s) => s.titre);
  return html`
<section class="page-hero page-hero--sombre page-hero--court" id="debut">
  ${c.media({ nom: 'grok/evaluation-ouverture', alt: c.s('evaluation.hero.alt'), cadrage: '68% 70%', cadrageMobile: '65% 78%', priorite: true, classe: 'page-hero-fond', sizes: '100vw' })}
  <div class="conteneur page-hero-texte">
    <h1 class="page-hero-titre"><span class="ligne-masque"><span class="hero-ligne" data-anime="gsap">${c.t('evaluation.hero.titre')}</span></span></h1>
    <p class="hero-intro" data-anime="gsap">${c.t('evaluation.hero.texte')}</p>
    <p class="hero-actions" data-anime="gsap"><a class="bouton bouton--grand" href="#demande" data-action-principale>${c.t('evaluation.hero.action')} ${fleche}</a></p>
    <p class="hero-info" data-info-cle data-anime="gsap">${c.tb('evaluation.hero.info', { tel: `<a href="tel:${k.telephoneLien}">${k.telephone}</a>` })}</p>
  </div>
</section>

<section class="demande conteneur" id="demande">
  <div class="demande-grille">
    <form class="etapes" data-formulaire data-etapes action="#" novalidate data-libelle-etape="${sf('etape')}" data-erreur-services="${sf('servicesErreur')}">
      <h2 class="etapes-titre">${f('titre')}</h2>
      <p class="etapes-deroule">${f('deroule')}</p>
      <ol class="etapes-suivi" aria-hidden="true">${[1, 2, 3, 4, 5].map((n) => html`<li data-suivi="${n}"><span>${n}</span> <span class="suivi-lib">${f('e' + n)}</span></li>`)}</ol>
      <p class="visuellement-cache" data-etape-annonce aria-live="polite"></p>
      <div class="etapes-cadre" data-etapes-cadre>
        <fieldset class="etape-form" data-etape="1">
          <legend class="etape-titre"><span class="etape-num">1</span> ${f('e1')}</legend>
          <p class="etape-question" id="q-situation">${f('situation')}</p>
          <div class="choix-grille" role="radiogroup" aria-labelledby="q-situation" data-requis-groupe="situation" id="groupe-situation">
            ${radio('situation', 'demenagement', f('sDemenagement'))}${radio('situation', 'agrandissement', f('sAgrandissement'))}${radio('situation', 'probleme', f('sProbleme'))}${radio('situation', 'comparaison', f('sComparaison'))}${radio('situation', 'nouvelle', f('sNouvelle'))}
          </div>
        </fieldset>
        <fieldset class="etape-form" data-etape="2">
          <legend class="etape-titre"><span class="etape-num">2</span> ${f('e2')}</legend>
          <p class="etape-question" id="q-services">${f('services')} <span class="aide">${f('servicesAide')}</span></p>
          <div class="choix-grille" role="group" aria-labelledby="q-services" data-requis-groupe="services" id="groupe-services">
            ${services.map(([nom], i) => caseService(nom, nomsServices[i]))}
          </div>
          <div class="champ" data-si-service="s_telephonie">
            <label for="f-solution">${f('solution')}</label>
            <select id="f-solution" name="solution">
              <option value="inconnue">${f('solInconnue')}</option><option value="voxfon">${f('solVoxfon')}</option><option value="3cx">${f('sol3cx')}</option><option value="sip">${f('solSip')}</option>
            </select>
          </div>
        </fieldset>
        <fieldset class="etape-form" data-etape="3">
          <legend class="etape-titre"><span class="etape-num">3</span> ${f('e3')}</legend>
          <div class="champs-deux">
            <div class="champ"><label for="f-utilisateurs">${f('utilisateurs')}</label>
              <select id="f-utilisateurs" name="utilisateurs"><option value="u1">${f('u1')}</option><option value="u2">${f('u2')}</option><option value="u3">${f('u3')}</option><option value="u4">${f('u4')}</option></select></div>
            <div class="champ"><label for="f-sites">${f('sites')}</label>
              <select id="f-sites" name="sites"><option value="1">${f('si1')}</option><option value="2-5">${f('si2')}</option><option value="6+">${f('si3')}</option></select></div>
            <div class="champ"><label for="f-ville">${f('ville')}</label><input id="f-ville" name="ville" autocomplete="address-level2"></div>
            <div class="champ"><label for="f-delai">${f('delai')}</label>
              <select id="f-delai" name="delai"><option value="vite">${f('d1')}</option><option value="1-3">${f('d2')}</option><option value="plus-tard">${f('d3')}</option></select></div>
          </div>
        </fieldset>
        <fieldset class="etape-form" data-etape="4">
          <legend class="etape-titre"><span class="etape-num">4</span> ${f('e4')}</legend>
          <div class="champs-deux">
            <div class="champ"><label for="f-nom">${f('nom')} <span class="requis">(${f('requis')})</span></label><input id="f-nom" name="nom" autocomplete="name" required></div>
            <div class="champ"><label for="f-entreprise">${f('entreprise')} <span class="requis">(${f('requis')})</span></label><input id="f-entreprise" name="entreprise" autocomplete="organization" required></div>
            <div class="champ"><label for="f-email">${f('email')} <span class="requis">(${f('requis')})</span></label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
            <div class="champ"><label for="f-tel">${f('tel')}</label><input id="f-tel" name="tel" type="tel" autocomplete="tel"></div>
          </div>
          <div class="champ"><label for="f-message">${f('message')}</label><textarea id="f-message" name="message" rows="4"></textarea></div>
        </fieldset>
        <div class="etape-form" data-etape="5" role="group" aria-labelledby="titre-e5">
          <p class="etape-titre" id="titre-e5"><span class="etape-num">5</span> ${f('e5')}</p>
          <dl class="recap-liste recap-liste--final" data-recap-final></dl>
          <input type="hidden" name="estimation">
          <p class="mention-donnees">${c.tb('evaluation.form.donnees')}</p>
          <button type="submit" class="bouton bouton--grand" data-envoyer>${f('envoyer')}</button>
          <p data-message-envoi role="status" tabindex="-1" hidden data-texte="${sf('envoye')}"></p>
        </div>
      </div>
      <p class="etapes-nav" data-etapes-nav>
        <button type="button" class="bouton bouton--contour" data-precedent>${f('precedent')}</button>
        <button type="button" class="bouton" data-suivant>${f('suivant')} ${fleche}</button>
      </p>
    </form>
    <aside class="recap" aria-labelledby="recap-titre">
      <div class="recap-colle">
        <svg class="recap-fils" viewBox="0 0 300 70" preserveAspectRatio="none" aria-hidden="true" focusable="false" data-visuel>
          <path d="M0 8 C 110 8, 150 35, 300 35" stroke="#e0925f"/><path d="M0 26 C 120 26, 160 35, 300 35" stroke="#4fb3f0"/>
          <path d="M0 44 C 120 44, 160 35, 300 35" stroke="#9aa4ae"/><path d="M0 62 C 110 62, 150 35, 300 35" stroke="#e9e2d0"/>
        </svg>
        <p class="recap-titre" id="recap-titre">${f('recap')}</p>
        <dl class="recap-liste" data-recap aria-live="polite"><div><dt>${f('recap')}</dt><dd>${f('recapVide')}</dd></div></dl>
        <p class="recap-estimation" data-recap-estimation hidden><span>${f('estimation')}</span> <strong data-prix></strong></p>
      </div>
    </aside>
  </div>
  <script type="application/json" id="libelles-evaluation">${brut(JSON.stringify({
    estimationValeur: sf('estimationValeur'), modifier: sf('modifier'), vide: sf('recapVide'),
    titres: { situation: sf('e1'), services: sf('e2'), entreprise: sf('e3'), coordonnees: sf('e4') },
  }).replace(/</g, '\\u003c'))}</script>
</section>

<section class="coordonnees conteneur" id="coordonnees">
  ${c.media({ nom: 'grok/evaluation-coordonnees', alt: c.s('evaluation.coordonnees.alt'), cadrage: '50% 55%', classe: 'coordonnees-media', sizes: '(max-width: 760px) 100vw, 34vw' })}
  <div>
    <h2 class="titre-onde">${c.t('evaluation.coordonnees.titre')}</h2>
    <dl class="coordonnees-liste" data-anime>
      <div><dt>${c.t('evaluation.coordonnees.telephone')}</dt><dd><a href="tel:${k.telephoneLien}">${k.telephone}</a><br>${c.t('commun.sansFrais')} <a href="tel:${k.sansFraisLien}">${k.sansFrais}</a></dd></div>
      <div><dt>${c.t('evaluation.coordonnees.courriels')}</dt><dd>${c.t('evaluation.coordonnees.general')} <a href="mailto:${k.email}">${k.email}</a><br>${c.t('evaluation.coordonnees.support')} <a href="mailto:${k.support}">${k.support}</a></dd></div>
      <div><dt>${c.t('evaluation.coordonnees.adresse')}</dt><dd>${c.t('commun.adresse')}<br><a href="${k.carte}" target="_blank" rel="noopener noreferrer">${c.t('commun.carte')}<span class="visuellement-cache"> ${c.t('commun.nouvelOnglet')}</span></a></dd></div>
      <div><dt>${c.t('evaluation.coordonnees.horaires')}</dt><dd>${c.t('commun.bureau')}<br>${c.t('commun.soutien')}</dd></div>
    </dl>
  </div>
</section>
`;
};
