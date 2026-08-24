# FORM / FT — Claude Stabilization Handoff

## Repository
- Repo: `LpLozi/form-tracker`
- Work only on branch: `claude-stabilization`
- Do **not** modify `main` directly.

## Current production symptom
On the workout screen, changing the program selector does not reliably change the rendered workout. Example: user is on `Lower Strength`, taps/selects `Upper Strength`, but the screen remains on Lower exercises.

Expected examples:
- `Upper Strength` first exercise: `Incline Chest Press`
- `Lower Strength` first exercise: `Back Squat`
- `Upper Hypertrophy` first exercise: `Incline Dumbbell Press`
- `HYROX Hybrid` should render the HYROX screen.

## Important architectural context
The codebase accumulated many post-load workout modifiers. Historically multiple files wrapped `renderWorkout`; `ft-render-hooks.js` was introduced to reduce this, but the workout selector is still modified by multiple layers.

Relevant files include:
- `app-base.html` — base `renderWorkout()` and original `<select onchange="window._wk=this.value;renderWorkout()">`
- `workout-plus.js`
- `schedule-v2.js`
- `ft-render-hooks.js`
- `workout-ui-v2.js`
- `ft-workout-ux-fix.js`
- `ft-training-v3.js`
- `ft-workout-session.js`
- `ft-workout-day-label.js`
- `ft-smart-hotfix.js`
- `ft-workout-calendar.js`

`index.html` injects all these scripts in sequence.

## Known findings
1. `ft-workout-day-label.js` hides the real `<select>` (`opacity:0`) and places a custom visible layer over it.
2. `workout-ui-v2.js` also relocates/wraps the workout selector.
3. `schedule-v2.js` also replaces `sel.onchange` after render.
4. `ft-workout-session.js` previously used stored draft type as navigation state and could force `window._wk` back to the draft plan after render. A prior attempted fix addressed only this layer, but the real-device preview still failed, proving this was not the only cause.
5. `ft-smart-hotfix.js` contains a canonical schedule map that has drifted from the actual schedule in `schedule-v2.js`.

## What NOT to do
- Do not add another hotfix file.
- Do not add another `renderWorkout` wrapper unless strictly unavoidable.
- Do not solve this by stacking more `setTimeout` callbacks.
- Do not touch unrelated nutrition, body measurements, dashboard, or saved workout data.
- Do not delete user history or reset `db.program`.
- Do not merge to `main`.

## Requested task
Perform a real root-cause analysis of the workout program switching path and refactor it so there is **one authoritative owner** for:
1. selected workout state,
2. selector change event,
3. render routing.

Prefer the simplest architecture possible. The real select may remain visually styled, but avoid a hidden native select plus a second fake UI layer unless there is a compelling reason.

The selected program must survive subsequent after-render hooks without being overwritten by schedule, saved draft, catch-up logic, labels, or UI decorators.

## Required behavior
When user explicitly selects a program, that selection wins immediately.

Test this sequence on a mobile viewport:
1. Open workout screen.
2. Select `Lower Strength` → first exercise must be `Back Squat`.
3. Select `Upper Strength` → first exercise must become `Incline Chest Press`.
4. Select `Upper Hypertrophy` → first exercise must become `Incline Dumbbell Press`.
5. Select `Lower Strength` again → first exercise must become `Back Squat`.
6. Select `HYROX Hybrid` → HYROX UI must render.
7. Switch back from HYROX to `Upper Strength` successfully.

Also test with an existing `FORM_WORKOUT_DRAFT_V1` in localStorage for `Lower Strength`: selecting Upper must still stay Upper. The draft must not act as navigation state.

## Regression requirements
Existing repository tests include Playwright smoke/migration/PWA tests. Add or update a dedicated regression test for program switching. Run the relevant tests before presenting the patch.

At minimum report:
- exact root cause(s),
- files changed,
- why each change is necessary,
- tests run and pass/fail results,
- any remaining risk.

## Output format for ChatGPT handoff
Do not just say “fixed”. Return:
1. concise diagnosis,
2. unified diff or full contents of every changed file,
3. test commands and outputs/results,
4. any files that should be deleted/disabled from `index.html`, if applicable.

ChatGPT will review your patch and then apply it to GitHub/Vercel. Do not assume you have permission to merge production.
