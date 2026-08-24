/* FT PWA / offline / save-persistence test */
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const BASE = 'http://127.0.0.1:8842';

const results = [];
function check(name, pass, detail) {
  results.push({ name, pass, detail: detail || '' });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

  await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);

  // Service worker registers
  const swState = await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return { supported: false };
    const reg = await navigator.serviceWorker.getRegistration();
    return {
      supported: true,
      registered: !!reg,
      scriptURL: reg?.active?.scriptURL || reg?.installing?.scriptURL || reg?.waiting?.scriptURL || null,
    };
  });
  check('Service worker registers', swState.supported && swState.registered, JSON.stringify(swState));

  // Wait for SW to become active + precache
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForTimeout(2500);

  const cacheInfo = await page.evaluate(async () => {
    const keys = await caches.keys();
    const c = await caches.open(keys.find(k => k.startsWith('form-')) || keys[0]);
    const reqs = await c.keys();
    return { cacheNames: keys, cached: reqs.length, paths: reqs.map(r => new URL(r.url).pathname) };
  });
  check('Single versioned cache present', cacheInfo.cacheNames.filter(n => n.startsWith('form-')).length === 1,
    cacheInfo.cacheNames.join(','));
  check('Assets precached', cacheInfo.cached > 20, `${cacheInfo.cached} entries`);
  check('New ft-render-hooks.js is precached',
    cacheInfo.paths.includes('/ft-render-hooks.js'), '');
  check('Removed ft-library-hotfix.js NOT in cache',
    !cacheInfo.paths.includes('/ft-library-hotfix.js'), '');

  // Save a workout, then verify it persists
  await page.evaluate(() => window.go('Antrenman'));
  await page.waitForTimeout(900);
  const saved = await page.evaluate(() => {
    window.startWorkout();
    const kg = document.getElementById('kg_0_0'), rep = document.getElementById('rep_0_0');
    if (kg) kg.value = '70';
    if (rep) rep.value = '8';
    const cb = document.getElementById('done_0_0'); if (cb) cb.checked = true;
    const before = db.workouts.length;
    window.saveWorkout();
    return { before, after: db.workouts.length, last: db.workouts.at(-1) };
  });
  check('Workout saves to db', saved.after === saved.before + 1, `${saved.before} -> ${saved.after}`);
  check('Saved workout contains set data',
    !!saved.last?.exercises?.[0]?.setData?.length, JSON.stringify(saved.last?.exercises?.[0]?.setData?.[0] || {}));

  // Offline: reload with network cut — app must still boot
  await ctx.setOffline(true);
  let offlineBooted = false, offlineWorkouts = -1;
  try {
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);
    const r = await page.evaluate(() => {
      let workouts = -1;
      try { workouts = (db.workouts || []).length } catch (e) { workouts = -1 }
      return {
        booted: typeof window.renderWorkout === 'function' && !!document.getElementById('app'),
        workouts,
      };
    });
    offlineBooted = r.booted; offlineWorkouts = r.workouts;
  } catch (e) {
    offlineBooted = false;
  }
  check('App boots OFFLINE from cache', offlineBooted, offlineBooted ? '' : 'did not boot');
  check('Saved workout survives offline reload', offlineWorkouts >= 1, `${offlineWorkouts} workouts`);

  await ctx.setOffline(false);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const backOnline = await page.evaluate(() => ({
    booted: typeof window.renderWorkout === 'function',
    workouts: (db.workouts || []).length,
  }));
  check('App recovers when back online', backOnline.booted);
  check('Data still intact after online/offline cycle', backOnline.workouts >= 1, `${backOnline.workouts} workouts`);
  check('No pageerror during PWA cycle', errors.length === 0, errors.slice(0, 3).join(' | '));

  await browser.close();
  const failed = results.filter(r => !r.pass);
  console.log('\n=============================');
  console.log(`TOTAL: ${results.length}   PASS: ${results.length - failed.length}   FAIL: ${failed.length}`);
  console.log('=============================');
  if (failed.length) { console.log('\nFAILURES:'); failed.forEach(f => console.log(` - ${f.name} :: ${f.detail}`)); }
  process.exit(failed.length ? 1 : 0);
})().catch(e => { console.error('HARNESS ERROR:', e); process.exit(2); });
