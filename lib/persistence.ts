// Persistance localStorage (chargement / sauvegarde de la partie).

import { CONST, SOILS } from "./data";
import type { GameSnapshot } from "./game";

export interface SaveFile {
  v: 1;
  savedAt: number;
  state: GameSnapshot & {
    lastSeen: number;
    earthAdds: number;
    soundOn: boolean;
    playMs: number;
    maxCombo: number;
  };
}

export function defaultSnapshot(): GameSnapshot & {
  lastSeen: number;
  earthAdds: number;
  soundOn: boolean;
  playMs: number;
  maxCombo: number;
} {
  const now = Date.now();
  return {
    coins: 0,
    runEarned: 0,
    lifetimeEarned: 0,
    clicks: 0,
    goldenClicks: 0,
    buildings: {},
    upgrades: [],
    soilsUnlocked: ["basic"],
    soilId: "basic",
    nutrients: 1,
    waterUntil: 0,
    seeds: 0,
    prestiges: 0,
    combo: 0,
    lastSeen: now,
    earthAdds: 0,
    soundOn: false,
    playMs: 0,
    maxCombo: 0,
  };
}

function sanitize(raw: Partial<SaveFile>): SaveFile | null {
  if (!raw || typeof raw !== "object") return null;
  const d = defaultSnapshot();
  const s = (raw.state ?? {}) as Partial<typeof d>;
  const state: typeof d = {
    ...d,
    coins: num(s.coins, d.coins),
    runEarned: num(s.runEarned, d.runEarned),
    lifetimeEarned: num(s.lifetimeEarned, d.lifetimeEarned),
    clicks: num(s.clicks, d.clicks),
    goldenClicks: num(s.goldenClicks, d.goldenClicks),
    buildings:
      s.buildings && typeof s.buildings === "object"
        ? Object.fromEntries(
            Object.entries(s.buildings)
              .filter(([, v]) => Number.isFinite(v) && v >= 0)
              .map(([k, v]) => [k, Math.floor(v as number)])
          )
        : {},
    upgrades: Array.isArray(s.upgrades) ? s.upgrades.filter((x) => typeof x === "string") : [],
    soilsUnlocked: Array.isArray(s.soilsUnlocked)
      ? [...new Set([...s.soilsUnlocked.filter((x) => SOILS.some((so) => so.id === x)), "basic"])]
      : ["basic"],
    soilId: SOILS.some((so) => so.id === s.soilId) ? (s.soilId as string) : "basic",
    nutrients: Math.min(1, Math.max(0, num(s.nutrients, d.nutrients))),
    waterUntil: num(s.waterUntil, d.waterUntil),
    seeds: num(s.seeds, d.seeds),
    prestiges: num(s.prestiges, d.prestiges),
    combo: 0,
    lastSeen: num(s.lastSeen, d.lastSeen),
    earthAdds: num(s.earthAdds, d.earthAdds),
    soundOn: typeof s.soundOn === "boolean" ? s.soundOn : false,
    playMs: num(s.playMs, d.playMs),
    maxCombo: num(s.maxCombo, d.maxCombo),
  };
  // Sol débloqué mais non possédé ? on repart sur un sol possédé.
  if (!state.soilsUnlocked.includes(state.soilId)) state.soilId = "basic";
  return { v: 1, savedAt: state.lastSeen, state };
}

function num(v: unknown, fallback: number): number {
  return typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : fallback;
}

export function loadSave(): SaveFile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONST.SAVE_KEY);
    if (!raw) return null;
    return sanitize(JSON.parse(raw) as Partial<SaveFile>);
  } catch {
    return null;
  }
}

export function writeSave(save: SaveFile): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(CONST.SAVE_KEY, JSON.stringify(save));
    return true;
  } catch {
    return false;
  }
}

export function clearSave(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CONST.SAVE_KEY);
  } catch {
    // ignoré
  }
}
