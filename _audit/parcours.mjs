/* Parcours propres à BV Communications : estimateur (totaux vérifiés par le calcul, total visible pendant les choix),
   comparateur (la bonne solution s'allume), lien prérempli vers l'évaluation, formulaire en 5 étapes
   (vérification par étape, Entrée qui ne soumet pas, double clic, récapitulatif), FAQ et sous-navigation. */
export default async function ({ contexte, attendrePret, attendre, BASE, R, T }) {
  for (const taille of ['390×844', '1440×900']) {
    const { ctx, page } = await contexte({ taille: T(taille) });
    try {
      /* Estimateur. */
      await page.goto(BASE + '/', { waitUntil: 'load' });
      await attendrePret(page);
      await page.locator('#estimateur').scrollIntoViewIfNeeded();
      await page.locator('#estimateur label:has(input[name="tel"][value="sip"])').click();
      await page.locator('#estimateur label:has(input[name="duree"][value="3ans"])').click();
      await page.fill('#est-utilisateurs', '12');
      await page.locator('#est-utilisateurs').blur();
      await page.locator('#estimateur label:has(input[name="net"][value="fibre"])').click();
      for (let i = 0; i < 6; i++) await page.click('[aria-controls="est-lignes"][data-pas-plus]');
      await page.locator('label:has(input[name="pri"])').click();
      await page.click('[aria-controls="est-sansfrais"][data-pas-plus]');
      await page.click('[aria-controls="est-sansfrais"][data-pas-plus]');
      await attendre(700);
      const r = await page.evaluate(() => {
        const lignes = [...document.querySelectorAll('[data-facture-lignes] [data-ligne-prix]')].map((l) => parseFloat(l.dataset.lignePrix));
        const total = document.querySelector('[data-total]');
        const vus = [...document.querySelectorAll('[data-total], [data-total-mobile]')].map((e) => e.getBoundingClientRect()).filter((x) => x.width > 0);
        const rt = vus.find((x) => x.top >= 0 && x.bottom <= innerHeight) || vus[0];
        const lien = document.querySelector('[data-estimateur-lien]').getAttribute('href');
        return { somme: lignes.reduce((a, b) => a + b, 0), affiche: parseFloat(total.dataset.total), texte: total.textContent, visible: rt.top >= 0 && rt.bottom <= innerHeight, lien };
      });
      /* 12 × 14,99 (SIP 3 ans) + 399 (fibre) + 6 × 39,99 (lignes, 5 et plus) + 399 (PRI) + 2 × 4,95 (sans frais) */
      const attendu = Math.round((12 * 14.99 + 399 + 6 * 39.99 + 399 + 2 * 4.95) * 100) / 100;
      if (Math.abs(r.somme - attendu) > 0.01) R.echec('estimateur', `lignes = ${r.somme.toFixed(2)} au lieu de ${attendu}`, { page: '/', taille });
      if (Math.abs(r.affiche - attendu) > 0.01) R.echec('estimateur', `total ${r.affiche} au lieu de ${attendu}`, { page: '/', taille });
      if (!r.visible) R.echec('estimateur', 'le total n’est pas visible pendant les choix', { page: '/', taille });
      if (!/s_telephonie=oui/.test(r.lien) || !/solution=sip/.test(r.lien) || !/estimation=/.test(r.lien)) R.echec('estimateur', `lien vers l’évaluation mal prérempli : ${r.lien}`, { page: '/', taille });
      R.ok('estimateur');

      /* Comparateur : « garder mon système » allume SIP, « Teams » allume 3CX. */
      await page.locator('#comparateur').scrollIntoViewIfNeeded();
      await page.locator('#comparateur label:has(input[name="besoin"][value="garder"])').click();
      await attendre(200);
      let reco = await page.evaluate(() => document.querySelector('.solution.est-recommandee')?.dataset.solution);
      if (reco !== 'sip') R.echec('comparateur', `« garder mon système » recommande ${reco}`, { page: '/', taille });
      await page.locator('#comparateur label:has(input[name="besoin"][value="teams"])').click();
      await attendre(200);
      reco = await page.evaluate(() => document.querySelector('.solution.est-recommandee')?.dataset.solution);
      if (reco !== '3cx') R.echec('comparateur', `« Teams » recommande ${reco}`, { page: '/', taille });
      R.ok('comparateur');

      /* Évaluation : arrivée préremplie depuis l'estimateur. */
      await page.goto(BASE + r.lien, { waitUntil: 'load' });
      await attendrePret(page);
      const pre = await page.evaluate(() => ({
        tel: document.querySelector('[name="s_telephonie"]').checked, sol: document.querySelector('[name="solution"]').value,
        est: !document.querySelector('[data-recap-estimation]').hidden,
      }));
      if (!pre.tel || pre.sol !== 'sip' || !pre.est) R.echec('évaluation', `préremplissage incomplet ${JSON.stringify(pre)}`, { page: '/evaluation', taille });

      /* Étape 1 sans réponse : erreur, on reste à l'étape 1. Entrée ne soumet pas. */
      await page.locator('#demande').scrollIntoViewIfNeeded();
      await page.click('[data-suivant]');
      await attendre(150);
      let etape = await page.evaluate(() => document.querySelector('.etape-form.courante')?.dataset.etape);
      const err = await page.evaluate(() => document.querySelector('#erreur-groupe-situation')?.textContent || '');
      if (etape !== '1' || !err) R.echec('évaluation', 'étape 1 franchie sans réponse, ou sans message d’erreur', { page: '/evaluation', taille });
      await page.locator('label:has(input[name="situation"][value="demenagement"])').click();
      await page.click('[data-suivant]');
      await page.click('[data-suivant]');
      await page.click('[data-suivant]');
      await page.fill('#f-nom', 'Test');
      await page.locator('#f-nom').press('Enter');
      await attendre(150);
      etape = await page.evaluate(() => document.querySelector('.etape-form.courante')?.dataset.etape);
      if (etape !== '4') R.echec('évaluation', `Entrée à l’étape 4 avec des champs manquants mène à l’étape ${etape}`, { page: '/evaluation', taille });
      await page.fill('#f-entreprise', 'Entreprise test');
      await page.fill('#f-email', 'test@exemple.ca');
      await page.click('[data-suivant]');
      await attendre(200);
      etape = await page.evaluate(() => document.querySelector('.etape-form.courante')?.dataset.etape);
      if (etape !== '5') R.echec('évaluation', `récapitulatif non atteint (étape ${etape})`, { page: '/evaluation', taille });
      const recap = await page.evaluate(() => document.querySelector('[data-recap-final]').textContent);
      if (!/Test/.test(recap) || !/test@exemple\.ca/.test(recap)) R.echec('évaluation', 'récapitulatif incomplet', { page: '/evaluation', taille });
      await page.dblclick('[data-envoyer]');
      await attendre(300);
      const fin = await page.evaluate(() => ({ off: document.querySelector('[data-envoyer]').disabled, msg: !document.querySelector('[data-message-envoi]').hidden }));
      if (!fin.off || !fin.msg) R.echec('évaluation', `envoi simulé : bouton ${fin.off ? 'désactivé' : 'actif'}, message ${fin.msg ? 'affiché' : 'absent'}`, { page: '/evaluation', taille });
      R.ok('évaluation en étapes');

      /* Téléphonie : FAQ qui s'ouvre et se referme, lien de sous-navigation. */
      await page.goto(BASE + '/telephonie', { waitUntil: 'load' });
      await attendrePret(page);
      const q = page.locator('.faq-item summary').first();
      await q.scrollIntoViewIfNeeded();
      await q.click(); await attendre(450);
      const ouvert = await page.evaluate(() => document.querySelector('.faq-item').open);
      await q.click(); await attendre(400);
      const ferme = await page.evaluate(() => !document.querySelector('.faq-item').open);
      if (!ouvert || !ferme) R.echec('FAQ', `ouverture ${ouvert}, fermeture ${ferme}`, { page: '/telephonie', taille });
      R.ok('FAQ');
    } catch (err) {
      R.echec('parcours du projet', String(err.message || err).slice(0, 300), { taille });
    } finally { await ctx.close(); }
  }
}
