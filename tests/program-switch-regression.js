/* Regression test — program selector must be the single source of truth for
 * window._wk. Reproduces the reported bug: selecting a new program on the
 * workout screen did not reliably change the rendered workout, because
 * multiple after/before-render hooks (ft-workout-session.js's localStorage
 * draft restore, ft-workout-smart.js's catch-up restore) forced window._wk
 * back to a stale value after the user's own selection had already re-rendered.
 * Run: node tests/program-switch-regression.js
 */
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const BASE = 'http://127.0.0.1:8842';

const results = [];
function check(name, pass, detail) {
  results.push({ name, pass, detail: detail || '' });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
}

async function firstExerciseName(page) {
  return page.evaluate(() => document.querySelector('.workout-card strong')?.textContent?.trim() || null);
}

async function selectProgram(page, planName) {
  await page.evaluate((plan) => {
    const sel = [...document.querySelectorAll('select')].find(s => [...s.options].some(o => o.value === plan || o.textContent.startsWith(plan)));
    if (!sel) throw new Error('selector not found for ' + plan);
    const opt = [...sel.options].find(o => o.value === plan || o.textContent.startsWith(plan));
    sel.value = opt.value;
    sel.dispatchEvent(new Event('change', { bubbles: true }));
  }, planName);
  await page.waitForTimeout(500);
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  });
  const page = await ctx.newPage();
  page.on('pageerror', e => console.log('PAGE ERROR:', e.message));

  try {
    await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.evaluate(() => { window.current = 'Antrenman'; window.renderWorkout(); });
    await page.waitForTimeout(400);

    await selectProgram(page, 'Lower Strength');
    check('Lower Strength -> Back Squat', (await firstExerciseName(page)) === 'Back Squat', await firstExerciseName(page));

    await selectProgram(page, 'Upper Strength');
    check('Upper Strength -> Incline Chest Press', (await firstExerciseName(page)) === 'Incline Chest Press', await firstExerciseName(page));

    await selectProgram(page, 'Upper Hypertrophy');
    check('Upper Hypertrophy -> Incline Dumbbell Press', (await firstExerciseName(page)) === 'Incline Dumbbell Press', await firstExerciseName(page));

    await selectProgram(page, 'Lower Strength');
    check('Back to Lower Strength -> Back Squat', (await firstExerciseName(page)) === 'Back Squat', await firstExerciseName(page));

    await selectProgram(page, 'HYROX Hybrid');
    const hyroxOk = await page.evaluate(() => !!document.body.textContent.includes('HYROX'));
    check('HYROX Hybrid renders HYROX screen', hyroxOk);

    await selectProgram(page, 'Upper Strength');
    check('Switch back from HYROX -> Incline Chest Press', (await firstExerciseName(page)) === 'Incline Chest Press', await firstExerciseName(page));

    await page.evaluate(() => {
      localStorage.setItem('FORM_WORKOUT_DRAFT_V1', JSON.stringify({
        version: 1, type: 'Lower Strength', date: '2026-08-25', startedAt: null,
        updatedAt: Date.now(), exercises: [], cardio: {}, rpe: ''
      }));
    });
    await selectProgram(page, 'Upper Strength');
    await page.waitForTimeout(400);
    check('Stale draft (Lower Strength) does not override explicit Upper Strength selection',
      (await firstExerciseName(page)) === 'Incline Chest Press', await firstExerciseName(page));
    const wkAfterDraft = await page.evaluate(() => window._wk);
    check('window._wk stays Upper Strength after stale-draft render pass', wkAfterDraft === 'Upper Strength', wkAfterDraft);

    await page.evaluate(() => {
      const today = new Date();
      const k = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
      localStorage.setItem('formCatchupWorkoutV1', JSON.stringify({ date: k, sourceDate: k, plan: 'Lower Strength' }));
    });
    await selectProgram(page, 'Upper Hypertrophy');
    await page.waitForTimeout(400);
    check('Active catch-up flag (Lower Strength) does not override explicit Upper Hypertrophy selection',
      (await firstExerciseName(page)) === 'Incline Dumbbell Press', await firstExerciseName(page));

    await page.evaluate(() => { localStorage.removeItem('formCatchupWorkoutV1'); localStorage.removeItem('FORM_WORKOUT_DRAFT_V1'); });

  } catch (e) {
    console.log('HARNESS ERROR:', e.message);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }

  const fail = results.filter(r => !r.pass).length;
  console.log('\n=============================');
  console.log(`TOTAL: ${results.length}   PASS: ${results.length - fail}   FAIL: ${fail}`);
  console.log('=============================');
  if (fail > 0) process.exitCode = 1;
})();
