"use client";

import { CONST, SOILS } from "../lib/data";
import { useGame } from "../store/useGame";
import { formatNumber } from "../lib/format";
import { LockIcon, ShovelIcon, WateringCanIcon } from "./icons";

// Actions sur la patate : arroser (×2 30 s / recharge 60 s),
// ajouter de la terre (jauge de nutriments), changer de terre.

function WaterButton() {
  const waterUntil = useGame((s) => s.waterUntil);
  const waterReadyAt = useGame((s) => s.waterReadyAt);
  const lastTickAt = useGame((s) => s.lastTickAt);
  const water = useGame((s) => s.water);
  const now = lastTickAt;
  const active = waterUntil > now;
  const cooling = !active && waterReadyAt > now;
  const pct = active
    ? (waterUntil - now) / CONST.WATER_DURATION_MS
    : cooling
      ? 1 - (waterReadyAt - now) / (CONST.WATER_COOLDOWN_MS - CONST.WATER_DURATION_MS)
      : 0;
  return (
    <button
      onClick={water}
      disabled={active || cooling}
      aria-label="Arroser la patate (×2 pendant 30 secondes, recharge 60 secondes)"
      className="cartoon-border relative flex items-center gap-2 rounded-2xl bg-[#4d9fe0] px-4 py-3 text-white font-extrabold disabled:cursor-not-allowed"
    >
      <WateringCanIcon className="h-8 w-8" />
      <span>
        {active
          ? `×2 · ${Math.ceil((waterUntil - now) / 1000)} s`
          : cooling
            ? `recharge ${Math.ceil((waterReadyAt - now) / 1000)} s`
            : "Arroser"}
      </span>
      {cooling && (
        <span
          className="absolute bottom-0 left-0 h-1.5 rounded-full bg-[#dff1ff]"
          style={{ width: `${pct * 100}%`, transition: "width 0.25s linear" }}
        />
      )}
    </button>
  );
}

function EarthButton() {
  const earthFxUntil = useGame((s) => s.earthFxUntil);
  const coins = useGame((s) => s.coins);
  const lastTickAt = useGame((s) => s.lastTickAt);
  const addEarth = useGame((s) => s.addEarth);
  const ready = lastTickAt >= earthFxUntil;
  const affordable = coins >= CONST.EARTH_COST;
  return (
    <button
      onClick={addEarth}
      disabled={!ready || !affordable}
      aria-label={`Ajouter de la terre, coût ${CONST.EARTH_COST} patacoins`}
      className="cartoon-border flex items-center gap-2 rounded-2xl bg-[#a8763e] px-4 py-3 text-white font-extrabold disabled:cursor-not-allowed disabled:opacity-60"
    >
      <ShovelIcon className="h-8 w-8" />
      <span>Terre +{CONST.EARTH_COST}</span>
    </button>
  );
}

function SoilSelector() {
  const soilId = useGame((s) => s.soilId);
  const soilsUnlocked = useGame((s) => s.soilsUnlocked);
  const coins = useGame((s) => s.coins);
  const buySoil = useGame((s) => s.buySoil);
  return (
    <div className="cartoon-border flex flex-wrap items-center justify-center gap-2 rounded-2xl bg-[#fff8e8] px-3 py-2" role="group" aria-label="Choix du type de terre">
      {SOILS.map((soil) => {
        const unlocked = soilsUnlocked.includes(soil.id);
        const activeSoil = soil.id === soilId;
        const affordable = coins >= soil.cost;
        return (
          <button
            key={soil.id}
            onClick={() => buySoil(soil.id)}
            disabled={!unlocked && !affordable}
            aria-label={
              unlocked
                ? `${soil.name} (×${soil.mult})${activeSoil ? ", terre active" : ""}`
                : `Débloquer ${soil.name}, ×${soil.mult}, pour ${formatNumber(soil.cost)} patacoins`
            }
            className={`relative flex h-11 w-11 items-center justify-center rounded-full border-4 transition-transform ${
              activeSoil ? "scale-110 border-[#3a2414]" : "border-[#3a2414]/40"
            } ${!unlocked && !affordable ? "opacity-50" : ""}`}
            style={{ background: soil.color }}
          >
            <span
              className="absolute -bottom-1 left-1/2 h-2 w-10 -translate-x-1/2 rounded-full"
              style={{ background: soil.darkColor }}
            />
            {!unlocked && <LockIcon className="h-6 w-6 opacity-90" />}
            <span className="sr-only">{soil.name}</span>
          </button>
        );
      })}
    </div>
  );
}

export function ActionBar() {
  return (
    <div className="mt-3 flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <WaterButton />
        <EarthButton />
      </div>
      <SoilSelector />
    </div>
  );
}

