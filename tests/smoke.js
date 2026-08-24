/* FT refactor smoke tests — real headless Chromium, mobile viewport.
 * Run: node /home/claude/tests/smoke.js
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
    viewport: { width: 390, height: 844 },      // iPhone-ish
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  });
  const page = await ctx.newPage();

  const consoleErrors = [];
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));

  await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  // ---- App boots at all ----
  const booted = await page.evaluate(() => typeof window.renderWorkout === 'function' && !!document.getElementById('app'));
  check('App boots and renderWorkout exists', booted);

  // ---- Phase 5: single render lifecycle ----
  const hooks = await page.evaluate(() => ({
    installed: !!window.__ftRenderHooksInstalled,
    hasBefore: typeof window.registerBeforeWorkoutRender === 'function',
    hasAfter: typeof window.registerAfterWorkoutRender === 'function',
  }));
  check('Render hook registry installed', hooks.installed && hooks.hasBefore && hooks.hasAfter, JSON.stringify(hooks));

  // Navigate to workout tab
  await page.evaluate(() => window.go('Antrenman'));
  await page.waitForTimeout(900);

  const cards = await page.locator('.workout-card').count();
  check('Workout screen renders exercise cards', cards > 0, `${cards} cards`);

  // ---- Phase 2: single input controller / no conflicting attributes ----
  const inputState = await page.evaluate(() => {
    const els = [...document.querySelectorAll('input[id^="kg_"],input[id^="rep_"],input[id^="rir_"]')];
    return {
      total: els.length,
      readonly: els.filter(e => e.hasAttribute('readonly')).length,
      inputmodeNone: els.filter(e => e.getAttribute('inputmode') === 'none').length,
      inputmodeDecimal: els.filter(e => e.getAttribute('inputmode') === 'decimal').length,
      confirmButtons: document.querySelectorAll('.ft-input-confirm').length,
    };
  });
  check('All set inputs are readonly (native keyboard suppressed)',
    inputState.total > 0 && inputState.readonly === inputState.total,
    `${inputState.readonly}/${inputState.total}`);
  check('No conflicting inputmode="decimal" left on set inputs',
    inputState.inputmodeDecimal === 0 && inputState.inputmodeNone === inputState.total,
    `none=${inputState.inputmodeNone} decimal=${inputState.inputmodeDecimal}`);
  check('Dead "✓ confirm" buttons removed', inputState.confirmButtons === 0,
    `${inputState.confirmButtons} found`);

  // ---- Phase 3 + 4: KG -> Next -> Reps -> Next -> RIR -> complete -> blank next KG ----
  await page.locator('#kg_0_0').dispatchEvent('pointerdown');
  await page.waitForTimeout(250);

  const padOpen = await page.evaluate(() => document.getElementById('ftStrongPad')?.classList.contains('open'));
  check('Keypad opens on tapping KG field', !!padOpen);

  async function tapKeys(str) {
    for (const ch of str) {
      await page.locator(`#ftStrongPad button[data-key="${ch}"]`).click();
      await page.waitForTimeout(40);
    }
  }
  async function tapNext() {
    await page.locator('#ftStrongPad .ft-strong-next').click();
    await page.waitForTimeout(160);
  }

  await tapKeys('60');
  const kgVal = await page.locator('#kg_0_0').inputValue();
  check('KG value entered via keypad', kgVal === '60', `got "${kgVal}"`);

  await tapNext();
  let activeId = await page.evaluate(() => document.querySelector('.ft-strong-active')?.id);
  const stillOpen1 = await page.evaluate(() => document.getElementById('ftStrongPad')?.classList.contains('open'));
  check('KG -> Next advances to Reps', activeId === 'rep_0_0', `active=${activeId}`);
  check('Keypad stays open after KG -> Reps', !!stillOpen1);

  await tapKeys('10');
  await tapNext();
  activeId = await page.evaluate(() => document.querySelector('.ft-strong-active')?.id);
  const stillOpen2 = await page.evaluate(() => document.getElementById('ftStrongPad')?.classList.contains('open'));
  check('Reps -> Next advances to RIR', activeId === 'rir_0_0', `active=${activeId}`);
  check('Keypad stays open after Reps -> RIR', !!stillOpen2);

  const nextLabel = await page.locator('#ftStrongPad .ft-strong-next').textContent();
  check('Next button relabels to "Seti tamamla" on RIR', nextLabel.trim() === 'Seti tamamla', `"${nextLabel.trim()}"`);

  await tapKeys('2');
  await tapNext();
  await page.waitForTimeout(200);

  const afterComplete = await page.evaluate(() => ({
    done: document.getElementById('done_0_0')?.checked,
    active: document.querySelector('.ft-strong-active')?.id,
    nextKg: document.getElementById('kg_0_1')?.value,
    nextRep: document.getElementById('rep_0_1')?.value,
    nextRir: document.getElementById('rir_0_1')?.value,
    padOpen: document.getElementById('ftStrongPad')?.classList.contains('open'),
  }));
  check('RIR complete marks the set done', afterComplete.done === true);
  check('Focus moves to next set KG field', afterComplete.active === 'kg_0_1', `active=${afterComplete.active}`);
  check('Keypad stays open through set completion', !!afterComplete.padOpen);
  check('Next set KG field is BLANK (no auto-copy)', afterComplete.nextKg === '', `kg="${afterComplete.nextKg}"`);
  check('Next set Reps field is BLANK', !afterComplete.nextRep, `rep="${afterComplete.nextRep}"`);
  check('Next set RIR field is BLANK', !afterComplete.nextRir, `rir="${afterComplete.nextRir}"`);

  // Manual tap onto an arbitrary other field still works
  await page.locator('#rir_0_1').dispatchEvent('pointerdown');
  await page.waitForTimeout(200);
  const manual = await page.evaluate(() => document.querySelector('.ft-strong-active')?.id);
  check('User can tap directly into any other field', manual === 'rir_0_1', `active=${manual}`);

  await page.locator('#ftStrongPad .ft-strong-close').click();
  await page.waitForTimeout(200);
  const closed = await page.evaluate(() => !document.getElementById('ftStrongPad')?.classList.contains('open'));
  check('Keypad closes via close button', closed);

  // ---- Phase 7: exercise replace modal populates immediately, no skeleton ----
  const libInfo = await page.evaluate(() => ({
    libLen: Array.isArray(window.FT_EXERCISE_LIBRARY) ? window.FT_EXERCISE_LIBRARY.length : -1,
    hasOpenReplace: typeof window.ftLibraryOpenReplace === 'function',
    hasRender: typeof window.ftLibraryRenderResults === 'function',
  }));
  check('Exercise library loaded', libInfo.libLen > 100, `${libInfo.libLen} exercises`);

  await page.evaluate(() => window.ftLibraryOpenReplace());
  await page.waitForTimeout(400);
  const modal = await page.evaluate(() => ({
    open: document.getElementById('ftlibOverlay')?.classList.contains('open'),
    rows: document.querySelectorAll('#ftlibResults .ftlib-result').length,
    empty: document.querySelectorAll('#ftlibResults .ftlib-empty').length,
  }));
  check('Replace modal opens', !!modal.open);
  check('Modal shows real rows immediately (no empty skeleton)', modal.rows > 0 && modal.empty === 0,
    `${modal.rows} rows`);

  // search filter
  await page.locator('#ftlibSearch').fill('squat');
  await page.waitForTimeout(300);
  const searchRows = await page.evaluate(() => document.querySelectorAll('#ftlibResults .ftlib-result').length);
  check('Modal search filter works', searchRows > 0 && searchRows < modal.rows, `${searchRows} rows for "squat"`);

  // category filter
  await page.locator('#ftlibSearch').fill('');
  await page.waitForTimeout(200);
  await page.evaluate(() => window.ftLibraryCategory('Sırt'));
  await page.waitForTimeout(300);
  const catRows = await page.evaluate(() => document.querySelectorAll('#ftlibResults .ftlib-result').length);
  check('Modal category filter works', catRows > 0, `${catRows} rows for "Sırt"`);

  await page.evaluate(() => window.ftLibraryClose());
  await page.waitForTimeout(200);

  // ---- Phase 8: "make permanent" survives reload ----
  const before = await page.evaluate(() => {
    const wk = window._wk;
    return { wk, first: JSON.parse(JSON.stringify(db.program[wk][0])), len: db.program[wk].length };
  });

  await page.evaluate(() => {
    window.ftLibraryOpenReplace();
  });
  await page.waitForTimeout(300);
  await page.evaluate(() => { document.getElementById('ftlibPermanent').checked = true; window.ftLibraryPermanentChanged(true); });
  const pickName = await page.evaluate(() => {
    const target = window.FT_EXERCISE_LIBRARY.find(x => x.name === 'Pendlay Row') || window.FT_EXERCISE_LIBRARY[5];
    window.ftLibraryPick(target.name);
    return target.name;
  });
  await page.waitForTimeout(600);

  const afterPick = await page.evaluate(wk => ({
    programName: db.program[wk][0]?.name,
    stored: JSON.parse(localStorage.getItem('formDB')).program[wk][0]?.name,
  }), before.wk);
  check('Permanent swap applied in memory', afterPick.programName === pickName,
    `${afterPick.programName} (wanted ${pickName})`);
  check('Permanent swap written to localStorage', afterPick.stored === pickName,
    `stored=${afterPick.stored}`);

  // Reload — this is the migrateDB() regression test
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1400);
  const afterReload = await page.evaluate(wk => ({
    programName: db.program[wk] && db.program[wk][0]?.name,
    hasBackup: !!localStorage.getItem('formDB_backup_pre_program_fix'),
    workouts: (db.workouts || []).length,
    measurements: (db.measurements || []).length,
    foods: (db.foods || []).length,
  }), before.wk);
  check('PERMANENT SWAP SURVIVES RELOAD (migrateDB fix)', afterReload.programName === pickName,
    `after reload: ${afterReload.programName} (wanted ${pickName})`);
  check('Pre-fix safety backup was created', afterReload.hasBackup);
  check('User data preserved across reload', afterReload.foods > 50 && afterReload.measurements >= 1,
    `foods=${afterReload.foods} measurements=${afterReload.measurements} workouts=${afterReload.workouts}`);

  // ---- Regression: other tabs still open ----
  for (const tab of ['Panel', 'Beslenme', 'Ölçümler', 'Fotoğraflar', 'Ayarlar', 'Antrenman']) {
    await page.evaluate(t => window.go(t), tab);
    await page.waitForTimeout(400);
    const ok = await page.evaluate(() => (document.getElementById('app')?.children.length || 0) > 0);
    check(`Tab renders: ${tab}`, ok);
  }

  // ---- Phase 6: perf sanity — mutation observer throttling ----
  await page.evaluate(() => window.go('Antrenman'));
  await page.waitForTimeout(600);
  const perf = await page.evaluate(async () => {
    const t0 = performance.now();
    for (let i = 0; i < 5; i++) window.renderWorkout();
    await new Promise(r => setTimeout(r, 700));
    return Math.round(performance.now() - t0);
  });
  check('5 consecutive renders complete without hanging', perf < 5000, `${perf}ms`);

  // ---- Console errors ----
  const realErrors = consoleErrors.filter(e =>
    !/favicon|manifest|service-worker|sw\.js|Failed to load resource/i.test(e));
  check('No uncaught console errors', realErrors.length === 0,
    realErrors.slice(0, 5).join(' | '));

  await browser.close();

  const failed = results.filter(r => !r.pass);
  console.log('\n=============================');
  console.log(`TOTAL: ${results.length}   PASS: ${results.length - failed.length}   FAIL: ${failed.length}`);
  console.log('=============================');
  if (failed.length) {
    console.log('\nFAILURES:');
    failed.forEach(f => console.log(` - ${f.name} :: ${f.detail}`));
  }
  process.exit(failed.length ? 1 : 0);
})().catch(e => { console.error('HARNESS ERROR:', e); process.exit(2); });
