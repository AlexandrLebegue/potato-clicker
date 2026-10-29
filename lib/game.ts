// Logique de jeu pure : coûts exponentiels, production, combo, prestige,
// gains hors-ligne, évolution, barème d'effets. Testable sans DOM.

import {
  BUILDINGS,
  CLICK_UPGRADES,
  SOILS,
  EVOLUTIONS,
  ACCESSORIES,
  ACHIEVEMENTS,
  WEATHER,
  CONST,
  type WeatherType,
} from "./data";

export interface GameSnapshot {
  coins: number;
  runEarned: number;
  lifetimeEarned: number;
  clicks: number;
  goldenClicks: number;
  buildings: Record<string, number>;
  upgrades: string[];
  soilsUnlocked: string[];
  soilId: string;
  nutrients: number; // 0..1
  waterUntil: number; // ms timestamp
  seeds: number;
  prestiges: number;
  combo: number; // bonus 0..COMBO_MAX
}

type Rng = () => number;

/** Coût exponentiel : base * growth^niveau, avec raffinement par palier de 25. */
export function buildingCost(baseCost: number, growth: number, level: number): number {
  const g = growth + 0.005 * Math.floor(level / 25);
  return Math.ceil(baseCost * Math.pow(g, level));
}

export function getBuilding(id: string) {
  return BUILDINGS.find((b) => b.id === id);
}

export function soilById(id: string) {
  return SOILS.find((s) => s.id === id) ?? SOILS[0];
}

export function totalBuildings(snapshot: Pick<GameSnapshot, "buildings">): number {
  return Object.values(snapshot.buildings).reduce((a, b) => a + b, 0);
}

export function totalPurchases(snapshot: Pick<GameSnapshot, "buildings" | "upgrades">): number {
  return totalBuildings(snapshot) + snapshot.upgrades.length;
}

/** Production de base (sans multiplicateurs) en patacoins/s. */
export function baseCps(snapshot: Pick<GameSnapshot, "buildings">): number {
  let cps = 0;
  for (const b of BUILDINGS) {
    const level = snapshot.buildings[b.id] ?? 0;
    if (level > 0) cps += b.cps * level;
  }
  return cps;
}

/** Multiplieur de nutriments : 0.5 (vide) .. 1.25 (plein). */
export function nutrientMult(nutrients: number): number {
  const n = Math.min(1, Math.max(0, nutrients));
  return CONST.NUTRIENT_MIN_MULT + (CONST.NUTRIENT_MAX_MULT - CONST.NUTRIENT_MIN_MULT) * n;
}

/** Bonus de prestige : +2 % par graine légendaire. */
export function prestigeMult(seeds: number): number {
  return 1 + CONST.SEED_BONUS * Math.max(0, seeds);
}

/** L'arrosoir est-il actif à cet instant ? */
export function waterActive(waterUntil: number, now: number): boolean {
  return waterUntil > now;
}

export function weatherCpsMult(type: WeatherType): number {
  return WEATHER[type].cpsMult;
}

export function weatherClickMult(type: WeatherType): number {
  return WEATHER[type].clickMult;
}

export interface ProductionContext {
  now: number;
  weather: WeatherType;
}

/** Production passive totale (patacoins/s). */
export function cps(snapshot: GameSnapshot, ctx: ProductionContext): number {
  const water = waterActive(snapshot.waterUntil, ctx.now) ? CONST.WATER_MULT : 1;
  return (
    baseCps(snapshot) *
    soilById(snapshot.soilId).mult *
    prestigeMult(snapshot.seeds) *
    weatherCpsMult(ctx.weather) *
    water *
    nutrientMult(snapshot.nutrients)
  );
}

/** Gain d'un clic (hors combo). */
export function clickPower(snapshot: GameSnapshot, ctx: ProductionContext): number {
  let add = 0;
  let mult = 1;
  for (const u of CLICK_UPGRADES) {
    if (!snapshot.upgrades.includes(u.id)) continue;
    if (u.add) add += u.add;
    if (u.mult) mult *= u.mult;
  }
  const water = waterActive(snapshot.waterUntil, ctx.now) ? CONST.WATER_MULT : 1;
  const combo = 1 + Math.min(CONST.COMBO_MAX, snapshot.combo);
  return (
    (CONST.BASE_CLICK + add) *
    mult *
    soilById(snapshot.soilId).mult *
    prestigeMult(snapshot.seeds) *
    weatherClickMult(ctx.weather) *
    water *
    nutrientMult(snapshot.nutrients) *
    combo
  );
}

/** Combo : un clic rapide augmente la jauge, un gap la fait fondre. */
export function comboAfterClick(combo: number, lastClick: number, now: number): number {
  const fast = lastClick > 0 && now - lastClick <= CONST.COMBO_WINDOW_MS;
  if (!fast) return 0;
  return Math.min(CONST.COMBO_MAX, combo + CONST.COMBO_STEP);
}

export function comboAfterGap(combo: number, lastClick: number, now: number): number {
  const gap = now - lastClick;
  if (gap <= CONST.COMBO_WINDOW_MS) return combo;
  return Math.max(0, combo - (gap - CONST.COMBO_WINDOW_MS) * CONST.COMBO_DECAY_PER_MS);
}

/** Gain d'une patate dorée : 40 % de la banque ou 2 min de production. */
export function goldenGain(coins: number, cpsPerSec: number): number {
  return Math.max(CONST.GOLDEN_MIN_GAIN, Math.floor(Math.max(coins * 0.4, cpsPerSec * 120)));
}

/** Graines légendaires gagnées au prestige. */
export function prestigeGain(runEarned: number): number {
  return Math.floor(Math.sqrt(Math.max(0, runEarned) / CONST.PRESTIGE_BASE));
}

export interface OfflineResult {
  elapsedMs: number; // temps réellement compté (plafond 8 h)
  gain: number;
}

/**
 * Gains hors-ligne : production passive sur la durée écoulée (plafond 8 h),
 * en utilisant la moyenne des nutriments (dépend de la décroissance).
 */
export function computeOffline(
  snapshot: GameSnapshot,
  lastSeen: number,
  now: number,
  rng: Rng = Math.random
): OfflineResult {
  const raw = now - lastSeen;
  if (raw < CONST.OFFLINE_MIN_MS) return { elapsedMs: 0, gain: 0 };
  const elapsedMs = Math.min(raw, CONST.OFFLINE_CAP_MS);
  if (baseCps(snapshot) <= 0) return { elapsedMs, gain: 0 };
  const startN = snapshot.nutrients;
  const endN = Math.max(
    0,
    startN - CONST.NUTRIENT_DECAY_PER_S * (elapsedMs / 1000)
  );
  const avgN = (startN + endN) / 2;
  const water = waterActive(snapshot.waterUntil, now) ? CONST.WATER_MULT : 1;
  const prod =
    baseCps(snapshot) *
    soilById(snapshot.soilId).mult *
    prestigeMult(snapshot.seeds) *
    water *
    nutrientMult(avgN);
  return {
    elapsedMs,
    gain: Math.floor(prod * (elapsedMs / 1000)),
  };
}

/** Évolution de la patate selon le gain de vie. */
export function evolutionOf(lifetimeEarned: number) {
  let current = EVOLUTIONS[0];
  for (const e of EVOLUTIONS) {
    if (lifetimeEarned >= e.threshold) current = e;
  }
  return current;
}

/** Accessoires gagnés selon le nombre total d'achats. */
export function accessoriesOf(purchases: number): string[] {
  return ACCESSORIES.filter((a) => purchases >= a.purchases).map((a) => a.id);
}

/** Barème d'effets visuels selon le log10 du prix. */
export function fxTierForPrice(price: number): 1 | 2 | 3 | 4 {
  const l = Math.log10(Math.max(1, price));
  if (l < 3) return 1;
  if (l < 5) return 2;
  if (l < 7) return 3;
  return 4;
}

export function fxDescription(tier: 1 | 2 | 3 | 4): string {
  switch (tier) {
    case 1:
      return "quelques étincelles";
    case 2:
      return "confettis + flash";
    case 3:
      return "explosion plein écran + secousse + rayons";
    case 4:
      return "explosion mega + pluie de mini-patates";
  }
}

/** Tire une météo au hasard pondérée. */
export function weightedWeather(rng: Rng): WeatherType {
  const options = (Object.keys(WEATHER) as WeatherType[])
    .filter((t) => WEATHER[t].weight > 0)
    .map((t) => ({ t, w: WEATHER[t].weight }));
  const total = options.reduce((a, o) => a + o.w, 0);
  let roll = rng() * total;
  for (const o of options) {
    roll -= o.w;
    if (roll <= 0) return o.t;
  }
  return "sun";
}

/** Vérifie les succès atteints (retourne tous les ids mérités). */
export function achievementsEarned(
  snapshot: GameSnapshot,
  extras: { maxCombo: number; allSoils: boolean }
): string[] {
  const out: string[] = [];
  const earn = (id: string, cond: boolean) => {
    if (cond) out.push(id);
  };
  const total = totalBuildings(snapshot);
  earn("first_click", snapshot.clicks >= 1);
  earn("clicks_100", snapshot.clicks >= 100);
  earn("clicks_1000", snapshot.clicks >= 1000);
  earn("clicks_10000", snapshot.clicks >= 10000);
  earn("earned_1000", snapshot.lifetimeEarned >= 1000);
  earn("earned_100000", snapshot.lifetimeEarned >= 100_000);
  earn("earned_1m", snapshot.lifetimeEarned >= 1_000_000);
  earn("earned_100m", snapshot.lifetimeEarned >= 100_000_000);
  earn("earned_1b", snapshot.lifetimeEarned >= 1_000_000_000);
  earn("first_building", total >= 1);
  earn("buildings_50", total >= 50);
  earn("buildings_200", total >= 200);
  earn("soil_up", snapshot.soilId !== "basic");
  earn("all_soils", extras.allSoils);
  earn("first_prestige", snapshot.prestiges >= 1);
  earn("golden_1", snapshot.goldenClicks >= 1);
  earn("combo_max", extras.maxCombo >= CONST.COMBO_MAX - 0.01);
  return out;
}

export function achievementDef(id: string) {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
