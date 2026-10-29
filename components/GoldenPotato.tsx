"use client";

import { motion } from "framer-motion";
import { CONST } from "../lib/data";
import { useGame } from "../store/useGame";
import { MiniPotatoIcon } from "./icons";

// Patate dorée bonus : apparaît aléatoirement, 10 s pour la capturer.
export function GoldenPotato() {
  const golden = useGame((s) => s.golden);
  const lastTickAt = useGame((s) => s.lastTickAt);
  const clickGolden = useGame((s) => s.clickGolden);
  if (!golden) return null;
  const left = Math.max(0, golden.until - lastTickAt);
  const pct = left / CONST.GOLDEN_LIFETIME_MS;
  return (
    <motion.button
      key={golden.until}
      initial={{ scale: 0, rotate: -120 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      onClick={clickGolden}
      aria-label="Patate dorée : clique vite pour un gros gain !"
      className="group fixed z-30 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
      style={{ left: `${golden.x * 100}%`, top: `${golden.y * 100}%` }}
    >
      <span className="wiggle block">
        <MiniPotatoIcon golden className="h-16 w-16 drop-shadow-[0_0_14px_rgba(255,210,63,0.95)]" />
      </span>
      <span className="absolute -top-2 left-1/2 h-1.5 w-14 -translate-x-1/2 overflow-hidden rounded-full bg-[#3a2414]/50">
        <span
          className="block h-full rounded-full bg-[#ffd23f]"
          style={{ width: `${pct * 100}%`, transition: "width 0.25s linear" }}
        />
      </span>
    </motion.button>
  );
}
