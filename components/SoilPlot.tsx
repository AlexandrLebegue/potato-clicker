"use client";

import type { FC } from "react";
import { soilById } from "../lib/game";
import { useGame } from "../store/useGame";

// Pot + carré de terre visible, couleur selon le type de sol,
// brille d'humidité quand arrosé. (La jauge de nutriments est en HTML,
// au-dessus du pot, pour ne jamais être masquée par la patate.)

function SoilTexture({ soilId }: { soilId: string }) {
  const soil = soilById(soilId);
  if (soil.special === "volcanic") {
    return (
      <g stroke="#ffb347" strokeWidth="2.5" opacity="0.85" fill="none" strokeLinecap="round">
        <path d="M60 26 L 78 22 L 92 27" />
        <path d="M130 24 L 148 28 L 164 23" />
        <path d="M98 29 L 112 25" />
      </g>
    );
  }
  if (soil.special === "lunar") {
    return (
      <g fill={soil.darkColor} opacity="0.8">
        <circle cx="70" cy="25" r="5" />
        <circle cx="112" cy="28" r="4" />
        <circle cx="152" cy="24" r="6" />
      </g>
    );
  }
  if (soil.special === "cosmic") {
    return (
      <g fill="#e9d5ff" opacity="0.9">
        <circle cx="64" cy="26" r="2" />
        <circle cx="96" cy="23" r="1.6" />
        <circle cx="128" cy="27" r="2.2" />
        <circle cx="160" cy="24" r="1.6" />
        <circle cx="145" cy="28" r="1.2" />
      </g>
    );
  }
  return (
    <g fill={soil.darkColor} opacity="0.75">
      <ellipse cx="72" cy="26" rx="7" ry="2.6" />
      <ellipse cx="110" cy="29" rx="6" ry="2.4" />
      <ellipse cx="150" cy="25" rx="7" ry="2.6" />
    </g>
  );
}

export const SoilPlot: FC<{ soilId: string; className?: string }> = ({ soilId, className }) => {
  const soil = soilById(soilId);
  const waterActive = useGame((s) => s.waterUntil > s.lastTickAt);
  return (
    <svg viewBox="0 0 260 130" className={className} aria-hidden="true">
      {/* surface de terre (visible sous la patate) */}
      <ellipse cx="130" cy="34" rx="104" ry="18" fill={soil.color} stroke="#3a2414" strokeWidth="4" />
      <SoilTexture soilId={soilId} />
      {/* humidité */}
      {waterActive && (
        <ellipse cx="130" cy="32" rx="98" ry="14" fill="#4d9fe0" opacity="0.3" className="glow-pulse" />
      )}
      {/* rebord du pot */}
      <rect x="26" y="44" width="208" height="20" rx="10" fill="#e07f3f" stroke="#3a2414" strokeWidth="5" />
      <rect x="34" y="49" width="192" height="6" rx="3" fill="#f5a05f" opacity="0.8" />
      {/* pot en terre cuite */}
      <path
        d="M34 58 L 226 58 L 204 122 C 200 128 60 128 56 122 Z"
        fill="#d96f32"
        stroke="#3a2414"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path d="M60 76 L 68 116 M 130 68 L 130 120 M 200 76 L 192 116" stroke="#b3521f" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
};

// Jauge de nutriments en HTML (toujours lisible, jamais derrière la patate).
export function NutrientGauge() {
  const nutrients = useGame((s) => s.nutrients);
  const pct = Math.round(nutrients * 100);
  const barColor = nutrients > 0.5 ? "#7ec850" : nutrients > 0.2 ? "#ffd23f" : "#e04444";
  return (
    <div
      className="z-20 mt-1 flex items-center gap-1.5 rounded-full border-2 border-[#3a2414]/70 bg-[#fff8e8]/90 px-2 py-0.5"
      role="progressbar"
      aria-label="Nutriments"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
    >
      <div className="h-2.5 w-24 overflow-hidden rounded-full bg-[#3a2414]/25 sm:w-28">
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.max(2, nutrients * 100)}%`,
            background: barColor,
            transition: "width 0.4s linear",
          }}
        />
      </div>
      <span className="text-[10px] font-black text-[#3a2414] tabular-nums">{pct} %</span>
    </div>
  );
}
