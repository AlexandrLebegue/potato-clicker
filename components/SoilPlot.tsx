import type { FC } from "react";
import { soilById } from "../lib/game";
import { useGame } from "../store/useGame";

// Pot + carré de terre visible, couleur selon le type de sol,
// jauge de nutriments, briller d'humidité quand arrosé.

function SoilTexture({ soilId }: { soilId: string }) {
  const soil = soilById(soilId);
  if (soil.special === "volcanic") {
    return (
      <g stroke="#ffb347" strokeWidth="2.5" opacity="0.85" fill="none" strokeLinecap="round">
        <path d="M60 30 L 78 26 L 92 31" />
        <path d="M130 28 L 148 32 L 164 27" />
        <path d="M98 33 L 112 29" />
      </g>
    );
  }
  if (soil.special === "lunar") {
    return (
      <g fill={soil.darkColor} opacity="0.8">
        <circle cx="70" cy="29" r="5" />
        <circle cx="112" cy="32" r="4" />
        <circle cx="152" cy="28" r="6" />
      </g>
    );
  }
  if (soil.special === "cosmic") {
    return (
      <g fill="#e9d5ff" opacity="0.9">
        <circle cx="64" cy="30" r="2" />
        <circle cx="96" cy="27" r="1.6" />
        <circle cx="128" cy="31" r="2.2" />
        <circle cx="160" cy="28" r="1.6" />
        <circle cx="145" cy="32" r="1.2" />
      </g>
    );
  }
  return (
    <g fill={soil.darkColor} opacity="0.75">
      <ellipse cx="72" cy="30" rx="7" ry="2.6" />
      <ellipse cx="110" cy="33" rx="6" ry="2.4" />
      <ellipse cx="150" cy="29" rx="7" ry="2.6" />
    </g>
  );
}

export const SoilPlot: FC<{ soilId: string; className?: string }> = ({ soilId, className }) => {
  const soil = soilById(soilId);
  const nutrients = useGame((s) => s.nutrients);
  const waterActive = useGame((s) => s.waterUntil > Date.now());
  const pct = Math.round(nutrients * 100);
  const barColor = nutrients > 0.5 ? "#7ec850" : nutrients > 0.2 ? "#ffd23f" : "#e04444";
  return (
    <svg viewBox="0 0 260 130" className={className} aria-hidden="true">
      {/* jauge de nutriments */}
      <rect x="58" y="4" width="144" height="13" rx="6.5" fill="#3a2414" opacity="0.85" />
      <rect
        x="61"
        y="7"
        width={Math.max(2, 138 * nutrients)}
        height="7"
        rx="3.5"
        fill={barColor}
        style={{ transition: "width 0.4s linear" }}
      />
      <text x="130" y="14.5" textAnchor="middle" fontSize="9" fill="#fff" fontWeight="bold">
        {pct} %
      </text>

      {/* surface de terre */}
      <ellipse cx="130" cy="38" rx="104" ry="17" fill={soil.color} stroke="#3a2414" strokeWidth="4" />
      <SoilTexture soilId={soilId} />
      {/* humidité */}
      {waterActive && (
        <ellipse cx="130" cy="36" rx="98" ry="13" fill="#4d9fe0" opacity="0.3" className="glow-pulse" />
      )}

      {/* pot en terre cuite */}
      <path
        d="M34 52 L 226 52 L 204 122 C 200 128 60 128 56 122 Z"
        fill="#d96f32"
        stroke="#3a2414"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path d="M60 70 L 68 116 M 130 62 L 130 120 M 200 70 L 192 116" stroke="#b3521f" strokeWidth="4" strokeLinecap="round" />
      {/* rebord */}
      <rect x="26" y="46" width="208" height="20" rx="10" fill="#e07f3f" stroke="#3a2414" strokeWidth="5" />
      <rect x="34" y="51" width="192" height="6" rx="3" fill="#f5a05f" opacity="0.8" />
    </svg>
  );
};
