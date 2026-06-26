// @ts-nocheck — verbatim port of v5 marketing JS; DOM lookups are guaranteed by the body HTML
// v5 marketing script — runs once on mount inside useEffect.
// openTrailer/closeTrailer are attached to window so the inline
// onclick attributes in the body HTML can find them.
export function initMarketing() {
  // Guard against double-init in dev (React StrictMode mounts twice)
  if ((window as unknown as { __blitzMarketingInit?: boolean }).__blitzMarketingInit) return;
  (window as unknown as { __blitzMarketingInit?: boolean }).__blitzMarketingInit = true;

  // ============================================================
  // TRAILER MODAL — native MP4
  // ============================================================
  const modal = document.getElementById('trailer-modal');
  const trailerVideo = document.getElementById('trailer-video');

  function openTrailer() {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    trailerVideo.currentTime = 0;
    trailerVideo.play().catch(() => {});
  }
  function closeTrailer(e) {
    if (e && e.target !== modal && !e.target.classList?.contains('modal-close')) return;
    trailerVideo.pause();
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeTrailer({target: modal});
  });

  // ============================================================
  // SCROLL REVEAL
  // ============================================================
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
  reveals.forEach(r => io.observe(r));

  // ============================================================
  // SMOOTH TWEEN ANIMATIONS
  // ============================================================
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeInOutSine = t => -(Math.cos(Math.PI * t) - 1) / 2;

  class TweenedValue {
    constructor(el) {
      this.el = el;
      this.min = parseFloat(el.dataset.min);
      this.max = parseFloat(el.dataset.max);
      this.suffix = el.dataset.suffix || '';
      this.current = parseFloat(el.textContent);
      this.target = this.current;
      this.startVal = this.current;
      this.duration = 2400 + Math.random() * 1800;
      this.startTime = performance.now();
      this.pickNewTarget();
    }
    pickNewTarget() {
      this.startVal = this.current;
      this.target = this.min + Math.random() * (this.max - this.min);
      this.duration = 2400 + Math.random() * 1800;
      this.startTime = performance.now();
    }
    update(now) {
      const elapsed = now - this.startTime;
      const t = Math.min(1, elapsed / this.duration);
      const eased = easeInOutSine(t);
      this.current = lerp(this.startVal, this.target, eased);
      this.el.innerHTML = `${Math.round(this.current)}<span class="unit">${this.suffix}</span>`;
      if (t >= 1 && elapsed > this.duration + 400) this.pickNewTarget();
    }
  }
  const tweens = Array.from(document.querySelectorAll('[data-tween]')).map(el => new TweenedValue(el));
  function animateTweens(now) {
    tweens.forEach(t => t.update(now));
    requestAnimationFrame(animateTweens);
  }
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    requestAnimationFrame(animateTweens);
  }

  // ============================================================
  // ADAPT DEMO — VIDEO STAYS STABLE, COMPONENT REACTS
  // ============================================================
  const slider = document.getElementById('threshold-slider');
  const rangeFill = document.getElementById('range-fill');
  const thresholdVal = document.getElementById('adapt-threshold-val');
  const calmVal = document.getElementById('adapt-calm-val');
  const calmLbl = document.getElementById('adapt-calm-lbl');
  const triggerLabel = document.getElementById('adapt-trigger-label');
  const triggerBadge = document.getElementById('adapt-trigger-badge');
  const previewStatus = document.getElementById('preview-status');
  const previewStatusText = document.getElementById('preview-status-text');
  const previewLoadout = document.getElementById('preview-loadout');
  const previewBpm = document.getElementById('preview-bpm');
  const previewWrap = document.querySelector('.preview-wrap');

  let liveCalm = 78;
  let calmTargetVal = 78;
  let calmStartVal = 78;
  let calmTweenStart = performance.now();
  let calmTweenDuration = 3500;

  function calmTweenLoop(now) {
    const t = Math.min(1, (now - calmTweenStart) / calmTweenDuration);
    const eased = easeInOutSine(t);
    liveCalm = lerp(calmStartVal, calmTargetVal, eased);

    calmVal.textContent = `${Math.round(liveCalm)}%`;
    const bpm = Math.round(72 + (100 - liveCalm) * 0.5);
    previewBpm.textContent = bpm;

    updateAdaptState();

    if (t >= 1) {
      calmStartVal = liveCalm;
      const r = Math.random();
      // Bias toward states that actually exercise the demo:
      // - 35% chance: deep stress dip (often crosses critical 50% threshold)
      // - 30% chance: high recovery (definitely above any reasonable threshold)
      // - 35% chance: mid-range
      if (r < 0.35) calmTargetVal = 32 + Math.random() * 18;       // 32-50% range
      else if (r < 0.65) calmTargetVal = 75 + Math.random() * 18;  // 75-93%
      else calmTargetVal = 55 + Math.random() * 20;                // 55-75%
      calmTweenStart = now;
      calmTweenDuration = 2800 + Math.random() * 2000;
    }
    requestAnimationFrame(calmTweenLoop);
  }

  function updateAdaptState() {
    const threshold = parseInt(slider.value);
    const firing = liveCalm < threshold;

    // Trigger label
    triggerLabel.classList.toggle('is-firing', firing);
    triggerBadge.textContent = firing ? 'ADAPTING' : 'Standby';

    // Calm display color
    calmVal.classList.toggle('is-low', firing);
    calmLbl.classList.toggle('is-low', firing);

    // Effect rows — each "on" effect goes into firing state when threshold fires
    document.querySelectorAll('.effect-row').forEach(row => {
      const on = row.classList.contains('is-on');
      row.classList.toggle('is-firing', firing && on);
    });

    // Preview overlay status text
    previewStatus.classList.toggle('is-firing', firing);
    previewStatusText.textContent = firing
      ? `Adapting · calm ${Math.round(liveCalm)}%`
      : `Standby · calm ${Math.round(liveCalm)}%`;

    // === REAL VISUAL EFFECTS ON THE PREVIEW ===
    // Each is gated on (toggle ON) AND (threshold firing). Video file never swaps —
    // CSS filters and overlay opacities do the work.

    const brightnessOn = document.querySelector('[data-effect="brightness"]').classList.contains('is-on');
    const hudOn = document.querySelector('[data-effect="hud"]').classList.contains('is-on');
    const loadoutOn = document.querySelector('[data-effect="loadout"]').classList.contains('is-on');

    // Brightness adaptation → CSS filter darkens the same video
    previewWrap.classList.toggle('is-brightness', firing && brightnessOn);

    // HUD declutter → BPM + Loadout overlay elements fade out (ammo stays)
    previewWrap.classList.toggle('is-hud-hide', firing && hudOn);

    // Critical info highlight → fires automatically when calm < 50%,
    // independent of toggles. Ammo turns red and pulses.
    previewWrap.classList.toggle('is-critical', liveCalm < 50);

    // Loadout name swap — only when loadout toggle is on AND firing
    if (firing && loadoutOn) {
      previewLoadout.textContent = 'M4 · Stable';
      previewLoadout.classList.add('is-changed');
    } else {
      previewLoadout.textContent = 'AK-47 · Standard';
      previewLoadout.classList.remove('is-changed');
    }
  }

  function updateSlider() {
    const val = parseInt(slider.value);
    const min = parseInt(slider.min);
    const max = parseInt(slider.max);
    const pct = ((val - min) / (max - min)) * 100;
    rangeFill.style.width = `${pct}%`;
    thresholdVal.textContent = val;
    updateAdaptState();
  }
  slider.addEventListener('input', updateSlider);
  updateSlider();

  document.querySelectorAll('.effect-row').forEach(row => {
    row.addEventListener('click', () => {
      row.classList.toggle('is-on');
      row.classList.toggle('is-off', !row.classList.contains('is-on'));
      updateAdaptState();
    });
  });

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    requestAnimationFrame(calmTweenLoop);
  }

  // ============================================================
  // HERO CALM BAR
  // ============================================================
  const heroCalmBar = document.getElementById('hero-calm-bar');
  const heroCalmDisplay = document.getElementById('hero-calm-display');
  let heroCalmCurrent = 78, heroCalmTarget = 78, heroCalmStart = 78;
  let heroCalmTime = performance.now(), heroCalmDur = 3000;
  function heroCalmLoop(now) {
    const t = Math.min(1, (now - heroCalmTime) / heroCalmDur);
    const eased = easeInOutSine(t);
    heroCalmCurrent = lerp(heroCalmStart, heroCalmTarget, eased);
    heroCalmBar.style.width = `${heroCalmCurrent}%`;
    heroCalmDisplay.textContent = `${Math.round(heroCalmCurrent)}%`;
    if (t >= 1 && now - heroCalmTime > heroCalmDur + 600) {
      heroCalmStart = heroCalmCurrent;
      heroCalmTarget = 65 + Math.random() * 20;
      heroCalmTime = now;
      heroCalmDur = 2800 + Math.random() * 2000;
    }
    requestAnimationFrame(heroCalmLoop);
  }
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    requestAnimationFrame(heroCalmLoop);
  }

  // ============================================================
  // HARDWARE CAROUSEL — bigger, with prev/next arrows
  // ============================================================
  const hwSlides = document.querySelectorAll('.hardware-slide');
  const hwNavDots = document.querySelectorAll('.hardware-nav-dot');
  const hwAngle = document.getElementById('hardware-angle');
  const hwPrev = document.getElementById('hw-prev');
  const hwNext = document.getElementById('hw-next');
  let hwCurrent = 0;

  function hwShow(i) {
    hwCurrent = (i + hwSlides.length) % hwSlides.length;
    hwSlides.forEach((s, idx) => s.classList.toggle('is-active', idx === hwCurrent));
    hwNavDots.forEach((d, idx) => d.classList.toggle('is-active', idx === hwCurrent));
    hwAngle.textContent = hwSlides[hwCurrent].dataset.angle;
  }
  hwNavDots.forEach(dot => {
    dot.addEventListener('click', () => hwShow(parseInt(dot.dataset.index)));
  });
  hwPrev.addEventListener('click', () => hwShow(hwCurrent - 1));
  hwNext.addEventListener('click', () => hwShow(hwCurrent + 1));

  // Optional auto-cycle on first viewport entry
  let hwAutoTimer = null;
  const hwIo = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !hwAutoTimer) {
        hwAutoTimer = setInterval(() => hwShow(hwCurrent + 1), 4500);
      } else if (!e.isIntersecting && hwAutoTimer) {
        clearInterval(hwAutoTimer);
        hwAutoTimer = null;
      }
    });
  }, { threshold: 0.3 });
  hwIo.observe(document.getElementById('hardware-carousel'));
  // Pause auto-rotate on user interaction
  ['click'].forEach(ev => {
    document.getElementById('hardware-carousel').addEventListener(ev, () => {
      if (hwAutoTimer) { clearInterval(hwAutoTimer); hwAutoTimer = null; }
    });
  });

  // ============================================================
  // APP SLIDER — scroll-snap with prev/next + dots
  // ============================================================
  const appSlider = document.getElementById('app-slider');
  const appSlides = appSlider.querySelectorAll('.app-slide');
  const appDots = document.querySelectorAll('.app-dot');
  const appPrev = document.getElementById('app-prev');
  const appNext = document.getElementById('app-next');

  function appGoTo(i) {
    const target = appSlides[i];
    if (!target) return;
    const left = target.offsetLeft - appSlider.offsetLeft - 28;
    appSlider.scrollTo({ left, behavior: 'smooth' });
  }
  appDots.forEach(dot => {
    dot.addEventListener('click', () => appGoTo(parseInt(dot.dataset.index)));
  });

  let appCurrent = 0;
  appPrev.addEventListener('click', () => appGoTo(Math.max(0, appCurrent - 1)));
  appNext.addEventListener('click', () => appGoTo(Math.min(appSlides.length - 1, appCurrent + 1)));

  // Sync dots to scroll position
  const appScrollIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
        const i = Array.from(appSlides).indexOf(entry.target);
        if (i >= 0) {
          appCurrent = i;
          appDots.forEach((d, idx) => d.classList.toggle('is-active', idx === i));
        }
      }
    });
  }, { root: appSlider, threshold: 0.5 });
  appSlides.forEach(s => appScrollIo.observe(s));

  // ============================================================
  // GALLERY — play video on hover, autoplay in view
  // ============================================================
  document.querySelectorAll('.gallery-item').forEach(item => {
    const video = item.querySelector('video');
    if (!video) return;
    item.addEventListener('mouseenter', () => video.play().catch(() => {}));
    item.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
  });

  const galleryVideos = document.querySelectorAll('.gallery-video-wrap video');
  const galleryIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.play().catch(() => {});
      else entry.target.pause();
    });
  }, { threshold: 0.5 });
  galleryVideos.forEach(v => galleryIo.observe(v));


    // Make trailer handlers globally accessible for inline onclick attributes
    (window as unknown as { openTrailer?: () => void; closeTrailer?: (e?: MouseEvent) => void }).openTrailer = openTrailer;
    (window as unknown as { openTrailer?: () => void; closeTrailer?: (e?: MouseEvent) => void }).closeTrailer = closeTrailer;

}
