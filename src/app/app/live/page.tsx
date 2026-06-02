"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { AppHeader, PrimaryButton, SecondaryButton } from "../_components/AppHeader";
import { TweenedNumber } from "../_components/TweenedNumber";
import { profile } from "../_lib/mockData";

type SessionState = "pre" | "live" | "complete";
interface HrvSample { t: number; hrv: number; }
interface StressEvent { id: string; t: number; label: string; hrv: number; }
interface AdaptiveFiring { id: string; t: number; system: "video" | "audio" | "weapons" | "controller"; action: string; expiresAt: number; }

const MATCH_DURATION = 180;
const STRESS_THRESHOLD = 50;

export default function LiveMatchPage() {
  const [state, setState] = useState<SessionState>("pre");
  const [elapsed, setElapsed] = useState(0);
  const [samples, setSamples] = useState<HrvSample[]>([]);
  const [events, setEvents] = useState<StressEvent[]>([]);
  const [firings, setFirings] = useState<AdaptiveFiring[]>([]);
  const [activeToast, setActiveToast] = useState<StressEvent | null>(null);
  const [kills, setKills] = useState(0);
  const [deaths, setDeaths] = useState(0);
  const [score, setScore] = useState(0);
  const startTime = useRef<number>(0);
  const lastStressTime = useRef<number>(-100);
  const stressEventCounter = useRef<number>(0);

  useEffect(() => {
    if (state !== "live") return;
    startTime.current = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      const t = (now - startTime.current) / 1000;
      setElapsed(t);
      const baseline = 68;
      const dips = [
        { at: 25, depth: 22, width: 8 },
        { at: 65, depth: 28, width: 10 },
        { at: 110, depth: 32, width: 12 },
        { at: 150, depth: 35, width: 15 },
      ];
      let stressBias = 0;
      for (const dip of dips) {
        const distance = Math.abs(t - dip.at);
        if (distance < dip.width) {
          const intensity = 1 - distance / dip.width;
          stressBias += dip.depth * intensity;
        }
      }
      const noise = (Math.random() - 0.5) * 4;
      const slow = Math.sin(t * 0.15) * 3;
      const hrv = Math.max(28, Math.min(85, baseline - stressBias + noise + slow));

      setSamples((prev) => {
        const next = [...prev, { t, hrv }];
        return next.filter((s) => s.t > t - 90);
      });

      if (hrv < STRESS_THRESHOLD && t - lastStressTime.current > 15) {
        lastStressTime.current = t;
        stressEventCounter.current += 1;
        const labels = ["First contact", "Multi-team push", "Low health engagement", "Final round pressure"];
        const newEvent: StressEvent = {
          id: `e_${stressEventCounter.current}`,
          t,
          label: labels[(stressEventCounter.current - 1) % labels.length],
          hrv,
        };
        setEvents((prev) => [...prev, newEvent]);
        setActiveToast(newEvent);
        setTimeout(() => setActiveToast((prev) => prev?.id === newEvent.id ? null : prev), 4500);
        const systems: AdaptiveFiring["system"][] = ["video", "audio", "controller", "weapons"];
        const sys = systems[(stressEventCounter.current - 1) % systems.length];
        const actions = {
          video: "Focus Mode engaged — kill feed hidden",
          audio: "Toxic voice channel muted",
          weapons: "Loadout swap → Stable set",
          controller: "Sensitivity reduced 12%",
        };
        setFirings((prev) => [...prev, { id: `f_${stressEventCounter.current}`, t, system: sys, action: actions[sys], expiresAt: t + 30 }]);
      }

      if (Math.random() < 0.02) setKills((k) => k + 1);
      if (Math.random() < 0.008) setDeaths((d) => d + 1);
      if (Math.random() < 0.05) setScore((s) => s + Math.floor(Math.random() * 50 + 10));

      if (t >= MATCH_DURATION) {
        clearInterval(interval);
        setState("complete");
      }
    }, 150);
    return () => clearInterval(interval);
  }, [state]);

  const currentHrv = samples.length > 0 ? samples[samples.length - 1].hrv : 68;
  const calmScore = Math.round(Math.max(0, Math.min(100, ((currentHrv - 35) / 50) * 100)));
  const activeFirings = firings.filter((f) => elapsed < f.expiresAt);

  const reset = () => {
    setState("pre"); setElapsed(0); setSamples([]); setEvents([]); setFirings([]);
    setKills(0); setDeaths(0); setScore(0);
    lastStressTime.current = -100; stressEventCounter.current = 0;
  };

  return (
    <>
      <AppHeader
        eyebrow={state === "live" ? "Live · Ranked · Refinery" : state === "complete" ? "Match complete" : "Ready to play"}
        title="Live Match"
        subtitle={state === "live" ? formatClock(elapsed) : state === "complete" ? `${formatClock(elapsed)} duration` : "Real-time biometrics during gameplay"}
        actions={
          state === "live" ? <SecondaryButton onClick={() => setState("complete")}>End match</SecondaryButton>
          : state === "complete" ? <PrimaryButton onClick={reset}>New session</PrimaryButton>
          : <PrimaryButton onClick={() => setState("live")}>Start session</PrimaryButton>
        }
      />

      {state === "pre" && <PreSessionHero onStart={() => setState("live")} />}

      {(state === "live" || state === "complete") && (
        <div className="px-8 py-8 max-w-[1600px]">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
            <div className="space-y-6">
              <section className="rounded-lg border grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden"
                style={{ background: "var(--color-app-line)", borderColor: "var(--color-app-line)" }}>
                <LiveTile label="Clock" value={formatClock(elapsed)} hint={state === "complete" ? "Final" : "Live"} status={state === "complete" ? "neutral" : "live"} />
                <LiveTile label="KDA" value={`${kills}/${deaths}/${Math.floor(kills * 1.3)}`} hint={deaths > 0 ? (kills / deaths).toFixed(2) : "—"} />
                <LiveTile label="Score" value={score.toLocaleString()} numericValue={score} format={(v) => Math.round(v).toLocaleString()} hint="match points" />
                <LiveTile label="Stress events" value={events.length.toString()} numericValue={events.length} hint={events.length === 0 ? "none yet" : "this match"} status={events.length > 2 ? "warn" : "calm"} />
              </section>

              <section>
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-medium tracking-tight">Live HRV</h3>
                    <p className="text-xs text-fg-mute mt-0.5">Last 90 seconds · stress threshold at {STRESS_THRESHOLD}ms</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-display tabular-nums tracking-tight text-fg"><TweenedNumber value={currentHrv} duration={300} /></span>
                      <span className="text-xs font-mono text-fg-mute">ms</span>
                    </div>
                    <div className="px-2 py-1 rounded text-[10px] uppercase tracking-[0.18em] font-mono"
                      style={{
                        background: currentHrv < STRESS_THRESHOLD ? "rgba(255,51,68,0.12)" : "rgba(110,231,183,0.12)",
                        color: currentHrv < STRESS_THRESHOLD ? "var(--color-app-accent)" : "var(--color-calm)",
                      }}>
                      {currentHrv < STRESS_THRESHOLD ? "Stressed" : "Calm"}
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-4" style={{ background: "var(--color-app-surface)", borderColor: "var(--color-app-line)" }}>
                  <LiveHrvChart samples={samples} elapsed={elapsed} events={events} threshold={STRESS_THRESHOLD} />
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
                <div className="rounded-lg border p-5" style={{ background: "var(--color-app-surface)", borderColor: "var(--color-app-line)" }}>
                  <div className="text-[10px] uppercase tracking-[0.22em] font-mono text-fg-mute">Calm Score</div>
                  <CalmGaugeRadial value={calmScore} />
                </div>
                <div className="rounded-lg border overflow-hidden" style={{ background: "var(--color-app-surface)", borderColor: "var(--color-app-line)" }}>
                  <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--color-app-line)" }}>
                    <h4 className="text-sm font-medium text-fg">Adaptive Control · live firings</h4>
                    <span className="text-[10px] uppercase tracking-[0.18em] font-mono text-fg-mute">{firings.length} total</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {firings.length === 0 ? (
                      <div className="px-5 py-10 text-center text-xs text-fg-mute">
                        No adaptations have fired yet.<br />
                        <span className="text-[10px] uppercase tracking-[0.18em] font-mono mt-1 inline-block">System monitoring</span>
                      </div>
                    ) : (
                      [...firings].reverse().map((f, i) => (
                        <div key={f.id} className="px-5 py-3 grid grid-cols-[auto_1fr_auto] items-center gap-3" style={{ borderTop: i === 0 ? "none" : "1px solid var(--color-app-line)" }}>
                          <span className="block w-1.5 h-6 rounded-full" style={{
                            background: f.system === "video" ? "var(--color-app-accent)" : f.system === "audio" ? "var(--color-warn)" : f.system === "controller" ? "var(--color-app-action)" : "var(--color-calm)",
                          }} />
                          <div>
                            <div className="text-xs text-fg">{f.action}</div>
                            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-fg-mute mt-0.5">{f.system}</div>
                          </div>
                          <div className="text-[10px] font-mono text-fg-mute whitespace-nowrap">{formatClock(f.t)}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-4">
              <SystemStatusRail activeFirings={activeFirings} state={state} />
            </aside>
          </div>
        </div>
      )}

      {activeToast && (
        <div className="fixed top-20 right-8 z-50 max-w-sm rounded-lg border shadow-xl p-4 animate-slide-in"
          style={{ background: "var(--color-app-surface-2)", borderColor: "var(--color-app-accent)" }}>
          <div className="flex items-start gap-3">
            <span className="block w-2 h-2 rounded-full mt-1.5 heartbeat shrink-0" style={{ background: "var(--color-app-accent)" }} />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase tracking-[0.22em] font-mono" style={{ color: "var(--color-app-accent)" }}>Stress event detected</div>
              <div className="mt-1 text-sm text-fg font-medium">{activeToast.label}</div>
              <div className="mt-2 text-xs text-fg-mute font-mono">HRV dropped to {Math.round(activeToast.hrv)}ms at {formatClock(activeToast.t)}</div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in {
          0%   { opacity: 0; transform: translateX(24px); }
          70%  { opacity: 1; transform: translateX(-2px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 360ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-slide-in { animation: none; }
        }
      `}</style>
    </>
  );
}

function formatClock(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function PreSessionHero({ onStart }: { onStart: () => void }) {
  return (
    <div className="px-8 py-16">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border" style={{ borderColor: "var(--color-app-line-strong)" }}>
          <span className="block w-1.5 h-1.5 rounded-full heartbeat" style={{ background: "var(--color-calm)" }} />
          <span className="text-[10px] uppercase tracking-[0.22em] font-mono text-fg-dim">Sensor live · {profile.handle}</span>
        </div>
        <h2 className="mt-8 text-4xl font-display tracking-[-0.02em] leading-tight">
          When you start a match, BlitzMind starts watching.
        </h2>
        <p className="mt-6 text-fg-dim leading-relaxed max-w-xl mx-auto">
          Your HRV draws live across the screen. Stress events get flagged with context — what was happening at that moment in the game. Adaptive Control fires silently in the background so you stay competitive instead of getting interrupted.
        </p>
        <div className="mt-10">
          <button onClick={onStart} className="px-6 py-3 rounded text-sm font-medium transition-all" style={{ background: "var(--color-app-action)", color: "white" }}>
            Start session
          </button>
          <p className="mt-3 text-xs text-fg-mute">Demo runs for 3 minutes · ends automatically</p>
        </div>
        <div className="mt-16 grid grid-cols-3 gap-4 text-left">
          <PreTile label="Real-time HRV" body="Live trace updating every 150ms. Stress events appear as they happen." />
          <PreTile label="Adaptive firings" body="Watch Video, Audio, Weapons, and Device respond in real time when triggers cross." />
          <PreTile label="Match context" body="Stress events are tagged with what was happening — 'first contact,' 'final round.'" />
        </div>
      </div>
    </div>
  );
}

function PreTile({ label, body }: { label: string; body: string }) {
  return (
    <div className="p-4 rounded-lg border" style={{ background: "var(--color-app-surface)", borderColor: "var(--color-app-line)" }}>
      <div className="text-[10px] uppercase tracking-[0.22em] font-mono" style={{ color: "var(--color-app-accent)" }}>{label}</div>
      <p className="mt-2 text-xs text-fg-dim leading-relaxed">{body}</p>
    </div>
  );
}

function LiveHrvChart({ samples, elapsed, events, threshold }: { samples: HrvSample[]; elapsed: number; events: StressEvent[]; threshold: number; }) {
  const w = 1200; const h = 200;
  const pad = { x: 24, y: 16 };
  const innerW = w - pad.x * 2; const innerH = h - pad.y * 2;
  const minHrv = 30; const maxHrv = 90;
  const windowEnd = Math.max(90, elapsed);
  const windowStart = windowEnd - 90;
  const toX = (t: number) => pad.x + ((t - windowStart) / 90) * innerW;
  const toY = (hrv: number) => pad.y + (1 - (hrv - minHrv) / (maxHrv - minHrv)) * innerH;
  const visibleSamples = samples.filter((s) => s.t >= windowStart);
  const path = visibleSamples.map((s, i) => `${i === 0 ? "M" : "L"} ${toX(s.t)} ${toY(s.hrv)}`).join(" ") || "";
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none" aria-label="Live HRV chart">
      <defs>
        <linearGradient id="live-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,51,68,0.18)" />
          <stop offset="100%" stopColor="rgba(255,51,68,0)" />
        </linearGradient>
      </defs>
      <rect x={pad.x} y={toY(threshold)} width={innerW} height={h - pad.y - toY(threshold)} fill="rgba(255,51,68,0.04)" />
      <line x1={pad.x} x2={w - pad.x} y1={toY(threshold)} y2={toY(threshold)} stroke="var(--color-app-accent)" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
      <text x={pad.x + 6} y={toY(threshold) + 11} fontSize="9" fontFamily="var(--font-mono)" fill="var(--color-app-accent)">STRESS THRESHOLD · {threshold}ms</text>
      {[40, 60, 80].map((v) => (
        <g key={v}>
          <line x1={pad.x} x2={w - pad.x} y1={toY(v)} y2={toY(v)} stroke="var(--color-app-line)" strokeWidth="0.5" strokeDasharray="2 4" />
          <text x={pad.x - 4} y={toY(v) + 3} fontSize="9" fontFamily="var(--font-mono)" fill="var(--color-fg-mute)" textAnchor="end">{v}</text>
        </g>
      ))}
      {path && (
        <>
          <path d={`${path} L ${toX(visibleSamples[visibleSamples.length - 1].t)} ${h - pad.y} L ${toX(visibleSamples[0].t)} ${h - pad.y} Z`} fill="url(#live-area)" />
          <path d={path} fill="none" stroke="var(--color-fg)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
          {visibleSamples.length > 0 && (
            <>
              <circle cx={toX(visibleSamples[visibleSamples.length - 1].t)} cy={toY(visibleSamples[visibleSamples.length - 1].hrv)} r="6" fill="var(--color-app-accent)" opacity="0.2" className="heartbeat" />
              <circle cx={toX(visibleSamples[visibleSamples.length - 1].t)} cy={toY(visibleSamples[visibleSamples.length - 1].hrv)} r="3" fill="var(--color-app-accent)" />
            </>
          )}
        </>
      )}
      {events.filter((e) => e.t >= windowStart).map((e) => (
        <g key={e.id}>
          <line x1={toX(e.t)} x2={toX(e.t)} y1={pad.y} y2={h - pad.y} stroke="var(--color-app-accent)" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.5" />
          <circle cx={toX(e.t)} cy={toY(e.hrv)} r="4" fill="var(--color-app-accent)" stroke="var(--color-app-bg)" strokeWidth="1.5" />
        </g>
      ))}
    </svg>
  );
}

function CalmGaugeRadial({ value }: { value: number }) {
  const size = 220;
  const stroke = 18;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const color = value > 65 ? "var(--color-calm)" : value > 45 ? "var(--color-warn)" : "var(--color-app-accent)";
  // Targeted dash-offset for the value (starts at c — empty — and animates toward target)
  const targetOffset = c - (value / 100) * c;
  return (
    <div className="relative mt-3 flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label="Calm score gauge">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-app-line)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: targetOffset, stroke: color }}
          transition={{
            strokeDashoffset: { duration: 1.1, ease: [0.32, 0.72, 0, 1] },
            stroke: { duration: 0.4, ease: "easeOut" },
          }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-5xl font-display tabular-nums tracking-tight" style={{ color }}>
          <TweenedNumber value={value} duration={1100} />
        </div>
        <div className="text-[10px] uppercase tracking-[0.22em] font-mono text-fg-mute mt-1">{value > 65 ? "Calm" : value > 45 ? "Elevated" : "Stressed"}</div>
      </div>
    </div>
  );
}

function SystemStatusRail({ activeFirings, state }: { activeFirings: AdaptiveFiring[]; state: SessionState; }) {
  const systems: { id: AdaptiveFiring["system"]; label: string; description: string; }[] = [
    { id: "video", label: "Video", description: "Brightness, focus mode" },
    { id: "audio", label: "Audio", description: "Volume, voice mute" },
    { id: "weapons", label: "Weapons", description: "Loadout swap" },
    { id: "controller", label: "Device", description: "Sensitivity, haptics" },
  ];
  return (
    <div className="rounded-lg border overflow-hidden xl:sticky xl:top-32" style={{ background: "var(--color-app-surface)", borderColor: "var(--color-app-line)" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "var(--color-app-line)" }}>
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-fg">Adaptive systems</h4>
          {state === "live" && (
            <div className="flex items-center gap-1.5">
              <span className="block w-1.5 h-1.5 rounded-full heartbeat" style={{ background: "var(--color-calm)" }} />
              <span className="text-[10px] uppercase tracking-[0.18em] font-mono text-fg-mute">Live</span>
            </div>
          )}
        </div>
      </div>
      <div>
        {systems.map((sys, i) => {
          const fired = activeFirings.find((f) => f.system === sys.id);
          return (
            <div key={sys.id} className="px-5 py-4" style={{ borderTop: i === 0 ? "none" : "1px solid var(--color-app-line)" }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-fg">{sys.label}</span>
                {fired ? (
                  <span className="px-1.5 py-0.5 rounded text-[9px] uppercase tracking-[0.18em] font-mono" style={{ background: "rgba(255,51,68,0.15)", color: "var(--color-app-accent)" }}>Active</span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded text-[9px] uppercase tracking-[0.18em] font-mono" style={{ background: "var(--color-app-surface-3)", color: "var(--color-fg-mute)" }}>Idle</span>
                )}
              </div>
              <div className="text-xs text-fg-mute">{fired ? fired.action : sys.description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LiveTile({ label, value, numericValue, format, hint, status = "neutral" }: { label: string; value: string; numericValue?: number; format?: (v: number) => string; hint: string; status?: "live" | "calm" | "warn" | "neutral"; }) {
  const statusColor = status === "live" ? "var(--color-app-accent)" : status === "calm" ? "var(--color-calm)" : status === "warn" ? "var(--color-app-accent)" : "var(--color-fg-mute)";
  return (
    <div className="p-5" style={{ background: "var(--color-app-surface)" }}>
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] font-mono text-fg-mute">
        <span className={`block w-1.5 h-1.5 rounded-full ${status === "live" ? "heartbeat" : ""}`} style={{ background: statusColor }} />
        {label}
      </div>
      <div className="mt-3 text-2xl font-display tabular-nums tracking-tight text-fg">
        {numericValue !== undefined ? <TweenedNumber value={numericValue} format={format} duration={400} /> : value}
      </div>
      <div className="mt-1 text-xs text-fg-mute font-mono">{hint}</div>
    </div>
  );
}
