"use client";

import { useGame } from "../store/useGame";
import { formatNumber, formatTime } from "../lib/format";
import { CoinIcon, MiniPotatoIcon } from "./icons";
import { Modal } from "./Modal";

// Popup de récapitulatif des gains hors-ligne (plafond 8 h).
export function OfflineModal() {
  const offline = useGame((s) => s.offline);
  const closeOffline = useGame((s) => s.closeOffline);
  if (!offline) return null;
  return (
    <Modal title="Pendant ton absence…" onClose={closeOffline}>
      <div className="flex flex-col items-center gap-3 py-2 text-center">
        <MiniPotatoIcon className="h-20 w-20" />
        <p className="text-sm font-bold text-[#5a3a1c]">
          Ta ferme a travaillé pendant{" "}
          <span className="font-black">{formatTime(offline.elapsedMs)}</span>
        </p>
        <div className="cartoon-border flex items-center gap-2 rounded-2xl bg-white px-4 py-2">
          <CoinIcon className="h-8 w-8" />
          <span className="text-2xl font-black text-[#3a2414] tabular-nums">
            +{formatNumber(offline.gain)}
          </span>
          <span className="text-sm font-bold text-[#8a6d3b]">patacoins</span>
        </div>
        <p className="text-xs font-semibold text-[#8a6d3b]">
          (production passive, plafonnée à 8h d&#39;absence)
        </p>
        <button
          onClick={closeOffline}
          className="cartoon-border mt-1 rounded-2xl bg-[#7ec850] px-6 py-2.5 text-lg font-black text-white"
        >
          Récupérer !
        </button>
      </div>
    </Modal>
  );
}
