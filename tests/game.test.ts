import { describe, expect, it } from "vitest";
import {
  buildingCost,
  baseCps,
  nutrientMult,
  prestigeMult,
  cps,
  clickPower,
  comboAfterClick,
  comboAfterGap,
  goldenGain,
  prestigeGain,
  computeOffline,
  evolutionOf,
  accessoriesOf,
  fxTierForPrice,
  weightedWeather,
  achievementsEarned,
  totalBuildings,
} from "../lib/game";
import { CONST } from "../lib/data";
import type { GameSnapshot } from "../lib/game";

function snap(p: Partial<GameSnapshot> = {}): GameSnapshot {
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
    ...p,
  };
}

const NOW = 1_000_000_000_000;

describe("buildingCost (coût exponentiel)", () => {
  it("coût de base au niveau 0", () => {
    expect(buildingCost(15, 1.15, 0)).toBe(15);
  });

  it("croît de façon exponentielle avec 1.15^n", () => {
    expect(buildingCost(15, 1.15, 1)).toBe(Math.ceil(15 * 1.15));
    expect(buildingCost(15, 1.15, 10)).toBe(Math.ceil(15 * 1.15 ** 10));
    expect(buildingCost(100, 1.15, 5)).toBe(Math.ceil(100 * 1.15 ** 5));
  });

  it("est strictement croissant", () => {
    let prev = 0;
    for (let n = 0; n < 60; n++) {
      const c = buildingCost(15, 1.15, n);
      expect(c).toBeGreaterThan(prev);
      prev = c;
    }
  });

  it("raffine la croissance par palier de 25", () => {
    const below = buildingCost(100, 1.15, 24);
    const at = buildingCost(100, 1.15, 25);
    // croissance accélérée : at/25 rapport plus élevé que 24
    const ratio25 = at / buildingCost(100, 1.15, 24);
    const ratioPlain = Math.pow(1.15, 1);
    expect(ratio25).toBeGreaterThan(ratioPlain);
    expect(at).toBeGreaterThan(below);
  });
});

describe("baseCps", () => {
  it("somme cps * niveau", () => {
    expect(baseCps(snap({ buildings: { worm: 2, scarecrow: 1 } }))).toBeCloseTo(1.2);
    expect(baseCps(snap({}))).toBe(0);
  });

  it("ignore les bâtiments inconnus", () => {
    expect(baseCps(snap({ buildings: { unknown: 3 } }))).toBe(0);
  });
});

describe("nutrientMult", () => {
  it("vide = 0.5, plein = 1.25, milieu = 0.875", () => {
    expect(nutrientMult(0)).toBe(0.5);
    expect(nutrientMult(1)).toBe(1.25);
    expect(nutrientMult(0.5)).toBeCloseTo(0.875);
  });

  it("bornes l'intervalle", () => {
    expect(nutrientMult(-1)).toBe(0.5);
    expect(nutrientMult(2)).toBe(1.25);
  });
});

describe("prestigeMult", () => {
  it("+2 % par graine", () => {
    expect(prestigeMult(0)).toBe(1);
    expect(prestigeMult(5)).toBeCloseTo(1.1);
    expect(prestigeMult(100)).toBeCloseTo(3);
    expect(prestigeMult(-3)).toBe(1);
  });
});

describe("cps", () => {
  it("combine tous les multiplicateurs", () => {
    const s = snap({
      buildings: { organic: 1 }, // 8 cps de base
      soilId: "volcanic", // ×3
      seeds: 5, // ×1.1
      nutrients: 1, // ×1.25
      waterUntil: NOW + 5000, // ×2
    });
    const v = cps(s, { now: NOW, weather: "rain" }); // ×1.5
    expect(v).toBeCloseTo(8 * 3 * 1.1 * 1.5 * 2 * 1.25, 6);
  });

  it("sans arrosage actif, pas de ×2", () => {
    const s = snap({ buildings: { organic: 1 }, waterUntil: NOW - 1 });
    expect(cps(s, { now: NOW, weather: "none" })).toBeCloseTo(8 * 1.25);
  });
});

describe("clickPower", () => {
  it("additifs + multiplicatifs + multiplicateurs globaux", () => {
    const s = snap({
      upgrades: ["glove", "goldhand", "turbo", "thumb"], // 1+1+50=52, ×4
      soilId: "volcanic", // ×3
      nutrients: 1, // ×1.25
      waterUntil: NOW + 1, // ×2
    });
    const v = clickPower(s, { now: NOW, weather: "sun" }); // ×1.25
    expect(v).toBeCloseTo(52 * 4 * 3 * 1.25 * 1.25 * 2, 6);
  });

  it("le combo booste le clic", () => {
    const s = snap({ upgrades: ["glove"], combo: CONST.COMBO_MAX });
    const v = clickPower(s, { now: NOW, weather: "none" });
    expect(v).toBeCloseTo((1 + 1) * 1.25 * 2.5, 6);
  });
});

describe("combo", () => {
  it("clic rapide -> +step, premier clic -> 0", () => {
    expect(comboAfterClick(0, 0, NOW)).toBe(0);
    expect(comboAfterClick(0, NOW - 500, NOW)).toBeCloseTo(0.08);
  });

  it("plafonné à COMBO_MAX", () => {
    expect(comboAfterClick(CONST.COMBO_MAX, NOW - 100, NOW)).toBe(CONST.COMBO_MAX);
  });

  it("gap > fenêtre -> décroissance", () => {
    expect(comboAfterGap(1, 1000, 1900)).toBe(1);
    expect(comboAfterGap(1, 1000, 2100)).toBeCloseTo(1 - 200 * CONST.COMBO_DECAY_PER_MS);
    expect(comboAfterGap(1, 1000, 999_999)).toBe(0);
  });
});

describe("goldenGain", () => {
  it("minimum 100", () => {
    expect(goldenGain(0, 0)).toBe(100);
  });

  it("max(40% banque, 2 min de cps)", () => {
    expect(goldenGain(1000, 0)).toBe(400);
    expect(goldenGain(0, 5)).toBe(600);
    expect(goldenGain(10000, 100)).toBe(12000);
  });
});

describe("prestigeGain", () => {
  it("sqrt(gagnés / 1M) arrondi au floor", () => {
    expect(prestigeGain(0)).toBe(0);
    expect(prestigeGain(1_000_000)).toBe(1);
    expect(prestigeGain(4_000_000)).toBe(2);
    expect(prestigeGain(9_000_000)).toBe(3);
    expect(prestigeGain(9_999_999)).toBe(3);
    expect(prestigeGain(10_000_000)).toBe(3);
    expect(prestigeGain(1e9)).toBe(31);
    expect(prestigeGain(-5)).toBe(0);
  });
});

describe("computeOffline", () => {
  it("aucun gain si absence < 1 min", () => {
    const r = computeOffline(snap({ buildings: { worm: 1 } }), NOW - 30_000, NOW);
    expect(r).toEqual({ elapsedMs: 0, gain: 0 });
  });

  it("aucun gain si pas de production passive", () => {
    const r = computeOffline(snap(), NOW - 3600_000, NOW);
    expect(r.gain).toBe(0);
  });

  it("production * durée, nutriments en moyenne", () => {
    // baseCps 10, sol ×1, pas de graine, pas d'eau, nutriments 1 -> 0
    // moyenne 0.5 -> ×0.875 -> 8.75/s
    const r = computeOffline(snap({ buildings: { scarecrow: 10 } }), NOW - 7200_000, NOW);
    expect(r.elapsedMs).toBe(7200_000);
    expect(r.gain).toBe(Math.floor(8.75 * 7200));
  });

  it("plafond à 8 h", () => {
    const r = computeOffline(snap({ buildings: { scarecrow: 1 } }), NOW - 10 * 3600_000, NOW);
    expect(r.elapsedMs).toBe(CONST.OFFLINE_CAP_MS);
  });

  it("moyenne des nutriments prise en compte", () => {
    // 10 min (600 s) : la jauge (180 s) est vidée -> fin = 0, moyenne = 0.5
    const r = computeOffline(snap({ buildings: { scarecrow: 1 } }), NOW - 600_000, NOW);
    expect(r.gain).toBe(Math.floor(nutrientMult(0.5) * 600));
  });
});

describe("evolutionOf", () => {
  it("suit les paliers de gain de vie", () => {
    expect(evolutionOf(0).id).toBe("basic");
    expect(evolutionOf(9999).id).toBe("basic");
    expect(evolutionOf(10_000).id).toBe("super");
    expect(evolutionOf(1e6).id).toBe("golden");
    expect(evolutionOf(1e8).id).toBe("cosmic");
    expect(evolutionOf(1e10).id).toBe("transcendent");
  });
});

describe("accessoriesOf", () => {
  it("débloque selon le nombre d'achats", () => {
    expect(accessoriesOf(0)).toEqual([]);
    expect(accessoriesOf(3)).toEqual(["hat"]);
    expect(accessoriesOf(8)).toEqual(["hat", "sunglasses"]);
    expect(accessoriesOf(40)).toEqual(["hat", "sunglasses", "crown", "cape", "aura"]);
    expect(accessoriesOf(60)).toHaveLength(6);
  });
});

describe("fxTierForPrice", () => {
  it("barème par log10 du prix", () => {
    expect(fxTierForPrice(50)).toBe(1);
    expect(fxTierForPrice(999)).toBe(1);
    expect(fxTierForPrice(1000)).toBe(2);
    expect(fxTierForPrice(99_999)).toBe(2);
    expect(fxTierForPrice(100_000)).toBe(3);
    expect(fxTierForPrice(9_999_999)).toBe(3);
    expect(fxTierForPrice(10_000_000)).toBe(4);
    expect(fxTierForPrice(1e12)).toBe(4);
  });
});

describe("weightedWeather", () => {
  it("retourne des types valides et suit le poids", () => {
    for (let i = 0; i < 200; i++) {
      const t = weightedWeather(() => 0.5 + Math.random() * 0.5);
      expect(["sun", "rain", "storm"]).toContain(t);
    }
    // roll 0 -> premier type pondéré (sun)
    expect(weightedWeather(() => 0)).toBe("sun");
    // roll très haut -> dernier type (storm)
    expect(weightedWeather(() => 0.999)).toBe("storm");
  });
});

describe("achievementsEarned", () => {
  it("mérite les succès atteints", () => {
    const s = snap({
      clicks: 1000,
      lifetimeEarned: 2_000_000,
      buildings: { worm: 50, scarecrow: 1 },
      soilId: "compost",
      prestiges: 1,
      goldenClicks: 1,
    });
    const got = achievementsEarned(s, { maxCombo: 1.49, allSoils: true });
    for (const id of [
      "first_click",
      "clicks_100",
      "clicks_1000",
      "earned_1000",
      "earned_100000",
      "earned_1m",
      "first_building",
      "buildings_50",
      "soil_up",
      "all_soils",
      "first_prestige",
      "golden_1",
      "combo_max",
    ]) {
      expect(got).toContain(id);
    }
    expect(got).not.toContain("clicks_10000");
    expect(got).not.toContain("earned_100m");
    expect(got).not.toContain("earned_1b");
    expect(got).not.toContain("buildings_200");
  });

  it("état initial : aucun succès", () => {
    expect(achievementsEarned(snap(), { maxCombo: 0, allSoils: false })).toEqual([]);
  });
});

describe("totalBuildings", () => {
  it("somme des niveaux", () => {
    expect(totalBuildings({ buildings: { a: 3, b: 4 } })).toBe(7);
    expect(totalBuildings({ buildings: {} })).toBe(0);
  });
});
