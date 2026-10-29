import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CONST } from "../lib/data";
import { clearSave, defaultSnapshot, loadSave, writeSave } from "../lib/persistence";

type FakeStorage = {
  getItem: (k: string) => string | null;
  setItem: (k: string, v: string) => void;
  removeItem: (k: string) => void;
};

function makeStorage(): FakeStorage {
  const map = new Map<string, string>();
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
  };
}

beforeEach(() => {
  (globalThis as unknown as { window: { localStorage: FakeStorage } }).window = {
    localStorage: makeStorage(),
  };
});

afterEach(() => {
  delete (globalThis as unknown as { window?: unknown }).window;
});

describe("persistence (localStorage)", () => {
  it("sauvegarde puis recharge l'état", () => {
    const snap = defaultSnapshot();
    snap.coins = 1234.5;
    snap.buildings = { worm: 3 };
    snap.seeds = 2;
    snap.achievements = ["first_click"];
    snap.soilId = "volcanic";
    snap.soilsUnlocked = ["basic", "volcanic"];
    writeSave({ v: 1, savedAt: snap.lastSeen, state: snap });
    const loaded = loadSave();
    expect(loaded).not.toBeNull();
    expect(loaded?.state.coins).toBe(1234.5);
    expect(loaded?.state.buildings.worm).toBe(3);
    expect(loaded?.state.seeds).toBe(2);
    expect(loaded?.state.achievements).toContain("first_click");
    expect(loaded?.state.soilId).toBe("volcanic");
  });

  it("retourne null si aucune sauvegarde", () => {
    expect(loadSave()).toBeNull();
  });

  it("assainit une sauvegarde corrompue", () => {
    const st = (globalThis as unknown as { window: { localStorage: FakeStorage } })
      .window.localStorage;
    st.setItem(
      CONST.SAVE_KEY,
      JSON.stringify({
        v: 1,
        state: {
          coins: "beaucoup",
          soilId: "inexistant",
          nutrients: 5,
          buildings: { unknown: -1, worm: 2.9 },
          upgrades: ["glove", 42],
        },
      })
    );
    const loaded = loadSave();
    expect(loaded).not.toBeNull();
    expect(loaded?.state.coins).toBe(0);
    expect(loaded?.state.soilId).toBe("basic");
    expect(loaded?.state.nutrients).toBe(1);
    expect(loaded?.state.buildings).toEqual({ worm: 2 });
    expect(loaded?.state.upgrades).toEqual(["glove"]);
  });

  it("ignore un JSON invalide", () => {
    const st = (globalThis as unknown as { window: { localStorage: FakeStorage } })
      .window.localStorage;
    st.setItem(CONST.SAVE_KEY, "{pas du json");
    expect(loadSave()).toBeNull();
  });

  it("clearSave supprime la sauvegarde", () => {
    const snap = defaultSnapshot();
    writeSave({ v: 1, savedAt: snap.lastSeen, state: snap });
    clearSave();
    expect(loadSave()).toBeNull();
  });

  it("un sol non débloqué repart sur la terre basique", () => {
    const st = (globalThis as unknown as { window: { localStorage: FakeStorage } })
      .window.localStorage;
    st.setItem(
      CONST.SAVE_KEY,
      JSON.stringify({
        v: 1,
        state: { soilId: "cosmic", soilsUnlocked: ["basic"] },
      })
    );
    expect(loadSave()?.state.soilId).toBe("basic");
  });
});
