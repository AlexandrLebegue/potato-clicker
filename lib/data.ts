// Définitions du jeu : bâtiments, améliorations de clic, terres,
// succès, météo, évolutions, accessoires. Données pures (pas de React).

export interface BuildingDef {
  id: string;
  name: string;
  desc: string;
  baseCost: number;
  cps: number;
  growth: number;
  icon: string;
}

export const BUILDINGS: BuildingDef[] = [
  {
    id: "worm",
    name: "Ver de terre",
    desc: "Il retourne la terre avec amour.",
    baseCost: 15,
    cps: 0.1,
    growth: 1.15,
    icon: "worm",
  },
  {
    id: "scarecrow",
    name: "Épouvantail",
    desc: "Il effraie les oiseaux voraces.",
    baseCost: 100,
    cps: 1,
    growth: 1.15,
    icon: "scarecrow",
  },
  {
    id: "organic",
    name: "Ferme bio",
    desc: "Des patates certifiées mignonnes.",
    baseCost: 1100,
    cps: 8,
    growth: 1.15,
    icon: "farm",
  },
  {
    id: "tractor",
    name: "Tracteur",
    desc: "Il laboure à toute vitesse.",
    baseCost: 12000,
    cps: 47,
    growth: 1.16,
    icon: "tractor",
  },
  {
    id: "fry",
    name: "Usine à frites",
    desc: "Chaque patate a une destination.",
    baseCost: 130000,
    cps: 260,
    growth: 1.16,
    icon: "fry",
  },
  {
    id: "ogm",
    name: "Laboratoire OGM",
    desc: "Patates améliorées (et brillantes).",
    baseCost: 1_400_000,
    cps: 1400,
    growth: 1.17,
    icon: "ogm",
  },
  {
    id: "portal",
    name: "Portail patate-dimensionnel",
    desc: "Des patates de toute l'univers.",
    baseCost: 20_000_000,
    cps: 7800,
    growth: 1.18,
    icon: "portal",
  },
  {
    id: "nucleus",
    name: "Noyau patatier",
    desc: "Le cœur fusion de la patate ultime.",
    baseCost: 330_000_000,
    cps: 44000,
    growth: 1.2,
    icon: "nucleus",
  },
];

export interface UpgradeDef {
  id: string;
  name: string;
  desc: string;
  cost: number;
  add?: number;
  mult?: number;
  icon: string;
}

export const CLICK_UPGRADES: UpgradeDef[] = [
  {
    id: "glove",
    name: "Gant de jardinage",
    desc: "+1 patacoin par clic",
    cost: 50,
    add: 1,
    icon: "glove",
  },
  {
    id: "sneakers",
    name: "Baskets de sprint",
    desc: "+5 patacoins par clic",
    cost: 400,
    add: 5,
    icon: "sneakers",
  },
  {
    id: "turbo",
    name: "Clic turbo",
    desc: "×2 le gain par clic",
    cost: 2500,
    mult: 2,
    icon: "turbo",
  },
  {
    id: "goldhand",
    name: "Main dorée",
    desc: "+50 patacoins par clic",
    cost: 12000,
    add: 50,
    icon: "goldhand",
  },
  {
    id: "thumb",
    name: "Double pouce",
    desc: "×2 le gain par clic",
    cost: 50000,
    mult: 2,
    icon: "thumb",
  },
  {
    id: "cosmicglove",
    name: "Gants cosmiques",
    desc: "+500 patacoins par clic",
    cost: 250000,
    add: 500,
    icon: "cosmicglove",
  },
  {
    id: "stormfinger",
    name: "Doigt de l'orage",
    desc: "×2 le gain par clic",
    cost: 1_000_000,
    mult: 2,
    icon: "stormfinger",
  },
  {
    id: "divinehand",
    name: "Main divine",
    desc: "×5 le gain par clic",
    cost: 50_000_000,
    mult: 5,
    icon: "divinehand",
  },
];

export interface SoilDef {
  id: string;
  name: string;
  desc: string;
  cost: number;
  mult: number;
  color: string;
  darkColor: string;
  special?: "volcanic" | "lunar" | "cosmic";
}

export const SOILS: SoilDef[] = [
  {
    id: "basic",
    name: "Terre basique",
    desc: "Humide, brune, honnête.",
    cost: 0,
    mult: 1,
    color: "#8b5a2b",
    darkColor: "#5d3a1a",
  },
  {
    id: "compost",
    name: "Terreau riche",
    desc: "Composté avec soin. ×1,5",
    cost: 1000,
    mult: 1.5,
    color: "#4a2f17",
    darkColor: "#2e1c0c",
  },
  {
    id: "volcanic",
    name: "Terre volcanique",
    desc: "Chaude et minérale. ×3",
    cost: 75000,
    mult: 3,
    color: "#b3402a",
    darkColor: "#6e2418",
    special: "volcanic",
  },
  {
    id: "lunar",
    name: "Terre lunaire",
    desc: "Regolith importé de la Lune. ×8",
    cost: 4_000_000,
    mult: 8,
    color: "#9aa3b2",
    darkColor: "#5c6470",
    special: "lunar",
  },
  {
    id: "cosmic",
    name: "Terre cosmique",
    desc: "Engrais galactique. ×20",
    cost: 250_000_000,
    mult: 20,
    color: "#6a3fb3",
    darkColor: "#3d2270",
    special: "cosmic",
  },
];

export type WeatherType = "none" | "sun" | "rain" | "storm";

export interface WeatherDef {
  type: WeatherType;
  name: string;
  cpsMult: number;
  clickMult: number;
  nutrientRate: number; // par seconde (+ = regen, - = perte extra)
  weight: number;
}

export const WEATHER: Record<WeatherType, WeatherDef> = {
  none: { type: "none", name: "Ciel dégagé", cpsMult: 1, clickMult: 1, nutrientRate: 0, weight: 0 },
  sun: {
    type: "sun",
    name: "Grand soleil",
    cpsMult: 1.3,
    clickMult: 1.25,
    nutrientRate: 0,
    weight: 40,
  },
  rain: {
    type: "rain",
    name: "Pluie douce",
    cpsMult: 1.5,
    clickMult: 1,
    nutrientRate: 0.02,
    weight: 40,
  },
  storm: {
    type: "storm",
    name: "Orage patatier",
    cpsMult: 2,
    clickMult: 1.5,
    nutrientRate: 0,
    weight: 20,
  },
};

export interface EvolutionDef {
  id: string;
  name: string;
  threshold: number; // gain de vie
}

export const EVOLUTIONS: EvolutionDef[] = [
  { id: "basic", name: "Patate", threshold: 0 },
  { id: "super", name: "Super Patate", threshold: 10_000 },
  { id: "golden", name: "Patate Dorée", threshold: 1_000_000 },
  { id: "cosmic", name: "Patate Cosmique", threshold: 100_000_000 },
  { id: "transcendent", name: "Patate Transcendante", threshold: 10_000_000_000 },
];

export interface AccessoryDef {
  id: string;
  name: string;
  purchases: number; // nombre total d'achats requis
}

export const ACCESSORIES: AccessoryDef[] = [
  { id: "hat", name: "Chapeau de paille", purchases: 3 },
  { id: "sunglasses", name: "Lunettes de soleil", purchases: 8 },
  { id: "crown", name: "Couronne", purchases: 15 },
  { id: "cape", name: "Cape héroïque", purchases: 25 },
  { id: "aura", name: "Aura dorée", purchases: 40 },
  { id: "wings", name: "Ailes de patate", purchases: 60 },
];

export interface AchievementDef {
  id: string;
  name: string;
  desc: string;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: "first_click", name: "Premier clic", desc: "Cliquez sur la patate pour la première fois." },
  { id: "clicks_100", name: "Doigt fatigué", desc: "100 clics sur la patate." },
  { id: "clicks_1000", name: "Marathonien", desc: "1 000 clics sur la patate." },
  { id: "clicks_10000", name: "Machine à cliquer", desc: "10 000 clics sur la patate." },
  { id: "earned_1000", name: "Petite fortune", desc: "1 000 patacoins gagnés au total." },
  { id: "earned_100000", name: "Revenu passif", desc: "100 000 patacoins gagnés au total." },
  { id: "earned_1m", name: "Millionnaire", desc: "1 million de patacoins gagnés au total." },
  { id: "earned_100m", name: "Patate-thonnaire", desc: "100 millions de patacoins gagnés au total." },
  { id: "earned_1b", name: "Légende patatière", desc: "1 milliard de patacoins gagnés au total." },
  { id: "first_building", name: "Premier salarié", desc: "Achetez votre premier bâtiment." },
  { id: "buildings_50", name: "Petite armée", desc: "50 bâtiments au total." },
  { id: "buildings_200", name: "Patate-méga-farm", desc: "200 bâtiments au total." },
  { id: "soil_up", name: "Jardinier ambitieux", desc: "Changez de terre." },
  { id: "all_soils", name: "Collectionneur de sols", desc: "Débloquez toutes les terres." },
  { id: "first_prestige", name: "Replanter !", desc: "Faites votre premier prestige." },
  { id: "golden_1", name: "Coup de chance", desc: "Attrapez une patate dorée." },
  { id: "combo_max", name: "Combo !", desc: "Atteignez le combo ×2,5." },
];

// Constantes de gameplay
export const CONST = {
  BASE_CLICK: 1,
  NUTRIENT_DECAY_PER_S: 1 / 180, // jauge pleine -> vide en 3 min
  NUTRIENT_MIN_MULT: 0.5,
  NUTRIENT_MAX_MULT: 1.25,
  WATER_DURATION_MS: 30_000,
  WATER_COOLDOWN_MS: 60_000,
  WATER_MULT: 2,
  EARTH_COST: 100,
  EARTH_COOLDOWN_MS: 3000,
  COMBO_WINDOW_MS: 900,
  COMBO_STEP: 0.08,
  COMBO_MAX: 1.5,
  COMBO_DECAY_PER_MS: 0.004,
  OFFLINE_CAP_MS: 8 * 3600 * 1000,
  OFFLINE_MIN_MS: 60_000,
  PRESTIGE_BASE: 1_000_000,
  SEED_BONUS: 0.02,
  GOLDEN_LIFETIME_MS: 10_000,
  GOLDEN_MIN_INTERVAL_MS: 20_000,
  GOLDEN_MAX_INTERVAL_MS: 60_000,
  GOLDEN_MIN_GAIN: 100,
  WEATHER_MIN_INTERVAL_MS: 30_000,
  WEATHER_MAX_INTERVAL_MS: 120_000,
  WEATHER_MIN_DURATION_MS: 20_000,
  WEATHER_MAX_DURATION_MS: 40_000,
  SAVE_KEY: "potato-farm-save-v1",
  TICK_MS: 250,
  AUTOSAVE_MS: 5000,
} as const;
