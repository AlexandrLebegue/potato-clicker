"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGame, type Toast } from "../store/useGame";
import { TrophyIcon } from "./icons";

function ToastItem({ toast }: { toast: Toast }) {
  const dismissToast = useGame((s) => s.dismissToast);
  useEffect(() => {
    const t = setTimeout(() => dismissToast(toast.id), 4200);
    return () => clearTimeout(t);
  }, [toast.id, dismissToast]);
  return (
    <motion.button
      layout
      initial={{ x: -120, opacity: 0, scale: 0.8 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: -120, opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      onClick={() => dismissToast(toast.id)}
      aria-label={`Fermer le succès : ${toast.title}`}
      className="pop-in pointer-events-auto flex w-64 items-center gap-2.5 rounded-2xl border-4 border-[#8a5f00] bg-[#fff8e8] p-2.5 text-left shadow-lg"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#8a5f00] bg-[#ffd23f]">
        <TrophyIcon className="h-6 w-6" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-black text-[#3a2414]">{toast.title}</span>
        <span className="block truncate text-xs font-semibold text-[#8a6d3b]">{toast.desc}</span>
      </span>
    </motion.button>
  );
}

export function Toasts() {
  const toasts = useGame((s) => s.toasts);
  return (
    <div
      className="pointer-events-none fixed left-3 top-16 z-40 flex flex-col gap-2"
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </AnimatePresence>
    </div>
  );
}
