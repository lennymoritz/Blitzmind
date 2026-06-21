# BlitzMind — Project Status

_Last updated: handed off from build session._

## What it is

A biometric **adaptive gaming controller** (thesis / portfolio project, targeting an
AMD UX/UI Designer role). It reads physiology — HRV via PPG, grip pressure, motion —
and adapts the game **silently in real time** instead of interrupting the player.

The spine is a research-driven **pivot**: the project began as emotion-coaching, but
30 surveys + 5 interviews showed players reject mid-game alerts ("backseat driver,"
nobody pauses). Stress was reframed from _a problem to fix_ into _a performance signal
to design around_ — producing the principle **"adapt, don't interrupt."**

- **Persona:** HarnitK#7421 — pro esports, tactical FPS ("Crucible Ops"), Diamond II, NA-East
- **Surfaces:** responsive web app · marketing site · hardware breadboard prototype
- **Live:** https://blitzmind.vercel.app · **Repo:** github.com/lennymoritz/Blitzmind
- **Portfolio:** dhruvdeva.com

## Stack

Next.js 16 (App Router) · React 19 · Tailwind 4 (`@theme` tokens) · motion/react · TypeScript.
Fonts: Fraunces (display), Inter Tight (body), Geist Mono (data). Tokens are CSS vars in
`src/app/globals.css` (`--color-app-bg`, `--color-app-surface`, `--color-app-accent` #ff3344,
`--color-app-action` #4a90ff, `--color-calm` #6ee7b7); utility classes `.glass-card` / `.glass-panel`.
Deploys on Vercel via `git push` (no env vars, no DB — data mocked). Build target: 22/22 static pages.

## Done

- Controller render with animated sensor markups; onboarding redesign (glass cards + backdrop)
- Dashboard rebuilt as a gamer launcher; then: calm gauge removed, game-cover art added,
  Launch -> Live / Options -> Adaptive links, Performance insight collapsed to one clickable
  trends card, status bar converted to four cards (Controller / Vitals / Rank / This week)
- Full responsive pass: sidebar -> mobile drawer + hamburger bar, responsive header/padding,
  recent-matches reflow, marketing mobile menu, viewport meta
- Marketing motion (reveal, parallax, nav); footer link -> dhruvdeva.com
- Nine standalone case-study assets: pivot map, research synthesis, decision log, before/after,
  journey map, hardware bridge, component anatomy, design system, UX flow

## What's left

### Ship the code (do first)
- [ ] Apply `blitzmind-changes.zip` to the repo (overwrite; includes `public/games/`)
- [ ] `npm run build` -> confirm 22/22, then commit + push -> Vercel rebuild

### Adaptive preview (DONE — integrated this session)
- [x] `AdaptivePreviewLauncher` wired into the Adaptive Control header (every tab) — a
      4-step modal demo (brightness -> HUD declutter -> overlay -> map restriction).
      Replaces the old Save -> fullscreen plan.
- [x] Media integrated as `public/adaptive-*.mp4` / `*.jpg`; theme blended to neutral
      slate (added `--color-app-text/-mute/-dim`, `--color-app-border/-strong` tokens).
- [ ] **Decide the MW2-footage IP question** — the brightness/HUD/overlay clips are real
      Modern Warfare 2 footage. Relabel as mechanic-only demo (add one disclaimer line),
      or recapture original / Crucible Ops footage at the same filenames before publishing.

### Case study (finishing was deliberately paused)
- [ ] Sequence the 9 assets into the narrative and publish to dhruvdeva.com
- [ ] Swap schematic before/after thumbnails for **real app screenshots** (desktop + mobile)
- [ ] Add a real photo of the breadboard rig to the hardware bridge
- [ ] (Optional) Render assets as editable Figma frames for an editable source

### Polish (open from earlier — verify current status)
- [ ] Reduced-motion fallbacks for TweenedNumber and StaggerChildren
- [ ] Sessions empty-state redesign (SVG illustration + filter-aware copy)
- [ ] Aggregate stat-cards density pick — likely superseded by the new status cards; **verify**

### Horizon
- [ ] Higgsfield brand imagery set (iterate hero shot first, then the rest)
- [ ] Finalize BlitzMind resume bullets

## Honesty flags (carry forward)

- **MW2 footage:** source clips are real Modern Warfare 2; the project otherwise uses the
  fictional "Crucible Ops" to avoid real-game IP. Resolve before publishing.
- **Metrics:** keep any reaction-time / HRV figures illustrative. Published assets deliberately
  use only the real research numbers (30 surveys / 5 interviews / 4 usability tests) and the
  calm-vs-outcome data — nothing fabricated.

## Working rhythm

Edit in repo -> `npm run build` (verify 22/22, TS clean, no warnings) -> standalone HTML
preview -> package changed files preserving repo paths into `blitzmind-changes.zip` ->
deliver preview + zip. Deploy = `git push` (Vercel auto-rebuilds; ~1–2 min).
