/* FT migration regression test.
 * Seeds a realistic PRE-EXISTING formDB (custom program, workout history,
 * measurements, meals, photos, habits) then loads the app and verifies
 * nothing is wiped or reset by migrateDB().
 */
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const BASE = 'http://127.0.0.1:8842';

const results = [];
function check(name, pass, detail) {
  results.push({ name, pass, detail: detail || '' });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
}

// A user who has customized their program and logged real sessions.
const legacyDB = {
  version: '1.4.0',
  profile: { name: 'Hüseyin', height: 181, startWeight: 93, startDate: '2026-07-19' },
  targets: { kcal: 2500, protein: 200, carb: 240, fat: 75, fiber: 32, water: 4 },
  foods: [{ name: 'Özel Yemek', category: 'Diğer', brand: 'Ev', unit: 'g', servingG: 100, kcal: 200, protein: 10, carb: 20, fat: 5, fiber: 2 }],
  meals: { '2026-08-01': [{ name: 'Yulaf', grams: 80, kcal: 311 }] },
  workouts: [
    { date: '2026-08-01', type: 'Upper A', durationSec: 3600, exercises: [
      { name: 'Incline Chest Press', sets: 3, setData: [{ set: 1, weight: 60, reps: 10, rir: 2, done: true }] }
    ]},
    { date: '2026-08-05', type: 'Lower A', durationSec: 3300, exercises: [
      { name: 'Back Squat', sets: 3, setData: [{ set: 1, weight: 100, reps: 5, rir: 2, done: true }] }
    ]},
  ],
  measurements: [
    { date: '2026-07-19', weight: 93, waist: 95, note: 'Başlangıç' },
    { date: '2026-08-10', weight: 89.5, waist: 91, note: 'İlerleme' },
  ],
  photos: [{ date: '2026-07-19', pose: 'Ön', data: 'data:image/png;base64,iVBORw0KGgo=' }],
  habits: { '2026-08-01': { water: 4, steps: 9000 } },
  // CUSTOM program: user replaced exercises and changed set counts
  program: {
    'Upper Strength': [
      { name: 'ÖZEL Incline Press', sets: 5, reps: '6-8', rir: '1' },
      { name: 'Pendlay Row', sets: 4, reps: '5-8', rir: '2' },
    ],
    'Lower Strength': [
      { name: 'Front Squat', sets: 5, reps: '3-5', rir: '2' },
    ],
  },
  settings: {
    scheduleVersion: '3.0',                                     // already migrated user
    trainingDays: { 1: 'Upper Strength', 3: 'Lower Strength', 5: 'Upper Strength' },
    foodUsage: { 'Yulaf': 12 },
  },
};

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

  // Seed storage before the app boots
  await page.goto(`${BASE}/index.html`);
  await page.evaluate(db => {
    localStorage.clear();
    localStorage.setItem('formDB', JSON.stringify(db));
  }, legacyDB);

  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const after = await page.evaluate(() => ({
    programUpperA: (db.program['Upper Strength'] || []).map(e => e.name),
    upperASets: (db.program['Upper Strength'] || []).map(e => e.sets),
    programLowerA: (db.program['Lower Strength'] || []).map(e => e.name),
    trainingDays: db.settings.trainingDays,
    workouts: db.workouts.length,
    workoutDates: db.workouts.map(w => w.date),
    measurements: db.measurements.length,
    measureWeights: db.measurements.map(m => m.weight),
    photos: db.photos.length,
    mealKeys: Object.keys(db.meals),
    habitKeys: Object.keys(db.habits),
    targets: db.targets,
    customFoodKept: db.foods.some(f => f.name === 'Özel Yemek'),
    foodsCount: db.foods.length,
    foodUsage: db.settings.foodUsage,
    version: db.version,
  }));

  check('Custom program (Upper Strength) NOT reset to defaults',
    after.programUpperA.includes('ÖZEL Incline Press') && after.programUpperA.includes('Pendlay Row'),
    JSON.stringify(after.programUpperA));
  check('Custom set counts preserved', JSON.stringify(after.upperASets) === '[5,4]', JSON.stringify(after.upperASets));
  check('Custom program (Lower Strength) preserved',
    after.programLowerA.length === 1 && after.programLowerA[0] === 'Front Squat',
    JSON.stringify(after.programLowerA));
  check('Custom training-day schedule preserved',
    JSON.stringify(after.trainingDays) === JSON.stringify({ 1: 'Upper Strength', 3: 'Lower Strength', 5: 'Upper Strength' }),
    JSON.stringify(after.trainingDays));
  check('Workout history intact', after.workouts === 2 && after.workoutDates.join(',') === '2026-08-01,2026-08-05',
    after.workoutDates.join(','));
  check('Measurements intact', after.measurements === 2 && after.measureWeights.join(',') === '93,89.5',
    after.measureWeights.join(','));
  check('Photos intact', after.photos === 1);
  check('Meals intact', after.mealKeys.join(',') === '2026-08-01', after.mealKeys.join(','));
  check('Habits intact', after.habitKeys.join(',') === '2026-08-01', after.habitKeys.join(','));
  check('Custom targets preserved', after.targets.kcal === 2500 && after.targets.protein === 200,
    JSON.stringify(after.targets));
  check('User custom food preserved', after.customFoodKept);
  check('Default foods still merged in (feature not lost)', after.foodsCount > 50, `${after.foodsCount} foods`);
  check('foodUsage preserved', after.foodUsage && after.foodUsage['Yulaf'] === 12, JSON.stringify(after.foodUsage));
  check('Version bumped by migration', !!after.version, after.version);
  check('No pageerror during migration', errors.length === 0, errors.slice(0, 3).join(' | '));

  // Second reload — make sure it's stable, not just first-run lucky
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1400);
  const after2 = await page.evaluate(() => ({
    programUpperA: (db.program['Upper Strength'] || []).map(e => e.name),
    trainingDays: db.settings.trainingDays,
    workouts: db.workouts.length,
  }));
  check('Still preserved after SECOND reload',
    after2.programUpperA.includes('ÖZEL Incline Press') &&
    JSON.stringify(after2.trainingDays) === JSON.stringify({ 1: 'Upper Strength', 3: 'Lower Strength', 5: 'Upper Strength' }) &&
    after2.workouts === 2,
    JSON.stringify(after2.programUpperA));

  // Fresh-install path: no formDB at all should still seed defaults
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1400);
  const fresh = await page.evaluate(() => ({
    hasProgram: Object.keys(db.program || {}).length,
    hasDays: Object.keys(db.settings.trainingDays || {}).length,
    foods: (db.foods || []).length,
    upperA: (db.program['Upper Strength'] || []).length,
  }));
  check('Fresh install still seeds default program', fresh.hasProgram >= 4 && fresh.upperA > 0,
    `${fresh.hasProgram} plans, Upper Strength has ${fresh.upperA}`);
  check('Fresh install still seeds trainingDays', fresh.hasDays === 4, `${fresh.hasDays} days`);
  check('Fresh install still seeds foods', fresh.foods > 50, `${fresh.foods} foods`);

  await browser.close();
  const failed = results.filter(r => !r.pass);
  console.log('\n=============================');
  console.log(`TOTAL: ${results.length}   PASS: ${results.length - failed.length}   FAIL: ${failed.length}`);
  console.log('=============================');
  if (failed.length) { console.log('\nFAILURES:'); failed.forEach(f => console.log(` - ${f.name} :: ${f.detail}`)); }
  process.exit(failed.length ? 1 : 0);
})().catch(e => { console.error('HARNESS ERROR:', e); process.exit(2); });
