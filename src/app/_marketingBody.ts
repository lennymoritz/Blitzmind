// v5 marketing body — kept as a string and rendered via dangerouslySetInnerHTML.
// CSS is in marketing.css. JS lives in page.tsx useEffect.
// To regenerate: copy body content of blitzmind-marketing-v5.html between <body> and <script>.
const marketingBody = String.raw`
<!-- ============================ NAV ============================ -->
<nav class="nav">
  <div class="nav-inner">
    <a href="#top" class="brand">BlitzMind<span class="brand-dot">.</span></a>
    <div class="nav-links">
      <a href="#problem">Problem</a>
      <a href="#system">System</a>
      <a href="#inside">Inside the app</a>
      <a href="#gallery">See it adapt</a>
      <a href="#hardware">Hardware</a>
      <a href="#story">Story</a>
    </div>
    <a href="/onboarding" class="nav-cta">
      Open app
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
    </a>
  </div>
</nav>

<!-- ============================ HERO ============================ -->
<section class="hero" id="top">
  <!-- Trailer plays muted/loop behind everything -->
  <video class="hero-bg-video" autoplay muted loop playsinline preload="auto"
         poster="/marketing/blitzmind-trailer-poster.jpg">
    <source src="/marketing/blitzmind-trailer.mp4" type="video/mp4">
  </video>

  <svg class="hero-burst burst" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="white">
    <g transform="translate(50 50)">
      <path d="M 0 -48 L 6 -10 L 0 0 L -6 -10 Z" transform="rotate(0)"/>
      <path d="M 0 -48 L 6 -10 L 0 0 L -6 -10 Z" transform="rotate(45)"/>
      <path d="M 0 -48 L 6 -10 L 0 0 L -6 -10 Z" transform="rotate(90)"/>
      <path d="M 0 -48 L 6 -10 L 0 0 L -6 -10 Z" transform="rotate(135)"/>
      <path d="M 0 -48 L 6 -10 L 0 0 L -6 -10 Z" transform="rotate(180)"/>
      <path d="M 0 -48 L 6 -10 L 0 0 L -6 -10 Z" transform="rotate(225)"/>
      <path d="M 0 -48 L 6 -10 L 0 0 L -6 -10 Z" transform="rotate(270)"/>
      <path d="M 0 -48 L 6 -10 L 0 0 L -6 -10 Z" transform="rotate(315)"/>
    </g>
  </svg>

  <div class="hero-grid">
    <div class="reveal">
      <div class="hero-eyebrow">
        <span class="live-dot"></span>
        Adaptive Controller · Thesis project
      </div>
      <h1 class="display hero-title">
        A controller<br>
        that <em>knows</em><br>
        you're tilted —<br>
        before you do.
      </h1>
      <p class="hero-sub">
        BlitzMind reads your physiology in real time and adapts the game around you. Not to interrupt. To keep you competitive when your body starts working against you.
      </p>
      <div class="hero-actions">
        <button class="btn btn-primary" onclick="openTrailer()">
          <span class="play-icon"></span>
          Watch the trailer
        </button>
        <a href="/onboarding" class="btn btn-secondary">
          Open the app
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </a>
      </div>
    </div>

    <div class="vitals reveal" style="transition-delay: .1s">
      <div class="vitals-header">
        <div class="vitals-handle">
          <div class="vitals-avatar">HK</div>
          <div class="vitals-handle-text">
            HarnitK#7421
            <small>Diamond II · NA-East</small>
          </div>
        </div>
        <div class="vitals-live">
          <span class="live-dot"></span>
          Live
        </div>
      </div>
      <div class="vitals-grid">
        <div class="vital">
          <div class="vital-label">HRV</div>
          <div class="vital-value num" data-tween="hrv" data-min="68" data-max="78" data-suffix="ms">72<span class="unit">ms</span></div>
          <div class="vital-trend">stable</div>
          <svg class="vital-spark" viewBox="0 0 60 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M 0 16 L 8 14 L 16 18 L 24 8 L 32 12 L 40 6 L 48 10 L 60 8" stroke="rgba(110,231,183,0.6)"/>
          </svg>
        </div>
        <div class="vital">
          <div class="vital-label">Engagement</div>
          <div class="vital-value num" data-tween="engagement" data-min="74" data-max="82" data-suffix="%">78<span class="unit">%</span></div>
          <div class="vital-trend">peak focus</div>
          <svg class="vital-spark" viewBox="0 0 60 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M 0 20 L 8 18 L 16 14 L 24 12 L 32 8 L 40 6 L 48 4 L 60 4" stroke="rgba(74,144,255,0.6)"/>
          </svg>
        </div>
        <div class="vital">
          <div class="vital-label">Grip</div>
          <div class="vital-value num" data-tween="grip" data-min="80" data-max="88" data-suffix="%">84<span class="unit">%</span></div>
          <div class="vital-trend">consistent</div>
          <svg class="vital-spark" viewBox="0 0 60 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M 0 12 L 8 14 L 16 10 L 24 12 L 32 14 L 40 10 L 48 12 L 60 10" stroke="rgba(245,245,247,0.5)"/>
          </svg>
        </div>
        <div class="vital is-stress">
          <div class="vital-label">Calm Score</div>
          <div class="vital-value num" data-tween="calm-hero" data-min="58" data-max="70" data-suffix="%">64<span class="unit">%</span></div>
          <div class="vital-trend">↓ Gulag fight</div>
          <svg class="vital-spark" viewBox="0 0 60 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M 0 8 L 8 6 L 16 10 L 24 14 L 32 18 L 40 16 L 48 14 L 60 12" stroke="rgba(255,51,68,0.7)"/>
          </svg>
        </div>
      </div>
      <div class="vitals-footer">
        <span>Updating</span>
        <div class="calm-bar"><div class="calm-bar-fill" id="hero-calm-bar"></div></div>
        <span class="num-body" id="hero-calm-display">78%</span>
      </div>
    </div>
  </div>
</section>

<!-- (no marquee strip — removed per feedback) -->

<!-- ============================ PROBLEM ============================ -->
<section class="problem" id="problem">
  <div class="container">
    <div class="problem-grid">
      <div class="reveal">
        <div class="sec-head">
          <span class="sec-num">01</span>
          <span class="sec-eyebrow">The problem</span>
        </div>
        <h2 class="display sec-title">
          Your hands sweat.<br>
          Your grip tightens.<br>
          Your aim drifts.<br>
          <em class="display-italic">And the game has no idea.</em>
        </h2>
        <p class="sec-lede">
          Competitive players already pay the cost of stress — slower reaction time, worse decisions, missed shots. They don't need another wellness app telling them to breathe. They need the game to respond to the body that's playing it.
        </p>
        <div class="problem-stats">
          <div class="stat">
            <div class="stat-label">Reaction time, stressed</div>
            <div class="stat-value num is-stress">260<span style="font-size:18px;color:var(--color-text-mute);">ms</span></div>
            <div class="stat-meta">Best: 210 ms · Worst: 320 ms</div>
          </div>
          <div class="stat">
            <div class="stat-label">HRV drop, late round</div>
            <div class="stat-value num is-stress">−7<span style="font-size:18px;color:var(--color-text-mute);">%</span></div>
            <div class="stat-meta">From session average</div>
          </div>
          <div class="stat">
            <div class="stat-label">Peak stress event</div>
            <div class="stat-value num is-stress">42<span style="font-size:18px;color:var(--color-text-mute);">ms</span></div>
            <div class="stat-meta">During Gulag fight</div>
          </div>
        </div>
      </div>
      <div class="quote-card reveal" style="transition-delay: .15s">
        <div class="quote-mark">"</div>
        <div class="quote-text">
          Stress is impacting my performance — and my personal life. I don't want to pause. I want a tool that helps me play through it.
        </div>
        <div class="quote-attribution">
          <div class="quote-avatar"></div>
          <div>
            <strong>Harnit Khatri</strong>
            Pro esports player · 25–30 hrs/week · Counter-Strike, PUBG
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============================ SYSTEM + ADAPT DEMO ============================ -->
<section class="system" id="system">
  <div class="container">
    <div class="reveal">
      <div class="sec-head">
        <span class="sec-num">02</span>
        <span class="sec-eyebrow">The system</span>
      </div>
      <h2 class="display sec-title">
        Three loops,<br>
        one controller.
      </h2>
    </div>

    <div class="loops reveal">
      <div class="loop">
        <div class="loop-num">Sense</div>
        <div class="loop-name">Read the body</div>
        <h3 class="loop-title">HRV through the grips, sampled continuously.</h3>
        <p class="loop-body">PPG pickup, skin response across the contact surface, grip pressure on every input. All on-device — nothing leaves the controller without you saying so.</p>
      </div>
      <div class="loop">
        <div class="loop-num">Adapt</div>
        <div class="loop-name">Shape the game</div>
        <h3 class="loop-title">When physiology crosses your thresholds, the game responds.</h3>
        <p class="loop-body">Brightness, HUD clutter, loadouts, audio — adjusted to keep you in control of the moment. Set the rule once. It runs in the background.</p>
      </div>
      <div class="loop">
        <div class="loop-num">Analyze</div>
        <div class="loop-name">Learn the patterns</div>
        <h3 class="loop-title">Every session becomes data. Including the bad ones.</h3>
        <p class="loop-body">See where stress hits, which maps cost you, what your peak performance window looks like. Then adjust the thresholds for next session.</p>
      </div>
    </div>

    <!-- INTERACTIVE ADAPT DEMO — video stable, component reacts -->
    <div class="adapt-demo reveal" style="transition-delay: .15s">
      <div class="adapt-controls">
        <div class="adapt-trigger" id="adapt-trigger-label">
          <span>Trigger / 01</span>
          <span class="adapt-trigger-badge" id="adapt-trigger-badge">Standby</span>
        </div>
        <h3 class="display">Drag the threshold.<br>The settings react live.</h3>

        <div class="adapt-current">
          <span class="num adapt-current-val" id="adapt-calm-val">78%</span>
          <span class="adapt-current-lbl" id="adapt-calm-lbl">Calm · live</span>
        </div>

        <div class="adapt-threshold-label">Adapt when calm drops below</div>
        <div class="adapt-threshold-value">
          <span class="num" id="adapt-threshold-val">65</span>
          <span>%</span>
        </div>

        <div class="range-wrap">
          <div class="range-bg"></div>
          <div class="range-fill" id="range-fill" style="width: 64%"></div>
          <input type="range" id="threshold-slider" min="20" max="90" value="65" aria-label="Adaptation threshold" />
        </div>
        <div class="slider-labels">
          <span>20%</span>
          <span>90%</span>
        </div>

        <div class="adapt-effects">
          <div class="adapt-effects-label">Active adaptations</div>

          <div class="effect-row is-on" data-effect="brightness">
            <div class="toggle"></div>
            <span class="effect-key">Brightness</span>
            <div class="effect-state">
              <span class="effect-from">100%</span>
              <span class="effect-arrow">→</span>
              <span class="effect-to">60%</span>
            </div>
          </div>

          <div class="effect-row is-on" data-effect="hud">
            <div class="toggle"></div>
            <span class="effect-key">HUD clutter</span>
            <div class="effect-state">
              <span class="effect-from">Visible</span>
              <span class="effect-arrow">→</span>
              <span class="effect-to">Minimal</span>
            </div>
          </div>

          <div class="effect-row is-on" data-effect="loadout">
            <div class="toggle"></div>
            <span class="effect-key">Loadout</span>
            <div class="effect-state">
              <span class="effect-from">AK-47</span>
              <span class="effect-arrow">→</span>
              <span class="effect-to">M4 · Stable</span>
            </div>
          </div>

          <div class="effect-row is-on" data-effect="audio">
            <div class="toggle"></div>
            <span class="effect-key">Audio</span>
            <div class="effect-state">
              <span class="effect-from">Default mix</span>
              <span class="effect-arrow">→</span>
              <span class="effect-to">Focus mix</span>
            </div>
          </div>
        </div>
      </div>

      <!-- LIVE PREVIEW — single video, never swaps -->
      <div class="preview-wrap">
        <video class="preview-video" id="preview-video"
               src="/marketing/adaptive-overlay-base.mp4"
               poster="/marketing/adaptive-overlay-base-poster.jpg"
               autoplay muted loop playsinline></video>
        <div class="preview-overlay"></div>
        <div class="preview-rail">
          <span class="preview-status" id="preview-status">
            <span class="live-dot"></span>
            <span id="preview-status-text">Standby · calm 78%</span>
          </span>
          <span class="preview-hrv">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h3l2-6 4 12 2-6 3 0"/></svg>
            <span id="preview-bpm">89</span> BPM
          </span>
        </div>
        <div class="preview-bottom">
          <div class="preview-loadout">
            <div class="preview-loadout-label">Loadout</div>
            <div class="preview-loadout-name" id="preview-loadout">AK-47 · Standard</div>
          </div>
          <div class="preview-ammo">53<small>/210</small></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============================ ANALYZE ============================ -->
<section class="analyze" id="analyze">
  <div class="container">
    <div class="reveal">
      <div class="sec-head">
        <span class="sec-num">03</span>
        <span class="sec-eyebrow">Analyze · Post-session</span>
      </div>
      <h2 class="display sec-title">
        Every match becomes data.<br>
        <em class="display-italic">Including the bad ones.</em>
      </h2>
    </div>

    <div class="analyze-grid">
      <div class="session-readout reveal">
        <div class="readout-header">
          <div>
            <div style="font-size: 11px; color: var(--color-text-dim); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px;">Session · 12.04.26</div>
            <h4>Warzone · Ranked</h4>
          </div>
          <div style="font-size: 13px; color: var(--color-text-mute);">30:14 played</div>
        </div>
        <div class="readout-metric-row">
          <div class="readout-metric">
            <div class="readout-metric-label">Avg HRV</div>
            <div class="readout-metric-value num">64<span style="font-size:14px;color:var(--color-text-mute);"> ms</span></div>
            <div class="readout-metric-meta">−7% vs. last session</div>
          </div>
          <div class="readout-metric is-warn">
            <div class="readout-metric-label">Peak stress</div>
            <div class="readout-metric-value num">42<span style="font-size:14px;color:var(--color-text-mute);"> ms</span></div>
            <div class="readout-metric-meta">t+20m · Gulag fight</div>
          </div>
          <div class="readout-metric">
            <div class="readout-metric-label">Recovery</div>
            <div class="readout-metric-value num">2:14</div>
            <div class="readout-metric-meta">back to baseline</div>
          </div>
          <div class="readout-metric">
            <div class="readout-metric-label">Calm score</div>
            <div class="readout-metric-value num">68<span style="font-size:14px;color:var(--color-text-mute);">%</span></div>
            <div class="readout-metric-meta">−4% below forecast</div>
          </div>
        </div>
        <div class="readout-takeaway">
          <div class="takeaway-label">The takeaway</div>
          <div class="takeaway-text">
            Your reaction time was <strong>22% slower</strong> during the stress spike at t+20m. Same map, same opponent type — but your body told the story before the scoreboard did.
          </div>
        </div>
      </div>
      <div class="calm-curve reveal" style="transition-delay: .15s">
        <h5>Calm score · 30 min match · <span class="event">stress event</span></h5>
        <svg class="curve-svg" viewBox="0 0 400 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g stroke="rgba(255,255,255,0.05)" stroke-width="1">
            <line x1="0" y1="40" x2="400" y2="40"/>
            <line x1="0" y1="80" x2="400" y2="80"/>
            <line x1="0" y1="120" x2="400" y2="120"/>
          </g>
          <rect x="240" y="0" width="60" height="160" fill="rgba(255,51,68,0.06)"/>
          <path d="M 0 60 Q 40 50, 80 55 T 160 45 Q 200 40, 240 50 T 270 130 T 310 90 Q 340 80, 400 75" stroke="rgba(110,231,183,0.7)" stroke-width="2" fill="none"/>
          <circle cx="265" cy="125" r="4" fill="#ff3344"/>
          <circle cx="265" cy="125" r="10" fill="rgba(255,51,68,0.2)"/>
          <text x="0" y="155" fill="rgba(255,255,255,0.4)" font-family="Inter Tight" font-size="10">t+0m</text>
          <text x="190" y="155" fill="rgba(255,255,255,0.4)" font-family="Inter Tight" font-size="10">t+15m</text>
          <text x="370" y="155" fill="rgba(255,255,255,0.4)" font-family="Inter Tight" font-size="10">t+30m</text>
          <text x="0" y="44" fill="rgba(255,255,255,0.3)" font-family="Inter Tight" font-size="9">100</text>
          <text x="0" y="84" fill="rgba(255,255,255,0.3)" font-family="Inter Tight" font-size="9">60</text>
          <text x="0" y="124" fill="rgba(255,255,255,0.3)" font-family="Inter Tight" font-size="9">20</text>
        </svg>
        <div class="curve-events">
          <div class="curve-event">
            <span class="curve-event-time">t+12m</span>
            <div class="curve-event-text"><strong>Warmup peak</strong><span>Reaction time best of the session</span></div>
          </div>
          <div class="curve-event">
            <span class="curve-event-time">t+20m</span>
            <div class="curve-event-text"><strong>Gulag fight</strong><span>HRV crashed 30% in 90 seconds</span></div>
          </div>
          <div class="curve-event">
            <span class="curve-event-time">t+27m</span>
            <div class="curve-event-text"><strong>Final circle</strong><span>Stress event during decisive engagement</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============================ INSIDE THE APP — moved up, new lineup ============================ -->
<section class="inside-app" id="inside">
  <div class="container">
    <div class="reveal">
      <div class="sec-head">
        <span class="sec-num">04</span>
        <span class="sec-eyebrow">Inside the app</span>
      </div>
      <h2 class="display sec-title">
        Configure once.<br>
        <em class="display-italic">See the whole picture.</em>
      </h2>
      <p class="sec-lede">
        The companion app is where you onboard, set thresholds, watch sessions play back, and tune which adaptations fire when. Seven screens from the live build — drag through them.
      </p>
    </div>

    <div class="app-slider-wrap reveal">
      <div class="app-slider" id="app-slider">

        <!-- 01: Onboarding · Welcome -->
        <div class="app-slide" data-step="01">
          <div class="app-slide-shot"><img src="/marketing/app-onboarding-welcome.png" alt="Onboarding — welcome" loading="lazy" /></div>
          <div class="app-slide-meta">
            <div>
              <div class="app-slide-label">Onboarding · Step 1</div>
              <div class="app-slide-name">Read your body.</div>
              <div class="app-slide-desc">Sense, Adapt, Analyze — the three loops introduced before you connect anything. Two minutes from here to your first session.</div>
            </div>
            <div class="app-slide-step"><strong>01</strong>Setup intro</div>
          </div>
        </div>

        <!-- 02: Onboarding · Pair -->
        <div class="app-slide" data-step="02">
          <div class="app-slide-shot"><img src="/marketing/app-onboarding-pair.png" alt="Onboarding — pair controller" loading="lazy" /></div>
          <div class="app-slide-meta">
            <div>
              <div class="app-slide-label">Onboarding · Step 2</div>
              <div class="app-slide-name">Pair the sensor.</div>
              <div class="app-slide-desc">Power the controller on, hold it within 3 meters. BLE handshake, calibration ready. No app-store nonsense.</div>
            </div>
            <div class="app-slide-step"><strong>02</strong>Sensor pairing</div>
          </div>
        </div>

        <!-- 03: Onboarding · Calibrate -->
        <div class="app-slide" data-step="03">
          <div class="app-slide-shot"><img src="/marketing/app-onboarding-calibrate.png" alt="Onboarding — calibrate baseline" loading="lazy" /></div>
          <div class="app-slide-meta">
            <div>
              <div class="app-slide-label">Onboarding · Step 3</div>
              <div class="app-slide-name">Hold and breathe.</div>
              <div class="app-slide-desc">15 seconds of resting HRV capture. This becomes the baseline every future metric is measured against — yours alone, not a population average.</div>
            </div>
            <div class="app-slide-step"><strong>03</strong>Baseline capture</div>
          </div>
        </div>

        <!-- 04: Onboarding · Preferences -->
        <div class="app-slide" data-step="04">
          <div class="app-slide-shot"><img src="/marketing/app-onboarding-preferences.png" alt="Onboarding — preferences" loading="lazy" /></div>
          <div class="app-slide-meta">
            <div>
              <div class="app-slide-label">Onboarding · Step 4</div>
              <div class="app-slide-name">Set the defaults.</div>
              <div class="app-slide-desc">Primary game, adaptation aggressiveness, training vs. tournament. Everything here is editable later — this is just the starting point.</div>
            </div>
            <div class="app-slide-step"><strong>04</strong>Defaults</div>
          </div>
        </div>

        <!-- 05: Home -->
        <div class="app-slide" data-step="05">
          <div class="app-slide-shot"><img src="/marketing/app-dashboard.png" alt="BlitzMind dashboard" loading="lazy" /></div>
          <div class="app-slide-meta">
            <div>
              <div class="app-slide-label">Home</div>
              <div class="app-slide-name">The dashboard.</div>
              <div class="app-slide-desc">Controller status, vitals, rank, weekly trend, last-session takeaway, recommended action. Everything you check before a session.</div>
            </div>
            <div class="app-slide-step"><strong>05</strong>App home</div>
          </div>
        </div>

        <!-- 06: Adaptive Control (cropped — canvas preview region removed) -->
        <div class="app-slide" data-step="06">
          <div class="app-slide-shot is-contain"><img src="/marketing/app-adaptive-control.png" alt="Adaptive Control panel" loading="lazy" /></div>
          <div class="app-slide-meta">
            <div>
              <div class="app-slide-label">Adaptive Control</div>
              <div class="app-slide-name">Tune the response.</div>
              <div class="app-slide-desc">Per-adaptation triggers, thresholds, visual changes, overlays. Live preview shows what each setting looks like in-game before you save.</div>
            </div>
            <div class="app-slide-step"><strong>06</strong>Configuration</div>
          </div>
        </div>

        <!-- 07: Insights -->
        <div class="app-slide" data-step="07">
          <div class="app-slide-shot"><img src="/marketing/app-insights.png" alt="BlitzMind insights" loading="lazy" /></div>
          <div class="app-slide-meta">
            <div>
              <div class="app-slide-label">Insights</div>
              <div class="app-slide-name">Find your peak window.</div>
              <div class="app-slide-desc">Cross-session pattern analysis. Where your HRV holds up, which maps cost you, how accuracy degrades under stress — and the days and hours when you actually perform best.</div>
            </div>
            <div class="app-slide-step"><strong>07</strong>Pattern analysis</div>
          </div>
        </div>
      </div>

      <div class="app-slider-controls">
        <div class="app-dots" id="app-dots">
          <button class="app-dot is-active" data-index="0" aria-label="Slide 1"></button>
          <button class="app-dot" data-index="1" aria-label="Slide 2"></button>
          <button class="app-dot" data-index="2" aria-label="Slide 3"></button>
          <button class="app-dot" data-index="3" aria-label="Slide 4"></button>
          <button class="app-dot" data-index="4" aria-label="Slide 5"></button>
          <button class="app-dot" data-index="5" aria-label="Slide 6"></button>
          <button class="app-dot" data-index="6" aria-label="Slide 7"></button>
        </div>
        <div class="app-arrows">
          <button class="app-arrow" id="app-prev" aria-label="Previous slide">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button class="app-arrow" id="app-next" aria-label="Next slide">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============================ SEE IT ADAPT — now after Inside the app ============================ -->
<section class="gallery" id="gallery">
  <div class="container">
    <div class="reveal">
      <div class="sec-head">
        <span class="sec-num">05</span>
        <span class="sec-eyebrow">See it adapt</span>
      </div>
      <h2 class="display sec-title">
        Three adaptations.<br>
        <em class="display-italic">Real gameplay.</em>
      </h2>
      <p class="sec-lede">Recorded during ranked Warzone matches. Each clip shows the trigger condition firing and the in-game response. No demo footage — this is what actually happens when your physiology crosses the threshold.</p>
    </div>

    <div class="gallery-grid reveal">
      <div class="gallery-item" data-video="/marketing/adaptive-overlay-base.mp4">
        <div class="gallery-video-wrap">
          <video src="/marketing/adaptive-overlay-base.mp4" poster="/marketing/adaptive-overlay-base-poster.jpg" muted loop playsinline preload="metadata"></video>
          <div class="gallery-overlay"></div>
          <span class="gallery-badge">Trigger · Calm 65%</span>
        </div>
        <div class="gallery-meta">
          <div class="gallery-trigger">Baseline overlay</div>
          <div class="gallery-name">The slim rail.</div>
          <div class="gallery-desc">Live HRV, adaptive toggles, real-time calm score — anchored to the screen edge. Stays out of your sightline until it doesn't have to.</div>
        </div>
      </div>

      <div class="gallery-item" data-video="/marketing/adaptive-hud-declutter.mp4">
        <div class="gallery-video-wrap">
          <video src="/marketing/adaptive-hud-declutter.mp4" poster="/marketing/adaptive-hud-declutter-poster.jpg" muted loop playsinline preload="metadata"></video>
          <div class="gallery-overlay"></div>
          <span class="gallery-badge">Stress · Brightness ↓</span>
        </div>
        <div class="gallery-meta">
          <div class="gallery-trigger">Visual adaptation</div>
          <div class="gallery-name">Glare cut to focus.</div>
          <div class="gallery-desc">When the stress curve crosses your threshold, the game dims around your sightline. Less retinal noise, more contrast on what matters.</div>
        </div>
      </div>

      <div class="gallery-item" data-video="/marketing/adaptive-brightness.mp4">
        <div class="gallery-video-wrap">
          <video src="/marketing/adaptive-brightness.mp4" poster="/marketing/adaptive-brightness-poster.jpg" muted loop playsinline preload="metadata"></video>
          <div class="gallery-overlay"></div>
          <span class="gallery-badge">Stress · HUD declutter</span>
        </div>
        <div class="gallery-meta">
          <div class="gallery-trigger">Interface adaptation</div>
          <div class="gallery-name">HUD strips back.</div>
          <div class="gallery-desc">Killfeed, secondary objectives, peripheral indicators fade. What's left is ammo, health, and what you're looking at. The game stops talking.</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============================ IN GAME ============================ -->
<section class="ingame" id="in-game">
  <div class="container">
    <div class="reveal">
      <div class="sec-head">
        <span class="sec-num">06</span>
        <span class="sec-eyebrow">In the game</span>
      </div>
      <h2 class="display sec-title">
        The overlay you don't<br>
        have to look at.
      </h2>
      <p class="sec-lede">
        A slim rail on the edge of your screen. Real-time HRV. Adaptive toggles you set once and forget. It stays out of your way until your body asks for help.
      </p>
    </div>

    <div class="ingame-grid">
      <div class="ingame-shot reveal">
        <img src="/marketing/in-game-overlay.png" alt="BlitzMind in-game overlay" loading="lazy" />
      </div>
      <div class="ingame-features reveal" style="transition-delay: .1s">
        <div class="feature">
          <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
          <div>
            <h4>Slim rail · screen-edge</h4>
            <p>Never blocks your sightlines. Designed to be peripheral, not focal.</p>
          </div>
        </div>
        <div class="feature">
          <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          <div>
            <h4>Live HRV</h4>
            <p>Read through the grip, continuously. No wearables, no extra hardware — the controller already touches your skin.</p>
          </div>
        </div>
        <div class="feature">
          <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/><path d="M12 6v6l4 2"/></svg>
          <div>
            <h4>Set once, forget</h4>
            <p>Configure your thresholds before the match. The toggles do the work during it. You stay in the game.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============================ HARDWARE ============================ -->
<section class="hardware" id="hardware">
  <div class="container-wide">
    <div class="container reveal" style="padding:0;">
      <div class="sec-head">
        <span class="sec-num">07</span>
        <span class="sec-eyebrow">The hardware</span>
      </div>
      <h2 class="display sec-title">
        Built, not just designed.
      </h2>
      <p class="sec-lede">
        The BlitzMind controller pairs a working sensor stack with a custom industrial design. The grip surface houses HRV pickup, grip-pressure sensing, and skin response — all integrated where your hands already are.
      </p>
    </div>

    <div class="hardware-feature reveal">
      <div class="hardware-components">
        <div class="component-row">
          <span class="component-name">HRV</span>
          <span class="component-detail">AFE4900 — medical-grade PPG</span>
          <span class="component-tag">Sensor</span>
        </div>
        <div class="component-row">
          <span class="component-name">Motion</span>
          <span class="component-detail">Bosch BNO055 IMU</span>
          <span class="component-tag">9-axis</span>
        </div>
        <div class="component-row">
          <span class="component-name">Grip</span>
          <span class="component-detail">FSR strip across each handle</span>
          <span class="component-tag">Force</span>
        </div>
        <div class="component-row">
          <span class="component-name">Compute</span>
          <span class="component-detail">ESP32 + on-device ML inference</span>
          <span class="component-tag">SoC</span>
        </div>
        <div class="component-row">
          <span class="component-name">Link</span>
          <span class="component-detail">Bluetooth Low Energy</span>
          <span class="component-tag">Radio</span>
        </div>
      </div>

      <div class="hardware-carousel" id="hardware-carousel">
        <span class="hardware-label">DV.01</span>
        <span class="hardware-angle" id="hardware-angle">Front</span>

        <div class="hardware-slide is-active" data-angle="Front">
          <img src="/marketing/controller-front.png" alt="BlitzMind controller — front" loading="lazy" />
        </div>
        <div class="hardware-slide" data-angle="Three quarter">
          <img src="/marketing/controller-three-quarter.png" alt="BlitzMind controller — three quarter" loading="lazy" />
        </div>
        <div class="hardware-slide" data-angle="Side">
          <img src="/marketing/controller-side.png" alt="BlitzMind controller — side" loading="lazy" />
        </div>
        <div class="hardware-slide" data-angle="Back">
          <img src="/marketing/controller-back.png" alt="BlitzMind controller — back" loading="lazy" />
        </div>

        <div class="hardware-arrows">
          <button class="hardware-arrow" id="hw-prev" aria-label="Previous angle">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button class="hardware-arrow" id="hw-next" aria-label="Next angle">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>

        <div class="hardware-nav" id="hardware-nav">
          <button class="hardware-nav-dot is-active" data-index="0"><img src="/marketing/controller-front.png" alt="" /></button>
          <button class="hardware-nav-dot" data-index="1"><img src="/marketing/controller-three-quarter.png" alt="" /></button>
          <button class="hardware-nav-dot" data-index="2"><img src="/marketing/controller-side.png" alt="" /></button>
          <button class="hardware-nav-dot" data-index="3"><img src="/marketing/controller-back.png" alt="" /></button>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============================ STORY — tightened ============================ -->
<section class="story" id="story">
  <div class="container-narrow">
    <div class="reveal">
      <div class="sec-head">
        <span class="sec-num">08</span>
        <span class="sec-eyebrow">The story</span>
      </div>
      <h2 class="display sec-title">
        We almost built a wellness app.<br>
        <em class="display-italic">Then we asked the players.</em>
      </h2>
    </div>
    <div class="chapter reveal">
      <div class="chapter-num">01<span>Origin</span></div>
      <div><h3>Born from game rage.</h3></div>
      <div class="chapter-body">
        <p>The first concept warned you when you were getting tilted. Monitors flying, headsets snapped, controllers hurled — we thought the problem was the rage. We put it in front of players. They disagreed.</p>
      </div>
    </div>
    <div class="chapter reveal">
      <div class="chapter-num">02<span>Research</span></div>
      <div><h3>30 surveys. 5 interviews. One verdict.</h3></div>
      <div class="chapter-body">
        <p>Direct stress alerts mid-game felt like a backseat driver. Nobody was willing to pause their gameplay to listen to a tool. Players acknowledged the rage — they just refused to stop playing because of it.</p>
        <div class="chapter-evidence">
          "Biofeedback tools could help manage emotions without distractions — but only if they don't interrupt the game."
          <small>— Harnit Khatri, pro esports player</small>
        </div>
      </div>
    </div>
    <div class="chapter reveal">
      <div class="chapter-num">03<span>Pivot</span></div>
      <div><h3>From feedback<br>to mechanics.</h3></div>
      <div class="chapter-body">
        <p>We stopped trying to fix the player. We started adapting the game. Stress became a performance signal — input to a system that adjusted around the player rather than against them. The wellness app died. The adaptive controller began.</p>
      </div>
    </div>
  </div>
</section>

<!-- ============================ CTA ============================ -->
<section class="cta">
  <svg class="cta-burst" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="white">
    <g transform="translate(50 50)">
      <path d="M 0 -48 L 6 -10 L 0 0 L -6 -10 Z" transform="rotate(0)"/>
      <path d="M 0 -48 L 6 -10 L 0 0 L -6 -10 Z" transform="rotate(45)"/>
      <path d="M 0 -48 L 6 -10 L 0 0 L -6 -10 Z" transform="rotate(90)"/>
      <path d="M 0 -48 L 6 -10 L 0 0 L -6 -10 Z" transform="rotate(135)"/>
      <path d="M 0 -48 L 6 -10 L 0 0 L -6 -10 Z" transform="rotate(180)"/>
      <path d="M 0 -48 L 6 -10 L 0 0 L -6 -10 Z" transform="rotate(225)"/>
      <path d="M 0 -48 L 6 -10 L 0 0 L -6 -10 Z" transform="rotate(270)"/>
      <path d="M 0 -48 L 6 -10 L 0 0 L -6 -10 Z" transform="rotate(315)"/>
    </g>
  </svg>
  <div class="container-narrow reveal">
    <h2 class="display cta-title">
      Open the app.<br>
      <em class="display-italic">See your body play.</em>
    </h2>
    <p class="cta-sub">
      The BlitzMind companion app runs the live demo, the session readouts, and every adaptation in the system. No controller required to look around.
    </p>
    <div class="cta-actions">
      <a href="/onboarding" class="btn btn-primary">
        Open the app
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
      </a>
      <button class="btn btn-secondary" onclick="openTrailer()">
        <span class="play-icon"></span>
        Watch the trailer
      </button>
    </div>
  </div>
</section>

<!-- ============================ FOOTER ============================ -->
<footer>
  <div class="footer-inner">
    <div>
      <div class="brand" style="margin-bottom: 4px;">BlitzMind<span class="brand-dot">.</span></div>
      <small style="color: var(--color-text-dim);">A thesis project by Dhruv Deva · © 2026 · Concept project</small>
    </div>
    <div class="footer-links">
      <a href="mailto:hello@blitzmind.example">hello@blitzmind.example</a>
      <a href="https://dhruvdeva.com">Portfolio →</a>
    </div>
  </div>
</footer>

<!-- ============================ TRAILER MODAL — native video now ============================ -->
<div class="modal" id="trailer-modal" onclick="closeTrailer(event)">
  <button class="modal-close" onclick="closeTrailer()" aria-label="Close trailer">×</button>
  <div class="modal-frame" onclick="event.stopPropagation()">
    <video id="trailer-video" controls playsinline preload="metadata"
           poster="/marketing/blitzmind-trailer-poster.jpg">
      <source src="/marketing/blitzmind-trailer.mp4" type="video/mp4">
    </video>
  </div>
</div>

`;
export default marketingBody;
