import { create } from "zustand";
import {
  CONST,
  SOILS,
  BUILDINGS,
  CLICK_UPGRADES,
  type WeatherType,
} from "../lib/data";
import {
  buildingCost,
  getBuilding,
  soilById,
  cps,
  clickPower,
  comboAfterClick,
  comboAfterGap,
  goldenGain,
  prestigeGain,
  computeOffline,
  achievementsEarned,
  achievementDef,
  weightedWeather,
  waterActive,
  totalBuildings,
  type GameSnapshot,
} from "../lib/game";
import { trackById } from "../lib/musicTracks";
import {
  defaultSnapshot,
  loadSave,
  writeSave,
  clearSave,
  importSave,
  exportSave,
  SAVE_VERSION,
  type GameFullState,
} from "../lib/persistence";
import { playSound, setSoundEnabled } from "../lib/sound";
import { primeAudio, setMuted, setFxVolume, setMusicVolume } from "../lib/audio";
import { musicEngine } from "../lib/music";
import { fireFx } from "../lib/fx";
import { fxTierForPrice } from "../lib/game";

export type PersistedState = ReturnType<typeof defaultSnapshot>;

export interface Toast {
  id: number;
  title: string;
  desc: string;
}

interface Ephemeral {
  mounted: boolean;
  lastTickAt: number;
  lastClickAt: number;
  weather: { type: WeatherType; until: number } | null;
  nextWeatherAt: number;
  golden: { x: number; y: number; until: number } | null;
  nextGoldenAt: number;
  lastClickFx: { seq: number; x: number; y: number; value: number } | null;
  toasts: Toast[];
  flash: { seq: number; big: boolean } | null;
  shaking: boolean;
  potatoRain: { seq: number; count: number } | null;
  offline: { elapsedMs: number; gain: number } | null;
  modal: null | "stats" | "prestige" | "settings";
  waterFxUntil: number;
  earthFxUntil: number;
  toastSeq: number;
  // notes déjà jouées sur le morceau sélectionné (pour l'indicateur de
  // progression ; remis à 0 quand on change de morceau)
  musicNotesPlayed: number;
}

export interface GameStore extends PersistedState, Ephemeral {
  boot: () => void;
  save: () => void;
  tick: (now: number) => void;
  clickPotato: (x?: number, y?: number) => void;
  clickGolden: () => void;
  buyBuilding: (id: string) => void;
  buyUpgrade: (id: string) => void;
  buySoil: (id: string) => void;
  buyTrack: (id: string) => void;
  selectTrack: (id: string) => void;
  toggleMusic: () => void;
  setMusicVolume: (v: number) => void;
  setFxVolume: (v: number) => void;
  water: () => void;
  addEarth: () => void;
  doPrestige: () => void;
  hardReset: () => void;
  toggleSound: () => void;
  ensureAudio: () => void;
  setModal: (m: GameStore["modal"]) => void;
  closeOffline: () => void;
  dismissToast: (id: number) => void;
  exportSaveCode: () => string;
  importSaveCode: (code: string) => boolean;
}

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function snapshotOf(s: GameStore): GameSnapshot {
  return {
    coins: s.coins,
    runEarned: s.runEarned,
    lifetimeEarned: s.lifetimeEarned,
    clicks: s.clicks,
    goldenClicks: s.goldenClicks,
    buildings: s.buildings,
    upgrades: s.upgrades,
    soilsUnlocked: s.soilsUnlocked,
    soilId: s.soilId,
    nutrients: s.nutrients,
    waterUntil: s.waterUntil,
    seeds: s.seeds,
    prestiges: s.prestiges,
    combo: s.combo,
  };
}

function stateOf(s: GameStore): GameFullState {
  const now = Date.now();
  return {
    coins: s.coins,
    runEarned: s.runEarned,
    lifetimeEarned: s.lifetimeEarned,
    clicks: s.clicks,
    goldenClicks: s.goldenClicks,
    buildings: s.buildings,
    upgrades: s.upgrades,
    soilsUnlocked: s.soilsUnlocked,
    soilId: s.soilId,
    nutrients: s.nutrients,
    waterUntil: s.waterUntil,
    waterReadyAt: s.waterReadyAt,
    achievements: s.achievements,
    seeds: s.seeds,
    prestiges: s.prestiges,
    lastSeen: now,
    earthAdds: s.earthAdds,
    soundOn: s.soundOn,
    playMs: s.playMs,
    maxCombo: s.maxCombo,
    combo: 0,
    musicUnlocked: s.musicUnlocked,
    musicSelected: s.musicSelected,
    musicOn: s.musicOn,
    musicVolume: s.musicVolume,
    fxVolume: s.fxVolume,
  };
}

/**
 * Synchronise le moteur de musique avec l'état. Plus de lecture en
 * arrière-plan : le moteur ne fait que mémoriser le morceau sélectionné —
 * les notes ne sonnent que quand le joueur clique sur la patate.
 */
function syncMusicEngine(s: GameStore): void {
  if (s.musicSelected) {
    if (musicEngine.trackId !== s.musicSelected) musicEngine.load(s.musicSelected);
  } else {
    musicEngine.load(null);
  }
}

function makeInitial(): GameStore {
  const now = Date.now();
  return {
    ...defaultSnapshot(),
    mounted: false,
    lastTickAt: now,
    lastClickAt: 0,
    weather: null,
    nextWeatherAt: now + rand(CONST.WEATHER_MIN_INTERVAL_MS, 90_000),
    golden: null,
    nextGoldenAt: now + rand(30_000, CONST.GOLDEN_MAX_INTERVAL_MS),
    lastClickFx: null,
    toasts: [],
    flash: null,
    shaking: false,
    potatoRain: null,
    offline: null,
    modal: null,
    waterFxUntil: 0,
    earthFxUntil: 0,
    toastSeq: 0,
    musicNotesPlayed: 0,
    boot: () => {},
    save: () => {},
    tick: () => {},
    clickPotato: () => {},
    clickGolden: () => {},
    buyBuilding: () => {},
    buyUpgrade: () => {},
    buySoil: () => {},
    buyTrack: () => {},
    selectTrack: () => {},
    toggleMusic: () => {},
    setMusicVolume: () => {},
    setFxVolume: () => {},
    water: () => {},
    addEarth: () => {},
    doPrestige: () => {},
    hardReset: () => {},
    toggleSound: () => {},
    ensureAudio: () => {},
    setModal: () => {},
    closeOffline: () => {},
    dismissToast: () => {},
    exportSaveCode: () => "",
    importSaveCode: () => false,
  };
}

export const useGame = create<GameStore>()((set, get) => {
  const pushToast = (title: string, desc: string) => {
    const s = get();
    const id = s.toastSeq + 1;
    set({ toasts: [...s.toasts, { id, title, desc }], toastSeq: id });
  };

  const earn = (amount: number) => {
    const s = get();
    set({
      coins: s.coins + amount,
      runEarned: s.runEarned + amount,
      lifetimeEarned: s.lifetimeEarned + amount,
    });
  };

  const checkAchievements = () => {
    const s = get();
    const earned = achievementsEarned(snapshotOf(s), {
      maxCombo: s.maxCombo,
      allSoils: s.soilsUnlocked.length >= SOILS.length,
    });
    const have = new Set(s.achievements);
    const fresh = earned.filter((id) => !have.has(id));
    if (fresh.length === 0) return;
    for (const id of fresh) {
      const def = achievementDef(id);
      if (def) pushToast(`Succès : ${def.name}`, def.desc);
    }
    set({ achievements: [...s.achievements, ...fresh] });
    playSound("toast");
  };

  return {
    ...makeInitial(),

    boot: () => {
      if (get().mounted) return;
      const now = Date.now();
      const save = loadSave();
      const fresh = defaultSnapshot();
      const base = save?.state ?? fresh;
      set({ ...base, mounted: true, lastTickAt: now });
      setSoundEnabled(get().soundOn);

      // Moteur de musique : le morceau est mémorisé ici ; aucune lecture ne
      // démarre toute seule (les notes ne sonnent qu'au clic sur la patate).
      musicEngine.load(get().musicSelected);

      // Gains hors-ligne
      if (save) {
        const off = computeOffline(snapshotOf(get()), base.lastSeen, now);
        if (off.gain > 0) {
          earn(off.gain);
          set({
            offline: { elapsedMs: off.elapsedMs, gain: off.gain },
            nutrients: Math.max(
              0,
              get().nutrients -
                CONST.NUTRIENT_DECAY_PER_S * (off.elapsedMs / 1000)
            ),
          });
        }
      }
      // Premières apparitions (météo / patate dorée)
      set({
        nextWeatherAt: now + rand(CONST.WEATHER_MIN_INTERVAL_MS, 90_000),
        nextGoldenAt: now + rand(30_000, CONST.GOLDEN_MAX_INTERVAL_MS),
      });
      checkAchievements();
    },

    save: () => {
      const s = get();
      if (!s.mounted) return;
      writeSave({ version: SAVE_VERSION, savedAt: Date.now(), state: stateOf(s) });
    },

    tick: (now: number) => {
      const s = get();
      if (!s.mounted) return;
      const dt = Math.min(60_000, Math.max(0, now - s.lastTickAt));
      if (dt === 0) return;
      const weatherType: WeatherType = s.weather?.type ?? "none";

      // Nutriments : décroissance + pluie
      const regen = weatherType === "rain" ? 0.02 : 0;
      const nutrients = Math.min(
        1,
        Math.max(0, s.nutrients - (CONST.NUTRIENT_DECAY_PER_S - regen) * (dt / 1000))
      );

      // Combo
      const combo = comboAfterGap(s.combo, s.lastClickAt, now);
      const maxCombo = Math.max(s.maxCombo, combo);

      // Production passive
      const prod = cps(
        { ...snapshotOf(s), nutrients, combo },
        { now, weather: weatherType }
      );
      const passive = prod * (dt / 1000);

      // Arrosage expiré
      let waterUntil = s.waterUntil;
      if (waterUntil !== 0 && waterUntil < now) waterUntil = 0;

      // Météo
      let weather = s.weather;
      let nextWeatherAt = s.nextWeatherAt;
      if (weather && weather.until < now) {
        weather = null;
        nextWeatherAt = now + rand(CONST.WEATHER_MIN_INTERVAL_MS, CONST.WEATHER_MAX_INTERVAL_MS);
      } else if (!weather && now >= nextWeatherAt) {
        const type = weightedWeather(Math.random);
        weather = { type, until: now + rand(CONST.WEATHER_MIN_DURATION_MS, CONST.WEATHER_MAX_DURATION_MS) };
        nextWeatherAt = weather.until + rand(CONST.WEATHER_MIN_INTERVAL_MS, CONST.WEATHER_MAX_INTERVAL_MS);
        playSound("weather");
      }

      // Patate dorée
      let golden = s.golden;
      let nextGoldenAt = s.nextGoldenAt;
      if (golden && golden.until < now) {
        golden = null;
        nextGoldenAt = now + rand(CONST.GOLDEN_MIN_INTERVAL_MS, CONST.GOLDEN_MAX_INTERVAL_MS);
      } else if (!golden && now >= nextGoldenAt) {
        if (Math.random() < 0.35) {
          golden = {
            x: 0.08 + Math.random() * 0.78,
            y: 0.12 + Math.random() * 0.5,
            until: now + CONST.GOLDEN_LIFETIME_MS,
          };
        }
        nextGoldenAt = now + rand(CONST.GOLDEN_MIN_INTERVAL_MS, CONST.GOLDEN_MAX_INTERVAL_MS);
      }

      set({
        lastTickAt: now,
        playMs: s.playMs + dt,
        nutrients,
        combo,
        maxCombo,
        coins: s.coins + passive,
        runEarned: s.runEarned + passive,
        lifetimeEarned: s.lifetimeEarned + passive,
        waterUntil,
        weather,
        nextWeatherAt,
        golden,
        nextGoldenAt,
      });
      checkAchievements();
    },

    clickPotato: (x = 0.5, y = 0.4) => {
      const now = Date.now();
      const s = get();
      const combo = comboAfterClick(s.combo, s.lastClickAt, now);
      const power = clickPower(
        { ...snapshotOf(s), combo },
        { now, weather: s.weather?.type ?? "none" }
      );
      const seq = (s.lastClickFx?.seq ?? 0) + 1;
      set({
        combo,
        lastClickAt: now,
        maxCombo: Math.max(s.maxCombo, combo),
        clicks: s.clicks + 1,
        coins: s.coins + power,
        runEarned: s.runEarned + power,
        lifetimeEarned: s.lifetimeEarned + power,
        lastClickFx: { seq, x, y, value: power },
      });
      playSound("click");
      // 1 clic = 1 note : le clic joue la note SUIVANTE du morceau (c'est le
      // joueur qui crée le rythme ; plus de lecture en arrière-plan — si on
      // s'arrête de cliquer, le son s'arrête).
      if (s.musicOn && s.musicSelected) {
        const consumed = musicEngine.playNext();
        if (consumed >= 0) set({ musicNotesPlayed: consumed });
      }
      checkAchievements();
    },

    clickGolden: () => {
      const now = Date.now();
      const s = get();
      if (!s.golden) return;
      const g = goldenGain(
        s.coins,
        cps(snapshotOf(s), { now, weather: s.weather?.type ?? "none" })
      );
      const { x, y } = s.golden;
      earn(g);
      set({
        goldenClicks: s.goldenClicks + 1,
        golden: null,
        nextGoldenAt: now + rand(CONST.GOLDEN_MIN_INTERVAL_MS, CONST.GOLDEN_MAX_INTERVAL_MS),
      });
      fireFx(3, x, y, "#ffd23f");
      pushToast("Patate dorée !", `+${Math.floor(g).toLocaleString("fr-FR")} patacoins`);
      playSound("golden");
      checkAchievements();
    },

    buyBuilding: (id) => {
      const s = get();
      const def = getBuilding(id);
      if (!def) return;
      const level = s.buildings[id] ?? 0;
      const cost = buildingCost(def.baseCost, def.growth, level);
      if (s.coins < cost) {
        playSound("denied");
        return;
      }
      set({
        coins: s.coins - cost,
        buildings: { ...s.buildings, [id]: level + 1 },
      });
      fireFx(fxTierForPrice(cost), 0.5, 0.45);
      playSound("buy");
      checkAchievements();
    },

    buyUpgrade: (id) => {
      const s = get();
      const def = CLICK_UPGRADES.find((u) => u.id === id);
      if (!def || s.upgrades.includes(id)) return;
      if (s.coins < def.cost) {
        playSound("denied");
        return;
      }
      set({
        coins: s.coins - def.cost,
        upgrades: [...s.upgrades, id],
      });
      fireFx(fxTierForPrice(def.cost), 0.5, 0.45);
      playSound("buy");
      checkAchievements();
    },

    buySoil: (id) => {
      const s = get();
      const def = soilById(id);
      if (!def) return;
      if (s.soilsUnlocked.includes(id)) {
        if (s.soilId !== id) set({ soilId: id });
        return;
      }
      if (s.coins < def.cost) {
        playSound("denied");
        return;
      }
      set({
        coins: s.coins - def.cost,
        soilsUnlocked: [...s.soilsUnlocked, id],
        soilId: id,
      });
      fireFx(fxTierForPrice(def.cost), 0.5, 0.8);
      pushToast("Nouvelle terre !", def.name);
      playSound("buy");
      checkAchievements();
    },

    buyTrack: (id) => {
      const s = get();
      const def = trackById(id);
      if (!def) return;
      if (s.musicUnlocked.includes(id)) {
        get().selectTrack(id);
        return;
      }
      if (s.seeds < def.cost) {
        playSound("denied");
        return;
      }
      set({
        seeds: s.seeds - def.cost,
        musicUnlocked: [...s.musicUnlocked, id],
        musicSelected: id,
        musicOn: true,
        musicNotesPlayed: 0,
      });
      pushToast("Nouveau morceau !", def.name);
      playSound("prestige");
      syncMusicEngine(get());
      get().save();
    },

    selectTrack: (id) => {
      const s = get();
      const def = trackById(id);
      if (!def || !s.musicUnlocked.includes(id)) return;
      set({ musicSelected: id, musicNotesPlayed: 0 });
      syncMusicEngine(get());
      get().save();
    },

    toggleMusic: () => {
      const s = get();
      if (s.musicOn && !s.musicSelected) return;
      set({ musicOn: !s.musicOn });
      syncMusicEngine(get());
      get().save();
    },

    setMusicVolume: (v) => {
      const vol = Math.min(1, Math.max(0, v));
      set({ musicVolume: vol });
      setMusicVolume(vol);
      get().save();
    },

    setFxVolume: (v) => {
      const vol = Math.min(1, Math.max(0, v));
      set({ fxVolume: vol });
      setFxVolume(vol);
      get().save();
    },

    water: () => {
      const now = Date.now();
      const s = get();
      if (waterActive(s.waterUntil, now) || now < s.waterReadyAt) {
        playSound("denied");
        return;
      }
      set({
        waterUntil: now + CONST.WATER_DURATION_MS,
        waterReadyAt: now + CONST.WATER_COOLDOWN_MS,
        waterFxUntil: now + 2000,
      });
      playSound("weather");
    },

    addEarth: () => {
      const now = Date.now();
      const s = get();
      if (now < s.earthFxUntil || s.coins < CONST.EARTH_COST) {
        playSound("denied");
        return;
      }
      set({
        coins: s.coins - CONST.EARTH_COST,
        nutrients: 1,
        earthAdds: s.earthAdds + 1,
        earthFxUntil: now + CONST.EARTH_COOLDOWN_MS,
      });
      fireFx(1, 0.5, 0.75);
      playSound("buy");
    },

    doPrestige: () => {
      const s = get();
      const gain = prestigeGain(s.runEarned);
      if (gain < 1) {
        playSound("denied");
        return;
      }
      set({
        coins: 0,
        runEarned: 0,
        buildings: {},
        upgrades: [],
        soilId: "basic",
        nutrients: 1,
        waterUntil: 0,
        waterReadyAt: 0,
        combo: 0,
        seeds: s.seeds + gain,
        prestiges: s.prestiges + 1,
        modal: null,
      });
      fireFx(4, 0.5, 0.4);
      pushToast("Replanté !", `+${gain} graines légendaires (+${gain * 2} % permanent)`);
      playSound("prestige");
      checkAchievements();
      get().save();
    },

    hardReset: () => {
      clearSave();
      musicEngine.load(null);
      const fresh = defaultSnapshot();
      set({
        ...fresh,
        mounted: true,
        lastTickAt: Date.now(),
        lastClickAt: 0,
        weather: null,
        golden: null,
        toasts: [],
        flash: null,
        shaking: false,
        potatoRain: null,
        offline: null,
        modal: null,
        waterFxUntil: 0,
        earthFxUntil: 0,
      });
      setSoundEnabled(false);
    },

    toggleSound: () => {
      const s = get();
      const soundOn = !s.soundOn;
      set({ soundOn });
      setSoundEnabled(soundOn);
      if (soundOn) playSound("toast");
      get().save();
    },

    /**
     * À appeler sur chaque geste utilisateur (pointerdown/keydown) :
     * débloque l'AudioContext (règles navigateur/WebView) puis applique
     * volumes et lecture de la musique.
     */
    ensureAudio: () => {
      const ready = primeAudio();
      if (!ready) return;
      const s = get();
      setMuted(!s.soundOn);
      setFxVolume(s.fxVolume);
      setMusicVolume(s.musicVolume);
      // Aucune lecture à redémarrer : les notes ne sonnent qu'au clic
      // (le moteur lit l'AudioContext au moment du clic).
    },

    setModal: (m) => set({ modal: m }),

    closeOffline: () => set({ offline: null }),

    dismissToast: (id) =>
      set({ toasts: get().toasts.filter((t) => t.id !== id) }),

    exportSaveCode: () => {
      const s = get();
      return exportSave({ version: SAVE_VERSION, savedAt: Date.now(), state: stateOf(s) });
    },

    importSaveCode: (code) => importSave(code),
  };
});

/** Sélecteur pratique : aperçu de la production courante. */
export function useCpsPreview() {
  return useGame((s) =>
    s.mounted
      ? cps(snapshotOf(s), {
          now: Date.now(),
          weather: s.weather?.type ?? "none",
        })
      : 0
  );
}

/** Nombre total de bâtiments (pour les succès / accessoires). */
export function useTotalBuildings(): number {
  return useGame((s) => totalBuildings(s));
}

export { BUILDINGS, CLICK_UPGRADES, SOILS };
