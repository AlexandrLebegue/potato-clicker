// Formatage des nombres grands (1.2K, 3.4M, 5.6B, puis aa, ab, ...)
// et des durées. Fonctions pures, sans dépendance navigateur.

const SUFFIXES = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"];

function suffixForTier(tier: number): string {
  if (tier < SUFFIXES.length) return SUFFIXES[tier];
  // Au-delà de Dc (10^33) : on continue aa, ab, ac, ...
  const extra = tier - SUFFIXES.length;
  const a = String.fromCharCode(97 + Math.floor(extra / 26));
  const b = String.fromCharCode(97 + (extra % 26));
  return a + b;
}

function trimZeros(s: string): string {
  if (!s.includes(".")) return s;
  return s.replace(/0+$/, "").replace(/\.$/, "");
}

/**
 * Formate un nombre avec des suffixes courts.
 * 999 -> "999", 1500 -> "1.5K", 2400000 -> "2.4M", 1e33 -> "1Dc", 1e36 -> "1aa"
 */
export function formatNumber(n: number): string {
  if (Number.isNaN(n) || n === Infinity) return "∞";
  const neg = n < 0;
  const v = Math.abs(n);
  if (v < 1000) {
    const s = Number.isInteger(v) ? String(v) : trimZeros(v.toFixed(2));
    return neg ? `-${s}` : s;
  }
  let tier = Math.floor(Math.log10(v) / 3);
  let val = v / 10 ** (3 * tier);
  // Arrondi frontal : 999.6K -> 1M
  if (val >= 999.5) {
    tier += 1;
    val = v / 10 ** (3 * tier);
  }
  const s =
    val < 10
      ? trimZeros(val.toFixed(2))
      : val < 100
        ? trimZeros(val.toFixed(1))
        : val.toFixed(0);
  return `${neg ? "-" : ""}${s}${suffixForTier(tier)}`;
}

/** Formate une durée en ms : "2j 3h", "4h 12m", "5m 09s", "42s" */
export function formatTime(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (d > 0) return `${d}j ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${String(s).padStart(2, "0")}s`;
  return `${s}s`;
}

/** Formatage court pour les compteurs (toujours au moins 1 décimale si < 1000) */
export function formatCps(n: number): string {
  if (n === 0) return "0";
  if (n < 1000) return trimZeros(n.toFixed(1));
  return formatNumber(n);
}
