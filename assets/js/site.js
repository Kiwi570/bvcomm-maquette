/* BV Communications : effets propres au projet. Le socle gère l'ouverture, les transitions, l'en-tête,
   le menu, le mode calme, les boucles et les mesures ; ce fichier ne contient que ce qui est propre au client :
   intro des quatre fils et du « 1 », fibres de lumière (WebGL), fil de la page, titres en onde de signal,
   jeu du blâme, index des services, comparateur, estimateur, parcours épinglé, afficheur 1994,
   boutons magnétiques, cartes inclinées, sous-navigation, FAQ, formulaire en étapes, ligne d'oscilloscope. */
import { demarrer, boucle, etat, quand, rafraichir } from './socle/index.js?v=1';

const gsap = window.gsap;
const ST = window.ScrollTrigger;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const html = document.documentElement;
const fr = (html.lang || 'fr').startsWith('fr');
const souris = matchMedia('(hover: hover) and (pointer: fine)').matches;
const petit = () => window.innerWidth <= 760;
const essayer = (nom, f) => { try { f(); } catch (err) { console.error('[bv]', nom, err); } };
const DP = fr ? '\u00a0:' : ':'; /* deux-points : espace insécable avant en français */
const monnaie = new Intl.NumberFormat(fr ? 'fr-CA' : 'en-CA', { style: 'currency', currency: 'CAD' });
const argent = (n) => monnaie.format(n).replace(/\s?CA\s?/, '');

/* ---------- Titres en onde de signal : les mots montent l'un après l'autre, décalés comme une onde. ---------- */
function titresOnde() {
  if (etat.calme || !gsap || !window.SplitText) return;
  window.gsap.registerPlugin(window.SplitText);
  const lancer = () => $$('.titre-onde').forEach((el) => {
    /* Découpe le temps de l'animation seulement : le titre redevient un seul texte une fois arrivé. */
    const s = window.SplitText.create(el, { type: 'lines,words', mask: 'lines', linesClass: 'ligne-onde', wordsClass: 'mot' });
    gsap.fromTo(s.words, { yPercent: 110 }, {
      yPercent: 0, duration: .9, ease: 'power3.out',
      stagger: (i) => i * .045 + Math.sin(i * 1.3) * .03 + .03,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onComplete: () => s.revert(),
    });
  });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(lancer);
}

/* ---------- Intro : quatre fils entrent par les bords, se tressent, tracent le « 1 » (accueil)
   ou se rejoignent sur le logo (autres pages), puis la page se découvre. ---------- */
function preparerFils(panneau) {
  $$('.ouv-fil', panneau).forEach((p) => { p.style.strokeDasharray = '1000'; p.style.strokeDashoffset = '1000'; });
}

function lignesHero(tl, debut) {
  const lignes = $$('main .hero-ligne');
  if (lignes.length) tl.fromTo(lignes, { yPercent: 108, opacity: 1 }, { yPercent: 0, opacity: 1, duration: .75, stagger: .09, ease: 'power3.out' }, debut);
  const suite = $$('main .surtitre, main .hero-intro, main .hero-actions, main .hero-info').filter((e) => e.closest('#debut'));
  if (suite.length) tl.fromTo(suite, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .55, stagger: .07, ease: 'power2.out' }, debut + .12);
  return tl;
}

function introAccueil(tl, panneau) {
  const unPanneau = $('.ouv-un', panneau);
  const unHero = $('.hero-un');
  const brins = $$('.un-brin', unPanneau);
  const etiquettes = $$('.ouv-etiquette', panneau);
  tl.fromTo($$('.ouv-fil', panneau), { strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: .85, stagger: .06, ease: 'power2.inOut' }, 0)
    .fromTo(etiquettes, { opacity: 0 }, { opacity: 1, duration: .3, stagger: .05 }, .12)
    .fromTo(brins, { strokeDasharray: 1000, strokeDashoffset: 1000 }, { strokeDasharray: 1000, strokeDashoffset: 0, duration: .75, stagger: .04, ease: 'power2.inOut' }, .62)
    .fromTo($('.un-lumiere', unPanneau), { opacity: 0, strokeDashoffset: 1000 }, { opacity: .95, strokeDashoffset: 0, duration: .7, ease: 'power1.in' }, .95)
    .to(etiquettes, { opacity: 0, duration: .25 }, 1.15)
    .to($$('.ouv-fil', panneau), { opacity: 0, duration: .3 }, 1.25);
  /* Le « 1 » du panneau rejoint sa place exacte dans le premier écran. */
  const r = unHero ? unHero.getBoundingClientRect() : null;
  if (r && r.width > 4 && r.height > 4) {
    const h0 = Math.min(innerHeight * .52, innerWidth * .72), w0 = h0 * .5;
    Object.assign(unPanneau.style, { left: r.left + 'px', top: r.top + 'px', height: r.height + 'px', width: r.width + 'px', transform: 'none' });
    const s = h0 / r.height;
    const dx = innerWidth / 2 - w0 / 2 - r.left, dy = innerHeight / 2 - h0 - r.top;
    tl.fromTo(unPanneau, { x: dx, y: dy, scale: s, transformOrigin: '0 0' }, { x: 0, y: 0, scale: 1, duration: .6, ease: 'power3.inOut' }, 1.3);
  } else {
    tl.to(unPanneau, { opacity: 0, duration: .3 }, 1.3);
  }
  /* Le panneau s'efface : le « 1 » du premier écran, identique et à la même place, prend le relais. */
  tl.fromTo(panneau, { opacity: 1 }, { opacity: 0, duration: .45, ease: 'power1.inOut' }, 1.6);
  lignesHero(tl, 1.5);
  return tl;
}

function introPage(tl, panneau) {
  tl.fromTo($$('.ouv-fil', panneau), { strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: .8, stagger: .06, ease: 'power2.inOut' }, 0)
    .fromTo($$('.ouv-etiquette', panneau), { opacity: 0 }, { opacity: 1, duration: .3, stagger: .05 }, .1)
    .fromTo($('.ouverture-logo', panneau), { opacity: 0, scale: .9, xPercent: -50, yPercent: -50 }, { opacity: 1, scale: 1, xPercent: -50, yPercent: -50, duration: .45, ease: 'power2.out' }, .7)
    .fromTo($('.ouverture-ligne', panneau), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .4 }, .8)
    .fromTo(panneau, { clipPath: 'inset(0 0 0% 0)' }, { clipPath: 'inset(0 0 100% 0)', duration: .7, ease: 'power4.inOut' }, 1.25);
  lignesHero(tl, 1.4);
  return tl;
}

/* ---------- Fibres de lumière (WebGL) dans le premier écran de l'accueil. ---------- */
function fibres() {
  const canvas = $('.hero-gl');
  if (html.dataset.webgl) return;
  if (!canvas || petit() || !souris && window.innerWidth < 1024) { canvas && canvas.remove(); return; }
  const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false, powerPreference: 'low-power' });
  if (!gl) { canvas.remove(); return; }
  html.dataset.webgl = 'oui';
  const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const fs = `precision mediump float;uniform vec2 r;uniform float t;uniform vec2 c;
  float h(float n){return fract(sin(n*91.7)*4375.85);}
  void main(){
    vec2 uv=gl_FragCoord.xy/r; uv.y=1.-uv.y;
    if(uv.x>c.x+.02||uv.x<.4){gl_FragColor=vec4(0.);return;}
    float k=r.x/r.y; vec3 col=vec3(0.); float a=0.;
    for(int i=0;i<10;i++){
      float fi=float(i); float s=h(fi);
      float x=(uv.x-.4)/(c.x-.4); float env=1.-x;
      float y=c.y+(s-.5)*.9*env*env + sin(x*6.+fi+t*.35)*.025*env;
      float d=abs(uv.y-y)*r.y;
      float w=exp(-d*d*.18);
      float ph=fract(x*.9-t*(.12+s*.1)+s);
      float pulse=exp(-pow((ph-.5)*16.,2.));
      vec3 tint=mix(vec3(.31,.70,.94),vec3(.88,.57,.37),step(.62,s));
      float v=w*(.10+1.6*pulse)*smoothstep(0.,.3,x);
      col+=tint*v; a+=v;
    }
    a=clamp(a,0.,1.); gl_FragColor=vec4(col*.85,a*.85);
  }`;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(prog);
  gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uR = gl.getUniformLocation(prog, 'r'), uT = gl.getUniformLocation(prog, 't'), uC = gl.getUniformLocation(prog, 'c');
  gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  let qualite = 1, lents = 0, cx = .78, cy = .62;
  const mesurer = () => {
    const dpr = Math.min(1.25, window.devicePixelRatio || 1) * qualite;
    const rc = canvas.getBoundingClientRect();
    canvas.width = Math.max(2, Math.round(rc.width * dpr)); canvas.height = Math.max(2, Math.round(rc.height * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
    const u = $('.hero-un'), ru = u && u.getBoundingClientRect();
    if (ru && ru.width) { cx = (ru.left + ru.width * .6) / rc.width; cy = (ru.bottom - ru.height * .04 - rc.top) / rc.height; }
  };
  mesurer();
  window.addEventListener('resize', mesurer, { passive: true });
  let dernier = 0;
  boucle(canvas, (dt, t) => {
    const t0 = performance.now();
    gl.uniform2f(uR, canvas.width, canvas.height); gl.uniform1f(uT, t); gl.uniform2f(uC, cx, cy);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    /* Qualité qui baisse d'elle-même si les images prennent trop de temps. */
    if (dernier && t0 - dernier > 24) { if (++lents > 20 && qualite > .5) { qualite -= .25; lents = 0; mesurer(); } } else lents = Math.max(0, lents - 1);
    dernier = t0;
  }, { lourde: true });
  canvas.classList.add('actif');
}

/* ---------- Fil de la page : un câble dans la marge gauche, qui change de matière à chaque section
   et finit branché sur le bouton du contact. Positions mesurées au chargement et quand la page change de hauteur. ---------- */
function filPage() {
  const main = $('main');
  if (!main || html.dataset.page !== 'accueil' || !gsap || !ST) return;
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'fil-page'); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('data-audit-ignorer', '');
  main.prepend(svg);
  const troncons = [
    ['#un-seul-fournisseur', '#c26a35'], ['#services', '#c26a35'], ['#comparateur', '#4fb3f0'],
    ['#estimateur', '#4fb3f0'], ['#parcours', '#9aa4ae'], ['#preuves', '#c9bea4'], ['#contact', '#cc3b3b'],
  ];
  let declencheurs = [];
  const construire = () => {
    declencheurs.forEach((d) => d.kill()); declencheurs = [];
    svg.replaceChildren();
    const sy = window.scrollY, haut = main.getBoundingClientRect().top + sy;
    const cont = $('.conteneur'), bordGauche = cont ? cont.getBoundingClientRect().left : 24;
    const x = Math.max(6, Math.min(36, bordGauche / 2));
    svg.setAttribute('width', String(window.innerWidth)); svg.setAttribute('height', String(main.offsetHeight));
    svg.setAttribute('viewBox', `0 0 ${window.innerWidth} ${main.offsetHeight}`);
    const unHero = $('.hero-un'), ru = unHero && unHero.getBoundingClientRect();
    let precY = ru && ru.width ? ru.bottom + sy - haut : $('#debut').offsetHeight * .8;
    let precX = ru && ru.width ? ru.left + ru.width * .6 : x;
    troncons.forEach(([sel, couleur], i) => {
      const s = $(sel); if (!s) return;
      const r = s.getBoundingClientRect();
      const y0 = precY, y1 = r.bottom + sy - haut - 40;
      const amp = Math.min(14, x * .6);
      let d = `M${precX} ${y0}`;
      if (i === 0) d += ` C ${precX} ${y0 + 120}, ${x} ${y0 + 80}, ${x} ${y0 + 220}`;
      const debutY = i === 0 ? y0 + 220 : y0;
      const n = Math.max(2, Math.round((y1 - debutY) / 320));
      for (let k = 1; k <= n; k++) {
        const ya = debutY + ((y1 - debutY) * (k - .5)) / n, yb = debutY + ((y1 - debutY) * k) / n;
        d += ` Q ${x + (k % 2 ? amp : -amp)} ${ya}, ${x} ${yb}`;
      }
      if (sel === '#contact') {
        const prise = $('[data-fil-prise]');
        if (prise) {
          const rp = prise.getBoundingClientRect(), yp = rp.top + rp.height / 2 + sy - haut;
          d = `M${precX} ${y0} L ${x} ${yp - 40} Q ${x} ${yp}, ${x + 30} ${yp} L ${rp.left - 6} ${yp}`;
        }
      }
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', d); p.setAttribute('stroke', couleur);
      svg.appendChild(p);
      const L = p.getTotalLength();
      p.style.strokeDasharray = `${L}`;
      if (etat.calme) { p.style.strokeDashoffset = '0'; }
      else {
        const tw = gsap.fromTo(p, { strokeDashoffset: L }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: s, start: i === 0 ? 'top 95%' : 'top 70%', end: 'bottom 60%', scrub: .5 } });
        declencheurs.push(tw.scrollTrigger);
      }
      precX = x; precY = sel === '#contact' ? y1 : y1;
    });
  };
  construire();
  let attente = 0;
  quand('rafraichi', () => { clearTimeout(attente); attente = setTimeout(() => { construire(); }, 60); });
}

/* ---------- Jeu du blâme : un point rouge passe d'un fournisseur à l'autre, puis un seul reste. ---------- */
function jeuDuBlame() {
  const schema = $('[data-blame]');
  if (!schema || etat.calme || !gsap || !ST) { schema && schema.classList.add('fini'); return; }
  const point = $('.blame-point', schema), noeuds = $$('.blame-noeud', schema), centre = $('.blame-centre', schema);
  const tl = gsap.timeline({ scrollTrigger: { trigger: schema, start: 'top 80%', end: 'bottom 40%', scrub: .6 } });
  tl.fromTo(point, { x: 0, y: 0 }, { x: 260, y: 0, duration: 1, ease: 'power1.inOut' })
    .to(point, { x: 260, y: 200, duration: 1, ease: 'power1.inOut' })
    .to(point, { x: 0, y: 200, duration: 1, ease: 'power1.inOut' })
    .to(point, { x: 0, y: 0, duration: 1, ease: 'power1.inOut' })
    .to(point, { opacity: 0, duration: .4 }, '>-0.2')
    .to('.blame-renvoi, .blame-question', { opacity: 0, duration: .5 }, '<')
    .to(noeuds, { opacity: .55, scale: .94, duration: .8 }, '<')
    .fromTo(centre, { opacity: 0, scale: .6, xPercent: -50, yPercent: -50 }, { opacity: 1, scale: 1, xPercent: -50, yPercent: -50, duration: .9, ease: 'back.out(1.6)' }, '<+0.2');
}

/* ---------- Index des services : la section en cours s'allume dans la colonne collante. ---------- */
function indexServices() {
  const items = $$('.services-index li');
  if (!items.length) return;
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    items.forEach((li) => li.classList.toggle('actif', li.dataset.index === e.target.id));
  }), { rootMargin: '-40% 0px -55% 0px' });
  $$('[data-service]').forEach((s) => io.observe(s));
  items[0].classList.add('actif');
}

/* ---------- Comparateur : la solution qui correspond s'allume, le prix Voxfon suit la taille. ---------- */
function comparateur() {
  const z = $('[data-comparateur]'); if (!z) return;
  const tarifs = JSON.parse(($('#tarifs-donnees') || {}).textContent || 'null');
  const maj = () => {
    const taille = +(($('input[name="taille"]:checked', z) || {}).value || 2);
    const besoin = ($('input[name="besoin"]:checked', z) || {}).value || 'heberge';
    const reco = besoin === 'garder' ? 'sip' : besoin === 'teams' ? '3cx' : 'voxfon';
    $$('[data-solution]', z).forEach((s) => s.classList.toggle('est-recommandee', s.dataset.solution === reco));
    const prix = $('[data-solution="voxfon"] [data-prix-solution]', z);
    if (prix && tarifs) prix.textContent = argent(tarifs.voxfon[taille - 1].prix);
  };
  z.addEventListener('change', maj);
  maj();
}

/* ---------- Estimateur : total calculé avec les prix publiés, facture qui s'imprime, lien prérempli. ---------- */
function estimateur() {
  const z = $('[data-estimateur]'); if (!z) return;
  const T = JSON.parse($('#tarifs-donnees').textContent);
  const L = fr ? {
    voxfon: (n, p) => `Voxfon · ${n} utilisateur${n > 1 ? 's' : ''} × ${p}`, sip: (n, p) => `Lignes SIP · ${n} × ${p}`,
    troiscx: '3CX', internet: (nom) => `Internet · ${nom}`, lignes: (n, p) => `Lignes d’affaires · ${n} × ${p}`,
    sansEng: (n) => `Sans engagement · ${n} × ${argent(T.lignes.sansEngagement)}`, pri: 'ISDN PRI', sansFrais: (n) => `Sans frais · ${n} × ${argent(T.sansFrais)}`,
    cablage: 'Câblage', soumission: 'sur soumission', vide: 'Choisissez au moins un service.', palier: (n) => `Palier Voxfon\u00a0: engagement de ${n}\u00a0an${n > 1 ? 's' : ''}`,
  } : {
    voxfon: (n, p) => `Voxfon · ${n} user${n > 1 ? 's' : ''} × ${p}`, sip: (n, p) => `SIP trunking · ${n} × ${p}`,
    troiscx: '3CX', internet: (nom) => `Internet · ${nom}`, lignes: (n, p) => `Business lines · ${n} × ${p}`,
    sansEng: (n) => `No commitment · ${n} × ${argent(T.lignes.sansEngagement)}`, pri: 'ISDN PRI', sansFrais: (n) => `Toll-free · ${n} × ${argent(T.sansFrais)}`,
    cablage: 'Cabling', soumission: 'quoted on request', vide: 'Pick at least one service.', palier: (n) => `Voxfon tier: ${n}-year commitment`,
  };
  const liste = $('[data-facture-lignes]', z), sortie = $('[data-total]', z), lien = $('[data-estimateur-lien]', z), palier = $('[data-palier]', z);
  const val = (n) => $(`[name="${n}"]`, z);
  const nombre = (n) => { const i = val(n); const v = Math.round(+i.value || 0); return Math.min(+i.max, Math.max(+i.min, v)); };
  let precedent = new Set($$('li', liste).map((li) => li.firstElementChild.textContent));
  let totalAffiche = +sortie.dataset.total;
  const mobile = $('[data-total-mobile]', z);
  const ecrireTotal = (v) => { sortie.textContent = argent(v); if (mobile) mobile.textContent = argent(v); };
  const rouler = (de, a) => {
    if (etat.calme || !gsap) { ecrireTotal(a); return; }
    const o = { v: de };
    gsap.to(o, { v: a, duration: .45, ease: 'power2.out', onUpdate: () => ecrireTotal(o.v), onComplete: () => ecrireTotal(a) });
  };
  const maj = () => {
    const tel = ($('input[name="tel"]:checked', z) || {}).value;
    const net = ($('input[name="net"]:checked', z) || {}).value;
    const n = nombre('utilisateurs'), nl = nombre('lignes'), nsf = nombre('sansFrais');
    $$('[data-si]', z).forEach((el) => { el.hidden = !el.dataset.si.split(' ').includes(tel); });
    $$('[data-si-lignes]', z).forEach((el) => { el.hidden = nl === 0; });
    const lignes = [];
    if (tel === 'voxfon') {
      const p = T.voxfon.find((x) => n >= x.min && (x.max == null || n <= x.max));
      lignes.push([L.voxfon(n, argent(p.prix)), n * p.prix]);
      if (palier) palier.textContent = L.palier(p.engagement);
    } else if (tel === 'sip') {
      const d = ($('input[name="duree"]:checked', z) || {}).value || '1an';
      const p = T.sip.find((x) => x.cle === d);
      lignes.push([L.sip(n, argent(p.prix)), n * p.prix]);
    } else if (tel === '3cx') lignes.push([L.troiscx, null]);
    if (net && net !== 'aucun') {
      const p = T.internet.find((x) => x.cle === net);
      const nom = $(`input[name="net"][value="${net}"] + span`, z).childNodes[0].textContent.trim();
      lignes.push([L.internet(nom), p.prix]);
    }
    if (nl > 0) {
      const p = nl < 5 ? T.lignes.moinsDe5 : T.lignes.cinqEtPlus;
      lignes.push([L.lignes(nl, argent(p)), nl * p]);
      if (val('sansEngagement').checked) lignes.push([L.sansEng(nl), nl * T.lignes.sansEngagement]);
    }
    if (val('pri').checked) lignes.push([L.pri, T.pri]);
    if (nsf > 0) lignes.push([L.sansFrais(nsf), nsf * T.sansFrais]);
    if (val('cablage').checked) lignes.push([L.cablage, null]);
    const total = Math.round(lignes.reduce((a, [, v]) => a + (v || 0), 0) * 100) / 100;
    const nouveaux = new Set();
    liste.replaceChildren(...(lignes.length ? lignes.map(([lib, v]) => {
      const li = document.createElement('li');
      li.dataset.lignePrix = v == null ? '0' : v.toFixed(2);
      const a = document.createElement('span'); a.textContent = lib;
      const b = document.createElement('span'); b.textContent = v == null ? L.soumission : argent(Math.round(v * 100) / 100);
      li.append(a, b);
      if (!precedent.has(lib) && !etat.calme) li.classList.add('nouvelle');
      nouveaux.add(lib);
      return li;
    }) : [Object.assign(document.createElement('li'), { className: 'facture-vide', textContent: L.vide })]));
    precedent = nouveaux;
    sortie.dataset.total = total.toFixed(2);
    rouler(totalAffiche, total); totalAffiche = total;
    /* Lien vers l'évaluation : services, solution, taille et estimation déjà remplis. */
    const q = new URLSearchParams();
    if (tel && tel !== 'aucune') { q.set('s_telephonie', 'oui'); q.set('solution', tel); }
    if (net && net !== 'aucun') q.set('s_internet', 'oui');
    if (nl > 0 || val('pri').checked || nsf > 0) q.set('s_lignes', 'oui');
    if (val('cablage').checked) q.set('s_cablage', 'oui');
    q.set('utilisateurs', n <= 9 ? 'u1' : n <= 24 ? 'u2' : n <= 99 ? 'u3' : 'u4');
    if (total > 0) q.set('estimation', total.toFixed(2));
    const u = new URL(lien.href, location.href); u.search = q.toString(); lien.href = u.pathname + u.search;
  };
  z.addEventListener('change', maj);
  z.addEventListener('input', (e) => { if (e.target.type === 'number') maj(); });
  $$('[data-pas]', z).forEach((p) => {
    const i = $('input', p);
    const pas = (d) => { i.value = String(Math.min(+i.max, Math.max(+i.min, (+i.value || 0) + d))); maj(); };
    $('[data-pas-moins]', p).addEventListener('click', () => pas(-1));
    $('[data-pas-plus]', p).addEventListener('click', () => pas(1));
    i.addEventListener('blur', () => { i.value = String(Math.min(+i.max, Math.max(+i.min, Math.round(+i.value || 0)))); maj(); });
  });
  maj();
}

/* ---------- Parcours : galerie horizontale épinglée, le fil sert de barre de progression. ---------- */
function parcours() {
  const section = $('.parcours');
  const piste = section && $('.parcours-piste', section);
  if (!piste || !gsap || !ST || etat.calme) return;
  ST.matchMedia({
    '(min-width: 761px) and (min-height: 600px)': () => {
      piste.removeAttribute('tabindex');
      const distance = () => Math.max(0, piste.scrollWidth - window.innerWidth);
      const barre = $('.parcours-fil span', section);
      gsap.fromTo(piste, { x: 0 }, {
        x: () => -distance(), ease: 'none',
        scrollTrigger: {
          trigger: section, start: 'top top', end: () => '+=' + distance(), pin: true, anticipatePin: 1, scrub: .6, invalidateOnRefresh: true,
          onUpdate: (s) => barre && (barre.style.transform = `scaleX(${s.progress})`),
        },
      });
      return () => piste.setAttribute('tabindex', '0');
    },
  });
}

/* ---------- 1994 en afficheur à palettes : chaque chiffre défile puis s'arrête. ---------- */
function palettes() {
  const el = $('[data-palettes]'); if (!el) return;
  const annee = el.dataset.palettes, texte = el.textContent, i = texte.indexOf(annee);
  /* Années recalculées au chargement (la page est générée une fois par version). */
  const p = $('[data-annees]');
  if (p) p.innerHTML = p.innerHTML.replace(/\d+(?=\s|&nbsp;|\u00a0)/, String(new Date().getFullYear() - +p.dataset.annees));
  if (i < 0 || etat.calme || !gsap) return;
  /* Afficheur à palettes : chaque chiffre bascule sur son axe et tombe en place. Jamais d'autre année affichée. */
  el.textContent = '';
  el.append(document.createTextNode(texte.slice(0, i)));
  const chiffres = [...annee].map((ch) => { const s = document.createElement('span'); s.className = 'palette'; s.textContent = ch; el.append(s); return s; });
  el.append(document.createTextNode(texte.slice(i + annee.length)));
  gsap.fromTo(chiffres, { rotateX: -92, transformPerspective: 600, transformOrigin: '50% 0%', opacity: 1 }, {
    rotateX: 0, opacity: 1, duration: .7, ease: 'back.out(2.2)', stagger: .12,
    scrollTrigger: { trigger: el, start: 'top 85%', once: true },
  });
}

/* ---------- Sommaires et sous-navigation : rien n'est signalé tant qu'on est en haut de la page. ---------- */
function hautDePage() {
  const listes = $$('[data-sommaire], [data-sous-nav]');
  if (!listes.length) return;
  const maj = () => {
    if (window.scrollY > 40) return;
    listes.forEach((l) => $$('[aria-current="location"]', l).forEach((a) => a.removeAttribute('aria-current')));
  };
  window.addEventListener('scroll', () => requestAnimationFrame(maj), { passive: true });
  setTimeout(maj, 400);
}

/* ---------- Boutons magnétiques et cartes inclinées (souris seulement). ---------- */
function micro() {
  if (!souris || etat.calme) return;
  $$('.bouton--grand, .bouton--entete').forEach((b) => {
    let r = null;
    b.addEventListener('pointerenter', () => { r = b.getBoundingClientRect(); });
    b.addEventListener('pointermove', (e) => {
      if (!r) return;
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width, dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      b.style.transform = `translate(${(dx * 8).toFixed(1)}px, ${(dy * 6).toFixed(1)}px)`;
    });
    b.addEventListener('pointerleave', () => { b.style.transform = ''; r = null; });
  });
  $$('[data-incline], .solution, .palier, .temoin').forEach((c) => {
    let r = null;
    c.addEventListener('pointerenter', () => { r = c.getBoundingClientRect(); });
    c.addEventListener('pointermove', (e) => {
      if (!r) return;
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      c.style.transform = `perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg)`;
    });
    c.addEventListener('pointerleave', () => { c.style.transform = ''; r = null; });
  });
}

/* ---------- Téléphonie : sous-navigation qui suit la lecture, FAQ animée. ---------- */
function sousNav() {
  const nav = $('[data-sous-nav]'); if (!nav) return;
  const liens = new Map($$('a', nav).map((a) => [a.hash.slice(1), a]));
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    const a = liens.get(e.target.id); if (!a) return;
    if (e.isIntersecting) { liens.forEach((x) => x.removeAttribute('aria-current')); a.setAttribute('aria-current', 'location'); }
  }), { rootMargin: '-35% 0px -60% 0px' });
  liens.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
}

function faq() {
  $$('.faq-item').forEach((d) => {
    const s = $('summary', d), corps = $('.faq-reponse', d);
    if (!s || !corps) return;
    s.addEventListener('click', (e) => {
      if (etat.calme) return;
      e.preventDefault();
      if (d.dataset.anim) return;
      d.dataset.anim = '1';
      if (!d.open) {
        d.open = true;
        const h = corps.scrollHeight;
        corps.animate([{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }], { duration: 320, easing: 'cubic-bezier(.22,1,.36,1)' }).finished.finally(() => { delete d.dataset.anim; });
      } else {
        const h = corps.scrollHeight;
        corps.animate([{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 260, easing: 'cubic-bezier(.22,1,.36,1)' }).finished.finally(() => { d.open = false; delete d.dataset.anim; });
      }
    });
  });
}

/* ---------- Évaluation : formulaire en 5 étapes, vérification par étape, récapitulatif en direct. ---------- */
function etapes() {
  const f = $('[data-etapes]'); if (!f) return;
  const blocs = $$('[data-etape]', f), total = blocs.length;
  const cadre = $('[data-etapes-cadre]', f), annonce = $('[data-etape-annonce]', f);
  const prec = $('[data-precedent]', f), suiv = $('[data-suivant]', f);
  const recap = $('[data-recap]'), recapFinal = $('[data-recap-final]', f), estim = $('[data-recap-estimation]');
  const lib = JSON.parse($('#libelles-evaluation').textContent);
  const msg = fr ? { requis: 'Ce champ est à remplir.', email: 'Adresse courriel à vérifier (exemple\u00a0: nom@entreprise.ca).', tel: 'Numéro à vérifier (10 chiffres).', choix: 'Choisissez une réponse.' }
    : { requis: 'Please fill in this field.', email: 'Please check this email address (e.g. name@company.com).', tel: 'Please check this phone number.', choix: 'Please choose an answer.' };
  let courante = 1;
  const vues = new Set([1]);
  f.dataset.pret = '';

  const texteChoix = (input) => { const s = input.closest('label') && input.closest('label').querySelector('span'); return s ? s.textContent.trim() : input.value; };
  const texteSelect = (s) => (s.selectedOptions[0] ? s.selectedOptions[0].textContent.trim() : '');
  const erreur = (champ, m, conteneur) => {
    const id = 'erreur-' + (champ.id || champ.name || conteneur.id);
    let p = document.getElementById(id);
    const saisie = /^(INPUT|SELECT|TEXTAREA)$/.test(champ.tagName);
    if (!m) { if (p) p.textContent = ''; if (saisie) champ.removeAttribute('aria-invalid'); return; }
    if (!p) {
      p = document.createElement('p'); p.id = id; p.className = 'champ-erreur'; p.setAttribute('aria-live', 'polite');
      (conteneur || champ.closest('.champ') || champ.parentElement).appendChild(p);
      if (champ.setAttribute) champ.setAttribute('aria-describedby', [champ.getAttribute('aria-describedby'), id].filter(Boolean).join(' '));
    }
    p.textContent = m;
    if (saisie) champ.setAttribute('aria-invalid', 'true');
  };
  const verifierEtape = (n) => {
    const bloc = blocs[n - 1]; let premier = null;
    $$('[data-requis-groupe]', bloc).forEach((g) => {
      const ok = $$('input', g).some((i) => i.checked);
      const m = ok ? '' : (g.dataset.requisGroupe === 'services' ? f.dataset.erreurServices : msg.choix);
      erreur(g, m, g.parentElement);
      if (!ok && !premier) premier = $('input', g);
    });
    $$('input[required], input[type="email"], input[type="tel"]', bloc).forEach((c) => {
      const v = c.value.trim(); let m = '';
      if (c.required && !v) m = msg.requis;
      else if (v && c.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) m = msg.email;
      else if (v && c.type === 'tel' && v.replace(/\D/g, '').length < 9) m = msg.tel;
      erreur(c, m); if (m && !premier) premier = c;
    });
    if (premier) premier.focus();
    return !premier;
  };
  const resume = () => {
    const sit = $('input[name="situation"]:checked', f);
    const svcs = $$('[data-requis-groupe="services"] input:checked', f).map(texteChoix);
    const tel = $('input[name="s_telephonie"]', f).checked;
    const ent = [texteSelect($('[name="utilisateurs"]', f)), texteSelect($('[name="sites"]', f)), $('[name="ville"]', f).value.trim(), texteSelect($('[name="delai"]', f))].filter(Boolean);
    const coord = [$('[name="nom"]', f).value.trim(), $('[name="entreprise"]', f).value.trim(), $('[name="email"]', f).value.trim(), $('[name="tel"]', f).value.trim()].filter(Boolean);
    return [
      ['situation', 1, lib.titres.situation, sit ? texteChoix(sit) : ''],
      ['services', 2, lib.titres.services, svcs.join(', ') + (tel && svcs.length ? ` (${texteSelect($('[name="solution"]', f))})` : '')],
      ['entreprise', 3, lib.titres.entreprise, vues.has(3) ? ent.join(' · ') : ''],
      ['coordonnees', 4, lib.titres.coordonnees, coord.join(' · ')],
    ];
  };
  const majRecap = () => {
    const r = resume().filter(([, , , v]) => v);
    recap.replaceChildren(...(r.length ? r : [['', 0, lib.titres.situation, lib.vide]]).map(([, , t, v]) => {
      const d = document.createElement('div'), dt = document.createElement('dt'), dd = document.createElement('dd');
      dt.textContent = t; dd.textContent = v; d.append(dt, dd); return d;
    }));
    recapFinal.replaceChildren(...resume().map(([, n, t, v]) => {
      const d = document.createElement('div'), dt = document.createElement('dt'), dd = document.createElement('dd');
      dt.textContent = t;
      const s = document.createElement('span'); s.textContent = v || '—';
      const b = document.createElement('button'); b.type = 'button'; b.textContent = lib.modifier; b.setAttribute('aria-label', `${lib.modifier}${DP} ${t}`);
      b.addEventListener('click', () => aller(n));
      dd.append(s, b); d.append(dt, dd); return d;
    }));
    const e = $('[name="estimation"]', f).value;
    if (e && +e > 0) { estim.hidden = false; $('strong', estim).textContent = lib.estimationValeur.replace('{montant}', argent(+e)); }
    $$('[data-si-service]', f).forEach((el) => { el.hidden = !$(`[name="${el.dataset.siService}"]`, f).checked; });
  };
  const afficher = (n, focus = true) => {
    const avant = cadre.offsetHeight;
    blocs.forEach((b, i) => b.classList.toggle('courante', i === n - 1));
    $$('[data-suivi]', f).forEach((li) => { const k = +li.dataset.suivi; li.classList.toggle('courante', k === n); li.classList.toggle('fait', k < n); });
    prec.hidden = n === 1; suiv.hidden = n === total;
    annonce.textContent = f.dataset.libelleEtape.replace('{n}', n).replace('{total}', total) + DP + ' ' + ($('.etape-titre', blocs[n - 1]).textContent.replace(/^\s*\d+\s*/, '').trim());
    if (!etat.calme && avant) {
      const apres = cadre.offsetHeight;
      if (Math.abs(apres - avant) > 2) cadre.animate([{ height: avant + 'px' }, { height: apres + 'px' }], { duration: 300, easing: 'cubic-bezier(.22,1,.36,1)' });
    }
    if (focus) { const t = $('.etape-titre', blocs[n - 1]); t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); }
    courante = n; vues.add(n);
    majRecap();
  };
  const aller = (n) => {
    afficher(n);
    const r = f.getBoundingClientRect();
    if (r.top < 0 || r.top > window.innerHeight * .5) window.scrollTo({ top: r.top + window.scrollY - (parseInt(getComputedStyle(html).getPropertyValue('--entete-h'), 10) || 70) - 16, behavior: etat.calme ? 'instant' : 'smooth' });
  };
  suiv.addEventListener('click', () => { if (verifierEtape(courante)) aller(courante + 1); });
  prec.addEventListener('click', () => aller(courante - 1));
  /* Entrée dans un champ avant la dernière étape : étape suivante, jamais un envoi. */
  f.addEventListener('submit', (e) => {
    if (courante < total) { e.preventDefault(); e.stopImmediatePropagation(); if (verifierEtape(courante)) aller(courante + 1); return; }
    for (let n = 1; n < total; n++) if (!verifierEtape(n)) { e.preventDefault(); e.stopImmediatePropagation(); aller(n); verifierEtape(n); return; }
  }, true);
  f.addEventListener('input', majRecap);
  f.addEventListener('change', (e) => { majRecap(); if (e.target.closest('[data-requis-groupe]')) { const g = e.target.closest('[data-requis-groupe]'); erreur(g, '', g.parentElement); } });
  afficher(1, false);
}

/* ---------- 404 : ligne plate d'oscilloscope, un battement passe de temps en temps. ---------- */
function oscillo() {
  const svg = $('[data-oscillo]'); if (!svg) return;
  const p = $('path', svg);
  boucle(svg, (dt, t) => {
    const pos = ((t % 3.2) / 3.2) * 760 - 80;
    let d = 'M0 30';
    for (let x = 0; x <= 600; x += 6) {
      const u = (x - pos) / 18;
      const y = Math.abs(u) < 2 ? 30 - Math.sin(u * Math.PI) * 22 * Math.exp(-u * u * .6) : 30;
      d += ` L${x} ${y.toFixed(1)}`;
    }
    p.setAttribute('d', d);
  });
}

/* ---------- Après un grand saut (lien vers une section, retour à une section), l'en-tête reste visible. ---------- */
function enteteApresSaut() {
  let y0 = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (Math.abs(y - y0) > window.innerHeight * 1.2) requestAnimationFrame(() => requestAnimationFrame(() => html.classList.remove('entete-cache')));
    y0 = y;
  }, { passive: true });
}

/* ---------- Démarrage. ---------- */
demarrer({
  preparer() {
    /* Au rechargement, l'intro repart du haut : ScrollTrigger ne restaure aucune position mémorisée. */
    if (ST && ST.clearScrollMemory && html.dataset.arrivee === 'intro') ST.clearScrollMemory('manual');
    essayer('titres', titresOnde);
    essayer('blame', jeuDuBlame);
    essayer('index', indexServices);
    essayer('comparateur', comparateur);
    essayer('estimateur', estimateur);
    essayer('parcours', parcours);
    essayer('palettes', palettes);
    essayer('micro', micro);
    essayer('sousNav', sousNav);
    essayer('faq', faq);
    essayer('etapes', etapes);
    essayer('oscillo', oscillo);
    essayer('fil', filPage);
    essayer('saut', enteteApresSaut);
    essayer('haut', hautDePage);
    const panneau = $('[data-ouverture]');
    if (panneau) preparerFils(panneau);
    /* Les fibres de lumière (WebGL) démarrent après l'ouverture. */
    quand('pret', () => essayer('fibres', fibres));
  },
  jouer() {
    if (!gsap) return null;
    const panneau = $('[data-ouverture]');
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    if (!panneau) return lignesHero(tl, 0);
    return panneau.classList.contains('ouverture--un') ? introAccueil(tl, panneau) : introPage(tl, panneau);
  },
  etatFinal() {
    if (!gsap) return;
    gsap.set('main .hero-ligne, main .surtitre, main .hero-intro, main .hero-actions, main .hero-info', { clearProps: 'transform,opacity' });
  },
  arrivee() {
    if (!gsap) return;
    lignesHero(gsap.timeline(), .1);
    const brins = $$('.hero-un .un-brin');
    if (brins.length) gsap.fromTo(brins, { strokeDasharray: 1000, strokeDashoffset: 1000 }, { strokeDasharray: 1000, strokeDashoffset: 0, duration: .9, stagger: .05, ease: 'power2.inOut', delay: .2 });
  },
});
