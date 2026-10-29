"use client";

import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { ACHIEVEMENTS, CONST } from "../lib/data";
import { formatNumber, formatTime } from "../lib/format";
import { totalBuildings } from "../lib/game";
import { useGame } from "../store/useGame";
import { TrophyIcon } from "./icons";
import { Modal } from "./Modal";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border-2 border-[#3a2414]/30 bg-white px-3 py-2">
      <div className="text-[11px] font-bold uppercase tracking-wide text-[#8a6d3b]">{label}</div>
      <div className="truncate text-sm font-black text-[#3a2414] tabular-nums">{value}</div>
    </div>
  );
}

export function StatsModal() {
  const s = useGame(
    useShallow((st) => ({
      coins: st.coins,
      lifetimeEarned: st.lifetimeEarned,
      runEarned: st.runEarned,
      clicks: st.clicks,
      goldenClicks: st.goldenClicks,
      buildings: st.buildings,
      upgrades: st.upgrades,
      seeds: st.seeds,
      prestiges: st.prestiges,
      playMs: st.playMs,
      maxCombo: st.maxCombo,
      achievements: st.achievements,
    }))
  );
  const setModal = useGame((st) => st.setModal);
  const hardReset = useGame((st) => st.hardReset);
  const [confirming, setConfirming] = useState(false);

  const totalB = totalBuildings(s);
  const have = new Set(s.achievements);

  return (
    <Modal title="Statistiques" onClose={() => setModal(null)} wide>
      <div className="grid grid-cols-2 gap-2">
        <Stat label="Patacoins actuels" value={formatNumber(Math.floor(s.coins))} />
        <Stat label="Gain de vie" value={formatNumber(Math.floor(s.lifetimeEarned))} />
        <Stat label="Gagne cette partie" value={formatNumber(Math.floor(s.runEarned))} />
        <Stat label="Clics" value={formatNumber(s.clicks)} />
        <Stat label="Patates dorées" value={formatNumber(s.goldenClicks)} />
        <Stat label="Bâtiments" value={formatNumber(totalB)} />
        <Stat label="Améliorations" value={formatNumber(s.upgrades.length)} />
        <Stat label="Graines légendaires" value={formatNumber(s.seeds)} />
        <Stat label="Replantages" value={formatNumber(s.prestiges)} />
        <Stat label="Temps de jeu" value={formatTime(s.playMs)} />
        <Stat label="Meilleur combo" value={`×${(1 + s.maxCombo).toFixed(2)}`} />
        <Stat label="Succès" value={`${have.size}/${ACHIEVEMENTS.length}`} />
      </div>

      <h3 className="mt-4 mb-2 flex items-center gap-2 text-sm font-black text-[#3a2414]">
        <TrophyIcon className="h-5 w-5" /> Succès
      </h3>
      <ul className="flex max-h-44 flex-col gap-1.5 overflow-y-auto overscroll-contain pr-1">
        {ACHIEVEMENTS.map((a) => {
          const done = have.has(a.id);
          return (
            <li
              key={a.id}
              className={`flex items-center gap-2 rounded-xl border-2 px-3 py-1.5 ${
                done ? "border-[#8a5f00] bg-[#ffe9a8]" : "border-[#3a2414]/25 bg-white opacity-70"
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                  done ? "bg-[#ffd23f] text-[#3a2414]" : "bg-[#d8cdb8] text-[#8a7a5c]"
                }`}
                aria-hidden="true"
              >
                {done ? "✓" : "?"}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-xs font-black text-[#3a2414]">{a.name}</span>
                <span className="block truncate text-[11px] font-semibold text-[#8a6d3b]">
                  {a.desc}
                </span>
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex items-center justify-between gap-2 rounded-xl border-2 border-[#e04444]/50 bg-[#fde8e8] p-3">
        <div className="text-xs font-bold text-[#7c1d1d]">
          Effacer toute la partie
          <span className="block font-semibold">(sauvegarde locale supprimée)</span>
        </div>
        {confirming ? (
          <div className="flex shrink-0 gap-2">
            <button
              onClick={() => {
                hardReset();
                setModal(null);
              }}
              className="cartoon-border rounded-xl bg-[#e04444] px-3 py-1.5 text-xs font-black text-white"
            >
              Oui, tout !
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="cartoon-border rounded-xl bg-white px-3 py-1.5 text-xs font-black text-[#3a2414]"
            >
              Non
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="cartoon-border shrink-0 rounded-xl bg-[#e04444] px-3 py-1.5 text-xs font-black text-white"
          >
            Reset
          </button>
        )}
      </div>
      <p className="mt-2 text-[11px] font-semibold text-[#8a6d3b]">
        Sauvegarde automatique toutes les {CONST.AUTOSAVE_MS / 1000} s et à la fermeture de la
        page.
      </p>
    </Modal>
  );
}
