/* Regression test — schedule-v2.js render routing must not bypass ft-render-hooks.js.
 * Before the fix: schedule-v2.js loaded AFTER ft-render-hooks.js and re-wrapped
 * window.renderWorkout directly (no registry use). Its HYROX Hybrid branch called
 * renderHyrox() and returned WITHOUT ever calling the hook-wrapped base render,
 * so every registerBeforeWorkoutRender/registerAfterWorkoutRender hook (keypad
 * hardening, coach-plus enhancements, mobile-fix, etc.) silently stopped firing
 * whenever the user was on the HYROX Hybrid plan.
 * Run: node tests/hyrox-hook-regression.js
 */
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const BASE = 'http://127.0.0.1:8842';

const results = [];
function check(name, pass, detail) {
  results.push({ name, pass, detail: detail || '' });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
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
  try {
    await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#navbar, nav, body', { timeout: 10000 }).catch(()=>{});
    await page.waitForTimeout(500);

    // Register canary hooks through the public registry API.
    await page.evaluate(() => {
      window.__before = 0; window.__after = 0;
      window.registerBeforeWorkoutRender(() => { window.__before++; });
      window.registerAfterWorkoutRender(() => { window.__after++; });
    });

    // Switch to the Antrenman tab, then explicitly select HYROX Hybrid.
    await page.evaluate(() => { window.current = 'Antrenman'; window._wk = 'HYROX Hybrid'; window.renderWorkout(); });
    await page.waitForTimeout(400);

    const counts = await page.evaluate(() => ({ before: window.__before, after: window.__after }));
    check('Before-hook fires when rendering HYROX Hybrid', counts.before >= 1, `before=${counts.before}`);
    check('After-hook fires when rendering HYROX Hybrid', counts.after >= 1, `after=${counts.after}`);

    const hyroxRendered = await page.evaluate(() => !!document.querySelector('.workout-card, .card'));
    check('HYROX screen actually rendered', hyroxRendered);

    // Switch back to a normal plan and confirm hooks still fire (no regression there).
    await page.evaluate(() => { window._wk = 'Upper Strength'; window.renderWorkout(); });
    await page.waitForTimeout(400);
    const counts2 = await page.evaluate(() => ({ before: window.__before, after: window.__after }));
    check('Hooks continue firing for a normal plan after switching back', counts2.before > counts.before && counts2.after > counts.after, `before=${counts2.before} after=${counts2.after}`);

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
