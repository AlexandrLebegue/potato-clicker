"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CONST } from "../lib/data";
import { useGame } from "../store/useGame";

// Jauge de combo : clics rapides = multiplicateur temporaire.
export function ComboGauge() {
  const combo = useGame((s) => s.combo);
  const visible = combo > 0.01;
  const pct = Math.min(1, combo / CONST.COMBO_MAX);
  return (
    <div
      className="mx-auto mt-2 h-6 w-44"
      role="progressbar"
      aria-label="Combo"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct * 100)}
    >
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative h-full"
          >
            <div className="absolute inset-x-0 top-1/2 h-3.5 -translate-y-1/2 overflow-hidden rounded-full border-2 border-[#3a2414] bg-[#3a2414]/30">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${pct * 100}%`,
                  background: "linear-gradient(90deg,#ffd23f,#ff8c42)",
                  transition: "width 0.15s linear",
                }}
              />
            </div>
            <span className="absolute -top-0.5 right-0 text-sm font-black text-white [text-shadow:0_1px_0_#3a2414]">
              ×{(1 + combo).toFixed(2)}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
