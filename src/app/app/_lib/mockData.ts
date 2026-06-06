/**
 * BlitzMind mock data layer.
 *
 * Single source of truth for everything the app "knows" about HarnitK#7421.
 * Sessions, weapons, maps, settings — all defined here. Components import
 * what they need.
 *
 * Naming convention is intentionally fictional ("Crucible Ops", invented
 * map and weapon names) so the project reads as a platform that works
 * across games, not a CoD-specific tool.
 *
 * All timestamps are relative to a fictional "current date" so dates don't
 * go stale.
 */

// ============================================================
// Profile
// ============================================================

export const profile = {
  handle: "HarnitK#7421",
  displayName: "Harnit Khatri",
  tier: "Diamond II",
  rankPoints: 4280,
  rankPointsNext: 4500,
  region: "NA-East",
  primaryGame: "crucible-ops",
  hoursPlayed: 1840,
  membership: "Pro",
} as const;

// ============================================================
// Games (fictional library, primary one is Crucible Ops)
// ============================================================

export const games = [
  {
    id: "crucible-ops",
    name: "Crucible Ops",
    genre: "Tactical FPS",
    icon: "CO",
    lastPlayed: "2h ago",
    accent: "#ff3344",
    cover: "/games/crucible-ops.svg",
  },
  {
    id: "rift-runners",
    name: "Rift Runners",
    genre: "Battle Royale",
    icon: "RR",
    lastPlayed: "Yesterday",
    accent: "#4a90ff",
    cover: "/games/rift-runners.svg",
  },
  {
    id: "vector-strike",
    name: "Vector Strike",
    genre: "Tactical Shooter",
    icon: "VS",
    lastPlayed: "3 days ago",
    accent: "#6ee7b7",
    cover: "/games/vector-strike.svg",
  },
] as const;

// ============================================================
// Game modes within Crucible Ops
// ============================================================

export const gameModes = [
  { id: "ranked", name: "Ranked", category: "core", players: "5v5", icon: "◆" },
  { id: "br-solo", name: "Battle Royale Solo", category: "br", players: "1", icon: "▲" },
  { id: "br-squad", name: "Battle Royale Squad", category: "br", players: "4", icon: "▲" },
  { id: "tdm", name: "Team Deathmatch", category: "core", players: "6v6", icon: "◆" },
  { id: "search", name: "Search & Destroy", category: "core", players: "5v5", icon: "◆" },
  { id: "domination", name: "Domination", category: "core", players: "6v6", icon: "◆" },
  { id: "training", name: "Training Range", category: "training", players: "1", icon: "○" },
  { id: "gunfight", name: "Gunfight", category: "core", players: "2v2", icon: "◆" },
] as const;

// ============================================================
// Maps
// ============================================================

export const maps = [
  { id: "refinery", name: "Refinery", size: "Large", category: "br", playRate: 26.7 },
  { id: "coastal", name: "Coastal Strike", size: "Large", category: "br", playRate: 23.9 },
  { id: "pier", name: "Pier 7", size: "Small", category: "core", playRate: 13.1 },
  { id: "yard", name: "The Yard", size: "Small", category: "core", playRate: 4.3 },
  { id: "harbor", name: "Harbor", size: "Medium", category: "core", playRate: 4.0 },
  { id: "transit", name: "Transit Hub", size: "Medium", category: "core", playRate: 3.9 },
  { id: "bunker", name: "Bunker 14", size: "Small", category: "core", playRate: 1.5 },
  { id: "highrise", name: "Highrise", size: "Medium", category: "core", playRate: 1.3 },
] as const;

// ============================================================
// Weapons
// ============================================================

export const weapons = [
  { id: "kr77", name: "KR-77", class: "Assault Rifle", accuracy: 72, recoil: "Medium", role: "primary" },
  { id: "vector9", name: "Vector-9", class: "SMG", accuracy: 68, recoil: "Low", role: "primary" },
  { id: "l220", name: "L-220", class: "Sniper", accuracy: 91, recoil: "High", role: "primary" },
  { id: "spectre", name: "Spectre", class: "Assault Rifle", accuracy: 75, recoil: "Low", role: "stable" },
  { id: "m4t", name: "M4-T", class: "Assault Rifle", accuracy: 78, recoil: "Low", role: "stable" },
  { id: "g19c", name: "G-19C", class: "Sidearm", accuracy: 64, recoil: "Low", role: "secondary" },
  { id: "raptor", name: "Raptor", class: "Shotgun", accuracy: 55, recoil: "High", role: "primary" },
  { id: "viper", name: "Viper", class: "LMG", accuracy: 70, recoil: "Medium", role: "primary" },
  { id: "ember", name: "Ember", class: "Marksman", accuracy: 85, recoil: "Medium", role: "primary" },
  { id: "kx12", name: "KX-12", class: "SMG", accuracy: 70, recoil: "Low", role: "stable" },
] as const;

// ============================================================
// Match sessions — last 7 matches with realistic competitive stats
// ============================================================

export type MatchResult = "victory" | "defeat";

export interface MatchSession {
  id: string;
  date: string;          // "12h ago", "Yesterday 9pm", etc
  result: MatchResult;
  mode: string;          // game mode name
  map: string;           // map name
  duration: string;      // "24m 18s"
  // Combat stats
  kda: number;
  score: number;
  hsPercent: number;     // headshot %
  damage: number;
  // Biometric stats
  avgBpm: number;
  peakBpm: number;
  avgHrv: number;        // ms
  peakStress: number;    // ms (low = stressed)
  calmPercent: number;
  stressEvents: number;
  // Story
  highlight: string;
}

export const matches: MatchSession[] = [
  {
    id: "m_001",
    date: "2h ago",
    result: "victory",
    mode: "Ranked",
    map: "Refinery",
    duration: "28m 14s",
    kda: 2.3,
    score: 4280,
    hsPercent: 42,
    damage: 3140,
    avgBpm: 82,
    peakBpm: 118,
    avgHrv: 68,
    peakStress: 38,
    calmPercent: 72,
    stressEvents: 3,
    highlight: "Recovered after mid-match stress dip — clutched final round.",
  },
  {
    id: "m_002",
    date: "5h ago",
    result: "defeat",
    mode: "Battle Royale Squad",
    map: "Coastal Strike",
    duration: "31m 02s",
    kda: 1.1,
    score: 2240,
    hsPercent: 28,
    damage: 1820,
    avgBpm: 94,
    peakBpm: 142,
    avgHrv: 51,
    peakStress: 24,
    calmPercent: 48,
    stressEvents: 7,
    highlight: "Stress spike during final circle cost three clutch shots.",
  },
  {
    id: "m_003",
    date: "Yesterday 11pm",
    result: "victory",
    mode: "Team Deathmatch",
    map: "Pier 7",
    duration: "12m 40s",
    kda: 3.1,
    score: 3950,
    hsPercent: 51,
    damage: 4200,
    avgBpm: 76,
    peakBpm: 96,
    avgHrv: 78,
    peakStress: 62,
    calmPercent: 84,
    stressEvents: 1,
    highlight: "Peak focus window — best reaction times of the week.",
  },
  {
    id: "m_004",
    date: "Yesterday 8pm",
    result: "defeat",
    mode: "Ranked",
    map: "The Yard",
    duration: "26m 51s",
    kda: 0.9,
    score: 1980,
    hsPercent: 24,
    damage: 1640,
    avgBpm: 98,
    peakBpm: 138,
    avgHrv: 44,
    peakStress: 22,
    calmPercent: 38,
    stressEvents: 9,
    highlight: "High stress throughout — late-session fatigue evident.",
  },
  {
    id: "m_005",
    date: "Yesterday 6pm",
    result: "victory",
    mode: "Search & Destroy",
    map: "Bunker 14",
    duration: "18m 22s",
    kda: 2.7,
    score: 3420,
    hsPercent: 48,
    damage: 2890,
    avgBpm: 80,
    peakBpm: 108,
    avgHrv: 70,
    peakStress: 54,
    calmPercent: 76,
    stressEvents: 2,
    highlight: "Adaptive loadout fired on round 9 — won the next four.",
  },
  {
    id: "m_006",
    date: "2 days ago",
    result: "victory",
    mode: "Domination",
    map: "Highrise",
    duration: "22m 09s",
    kda: 1.8,
    score: 3100,
    hsPercent: 35,
    damage: 2640,
    avgBpm: 84,
    peakBpm: 124,
    avgHrv: 64,
    peakStress: 46,
    calmPercent: 68,
    stressEvents: 4,
    highlight: "Consistent — no peak performance window, no major dips.",
  },
  {
    id: "m_007",
    date: "3 days ago",
    result: "defeat",
    mode: "Battle Royale Solo",
    map: "Refinery",
    duration: "29m 47s",
    kda: 1.4,
    score: 2580,
    hsPercent: 31,
    damage: 2120,
    avgBpm: 90,
    peakBpm: 134,
    avgHrv: 58,
    peakStress: 32,
    calmPercent: 58,
    stressEvents: 5,
    highlight: "Top 10 finish — stress climbed steadily through end-game.",
  },
];

// ============================================================
// Aggregated stats (computed from matches above, but cached here
// to keep the home dashboard fast and predictable)
// ============================================================

export const aggregates = {
  winRate: 63,
  kda: 1.9,
  hsPercent: 37,
  adr: 2615,
  hoursThisWeek: 14.5,
  hoursLastWeek: 18.2,
  // Biometric aggregates over the last 7 sessions
  avgHrv: 62,
  hrvDelta: -7, // % vs last week
  avgCalm: 63,
  calmDelta: -4,
  peakPerformanceWindow: "Tue 8-10pm",
  recoveryAvg: "2m 14s",
  /**
   * 7-day sparkline series for the Sessions aggregate strip.
   * Each array is 7 values, one per day, oldest-first.
   * Shapes are chosen to match the existing narrative:
   *   - matches: gradually climbing (playing more this week)
   *   - winRate: choppy, ends slightly up
   *   - avgCalm: trending DOWN (matches calmDelta -4)
   *   - stressEvents: climbing up (player is getting more stressed)
   */
  trends: {
    matches: { series: [0, 1, 1, 0, 2, 1, 2], delta: 2, deltaSuffix: "" },
    winRate: { series: [52, 48, 55, 50, 60, 54, 57], delta: 4, deltaSuffix: "%" },
    avgCalm: { series: [68, 70, 66, 64, 62, 65, 63], delta: -2, deltaSuffix: "%" },
    stressEvents: { series: [3, 4, 5, 4, 6, 4, 5], delta: 8, deltaSuffix: "" },
  },
} as const;

// ============================================================
// Adaptive Control System default settings
// (the app loads with these, then user toggles modify them in-session)
// ============================================================

export const defaultSettings = {
  video: {
    enabled: true,
    trigger: { metric: "calm", threshold: 60 },
    visualChanges: {
      enabled: true,
      brightness: 60,
      colorTemperature: "neutral" as "neutral" | "softWarm" | "eveningComfort" | "reliefMode",
    },
    focusMode: {
      enabled: true,
      hideMinimap: false,
      hideKillFeed: true,
      hideAmmo: false,
    },
    overlays: {
      hrvDisplay: true,
      stressMinimalist: true,
      criticalInfo: true,
      dynamicStats: false,
    },
  },
  weapons: {
    enabled: true,
    trigger: { metric: "calm", threshold: 50 },
    primarySet: ["kr77", "vector9", "l220"],
    stableSet: ["spectre", "m4t", "kx12"],
  },
  maps: {
    enabled: true,
    rankedRestriction: {
      enabled: true,
      trigger: { metric: "calm", threshold: 40 },
      maps: ["refinery", "coastal", "pier", "yard"],
    },
    mapRestriction: {
      enabled: true,
      trigger: { metric: "calm", threshold: 30 },
      maps: ["pier", "harbor", "transit"],
    },
    trainingOnly: {
      enabled: false,
      trigger: { metric: "calm", threshold: 20 },
      maps: ["bunker", "highrise"],
    },
  },
  audio: {
    enabled: true,
    volume: 80,
    adaptiveAudio: true,
    autoMuteToxic: true,
    ambientCalm: false,
    audioCuePriority: true,
  },
  controller: {
    enabled: true,
    sensitivity: 50,
    hapticIntensity: 70,
    deadzoneInner: 8,
    deadzoneOuter: 92,
    gripCalibration: "default" as "default" | "low" | "high",
  },
} as const;
