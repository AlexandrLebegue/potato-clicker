"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { CloseIcon } from "./icons";

export function Modal({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="absolute inset-0 bg-[#1a1208]/65" onClick={onClose} aria-hidden="true" />
      <motion.div
        initial={{ scale: 0.85, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className={`relative max-h-[88vh] w-full overflow-y-auto overscroll-contain rounded-3xl border-4 border-[#3a2414] bg-[#fff8e8] p-5 shadow-2xl ${
          wide ? "max-w-lg" : "max-w-md"
        }`}
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-xl font-black text-[#3a2414]">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="cartoon-border rounded-xl bg-white p-1.5"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}
