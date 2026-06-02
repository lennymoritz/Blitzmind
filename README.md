# BlitzMind

> The adaptive gaming controller that reads your physiology and adjusts your
> game in real time — so you stay competitive instead of getting interrupted.

A portfolio build for Dhruv Deva's adaptive gaming controller thesis project.
Both the marketing site (`/`) and the full product app (`/app/*`) are
prototyped here as one shipping Next.js application. The app is interactive —
HRV charts draw live, settings respond instantly, stress events fire on
schedule during the live-match demo.

## What's in here

This isn't a static portfolio piece — every screen has working state:

**Marketing site** (`/`)
- Hero with animated calm gauge that responds to fake biometric drift
- Interactive Adapt widget — drag the stress slider, watch the gameplay
  scene react (HUD hides, brightness dims, audio cue triggers)
- Analyze widget — post-match HRV chart with annotated stress events
- Stress-spike scroll effect (sessionStorage-gated, fires once per visit)

**The app** (`/app/*`, 13 screens total)
- Onboarding (4 steps: Welcome → Pair sensor → Calibrate baseline → Preferences)
- Home dashboard — live state strip, weekly performance, "Skip ranked"
  recommendation card
- **Live Match** — real-time HRV chart drawing for 3 simulated minutes with
  programmed stress dips, toast notifications, adaptive system firings, calm
  gauge that fills on mount
- **Sessions list** + match detail report — match history with ambient calm
  traces behind every row, drill-down into full match analytics with stress
  events annotated on the HRV timeline
- **Adaptive Control** — 5 sub-tabs (Video, Weapons, Maps, Audio, Controller)
  each with trigger configuration and a live preview that responds to settings
- **Insights** — 7×24 performance heatmap, map stress ranking, weapon class
  degradation chart, week-over-week trend
- Library — modes, maps, weapons reference
- Settings — profile, sensor, Tournament Mode (the integrity feature),
  integrations, data export

## Tech

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **Tailwind CSS 4** with design tokens defined in `globals.css`
- **Motion** (the library formerly known as Framer Motion) for shared-layout
  animations on sidebar/tab indicators and gauge fills
- **TypeScript** throughout
- Fonts: Fraunces (display), Inter Tight (body), Geist Mono (numeric/labels)

No backend, no database, no external API calls. Everything is statically
prerendered except the dynamic `/app/sessions/[id]` route which is server-rendered
on demand. All "live" biometric data is design fiction — slow random walks
biased toward base values.

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

Or build for production:

```bash
npm run build
npm run start        # serves the prerendered build
```

## Deploy

See `DEPLOY.md` for a step-by-step Vercel deploy walkthrough.
Short version: push to GitHub, import the repo at vercel.com, no config needed.

## Structure

```
src/
├── app/
│   ├── layout.tsx              # Font loading, root document
│   ├── page.tsx                # Marketing site (composes all sections)
│   ├── globals.css             # Design tokens, animations, slider styles
│   ├── app/                    # The full product app — sidebar-shell layout
│   │   ├── layout.tsx          # Persistent sidebar + content area
│   │   ├── home/               # Dashboard
│   │   ├── live/               # Live Match — the real-time biometric demo
│   │   ├── sessions/           # Match list + dynamic [id] detail report
│   │   ├── adaptive/           # 5 sub-tabs (video/weapons/maps/audio/controller)
│   │   ├── insights/           # Cross-session pattern analysis
│   │   ├── library/            # Modes, maps, weapons reference
│   │   ├── settings/           # Profile, sensor, Tournament Mode
│   │   ├── _components/        # Shared app components (AppHeader, AppSidebar,
│   │   │                       # TweenedNumber, StaggerChildren, etc.)
│   │   └── _lib/mockData.ts    # All canonical mock data — profile, matches,
│   │                           # maps, weapons, modes, aggregates
│   └── onboarding/             # Sidebar-free full-screen flow (welcome, pair,
│                               # calibrate, preferences)
└── components/                 # Marketing-site-only components
    ├── Nav.tsx
    ├── Hero.tsx
    ├── CalmGauge.tsx           # Animated radial gauge
    ├── LiveValue.tsx           # Drifting number ticker (reused in app)
    ├── EcgLine.tsx             # Reusable animated ECG SVG
    ├── AdaptWidget.tsx         # Interactive Adapt demo
    ├── AnalyzeWidget.tsx       # Post-game HRV chart
    ├── InGameFrame.tsx         # Composed gameplay scene
    ├── HardwareRender.tsx      # Annotated SVG controller
    ├── StressSpike.tsx         # Scroll-triggered effect
    └── Sections.tsx            # Non-widget section scaffolding
```

## Design tokens

All theme values live in `src/app/globals.css` under the `@theme` block.
Two palettes coexist: marketing site tokens (warmer, more atmospheric) and
app tokens (denser, more utilitarian) — variables prefixed `--color-app-*`
are for the app surfaces.

To swap the accent color or surface palette, edit there — every component
references the tokens via `var(--color-X)`.

## A note on the data

All session data is fabricated for demonstration. The 7 matches in the Sessions
list each have a deliberate "narrative shape" — Refinery is the come-from-behind
clutch, The Yard is the late-session fatigue spiral, Pier 7 is the peak-window
showcase. The stress events on each match's HRV timeline fire at story-meaningful
positions (first contact, mid-round push, final round) chosen for the match's
game mode.

Same for the Live Match: stress dips fire at 25s, 65s, 110s, and 150s — the
demo is deterministic so you can show it the same way every time.

## Tournament Mode

When toggled on in Settings, BlitzMind only records biometric data — it does
not adapt gameplay. This is the integrity feature for sanctioned competitive
play. Designed in response to the survey insight that 23 of 30 respondents
would reject any product that hard-blocked them from playing what they wanted.

## Research credits

Research notes are embedded throughout the app (look for the "© Research note"
markers). Each notes which source it draws from — Survey (30 respondents),
Interviews (5 participants), Testing (in-school, 12 players), or Pivot (the
shift from emotional feedback to adaptive gameplay).

---

Built with Claude. Source: BlitzMind thesis project by Dhruv Deva.
