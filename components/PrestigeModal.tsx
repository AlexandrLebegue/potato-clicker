"use client";

import { CONST } from "../lib/data";
import { prestigeGain } from "../lib/game";
import { formatNumber } from "../lib/format";
import { useGame } from "../store/useGame";
import { SeedIcon } from "./icons";
import { Modal } from "./Modal";

// Prestige « Replanter » : on repart de zéro en échange de graines
// légendaires (+2 % de production permanent par graine).
export function PrestigeModal() {
  const runEarned = useGame((s) => s.runEarned);
  const seeds = useGame((s) => s.seeds);
  const prestiges = useGame((s) => s.prestiges);
  const doPrestige = useGame((s) => s.doPrestige);
  const setModal = useGame((s) => s.setModal);
  const gain = prestigeGain(runEarned);
  const can = gain >= 1;

  return (
    <Modal title="Replanter la patate" onClose={() => setModal(null)}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          {Array.from({ length: Math.min(5, gain) }).map((_, i) => (
            <SeedIcon key={i} className="h-9 w-9" />
          ))}
          {gain > 5 && (
            <span className="text-xl font-black text-[#3a2414]">+{formatNumber(gain)}</span>
          )}
        </div>
        <p className="text-center text-sm font-bold text-[#5a3a1c]">
          Replanter la ferme pour repartir de zéro (patacoins, bâtiments, améliorations, terre)…
        </p>
        <div className="w-full rounded-2xl border-4 border-[#8a5f00] bg-[#ffe9a8] p-3 text-center">
          <div className="text-2xl font-black text-[#3a2414]">+{gain} graine{gain > 1 ? "s" : ""}</div>
          <div className="text-xs font-bold text-[#8a5f00]">
            = +{gain * CONST.SEED_BONUS * 100} % de production, pour toujours
          </div>
        </div>
        <p className="text-center text-xs font-semibold text-[#8a6d3b]">
          Graines actuelles : {seeds} (bonus +{seeds * CONST.SEED_BONUS * 100} %) · Replantages :{" "}
          {prestiges}
          <br />
          Se méritent en gagnant au moins {formatNumber(CONST.PRESTIGE_BASE)} patacoins dans une
          partie.
        </p>
        <button
          onClick={doPrestige}
          disabled={!can}
          className={`cartoon-border w-full rounded-2xl px-6 py-3 text-lg font-black ${
            can ? "sheen bg-[#8b5cf6] text-white" : "cursor-not-allowed bg-[#d8cdb8] text-[#8a7a5c]"
          }`}
        >
          {can ? `Replanter pour ${gain} graine${gain > 1 ? "s" : ""} !` : "Pas encore assez…"}
        </button>
      </div>
    </Modal>
  );
}
