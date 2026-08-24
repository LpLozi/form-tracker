# FT test suites

Headless-Chromium tests (Playwright) run against the app served statically.

```bash
# from the repo root
python3 -m http.server 8842 --bind 127.0.0.1 &
node tests/smoke.js       # workout screen, set-entry flow, exercise picker
node tests/migration.js   # data preservation across reloads (migrateDB + schedule-v2)
node tests/pwa.js         # service worker, precache, offline boot, save persistence
```

All three exit non-zero on failure, so they can be wired into CI.

- **smoke.js** — 39 checks. Render-hook registry, set inputs readonly/inputmode,
  KG→Next→Reps→Next→RIR→complete flow, blank next set, keypad stays open,
  exercise modal populates + search + category filter, permanent swap survives
  reload, every tab renders, no console errors.
- **migration.js** — 19 checks. Seeds a realistic pre-existing formDB with a
  customized program and real history, then verifies nothing is reset across two
  reloads, and that a fresh install still seeds defaults.
- **pwa.js** — 12 checks. SW registration, single versioned cache, precache
  contents, workout save, offline boot from cache, data intact across an
  offline/online cycle.
