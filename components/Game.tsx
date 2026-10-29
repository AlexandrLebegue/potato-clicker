"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CONST } from "../lib/data";
import { useGame } from "../store/useGame";
import { WeatherLayer } from "./WeatherLayer";
import { TopBar } from "./TopBar";
import { PotatoScene } from "./PotatoScene";
import { ComboGauge } from "./ComboGauge";
import { Shop } from "./Shop";
import { Toasts } from "./Toasts";
import { FxLayer } from "./FxLayer";
import { GoldenPotato } from "./GoldenPotato";
import { OfflineModal } from "./OfflineModal";
import { StatsModal } from "./StatsModal";
import { PrestigeModal } from "./PrestigeModal";
import { ShopIcon, StatsIcon } from "./icons";

export function Game() {
  const mounted = useGame((s) => s.mounted);
  const shaking = useGame((s) => s.shaking);
  const modal = useGame((s) => s.modal);
  const offline = useGame((s) => s.offline);
  const [shopOpen, setShopOpen] = useState(false);

  // Boucle de jeu + sauvegarde auto (5 s, départ de page) + démarrage
  useEffect(() => {
    const g = () => useGame.getState();
    g().boot();
    const tickId = setInterval(() => g().tick(Date.now()), CONST.TICK_MS);
    const save = () => g().save();
    const onVisibility = () => {
      if (document.visibilityState === "hidden") save();
    };
    const autosaveId = setInterval(save, CONST.AUTOSAVE_MS);
    window.addEventListener("beforeunload", save);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearInterval(tickId);
      clearInterval(autosaveId);
      window.removeEventListener("beforeunload", save);
      document.removeEventListener("visibilitychange", onVisibility);
      save();
    };
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-dvh items-center justify-center bg-[#7ec8f7]">
        <div className="cartoon-border rounded-3xl bg-[#fff8e8] px-8 py-6 text-2xl font-black text-[#5a3a1c]">
          Préparation du potager…
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-dvh overflow-hidden">
      <WeatherLayer />

      <div
        className={`relative z-10 flex h-full flex-col ${shaking ? "shake" : ""}`}
      >
        <TopBar />

        <div className="flex min-h-0 flex-1">
          {/* Zone centrale : la patate dans son pot */}
          <main className="flex min-w-0 flex-1 flex-col items-center overflow-y-auto overscroll-contain">
            <div className="flex w-full flex-col items-center px-3 pb-24 pt-2 lg:pb-4">
              <PotatoScene />
              <ComboGauge />
            </div>
          </main>

          {/* Boutique : panneau fixe (desktop) */}
          <aside className="hidden w-[380px] shrink-0 border-l-4 border-[#3a2414]/20 bg-[#fff8e8]/95 p-3 lg:block">
            <Shop className="h-full min-h-0" />
          </aside>
        </div>

        {/* Barre mobile : tiroir bas pour la boutique */}
        <div className="absolute inset-x-0 bottom-0 z-30 flex gap-2 border-t-4 border-[#3a2414]/30 bg-[#fff8e8] p-2 lg:hidden">
          <button
            onClick={() => setShopOpen(true)}
            aria-label="Ouvrir la boutique"
            className="cartoon-border flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#e07f3f] py-2.5 font-black text-white"
          >
            <ShopIcon id="farm" className="h-6 w-6" /> Boutique
          </button>
          <button
            onClick={() => useGame.getState().setModal("stats")}
            aria-label="Ouvrir les statistiques"
            className="cartoon-border flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#4d9fe0] py-2.5 font-black text-white"
          >
            <StatsIcon className="h-6 w-6" /> Stats
          </button>
        </div>
      </div>

      {/* Tiroir boutique (mobile) */}
      <AnimatePresence>
        {shopOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <motion.div
              className="absolute inset-0 bg-[#1a1208]/55"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShopOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Boutique"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="absolute inset-x-0 bottom-0 h-[75dvh] overflow-hidden rounded-t-3xl border-t-4 border-[#3a2414] bg-[#fff8e8] p-3"
            >
              <div className="mx-auto mb-1 h-1.5 w-16 rounded-full bg-[#3a2414]/30" aria-hidden="true" />
              <Shop className="h-full min-h-0" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Overlays */}
      <Toasts />
      <FxLayer />
      <GoldenPotato />
      <AnimatePresence>
        {offline && <OfflineModal />}
        {modal === "stats" && <StatsModal />}
        {modal === "prestige" && <PrestigeModal />}
      </AnimatePresence>
    </div>
  );
}
