"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { evolutionOf, accessoriesOf, totalPurchases } from "../lib/game";
import { formatNumber } from "../lib/format";
import { useGame } from "../store/useGame";
import { PotatoSvg } from "./PotatoSvg";
import { SoilPlot } from "./SoilPlot";
import { ActionBar } from "./ActionBar";
import { WateringCanIcon } from "./icons";

interface Floater {
  id: number;
  x: number;
  y: number;
  value: number;
}

export function PotatoScene() {
  const mounted = useGame((s) => s.mounted);
  const evolution = useGame((s) => evolutionOf(s.lifetimeEarned).id);
  const purchases = useGame((s) => totalPurchases(s));
  const lastClickFx = useGame((s) => s.lastClickFx);
  const waterFxUntil = useGame((s) => s.waterFxUntil);
  const lastTickAt = useGame((s) => s.lastTickAt);
  const soilId = useGame((s) => s.soilId);
  const clickPotato = useGame((s) => s.clickPotato);
  const reduced = useReducedMotion();

  const accessories = useMemo(() => accessoriesOf(purchases), [purchases]);
  const [floaters, setFloaters] = useState<Floater[]>([]);

  // "+X" flottants : un par clic récent
  useEffect(() => {
    if (!lastClickFx) return;
    const f: Floater = { id: lastClickFx.seq, x: lastClickFx.x, y: lastClickFx.y, value: lastClickFx.value };
    setFloaters((prev) => [...prev.slice(-7), f]);
    const t = setTimeout(
      () => setFloaters((prev) => prev.filter((p) => p.id !== f.id)),
      950
    );
    return () => clearTimeout(t);
  }, [lastClickFx]);

  const waterVisible = lastTickAt < waterFxUntil;

  const handleClick = (x: number, y: number) => {
    clickPotato(x, y);
  };

  if (!mounted) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="cartoon-border rounded-3xl bg-[#fff8e8] px-8 py-6 text-2xl font-extrabold text-[#5a3a1c]">
          Préparation du potager…
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex w-[min(92vw,440px)] flex-col items-center">
      {/* Patate dans son pot */}
      <div className="relative z-10 w-[min(52vw,300px)]">
        <div className="relative">
          {/* Arrosoir animé */}
          <AnimatePresence>
            {waterVisible && !reduced && (
              <motion.div
                key="watercan"
                initial={{ opacity: 0, x: 30, rotate: -25 }}
                animate={{ opacity: 1, x: 0, rotate: 22 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="pointer-events-none absolute -right-14 -top-8"
              >
                <WateringCanIcon className="h-16 w-16" />
                <div className="absolute -left-5 top-10 flex gap-1.5">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className="droplet h-3 w-2 rounded-full bg-[#4d9fe0]"
                      style={{ animationDelay: `${i * 0.16}s` }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Danse (squash & stretch, balancement, sauts) */}
          <motion.div
            role="button"
            tabIndex={0}
            aria-label="Cliquer sur la patate pour gagner des patacoins"
            onPointerDown={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              handleClick(
                (e.clientX - rect.left) / rect.width,
                (e.clientY - rect.top) / rect.height
              );
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClick(0.5, 0.45);
              }
            }}
            animate={
              reduced
                ? undefined
                : {
                    y: [0, -16, 0, -8, 0],
                    rotate: [-4, 2, 0, 4, -3],
                    scaleX: [1, 1.07, 0.94, 1.03, 1],
                    scaleY: [1, 0.94, 1.06, 0.98, 1],
                  }
            }
            transition={
              reduced
                ? undefined
                : {
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.25, 0.5, 0.75, 1],
                  }
            }
            style={{ transformOrigin: "50% 92%", cursor: "pointer" }}
          >
            <motion.div
              key={lastClickFx?.seq ?? 0}
              animate={{ scale: [1, 1.15, 0.93, 1] }}
              transition={{ duration: 0.3, times: [0, 0.35, 0.7, 1] }}
            >
              <PotatoSvg evolution={evolution} accessories={accessories} className="h-auto w-full" />
            </motion.div>
          </motion.div>

          {/* Gains flottants +X */}
          <AnimatePresence>
            {floaters.map((f) => (
              <motion.span
                key={f.id}
                initial={{ y: 0, opacity: 1, scale: 0.7 }}
                animate={{ y: -80, opacity: 0, scale: 1.3 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="pointer-events-none absolute z-20 text-2xl font-black"
                style={{
                  left: `${f.x * 100}%`,
                  top: `${f.y * 100}%`,
                  color: "#fff",
                  textShadow: "0 2px 0 #3a2414, 0 0 8px rgba(0,0,0,0.35)",
                }}
              >
                +{formatNumber(f.value)}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Pot de terre */}
      <SoilPlot soilId={soilId} className="-mt-9 w-[min(80vw,380px)]" />

      {/* Actions */}
      <ActionBar />
    </div>
  );
}
