/* Regression: a saved workout draft must never override an intentional plan switch.
 * Run with the repo served on http://127.0.0.1:8842
 */
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const BASE = 'http://127.0.0.1:8842';

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  let failed = false;
  const check = (name, pass, detail='') => {
    console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — '+detail : ''}`);
    if(!pass) failed = true;
  };

  await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  await page.evaluate(() => window.go('Antrenman'));
  await page.waitForTimeout(600);

  await page.evaluate(() => {
    localStorage.setItem('FORM_WORKOUT_DRAFT_V1', JSON.stringify({
      version: 1,
      type: 'Lower Strength',
      date: '2026-08-25',
      startedAt: null,
      updatedAt: Date.now(),
      exercises: [{ sets: [{ weight: '100', reps: '6', rir: '2', done: true }], note: '' }],
      cardio: {},
      rpe: ''
    }));
    window._wk = 'Lower Strength';
    window.renderWorkout();
  });
  await page.waitForTimeout(500);

  const lowerBefore = await page.evaluate(() => ({
    plan: window._wk,
    first: document.querySelector('.workout-card .exercise-head')?.textContent || ''
  }));
  check('Lower draft is active before switching', lowerBefore.plan === 'Lower Strength');
  check('Lower exercise is rendered before switching', /Back Squat/i.test(lowerBefore.first), lowerBefore.first.trim());

  const switched = await page.evaluate(() => {
    const sel = [...document.querySelectorAll('#app select')].find(s =>
      [...s.options].some(o => o.value === 'Upper Strength' || /Upper Strength/.test(o.textContent || ''))
    );
    if(!sel) return false;
    const opt = [...sel.options].find(o => o.value === 'Upper Strength' || /Upper Strength/.test(o.textContent || ''));
    sel.value = opt.value;
    sel.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  });
  check('Upper option exists and change event fires', switched);
  await page.waitForTimeout(700);

  const after = await page.evaluate(() => ({
    plan: window._wk,
    first: document.querySelector('.workout-card .exercise-head')?.textContent || '',
    draft: JSON.parse(localStorage.getItem('FORM_WORKOUT_DRAFT_V1') || 'null')
  }));
  check('Intentional switch remains on Upper Strength', after.plan === 'Upper Strength', `plan=${after.plan}`);
  check('Upper exercise list is rendered', /Incline Chest Press/i.test(after.first), after.first.trim());
  check('Browsing Upper does not destroy meaningful Lower draft', after.draft?.type === 'Lower Strength', `draft=${after.draft?.type}`);

  await browser.close();
  process.exit(failed ? 1 : 0);
})().catch(err => { console.error(err); process.exit(1); });
