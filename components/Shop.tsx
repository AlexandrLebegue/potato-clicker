"use client";

import { useState } from "react";
import { BUILDINGS, CLICK_UPGRADES, SOILS } from "../lib/data";
import { MUSIC_TRACKS } from "../lib/musicTracks";
import { buildingCost, totalBuildings } from "../lib/game";
import { formatNumber } from "../lib/format";
import { useGame } from "../store/useGame";
import { LockIcon, MusicNoteIcon, SeedIcon, ShopIcon } from "./icons";

type Tab = "production" | "clics" | "terres" | "musique";

const TABS: { id: Tab; label: string }[] = [
  { id: "production", label: "Production" },
  { id: "clics", label: "Clics" },
  { id: "terres", label: "Terres" },
  { id: "musique", label: "Musique" },
];

function PriceLabel({ cost, coins }: { cost: number; coins: number }) {
  if (coins >= cost) {
    return (
      <span className="flex items-center gap-1 font-black text-[#2d6a12] tabular-nums">
        <CoinDot /> {formatNumber(cost)}
      </span>
    );
  }
  return (
    <span className="font-bold text-[#8a6d3b] tabular-nums">
      il manque {formatNumber(Math.max(0, Math.ceil(cost - coins)))}
    </span>
  );
}

function CoinDot() {
  return (
    <span className="inline-block h-3 w-3 rounded-full border-2 border-[#8a5f00] bg-[#ffd23f]" />
  );
}

function BuyButton({
  affordable,
  onClick,
  label,
  icon,
}: {
  affordable: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={!affordable}
      aria-label={affordable ? `Acheter : ${label}` : `Impossible d'acheter : ${label}`}
      className={`cartoon-border flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-black ${
        affordable
          ? "sheen bg-[#7ec850] text-white"
          : "cursor-not-allowed bg-[#d8cdb8] text-[#8a7a5c]"
      }`}
    >
      {icon}
      Acheter
    </button>
  );
}

function BuildingRow() {
  const coins = useGame((s) => s.coins);
  const buildings = useGame((s) => s.buildings);
  const buyBuilding = useGame((s) => s.buyBuilding);
  return (
    <ul className="flex flex-col gap-2.5">
      {BUILDINGS.map((b) => {
        const level = buildings[b.id] ?? 0;
        const cost = buildingCost(b.baseCost, b.growth, level);
        const affordable = coins >= cost;
        return (
          <li
            key={b.id}
            className={`flex items-center gap-2.5 rounded-2xl border-4 border-[#3a2414] bg-[#fff8e8] p-2 ${
              affordable ? "" : "opacity-75"
            }`}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-[#3a2414]/30 bg-white">
              <ShopIcon id={b.icon} className="h-8 w-8" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-1">
                <span className="truncate font-black text-[#3a2414]">{b.name}</span>
                {level > 0 && (
                  <span className="shrink-0 rounded-full bg-[#ffd23f] px-2 text-xs font-black text-[#3a2414]">
                    ×{level}
                  </span>
                )}
              </div>
              <div className="truncate text-xs font-semibold text-[#8a6d3b]">
                {b.desc} · +{formatNumber(b.cps)}/s
              </div>
              <div className="mt-0.5 flex items-center justify-between gap-2">
                <PriceLabel cost={cost} coins={coins} />
                <BuyButton
                  affordable={affordable}
                  onClick={() => buyBuilding(b.id)}
                  label={b.name}
                  icon={<CoinDot />}
                />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function UpgradeRow() {
  const coins = useGame((s) => s.coins);
  const upgrades = useGame((s) => s.upgrades);
  const buyUpgrade = useGame((s) => s.buyUpgrade);
  return (
    <ul className="flex flex-col gap-2.5">
      {CLICK_UPGRADES.map((u) => {
        const owned = upgrades.includes(u.id);
        const affordable = coins >= u.cost;
        return (
          <li
            key={u.id}
            className={`flex items-center gap-2.5 rounded-2xl border-4 border-[#3a2414] bg-[#fff8e8] p-2 ${
              owned ? "opacity-90" : affordable ? "" : "opacity-75"
            }`}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-[#3a2414]/30 bg-white">
              <ShopIcon id={u.icon} className="h-8 w-8" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate font-black text-[#3a2414]">{u.name}</div>
              <div className="truncate text-xs font-semibold text-[#8a6d3b]">{u.desc}</div>
              <div className="mt-0.5 flex items-center justify-between gap-2">
                {owned ? (
                  <span className="flex items-center gap-1 font-black text-[#2d6a12]">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#7ec850] text-white">
                      ✓
                    </span>
                    Acheté
                  </span>
                ) : (
                  <>
                    <PriceLabel cost={u.cost} coins={coins} />
                    <BuyButton
                      affordable={affordable}
                      onClick={() => buyUpgrade(u.id)}
                      label={u.name}
                      icon={<CoinDot />}
                    />
                  </>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function SoilRow() {
  const coins = useGame((s) => s.coins);
  const soilId = useGame((s) => s.soilId);
  const soilsUnlocked = useGame((s) => s.soilsUnlocked);
  const buySoil = useGame((s) => s.buySoil);
  return (
    <ul className="flex flex-col gap-2.5">
      {SOILS.map((s) => {
        const unlocked = soilsUnlocked.includes(s.id);
        const active = s.id === soilId;
        const affordable = coins >= s.cost;
        return (
          <li
            key={s.id}
            className={`flex items-center gap-2.5 rounded-2xl border-4 bg-[#fff8e8] p-2 ${
              active ? "border-[#8a5f00]" : "border-[#3a2414]"
            } ${!unlocked && !affordable ? "opacity-75" : ""}`}
          >
            <span
              className="h-11 w-11 shrink-0 rounded-xl border-4 border-[#3a2414]"
              style={{ background: s.color }}
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="truncate font-black text-[#3a2414]">{s.name}</span>
                <span className="shrink-0 rounded-full bg-[#e07f3f] px-2 text-xs font-black text-white">
                  ×{s.mult}
                </span>
                {active && (
                  <span className="shrink-0 rounded-full bg-[#7ec850] px-2 text-xs font-black text-white">
                    active
                  </span>
                )}
              </div>
              <div className="truncate text-xs font-semibold text-[#8a6d3b]">{s.desc}</div>
              <div className="mt-0.5 flex items-center justify-end">
                {unlocked ? (
                  active ? (
                    <span className="text-sm font-black text-[#8a6d3b]">En terre</span>
                  ) : (
                    <button
                      onClick={() => buySoil(s.id)}
                      className="cartoon-border rounded-xl bg-[#4d9fe0] px-3 py-1.5 text-sm font-black text-white"
                    >
                      Utiliser
                    </button>
                  )
                ) : (
                  <>
                    <span className="mr-2 flex items-center gap-1">
                      <LockIcon className="h-4 w-4" />
                      <PriceLabel cost={s.cost} coins={coins} />
                    </span>
                    <BuyButton
                      affordable={affordable}
                      onClick={() => buySoil(s.id)}
                      label={s.name}
                      icon={<CoinDot />}
                    />
                  </>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function TrackRow() {
  const seeds = useGame((s) => s.seeds);
  const unlocked = useGame((s) => s.musicUnlocked);
  const selected = useGame((s) => s.musicSelected);
  const buyTrack = useGame((s) => s.buyTrack);
  const selectTrack = useGame((s) => s.selectTrack);
  return (
    <ul className="flex flex-col gap-2.5">
      {MUSIC_TRACKS.map((t) => {
        const owned = unlocked.includes(t.id);
        const active = t.id === selected;
        const affordable = seeds >= t.cost;
        return (
          <li
            key={t.id}
            className={`flex items-center gap-2.5 rounded-2xl border-4 bg-[#fff8e8] p-2 ${
              active ? "border-[#8a5f00]" : "border-[#3a2414]"
            } ${!owned && !affordable ? "opacity-75" : ""}`}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-[#3a2414]/30 bg-white">
              <MusicNoteIcon className="h-8 w-8" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="truncate font-black text-[#3a2414]">{t.name}</span>
                {active && (
                  <span className="shrink-0 rounded-full bg-[#8b5cf6] px-2 text-xs font-black text-white">
                    lecture
                  </span>
                )}
              </div>
              <div className="truncate text-xs font-semibold text-[#8a6d3b]">{t.desc}</div>
              <div className="mt-0.5 flex items-center justify-between gap-2">
                {owned ? (
                  active ? (
                    <span className="text-sm font-black text-[#8a6d3b]">Sélectionné</span>
                  ) : (
                    <button
                      onClick={() => selectTrack(t.id)}
                      className="cartoon-border rounded-xl bg-[#8b5cf6] px-3 py-1.5 text-sm font-black text-white"
                    >
                      Jouer
                    </button>
                  )
                ) : (
                  <>
                    <span className="flex items-center gap-1 font-black text-[#2d6a12] tabular-nums">
                      <SeedIcon className="h-4 w-4" /> {t.cost}
                    </span>
                    <button
                      onClick={() => buyTrack(t.id)}
                      disabled={!affordable}
                      aria-label={
                        affordable
                          ? `Acheter : ${t.name} pour ${t.cost} graines`
                          : `Impossible d'acheter : ${t.name}`
                      }
                      className={`cartoon-border rounded-xl px-3 py-1.5 text-sm font-black ${
                        affordable
                          ? "sheen bg-[#8b5cf6] text-white"
                          : "cursor-not-allowed bg-[#d8cdb8] text-[#8a7a5c]"
                      }`}
                    >
                      Débloquer
                    </button>
                  </>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function Shop({ className = "" }: { className?: string }) {
  const [tab, setTab] = useState<Tab>("production");
  const totalB = useGame((s) => totalBuildings(s));
  const seeds = useGame((s) => s.seeds);
  return (
    <div className={`flex flex-col ${className}`}>
      <div
        className="grid grid-cols-4 gap-1.5 rounded-2xl border-4 border-[#3a2414] bg-[#fff8e8] p-1.5"
        role="tablist"
        aria-label="Boutique"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-xl px-2 py-1.5 text-sm font-black transition-colors ${
              tab === t.id
                ? "bg-[#e07f3f] text-white"
                : "text-[#5a3a1c] hover:bg-[#f5e9cf]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-2 flex-1 overflow-y-auto overscroll-contain pr-1" role="tabpanel">
        {tab === "production" && (
          <div>
            <p className="mb-2 text-xs font-bold text-[#8a6d3b]">
              {totalB} bâtiment{totalB > 1 ? "s" : ""} — production passive
            </p>
            <BuildingRow />
          </div>
        )}
        {tab === "clics" && (
          <div>
            <p className="mb-2 text-xs font-bold text-[#8a6d3b]">Améliorations du clic</p>
            <UpgradeRow />
          </div>
        )}
        {tab === "terres" && (
          <div>
            <p className="mb-2 text-xs font-bold text-[#8a6d3b]">
              Le type de terre multiplie toute votre production
            </p>
            <SoilRow />
          </div>
        )}
        {tab === "musique" && (
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-[#8a6d3b]">
              Morceaux joués par un lecteur Web Audio — débloquables avec vos graines
              ({seeds} actuellement)
            </p>
            <TrackRow />
          </div>
        )}
      </div>
    </div>
  );
}

