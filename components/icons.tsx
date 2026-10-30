import type { FC } from "react";

// Icônes 100 % SVG, style cartoon : traits épais, couleurs saturées.

const S = "none";
const OUT = "#3a2414";

export function CoinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="21" fill="#ffd23f" stroke={OUT} strokeWidth="3.5" />
      <circle cx="24" cy="24" r="15" fill="#ffdf70" stroke="#d99e00" strokeWidth="2" />
      <ellipse cx="24" cy="25" rx="7" ry="8" fill="#c98a4b" stroke={OUT} strokeWidth="2.5" />
      <circle cx="21.5" cy="22" r="1.6" fill={OUT} />
      <circle cx="26.5" cy="22" r="1.6" fill={OUT} />
      <path d="M21.5 28 Q24 30 26.5 28" stroke={OUT} strokeWidth="1.8" fill={S} strokeLinecap="round" />
    </svg>
  );
}

export function SeedIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M24 6 C 36 12 40 26 34 38 C 30 45 18 45 14 38 C 8 26 12 12 24 6 Z"
        fill="#a8e063"
        stroke={OUT}
        strokeWidth="3.5"
      />
      <path d="M24 10 L24 40" stroke="#4d8a2a" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M24 18 L17 13 M24 26 L31 21 M24 34 L18 30" stroke="#4d8a2a" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function WateringCanIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect x="14" y="16" width="22" height="22" rx="5" fill="#4d9fe0" stroke={OUT} strokeWidth="3" />
      <path d="M14 22 L4 12 L10 8 L18 18 Z" fill="#4d9fe0" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
      <path d="M36 22 Q44 24 42 32 Q40 38 34 36" fill="none" stroke={OUT} strokeWidth="3" strokeLinecap="round" />
      <circle cx="14" cy="24" r="1.6" fill="#dff1ff" />
      <circle cx="24" cy="30" r="2" fill="#dff1ff" opacity="0.8" />
    </svg>
  );
}

export function ShovelIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M30 6 L36 12 L22 30 L18 24 Z" fill="#c98a4b" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
      <path d="M18 24 L8 38 C 6 42 10 44 14 42 L26 28" fill="#7a7f87" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
      <path d="M8 38 Q12 40 14 36" stroke="#4b4f55" strokeWidth="2" fill={S} />
    </svg>
  );
}

export function WormIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M8 34 Q 10 20 20 22 Q 32 25 30 34 Q 28 42 18 40 Q 10 38 8 34 Z"
        fill="#e06fae"
        stroke={OUT}
        strokeWidth="3"
      />
      <path d="M14 27 L14 33 M22 28 L22 34 M28 31 L28 36" stroke="#a8427c" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="13" cy="36" r="1.8" fill={OUT} />
      <path d="M10 40 Q 14 44 18 42" stroke={OUT} strokeWidth="2.5" fill={S} strokeLinecap="round" />
    </svg>
  );
}

export function ScarecrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect x="21" y="18" width="6" height="24" fill="#a8763e" stroke={OUT} strokeWidth="2.5" />
      <path d="M10 26 L38 26" stroke="#a8763e" strokeWidth="5" strokeLinecap="round" />
      <circle cx="24" cy="13" r="8" fill="#e8c98a" stroke={OUT} strokeWidth="3" />
      <path d="M14 10 Q 24 2 34 10 L32 6 Q 24 0 16 6 Z" fill="#d9a441" stroke={OUT} strokeWidth="2.5" />
      <circle cx="21" cy="12" r="1.6" fill={OUT} />
      <circle cx="27" cy="12" r="1.6" fill={OUT} />
      <path d="M21 16 Q 24 18 27 16" stroke={OUT} strokeWidth="1.8" fill={S} strokeLinecap="round" />
    </svg>
  );
}

export function FarmIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M8 34 L14 22 L20 34 Z" fill="#7ec850" stroke={OUT} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M18 34 L26 18 L34 34 Z" fill="#9be56a" stroke={OUT} strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="26" y="28" width="16" height="12" rx="2" fill="#d9822b" stroke={OUT} strokeWidth="2.5" />
      <path d="M26 30 L42 30" stroke={OUT} strokeWidth="1.5" />
      <ellipse cx="30" cy="37" rx="3" ry="3.6" fill="#c98a4b" stroke={OUT} strokeWidth="1.8" />
      <ellipse cx="37" cy="37" rx="3" ry="3.6" fill="#c98a4b" stroke={OUT} strokeWidth="1.8" />
    </svg>
  );
}

export function TractorIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect x="8" y="20" width="26" height="12" rx="3" fill="#e04444" stroke={OUT} strokeWidth="3" />
      <path d="M30 22 L40 22 L36 12 L28 12 Z" fill="#e04444" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="15" cy="36" r="8" fill="#4b4f55" stroke={OUT} strokeWidth="3" />
      <circle cx="15" cy="36" r="3.5" fill="#c7ccd4" stroke={OUT} strokeWidth="2" />
      <circle cx="36" cy="38" r="5.5" fill="#4b4f55" stroke={OUT} strokeWidth="3" />
      <circle cx="36" cy="38" r="2" fill="#c7ccd4" stroke={OUT} strokeWidth="1.5" />
      <rect x="26" y="15" width="5" height="4" rx="1" fill="#ffd23f" stroke={OUT} strokeWidth="1.5" />
    </svg>
  );
}

export function FryIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M10 26 L14 42 L34 42 L38 26 Z" fill="#e8c98a" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
      <rect x="14" y="10" width="5" height="18" rx="2" fill="#ffd23f" stroke={OUT} strokeWidth="2.2" />
      <rect x="21" y="7" width="5" height="21" rx="2" fill="#ffdf70" stroke={OUT} strokeWidth="2.2" />
      <rect x="28" y="10" width="5" height="18" rx="2" fill="#ffd23f" stroke={OUT} strokeWidth="2.2" />
    </svg>
  );
}

export function OgmIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M24 8 C 30 8 33 12 33 17 C 33 21 30 23 27 24 L27 40 L21 40 L21 24 C 18 23 15 21 15 17 C 15 12 18 8 24 8 Z"
        fill="#cfe8ff"
        stroke={OUT}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M20 18 L28 18 M21 22 L27 22" stroke="#4d9fe0" strokeWidth="2.2" strokeLinecap="round" />
      <ellipse cx="24" cy="12" rx="4" ry="2.5" fill="#fff" opacity="0.7" />
    </svg>
  );
}

export function PortalIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <ellipse cx="24" cy="24" rx="16" ry="19" fill="none" stroke="#8b5cf6" strokeWidth="4" />
      <ellipse cx="24" cy="24" rx="9" ry="12" fill="#3a1d8a" stroke="#c4b5fd" strokeWidth="2.5" />
      <circle cx="21" cy="20" r="2" fill="#e9d5ff" />
      <circle cx="27" cy="27" r="1.5" fill="#e9d5ff" />
    </svg>
  );
}

export function NucleusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="9" fill="#ffd23f" stroke={OUT} strokeWidth="3" />
      <ellipse cx="24" cy="24" rx="18" ry="8" fill="none" stroke="#e04444" strokeWidth="3" />
      <ellipse cx="24" cy="24" rx="18" ry="8" fill="none" stroke="#4d9fe0" strokeWidth="3" transform="rotate(60 24 24)" />
      <ellipse cx="24" cy="24" rx="18" ry="8" fill="none" stroke="#7ec850" strokeWidth="3" transform="rotate(120 24 24)" />
    </svg>
  );
}

export function GloveIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M14 24 L14 12 L20 12 L20 20 L24 20 L24 10 L30 10 L30 20 L34 20 L34 12 L40 12 L40 30 C 40 38 34 42 26 42 C 18 42 14 36 14 28 Z"
        fill="#e06fae"
        stroke={OUT}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <rect x="14" y="34" width="26" height="7" rx="3" fill="#a8427c" stroke={OUT} strokeWidth="2.5" />
    </svg>
  );
}

export function SneakersIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M8 26 Q 18 22 24 26 L 38 30 Q 42 31 42 36 L 42 38 L 8 38 Z"
        fill="#4d9fe0"
        stroke={OUT}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M12 27 L 20 24 M14 31 L 22 28" stroke="#dff1ff" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M8 34 L42 34" stroke={OUT} strokeWidth="2.5" />
    </svg>
  );
}

export function TurboIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M27 6 L13 28 L22 28 L18 42 L35 18 L25 18 Z" fill="#ffd23f" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

export function GoldHandIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M14 26 L14 14 L19 14 L19 22 M19 22 L19 10 L24 10 L24 22 M24 22 L24 12 L29 12 L29 22 M29 22 L29 15 L34 15 L34 28 C 34 36 28 40 22 40 C 15 40 13 34 13 28"
        fill="#ffd23f"
        stroke={OUT}
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ThumbIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M10 24 L16 10 L22 12 L18 24 Z" fill="#ffd23f" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
      <path d="M16 24 L34 22 C 40 22 40 34 33 36 L18 38 C 12 38 12 28 16 24 Z" fill="#ffdf70" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

export function CosmicGloveIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M14 24 L14 12 L20 12 L20 20 L24 20 L24 10 L30 10 L30 20 L34 20 L34 12 L40 12 L40 30 C 40 38 34 42 26 42 C 18 42 14 36 14 28 Z"
        fill="#8b5cf6"
        stroke={OUT}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="30" r="1.8" fill="#e9d5ff" />
      <circle cx="28" cy="34" r="1.8" fill="#e9d5ff" />
      <circle cx="24" cy="26" r="1.4" fill="#e9d5ff" />
    </svg>
  );
}

export function StormFingerIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M20 6 L28 6 L26 20 L34 20 L22 42 L24 26 L16 26 Z"
        fill="#ffd23f"
        stroke={OUT}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M8 14 Q 12 12 12 17 M38 30 Q 42 28 42 33" stroke="#8b5cf6" strokeWidth="2.5" fill={S} strokeLinecap="round" />
    </svg>
  );
}

export function DivineHandIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="10" r="5" fill="#fff" stroke="#ffd23f" strokeWidth="2.5" />
      <path
        d="M15 20 L15 14 L19 14 L19 20 M19 20 L19 13 L23 13 L23 20 M23 20 L23 14 L27 14 L27 20 M27 20 L27 15 L31 15 L31 24 C 31 34 24 38 20 36 L15 32 Z"
        fill="#ffe9b3"
        stroke={OUT}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="35" cy="12" r="1.5" fill="#ffd23f" />
      <circle cx="12" cy="12" r="1.5" fill="#ffd23f" />
    </svg>
  );
}

export function SoundOnIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M8 19 L16 19 L26 10 L26 38 L16 29 L8 29 Z" fill="#fff" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
      <path d="M32 18 Q 38 24 32 30 M36 14 Q 45 24 36 34" stroke={OUT} strokeWidth="3" fill={S} strokeLinecap="round" />
    </svg>
  );
}

export function SoundOffIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M8 19 L16 19 L26 10 L26 38 L16 29 L8 29 Z" fill="#fff" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
      <path d="M32 18 L42 30 M42 18 L32 30" stroke={OUT} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function StatsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect x="8" y="24" width="8" height="16" rx="2" fill="#7ec850" stroke={OUT} strokeWidth="3" />
      <rect x="20" y="14" width="8" height="26" rx="2" fill="#ffd23f" stroke={OUT} strokeWidth="3" />
      <rect x="32" y="6" width="8" height="34" rx="2" fill="#e04444" stroke={OUT} strokeWidth="3" />
    </svg>
  );
}

export function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M14 8 L34 8 L34 20 C 34 28 29 32 24 32 C 19 32 14 28 14 20 Z" fill="#ffd23f" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
      <path d="M14 12 L6 12 C 6 20 9 23 14 24 M34 12 L42 12 C 42 20 39 23 34 24" fill="none" stroke={OUT} strokeWidth="3" strokeLinecap="round" />
      <rect x="20" y="32" width="8" height="6" fill="#ffd23f" stroke={OUT} strokeWidth="2.5" />
      <rect x="15" y="38" width="18" height="5" rx="2" fill="#d99e00" stroke={OUT} strokeWidth="2.5" />
    </svg>
  );
}

export function GearIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M24 4 L27.5 8.5 L33 9 L36 13.5 L41 15.5 L41.5 21 L45.5 24.5 L41.5 28.5 L41 34 L36 36 L33 40.5 L27.5 41 L24 45.5 L20.5 41 L15 40.5 L12 36 L7 34 L6.5 28.5 L2.5 24.5 L6.5 21 L7 15.5 L12 13.5 L15 9 L20.5 8.5 Z"
        fill="#fff"
        stroke={OUT}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="24" r="7.5" fill="#7ec850" stroke={OUT} strokeWidth="3" />
    </svg>
  );
}

export function MusicNoteIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M19 35 L19 11 L37 7 L37 29"
        fill="none"
        stroke={OUT}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse cx="13.5" cy="35.5" rx="6.5" ry="5.5" fill="#8b5cf6" stroke={OUT} strokeWidth="3" />
      <ellipse cx="31.5" cy="31.5" rx="6.5" ry="5.5" fill="#8b5cf6" stroke={OUT} strokeWidth="3" />
    </svg>
  );
}

export function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M12 12 L36 36 M36 12 L12 36" stroke={OUT} strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

export function LockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect x="12" y="20" width="24" height="20" rx="4" fill="#c7ccd4" stroke={OUT} strokeWidth="3" />
      <path d="M17 20 L17 15 C 17 9 31 9 31 15 L31 20" fill="none" stroke={OUT} strokeWidth="3.5" />
      <circle cx="24" cy="30" r="3" fill={OUT} />
    </svg>
  );
}

export function MiniPotatoIcon({ className, golden = false }: { className?: string; golden?: boolean }) {
  const fill = golden ? "#ffd23f" : "#c98a4b";
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <ellipse cx="24" cy="25" rx="17" ry="14" fill={fill} stroke={OUT} strokeWidth="3.5" />
      <circle cx="18" cy="22" r="2.4" fill={OUT} />
      <circle cx="30" cy="22" r="2.4" fill={OUT} />
      <path d="M19 30 Q 24 34 29 30" stroke={OUT} strokeWidth="2.5" fill={S} strokeLinecap="round" />
      {golden && (
        <path d="M34 8 L36 13 L41 13 L37 16 L38 21 L34 18 L30 21 L31 16 L27 13 L32 13 Z" fill="#fff" stroke="#d99e00" strokeWidth="1.5" />
      )}
    </svg>
  );
}

const ICONS: Record<string, FC<{ className?: string }>> = {
  worm: WormIcon,
  scarecrow: ScarecrowIcon,
  farm: FarmIcon,
  tractor: TractorIcon,
  fry: FryIcon,
  ogm: OgmIcon,
  portal: PortalIcon,
  nucleus: NucleusIcon,
  glove: GloveIcon,
  sneakers: SneakersIcon,
  turbo: TurboIcon,
  goldhand: GoldHandIcon,
  thumb: ThumbIcon,
  cosmicglove: CosmicGloveIcon,
  stormfinger: StormFingerIcon,
  divinehand: DivineHandIcon,
};

export function ShopIcon({ id, className }: { id: string; className?: string }) {
  const Cmp = ICONS[id] ?? MiniPotatoIcon;
  return <Cmp className={className} />;
}
