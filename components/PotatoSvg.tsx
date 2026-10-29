import type { FC } from "react";

// La patate : 100 % SVG, style anime/cartoon (traits épais, gros yeux,
// joues roses). L'animation (danse, rebond) est pilotée par le parent.

interface Skin {
  from: string;
  to: string;
  outline: string;
  spot: string;
}

const SKINS: Record<string, Skin> = {
  basic: { from: "#d29a5b", to: "#b07a3e", outline: "#5a3a1c", spot: "#9c6a34" },
  super: { from: "#e8b264", to: "#cf9a4a", outline: "#6b4a20", spot: "#b57f3c" },
  golden: { from: "#ffe08a", to: "#f5b32e", outline: "#8a5f00", spot: "#d99e00" },
  cosmic: { from: "#8b5cf6", to: "#4c1d95", outline: "#2e1065", spot: "#6d3fd1" },
  transcendent: { from: "#fff7e0", to: "#ffd9a0", outline: "#c98a2e", spot: "#e8b264" },
};

export interface PotatoSvgProps {
  evolution: string;
  accessories: string[];
  className?: string;
}

function Aura() {
  return (
    <g className="glow-pulse">
      <defs>
        <radialGradient id="potato-aura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd23f" stopOpacity="0.65" />
          <stop offset="60%" stopColor="#ffe9a8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="110" cy="100" rx="110" ry="105" fill="url(#potato-aura)" />
    </g>
  );
}

function Wings() {
  const wing = (
    <g>
      <path d="M45 78 C 18 62 8 44 14 28 C 30 34 44 50 52 64 Z" fill="#ffffff" stroke="#b9c6d8" strokeWidth="3" strokeLinejoin="round" />
      <path d="M44 96 C 16 92 2 80 2 62 C 20 66 36 76 48 86 Z" fill="#f2f6fb" stroke="#b9c6d8" strokeWidth="3" strokeLinejoin="round" />
    </g>
  );
  return (
    <g>
      {wing}
      <g transform="translate(220 0) scale(-1 1)">{wing}</g>
    </g>
  );
}

function Cape() {
  return (
    <path
      d="M66 74 C 40 100 30 140 38 190 C 60 198 160 198 182 190 C 190 140 180 100 154 74 C 130 92 90 92 66 74 Z"
      fill="#e04444"
      stroke="#7c1d1d"
      strokeWidth="4"
      strokeLinejoin="round"
    />
  );
}

function Sprout() {
  return (
    <g>
      <path d="M110 34 Q 110 20 116 12" stroke="#4d8a2a" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M116 12 C 124 6 132 8 134 12 C 128 18 120 17 116 12 Z" fill="#7ec850" stroke="#3f6d1f" strokeWidth="2.5" />
      <path d="M115 16 C 106 12 100 15 99 19 C 105 23 112 21 115 16 Z" fill="#7ec850" stroke="#3f6d1f" strokeWidth="2.5" />
    </g>
  );
}

function StrawHat() {
  return (
    <g>
      <ellipse cx="110" cy="46" rx="54" ry="15" fill="#f2c14e" stroke="#8a5f00" strokeWidth="4" />
      <path d="M76 46 C 76 20 144 20 144 46 Z" fill="#f2c14e" stroke="#8a5f00" strokeWidth="4" strokeLinejoin="round" />
      <path d="M78 40 C 92 34 128 34 142 40" stroke="#e04444" strokeWidth="6" fill="none" />
    </g>
  );
}

function Sunglasses() {
  return (
    <g>
      <path d="M64 86 L 156 86" stroke="#1f2937" strokeWidth="5" strokeLinecap="round" />
      <rect x="62" y="78" width="40" height="26" rx="9" fill="#1f2937" stroke="#111827" strokeWidth="3" />
      <rect x="118" y="78" width="40" height="26" rx="9" fill="#1f2937" stroke="#111827" strokeWidth="3" />
      <path d="M70 86 L 82 86 M126 86 L 138 86" stroke="#8b98ab" strokeWidth="3.5" strokeLinecap="round" />
    </g>
  );
}

function Crown() {
  return (
    <g>
      <path
        d="M80 44 L 86 18 L 99 34 L 110 12 L 121 34 L 134 18 L 140 44 Z"
        fill="#ffd23f"
        stroke="#8a5f00"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <circle cx="93" cy="38" r="2.5" fill="#e04444" />
      <circle cx="110" cy="34" r="3" fill="#4d9fe0" />
      <circle cx="127" cy="38" r="2.5" fill="#e04444" />
    </g>
  );
}

function Halo() {
  return (
    <ellipse cx="110" cy="8" rx="30" ry="7" fill="none" stroke="#ffe9a8" strokeWidth="5" opacity="0.9" />
  );
}

function Stars({ color }: { color: string }) {
  return (
    <g fill={color}>
      <circle cx="62" cy="70" r="2.5" />
      <circle cx="158" cy="66" r="2" />
      <circle cx="148" cy="150" r="2.5" />
      <circle cx="58" cy="146" r="2" />
      <circle cx="166" cy="112" r="1.8" />
      <path d="M70 118 L72 122 L76 123 L72 125 L70 129 L68 125 L64 123 L68 122 Z" />
    </g>
  );
}

const SPARKLES: [number, number][] = [
  [66, 72],
  [152, 62],
  [150, 148],
  [60, 150],
];

function GoldSparkles() {
  return (
    <g fill="#fff" opacity="0.9">
      {SPARKLES.map(([x, y], i) => (
        <path key={i} d={`M${x} ${y - 6} L${x + 1.5} ${y - 1.5} L${x + 6} ${y} L${x + 1.5} ${y + 1.5} L${x} ${y + 6} L${x - 1.5} ${y + 1.5} L${x - 6} ${y} L${x - 1.5} ${y - 1.5} Z`} />
      ))}
    </g>
  );
}

export const PotatoSvg: FC<PotatoSvgProps> = ({ evolution, accessories, className }) => {
  const skin = SKINS[evolution] ?? SKINS.basic;
  const has = (id: string) => accessories.includes(id);
  const body = (
    <g>
      <defs>
        <linearGradient id={`potato-body-${evolution}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={skin.from} />
          <stop offset="100%" stopColor={skin.to} />
        </linearGradient>
      </defs>
      <path
        d="M110 30 C 158 26 192 58 190 100 C 188 145 152 172 108 172 C 64 172 30 144 29 100 C 28 57 62 34 110 30 Z"
        fill={`url(#potato-body-${evolution})`}
        stroke={skin.outline}
        strokeWidth="6"
        strokeLinejoin="round"
      />
      {/* taches de terre */}
      <ellipse cx="62" cy="138" rx="9" ry="5.5" fill={skin.spot} transform="rotate(-18 62 138)" />
      <ellipse cx="158" cy="62" rx="7" ry="4.5" fill={skin.spot} transform="rotate(22 158 62)" />
      <ellipse cx="150" cy="132" rx="6" ry="4" fill={skin.spot} transform="rotate(-12 150 132)" />
      {evolution === "cosmic" && <Stars color="#e9d5ff" />}
      {evolution === "golden" && <GoldSparkles />}
    </g>
  );
  const face = (
    <g>
      {/* sourcils */}
      <path d="M72 72 Q 80 66 88 71" stroke={skin.outline} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M132 71 Q 140 66 148 72" stroke={skin.outline} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      {/* gros yeux brillants */}
      <circle cx="82" cy="92" r="15" fill="#fff" stroke={skin.outline} strokeWidth="3.5" />
      <circle cx="138" cy="92" r="15" fill="#fff" stroke={skin.outline} strokeWidth="3.5" />
      <circle cx="84" cy="94" r="6.5" fill="#2b1a0e" />
      <circle cx="140" cy="94" r="6.5" fill="#2b1a0e" />
      <circle cx="81.5" cy="90.5" r="2.6" fill="#fff" />
      <circle cx="137.5" cy="90.5" r="2.6" fill="#fff" />
      {/* joues roses */}
      <ellipse cx="62" cy="112" rx="10" ry="6.5" fill="#ff9db1" opacity="0.65" />
      <ellipse cx="158" cy="112" rx="10" ry="6.5" fill="#ff9db1" opacity="0.65" />
      {/* bouche */}
      <path d="M95 118 Q 110 131 125 118" stroke={skin.outline} strokeWidth="4.5" fill="none" strokeLinecap="round" />
    </g>
  );
  return (
    <svg viewBox="0 0 220 200" className={className} role="img" aria-label="Patate animée">
      {has("aura") && <Aura />}
      {has("wings") && <Wings />}
      {has("cape") && <Cape />}
      {body}
      {face}
      {evolution === "super" && <Sprout />}
      {evolution === "transcendent" && <Halo />}
      {has("hat") && <StrawHat />}
      {has("sunglasses") && <Sunglasses />}
      {has("crown") && <Crown />}
    </svg>
  );
};
