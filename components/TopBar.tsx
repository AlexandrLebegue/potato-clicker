"use client";

import { formatNumber, formatCps } from "../lib/format";
import { useGame, useCpsPreview } from "../store/useGame";
import { prestigeGain } from "../lib/game";
import {
  CoinIcon,
  SeedIcon,
  SoundOnIcon,
  SoundOffIcon,
  StatsIcon,
  TrophyIcon,
} from "./icons";

export function TopBar() {
  const coins = useGame((s) => s.coins);
  const seeds = useGame((s) => s.seeds);
  const soundOn = useGame((s) => s.soundOn);
  const runEarned = useGame((s) => s.runEarned);
  const toggleSound = useGame((s) => s.toggleSound);
  const setModal = useGame((s) => s.setModal);
  const cps = useCpsPreview();
  const gain = prestigeGain(runEarned);

  return (
    <header className="relative z-20 flex items-center justify-between gap-2 px-3 py-2 sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <h1 className="hidden text-xl font-black text-white [text-shadow:0_2px_0_#3a2414] md:block">
          🥔 Potato Farm
        </h1>
        <div
          className="cartoon-border flex items-center gap-2 rounded-2xl bg-[#fff8e8] px-3 py-1.5"
          role="status"
          aria-live="polite"
          aria-label="Patacoins"
        >
          <CoinIcon className="h-7 w-7" />
          <span className="text-lg font-black text-[#5a3a1c] tabular-nums">
            {formatNumber(Math.floor(coins))}
          </span>
        </div>
        <div className="hidden items-center gap-1 text-sm font-bold text-white [text-shadow:0_1px_0_#3a2414] sm:flex">
          +{formatCps(cps)}/s
          {seeds > 0 && (
            <span className="ml-2 flex items-center gap-1 rounded-full bg-[#a8e063] px-2 py-0.5 [text-shadow:none] text-[#1d3a10]">
              <SeedIcon className="h-4 w-4" /> {seeds}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setModal("prestige")}
          aria-label={`Replanter pour ${gain} graines légendaires`}
          className="cartoon-border relative rounded-2xl bg-[#8b5cf6] p-2 text-white disabled:opacity-50"
          title="Replanter (prestige)"
        >
          <TrophyIcon className="h-6 w-6" />
          {gain > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ffd23f] px-1 text-xs font-black text-[#3a2414]">
              +{gain}
            </span>
          )}
        </button>
        <button
          onClick={() => setModal("stats")}
          aria-label="Statistiques et succès"
          className="cartoon-border rounded-2xl bg-[#fff8e8] p-2"
        >
          <StatsIcon className="h-6 w-6" />
        </button>
        <button
          onClick={toggleSound}
          aria-label={soundOn ? "Couper le son" : "Activer le son"}
          className="cartoon-border rounded-2xl bg-[#fff8e8] p-2"
        >
          {soundOn ? <SoundOnIcon className="h-6 w-6" /> : <SoundOffIcon className="h-6 w-6" />}
        </button>
      </div>
    </header>
  );
}
