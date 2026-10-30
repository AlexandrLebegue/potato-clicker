import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CONST } from "../lib/data";
import { MUSIC_TRACKS } from "../lib/musicTracks";
import {
  clearSave,
  defaultSnapshot,
  exportSave,
  importSave,
  loadSave,
  migrate,
  writeSave,
  SAVE_VERSION,
  type SaveFile,
} from "../lib/persistence";

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

function st() {
  return (globalThis as unknown as { window: { localStorage: FakeStorage } }).window
    .localStorage;
}

/** Sauvegarde v1 « historique » (champ `v`, pas de musique). */
function makeV1(raw: Record<string, unknown> = {}) {
  return {
    v: 1,
    savedAt: 1_700_000_000_000,
    state: {
      coins: 500,
      runEarned: 2000000,
      lifetimeEarned: 5000000,
      clicks: 123,
      goldenClicks: 1,
      buildings: { worm: 4, scarecrow: 2 },
      upgrades: ["glove", "turbo"],
      soilsUnlocked: ["basic", "compost", "volcanic"],
      soilId: "volcanic",
      nutrients: 0.8,
      waterUntil: 0,
      waterReadyAt: 0,
      achievements: ["first_click", "first_building"],
      seeds: 3,
      prestiges: 1,
      combo: 0,
      lastSeen: 1_700_000_000_000,
      earthAdds: 7,
      soundOn: true,
      playMs: 3600_000,
      maxCombo: 1.5,
      ...raw,
    },
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

describe("persistence (localStorage, format versionné)", () => {
  it("sauvegarde puis recharge l'état (format courant)", () => {
    const snap = defaultSnapshot();
    snap.coins = 1234.5;
    snap.buildings = { worm: 3 };
    snap.seeds = 2;
    snap.achievements = ["first_click"];
    snap.soilId = "volcanic";
    snap.soilsUnlocked = ["basic", "volcanic"];
    snap.musicUnlocked = [MUSIC_TRACKS[0].id];
    snap.musicSelected = MUSIC_TRACKS[0].id;
    writeSave({ version: SAVE_VERSION, savedAt: snap.lastSeen, state: snap });
    const loaded = loadSave();
    expect(loaded).not.toBeNull();
    expect(loaded?.version).toBe(SAVE_VERSION);
    expect(loaded?.state.coins).toBe(1234.5);
    expect(loaded?.state.buildings.worm).toBe(3);
    expect(loaded?.state.seeds).toBe(2);
    expect(loaded?.state.achievements).toContain("first_click");
    expect(loaded?.state.soilId).toBe("volcanic");
    expect(loaded?.state.musicSelected).toBe(MUSIC_TRACKS[0].id);
  });

  it("retourne null si aucune sauvegarde", () => {
    expect(loadSave()).toBeNull();
  });

  it("assainit une sauvegarde corrompue", () => {
    st().setItem(
      CONST.SAVE_KEY,
      JSON.stringify({
        version: 2,
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

  it("met de côté un JSON invalide sans l'effacer", () => {
    const junk = "{pas du json";
    st().setItem(CONST.SAVE_KEY, junk);
    expect(loadSave()).toBeNull();
    // l'entrée d'origine a été déplacée…
    expect(st().getItem(CONST.SAVE_KEY)).toBeNull();
    // …vers la clé de secours, contenu intact
    const backup = st().getItem(CONST.SAVE_BACKUP_KEY) ?? "";
    expect(backup.startsWith(junk)).toBe(true);
  });

  it("met de côté une version inconnue", () => {
    st().setItem(CONST.SAVE_KEY, JSON.stringify({ version: 99, state: { coins: 10 } }));
    expect(loadSave()).toBeNull();
    expect(st().getItem(CONST.SAVE_KEY)).toBeNull();
    expect(st().getItem(CONST.SAVE_BACKUP_KEY)).not.toBeNull();
  });

  it("migre une sauvegarde v1 (champ `v`) vers le format v2", () => {
    st().setItem(CONST.SAVE_KEY, JSON.stringify(makeV1()));
    const loaded = loadSave();
    expect(loaded).not.toBeNull();
    expect(loaded?.version).toBe(SAVE_VERSION);
    // l'ancienne partie est conservée…
    expect(loaded?.state.coins).toBe(500);
    expect(loaded?.state.seeds).toBe(3);
    expect(loaded?.state.soilId).toBe("volcanic");
    expect(loaded?.state.buildings.worm).toBe(4);
    expect(loaded?.state.soundOn).toBe(true);
    // …et les nouveaux champs musique sont ajoutés avec des valeurs sûres
    expect(loaded?.state.musicUnlocked).toEqual([]);
    expect(loaded?.state.musicSelected).toBeNull();
    expect(loaded?.state.musicOn).toBe(false);
    expect(loaded?.state.musicVolume).toBeGreaterThan(0);
    expect(loaded?.state.fxVolume).toBeGreaterThan(0);
    expect(loaded?.state.clickNote).toBe(false);
    // la migration a été écrite dans la clé courante
    expect(st().getItem(CONST.SAVE_KEY)).toContain(`"version":${SAVE_VERSION}`);
  });

  it("migre une sauvegarde v1 depuis l'ancienne clé localStorage", () => {
    st().setItem(CONST.LEGACY_SAVE_KEY, JSON.stringify(makeV1({ coins: 42 })));
    const loaded = loadSave();
    expect(loaded?.version).toBe(SAVE_VERSION);
    expect(loaded?.state.coins).toBe(42);
    // l'ancienne clé a été consommée (migration réussie)
    expect(st().getItem(CONST.LEGACY_SAVE_KEY)).toBeNull();
    expect(st().getItem(CONST.SAVE_KEY)).not.toBeNull();
  });

  it("met de côté une ancienne clé v1 illisible", () => {
    st().setItem(CONST.LEGACY_SAVE_KEY, "{corrompu");
    expect(loadSave()).toBeNull();
    expect(st().getItem(CONST.LEGACY_SAVE_KEY)).toBeNull();
    const backup = st().getItem(CONST.SAVE_BACKUP_KEY) ?? "";
    expect(backup).toContain("{corrompu");
  });

  it("clearSave supprime la sauvegarde (clé courante + clé historique)", () => {
    const snap = defaultSnapshot();
    writeSave({ version: SAVE_VERSION, savedAt: snap.lastSeen, state: snap });
    st().setItem(CONST.LEGACY_SAVE_KEY, JSON.stringify(makeV1()));
    clearSave();
    expect(loadSave()).toBeNull();
    expect(st().getItem(CONST.SAVE_KEY)).toBeNull();
    expect(st().getItem(CONST.LEGACY_SAVE_KEY)).toBeNull();
  });

  it("un sol non débloqué repart sur la terre basique", () => {
    st().setItem(
      CONST.SAVE_KEY,
      JSON.stringify({
        version: 2,
        state: { soilId: "cosmic", soilsUnlocked: ["basic"] },
      })
    );
    expect(loadSave()?.state.soilId).toBe("basic");
  });

  it("un morceau sélectionné mais non débloqué est désélectionné", () => {
    const id = MUSIC_TRACKS[0].id;
    st().setItem(
      CONST.SAVE_KEY,
      JSON.stringify({
        version: 2,
        state: { musicUnlocked: [], musicSelected: id, musicOn: true },
      })
    );
    const loaded = loadSave();
    expect(loaded?.state.musicSelected).toBeNull();
  });
});

describe("export / import de la sauvegarde", () => {
  function sampleSave(): SaveFile {
    const s = defaultSnapshot();
    s.coins = 777;
    s.lifetimeEarned = 99999;
    s.clicks = 42;
    s.buildings = { worm: 2, tractor: 1 };
    s.upgrades = ["glove"];
    s.seeds = 5;
    s.prestiges = 2;
    s.achievements = ["first_click", "clicks_100"];
    s.soilId = "compost";
    s.soilsUnlocked = ["basic", "compost"];
    s.nutrients = 0.42;
    s.musicUnlocked = [MUSIC_TRACKS[0].id, MUSIC_TRACKS[1].id];
    s.musicSelected = MUSIC_TRACKS[1].id;
    s.musicOn = true;
    s.musicVolume = 0.7;
    s.fxVolume = 0.3;
    s.clickNote = true;
    s.soundOn = true;
    return { version: SAVE_VERSION, savedAt: s.lastSeen, state: s };
  }

  it("aller-retour : exporter puis importer restaure la partie", () => {
    const save = sampleSave();
    writeSave(save);

    const code = exportSave(save);
    expect(code).toMatch(/^POTATO2:[A-Za-z0-9+/=]+$/);

    // on simule un appareil neuf : storage vide
    const fresh = makeStorage();
    (globalThis as unknown as { window: { localStorage: FakeStorage } }).window = {
      localStorage: fresh,
    };
    expect(loadSave()).toBeNull();

    expect(importSave(code)).toBe(true);
    const loaded = loadSave();
    expect(loaded).not.toBeNull();
    expect(loaded?.version).toBe(SAVE_VERSION);
    expect(loaded?.state.coins).toBe(777);
    expect(loaded?.state.lifetimeEarned).toBe(99999);
    expect(loaded?.state.buildings).toEqual({ worm: 2, tractor: 1 });
    expect(loaded?.state.upgrades).toEqual(["glove"]);
    expect(loaded?.state.seeds).toBe(5);
    expect(loaded?.state.prestiges).toBe(2);
    expect(loaded?.state.achievements).toEqual(["first_click", "clicks_100"]);
    expect(loaded?.state.soilId).toBe("compost");
    expect(loaded?.state.musicSelected).toBe(MUSIC_TRACKS[1].id);
    expect(loaded?.state.clickNote).toBe(true);
    expect(loaded?.state.soundOn).toBe(true);
  });

  it("un export d'une sauvegarde v1 migre à l'import", () => {
    const v1 = makeV1({ coins: 31 });
    const code =
      "POTATO2:" +
      btoa(
        Array.from(new TextEncoder().encode(JSON.stringify(v1))).map((c) => String.fromCharCode(c)).join("")
      );
    expect(importSave(code)).toBe(true);
    const loaded = loadSave();
    expect(loaded?.version).toBe(SAVE_VERSION);
    expect(loaded?.state.coins).toBe(31);
  });

  it("rejette un code invalide sans toucher à la partie", () => {
    const save = sampleSave();
    writeSave(save);
    expect(importSave("")).toBe(false);
    expect(importSave("POTATO2:!!pas du base64!!")).toBe(false);
    expect(importSave("AUTRE:" + btoa("x"))).toBe(false);
    expect(importSave("POTATO2:" + btoa("{bad json"))).toBe(false);
    expect(loadSave()?.state.coins).toBe(777);
  });

  it("importSave migre via `migrate` même sans clé de version", () => {
    // un objet v1 « nu » (ni v ni version) est traité comme v1
    expect(migrate({ state: { coins: 5 } })?.version).toBe(SAVE_VERSION);
    expect(migrate({ state: { coins: 5 } })?.state.coins).toBe(5);
    expect(migrate({ version: 3, state: {} })).toBeNull();
    expect(migrate(null)).toBeNull();
    expect(migrate("non objet")).toBeNull();
  });
});
