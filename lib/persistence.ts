// Persistance localStorage : format versionné + migrations.
//
// - La sauvegarde porte un champ `version` (2 = format courant). Les anciens
//   fichiers v1 (champ `v`) sont migrés automatiquement au chargement.
// - Une sauvegarde illisible (JSON cassé, version inconnue) n'est JAMAIS
//   effacée : elle est mise de côté sous la clé de secours `SAVE_BACKUP_KEY`
//   pour pouvoir être récupérée à la main.
// - Export/Import : code texte copiable (base64 du JSON) dans les réglages,
//   filet de sécurité au moment de changer d'appareil ou d'APK.

import { CONST, SOILS } from "./data";
import { trackById, TRACK_IDS } from "./musicTracks";

/** Version du format de sauvegarde (incrimenter = migrer). */
export const SAVE_VERSION = 2;

export interface GameFullState {
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
  waterReadyAt: number; // ms timestamp
  achievements: string[];
  seeds: number;
  prestiges: number;
  lastSeen: number; // ms timestamp
  earthAdds: number;
  soundOn: boolean;
  playMs: number;
  maxCombo: number;
  combo: number; // toujours sauvegardé à 0 (jamais pertinent au chargement)
  // ---- v2 : musique ----
  musicUnlocked: string[]; // ids de morceaux débloqués
  musicSelected: string | null; // morceau sélectionné (joué en boucle)
  musicOn: boolean;
  musicVolume: number; // 0..1
  fxVolume: number; // 0..1
  clickNote: boolean; // mode « 1 clic = 1 note »
}

export interface SaveFile {
  version: number; // SAVE_VERSION
  savedAt: number;
  state: GameFullState;
}

export function defaultSnapshot(): GameFullState {
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
    waterReadyAt: 0,
    achievements: [],
    seeds: 0,
    prestiges: 0,
    lastSeen: Date.now(),
    earthAdds: 0,
    soundOn: false,
    playMs: 0,
    maxCombo: 0,
    combo: 0,
    musicUnlocked: [],
    musicSelected: null,
    musicOn: false,
    musicVolume: 0.6,
    fxVolume: 0.6,
    clickNote: false,
  };
}

function num(v: unknown, fallback: number): number {
  return typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : fallback;
}

/** Complète / corrige un état partiel avec des valeurs sûres. */
export function sanitizeState(raw: unknown): GameFullState {
  const d = defaultSnapshot();
  const s = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const state: GameFullState = {
    ...d,
    coins: num(s.coins, d.coins),
    runEarned: num(s.runEarned, d.runEarned),
    lifetimeEarned: num(s.lifetimeEarned, d.lifetimeEarned),
    clicks: num(s.clicks, d.clicks),
    goldenClicks: num(s.goldenClicks, d.goldenClicks),
    buildings:
      s.buildings && typeof s.buildings === "object"
        ? Object.fromEntries(
            Object.entries(s.buildings as Record<string, unknown>)
              .filter(([, v]) => typeof v === "number" && Number.isFinite(v) && (v as number) >= 0)
              .map(([k, v]) => [k, Math.floor(v as number)])
          )
        : {},
    upgrades: Array.isArray(s.upgrades) ? s.upgrades.filter((x) => typeof x === "string") : [],
    soilsUnlocked: Array.isArray(s.soilsUnlocked)
      ? [...new Set([...s.soilsUnlocked.filter((x) => typeof x === "string" && SOILS.some((so) => so.id === x)), "basic"])]
      : ["basic"],
    soilId: typeof s.soilId === "string" && SOILS.some((so) => so.id === s.soilId) ? (s.soilId as string) : "basic",
    nutrients: Math.min(1, Math.max(0, num(s.nutrients, d.nutrients))),
    waterUntil: num(s.waterUntil, d.waterUntil),
    waterReadyAt: num(s.waterReadyAt, d.waterReadyAt),
    achievements: Array.isArray(s.achievements)
      ? s.achievements.filter((x) => typeof x === "string")
      : [],
    seeds: num(s.seeds, d.seeds),
    prestiges: num(s.prestiges, d.prestiges),
    lastSeen: num(s.lastSeen, d.lastSeen),
    earthAdds: num(s.earthAdds, d.earthAdds),
    soundOn: typeof s.soundOn === "boolean" ? s.soundOn : false,
    playMs: num(s.playMs, d.playMs),
    maxCombo: num(s.maxCombo, d.maxCombo),
    combo: 0,
    musicUnlocked: Array.isArray(s.musicUnlocked)
      ? [...new Set(s.musicUnlocked.filter((x): x is string => typeof x === "string" && TRACK_IDS.has(x)))]
      : [],
    musicSelected:
      typeof s.musicSelected === "string" && TRACK_IDS.has(s.musicSelected) ? s.musicSelected : null,
    musicOn: typeof s.musicOn === "boolean" ? s.musicOn : false,
    musicVolume: Math.min(1, Math.max(0, num(s.musicVolume, d.musicVolume))),
    fxVolume: Math.min(1, Math.max(0, num(s.fxVolume, d.fxVolume))),
    clickNote: typeof s.clickNote === "boolean" ? s.clickNote : false,
  };
  // Sol actif mais non possédé ? on repart sur un sol possédé.
  if (!state.soilsUnlocked.includes(state.soilId)) state.soilId = "basic";
  // Morceau sélectionné mais non débloqué ? on le désélectionne.
  if (state.musicSelected && !state.musicUnlocked.includes(state.musicSelected)) {
    state.musicSelected = null;
  }
  if (state.musicSelected && !trackById(state.musicSelected)) state.musicSelected = null;
  return state;
}

/**
 * Migre n'importe quel objet brut vers le format courant.
 * - v1 (champ `v`) -> v2 : ajoute les champs musique par défaut.
 * - v2 (champ `version: 2`) -> normalisé tel quel.
 * - toute autre version -> null (inconnue : on ne devine pas).
 */
export function migrate(raw: unknown): SaveFile | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const version =
    typeof r.version === "number" ? r.version : typeof r.v === "number" ? r.v : 1;
  if (version !== 1 && version !== 2) return null;
  const state = sanitizeState(r.state);
  return {
    version: SAVE_VERSION,
    savedAt: num(r.savedAt, state.lastSeen),
    state,
  };
}

function tryParse(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function storage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/**
 * Met de côté une sauvegarde illisible sans l'effacer :
 * le contenu brut est copié sous SAVE_BACKUP_KEY (le plus récent gagne),
 * l'entrée d'origine est retirée (les données restent disponibles).
 */
function setAside(ls: Storage, raw: string, sourceKey: string): void {
  try {
    ls.setItem(
      CONST.SAVE_BACKUP_KEY,
      `${raw}\n# mise de côté le ${new Date().toISOString()} depuis la clé ${sourceKey}`
    );
  } catch {
    // quota : on ne force pas
  }
  ls.removeItem(sourceKey);
}

/** Charge la sauvegarde (ou null). Gère la migration v1 -> v2 et les pannes. */
export function loadSave(): SaveFile | null {
  const ls = storage();
  if (!ls) return null;

  // 1) clé courante
  const rawNew = ls.getItem(CONST.SAVE_KEY);
  if (rawNew !== null) {
    const save = migrate(tryParse(rawNew));
    if (save) {
      // une vieille version trouvée dans la clé courante est ré-écrite en v2
      const parsed = tryParse(rawNew) as { version?: unknown } | null;
      if (parsed && parsed.version !== SAVE_VERSION) writeSave(save);
      return save;
    }
    setAside(ls, rawNew, CONST.SAVE_KEY);
    return null;
  }

  // 2) clé historique v1 : on migre puis on déplace vers la clé courante
  const rawOld = ls.getItem(CONST.LEGACY_SAVE_KEY);
  if (rawOld !== null) {
    const save = migrate(tryParse(rawOld));
    if (save) {
      if (writeSave(save)) ls.removeItem(CONST.LEGACY_SAVE_KEY);
      return save;
    }
    setAside(ls, rawOld, CONST.LEGACY_SAVE_KEY);
    return null;
  }

  return null;
}

export function writeSave(save: SaveFile): boolean {
  const ls = storage();
  if (!ls) return false;
  try {
    ls.setItem(CONST.SAVE_KEY, JSON.stringify(save));
    return true;
  } catch {
    return false;
  }
}

export function clearSave(): void {
  const ls = storage();
  if (!ls) return;
  try {
    ls.removeItem(CONST.SAVE_KEY);
    ls.removeItem(CONST.LEGACY_SAVE_KEY);
  } catch {
    // ignoré
  }
}

// ---------- Export / Import (filet de sécurité) ----------

const EXPORT_PREFIX = "POTATO2:";

function b64Encode(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin);
}

function b64Decode(b64: string): string | null {
  try {
    const bin = atob(b64.replace(/\s/g, ""));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

/** Code texte de la sauvegarde courante (à copier-coller). */
export function exportSave(save: SaveFile): string {
  return EXPORT_PREFIX + b64Encode(JSON.stringify(save));
}

/**
 * Importe un code de sauvegarde (exporté ici ou sur un autre appareil).
 * Retourne true si la sauvegarde a été remplacée ; false sinon (le jeu
 * existant n'est pas touché).
 */
export function importSave(code: string): boolean {
  const t = code.trim();
  if (!t.startsWith(EXPORT_PREFIX)) return false;
  const json = b64Decode(t.slice(EXPORT_PREFIX.length));
  if (!json) return false;
  const save = migrate(tryParse(json));
  if (!save) return false;
  return writeSave(save);
}
